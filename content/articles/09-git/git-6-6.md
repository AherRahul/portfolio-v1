---
title: "Renaming Branches"
description: "Learn how to rename local and remote Git branches, update your remote tracking references after renaming, and follow best practices for branch naming."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Renaming Branches

As projects evolve, branch names sometimes need to change — whether to follow naming conventions, clarify purpose, or fix a typo. Git makes renaming branches straightforward.


## Renaming a Local Branch

To rename the **current branch** you're on:

```bash
git branch -m <new-name>
```

Example (if you're on `feature-login`):

```bash
git branch -m feature/login
```

To rename a branch **while on a different branch**:

```bash
git branch -m <old-name> <new-name>
```

Example:

```bash
git branch -m old-feature feature/new-name
```


## Renaming the main Branch

A common scenario today is renaming `master` to `main`:

```bash
# Rename locally
git branch -m master main

# Push the renamed branch to remote
git push origin main

# Set the remote HEAD
git remote set-head origin main

# Delete the old remote branch
git push origin --delete master

# Update your tracking
git branch -u origin/main main
```


## Renaming a Remote Branch

Git doesn't have a direct command to rename a remote branch. Instead, the process involves:

1. Rename the local branch
2. Push the renamed branch to the remote
3. Delete the old remote branch
4. Update the tracking reference

```bash
# Step 1: Rename locally
git branch -m old-branch-name new-branch-name

# Step 2: Push the new name to remote
git push origin new-branch-name

# Step 3: Delete the old branch on remote
git push origin --delete old-branch-name

# Step 4: Reset upstream tracking
git branch --unset-upstream
git branch -u origin/new-branch-name
```


## Notifying Teammates

When you rename a branch that others are using, notify your team so they can update their local references:

Teammates need to run:

```bash
# Fetch all remotes to see the new branch
git fetch --all

# Update their local branch to track the new remote
git checkout old-branch-name
git branch -m old-branch-name new-branch-name
git branch -u origin/new-branch-name
```


## Best Practices

- **Follow a consistent naming convention** for your team. Common convention: `feature/`, `bugfix/`, `hotfix/`, `release/`.

- **Communicate branch renames** to your team before doing them on shared branches. Renaming without notice can disrupt others' workflows.

- **Rename early** — if you realize the name is wrong, rename it before others pull and start tracking the branch.

- **Update any CI/CD pipelines** that reference the old branch name — GitHub Actions, Jenkins, GitLab CI configs may use branch-specific rules.
