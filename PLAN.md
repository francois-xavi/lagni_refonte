# Lagni Consulting — Full Bilingual Site Rebuild

> **Status: implemented.** This is the approved plan, kept for reference.
> See `README.md` for how to run and maintain the site, and
> `CONTENT-TO-REPLACE.md` for what the client still needs to supply.

## Context

`lagniconsulting.ca` is today a dated multilingual WordPress/Elementor site positioned narrowly as "recruitment agency specialized in Enterprise Application Software". The business has since evolved to **three pillars — Formation, ERP & Solutions, Recrutement spécialisé** — and the client has produced a consolidated design brief (`Lagni_Consulting_Cahier_Refonte_Avec_Maquettes.docx`, v1.0, marked *document maître*) containing **nine fully-rendered, validated page mockups**.

The current repository holds a single Cursor-generated homepage (`index.html`) in an ivory/navy/gold art direction with a recruitment-only message. **That homepage is superseded** — it predates the validated brief, contradicts its palette and its information architecture. This was confirmed with the user, who also chose: Astro static output, full FR + EN at launch, and real client facts used with certification wording softened to placeholders.

Outcome: a nine-page bilingual (18-route) static site that reproduces the validated mockups, built from reusable components with centralized translations, deployable to Netlify or Vercel.

### Key discovery — the logo
`assets/images/logo.png` (1206×1156, **RGB, no alpha, solid white background**) is the real current Lagni mark: a blue/orange stylized figure above "LAGNI Consulting". It is **not** the horizontal lockup drawn inside the mockups — those are illustrative approximations.

- Use the real file unchanged on every page, `alt="Lagni Consulting"`, aspect ratio preserved, **no CSS filters, no recolor, no crop, no SVG recreation**.
- Because it has no transparency, it may only sit on white or near-white surfaces. The mockups' dark-blue CTA bands must **not** carry the logo; footers in the mockups are white, which already works.
- Its blue/orange confirm the brief's palette is the true brand palette.

---

## Design system (extracted from the validated mockups)

```css
--blue-900:#002E6B; --blue-700:#004AAD; /* dominant */ --blue-500:#1565C7;
--blue-100:#E8F0FB; --blue-050:#F4F8FD;   /* pale card fills */
--orange-500:#FF914D;                      /* CTAs & accents only */
--orange-050:#FFF3EA;                      /* warm card fills */
--ink:#1A2433; --muted:#5B6B7F; --line:#DCE4EE; --white:#FFF; --bg:#FAFBFD;
--radius:8px; --radius-lg:12px;
--shadow-sm:0 1px 3px rgba(0,46,107,.08); --shadow-md:0 4px 16px rgba(0,46,107,.10);
```
Spacing scale 4px-based (4/8/12/16/24/32/48/64/96). Type: one family, a geometric/grotesk sans in two weights (headings 700, body 400/500) — **Inter** for body + **Archivo** (semi-condensed, matches the mockups' tighter headline caps) for headings, self-hosted via `@fontsource` to avoid a Google Fonts round trip.

Recurring visual patterns to build once and reuse across all nine pages:
- Dark-blue hero with a right-side photograph, an overlaid translucent feature list, and a handwritten-script accent phrase (rendered as **text in a script webfont**, not an image).
- Pale-tinted (blue or orange) bordered cards with a line icon, title, and checklist.
- Numbered / chevron-arrow process strips (`Comprendre → Concevoir → Déployer → Adopter`).
- Blue credibility band with 4 icon+figure columns.
- Accordion FAQ blocks.
- Full-bleed dark CTA band with a photo backdrop, closing every page.

Icons: one inline SVG sprite, stroke-based, drawn to match the mockups. No icon-font dependency.

---

## Technology

**Astro 5, static output (`output: 'static'`), vanilla CSS, zero client JS by default.**

Rationale: nine pages × two languages = 18 routes sharing one header, one footer and ~20 components. Astro gives real component reuse and per-route `<head>` control (unique title/description/canonical/hreflang/OG) while shipping no framework runtime — the built pages are plain HTML + CSS, which is what the brief's Core Web Vitals requirement wants. No React (nothing here needs client state beyond accordions and a form, both fine in ~2 KB of vanilla JS). No Tailwind, per the brief and `.cursorrules`.

The existing `index.html` is kept at `/_reference/cursor-homepage.html` as an archived artifact, not served.

### Folder structure
```
/
├── astro.config.mjs        # site URL, static output
├── package.json
├── public/
│   └── assets/images/logo.png        ← untouched, byte-identical copy
├── src/
│   ├── i18n/
│   │   ├── fr.ts  en.ts              # ALL copy, deeply nested by page
│   │   ├── routes.ts                 # FR↔EN route map (drives the switcher)
│   │   └── utils.ts                  # t(), localizePath(), getAlternates()
│   ├── layouts/BaseLayout.astro      # <html lang>, Seo, header, main, footer
│   ├── components/
│   │   ├── SiteHeader · MobileNav · LanguageSwitcher · SiteFooter · Seo
│   │   ├── Button · SectionHeading · PageHero · CtaBand · Breadcrumbs
│   │   ├── PillarCard · FeatureCard · ChecklistCard · ProcessSteps
│   │   ├── StatBand · SolutionCard · AudienceCard · TrainerProfile
│   │   ├── FaqAccordion · ResourceCard · VideoCard · QuoteBlock · ScriptAccent
│   │   └── forms/ ContactForm · FormField · Select · FileField · ConsentField
│   ├── content/resources/{fr,en}/*.md # Astro content collection for articles
│   ├── pages/                         # FR at root, EN under /en/
│   └── styles/{tokens,base,utilities}.css
├── PLAN.md · README.md · CONTENT-TO-REPLACE.md
```

### Routes (18)

| FR | EN | Mockup |
|---|---|---|
| `/` | `/en/` | image1 |
| `/formations/` | `/en/training/` | image2 |
| `/formation-sap-pp/` | `/en/sap-pp-training/` | image3 |
| `/erp-solutions/` | `/en/erp-solutions/` | image5 |
| `/recrutement/` | `/en/recruitment/` | image4 |
| `/etablissements/` | `/en/institutions/` | image6 |
| `/a-propos/` | `/en/about/` | image7 |
| `/ressources/` | `/en/resources/` | image9 |
| `/contact/` | `/en/contact/` | image8 |
| `/merci/` | `/en/thank-you/` | confirmation, per §9 of brief |

Plus `/404`, `/en/404`, `sitemap-index.xml`, `robots.txt`.

> Note: these routes follow the .docx's final arborescence (§16), which differs from the earlier draft prompt (`/solutions/ /talents/ /international/`). The .docx is the authoritative source.

### Bilingual strategy
- `src/i18n/routes.ts` is a single ordered array of `{ fr, en, labelKey }`. It generates the nav, the footer, the sitemap, and the language switcher — so the switcher always lands on the **equivalent** page, never the homepage.
- Every page renders `<html lang="fr">` / `lang="en"`, plus `hreflang="fr-CA"`, `hreflang="en-CA"` and `hreflang="x-default"` (→ FR) alternates.
- `fr.ts` is authored first as the source of truth; `en.ts` is written as natural Canadian-market business English, not a transliteration. Nav labels, buttons, form labels, validation messages, `aria-label`s, alt text and meta all live in the dictionaries.
- FR is the default and serves from the root — no redirect, no language sniffing.

---

## Content rules

Facts rendered from the .docx as validated client input: founder **Romuald Monthé Kameni**, 15+ years ERP, Oracle JD Edwards / SAP S/4HANA PP / Odoo / HighLevel / Chataap, the 40 h — 20 × 2 h SAP PP course, five-phase curriculum, 12-month support, markets Canada • Europe • Afrique.

Softened to visible placeholders pending client confirmation (the .docx itself warns to use exact official wording):
- SAP certification identifiers `C_TS422` / `C_IEE2E` and PMP® — rendered from a single `credentials` block in the i18n files with a `⚠ à confirmer` marker in `CONTENT-TO-REPLACE.md`.

Hard prohibitions carried into the build: no fabricated placement counts, client logos, or testimonials presented as real (the mockups' testimonial slot already reads "Votre témoignage pourrait être ici" — kept as-is); vendor logos labelled **"écosystèmes utilisés, non des partenariats officiels"**; training explicitly distinguished from SAP-delivered certification; recruitment explicitly separated from any immigration promise; no physical address beyond "Québec, Canada".

Contact details present in the repo and therefore usable: `info@lagniconsulting.ca`, `+1 418 570 0429` (from the current `index.html` footer).

### Contact form
Five inquiry types (Formation / Formation entreprise / ERP & Solutions / Recrutement / Établissement) + "Autre", each revealing its own field set per the brief's form matrix (§26). Progressive enhancement: all fieldsets present in the HTML, JS narrows them; without JS the full form still submits.

Endpoint is a **single configuration constant** in `src/config.ts` (`PUBLIC_FORM_ENDPOINT`), defaulting to an obvious placeholder and documented in the README — no provider assumed. Posts via `fetch`, renders inline success/failure states, and falls back to a native POST to `/merci/`. Honeypot + time-trap for spam. Accessible validation: `aria-invalid`, `aria-describedby`, errors announced in a `role="alert"` live region, focus moved to the first invalid field.

### Accessibility & SEO
Skip link; one `<h1>` per page; semantic landmarks; keyboard-operable accordions (`<button aria-expanded>` + `<details>` fallback) and mobile nav with focus trap and Esc; visible `:focus-visible` rings; `prefers-reduced-motion` honored; AA contrast — **orange #FF914D fails AA on white for text, so it is used only as a background behind white/near-black text or as a non-informational accent**, never as body-text color.

Per page: unique title + meta description, canonical, hreflang set, OG/Twitter tags. `Organization` and `WebSite` JSON-LD from verified data only; `FAQPage` JSON-LD emitted only on pages that actually render an FAQ; no `ContactPage` schema beyond confirmed details.

### Performance
Mockup photography is not in the repo. Every photographic slot is built with Astro's `<Image>` against a committed lightweight SVG placeholder of the right aspect ratio, with `width`/`height` always set (no CLS) and `loading="lazy"` below the fold. Swapping in real assets is a file drop, documented in `CONTENT-TO-REPLACE.md`. Fonts self-hosted, `font-display:swap`, subset. Total client JS target < 8 KB.

---

## Build order

1. Scaffold Astro; move `index.html` to `/_reference/`; copy `logo.png` into `public/` untouched; tokens + base CSS; `BaseLayout`, `Seo`, header/footer/nav/switcher; i18n plumbing + `routes.ts`.
2. Shared component library (heroes, cards, process strips, bands, accordion, CTA band).
3. Pages, FR first in the brief's own order: Accueil → SAP PP → Formations → ERP & Solutions → Recrutement → Établissements → À propos → Contact + `/merci` → Ressources (+ 3–6 seed articles as a content collection, dated and clearly marked as drafts).
4. `en.ts` and the EN routes.
5. 404, sitemap, robots, JSON-LD.
6. `README.md`, `CONTENT-TO-REPLACE.md`; refresh `CLAUDE.md` to the real palette/stack (it currently describes Cotonou/Playfair/navy-gold, all stale).

---

## Verification

```bash
npm install
npm run build          # must exit 0
npm run preview
npx astro check        # type checking
```

Then, reported honestly with actual output:
- Confirm `dist/` contains all 18 route directories plus 404 and sitemap.
- Crawl the built output for broken internal links and for any `href` that 404s.
- Assert every FR page's switcher target equals its `routes.ts` EN pair, and that hreflang pairs are reciprocal.
- **Logo integrity**: `sha256` of `public/assets/images/logo.png` equals that of the original; grep the built CSS/HTML for `filter:`, `invert`, `hue-rotate`, `brightness` applied to any logo selector — must be zero hits.
- Browser pane pass at **375 / 768 / 1024 / 1440 px** on all nine FR pages and spot checks in EN; capture and report any overflow or layout break.
- Keyboard-only walkthrough: skip link → nav → mobile menu open/close/Esc → accordion → full form submit; verify focus is always visible.
- Contrast check on every text/background pair actually used.
- Console must be clean; reduced-motion verified by emulating `prefers-reduced-motion: reduce`.
- Grep the build for lorem ipsum, unreplaced `TODO`, and any numeric claim not traceable to the .docx.

If anything fails I fix the root cause and re-run that check rather than reporting around it.

## Known limitations to state up front
- All photography is placeholder; the mockups' imagery is not in the repo.
- Certification identifiers render as flagged placeholders until confirmed.
- No form provider is wired — the endpoint constant must be set before launch.
- 301 redirects from the old WordPress URLs are specified in `CONTENT-TO-REPLACE.md` but can only be applied on the real host (`netlify.toml` / `vercel.json` will be generated with the mapping ready).


---

## Implementation notes (deviations from the plan as written)

- **Astro 7, not Astro 5.** `astro@5` shipped with a critical advisory chain
  (XSS via `define:vars`, spread attributes, view transitions; RCE via AVIF
  optimisation; plus vulnerable `esbuild`/`sharp`). Installing `astro@latest`
  (7.3.5) resolves all of them — `npm audit` reports 0 vulnerabilities.
- **Page copy is one module per page** (`src/i18n/pages/<lang>/<page>.ts`) rather
  than two monolithic dictionaries, so a client editing one page's wording opens one
  small file. Shared strings still live in `fr.ts` / `en.ts`, and EN is type-checked
  against FR so a missing key fails the build.
- **Heroes and CTA bands render solid blue until a real photograph exists.** The
  striped placeholder behind a translucent scrim washed the hero out and hurt text
  contrast, so the photo layer is only rendered when a `src` is supplied; a small
  dashed marker names the slot for the editor in the meantime.
- **`--orange-700` was darkened from #C25F21 to #AC521A.** The original failed AA as
  text on white (4.24:1) and on the tinted card fills. It now clears 4.8:1 everywhere
  it is used for text.
- **The focus indicator is a dark ring plus a white halo** rather than an orange
  ring. No single orange clears 3:1 against both the white surfaces and the dark-blue
  heroes; the two-layer ring does.
- **`html { overflow-x: clip }`** rather than `hidden`, so a stray horizontal
  scrollbar cannot appear without turning the root into a scroll container (which
  would break the sticky header).
- A 301 redirect map was generated into `netlify.toml` and `vercel.json` from the
  cahier's page inventory; it is flagged in `CONTENT-TO-REPLACE.md` as needing
  verification against the live site's real URL list before launch.
