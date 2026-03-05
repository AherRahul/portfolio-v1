---
title: "Graph Databases"
description: "Graph Databases - System Design Module 9"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Graph Databases

Every database type we have explored so far treats relationships as secondary.

Relational databases store relationships in foreign keys that must be joined at query time. Document databases embed related data or store references that require multiple queries. Wide-column databases denormalize relationships into the data model itself.

Graph databases flip this paradigm. Relationships become first-class citizens, stored and indexed just like the data itself.

Consider LinkedIn's "People You May Know" feature. To find potential connections, you need to traverse the social network: find friends of friends who are not already your friends, filter by shared interests or employers, and rank by connection strength.

In a relational database, each "hop" in the graph requires a JOIN operation. For a query that traverses 3-4 hops across millions of users, you are looking at joining billions of row pairs. Performance degrades exponentially with depth.

In a graph database, these traversals are what the system is optimized for. Relationships are stored as direct pointers between nodes. Traversing from one node to its neighbors is a pointer lookup, not a table scan.

The query "friends of friends of Alice" executes in milliseconds, regardless of how many total users exist in the system.

# The Property Graph Model

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
