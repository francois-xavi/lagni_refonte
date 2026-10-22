export const resources = {
  seo: {
    title: 'Ressources — SAP S/4HANA, ERP et compétences | Lagni Consulting',
    description:
      'Analyses, guides et contenus pratiques autour des ERP, de SAP S/4HANA, du Production Planning, de la transformation numérique et des carrières.',
  },

  hero: {
    eyebrow: 'Ressources',
    title: 'Guides et articles sur SAP, les ERP et les carrières.',
    lead: 'Analyses, guides et contenus pratiques autour des ERP, SAP S/4HANA, Production Planning, transformation numérique et carrières.',
    cta: 'Explorer les ressources',
    imageAlt: 'Professionnel consultant des ressources documentaires sur un ordinateur portable',
    script: 'Apprendre aujourd’hui. Construire demain.',
    panel: ['ERP', 'Processus', 'Compétences', 'Opportunités'],
    trustItems: [
      { icon: 'layers', label: 'ERP & SAP S/4HANA' },
      { icon: 'book', label: 'Guides pratiques' },
      { icon: 'target', label: 'Du débutant à l’avancé' },
    ],
    matchLabel: 'Thèmes',
    matchTitle: 'Des contenus pratiques',
    profileBadge: '5',
    profileLabel: 'Catégories',
    profileTitle: 'de ressources',
  },

  categories: {
    eyebrow: 'Thèmes',
    title: 'Nos catégories de ressources',
    lead: 'Explorez nos contenus par thème.',
    items: [
      {
        id: 'sap-pp',
        icon: 'chart',
        lord: 'server',
        label: 'SAP S/4HANA & PP',
        body: 'MRP, production, données de base, ordres de production, MTS/MTO, certification.',
      },
      {
        id: 'erp',
        icon: 'gear',
        lord: 'tools',
        label: 'ERP & processus métiers',
        body: 'ERP, Manufacturing, Supply Chain, processus end-to-end, tests, migration.',
      },
      {
        id: 'tools',
        icon: 'screen',
        lord: 'monitor',
        label: 'Outils & solutions',
        body: 'Odoo, GoHighLevel, Chataap et autres solutions couvertes par Lagni.',
      },
      {
        id: 'careers',
        icon: 'people',
        lord: 'briefcase',
        label: 'Carrières & compétences',
        body: 'Métiers ERP, reconversion, compétences, certification, gestion de projet.',
      },
      {
        id: 'teaching',
        icon: 'cap',
        lord: 'school',
        label: 'Formation & enseignement',
        body: 'SAP dans les programmes académiques, pédagogie ERP, préparation des étudiants.',
      },
    ],
    allLabel: 'Toutes les catégories',
    filterLegend: 'Filtrer par catégorie',
    levelLegend: 'Filtrer par niveau',
    noResults: 'Aucune ressource ne correspond à ce filtre pour le moment.',
  },

  levels: {
    all: 'Tous les niveaux',
    debutant: 'Débutant',
    intermediaire: 'Intermédiaire',
    avance: 'Avancé',
  },

  start: {
    title: 'Par où commencer ?',
    items: [
      { level: 'debutant', icon: 'bulb', lord: 'book', title: 'Débutant', body: 'Les bases, concepts et principaux processus.' },
      {
        level: 'intermediaire',
        icon: 'chart',
        lord: 'checklist',
        title: 'Intermédiaire',
        body: 'Approfondir les fonctionnalités et les scénarios.',
      },
      {
        level: 'avance',
        icon: 'gear',
        lord: 'experience',
        title: 'Avancé',
        body: 'Scénarios end-to-end, intégrations et optimisation.',
      },
    ],
  },

  featured: {
    eyebrow: 'Guide SAP PP',
    title: 'Qu’est-ce que SAP S/4HANA Production Planning ?',
    body: 'Comprendre le rôle de SAP PP, ses principaux processus et sa place dans la gestion industrielle.',
    chain: ['Demande', 'MRP', 'Capacité', 'Ordre de production', 'Exécution', 'Réception'],
    ctaPrimary: 'Lire le guide',
    ctaSecondary: 'Découvrir la formation SAP PP',
    imageAlt: 'Planificateur consultant un tableau de bord de production sur tablette dans une usine',
  },

  list: {
    eyebrow: 'Bibliothèque',
    title: 'Dernières ressources',
    lead: 'Nos articles, guides et analyses les plus récents.',
    all: 'Voir toutes les ressources',
    draftLabel: 'Brouillon',
    draftNote:
      'Les contenus marqués « Brouillon » ont été rédigés comme base de travail et doivent être relus et validés avant publication.',
    // Shown while no article has been set to `status: 'published'`.
    soonTitle: 'Nos premières publications arrivent',
    soonBody:
      'Nous préparons des guides pratiques sur SAP S/4HANA Production Planning, les processus ERP et les parcours de carrière. En attendant, découvrez notre formation.',
    soonCta: 'Découvrir la formation SAP PP',
  },

  certificationNote:
    'Nos ressources développent la compréhension des processus SAP ; elles ne constituent pas une certification. Les certifications SAP sont délivrées exclusivement par SAP, selon ses propres conditions et examens.',

  // Section désactivée tant qu'aucun lien YouTube réel n'est fourni.
  // Ne jamais afficher de texte d'attente à la place : voir ResourcesPage.astro.
  videos: {
    eyebrow: 'Vidéo',
    title: 'Apprendre aussi en vidéo',
    lead: 'Notre série : SAP S/4HANA — One Scope Item at a Time.',
  },

  teaching: {
    eyebrow: 'Enseignement',
    title: 'Vous enseignez la Supply Chain ou la gestion de production ?',
    body: 'Découvrez nos ressources pédagogiques et notre approche pour intégrer les processus ERP aux programmes d’enseignement.',
    ctaPrimary: 'Ressources pédagogiques',
    ctaSecondary: 'Découvrir l’offre établissements',
  },

  article: {
    backToList: 'Retour aux ressources',
    publishedOn: 'Publié le',
    relatedTitle: 'À lire ensuite',
    relatedEyebrow: 'Ressources',
    relatedLead: 'Poursuivez avec ces contenus complémentaires.',
    ctaEyebrow: 'Prochaine étape',
    ctaLabels: {
      sapPp: 'Découvrir la formation SAP PP',
      training: 'Découvrir nos formations',
      erp: 'Découvrir ERP & Solutions',
      recruitment: 'Découvrir le recrutement',
      institutions: 'Découvrir l’offre établissements',
    },
    ctaTitle: 'Aller plus loin',
    ctaBody: 'Approfondissez le sujet avec un parcours structuré et un accompagnement.',
    draftNotice:
      'Ce contenu est un brouillon rédigé comme base de travail. Il doit être relu et validé par Lagni Consulting avant publication.',
  },

  finalCta: {
    title: 'Continuez à apprendre.',
    body: 'Explorez nos contenus autour de SAP, des ERP, des processus métiers et des compétences numériques.',
    cta: 'Explorer toutes les ressources',
    script: 'Des connaissances d’aujourd’hui pour des opportunités de demain.',
  },
} as const;
