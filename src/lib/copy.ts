/**
 * Site copy — read from `src/content/copy/`, editable from /admin/contenu/.
 *
 * One rule separates content from structure:
 *
 *     { fr: '…', en: '…' }   editable text
 *     anything else          structure — the dashboard never renders it
 *
 * The dictionaries used to live in `src/i18n/*.ts`, where `satisfies FrDict`
 * guaranteed FR/EN parity for the shared file. That guarantee never covered
 * the page modules: `pages/en/*.ts` carried no `satisfies`, and the `as Pages`
 * cast hid any divergence, so a key missing from an English page rendered
 * `undefined`. The bilingual pair makes that impossible by construction — a
 * key either has both languages or it does not exist.
 */
import type { IconName } from '../components/Icon.astro';
import type { LordIconName } from '../components/LordIcon.astro';
import { ROUTES, type Lang } from '../i18n/routes';
import { fillFigures } from './settings';

import shared from '../content/copy/shared.json';
import home from '../content/copy/pages/home.json';
import training from '../content/copy/pages/training.json';
import sapPp from '../content/copy/pages/sapPp.json';
import erp from '../content/copy/pages/erp.json';
import recruitment from '../content/copy/pages/recruitment.json';
import institutions from '../content/copy/pages/institutions.json';
import about from '../content/copy/pages/about.json';
import resources from '../content/copy/pages/resources.json';
import contact from '../content/copy/pages/contact.json';
import privacy from '../content/copy/pages/privacy.json';
import thanks from '../content/copy/pages/thanks.json';
import notFound from '../content/copy/pages/notFound.json';

// ───────────────────────────────────────────────────────────────── types

interface Pair {
  fr: string;
  en: string;
}

/** Collapses every `{fr,en}` pair to a plain string, keeping the rest intact. */
export type Unwrap<T> = T extends Pair
  ? string
  : T extends readonly (infer U)[]
    ? readonly Unwrap<U>[]
    : T extends object
      ? { readonly [K in keyof T]: Unwrap<T[K]> }
      : T;

const PAGES = {
  home,
  training,
  sapPp,
  erp,
  recruitment,
  institutions,
  about,
  resources,
  contact,
  thanks,
  notFound,
  privacy,
} as const;

export type PageKey = keyof typeof PAGES;
export type Pages = Unwrap<typeof PAGES>;
export type Shared = Unwrap<typeof shared>;

// ────────────────────────────────────────────────── allowed structural values
//
// Declared here rather than imported, because the icon maps live inside the
// components' frontmatter and are not exported. `satisfies` rejects a name
// that is not in the union; the `_exhaustive` checks below reject a union
// member missing from these lists — so adding an icon forces an update here
// instead of silently escaping validation.

const ICONS = [
  'arrow-right', 'arrow-down', 'check', 'plus', 'minus', 'menu', 'close',
  'cap', 'gear', 'people', 'person', 'chart', 'database', 'network',
  'badge', 'calendar', 'screen', 'search', 'doc', 'clipboard', 'factory',
  'school', 'globe', 'bulb', 'target', 'shield', 'mail', 'phone', 'pin',
  'linkedin', 'youtube', 'clock', 'book', 'handshake', 'quote', 'lock',
  'briefcase', 'box', 'truck', 'layers', 'refresh', 'play', 'trophy',
  'sliders', 'link', 'flask', 'upload', 'star',
] as const satisfies readonly IconName[];

const LORDS = [
  'experience', 'server', 'network', 'medal', 'calendar', 'monitor', 'tools',
  'mentor', 'search', 'clock', 'book', 'cap', 'school', 'refresh', 'briefcase',
  'design', 'document', 'checklist', 'conversation', 'shield', 'play', 'mail',
  'phone', 'location', 'globe', 'target',
] as const satisfies readonly LordIconName[];

type _NoIconMissing = Exclude<IconName, (typeof ICONS)[number]> extends never ? true : false;
type _NoLordMissing = Exclude<LordIconName, (typeof LORDS)[number]> extends never ? true : false;
const _exhaustiveIcons: _NoIconMissing = true;
const _exhaustiveLords: _NoLordMissing = true;
void _exhaustiveIcons;
void _exhaustiveLords;

const ICON_SET: ReadonlySet<string> = new Set(ICONS);
const LORD_SET: ReadonlySet<string> = new Set(LORDS);
const ROUTE_SET: ReadonlySet<string> = new Set(ROUTES.map((r) => r.key));

/** Structural keys and what a valid value looks like. */
const RULES: Record<string, (v: unknown) => string | null> = {
  icon: (v) => (typeof v === 'string' && ICON_SET.has(v) ? null : `pictogramme inconnu : ${String(v)}`),
  lord: (v) => (typeof v === 'string' && LORD_SET.has(v) ? null : `icône animée inconnue : ${String(v)}`),
  route: (v) => (typeof v === 'string' && ROUTE_SET.has(v) ? null : `clé de route inconnue : ${String(v)}`),
};

// ─────────────────────────────────────────────────────────── validation

const isPair = (v: unknown): v is Pair =>
  !!v && typeof v === 'object' && !Array.isArray(v) &&
  typeof (v as Pair).fr === 'string' && typeof (v as Pair).en === 'string' &&
  Object.keys(v as object).length === 2;

/**
 * Runs at build time. A failure here stops the build rather than shipping a
 * broken page — which is stricter than before: an unknown icon name used to
 * fall back silently.
 */
function validate(node: unknown, trail: string, errors: string[]): void {
  if (Array.isArray(node)) {
    node.forEach((child, i) => validate(child, `${trail}[${i}]`, errors));
    return;
  }
  if (!node || typeof node !== 'object') return;

  if (isPair(node)) {
    // A field blank in both languages is deliberate (a card with no subtitle).
    // A field blank in only one is a half-finished translation, which is the
    // failure the old `satisfies FrDict` could never catch on page modules.
    const fr = !node.fr.trim();
    const en = !node.en.trim();
    if (fr !== en)
      errors.push(`${trail} : rempli en ${fr ? 'anglais' : 'français'} mais vide en ${fr ? 'français' : 'anglais'}`);
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    const rule = RULES[key];
    if (rule && typeof value !== 'object') {
      const problem = rule(value);
      if (problem) errors.push(`${trail}.${key} : ${problem}`);
    } else {
      validate(value, `${trail}.${key}`, errors);
    }
  }
}

{
  const errors: string[] = [];
  validate(shared, 'shared', errors);
  for (const [key, page] of Object.entries(PAGES)) validate(page, key, errors);
  if (errors.length) {
    throw new Error(
      `Contenu invalide (${errors.length} problème${errors.length > 1 ? 's' : ''}) :\n  - ` +
        errors.join('\n  - '),
    );
  }
}

// ─────────────────────────────────────────────────────────── projection

/** Picks one language and interpolates the figure tokens, once per language. */
function project<T>(node: T, lang: Lang): Unwrap<T> {
  if (Array.isArray(node)) return node.map((child) => project(child, lang)) as Unwrap<T>;
  if (!node || typeof node !== 'object') return node as Unwrap<T>;
  if (isPair(node)) return fillFigures(node[lang]) as Unwrap<T>;

  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) out[key] = project(value, lang);
  return out as Unwrap<T>;
}

const cache = new Map<string, unknown>();
function once<T>(key: string, build: () => T): T {
  let hit = cache.get(key);
  if (hit === undefined) {
    hit = build();
    cache.set(key, hit);
  }
  return hit as T;
}

export const sharedFor = (lang: Lang): Shared => once(`s-${lang}`, () => project(shared, lang));
export const pagesFor = (lang: Lang): Pages => once(`p-${lang}`, () => project(PAGES, lang));
