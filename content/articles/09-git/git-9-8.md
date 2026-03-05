---
title: "git remote Advanced"
description: "Deep dive into git remote — multiple remotes, pushing to multiple remotes simultaneously, remote rename and URL management, remote tags, and working with upstream in forks."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---

# git remote — Advanced Usage

Beyond basic `git remote add` and `git push`, the `git remote` command supports sophisticated configurations for managing multiple remotes, maintaining forks, and syncing across environments.

## Multiple Remotes

A repository can have any number of remotes:

```bash
# Typical fork setup
git remote add origin  https://github.com/YOU/project.git      # Your fork
git remote add upstream https://github.com/ORIGINAL/project.git # Original

# Push to your fork, pull from upstream
git fetch upstream
git merge upstream/main
git push origin main

# Deploy remote — push to production server
git remote add production ssh://deploy@prod.server.com/var/repo.git
git push production main   # Triggers deployment
```

## Remote with Different Fetch/Push URLs

Configure different URLs for fetch and push:

```bash
# Set a different URL for pushing (e.g., push to SSH, fetch from HTTPS)
git remote set-url --push origin git@github.com:you/project.git
git remote set-url origin https://github.com/you/project.git

# Verify
git remote -v
# origin  https://github.com/you/project.git (fetch)
# origin  git@github.com:you/project.git (push)
```

## Push to Multiple Remotes

Push to two remotes at once by adding multiple push URLs:

```bash
# Add a second push URL to origin (still fetches from first)
git remote set-url --add --push origin https://github.com/mirror/project.git

# Now 'git push' sends to BOTH URLs
git remote -v
# origin  https://github.com/you/project.git (fetch)
# origin  https://github.com/you/project.git (push)
# origin  https://github.com/mirror/project.git (push)

git push origin main  # Pushes to both!
```

## Syncing a Fork with Upstream

Standard workflow for maintaining a fork:

```bash
# One-time setup
git remote add upstream https://github.com/original/project.git

# Regular sync workflow
git fetch upstream               # Download upstream changes
git switch main
git merge upstream/main          # Merge into local main
# or: git rebase upstream/main   # Rebase instead

git push origin main             # Update YOUR fork

# Keep feature branches in sync
git switch feature/my-feature
git rebase upstream/main         # Rebase on latest upstream
```

## Remote Branch Operations

```bash
# List all remote branches
git branch -r
git branch -r --sort=-committerdate  # Most recent first

# Track a specific remote branch
git switch --track origin/feature-branch
# Equivalent:
git checkout -b feature-branch origin/feature-branch

# Delete a remote branch
git push origin --delete old-branch

# Prune stale remote tracking references
git fetch --prune
git fetch origin --prune

# Auto-prune on every fetch
git config --global fetch.prune true
```

## Remote Info and Inspection

```bash
# Show remote URLs and tracking branches
git remote -v

# Detailed remote info (fetch/push URLs, tracked branches)
git remote show origin
# * remote origin
#   Fetch URL: https://github.com/you/project.git
#   Push  URL: https://github.com/you/project.git
#   HEAD branch: main
#   Remote branches:
#     main               tracked
#     feature/dashboard  tracked
#   Local branch configured for 'git pull':
#     main merges with remote main
#   Local ref configured for 'git push':
#     main pushes to main (up to date)

# See fetch refspec
git config --get-all remote.origin.fetch
# +refs/heads/*:refs/remotes/origin/*
```

## Custom Fetch Refspecs

Fetch only specific branches:

```bash
# Fetch only 'main' from origin
git fetch origin main

# Fetch a PR branch from GitHub
git fetch origin pull/234/head:pr-234
# Then review it
git switch pr-234
```

In `.git/config`:
```ini
[remote "origin"]
    url = https://github.com/you/project.git
    fetch = +refs/heads/*:refs/remotes/origin/*
    # Add this to also fetch PR refs:
    fetch = +refs/pull/*/head:refs/remotes/origin/pr/*
```
