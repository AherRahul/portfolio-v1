---
title: "Design Monitoring and Alerting System"
description: "Design Monitoring and Alerting System - System Design Interviews Module 18"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# Design Monitoring and Alerting System

Question

#### What is a Monitoring and Alerting System?

A **Monitoring and Alerting System** continuously collects metrics and logs from applications, servers, and infrastructure components. It analyzes this data to detect performance issues, errors, or anomalies and promptly notifies the appropriate teams so they can take action before users are impacted.

Popular tools that implement these ideas include **Prometheus**, **Datadog**, and **Nagios**.

In this chapter, we'll explore the **high-level design** of such a system including how it works, the key components involved, and the architecture behind real-time detection and alerting.

Let’s start by clarifying the requirements.

# 1\. Clarifying Requirements

Before diving into the design, let's narrow down the scope of the problem. Here’s an example of how a discussion between candidate and interviewer might flow:

Discussion

**Candidate:** "Should the system support both metrics and logs?"

**Interviewer:** "Lets focus only on metrics for this design"

**Candidate:** "Do we need to support real-time monitoring?"

**Interviewer:** "Yes, metrics should be collected and evaluated in near real time."

**Candidate:** "How should alerts be delivered?"

**Interviewer:** "Alerts should be sent through multiple channels such as email, SMS, and integrations with tools like Slack."

**Candidate:** "Should the system support custom alerting rules?"

**Interviewer:** "Yes, users should be able to define thresholds, anomaly detection rules, or queries."

**Candidate:** "Do we need visualization dashboards?"

**Interviewer:** "No, lets skip visualizations and dashboards for now."

**Candidate:** "What kind of scale should we assume?"

**Interviewer:** "Assume millions of metrics per second from thousands of servers and services."

**Candidate:** "Should the system support historical analysis?"

**Interviewer:** "Yes, metrics should be retained for weeks or months."

## 1.1 Functional Requirements

*   **Data Collection:** Collect diverse metrics (CPU, memory, disk I/O, latency, error rates) from various sources (application servers, databases, containers).
*   **Data Storage:** Efficiently store and manage metrics data with configurable retention periods.
*   **Alerting:** Allow users to define rules like “CPU usage > 90% for 5 minutes” and trigger alerts accordingly.
*   **Notifications:** Send alerts via email, SMS, Slack, PagerDuty, or other integrations.

#### Out of Scope:

*   Collecting logs
*   Visualization and Dashboards

## 1.2 Non-Functional Requirements

*   **Scalability:** Handle millions of metrics per second across large, distributed systems.
*   **Availability:** Stay operational even during failures or partial outages.
*   **Low Latency:** Ensure alerts and dashboards reflect recent data within 1–2 minutes.
*   **Durability:** Preserve historical data reliably for long-term analysis.
*   **Extensibility:** Easy to integrate new metric sources, alert types and notification channels.

# 2\. Capacity Estimation

#### Assumptions

**Number of servers:** 10,000

Each server emits: **100 metrics per minute**

#### Metrics Ingestion

*   **Total metrics per minute:** 10,000 × 100 = **1,000,000 metrics/minute**
*   **Per second:** 1,000,000 ÷ 60 ≈ **16,700 metrics/sec**

#### Storage Estimation

*   Average size per metric: **150 bytes** (including metadata)
*   **Per second:** 16,700 × 150 ≈ **2.5 MB/sec**
*   **Per day:** 2.5 MB × 86,400 ≈ **216 GB/day**

#### Alerting Load

If 0.1% of the metrics generate alerts:

*   0.1% of 1,000,000 = **1,000 alerts/minute** ≈ **17 alerts/sec**

# 3\. High-Level Architecture

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
