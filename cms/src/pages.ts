/**
 * The site's pages, in the order the client should see them in the admin.
 *
 * `key` matches the file name in `src/content/copy/pages/` and the global slug.
 * `label` is what the client reads — the admin is in French.
 */
export const PAGES = [
  { key: 'home', label: 'Accueil' },
  { key: 'training', label: 'Formations' },
  { key: 'sapPp', label: 'Formation SAP PP' },
  { key: 'erp', label: 'ERP & Solutions' },
  { key: 'recruitment', label: 'Recrutement' },
  { key: 'institutions', label: 'Établissements' },
  { key: 'about', label: 'À propos' },
  { key: 'resources', label: 'Ressources' },
  { key: 'contact', label: 'Contact' },
  { key: 'privacy', label: 'Confidentialité' },
  { key: 'thanks', label: 'Page de remerciement' },
  { key: 'notFound', label: 'Page introuvable (404)' },
] as const
