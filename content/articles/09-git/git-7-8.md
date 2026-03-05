---
title: "git rerere"
description: "Learn how git rerere (Reuse Recorded Resolution) automatically re-applies your previous conflict resolutions to save time when the same conflicts recur during merges and rebases."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# git rerere

`git rerere` stands for **"Reuse Recorded Resolution"**. It's a feature that allows Git to remember how you resolved a particular conflict and automatically re-apply that resolution the next time the same conflict occurs. This is especially useful when you have long-running branches that frequently merge with `main` and encounter the same conflicts repeatedly.


## How rerere Works

When `rerere` is enabled:

1. When you encounter a merge conflict, Git records the "pre-resolution" state (the conflicting code) in `.git/rr-cache`.
2. After you resolve the conflict, Git records the resolution.
3. The next time the same conflict occurs (e.g., during a rebase or another merge), Git automatically applies the recorded resolution.


## Enabling rerere

`rerere` is disabled by default. Enable it globally:

```bash
git config --global rerere.enabled true
```

Or for a specific repository:

```bash
git config rerere.enabled true
```


## rerere in Action

### Example Scenario

You're working on a long-lived `feature/payment` branch and regularly merge from `main`. Every time you merge, there's the same conflict in `src/config.js` because both branches have modified it.

**First merge:**

```bash
git merge main
# CONFLICT in src/config.js
```

Git records the conflict state (with `rerere.enabled = true`):

```
Recorded preimage for 'src/config.js'
```

You resolve the conflict manually:

```bash
# Edit src/config.js to resolve the conflict
git add src/config.js
git commit -m "Merge main into feature/payment"
```

Git records your resolution:

```
Recorded resolution for 'src/config.js'
```

**Next merge (same conflict):**

```bash
git merge main
# CONFLICT in src/config.js again!
# But now Git says:
Resolved 'src/config.js' using previous resolution.
```

Git automatically applies your previous resolution! You just need to:

```bash
git add src/config.js
git commit -m "Merge main into feature/payment"
```


## rerere During Rebase

`rerere` is especially powerful during interactive rebases, which encounter the same conflicts at multiple steps. Without `rerere`, you'd resolve the same conflict for every rebased commit. With `rerere`, it's resolved automatically.

```bash
git rebase main
# rerere resolves conflicts it has seen before automatically
```


## Managing rerere Cache

### View Recorded Resolutions

```bash
# See what's in the rerere cache
ls .git/rr-cache/
```

### Clear rerere Cache

If a recorded resolution is wrong and you want to clear it:

```bash
# Forget resolutions for specific files
git rerere forget src/config.js

# Clear all rerere cache (nuclear option)
rm -rf .git/rr-cache
```

### Check rerere Status

```bash
git rerere status     # Show files that rerere is tracking
git rerere diff       # Show what rerere will apply
```


## When rerere is Most Useful

- **Long-lived feature branches** that frequently merge or rebase against `main`
- **Release branches** where the same hotfix conflicts recur
- **Complex merge sequences** where you apply the same set of changes across multiple branches
- **Interactive rebases** where the same conflict appears at multiple commit steps


## Conclusion

`git rerere` is a powerful productivity tool for developers who frequently deal with recurring merge conflicts. Once enabled, it silently records and replays your conflict resolutions, turning a repeatedly painful process into an automated one. Consider enabling it globally if you regularly work on long-running branches or complex merge scenarios.
