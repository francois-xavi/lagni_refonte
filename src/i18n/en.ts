/**
 * English copy. Mirrors the shape of ./fr.ts exactly.
 * Written as natural Canadian-market business English, not a literal
 * translation of the French.
 */
import type { FrDict } from './fr';

export const en = {
  meta: {
    siteName: 'Lagni Consulting',
    signature: 'Train. Support. Connect.',
    signatureLong: 'Train. Support. Connect talent and organizations.',
    logoAlt: 'Lagni Consulting',
    skipToContent: 'Skip to main content',
    langSwitchLabel: 'Choose a language',
    switchTo: 'FR',
    switchToFull: 'Voir cette page en français',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    breadcrumbLabel: 'Breadcrumb',
    homeLabel: 'Home',
  },

  nav: {
    home: 'Home',
    training: 'Training',
    sapPp: 'SAP PP Training',
    erp: 'ERP & Solutions',
    recruitment: 'Recruitment',
    institutions: 'Institutions',
    about: 'About',
    resources: 'Resources',
    contact: 'Contact',
    thanks: 'Thank you',
    headerCta: 'Discuss your project',
    primaryLabel: 'Main navigation',
  },

  common: {
    learnMore: 'Learn more',
    readArticle: 'Read the article',
    discoverTraining: 'Explore our training',
    discoverServices: 'Explore our services',
    discoverInstitutions: 'See our offer for institutions',
    talkProject: 'Discuss your project',
    contactUs: 'Contact us',
    minRead: 'min',
    ecosystemNote:
      'These technologies are part of our expertise. They do not represent official partnerships unless stated otherwise.',
  },

  footer: {
    solutionsTitle: 'Solutions',
    servicesTitle: 'Services',
    companyTitle: 'Company',
    followTitle: 'Follow us',
    linkedinAria: 'Lagni Consulting on LinkedIn',
    rights: 'All rights reserved.',
    navLabel: 'Footer',
    solutions: ['SAP S/4HANA', 'Oracle JD Edwards', 'Odoo', 'GoHighLevel', 'Chataap'],
  },

  forms: {
    firstName: 'First name',
    firstNamePlaceholder: 'Your first name',
    lastName: 'Last name',
    lastNamePlaceholder: 'Your last name',
    name: 'Name',
    email: 'Work email',
    emailPlaceholder: 'you@organization.com',
    country: 'Country',
    countryPlaceholder: 'Select a country',
    countryOptions: ['Canada', 'France', 'Belgium', 'Switzerland', 'Côte d’Ivoire', 'Cameroon', 'Senegal', 'Benin', 'Other'],
    organisation: 'Organization',
    organisationPlaceholder: 'Your organization',
    role: 'Name / role',
    rolePlaceholder: 'Your name and role',
    message: 'Message',
    messagePlaceholder: 'Tell us about your project, your goals or your questions…',
    send: 'Send my request',
    sending: 'Sending…',
    select: 'Select',

    desiredTraining: 'Training of interest',
    desiredTrainingPlaceholder: 'Select a training',
    trainingOptions: ['SAP S/4HANA Production Planning (PP)', 'Another training need'],
    profile: 'Your profile',
    profileHelp: 'Student, professional, other',
    profileOptions: [
      'Student or recent graduate',
      'Production or supply chain professional',
      'ERP professional',
      'Professional in transition',
      'Other',
    ],

    groupSize: 'Group size',
    groupSizePlaceholder: 'e.g. 12',

    solution: 'Solution concerned',
    solutionPlaceholder: 'Select a solution',
    solutionOptions: [
      'SAP S/4HANA',
      'Oracle JD Edwards',
      'Odoo',
      'GoHighLevel',
      'Chataap',
      'Not sure yet',
    ],
    needType: 'Type of need',
    needTypeOptions: [
      'Functional analysis / assessment',
      'Implementation or configuration',
      'Testing (SIT / UAT)',
      'Migration & cutover',
      'Training & adoption',
      'Support & continuous improvement',
    ],

    roleSought: 'Role you are hiring for',
    roleSoughtPlaceholder: 'e.g. SAP PP Analyst',
    domain: 'Technology / area',
    domainOptions: [
      'ERP & enterprise applications',
      'Project management & transformation',
      'Data & digital tools',
      'Manufacturing & Supply Chain',
      'Other',
    ],
    contractType: 'Permanent / Contract',
    contractOptions: ['Permanent', 'Contract', 'To be determined'],
    needDescription: 'Describe the role',
    needDescriptionPlaceholder: 'Context, responsibilities, skills required…',
    submitMandate: 'Submit a mandate',

    expertiseArea: 'Area of expertise',
    yearsExperience: 'Years of experience',
    yearsOptions: ['Under 2 years', '2 to 5 years', '5 to 10 years', 'Over 10 years'],
    cv: 'Résumé',
    cvHelp: 'Accepted formats: PDF, DOC, DOCX (max 5 MB)',
    submitApplication: 'Submit my application',

    institutionName: 'Institution',
    institutionPlaceholder: 'Name of the institution',
    programme: 'Programme concerned',
    programmePlaceholder: 'e.g. Industrial engineering',
    studentCount: 'Number of students',
    studentCountPlaceholder: 'e.g. 15',
    period: 'Timeframe',
    periodOptions: ['Winter term', 'Summer term', 'Fall term', 'To be determined'],
    discussPartnership: 'Discuss a partnership',

    consent:
      'I agree that Lagni Consulting may keep the information provided in order to respond to my request.',
    consentCandidate:
      'I agree that Lagni Consulting may keep my résumé and contact details in order to share relevant professional opportunities with me.',
    privacyNote: 'The information you provide is used only to handle your request.',
    confidentialNote:
      'Your information is confidential and used only as part of our recruitment services.',
    candidateNote:
      'Your personal information is handled confidentially and used only for relevant professional opportunities.',

    errors: {
      label: 'Error',
      required: 'This field is required.',
      email: 'Please enter a valid email address.',
      consent: 'You must agree in order to continue.',
      fileType: 'Unsupported format. Please use PDF, DOC or DOCX.',
      fileSize: 'The file exceeds the 5 MB limit.',
      summary: 'Please correct the highlighted fields before sending your request.',
      network: 'Your request could not be sent. Please try again, or email us directly at',
      notConfigured: 'This form is not yet connected to an inbox. Please email us directly at',
    },
    success: {
      title: 'Thank you — your request has been sent.',
      body: 'We usually reply to professional enquiries within one to two business days.',
    },
  },

  credentials: {
    title: 'Key certifications',
    pendingNote: 'Official wording to be confirmed before launch.',
    items: [
      { name: 'SAP Certified Associate — Production Planning', code: 'C_TS422', pending: true },
      {
        name: 'SAP Certified Associate — Business Process Integration',
        code: 'C_IEE2E',
        pending: true,
      },
      { name: 'PMP® — Project Management Professional', code: '', pending: true },
      { name: '15+ years of ERP experience', code: '', pending: false },
      { name: 'End-to-end ERP implementations', code: '', pending: false },
    ],
  },

  founder: {
    name: 'Romuald Monthé Kameni',
    role: 'Founder — Lagni Consulting',
    photoAlt: 'Portrait of Romuald Monthé Kameni, founder of Lagni Consulting',
  },

  ecosystems: {
    title: 'Technologies and ecosystems',
    subtitle: 'Solutions we work with.',
    items: ['SAP S/4HANA', 'Oracle JD Edwards', 'Odoo', 'GoHighLevel', 'Chataap', 'Power BI'],
    more: 'And other enterprise technologies, depending on client needs.',
  },
} as const satisfies FrDict;
