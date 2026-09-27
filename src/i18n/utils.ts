import type { Lang } from './routes';
import { fr, type FrDict, type Widen } from './fr';
import { en } from './en';
import { pagesFr } from './pages/fr';
import { pagesEn } from './pages/en';

/** Shared strings: nav, footer, forms, proof blocks. */
export function useTranslations(lang: Lang): FrDict {
  return (lang === 'fr' ? fr : en) as FrDict;
}

/**
 * Page-specific copy, one module per page.
 * The return type widens string literals so FR and EN share one shape.
 */
export type Pages = Widen<typeof pagesFr>;

export function usePages(lang: Lang): Pages {
  return (lang === 'fr' ? pagesFr : pagesEn) as Pages;
}

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
