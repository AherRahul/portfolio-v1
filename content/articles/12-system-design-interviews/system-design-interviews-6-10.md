---
title: "Generating Unique IDs"
description: "Generating Unique IDs - System Design Interviews Module 6"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# Generating Unique IDs

You're designing a URL shortener. Each shortened URL needs a unique identifier. Simple enough, you think. Just use an auto-incrementing database ID.

Then you scale to multiple database servers. Now you have a problem. Two servers might generate the same ID at the exact same moment. Your "unique" IDs are no longer unique.

This is one of those problems that seems trivial until you actually have to solve it at scale.

In this chapter, we'll explore the most common approaches to generating unique IDs, understand their trade-offs, and learn when to use each one.

This topic comes up frequently in system design interviews because it touches on coordination, scalability, and the kinds of practical engineering decisions you'll face in real distributed systems.

# Why Is This Problem Hard?

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
