import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
  },
  auth: {
    /**
     * Lets the website read drafts with a service credential.
     *
     * Live Preview renders the site inside an iframe on a different origin, so
     * no Payload cookie travels with it and `livePreview.url` is given no
     * token. The site therefore needs an identity of its own to ask for
     * unpublished content. The preview secret still gates who may open a
     * preview session at all.
     */
    useAPIKey: true,
  },
  fields: [],
}
