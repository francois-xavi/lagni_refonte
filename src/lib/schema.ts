/**
 * JSON-LD builders.
 *
 * Only facts that are verifiable from the repository or the client brief are
 * emitted. No founding date, employee count, award, rating or partnership is
 * asserted. FAQPage is emitted only by pages that actually render an FAQ.
 */
import { SITE_URL, CONTACT } from '../config';
import { href, type Lang } from '../i18n/routes';

export function organizationSchema(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Lagni Consulting',
    url: SITE_URL,
    logo: `${SITE_URL}/assets/images/logo.png`,
    email: CONTACT.email,
    telephone: CONTACT.phone,
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Québec',
      addressCountry: 'CA',
    },
    sameAs: [CONTACT.linkedin],
    description:
      lang === 'fr'
        ? 'Formation, expertise ERP et CRM, et recrutement spécialisé.'
        : 'Training, ERP and CRM expertise, and specialized recruitment.',
  };
}

export function websiteSchema(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Lagni Consulting',
    url: new URL(href('home', lang), SITE_URL).toString(),
    inLanguage: lang === 'fr' ? 'fr-CA' : 'en-CA',
  };
}

export function faqSchema(items: readonly { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.path, SITE_URL).toString(),
    })),
  };
}
