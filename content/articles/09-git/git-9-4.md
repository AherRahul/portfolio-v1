---
title: "git pull"
description: "Learn how git pull fetches and merges remote changes into your local branch, the different pull strategies (merge vs rebase), and best practices for keeping your local branches up to date."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# git pull

`git pull` is a convenience command that combines `git fetch` and `git merge` into a single operation. It fetches changes from the remote repository and immediately integrates them into your current local branch.


## What git pull Does

```bash
git pull origin main
# Equivalent to:
git fetch origin
git merge origin/main
```

1. **Downloads** the latest commits from the remote branch.
2. **Merges** those commits into your current local branch.


## Basic Usage

```bash
# Pull from the default tracking remote/branch
git pull

# Pull from a specific remote and branch
git pull origin main

# Pull from upstream (if you have multiple remotes)
git pull upstream main
```


## Pull Strategies

### Default: Merge

By default, `git pull` creates a merge commit if your local branch and the remote branch have diverged:

```
Before:
local main:  A → B → C
remote main: A → B → D

After git pull:
local main:  A → B → C → M (merge commit, parents C and D)
                      ↗
                      D
```

### Rebase Strategy

Use `--rebase` to replay your local commits on top of the remote's commits (creating a linear history):

```bash
git pull --rebase origin main
```

```
Before:
local main:  A → B → C
remote main: A → B → D

After git pull --rebase:
local main:  A → B → D → C'  (C replayed on top of D)
```

**Setting rebase as the default:**

```bash
git config --global pull.rebase true
```

### Fast-Forward Only

Only allow fast-forward pulls (fail if a merge or rebase would be needed):

```bash
git pull --ff-only origin main
```


## Handling Pull Conflicts

When both you and a remote collaborator have committed to the same branch, pulls can produce conflicts:

```bash
git pull origin main
# Auto-merging src/app.js
# CONFLICT (content): Merge conflict in src/app.js
# Automatic merge failed; fix conflicts and then commit the result.
```

Resolution process:

```bash
# 1. Fix the conflict markers in src/app.js
# 2. Stage the resolved file
git add src/app.js

# 3. Complete the merge
git commit

# Or to abort the pull
git merge --abort
```


## Before Every Pull: Check Your Status

Always check your working directory before pulling:

```bash
git status
```

If you have uncommitted changes, pull may fail or create messy conflicts. Options:

```bash
# Option 1: Commit first
git add .
git commit -m "Save current work"
git pull

# Option 2: Stash first
git stash
git pull
git stash pop  # Re-apply your changes

# Option 3: Auto-stash with rebase pull
git pull --rebase --autostash
```


## Best Practices

1. **Pull before pushing:** Always pull latest changes before pushing to reduce conflicts.

2. **Consider pull --rebase:** Using `--rebase` creates a cleaner linear history without merge commits from upstream pulls.

3. **Never pull into a finished feature branch:** If your feature is complete and ready for PR, don't pull into it — rebase instead to keep history clean.

4. **Use `git fetch` first** when you're unsure what changed remotely — review, then merge manually.

```bash
# Safe, reviewed pull workflow:
git fetch origin
git log --oneline origin/main ^main  # See what will be merged
git merge origin/main                # Merge when satisfied
```


## git pull Summary

```bash
git pull                        # Pull from tracked upstream
git pull origin main            # Pull specific remote/branch
git pull --rebase               # Pull and rebase instead of merge
git pull --ff-only              # Only allow fast-forward
git pull --no-commit            # Don't auto-commit the merge
git pull --autostash            # Auto-stash local changes before pulling
```
