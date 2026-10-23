import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from './payload.config'
import { PAGES } from './pages'
import { toCms } from './lib/fieldsFromContent'

/**
 * Reads every global back out of Payload and compares it with the file it was
 * imported from.
 *
 * This is the round-trip test: the content was moved out of TypeScript, into
 * JSON, then into a database. Each hop can lose or mangle something — an
 * accent, a non-breaking space, an empty string turned into null. Diffing the
 * values that come back against the source is what proves it did not.
 *
 * Run from cms/:  npm run verify
 */

const COPY = path.resolve(process.cwd(), '../src/content/copy')
const readJson = (p: string) => JSON.parse(fs.readFileSync(p, 'utf8'))

const isPair = (v: unknown): v is { fr: string; en: string } =>
  !!v &&
  typeof v === 'object' &&
  !Array.isArray(v) &&
  typeof (v as { fr?: unknown }).fr === 'string' &&
  typeof (v as { en?: unknown }).en === 'string' &&
  Object.keys(v as object).length === 2

const problems: string[] = []

/**
 * Walks the source tree and checks each leaf against what Payload returned for
 * both locales. Payload hands back `null` for an empty string and adds an `id`
 * to every array row, so those two are normalised rather than reported.
 */
function compare(source: unknown, fr: unknown, en: unknown, trail: string): void {
  if (isPair(source)) {
    const got = { fr: (fr ?? '') as string, en: (en ?? '') as string }
    if (got.fr !== source.fr) problems.push(`${trail} [fr]\n      attendu : ${JSON.stringify(source.fr)}\n      obtenu  : ${JSON.stringify(got.fr)}`)
    if (got.en !== source.en) problems.push(`${trail} [en]\n      attendu : ${JSON.stringify(source.en)}\n      obtenu  : ${JSON.stringify(got.en)}`)
    return
  }

  if (Array.isArray(source)) {
    // Text lists come back as a single string, one item per line.
    if (source.length > 0 && source.every(isPair)) {
      const split = (v: unknown) => (typeof v === 'string' && v.length ? v.split('\n') : [])
      const a = split(fr)
      const b = split(en)
      if (a.length !== source.length)
        problems.push(`${trail} : ${source.length} lignes attendues, ${a.length} obtenues`)
      source.forEach((item, i) => compare(item, a[i], b[i], `${trail}[${i}]`))
      return
    }
    const a = Array.isArray(fr) ? fr : []
    const b = Array.isArray(en) ? en : []
    if (a.length !== source.length)
      problems.push(`${trail} : ${source.length} éléments attendus, ${a.length} obtenus`)
    source.forEach((item, i) => {
      // An array of plain pairs is stored as rows of `{ value }`.
      if (isPair(item)) {
        compare(item, a[i]?.value, b[i]?.value, `${trail}[${i}]`)
      } else {
        compare(item, a[i], b[i], `${trail}[${i}]`)
      }
    })
    return
  }

  if (source && typeof source === 'object') {
    for (const [key, value] of Object.entries(source)) {
      compare(
        value,
        (fr as Record<string, unknown>)?.[toCms(key)],
        (en as Record<string, unknown>)?.[toCms(key)],
        `${trail}.${key}`,
      )
    }
    return
  }

  // Structural scalar: must survive untouched.
  if (fr !== source)
    problems.push(`${trail} : structure altérée — attendu ${JSON.stringify(source)}, obtenu ${JSON.stringify(fr)}`)
}

const payload = await getPayload({ config })

const targets = [
  { slug: 'shared', file: path.join(COPY, 'shared.json') },
  ...PAGES.map((p) => ({ slug: p.key, file: path.join(COPY, 'pages', `${p.key}.json`) })),
]

let fields = 0
const countPairs = (n: unknown): void => {
  if (isPair(n)) { fields++; return }
  if (Array.isArray(n)) return n.forEach(countPairs)
  if (n && typeof n === 'object') Object.values(n).forEach(countPairs)
}

for (const { slug, file } of targets) {
  const source = readJson(file)
  countPairs(source)
  const opts = { slug: slug as Parameters<typeof payload.findGlobal>[0]['slug'], depth: 0 }
  const fr = await payload.findGlobal({ ...opts, locale: 'fr' })
  const en = await payload.findGlobal({ ...opts, locale: 'en' })
  compare(source, fr, en, slug)
}

console.log(`\n${fields} champs bilingues vérifiés sur ${targets.length} ensembles.`)
if (problems.length === 0) {
  console.log('Aucun écart : le contenu ressort identique à la source.\n')
  process.exit(0)
}
console.log(`\n${problems.length} écart(s) :\n`)
for (const p of problems.slice(0, 25)) console.log('  - ' + p)
if (problems.length > 25) console.log(`  … et ${problems.length - 25} autres`)
process.exit(1)
