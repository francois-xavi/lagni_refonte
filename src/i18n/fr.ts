/**
 * French copy — source of truth for the whole site.
 * English lives in ./en.ts and mirrors this shape.
 *
 * Editing guidance for future maintainers:
 *  - Every user-visible string on the site lives here, including alt text,
 *    aria-labels, form validation messages and meta descriptions.
 *  - Keys listed in CONTENT-TO-REPLACE.md await client confirmation.
 */

export const fr = {
  /* ─────────────────────────── Global ─────────────────────────── */

  meta: {
    siteName: 'Lagni Consulting',
    signature: 'Former. Accompagner. Connecter.',
    signatureLong: 'Former. Accompagner. Connecter les talents et les organisations.',
    logoAlt: 'Lagni Consulting',
    skipToContent: 'Aller au contenu principal',
    langSwitchLabel: 'Choisir la langue',
    switchTo: 'EN',
    switchToFull: 'View this page in English',
    menuOpen: 'Ouvrir le menu',
    menuClose: 'Fermer le menu',
    breadcrumbLabel: 'Fil d’Ariane',
    homeLabel: 'Accueil',
  },

  nav: {
    home: 'Accueil',
    training: 'Formations',
    sapPp: 'Formation SAP PP',
    sapPpShort: 'SAP PP',
    erp: 'ERP & Solutions',
    recruitment: 'Recrutement',
    institutions: 'Établissements',
    about: 'À propos',
    resources: 'Ressources',
    contact: 'Contact',
    thanks: 'Merci',
    headerCta: 'Parler de votre projet',
    primaryLabel: 'Navigation principale',
  },

  common: {
    learnMore: 'En savoir plus',
    readArticle: 'Lire l’article',
    discoverTraining: 'Découvrir nos formations',
    discoverServices: 'Découvrir nos services',
    discoverInstitutions: 'Découvrir notre offre établissements',
    talkProject: 'Parler de votre projet',
    contactUs: 'Nous contacter',
    minRead: 'min',
    ecosystemNote:
      'Ces technologies font partie de notre expertise. Elles ne représentent pas des partenariats officiels, sauf indication contraire.',
  },

  footer: {
    solutionsTitle: 'Solutions',
    servicesTitle: 'Services',
    companyTitle: 'Entreprise',
    followTitle: 'Suivez-nous',
    linkedinAria: 'Lagni Consulting sur LinkedIn',
    rights: 'Tous droits réservés.',
    navLabel: 'Pied de page',
    solutions: ['SAP S/4HANA', 'Oracle JD Edwards', 'Odoo', 'GoHighLevel', 'Chataap'],
  },

  /* ─────────────────────────── Forms ─────────────────────────── */

  forms: {
    firstName: 'Prénom',
    firstNamePlaceholder: 'Votre prénom',
    lastName: 'Nom',
    lastNamePlaceholder: 'Votre nom',
    name: 'Nom',
    email: 'Courriel professionnel',
    emailPlaceholder: 'vous@organisation.com',
    country: 'Pays',
    countryPlaceholder: 'Sélectionner un pays',
    countryOptions: ['Canada', 'France', 'Belgique', 'Suisse', 'Côte d’Ivoire', 'Cameroun', 'Sénégal', 'Bénin', 'Autre'],
    organisation: 'Organisation',
    organisationPlaceholder: 'Nom de votre entreprise',
    role: 'Nom / fonction',
    rolePlaceholder: 'Votre nom et votre fonction',
    message: 'Message',
    messagePlaceholder: 'Décrivez votre projet, vos objectifs ou vos questions…',
    send: 'Envoyer ma demande',
    sending: 'Envoi en cours…',
    select: 'Sélectionner',

    desiredTraining: 'Formation souhaitée',
    desiredTrainingPlaceholder: 'Sélectionner une formation',
    trainingOptions: ['SAP S/4HANA Production Planning (PP)', 'Autre besoin de formation'],
    profile: 'Votre profil',
    profileHelp: 'Étudiant, professionnel, autre',
    profileOptions: [
      'Étudiant ou jeune diplômé',
      'Professionnel de la production ou de la supply chain',
      'Professionnel ERP',
      'Professionnel en transition',
      'Autre',
    ],

    groupSize: 'Taille du groupe',
    groupSizePlaceholder: 'Ex. 12',

    solution: 'Solution concernée',
    solutionPlaceholder: 'Sélectionner une solution',
    solutionOptions: [
      'SAP S/4HANA',
      'Oracle JD Edwards',
      'Odoo',
      'GoHighLevel',
      'Chataap',
      'Je ne sais pas encore',
    ],
    needType: 'Type de besoin',
    needTypeOptions: [
      'Analyse fonctionnelle / diagnostic',
      'Implantation ou configuration',
      'Tests (SIT / UAT)',
      'Migration & cutover',
      'Formation & adoption',
      'Support & amélioration continue',
    ],

    roleSought: 'Poste recherché',
    roleSoughtPlaceholder: 'Ex. Analyste SAP PP',
    domain: 'Technologie / domaine',
    domainOptions: [
      'ERP & applications d’entreprise',
      'Gestion de projet & transformation',
      'Data & outils numériques',
      'Manufacturing & Supply Chain',
      'Autre',
    ],
    contractType: 'Permanent / Contractuel',
    contractOptions: ['Permanent', 'Contractuel', 'À déterminer'],
    needDescription: 'Description du besoin',
    needDescriptionPlaceholder: 'Contexte, responsabilités, compétences recherchées…',
    submitMandate: 'Confier un mandat',

    expertiseArea: 'Domaine d’expertise',
    yearsExperience: 'Années d’expérience',
    yearsOptions: ['Moins de 2 ans', '2 à 5 ans', '5 à 10 ans', 'Plus de 10 ans'],
    cv: 'Curriculum vitæ',
    cvHelp: 'Formats acceptés : PDF, DOC, DOCX (max 5 Mo)',
    submitApplication: 'Déposer ma candidature',

    institutionName: 'Établissement',
    institutionPlaceholder: 'Nom de l’établissement',
    programme: 'Programme concerné',
    programmePlaceholder: 'Ex. Génie industriel',
    studentCount: 'Nombre d’étudiants',
    studentCountPlaceholder: 'Ex. 15',
    period: 'Période envisagée',
    periodOptions: ['Trimestre d’hiver', 'Trimestre d’été', 'Trimestre d’automne', 'À déterminer'],
    discussPartnership: 'Discuter d’un partenariat',

    consent:
      'J’accepte que Lagni Consulting conserve les renseignements transmis afin de traiter ma demande.',
    consentCandidate:
      'J’accepte que Lagni Consulting conserve mon curriculum vitæ et mes coordonnées afin de me proposer des opportunités professionnelles pertinentes.',
    privacyNote: 'Les renseignements transmis sont utilisés uniquement pour traiter votre demande.',
    confidentialNote:
      'Vos informations sont confidentielles et utilisées uniquement dans le cadre de nos services de recrutement.',
    candidateNote:
      'Vos renseignements personnels sont traités de façon confidentielle et utilisés uniquement pour des opportunités professionnelles pertinentes.',

    errors: {
      label: 'Erreur',
      required: 'Ce champ est obligatoire.',
      email: 'Veuillez saisir une adresse courriel valide.',
      consent: 'Vous devez accepter pour poursuivre.',
      fileType: 'Format non accepté. Utilisez PDF, DOC ou DOCX.',
      fileSize: 'Le fichier dépasse la taille maximale de 5 Mo.',
      summary: 'Veuillez corriger les champs indiqués avant d’envoyer votre demande.',
      network:
        'Votre demande n’a pas pu être envoyée. Veuillez réessayer ou nous écrire directement à',
      notConfigured:
        'Le formulaire n’est pas encore relié à une boîte de réception. Écrivez-nous directement à',
    },
    success: {
      title: 'Merci, votre demande a bien été envoyée.',
      body: 'Nous répondons généralement aux demandes professionnelles dans un délai de 1 à 2 jours ouvrables.',
    },
  },

  /* ─────────────────── Shared proof / people blocks ─────────────────── */

  credentials: {
    title: 'Certifications principales',
    pendingNote: 'Intitulé officiel à confirmer avant publication.',
    items: [
      { name: 'SAP Certified Associate — Production Planning', code: 'C_TS422', pending: true },
      {
        name: 'SAP Certified Associate — Business Process Integration',
        code: 'C_IEE2E',
        pending: true,
      },
      { name: 'PMP® — Project Management Professional', code: '', pending: true },
      { name: '15+ années d’expérience ERP', code: '', pending: false },
      { name: 'Implantations ERP end-to-end', code: '', pending: false },
    ],
  },

  founder: {
    name: 'Romuald Monthé Kameni',
    role: 'Fondateur — Lagni Consulting',
    photoAlt: 'Portrait de Romuald Monthé Kameni, fondateur de Lagni Consulting',
  },

  ecosystems: {
    title: 'Technologies et écosystèmes',
    subtitle: 'Un accès à un large éventail de solutions.',
    items: ['SAP S/4HANA', 'Oracle JD Edwards', 'Odoo', 'GoHighLevel', 'Chataap', 'Power BI'],
    more: 'Et d’autres technologies d’entreprise selon les besoins de nos clients.',
  },
} as const;

/**
 * Structural shape of the dictionary with literal types widened, so that
 * `en.ts` can be checked against it with `satisfies`. This makes a missing or
 * misspelled key in either language a build error rather than a runtime blank.
 */
export type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : { readonly [K in keyof T]: Widen<T[K]> };

export type FrDict = Widen<typeof fr>;
