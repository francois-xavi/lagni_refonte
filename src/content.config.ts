import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob } from 'astro/loaders';

/**
 * Editorial articles for the Resources hub.
 *
 * One file per article per language, under src/content/resources/<lang>/.
 * `status: 'draft'` marks content written in-house that has NOT been reviewed
 * or published by the client — such articles render with a visible
 * "Brouillon / Draft" label and are excluded from the sitemap.
 */
const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['sap-pp', 'erp', 'tools', 'careers', 'teaching']),
    level: z.enum(['debutant', 'intermediaire', 'avance']),
    date: z.coerce.date(),
    readingMinutes: z.number().int().positive(),
    status: z.enum(['draft', 'published']).default('draft'),
    /** Route key this article should funnel the reader towards. */
    cta: z.enum(['sapPp', 'training', 'erp', 'recruitment', 'institutions']).default('sapPp'),
    /** Filename in /public/assets/images/ — shared by the FR and EN versions. */
    image: z.string().optional(),
  }),
});

export const collections = { resources };
