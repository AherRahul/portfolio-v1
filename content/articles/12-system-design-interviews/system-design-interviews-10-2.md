---
title: "Design FB News Feed"
description: "Design FB News Feed - System Design Interviews Module 10"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# Design FB News Feed

#### What is Facebook News Feed?

The Facebook News Feed is the central feature of Facebook where users see a personalized stream of posts, photos, videos, and updates shared by their friends, pages they follow, and recommended content.

The feed is continuously updated and ranked to show the most relevant content first, rather than displaying posts in simple chronological order.

Building such a system that delivers this experience to **100 million+ daily active users (DAUs)** is anything but simple.

It brings up several complex challenges like:

*   How do we process and store the massive volume of new posts generated every second?
*   How do we efficiently support rich media like high-quality images and videos?
*   How do we ensure each user's feed updates in near real-time?
*   How do we handle the “celebrity” problem, where one post needs to reach millions of followers quickly?
*   How do we personalize the feed beyond simply showing the latest posts?
*   How do we avoid showing the same post to a user repeatedly?

In this chapter, we’ll start with a **basic version of a news feed system** and evolve it step by step into a **robust, scalable and reliable distributed architecture**.

Let’s start by clarifying the requirements.

### Premium Content

Subscribe to unlock full access to this content and more premium articles.

[Subscribe Now](/premium)

Launching soon
