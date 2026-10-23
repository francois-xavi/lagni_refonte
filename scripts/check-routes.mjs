// Route-level regression net.
//
// Until now, every content change was validated by diffing `dist/` byte for
// byte. Server rendering removes that `dist/`, so the same guarantee has to be
// taken over HTTP instead: snapshot the HTML of every route while the site is
// still known-good, then compare the live server against that snapshot.
//
//   node scripts/check-routes.mjs snapshot <fichier.json>   (lit dist/)
//   node scripts/check-routes.mjs compare  <fichier.json> <baseUrl>
//
// A difference is not necessarily a bug, but it always has to be explained.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

/** dist/a-propos/index.html → /a-propos/ ; dist/404.html → /404 */
function urlFor(file) {
  const rel = file.slice('dist'.length).split(path.sep).join('/');
  if (rel.endsWith('/index.html')) return rel.slice(0, -'index.html'.length);
  if (rel === '/404.html') return '/404';
  return rel;
}

function fromDist(dir = 'dist') {
  const out = {};
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) out[urlFor(full)] = sha(fs.readFileSync(full));
    }
  };
  walk(dir);
  return out;
}

/**
 * Normalises away differences that are expected between a static build and a
 * server render, so the comparison surfaces real content changes only.
 * Kept deliberately small: every entry here is a hole in the net.
 */
function normalise(html) {
  return html
    .replace(/\r\n/g, '\n')
    .replace(/\s+$/, '')
    .trim();
}

async function compare(refFile, baseUrl) {
  const ref = JSON.parse(fs.readFileSync(refFile, 'utf8'));
  // `/404` is reached through the server's error handler, not by requesting
  // that path: `astro preview` answers with its own built-in 404 page, and
  // nginx uses `error_page`. It is checked against the real server instead.
  const routes = Object.keys(ref).filter((r) => r !== '/404').sort();
  const same = [];
  const differ = [];
  const failed = [];

  for (const route of routes) {
    const url = new URL(route, baseUrl).toString();
    try {
      const res = await fetch(url, { redirect: 'manual' });
      if (res.status !== 200) {
        failed.push([route, `HTTP ${res.status}`]);
        continue;
      }
      const body = normalise(await res.text());
      (sha(body) === ref[route] ? same : differ).push(route);
    } catch (err) {
      failed.push([route, err.message.slice(0, 60)]);
    }
  }

  console.log(`identiques : ${same.length}/${routes.length}`);
  console.log('(/404 exclu : il passe par le gestionnaire d’erreur du serveur)');
  if (differ.length) {
    console.log(`\ndifferentes (${differ.length}) :`);
    for (const r of differ) console.log(`  ${r}`);
  }
  if (failed.length) {
    console.log(`\ninjoignables (${failed.length}) :`);
    for (const [r, why] of failed) console.log(`  ${r}  ${why}`);
  }
  return differ.length === 0 && failed.length === 0;
}

const [mode, file, baseUrl] = process.argv.slice(2);

if (mode === 'snapshot') {
  if (!file) throw new Error('usage: snapshot <fichier.json>');
  const map = fromDist();
  // Hash the normalised text, so a snapshot can be compared with a live fetch.
  const normalised = {};
  for (const [route] of Object.entries(map)) {
    const p = route === '/404' ? 'dist/404.html' : path.join('dist', route, 'index.html');
    normalised[route] = sha(normalise(fs.readFileSync(p, 'utf8')));
  }
  fs.writeFileSync(file, JSON.stringify(normalised, null, 1) + '\n');
  console.log(`${Object.keys(normalised).length} routes enregistrees dans ${file}`);
} else if (mode === 'compare') {
  if (!file || !baseUrl) throw new Error('usage: compare <fichier.json> <baseUrl>');
  const ok = await compare(file, baseUrl);
  process.exit(ok ? 0 : 1);
} else {
  console.log('usage:\n  node scripts/check-routes.mjs snapshot <fichier.json>\n  node scripts/check-routes.mjs compare <fichier.json> <baseUrl>');
  process.exit(2);
}
