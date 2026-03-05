---
title: "Quad Trees"
description: "Quad Trees - System Design Module 15"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Quad Trees

Imagine you open the Uber app and request a ride. Within seconds, the app shows you several available drivers nearby.

Behind the scenes, Uber needs to search through millions of active drivers spread across the globe and find those within a few kilometers of your location. And it needs to do this thousands of times per second across all users.

How do you efficiently find "things near a point" when you have billions of location records?

A naive approach would scan every driver in the database and compute the distance to each one. With millions of drivers, this takes seconds per query, which is unacceptable for real-time applications.

This is where **Quad Trees** come in.

In this chapter, we'll explore:

*   What is a Quad Tree and how it works
*   Why Quad Trees are ideal for spatial data in distributed systems
*   How to implement proximity search at scale
*   Real-world applications at Uber, Lyft, and gaming companies
*   Quad Trees vs GeoHashing vs R-Trees: when to use what

# 1\. The Problem: Proximity Search at Scale

Location-based services face a fundamental challenge: finding nearby entities quickly.

Consider these scenarios:

*   **Uber**: Find drivers within 5 km of a rider
*   **DoorDash**: Find restaurants within delivery range
*   **Pokemon Go**: Find players and items near your location
*   **Google Maps**: Find gas stations along your route

### Why Traditional Indexes Fail

Let's say you store driver locations in a database table with latitude and longitude columns:

To find drivers within 5 km of a user at coordinates (37.7749, -122.4194), you might write:

This bounding box query has several problems:

1.  **Index inefficiency**: B-tree indexes work well for one-dimensional data. With two dimensions, the database can use an index on latitude OR longitude, but then must scan all matching rows to filter by the other dimension.
2.  **Full table scans**: Even with a composite index on (latitude, longitude), the database cannot efficiently prune both dimensions simultaneously.
3.  **No spatial locality**: Traditional indexes have no understanding that (37.77, -122.42) is close to (37.78, -122.41).

The following diagram shows why B-tree indexes struggle with 2D queries:

What we need is a data structure that understands 2D space and can quickly eliminate irrelevant regions.

# 2\. What is a Quad Tree?

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
