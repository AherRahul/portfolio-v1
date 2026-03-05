---
title: "Distributed Tracing"
description: "Distributed Tracing - System Design Module 19"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Distributed Tracing

Lets say your metrics dashboard shows that p99 latency spiked from 200ms to 2 seconds. You know something is wrong, but where? The request touches 8 services. Is it the database? The payment gateway? Network latency between services? A slow cache lookup?

Logs can tell you what happened in each service, but piecing together the timeline across 8 services is tedious. Metrics show aggregate latency but not which component is slow. Correlation IDs link logs together but do not show timing.

Distributed tracing solves this by recording the journey of each request through your system, including exactly how long each step took. It shows you a timeline of every service call, database query, and external API request. When latency spikes, you can look at slow traces and immediately see where the time went.

In this chapter, you will learn:

*   How distributed tracing works
*   The concepts of traces, spans, and context propagation
*   How to instrument services for tracing
*   Sampling strategies for high-volume systems
*   Common tracing systems like Jaeger and Zipkin
*   When to use tracing vs logs vs metrics

This chapter builds directly on correlation IDs. Distributed tracing is correlation IDs with structure, timing, and visualization.

# What Is Distributed Tracing?

A distributed trace is a record of a request's journey through a system. It captures every service, database call, and external API request, along with timing information.

From this trace, you can immediately see:

*   The request took 850ms total
*   The slowest component is the database write at 400ms
*   Auth, inventory, and notifications are relatively fast
*   The order service spent most of its time waiting for the database

Without tracing, finding this information would require correlating logs across 5 services and manually calculating timing differences.

# Traces and Spans

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
