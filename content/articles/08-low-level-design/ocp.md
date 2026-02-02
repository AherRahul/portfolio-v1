---
title: "OCP"
description: "This lesson explains OCP in simple terms and shows how it helps you design clear, testable code."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## OCP

This lesson explains OCP in simple terms and shows how it helps you design clear, testable code.

## Core idea
- Focus on clear responsibilities.
- Keep rules and boundaries explicit.
- Prefer small, testable units.

## When to use it
- When responsibilities are getting mixed together.
- When you want to make changes without breaking other parts.
- When you want to keep code easy to test.

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

## Common mistakes
- Over-complicating the design for small problems.
- Hiding too much and making debugging hard.
- Forgetting to document assumptions.

## Quick recap
- Clarity and maintainability come first.
- Keep the design small and evolve it with needs.
