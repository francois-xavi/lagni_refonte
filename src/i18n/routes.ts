export type Lang = 'fr' | 'en';

export const LANGS: Lang[] = ['fr', 'en'];
export const DEFAULT_LANG: Lang = 'fr';

/** Human-facing locale codes used in hreflang and og:locale. */
export const LOCALE: Record<Lang, string> = { fr: 'fr_CA', en: 'en_CA' };
export const HREFLANG: Record<Lang, string> = { fr: 'fr-CA', en: 'en-CA' };

/**
 * The single source of truth for the site map.
 * Drives the primary nav, the footer, the sitemap and — critically — the
 * language switcher, so FR↔EN always lands on the equivalent page.
 */
export interface RouteDef {
  /** Key into the `nav` block of the translation dictionaries. */
  key: string;
  /** Path segment per language, without leading/trailing slashes ('' = home). */
  path: Record<Lang, string>;
  /** Show in the primary navigation. */
  inNav: boolean;
}

export const ROUTES: RouteDef[] = [
  { key: 'home',         path: { fr: '',                 en: '' },                 inNav: true },
  { key: 'training',     path: { fr: 'formations',       en: 'training' },         inNav: true },
  { key: 'sapPp',        path: { fr: 'formation-sap-pp', en: 'sap-pp-training' },  inNav: false },
  { key: 'erp',          path: { fr: 'erp-solutions',    en: 'erp-solutions' },    inNav: true },
  { key: 'recruitment',  path: { fr: 'recrutement',      en: 'recruitment' },      inNav: true },
  { key: 'institutions', path: { fr: 'etablissements',   en: 'institutions' },     inNav: true },
  { key: 'about',        path: { fr: 'a-propos',         en: 'about' },            inNav: true },
  { key: 'resources',    path: { fr: 'ressources',       en: 'resources' },        inNav: true },
  { key: 'contact',      path: { fr: 'contact',          en: 'contact' },          inNav: true },
  { key: 'thanks',       path: { fr: 'merci',            en: 'thank-you' },        inNav: false },
  { key: 'privacy',      path: { fr: 'confidentialite',  en: 'privacy' },          inNav: false },
];

const BY_KEY = new Map(ROUTES.map((r) => [r.key, r]));

/**
 * Absolute site path for a route key in a given language.
 * FR is the default locale and serves from the root; EN is prefixed with /en.
 */
export function href(key: string, lang: Lang): string {
  const route = BY_KEY.get(key);
  if (!route) throw new Error(`Unknown route key: ${key}`);
  const segment = route.path[lang];
  const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`;
  return segment ? `${prefix}/${segment}/` : `${prefix}/`;
}

/** The equivalent path in the other language — used by the switcher. */
export function alternateHref(key: string, lang: Lang): string {
  return href(key, lang === 'fr' ? 'en' : 'fr');
}

/** hreflang alternates for a route, including x-default (→ FR). */
export function alternates(key: string): { hreflang: string; path: string }[] {
  return [
    { hreflang: HREFLANG.fr, path: href(key, 'fr') },
    { hreflang: HREFLANG.en, path: href(key, 'en') },
    { hreflang: 'x-default', path: href(key, 'fr') },
  ];
}

export const navRoutes = ROUTES.filter((r) => r.inNav);

/** The inquiry types the contact form can be opened on. */
export type InquiryType =
  | 'formation'
  | 'formation-entreprise'
  | 'erp'
  | 'recrutement'
  | 'etablissement'
  | 'autre';

/**
 * Link to the contact page with the inquiry type already chosen, so a visitor
 * arriving from a page does not have to restate what they came for.
 * ContactPage reads `?type=` on load; an unknown value falls back to the first
 * option, so the link degrades safely.
 */
export function contactHref(lang: Lang, type: InquiryType): string {
  return `${href('contact', lang)}?type=${type}`;
}
