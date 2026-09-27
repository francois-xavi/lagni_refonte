---
title: "Make-to-Stock ou Make-to-Order dans SAP"
description: "Différences, cas d'usage et impacts sur la planification de la production."
category: "sap-pp"
level: "debutant"
date: 2026-08-14
readingMinutes: 7
status: "draft"
cta: "sapPp"
image: "resource-mts-mto.webp"
---

## Deux logiques de déclenchement

En **Make-to-Stock (MTS)**, la production est déclenchée par une prévision et
alimente un stock anonyme. En **Make-to-Order (MTO)**, elle est déclenchée par
une commande client précise et le stock reste affecté à cette commande.

## Ce que cela change concrètement

- La nature du besoin qui entre dans le MRP.
- La gestion du stock : anonyme ou affecté au client.
- Le délai perçu par le client.
- Le niveau de personnalisation possible du produit.

## Choisir selon le produit

Un produit standard à forte rotation se prête au MTS. Un produit configuré ou
coûteux à stocker se prête au MTO. Beaucoup d'organisations utilisent les deux
selon les gammes.
