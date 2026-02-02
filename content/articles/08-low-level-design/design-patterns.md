---
title: "Design Patterns"
description: "Design patterns are reusable solutions to common design problems. They help you write code that is easier to change and test."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## Design Patterns

Design patterns are reusable solutions to common design problems. They help you write code that is easier to change and test.

## Categories
- Creational: focus on object creation.
- Structural: focus on how objects are composed.
- Behavioral: focus on how objects communicate.

## How to pick a pattern
- Identify the main pain point (creation, structure, or behavior).
- Choose the simplest pattern that solves it.
- Keep the code readable for future maintainers.

## Code example
```ts
interface Component {
  execute(): void;
}

class DefaultComponent implements Component {
  execute(): void {
    console.log('Running');
  }
}
```

## Quick recap
- Use patterns to simplify, not to impress.
