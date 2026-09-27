export const contact = {
  seo: {
    title: 'Contact Lagni Consulting — training, ERP and recruitment enquiries',
    description:
      'Training, ERP & Solutions, recruitment or an institutional partnership: choose what you need and let’s talk about your objectives.',
  },

  hero: {
    eyebrow: 'Contact',
    title: 'Let’s talk about your project.',
    lead: 'Training, ERP & Solutions, recruitment or a partnership with an institution: choose what you need and let’s talk about your objectives.',
    markets: ['Canada', 'Europe', 'Africa'],
    imageAlt: 'Professional desk with a laptop and a notebook',
    script: 'From today’s conversations to tomorrow’s opportunities.',
    ctaPrimary: 'Choose my request',
    matchLabel: 'Your request',
    matchTitle: 'One point of contact',
    profileBadge: '1–2',
    profileLabel: 'Response time',
    profileTitle: 'business days',
  },

  chooser: {
    eyebrow: 'Your need',
    title: 'How can we help?',
    lead: 'Choose the type of request that best matches your need.',
    options: [
      {
        id: 'formation',
        icon: 'cap',
        lord: 'cap',
        label: 'Training',
        body: 'I would like to train, or to get information about a programme.',
        formTitle: 'Contact form — Training',
      },
      {
        id: 'formation-entreprise',
        icon: 'people',
        lord: 'mentor',
        label: 'Corporate training',
        body: 'We want to build our teams’ skills.',
        formTitle: 'Contact form — Corporate training',
      },
      {
        id: 'erp',
        icon: 'gear',
        lord: 'server',
        label: 'ERP & Solutions',
        body: 'We have a need around SAP, JDE, Odoo, HighLevel, Chataap or a transformation project.',
        formTitle: 'Contact form — ERP & Solutions',
      },
      {
        id: 'recrutement',
        icon: 'search',
        lord: 'search',
        label: 'Recruitment',
        body: 'We are looking for a specialized professional.',
        formTitle: 'Contact form — Recruitment',
      },
      {
        id: 'etablissement',
        icon: 'school',
        lord: 'school',
        label: 'Educational institution',
        body: 'We would like to discuss training or a partnership.',
        formTitle: 'Contact form — Educational institution',
      },
      {
        id: 'autre',
        icon: 'doc',
        lord: 'conversation',
        label: 'Something else',
        body: 'My request does not fit any of the categories above.',
        formTitle: 'Contact form',
      },
    ],
    legend: 'Type of request',
    formEyebrow: 'Form',
    formIntro: 'Fill in the details below so we can understand your request properly.',
  },

  cvCallout: {
    title: 'Would you like to submit your résumé?',
    body: 'Join our network of professionals in ERP, CRM, project management, supply chain and digital transformation.',
    cta: 'Submit my application',
  },

  details: {
    title: 'Our details',
    responseTitle: 'Response times',
    responseBody: 'We usually reply to professional enquiries within one to two business days.',
    linkedinLabel: 'Follow us on LinkedIn',
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Frequently asked questions',
    lead: 'Quick answers to the questions we hear most often.',
    items: [
      {
        q: 'Can I take the SAP PP training remotely?',
        a: 'Yes. Sessions are delivered remotely, live with the trainer. On-site delivery can be arranged for a group or an institution.',
      },
      {
        q: 'Do you work outside Canada?',
        a: 'Yes. Lagni Consulting works with professionals and organizations in Canada, Europe and Africa. Remote training is accessible from all of these markets.',
      },
      {
        q: 'Do you work with educational institutions?',
        a: 'Yes. We offer a programme that adapts to supply chain, production management, industrial engineering and operations curricula — as a complementary course, a dedicated cohort or an intensive format.',
      },
      {
        q: 'How do I submit my application?',
        a: 'Use the candidate form on the Recruitment page. It lets you share your résumé and areas of expertise confidentially.',
      },
    ],
  },

  quote: 'Concrete projects often start with a simple conversation.',

  pillars: [
    { icon: 'cap', label: 'Skills' },
    { icon: 'people', label: 'Opportunities' },
    { icon: 'chart', label: 'Future' },
  ],

  finalCta: {
    title: 'Let’s start by understanding what you need.',
    body: 'Training, ERP, recruitment or partnership — get in touch with Lagni Consulting.',
    cta: 'Discuss your project',
    script: 'Train. Support. Connect.',
  },
} as const;
