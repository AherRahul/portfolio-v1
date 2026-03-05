---
title: "Design Live Comments"
description: "Design Live Comments - System Design Interviews Module 9"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# Design Live Comments

#### What are Live Comments?

Live comments are a feature often used in streaming platforms, sports apps, and social media events where users can post and view comments in real time as an event unfolds.

For example, during a live football match or a concert stream, thousands or even millions of viewers may send comments simultaneously, which appear instantly for all participants.

In this chapter, we will aim to design a **low-latency, scalable live comment system** that allows thousands or even millions of users to exchange messages in real time during a live event.

Key challenges include:

*   **Latency:** Messages must be delivered in near real-time.
*   **Fanout:** A single message needs to be broadcast to millions of subscribers simultaneously.
*   **Ordering:** Comments should appear in a logical, roughly chronological order.

Let’s begin by clarifying the requirements.

# 1\. Clarifying Requirements

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
