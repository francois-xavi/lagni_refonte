# lagniconsulting.ca

Bilingual (FR/EN) static website for **Lagni Consulting** — training, ERP & solutions,
and specialized recruitment.

Built with [Astro](https://astro.build) in static mode, vanilla CSS, and a very small
amount of vanilla JavaScript. No UI framework, no CSS framework.

---

## Quick start

```bash
npm install
```

```bash
npm run dev
```

Opens a dev server on <http://localhost:4321> (the bundled `.claude/launch.json`
uses port 4331).

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run check` | Astro + TypeScript type checking |

> **After changing a `.astro` `<style>` block, restart `npm run dev`.** Astro's dev
> server occasionally keeps stale scoped CSS, which can make a style change look
> like it did not work.

---

## Site structure

French is the default language and serves from the root. English lives under `/en/`.

| French | English |
| --- | --- |
| `/` | `/en/` |
| `/formations/` | `/en/training/` |
| `/formation-sap-pp/` | `/en/sap-pp-training/` |
| `/erp-solutions/` | `/en/erp-solutions/` |
| `/recrutement/` | `/en/recruitment/` |
| `/etablissements/` | `/en/institutions/` |
| `/a-propos/` | `/en/about/` |
| `/ressources/` | `/en/resources/` |
| `/ressources/<slug>/` | `/en/resources/<slug>/` |
| `/contact/` | `/en/contact/` |
| `/merci/` | `/en/thank-you/` |

---

## Where to change things

### Text copy

**All user-visible text lives in `src/i18n/`** — nothing is hard-coded in templates.

```
src/i18n/
├── fr.ts                 # shared FR strings: nav, footer, forms, credentials
├── en.ts                 # shared EN strings (same shape, checked at build time)
├── routes.ts             # the URL map — see "Adding a page" below
└── pages/
    ├── fr/home.ts training.ts sapPp.ts erp.ts recruitment.ts
    │      institutions.ts about.ts resources.ts contact.ts misc.ts
    └── en/   … the same files, in English
```

To reword something, find it in the matching `pages/<lang>/<page>.ts` and edit the
string. `en.ts` is type-checked against `fr.ts`, so a missing or misspelled key
fails `npm run build` rather than silently rendering a blank.

### Images

No real photography ships with this build. Every photo slot renders a labelled
placeholder at the right aspect ratio.

To add a real image:

1. Drop the file into `public/assets/images/` (WebP or AVIF preferred).
2. Find the `<Figure …>` with the matching `slotName` and add `src="/assets/images/your-file.jpg"`.

The slot names are listed in [`CONTENT-TO-REPLACE.md`](./CONTENT-TO-REPLACE.md).

> ⚠️ **`public/assets/images/logo.png` is a protected brand asset.** Use it exactly
> as supplied: no recolouring, no CSS filters, no cropping, no SVG recreation, no
> text wordmark substitute. It has a solid white background (no transparency), so it
> must sit on a white or near-white surface — `Logo.astro` provides a `plate` prop
> for that. If a background clashes, change the background, never the logo.

### Contact form endpoint

The form is **not connected to anything yet**. Set it in one place:

```ts
// src/config.ts
export const FORM_ENDPOINT = 'REPLACE_ME__FORM_ENDPOINT';
```

Replace that string with your provider's POST URL (Formspree, Netlify Forms,
Basin, a serverless function — anything that accepts a `multipart/form-data`
POST and returns 2xx).

While the placeholder is in place:

- every form shows a visible notice with the fallback email address;
- submitting performs a normal browser POST to `/merci/` so nothing is lost silently.

Once a real endpoint is set, the form submits via `fetch` and redirects to `/merci/`.

Contact details (email, phone, LinkedIn, locality) also live in `src/config.ts`.

### Resources / articles

Articles are Markdown files in a content collection:

```
src/content/resources/fr/<slug>.md
src/content/resources/en/<slug>.md
```

Front matter:

```yaml
---
title: "…"
description: "…"
category: "sap-pp" | "erp" | "tools" | "careers" | "teaching"
level: "debutant" | "intermediaire" | "avance"
date: 2026-09-12
readingMinutes: 8
status: "draft" | "published"
cta: "sapPp" | "training" | "erp" | "recruitment" | "institutions"
---
```

- The filename becomes the URL slug.
- `status: "draft"` (the current default for every seeded article) renders a visible
  "Brouillon / Draft" badge, marks the page `noindex`, and keeps it out of the sitemap.
  **Change to `published` only after the client has reviewed the text.**
- Categories and levels drive the filters on the Resources hub automatically.
- FR and EN articles are independent; an `hreflang` alternate is emitted only when
  the same slug exists in both languages.

### Adding a page

1. Add an entry to `ROUTES` in `src/i18n/routes.ts` with its FR and EN path.
2. Add the copy to `src/i18n/pages/fr/` and `src/i18n/pages/en/`, and register it in
   each `index.ts`.
3. Add the label to the `nav` block of `fr.ts` and `en.ts`.
4. Create `src/pages/<fr-path>/index.astro` and `src/pages/en/<en-path>/index.astro`.

The nav, the footer, the sitemap and the language switcher all read from `ROUTES`,
so they update themselves.

### Design tokens

`src/styles/tokens.css` holds every colour, font, spacing and radius value.

One rule must not be broken: **`--orange-500` (#FF914D) does not meet WCAG AA as
text.** Use it as a *background* behind dark text, or as a non-informational accent.
For orange *text* on a light surface, use `--orange-700`.

---

## Deployment

The build is fully static — any static host works.

### Netlify

`netlify.toml` is committed with the build command, the publish directory, security
headers and the 301 redirect map from the old WordPress URLs.

1. Connect the repository in Netlify.
2. Accept the detected settings (`npm run build` → `dist`).
3. Add the custom domain `lagniconsulting.ca`; HTTPS is provisioned automatically.

### Vercel

`vercel.json` carries the same configuration.

1. Import the repository in Vercel.
2. Framework preset: **Astro**. Build `npm run build`, output `dist`.
3. Add the domain under *Settings → Domains*.

### Before going live

- Set `FORM_ENDPOINT` in `src/config.ts` and send a test submission.
- Review the 301 map in `netlify.toml` / `vercel.json` against the live site's
  existing URLs (Search Console → Pages, or the old sitemap). **Redirect before deleting.**
- Work through [`CONTENT-TO-REPLACE.md`](./CONTENT-TO-REPLACE.md).
- Confirm `site` in `astro.config.mjs` matches the production origin — canonical
  URLs, `hreflang` and the sitemap are all built from it.

---

## Project layout

```
src/
├── components/          reusable UI (header, footer, hero, cards, forms…)
│   ├── forms/           FormShell + FormField
│   └── pages/           one composition component per page
├── content/resources/   article Markdown, by language
├── i18n/                all copy + the route map
├── layouts/             BaseLayout (html, head, header, footer)
├── lib/                 content helpers and JSON-LD builders
├── pages/               thin route files — FR at root, EN under /en/
├── scripts/             shared form behaviour
└── styles/              tokens.css + base.css
```

Everything notable about accessibility, SEO and the logo rules is commented at the
point where it matters in the code.

`_reference/cursor-homepage.html` is the earlier single-page design exploration,
kept for reference only. It is not part of the build.
