---
title: "The core master data objects in SAP PP"
description: "Material Master, BOM, Routing, Work Center and more: what structures planning."
category: "sap-pp"
level: "debutant"
date: 2026-08-28
readingMinutes: 9
status: "draft"
cta: "sapPp"
image: "resource-sap-pp-master-data.webp"
---

## Why master data comes first

Planning invents nothing: it applies what the master data describes. Incomplete
data produces an incoherent plan.

## The structuring objects

- **Material Master** — the item record and its views (MRP, work scheduling, costing).
- **Bill of Material (BOM)** — what the finished product is made of.
- **Work Center** — where an operation runs, and its capacity.
- **Routing** — the sequence of operations and their times.
- **Production Version** — the BOM + Routing combination chosen to produce.

## The link to execution

These objects do more than drive planning: they also determine component
movements, operation confirmations and cost calculation.
