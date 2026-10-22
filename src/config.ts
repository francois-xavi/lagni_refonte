/**
 * Site-wide configuration.
 *
 * Forms post to form-service/ via /api/form; see CONTENT-TO-REPLACE.md for the
 * checks still owed before launch.
 */

/**
 * Destination for every contact/application form POST: form-service/, routed at
 * /api/form on the production domain. Demo builds (sub-path) have no backend.
 */
export const FORM_ENDPOINT =
  import.meta.env.BASE_URL === '/' ? '/api/form' : 'REPLACE_ME__FORM_ENDPOINT';

/** True once a real endpoint has been configured. */
export const FORM_CONFIGURED = !FORM_ENDPOINT.startsWith('REPLACE_ME');

export const SITE_URL = 'https://lagniconsulting.ca';

/**
 * Verified contact details only — no residential or unconfirmed address.
 * The values live in src/content/settings/site.json so the dashboard can edit
 * them; this re-export keeps every existing import working unchanged.
 */
export { CONTACT } from './lib/settings';
