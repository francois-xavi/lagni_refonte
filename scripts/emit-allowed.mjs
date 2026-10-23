// Emits src/content/copy/_allowed.json — the values a structural field may take.
//
// The CMS needs these lists to render icon and route pickers as dropdowns
// rather than free text, so the client cannot type a name that does not exist.
// They are *derived*, never typed twice: the icon lists come from the arrays in
// src/lib/copy.ts (which TypeScript already checks against the IconName and
// LordIconName unions, in both directions), and the route keys come from
// src/i18n/routes.ts.
//
// Run: node scripts/emit-allowed.mjs

import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');

/** Pulls the string literals out of a `const NAME = [...] as const` block. */
function literals(source, name) {
  const start = source.indexOf(`const ${name} = [`);
  if (start === -1) throw new Error(`${name} introuvable`);
  const end = source.indexOf('] as const', start);
  if (end === -1) throw new Error(`fin de ${name} introuvable`);
  return [...source.slice(start, end).matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

const copy = read('src/lib/copy.ts');
const icons = literals(copy, 'ICONS');
const lords = literals(copy, 'LORDS');

const routesSource = read('src/i18n/routes.ts');
const routes = [...routesSource.matchAll(/\{\s*key:\s*'([^']+)'/g)].map((m) => m[1]);

if (!icons.length || !lords.length || !routes.length) {
  throw new Error('extraction vide — le format source a changé');
}

const out = { icons, lords, routes };
fs.writeFileSync('src/content/copy/_allowed.json', JSON.stringify(out, null, 2) + '\n');

console.log(`pictogrammes : ${icons.length}`);
console.log(`icônes animées : ${lords.length}`);
console.log(`clés de route : ${routes.length}  (${routes.join(', ')})`);
