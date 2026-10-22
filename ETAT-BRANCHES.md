# État des branches — comparaison avant réconciliation

Produit le 22 octobre 2026. **Aucune fusion n'a été faite.** Ce document établit
les faits ; l'arbitrage reste à prendre.

```
* a40715c  recette/corrections-octobre   (nouveau commit, travail sécurisé)
| * 0db3c5a  webxify/main                 Update checklist: forms now stored in /admin inbox
| * 85c2d59                               Add admin dashboard to form-service
| * 8f5974f                               Add form-service and wire production forms to /api/form
| * f12df7e                               Add Docker/nginx production setup for Dokploy
|/
* a8758a5  main · origin/main             Refonte du site Lagni Consulting (Astro, FR/EN)
```

Les deux lignes partent du même commit et **ne se recouvrent presque pas**. Ce ne
sont pas deux versions concurrentes du même travail : ce sont deux chantiers
différents menés en parallèle.

---

## 1. Le constat qui change tout : le backend existe déjà

Les 4 commits `webxify` sont l'œuvre de Jean-Baptiste Babatounde Bohiki, les 14 et
15 octobre. Ils apportent :

### `form-service/` — un backend de formulaires complet (272 lignes)

- `POST /api/form` : stocke chaque soumission en **SQLite**, le CV sur disque
- **Tableau de bord `/admin/`** protégé par mot de passe : liste des demandes,
  téléchargement des CV, marquage « traité », suppression, **export CSV**
- Session signée HMAC, cookie `HttpOnly; SameSite=Strict`, comparaison en temps
  constant
- Limitation de débit par IP, pièges anti-spam identiques à ceux du client
  (`website`, `started_at`), contrôle du type et de la taille de fichier
- Notification courriel optionnelle via nodemailer — aucune si `SMTP_HOST` est absent,
  et **l'échec d'envoi ne fait jamais perdre une soumission**
- Repli sans JavaScript : redirection 303 vers `/merci/`
- Une seule dépendance : `nodemailer`

### Déploiement Docker pour **Dokploy**

- `Dockerfile` : build Astro → nginx 1.27 Alpine servant `dist/`
- `nginx.conf` : gzip, en-têtes de sécurité, cache immuable sur `/_astro/`, les
  **mêmes 301 que l'ancien WordPress**, et un `X-Robots-Tag: noindex` automatique
  sur tout hôte autre que `lagniconsulting.ca`
- `form-service/Dockerfile` : le service Node à côté

### Mode démo

`npm run build:demo` publie sous `/d/lagniconsulting` via `SITE_BASE`, avec
`src/lib/url.ts` (`withBase` / `stripBase`) pour que les URL fonctionnent dans les
deux cas — les URL canoniques restant celles du vrai domaine. **C'est la version que
j'ai testée sur webxify.com**, et elle n'a volontairement pas de backend : d'où le
bandeau « pas encore relié » que j'ai relevé.

### Passe de clarté éditoriale

Les 5 titres de page ont été réécrits dans une optique SEO :

| Page | `a8758a5` (cahier) | `webxify` |
| --- | --- | --- |
| Accueil | Les talents qui font avancer les entreprises exigeantes. | Formation SAP, projets ERP et recrutement spécialisé. |
| ERP | Vos systèmes doivent servir vos processus. Pas l'inverse. | Conseil ERP et CRM, de l'analyse à l'adoption. |
| Recrutement | Les bonnes compétences. Les bonnes opportunités. | Recrutement spécialisé en ERP, CRM et transformation numérique. |
| Formations | Développez des compétences qui font la différence. | Formations SAP et ERP, orientées vers la pratique. |
| Ressources | Comprendre les systèmes. Développer les compétences. | Guides et articles sur SAP, les ERP et les carrières. |

C'est un choix assumé : `CONTENT-TO-REPLACE.md` côté webxify ajoute une section
« *Copy rewritten in the UX clarity pass — needs client validation* ». Le sujet est
donc déjà ouvert côté client.

### Un vrai bug corrigé

`ProofBand` : l'animation de comptage a été **supprimée** parce qu'elle laissait
« 0+ » figé à l'écran quand l'`IntersectionObserver` ne se déclenchait pas. J'avais
vu ce « 0+ » lors de ma vérification du 6 octobre et je l'avais pris pour un état
transitoire normal. C'était un bug ; la correction de webxify est la bonne.

---

## 2. Ce que contient la branche de recette

`recette/corrections-octobre` (`a40715c`) — 50 fichiers, +589 / −201 :

- Les **23 points** du cahier de recette (bloquants, majeurs, moyens)
- La **politique de confidentialité bilingue** `/confidentialite/` et `/en/privacy/`,
  liée depuis le pied de page et sous chaque formulaire
- Le masquage de la préproduction : brouillons non routés, instruction interne
  supprimée, témoignages fictifs retirés
- La préselection `?type=` des CTA vers le formulaire de contact
- `compressHTML: false` — cause racine des textes concaténés signalés par la recette
- `public/_redirects` et `public/_headers` (format Cloudflare)
- `RECETTE-REPONSE.md` et `ECARTS-CAHIER.md`

**Vérifié : aucun de ces correctifs n'est présent côté webxify.**

| Correctif | `webxify` |
| --- | --- |
| Instruction interne `CONTENT-TO-REPLACE.md` visible | ❌ toujours présente |
| Triple champ « Organisation » | ❌ toujours présent |
| `<ol>` de `BridgeBand` (colonnes numérotées 1, 3, 5) | ❌ toujours présent |
| `compressHTML: false` | ❌ absent |
| Politique de confidentialité | ❌ absente |
| Préselection `?type=` | ❌ absente |
| Brouillons exclus du site public | ❌ absent |

---

## 3. La fusion est praticable : 5 conflits sur 51 fichiers

Simulation faite avec `git merge-tree` (sans rien modifier) : 46 fichiers fusionnent
automatiquement.

| Fichier | Nature | Résolution proposée |
| --- | --- | --- |
| `src/config.ts` | J'ai mis `FORM_PROVIDER: 'netlify'`, eux `/api/form` | **Prendre webxify.** Leur backend est meilleur et déjà en place. |
| `src/scripts/form.ts` | Même sujet, deux câblages | **Prendre webxify**, en conservant la validation accessible côté client. |
| `src/components/sections/ProofBand.astro` | Eux : suppression du comptage. Moi : séparateur + `aria-label` | **Combiner** : leur structure statique + ma correction de sérialisation. |
| `src/components/pages/ErpPage.astro` | Eux : suppression de la bande d'engagement et des cartes du hero. Moi : `contactHref` + ancres `slug` | **Combiner** : leur structure, mes liens réappliqués là où les éléments subsistent. |
| `CONTENT-TO-REPLACE.md` | Deux réécritures de la liste | **Combiner** les deux checklists. |

Aucun conflit ne porte sur du contenu éditorial : les 5 titres réécrits fusionnent
sans heurt, puisque je n'y avais pas touché.

---

## 4. Conséquences sur les demandes en cours

### L'hébergement Cloudflare est à rediscuter

Le dépôt vise **Dokploy** : deux conteneurs, nginx pour le statique et Node pour le
form-service. **Cloudflare Pages ne peut pas exécuter ce service Node** — ni SQLite
sur disque, ni stockage de CV.

Trois voies, sans préjuger :

1. **Rester sur Dokploy.** Tout fonctionne déjà, le tableau de bord existe, les CV
   restent sur un serveur dont vous choisissez l'emplacement — ce qui simplifie
   l'argument Loi 25.
2. **Statique sur Cloudflare Pages, form-service ailleurs.** Hébergement scindé,
   `/api/form` et `/admin` sur un autre domaine ou sous-domaine ; à traiter côté CORS
   et cookies.
3. **Réécrire le service pour Cloudflare** (Workers + D1 + R2). Travail réel, et on
   perd le tableau de bord existant.

Mon travail Netlify Forms du 5 octobre est **caduc** dans tous les cas : le backend
maison le remplace avantageusement.

### Le dashboard demandé par le client : la moitié existe déjà

Le client veut « un dashboard pour changer le contenu ». Il en existe déjà un — mais
pour les **demandes reçues**, pas pour le contenu. C'est précisément le manque que
j'avais signalé dans le plan CMS (« un CMS git ne montre pas les soumissions »).

Il est donc résolu. Reste la partie contenu, dont le périmètre arrêté était :
articles, témoignages, FAQ, chiffres commerciaux, images, coordonnées.

### La politique de confidentialité doit être revue

Elle a été rédigée en supposant un hébergement des soumissions aux États-Unis
(Netlify). Avec le form-service, **les données restent là où le serveur est
hébergé** — argument nettement plus solide au regard de la Loi 25, mais le texte
doit être corrigé en conséquence.

---

## 5. État actuel du dépôt

- Branche `recette/corrections-octobre` créée, **50 fichiers commités** en `a40715c`
- `main` et `origin/main` intacts sur `a8758a5`
- `webxify/main` récupéré jusqu'à `0db3c5a`, **non fusionné**
- Arbre de travail propre, `npm run build` : 24 pages, 0 erreur

Rien n'est perdu, rien n'est engagé.
