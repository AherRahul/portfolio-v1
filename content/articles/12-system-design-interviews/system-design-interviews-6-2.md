---
title: "Fanout Pattern"
description: "Fanout Pattern - System Design Interviews Module 6"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# Fanout Pattern

Fanout (sometimes called **fan-out on write** or **fan-out on read**) is the pattern you reach for when **one event needs to reach many recipients**—fast, reliably, and at scale.

Picture a single user posting “Hello world” on a social app. That’s one write. But the moment it happens, thousands (or millions) of people might need to see it in their feeds, get a push notification, update counters, refresh recommendations, and trigger analytics.

The system’s real work isn’t storing the post, it’s **expanding that one input into many outputs** without melting down.

The **fanout pattern** solves this problem. It's a fundamental technique for distributing data from one source to many destinations, and it powers some of the most demanding systems in tech: **Twitter's timeline**, **Facebook's news feed**, **LinkedIn's activity feed**, and **notification systems** at scale.

### Where This Pattern Applies

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
