---
title: "DNS Load Balancing"
description: "DNS Load Balancing - System Design Module 5"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# DNS Load Balancing

When you type "google.com" into your browser, a DNS server resolves it to an IP address. But Google serves billions of requests daily across thousands of servers worldwide. How does a single domain name route traffic to the right server?

The answer is **DNS load balancing**, a technique that distributes traffic across multiple servers at the DNS resolution layer itself, before a connection is even established.

Unlike traditional load balancers that sit between clients and servers, DNS load balancing works at the very first step of any network request. It's the reason you can have servers on multiple continents, all responding to the same domain name, with users automatically routed to the nearest one.

# 1\. What is DNS Load Balancing?

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
