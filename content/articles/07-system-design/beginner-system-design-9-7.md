---
title: "Wide Column Databases"
description: "Wide Column Databases - System Design Module 9"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Wide Column Databases

In the previous chapter, we explored key-value stores and their blazing-fast performance for simple lookups.

But what happens when you need that kind of scale for more structured data? What if you have billions of rows, each with potentially hundreds of columns, and you need to write millions of records per second while still querying efficiently?

This is the domain of **wide-column databases**. They originated from Google's Bigtable, created to handle the scale of Google's web indexing and analytics.

The ideas from Bigtable inspired Apache HBase and Apache Cassandra, which now power some of the largest systems in the world.

Wide-column databases sit somewhere between key-value stores and relational databases.

Like key-value stores, they partition data by key for horizontal scaling. But unlike simple key-value pairs, they organize data into column families, allowing you to store and retrieve groups of related columns efficiently.

# The Wide-Column Data Model

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
