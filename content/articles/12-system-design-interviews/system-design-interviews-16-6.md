---
title: "Design CDN"
description: "Design CDN - System Design Interviews Module 16"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# Design CDN

#### What is a CDN?

A Content Delivery Network (CDN) is a globally distributed network of servers that caches and delivers content to users from locations geographically close to them.

Loading simulation...

The core idea is to reduce latency by serving content from edge servers instead of the origin server. When a user in Tokyo requests an image from a website hosted in New York, the CDN serves it from a nearby edge server in Asia instead of fetching it across the Pacific Ocean.

**Popular Examples:** Cloudflare, Akamai, Amazon CloudFront, Fastly

This system design problem tests your understanding of **caching**, **distributed systems**, **DNS, networking,** and **global-scale infrastructure**.

Lets start by clarifying the requirements.

In this chapter, we will explore the **high-level design of a CDN**.

### Premium Content

Subscribe to unlock full access to this content and more premium articles.

[Subscribe Now](/premium)

Launching soon
