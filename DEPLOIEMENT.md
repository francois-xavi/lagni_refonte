# Déploiement — lagniconsulting.ca

Tout ce qu'il faut pour mettre le site en ligne sur Dokploy. Écrit pour être
suivi sans rien deviner.

---

## 1. Ce qui tourne, et pourquoi

Quatre conteneurs. Le site n'est plus un dossier de fichiers : c'est un
processus qui compose chaque page à partir du CMS.

```
                        ┌──────────────┐
   Visiteur ───────────►│    nginx     │  TLS, redirections, en-têtes, cache
                        └──────┬───────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
  ┌───────────┐         ┌─────────────┐        ┌──────────────┐
  │   site    │         │     cms     │        │ form-service │
  │  Astro    │────────►│   Payload   │        │  demandes    │
  │  Node     │  lit le │   Next      │        │  et CV       │
  │  :4321    │ contenu │   :3001     │        │  :3000       │
  └───────────┘         └──────┬──────┘        └──────┬───────┘
                               │                      │
                        ┌──────▼──────┐        ┌──────▼───────┐
                        │ volume cms  │        │ volume forms │
                        │ SQLite +    │        │ SQLite + CV  │
                        │ médias      │        │              │
                        └─────────────┘        └──────────────┘
```

| Service | Rôle | Port |
| --- | --- | --- |
| `site` | rend les pages, cache, aperçu | 4321 |
| `cms` | administration du contenu, médiathèque | 3001 |
| `form-service` | demandes reçues et CV | 3000 |
| `nginx` | proxy, redirections, en-têtes | 80 |

**Le site survit à une panne du CMS.** Au démarrage il charge le contenu ; s'il
n'y arrive pas, il sert le contenu committé dans le dépôt
(`src/content/copy/`). Vérifié : CMS arrêté, le site répond 200 avec le bon
contenu.

---

## 2. Domaines

| Domaine | Vers |
| --- | --- |
| `lagniconsulting.ca` | le site |
| `www.lagniconsulting.ca` | redirigé en 301 vers le domaine nu |
| `cms.lagniconsulting.ca` | l'administration du contenu |

**Pourquoi un sous-domaine pour le CMS.** Payload sert son interface sur
`/admin` et son API sur `/api`. Les deux sont déjà pris sur le domaine
principal : `/admin` par la boîte de réception des demandes, `/api` par
`/api/form`, `/api/preview/` et `/api/flush/` du site. Un sous-domaine évite de
réécrire ces chemins et évite que Payload fabrique des URL d'administration qui
ne correspondent pas à l'endroit où il est réellement monté.

Il faut donc **un enregistrement DNS `cms`** en plus du domaine principal.

---

## 3. Les secrets

Six valeurs à créer. Aucune ne doit se retrouver dans le dépôt.

| Variable | Où | À quoi elle sert |
| --- | --- | --- |
| `PAYLOAD_SECRET` | cms | signature des sessions Payload |
| `ADMIN_PASSWORD` | form-service | accès à la boîte de réception (**12 caractères minimum**) |
| `FLUSH_SECRET` | site **et** cms | autorise le CMS à vider le cache du site à la publication |
| `PREVIEW_SECRET` | site **et** cms | autorise l'ouverture d'une session d'aperçu |
| `PAYLOAD_API_KEY` | site **et** cms | lecture des brouillons par le site pour le Live Preview (**24 caractères minimum**) |
| `SMTP_*`, `MAIL_*` | form-service | notification par courriel (facultatif) |

Les quatre du milieu sont **partagées entre deux conteneurs** : la même valeur
exactement des deux côtés, sinon l'aperçu ou la publication échouent en silence.

Pour les générer :

```bash
openssl rand -base64 32
```

---

## 4. Les conteneurs, un par un

### `site` — le site web

- **Dockerfile** : `Dockerfile` (racine)
- **Volume** : aucun

```
HOST=0.0.0.0
PORT=4321
PAYLOAD_URL=http://cms:3001
PAYLOAD_API_KEY=…
PREVIEW_SECRET=…
FLUSH_SECRET=…
```

`PAYLOAD_URL` pointe sur le **nom de service interne**, pas sur le domaine
public : l'appel ne sort pas du réseau Docker.

### `cms` — l'administration du contenu

- **Dockerfile** : `cms/Dockerfile`
- **Volume persistant** : `/app/cms.db` *et* `/app/media`

```
DATABASE_URL=file:/data/cms.db
PAYLOAD_SECRET=…
NEXT_PUBLIC_SERVER_URL=https://cms.lagniconsulting.ca
SITE_URL=https://lagniconsulting.ca
PREVIEW_SECRET=…
FLUSH_SECRET=…
PAYLOAD_API_KEY=…
PORT=3001
```

`SITE_URL` sert à fabriquer les URL d'aperçu : il doit désigner le **site**, pas
le CMS.

> **Le volume n'est pas optionnel.** Sans lui, un redémarrage efface la base et
> les images téléversées.

### `form-service` — demandes et CV

- **Dockerfile** : `form-service/Dockerfile`
- **Volume persistant** : `/data`

```
ADMIN_PASSWORD=…
DATA_DIR=/data
SITE_URL=https://lagniconsulting.ca
PORT=3000
```

En deçà de douze caractères, le tableau de bord refuse de s'ouvrir — **par
conception** : les formulaires publics, eux, continuent d'enregistrer.

### `nginx` — le proxy

- **Fichiers** : `nginx.conf` et `proxy-common.conf`

`nginx.conf` attend `proxy-common.conf` dans `/etc/nginx/`. Montez les deux :

```
./nginx.conf         → /etc/nginx/conf.d/default.conf
./proxy-common.conf  → /etc/nginx/proxy-common.conf
```

---

## 5. Première mise en service

Dans cet ordre.

**1. Fusionner la branche dans `main`.** Tout ce travail vit sur
`recette/corrections-octobre`. Les deux `main` sont restés en arrière. Dokploy
construit depuis la branche que vous lui désignez : si c'est `main`, elle doit
d'abord recevoir ce travail.

**2. Créer le DNS** : `lagniconsulting.ca`, `www`, et `cms`.

**3. Déployer `cms` en premier.** Le site peut démarrer sans lui, mais autant
qu'il trouve son contenu du premier coup.

**4. Créer le premier compte** en ouvrant `https://cms.lagniconsulting.ca/admin`.
Payload demande un courriel et un mot de passe à la première visite.

**5. Importer le contenu.** Depuis le conteneur `cms` :

```bash
npm run seed
```

Les 1 382 champs bilingues de `src/content/copy/` entrent en base. Puis :

```bash
npm run verify
```

Doit afficher *« Aucun écart : le contenu ressort identique à la source. »*

**6. Créer le compte de service** qui permet au site de lire les brouillons :

```bash
npm run service-key
```

Il utilise la valeur de `PAYLOAD_API_KEY` déjà posée dans l'environnement.

**7. Déployer `site`, `form-service` et `nginx`.**

**8. Poser `ADMIN_PASSWORD`** et vérifier que `https://lagniconsulting.ca/admin/`
s'ouvre.

---

## 6. Vérifier que tout fonctionne

À faire dans l'ordre, et à ne pas considérer en ligne tant qu'un point échoue.

**Les pages répondent**

```bash
node scripts/check-routes.mjs compare routes-snapshot.json https://lagniconsulting.ca
```

L'empreinte de référence est produite par `node scripts/check-routes.mjs
snapshot <fichier>` depuis un build connu bon. Les 23 routes comparables doivent
être identiques.

**La configuration nginx est valide**

```bash
nginx -t
```

Jamais exécuté localement faute de Docker sur le poste de développement : c'est
le premier contrôle à faire sur le serveur.

**Le contenu vient bien du CMS**

Les journaux du conteneur `site` doivent afficher au démarrage :

```
[contenu] 13 ensembles chargés depuis le CMS
```

S'ils affichent *« repli sur le contenu du dépôt »*, le site fonctionne mais
sert le contenu du dernier déploiement : vérifiez `PAYLOAD_URL`.

**La publication est immédiate**

Modifier un texte dans le CMS, publier, recharger le site. Le changement doit
apparaître sans reconstruction. Le journal du CMS affiche
`[publication] home : site prévenu`.

**L'aperçu fonctionne et ne fuite pas**

Ouvrir une page du CMS, cliquer **Aperçu**, modifier sans publier. Le cadre doit
montrer le brouillon. En parallèle, le site en navigation privée doit montrer
**l'ancien texte**.

**Les formulaires enregistrent**

Les quatre formulaires, CV compris, et leur arrivée dans
`https://lagniconsulting.ca/admin/`. Puis redémarrer le conteneur
`form-service` : **aucune demande ne doit disparaître** — c'est le test du
volume.

**Les redirections de l'ancien site**

```bash
curl -sI https://lagniconsulting.ca/about | grep -i location
```

Doit renvoyer `/a-propos/`. Même contrôle pour `/blog`, `/jd-edwards`,
`/recruitment`.

---

## 7. Ce qui reste à faire avant la mise en ligne

Indépendant de l'infrastructure, mais bloquant pour le client.

- **`og-default.png` est absent du dépôt** alors que `Seo.astro` le référence sur
  toutes les pages : **tous les aperçus sur LinkedIn sont cassés**.
- **Les intitulés officiels des certifications** sont encore des encadrés
  « à confirmer ».
- **La politique de confidentialité** doit être relue par un conseiller
  juridique, et sa section « hébergement » complétée une fois la localisation du
  serveur connue.
- **Les douze articles sont en brouillon** : `/ressources/` reste quasi vide tant
  qu'ils ne sont pas publiés.
- Voir `CONTENT-TO-REPLACE.md` pour la liste complète.

---

## 8. Réserves honnêtes

**La syntaxe nginx n'a jamais été validée.** Docker n'est pas installé sur le
poste de développement. `nginx -t` au premier déploiement n'est pas une
formalité.

**Payload v4 est en beta.** Le projet démarre en v3.92 ; une migration majeure
est à prévoir. Un ticket ouvert signale par ailleurs que les migrations
combinant SQLite et localisation **ne sont pas annulables** — à savoir avant de
faire évoluer le schéma en production.

**Le cache du site vit dans son processus.** Deux instances derrière un
répartiteur auraient chacune le sien ; elles convergent à la publication
suivante. Si le site doit être mis à l'échelle, déplacer ce cache vers Redis
plutôt que raccourcir son TTL.

**Les écrans de contenu de `form-service` sont caducs** : le CMS les remplace.
Ils ne gênent pas, mais ils devraient être retirés pour éviter que le client ne
tombe sur deux endroits où modifier des chiffres. De même,
`CLE-DEPLOIEMENT.md` documente une clé GitHub qui n'a plus d'objet depuis
l'abandon de la publication par commit.
