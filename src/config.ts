/**
 * Site-wide configuration.
 */

/**
 * Where form submissions go.
 *
 *  - 'netlify' — Netlify Forms. Nothing else to configure: Netlify's build bot
 *    detects each form from the static HTML (it needs `data-netlify`, a `name`
 *    attribute and a hidden `form-name` field — all emitted by FormShell.astro).
 *    Submissions land in the Netlify dashboard; set up email notifications
 *    under Site settings → Forms → Form notifications.
 *  - 'custom'  — POST to FORM_ENDPOINT below (Formspree, a Make webhook, …).
 *  - 'none'    — no backend. Every form then shows a visible notice telling the
 *    visitor to email us instead, so nothing is silently lost.
 */
export const FORM_PROVIDER: 'netlify' | 'custom' | 'none' = 'netlify';

/** Only used when FORM_PROVIDER is 'custom'. */
export const FORM_ENDPOINT = '';

export const FORM_CONFIGURED =
  FORM_PROVIDER === 'netlify' || (FORM_PROVIDER === 'custom' && FORM_ENDPOINT.length > 0);

export const SITE_URL = 'https://lagniconsulting.ca';

/**
 * Where form submissions are stored, named in the privacy policy.
 * Netlify processes and stores submissions on servers in the United States —
 * this must stay disclosed as long as FORM_PROVIDER is 'netlify'.
 */
export const FORM_PROCESSOR = {
  name: 'Netlify',
  region: 'États-Unis',
  regionEn: 'United States',
} as const;

/** Verified contact details only — no residential or unconfirmed address. */
export const CONTACT = {
  email: 'info@lagniconsulting.ca',
  phone: '+1 418 570 0429',
  phoneDisplay: '+1 418 570 0429',
  locality: 'Québec, Canada',
  linkedin: 'https://www.linkedin.com/company/lagni-consulting/',
} as const;

/** Maximum résumé upload, mirrored in src/scripts/form.ts. */
export const MAX_UPLOAD_MB = 5;
