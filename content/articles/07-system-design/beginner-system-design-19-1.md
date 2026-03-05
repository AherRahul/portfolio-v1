---
title: "Three Pillars of Observability"
description: "Three Pillars of Observability - System Design Module 19"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Three Pillars of Observability

What is Observability?

Observability is the ability to understand what is happening inside your system by examining its outputs.

Unlike traditional monitoring which asks "is the system up?", observability asks "why is the system behaving this way?"

Observability gives you the tools to debug problems you have never seen before, in systems too complex to understand through code alone.

In this chapter, you will learn:

*   What observability means and why it matters for distributed systems
*   The three pillars of observability: logs, metrics, and traces
*   How each pillar answers different questions about system behavior
*   When to use each pillar and how they complement each other
*   The difference between monitoring and observability

Understanding these fundamentals is essential before diving into the specific techniques covered in later chapters.

# Why Observability Matters

In a monolithic application, debugging is relatively straightforward. You have one process, one log file, and one stack trace when something goes wrong. You can step through code with a debugger and reproduce issues locally.

Distributed systems change everything. A single user request might touch dozens of services, each running on different machines, each with its own logs and failure modes. The problem might be in any of them, or in the network between them, or in the interaction between services that individually work fine.

When latency spikes in this system, where do you look first? Is it the database? The external API? Network congestion between services? A slow cache lookup?

Without observability, finding the answer requires guesswork and luck.

### The Debugging Challenge

Traditional debugging approaches fail in distributed systems:

Approach

Works For

Fails For

**Debugger**

Local development

Production systems, distributed calls

**Print statements**

Simple applications

High-volume production traffic

**Log files**

Single server

Dozens of servers with separate logs

**Reproduce locally**

Deterministic bugs

Race conditions, network issues, load-dependent bugs

Observability tools fill this gap. They collect and correlate data from across your entire system, making it possible to answer questions like:

*   Why did this specific request take 5 seconds?
*   Which service is causing the increase in error rates?
*   What changed between yesterday (when it worked) and today (when it broke)?

# The Three Pillars

Observability rests on three pillars: **logs**, **metrics**, and **traces**. Each one answers a different kind of question, and together they give you a clear, end-to-end view of what’s happening inside your system.

**Logs g**ive you detailed, time-ordered records that help you debug specific issues.

**Metrics** give you aggregated numbers that help you track trends, set thresholds, and catch problems early.

**Traces g**ive you a request’s journey across services, showing the full flow and where time is spent.

A simple way to remember them is to think of a doctor’s toolkit:

*   **Logs** are like clinical notes: rich detail about what occurred.
*   **Metrics** are like vital signs: high-level signals of system health.
*   **Traces** are like scans: they reveal the path and connections across the system.

# Pillar 1: Logs

Logs are timestamped records of discrete events in your system. Whenever something meaningful happens, your code writes a log entry that describes it.

### What Logs Look Like

Each entry typically captures:

*   **When**: timestamp (often with millisecond precision)
*   **Where**: service, component, host, or instance
*   **What**: the event that occurred
*   **Context**: identifiers and details that make the event searchable (order\_id, user\_id, error, etc.)

### Structured vs Unstructured Logs

Modern systems prefer **structured logs** (usually JSON) over plain text because structured logs are easier to parse, index, and query.

#### Unstructured (hard to parse reliably)

#### Structured (machine-readable)

With structured logs, queries become straightforward. Example:

*   “Show all **ERROR** logs from `payment-service` in the last hour”
*   “Find all orders over `$1000` that failed”
*   “Count events by type per service”

### What Logs Are Good For

Use Case

Example

**Debugging errors**

Stack traces, error messages, failed validations

**Audit trails**

Who did what and when

**Security analysis**

Login attempts, permission changes, suspicious activity

**Understanding behavior**

Why a specific decision was made

### Limitations of Logs

Logs are essential, but they don’t scale gracefully on their own:

*   **Volume**: high-traffic systems can produce billions of lines per day
*   **Cost**: storing, shipping, and indexing everything gets expensive
*   **Signal-to-noise**: the useful log line is often buried in a huge stream
*   **Poor aggregation**: logs describe individual events, not trends
*   **Context gaps**: a log in one service usually cannot explain what happened across other services

This is why logs alone are not enough. Next, we’ll use **metrics** to zoom out and understand the system’s overall health and trends.

# Pillar 2: Metrics

Metrics are numerical measurements collected over time. While logs capture individual events, metrics aggregate those events into **time series** so you can spot trends, compare behavior over time, and detect issues early.

### What Metrics Look Like

### Types of Metrics

Metrics generally fall into a few common types:

#### Counters

*   Track totals that only go up
*   Examples: requests served, errors occurred, bytes transferred

#### **Gauges**

*   Track a current value that can go up or down
*   Examples: active connections, queue depth, memory usage

#### **Histograms**

*   Track a distribution of values by buckets
*   Examples: request latency, request size, processing duration

Here’s a quick summary:

Type

Description

Example

Operations

**Counter**

Monotonically increasing value

Total requests, errors, bytes

Rate, increase

**Gauge**

Current value that can go up or down

Memory usage, queue size, temperature

Current, min, max, avg

**Histogram**

Distribution of observations

Request latency, response size

Percentiles, averages

**Summary**

Like histogram but with pre-calculated percentiles

Same use cases, lower storage

p50, p95, p99

### The Four Golden Signals

If you track nothing else, track these four. They cover the most important ways services fail or degrade.

*   **Latency**: how long requests take (p50, p95, p99)
*   **Traffic**: how much demand you’re serving (requests per second)
*   **Errors**: how many requests are failing (error rate)
*   **Saturation**: how “full” your resources are (CPU, memory, queue depth)

They quickly tell you whether your service is healthy and whether it is trending toward trouble.

### What Metrics Are Good For

Use Case

Example

**Alerting**

Trigger alert when error rate exceeds 1%

**Capacity planning**

Track growth trends to predict when to scale

**SLA tracking**

Measure if you are meeting latency targets

**Anomaly detection**

Spot unusual patterns in traffic or errors

**Dashboard visualization**

Real-time graphs of system health

### Limitations of Metrics

Metrics are powerful, but they have blind spots:

*   **Aggregation hides details:** Knowing average latency is high does not tell you why
*   **Cardinality explosion:** Too many unique label values makes metrics unmanageable
*   **No context:** A spike in errors does not tell you which users are affected
*   **Predefined:** You can only query metrics you decided to collect in advance

Metrics usually tell you _that_ something is wrong. To find _where_ it went wrong in a distributed system, you need **traces**.

# Pillar 3: Traces

Traces follow a single request as it moves through your distributed system. They show which services were called, in what order, and how long each step took. If metrics tell you _something_ is wrong, traces help you find _where_ it went wrong.

### What Traces Look Like

A trace is made up of **spans**. Each span represents a unit of work, like a service call, a database query, or a cache lookup.

### What a span typically includes

*   **Trace ID:** Unique identifier linking all spans in a request
*   **Span ID:** Unique identifier for this span
*   **Parent Span ID:** Which span created this one
*   **Operation name:** What work was done
*   **Start and end time:** Duration of the operation
*   **Tags/attributes:** Key-value pairs with context

### What Traces Are Good For

Use Case

Example

**Finding bottlenecks**

Which service is causing slow requests?

**Understanding dependencies**

How do services call each other?

**Debugging specific requests**

Why did this particular request fail?

**Identifying cascading failures**

One slow service causing timeouts elsewhere

**Optimizing critical paths**

Where should we focus performance work?

### Limitations of Traces

Traces are powerful, but they come with practical constraints:

*   **Sampling:** Storing traces for every request is expensive, so most systems sample
*   **Instrumentation required:** Every service must propagate trace context
*   **Storage costs:** Traces are larger than metrics, expensive to retain long-term
*   **Overwhelming detail:** Large traces with hundreds of spans are hard to analyze

# How the Pillars Work Together

The real power of observability comes from combining **metrics, traces, and logs**. Each pillar answers a different question, and together they take you from “something feels wrong” to a concrete root cause.

### A practical debugging workflow

Imagine users report slow checkout:

1.  **Metrics tell you there is a problem:**

*   Dashboard shows p99 latency spiked from 500ms to 5s
*   Error rate increased from 0.1% to 2%
*   You know something is wrong, but not what

3.  **Traces tell you where the problem is:**

*   Look at slow traces during the spike
*   See that Payment Service is taking 4s instead of 100ms
*   Payment Service is calling an external API that is timing out

5.  **Logs tell you why:**

*   Check Payment Service logs during the timeframe
*   Find error: "Connection to payment gateway refused: max retries exceeded"
*   The payment gateway had an outage

Without all three, you end up guessing. With all three, you can move quickly and confidently from symptom to cause.

# Monitoring vs Observability

These terms are often used interchangeably, but they represent different philosophies.

**Monitoring** is about watching for _known_ problems. You decide ahead of time what to measure, set thresholds, and alert when something crosses the line. This works well for predictable failure modes.

**Observability** is about investigating _unknown_ problems. You collect enough high-quality signals (logs, metrics, traces, plus useful context) so you can ask new questions when something unexpected happens. This is what helps in complex distributed systems where failures do not follow a script.

### Quick comparison

Monitoring

Observability

Answers known questions

Answers unknown questions

Predefined alerts

Ad-hoc queries

"Is the server up?"

"Why is this user's request slow?"

Dashboards

Exploration tools

Reactive

Proactive and reactive

In practice, you need both. Monitoring catches the issues you can predict. Observability helps you debug the ones you cannot.

# Building an Observable System

Observability does not happen by accident. You have to design for it from day one, just like scalability or reliability.

### 1\. Instrument Everything

Every service should emit **logs, metrics, and traces** as a first-class part of the codebase.

### 2\. Use Consistent Standards

Observability breaks down quickly when every team does things differently. Standardize the basics:

*   **Logs**: JSON with consistent field names (service, env, request\_id, trace\_id, user\_id, error, etc.)
*   **Metrics**: clear naming conventions (for example `service_operation_unit`) and controlled labels
*   **Traces**: consistent context propagation using standards like **W3C Trace Context**

### 3\. Connect the Pillars

The pillars are most useful when you can move between them quickly:

*   Include **trace IDs** in log entries
*   Attach **exemplars** (trace IDs) to metric points when possible

This lets you jump from a metric spike to the exact traces behind it, then to the logs for the failing span.

### 4\. Design for Debuggability

A good rule of thumb is simple: _If this breaks at 3 AM, what will I need to know to fix it?_

Then make sure the system captures that information by default, not as an afterthought.

# Summary

Observability is about understanding what is happening inside your system:

*   **Logs** record discrete events with full context. They tell you what happened but can be overwhelming at scale.
*   **Metrics** aggregate data into time series. They show trends and enable alerting but hide individual request details.
*   **Traces** follow requests through distributed systems. They show where time is spent but require instrumentation and storage.

Each pillar answers different questions:

*   Metrics: "Is something wrong?" (alerting, dashboards)
*   Traces: "Where is it wrong?" (bottlenecks, dependencies)
*   Logs: "Why is it wrong?" (debugging, root cause)

The pillars work best together. A typical debugging flow starts with metrics detecting an anomaly, traces locating the problem, and logs revealing the root cause.

With the fundamentals established, we will now dive deeper into each pillar. The next chapter focuses on logging, the most familiar pillar but one that is often implemented poorly. We will cover how to write useful logs, choose the right level, structure log data, and avoid common mistakes that make logs useless when you need them most.

Launching soon
