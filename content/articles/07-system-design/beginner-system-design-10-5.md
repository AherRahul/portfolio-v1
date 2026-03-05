---
title: "Materialized Views"
description: "Materialized Views - System Design Module 10"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Materialized Views

The previous chapter explored denormalization, where you manually duplicate and maintain data for read performance. It works, but keeping data synchronized is tedious and error-prone.

What if the database could handle the synchronization for you?

**Materialized views** are database-managed denormalized tables. You define a query once, and the database stores the results as a table. When underlying data changes, the database (or you, on a schedule) refreshes the view.

Instead of running expensive queries every time, you read from a table that already has the answer. The database handles keeping it updated.

### Premium Content

Subscribe to unlock full access to this content and more premium articles.

[Subscribe Now](/premium)

Launching soon
