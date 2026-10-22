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

### Formulaires

Les quatre formulaires postent vers **`form-service/`**, le backend Node livré
dans ce dépôt, exposé par nginx sur `/api/form`. Aucune clé d'API, aucun
prestataire tiers.

| Point | Où |
| --- | --- |
| Destination | `src/config.ts` → `FORM_ENDPOINT` (`/api/form` en production) |
| Boîte de réception | `https://lagniconsulting.ca/admin/`, mot de passe = `ADMIN_PASSWORD` |
| Stockage | SQLite + CV sur le volume `/data` du conteneur |

Chaque soumission est enregistrée avant toute notification : **un envoi de
courriel qui échoue ne fait jamais perdre une demande.** Le client lit, marque
« traité », télécharge les CV et exporte en CSV depuis `/admin/`.

Les formulaires déclarés : `contact`, `recruitment-employer`,
`recruitment-candidate` (avec téléversement de CV) et `institution-partnership`.
Un champ caché `locale` distingue les soumissions françaises des anglaises, et
`form_name` — avec un tiret bas, c'est le nom de colonne attendu par le service.

Sans JavaScript, le navigateur effectue un POST natif : `form-service` répond
par une redirection 303 vers `/merci/`. Rien n'est perdu.

> **Confidentialité** — les soumissions et les CV restent sur le serveur Dokploy,
> et non chez un prestataire tiers. C'est un argument nettement plus solide au
> regard de la Loi 25, mais **la localisation de ce serveur reste à confirmer** et
> doit être énoncée dans la politique de confidentialité.

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
- `status: "draft"` (valeur actuelle de tous les articles) **exclut entièrement
  l'article du site public** : aucune page n'est générée, il n'apparaît ni dans
  les listes, ni sur l'accueil, ni dans le sitemap.
  Passer à `published` **seulement après relecture par le client**.
- Tant qu'aucun article n'est publié, la page Ressources masque les catégories,
  la carte vedette et les filtres, et affiche un état « bientôt » maîtrisé.
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

Deux conteneurs sur **Dokploy** : nginx pour le site statique, Node pour le
backend de formulaires. Cloudflare Pages et Vercel ont été écartés — ils ne
peuvent exécuter ni le service Node, ni conserver un volume pour les CV.

### 1. Le site — `Dockerfile` à la racine

Build Astro puis nginx 1.27 Alpine servant `dist/`. `nginx.conf` porte le gzip,
les en-têtes de sécurité, le cache immuable sur `/_astro/`, les 301 de l'ancien
site WordPress, et un `X-Robots-Tag: noindex` automatique sur tout hôte autre que
`lagniconsulting.ca` — les environnements de recette ne sont jamais indexés.

### 2. Le backend — `form-service/Dockerfile`

| Variable | Obligatoire | Rôle |
| --- | --- | --- |
| `ADMIN_PASSWORD` | **oui**, 12 caractères minimum | accès à `/admin/`. En deçà, le tableau de bord reste fermé |
| `DATA_DIR` | non (`/data`) | SQLite + CV — **monter un volume persistant ici** |
| `SITE_URL` | non | origine utilisée pour les redirections |
| `PORT` | non (`3000`) | port d'écoute ; `nginx.conf` proxifie vers 3000 |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO` | non | notification par courriel. Absents, le service n'envoie rien et stocke quand même |
| `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH` | non | publication du contenu depuis `/admin/contenu/`. **Absents, le dashboard tourne à blanc** : il enregistre les brouillons et montre ce qu'il publierait, sans rien écrire |

Le jeton est un **PAT fine-grained limité à ce seul dépôt**, permission
*Contents: read & write*. Il vit en variable d'environnement Dokploy — jamais
dans l'image, jamais dans le dépôt. Le dépôt visé doit être celui que le
webhook Dokploy surveille, sinon la publication n'aurait aucun effet visible.

Router `/api/form` et `/admin/` vers ce conteneur.

### Avant la mise en ligne

- Poser `ADMIN_PASSWORD` et vérifier l'ouverture de `/admin/`.
- Envoyer une soumission de test sur les quatre formulaires, CV compris, et
  confirmer leur arrivée dans la boîte.
- Vérifier le volume : redémarrer le conteneur ne doit perdre aucune demande.
- Rejouer les 301 contre les URL réellement indexées (Search Console → Pages,
  ou l'ancien sitemap). **Rediriger avant de supprimer.**
- Dérouler [`CONTENT-TO-REPLACE.md`](./CONTENT-TO-REPLACE.md).
- Confirmer que `site` dans `astro.config.mjs` correspond à l'origine de
  production — les URL canoniques, les `hreflang` et le sitemap en découlent.
- `nginx -t` au premier déploiement : la syntaxe n'a pas pu être validée
  localement.

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
