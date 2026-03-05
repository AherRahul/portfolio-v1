---
title: "git remote"
description: "Learn how to manage Git remote connections — add, list, rename, remove, inspect remotes, and change remote URLs for your repositories."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# git remote

The `git remote` command is used to manage the set of tracked remote repositories for your local repository. It allows you to add, list, rename, remove, and inspect remote connections.


## Listing Remotes

To see the remotes your repository is connected to:

```bash
git remote
```

Output:

```
origin
upstream
```

To see the URLs as well:

```bash
git remote -v
```

Output:

```
origin    https://github.com/you/project.git (fetch)
origin    https://github.com/you/project.git (push)
upstream  https://github.com/original/project.git (fetch)
upstream  https://github.com/original/project.git (push)
```


## Adding a Remote

```bash
git remote add <name> <url>
```

Examples:

```bash
# Add origin (primary remote)
git remote add origin https://github.com/yourusername/project.git

# Add upstream (for forks)
git remote add upstream https://github.com/original-owner/project.git

# Add with SSH URL
git remote add origin git@github.com:yourusername/project.git
```


## Removing a Remote

```bash
git remote remove <name>
# or
git remote rm <name>
```

Example:

```bash
git remote remove old-remote
```


## Renaming a Remote

```bash
git remote rename <old-name> <new-name>
```

Example:

```bash
git remote rename origin github
```


## Changing a Remote's URL

```bash
git remote set-url <name> <new-url>
```

Common scenario — switching from HTTPS to SSH:

```bash
# Check current URL
git remote get-url origin
# https://github.com/you/project.git

# Switch to SSH
git remote set-url origin git@github.com:you/project.git

# Verify
git remote get-url origin
# git@github.com:you/project.git
```

Or updating after a repository move:

```bash
git remote set-url origin https://github.com/new-org/project.git
```


## Inspecting a Remote

Get detailed info about a specific remote:

```bash
git remote show origin
```

Output:

```
* remote origin
  Fetch URL: https://github.com/you/project.git
  Push  URL: https://github.com/you/project.git
  HEAD branch: main
  Remote branches:
    feature/login  tracked
    main           tracked
  Local branch configured for 'git pull':
    main merges with remote main
  Local refs configured for 'git push':
    main  pushes to main (up to date)
```


## Pruning Stale Remote Tracking Branches

After remote branches are deleted, you may have stale local tracking references:

```bash
# View stale references
git remote show origin | grep 'stale'

# Prune them (remove stale remote tracking branches)
git remote prune origin

# Or do it during fetch
git fetch --prune origin

# Or configure auto-prune globally
git config --global fetch.prune true
```


## Common Remote Patterns

### Typical Solo Project Setup

```bash
git init
git remote add origin https://github.com/you/project.git
git push -u origin main
```

### Fork Workflow Setup

```bash
# After cloning your fork:
git remote add upstream https://github.com/original/project.git

# Sync with upstream:
git fetch upstream
git merge upstream/main
git push origin main
```

### Multiple Deployment Targets

```bash
git remote add production git@production-server.com:~/project.git
git remote add staging git@staging-server.com:~/project.git

# Deploy to staging
git push staging main

# Deploy to production
git push production main
```
