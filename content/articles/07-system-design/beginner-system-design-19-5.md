---
title: "Metrics & Instrumentation"
description: "Metrics & Instrumentation - System Design Module 19"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Metrics & Instrumentation

Logs tell you what happened to specific requests. But what if you need to know how the system is performing overall? Are response times getting slower? Is the error rate increasing? How many requests are we handling per second?

These questions require **metrics**: numerical measurements collected over time.

Metrics answer questions like "how many?" and "how fast?" across thousands or millions of requests. They power dashboards, drive alerts, and enable capacity planning. Good instrumentation gives you early warning when things degrade, often before users notice.

In this chapter, you will learn:

*   Types of metrics and when to use each
*   The four golden signals every service should track
*   How to instrument your code effectively
*   Metric naming conventions and best practices
*   Cardinality and why it matters for scalability
*   Common metrics infrastructure like Prometheus

This builds on the observability foundation we established earlier. Metrics complement logs by providing the aggregate view that logs cannot offer.

# Why Metrics Matter

To understand why metrics are indispensable, consider an e-commerce platform during a flash sale.

#### What Logs Show:

*   Order 123 completed in 250ms
*   Order 124 completed in 280ms
*   Order 125 completed in 310ms
*   .. 50,000 more orders ...

#### What Metrics Show

*   Request rate: 2,500/sec ↑
*   p99 latency: 450ms ↑
*   Error rate: 0.3% ↑
*   CPU: 78% ↑

Logs show individual events. To understand the flash sale's impact, you would need to aggregate 50,000 log entries. Metrics give you instant visibility: request rate tripled, latency increased by 40%, error rate is still acceptable, CPU is climbing.

### Metrics vs Logs Comparison

Aspect

Metrics

Logs

**Data type**

Numeric time series

Text events

**Question answered**

How much? How many?

What happened?

**Storage efficiency**

Very efficient (numbers)

Less efficient (text)

**Query style**

Aggregate, graph

Search, filter

**Retention**

Months to years

Days to weeks

**Alerting**

Primary use case

Secondary use case

**Debugging**

Find the problem

Understand the problem

Both are essential. Metrics alert you that something is wrong. Logs and traces help you understand why. Think of metrics as the vital signs monitor in a hospital: it tells doctors instantly when something needs attention, but they still need tests and exams to diagnose the cause.

# Types of Metrics

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
