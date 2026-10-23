// Form backend + admin dashboard for lagniconsulting.ca.
//   POST /api/form        public: stores a submission (+ CV) in SQLite on DATA_DIR
//   /admin/*              password-protected inbox: list, CV download, handled, delete, CSV
//   /admin/contenu/*      the client edits site content; publishing commits to GitHub
// Optional: set SMTP_HOST (and friends) to also get an email notification per submission.
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { createPublisher } from './publisher.mjs';
import {
  initContent, getDraft, saveDraft, publishDrafts,
  settingsFromForm, validateSettings, settingsPage, SETTINGS_PATH,
} from './content.mjs';
import { layout, esc, fmtDate, icon, badge, notice, field, emptyState, flashFor } from './ui.mjs';

const SITE = process.env.SITE_URL ?? 'https://lagniconsulting.ca';
const DATA_DIR = process.env.DATA_DIR ?? './data';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '';
const ADMIN_OK = ADMIN_PASSWORD.length >= 12;

/** nginx proxies to 3000; overridable so the test suite can use a free port. */
const PORT = Number(process.env.PORT ?? 3000); // shorter = admin disabled, forms still work

fs.mkdirSync(path.join(DATA_DIR, 'uploads'), { recursive: true });
const db = new DatabaseSync(path.join(DATA_DIR, 'forms.db'));
db.exec(`CREATE TABLE IF NOT EXISTS submissions(
  id INTEGER PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  form_name TEXT, locale TEXT, who TEXT, email TEXT,
  fields TEXT NOT NULL,
  file_name TEXT, file_id TEXT,
  handled INTEGER NOT NULL DEFAULT 0)`);
initContent(db);

/** Without GITHUB_TOKEN this is a dry-run publisher: screens work, nothing ships. */
const publisher = createPublisher({
  token: process.env.GITHUB_TOKEN,
  owner: process.env.GITHUB_OWNER,
  repo: process.env.GITHUB_REPO,
  branch: process.env.GITHUB_BRANCH ?? 'main',
});

const MAX_BODY = 6 * 1024 * 1024; // 5 MB file + fields
const MAX_FILE = 5 * 1024 * 1024;
const FILE_EXT = /\.(pdf|docx?)$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const THANKS = { fr: '/merci/', en: '/en/thank-you/' };
const SKIP = new Set(['website', 'started_at', 'consent']);

// ponytail: in-memory per-IP limits, reset on restart; move to Redis if spam gets organised.
const buckets = new Map();
function limited(kind, ip, max, windowMs) {
  const key = `${kind}:${ip}`;
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.set(key, recent);
  return recent.length > max;
}
const clientIp = (req) => String(req.headers['x-forwarded-for'] ?? req.socket.remoteAddress).split(',')[0].trim();

// ---------------------------------------------------------------- public form
async function handleForm(req) {
  const len = Number(req.headers['content-length'] ?? 0);
  if (!len || len > MAX_BODY) return [413, 'Payload too large'];
  const ip = clientIp(req);
  if (limited('form', ip, 5, 10 * 60_000)) return [429, 'Too many requests'];

  const form = await new Request('http://local', {
    method: 'POST', headers: { 'content-type': req.headers['content-type'] ?? '' }, body: req, duplex: 'half',
  }).formData();

  const thanks = THANKS[form.get('locale')] ?? THANKS.fr;
  // Spam guards mirror src/scripts/form.ts: pretend success, store nothing.
  const started = Number(form.get('started_at'));
  if (form.get('website') || (started && Date.now() - started < 3000)) return [200, 'ok', thanks];
  if (!form.get('consent')) return [400, 'Consent required'];

  const fields = [];
  let file = null;
  for (const [k, v] of form) {
    if (SKIP.has(k)) continue;
    if (typeof v === 'string') { if (v.trim()) fields.push([k, v.trim().slice(0, 5000)]); continue; }
    if (!v.size) continue;
    if (!FILE_EXT.test(v.name) || v.size > MAX_FILE) return [400, 'Invalid file'];
    file = { name: v.name.slice(0, 120), id: crypto.randomUUID(), buf: Buffer.from(await v.arrayBuffer()) };
  }
  if (!fields.length) return [400, 'Empty form'];

  const get = (k) => fields.find(([n]) => n === k)?.[1] ?? '';
  const email = get('email');
  const who = [get('first_name'), get('last_name')].filter(Boolean).join(' ') || get('name') || email;
  if (file) fs.writeFileSync(path.join(DATA_DIR, 'uploads', file.id), file.buf);
  db.prepare(`INSERT INTO submissions(form_name, locale, who, email, fields, file_name, file_id)
              VALUES (?,?,?,?,?,?,?)`)
    .run(get('form_name'), get('locale'), who, EMAIL.test(email) ? email : '', JSON.stringify(fields), file?.name ?? null, file?.id ?? null);

  notify({ fields, who, email, ip, file }).catch((e) => console.error('notify failed:', e.message));
  return [200, 'ok', thanks];
}

// Best-effort email; never blocks or fails a submission (it is already saved).
async function notify({ fields, who, email, ip, file }) {
  if (!process.env.SMTP_HOST) return;
  const { default: nodemailer } = await import('nodemailer');
  const port = Number(process.env.SMTP_PORT ?? 587);
  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port, secure: port === 465, connectionTimeout: 8000,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  const form = fields.find(([k]) => k === 'form_name')?.[1] ?? 'Formulaire';
  await t.sendMail({
    from: process.env.MAIL_FROM, to: process.env.MAIL_TO,
    replyTo: EMAIL.test(email) ? email : undefined,
    subject: `[Site] ${form} — ${who}`.replace(/[\r\n]+/g, ' ').slice(0, 200),
    text: `${fields.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n— ${SITE}/admin/ (${ip})`,
    attachments: file ? [{ filename: file.name, content: file.buf }] : [],
  });
}

// ---------------------------------------------------------------------- admin
const sha = (s) => crypto.createHash('sha256').update(s).digest();
const sign = (msg) => crypto.createHmac('sha256', ADMIN_PASSWORD).update(msg).digest('hex');
const SESSION_S = 12 * 3600;

function loggedIn(req) {
  const m = /(?:^|;\s*)lagni_admin=(\d+)\.([0-9a-f]{64})/.exec(req.headers.cookie ?? '');
  if (!m || Number(m[1]) < Date.now() / 1000) return false;
  return crypto.timingSafeEqual(Buffer.from(m[2]), Buffer.from(sign(m[1])));
}
const cookie = (req, value, maxAge) =>
  `lagni_admin=${value}; HttpOnly; SameSite=Strict; Path=/admin; Max-Age=${maxAge}` +
  (req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : '');

const FORM_LABEL = {
  contact: 'Contact',
  'institution-partnership': 'Établissement',
  'recruitment-candidate': 'Candidat',
  'recruitment-employer': 'Employeur',
};

const FIELD_LABEL = {
  first_name: 'Prénom', last_name: 'Nom', name: 'Nom', email: 'Courriel', phone: 'Téléphone', message: 'Message',
  inquiry_type: 'Type de demande', need_type: 'Besoin', organisation: 'Organisation', organisation_erp: 'Organisation',
  organisation_rec: 'Organisation', institution: 'Établissement', school: 'École', programme: 'Programme',
  student_count: "Nombre d'étudiants", group_size: 'Taille du groupe', desired_training: 'Formation souhaitée',
  solution: 'Solution', domain: 'Domaine', role: 'Fonction', role_sought: 'Poste recherché', contract_type: 'Type de contrat',
  period: 'Période', country: 'Pays', location: 'Lieu', profile: 'Profil', expertise_area: "Domaine d'expertise",
  years_experience: "Années d'expérience",
};

const loginPage = (msg = '') =>
  layout({
    title: 'Connexion — Lagni Consulting',
    h1: 'Connexion',
    bare: true,
    lead: 'Demandes reçues et contenu du site.',
    body: `<form class="login" method="post" action="/admin/login">
${msg ? notice({ tone: 'danger', body: `<p role="alert">${esc(msg)}</p>` }) : ''}
${field({ name: 'password', label: 'Mot de passe', type: 'password', attrs: 'autocomplete="current-password" autofocus' })}
<button class="btn btn--primary btn--lg" type="submit">Se connecter</button>
</form>`,
  });

/** The shell renders the <h1>; the login screen carries its own inside the card. */
const simplePage = (title, heading, bodyHtml, bare = true) =>
  layout({ title, h1: heading, bare, body: bodyHtml });

function listPage(url) {
  const only = url.searchParams.get('form') ?? '';
  const unhandledOnly = url.searchParams.has('new');

  const where = unhandledOnly ? 'WHERE handled = 0' : only ? 'WHERE form_name = ?' : '';
  // ponytail: newest 300 only, no pagination; add paging if the inbox outgrows it.
  const rows = db
    .prepare(`SELECT * FROM submissions ${where} ORDER BY id DESC LIMIT 300`)
    .all(...(where && !unhandledOnly ? [only] : []));

  const total = db.prepare('SELECT COUNT(*) n FROM submissions').get().n;
  const pending = db.prepare('SELECT COUNT(*) n FROM submissions WHERE handled = 0').get().n;
  const perForm = Object.fromEntries(
    db.prepare('SELECT form_name, COUNT(*) n FROM submissions GROUP BY form_name').all().map((r) => [r.form_name, r.n]),
  );

  const tab = (href, label, count, active) =>
    `<a href="${href}"${active ? ' aria-current="page"' : ''}>${esc(label)}<span class="n">${count}</span></a>`;

  const filters = `<nav class="filters" aria-label="Filtrer les demandes">
${tab('/admin/', 'Toutes', total, !only && !unhandledOnly)}
${tab('/admin/?new', 'Non traitées', pending, unhandledOnly)}
${Object.entries(FORM_LABEL)
  .map(([v, l]) => tab(`/admin/?form=${v}`, l, perForm[v] ?? 0, only === v && !unhandledOnly))
  .join('')}
</nav>`;

  const cards = rows
    .map((r) => {
      const fields = JSON.parse(r.fields).filter(([k]) => !['form_name', 'locale'].includes(k));
      return `<details class="card ${r.handled ? 'card--done' : 'card--new'}">
<summary>
  <h2 class="card__name">${esc(r.who || '(sans nom)')}</h2>
  <span class="card__meta">
    ${badge('plain', `${FORM_LABEL[r.form_name] ?? r.form_name} · ${r.locale}`)}
    <span>${esc(fmtDate(r.created_at))}</span>
    ${r.handled ? badge('done', 'Traité') : badge('new', 'Nouveau')}
  </span>
  <span class="card__chev">${icon('chevron', 18)}</span>
</summary>
<div class="card__body">
  <dl>${fields.map(([k, v]) => `<dt>${esc(FIELD_LABEL[k] ?? k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
  <div class="card__actions">
    ${r.email ? `<a class="btn btn--primary" href="mailto:${esc(r.email)}">${icon('mail', 17)} Répondre</a>` : ''}
    ${r.file_id ? `<a class="btn btn--outline" href="/admin/file/${r.id}">${icon('download', 17)} CV — ${esc(r.file_name)}</a>` : ''}
    <form method="post" action="/admin/handled/${r.id}">
      <button class="btn btn--outline" type="submit">${icon('check', 17)} ${r.handled ? 'Remettre en nouveau' : 'Marquer comme traité'}</button>
    </form>
    <details class="confirm">
      <summary>${icon('trash', 17)} Supprimer</summary>
      <div class="confirm__box">
        <p>Cette demande${r.file_id ? ' et son CV' : ''} seront effacés définitivement.</p>
        <form method="post" action="/admin/delete/${r.id}">
          <button class="btn btn--danger" type="submit">Confirmer la suppression</button>
        </form>
      </div>
    </details>
  </div>
</div></details>`;
    })
    .join('');

  const empty = emptyState({
    title: total === 0 ? 'Aucune demande pour le moment' : 'Rien dans ce filtre',
    body:
      total === 0
        ? 'Les messages envoyés depuis les formulaires du site apparaîtront ici, avec les CV joints.'
        : 'Aucune demande ne correspond. Choisissez un autre filtre ci-dessus.',
  });

  return layout({
    title: 'Demandes — Lagni Consulting',
    h1: 'Demandes reçues',
    current: '/admin/',
    flash: flashFor(url),
    aside: `<a class="btn btn--outline" href="/admin/export.csv">${icon('download', 17)} Exporter en CSV</a>`,
    lead:
      pending > 0
        ? `<strong>${pending}</strong> demande${pending > 1 ? 's' : ''} en attente sur ${total}.`
        : total > 0
          ? `Les ${total} demande${total > 1 ? 's sont traitées' : ' est traitée'}.`
          : '',
    body: `${filters}${cards ? `<div class="stack">${cards}</div>` : empty}`,
  });
}

// Spreadsheet formula injection: prefix cells that start with = + - @ or tab/CR.
const csvCell = (s) => `"${(/^[=+\-@\t\r]/.test(String(s)) ? "'" : '') + String(s ?? '').replace(/"/g, '""')}"`;
function csv() {
  const rows = db.prepare('SELECT * FROM submissions ORDER BY id DESC').all();
  const lines = [['id', 'date_utc', 'formulaire', 'langue', 'nom', 'courriel', 'traite', 'cv', 'details']];
  for (const r of rows) lines.push([r.id, r.created_at, r.form_name, r.locale, r.who, r.email, r.handled ? 'oui' : 'non', r.file_name ?? '', JSON.parse(r.fields).map(([k, v]) => `${k}: ${v}`).join(' | ')]);
  return `﻿${lines.map((l) => l.map(csvCell).join(',')).join('\r\n')}`;
}

async function readSmallBody(req) {
  let n = 0; const chunks = [];
  for await (const c of req) { n += c.length; if (n > 4096) throw new Error('too big'); chunks.push(c); }
  return new URLSearchParams(Buffer.concat(chunks).toString());
}

async function handleAdmin(req, res, url) {
  const send = (status, body, extra = {}) => res.writeHead(status, {
    'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow',
    'x-frame-options': 'DENY', 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer',
    'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
    ...extra,
  }).end(body);
  const redirect = (to, extra = {}) => send(303, '', { location: to, ...extra });

  if (!ADMIN_OK)
    return send(
      503,
      simplePage(
        'Indisponible — Lagni Consulting',
        'Tableau de bord non configuré',
        notice({
          tone: 'warning',
          title: 'Il manque le mot de passe d’administration',
          body:
            '<p>Posez <code>ADMIN_PASSWORD</code> (douze caractères minimum) en variable ' +
            'd’environnement, puis redémarrez le service.</p>' +
            '<p>Les formulaires publics du site, eux, continuent d’enregistrer normalement : ' +
            'aucune demande n’est perdue pendant ce temps.</p>',
        }),
      ),
    );
  const p = url.pathname.replace(/\/+$/, '') || '/';
  const ip = clientIp(req);

  if (p === '/admin/login' && req.method === 'POST') {
    if (limited('login', ip, 10, 10 * 60_000)) return send(429, loginPage('Trop de tentatives. Réessayez dans quelques minutes.'));
    const given = (await readSmallBody(req)).get('password') ?? '';
    if (!crypto.timingSafeEqual(sha(given), sha(ADMIN_PASSWORD))) return send(401, loginPage('Mot de passe incorrect.'));
    const exp = Math.floor(Date.now() / 1000) + SESSION_S;
    return redirect('/admin/', { 'set-cookie': cookie(req, `${exp}.${sign(String(exp))}`, SESSION_S) });
  }
  if (!loggedIn(req)) return send(req.method === 'GET' && p === '/admin' ? 200 : 401, loginPage());

  if (req.method === 'GET') {
    if (p === '/admin') return send(200, listPage(url));
    if (p === '/admin/export.csv')
      return send(200, csv(), { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="demandes-lagni.csv"' });
    const f = /^\/admin\/file\/(\d+)$/.exec(p);
    if (f) {
      const r = db.prepare('SELECT file_id, file_name FROM submissions WHERE id = ?').get(Number(f[1]));
      if (!r?.file_id || !fs.existsSync(path.join(DATA_DIR, 'uploads', r.file_id)))
        return send(
          404,
          simplePage(
            'Fichier introuvable — Lagni Consulting',
            'Fichier introuvable',
            notice({
              tone: 'warning',
              body:
                '<p>Ce document n’est plus sur le serveur. Il a sans doute été supprimé ' +
                'avec sa demande.</p><p><a href="/admin/">Retour aux demandes</a></p>',
            }),
            false,
          ),
        );
      res.writeHead(200, {
        'content-type': 'application/octet-stream', 'x-content-type-options': 'nosniff', 'cache-control': 'no-store',
        'content-disposition': `attachment; filename="${r.file_name.replace(/[^\w.\- ]/g, '_')}"`,
      });
      return fs.createReadStream(path.join(DATA_DIR, 'uploads', r.file_id)).pipe(res);
    }
  }
  if (req.method === 'POST') {
    if (p === '/admin/logout') return redirect('/admin/', { 'set-cookie': cookie(req, '', 0) });
    const m = /^\/admin\/(handled|delete)\/(\d+)$/.exec(p);
    if (m) {
      const id = Number(m[2]);
      let done;
      if (m[1] === 'handled') {
        const before = db.prepare('SELECT handled FROM submissions WHERE id = ?').get(id);
        db.prepare('UPDATE submissions SET handled = 1 - handled WHERE id = ?').run(id);
        done = before?.handled ? 'unhandled' : 'handled';
      } else {
        const r = db.prepare('SELECT file_id FROM submissions WHERE id = ?').get(id);
        if (r?.file_id) fs.rmSync(path.join(DATA_DIR, 'uploads', r.file_id), { force: true });
        db.prepare('DELETE FROM submissions WHERE id = ?').run(id);
        done = 'deleted';
      }
      return redirect(`/admin/?done=${done}`);
    }
  }
  if (p === '/admin/contenu' || p === '/admin/contenu/chiffres') {
    const pending = db.prepare('SELECT COUNT(*) n FROM content_drafts').get().n;
    const draft = getDraft(db, 'settings', 'site');

    if (req.method === 'GET') {
      // The published file is the starting point; the draft wins if there is one.
      let published = null;
      try {
        published = await publisher.readFile(SETTINGS_PATH);
      } catch {
        published = null; // network trouble must not lock the client out of the screen
      }
      const data = draft?.data ?? (published ? JSON.parse(published.content) : { figures: {}, contact: {} });
      const sha = url.searchParams.get('published');
      return send(200, settingsPage({
        data, dryRun: publisher.dryRun, unreadable: !published, pending,
        saved: url.searchParams.get('done') === 'saved',
        publishedSha: sha,
      }));
    }

    if (req.method === 'POST') {
      const body = await readSmallBody(req);
      const data = settingsFromForm(body);
      const errors = validateSettings(data);
      if (Object.keys(errors).length)
        return send(422, settingsPage({
          data, dryRun: publisher.dryRun, unreadable: false, errors, pending,
        }));

      // The sha read now is the lock: publishing refuses if the branch moved.
      let baseSha = draft?.baseSha ?? null;
      if (!baseSha) { try { baseSha = await publisher.head(); } catch { baseSha = null; } }
      saveDraft(db, 'settings', 'site', data, baseSha);

      if (body.get('action') !== 'publish') return redirect('/admin/contenu/?done=saved');
      try {
        const out = await publishDrafts(db, publisher);
        return redirect(`/admin/contenu/?published=${encodeURIComponent(out.sha ?? '')}`);
      } catch (err) {
        // A publish failure is not a field problem: show it as a notice and
        // keep the drafts exactly where they were.
        return send(err.conflict ? 409 : 502, settingsPage({
          data, dryRun: publisher.dryRun, unreadable: false,
          publishError: err.message, pending: pending || 1,
        }));
      }
    }
  }

  return send(
    404,
    simplePage(
      'Page introuvable — Lagni Consulting',
      'Page introuvable',
      notice({
        tone: 'info',
        body: '<p>Cette adresse n’existe pas dans le tableau de bord.</p>' +
          '<p><a href="/admin/">Retour aux demandes</a></p>',
      }),
      false,
    ),
  );
}

// --------------------------------------------------------------------- server
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://local');
  try {
    if (url.pathname === '/health') return res.end('ok');
    if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) return await handleAdmin(req, res, url);
    if (req.method !== 'POST') { res.writeHead(405).end(); return; }
    let status, msg, thanks;
    try { [status, msg, thanks] = await handleForm(req); }
    catch (err) { console.error(err); [status, msg] = [500, 'Save failed']; }
    const wantsJson = String(req.headers.accept).includes('application/json');
    // No-JS visitors get a normal redirect to the thank-you page.
    if (status === 200 && !wantsJson) { res.writeHead(303, { Location: `${SITE}${thanks}` }).end(); return; }
    res.writeHead(status, { 'content-type': 'application/json' }).end(JSON.stringify({ ok: status === 200, msg }));
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.writeHead(500).end('error');
  }
}).listen(PORT, () => console.log(`form-service on :${PORT} (admin ${ADMIN_OK ? 'on' : 'OFF: set ADMIN_PASSWORD >= 12 chars'})`));
