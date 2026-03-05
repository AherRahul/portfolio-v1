---
title: "Fast-Forward Merge"
description: "Understand Git's fast-forward merge — when it happens, how it creates a linear history, when to use --no-ff to force a merge commit, and the trade-offs between linear and non-linear history."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Fast-Forward Merge

A fast-forward merge is the simplest type of merge in Git. When there is a linear path from the tip of the current branch to the tip of the branch being merged, Git can simply "fast-forward" the current branch pointer to the tip of the other branch, without creating a new merge commit.


## When Does Fast-Forward Happen?

A fast-forward merge occurs when the **target branch has no new commits** since the feature branch was created. In other words, the feature branch is directly ahead of the target branch.

**Before merge:**

```
main:    A → B
feature:      B → C → D
```

**After `git merge feature` (fast-forward):**

```
main:    A → B → C → D
              ↑
         (HEAD, main, feature all point here now)
```

Git simply moved the `main` pointer from `B` to `D`. No new commit was created — the history is perfectly linear.


## Performing a Fast-Forward Merge

```bash
git switch main
git merge feature/login
```

If the conditions for fast-forward are met, Git will perform it automatically:

```
Updating abc1234..def5678
Fast-forward
 src/login.js | 45 +++++++++++++++++++++++++++++++++
 1 file changed, 45 insertions(+)
```


## Forcing a Merge Commit (--no-ff)

Sometimes you want to preserve the history that a feature was developed on a separate branch, even if a fast-forward is possible. Use `--no-ff` to force a merge commit:

```bash
git merge --no-ff feature/login -m "Merge feature/login: Add user authentication"
```

**Result with `--no-ff`:**

```
main:    A → B → M
               ↗
feature:   B → C → D
```

The merge commit `M` has two parents (`B` from main, `D` from feature), preserving the branch topology in history.

### When to Use --no-ff

- When you want to **preserve the branch structure** in history
- For **significant features** where knowing "this was a separate branch" is valuable
- When your team's workflow requires explicit merge points
- For **release branches** where each feature should be visible as a discrete unit of work


## Allowing Only Fast-Forward (--ff-only)

If you want to ensure a merge never creates a merge commit (and fail if it can't fast-forward):

```bash
git merge --ff-only feature/hotfix
```

This is useful when you're enforcing a linear history policy:

```
# If fast-forward is not possible:
fatal: Not possible to fast-forward, aborting.
```


## Fast-Forward vs. Merge Commit: The Trade-Off

| Aspect | Fast-Forward | Merge Commit (--no-ff) |
|--------|-------------|----------------------|
| History shape | Linear | Non-linear (shows branches) |
| Commits | No extra commit | Creates a merge commit |
| Branch context | Branch structure is lost | Branch structure preserved |
| Bisect-friendliness | Easier to bisect | More complex graph |
| Code review | Harder to see what was a "feature" | Easy to see merged features |

**Team recommendations:**
- Use fast-forward for **small hotfixes and quick changes**
- Use `--no-ff` for **feature branches** to maintain visibility into the development history
- Use `--squash` when you want the feature's history collapsed into a single commit on main


## Configuration

You can configure Git's default merge behavior globally:

```bash
# Always create merge commits (never fast-forward)
git config --global merge.ff false

# Only allow fast-forward merges
git config --global merge.ff only
```

Or per-repository:

```bash
# In .git/config or use --local flag
git config merge.ff false
```
