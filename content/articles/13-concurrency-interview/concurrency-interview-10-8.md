---
title: "Sleeping Barber"
description: "Sleeping Barber - Concurrency Interview Module 10"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Sleeping Barber

The Sleeping Barber Problem, introduced by Edsger Dijkstra in 1965, captures a coordination challenge that appears throughout computing: how do servers efficiently handle variable client arrivals while avoiding both busy-waiting and missed requests?

Picture a barbershop with one barber, one barber chair, and a waiting room with N chairs. When no customers are present, the barber sleeps. When a customer arrives, they either wake the barber or sit in a waiting chair. If all chairs are full, the customer leaves.

This simple scenario reveals subtle synchronization challenges that mirror connection pooling, thread pools, and bounded queues throughout software systems.

# Problem Statement

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
