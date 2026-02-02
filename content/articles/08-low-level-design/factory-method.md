---
title: "Factory Method"
description: "Factory Method is a reusable way to solve a common design problem. It gives you a proven structure so your code stays clean as it grows."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## Factory Method

Factory Method is a reusable way to solve a common design problem. It gives you a proven structure so your code stays clean as it grows.

## Intent
- Solve a recurring design challenge with a simple structure.
- Keep responsibilities clear and reduce coupling.

## When it helps
- When object creation or interaction becomes complex.
- When you need flexible behavior without large rewrites.

## Code example
```ts
interface Notification { send(): void }
class EmailNotification implements Notification { send() { console.log('email'); } }
class SmsNotification implements Notification { send() { console.log('sms'); } }

abstract class Notifier {
  abstract create(): Notification;
  notify() { this.create().send(); }
}
class EmailNotifier extends Notifier { create() { return new EmailNotification(); } }
```

## Tips
- Start small and introduce the pattern only when needed.
- Prefer readability over cleverness.

## Quick recap
- Use patterns to improve structure and flexibility.
