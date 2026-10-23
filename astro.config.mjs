// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://lagniconsulting.ca',
  // Production serves from the root. Demo builds set SITE_BASE (see
  // `npm run build:demo`); every internal URL goes through src/lib/url.ts.
  base: process.env.SITE_BASE || '/',
  // Server rendered: content comes from the CMS per request, so there is no
  // build step to re-run when the client publishes.
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  /**
   * Astro's HTML compressor strips the whitespace between sibling elements, so
   * a heading and its paragraph serialize as "TitreTexte" in copy-paste,
   * crawlers and reading modes even though they render on separate lines.
   * Keeping the whitespace costs a few KB before gzip and fixes every
   * occurrence at the source.
   */
  compressHTML: false,
  trailingSlash: 'always',
  build: { format: 'directory' },
});
