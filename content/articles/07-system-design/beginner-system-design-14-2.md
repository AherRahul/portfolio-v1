---
title: "Two-Phase Commit (2PC)"
description: "Two-Phase Commit (2PC) - System Design Module 14"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Two-Phase Commit (2PC)

In the previous chapter, we explored why distributed transactions are fundamentally hard. When operations span multiple services, each with its own database, there is no single transaction manager to coordinate commits and rollbacks. We need a protocol that allows independent systems to agree on whether to commit or abort a transaction.

**Two-Phase Commit (2PC)** is the classic solution to this problem. It has been around since the 1970s and remains the foundation for understanding distributed transaction coordination.

The basic idea is simple: before committing, ask all participants if they are ready. Only if everyone agrees do we commit. If anyone says no, everyone aborts.

While 2PC has significant limitations, particularly around availability, understanding it is essential. Many modern databases use 2PC internally for distributed queries.

It forms the baseline against which other patterns are compared. And its weaknesses motivate the alternative approaches we will explore in later chapters.

# The Core Idea

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
