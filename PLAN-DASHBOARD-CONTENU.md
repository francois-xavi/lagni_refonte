# Dashboard de contenu — plan de fonctionnement détaillé

Extension de `form-service/` pour que le client modifie son contenu lui-même.
Authentification par mot de passe, publication par commit git, aucun compte
externe.

---

## 1. Trois contraintes techniques qui décident de l'architecture

Relevées dans le code existant, elles ne sont pas négociables :

**L'image Docker ne contient pas `git`, et le service tourne en utilisateur non
privilégié** (`node:22-alpine`, `USER node`). Cloner le dépôt dans le conteneur
imposerait d'installer git, de gérer un clone persistant sur le volume, et de
traiter les désynchronisations. → **On passe par l'API GitHub**, sans binaire git
ni clone : chaque publication crée un commit par appels HTTP.

**La politique de sécurité de `/admin/` interdit tout script** :
`default-src 'none'; style-src 'unsafe-inline'`. L'interface actuelle est du HTML
pur. Un éditeur Markdown suppose donc **d'assouplir délibérément cette règle**
pour les seules pages de contenu — et uniquement vers `script-src 'self'`, avec
l'éditeur auto-hébergé, jamais depuis un CDN.

**Les chiffres commerciaux ne sont pas centralisables entièrement.** « 40 heures »
existe sous deux formes : un bloc structuré
(`{ label: '40 heures', sub: 'de formation', icon: 'clock' }`) et **à l'intérieur
de phrases rédigées** (« Un parcours de 40 heures en 20 séances pour… »). Rendre
les blocs structurés éditables est simple ; réécrire la prose par gabarit
casserait la grammaire d'une langue à l'autre. → Les blocs deviennent éditables,
la prose reste dans le code, et **un contrôle au build signale la dérive** si les
deux divergent.

---

## 2. Comment ça fonctionne, vu du client

### Il se connecte

Même adresse, même mot de passe qu'aujourd'hui : `https://lagniconsulting.ca/admin/`.
Un second onglet apparaît à côté de « Demandes » :

```
┌──────────────────────────────────────────────────────┐
│  Lagni Consulting          Demandes  │  Contenu      │
├──────────────────────────────────────────────────────┤
│  Articles · Témoignages · FAQ · Chiffres · Images    │
│                                                       │
│  ⚠ 3 modifications non publiées       [ Publier ]    │
└──────────────────────────────────────────────────────┘
```

### Il modifie

Chaque écran liste les entrées, chaque entrée s'ouvre en formulaire. **Le français
et l'anglais sont deux colonnes du même formulaire** — il ne peut pas en oublier
une.

```
  Question (FR)                    Question (EN)
  ┌───────────────────────┐        ┌───────────────────────┐
  │ Faut-il connaître SAP?│        │ Do I need to know SAP?│
  └───────────────────────┘        └───────────────────────┘
  Réponse (FR)                     Réponse (EN)
  ┌───────────────────────┐        ┌───────────────────────┐
  │ Non. Le parcours…     │        │ No. The programme…    │
  └───────────────────────┘        └───────────────────────┘

                        [ Enregistrer ]   [ Annuler ]
```

« Enregistrer » ne publie rien : la modification est mise de côté. Il peut
travailler en plusieurs fois, fermer son navigateur, revenir.

### Il publie

Un seul bouton, une seule fois, quand il a terminé. Le service :

1. **valide** tout ce qui est en attente ;
2. crée **un commit unique** dans le dépôt GitHub ;
3. Dokploy reçoit le webhook et reconstruit le site ;
4. l'écran affiche « Publication lancée — en ligne dans environ deux minutes ».

Si quelque chose est invalide, **rien n'est publié** et le champ fautif est
signalé. Le site en ligne n'est jamais exposé à du contenu cassé.

---

## 3. Où vit le contenu

**Git est la source de vérité. SQLite ne contient que les brouillons non publiés.**

C'est ce qui garde le build reproductible : reconstruire un commit six mois plus
tard redonne exactement le même site, et le dashboard peut être éteint sans que
le déploiement en souffre.

```
Ouverture d'un écran  →  lecture depuis GitHub (état publié + sha)
« Enregistrer »       →  brouillon rangé dans SQLite, sur le volume
« Publier »           →  validation, puis un commit, puis reconstruction
```

Le `sha` lu à l'ouverture sert de **verrou optimiste** : si quelqu'un a modifié le
dépôt entre-temps, GitHub refuse l'écriture et le client voit « le contenu a
changé depuis votre ouverture, rechargez » — au lieu d'écraser silencieusement.

### Fichiers écrits dans le dépôt

| Écran | Fichier | Format |
| --- | --- | --- |
| Articles | `src/content/resources/{fr,en}/<slug>.md` | Markdown + front-matter *(existe déjà)* |
| Témoignages | `src/content/testimonials/<slug>.json` | `{ fr: {...}, en: {...} }` |
| FAQ | `src/content/faq/<page>.json` | tableau d'entrées bilingues |
| Chiffres et coordonnées | `src/content/settings/site.json` | objet unique |
| Images | `public/assets/images/<nom>` + `src/content/settings/images.json` | binaire + table de correspondance |

### Tables ajoutées à la base existante

```sql
CREATE TABLE content_drafts(
  id          INTEGER PRIMARY KEY,
  collection  TEXT NOT NULL,          -- articles | testimonials | faq | settings | images
  key         TEXT NOT NULL,          -- slug, nom de page, ou 'site'
  payload     TEXT NOT NULL,          -- JSON bilingue
  base_sha    TEXT,                   -- sha lu à l'ouverture (verrou optimiste)
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(collection, key)
);

CREATE TABLE content_publications(
  id         INTEGER PRIMARY KEY,
  at         TEXT NOT NULL DEFAULT (datetime('now')),
  commit_sha TEXT,
  files      INTEGER,
  ok         INTEGER NOT NULL,
  detail     TEXT                     -- message d'erreur le cas échéant
);
```

`content_publications` donne une piste d'audit : qui a publié quoi, quand, et
avec quel commit.

---

## 4. La mécanique de publication

Sans binaire git, via l'API GitHub, **un commit par publication** :

```
1. GET  /repos/{o}/{r}/git/ref/heads/main          → sha de la tête
2. POST /repos/{o}/{r}/git/blobs                   → un blob par fichier modifié
3. POST /repos/{o}/{r}/git/trees                   → arbre basé sur la tête
4. POST /repos/{o}/{r}/git/commits                 → commit, parent = tête lue
5. PATCH /repos/{o}/{r}/git/refs/heads/main        → avance la branche
```

L'étape 5 échoue si la branche a bougé depuis l'étape 1 : le service le détecte,
**conserve les brouillons** et affiche un message clair. Aucune perte possible.

Le message de commit est explicite et attribué :

```
Contenu : 2 questions FAQ, 1 témoignage

Publié depuis /admin/contenu/ le 22 octobre 2026 à 14:05.
```

Dokploy reconstruit ensuite, soit par **webhook sur push**, soit par appel à
`/api/application.deploy` avec un jeton. Le webhook suffit.

---

## 5. Comment le site lit ce contenu

Les pages lisent des **collections Astro validées par Zod**, exactement comme
`src/content/resources/` aujourd'hui. `src/content.config.ts` existe déjà et
contient le schéma `resources` — les nouveaux schémas suivent le même modèle.

Un champ obligatoire manquant **fait échouer le build**. C'est ce qui remplace la
garantie de type perdue en quittant TypeScript : aujourd'hui `en.ts` est validé
contre `fr.ts` par `Widen`/`FrDict`/`satisfies`, demain c'est Zod.

**Les mêmes schémas sont importés par le service** pour valider *avant* la
publication. Le contenu invalide est refusé à la saisie, pas découvert à la
reconstruction. Cela ajoute `zod` aux dépendances du service — aujourd'hui
`nodemailer` seul.

Les images passent par une table de correspondance : les 11 noms de fichiers
aujourd'hui codés en dur dans 10 fichiers `.astro` deviennent des clés lues depuis
`images.json`, puis résolues par `publicImage()` (`src/lib/assets.ts`) et
`Figure.astro`, qui gère déjà le repli quand le fichier manque.

---

## 6. Migration du contenu existant

Un script exécuté **une seule fois**, qui lit les dictionnaires actuels et écrit
les fichiers :

| Contenu | Volume réel | Source |
| --- | --- | --- |
| Articles | 12 fichiers | déjà au bon format, rien à faire |
| Témoignages | 0 | `sapPp.testimonials.items` est un tableau vide |
| FAQ | **23 questions × 2 langues** | contact (4), établissements (10), SAP PP (9) |
| Chiffres | ~8 valeurs | blocs `meta` de `sapPp` et `institutions` |
| Coordonnées | 5 champs | `src/config.ts` |
| Images | 11 fichiers | appels `publicImage()` |

Critère de réussite : **le `dist/` produit après migration est identique à celui
d'avant**, page par page. Si le HTML change, la migration a altéré quelque chose.

---

## 7. Sécurité

`/admin/` donnera désormais accès aux **CV des candidats et au contenu du site**.
Le niveau d'exigence monte.

| Point | Mesure |
| --- | --- |
| Jeton GitHub | PAT *fine-grained*, limité à ce seul dépôt, droit `contents: read+write`. Variable d'environnement Dokploy, **jamais dans l'image ni le dépôt**. |
| Mot de passe | Déjà ≥ 12 caractères, comparaison en temps constant. À allonger. |
| Limitation de débit | Existe sur la connexion ; à étendre aux écritures de contenu. |
| CSP | Assouplie **uniquement** sur `/admin/contenu/`, et seulement vers `script-src 'self'`. Le reste de `/admin/` garde `default-src 'none'`. |
| Téléversement d'images | Types autorisés (webp, jpg, png), taille maximale, nom de fichier assaini, métadonnées EXIF retirées. |
| Publication | Explicite, jamais automatique à l'enregistrement. |
| Retour arrière | Un `git revert` suffit — l'avantage central du stockage en git. |
| Accès | Envisager une restriction par IP ou une seconde authentification. |

---

## 8. Ce qui peut mal tourner, et ce qui se passe alors

| Incident | Comportement |
| --- | --- |
| GitHub injoignable | Publication refusée, **brouillons conservés**, message explicite. |
| Quelqu'un a poussé entre-temps | Le verrou optimiste bloque, rien n'est écrasé, le client recharge. |
| Contenu invalide | Refusé à l'enregistrement par Zod. N'atteint jamais git. |
| La reconstruction échoue | Le site **reste sur la version précédente**. Le journal de publication garde la trace. |
| Le dashboard est arrêté | Le site fonctionne et se reconstruit normalement — il ne dépend pas du service. |
| Le volume est perdu | Les brouillons non publiés sont perdus ; **tout le contenu publié est dans git**. |

---

## 9. Découpage en trois livraisons

**Phase 1 — Chiffres, coordonnées, témoignages.** Du JSON simple, aucun éditeur
riche nécessaire. Cette phase construit et valide **toute la chaîne** : écran,
brouillon, validation, commit, webhook, reconstruction. C'est la plus courte et
la plus structurante.

**Phase 2 — FAQ et images.** Le volume réel (23 questions bilingues), plus le
téléversement d'images et la table de correspondance.

**Phase 3 — Articles.** La plus exigeante en interface : édition Markdown avec
aperçu, gestion du statut brouillon/publié, image de couverture. C'est ici
qu'intervient l'assouplissement de la CSP et l'éditeur auto-hébergé sous licence
MIT.

Environ **800 à 1 200 lignes** au total, sur une base qui fournit déjà
l'authentification, les sessions, le rendu HTML et la gestion de fichiers.

---

## 10. Prérequis

1. **Fusionner les deux branches.** `form-service/` n'existe que sur
   `webxify/main` ; mes correctifs n'existent que sur
   `recette/corrections-octobre`. 5 conflits, résolution documentée dans
   `ETAT-BRANCHES.md`. Développer avant la fusion serait du travail perdu.
2. **Créer le PAT GitHub** et le poser en variable d'environnement Dokploy.
3. **Confirmer l'hébergement Dokploy** — le dashboard suppose du Node et un
   volume persistant ; Cloudflare Pages ne convient pas.

---

## 11. Vérification

```bash
npm run build && npx astro check     # doivent rester propres
cd form-service && npm test          # étendre le test de fumée existant
```

- **Le `dist/` après migration est identique à celui d'avant** — la preuve que
  rien n'a été altéré en déplaçant le contenu.
- Vider un champ obligatoire depuis le dashboard : **refusé à l'enregistrement**.
- Un même champ forcé invalide directement dans git : **le build échoue**.
- Une modification enregistrée puis publiée apparaît en **un seul commit**, et en
  ligne après reconstruction.
- `git revert` de ce commit restaure l'état précédent.
- Le site se construit **sans que le dashboard soit joignable**.
- Deux onglets ouverts sur la même entrée : le second à publier est **refusé**,
  pas appliqué silencieusement.
- Arrêt du service en cours de publication : les brouillons survivent au
  redémarrage.
- Le client ne peut modifier **ni pictogramme, ni route, ni teinte**.
- Audit de mise en page rejoué (375 / 768 / 1024 / 1280 / 1440) sur les pages
  dont le contenu devient dynamique.
