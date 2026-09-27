# CLAUDE.md — lagniconsulting.ca

Conventions for this repository. Read before changing anything.

## Project

- **Name**: lagniconsulting.ca
- **Business**: Lagni Consulting — training, ERP & solutions, and specialized
  recruitment. Based in Québec, Canada; collaborations across Canada, Europe and Africa.
- **Positioning**: three pillars — **Formation · ERP & Solutions · Recrutement spécialisé**
- **Signature**: *Former. Accompagner. Connecter.*
- **Stack**: Astro 7 (static output), vanilla CSS, minimal vanilla JS. No React, no Tailwind.
- **Languages**: French (default, at the root) and English (under `/en/`)
- **Source of truth for design & content**: the validated cahier de refonte
  (`Lagni_Consulting_Cahier_Refonte_Avec_Maquettes.docx`, v1.0) and its nine mockups.

`_reference/cursor-homepage.html` is a superseded single-page exploration in a
different palette. It is **not** the design reference and is not part of the build.

---

## ⚠️ CRITICAL: logo rules

**File**: `public/assets/images/logo.png` (1206 × 1156, RGB, **no alpha**)

**Never**:
- Recolour, invert, or apply any CSS `filter` to it
- Crop, distort, or change its aspect ratio
- Recreate it as SVG, CSS, text or an icon
- Replace it with a text wordmark
- Generate a new logo or propose a redesign

**Always**:
- Use the exact same file on every page, FR and EN
- `alt="Lagni Consulting"`
- Preserve the 1206:1156 ratio — set height only and let width follow
- Render it through `src/components/Logo.astro`, which enforces the above

Because the file has a **solid white background**, it can only sit on a white or
near-white surface. `Logo.astro` exposes a `plate` prop that puts it on a white
plate for dark sections. **If a background clashes, change the background — never
the logo.**

A build check asserts the file hash, the alt text, the aspect ratio, and that no
CSS filter is ever applied to a logo selector.

---

## Design system

All tokens live in `src/styles/tokens.css`. Do not hard-code colours in components.

```css
--blue-700: #004AAD;   /* brand primary, dominant */
--blue-800 / --blue-900  /* dark sections, heroes, CTA bands */
--blue-050 / --blue-100  /* pale card fills */
--orange-500: #FF914D; /* brand accent — BACKGROUNDS ONLY */
--orange-650: #B85A1F; /* primary-button fill behind WHITE text (4.6:1) */
--orange-700: #AC521A; /* the AA-safe accent for TEXT on light surfaces */
--ink: #1A2433 · --muted: #5B6B7F · --line: #DCE4EE
```

**The one colour rule that must not be broken**: `#FF914D` does **not** meet WCAG AA
as text on white (4.24:1). Use it as a background behind dark text, or as a
non-informational accent. For orange *text* on a light surface use `--orange-700`.

Typography: **Archivo** (headings) + **Inter** (body) + **Caveat** (the handwritten
accent phrases from the mockups), all self-hosted via `@fontsource`. Two families
plus one accent face — do not add more.

Spacing is a 4px scale (`--s-1` … `--s-24`). Radii: 4 / 8 / 12px. Shadows are subtle;
the mockups use borders far more than shadows.

---

## Architecture

```
src/
├── components/       reusable UI; pages/ holds one composition per route
├── content/resources/ article Markdown, by language
├── i18n/             ALL copy + the single route map
├── layouts/          BaseLayout
├── lib/              content helpers, JSON-LD builders
├── pages/            thin route files only — FR at root, EN under /en/
├── scripts/          shared form behaviour
└── styles/           tokens.css, base.css
```

### Rules

- **No copy in templates.** Every user-visible string — including alt text,
  `aria-label`s, validation messages and meta — lives in `src/i18n/`.
  `en.ts` is type-checked against `fr.ts`, so a missing key is a build error.
- **`src/i18n/routes.ts` is the single source of truth for URLs.** The nav, footer,
  sitemap and language switcher are all generated from it. Never hard-code a path.
- **Page files stay thin.** A route file wires the layout to a `components/pages/*`
 composition and nothing else.
- **Compositions are built from `src/components/sections/`** (`ArtHero`, `ProofBand`,
 `NumberedCards`, `FeaturedCard`, `IconTiles`, `StepTimeline`, `ProcessChain`,
 `RowsBand`, `FaqSplit`, `BridgeBand`, …). Reach for an existing section before
 writing page-level markup. Integrity disclaimers (certification, SAP access,
 ecosystems, immigration, drafts) always render through `NoticeCard`; every
 `FormShell` sits inside a `FormCard`.
- **Animated icons** use `LordIcon.astro` (self-hosted JSON in
 `public/assets/icons/lordicon/`). Copy files carry an `icon`/`lord` key; add new
 names to the `LordIconName` union. Entrance animations use
 `data-reveal="fade-up" | "stagger"` plus `import '../../scripts/reveal'`.
- **Astro scoped styles do not reach `<Icon>`.** `Icon.astro` has no `<style>` block,
  so it receives no scope attribute. Any selector targeting a class you passed to
  `<Icon class="…">` **must** be wrapped in `:global()`, or it will silently not apply.
- **Restart `npm run dev` after editing a `<style>` block** — the dev server can
  serve stale scoped CSS.

---

## Content integrity

The brief is explicit about this, and it is a hard constraint:

**Never invent** placement counts, client numbers, satisfaction rates, revenue,
years of experience beyond what the cahier states, partnerships, certifications,
client logos, or testimonials presented as real.

- Vendor names (SAP, Oracle, Odoo, HighLevel, Chataap) are **ecosystems we work
  with, not official partnerships**. Every page that shows them carries that notice.
- **Training is not certification.** SAP certification is issued by SAP alone. Every
  mention of certification says so.
- **Recruitment is not immigration advice.** The site states plainly that Lagni
  Consulting does not guarantee employment, immigration status, permits or visas.
- Where a fact is needed but unconfirmed, render a visible placeholder and list it
  in `CONTENT-TO-REPLACE.md`. Do not fill the gap with plausible-sounding text.

---

## Accessibility

Non-negotiable, and verified on every build:

- Skip link; `<header> <nav> <main> <footer>` landmarks; exactly one `<h1>` per page
- Keyboard-operable menu (Esc closes, focus trapped) and accordions (native `<details>`)
- Visible focus: a dark ring plus a white halo, so it clears 3:1 on both light and
  dark surfaces
- WCAG AA contrast on every text pair actually used
- Never convey state by colour alone — the inquiry chooser and resource filters also
  use a check glyph
- Every `<img>` has meaningful `alt` (or `alt=""` when decorative)
- Every form control has a `<label for>`; errors use `aria-invalid` + `aria-describedby`
  and are announced in a live region
- `prefers-reduced-motion` respected

## Performance

- Zero external JS requests — the few KB of behaviour are inlined per page
- Fonts self-hosted and subset, `font-display: swap`
- Every image slot has explicit `width`/`height` — no layout shift
- Below-the-fold images lazy-loaded

---

## Before you finish

```bash
npm run build && npx astro check
```

Both must be clean. Then confirm: all 20 core routes plus articles build; the
language switcher lands on the equivalent page in both directions; the logo hash is
unchanged; and no placeholder text leaks as if it were real business information.
