export const home = {
  seo: {
    title: 'Lagni Consulting — Training, ERP & Solutions, specialized recruitment',
    description:
      'Lagni Consulting works with professionals, educational institutions and companies: SAP S/4HANA training, ERP and CRM expertise, and recruitment of specialized talent.',
  },

  hero: {
    eyebrow: 'Train. Support. Connect.',
    title: 'SAP training, ERP projects and specialized recruitment.',
    lead: 'We train professionals on SAP S/4HANA, support organizations through ERP and CRM projects, and find the specialized profiles that make them succeed.',
    ctaPrimary: 'Discuss your project',
    ctaSecondary: 'See the SAP PP training',
    trustItems: [
      { label: 'Hands-on ERP expertise', icon: 'briefcase' },
      { label: 'Quebec · Europe · Africa', icon: 'globe' },
      { label: 'Human support', icon: 'handshake' },
    ],
    imageAlt: 'Team collaborating on a technology project',
    valueLine: 'Processes first.\nTechnology second.',
  },

  pillars: {
    eyebrow: 'Our services',
    title: 'Three ways we can help.',
    lead: 'Pick the starting point that matches what you need.',
    audienceLabel: 'For',
    items: [
      {
        title: 'Learn SAP and ERP',
        body: 'Practical training built around business processes. Flagship course: SAP S/4HANA Production Planning.',
        audience: 'Professionals, students and corporate teams',
        cta: 'See the training',
        route: 'training',
        icon: 'cap',
      },
      {
        title: 'Deliver an ERP or CRM project',
        body: 'From needs analysis to user adoption, on SAP, JD Edwards, Odoo and CRM solutions.',
        audience: 'Companies and organizations',
        cta: 'See the ERP offer',
        route: 'erp',
        icon: 'layers',
      },
      {
        title: 'Hire a specialized profile',
        body: 'ERP, CRM and digital transformation profiles who understand both the technology and the business process.',
        audience: 'Hiring companies and candidates',
        cta: 'See recruitment',
        route: 'recruitment',
        icon: 'people',
      },
    ],
  },

  credibility: {
    label: 'Proof of expertise',
    items: [
      { figure: '15+', label: 'Years of ERP experience', icon: 'chart' },
      { figure: 'SAP', label: 'S/4HANA Production Planning', icon: 'database' },
      { figure: 'JDE', label: 'Oracle JD Edwards', icon: 'network' },
      { figure: 'PMP®', label: 'Project management', icon: 'badge' },
    ],
    footnote:
      'Expertise built on real ERP projects, from implementation through to user adoption.',
  },

  sapFocus: {
    eyebrow: 'Featured training',
    title: 'SAP S/4HANA Production Planning training',
    tagline: 'Understand the processes. Practise inside SAP.',
    lead: 'Build a sought-after skill in production management.',
    body: 'A structured programme that builds concrete understanding of the core production planning and execution processes in SAP S/4HANA.',
    topics: [
      'Master data',
      'Demand Management',
      'MRP',
      'Capacity Planning',
      'Production Orders',
      'MTS',
      'MTO',
      'Discrete Manufacturing',
    ],
    cta: 'Explore the SAP PP training',
    imageAlt: 'Consultant working across two screens showing an SAP production planning module',
  },

  institutions: {
    eyebrow: 'Educational institutions',
    title: 'Bring ERP skills into your programmes',
    body: 'Are you a school, university or training organization? Lagni Consulting works with institutions that want to enrich their production management, supply chain, industrial engineering and operations programmes with practical ERP training.',
    features: [
      { label: 'Adaptable programme', icon: 'calendar' },
      { label: 'Remote or on your campus', icon: 'screen' },
      { label: 'Hands-on exercises', icon: 'gear' },
      { label: 'Teaching support', icon: 'people' },
    ],
    cta: 'See our offer for institutions',
    imageAlt: 'Instructor presenting an ERP process to a group of students',
  },

  about: {
    eyebrow: 'About Lagni Consulting',
    title: 'Train. Support. Connect.',
    body: 'Technology creates value when people know how to use it. Lagni Consulting supports professionals, organizations and institutions with expertise in ERP, training and recruitment.',
    signatureName: 'Romuald Monthé Kaméni, Jr. Eng.',
    signatureRole: 'Founder · PMP®',
    cta: 'Learn more',
    imageAlt: 'Portrait of Romuald Monthé Kameni, founder of Lagni Consulting',
  },

  resources: {
    eyebrow: 'Resources',
    title: 'Our latest resources',
    lead: 'Articles, guides and practical advice on ERP systems, training and careers.',
    cta: 'See all resources',
  },

  finalCta: {
    title: 'Let’s move your next project forward.',
    body: 'Training, ERP/CRM transformation or specialized recruitment — tell us what you need.',
    cta: 'Contact us',
    script: 'Skills in the service of a better future.',
  },
} as const;
