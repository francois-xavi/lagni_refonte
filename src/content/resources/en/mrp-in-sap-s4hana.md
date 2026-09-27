---
title: "MRP in SAP S/4HANA: understanding the process"
description: "The logic, the key parameters and the outputs of MRP in production planning."
category: "sap-pp"
level: "intermediaire"
date: 2026-09-05
readingMinutes: 10
status: "draft"
cta: "sapPp"
image: "resource-mrp-s4hana.webp"
---

## What MRP actually calculates

Material Requirements Planning answers three questions: **what** to produce or
buy, **how much**, and **by when**. It sets demand-driven requirements against
stock on hand and expected receipts.

## The inputs

- Independent requirements (PIRs, sales orders).
- Available stock and planned receipts.
- Bills of material, which push requirements down to components.
- Material Master parameters: MRP type, lot size, lead times, safety stock.

## The proposals it produces

MRP generates Planned Orders for in-house manufacturing and purchase
requisitions for procured components. These proposals are not decisions — they
need to be reviewed before conversion.

## The most common mistake

Running MRP without understanding the master data behind it. A wrong lead time
or an unsuitable lot size produces a plan that is technically correct and
unusable on the floor.
