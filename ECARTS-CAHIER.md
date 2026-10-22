# Écarts entre le cahier de refonte et l'implémentation

Audit du dépôt au 6 octobre 2026, confronté au cahier de refonte validé
(`Lagni_Consulting_Cahier_Refonte_Avec_Maquettes.docx`, v1.0, « document maître »,
9 pages spécifiées section par section).

**Méthode** : chaque élément listé dans le cahier a été recherché dans le code et
dans le build. Un bloc qui existe sous un titre approchant est classé *partiel*,
pas *implémenté*. Les constats sensibles ont été revérifiés manuellement.

**Résultat global** : sur ~75 éléments spécifiés, **~55 sont implémentés**,
**12 partiels**, **8 absents**. Le détail et surtout *le pourquoi* suivent.

---

## ⚠ Avertissement préalable : deux versions divergentes

Le site déployé sur `webxify.com/d/lagniconsulting/` — celui que le client a
recetté — **n'est pas la version de ce dépôt**.

| Page | Déployé | Dépôt |
| --- | --- | --- |
| `/` | Formation SAP, projets ERP et recrutement spécialisé. | Les talents qui font avancer les entreprises exigeantes. |
| `/erp-solutions/` | Conseil ERP et CRM, de l'analyse à l'adoption. | Vos systèmes doivent servir vos processus. Pas l'inverse. |
| `/recrutement/` | Recrutement spécialisé en ERP, CRM et transformation numérique. | Les bonnes compétences. Les bonnes opportunités. |
| `/formations/` | Formations SAP et ERP, orientées vers la pratique. | Développez des compétences qui font la différence. |

Les H1 déployés ont subi une passe SEO qui n'existe **nulle part dans ce dépôt**
(un seul commit, arbre de travail propre). Les titres du dépôt sont, eux,
exactement ceux du cahier.

**Conséquence** : il faut trancher laquelle des deux versions fait foi avant tout
déploiement, sinon la passe SEO sera écrasée — ou les corrections de la recette
ne seront jamais mises en ligne.

---

## 1. Non implémenté — décisions assumées

Ces écarts résultent de choix explicites, pas d'oublis.

### 1.1 Les articles de ressources (et tout ce qui en dépend)

Les 12 articles (6 FR + 6 EN) sont en `status: "draft"` et **exclus du site
public**, par décision prise le 5 octobre en réponse au point `CONTENT-001` de la
recette.

Un seul drapeau fait tomber six exigences du cahier d'un coup :

| Exigence du cahier | État |
| --- | --- |
| 5 catégories de ressources | codées, non rendues |
| Guide vedette « Qu'est-ce que SAP PP ? » | codé, article existant, non routé |
| Filtres par niveau | codés, non rendus |
| Cluster SEO pilier → articles → landing | structuré, aucune page indexable |
| Fil d'Ariane | codé, seulement sur les pages d'article |
| 9 articles initiaux recommandés | 6 rédigés en brouillon, 3 absents |

**Pourquoi** : ces articles sont des brouillons rédigés en interne, jamais relus
par Lagni Consulting. Les publier serait engager la parole du client sur des
contenus qu'il n'a pas validés.

**Pour lever le blocage** : faire relire les 6 articles, puis passer leur
`status` à `published`. Les six lignes du tableau ci-dessus se réactivent
automatiquement, sans développement.

> Les 3 articles manquants du cahier — Work Center, BOM vs Routing, compétences
> SAP PP, certification SAP — n'ont pas été rédigés. Les deux premiers sujets sont
> traités à l'intérieur de l'article « données de base ».

### 1.2 Série vidéo « One Scope Item at a Time » et section YouTube

**Non implémenté. Volontairement.** Aucun lien YouTube n'a été fourni. Le
placeholder qui occupait cette place était précisément le défaut `CONTENT-002` de
la recette (une instruction interne visible par les visiteurs). La section
entière a été retirée plutôt que remplacée par un texte d'attente.

**Pour lever** : fournir les URL des vidéos. La structure par épisode demandée
par le cahier (vidéo, résumé, processus, points clés, schéma) reste à construire.

### 1.3 Infolettre

**Non implémenté.** Le cahier la conditionne lui-même : « *seulement lorsque la
cadence de contenu justifie son lancement* ». Aucun article n'étant publié, la
condition n'est pas remplie.

### 1.4 Hiérarchie du menu (Formations / SAP PP au même niveau)

**Non modifié volontairement.** La recette le reproche, mais le cahier §16
(« Arborescence finale ») place explicitement les deux au premier niveau. La
recette contredit ici l'arborescence validée par le client. Détaillé dans
`RECETTE-REPONSE.md`.

---

## 2. Non implémenté — en attente du client

### 2.1 Témoignages

Le cahier exige des témoignages « *uniquement réels et autorisés* ». Aucun n'a été
fourni. La structure existe (`testimonials.items`) : renseigner un tableau de
`{ quote, author, role }` les affiche automatiquement à la place du bloc d'aide
qui occupe la place aujourd'hui.

### 2.2 Études de cas nommées

Deux mandats anonymisés sont présentés, avec la clause de confidentialité
correspondante. Le cahier prévoit « *1 à 3 études de cas anonymisées ou
autorisées à mesure qu'elles deviennent disponibles* » — l'état actuel est donc
conforme, mais incomplet tant qu'aucune autorisation n'est obtenue.

### 2.3 Prix, dates de cohorte, disponibilité

Absents du site. Le cahier les mentionne comme réducteurs d'incertitude avant
contact (`SUG-002`). Aucune donnée commerciale n'a été fournie.

### 2.4 Carte de redirections réelle

Le mécanisme est en place et triplé (`public/_redirects` pour Cloudflare,
`netlify.toml`, `vercel.json`), avec les 14 règles déduites du cahier. Mais le
**jeu de données n'est pas vérifié** : il faut exporter la liste réelle des URL
indexées depuis Search Console avant la bascule DNS.

---

## 3. Non implémenté — vrais manques, à corriger

Ceux-là ne sont ni des décisions ni des attentes : ils auraient dû être faits.

### 3.1 🔴 Image de partage social absente — *priorité 1*

Chaque page du site déclare :

```html
<meta property="og:image" content="https://lagniconsulting.ca/assets/images/og-default.png">
```

**Ce fichier n'existe pas**, ni dans `public/`, ni dans le build. Tout partage sur
LinkedIn, WhatsApp, Slack ou Teams affichera un aperçu vide. Pour un cabinet qui
mise sur LinkedIn, c'est coûteux et c'est une seule image à produire (1200 × 630).

### 3.2 🔴 Certifications : affirmées sans réserve, intitulés exacts absents — *priorité 1*

Le cahier est explicite : « *Afficher les certifications SAP pertinentes avec une
formulation exacte et vérifiable* » et « *pour les certifications, utiliser les
intitulés exacts* ».

État réel, vérifié dans le build :

- Un bloc `credentials` existe dans les dictionnaires, avec les intitulés complets
  (`SAP Certified Associate — Production Planning (C_TS422)`,
  `C_IEE2E`, `PMP® — Project Management Professional`) et un drapeau
  `pending: true` assorti de la mention « Intitulé officiel à confirmer avant
  publication ».
- **Ce bloc n'est consommé par aucun composant.** Ni les intitulés, ni la mention
  « à confirmer » n'atteignent un visiteur.
- **Mais « PMP® » et « PMP® — et certifications SAP » sont affirmés sans aucune
  réserve sur 6 pages** (accueil, formations, ERP, et leurs équivalents anglais).

C'est le pire des deux mondes : la revendication passe, la prudence non. C'était
précisément ce que votre décision du 26 septembre visait à éviter
(« utiliser, mais adoucir les certifications »). À corriger avant mise en ligne.

### 3.3 🟠 Balisage structuré incomplet

Trois générateurs sont écrits dans `src/lib/schema.ts` et **ne sont jamais
appelés** :

| Schéma | État | Impact |
| --- | --- | --- |
| `Organization`, `WebSite` | émis — accueil FR/EN uniquement | correct |
| `FAQPage` | générateur écrit, **jamais utilisé** | Contact, Établissements et SAP PP affichent de vraies FAQ sans balisage |
| `BreadcrumbList` | générateur écrit, **jamais utilisé** | — |
| `Article` | **aucun générateur** | les articles, une fois publiés, n'auront pas de balisage |

Le cahier demande « *schema Organization, Article et FAQ seulement lorsque le
contenu affiché correspond réellement* ». La condition est remplie pour FAQ : les
FAQ existent et sont visibles. C'est un gain SEO direct, non pris.

### 3.4 🟠 Accordéons par séance sur la page SAP PP

Le cahier §19 demande : « *Accordéons par séance : Concepts | Démonstration SAP |
Exercice | Résultat attendu* ».

L'implémentation présente les **5 phases** dans une frise plate, sans accordéon,
et la structure « Concepts / Démonstration / Exercice / Résultat » apparaît **une
seule fois**, en bandeau statique. Ni les 20 séances, ni même un accordéon par
phase.

C'est l'élément de contenu le plus substantiel manquant sur la page de conversion
principale : c'est ce qui permet au prospect de juger la densité du programme.

### 3.5 🟠 Bouton flottant « Recevoir le programme »

Le cahier §19 demande « *un bouton flottant discret* » sur la page SAP PP.
**Aucun élément flottant n'existe dans le code** — recherche de `position: fixed`
dans tout `src/` : aucun résultat. Le CTA n'est présent qu'en haut de page et
dans le bandeau final.

### 3.6 🟠 Bloc écosystèmes sur la page Recrutement

Le cahier §21 demande des « *écosystèmes visibles : SAP, JDE, Odoo, HighLevel,
Chataap, Power BI* ». Il n'y a **aucun bloc** : seulement « SAP, JDE, Odoo, CRM,
SaaS… » dans le corps d'une carte, et « Power BI » comme puce. HighLevel et
Chataap n'apparaissent nulle part sur cette page.

### 3.7 🟠 Page de confirmation non différenciée

Le cahier §9 et §24 demandent « *une page de confirmation personnalisée selon le
type de demande* ». `/merci/` est une page unique et générique pour les quatre
formulaires. Le texte contourne en restant vague (« Selon votre demande, nous
vous transmettrons… »).

Maintenant que les CTA transmettent `?type=`, la mécanique est à moitié en place.

### 3.8 🟡 Regroupement par familles sur la page ERP

Le cahier §20 structure le portefeuille en trois familles : *Expertise ERP*
(SAP, JDE, Odoo), *CRM & automatisation* (HighLevel), *SaaS & applications*
(Chataap).

**Les données sont là** — chaque solution porte son `family`, et les trois
intitulés avec leurs accroches sont définis — mais le rendu les ignore : les cinq
cartes s'affichent à plat, la famille réduite à une petite étiquette. Les
accroches de famille ne sont jamais affichées.

C'est la correction la moins chère de la liste : la donnée existe, seul le rendu
manque.

### 3.9 🟡 Écarts de contenu ponctuels

| Écart | Détail |
| --- | --- |
| Hero d'accueil | Le cahier demande « Développez les compétences. Transformez les organisations. » / « Formation • ERP & CRM • Recrutement spécialisé ». Le dépôt affiche un hero recrutement. *(Le site déployé, lui, affiche un troisième libellé — voir l'avertissement en tête.)* |
| « Intelligence d'affaires » | Le 5ᵉ item du bandeau de crédibilité du cahier §17 est absent du site |
| PMP® sur la page SAP PP | Présent dans le bloc formateur de /formations/, **absent** de celui de /formation-sap-pp/ |
| CTA « Devenir partenaire » | Demandé sur l'accueil §17, présent uniquement sur la page Recrutement |
| Signature pédagogique | Le cahier §18 veut « Comprendre. Pratiquer. Être accompagné. » ; /formations/ titre « Apprendre. Pratiquer. Comprendre les processus. » |
| Paragraphe fondateur | Le 2ᵉ paragraphe de `founderSection.body` existe mais n'est jamais rendu sur /a-propos/ |
| Bloc preuves accueil | `FounderSplit` accepte des points de crédibilité ; l'accueil n'en passe aucun |
| Données mortes | `erp.why.items` et `about.hero.script` sont définis et jamais consommés |

---

## 4. Rappel — points de la recette hors périmètre

Décidés hors périmètre le 5 octobre, détaillés dans `RECETTE-REPONSE.md` :
`UX-004` (libellé CTA), `NAV-006` (CTA final redondant), `UX-005` (modalités
d'accompagnement), `SUG-001` (segmentation par audience sur l'accueil),
`SUG-002` (prix et cohortes), `SUG-003` (preuves sociales), `SUG-004` (fil
d'Ariane).

---

## 5. Ordre recommandé

| Priorité | Action | Effort | Bloquant ? |
| --- | --- | --- | --- |
| 1 | Produire `og-default.png` (1200 × 630) | 30 min | partages sociaux cassés |
| 2 | Brancher `credentials` + retirer les « PMP® » non qualifiés | 1 h | **conformité** |
| 3 | Trancher : version déployée ou version du dépôt | décision | **bloque tout déploiement** |
| 4 | Émettre `FAQPage` sur Contact / Établissements / SAP PP | 1 h | gain SEO direct |
| 5 | Regrouper le portefeuille ERP par familles | 1 h | donnée déjà présente |
| 6 | Accordéons par séance sur SAP PP | 3–4 h | contenu de conversion |
| 7 | Bloc écosystèmes sur Recrutement | 1 h | — |
| 8 | Bouton flottant SAP PP | 1 h | — |
| 9 | Confirmation différenciée par type | 2 h | — |
| 10 | Écarts de contenu ponctuels (§3.9) | 2 h | — |
| — | Faire relire et publier les 6 articles | client | débloque 6 exigences |
