---
title: "Activity Diagram"
description: "Activity Diagram helps you visualize design before you write code. It is a simple way to explain structure and flow to others."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## Activity Diagram

Activity Diagram helps you visualize design before you write code. It is a simple way to explain structure and flow to others.

## What it shows
- The key elements involved.
- How those elements relate or interact.
- The order of actions when needed.

## How to create it
1. List the main actors or classes.
2. Draw relationships or message flow.
3. Keep labels short and clear.

## Example (text form)
```text
User -> Service: request()
Service -> Repository: save()
Repository -> DB: insert()
```

## Quick recap
- Use diagrams to communicate design quickly.
