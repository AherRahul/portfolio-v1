---
title: "Batch vs Stream Processing"
description: "Batch vs Stream Processing - System Design Module 18"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Batch vs Stream Processing

Every company today generates massive amounts of data. User clicks, transactions, sensor readings, logs, events, etc..

The question is not whether you have data, but how you process it. Do you wait until you have collected a full day's worth and process it all at once? Or do you process each piece as it arrives?

This fundamental choice defines two paradigms of data processing: **batch** and **stream**. Batch processing collects data over time and processes it in bulk. Stream processing handles data as it flows, one event at a time.

Neither approach is universally better. Each has strengths that make it ideal for certain use cases and weaknesses that make it unsuitable for others. Understanding when to use which, and how to combine them, is essential for designing modern data systems.

In this chapter, you will learn:

*   The fundamental differences between batch and stream processing
*   When to choose each approach
*   Common tools and frameworks for both paradigms
*   How latency, throughput, and complexity trade off between approaches
*   Real-world scenarios where each shines

This chapter sets the foundation for understanding big data architectures. The patterns you learn here will recur throughout this section, from MapReduce to Lambda Architecture.

# **1\.** What is Batch Processing?

Batch processing collects data over a period of time and processes it all together in a single job. Think of it like doing laundry: you accumulate dirty clothes throughout the week and wash them all on Sunday.

### Characteristics of Batch Processing

Characteristic

Description

**Latency**

High (hours to days). Results are not available until the job completes.

**Throughput**

Very high. Optimized for processing massive volumes efficiently.

**Data completeness**

Processes complete, bounded datasets. Knows all the data upfront.

**Fault tolerance**

Can restart failed jobs. Reprocessing is straightforward.

**Complexity**

Lower. Simpler programming model with clear start and end.

### Typical Batch Processing Use Cases

*   **Daily reports and analytics:** Generate yesterday's sales report every morning
*   **ETL pipelines:** Transform raw data into analytical formats overnight
*   **Machine learning training:** Train models on historical data
*   **Data warehouse loading:** Aggregate and load data for business intelligence
*   **Bill generation:** Calculate monthly bills for millions of customers
*   **Payroll processing:** Compute salaries at the end of each pay period

### The Batch Processing Model

A batch job has three phases:

1.  **Input:** Read a bounded dataset from storage
2.  **Process:** Apply transformations, aggregations, or computations
3.  **Output:** Write results to storage

The key insight is that batch processing knows the entire input before starting. This allows for optimizations like sorting all data before aggregating, or making multiple passes over the dataset.

### Popular Batch Processing Tools

Tool

Description

Best For

**Apache Hadoop MapReduce**

Original batch processing framework

Legacy systems, very large datasets

**Apache Spark (Batch)**

In-memory batch processing

Interactive analytics, ML, iterative algorithms

**Apache Hive**

SQL on Hadoop

Ad-hoc queries on data lake

**Presto/Trino**

Distributed SQL query engine

Fast interactive queries

**dbt**

Transformation tool for warehouses

Modern ELT pipelines

# **2\.** What is Stream Processing?

Stream processing handles data as it arrives, one event at a time. Instead of waiting for a batch, it processes continuously. Think of it like a car factory assembly line: each car is built as it moves through the stations, not in batches of 100.

### Characteristics of Stream Processing

Characteristic

Description

**Latency**

Low (milliseconds to seconds). Results appear almost immediately.

**Throughput**

Lower than batch for same resources. Processing overhead per event.

**Data completeness**

Processes unbounded, infinite streams. Never sees "all" the data.

**Fault tolerance**

Complex. Must handle failures without losing or duplicating events.

**Complexity**

Higher. Must handle out-of-order data, late arrivals, state management.

### Typical Stream Processing Use Cases

*   **Real-time fraud detection:** Flag suspicious transactions as they happen
*   **Live dashboards:** Show current metrics updating every second
*   **Alerting and monitoring:** Trigger alerts when anomalies are detected
*   **Real-time recommendations:** Update suggestions based on current browsing
*   **IoT sensor processing:** React to sensor readings immediately
*   **Log analysis:** Detect errors and issues as they occur

### The Stream Processing Model

Stream processing handles events one at a time, maintaining state across events:

1.  **Consume:** Read events from a message queue or stream
2.  **Process:** Apply transformations, update state, compute aggregates
3.  **Emit:** Output results immediately or to downstream systems

The key challenge is that stream processing never sees the complete picture. New events keep arriving. Late events might belong to windows that have already closed. The processor must make decisions with incomplete information.

### Stream Processing Tools

Tool

Description

Best For

**Apache Kafka Streams**

Lightweight stream processing

Kafka-native applications

**Apache Flink**

True stream processing with state

Low-latency, exactly-once processing

**Apache Spark Streaming**

Micro-batch stream processing

Unified batch and stream

**Amazon Kinesis**

Managed streaming on AWS

AWS-native applications

**Google Dataflow**

Unified batch and stream (Beam)

GCP environments

# 3\. Challenges in Stream Processing

Stream processing introduces complexity that batch processing avoids.

### Challenge 1: Out-of-Order Events

Events do not always arrive in the order they occurred. Network delays, distributed systems, and retries cause reordering.

Stream processors must handle this using event time (when it happened) rather than processing time (when it arrived).

### Challenge 2: Late Events

What happens when an event arrives after its window has closed?

### Challenge 3: State Management

Stream processing often needs state. Counting events, computing averages, detecting patterns all require remembering past events.

State must be checkpointed for fault tolerance. If a processor fails, it must recover its state to continue correctly.

### Challenge 4: Exactly-Once Semantics

Guaranteeing each event is processed exactly once is hard in distributed systems:

Guarantee

Description

Complexity

**At-most-once**

Events may be lost

Low

**At-least-once**

Events may be duplicated

Medium

**Exactly-once**

Events processed exactly once

High

Exactly-once requires coordination between the stream processor, state store, and output sink.

# 4\. Comparing Batch and Stream Processing

### The Latency-Throughput Trade-off

Batch processing optimizes for throughput by amortizing overhead across millions of records. Stream processing optimizes for latency by processing each record immediately.

Metric

Batch

Stream

**Time to first result**

Hours

Milliseconds

**Throughput (records/sec)**

Millions

Thousands to hundreds of thousands

**Cost per record**

Lower (amortized)

Higher (per-event overhead)

**Resource utilization**

Bursty (high during job)

Steady (continuous)

### Data Characteristics

Aspect

Batch

Stream

**Dataset**

Bounded (finite)

Unbounded (infinite)

**Completeness**

All data available

Data always incomplete

**Ordering**

Can be sorted globally

May arrive out of order

**Late data**

Not an issue

Must handle explicitly

**Reprocessing**

Easy (re-run job)

Complex (replay stream)

### Programming Model

Batch processing has a simpler programming model because it operates on finite datasets:

Stream processing must handle continuous data and state:

Notice how stream processing introduces the concept of windows. Since streams are infinite, you cannot compute "total count." You can only compute "count per time window."

### The Unified Approach: Apache Spark

Spark blurs the line by offering both batch and stream processing with the same API:

This unified approach means you can develop logic once and apply it to both batch and streaming contexts.

# 5\. Micro-Batch: A Hybrid Approach

Micro-batch processing sits between batch and stream. It processes data in small batches (seconds) rather than true event-by-event.

Spark Structured Streaming uses micro-batch internally but provides a streaming API. For many use cases, seconds of latency is acceptable, and the simpler programming model is worth it.

# Summary

Batch and stream processing represent two fundamental approaches to handling data:

*   **Batch processing** excels at high-throughput, complex analytics on bounded datasets. It is simpler to implement and debug, with straightforward fault tolerance. Use it for reports, ETL, ML training, and any workload that can tolerate hours of latency.
*   **Stream processing** provides low-latency results on continuous data. It is more complex due to out-of-order events, late arrivals, and state management. Use it for real-time dashboards, fraud detection, alerting, and event-driven systems.
*   **Micro-batch** offers a middle ground: seconds of latency with batch-like simplicity. Many production systems use this approach.
*   **Most organizations use both.** Stream for real-time needs, batch for heavy analytics, often processing the same data through both paths.

Understanding these paradigms is essential for designing data architectures. The next chapter dives deep into MapReduce, the foundational batch processing paradigm that revolutionized how we think about processing massive datasets.

Launching soon
