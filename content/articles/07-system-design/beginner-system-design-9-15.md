---
title: "How Databases Guarantee Durability"
description: "How Databases Guarantee Durability - System Design Module 9"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# How Databases Guarantee Durability

One of the things that make databases truly powerful is their ability to **protect your data** even in the face of unexpected failures.

Whether the database server **crashes**, **restarts**, or there’s a sudden **power outage**, you can trust that your committed data won’t simply disappear.

This promise is known as **Durability** — one of the four essential **ACID** properties of databases.

_**But, what does it actually take to make a database durable?**_

In this article, we'll explore the key techniques databases use to ensure durability, including:

*   **Write-Ahead Logging (WAL)**
*   **Checkpointing**
*   **Replication**

# **1\. Write-Ahead Logging (WAL)**

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
