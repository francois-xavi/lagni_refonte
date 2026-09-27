/**
 * Site-wide configuration.
 *
 * ⚠ BEFORE LAUNCH: set FORM_ENDPOINT to the real form provider URL.
 * See CONTENT-TO-REPLACE.md.
 */

/** Destination for every contact/application form POST. */
export const FORM_ENDPOINT = 'REPLACE_ME__FORM_ENDPOINT';

/** True once a real endpoint has been configured. */
export const FORM_CONFIGURED = !FORM_ENDPOINT.startsWith('REPLACE_ME');

export const SITE_URL = 'https://lagniconsulting.ca';

/** Verified contact details only — no residential or unconfirmed address. */
export const CONTACT = {
  email: 'info@lagniconsulting.ca',
  phone: '+1 418 570 0429',
  phoneDisplay: '+1 418 570 0429',
  locality: 'Québec, Canada',
  linkedin: 'https://www.linkedin.com/company/lagni-consulting/',
} as const;
