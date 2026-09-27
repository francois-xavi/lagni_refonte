export const contact = {
  seo: {
    title: 'Contact — Lagni Consulting',
    description:
      'Formation, ERP & Solutions, recrutement ou partenariat avec un établissement : sélectionnez votre besoin et échangeons sur vos objectifs.',
  },

  hero: {
    eyebrow: 'Contact',
    title: 'Parlons de votre projet.',
    lead: 'Formation, ERP & Solutions, recrutement ou partenariat avec un établissement : sélectionnez votre besoin et échangeons sur vos objectifs.',
    markets: ['Canada', 'Europe', 'Afrique'],
    imageAlt: 'Bureau professionnel avec ordinateur portable et carnet',
    script: 'Des échanges d’aujourd’hui aux opportunités de demain.',
    ctaPrimary: 'Choisir ma demande',
    matchLabel: 'Votre demande',
    matchTitle: 'Un seul point de contact',
    profileBadge: '1–2',
    profileLabel: 'Délai de réponse',
    profileTitle: 'jours ouvrables',
  },

  chooser: {
    eyebrow: 'Votre besoin',
    title: 'Comment pouvons-nous vous aider ?',
    lead: 'Sélectionnez le type de demande qui correspond le mieux à votre besoin.',
    options: [
      {
        id: 'formation',
        icon: 'cap',
        lord: 'cap',
        label: 'Formation',
        body: 'Je souhaite me former ou obtenir des informations sur une formation.',
        formTitle: 'Formulaire de contact — Formation',
      },
      {
        id: 'formation-entreprise',
        icon: 'people',
        lord: 'mentor',
        label: 'Formation entreprise',
        body: 'Nous souhaitons développer les compétences de nos équipes.',
        formTitle: 'Formulaire de contact — Formation entreprise',
      },
      {
        id: 'erp',
        icon: 'gear',
        lord: 'server',
        label: 'ERP & Solutions',
        body: 'Nous avons un besoin concernant SAP, JDE, Odoo, HighLevel, Chataap ou un projet de transformation.',
        formTitle: 'Formulaire de contact — ERP & Solutions',
      },
      {
        id: 'recrutement',
        icon: 'search',
        lord: 'search',
        label: 'Recrutement',
        body: 'Nous recherchons un professionnel spécialisé.',
        formTitle: 'Formulaire de contact — Recrutement',
      },
      {
        id: 'etablissement',
        icon: 'school',
        lord: 'school',
        label: 'Établissement d’enseignement',
        body: 'Nous souhaitons discuter d’une formation ou d’un partenariat.',
        formTitle: 'Formulaire de contact — Établissement d’enseignement',
      },
      {
        id: 'autre',
        icon: 'doc',
        lord: 'conversation',
        label: 'Autre',
        body: 'Ma demande ne correspond à aucune des catégories ci-dessus.',
        formTitle: 'Formulaire de contact',
      },
    ],
    legend: 'Type de demande',
    formEyebrow: 'Formulaire',
    formIntro: 'Remplissez les informations ci-dessous afin que nous puissions mieux comprendre votre demande.',
  },

  cvCallout: {
    title: 'Vous souhaitez déposer votre CV ?',
    body: 'Rejoignez notre réseau de professionnels ERP, CRM, gestion de projet, Supply Chain et transformation numérique.',
    cta: 'Déposer ma candidature',
  },

  details: {
    title: 'Nos coordonnées',
    responseTitle: 'Délais de réponse',
    responseBody:
      'Nous répondons généralement aux demandes professionnelles dans un délai de 1 à 2 jours ouvrables.',
    linkedinLabel: 'Suivez-nous sur LinkedIn',
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Questions fréquentes',
    lead: 'Trouvez rapidement des réponses aux questions les plus courantes.',
    items: [
      {
        q: 'Puis-je suivre la formation SAP PP à distance ?',
        a: 'Oui. Les séances sont données à distance, en direct avec le formateur. Une formule sur site peut être envisagée pour un groupe ou un établissement.',
      },
      {
        q: 'Proposez-vous vos services hors du Canada ?',
        a: 'Oui. Lagni Consulting collabore avec des professionnels et des organisations au Canada, en Europe et en Afrique. Les formations à distance sont accessibles depuis ces marchés.',
      },
      {
        q: 'Travaillez-vous avec les établissements d’enseignement ?',
        a: 'Oui. Nous proposons un programme adaptable aux cursus en supply chain, gestion de production, génie industriel et opérations, sous forme de cours complémentaire, de cohorte dédiée ou de format intensif.',
      },
      {
        q: 'Comment déposer ma candidature ?',
        a: 'Utilisez le formulaire candidat de la page Recrutement. Il permet de transmettre votre CV et vos domaines d’expertise en toute confidentialité.',
      },
    ],
  },

  quote: 'Des projets concrets commencent souvent par une simple conversation.',

  pillars: [
    { icon: 'cap', label: 'Compétences' },
    { icon: 'people', label: 'Opportunités' },
    { icon: 'chart', label: 'Avenir' },
  ],

  finalCta: {
    title: 'Commençons par comprendre votre besoin.',
    body: 'Formation, ERP, recrutement ou partenariat : contactez Lagni Consulting.',
    cta: 'Parler de votre projet',
    script: 'Former. Accompagner. Connecter.',
  },
} as const;
