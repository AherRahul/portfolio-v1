---
title: "Sharding vs. Partitioning"
description: "Sharding and partitioning are two of the most commonly confused concepts in system design."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/sharding-vs-partitioning.md"
dateModified: "2025-05-06"
datePublished: "2025-05-06"
showOnArticles: true
topics:
  - databases
  - system-design
---

**Sharding**  and  **partitioning**  are two of the most commonly confused concepts in system design.

At first glance, they may seem similar, and people often use them interchangeably. But they are not the same.

Both are techniques to  **divide and scale large databases** ; however, they differ in how the data is divided.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/f725fe65-d580-4029-bd22-4b7ea239a228_1546x1090.png)](https://substackcdn.com/image/fetch/$s_!TkHD!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff725fe65-d580-4029-bd22-4b7ea239a228_1546x1090.png)

Simply put **, partitioning**  typically means breaking down database tables  **within a single server** while **sharding**  is about distributing data across  **multiple servers** .

In this article, we’ll clear up the confusion between the two. You’ll learn:

- What each term really means
- How they work under the hood
- Real-world examples with SQL and code

# 1. What is Partitioning?

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
