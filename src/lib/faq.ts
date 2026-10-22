/**
 * FAQ entries, editable from the dashboard.
 *
 * Each entry holds **both languages in one object**, deliberately: the editor
 * fills French and English side by side in a single form, so a question cannot
 * ship half-translated. That is what replaces the `satisfies FrDict` check the
 * entries used to get from living in the i18n dictionaries.
 *
 * Section titles stay in `src/i18n/` — they are structural copy, not content.
 */
import { z } from 'astro:schema';
import type { Lang } from '../i18n/routes';
import { fillFigures } from './settings';
import contact from '../content/faq/contact.json';
import institutions from '../content/faq/institutions.json';
import sapPp from '../content/faq/sapPp.json';

const entry = z.object({ q: z.string().min(1), a: z.string().min(1) });
const schema = z.array(z.object({ fr: entry, en: entry })).min(1);

const files = { contact, institutions, sapPp };

export type FaqPage = keyof typeof files;

export interface FaqEntry {
  q: string;
  a: string;
}

type Bilingual = Record<Lang, FaqEntry>;

/** Parsed once at build time: an empty question or answer fails the build. */
const parsed = Object.fromEntries(
  Object.entries(files).map(([page, raw]) => [page, schema.parse(raw)]),
) as Record<FaqPage, Bilingual[]>;

export function getFaq(page: FaqPage, lang: Lang): readonly FaqEntry[] {
  return parsed[page].map((e) => ({
    q: fillFigures(e[lang].q),
    a: fillFigures(e[lang].a),
  }));
}
