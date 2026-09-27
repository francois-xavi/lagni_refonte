---
title: "Les principales données de base de SAP PP"
description: "Material Master, BOM, Routing, Work Center et plus : ce qui structure la planification."
category: "sap-pp"
level: "debutant"
date: 2026-08-28
readingMinutes: 9
status: "draft"
cta: "sapPp"
image: "resource-sap-pp-master-data.webp"
---

## Pourquoi commencer par les données de base

La planification n'invente rien : elle applique ce que les données de base
décrivent. Une donnée incomplète produit un plan incohérent.

## Les objets structurants

- **Material Master** — la fiche article et ses vues (MRP, travaux, comptabilité).
- **Bill of Material (BOM)** — la composition du produit fini.
- **Work Center** — où l'opération est exécutée, avec ses capacités.
- **Routing** — la séquence d'opérations et les temps associés.
- **Production Version** — la combinaison BOM + Routing retenue pour produire.

## Le lien avec l'exécution

Ces objets ne servent pas uniquement à planifier : ils déterminent aussi les
mouvements de composants, les confirmations d'opérations et le calcul des coûts.
