---
title: "Design Time Series Database"
description: "Design Time Series Database - System Design Interviews Module 16"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# Design Time Series Database

What is a Time-Series Database?

A **Time-Series Database (TSDB)** is a specialized database optimized for storing, querying, and analyzing data points indexed by time. Each data point typically consists of a timestamp, a metric name, a value, and optional tags or labels.

Loading simulation...

Unlike general-purpose databases that handle arbitrary queries equally well, TSDBs are built from the ground up for append-heavy workloads and time-range queries. They excel at ingesting millions of data points per second and retrieving data for specific time windows efficiently.

**Popular Examples:** [InfluxDB](https://www.influxdata.com/), [TimescaleDB](https://www.timescale.com/), [Prometheus](https://prometheus.io/), [Amazon Timestream](https://aws.amazon.com/timestream/), [QuestDB](https://questdb.io/)

What makes time-series data special? Three characteristics shape everything about how we design for it:

1.  **Append-only writes:** Once a CPU measurement is recorded, you never go back and change it. Data flows in one direction, from the present into history.
2.  **Time-range queries:** Almost every query filters by time. "Show me CPU usage for the last hour" or "What was the p99 latency yesterday between 2pm and 3pm?" Queries that span arbitrary time ranges need to be fast.
3.  **Recency bias:** Recent data is queried far more often than old data. The metrics from the last hour matter more than metrics from last month. This asymmetry opens up optimization opportunities.

This problem is a common choice in system design interviews, especially for roles involving monitoring, observability, IoT, or financial systems. It tests your understanding of write-optimized storage engines, data compression techniques, and query optimization for time-based access patterns.

The challenge is not just storing data, but doing it at scale while keeping queries fast.

In this chapter, we will explore the **high-level design of a time-series database**.

Let's start by clarifying the requirements:

### Premium Content

Subscribe to unlock full access to this content and more premium articles.

[Subscribe Now](/premium)

Launching soon
