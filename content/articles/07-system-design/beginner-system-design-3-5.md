---
title: "Latency vs Throughput vs Bandwidth"
description: "Latency vs Throughput vs Bandwidth - System Design Module 3"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Latency vs Throughput vs Bandwidth

When discussing system performance, three terms come up repeatedly: **latency**, **throughput**, and **bandwidth**. These concepts are often confused or used interchangeably, but they measure fundamentally different things.

Understanding these metrics is crucial for:

*   Diagnosing performance bottlenecks
*   Making informed architectural decisions
*   Setting realistic expectations with stakeholders
*   Answering system design interview questions

In this chapter, we will break down each concept, explore how they relate to each other, and discuss when each metric matters most.

# The Highway Analogy

Before diving into definitions, let us use a simple analogy. Think of a highway connecting two cities:

*   **Bandwidth** is the number of lanes on the highway. More lanes mean more cars can travel simultaneously.
*   **Throughput** is how many cars actually pass through per hour. This depends on traffic conditions, not just the number of lanes.
*   **Latency** is the time it takes for a single car to travel from one city to the other.

A highway might have 4 lanes (high bandwidth), but if there is an accident, only 100 cars per hour pass through (low throughput). Meanwhile, each car might take 2 hours to complete the journey (high latency).

This analogy helps explain why these metrics do not always move together.

# Latency

**Latency** is the time it takes for a single request to travel from source to destination and back. It measures delay.

In networking, latency is often called **round-trip time (RTT)**, the time from sending a request to receiving a response.

### Components of Latency

Latency is not a single value. It is the sum of multiple delays:

1.  **Propagation delay**: Time for signals to travel through the medium. Light in fiber travels at ~200,000 km/s. A cross-Atlantic request (6,000 km) takes ~30ms just for propagation.
2.  **Transmission delay**: Time to push bits onto the wire. Depends on packet size and link bandwidth.
3.  **Processing delay**: Time for routers, load balancers, and servers to process packets.
4.  **Queuing delay**: Time spent waiting in buffers when components are busy.

### Measuring Latency

Latency is typically measured using percentiles:

Metric

Description

**p50 (median)**

50% of requests are faster than this

**p95**

95% of requests are faster than this

**p99**

99% of requests are faster than this

**p99.9**

99.9% of requests are faster than this

**Why percentiles matter:** Average latency hides outliers. A system with 10ms average might have p99 of 500ms, meaning 1% of users experience terrible performance.

### What Affects Latency?

Factor

Impact

Geographic distance

More distance = more propagation delay

Network congestion

Causes queuing delays

Server load

Increases processing time

Database queries

Slow queries add latency

DNS resolution

Cold requests need DNS lookup

TLS handshake

Adds 1-2 round trips

### Reducing Latency

*   **Use CDNs**: Serve content from edge locations closer to users
*   **Caching**: Eliminate round trips by caching at multiple layers
*   **Connection pooling**: Avoid repeated connection setup
*   **Database optimization**: Add indexes, optimize queries
*   **Geographic distribution**: Deploy servers closer to users
*   **Protocol optimization**: Use HTTP/2, HTTP/3 (QUIC)

# Throughput

**Throughput** is the amount of work completed per unit of time. It measures volume.

For web systems, throughput is often expressed as **requests per second (RPS)** or **transactions per second (TPS)**.

### Throughput vs Bandwidth

A common confusion: **bandwidth** is theoretical maximum capacity, while **throughput** is actual achieved rate.

Scroll

Metric

Definition

Example

**Bandwidth**

Maximum possible data transfer rate

1 Gbps network link

**Throughput**

Actual data transfer achieved

600 Mbps actual transfer

You can never have throughput higher than bandwidth, but throughput is almost always lower due to:

*   Protocol overhead (headers, acknowledgments)
*   Congestion and packet loss
*   Processing limitations
*   Inefficient resource utilization

### Calculating Throughput

For a single-threaded system:

For a multi-threaded system:

### What Limits Throughput?

The **bottleneck** determines maximum throughput. A system is only as fast as its slowest component.

### Improving Throughput

*   **Horizontal scaling**: Add more servers
*   **Vertical scaling**: Add more CPU, memory
*   **Async processing**: Do not block on slow operations
*   **Batching**: Process multiple items together
*   **Caching**: Reduce work by reusing results
*   **Connection pooling**: Reuse expensive connections
*   **Load balancing**: Distribute work evenly

# Bandwidth

**Bandwidth** is the maximum rate at which data can be transferred. It measures capacity.

Bandwidth is typically expressed in **bits per second (bps)**: Kbps, Mbps, Gbps.

### Types of Bandwidth

Type

Description

**Network bandwidth**

Capacity of network links (1 Gbps Ethernet)

**Memory bandwidth**

Rate of data transfer to/from RAM (DDR4: ~25 GB/s)

**Disk bandwidth**

Read/write speed of storage (SSD: ~500 MB/s)

**Bus bandwidth**

Internal data transfer rate (PCIe 4.0: ~64 GB/s)

### Bandwidth-Delay Product

An important concept that connects bandwidth and latency:

BDP represents how much data can be "in flight" at any moment.

**Example:**

*   Bandwidth: 1 Gbps = 125 MB/s
*   Latency: 100ms (coast-to-coast US)
*   BDP: 125 MB/s × 0.1s = 12.5 MB

This means 12.5 MB of data can be traveling through the pipe at any instant. If your TCP window size is smaller than BDP, you will not fully utilize available bandwidth.

Launching soon
