---
title: "R-Trees"
description: "R-Trees - System Design Module 15"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# R-Trees

When you open Uber and search for nearby drivers, how does the app instantly find all drivers within a 5-mile radius from millions of active drivers? Or when you use Google Maps to find "coffee shops near me," how does it return results in milliseconds?

A traditional database index like a **B-Tree** is optimized for one-dimensional data. It can efficiently find all users with ages between 25 and 30, but it struggles with spatial queries like "find all points within this rectangle" or "find the nearest neighbor to this location."

**R-Trees** are a spatial index designed specifically for multi-dimensional data. They organize geographic coordinates, rectangles, and complex shapes in a way that makes spatial queries fast and efficient.

Invented by **Antonin Guttman in 1984**, R-Trees are now the backbone of spatial indexing in databases like **PostGIS**, **MySQL Spatial**, **MongoDB**, and **SQLite**. They power location-based services at companies like Uber, Lyft, DoorDash, and Google Maps.

In this chapter, we'll explore what R-Trees are, how they work, how to perform spatial queries, and where they're used in real-world systems.

### Premium Content

Subscribe to unlock full access to this content and more premium articles.

[Subscribe Now](/premium)

Launching soon
