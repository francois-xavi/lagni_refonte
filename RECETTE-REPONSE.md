# Réponse à la recette — Lagni Consulting

> ⚠️ **Ce document date du 6 octobre et précède la fusion du 22 octobre.
> Ne pas l'envoyer au client en l'état.** Trois affirmations y sont devenues
> fausses : les formulaires ne passent plus par Netlify mais par `form-service/`
> avec sa boîte `/admin/` ; les soumissions et les CV ne sont plus hébergés aux
> États-Unis mais sur le serveur Dokploy ; et le champ caché s'appelle désormais
> `form_name`, non `form-name`. S'y ajoute un sujet jamais soumis au client : les
> cinq H1 réécrits lors de la passe SEO.

Réponse point par point au cahier `Recette_Web_Lagni_Consulting.xlsx`
(33 observations, verdict « NON VALIDABLE en l'état »).

**Périmètre traité** : bloquants, majeurs et moyens — soit les 23 points des deux
premiers groupes d'action, plus 3 points mineurs corrigés au passage.

| Statut | Signification |
| --- | --- |
| ✅ **Corrigé** | Correction appliquée et vérifiée sur le build |
| 🔒 **Masqué** | Contenu de préproduction retiré du site public jusqu'à validation |
| 🔍 **Requalifié** | Constat mesuré : le diagnostic du cahier ne correspond pas à ce que voit un visiteur |
| ⏳ **Dépend du client** | Correction faite côté code ; validation ou contenu client requis |
| ↪ **Hors périmètre** | Mineur ou suggestion, non retenu pour cette passe |

---

## Remarque de méthode

Plusieurs constats du cahier (`CONTENT-007`, `CONTENT-008`, `UI-002`, `UI-003`)
décrivent des libellés « collés » — « 15+ans », « PMP®et certifications SAP ».

Mesure faite sur la page livrée, avant correction :

```
figure: "PMP®"   label: "et certifications SAP"
display: "block"   sameLine: false   verticalGap: 5px
textContent: "PMP®et certifications SAP"
```

**Les deux libellés étaient bien sur deux lignes distinctes à l'écran.** La
concaténation n'apparaissait que dans le texte sérialisé (`textContent`), ce qui
indique une recette menée par extraction automatique plutôt que par observation
visuelle. Même situation pour la « numérotation anormale » de `UI-001` :
`list-style: none` la rendait invisible.

Ces points sont réels et **ont été corrigés** — ils pénalisaient le copier-coller,
les moteurs de recherche et les lecteurs d'écran. Mais ils n'ont jamais constitué
un défaut d'affichage, et ils ne relèvent pas de la catégorie « UI ».

La cause racine a été identifiée : Astro supprimait par défaut les espaces entre
éléments voisins au moment du build. Une ligne de configuration
(`compressHTML: false`) corrige **toutes** les occurrences du site à la source,
pour un surcoût nul après compression (9,7 Ko par page en gzip).

---

## Bloquants

### BUG-001 · BUG-002 · BUG-003 — Formulaires non reliés ✅ ⏳

Les trois bloquants avaient une cause unique : aucun backend de formulaire
n'était configuré, le site étant livré en préproduction.

**Hébergement retenu : Netlify + Netlify Forms.** Les quatre formulaires sont
désormais déclarés et détectés au build :

| Formulaire | Nom technique | Pièce jointe |
| --- | --- | --- |
| Contact (6 types de demande) | `contact` | — |
| Mandat employeur | `recruitment-employer` | — |
| Candidature | `recruitment-candidate` | CV, PDF/DOC/DOCX, 5 Mo max |
| Partenariat établissement | `institution-partnership` | — |

Le bandeau « le formulaire n'est pas encore relié à une boîte de réception » a
disparu des quatre formulaires (vérifié : 0 occurrence dans le build).

> ⏳ **Clôture conditionnée au déploiement.** Ces trois points ne pourront être
> déclarés validés qu'après un test de bout en bout sur Netlify : soumission des
> 4 formulaires, réception dans le tableau de bord, notification courriel, et
> téléversement d'un CV en PDF, DOC et DOCX. La procédure est décrite dans le
> README.

---

## Majeurs

### CONTENT-001 — Articles en « Brouillon » visibles 🔒

Les 12 articles (6 FR + 6 EN) sont des brouillons rédigés en interne, jamais
relus par Lagni Consulting. Plutôt que d'afficher un badge, **ils sont désormais
exclus du site public** : aucune page n'est générée, ils n'apparaissent ni dans
les listes, ni sur l'accueil, ni dans le `sitemap.xml`.

Le build est passé de 34 à 24 pages.

Pour publier un article après relecture : passer `status: "draft"` à
`status: "published"` dans son en-tête. Rien d'autre à faire.

### CONTENT-002 — Instruction interne visible ✅

La chaîne « *Ajoutez les liens YouTube dans CONTENT-TO-REPLACE.md une fois les
vidéos en ligne* » était effectivement affichée aux visiteurs sur la page
Ressources. **C'était une erreur de notre part.**

Le texte est supprimé et la section vidéos entière est retirée tant qu'aucun lien
YouTube réel n'est fourni. Aucun texte d'attente ne la remplace.

### CONTENT-003 — Témoignages fictifs 🔒

Le placeholder « Votre témoignage pourrait être ici » est supprimé. Il est
remplacé par un encart réellement utile (« Une question avant de vous
inscrire ? » + délai de réponse), et non par une section vide.

La structure est prête : dès que de vrais témoignages autorisés sont fournis,
les renseigner dans `testimonials.items` les affiche automatiquement à la place.

### NAV-001 · UX-001 — CTA sans contexte ✅

Constat confirmé : aucune préselection n'existait. Tout visiteur arrivait sur un
formulaire réglé sur « Formation », quelle que soit sa provenance.

Chaque CTA transmet désormais son intention via l'URL, et la page Contact la lit
au chargement :

| Provenance | Lien | Type présélectionné |
| --- | --- | --- |
| ERP & Solutions | `/contact/?type=erp` | ERP & Solutions |
| Formation SAP PP, Formations | `/contact/?type=formation` | Formation |
| Recrutement, Établissements | ancres vers leurs formulaires sur page | — |

Une valeur inconnue retombe sur « Formation » : le lien ne peut pas casser.
Testé sur 5 cas, dont une valeur invalide.

### NAV-002 · NAV-004 — CTA produits trompeurs ✅

Deux corrections complémentaires :

- **Les libellés tiennent leur promesse.** « Découvrir notre expertise SAP »
  devient « Discuter d'un projet SAP ». Il n'existe pas de page dédiée par
  produit : annoncer « Découvrir » était trompeur.
- **Les liens du pied de page mènent au bon endroit.** SAP, JD Edwards, Odoo,
  GoHighLevel et Chataap pointent désormais vers `#sap`, `#jde`, `#odoo`,
  `#gohighlevel`, `#chataap` — la carte correspondante sur la page ERP, et non
  plus le haut de la même page.

### TECH-001 — Aucune politique de confidentialité ✅ ⏳

**Ce point était sous-évalué dans le cahier.** Classé « majeur », il aurait dû
être bloquant : le site collecte des CV et des coordonnées, et la Loi 25
s'applique au Québec.

Création d'une **politique de confidentialité bilingue** (`/confidentialite/` et
`/en/privacy/`) couvrant : responsable du traitement, renseignements recueillis
formulaire par formulaire, finalités, base légale, destinataires, durées de
conservation, droits et recours auprès de la Commission d'accès à l'information.

Elle est liée depuis **le pied de page de chaque page** et **sous chaque
formulaire** (vérifié : ≥ 2 liens par page portant un formulaire).

Un point est déclaré explicitement : **Netlify stocke les soumissions, donc les
CV, sur des serveurs situés aux États-Unis.** Les renseignements sortent du
Canada, et cela doit rester écrit tant que cet hébergement est retenu.

> ⏳ **Le texte est un brouillon.** Il porte un encadré visible le signalant et
> doit être relu par un conseiller juridique avant mise en production.

---

## Moyens

### CONTENT-004 — Champs conditionnels ✅

L'affichage conditionnel fonctionnait déjà : les groupes masqués sont `hidden`
**et** leurs champs `disabled`, donc absents de l'envoi.

Une faille restait : **sans JavaScript, les cinq groupes s'affichaient
simultanément** sans explication. Un message `<noscript>` indique désormais qu'il
suffit de remplir les champs correspondant à sa demande.

### UX-002 — « Courriel professionnel » pour des étudiants ✅

Le libellé est désormais contextuel :

- **« Courriel »** (`vous@exemple.com`) — formulaire de contact et formulaire
  candidat, où l'on s'adresse à des particuliers.
- **« Courriel professionnel »** (`vous@organisation.com`) — formulaires employeur
  et établissement uniquement.

### UX-003 — Champ « Organisation » en triple ✅

Confirmé : trois champs (`organisation`, `organisation_erp`, `organisation_rec`)
portaient le même libellé dans le DOM.

Ils sont fusionnés en **un seul champ partagé**, affiché pour les demandes
Formation entreprise, ERP et Recrutement. Vérifié : au maximum un champ
« Organisation » visible, quel que soit le type de demande.

### NAV-003 — « Formations » et « SAP PP » au même niveau ↪

**Ce point n'a volontairement pas été corrigé.**

Le cahier de refonte validé (§16, « Arborescence finale ») place explicitement
`/formations` et `/formation-sap-pp` au premier niveau du menu, SAP PP étant la
landing page de conversion du produit phare. La recette contredit ici
l'arborescence approuvée par le client lui-même.

Le cahier de recette prévoit d'ailleurs ce cas : « *conserver le doublon
uniquement si c'est un choix commercial explicite* ». C'en est un.

Si le choix doit être revu, c'est une décision d'architecture, pas une correction
de livraison.

### NAV-005 — Filtres des ressources ✅

L'état actif était déjà marqué (remplissage, bordure **et** glyphe ✓ — jamais la
couleur seule). Ajout de la **persistance par URL** : le filtre choisi s'écrit
dans l'adresse (`?category=sap-pp`), survit à un rechargement et peut être
partagé.

### CONTENT-005 — Catégories vides 🔒

Une catégorie ne s'affiche plus que si elle contient au moins un article publié.
Aucun article n'étant publié à ce jour, **le bloc catégories, la carte vedette et
les filtres sont entièrement masqués**, remplacés par un état « Nos premières
publications arrivent » maîtrisé, avec un renvoi vers la formation SAP PP.

### CONTENT-006 — Positionnement SAP affaibli ✅

« *développe aujourd'hui également une expertise SAP S/4HANA* » est reformulé sur
des faits : expérience JD Edwards affirmée, expertise SAP S/4HANA circonscrite à
la planification et l'exécution de la production, domaine autour duquel la
formation est conçue.

Aucune certification n'est affirmée dans ce texte : les intitulés restent en
attente de confirmation (voir `CONTENT-TO-REPLACE.md`).

### CONTENT-007 · CONTENT-008 · UI-002 · UI-003 ✅ 🔍

Corrigés — voir la **remarque de méthode** en tête de document. Ce n'étaient pas
des défauts d'affichage.

Vérification automatisée ajoutée : un contrôle balaie les 24 pages du build et
échoue si deux libellés voisins se concaténent dans le texte sérialisé.

### CONTENT-009 — Terminologie FR/EN ✅

Convention adoptée : **terme français d'abord, terme SAP entre parenthèses au
premier usage** de chaque page, puis terme français seul.

Exemples appliqués : « Données de base (Master Data) », « Planification des
capacités (Capacity Planning) », « Ordres de production (Production Orders) »,
« version de production (Production Version) ».

Les noms de transactions et de modules SAP restent en anglais : ce sont des
désignations produit, pas du vocabulaire traduisible.

### UI-001 — Numérotation anormale ✅

Cause identifiée : le bloc « Pourquoi intégrer un ERP au cursus ? » était un
`<ol>` dont **les flèches de séparation étaient elles aussi des `<li>`**. Les
trois colonnes portaient donc les numéros 1, 3 et 5.

Deux corrections : passage en `<ul>` — ces colonnes sont une comparaison, pas une
séquence ordonnée — et les flèches sont marquées `role="presentation"`.

---

## Mineurs corrigés au passage

Hors périmètre retenu, mais corrigés car touchant les mêmes fichiers :

- **CONTENT-010** ✅ — « Des talents des projets un avenir meilleur. » devient
  « Des talents. Des projets. Un avenir meilleur. » (la version anglaise était
  déjà correctement ponctuée, le français avait perdu ses séparateurs).
- **CONTENT-011** ✅ — « HighLevel » (4 occurrences) aligné sur « GoHighLevel »
  (14 occurrences), sur les pages Contact et Ressources.
- **UI-003** ✅ — traité par la correction de fond sur la sérialisation.

---

## Hors périmètre de cette passe ↪

Points mineurs et suggestions, à arbitrer :

| ID | Objet | Remarque |
| --- | --- | --- |
| UX-004 | Libellé « Choisir ma demande » | Changement de libellé, à trancher |
| NAV-006 | CTA final redondant sur Contact | Pointe déjà vers le sélecteur de demande |
| UX-005 | Modalités de l'accompagnement 12 mois | Dépend des modalités commerciales réelles |
| SUG-001 | Segmentation par audience sur l'accueil | Refonte de l'accueil, chantier à part entière |
| SUG-002 | Prix, dates de cohorte, disponibilité | **Contenu client manquant** |
| SUG-003 | Preuves sociales | **Contenu client manquant** (témoignages, études de cas) |
| SUG-004 | Fil d'Ariane sur les pages profondes | Pertinent une fois les articles publiés |

---

## Vérifications exécutées

```
npm run build   → 24 pages, 0 erreur
npx astro check → 0 erreur, 0 avertissement
npm audit       → 0 vulnérabilité
```

| Contrôle | Résultat |
| --- | --- |
| Liens internes | tous résolvent |
| Contenu de préproduction | 0 occurrence sur 7 motifs recherchés (CONTENT-TO-REPLACE, REPLACE_ME, Brouillon, Draft, bandeau formulaire, témoignage fictif, lorem ipsum) |
| Formulaires | 4 déclarés, tous avec `data-netlify`, honeypot et champ `form-name` |
| Confidentialité | 2 pages générées, ≥ 2 liens sur chaque page portant un formulaire |
| Structure | 1 `<h1>` par page, titres uniques, canonical et `lang` corrects |
| Logo | 48 rendus, ratio 1206:1156 et alt conformes, fichier inchangé |
| Texte sérialisé | 0 mot collé sur les 24 pages |
| Sémantique | 0 liste ordonnée détournée |
| Mise en page | 14 pages × 5 largeurs (375 / 768 / 1024 / 1280 / 1440) — aucun défilement horizontal |
| Préselection CTA | 5 cas testés, dont une valeur invalide |
| Poids | 9,7 Ko par page en moyenne (gzip) |

### Reste à faire avant la contre-recette

1. **Déployer sur Netlify** et tester les 4 formulaires de bout en bout — seul
   moyen de clore `BUG-001`, `BUG-002` et `BUG-003`.
2. **Faire valider la politique de confidentialité** par un conseiller juridique.
3. **Confirmer les intitulés exacts des certifications SAP et PMP®**, toujours
   affichés avec une mention « à confirmer ».
4. **Relever les URL réelles de l'ancien site WordPress** dans Search Console
   pour compléter la carte de redirections 301 avant la bascule DNS.

Le détail de ce qui reste à fournir figure dans `CONTENT-TO-REPLACE.md`.
