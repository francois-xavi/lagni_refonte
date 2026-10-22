export const sapPp = {
  seo: {
    title: 'SAP S/4HANA Production Planning (PP) training — Lagni Consulting',
    description:
      'A {hours}-hour programme across {sessions} sessions to understand and practise production planning and execution processes in SAP S/4HANA.',
  },

  hero: {
    eyebrow: 'SAP S/4HANA training',
    title: 'Master SAP S/4HANA Production Planning',
    lead: 'Understand the planning and execution processes behind production. Practise inside SAP. Prepare your professional progression and your certification path.',
    meta: [
      { label: '{hours} hours', sub: 'of training', icon: 'clock' },
      { label: '{sessions} sessions', sub: '× {sessionHours} hours', icon: 'calendar' },
      { label: 'Hands-on exercises', sub: '', icon: 'screen' },
      { label: 'Support', sub: 'for {supportMonths} months', icon: 'people' },
    ],
    ctaPrimary: 'Request the syllabus',
    ctaSecondary: 'See what it covers',
    imageAlt: 'Participant working on an SAP production management screen',
    panelTitle: 'Inside SAP',
    panel: [
      'Create Production Order',
      'Run MRP',
      'Monitor Production',
      'Manage Capacity',
      'Production Confirmations',
    ],
    matchLabel: 'Practised in SAP',
    profileBadge: '40h',
    profileLabel: 'Structured programme',
    profileTitle: '5 phases · {sessions} sessions',
    profileStatus: '{supportMonths} months of support',
  },

  proof: {
    label: 'SAP PP training at a glance',
    items: [
      { figure: '40', label: 'hours of training', lord: 'clock', count: true },
      { figure: '20 × 2 h', label: 'live sessions', lord: 'calendar' },
      { figure: '5', label: 'progressive phases', lord: 'checklist', count: true },
      { figure: '8', label: 'step worked example', lord: 'tools', count: true },
    ],
  },

  audiences: {
    eyebrow: 'Who it is for',
    title: 'Who is this training for?',
    lead: 'A programme designed for several profiles, with different starting points and goals.',
    items: [
      {
        icon: 'factory',
        title: 'Production and supply chain professionals',
        body: 'Planners, production managers, buyers and operations professionals who want to understand SAP PP.',
      },
      {
        icon: 'person',
        title: 'ERP professionals',
        body: 'Consultants, functional analysts and ERP professionals looking to build an SAP PP specialization.',
      },
      {
        icon: 'cap',
        title: 'Students and recent graduates',
        body: 'Supply chain, industrial engineering, production management, operations and information systems.',
      },
      {
        icon: 'refresh',
        title: 'Professionals in transition',
        body: 'People with existing business or ERP experience who want to build SAP skills.',
      },
    ],
    script: 'Real processes. Concrete skills. Lasting opportunities.',
  },

  outcomes: {
    title: 'What you will be able to do',
    items: [
      'Understand the end-to-end planning process (Demand → PIR → MRP → Planned Orders → Production Orders → Execution).',
      'Understand and use the core master data (Material Master, BOM, Work Center, Routing, Production Version).',
      'Work confidently with planning (Demand Management, MRP, component requirements and capacity).',
      'Understand production execution (creation, release, goods movements, confirmations, closing).',
      'Tell the main scenarios apart (MTS, MTO, discrete manufacturing).',
    ],
  },

  curriculum: {
    eyebrow: 'Programme',
    title: 'The SAP PP programme — {hours} hours',
    lead: 'Five structured phases, based on official SAP resources and grounded in real business practice.',
    phases: [
      {
        phase: 'Phase 1',
        title: 'Understanding SAP S/4HANA and production',
        sessions: 'Sessions 1 to 3',
        body: 'Where SAP S/4HANA fits, how an ERP is structured, and the place of production within business processes. Navigation, data organization and business vocabulary.',
      },
      {
        phase: 'Phase 2',
        title: 'Building the master data',
        sessions: 'Sessions 4 to 7',
        body: 'Material Master, bills of material, Work Centers, Routings and Production Versions. Why data quality determines what planning can deliver.',
      },
      {
        phase: 'Phase 3',
        title: 'Planning production',
        sessions: 'Sessions 8 to 12',
        body: 'Demand Management, PIRs, running MRP, reading and interpreting the proposals, capacity planning and trade-offs.',
      },
      {
        phase: 'Phase 4',
        title: 'Executing production',
        sessions: 'Sessions 13 to 17',
        body: 'Converting Planned Orders, releasing Production Orders, component movements, operation confirmations, goods receipt and technical closing.',
      },
      {
        phase: 'Phase 5',
        title: 'End-to-end scenarios and consolidation',
        sessions: 'Sessions 18 to 20',
        body: 'Complete MTS and MTO scenarios, discrete manufacturing, variance analysis and consolidation of the whole programme.',
      },
    ],
    sessionStructure: ['Concepts', 'SAP demonstration', 'Exercise', 'Expected outcome'],
    sessionStructureLabel: 'How each session is built',
  },

  practice: {
    eyebrow: 'Worked example',
    imageAlt: 'Two participants working through a production case study',
    title: 'Practice at the centre of the programme',
    tagline: 'You do not learn SAP from slides alone.',
    body: 'Demonstrations and exercises built on concrete production scenarios in SAP S/4HANA.',
    caseTitle: 'Worked example: planning and producing a finished good',
    steps: [
      'Analyse the demand',
      'Run MRP',
      'Analyse the proposals',
      'Convert the Planned Order',
      'Release the Production Order',
      'Execute production',
      'Confirm the operations',
      'Receive the finished good',
    ],
  },

  approach: {
    title: 'Our teaching approach',
    tagline: 'Understand. Practise. Be supported.',
    items: [
      {
        icon: 'book',
        title: 'Understand',
        body: 'The business processes, before learning where to click.',
      },
      { icon: 'gear', title: 'Practise', body: 'With exercises and scenarios drawn from real business cases.' },
      {
        icon: 'people',
        title: 'Be supported',
        body: 'With structured follow-up and a community to learn alongside.',
      },
    ],
  },

  resources: {
    eyebrow: 'Resources',
    title: 'Official SAP resources',
    body: 'The programme is built around SAP Learning. We use the official SAP Learning resources so that your progression stays consistent with SAP S/4HANA concepts and processes.',
    chain: ['SAP Learning', 'Lagni coaching', 'Exercises', 'SAP practice', 'Progression'],
  },

  certification: {
    title: 'Training and certification: two complementary steps',
    body: 'Our training builds SAP PP knowledge and skills. SAP certification is a separate process, administered exclusively by SAP under its own terms.',
    disclaimer:
      'Lagni Consulting is not affiliated with SAP and does not issue SAP certifications. This training guarantees neither passing an exam nor obtaining a certification.',
    cta: 'More about certification',
  },

  support: {
    eyebrow: 'Support',
    title: 'The support continues',
    lead: 'The training ends. The support continues.',
    items: [
      '{hours} hours of structured training',
      '{supportMonths} months of follow-up',
      'Group sessions (questions, review, deeper dives)',
      'Individual check-ins',
      'A community of fellow participants',
    ],
    note: 'Exact support arrangements are confirmed at the point of registration.',
  },

  trainer: {
    eyebrow: 'Your trainer',
    title: 'Training grounded in ERP experience',
    points: [
      '15+ years of ERP experience',
      'SAP S/4HANA Production Planning',
      'Oracle JD Edwards',
      'Implementation project experience',
    ],
    body: 'More than 15 years of experience with ERP systems, hands-on involvement in end-to-end implementation projects, and an approach that combines business processes, systems, project management and knowledge transfer.',
    cta: 'More about the trainer',
  },

  paths: {
    eyebrow: 'Formats',
    body: 'Join an open cohort or organize a dedicated group for your institution or company.',
    title: 'Two ways to train',
    items: [
      {
        title: 'Individuals',
        subtitle: 'Join a cohort',
        items: [
          '{hours} hours of training',
          'Hands-on exercises',
          '{supportMonths} months of support',
          'Participant community',
          'Preparation for the next steps in your SAP path',
        ],
        cta: 'Request the details',
        tone: 'orange',
      },
      {
        title: 'Institutions & companies',
        subtitle: 'Run a dedicated cohort',
        items: [
          'Adaptable programme',
          'Schedule to suit you',
          'Remote or on your premises',
          'Dedicated group',
          'Teaching support',
        ],
        cta: 'Discuss a partnership',
        tone: 'blue',
      },
    ],
  },

  testimonials: {
    title: 'What participants say',
    items: [] as readonly { quote: string; author: string; role: string }[],
  },

  faqHelp: {
    title: 'A question before you sign up?',
    body: 'Write to us — we reply to professional enquiries within one to two business days.',
    cta: 'Ask your question',
  },

  faq: {
    eyebrow: 'FAQ',
    lead: 'Answers to the most common questions about the programme, SAP access and certification.',
    title: 'Your questions, answered',
  },

  finalCta: {
    title: 'Your SAP PP path can start here.',
    body: 'Build a practical understanding of SAP S/4HANA Production Planning with structured support along the way.',
    ctaPrimary: 'Request the full syllabus',
    ctaSecondary: 'Talk to Lagni Consulting',
    script: 'Train today. Build tomorrow.',
  },
} as const;
