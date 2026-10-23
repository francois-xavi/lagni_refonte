import type { GlobalAfterChangeHook } from 'payload'

/**
 * Tells the website to drop its caches when content is published.
 *
 * Without this the site keeps serving what it rendered before, for up to the
 * fifteen minutes of its safety-net TTL. With it, publishing is immediate —
 * which is the whole point of leaving the "publish = git commit" model behind.
 *
 * Two details the site's endpoint demands, both found the hard way and
 * recorded in src/pages/api/flush.ts:
 *
 *  - the trailing slash. `trailingSlash: 'always'` applies to endpoints too,
 *    and `/api/flush` without it answers 200 with an empty body — a silent
 *    no-op that would look like success here.
 *  - `content-type: application/json`. Astro's CSRF check rejects POSTs that
 *    look like a cross-origin form submission, which is exactly what this is.
 */

const SITE_URL = process.env.SITE_URL ?? 'http://localhost:4333'
const FLUSH_SECRET = process.env.FLUSH_SECRET ?? ''

const published = (doc: unknown): boolean =>
  !!doc && typeof doc === 'object' && (doc as { _status?: string })._status === 'published'

/**
 * Fires on publish, and on unpublish too: taking a page down has to reach the
 * site just as much as putting one up. A draft save does not fire — autosave
 * would otherwise flush the cache on every keystroke.
 */
export const shouldNotify = (doc: unknown, previousDoc: unknown): boolean =>
  published(doc) || published(previousDoc)

export const notifySite: GlobalAfterChangeHook = ({ doc, previousDoc, global }) => {
  if (!shouldNotify(doc, previousDoc)) return doc

  if (!FLUSH_SECRET) {
    console.warn('[publication] FLUSH_SECRET absent : le site ne sera pas prévenu.')
    return doc
  }

  // Deliberately not awaited: the editor's save must not wait on the website,
  // nor fail if it is down. The site's TTL is the fallback if this never
  // lands, so a miss costs freshness, never correctness.
  void fetch(`${SITE_URL}/api/flush/`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-flush-secret': FLUSH_SECRET },
    body: JSON.stringify({ global: global.slug }),
    signal: AbortSignal.timeout(5000),
  })
    .then((res) =>
      res.ok
        ? console.log(`[publication] ${global.slug} : site prévenu`)
        : console.warn(`[publication] ${global.slug} : le site a répondu ${res.status}`),
    )
    .catch((err) => console.warn(`[publication] ${global.slug} : site injoignable (${err.message})`))

  return doc
}
