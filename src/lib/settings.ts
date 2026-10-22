/**
 * Single source for the commercial figures and the contact details.
 *
 * Figures are stored as **numbers, never as phrases**. The copy keeps its own
 * grammar around a `{token}` placeholder, because the same figure is worded
 * differently per language and per position: `40 heures`, `un parcours de
 * 40 heures`, and in English the adjectival `a 40-hour programme`. Storing
 * "40 heures" and substituting it would produce "a 40 heures programme" the
 * first time anyone edits it.
 *
 * Zod runs at build time: an out-of-range or missing value fails the build
 * rather than reaching a page. This is what replaces the compile-time safety
 * the i18n dictionaries get from `satisfies FrDict`.
 */
import { z } from 'astro:schema';
import raw from '../content/settings/site.json';

const schema = z.object({
  figures: z.object({
    hours: z.number().int().positive(),
    sessions: z.number().int().positive(),
    sessionHours: z.number().int().positive(),
    supportMonths: z.number().int().positive(),
    maxParticipants: z.number().int().positive(),
  }),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().min(1),
    phoneDisplay: z.string().min(1),
    locality: z.string().min(1),
    linkedin: z.string().url(),
  }),
});

const site = schema.parse(raw);

export const FIGURES = site.figures;
export const CONTACT = site.contact;

export type FigureName = keyof typeof FIGURES;

const TOKEN = /\{(\w+)\}/g;

/**
 * Replaces `{hours}` and friends in one string. An unknown token is left
 * untouched on purpose — a typo must stay visible rather than silently
 * blanking a sentence.
 */
export function fillFigures(text: string): string {
  return text.replace(TOKEN, (match, name: string) =>
    name in FIGURES ? String(FIGURES[name as FigureName]) : match,
  );
}

/**
 * Walks a copy dictionary and fills every string it holds. Applied once per
 * language in `useTranslations` / `usePages`, so no component has to know that
 * figures are interpolated at all.
 */
export function fillDeep<T>(value: T): T {
  if (typeof value === 'string') return fillFigures(value) as T;
  if (Array.isArray(value)) return value.map(fillDeep) as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = fillDeep(v);
    return out as T;
  }
  return value;
}
