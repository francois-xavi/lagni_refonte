/**
 * ⚠ BROUILLON — À FAIRE VALIDER JURIDIQUEMENT AVANT MISE EN LIGNE.
 *
 * Rédigé à partir de ce que le site collecte réellement (formulaires de
 * contact, mandat employeur, candidature avec CV, partenariat établissement)
 * et de l'hébergement retenu. Les éléments à confirmer par Lagni Consulting
 * sont listés dans CONTENT-TO-REPLACE.md.
 *
 * Référence : Loi 25 (Québec, Loi sur la protection des renseignements
 * personnels dans le secteur privé) et LPRPDE.
 */
export const privacy = {
  seo: {
    title: 'Politique de confidentialité — Lagni Consulting',
    description:
      'Quels renseignements Lagni Consulting recueille, pourquoi, combien de temps ils sont conservés et comment exercer vos droits.',
  },

  hero: {
    eyebrow: 'Confidentialité',
    title: 'Politique de confidentialité',
    lead: 'Cette page explique quels renseignements personnels Lagni Consulting recueille par l’intermédiaire de ce site, à quelles fins, pendant combien de temps ils sont conservés, et comment vous pouvez exercer vos droits.',
    updated: 'Dernière mise à jour',
    updatedDate: '6 octobre 2026',
  },

  draftNotice:
    'Ce texte est un brouillon de travail préparé par l’équipe de développement. Il doit être revu et validé par Lagni Consulting, et relu par un conseiller juridique, avant la mise en production du site.',

  sections: [
    {
      title: 'Qui est responsable de vos renseignements',
      body: [
        'Lagni Consulting, établie au Québec (Canada), est responsable des renseignements personnels recueillis par l’intermédiaire de ce site.',
        'Pour toute question relative à cette politique ou à l’exercice de vos droits, écrivez-nous à l’adresse indiquée à la fin de cette page.',
      ],
    },
    {
      title: 'Quels renseignements sont recueillis',
      body: [
        'Nous ne recueillons que les renseignements que vous nous transmettez volontairement au moyen des formulaires du site. Aucun compte n’est créé et aucune donnée n’est achetée auprès de tiers.',
      ],
      items: [
        'Formulaire de contact : prénom, nom, courriel, pays, type de demande et contenu de votre message. Selon le type de demande : organisation, formation souhaitée, profil, solution concernée, poste recherché, programme ou nombre d’étudiants.',
        'Formulaire employeur (recrutement) : organisation, nom, courriel professionnel, poste recherché, domaine, type de contrat et description du besoin.',
        'Formulaire candidat (recrutement) : nom, courriel, domaine d’expertise, années d’expérience et votre curriculum vitæ (PDF, DOC ou DOCX, 5 Mo maximum).',
        'Formulaire établissement : nom de l’établissement, pays, nom et fonction du contact, courriel, programme concerné, nombre d’étudiants et période envisagée.',
      ],
    },
    {
      title: 'Pourquoi ces renseignements sont recueillis',
      items: [
        'Répondre à votre demande et assurer le suivi des échanges qui en découlent.',
        'Vous transmettre les informations demandées sur nos formations, nos services ou nos offres de partenariat.',
        'Pour les candidatures : évaluer votre profil au regard des mandats de recrutement en cours et vous proposer des opportunités professionnelles pertinentes.',
        'Pour les demandes employeurs : comprendre le besoin et préparer une proposition de service.',
      ],
      note: 'Vos renseignements ne sont utilisés à aucune autre fin. Nous ne vendons, ne louons et n’échangeons aucun renseignement personnel.',
    },
    {
      title: 'Sur quelle base nous les traitons',
      body: [
        'Le traitement repose sur votre consentement, que vous donnez en cochant la case prévue avant l’envoi de chaque formulaire, ainsi que sur notre intérêt légitime à répondre à une demande commerciale que vous avez initiée.',
        'Vous pouvez retirer votre consentement à tout moment, sans que cela remette en cause les échanges déjà réalisés.',
      ],
    },
    {
      title: 'Qui y a accès',
      body: [
        'Les renseignements sont accessibles aux personnes de Lagni Consulting chargées de traiter votre demande.',
      ],
      items: [
        'Hébergement du site et traitement des formulaires : les soumissions, curriculum vitæ compris, sont reçues et conservées sur le serveur de Lagni Consulting, et non chez un service tiers de collecte de formulaires. Localisation du serveur : à confirmer.',
        'Courriel : les notifications de nouvelles demandes sont acheminées vers la boîte professionnelle de Lagni Consulting.',
      ],
      note: 'Nous ne communiquons vos renseignements à aucun autre tiers, sauf obligation légale. Dans le cadre d’un mandat de recrutement, un curriculum vitæ n’est transmis à un employeur qu’après vous en avoir informé.',
    },
    {
      title: 'Combien de temps ils sont conservés',
      items: [
        'Demandes de contact et d’information : conservées le temps de traiter la demande, puis archivées pour une durée maximale de 24 mois.',
        'Candidatures et curriculum vitæ : conservés jusqu’à 24 mois à compter de la réception, afin de pouvoir vous proposer des opportunités. Passé ce délai, ils sont supprimés.',
        'Demandes employeurs et partenariats : conservées pour la durée de la relation d’affaires, puis selon les obligations comptables et légales applicables.',
      ],
      note: 'Vous pouvez demander la suppression de vos renseignements à tout moment, avant ces échéances.',
    },
    {
      title: 'Vos droits',
      body: [
        'Conformément à la législation applicable au Québec, vous disposez des droits suivants :',
      ],
      items: [
        'Accéder aux renseignements personnels que nous détenons à votre sujet.',
        'Faire rectifier un renseignement inexact, incomplet ou équivoque.',
        'Retirer votre consentement et demander la suppression de vos renseignements.',
        'Demander que vos renseignements vous soient communiqués dans un format technologique structuré et couramment utilisé.',
        'Porter plainte auprès de la Commission d’accès à l’information du Québec si vous estimez que vos droits n’ont pas été respectés.',
      ],
      note: 'Pour exercer un de ces droits, écrivez-nous. Nous répondons dans un délai de 30 jours.',
    },
    {
      title: 'Témoins de connexion (cookies) et mesure d’audience',
      body: [
        'Ce site ne dépose aucun témoin de connexion publicitaire ou de suivi, et n’utilise aucun outil de mesure d’audience tiers.',
        'Les seules données techniques traitées sont les journaux de connexion de l’hébergeur, nécessaires au fonctionnement et à la sécurité du site.',
        'Si un outil de mesure d’audience devait être ajouté, cette page serait mise à jour et un mécanisme de consentement serait mis en place au préalable.',
      ],
    },
    {
      title: 'Sécurité',
      body: [
        'Le site est servi en HTTPS et les formulaires sont transmis de façon chiffrée. L’accès aux soumissions est protégé par authentification.',
        'Aucun système n’étant infaillible, nous ne pouvons garantir une sécurité absolue, mais nous nous engageons à vous informer sans délai en cas d’incident susceptible de porter atteinte à vos renseignements.',
      ],
    },
    {
      title: 'Modifications de cette politique',
      body: [
        'Cette politique peut être modifiée afin de refléter une évolution du site ou de la réglementation. La date de dernière mise à jour figure en haut de cette page.',
      ],
    },
  ],

  contact: {
    title: 'Nous joindre',
    body: 'Pour toute question sur cette politique ou pour exercer vos droits :',
    cta: 'Nous écrire',
  },
} as const;
