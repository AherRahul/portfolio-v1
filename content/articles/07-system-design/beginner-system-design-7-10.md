---
title: "Delivery Semantics"
description: "Delivery Semantics - System Design Module 7"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Delivery Semantics

When you send a message through a messaging system, what guarantees do you have about its delivery? Will it definitely arrive? Could it arrive more than once?

These questions are at the heart of **delivery semantics**. Delivery semantics define the contract between a messaging system and its users about how many times a message will be delivered.

Understanding these guarantees is essential because choosing the wrong semantics can lead to lost data, duplicate processing, or systems that are unnecessarily complex.

In this chapter, you will learn:

*   The three delivery semantics: at-most-once, at-least-once, and exactly-once
*   How each semantic works and its trade-offs
*   Why exactly-once is harder than it sounds
*   How to achieve effective exactly-once processing
*   How to design systems that handle each semantic correctly

# The Three Delivery Semantics

Messaging systems offer three levels of delivery guarantees. Each makes different trade-offs between reliability, performance, and complexity.

Semantic

Guarantee

Message Loss

Duplicates

**At-most-once**

Delivered 0 or 1 times

Possible

Never

**At-least-once**

Delivered 1 or more times

Never

Possible

**Exactly-once**

Delivered exactly 1 time

Never

Never

Let us explore each in detail.

# At-Most-Once Delivery

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
