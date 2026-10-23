import type { APIRoute } from 'astro';
import crypto from 'node:crypto';

/**
 * Opens a preview session.
 *
 * Payload builds this URL from the document being edited and hands it the
 * editor's own token. We check the shared secret, drop two cookies and send
 * the browser to the page: from then on the middleware renders drafts instead
 * of published content, for this visitor only.
 *
 *   /api/preview/?secret=…&path=/formations/&token=…
 *   /api/preview/?exit=1            ends the session
 */

const SECRET = import.meta.env.PREVIEW_SECRET ?? process.env.PREVIEW_SECRET ?? '';

/** Timing-safe, and length-safe: timingSafeEqual throws on different lengths. */
function sameSecret(given: string): boolean {
  if (!SECRET || !given) return false;
  const a = crypto.createHash('sha256').update(given).digest();
  const b = crypto.createHash('sha256').update(SECRET).digest();
  return crypto.timingSafeEqual(a, b);
}

/**
 * Only a path on this site, never an absolute URL.
 *
 * Without this the endpoint is an open redirect: anyone could send
 * `?path=https://ailleurs` and borrow our domain's reputation to bounce
 * visitors elsewhere. `//host` is rejected too — browsers read it as
 * protocol-relative and would leave the site.
 */
function safePath(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/';
  try {
    // Reject anything that parses as having an authority component.
    const url = new URL(raw, 'http://local');
    return url.pathname + url.search;
  } catch {
    return '/';
  }
}

const cookie = (name: string, value: string, maxAge: number, secure: boolean) =>
  `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}` +
  (secure ? '; Secure' : '');

export const GET: APIRoute = ({ url, request }) => {
  const secure = request.headers.get('x-forwarded-proto') === 'https';

  if (url.searchParams.has('exit')) {
    return new Response(null, {
      status: 303,
      headers: [
        ['location', safePath(url.searchParams.get('path'))],
        ['cache-control', 'no-store'],
        ['set-cookie', cookie('lagni_preview', '', 0, secure)],
        ['set-cookie', cookie('lagni_preview_token', '', 0, secure)],
      ],
    });
  }

  if (!sameSecret(url.searchParams.get('secret') ?? '')) {
    return new Response('forbidden', { status: 403, headers: { 'cache-control': 'no-store' } });
  }

  const token = url.searchParams.get('token') ?? '';
  const hour = 60 * 60;

  return new Response(null, {
    status: 303,
    headers: [
      ['location', safePath(url.searchParams.get('path'))],
      ['cache-control', 'no-store'],
      ['set-cookie', cookie('lagni_preview', '1', hour, secure)],
      ['set-cookie', cookie('lagni_preview_token', encodeURIComponent(token), hour, secure)],
    ],
  });
};
