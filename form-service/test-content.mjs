// End-to-end test of /admin/contenu/: login, read, validate, draft, publish.
// Runs the real server against a temp DATA_DIR, with no GitHub token — so the
// publisher is in dry-run and nothing leaves the machine.
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const PW = 'motdepassetreslong';
const PORT = process.env.PORT ?? '3918';
const B = `http://localhost:${PORT}`;
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'form-content-'));
const srv = spawn('node', ['server.mjs'], {
  env: { ...process.env, PORT, DATA_DIR: dir, ADMIN_PASSWORD: PW, SMTP_HOST: '' },
  stdio: 'inherit',
});

const until = async () => {
  for (let i = 0; i < 60; i++) {
    try {
      await fetch(`${B}/health`);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  throw new Error('server never came up');
};

let cookie = '';
const get = (p) => fetch(B + p, { headers: { cookie }, redirect: 'manual' });
const post = (p, body) =>
  fetch(B + p, {
    method: 'POST',
    headers: { cookie, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body),
    redirect: 'manual',
  });

const valid = {
  'figures.hours': '40',
  'figures.sessions': '20',
  'figures.sessionHours': '2',
  'figures.supportMonths': '12',
  'figures.maxParticipants': '15',
  'contact.email': 'info@lagniconsulting.ca',
  'contact.phone': '+1 418 570 0429',
  'contact.phoneDisplay': '+1 418 570 0429',
  'contact.locality': 'Québec, Canada',
  'contact.linkedin': 'https://www.linkedin.com/company/lagni-consulting/',
};

try {
  await until();

  // Locked down before login.
  assert.equal((await get('/admin/contenu/')).status, 401);
  assert.equal((await post('/admin/contenu/chiffres', valid)).status, 401);

  const login = await fetch(`${B}/admin/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ password: PW }),
    redirect: 'manual',
  });
  assert.equal(login.status, 303);
  cookie = login.headers.get('set-cookie').split(';')[0];

  // The screen opens, and says plainly that it is running blind without a key.
  const screen = await get('/admin/contenu/');
  assert.equal(screen.status, 200);
  const html = await screen.text();
  assert.match(html, /Mode à blanc/, 'must disclose that published content is unreadable');
  assert.match(html, /Chiffres et coordonnées/);
  assert.match(html, /name="figures.hours"/);
  assert.ok(!/<script/i.test(html), 'content screens must stay script-free');

  // ── the shared shell ────────────────────────────────────────────────────
  const shell = (page, what) => {
    assert.equal((page.match(/<h1[\s>]/g) ?? []).length, 1, `${what}: exactly one <h1>`);
    assert.match(page, /class="skip" href="#main"/, `${what}: skip link`);
    assert.match(page, /<main id="main"/, `${what}: main landmark`);
    assert.ok(!/<script/i.test(page), `${what}: no script`);
  };
  shell(html, 'contenu');
  assert.match(html, /action="\/admin\/logout"/, 'contenu: logout must be reachable');
  assert.match(html, /aria-current="page">Contenu/, 'contenu: nav marks the current section');

  const inbox = await (await get('/admin/')).text();
  shell(inbox, 'demandes');
  assert.match(inbox, /action="\/admin\/logout"/, 'demandes: logout');

  const notFound = await get('/admin/nimporte-quoi');
  assert.equal(notFound.status, 404);
  shell(await notFound.text(), '404');

  // Login is reachable without a session and still carries one <h1>.
  const anon = await fetch(`${B}/admin`, { redirect: 'manual' });
  shell(await anon.text(), 'connexion');

  // Invalid values are refused and nothing is stored.
  const bad = await post('/admin/contenu/chiffres', { ...valid, 'figures.hours': '0' });
  assert.equal(bad.status, 422);
  const badHtml = await bad.text();
  assert.match(badHtml, /Heures de formation/);
  // The offending control carries the state, and the message sits in its slot.
  assert.match(badHtml, /id="f-figures-hours"[^>]*aria-invalid="true"/, 'invalid field must be marked');
  assert.match(
    badHtml,
    /data-error-for="figures.hours">Heures de formation[^<]*</,
    'the message belongs to its field',
  );
  assert.match(badHtml, /href="#f-figures-hours"/, 'the summary must link to the field');
  // A valid field must NOT be marked.
  assert.ok(!/id="f-contact-email"[^>]*aria-invalid/.test(badHtml), 'valid fields stay clean');

  const badMail = await post('/admin/contenu/chiffres', { ...valid, 'contact.email': 'nope' });
  assert.equal(badMail.status, 422);
  assert.match(await badMail.text(), /adresse invalide/);

  // Saving a draft.
  const saved = await post('/admin/contenu/chiffres', { ...valid, 'figures.hours': '35', action: 'save' });
  assert.equal(saved.status, 303);
  assert.match(saved.headers.get('location'), /done=saved/);

  // The draft comes back on reopen, and is counted as pending.
  const again = await get('/admin/contenu/?done=saved');
  const html2 = await again.text();
  assert.match(html2, /value="35"/, 'draft must survive a reload');
  assert.match(html2, /1 modification<\/strong> en attente/);
  assert.match(html2, /Brouillon enregistré/);

  // A hostile or unknown ?done= value renders nothing and never reaches the HTML.
  const hostile = await get('/admin/contenu/?done=' + encodeURIComponent('"><script>x</script>'));
  const hostileHtml = await hostile.text();
  assert.ok(!/<script/i.test(hostileHtml), 'flash tokens must never be echoed');
  assert.match(hostileHtml, /<div class="flash" role="status"><\/div>/, 'unknown token shows nothing');

  // Publishing (dry run): one commit, drafts cleared, audit row written.
  const pub = await post('/admin/contenu/chiffres', { ...valid, 'figures.hours': '35', action: 'publish' });
  assert.equal(pub.status, 303);
  assert.match(pub.headers.get('location'), /published=/);

  const after = await get('/admin/contenu/');
  const html3 = await after.text();
  assert.match(html3, /Aucune modification en attente/, 'drafts must be cleared after publish');

  console.log('content: all checks passed');
} finally {
  srv.kill();
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    /* Windows holds the SQLite handle briefly; the temp dir is disposable. */
  }
}
