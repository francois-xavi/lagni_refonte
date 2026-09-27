export const resources = {
  seo: {
    title: 'Resources — SAP S/4HANA, ERP and skills | Lagni Consulting',
    description:
      'Analysis, guides and practical content on ERP systems, SAP S/4HANA, Production Planning, digital transformation and careers.',
  },

  hero: {
    eyebrow: 'Resources',
    title: 'Understand the systems. Build the skills.',
    lead: 'Analysis, guides and practical content on ERP systems, SAP S/4HANA, Production Planning, digital transformation and careers.',
    cta: 'Explore the resources',
    imageAlt: 'Professional reading reference material on a laptop',
    script: 'Learn today. Build tomorrow.',
    panel: ['ERP', 'Processes', 'Skills', 'Opportunities'],
    trustItems: [
      { icon: 'layers', label: 'ERP & SAP S/4HANA' },
      { icon: 'book', label: 'Practical guides' },
      { icon: 'target', label: 'Beginner to advanced' },
    ],
    matchLabel: 'Themes',
    matchTitle: 'Practical content',
    profileBadge: '5',
    profileLabel: 'Categories',
    profileTitle: 'of resources',
  },

  categories: {
    eyebrow: 'Themes',
    title: 'Our resource categories',
    lead: 'Browse our content by theme.',
    items: [
      {
        id: 'sap-pp',
        icon: 'chart',
        lord: 'server',
        label: 'SAP S/4HANA & PP',
        body: 'MRP, production, master data, production orders, MTS/MTO, certification.',
      },
      {
        id: 'erp',
        icon: 'gear',
        lord: 'tools',
        label: 'ERP & business processes',
        body: 'ERP, manufacturing, supply chain, end-to-end processes, testing, migration.',
      },
      {
        id: 'tools',
        icon: 'screen',
        lord: 'monitor',
        label: 'Tools & solutions',
        body: 'Odoo, HighLevel, Chataap and other solutions Lagni covers.',
      },
      {
        id: 'careers',
        icon: 'people',
        lord: 'briefcase',
        label: 'Careers & skills',
        body: 'ERP roles, career changes, skills, certification, project management.',
      },
      {
        id: 'teaching',
        icon: 'cap',
        lord: 'school',
        label: 'Training & teaching',
        body: 'SAP in academic programmes, ERP pedagogy, preparing students.',
      },
    ],
    allLabel: 'All categories',
    filterLegend: 'Filter by category',
    levelLegend: 'Filter by level',
    noResults: 'No resources match this filter yet.',
  },

  levels: {
    all: 'All levels',
    debutant: 'Beginner',
    intermediaire: 'Intermediate',
    avance: 'Advanced',
  },

  start: {
    title: 'Where should you start?',
    items: [
      { level: 'debutant', icon: 'bulb', lord: 'book', title: 'Beginner', body: 'The basics, the concepts and the main processes.' },
      {
        level: 'intermediaire',
        icon: 'chart',
        lord: 'checklist',
        title: 'Intermediate',
        body: 'Go deeper into the functionality and the scenarios.',
      },
      {
        level: 'avance',
        icon: 'gear',
        lord: 'experience',
        title: 'Advanced',
        body: 'End-to-end scenarios, integrations and optimization.',
      },
    ],
  },

  featured: {
    eyebrow: 'SAP PP guide',
    title: 'What is SAP S/4HANA Production Planning?',
    body: 'Understand the role of SAP PP, its main processes and where it sits in industrial management.',
    chain: ['Demand', 'MRP', 'Capacity', 'Production order', 'Execution', 'Receipt'],
    ctaPrimary: 'Read the guide',
    ctaSecondary: 'Explore the SAP PP training',
    imageAlt: 'Planner reviewing a production dashboard on a tablet in a factory',
  },

  list: {
    eyebrow: 'Library',
    title: 'Latest resources',
    lead: 'Our most recent articles, guides and analysis.',
    all: 'See all resources',
    draftLabel: 'Draft',
    draftNote:
      'Items marked “Draft” were written as a working basis and need review and sign-off before publication.',
  },

  certificationNote:
    'Our resources build an understanding of SAP processes; they are not a certification. SAP certifications are issued exclusively by SAP, under its own terms and exams.',

  videos: {
    eyebrow: 'Video',
    title: 'Learn on video too',
    lead: 'Our series: SAP S/4HANA — One Scope Item at a Time.',
    placeholder:
      'The video series will appear here. Add the YouTube links listed in CONTENT-TO-REPLACE.md once the videos are online.',
  },

  teaching: {
    eyebrow: 'Teaching',
    title: 'Do you teach supply chain or production management?',
    body: 'Explore our teaching resources and our approach to bringing ERP processes into academic programmes.',
    ctaPrimary: 'Teaching resources',
    ctaSecondary: 'See our offer for institutions',
  },

  article: {
    backToList: 'Back to resources',
    publishedOn: 'Published on',
    relatedTitle: 'Read next',
    relatedEyebrow: 'Resources',
    relatedLead: 'Continue with these related pieces.',
    ctaEyebrow: 'Next step',
    ctaLabels: {
      sapPp: 'Explore the SAP PP training',
      training: 'Explore our training',
      erp: 'Explore ERP & Solutions',
      recruitment: 'Explore recruitment',
      institutions: 'See our offer for institutions',
    },
    ctaTitle: 'Go further',
    ctaBody: 'Take the subject further with a structured programme and ongoing support.',
    draftNotice:
      'This content is a draft written as a working basis. It must be reviewed and approved by Lagni Consulting before publication.',
  },

  finalCta: {
    title: 'Keep learning.',
    body: 'Explore our content on SAP, ERP systems, business processes and digital skills.',
    cta: 'Explore all resources',
    script: 'Today’s knowledge for tomorrow’s opportunities.',
  },
} as const;
