import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/routes';

export type ResourceEntry = CollectionEntry<'resources'>;

export interface ResourcePreview {
  slug: string;
  title: string;
  description: string;
  category: ResourceEntry['data']['category'];
  level: ResourceEntry['data']['level'];
  date: Date;
  readingMinutes: number;
  status: ResourceEntry['data']['status'];
  cta: ResourceEntry['data']['cta'];
  image?: string;
}

/** Entry ids are "<lang>/<slug>" because of the glob base directory. */
function splitId(id: string): { lang: Lang; slug: string } {
  const [lang, ...rest] = id.split('/');
  return { lang: lang as Lang, slug: rest.join('/') };
}

function toPreview(entry: ResourceEntry): ResourcePreview {
  const { slug } = splitId(entry.id);
  return { slug, ...entry.data };
}

/**
 * Articles that may be shown to the public.
 *
 * Anything still marked `status: 'draft'` is written in-house and has NOT been
 * reviewed by the client, so it must never reach a visitor: it is filtered out
 * here, which removes it from every listing, the homepage, the article routes
 * and the sitemap in one place. Flip an article's front matter to
 * `status: 'published'` to put it online.
 */
export function isPublic(r: { status: ResourcePreview['status'] }): boolean {
  return r.status === 'published';
}

/** Published articles for a language, newest first. */
export async function getResources(lang: Lang): Promise<ResourcePreview[]> {
  const all = await getCollection('resources', (e) => splitId(e.id).lang === lang);
  return all
    .map(toPreview)
    .filter(isPublic)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

/** Every article including drafts — for build-time checks only, never for rendering. */
export async function getAllResourcesIncludingDrafts(lang: Lang): Promise<ResourcePreview[]> {
  const all = await getCollection('resources', (e) => splitId(e.id).lang === lang);
  return all.map(toPreview).sort((a, b) => b.date.getTime() - a.date.getTime());
}

/** The n most recent articles — used on the homepage. */
export async function getResourcePreviews(lang: Lang, n: number): Promise<ResourcePreview[]> {
  return (await getResources(lang)).slice(0, n);
}

/** The n most recent articles of one category. */
export async function getResourcesByCategory(
  lang: Lang,
  category: ResourcePreview['category'],
  n: number,
): Promise<ResourcePreview[]> {
  return (await getResources(lang)).filter((r) => r.category === category).slice(0, n);
}
