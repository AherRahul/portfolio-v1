---
title: "Count-Min Sketch"
description: "Count-Min Sketch - System Design Module 15"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Count-Min Sketch

Imagine you're building a system to find trending hashtags on a social platform. Every second, millions of posts stream through with thousands of distinct hashtags.

You need to answer: "Which hashtags are trending right now?"

The obvious approach is to maintain a hash map counting occurrences of each hashtag. But with millions of unique hashtags per hour, your memory consumption grows unbounded.

At Twitter's scale (500 million tweets per day), you'd need gigabytes just to track hashtag frequencies, and that's before you consider tracking trends per region, per time window, or per topic.

**Count-Min Sketch** solves this problem. It's a probabilistic data structure that estimates the frequency of items in a data stream using fixed memory, regardless of how many distinct items you see. The catch? It may overestimate frequencies, but it will never underestimate. For finding heavy hitters, that's exactly what you need.

Invented by Graham Cormode and S. Muthukrishnan in 2005, Count-Min Sketch is now used in network monitoring, database query optimization, stream processing systems, and anywhere you need to track frequencies at scale without blowing up your memory budget.

### Premium Content

Subscribe to unlock full access to this content and more premium articles.

[Subscribe Now](/premium)

Launching soon
