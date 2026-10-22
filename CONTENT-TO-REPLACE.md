# Content to supply before launch

Everything the client must provide or confirm before `lagniconsulting.ca` goes live.

Nothing in this build invents a statistic, a client name, a testimonial, a partnership
or a credential. Where a fact was needed and not available, the site either omits it
or shows an obvious placeholder. This file lists every one of those.

**Legend** — 🔴 blocks launch · 🟠 should be done before launch · 🟡 can follow later

---

## 🟠 1. Formulaires — test de bout en bout

| Item | Where | Current state |
| --- | --- | --- |
| Form destination URL | `src/config.ts` → `FORM_ENDPOINT` | `/api/form` → `form-service/` (production only) |
| Admin inbox | `https://lagniconsulting.ca/admin/` | login = `ADMIN_PASSWORD` env var on Dokploy (`lagni-form-service`) |

`form-service/` stores every submission (CV included) in SQLite on the `/data` volume;
the client reads them at `/admin/`. Optional email notification: set `SMTP_HOST`,
`SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO` — any provider, no code change.
Demo builds still have no endpoint and go straight to `/merci/`.

Reste à valider en conditions réelles, après le premier déploiement :

- [ ] Poser `ADMIN_PASSWORD` (12 caractères minimum) sur Dokploy et vérifier
      l'ouverture de `/admin/`
- [ ] Tester les 4 formulaires et vérifier leur arrivée dans `/admin/` :
      - Contact, pour les 6 types de demande
      - Mandat employeur (page Recrutement)
      - Candidature avec CV en PDF, DOC et DOCX, plus un refus au-delà de 5 Mo
      - Partenariat établissement
- [ ] Vérifier le repli sans JavaScript : redirection vers `/merci/`, soumission conservée
- [ ] Décider du routage de chaque type de demande (boîte partagée, CRM)

## 🔴 2. Certifications — exact official wording

The cahier warns explicitly against approximate certification names. These render
today with a visible "intitulé officiel à confirmer" notice.

| Item | Where |
| --- | --- |
| SAP Certified Associate — Production Planning (**C_TS422**) | `src/i18n/fr.ts` + `en.ts` → `credentials.items` |
| SAP Certified Associate — Business Process Integration (**C_IEE2E**) | same |
| PMP® — Project Management Professional | same |

Please confirm: the exact certificate titles as issued, the current version/year of
each exam code, and whether each is active. Once confirmed, set `pending: false` on
those entries and the warning disappears automatically.

---

## 🔴 3. Contact details

Currently taken from the previous site's footer. Confirm they are still correct:

| Item | Current value | Where |
| --- | --- | --- |
| Email | `info@lagniconsulting.ca` | `src/config.ts` → `CONTACT.email` |
| Phone | `+1 418 570 0429` | `CONTACT.phone` |
| Locality | `Québec, Canada` | `CONTACT.locality` |
| LinkedIn | `linkedin.com/company/lagni-consulting/` | `CONTACT.linkedin` — **verify this URL resolves** |

No street address is published anywhere. Tell us if you want one added, or if the
phone number should be removed in favour of the form only.

---

## 🔴 4. Pages légales

**La politique de confidentialité existe désormais en brouillon bilingue**
(`/confidentialite/` et `/en/privacy/`), liée depuis le pied de page et sous
chaque formulaire. Elle porte un encadré visible indiquant qu'elle doit être
validée.

- [ ] **Faire relire la politique de confidentialité par un conseiller
      juridique**, puis retirer l'encadré `draftNotice` dans
      `src/i18n/pages/{fr,en}/privacy.ts`
- [ ] Confirmer les durées de conservation proposées (24 mois pour les
      candidatures et les demandes de contact)
- [ ] **Corriger la section « hébergement des données » de la politique** : elle a
      été rédigée en supposant un hébergement tiers aux États-Unis. Avec
      `form-service/`, les soumissions et les CV restent sur le serveur Dokploy —
      argument nettement plus solide au regard de la Loi 25. Confirmer la
      localisation de ce serveur, puis l'énoncer dans
      `src/i18n/pages/{fr,en}/privacy.ts`
- [ ] Désigner le responsable de la protection des renseignements personnels
- [ ] Terms of use
- [ ] Cookie notice — **only needed if analytics or another tracker is added.** The
      site currently sets no cookies and loads no third-party scripts, so no banner
      is required as built.
- [ ] Legal notices / company registration details, if required in your jurisdiction

Once supplied, add them as pages and link them from `SiteFooter.astro`.

---

## 🟠 5. Photography

Only the founder portrait (`public/assets/images/founder.jpg`) and the home hero
photo are real so far. Every other image slot renders a labelled
placeholder at the correct aspect ratio, so adding a photo changes nothing else in
the layout.

Drop files in `public/assets/images/` and pass `src` to the matching `<Figure>`.

| Slot name | Page | Suggested subject | Ratio |
| --- | --- | --- | --- |
| `hero-home` | Home | Professional in an industrial setting with a production dashboard | 4:3 |
| `hero-training` | Formations | AI-generated placeholder in place (`hero-training.webp`, learner at a laptop with an ERP dashboard) — replace with a real photo when available | 9:11 |
| `training-sap-pp` | Formations | AI-generated placeholder in place (`training-sap-pp.webp`, planner with a tablet on a production floor) — replace with a real photo when available | 5:4 |
| `training-audiences` | Formations | AI-generated placeholder in place (`training-audiences.webp`, small group of learners around a laptop) — replace with a real photo when available | 5:4 |
| `hero-sap-pp` | SAP PP | AI-generated placeholder in place (`hero-sap-pp.webp`, planner in front of a production planning screen) — replace with a real photo when available | 9:11 |
| `sap-pp-practice` | SAP PP | AI-generated placeholder in place (`sap-pp-practice.webp`, two learners working through a case study) — replace with a real photo when available | 5:4 |
| `hero-erp` | ERP & Solutions | AI-generated placeholder in place (`hero-erp.webp`, engineer in front of production monitoring screens) — replace with a real photo when available | 9:11 |
| `erp-services` | ERP & Solutions | AI-generated placeholder in place (`erp-services.webp`, project team mapping a process on a glass wall) — replace with a real photo when available | 5:4 |
| `hero-recruitment` | Recrutement | AI-generated placeholder in place (`hero-recruitment.webp`, recruiter reviewing a candidate profile on a laptop) — replace with a real photo when available | 9:11 |
| `recruitment-why` | Recrutement | AI-generated placeholder in place (`recruitment-why.webp`, two professionals discussing an ERP role over a process diagram) — replace with a real photo when available | 5:4 |
| `hero-institutions` | Établissements | AI-generated placeholder in place (`hero-institutions.webp`, trainer with a student group in a computer lab) — replace with a real photo when available | 9:11 |
| `institutions-programmes` | Établissements | AI-generated placeholder in place (`institutions-programmes.webp`, programme coordinator and trainer planning a course) — replace with a real photo when available | 5:4 |
| `hero-about` | À propos | AI-generated placeholder in place (`hero-about.webp`, empty consulting workspace — deliberately no person, so it is never mistaken for the founder). Ideal replacement: the founder in a real work setting | 9:11 |
| `about-story` | À propos | AI-generated placeholder in place (`about-story.webp`, whiteboard with a hand-drawn process flow) — replace with a real photo when available | 5:4 |
| `hero-resources` | Ressources | AI-generated placeholder in place (`hero-resources.webp`, learning desk flat-lay) — replace with a real photo when available | 9:11 |
| `hero-contact` | Contact | AI-generated placeholder in place (`hero-contact.webp`, consultant on a call at a desk — not a team member) — replace with a real photo when available | 9:11 |
| ~~`founder-portrait`~~ | SAP PP, Formations, À propos, Établissements | ✅ Supplied — `founder.jpg` (Romuald Monthé Kameni) | 7:8 |
| `home-sap-pp` | Home | AI-generated placeholder in place (`home-sap-pp.webp`) — replace with a real photo when available | 5:4 |
| `home-institutions` | Home | AI-generated placeholder in place (`home-institutions.webp`) — replace with a real photo when available | 5:4 |
| ~~`home-about`~~ | Home | ✅ Supplied — `founder.jpg` | 7:6 |
| `resources-featured` | Ressources | AI-generated placeholder in place (reuses `resource-what-is-sap-pp.webp`) — replace with a real photo when available | 19:12 |
| `erp-cross-sell` | ERP & Solutions | AI-generated placeholder in place (`erp-cross-sell.webp`, recruiter in conversation with a candidate) — replace with a real photo when available | 5:4 |
| `resource-<slug>` | each article (cards + article hero) | AI-generated placeholders in place, set via the `image` front-matter field and shared by FR/EN: `resource-what-is-sap-pp`, `resource-mrp-s4hana`, `resource-sap-pp-master-data`, `resource-production-order`, `resource-mts-mto`, `resource-erp-career` (`.webp`) — replace with real photos when available | 16:9 |
| `cta-*` | closing band on each page | Wide, dark-friendly backdrop | 16:5 |

The brief asks for **real people in real work situations** — industry, teaching,
technology — and explicitly warns against generic stock imagery, staged handshakes
and people smiling at the camera.

Also needed: **`public/assets/images/og-default.png`** (1200×630) for social sharing.
It is referenced by the `og:image` tag but does not exist yet.

---

## 🟠 6. Editorial content

Six articles per language ship as **drafts** — written in-house as a working basis,
clearly labelled, `noindex`, and excluded from the sitemap.

| Slug (FR / EN) |
| --- |
| `qu-est-ce-que-sap-pp` / `what-is-sap-pp` |
| `mrp-dans-sap-s4hana` / `mrp-in-sap-s4hana` |
| `donnees-de-base-sap-pp` / `sap-pp-master-data` |
| `production-order-cycle-de-vie` / `production-order-lifecycle` |
| `mts-vs-mto` / `mts-vs-mto` |
| `carriere-consultant-erp` / `erp-consultant-career` |

For each: review the text, then set `status: "published"` in the front matter. They
will then be indexed and appear in the sitemap.

Still to come from the client:
- [ ] The full pillar guide "Qu'est-ce que SAP S/4HANA Production Planning ?"
- [ ] YouTube links for the *SAP S/4HANA — One Scope Item at a Time* series
      (the Resources page shows a placeholder where the videos go)
- [ ] Any remaining articles from the list in §25 of the cahier

---

## 🟠 6b. Copy rewritten in the UX clarity pass — needs client validation

The headlines below were rewritten so a first-time visitor can tell what Lagni
offers within a few seconds. No new facts were added: every service, system and
audience named already appears elsewhere in the validated cahier. Please confirm
or amend each one (FR and EN).

| Page | Field | Before (validated) | After (proposed) |
| --- | --- | --- | --- |
| Accueil | Hero eyebrow | *(written but not displayed)* Recrutement spécialisé · Québec & international | Former. Accompagner. Connecter. |
| Accueil | H1 | Les talents qui font avancer les entreprises exigeantes. | Formation SAP, projets ERP et recrutement spécialisé. |
| Accueil | Lead | Lagni Consulting connecte les entreprises à des experts rares… | Nous formons les professionnels à SAP S/4HANA, accompagnons les entreprises dans leurs projets ERP et CRM, et trouvons les profils spécialisés qui les font réussir. |
| Accueil | CTAs | Recruter un expert · Découvrir Lagni | Parler de votre projet · Voir la formation SAP PP |
| Accueil | Hero tags | Expertise métier · Regard international · Accompagnement humain | Expertise ERP terrain · Québec · Europe · Afrique · Accompagnement humain |
| Accueil | Hero card | Le bon profil. Au bon moment. | Les processus d’abord. La technologie ensuite. |
| Accueil | Services heading | Les trois piliers — Une plateforme claire pour avancer. | Nos services — Trois façons de vous accompagner. |
| Accueil | Service cards | Formation · ERP & Solutions · Recrutement spécialisé (+ “Découvrir”) | Se former à SAP et aux ERP · Réussir un projet ERP ou CRM · Recruter un profil spécialisé, each with a “Pour : …” audience line and a named link |
| Formations | H1 / tagline | Développez des compétences qui font la différence. | H1: Formations SAP et ERP, orientées vers la pratique. — the old H1 becomes the tagline |
| ERP & Solutions | H1 / lead | Vos systèmes doivent servir vos processus. Pas l’inverse. | H1: Conseil ERP et CRM, de l’analyse à l’adoption. — the old H1 opens the lead, which now names SAP, JD Edwards, Odoo and CRM |
| Recrutement | H1 / lead | Les bonnes compétences. Les bonnes opportunités. | H1: Recrutement spécialisé en ERP, CRM et transformation numérique. — the old H1 opens the lead |
| Ressources | H1 | Comprendre les systèmes. Développer les compétences. | Guides et articles sur SAP, les ERP et les carrières. |

English mirrors each change in `src/i18n/pages/en/*.ts`.

**Removed from the homepage:** the dark “Entreprises” band (it repeated the three
services) and the two decorative hero cards (“Matching spécialisé”, “Profil
recommandé · Consultant ERP · Disponible”), which read like a live product UI.
**Removed as duplicates on inner pages:** the founder block on Formations and
Établissements (it stays on À propos, Formation SAP PP and the homepage), the
“Comment pouvons-nous intervenir ?” band on ERP, the pillars band on À propos, and
the cross-links band on Recrutement. The copy for these still sits in `src/i18n/`
so any of them can be restored.

---

## 🟠 7. Proof and social proof

Deliberately left empty rather than invented:

| Item | Where it would go | Current state |
| --- | --- | --- |
| Participant testimonials | SAP PP page | "Votre témoignage pourrait être ici" placeholder |
| Client logos | not built | omitted — needs written permission before use |
| Named case studies | ERP & Solutions | two anonymised engagement summaries, with a disclaimer |
| Partner institutions | Établissements | "Nos futurs partenaires seront présentés ici" placeholder |
| Placement counts, satisfaction rates, client numbers | nowhere | **not used anywhere, by design** |

Supply only what is real and authorised. Testimonials need the person's consent and
their name/role as they want it shown.

---

## 🟠 8. Commercial details to confirm

These are rendered from the cahier and should be re-checked against what is actually
being sold:

- [ ] **SAP PP course length.** The cahier gives both 60 h and 40 h in different
      sections (§18 says 60 h / 20 sessions; §19 and §22 say 40 h / 20 sessions).
      **The site currently says 40 hours across 20 sessions of 2 hours.** Confirm.
- [ ] 12-month support period — confirm what is actually offered and for how long
- [ ] Pilot cohort size (currently "up to 15 participants")
- [ ] Pricing, payment terms, cohort calendar — **not published anywhere yet**
- [ ] Whether students get access to an SAP environment, and on what terms. The site
      deliberately promises nothing here and says access is confirmed per cohort.
- [ ] Which partner-delivered trainings are actually active (JDE, GoHighLevel,
      project management) — the Formations page lists them as "according to the
      offer actually available"

---

## 🟠 9. Regulatory wording — recruitment

- [ ] If Lagni Consulting holds a Quebec recruitment licence (AR — *agence de
      recrutement*) or any equivalent authorisation, supply the **exact official
      wording and number**. The Recruitment page has a marked slot for it.
- [ ] Confirm the international recruitment disclaimer reads correctly for your
      situation. As written, the site states plainly that Lagni Consulting does not
      guarantee employment, immigration status, permits or visas, and gives no
      immigration advice.

---

## 🟠 10. 301 redirects from the old site

A redirect map is committed in `netlify.toml` and `vercel.json`, derived from the
page inventory in §11 and §27 of the cahier: JD Edwards, QuickBooks, Web Development,
Newcomer support, legacy recruitment pages, `/blog/*`, and the old `/fr` prefix.

- [ ] **Export the real URL list** from Google Search Console (Pages) or the current
      sitemap and check every indexed URL is covered.
- [ ] Add anything missing. Redirect before deleting — never the other way round.

---

## 🟡 11. Social and analytics

- [ ] Confirm the LinkedIn company URL
- [ ] YouTube channel URL (the footer has a slot ready)
- [ ] Any other professional channels
- [ ] Decide on analytics. Nothing is installed. If you add one, it must respect
      applicable consent rules — and at that point a cookie notice becomes necessary.
- [ ] Google Search Console and Bing Webmaster verification, after launch

---

## 🟡 12. Nice to have

- [ ] A short founder bio video or audio intro for the About page
- [ ] A downloadable SAP PP syllabus PDF (the "Recevoir le programme" CTA currently
      routes to the contact form)
- [ ] Real institution partner logos, once agreements exist
