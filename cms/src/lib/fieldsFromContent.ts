import fs from 'node:fs'
import path from 'node:path'
import type { Field, GlobalConfig } from 'payload'
import { notifySite } from './notifySite'

/**
 * Builds the Payload schema from the site's own content files.
 *
 * The shape is not written twice. `src/content/copy/**.json` already describes
 * every page, and one rule tells content from structure:
 *
 *     { "fr": "…", "en": "…" }   editable text  → a localized field
 *     anything else              structure      → a constrained field
 *
 * Structural values (icon names, route keys) become **select fields** whose
 * options come from `_allowed.json`, itself derived from the site's own type
 * unions. So the client picks a pictogram from a list instead of typing a name
 * that does not exist — which is what used to break the build, or worse, fall
 * back to a silent default.
 *
 * The files are read from the Astro project next door rather than copied in:
 * one source, no drift.
 */

const SITE = path.resolve(process.cwd(), '..')
const COPY = path.join(SITE, 'src/content/copy')

const readJson = (p: string) => JSON.parse(fs.readFileSync(p, 'utf8'))

const allowed: { icons: string[]; lords: string[]; routes: string[] } = readJson(
  path.join(COPY, '_allowed.json'),
)

/** Structural keys the client may choose from, with the values that exist. */
const OPTIONS: Record<string, string[]> = {
  icon: allowed.icons,
  lord: allowed.lords,
  route: allowed.routes,
}

/**
 * Structural keys with no list to choose from. These are anchor ids, filter
 * keys and step numbers that double as CSS selectors, HTML ids and lookup
 * keys — `chooser.options[].id` even drives the `?type=` query string. They
 * are shown so the editor can see what a row refers to, and locked so a typo
 * cannot silently break a selector.
 */
/**
 * Payload owns `id` on every array row and uses it as the primary key, so our
 * own `id` (`'sap-pp'`, `'erp'`, …) collides with it: both languages try to
 * insert rows with the same key and the write fails. It is stored as `key`
 * instead, and mapped back on the way out.
 */
export const RENAMED: Record<string, string> = { id: 'key' }
export const toCms = (name: string) => RENAMED[name] ?? name

const READ_ONLY = new Set(['slug', 'id', 'level', 'family', 'tone', 'code', 'n', 'count', 'pending'])

const locked = (name: string, type: 'text' | 'number' | 'checkbox'): Field =>
  ({
    name: toCms(name),
    label: label(name),
    type,
    admin: { readOnly: true, description: 'Valeur technique, non modifiable.' },
  }) as Field

/** Longer copy deserves a textarea; labels and buttons do not. */
const LONG = 90

interface Pair {
  fr: string
  en: string
}

const isPair = (v: unknown): v is Pair =>
  !!v &&
  typeof v === 'object' &&
  !Array.isArray(v) &&
  typeof (v as Pair).fr === 'string' &&
  typeof (v as Pair).en === 'string' &&
  Object.keys(v as object).length === 2

/** Turns `ctaPrimary` into `Cta primary` so the admin reads in plain words. */
const label = (name: string) => {
  const spaced = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

/**
 * Merges every row of an array into one shape.
 *
 * Inferring from `value[0]` alone silently drops any key that only appears
 * later: `privacy.sections[0]` has no `items`, so the field was never created
 * and the content of `sections[2].items` had nowhere to go. Optional keys are
 * normal in this content, so the shape has to be the union of all rows.
 */
function mergeShape(items: unknown[]): unknown {
  const pairLike = items.find(isPair)
  if (pairLike) return pairLike

  const objects = items.filter(
    (i): i is Record<string, unknown> => !!i && typeof i === 'object' && !Array.isArray(i),
  )
  if (objects.length === 0) return items[0]

  const merged: Record<string, unknown> = {}
  for (const row of objects) {
    for (const [k, v] of Object.entries(row)) {
      if (v === undefined || v === null) continue
      if (!(k in merged)) {
        merged[k] = v
      } else if (Array.isArray(merged[k]) && Array.isArray(v)) {
        merged[k] = [...(merged[k] as unknown[]), ...v]
      }
    }
  }
  return merged
}

function fieldFor(name: string, value: unknown, inLocalizedArray: boolean): Field | null {
  // Editable text, both languages in one field.
  if (isPair(value)) {
    const long = value.fr.length > LONG || value.en.length > LONG
    return {
      name: toCms(name),
      label: label(name),
      type: long ? 'textarea' : 'text',
      // Inside a localized array the rows are already per-locale; marking the
      // leaf as well would localize twice.
      localized: !inLocalizedArray,
    }
  }

  // Structure the client may choose from, but not invent.
  if (typeof value === 'string') {
    const options = OPTIONS[name]
    if (options) {
      return {
        name: toCms(name),
        label: label(name),
        type: 'select',
        options: options.map((o) => ({ label: o, value: o })),
        admin: { description: 'Valeur technique : choisissez dans la liste.' },
      }
    }
    if (READ_ONLY.has(name)) return locked(name, 'text')
    // A bare string that is neither a pair nor a known structural key should
    // not exist. Surfacing it beats guessing what it is.
    throw new Error(`Champ "${name}" : chaîne non bilingue et non structurelle (${value})`)
  }

  if (typeof value === 'number') return locked(name, 'number')
  if (typeof value === 'boolean') return locked(name, 'checkbox')

  if (Array.isArray(value)) {
    if (value.length === 0) return null // nothing to infer a shape from
    const sample = mergeShape(value)
    // The array itself carries the locale, not its fields.
    //
    // With a plain array and localized leaves, Payload stores ONE set of rows:
    // writing the English pass replaces the rows the French pass created, and
    // the French values are lost. We hit exactly that — 740 fields came back
    // empty. A localized array keeps one complete set of rows per language.
    // A list of plain text — bullets, tags — is a textarea with one item per
    // line, not a repeater of single-field rows.
    //
    // It reads better for the editor, and it sidesteps nested arrays entirely:
    // Payload would not round-trip an array inside a localized array, and all
    // ten such places in this site are lists of strings.
    if (isPair(sample)) {
      return {
        name: toCms(name),
        label: label(name),
        type: 'textarea',
        localized: !inLocalizedArray,
        admin: { description: 'Une ligne par élément.' },
      }
    }
    return {
      name: toCms(name),
      label: label(name),
      type: 'array',
      localized: !inLocalizedArray,
      fields: fieldsFor(sample, true),
    }
  }

  if (value && typeof value === 'object') {
    return { name: toCms(name), label: label(name), type: 'group', fields: fieldsFor(value, inLocalizedArray) }
  }

  return null
}

export function fieldsFor(node: unknown, inLocalizedArray = false): Field[] {
  if (!node || typeof node !== 'object') return []
  const out: Field[] = []
  for (const [key, value] of Object.entries(node)) {
    const field = fieldFor(key, value, inLocalizedArray)
    if (field) out.push(field)
  }
  return out
}

/**
 * Where each page lives on the site. The CMS edits content, never URLs — the
 * route table in src/i18n/routes.ts stays the only place a path is written —
 * so the preview button needs this small map to know where to send the editor.
 */
const PREVIEW_PATH: Record<string, string> = {
  home: '/',
  training: '/formations/',
  sapPp: '/formation-sap-pp/',
  erp: '/erp-solutions/',
  recruitment: '/recrutement/',
  institutions: '/etablissements/',
  about: '/a-propos/',
  resources: '/ressources/',
  contact: '/contact/',
  privacy: '/confidentialite/',
  thanks: '/merci/',
  notFound: '/404',
  shared: '/',
}

const SITE_URL = process.env.SITE_URL ?? 'http://localhost:4333'
const PREVIEW_SECRET = process.env.PREVIEW_SECRET ?? ''

/**
 * Hands the editor's own token to the site, which reads the draft as that
 * user. Returning null hides the button when no secret is configured, rather
 * than offering one that leads to a 403.
 */
const previewUrl = (slug: string) => (_data: unknown, { token }: { token?: string }) => {
  if (!PREVIEW_SECRET) return null
  const params = new URLSearchParams({
    secret: PREVIEW_SECRET,
    path: PREVIEW_PATH[slug] ?? '/',
    token: token ?? '',
  })
  return `${SITE_URL}/api/preview/?${params.toString()}`
}

/** One Payload global per page — a page is a singleton, which is what a global is. */
export function globalForPage(key: string, title: string): GlobalConfig {
  const data = readJson(path.join(COPY, 'pages', `${key}.json`))
  return {
    slug: key,
    label: title,
    // The published content of a public website is public. Drafts are a
    // different matter and stay behind authentication — verified, not assumed.
    access: { read: () => true },
    admin: { group: 'Pages', preview: previewUrl(key) },
    versions: { drafts: { autosave: false } },
    hooks: { afterChange: [notifySite] },
    fields: fieldsFor(data),
  }
}

export function sharedGlobal(): GlobalConfig {
  const data = readJson(path.join(COPY, 'shared.json'))
  return {
    slug: 'shared',
    label: 'Commun au site',
    // The published content of a public website is public. Drafts are a
    // different matter and stay behind authentication — verified, not assumed.
    access: { read: () => true },
    admin: {
      group: 'Pages',
      preview: previewUrl('shared'),
      description: 'En-tête, navigation, pied de page, libellés et messages des formulaires.',
    },
    versions: { drafts: { autosave: false } },
    hooks: { afterChange: [notifySite] },
    fields: fieldsFor(data),
  }
}
