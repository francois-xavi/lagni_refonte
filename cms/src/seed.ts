import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from './payload.config'
import { PAGES } from './pages'
import { toCms } from './lib/fieldsFromContent'

/**
 * Loads the site's content into Payload, once.
 *
 * Source: `src/content/copy/**.json`, the 1 382 bilingual fields already
 * migrated out of TypeScript. Each `{ fr, en }` pair is written twice — once
 * per locale — because Payload stores localized values per locale. Structural
 * values (icon names, route keys) are identical in both languages and are
 * written along with each pass.
 *
 * Re-running it overwrites the globals with the file contents, so it is a
 * reset, not a merge. That is deliberate: it makes the import reproducible
 * while the schema is still moving.
 *
 * Run from cms/:  npm run seed
 */

const COPY = path.resolve(process.cwd(), '../src/content/copy')
const readJson = (p: string) => JSON.parse(fs.readFileSync(p, 'utf8'))

type Lang = 'fr' | 'en'

const isPair = (v: unknown): v is { fr: string; en: string } =>
  !!v &&
  typeof v === 'object' &&
  !Array.isArray(v) &&
  typeof (v as { fr?: unknown }).fr === 'string' &&
  typeof (v as { en?: unknown }).en === 'string' &&
  Object.keys(v as object).length === 2

/** Projects the bilingual tree onto one language, in the shape Payload expects. */
function project(node: unknown, lang: Lang): unknown {
  if (isPair(node)) return node[lang]
  if (Array.isArray(node)) {
    // Lists of plain text are stored as one string, one item per line.
    if (node.length > 0 && node.every(isPair)) {
      return (node as { fr: string; en: string }[]).map((item) => item[lang]).join('\n')
    }
    return node.map((item) => project(item, lang))
  }
  if (node && typeof node === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(node)) out[toCms(k)] = project(v, lang)
    return out
  }
  return node
}

const payload = await getPayload({ config })

const targets: { slug: string; file: string }[] = [
  { slug: 'shared', file: path.join(COPY, 'shared.json') },
  ...PAGES.map((p) => ({ slug: p.key, file: path.join(COPY, 'pages', `${p.key}.json`) })),
]

for (const { slug, file } of targets) {
  const source = readJson(file)
  for (const locale of ['fr', 'en'] as const) {
    await payload.updateGlobal({
      slug: slug as Parameters<typeof payload.updateGlobal>[0]['slug'],
      data: project(source, locale) as Record<string, unknown>,
      locale,
      draft: false,
    })
  }
  console.log(`  ${slug} importé (fr + en)`)
}

console.log(`\n${targets.length} ensembles importés.`)
process.exit(0)
