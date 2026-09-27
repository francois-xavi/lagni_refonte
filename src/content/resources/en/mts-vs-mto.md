---
title: "Make-to-Stock or Make-to-Order in SAP"
description: "The differences, the use cases, and the impact on production planning."
category: "sap-pp"
level: "debutant"
date: 2026-08-14
readingMinutes: 7
status: "draft"
cta: "sapPp"
image: "resource-mts-mto.webp"
---

## Two ways of triggering production

Under **Make-to-Stock (MTS)**, production is triggered by a forecast and feeds
anonymous stock. Under **Make-to-Order (MTO)**, it is triggered by a specific
customer order and the stock stays assigned to that order.

## What actually changes

- The kind of requirement entering MRP.
- Stock handling: anonymous, or assigned to the customer.
- The lead time the customer experiences.
- How far the product can be customised.

## Choosing by product

A standard, fast-moving product suits MTS. A configured product, or one that is
expensive to hold, suits MTO. Many organizations run both across product lines.
