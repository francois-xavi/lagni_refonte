# Dashboard de contenu — recherche et plan

Objectif : permettre au client de modifier lui-même son contenu.
Contraintes posées : **aucun abonnement, aucun compte à créer pour le client**,
on maîtrise le serveur.

---

## 1. Ce que la recherche élimine

La contrainte « pas de compte à créer » est beaucoup plus discriminante qu'elle
n'en a l'air : elle élimine la quasi-totalité des CMS git du marché, qui
s'authentifient tous via le compte GitHub de l'éditeur.

| Solution | Pourquoi elle ne convient pas |
| --- | --- |
| **Decap CMS** | S'authentifie par OAuth sur le fournisseur git. Le mode `git-gateway`, qui permettait justement d'éviter ça, reposait sur **Netlify Identity — en cours de dépréciation**. Le self-hosting suppose désormais de faire tourner son propre Git Gateway *et* sa propre instance GoTrue. |
| **Sveltia CMS** | Successeur moderne de Decap, mais ne supporte **ni Git Gateway ni Netlify Identity** : l'OAuth est à monter soi-même. Encore en 0.x. |
| **Keystatic** | Deux modes seulement. Le mode *local* écrit sur le disque **sans aucune authentification** et n'est prévu que pour le développement. Le mode *GitHub* exige un compte GitHub par éditeur. Aucun des deux ne convient en production pour un client sans compte. |
| **Payload CMS** | Vérifié sur la documentation officielle : **Next.js est une dépendance obligatoire**, Payload s'installe dans le dossier `/app` d'une application Next. Ce serait un second framework applicatif dans une pile Astro + Node. |
| **Pages CMS, TinaCloud, Decap Turbo** | Services tiers, compte et/ou abonnement. |

> **Correction à apporter aux comparatifs en ligne.** Plusieurs articles récents
> décrivent Directus comme « BSL 1.1, gratuit sous 5 M$ de revenus », en avertissant
> qu'une agence hébergeant un site client devrait consulter un avocat. **C'est
> périmé.** La licence actuelle, vérifiée sur le site de l'éditeur, est la
> *Monospace Sustainable Core License 1.0* : **aucun seuil de revenus**, la seule
> restriction porte sur l'usage concurrent (revendre Directus en tant que service),
> et l'hébergement pour le compte d'un client est explicitement un usage permis.
> Elle bascule en GPL-3.0 au bout de quatre ans.

Restent donc deux candidats sérieux : **Directus**, et **l'extension du service
qui tourne déjà**.

---

## 2. La question qui tranche : d'où vient le contenu au moment du build ?

Le site est un build statique Astro. Toute modification de contenu suppose une
reconstruction. Deux architectures possibles, et elles ne se valent pas.

**Avec un CMS à base de données (Directus)** — le build doit **joindre le CMS par
le réseau** pour récupérer le contenu. Conséquences : si le CMS est arrêté, en
cours de mise à jour ou injoignable, **le déploiement échoue**. Le build n'est plus
reproductible : reconstruire le même commit six mois plus tard ne redonne pas le
même site.

**Avec un CMS qui écrit dans git** — le contenu est un fichier versionné du dépôt.
Le build reste hermétique, sans aucune dépendance réseau, et reproductible. Un
retour en arrière est un `git revert`.

Pour un site vitrine de 24 pages, dont le contenu bouge quelques fois par mois,
la seconde architecture est nettement plus robuste. Et elle correspond exactement
à ce que vous décrivez : **le serveur porte nos identifiants git**, le client
s'authentifie par mot de passe.

---

## 3. Recommandation : étendre le service existant

`form-service/` contient déjà, en 272 lignes, **tout le socle nécessaire** :

| Besoin du dashboard | Déjà présent dans `form-service/` |
| --- | --- |
| Authentification par mot de passe | ✅ `ADMIN_PASSWORD`, comparaison en temps constant |
| Session sécurisée | ✅ HMAC-SHA256, cookie `HttpOnly; SameSite=Strict; Secure` |
| Interface HTML en français | ✅ `/admin/`, CSS aux couleurs de la marque |
| Téléversement et stockage de fichiers | ✅ déjà fait pour les CV |
| Limitation de débit, protection anti-spam | ✅ par IP |
| Conteneur, volume, déploiement Dokploy | ✅ en place |

Le client **a déjà un mot de passe** pour `/admin/`. Ajouter un onglet
« Contenu » à côté de « Demandes » lui donne un seul outil, un seul identifiant,
une seule interface — au lieu d'un second système avec son propre compte.

### Architecture

```
Client ──mot de passe──> /admin/contenu/   (form-service, déjà authentifié)
                              │
                              │ écrit des fichiers JSON / Markdown
                              ▼
                         clone git local sur le volume
                              │
                              │ commit + push avec NOTRE clé de déploiement
                              ▼
                         GitHub (dépôt du site)
                              │
                              │ webhook
                              ▼
                         Dokploy reconstruit et publie
```

Dokploy sait déclencher une reconstruction de deux façons : un **webhook** sur
push git, ou un **appel API** `/api/application.deploy` avec un jeton. Les deux
conviennent ; le webhook est le plus simple.

**Point clé** : le push utilise une clé de déploiement **à nous**, limitée à ce
seul dépôt, stockée en variable d'environnement Dokploy — jamais dans l'image.
Le client n'a aucun compte git, et n'en aura jamais besoin.

### Ce que le client pourra modifier

Périmètre arrêté précédemment — « ce qui bouge vraiment » :

| Collection | Format | Migration nécessaire |
| --- | --- | --- |
| Articles | Markdown + front-matter | ❌ aucune — déjà au bon format |
| Témoignages | JSON | depuis `sapPp.testimonials.items` (tableau vide aujourd'hui) |
| FAQ (4 pages) | JSON, une entrée par question | depuis les tableaux `.ts` |
| Chiffres commerciaux | JSON, source unique | 40 h, 20 séances, 12 mois, 15 participants — aujourd'hui dispersés |
| Coordonnées | JSON | depuis `src/config.ts` |
| Images | fichiers + légendes | ajouter une clé `image` à côté de chaque `imageAlt` |

**Ce qui reste dans le code** : la copie structurelle des pages, les pictogrammes,
les routes, les teintes. Le client ne doit pas pouvoir choisir un nom d'icône
inexistant — il casserait le build.

### Ce qui remplace la sécurité de type perdue

Aujourd'hui, `en.ts` est validé contre `fr.ts` par le mécanisme
`Widen`/`FrDict`/`satisfies` : une clé manquante est une erreur de compilation.
Pour le contenu migré, deux garde-fous :

1. **Schémas Zod** dans `src/content.config.ts` — le fichier existe déjà et
   contient le schéma `resources`, à suivre comme modèle. Un champ obligatoire
   manquant fait échouer le build.
2. **FR et EN sont deux champs du même formulaire**, pas deux fichiers séparés :
   l'éditeur ne peut pas en oublier un.

### Effort

Environ **800 à 1 200 lignes** à ajouter au service, sur une base qui fournit
déjà l'authentification, les sessions, le rendu HTML et la gestion de fichiers.
Compter une semaine de développement, plus la migration du contenu.

Pour l'édition des articles, intégrer un éditeur Markdown léger sous licence MIT
(EasyMDE ou équivalent), auto-hébergé — la zone de texte brute serait trop rude
pour quelqu'un qui vient de WordPress.

---

## 4. L'alternative, si vous préférez adopter plutôt que construire

**Directus**, un conteneur, SQLite ou Postgres, interface professionnelle avec
médiathèque, rôles et traductions. La licence ne pose finalement pas de problème
pour un hébergement client.

Ce que ça coûte en échange :

- le build devient **dépendant du réseau** — CMS indisponible, déploiement bloqué ;
- un **second système** à maintenir, mettre à jour et sécuriser ;
- un **second identifiant** pour le client ;
- une interface pensée pour des développeurs, à franciser et à simplifier ;
- la modélisation du bilinguisme est à faire à la main.

C'est le bon choix si vous voulez réutiliser le même outil sur plusieurs clients.
C'est le mauvais choix pour un seul site de 24 pages dont le contenu bouge peu.

---

## 5. Sécurité — à ne pas négliger

Un dashboard qui commite dans git est une surface d'attaque réelle.

- **Clé de déploiement limitée au seul dépôt**, en variable d'environnement,
  jamais dans l'image ni dans le dépôt.
- Mot de passe long ; la limitation de débit par IP existe déjà, à étendre à la
  page de connexion du contenu.
- **Publication explicite** : le client enregistre autant qu'il veut, puis
  déclenche la reconstruction par un bouton « Publier ». Sinon chaque frappe
  enchaîne les déploiements.
- Un `git revert` doit suffire à annuler une publication ratée — c'est l'intérêt
  principal de stocker le contenu dans git plutôt qu'en base.
- Envisager une restriction par IP ou une seconde authentification sur `/admin/`,
  qui donne désormais accès aux CV **et** au contenu.

---

## 6. Prérequis avant de commencer

1. ~~Fusionner les deux branches.~~ **Fait le 22 octobre** (`aab608e`), plus deux
   ruptures que la fusion automatique n'avait pas vues : `FormShell.astro` nommait
   le champ `form-name` à la mode Netlify au lieu du `form_name` attendu par
   `form-service`, et la politique de confidentialité annonçait un hébergement
   aux États-Unis.
2. ~~Trancher l'hébergement.~~ **Fait le 22 octobre : Dokploy.** Cloudflare Pages
   ne pouvait pas exécuter le service Node. Les fichiers de déploiement Cloudflare
   ont été retirés, `nginx.conf` reprend leurs en-têtes.
3. Créer la clé de déploiement git et la poser en variable d'environnement.

---

## 7. Vérification

```bash
npm run build && npx astro check   # doivent rester propres
```

- Les collections migrées produisent **le même HTML qu'avant** : comparer `dist/`
  avant et après migration sur les pages touchées.
- Vider un champ obligatoire depuis le dashboard **fait échouer le build** —
  c'est le test qui prouve que Zod remplace bien la sécurité de type perdue.
- Une modification enregistrée puis publiée apparaît en **commit git** et se
  retrouve en ligne après reconstruction.
- Un `git revert` du commit de contenu restaure l'état précédent.
- Le build fonctionne **sans que le dashboard soit joignable** — c'est tout
  l'intérêt du stockage en git.
- Les droits du client ne lui permettent pas de modifier un pictogramme, une
  route ou une teinte.
- Rejouer l'audit de mise en page (375 / 768 / 1024 / 1280 / 1440) sur les pages
  dont le contenu devient dynamique.

---

## Sources

- [Decap CMS — discussion sur la dépréciation de Netlify Identity](https://github.com/decaporg/decap-cms/discussions/7419)
- [Sveltia CMS — dépôt officiel](https://github.com/sveltia/sveltia-cms)
- [Self Hosting Decap CMS](https://blog.fullmeter.com/posts/self-hosting-decap-cms/)
- [Keystatic & Astro — documentation Astro](https://docs.astro.build/en/guides/cms/keystatic/)
- [Payload CMS — installation (Next.js requis)](https://payloadcms.com/docs/getting-started/installation)
- [Directus — Monospace Sustainable Core License](https://directus.com/mscl)
- [Dokploy — auto deploy](https://docs.dokploy.com/en/docs/core/application/auto-deploy)
- [PocketBase — build statique et récupération du contenu](https://github.com/pocketbase/pocketbase/discussions/1877)
- [Comparatif CMS auto-hébergés 2026](https://unfoldcms.com/blog/best-self-hosted-headless-cms-in-2026-5-honest-picks)
