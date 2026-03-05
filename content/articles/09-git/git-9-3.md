---
title: "git fetch"
description: "Learn how git fetch downloads changes from a remote repository without merging them, updates remote tracking branches, and how it differs from git pull."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# git fetch

`git fetch` is the command that downloads changes from a remote repository and updates your **remote tracking branches** (like `origin/main`). Importantly, it does **not** modify your local working branches — it's a safe, non-destructive way to see what's happening on the remote.


## What git fetch Does

When you run `git fetch`:
1. Git connects to the remote repository.
2. Downloads all changes (new commits, branches, tags) that you don't have locally.
3. Updates the **remote tracking branches** (e.g., `origin/main`) in your local repository.
4. **Does NOT touch your local branches** — your `main` branch stays exactly as it was.

Think of `git fetch` as "update my local picture of what's on the remote" without actually applying those changes to your work.


## Basic Usage

```bash
# Fetch from the default remote (origin)
git fetch

# Fetch from a specific remote
git fetch origin

# Fetch a specific branch from origin
git fetch origin main

# Fetch from all remotes
git fetch --all

# Fetch and remove stale remote tracking branches
git fetch --prune origin
```


## Viewing Fetched Changes

After fetching, see what changed:

```bash
# See commits in origin/main that aren't in your local main
git log main..origin/main --oneline

# See the diff between your local main and origin/main
git diff main origin/main

# Browse the remote branch's files
git checkout origin/main  # Detached HEAD — view only
```


## Fetching and Reviewing Before Merging

A common workflow for reviewing remote changes before applying them:

```bash
# 1. Fetch remote changes
git fetch origin

# 2. Review what changed
git log --oneline origin/main ^main  # Commits in origin/main not in local main
git diff main origin/main            # Actual code differences

# 3. Merge when ready (or rebase)
git merge origin/main
# or
git rebase origin/main
```

This is more controlled than `git pull`, which does the fetch + merge in one step.


## git fetch vs git pull

| Aspect | `git fetch` | `git pull` |
|--------|------------|------------|
| Downloads remote changes | ✅ Yes | ✅ Yes |
| Updates remote tracking branches | ✅ Yes | ✅ Yes |
| Merges into local branch | ❌ No | ✅ Yes (automatically) |
| Risk level | 🟢 Safe | 🟡 Can create merge commits |
| Recommended for | Reviewing before merging | Quick sync on stable branches |

**Recommendation:** Use `git fetch` when you want control over when and how to apply changes. Use `git pull` for routine updates on personal branches.


## Fetching New Branches

When a remote branch is created that your local repo doesn't know about:

```bash
# After fetch, you can see the new remote branch
git fetch origin
git branch -r   # Shows origin/new-feature

# Create a local branch that tracks it
git switch -c new-feature origin/new-feature
# or
git checkout -b new-feature origin/new-feature
```


## Pruning Deleted Remote Branches

If a collaborator deleted a remote branch, `git fetch` doesn't automatically remove the stale tracking reference. Use `--prune`:

```bash
git fetch --prune origin

# Or configure git to always prune on fetch
git config --global fetch.prune true
```


## Practical Use Cases

```bash
# Before starting your day, fetch to see what changed
git fetch --all

# Check if anyone pushed work while you were away
git log --all --oneline --graph --since="1 day ago"

# Fetch a specific PR branch from GitHub
git fetch origin pull/123/head:pr-123
```
