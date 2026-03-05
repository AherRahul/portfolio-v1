---
title: "Log Aggregation"
description: "Log Aggregation - System Design Module 19"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Log Aggregation

Imagine you have implemented structured logging across your services. Each service writes beautiful JSON logs with consistent fields and appropriate context.

**There is just one problem:** your logs are scattered across 50 servers, each with its own log files. When something goes wrong, you need to SSH into each machine, grep through files, and somehow piece together what happened.

This does not scale. A single request might touch 10 services running on 30 instances. Finding all logs related to that request means searching through 30 different places. During an incident, you do not have time for this.

**Log aggregation** solves this by collecting logs from everywhere and storing them in a central location. Instead of searching 30 servers, you search one system. Instead of correlating timestamps manually, you filter by request ID and see everything.

In this chapter, you will learn:

*   How log aggregation systems work
*   Common architectures and their trade-offs
*   The ELK stack and its alternatives
*   How to scale log aggregation for high-volume systems
*   Cost optimization strategies

This chapter builds on the logging best practices we covered previously. The structured logs you write are only useful if you can search and analyze them at scale.

# The Problem with Distributed Logs

In a single-server app, logs live in one place, so debugging is straightforward. In a distributed system, every service writes its own logs on its own machines. Without aggregation, even simple incidents turn into a scavenger hunt.

A single user request might touch:

*   Service 1 on `server-01`
*   Service 2 on `server-02`
*   Service 3 on `server-03`
*   Database logs on `db-01`

Now the engineer has to SSH into multiple machines, grep through files, and manually stitch the story together. That does not scale.

### The Challenges

Challenge

Impact

**Scattered logs**

Must search each server individually

**Ephemeral infrastructure**

Container logs disappear when containers die

**Access control**

Engineers need SSH access to production servers

**Correlation**

Manually matching logs across services

**Retention**

Each server manages its own rotation and deletion

**Analysis**

No ability to query or visualize patterns

Modern infrastructure makes this worse. With containers, auto-scaling, and frequent redeploys, instances are short-lived. When a container crashes, its local logs may vanish. When a node scales down, its files go with it. If you are not centralizing logs, you are losing the evidence you need most during failures.

# Log Aggregation Architecture

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
