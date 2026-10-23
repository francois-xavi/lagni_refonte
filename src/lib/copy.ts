/**
 * Site copy.
 *
 * The live source is Payload (see cms/). The JSON files under
 * `src/content/copy/` stay in the repository as the **fallback**: they are the
 * shape every mapper walks, and they are what the site serves if the CMS is
 * unreachable when the server boots. A brochure site that cannot reach its
 * database should still answer, with the content of its last deployment.
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
import { AsyncLocalStorage } from 'node:async_hooks';
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

const FALLBACK_PAGES = {
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

export type PageKey = keyof typeof FALLBACK_PAGES;
export type Pages = Unwrap<typeof FALLBACK_PAGES>;
export type Shared = Unwrap<typeof shared>;

/** The bilingual tree, before a language is picked. */
type Bundle = { shared: unknown; pages: Record<string, unknown> };

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

export function problemsIn(bundle: Bundle): string[] {
  const errors: string[] = [];
  validate(bundle.shared, 'shared', errors);
  for (const [key, page] of Object.entries(bundle.pages)) validate(page, key, errors);
  return errors;
}

const FALLBACK: Bundle = { shared, pages: FALLBACK_PAGES };

{
  // The committed content is the safety net, so it must always be valid.
  const errors = problemsIn(FALLBACK);
  if (errors.length) {
    throw new Error(
      `Contenu de repli invalide (${errors.length} problème${errors.length > 1 ? 's' : ''}) :\n  - ` +
        errors.join('\n  - '),
    );
  }
}

/** What the site serves right now. Swapped wholesale, never half-updated. */
let live: Bundle = FALLBACK;

/**
 * Draft content, for the duration of one request only.
 *
 * Preview must not leak: if a draft were swapped into `live`, every visitor
 * being served at that moment would see unpublished text. An async-local store
 * keeps it attached to the request that asked for it, which is what makes
 * `usePages()` able to stay synchronous and still be request-aware.
 */
const draftStore = new AsyncLocalStorage<Bundle>();

export function withDraft<T>(bundle: Bundle, run: () => T): T {
  return draftStore.run(bundle, run);
}

const current = (): Bundle => draftStore.getStore() ?? live;
export const isPreviewing = () => draftStore.getStore() !== undefined;

/**
 * Replaces the live content, but only if it is valid.
 *
 * A bad edit in the CMS must not take the site down: the errors are reported
 * and the previous content keeps being served. This is why validation returns
 * problems instead of throwing — throwing is right for the committed fallback
 * at boot, wrong for data arriving at runtime.
 */
export function adopt(bundle: Bundle): { ok: boolean; errors: string[] } {
  const errors = problemsIn(bundle);
  if (errors.length) return { ok: false, errors };
  live = bundle;
  cache.clear();
  return { ok: true, errors: [] };
}

export const usingFallback = () => live === FALLBACK;

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

// Draft projections are never cached: the cache belongs to what is published.
export const sharedFor = (lang: Lang): Shared =>
  isPreviewing()
    ? (project(current().shared, lang) as Shared)
    : once(`s-${lang}`, () => project(live.shared, lang) as Shared);

export const pagesFor = (lang: Lang): Pages =>
  isPreviewing()
    ? (project(current().pages, lang) as Pages)
    : once(`p-${lang}`, () => project(live.pages, lang) as Pages);

export type { Bundle };
