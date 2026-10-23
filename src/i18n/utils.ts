import type { Lang } from './routes';
import { pagesFor, sharedFor, type Pages, type Shared } from '../lib/copy';

/**
 * Shared strings: nav, footer, forms, credentials.
 * The copy itself lives in src/content/copy/ so it can be edited from
 * /admin/contenu/; src/lib/copy.ts validates it and picks the language.
 */
export function useTranslations(lang: Lang): Shared {
  return sharedFor(lang);
}

/** Page-specific copy, one entry per route. */
export function usePages(lang: Lang): Pages {
  return pagesFor(lang);
}

export type { Pages, Shared };

export function otherLang(lang: Lang): Lang {
  return lang === 'fr' ? 'en' : 'fr';
}

/** Locale-aware date formatting for resource articles. */
export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
