---
title: "Strangler Fig Pattern"
description: "Strangler Fig Pattern - System Design Module 17"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Strangler Fig Pattern

Throughout this section on microservices, we have covered patterns for building distributed systems from scratch: service discovery, API gateways, sidecars, service meshes, circuit breakers, and bulkheads.

But what if you are not starting from scratch?

Many organizations have existing monolithic applications, sometimes built over decades, that they want to modernize. The temptation is to stop everything, rewrite the system in a modern architecture, and launch the new version when it is ready. This approach, the "big-bang rewrite," fails more often than it succeeds.

The **Strangler Fig pattern** offers an alternative. Named after strangler fig trees that gradually envelop and replace their host trees, this pattern enables incremental migration from a legacy system to a new architecture. You replace functionality piece by piece, keeping the old system running until the new one is ready.

In this chapter, you will learn:

*   Why big-bang rewrites typically fail
*   How the Strangler Fig pattern works
*   Implementation strategies for routing and data migration
*   Real-world examples and lessons learned
*   When to use this pattern and when to consider alternatives

The Strangler Fig pattern is one of the most practical approaches for modernizing legacy systems safely.

# The Problem: Big-Bang Rewrites Fail

The idea is tempting. Your legacy system is a mess: hard to understand, impossible to test, built on outdated technology. You imagine starting fresh with clean code, modern frameworks, and proper architecture.

### The Reality

Here is what actually happens:

### Why Rewrites Fail

Problem

Description

**Hidden complexity**

Legacy systems contain years of edge cases, bug fixes, and business rules that are not documented

**Moving target**

Business does not stop; requirements change while you rewrite

**No value delivery**

Customers get no new features during the rewrite

**All-or-nothing risk**

You only discover if it works when you flip the switch

**Knowledge loss**

People who understood the old system may leave during multi-year rewrite

**Testing gap**

New system has not been battle-tested in production

Joel Spolsky famously called rewriting code from scratch "the single worst strategic mistake that any software company can make." Netscape's rewrite nearly killed the company. Many others have shared the same fate.

# The Strangler Fig Pattern

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
