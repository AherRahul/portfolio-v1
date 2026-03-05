---
title: "Outbox Pattern"
description: "Outbox Pattern - System Design Module 14"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Outbox Pattern

Throughout this section on distributed transactions, we have discussed how services communicate through events and messages. Sagas coordinate through events. Choreography relies on event publishing. Even orchestration typically uses message queues to communicate with services.

But we have been assuming something important: that when a service commits its database transaction, the corresponding event is reliably published.

This assumption is dangerous. What happens if the database transaction commits but the application crashes before publishing the event? The database has the new state, but no downstream services know about it. The Saga is stuck. What if the event is published but the database transaction rolls back? Now downstream services act on data that does not exist.

This is the dual-write problem: updating two systems (database and message broker) atomically is impossible without distributed transactions. And we have spent several chapters explaining why distributed transactions are problematic.

The **Outbox pattern** solves this elegantly. Instead of writing to the database and the message broker separately, we write everything to the database in a single local transaction. A separate process reads from the database and publishes to the message broker. The database becomes the source of truth for both state and events.

# The Dual-Write Problem

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
