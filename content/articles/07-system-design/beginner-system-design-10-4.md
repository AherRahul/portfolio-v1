---
title: "Denormalization"
description: "Denormalization - System Design Module 10"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Denormalization

When your app starts taking seconds to load a simple page, it might not be your code, it might be your database joins.

This chapter will teach you when and why to intentionally duplicate data (a technique called **denormalization**), how it affects reads and writes, and what trade-offs engineers must balance to build fast, large-scale systems.

# 1\. The Problem with Normalization

In a traditional relational database, **normalization** is the process of organizing data into multiple related tables to eliminate redundancy and improve data integrity. If a user's name changes, you only have to update it in one place.

For example, a perfectly normalized schema for a blog application might look like this:

*   `Users(user_id, name, email)`
*   `Posts(post_id, user_id, content, created_at)`
*   `Comments(comment_id, post_id, user_id, text)`

This is clean and efficient for writes. But what happens when you need to display a post, its comments, and the name of the user who wrote each comment? You'd have to run a query with multiple `JOIN` operations:

t a small scale, this is fine. At a large scale, with millions of posts and comments, these joins become incredibly slow and expensive, creating a major performance bottleneck.

This is where denormalization comes in—by storing related data together, we can reduce or eliminate these expensive lookups.

# 2\. What is Denormalization?

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
