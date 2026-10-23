// One-off migration: src/i18n/**.ts  →  src/content/copy/**.json
//
// Walks the French and English dictionaries side by side and emits one
// bilingual JSON tree per page, plus shared.json for the header/footer/forms.
//
// The whole design rests on one rule:
//
//     { "fr": "…", "en": "…" }   is editable text
//     anything else              is structure — never shown, never touched
//
// So the only judgement this script makes is which leaves are text. That
// decision is an explicit list of structural key names (STRUCTURAL below),
// drawn from an audit of every non-text value in src/i18n/. Everything else
// becomes a bilingual pair.
//
// Run: node --experimental-strip-types scripts/migrate-copy.mjs

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'src/content/copy');

/**
 * Key names whose value is structure, not copy. A client must never be able to
 * edit these: they are icon ids, route keys, CSS/HTML identifiers, enum members
 * and booleans. An invalid value here breaks the build or silently breaks a
 * selector — see the audit in the plan.
 */
const STRUCTURAL = new Set([
  'icon', // Icon component name
  'lord', // LordIcon animation name
  'route', // route key → href(); an unknown key throws at build
  'slug', // anchor id, matched by SiteFooter
  'id', // HTML id, CSS selector, ?type= value
  'level', // article filter key
  'family', // index into portfolio.families
  'tone', // theme variant
  'count', // boolean: count-up animation
  'pending', // boolean: certification not confirmed
  'code', // certification code / 404 code
  'n', // step number
]);

const isPair = (v) => v && typeof v === 'object' && !Array.isArray(v);

/** Walks fr and en together. Throws rather than guessing when they diverge. */
function merge(fr, en, trail = '') {
  const where = trail || '(racine)';

  if (typeof fr === 'string') {
    if (typeof en !== 'string') throw new Error(`${where} : chaîne en FR, ${typeof en} en EN`);
    return { fr, en };
  }

  // Numbers and booleans are structure by nature.
  if (typeof fr === 'number' || typeof fr === 'boolean') {
    if (fr !== en) throw new Error(`${where} : valeur structurelle différente entre FR (${fr}) et EN (${en})`);
    return fr;
  }

  if (Array.isArray(fr)) {
    if (!Array.isArray(en)) throw new Error(`${where} : tableau en FR, ${typeof en} en EN`);
    if (fr.length !== en.length)
      throw new Error(`${where} : ${fr.length} éléments en FR, ${en.length} en EN`);
    return fr.map((item, i) => merge(item, en[i], `${where}[${i}]`));
  }

  if (isPair(fr)) {
    if (!isPair(en)) throw new Error(`${where} : objet en FR, ${typeof en} en EN`);
    const frKeys = Object.keys(fr);
    const enKeys = Object.keys(en);
    const missing = frKeys.filter((k) => !enKeys.includes(k));
    const extra = enKeys.filter((k) => !frKeys.includes(k));
    if (missing.length) throw new Error(`${where} : clés absentes en EN — ${missing.join(', ')}`);
    if (extra.length) throw new Error(`${where} : clés en trop en EN — ${extra.join(', ')}`);

    const out = {};
    for (const key of frKeys) {
      // A structural key keeps the French scalar verbatim: both languages
      // already hold the same value, and it is never rendered as text.
      if (STRUCTURAL.has(key) && typeof fr[key] !== 'object') {
        if (fr[key] !== en[key])
          throw new Error(`${where}.${key} : clé structurelle divergente — FR "${fr[key]}", EN "${en[key]}"`);
        out[key] = fr[key];
      } else {
        out[key] = merge(fr[key], en[key], `${where}.${key}`);
      }
    }
    return out;
  }

  throw new Error(`${where} : type non géré (${typeof fr})`);
}

/** Counts what we produced, so the migration can be checked against the audit. */
function tally(node, acc = { pairs: 0, structural: 0 }) {
  if (Array.isArray(node)) {
    node.forEach((n) => tally(n, acc));
  } else if (isPair(node)) {
    if (typeof node.fr === 'string' && typeof node.en === 'string' && Object.keys(node).length === 2) {
      acc.pairs++;
    } else {
      Object.values(node).forEach((n) => tally(n, acc));
    }
  } else {
    acc.structural++;
  }
  return acc;
}

const load = async (file) => import(pathToFileURL(path.join(ROOT, file)).href);

const PAGE_MODULES = [
  ['home', 'home'],
  ['training', 'training'],
  ['sapPp', 'sapPp'],
  ['erp', 'erp'],
  ['recruitment', 'recruitment'],
  ['institutions', 'institutions'],
  ['about', 'about'],
  ['resources', 'resources'],
  ['contact', 'contact'],
  ['privacy', 'privacy'],
  ['misc', 'thanks'],
  ['misc', 'notFound'],
];

const write = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
};

const total = { pairs: 0, structural: 0 };
const report = [];

// ── shared dictionary (header, nav, footer, forms, credentials) ──
{
  const fr = (await load('src/i18n/fr.ts')).fr;
  const en = (await load('src/i18n/en.ts')).en;
  const merged = merge(fr, en, 'shared');
  write(path.join(OUT, 'shared.json'), merged);
  const t = tally(merged);
  report.push(['shared', t.pairs, t.structural]);
  total.pairs += t.pairs;
  total.structural += t.structural;
}

// ── one file per page key ──
for (const [file, key] of PAGE_MODULES) {
  const fr = (await load(`src/i18n/pages/fr/${file}.ts`))[key];
  const en = (await load(`src/i18n/pages/en/${file}.ts`))[key];
  if (!fr || !en) throw new Error(`${key} : export introuvable dans ${file}.ts`);
  const merged = merge(fr, en, key);
  write(path.join(OUT, 'pages', `${key}.json`), merged);
  const t = tally(merged);
  report.push([key, t.pairs, t.structural]);
  total.pairs += t.pairs;
  total.structural += t.structural;
}

const pad = (s, n) => String(s).padEnd(n);
console.log(`\n${pad('fichier', 16)}${pad('textes', 10)}structure`);
console.log('─'.repeat(36));
for (const [name, pairs, structural] of report) {
  console.log(`${pad(name, 16)}${pad(pairs, 10)}${structural}`);
}
console.log('─'.repeat(36));
console.log(`${pad('TOTAL', 16)}${pad(total.pairs, 10)}${total.structural}`);
console.log(`\n${total.pairs} champs bilingues écrits dans src/content/copy/.\n`);
