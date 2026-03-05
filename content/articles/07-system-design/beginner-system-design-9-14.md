---
title: "LSM Trees"
description: "LSM Trees - System Design Module 9"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# LSM Trees

Traditional database indexes, like **B+ Trees**, are brilliant for **read-heavy workloads**. They keep data perfectly sorted on disk, making lookups incredibly fast.

But this meticulous organization comes at a price.

Every write operation can trigger a cascade of slow, random disk I/O operations as the database must update multiple pages and rebalance the tree structure in place. These small, scattered writes quickly become a bottleneck especially on spinning disks or SSDs under heavy load.

In today’s world of **big data, IoT, and real-time analytics**, workloads have shifted. Systems are ingesting millions of new records per second. The challenge is no longer just _reading efficiently,_ it’s _writing at scale_.

We need a data structure that doesn’t just **tolerate** high write volumes but is **built** for them.

This is the problem the **Log-Structured Merge Tree** was designed to solve. It's based on a simple yet powerful principle: **stop modifying data in place and start treating writes as an append-only log.**

In this chapter, we’ll dive deep into **how LSM Trees work**, why they’re so effective for write-heavy systems, and how they’ve become the foundation of modern databases like **RocksDB, Cassandra, and Bigtable**.

# 1\. The Problem with B+ Trees

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
