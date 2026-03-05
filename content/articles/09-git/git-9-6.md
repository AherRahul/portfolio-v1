---
title: "Upstream Tracking"
description: "Understand Git upstream tracking — what tracking branches are, how to set them up, view tracking information, and why upstream tracking makes push and pull operations simpler."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Upstream Tracking

Upstream tracking in Git is the relationship between a local branch and its corresponding remote branch. When tracking is set up, Git knows where to push to and pull from by default, making daily commands much simpler.


## What is Upstream Tracking?

An **upstream** (or tracking) branch is the remote branch that a local branch is linked to. For example, your local `main` branch typically tracks `origin/main`.

When you run `git status` with a tracking relationship set up:

```
On branch main
Your branch is ahead of 'origin/main' by 2 commits.
  (use "git push" to publish your local commits)
```

Git knows to compare your local `main` against `origin/main` and tell you how many commits ahead or behind you are.


## Setting Up Upstream Tracking

### Method 1: Push with -u

The most common way — set tracking when pushing a branch for the first time:

```bash
git push -u origin feature/login
# -u is short for --set-upstream
```

After this, `git push` and `git pull` on `feature/login` will automatically use `origin/feature/login`.

### Method 2: Use git branch --set-upstream-to

Set tracking for an existing local branch:

```bash
git branch --set-upstream-to=origin/main main
# or: git branch -u origin/main main
```

### Method 3: Clone automatically sets up tracking

When you clone a repository, Git automatically sets up tracking between your local `main` and `origin/main`.

### Method 4: git checkout creates tracking automatically

When you check out a remote branch that doesn't have a local counterpart:

```bash
git switch feature/login
# If origin/feature/login exists, Git creates local branch with tracking
```


## Viewing Tracking Information

```bash
# Shows branch tracking information
git branch -vv

# Output:
#   feature-login  abc1234 [origin/feature-login: ahead 1, behind 2] Add login
# * main           def5678 [origin/main] Add homepage
```

The bracket notation `[origin/main]` shows the tracked upstream. `ahead N` and `behind N` show how many commits your local branch is ahead/behind the remote.

```bash
# Show only tracking information for current branch
git rev-parse --abbrev-ref --symbolic-full-name @{upstream}
# Output: origin/main

# Verbose remote info
git remote show origin
```


## Removing Upstream Tracking

```bash
git branch --unset-upstream
# or
git branch --unset-upstream <branch-name>
```


## How Tracking Makes Commands Simpler

**Without tracking:**

```bash
git push origin feature/login   # Must always specify remote/branch
git pull origin feature/login   # Must always specify remote/branch
```

**With tracking:**

```bash
git push   # Knows to push to origin/feature/login
git pull   # Knows to pull from origin/feature/login
```


## Tracking Summary

| Operation | With Tracking | Without Tracking |
|-----------|--------------|-----------------|
| Push | `git push` | `git push origin branch` |
| Pull | `git pull` | `git pull origin branch` |
| Status info | Shows ahead/behind | No comparison shown |
| Set up | `git push -u origin branch` | N/A |
