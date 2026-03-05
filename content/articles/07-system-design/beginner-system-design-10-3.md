---
title: "Read Replicas"
description: "Read Replicas - System Design Module 10"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Read Replicas

Most applications read data far more often than they write it. Think about how you use any web application: you browse products, scroll through feeds, check dashboards, and compare prices. These are all reads. Occasionally, you add something to your cart, post a comment, or update your profile. Those are writes.

A typical web application might have a 10:1 read-to-write ratio, and social media platforms often see ratios of 100:1 or higher.

When your single database server starts struggling under this read-heavy load, your instinct might be to just "add another database."

But here is the problem: writes need to be coordinated. If you have two primary databases both accepting writes, user A might update their profile on database 1 while user B reads that same profile from database 2. Now your databases have conflicting data, and you have entered the messy world of distributed consistency problems.

This is where **read replicas** offer an elegant solution. Instead of trying to scale writes (which is genuinely hard), you scale reads by creating copies of your database that only serve read queries. The primary database remains the single source of truth for all writes, and the replicas handle the flood of read traffic.

In this chapter, we will explore how read replicas work under the hood, when they are the right solution (and when they are not), and how to implement them correctly.

# 1\. What Are Read Replicas?

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
