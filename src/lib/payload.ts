import { adopt, problemsIn, usingFallback, type PageKey } from './copy';

import shared from '../content/copy/shared.json';
import home from '../content/copy/pages/home.json';
import training from '../content/copy/pages/training.json';
import sapPp from '../content/copy/pages/sapPp.json';
import erp from '../content/copy/pages/erp.json';
import recruitment from '../content/copy/pages/recruitment.json';
import institutions from '../content/copy/pages/institutions.json';
import about from '../content/copy/pages/about.json';
import resources from '../content/copy/pages/resources.json';
import contact from '../content/copy/pages/contact.json';
import privacy from '../content/copy/pages/privacy.json';
import thanks from '../content/copy/pages/thanks.json';
import notFound from '../content/copy/pages/notFound.json';

/**
 * Reads the site's content from Payload.
 *
 * The committed JSON is the **shape**: every mapping below walks it and pulls
 * the matching value out of what the CMS returned. That keeps one description
 * of the content, and means an unexpected response cannot quietly reshape a
 * page — anything the skeleton does not describe is ignored.
 *
 * Three differences between how the CMS stores content and how the site reads
 * it have to be undone here. Each one exists for a reason recorded in cms/:
 *
 *  - `id` is stored as `key`, because Payload owns `id` on array rows;
 *  - a list of plain text is stored as one string, one item per line;
 *  - arrays are localized, so French and English rows are independent and can
 *    legitimately differ in length.
 */

const SKELETON: { shared: unknown; pages: Record<PageKey, unknown> } = {
  shared,
  pages: {
    home, training, sapPp, erp, recruitment, institutions,
    about, resources, contact, privacy, thanks, notFound,
  },
};

const PAYLOAD_URL =
  import.meta.env.PAYLOAD_URL ?? process.env.PAYLOAD_URL ?? 'http://localhost:3001';

interface Pair {
  fr: string;
  en: string;
}

const isPair = (v: unknown): v is Pair =>
  !!v && typeof v === 'object' && !Array.isArray(v) &&
  typeof (v as Pair).fr === 'string' && typeof (v as Pair).en === 'string' &&
  Object.keys(v as object).length === 2;

/** Mirrors RENAMED in cms/src/lib/fieldsFromContent.ts. */
const cmsName = (name: string) => (name === 'id' ? 'key' : name);

const lines = (v: unknown): string[] =>
  typeof v === 'string' && v.length ? v.split('\n') : [];

const at = (doc: unknown, key: string): unknown =>
  doc && typeof doc === 'object' ? (doc as Record<string, unknown>)[key] : undefined;

/**
 * The shape of an array is the union of its rows, not its first row.
 *
 * `proof.items[0]` carries `count: true` and `items[1]` carries no `count` at
 * all. Taking row 0 as the shape made every later row inherit that flag, and a
 * figure meant to render as plain text rendered as a counter.
 */
function unionShape(rows: unknown[]): unknown {
  const objects = rows.filter(
    (r): r is Record<string, unknown> => !!r && typeof r === 'object' && !Array.isArray(r),
  );
  if (objects.length === 0) return rows[0];
  const merged: Record<string, unknown> = {};
  for (const row of objects) {
    for (const [k, v] of Object.entries(row)) {
      if (v !== undefined && v !== null && !(k in merged)) merged[k] = v;
    }
  }
  return merged;
}

/** Rebuilds the bilingual tree from the two single-language documents. */
function merge(skeleton: unknown, fr: unknown, en: unknown): unknown {
  if (isPair(skeleton)) {
    return { fr: typeof fr === 'string' ? fr : '', en: typeof en === 'string' ? en : '' };
  }

  if (Array.isArray(skeleton)) {
    // The shape is the union of all rows, so optional lists appear on rows
    // that do not have them. An absent list must stay absent: an empty array
    // is truthy, and a component testing `items &&` would render an empty
    // <ul> where it used to render nothing.
    if (fr == null && en == null) return undefined;

    // A list of plain text: one string, one item per line.
    if (skeleton.length > 0 && skeleton.every(isPair)) {
      const a = lines(fr);
      const b = lines(en);
      const count = Math.max(a.length, b.length);
      return Array.from({ length: count }, (_, i) => ({ fr: a[i] ?? '', en: b[i] ?? '' }));
    }
    const rowsFr = Array.isArray(fr) ? fr : [];
    const rowsEn = Array.isArray(en) ? en : [];
    // The editor may have added or removed rows, and the two languages are
    // independent. Taking the longer side means a row added on one side only
    // surfaces as a half-translated field rather than disappearing.
    const count = Math.max(rowsFr.length, rowsEn.length);
    const shape = unionShape(skeleton);
    return Array.from({ length: count }, (_, i) => merge(shape, rowsFr[i], rowsEn[i]));
  }

  if (skeleton && typeof skeleton === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(skeleton)) {
      const name = cmsName(key);
      const merged = merge(value, at(fr, name), at(en, name));
      // A key the CMS has no value for stays absent. Borrowing the skeleton's
      // value would hand this row a flag that belongs to another one.
      if (merged !== undefined) out[key] = merged;
    }
    return out;
  }

  // Structural scalar: whatever the CMS holds, absent if it holds nothing.
  return fr === null ? undefined : fr;
}

async function fetchGlobal(slug: string, locale: 'fr' | 'en', signal: AbortSignal) {
  const url = `${PAYLOAD_URL}/api/globals/${slug}?locale=${locale}&depth=0`;
  const res = await fetch(url, { signal, headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${slug} [${locale}] → HTTP ${res.status}`);
  return res.json();
}

/**
 * Pulls every global and swaps the live content in, if it validates.
 *
 * Returns rather than throws: a CMS that is down, slow or serving something
 * invalid must not take the website with it.
 */
export async function refresh(): Promise<{ ok: boolean; detail: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const slugs = ['shared', ...(Object.keys(SKELETON.pages) as PageKey[])];
    const docs = await Promise.all(
      slugs.map(async (slug) => ({
        slug,
        fr: await fetchGlobal(slug, 'fr', controller.signal),
        en: await fetchGlobal(slug, 'en', controller.signal),
      })),
    );

    const bySlug = new Map(docs.map((d) => [d.slug, d]));
    const head = bySlug.get('shared')!;
    const bundle = {
      shared: merge(SKELETON.shared, head.fr, head.en),
      pages: Object.fromEntries(
        (Object.keys(SKELETON.pages) as PageKey[]).map((key) => {
          const doc = bySlug.get(key)!;
          return [key, merge(SKELETON.pages[key], doc.fr, doc.en)];
        }),
      ),
    };

    const { ok, errors } = adopt(bundle);
    return ok
      ? { ok: true, detail: `${slugs.length} ensembles chargés depuis le CMS` }
      : {
          ok: false,
          detail: `contenu refusé (${errors.length} problème${errors.length > 1 ? 's' : ''}) : ${errors.slice(0, 3).join(' | ')}`,
        };
  } catch (err) {
    return { ok: false, detail: `CMS injoignable : ${(err as Error).message}` };
  } finally {
    clearTimeout(timer);
  }
}

let started: Promise<void> | null = null;

/**
 * Loads the content once, before the first page renders.
 *
 * `usePages()` is synchronous and called from the frontmatter of some forty
 * components; making it async would mean editing every one of them. Loading
 * here, from the middleware, keeps that call synchronous — and keeps the
 * promise that no component changes.
 */
export function ensureContent(): Promise<void> {
  started ??= refresh().then((r) => {
    if (!r.ok) console.warn(`[contenu] ${r.detail} — repli sur le contenu du dépôt`);
    else console.log(`[contenu] ${r.detail}`);
  });
  return started;
}

/** Forces the next request to reload from the CMS. */
export function invalidateContent(): void {
  started = null;
}

export { problemsIn, usingFallback };
