import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_URL } from '../config';
import { HREFLANG, LANGS, ROUTES, routePath, type Lang } from '../i18n/routes';

/**
 * Sitemap, generated from the route table instead of from the built pages.
 *
 * `@astrojs/sitemap` walked `dist/` and needed the excluded paths repeated as
 * regular expressions in `astro.config.mjs` — a second copy of `ressources`,
 * `merci` and `thank-you` that could drift from `routes.ts`. Server rendering
 * removes that `dist/`, and building the sitemap here removes the duplication:
 * `routes.ts` is the only place a URL is written.
 */

/** Pages a crawler should not index: thank-you confirmations and the 404. */
const EXCLUDED = new Set(['thanks']);

const abs = (path: string) => new URL(path, SITE_URL).toString();

const entry = (path: string, alternates: { hreflang: string; path: string }[]) =>
  `  <url>
    <loc>${abs(path)}</loc>
${alternates
  .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${abs(a.path)}" />`)
  .join('\n')}
  </url>`;

export const GET: APIRoute = async () => {
  const urls: string[] = [];

  for (const route of ROUTES) {
    if (EXCLUDED.has(route.key)) continue;
    const alternates = LANGS.map((l) => ({
      hreflang: HREFLANG[l],
      path: routePath(route.key, l),
    }));
    for (const lang of LANGS) urls.push(entry(routePath(route.key, lang), alternates));
  }

  // Articles: only published ones are routed, so only those are listed.
  for (const lang of LANGS) {
    const published = await getCollection(
      'resources',
      (e) => e.id.startsWith(`${lang}/`) && e.data.status === 'published',
    );
    for (const item of published) {
      const slug = item.id.slice(lang.length + 1);
      const other: Lang = lang === 'fr' ? 'en' : 'fr';
      const twin = await getCollection(
        'resources',
        (e) => e.id === `${other}/${slug}` && e.data.status === 'published',
      );
      const self = `${routePath('resources', lang)}${slug}/`;
      const alternates = [
        { hreflang: HREFLANG[lang], path: self },
        ...(twin.length
          ? [{ hreflang: HREFLANG[other], path: `${routePath('resources', other)}${slug}/` }]
          : []),
      ];
      urls.push(entry(self, alternates));
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};
