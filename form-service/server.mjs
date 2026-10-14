// Receives the site's form POSTs (/api/form) and emails them to MAIL_TO.
// Provider-agnostic: SMTP_* env vars only, so changing mail host is config, not code.
import http from 'node:http';
import nodemailer from 'nodemailer';

const env = (k, d) => process.env[k] ?? d ?? (() => { throw new Error(`missing env ${k}`); })();
const MAIL_TO = env('MAIL_TO');
const MAIL_FROM = env('MAIL_FROM');
const SITE = env('SITE_URL', 'https://lagniconsulting.ca');
const transport = nodemailer.createTransport({
  host: env('SMTP_HOST'),
  port: Number(env('SMTP_PORT', '587')),
  secure: env('SMTP_PORT', '587') === '465',
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: env('SMTP_PASS') } : undefined,
});

const MAX_BODY = 6 * 1024 * 1024; // 5 MB file + fields
const MAX_FILE = 5 * 1024 * 1024;
const FILE_EXT = /\.(pdf|docx?)$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const THANKS = { fr: '/merci/', en: '/en/thank-you/' };
const SKIP = new Set(['website', 'started_at', 'consent']);

// ponytail: in-memory per-IP limit, resets on restart; move to Redis if spam gets organised.
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

async function handle(req) {
  const len = Number(req.headers['content-length'] ?? 0);
  if (!len || len > MAX_BODY) return [413, 'Payload too large'];
  const ip = String(req.headers['x-forwarded-for'] ?? req.socket.remoteAddress).split(',')[0].trim();
  if (limited(ip)) return [429, 'Too many requests'];

  const form = await new Request('http://local', {
    method: 'POST', headers: { 'content-type': req.headers['content-type'] ?? '' }, body: req, duplex: 'half',
  }).formData();

  const thanks = THANKS[form.get('locale')] ?? THANKS.fr;
  // Spam guards mirror src/scripts/form.ts: pretend success, send nothing.
  const started = Number(form.get('started_at'));
  if (form.get('website') || (started && Date.now() - started < 3000)) return [200, 'ok', thanks];
  if (!form.get('consent')) return [400, 'Consent required'];

  const lines = [];
  const attachments = [];
  for (const [k, v] of form) {
    if (SKIP.has(k)) continue;
    if (typeof v === 'string') { if (v.trim()) lines.push(`${k}: ${v.trim()}`); continue; }
    if (!v.size) continue;
    if (!FILE_EXT.test(v.name) || v.size > MAX_FILE) return [400, 'Invalid file'];
    attachments.push({ filename: v.name, content: Buffer.from(await v.arrayBuffer()) });
  }
  if (!lines.length) return [400, 'Empty form'];

  const email = String(form.get('email') ?? '');
  const who = [form.get('first_name'), form.get('last_name')].filter(Boolean).join(' ') || form.get('name') || email;
  await transport.sendMail({
    from: MAIL_FROM,
    to: MAIL_TO,
    replyTo: EMAIL.test(email) ? email : undefined,
    subject: `[Site] ${form.get('form_name') ?? 'Formulaire'} — ${who}`.replace(/[\r\n]+/g, ' ').slice(0, 200),
    text: `${lines.join('\n')}\n\n— ${SITE} (${ip})`,
    attachments,
  });
  return [200, 'ok', thanks];
}

http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') return res.end('ok');
  if (req.method !== 'POST') { res.writeHead(405).end(); return; }
  let status, msg, thanks;
  try { [status, msg, thanks] = await handle(req); }
  catch (err) { console.error(err); [status, msg] = [500, 'Send failed']; }
  const wantsJson = String(req.headers.accept).includes('application/json');
  // No-JS visitors get a normal redirect to the thank-you page.
  if (status === 200 && !wantsJson) { res.writeHead(303, { Location: `${SITE}${thanks}` }).end(); return; }
  res.writeHead(status, { 'content-type': 'application/json' }).end(JSON.stringify({ ok: status === 200, msg }));
}).listen(3000, () => console.log('form-service on :3000'));
