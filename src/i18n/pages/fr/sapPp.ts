export const sapPp = {
  seo: {
    title: 'Formation SAP S/4HANA Production Planning (PP) — Lagni Consulting',
    description:
      'Un parcours de 40 heures en 20 séances pour comprendre et pratiquer les processus de planification et d’exécution de la production dans SAP S/4HANA.',
  },

  hero: {
    eyebrow: 'Formation SAP S/4HANA',
    title: 'Maîtrisez SAP S/4HANA Production Planning',
    lead: 'Comprenez les processus de planification et d’exécution de la production. Pratiquez dans SAP. Préparez votre progression professionnelle et votre parcours de certification.',
    meta: [
      { label: '40 heures', sub: 'de formation', icon: 'clock' },
      { label: '20 séances', sub: '× 2 heures', icon: 'calendar' },
      { label: 'Exercices pratiques', sub: '', icon: 'screen' },
      { label: 'Accompagnement', sub: 'sur 12 mois', icon: 'people' },
    ],
    ctaPrimary: 'Recevoir le programme',
    ctaSecondary: 'Découvrir le contenu',
    imageAlt: 'Participant travaillant sur un écran SAP de gestion de production',
    panelTitle: 'Dans SAP',
    panel: [
      'Create Production Order',
      'Run MRP',
      'Monitor Production',
      'Manage Capacity',
      'Production Confirmations',
    ],
    matchLabel: 'Pratiqué dans SAP',
    profileBadge: '40h',
    profileLabel: 'Parcours structuré',
    profileTitle: '5 phases · 20 séances',
    profileStatus: 'Accompagnement 12 mois',
  },

  proof: {
    label: 'La formation SAP PP en bref',
    items: [
      { figure: '40', label: 'heures de formation', lord: 'clock', count: true },
      { figure: '20 × 2 h', label: 'séances en direct', lord: 'calendar' },
      { figure: '5', label: 'phases progressives', lord: 'checklist', count: true },
      { figure: '8', label: 'étapes de cas pratique', lord: 'tools', count: true },
    ],
  },

  audiences: {
    eyebrow: 'Pour qui',
    title: 'À qui s’adresse cette formation ?',
    lead: 'Un parcours adapté à différents profils, avec des objectifs et des parcours variés.',
    items: [
      {
        icon: 'factory',
        title: 'Professionnels de la production et de la supply chain',
        body: 'Planificateurs, responsables de production, approvisionneurs et professionnels des opérations souhaitant comprendre SAP PP.',
      },
      {
        icon: 'person',
        title: 'Professionnels ERP',
        body: 'Consultants, analystes fonctionnels et professionnels ERP souhaitant développer une spécialisation SAP PP.',
      },
      {
        icon: 'cap',
        title: 'Étudiants et jeunes diplômés',
        body: 'Supply chain, génie industriel, gestion de production, opérations et systèmes d’information.',
      },
      {
        icon: 'refresh',
        title: 'Professionnels en transition',
        body: 'Personnes possédant déjà une expérience métier ou ERP et souhaitant développer des compétences SAP.',
      },
    ],
    script: 'Des processus réels. Des compétences concrètes. Des opportunités durables.',
  },

  outcomes: {
    title: 'Ce que vous saurez faire',
    items: [
      'Comprendre le processus de planification end-to-end (Demande → PIR → MRP → Planned Orders → Production Orders → Exécution).',
      'Comprendre et utiliser les principales données de base (Material Master, BOM, Work Center, Routing, Production Version).',
      'Maîtriser la planification (Demand Management, MRP, besoins en composants et capacités).',
      'Comprendre l’exécution de la production (création, libération, mouvements, confirmations, clôture).',
      'Différencier les principaux scénarios (MTS, MTO, fabrication discrète).',
    ],
  },

  curriculum: {
    eyebrow: 'Programme',
    title: 'Le parcours SAP PP — 40 heures',
    lead: 'Un programme structuré en 5 phases, basé sur les ressources officielles SAP et adapté aux réalités métier.',
    phases: [
      {
        phase: 'Phase 1',
        title: 'Comprendre SAP S/4HANA et la production',
        sessions: 'Séances 1 à 3',
        body: 'Situer SAP S/4HANA, la logique d’un ERP et la place de la production dans les processus d’entreprise. Navigation, organisation des données et vocabulaire métier.',
      },
      {
        phase: 'Phase 2',
        title: 'Construire les données de base',
        sessions: 'Séances 4 à 7',
        body: 'Material Master, nomenclatures (BOM), postes de travail (Work Center), gammes (Routing) et Production Version. Comprendre pourquoi la qualité des données conditionne le résultat de la planification.',
      },
      {
        phase: 'Phase 3',
        title: 'Planifier la production',
        sessions: 'Séances 8 à 12',
        body: 'Demand Management, PIR, exécution du MRP, lecture et interprétation des propositions, planification des capacités et arbitrages.',
      },
      {
        phase: 'Phase 4',
        title: 'Exécuter la production',
        sessions: 'Séances 13 à 17',
        body: 'Conversion des Planned Orders, libération des Production Orders, mouvements de composants, confirmations d’opérations, réception et clôture technique.',
      },
      {
        phase: 'Phase 5',
        title: 'Scénarios end-to-end et consolidation',
        sessions: 'Séances 18 à 20',
        body: 'Scénarios MTS et MTO complets, fabrication discrète, analyse des écarts et consolidation de l’ensemble du parcours.',
      },
    ],
    sessionStructure: ['Concepts', 'Démonstration SAP', 'Exercice', 'Résultat attendu'],
    sessionStructureLabel: 'Structure de chaque séance',
  },

  practice: {
    eyebrow: 'Cas pratique',
    imageAlt: 'Deux participants travaillant sur un cas pratique de production',
    title: 'La pratique au cœur du parcours',
    tagline: 'Vous n’apprenez pas SAP uniquement avec des diapositives.',
    body: 'Des démonstrations et exercices basés sur des scénarios concrets de production dans SAP S/4HANA.',
    caseTitle: 'Exemple de cas pratique : planifier et produire un produit fini',
    steps: [
      'Analyser la demande',
      'Exécuter le MRP',
      'Analyser les propositions',
      'Convertir le Planned Order',
      'Libérer le Production Order',
      'Exécuter la production',
      'Confirmer les opérations',
      'Réceptionner le produit fini',
    ],
  },

  approach: {
    title: 'Notre approche pédagogique',
    tagline: 'Comprendre. Pratiquer. Être accompagné.',
    items: [
      {
        icon: 'book',
        title: 'Comprendre',
        body: 'Les processus métiers avant de simplement apprendre où cliquer.',
      },
      {
        icon: 'gear',
        title: 'Pratiquer',
        body: 'Avec des exercices et des scénarios inspirés de l’entreprise.',
      },
      {
        icon: 'people',
        title: 'Être accompagné',
        body: 'Avec un suivi structuré et une communauté d’échange.',
      },
    ],
  },

  resources: {
    eyebrow: 'Ressources',
    title: 'Des ressources SAP officielles',
    body: 'Un parcours construit autour de SAP Learning. Nous utilisons les ressources officielles SAP Learning pour garantir une progression cohérente avec les concepts et processus SAP S/4HANA.',
    chain: ['SAP Learning', 'Coaching Lagni', 'Exercices', 'Pratique SAP', 'Progression'],
  },

  certification: {
    title: 'Formation et certification : deux étapes complémentaires',
    body: 'Notre formation développe les connaissances et compétences SAP PP. La certification SAP est un processus distinct, administré exclusivement par SAP selon ses propres conditions.',
    disclaimer:
      'Lagni Consulting n’est pas affiliée à SAP et ne délivre aucune certification SAP. La formation ne garantit ni la réussite d’un examen, ni l’obtention d’une certification.',
    cta: 'En savoir plus sur la certification',
  },

  support: {
    eyebrow: 'Accompagnement',
    title: 'L’accompagnement continue',
    lead: 'La formation se termine. L’accompagnement continue.',
    items: [
      '40 heures de formation structurée',
      '12 mois d’accompagnement',
      'Sessions collectives (questions, révisions, approfondissement)',
      'Accompagnement individuel (points personnalisés)',
      'Communauté d’échange entre participants',
    ],
    note: 'Les modalités exactes d’accompagnement sont confirmées au moment de l’inscription.',
  },

  trainer: {
    eyebrow: 'Le formateur',
    title: 'Une formation portée par l’expérience ERP',
    points: [
      '15+ ans d’expérience ERP',
      'SAP S/4HANA Production Planning',
      'Oracle JD Edwards',
      'Expérience de projets d’implantation',
    ],
    body: 'Plus de 15 années d’expérience dans les systèmes ERP, une participation à des projets d’implantation end-to-end et une approche qui combine processus métiers, systèmes, gestion de projet et transmission des connaissances.',
    cta: 'En savoir plus sur le formateur',
  },

  paths: {
    eyebrow: 'Formules',
    body: 'Rejoignez une cohorte ouverte ou organisez un groupe dédié pour votre établissement ou votre entreprise.',
    title: 'Deux façons de se former',
    items: [
      {
        title: 'Particuliers',
        subtitle: 'Rejoindre une cohorte',
        items: [
          'Formation 40 heures',
          'Exercices pratiques',
          'Accompagnement 12 mois',
          'Communauté d’échange',
          'Préparation à la suite du parcours SAP',
        ],
        cta: 'Recevoir les informations',
        tone: 'orange',
      },
      {
        title: 'Établissements & entreprises',
        subtitle: 'Organiser une cohorte dédiée',
        items: [
          'Programme adaptable',
          'Calendrier adapté',
          'À distance ou dans votre établissement',
          'Groupe dédié',
          'Support pédagogique',
        ],
        cta: 'Discuter d’un partenariat',
        tone: 'blue',
      },
    ],
  },

  testimonials: {
    title: 'Ils nous font confiance',
    body: 'Bientôt des témoignages de nos participants et partenaires.',
    placeholder: 'Votre témoignage pourrait être ici. Rejoignez la prochaine cohorte !',
  },

  faq: {
    eyebrow: 'FAQ',
    lead: 'Les réponses aux questions les plus fréquentes sur le parcours, l’accès à SAP et la certification.',
    title: 'Vos questions, nos réponses',
    items: [
      {
        q: 'Faut-il déjà connaître SAP ?',
        a: 'Non. Le parcours démarre par les concepts fondamentaux de SAP S/4HANA et de la logique ERP avant d’aborder les processus de production.',
      },
      {
        q: 'Faut-il avoir une expérience en production ?',
        a: 'Ce n’est pas obligatoire. Une familiarité avec les opérations, la supply chain ou la gestion industrielle facilite la progression, mais les notions métier nécessaires sont expliquées pendant la formation.',
      },
      {
        q: 'La formation est-elle à distance ?',
        a: 'Les séances sont données à distance, en direct avec le formateur. Une formule sur site peut être envisagée pour un groupe ou un établissement.',
      },
      {
        q: 'Aurai-je accès à un environnement SAP ?',
        a: 'Le parcours inclut des démonstrations et des exercices dans SAP. Les modalités exactes d’accès sont précisées avant le démarrage de chaque cohorte, car elles dépendent des conditions en vigueur au moment de la session.',
      },
      {
        q: 'La certification SAP est-elle comprise ?',
        a: 'Non. La certification SAP est délivrée exclusivement par SAP, selon ses propres conditions et examens. Notre formation développe les connaissances utiles à cette démarche, sans s’y substituer.',
      },
      {
        q: 'Combien de temps dure le programme ?',
        a: '40 heures de formation réparties en 20 séances de 2 heures, suivies d’une période d’accompagnement.',
      },
      {
        q: 'Quel accompagnement est proposé après les 40 heures ?',
        a: 'Un accompagnement structuré : sessions collectives de questions et de révision, points individuels et accès à une communauté d’échange entre participants.',
      },
      {
        q: 'Quels sont les prérequis techniques ?',
        a: 'Un ordinateur, une connexion internet stable et un casque. Aucun logiciel particulier n’est à installer localement.',
      },
      {
        q: 'La formation peut-elle être organisée pour une école ou une entreprise ?',
        a: 'Oui. Une cohorte dédiée peut être organisée avec un calendrier et un contenu adaptés. Contactez-nous pour discuter du format.',
      },
    ],
  },

  finalCta: {
    title: 'Votre parcours SAP PP peut commencer ici.',
    body: 'Développez une compréhension pratique de SAP S/4HANA Production Planning et bénéficiez d’un accompagnement structuré dans votre progression.',
    ctaPrimary: 'Recevoir le programme complet',
    ctaSecondary: 'Parler à Lagni Consulting',
    script: 'Former aujourd’hui. Bâtir demain.',
  },
} as const;
