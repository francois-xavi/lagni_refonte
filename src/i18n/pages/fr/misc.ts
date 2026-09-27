export const thanks = {
  seo: {
    title: 'Merci — votre demande a bien été envoyée | Lagni Consulting',
    description: 'Votre demande a bien été transmise à Lagni Consulting.',
  },
  title: 'Merci, votre demande a bien été envoyée.',
  lead: 'Nous avons bien reçu votre message et reviendrons vers vous rapidement.',
  nextTitle: 'Et maintenant ?',
  next: [
    'Nous répondons généralement aux demandes professionnelles dans un délai de 1 à 2 jours ouvrables.',
    'Selon votre demande, nous vous transmettrons le programme, une proposition de rencontre ou des informations complémentaires.',
    'Si votre demande est urgente, vous pouvez nous écrire directement.',
  ],
  exploreTitle: 'En attendant, explorez',
  explore: [
    { route: 'sapPp', label: 'La formation SAP S/4HANA Production Planning' },
    { route: 'erp', label: 'Notre expertise ERP & Solutions' },
    { route: 'resources', label: 'Nos ressources et guides' },
  ],
  backHome: 'Retour à l’accueil',
} as const;

export const notFound = {
  seo: {
    title: 'Page introuvable — Lagni Consulting',
    description: 'La page demandée n’existe pas ou a été déplacée.',
  },
  code: '404',
  title: 'Cette page est introuvable.',
  lead: 'La page que vous cherchez n’existe pas, ou elle a été déplacée lors de la refonte du site.',
  suggestionsTitle: 'Voici quelques pistes',
  backHome: 'Retour à l’accueil',
  contact: 'Nous contacter',
} as const;
