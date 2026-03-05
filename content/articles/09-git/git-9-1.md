---
title: "Remote Basics"
description: "Understand what remote repositories are in Git, how they enable collaboration, the relationship between local and remote branches, and how to work with multiple remotes."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Remote Basics

A **remote repository** is a version of your project that is hosted on the internet or a network, accessible to multiple people. Remotes are the backbone of collaborative Git workflows, allowing teams to share code, coordinate work, and maintain a central source of truth.


## What is a Remote Repository?

A remote is essentially a **copy of your local repository stored somewhere else** — typically on a service like GitHub, GitLab, Bitbucket, or your own server. Key points:

- Remotes have a **name** (typically `origin` for the primary remote) and a **URL**.
- You can have **multiple remotes** in a single local repository.
- Remote repositories are **independent** of your local work — they don't automatically update when you make local commits.
- You must explicitly **push** changes to remotes and **pull** changes from them.


## The 'origin' Convention

When you clone a repository, Git automatically creates a remote called `origin` that points to the URL you cloned from. This is just a convention, not a rule — you can rename it or add other remotes.

```bash
git remote -v
# origin  https://github.com/username/project.git (fetch)
# origin  https://github.com/username/project.git (push)
```


## Local vs. Remote Branches

Understanding the relationship between local and remote tracking branches is fundamental:

- **Local branch:** `main` — where you commit locally.
- **Remote tracking branch:** `origin/main` — a local snapshot of the remote's `main` branch.
- **Remote branch:** The actual `main` branch on the remote server.

```
Local:     main  →  [your commits]
           origin/main  →  [last fetched state of remote main]

Remote:    origin main  →  [commits on the remote server]
```

When you run `git fetch`, Git updates `origin/main` to reflect the remote's current state. Your local `main` is only updated when you run `git merge origin/main` or `git pull`.


## Setting Up a Remote

If you initialized a repository locally (not via clone), you need to add a remote:

```bash
git remote add origin https://github.com/username/project.git
```

Then push your first branch:

```bash
git push -u origin main
```

The `-u` flag sets up tracking so future `git push` and `git pull` commands know which remote branch to push/pull from.


## Working with Multiple Remotes

A single local repository can have multiple remotes:

```bash
# Add a second remote (e.g., for upstream of a fork)
git remote add upstream https://github.com/original-owner/project.git

# Fetch from the upstream remote
git fetch upstream

# List all remotes
git remote -v
```

Common scenarios with multiple remotes:
- **Fork + upstream:** `origin` = your fork, `upstream` = original repository
- **Multiple environments:** `origin` = GitHub, `production` = VPS server
- **Mirror:** `github` + `gitlab` remotes for multi-platform publishing


## Key Remote Operations

| Operation | Command | Description |
|-----------|---------|-------------|
| List remotes | `git remote -v` | Show all remote names and URLs |
| Add remote | `git remote add <name> <url>` | Add a new remote |
| Remove remote | `git remote remove <name>` | Remove a remote |
| Rename remote | `git remote rename <old> <new>` | Rename a remote |
| Download changes | `git fetch <remote>` | Update remote tracking branches |
| Download + merge | `git pull <remote> <branch>` | Fetch + merge into current branch |
| Upload changes | `git push <remote> <branch>` | Push local branches to remote |

In the next chapters, we'll explore each of these operations in detail.
