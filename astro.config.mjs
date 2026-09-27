// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lagniconsulting.ca',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // Article pages are drafts pending client review: they are noindex, so
      // they must not appear in the sitemap either. Remove this filter once
      // articles are marked `status: 'published'`.
      filter: (page) =>
        !/\/(ressources|en\/resources)\/[^/]+\/$/.test(new URL(page).pathname) &&
        !/\/404\/?$/.test(new URL(page).pathname) &&
        !/\/(merci|en\/thank-you)\/$/.test(new URL(page).pathname),
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-CA', en: 'en-CA' },
      },
    }),
  ],
});
