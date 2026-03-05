---
title: "Time Series Databases"
description: "Time Series Databases - System Design Module 9"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Time Series Databases

Every second, servers emit metrics. Every minute, IoT sensors send readings. Every millisecond, stock prices update. Every day, applications generate billions of log entries.

All of this data shares a common characteristic: it is timestamped, and time is the primary dimension for querying it.

This is time-series data, and it has unique properties that make general-purpose databases inefficient:

*   Data arrives in time order and is rarely updated after insertion
*   Queries almost always filter by time range
*   Aggregations (averages, percentiles, sums) are more common than individual record lookups
*   Recent data is accessed far more frequently than old data
*   Data often has a natural retention period after which it can be deleted

**Time-series databases** are built specifically for these patterns. They use columnar storage for efficient aggregations, automatic data compression, and time-based partitioning that makes retention policies trivial to implement.

The result is databases that can ingest millions of data points per second while providing fast analytical queries.

# Understanding Time-Series Data

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
