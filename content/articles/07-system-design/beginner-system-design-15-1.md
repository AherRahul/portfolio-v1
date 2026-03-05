---
title: "Geohash"
description: "Geohash - System Design Module 15"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Geohash

Imagine you're building a **food delivery app** like Swiggy or DoorDash. When a hungry customer opens the app, you need to show them nearby restaurants within a few kilometers.

Your database has **millions of restaurants** across the globe, each with a latitude and longitude. How do you quickly find the ones near the customer without scanning through every single record?

The naive approach would be to calculate the distance from the customer to each restaurant using the Haversine formula. But with millions of restaurants and thousands of concurrent users, this becomes computationally expensive and slow.

**Geohash** solves this problem elegantly by converting two-dimensional geographic coordinates into a one-dimensional string that can be indexed and searched efficiently.

# 1\. What is Geohash?

**Geohash** is a hierarchical spatial indexing system that encodes geographic coordinates (latitude and longitude) into a short alphanumeric string.

Invented by Gustavo Niemeyer in 2008, it divides the Earth's surface into a grid of cells, where each cell is represented by a unique string. The longer the string, the smaller and more precise the cell.

For example:

*   `9q8yy` represents a large area in San Francisco
*   `9q8yyk` represents a smaller area within that region
*   `9q8yykbv` represents an even more precise location

The key insight of Geohash is that **locations that share a common prefix are geographically close to each other**. This property makes it extremely efficient for proximity searches.

Here's how San Francisco looks when divided into Geohash cells:

This hierarchical structure is what makes Geohash so powerful. Adding more characters to the hash narrows down the area, similar to how adding more digits to a zip code narrows down a postal region.

# 2\. How Geohash Encoding Works

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
