# Clé de déploiement — mise en service du dashboard de contenu

Le dashboard `/admin/contenu/` est construit et testé. Il lui manque une seule
chose pour publier : un jeton GitHub posé sur le serveur.

**Tant qu'il n'est pas là, rien n'est cassé.** Le service tourne « à blanc » :
le client peut ouvrir les écrans, saisir, enregistrer des brouillons. Seule la
publication ne part pas, et l'écran l'affiche en toutes lettres.

---

## 1. La décision à prendre d'abord

Un jeton *fine-grained* ne vise **qu'un seul dépôt**. Il y en a deux :

| Remote | Dépôt |
| --- | --- |
| `origin` | `francois-xavi/lagni_refonte` |
| `webxify` | `webxify-com/lagni_refonte` |

**Le dépôt retenu doit être celui que le webhook Dokploy surveille.**

C'est le seul vrai point de vigilance. Si les deux divergent, le client cliquera
« Publier », tout indiquera un succès, un commit sera bien créé — et le site ne
changera pas. L'erreur serait silencieuse, donc difficile à diagnostiquer.

---

## 2. Créer le jeton

Sur le compte GitHub **propriétaire du dépôt retenu** :

1. **Settings** (du compte, pas du dépôt) → tout en bas à gauche,
   **Developer settings**
2. **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
3. **Resource owner** : le propriétaire du dépôt. Si c'est une organisation
   (`webxify-com`), choisir l'organisation — **pas** le compte personnel.
4. **Repository access** → **Only select repositories** → `lagni_refonte`,
   et lui seul
5. **Permissions** → **Repository permissions** → **Contents** →
   **Read and write**

   C'est la seule permission nécessaire. Ne rien cocher d'autre : le jeton vit
   sur un serveur, sa portée doit être minimale.
6. **Expiration** : poser un rappel d'avance. Un jeton expiré fait échouer les
   publications sans autre avertissement que le message d'erreur de l'écran.
7. **Generate token**, puis copier la valeur — **GitHub ne la réaffichera
   jamais**.

> Si le dépôt appartient à une organisation, un propriétaire doit parfois
> approuver le jeton avant qu'il fonctionne : *Settings de l'organisation →
> Personal access tokens → Pending requests*.

---

## 3. Le poser sur Dokploy

Sur l'application `form-service`, en **variables d'environnement** :

```
GITHUB_TOKEN=github_pat_...
GITHUB_OWNER=webxify-com
GITHUB_REPO=lagni_refonte
GITHUB_BRANCH=main
```

Puis redémarrer le conteneur.

**Jamais dans l'image, jamais dans le dépôt.** `form-service/Dockerfile` ne
copie que le code ; la configuration reste dans l'environnement Dokploy.

Pour mémoire, les autres variables du service sont documentées dans le
[README](./README.md), section *Deployment*. La seule obligatoire
reste `ADMIN_PASSWORD` (12 caractères minimum).

---

## 4. Vérifier que ça marche

Rouvrir `/admin/contenu/`.

| Ce qu'on voit | Ce que ça veut dire |
| --- | --- |
| L'avertissement **« Mode à blanc »** a disparu, et les champs sont pré-remplis avec les vraies valeurs (40, 20, 2, 12, 15) | ✅ La clé fonctionne — l'écran vient de lire le dépôt |
| L'avertissement est toujours là | ❌ Le jeton n'est pas accepté : mauvais propriétaire, dépôt non sélectionné, permission `Contents` absente, ou approbation de l'organisation en attente |

Puis le test complet : changer un chiffre, cliquer **Publier**, et vérifier
qu'un commit `Contenu : …` apparaît dans l'historique du dépôt, suivi d'une
reconstruction Dokploy.

---

## 5. Le prérequis qu'on oublie

**Le dashboard publie vers `main`.**

Or `main` est aujourd'hui en retard : tout le travail récent — fusion des deux
chantiers, politique de confidentialité, migration du contenu, dashboard — vit
sur la branche `recette/corrections-octobre`, poussée sur les deux remotes.

Il faut **fusionner cette branche dans `main`** avant que la publication ait un
sens. Autrement le dashboard écrirait dans une branche que personne ne déploie.

---

## 6. Ce que la clé ne débloque pas

Elle ne concerne que la publication. Restent à construire, et tous réalisables
sans elle :

- les écrans **FAQ** (23 questions) et **témoignages** — même mécanique que
  l'écran des chiffres, rien de nouveau ;
- les **articles**, seul morceau qui demandera d'assouplir la CSP
  `default-src 'none'` pour un éditeur Markdown — et uniquement sur cette route,
  pas globalement.

---

## 7. Comment c'est protégé

Pour mémoire, parce qu'un jeton d'écriture sur un dépôt est une surface
d'attaque réelle :

- **Portée minimale** : un dépôt, une permission.
- **Jamais de force-push.** La publication avance la branche par un
  `PATCH /git/refs` sans `force`, qui n'accepte qu'un *fast-forward*.
- **Verrou optimiste.** Le sha lu à l'ouverture de l'écran voyage avec le
  brouillon. Si le dépôt a bougé entre-temps, la publication est refusée et le
  client lit « Le contenu a changé depuis votre ouverture, rechargez la page. »
  Rien n'est écrasé.
- **Les brouillons survivent à l'échec.** Ils ne sont effacés qu'une fois que
  GitHub a accepté l'écriture.
- **Validation avant publication.** Les valeurs sont contrôlées côté serveur
  selon le même schéma que le build : une saisie qui casserait le site est
  refusée à l'écran, pas au déploiement.
- **Piste d'audit.** Chaque tentative, réussie ou non, laisse une ligne dans
  `content_publications`.
- **Retour arrière.** Une publication ratée s'annule par un `git revert` : c'est
  l'intérêt de stocker le contenu dans git plutôt qu'en base.
