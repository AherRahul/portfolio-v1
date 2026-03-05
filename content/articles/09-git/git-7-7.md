---
title: "Merge Strategies"
description: "Understand the different merge strategies available in Git — ort, recursive, resolve, ours, octopus — and when to use each strategy for optimal merge results."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Merge Strategies

When Git performs a merge, it uses different algorithms (called "strategies") to determine how to combine changes. Understanding these strategies helps you choose the best approach for different merging scenarios.


## What is a Merge Strategy?

A merge strategy is the algorithm Git uses to resolve differences between branches. You can specify a strategy using the `-s` flag with `git merge`:

```bash
git merge -s <strategy> <branch>
```

## Common Merge Strategies

### ort Strategy (Default since Git 2.33)

The **ort** (Ostensibly Recursive's Twin) strategy is the modern default. It's faster and more memory-efficient than the old `recursive` strategy, especially for large repositories.

```bash
git merge -s ort feature/login     # Explicitly use ort
git merge feature/login             # Also uses ort (default)
```

**Best for:** Day-to-day merging of feature branches.

### recursive Strategy (Older Default)

The `recursive` strategy handles complex histories by recursively identifying common ancestors. It's what `ort` replaces.

```bash
git merge -s recursive feature/login
```

**Still usable** in Git versions < 2.33.

### resolve Strategy

The `resolve` strategy is simpler but older. It uses a single common ancestor and doesn't recursively handle complex merge bases.

```bash
git merge -s resolve feature/login
```

**Best for:** Simple, two-branch scenarios.

### ours Strategy

The `ours` strategy merges in name only — it creates a merge commit but **ignores the incoming changes entirely**, keeping only your current branch's content.

```bash
git merge -s ours old-feature-branch
```

**Use case:** Marking a branch as merged while ignoring its content changes. For instance, when you want to declare that a branch has been "merged" for history purposes but want to keep your current branch content unchanged.

> **Note:** This is different from `git merge -X ours` (strategy option), which resolves conflicts by preferring your side but still applies non-conflicting changes from the other branch.

### octopus Strategy

The `octopus` strategy is used to merge **three or more branches** simultaneously. It's the default when you specify multiple branches.

```bash
git merge feature/auth feature/payment feature/notifications
```

**Limitation:** Doesn't handle conflicts — if any conflicts occur, the merge fails and you must use individual merges instead.


## Strategy Options (-X)

You can further control merging with strategy options using `-X`:

### -X ours

When there's a conflict, automatically choose **our version**:

```bash
git merge -X ours feature/login
```

> **Note:** This is not the same as `-s ours`. With `-X ours`, non-conflicting changes from the other branch ARE applied; only conflicts are resolved in favor of "ours."

### -X theirs

When there's a conflict, automatically choose **their version**:

```bash
git merge -X theirs feature/login
```

### -X patience

Uses the "patience" diff algorithm, which produces fewer conflicts in some cases:

```bash
git merge -X patience feature/login
```

### -X renormalize

Apply end-of-line normalization during the merge:

```bash
git merge -X renormalize feature/login
```


## Choosing the Right Strategy

| Scenario | Strategy |
|----------|---------|
| Normal feature branch merge | `ort` (default) |
| Two branch merge, simple history | `resolve` |
| Mark a branch as merged, ignore content | `ours` |
| Merge 3+ branches at once | `octopus` |
| Auto-resolve conflicts to your side | `-X ours` |
| Auto-resolve conflicts to incoming side | `-X theirs` |


## Conclusion

For most day-to-day development, the default `ort` strategy handles merges excellently. The other strategies and options come in handy for specific situations — particularly the `-X ours`/`-X theirs` options for automating conflict resolution in batch operations, and `octopus` for integrating many topic branches at once.
