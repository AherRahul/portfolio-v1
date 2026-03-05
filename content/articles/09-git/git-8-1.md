---
title: "Rebasing Basics"
description: "Understand what rebasing is in Git, how it differs from merging, when to use it, and why it creates a cleaner linear history for your project."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Rebasing Basics

Rebasing is one of the two major ways to integrate changes from one branch into another (the other being merging). While merging creates a merge commit to join branches, rebasing **moves or replays commits** onto the tip of another branch, creating a cleaner, linear history.


## What is Rebasing?

When you rebase a branch, you're saying: "Take all the commits I've made on my branch and replay them on top of the target branch, as if I had branched off from there originally."

**Before rebase:**

```
main:    A → B → C
feature:     B → D → E
```

**After `git rebase main` on feature:**

```
main:    A → B → C
feature:           C → D' → E'
```

Note that `D'` and `E'` are new commits (different hash than `D` and `E`) — they have the same changes but a new base commit and therefore a new SHA-1 hash.


## Why Use Rebasing?

The main benefit of rebasing is a **clean, linear commit history**. Instead of a messy graph with multiple merge commits, you get a straight line of commits that's easier to read.

**Benefits of rebase:**
- Linear history is easier to read with `git log`
- Makes `git bisect` more effective (easier binary search)
- Avoids "noise" merge commits in the history
- Makes pull requests cleaner to review

**Downsides of rebase:**
- Rewrites commit history (creates new commit hashes)
- Can be confusing for beginners
- **Never rebase shared/public branches** — it rewrites history that others depend on


## The Golden Rule of Rebasing

> **Never rebase commits that have been pushed to a public/shared repository.**

Rebasing rewrites commit history. If others have based their work on the original commits, rebasing creates a parallel history that causes significant confusion and requires force-pushes to resolve.

**Safe to rebase:** Local branches that only you are working on.
**Never rebase:** `main`, `develop`, or any branch others have checked out.


## Rebase vs. Merge: The Key Difference

Both achieve the same end result (combining code from two branches), but the history looks different:

**After merge:**

```
main:    A → B → C → M
               ↗
feature:   D → E
```

**After rebase + fast-forward merge:**

```
main:    A → B → C → D' → E'
```

- **Merge:** Preserves the true history; shows when and how branches were integrated.
- **Rebase:** Creates the illusion that development happened linearly; cleaner, simpler history.


## When to Use Rebase

- **Before submitting a pull request:** Rebase your feature branch onto `main` to catch up and create a cleaner diff.
- **Keeping local branches up to date:** Instead of `git merge main`, use `git rebase main` to stay current without merge commits.
- **Cleanup with interactive rebase:** Squash, reorder, or edit commits before merging.

```bash
# Typical workflow: update feature branch before PR
git switch feature/login
git rebase main

# If there are conflicts, resolve them and continue
git rebase --continue

# Or abort the rebase
git rebase --abort
```


## Conclusion

Rebasing is a powerful tool for maintaining a clean linear history, but it comes with the important caveat of never rewriting shared history. In the next chapters, we'll dive into the `git rebase` command, interactive rebase, and comparing rebase with merge in depth.
