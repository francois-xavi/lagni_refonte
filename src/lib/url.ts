/**
 * Base-path helpers.
 *
 * Production serves from the domain root, but demo builds are published under
 * a sub-path (`SITE_BASE=/d/lagniconsulting`, see `npm run build:demo`). Every
 * root-relative URL the site emits goes through `withBase` so both builds work.
 * SEO URLs (canonical, hreflang) always use the base-less path via `stripBase`,
 * so they point at the real domain whatever the build.
 */

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Is this build published under a sub-path (i.e. a demo)? */
export const HAS_BASE = BASE !== '';

/** Prefix a root-relative path with the base. Idempotent; leaves absolute URLs alone. */
export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (!HAS_BASE) return path;
  if (path === BASE || path.startsWith(`${BASE}/`)) return path;
  return `${BASE}${path}`;
}

/** Remove the base from a path produced by `withBase`. */
export function stripBase(path: string): string {
  if (!HAS_BASE) return path;
  if (path === BASE) return '/';
  return path.startsWith(`${BASE}/`) ? path.slice(BASE.length) : path;
}
