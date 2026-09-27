---
title: "MRP dans SAP S/4HANA : comprendre le processus"
description: "Logique, paramètres clés et résultats du MRP dans la planification de la production."
category: "sap-pp"
level: "intermediaire"
date: 2026-09-05
readingMinutes: 10
status: "draft"
cta: "sapPp"
image: "resource-mrp-s4hana.webp"
---

## Ce que le MRP calcule réellement

Le Material Requirements Planning (MRP) répond à trois questions : **quoi**
produire ou acheter, **combien**, et **pour quand**. Il confronte les besoins
issus de la demande aux stocks et aux réceptions attendues.

## Les entrées du calcul

- Les besoins indépendants (PIR, commandes clients).
- Les stocks disponibles et les réceptions planifiées.
- Les nomenclatures, qui font descendre le besoin vers les composants.
- Les paramètres du Material Master : type de MRP, taille de lot, délais, stock de sécurité.

## Les propositions produites

Le MRP génère des Planned Orders pour la fabrication interne et des demandes
d'achat pour les composants approvisionnés. Ces propositions ne sont pas des
décisions : elles doivent être analysées avant d'être converties.

## L'erreur la plus fréquente

Exécuter le MRP sans comprendre les paramètres de données de base. Un délai mal
saisi ou une taille de lot inadaptée produira un plan techniquement correct mais
inutilisable sur le terrain.
