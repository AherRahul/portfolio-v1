---
title: "Gossip Protocol"
description: "Gossip Protocol - System Design Module 13"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Gossip Protocol

Imagine 10,000 servers across the globe. One crashes. How does other nodes find out?

Broadcasting doesn’t scale: one node tells 9,999 others. At 100 events/sec, that’s ~1,000,000 messages/sec. Worse, if the broadcaster dies mid-send, only part of the cluster learns the truth.

A central coordinator avoids the flood, but creates a single point of failure and a scalability bottleneck.

**Gossip protocols** take a different approach: information spreads like rumors. Each node periodically shares what it knows with a few random peers, who repeat the process. Updates propagate quickly, even with dropped messages or unreachable nodes.

Systems like Cassandra, DynamoDB, Consul, CockroachDB, and Redis Cluster use gossip for membership, failure detection, and data dissemination.

In this chapter, we’ll break down how gossip works, why it scales, and how it’s implemented in production.

### Premium Content

Subscribe to unlock full access to this content and more premium articles.

[Subscribe Now](/premium)

Launching soon
