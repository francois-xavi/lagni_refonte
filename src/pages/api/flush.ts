import type { APIRoute } from 'astro';
import { flush, stats } from '../../middleware';

/**
 * Empties the page cache. The CMS calls this when the client publishes, which
 * is what makes a change appear immediately without a rebuild.
 *
 * Protected by a shared secret: without it the endpoint would let anyone force
 * every page to re-render on demand, which is a cheap way to load the server.
 *
 * Two things the webhook has to get right, both found the hard way:
 *
 *  - the URL is `/api/flush/`, **with** the trailing slash. `trailingSlash:
 *    'always'` applies to endpoints too, and without it Astro answers 200 with
 *    an empty body instead of routing here — a silent no-op.
 *  - send `content-type: application/json`. Astro's CSRF check rejects POSTs
 *    that look like form submissions from another origin, which is exactly
 *    what a webhook looks like; a JSON body is not subject to it.
 */
const SECRET = import.meta.env.FLUSH_SECRET ?? process.env.FLUSH_SECRET ?? '';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(stats()), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export const POST: APIRoute = async ({ request }) => {
  const given = request.headers.get('x-flush-secret') ?? '';
  if (!SECRET || given !== SECRET) {
    return new Response('forbidden', { status: 403, headers: { 'cache-control': 'no-store' } });
  }
  const cleared = flush();
  return new Response(JSON.stringify({ cleared }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};
