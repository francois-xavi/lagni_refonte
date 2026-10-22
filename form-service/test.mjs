// Smoke test: `npm test`. Boots the service on a temp dir and walks the whole flow.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'form-svc-'));
const PW = 'test-password-123';
const srv = spawn('node', ['server.mjs'], { env: { ...process.env, DATA_DIR: dir, ADMIN_PASSWORD: PW, SMTP_HOST: '' }, stdio: 'inherit' });
const B = 'http://localhost:3000';
const old = Date.now() - 10_000;
const post = (fields, file) => {
  const f = new FormData();
  for (const [k, v] of Object.entries({ consent: 'on', started_at: String(old), ...fields })) f.set(k, v);
  if (file) f.set('document', new Blob(['%PDF-1.4 x']), file);
  return fetch(`${B}/api/form`, { method: 'POST', body: f, headers: { Accept: 'application/json' } });
};
try {
  for (let i = 0; i < 30; i++) { try { await fetch(`${B}/health`); break; } catch { await new Promise((r) => setTimeout(r, 200)); } }

  assert.equal((await post({ form_name: 'recruitment-candidate', locale: 'fr', first_name: '=Awa', last_name: '<b>X</b>', email: 'a@b.co', message: '=HYPERLINK("x")' }, 'cv.pdf')).status, 200);
  assert.equal((await post({ form_name: 'contact', website: 'spam', message: 'x' })).status, 200); // honeypot: pretend ok
  assert.equal((await post({ message: 'x' }, 'virus.exe')).status, 400);
  assert.equal((await post({ message: 'x', consent: '' })).status, 400);

  assert.equal((await fetch(`${B}/admin/export.csv`)).status, 401); // not logged in
  assert.equal((await fetch(`${B}/admin/delete/1`, { method: 'POST' })).status, 401);
  const bad = await fetch(`${B}/admin/login`, { method: 'POST', body: 'password=nope', headers: { 'content-type': 'application/x-www-form-urlencoded' } });
  assert.equal(bad.status, 401);
  const ok = await fetch(`${B}/admin/login`, { method: 'POST', body: `password=${PW}`, headers: { 'content-type': 'application/x-www-form-urlencoded' }, redirect: 'manual' });
  assert.equal(ok.status, 303);
  const cookie = ok.headers.get('set-cookie').split(';')[0];
  const get = (p) => fetch(`${B}${p}`, { headers: { cookie } });

  const html = await (await get('/admin/')).text();
  assert.match(html, /Awa/);
  assert.ok(!html.includes('<b>X</b>'), 'html must be escaped');
  assert.ok((await (await get('/admin/export.csv')).text()).includes(`"'=Awa`), 'csv formula injection guard');
  assert.match((await get('/admin/file/1')).headers.get('content-disposition'), /attachment; filename="cv.pdf"/);
  assert.equal((await get('/admin/file/999')).status, 404);

  await fetch(`${B}/admin/handled/1`, { method: 'POST', headers: { cookie } });
  assert.match(await (await get('/admin/')).text(), /Traité/);
  await fetch(`${B}/admin/delete/1`, { method: 'POST', headers: { cookie } });
  assert.match(await (await get('/admin/')).text(), /Aucune demande/);
  assert.equal(fs.readdirSync(path.join(dir, 'uploads')).length, 0, 'CV file removed with its row');
  console.log('form-service: all checks passed');
} finally {
  srv.kill();
  fs.rmSync(dir, { recursive: true, force: true });
}
