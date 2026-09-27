export const thanks = {
  seo: {
    title: 'Thank you — your request has been sent | Lagni Consulting',
    description: 'Your request has been sent to Lagni Consulting.',
  },
  title: 'Thank you — your request has been sent.',
  lead: 'We have received your message and will get back to you shortly.',
  nextTitle: 'What happens next?',
  next: [
    'We usually reply to professional enquiries within one to two business days.',
    'Depending on your request, we will send you the syllabus, propose a call, or share further information.',
    'If your request is urgent, you can write to us directly.',
  ],
  exploreTitle: 'In the meantime, explore',
  explore: [
    { route: 'sapPp', label: 'The SAP S/4HANA Production Planning training' },
    { route: 'erp', label: 'Our ERP & Solutions expertise' },
    { route: 'resources', label: 'Our resources and guides' },
  ],
  backHome: 'Back to home',
} as const;

export const notFound = {
  seo: {
    title: 'Page not found — Lagni Consulting',
    description: 'The page you requested does not exist or has been moved.',
  },
  code: '404',
  title: 'We can’t find that page.',
  lead: 'The page you are looking for does not exist, or it was moved when the site was rebuilt.',
  suggestionsTitle: 'Here are a few places to go',
  backHome: 'Back to home',
  contact: 'Contact us',
} as const;
