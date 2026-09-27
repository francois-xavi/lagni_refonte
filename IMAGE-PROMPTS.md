# Prompts de génération d'images — lagniconsulting.ca

Un prompt par emplacement du site. Les prompts sont rédigés en anglais (tous les
générateurs actuels y sont nettement plus précis) et fonctionnent tels quels avec
Midjourney, Flux, DALL·E, Firefly, Ideogram ou Imagen.

---

## ⚠️ Deux images à NE PAS générer

| Emplacement | Pourquoi |
| --- | --- |
| `founder-portrait` | C'est **Romuald Monthé Kameni**, une personne réelle. Le cahier demande explicitement « une photo professionnelle réelle ». Générer un visage serait une fausse représentation de la direction de l'entreprise. → **séance photo réelle.** |
| `logo.png` | Actif de marque protégé. Aucune régénération, aucune variation. |

Règle générale : aucune image ne doit laisser croire à un client, un partenaire ou
un participant réel qui n'existe pas. Les personnes générées sont des figurants
génériques, jamais présentées comme des clients ou des témoins.

---

## Direction artistique commune

À **ajouter à la fin de chaque prompt** pour que toutes les images forment un
ensemble cohérent :

```
Style: documentary corporate photography, natural available light, candid
working moment, shallow depth of field, muted realistic colour grade with cool
blue tones and warm amber highlights, subtle film grain, professional DSLR look,
50mm lens. People are absorbed in their work, never posing or looking at the
camera. Authentic modern workplace, uncluttered.
Negative: no handshakes, no thumbs up, no people smiling at camera, no stock-photo
clichés, no boardroom posing, no glossy 3D render, no illustration, no text,
no watermark, no logos, no distorted hands, no fake UI gibberish on screens.
```

**Palette à respecter** : bleu profond `#004AAD`, orange chaud `#FF914D` en touches
seulement (gilet de sécurité, élément de machine, accent lumineux), beaucoup de
blanc et de gris clair.

**Note sur les écrans** : demandez des interfaces *floues ou de biais*. Aucun
générateur ne sait écrire un vrai écran SAP, et un faux texte lisible fait amateur.

---

## 1. Heros de page — ratio 4:3, 1600 × 1200 px

Le texte est posé en surimpression sur la **moitié gauche**, sur un aplati bleu
foncé. Il faut donc que **le sujet soit décalé à droite** et que la gauche reste
calme. Ajoutez à chaque prompt :

```
Composition: subject positioned in the right third of the frame, left half
visually calm and uncluttered for text overlay, generous negative space.
```

| Slot | Prompt |
| --- | --- |
| `hero-home` | `A woman industrial engineer in a safety helmet and high-visibility vest reviewing a production dashboard on a tablet, standing on a clean modern factory floor, machinery softly out of focus behind her` |
| `hero-training` | `An instructor standing beside a large wall screen explaining a process diagram to a small group of adult professionals seated with laptops, modern bright training room, seen slightly from behind the participants` |
| `hero-sap-pp` | `A focused male professional working at a dual-monitor desk showing an enterprise planning application, industrial plant visible through a window behind him, early morning light` |
| `hero-erp` | `A process engineer studying production supervision screens in a control room of a manufacturing plant, blue monitor glow, calm concentrated atmosphere` |
| `hero-recruitment` | `Two professionals in an informal interview conversation across a small table in a bright modern office, both engaged in discussion, natural gestures, mid-conversation` |
| `hero-institutions` | `A lecturer presenting a supply chain process diagram on a large screen to university students in a modern classroom, students taking notes on laptops, viewed from the side` |
| `hero-about` | `A confident professional man in his forties in a dark suit standing thoughtfully in a bright modern office, looking off-camera toward a window, city visible beyond` — *placeholder générique uniquement, à remplacer par une photo réelle du fondateur* |
| `hero-resources` | `A professional reading technical documentation on a laptop at a clean desk, notebook and coffee beside, soft daylight from a side window, quiet focused atmosphere` |
| `hero-contact` | `A clean modern desk from a slight overhead angle: open laptop, notebook, pen, a plant, a coffee mug, no people, bright airy office, morning light` |

---

## 2. Visuels de l'accueil

| Slot | Ratio · px | Prompt |
| --- | --- | --- |
| `home-sap-pp` | 5:4 · 1200×960 | `Close view over the shoulder of a planner working on a production planning screen, second monitor showing a schedule chart, industrial office, screens softly out of focus` |
| `home-institutions` | 5:4 · 1200×960 | `A teacher helping two students at a computer in a university computer lab, pointing at the screen, other students working in the background, natural classroom atmosphere` |
| `home-about` | 7:6 · 1050×900 | `A professional standing by a large office window looking out over a city, seen from behind at three-quarter angle, contemplative, soft backlight` |

---

## 3. Pages intérieures

| Slot | Ratio · px | Prompt |
| --- | --- | --- |
| `resources-featured` | 19:12 · 1520×960 | `Wide view of a modern production warehouse with organised pallet racking and a worker checking inventory on a handheld terminal, clean industrial lighting` |
| `erp-cross-sell` | 26:15 · 1040×600 | `Two colleagues reviewing a document together at a standing desk in a bright office, collaborative working moment, seen from a slight distance` |

---

## 4. Illustrations d'articles — ratio 16:9, 1280 × 720 px

| Article | Prompt |
| --- | --- |
| `qu-est-ce-que-sap-pp` | `Overview of a clean modern manufacturing line with an operator monitoring a terminal station, wide angle, organised industrial environment` |
| `mrp-dans-sap-s4hana` | `Close-up of a planning schedule displayed on a widescreen monitor in a production office, colour-coded timeline blocks, screen slightly angled and softly out of focus` |
| `donnees-de-base-sap-pp` | `Detail shot of labelled component bins and parts racking in a production store, shallow depth of field, orderly and precise` |
| `production-order-cycle-de-vie` | `An operator confirming a production order on a shop-floor terminal beside a machine, gloved hand on the screen, industrial lighting` |
| `mts-vs-mto` | `Split-feel composition: stacked finished goods on pallets on one side, a custom assembly workstation on the other, single wide industrial space` |
| `carriere-consultant-erp` | `A young professional in business-casual attire working on a laptop in a bright open-plan office, colleagues blurred in the background, optimistic natural light` |

Les articles anglais réutilisent les mêmes images — un seul fichier par sujet suffit.

---

## 5. Bandeaux d'appel à l'action — ratio 16:5, 1920 × 600 px

Ces images passent **sous un voile bleu foncé à 35 % d'opacité** avec du texte blanc
par-dessus. Elles doivent donc être **sombres, très larges et peu détaillées** —
une texture d'ambiance, pas une scène à lire. Ajoutez :

```
Composition: very wide panoramic banner, dark moody exposure, low contrast,
no important detail in the centre where text will sit, atmospheric rather than
descriptive.
```

| Slot | Prompt |
| --- | --- |
| `cta-home` | `Wide dark panoramic view of a city skyline at blue hour from a high office window, silhouette of a person standing at the glass` |
| `cta-training` | `Dark wide view of an empty modern training room lit only by a large glowing screen at the far end` |
| `cta-sap-pp` | `Dark panoramic factory interior at night, faint machine indicator lights, deep shadows` |
| `cta-erp` | `Wide dark control room with dim monitor glow reflecting on surfaces, no people` |
| `cta-recruitment` | `Dark wide shot of a modern office corridor at dusk, warm light spilling from a doorway` |
| `cta-institutions` | `Dark panoramic view of a university campus building at dusk, warm lit windows` |
| `cta-about` | `Dark wide aerial of Quebec City at blue hour, river and lights` |
| `cta-resources` | `Dark wide desk scene lit by a single laptop screen, books stacked in shadow` |
| `cta-contact` | `Dark wide modern office reception at dusk, soft ambient lighting, no people` |

---

## Après génération

1. **Redimensionner** aux pixels indiqués — ne publiez pas du 4096 px.
2. **Convertir en WebP** (qualité ~80). Visez moins de 200 Ko par image.
3. **Renommer** exactement comme le slot : `hero-training.webp`, `cta-home.webp`, etc.
4. **Déposer** dans `public/assets/images/`.
5. Me le dire — je câble les `src` et je vérifie le rendu à toutes les tailles.

```bash
explorer "C:\Users\Dell\Documents\projects\external_projects\projets JB\lagni_consulting\public\assets\images"
```

### Vérifier avant publication

- Aucune main déformée, aucun visage bizarre (regardez à 100 %).
- Aucun faux texte lisible sur les écrans ni sur les panneaux.
- Aucun logo de marque réelle visible (SAP, Oracle…) — ce serait une fausse
  suggestion de partenariat, ce que le cahier interdit explicitement.
- Diversité réaliste des personnes représentées, cohérente avec les marchés visés
  (Canada, Europe, Afrique).
- Si votre générateur impose une mention « image générée par IA » dans ses
  conditions d'utilisation, respectez-la.
