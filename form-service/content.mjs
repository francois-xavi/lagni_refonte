// Content editing screens for /admin/contenu/.
//
// Git is the source of truth; SQLite only holds drafts that have not been
// published yet. That is what keeps the site build reproducible and lets the
// dashboard be switched off without breaking deployment.
//
//   opening a screen  → read the published file from GitHub (+ head sha)
//   « Enregistrer »   → draft row in SQLite, on the /data volume
//   « Publier »       → validate, one commit, Dokploy rebuilds
//
// The head sha read when the screen opened travels with the draft and is
// handed to the publisher, which refuses a stale write instead of silently
// overwriting someone else's change.

import { commitMessage, PublishError } from './publisher.mjs';

export const SETTINGS_PATH = 'src/content/settings/site.json';

/** Mirrors the Zod schema in src/lib/settings.ts — keep the two in step. */
const FIGURES = [
  ['hours', 'Heures de formation'],
  ['sessions', 'Nombre de séances'],
  ['sessionHours', 'Durée d’une séance (heures)'],
  ['supportMonths', 'Accompagnement (mois)'],
  ['maxParticipants', 'Participants maximum'],
];
const CONTACTS = [
  ['email', 'Courriel', 'email'],
  ['phone', 'Téléphone', 'text'],
  ['phoneDisplay', 'Téléphone affiché', 'text'],
  ['locality', 'Localité', 'text'],
  ['linkedin', 'LinkedIn', 'url'],
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function initContent(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS content_drafts(
  id INTEGER PRIMARY KEY,
  collection TEXT NOT NULL,
  key TEXT NOT NULL,
  payload TEXT NOT NULL,
  base_sha TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(collection, key))`);
  db.exec(`CREATE TABLE IF NOT EXISTS content_publications(
  id INTEGER PRIMARY KEY,
  at TEXT NOT NULL DEFAULT (datetime('now')),
  commit_sha TEXT,
  files INTEGER,
  ok INTEGER NOT NULL,
  detail TEXT)`);
}

/**
 * Validates the settings payload the same way the site's Zod schema does, so a
 * value that would break the build is refused here first, with a readable
 * message instead of a failed deployment.
 */
export function validateSettings(data) {
  const errors = [];
  for (const [key, label] of FIGURES) {
    const n = Number(data.figures?.[key]);
    if (!Number.isInteger(n) || n <= 0) errors.push(`${label} : un nombre entier supérieur à zéro.`);
  }
  for (const [key, label, type] of CONTACTS) {
    const v = String(data.contact?.[key] ?? '').trim();
    if (!v) errors.push(`${label} : obligatoire.`);
    else if (type === 'email' && !EMAIL.test(v)) errors.push(`${label} : adresse invalide.`);
    else if (type === 'url' && !/^https?:\/\/\S+$/.test(v)) errors.push(`${label} : URL invalide.`);
  }
  return errors;
}

/** Shapes the form body into the exact JSON the repository holds. */
export function settingsFromForm(body) {
  const figures = {};
  for (const [key] of FIGURES) figures[key] = Number(body.get(`figures.${key}`));
  const contact = {};
  for (const [key] of CONTACTS) contact[key] = String(body.get(`contact.${key}`) ?? '').trim();
  return { figures, contact };
}

export const serialise = (data) => JSON.stringify(data, null, 2) + '\n';

export function getDraft(db, collection, key) {
  const row = db
    .prepare('SELECT payload, base_sha FROM content_drafts WHERE collection = ? AND key = ?')
    .get(collection, key);
  return row ? { data: JSON.parse(row.payload), baseSha: row.base_sha } : null;
}

export function saveDraft(db, collection, key, data, baseSha) {
  db.prepare(
    `INSERT INTO content_drafts(collection, key, payload, base_sha, updated_at)
     VALUES(?, ?, ?, ?, datetime('now'))
     ON CONFLICT(collection, key) DO UPDATE SET
       payload = excluded.payload, base_sha = excluded.base_sha, updated_at = datetime('now')`,
  ).run(collection, key, JSON.stringify(data), baseSha ?? null);
}

const PATHS = { settings: () => SETTINGS_PATH };
const LABELS = { settings: () => 'chiffres et coordonnées' };

/**
 * Publishes every pending draft in one commit. Drafts are only cleared once
 * GitHub has accepted the write, so a failure anywhere leaves the client's work
 * exactly where it was.
 */
export async function publishDrafts(db, publisher) {
  const rows = db.prepare('SELECT * FROM content_drafts ORDER BY collection, key').all();
  if (!rows.length) throw new PublishError('Aucune modification à publier.');

  const files = [];
  const parts = [];
  let baseSha = null;
  for (const row of rows) {
    const build = PATHS[row.collection];
    if (!build) throw new PublishError(`Collection inconnue : ${row.collection}`);
    files.push({ path: build(row.key), content: serialise(JSON.parse(row.payload)) });
    parts.push(LABELS[row.collection](row.key));
    baseSha = baseSha ?? row.base_sha;
  }

  try {
    const out = await publisher.publish({ files, message: commitMessage(parts), baseSha });
    db.prepare('DELETE FROM content_drafts').run();
    db.prepare('INSERT INTO content_publications(commit_sha, files, ok) VALUES(?, ?, 1)').run(
      out.sha,
      out.files,
    );
    return out;
  } catch (err) {
    db.prepare('INSERT INTO content_publications(commit_sha, files, ok, detail) VALUES(NULL, ?, 0, ?)').run(
      files.length,
      String(err.message).slice(0, 500),
    );
    throw err;
  }
}

// ------------------------------------------------------------------- rendering

const field = (name, label, type, value) =>
  `<p><label for="${name}">${label}</label><br>
   <input id="${name}" name="${name}" type="${type}" value="${esc(value)}" required
   ${type === 'number' ? 'min="1" step="1" inputmode="numeric"' : ''}></p>`;

const esc = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

export function settingsPage({ data, dryRun, unreadable, errors = [], saved = false, pending = 0, publishedSha = null }) {
  const warn = unreadable
    ? `<p class="warn" role="status"><b>Mode à blanc.</b> Le contenu publié n’est pas lisible
       sans la clé de déploiement : les champs ci-dessous montrent votre brouillon, pas l’état du site.</p>`
    : '';
  const errs = errors.length
    ? `<div class="err" role="alert"><p>Rien n’a été enregistré :</p><ul>${errors
        .map((e) => `<li>${esc(e)}</li>`)
        .join('')}</ul></div>`
    : '';
  const ok = publishedSha
    ? `<p class="ok" role="status">Publié. Commit <code>${esc(publishedSha.slice(0, 7))}</code> — le site se reconstruit.</p>`
    : saved
      ? '<p class="ok" role="status">Brouillon enregistré.</p>'
      : '';

  return `<main>
<nav><a href="/admin/">Demandes</a><a href="/admin/contenu/" aria-current="page">Contenu</a></nav>
<h2>Chiffres et coordonnées</h2>
<p class="tag">Ces cinq nombres alimentent les 44 endroits du site qui les mentionnent, en français
comme en anglais. Saisissez le nombre seul : la phrase garde sa propre grammaire.</p>
${warn}${errs}${ok}
<form method="post" action="/admin/contenu/chiffres">
  <fieldset><legend>Chiffres</legend>
  ${FIGURES.map(([k, l]) => field(`figures.${k}`, l, 'number', data.figures?.[k] ?? '')).join('')}
  </fieldset>
  <fieldset><legend>Coordonnées</legend>
  ${CONTACTS.map(([k, l, t]) => field(`contact.${k}`, l, t, data.contact?.[k] ?? '')).join('')}
  </fieldset>
  <div class="row">
    <button class="btn" type="submit" name="action" value="save">Enregistrer le brouillon</button>
    <button class="btn ghost" type="submit" name="action" value="publish"
      ${pending ? '' : 'disabled'}>Publier${dryRun ? ' (à blanc)' : ''}</button>
  </div>
</form>
<p class="tag">${
    pending
      ? `${pending} modification${pending > 1 ? 's' : ''} en attente de publication.`
      : 'Aucune modification en attente.'
  }</p>
</main>`;
}
