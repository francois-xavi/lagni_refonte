export const erp = {
  seo: {
    title: 'ERP & Solutions — conseil SAP, JD Edwards, Odoo et CRM | Lagni Consulting',
    description:
      'De l’analyse des besoins à l’adoption par les utilisateurs : expertise ERP, CRM et SaaS, avec une spécialisation en processus de production.',
  },

  hero: {
    eyebrow: 'ERP, CRM & applications d’entreprise',
    title: 'Conseil ERP et CRM, de l’analyse à l’adoption.',
    lead: 'Vos systèmes doivent servir vos processus, pas l’inverse. Lagni Consulting accompagne les organisations dans leurs projets SAP, JD Edwards, Odoo et CRM, en combinant compréhension des processus métiers, gestion de projet et accompagnement du changement.',
    ctaPrimary: 'Parler de votre projet',
    ctaSecondary: 'Découvrir notre expertise',
    imageAlt: 'Ingénieur consultant des écrans de supervision de production en usine',
    panel: [
      'Processus métiers',
      'Technologies ERP & CRM',
      'Gestion de projet',
      'Adoption par les utilisateurs',
      'Résultats concrets',
    ],
    script: 'Des processus plus efficaces. Des équipes plus performantes.',
    trustItems: [
      { icon: 'layers', label: 'Processus métiers' },
      { icon: 'database', label: 'ERP & CRM' },
      { icon: 'people', label: 'Adoption' },
    ],
    matchLabel: 'Notre méthode',
    matchTitle: 'Comprendre · Concevoir · Déployer · Adopter',
    matchPills: ['Fit-Gap', 'SIT / UAT', 'Cutover'],
    profileBadge: 'ERP',
    profileLabel: 'Expertise',
    profileTitle: 'SAP · JD Edwards · Odoo',
    profileStatus: 'Implantations end-to-end',
  },

  proof: {
    label: 'Pourquoi Lagni Consulting ?',
    items: [
      { figure: '15+', label: 'ans d’expérience ERP', lord: 'experience', count: true },
      { figure: 'End-to-end', label: 'implantations', lord: 'tools' },
      { figure: 'Métier + Tech', label: 'double expertise', lord: 'network' },
      { figure: 'PMP®', label: 'et certifications SAP', lord: 'medal' },
    ],
  },

  method: {
    eyebrow: 'Notre approche',
    title: 'De la technologie aux résultats opérationnels',
    lead: 'Une méthodologie structurée pour des projets mieux maîtrisés et une adoption durable.',
    steps: [
      {
        n: '01',
        title: 'Comprendre',
        icon: 'search',
        items: ['Processus actuels', 'Besoins métiers', 'Points de friction', 'Objectifs'],
      },
      {
        n: '02',
        title: 'Concevoir',
        icon: 'bulb',
        items: [
          'Processus cibles',
          'Fit-to-Standard / Fit-Gap',
          'Solution fonctionnelle',
          'Plan d’implantation',
        ],
      },
      {
        n: '03',
        title: 'Déployer',
        icon: 'gear',
        items: ['Configuration', 'Tests (SIT / UAT)', 'Migration', 'Cutover'],
      },
      {
        n: '04',
        title: 'Adopter',
        icon: 'people',
        items: ['Formation', 'Support', 'Documentation', 'Amélioration continue'],
      },
    ],
    quote: 'La technologie crée de la valeur lorsqu’elle est réellement utilisée par les équipes.',
  },

  portfolio: {
    eyebrow: 'Nos solutions',
    title: 'Un portefeuille de solutions adapté à vos besoins',
    lead: 'Nous combinons une expertise ERP approfondie avec des solutions complémentaires pour répondre à vos enjeux d’affaires.',
    families: [
      { label: 'Notre expertise ERP', sub: 'Des années d’expérience sur des projets concrets.' },
      { label: 'CRM & automatisation', sub: 'Développer votre relation client.' },
      { label: 'SaaS & applications', sub: 'Des solutions innovantes.' },
    ],
    items: [
      {
        slug: 'sap',
        name: 'SAP S/4HANA',
        family: 0,
        title: 'Production Planning & Manufacturing',
        body: 'Planification et exécution de la production, données de base, MRP, capacité, ordres de production et intégration avec les processus connexes.',
        tags: ['PP', 'Manufacturing', 'QM', 'Données de base (Master Data)', 'Tests', 'Migration'],
        cta: 'Discuter d’un projet SAP',
      },
      {
        slug: 'jde',
        name: 'Oracle JD Edwards',
        family: 0,
        title: 'Une expertise ERP éprouvée',
        body: 'Une solide expérience sur plusieurs cycles d’implantation, notamment dans les domaines de la distribution et de la fabrication.',
        tags: ['Distribution', 'Manufacturing', 'Processus métiers', 'Implémentation', 'Tests', 'Formation', 'Support'],
        cta: 'Discuter d’un projet JD Edwards',
      },
      {
        slug: 'odoo',
        name: 'Odoo',
        family: 0,
        title: 'Un ERP modulaire et intégré',
        body: 'Une solution flexible pour gérer l’ensemble de vos processus d’entreprise : ventes, achats, inventaire, fabrication, comptabilité, projets.',
        tags: ['Ventes', 'Inventaire', 'Fabrication', 'Comptabilité', 'Projets'],
        cta: 'Discuter d’un projet Odoo',
      },
      {
        slug: 'gohighlevel',
        name: 'GoHighLevel',
        family: 1,
        title: 'CRM et automatisation marketing',
        body: 'Une plateforme tout-en-un pour gérer vos prospects, vos communications et vos processus marketing.',
        tags: ['CRM', 'Pipelines de vente', 'Conversations unifiées', 'Automatisation', 'Suivi des leads'],
        cta: 'Discuter d’un projet GoHighLevel',
      },
      {
        slug: 'chataap',
        name: 'Chataap',
        family: 2,
        title: 'L’IA au service de votre entreprise',
        body: 'Solution SaaS centrée sur WhatsApp pour automatiser vos conversations professionnelles, répondre avec l’IA et assurer un suivi structuré.',
        tags: ['Boîte de réception partagée', 'Réponses IA', 'Suivi programmé', 'API / Webhooks'],
        cta: 'Discuter d’un projet Chataap',
      },
    ],
  },

  services: {
    eyebrow: 'Nos services',
    title: 'Des services sur tout le cycle du projet',
    lead: 'De l’analyse des besoins au support après le déploiement, une présence à chaque étape.',
    imageAlt: 'Équipe projet cartographiant un processus métier sur un mur vitré',
    items: [
      {
        icon: 'doc',
        title: 'Analyse fonctionnelle',
        body: 'Comprendre les besoins métiers et les traduire en exigences fonctionnelles.',
      },
      {
        icon: 'network',
        title: 'Processus & Fit-Gap',
        body: 'Comparer les processus existants aux capacités de la solution et identifier les écarts.',
      },
      {
        icon: 'clipboard',
        title: 'Tests (SIT / UAT)',
        body: 'Préparer et coordonner les scénarios de tests, SIT et UAT.',
      },
      {
        icon: 'database',
        title: 'Migration & Cutover',
        body: 'Participer à la préparation des données, aux validations et au passage en production.',
      },
      {
        icon: 'cap',
        title: 'Formation & Adoption',
        body: 'Préparer les utilisateurs et faciliter l’adoption de la nouvelle solution.',
      },
      {
        icon: 'chart',
        title: 'Support & amélioration continue',
        body: 'Accompagner la stabilisation et l’évolution des processus après déploiement.',
      },
    ],
  },

  specialisation: {
    eyebrow: 'Spécialisation',
    title: 'Une spécialisation : les processus de production',
    lead: 'Une compréhension approfondie des processus de planification et d’exécution de la production.',
    chain: [
      'Demande',
      'Planification',
      'MRP',
      'Capacité',
      'Ordre de production',
      'Exécution',
      'Qualité',
      'Réception',
    ],
    systems: ['SAP S/4HANA — PP / QM', 'Oracle JD Edwards — Manufacturing'],
  },

  engagement: {
    eyebrow: 'Modes d’intervention',
    title: 'Comment pouvons-nous intervenir ?',
    lead: 'Des modèles d’intervention flexibles selon vos besoins.',
    items: [
      {
        icon: 'person',
        title: 'Expertise fonctionnelle',
        body: 'Besoin ponctuel d’un analyste ou d’une expertise ERP.',
        cta: 'Discuter du besoin',
      },
      {
        icon: 'sliders',
        title: 'Projet',
        body: 'Accompagnement d’une phase ou d’un chantier ERP.',
        cta: 'Parler du projet',
      },
      {
        icon: 'cap',
        title: 'Formation',
        body: 'Développement des compétences des utilisateurs ou équipes projet.',
        cta: 'Former vos équipes',
      },
    ],
  },

  why: {
    title: 'Pourquoi Lagni Consulting ?',
    items: [
      { icon: 'trophy', label: '15+ ans d’expérience ERP' },
      { icon: 'check', label: 'Implantations end-to-end' },
      { icon: 'people', label: 'Expertise métier + technologie' },
      { icon: 'badge', label: 'PMP® + certifications SAP' },
    ],
    quote: 'Notre approche ne commence pas par le logiciel. Elle commence par le processus métier.',
  },

  cases: {
    eyebrow: 'Expériences',
    title: 'Exemples d’expériences (anonymisées)',
    lead: 'Des projets réalisés dans différents secteurs et contextes.',
    disclaimer:
      'Ces exemples décrivent des types de mandats et ne divulguent aucune information confidentielle. Des études de cas nominatives seront publiées uniquement avec l’autorisation des organisations concernées.',
    items: [
      {
        icon: 'factory',
        title: 'Fabrication & distribution',
        subtitle: 'SAP S/4HANA Public Cloud',
        tags: ['MTS', 'MTO', 'MRP', 'Production', 'QM', 'Migration', 'Tests', 'Adoption'],
      },
      {
        icon: 'box',
        title: 'Projet ERP',
        subtitle: 'Oracle JD Edwards',
        tags: ['Analyse fonctionnelle', 'Implantation', 'Tests', 'Formation', 'Support'],
      },
    ],
  },

  crossSell: {
    eyebrow: 'Recrutement spécialisé',
    imageAlt: 'Recruteuse en échange avec un candidat autour d’une table de réunion',
    title: 'Vous cherchez plutôt un professionnel ERP ?',
    body: 'Lagni Consulting accompagne également les organisations dans l’identification de profils spécialisés ERP, CRM et transformation numérique.',
    cta: 'Découvrir le recrutement spécialisé',
  },

  finalCta: {
    title: 'Parlons de vos processus avant de parler de technologie.',
    body: 'Vous préparez une implantation, une migration, une amélioration de processus ou vous avez besoin d’une expertise ERP, CRM ou d’une solution SaaS ?',
    cta: 'Parler de votre projet',
    script: 'Des solutions au service d’un avenir meilleur.',
  },
} as const;
