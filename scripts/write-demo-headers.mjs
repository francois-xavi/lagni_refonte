// Writes Cloudflare Pages `_headers` for the demo build only (npm run build:demo).
// It is deliberately not in public/: production is hosted elsewhere and must
// never ship the demo's noindex header.
import { writeFileSync } from 'node:fs';

const headers = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  X-Robots-Tag: noindex, nofollow

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
`;

writeFileSync(new URL('../dist/_headers', import.meta.url), headers);
console.log('dist/_headers written (demo build)');
