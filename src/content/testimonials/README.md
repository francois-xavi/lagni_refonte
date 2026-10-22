# Témoignages

**Ce dossier est vide, et c'est voulu.** Le cahier interdit d'inventer une
preuve sociale : tant que le client n'a pas fourni de témoignages autorisés, la
page SAP PP affiche à leur place un encadré d'aide réel.

Un fichier JSON par témoignage, les deux langues dans le même objet — l'éditeur
ne peut pas en publier un à moitié traduit :

```json
{
  "order": 1,
  "fr": {
    "quote": "…",
    "author": "Prénom Nom",
    "role": "Fonction, Organisation"
  },
  "en": {
    "quote": "…",
    "author": "Prénom Nom",
    "role": "Role, Organisation"
  }
}
```

`quote`, `author` et `role` sont **obligatoires** dans les deux langues : un
témoignage anonyme ne peut pas être publié. Un champ vide fait échouer le build.

`order` est facultatif (croissant) ; à égalité, le nom de fichier tranche.

Les jetons de chiffres (`{hours}`, `{sessions}`, …) fonctionnent dans `quote` et
`role`, comme partout ailleurs.

## Avant d'en publier un

Un témoignage nommant une personne ou une organisation doit avoir été
**autorisé par elle, par écrit**. C'est une obligation, pas une précaution de
style.
