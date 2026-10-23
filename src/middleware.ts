import { defineMiddleware } from 'astro:middleware';
import { ensureContent, loadDraft } from './lib/payload';
import { withDraft } from './lib/copy';

/**
 * Page cache.
 *
 * Rendering a page costs about 4 ms, and serving it from here about 2.5 ms,
 * both measured. So this is not what makes the site fast — it is what keeps
 * the CMS out of the hot path: a published page is rendered once and then
 * served from memory, so a burst of traffic does not become a burst of
 * queries.
 *
 * Invalidation is explicit, not time-based. The CMS calls POST /api/flush when
 * the client publishes, so a change is live immediately and nothing goes stale
 * in between. A short TTL exists only as a safety net in case that call is
 * ever missed.
 *
 * The cache lives in this process. Two instances behind a load balancer would
 * each keep their own, which is fine: they converge on the next flush. If the
 * site is ever scaled out, move this to Redis rather than shortening the TTL.
 */

interface Entry {
  body: string;
  status: number;
  headers: [string, string][];
  at: number;
}

const cache = new Map<string, Entry>();

/** Safety net only — the real invalidation is the publish webhook. */
const MAX_AGE_MS = 15 * 60_000;
/** Bounded so an attacker cannot grow it with junk query strings. */
const MAX_ENTRIES = 200;

export function flush(): number {
  const n = cache.size;
  cache.clear();
  return n;
}

export function stats() {
  return { entries: cache.size };
}

/** Preview renders unpublished content and must never be cached or shared. */
const isPreview = (request: Request) =>
  /(?:^|;\s*)lagni_preview=1/.test(request.headers.get('cookie') ?? '');

const previewToken = (request: Request): string => {
  const m = /(?:^|;\s*)lagni_preview_token=([^;]*)/.exec(request.headers.get('cookie') ?? '');
  return m ? decodeURIComponent(m[1]) : '';
};

const cacheable = (pathname: string) =>
  !pathname.startsWith('/api/') && !pathname.startsWith('/_');

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context;

  // Loaded once, before anything renders, so usePages() can stay synchronous
  // and no component has to change.
  await ensureContent();

  if (isPreview(request)) {
    // Drafts are fetched per request and kept in an async-local store, so the
    // unpublished text reaches this visitor and nobody else. Never cached.
    const draft = await loadDraft(previewToken(request));
    const response = draft ? await withDraft(draft, () => next()) : await next();
    response.headers.set('x-robots-tag', 'noindex, nofollow');
    response.headers.set('cache-control', 'no-store');
    response.headers.set('x-preview', draft ? 'draft' : 'published-fallback');
    return response;
  }

  if (request.method !== 'GET' || !cacheable(url.pathname)) {
    return next();
  }

  const key = url.pathname + url.search;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < MAX_AGE_MS) {
    return new Response(hit.body, {
      status: hit.status,
      headers: [...hit.headers, ['x-cache', 'hit']],
    });
  }

  const response = await next();
  const type = response.headers.get('content-type') ?? '';
  if (response.status !== 200 || !type.includes('text/html')) return response;

  const body = await response.text();
  if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value!);
  cache.set(key, {
    body,
    status: response.status,
    headers: [...response.headers.entries()],
    at: Date.now(),
  });

  return new Response(body, {
    status: response.status,
    headers: [...response.headers.entries(), ['x-cache', 'miss']],
  });
});
