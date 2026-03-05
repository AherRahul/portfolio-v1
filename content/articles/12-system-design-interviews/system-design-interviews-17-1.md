---
title: "Design Likes Counting System"
description: "Design Likes Counting System - System Design Interviews Module 17"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# Design Likes Counting System

What is a Likes Counting System?

A likes counting system tracks and displays the number of likes (or reactions) on content such as posts, videos, comments, and photos across social media platforms.

The core challenge is deceptively simple: when a user taps the "like" button, increment a counter and display the updated count. But at the scale of platforms like Facebook, Instagram, or YouTube, where billions of likes happen daily, this becomes one of the most challenging distributed systems problems.

**Popular Examples:** Facebook reactions, Instagram likes, YouTube likes, Twitter/X likes, Reddit upvotes

This system design problem tests your understanding of several important concepts: handling high-throughput writes, dealing with eventual consistency, designing effective caching strategies, and managing the hot spot problem that viral content creates.

In this chapter, we will explore the **high-level design of a likes counting system**.

Lets start by clarifying the requirements:

### Premium Content

Subscribe to unlock full access to this content and more premium articles.

[Subscribe Now](/premium)

Launching soon
