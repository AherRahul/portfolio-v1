---
title: "Rebase vs Merge"
description: "Compare rebasing and merging in Git — understand when to use each approach, their effect on commit history, team workflow considerations, and the trade-offs between linear and non-linear history."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Rebase vs Merge

Both `git rebase` and `git merge` accomplish the same goal — integrating changes from one branch into another. But they do it in fundamentally different ways, and the choice between them affects your project's commit history and team workflow.


## The Key Difference

**Merge** creates a new "merge commit" that joins the two branches' histories, preserving the full context of when and how branches diverged.

**Rebase** moves your commits to the tip of the target branch, creating a linear history as if you had branched off the latest version of target.


## Visual Comparison

**Common starting point:**

```
main:    A → B → C
feature:     B → D → E
```

### After `git merge`:

```
main:    A → B → C → M (merge commit)
               ↗
feature:   D → E
```

History is **non-linear** — the merge commit `M` has two parents. The branch structure is preserved in history.

### After `git rebase main` then fast-forward merge:

```
main:    A → B → C → D' → E'
```

History is **linear** — `D'` and `E'` are replayed on top of `C`. The branch no longer appears in history.


## When to Use Merge

**Use `git merge` when:**

1. **Preserving context is important:** You want the history to show when specific features were merged and how branches developed in parallel.

2. **Working with shared/public branches:** Never rebase commits that others have based work on. Merge is always safe.

3. **Integrating a completed feature:** A merge commit provides a clear "checkpoint" in the history for when the feature was done.

4. **Following "never rewrite public history":** If your team's policy is strict about history preservation, merge is the right choice.

```bash
# Safe merge workflow
git switch main
git merge feature/login --no-ff -m "Merge feature/login: Add user auth"
```

### When to Use Rebase

**Use `git rebase` when:**

1. **You want a clean linear history:** Especially valuable for personal branches before opening a pull request.

2. **Updating a local branch:** Using `git rebase main` instead of `git merge main` keeps your feature branch up-to-date without creating merge commits.

3. **Cleaning up commits before sharing:** Use interactive rebase (`git rebase -i`) to squash WIP commits before a PR review.

4. **Your team uses a linear history policy:** Some teams require all merges to be fast-forward, which requires rebasing.

```bash
# Safe rebase workflow (local branch only)
git switch feature/login
git rebase main           # Replay feature commits on top of main
git push --force-with-lease  # Force push (only for your own feature branches)
```


## Side-by-Side Comparison

| Aspect | Merge | Rebase |
|--------|-------|--------|
| History type | Non-linear (shows branches) | Linear (appears sequential) |
| Has merge commits? | Yes | No (commits are replayed) |
| Rewrites history? | No | Yes |
| Safe for shared branches? | ✅ Yes | ❌ No |
| Preserves when branches diverged? | ✅ Yes | ❌ No |
| Easier to use? | ✅ Simpler | More complex |
| Easier to read? | Sometimes complex graph | ✅ Cleaner history |


## The "Rebase onto main" Workflow (Popular)

Many teams use a combination: rebase locally, then merge with `--no-ff`:

```bash
# Developer workflow:
git switch feature/login
git rebase main              # Rebase to get latest changes + clean history
git push --force-with-lease  # Update remote feature branch

# When ready to merge (maintainer/CI does this):
git switch main
git merge --no-ff feature/login  # Explicit merge commit in main's history
git push origin main
```

This gives you clean feature branch history AND a visible merge point in `main`.


## Summary: The General Rule

| Situation | Use |
|-----------|-----|
| Integrating mainline changes into your local feature branch | **Rebase** |
| Merging a completed feature into main | **Merge** (usually with `--no-ff`) |
| Cleaning up commits before a PR | **Interactive Rebase** |
| Any operation on shared/public branches | **Merge** only |
