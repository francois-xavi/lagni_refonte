export const home = {
  seo: {
    title: 'Lagni Consulting — Formation, ERP & Solutions, recrutement spécialisé',
    description:
      'Lagni Consulting accompagne les professionnels, les établissements d’enseignement et les entreprises : formation SAP S/4HANA, expertise ERP et CRM, et recrutement de talents spécialisés.',
  },

  hero: {
    eyebrow: 'Former. Accompagner. Connecter.',
    title: 'Formation SAP, projets ERP et recrutement spécialisé.',
    lead: 'Nous formons les professionnels à SAP S/4HANA, accompagnons les entreprises dans leurs projets ERP et CRM, et trouvons les profils spécialisés qui les font réussir.',
    ctaPrimary: 'Parler de votre projet',
    ctaSecondary: 'Voir la formation SAP PP',
    trustItems: [
      { label: 'Expertise ERP terrain', icon: 'briefcase' },
      { label: 'Québec · Europe · Afrique', icon: 'globe' },
      { label: 'Accompagnement humain', icon: 'handshake' },
    ],
    imageAlt: 'Équipe en collaboration autour d’un projet technologique',
    valueLine: 'Les processus d’abord.\nLa technologie ensuite.',
  },

  pillars: {
    eyebrow: 'Nos services',
    title: 'Trois façons de vous accompagner.',
    lead: 'Choisissez le point de départ qui correspond à votre besoin.',
    audienceLabel: 'Pour',
    items: [
      {
        title: 'Se former à SAP et aux ERP',
        body: 'Des formations pratiques, centrées sur les processus métier. Formation vedette : SAP S/4HANA Production Planning.',
        audience: 'Professionnels, étudiants et équipes en entreprise',
        cta: 'Voir les formations',
        route: 'training',
        icon: 'cap',
      },
      {
        title: 'Réussir un projet ERP ou CRM',
        body: 'De l’analyse des besoins à l’adoption par les utilisateurs, sur SAP, JD Edwards, Odoo et les solutions CRM.',
        audience: 'Entreprises et organisations',
        cta: 'Voir l’offre ERP',
        route: 'erp',
        icon: 'layers',
      },
      {
        title: 'Recruter un profil spécialisé',
        body: 'Des profils ERP, CRM et transformation numérique qui comprennent la technologie et le processus métier.',
        audience: 'Entreprises qui recrutent et candidats',
        cta: 'Voir le recrutement',
        route: 'recruitment',
        icon: 'people',
      },
    ],
  },

  credibility: {
    label: 'Preuves d’expertise',
    items: [
      { figure: '15+', label: "Ans d'expérience ERP", icon: 'chart' },
      { figure: 'SAP', label: 'S/4HANA Production Planning', icon: 'database' },
      { figure: 'JDE', label: 'Oracle JD Edwards', icon: 'network' },
      { figure: 'PMP®', label: 'Management de projets', icon: 'badge' },
    ],
    footnote:
      'Une expertise construite sur des projets ERP concrets, de l’implantation à l’accompagnement des utilisateurs.',
  },

  sapFocus: {
    eyebrow: 'Formation vedette',
    title: 'Formation SAP S/4HANA Production Planning',
    tagline: 'Comprenez les processus. Pratiquez dans SAP.',
    lead: 'Développez une compétence recherchée en gestion de production.',
    body: 'Un parcours structuré pour développer une compréhension concrète des principaux processus de planification et d’exécution de la production dans SAP S/4HANA.',
    topics: [
      'Données de base',
      'Demand Management',
      'MRP',
      'Capacity Planning',
      'Production Orders',
      'MTS',
      'MTO',
      'Discrete Manufacturing',
    ],
    cta: 'Découvrir la formation SAP PP',
    imageAlt:
      'Consultant travaillant sur deux écrans affichant un module de planification de production SAP',
  },

  institutions: {
    eyebrow: 'Établissements d’enseignement',
    title: 'Intégrez les compétences ERP à vos programmes',
    body: 'Vous êtes une école, une université ou un organisme de formation ? Lagni Consulting accompagne les établissements souhaitant enrichir leurs programmes en gestion de production, supply chain, génie industriel et opérations avec une formation pratique aux systèmes ERP.',
    features: [
      { label: 'Programme adaptable', icon: 'calendar' },
      { label: 'Formation à distance ou en établissement', icon: 'screen' },
      { label: 'Exercices pratiques', icon: 'gear' },
      { label: 'Accompagnement pédagogique', icon: 'people' },
    ],
    cta: 'Découvrir notre offre pour les établissements',
    imageAlt: 'Formateur présentant un processus ERP devant un groupe d’étudiants',
  },

  about: {
    eyebrow: 'À propos de Lagni Consulting',
    title: 'Former. Accompagner. Connecter.',
    body: 'La technologie crée de la valeur lorsque les personnes savent l’utiliser. Lagni Consulting accompagne les professionnels, les organisations et les établissements avec une expertise ERP, formation et recrutement.',
    signatureName: 'Romuald Monthé Kaméni, ing. jr',
    signatureRole: 'Founder · PMP®',
    cta: 'En savoir plus',
    imageAlt: 'Portrait de Romuald Monthé Kameni, fondateur de Lagni Consulting',
  },

  resources: {
    eyebrow: 'Ressources',
    title: 'Nos dernières ressources',
    lead: 'Des articles, guides et conseils sur les systèmes ERP, la formation et les carrières.',
    cta: 'Voir toutes les ressources',
  },

  finalCta: {
    title: 'Faisons avancer votre prochain projet.',
    body: 'Formation, transformation ERP/CRM ou recrutement spécialisé : discutons de votre besoin.',
    cta: 'Nous contacter',
    script: 'Des compétences au service d’un avenir meilleur.',
  },
} as const;
