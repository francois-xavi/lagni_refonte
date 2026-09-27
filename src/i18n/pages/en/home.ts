export const home = {
  seo: {
    title: 'Lagni Consulting — Training, ERP & Solutions, specialized recruitment',
    description:
      'Lagni Consulting works with professionals, educational institutions and companies: SAP S/4HANA training, ERP and CRM expertise, and recruitment of specialized talent.',
  },

  hero: {
    eyebrow: 'Specialized recruitment · Quebec & international',
    title: 'Specialized talent for\nambitious organizations.',
    lead: 'Lagni Consulting connects organizations with hard-to-find enterprise software experts and guides international professionals toward opportunities that fit.',
    ctaPrimary: 'Hire an expert',
    ctaSecondary: 'Discover Lagni',
    trustItems: [
      { label: 'Business expertise', icon: 'briefcase' },
      { label: 'International outlook', icon: 'globe' },
      { label: 'Human support', icon: 'handshake' },
    ],
    imageAlt: 'Team collaborating on a technology project',
    matchLabel: 'Specialized matching',
    matchBody: 'Expertise · context · potential',
    matchPills: ['Expertise', 'Context', 'Potential'],
    profileLabel: 'Recommended profile',
    profileRole: 'ERP Consultant',
    profileStatus: 'Available',
    valueLine: 'The right profile.\nAt the right time.',
  },

  pillars: {
    eyebrow: 'The three pillars',
    title: 'A clear platform to move forward.',
    lead: 'Understand processes, build skills, and connect the right talent.',
    items: [
      {
        title: 'Training',
        body: 'Build skills that make a difference, with a practice-led approach rooted in business processes and enterprise technology.',
        cta: 'Discover',
        route: 'training',
        icon: 'cap',
      },
      {
        title: 'ERP & Solutions',
        body: 'Your systems should serve your processes — not the other way around. Structured project expertise from analysis through adoption.',
        cta: 'Discover',
        route: 'erp',
        icon: 'layers',
      },
      {
        title: 'Specialized recruitment',
        body: 'The right skills. The right opportunities. Profiles that understand both the technology and the business process.',
        cta: 'Discover',
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

  companies: {
    eyebrow: 'Companies',
    title: 'Planning a transformation, or short on specific skills?',
    body: 'Whether you need to train your teams, get support on a project, or find specialized profiles, let’s talk through your context and your objectives.',
    cta: 'Discuss your project',
    cards: [
      { title: 'Train your teams', body: 'Build ERP and digital skills.', icon: 'people' },
      {
        title: 'Support your project',
        body: 'ERP, CRM, processes, testing and adoption.',
        icon: 'chart',
      },
      { title: 'Find talent', body: 'Identify specialized professionals.', icon: 'search' },
    ],
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
