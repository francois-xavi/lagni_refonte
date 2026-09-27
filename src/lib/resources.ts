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

/** All articles for a language, newest first. */
export async function getResources(lang: Lang): Promise<ResourcePreview[]> {
  const all = await getCollection('resources', (e) => splitId(e.id).lang === lang);
  return all
    .map(toPreview)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
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
