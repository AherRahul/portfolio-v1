---
title: "Creating Branches"
description: "Learn how to create branches in Git using git branch and git switch, create remote branches, and follow best practices for branch naming conventions."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Creating Branches

When you create a branch in Git, you are essentially creating a **new pointer to a specific commit**. This pointer allows you to diverge from the main line of development and work independently. The beauty of Git's branch model lies in its lightweight nature — branches are just simple references to commits, making them quick to create and switch between.

Creating a branch does **not** duplicate your project files. Instead, Git creates a new pointer in the repository that references the same commit as the current branch.


## Creating a Branch with git branch

The most straightforward way to create a branch is using the `git branch` command followed by the name of the new branch:

```bash
git branch <branch-name>
```

For example, to create a branch called `feature/login`:

```bash
git branch feature/login
```

After executing this command, Git creates the new branch but **does not switch to it**. You will still be on your current branch. To verify that the branch has been created, list all branches:

```bash
git branch
```

Output:

```
  feature/login
* main
```

The asterisk indicates your current branch.


## Creating and Switching in One Step

If you want to create a new branch and switch to it immediately, you can use the `-b` option with `git checkout`:

```bash
git checkout -b feature/login
```

This command creates the `feature/login` branch and checks it out in one step.

With Git version 2.23 and later, the `git switch` command provides a more intuitive way to achieve this:

```bash
git switch -c feature/login
```

The `-c` flag (short for `--create`) creates and switches to the new branch in a single command.

> **Note:** Always ensure you commit or stash any changes on your current branch before switching. If you have uncommitted changes, Git will prevent you from switching branches to avoid conflicts.


## Creating a Branch from a Specific Point

By default, a new branch is created from the current `HEAD`. But you can create a branch from a specific commit, tag, or another branch:

```bash
# Create a branch from a specific tag
git branch hotfix/security-patch v2.0.1

# Create a branch from a specific commit hash
git branch experimental abc1234

# Create a branch from another branch
git branch feature/payments main
```


## Remote Branch Creation

Creating branches is not limited to your local repository. You may also want to create branches in a remote repository when collaborating with a team.

To create a remote branch, first create the branch locally and then push it:

```bash
# Create locally
git switch -c feature/login

# Push to remote (creates remote branch)
git push origin feature/login
```

To set up upstream tracking (so `git push` and `git pull` work without extra arguments):

```bash
git push -u origin feature/login
```

The `-u` flag sets upstream tracking, making future pushes and pulls simpler. After this, team members can check out the branch with:

```bash
git switch feature/login   # Or git checkout feature/login
```


## Best Practices for Branch Naming

Use meaningful, descriptive names for branches that clearly convey their purpose:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New feature development | `feature/user-authentication` |
| `bugfix/` | Bug fixes for development | `bugfix/null-pointer-login` |
| `hotfix/` | Urgent production fixes | `hotfix/critical-security-patch` |
| `release/` | Release preparation | `release/v2.0.0` |
| `chore/` | Maintenance tasks | `chore/update-dependencies` |
| `refactor/` | Code refactoring | `refactor/api-layer` |

**Other naming conventions:**
- Use lowercase letters and hyphens (avoid spaces and special characters)
- Include a ticket/issue number if relevant: `feature/JIRA-123-user-auth`
- Keep names concise but descriptive

Following consistent naming conventions helps the entire team understand the purpose of each branch at a glance and makes branch management much easier.
