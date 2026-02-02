---
title: "Design Online Stock Exchange"
description: "Design a clean object model for a online stock exchange. Focus on responsibilities, relationships, and core flows."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## Design Online Stock Exchange

Design a clean object model for a online stock exchange. Focus on responsibilities, relationships, and core flows.

## Requirements
- Define what the system must do (functional).
- Define constraints like performance, scale, or safety (non-functional).

## Core entities
- Main entity that represents the domain.
- Supporting entities for users, state, and storage.
- Services to coordinate workflows.

## Key interactions
- Create or update core records.
- Query current state quickly.
- Handle errors and invalid actions gracefully.

## Class sketch
```ts
class OnlineStockExchangeSystem {
  constructor(private repo: Repository) {}

  createRequest(input: any): string {
    // validate, persist, publish events
    return 'id';
  }
}

interface Repository {
  save(entity: any): void;
  findById(id: string): any | null;
}
```

## Edge cases
- Invalid inputs or missing data.
- Concurrency conflicts.
- Partial failures in dependent services.

## Possible extensions
- Add analytics or audit logs.
- Support multiple regions or tenants.

## Code references
- `awesome-low-level-design/problems/online-stock-brokerage-system.md`

## Quick recap
- Start simple, then refine the design with real constraints.
