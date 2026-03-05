---
title: "Correlation IDs"
description: "Correlation IDs - System Design Module 19"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Correlation IDs

A user reports that their order failed. You open your log aggregation system and search for errors around that time. You find thousands of log entries. Some are from the order service, some from payments, some from inventory. Which ones are related to this user's failed order?

Without a way to connect them, you are reduced to guessing based on timestamps. This is where **correlation IDs** come in.

What is a correlation ID?

A correlation ID is a unique identifier that follows a request through every service it touches. Every log entry, every database query, every external API call includes this ID. When something goes wrong, you search for that single ID and see the complete story of what happened.

Correlation IDs are simple in concept but transformative in practice. They turn a haystack of unrelated logs into a coherent narrative.

In this chapter, you will learn:

*   What correlation IDs are and why they matter
*   How to generate and propagate correlation IDs
*   Common patterns for implementation
*   How correlation IDs connect to distributed tracing
*   Best practices and common pitfalls

This technique works hand-in-hand with the logging practices we covered earlier. Structured logs with correlation IDs become exponentially more useful.

# The Problem: Disconnected Logs

Consider a simple request that touches multiple services:

Each service logs its activity:

But at 10:23:45, your system handled 500 requests per second. These 7 log lines are mixed with 3,000 others from the same time window. How do you know which API Gateway request led to which Order Service log, which led to which Payment failure?

Without correlation IDs, you cannot. You are left matching timestamps and hoping for the best.

# What Is a Correlation ID?

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
