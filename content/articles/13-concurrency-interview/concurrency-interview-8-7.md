---
title: "Priority Inversion"
description: "Priority Inversion - Concurrency Interview Module 8"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Priority Inversion

On July 4, 1997, NASA's Mars Pathfinder spacecraft landed on Mars. It deployed the Sojourner rover and began transmitting stunning images of the Martian surface. Then, the lander started randomly resetting itself.

Mission control watched helplessly as the spacecraft's computer rebooted again and again. Each reset meant lost data, interrupted communications, and risk of mission failure. The spacecraft was 119 million miles away. There was no way to fix the hardware. The engineers had to diagnose and patch the software remotely, across the solar system.

After intense investigation, they identified the culprit: priority inversion. A low-priority meteorological task was blocking a high-priority communication task, and medium-priority tasks were making it worse. The solution was an 18-line patch that enabled priority inheritance on a single mutex.

This chapter explains what priority inversion is, why it's dangerous, and how to prevent it. The Mars Pathfinder bug is studied in computer science courses worldwide because it demonstrates how a subtle concurrency issue can threaten a mission years in the making.

# What is Priority Inversion?

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
