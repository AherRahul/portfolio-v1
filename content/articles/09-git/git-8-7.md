---
title: "Rebase --onto"
description: "Learn how to use git rebase --onto to transplant a range of commits to an entirely different base — perfect for moving commits between branches or extracting a subset of commits."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Rebase --onto

The `git rebase --onto` command is an advanced form of rebasing that gives you precise control over which commits to move and where to move them. While a regular rebase moves all commits from one branch onto another, `--onto` lets you specify exactly which subset of commits to transplant and to which destination.


## Syntax

```bash
git rebase --onto <newbase> <upstream> [<branch>]
```

- `<newbase>`: Where you want the commits to end up
- `<upstream>`: The commit to start from (commits AFTER this point are moved)
- `<branch>`: The branch to move (defaults to current HEAD)

The commits that will be moved are those **in `<branch>` but NOT in `<upstream>`**.


## Use Case 1: Removing Commits from a Branch

**Scenario:** You accidentally included some commits from `main` in your feature branch and want to remove them.

**Before:**

```
main:    A → B → C
feature:     B → D → E → F
                  ↑
         (D was accidentally included)
```

You want feature to only have E and F, replayed on top of C:

```bash
git rebase --onto main feature-without-D feature
```

Meaning: "Move commits from `feature` that come after `feature-without-D`, and put them on top of `main`."


## Use Case 2: Moving a Feature from One Branch to Another

**Scenario:** You started a feature branch off `feature/auth` but realize it should be based on `main` instead.

**Before:**

```
main:          A → B
feature/auth:      B → C → D
my-feature:              D → E → F
```

You want to move `E` and `F` (your feature commits) directly onto `main`:

```bash
git rebase --onto main feature/auth my-feature
```

**After:**

```
main:          A → B
feature/auth:      B → C → D
my-feature:            B → E' → F'
```

The commits E and F have been moved from on top of `D` to on top of `B` (main's tip).


## Use Case 3: Extracting a Range of Commits

**Scenario:** You have commits A → B → C → D → E on a branch, and you only want D and E on a new branch based on main.

```bash
# Create the new branch starting from E
git rebase --onto main <commit-before-D> E
```

Or with specific commit hashes:

```bash
git rebase --onto main abc1234 def5678
# (abc1234 = commit before D, def5678 = commit E)
```


## Practical Example

**Starting state:** A feature branch based on an old commit of `main`:

```bash
# See current state
git log --oneline --graph --all

# output:
# * f3d2e1 (feature/search) Add search results UI
# * a1b2c3 Add search input component
# * 9z8y7x (old-main-commit) Outdated main state
# * ...main... B
# * ...main... A
```

Move the feature's two commits onto current main:

```bash
git rebase --onto main 9z8y7x feature/search
```


## Key Points

1. **Nothing is deleted from your original history** — the original commits remain in reflog.
2. **New commits are created** with new hashes (just like regular rebase).
3. **Conflicts can still occur** — resolve them the same way as with regular rebase.
4. **The upstream argument is exclusive** — the commit at `<upstream>` itself is NOT included in the move.

`git rebase --onto` is a precision tool for surgically repositioning commits in your history.
