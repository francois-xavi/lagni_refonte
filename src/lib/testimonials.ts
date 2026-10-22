/**
 * Testimonials, editable from the dashboard.
 *
 * One JSON file per testimonial in `src/content/testimonials/`, both languages
 * in the same object — same reason as the FAQ: a testimonial cannot ship half
 * translated.
 *
 * The collection is **empty on purpose**. The brief forbids inventing social
 * proof, so until the client supplies authorised quotes the SAP PP page renders
 * a real, useful aside instead. `author` and `role` are required so a
 * testimonial can never be published as anonymous filler.
 */
import { z } from 'astro:schema';
import type { Lang } from '../i18n/routes';
import { fillFigures } from './settings';

const one = z.object({
  quote: z.string().min(1),
  author: z.string().min(1),
  role: z.string().min(1),
});

const schema = z.object({
  /** Ascending; ties fall back to the file name. */
  order: z.number().int().optional(),
  fr: one,
  en: one,
});

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

const files = import.meta.glob('../content/testimonials/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

const parsed = Object.entries(files)
  .map(([path, raw]) => ({ path, value: schema.parse(raw) }))
  .sort(
    (a, b) =>
      (a.value.order ?? 0) - (b.value.order ?? 0) || a.path.localeCompare(b.path),
  );

export function getTestimonials(lang: Lang): readonly Testimonial[] {
  return parsed.map(({ value }) => ({
    quote: fillFigures(value[lang].quote),
    author: value[lang].author,
    role: fillFigures(value[lang].role),
  }));
}
