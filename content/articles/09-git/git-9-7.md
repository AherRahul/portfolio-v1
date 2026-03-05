---
title: "Remote Branches"
description: "Understand remote tracking branches in Git — how they differ from local branches, how to create local branches from remote ones, work with remote branches, and manage them effectively."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Remote Branches

Remote branches are references in your local repository that track the state of branches in remote repositories. Understanding how they work is key to effective collaboration.


## Types of Branches in Git

1. **Local branches** (`main`, `feature/login`): Branches you create and work on locally.
2. **Remote tracking branches** (`origin/main`, `origin/feature/login`): Local copies that track the state of remote branches.
3. **Remote branches**: The actual branches that exist on the remote server.


## Remote Tracking Branches

Remote tracking branches are the "snapshots" of remote branches at the time you last communicated with the remote (via `git fetch`, `git pull`, or `git push`).

```bash
# List all remote tracking branches
git branch -r
```

Output:

```
  origin/HEAD -> origin/main
  origin/feature/login
  origin/feature/payment
  origin/main
```

These are **read-only** — you cannot commit directly to them. They update automatically when you fetch.

```bash
# List all branches including remote tracking ones
git branch -a
```


## Viewing Remote Tracking Branch Info

```bash
# See when origin/main was last updated and what it points to
git log origin/main --oneline -5

# See differences between local main and remote tracking main
git diff main origin/main

# See commits on remote but not local
git log main..origin/main --oneline
```


## Creating a Local Branch from a Remote Branch

When a colleague creates a remote branch and you want to work on it locally:

```bash
# Fetch first to update remote tracking branches
git fetch origin

# Create local branch tracking the remote
git switch -c feature/login origin/feature/login
# or: git checkout -b feature/login origin/feature/login
```

This creates a local `feature/login` branch that tracks `origin/feature/login`.

**Shortcut (if branch name matches):**

```bash
git switch feature/login
# Git auto-creates the local branch tracking origin/feature/login
```


## Diverged Local and Remote Branches

After a force-push or rebase, a local and remote tracking branch can diverge:

```bash
git status
# On branch main
# Your branch and 'origin/main' have diverged,
# and have 1 and 3 different commits each, respectively.
```

To resolve:

```bash
# If the remote is correct (someone rebased):
git reset --hard origin/main  # Discard local and match remote

# If local is correct (you rebased and force-pushed):
git push --force-with-lease origin main
```


## Pruning Stale Remote Tracking Branches

When remote branches are deleted, your local tracking references become stale:

```bash
# See stale branches
git remote show origin | grep 'stale'

# Remove stale tracking references
git fetch --prune origin
git remote prune origin  # Alternative

# Always prune automatically
git config --global fetch.prune true
```


## Pushing a Local Branch to Remote

```bash
# Push local feature branch to remote (creates the remote branch)
git push -u origin feature/my-feature
```


## Deleting Remote Branches

```bash
# Delete a remote branch
git push origin --delete feature/old-branch

# Then prune local tracking reference
git fetch --prune origin
```

After deleting, collaborators should run `git fetch --prune` to clean up their stale tracking references.


## Summary

```bash
git branch -r              # List remote tracking branches
git branch -a              # List all branches 
git fetch origin           # Update all remote tracking branches
git switch -c local origin/remote  # Create local branch from remote
git push -u origin branch  # Push local branch and set tracking
git push origin --delete b # Delete remote branch
git fetch --prune          # Remove stale tracking references
```
