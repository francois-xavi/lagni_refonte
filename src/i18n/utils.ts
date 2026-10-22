import type { Lang } from './routes';
import { fr, type FrDict, type Widen } from './fr';
import { en } from './en';
import { pagesFr } from './pages/fr';
import { pagesEn } from './pages/en';
import { fillDeep } from '../lib/settings';

/**
 * Figures are interpolated once per language, not per component: `usePages` is
 * called from almost every frontmatter block, and the dictionaries are large.
 */
const cache = new Map<string, unknown>();
function filled<T>(key: string, dict: T): T {
  let hit = cache.get(key);
  if (!hit) {
    hit = fillDeep(dict);
    cache.set(key, hit);
  }
  return hit as T;
}

/** Shared strings: nav, footer, forms, proof blocks. */
export function useTranslations(lang: Lang): FrDict {
  return filled(`t-${lang}`, (lang === 'fr' ? fr : en) as FrDict);
}

/**
 * Page-specific copy, one module per page.
 * The return type widens string literals so FR and EN share one shape.
 */
export type Pages = Widen<typeof pagesFr>;

export function usePages(lang: Lang): Pages {
  return filled(`p-${lang}`, (lang === 'fr' ? pagesFr : pagesEn) as Pages);
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
