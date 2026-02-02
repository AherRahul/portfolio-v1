---
title: "Command"
description: "Command is a reusable way to solve a common design problem. It gives you a proven structure so your code stays clean as it grows."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## Command

Command is a reusable way to solve a common design problem. It gives you a proven structure so your code stays clean as it grows.

## Intent
- Solve a recurring design challenge with a simple structure.
- Keep responsibilities clear and reduce coupling.

## When it helps
- When object creation or interaction becomes complex.
- When you need flexible behavior without large rewrites.

## Code example
```ts
interface Command { execute(): void }
class Light { on() { console.log('on'); } }
class LightOn implements Command {
  constructor(private light: Light) {}
  execute() { this.light.on(); }
}
```

## Tips
- Start small and introduce the pattern only when needed.
- Prefer readability over cleverness.

## Quick recap
- Use patterns to improve structure and flexibility.

## Code references
- `awesome-low-level-design/design-patterns/python/command`
