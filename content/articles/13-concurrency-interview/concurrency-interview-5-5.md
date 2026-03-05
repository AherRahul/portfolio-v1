---
title: "Barriers and Latches"
description: "Barriers and Latches - Concurrency Interview Module 5"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Barriers and Latches

Consider a server that spawns multiple initialization threads: one for the database connection pool, another for the cache, a third for loading configuration. The server can't start accepting requests until all of these are ready.

How do you make the main thread wait for all three?

Coordination problems like this require something fundamentally different from locks. Locks protect **resources** (preventing two threads from modifying the same data). But here, you need to coordinate **timing** (making threads wait for each other at specific points). That's what **barriers** and **latches** are for.

This chapter explores what they are, when to use each, how they work internally, and the subtle bugs that can occur when using them incorrectly.

# What Are Barriers and Latches?

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
