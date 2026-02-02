---
title: "Choosing Design Patterns"
description: "This lesson gives practical advice to help you perform well in low-level design interviews."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## Choosing Design Patterns

This lesson gives practical advice to help you perform well in low-level design interviews.

## Key steps
- Clarify requirements before drawing anything.
- Identify core entities and their responsibilities.
- Show relationships and important method signatures.
- Call out trade-offs and explain choices.

## Small example
```ts
// Talk through responsibilities before coding
// Example: NotificationService handles dispatch
class NotificationService {
  send(message: string): void {
    // validate, route, retry
  }
}
```

## Quick recap
- Keep your explanation structured and easy to follow.
