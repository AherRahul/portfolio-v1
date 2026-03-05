---
title: "git checkout (branches)"
description: "Learn how to use git checkout to switch between branches, create new branches, and understand when to use git checkout versus the newer git switch command."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# git checkout (Branch Operations)

The `git checkout` command is a versatile and historically important command in Git. While its focus has shifted with the introduction of `git switch` and `git restore` (in Git 2.23), understanding `git checkout` is important since it's still widely used and you'll see it extensively in documentation and existing workflows.


## Switching Branches with git checkout

The most common use of `git checkout` for branch operations is switching between branches:

```bash
git checkout <branch-name>
```

For example:

```bash
git checkout main           # Switch to main branch
git checkout feature-login  # Switch to feature-login branch
```

When you run this command, Git:
1. Updates `HEAD` to point to the specified branch.
2. Updates the working directory and index to match the state of that branch.
3. Carries over uncommitted changes if they don't conflict.


## Creating a Branch and Switching

The classic way to create a new branch and switch to it simultaneously:

```bash
git checkout -b <new-branch-name>
```

Example:

```bash
git checkout -b feature/user-authentication
```

This is equivalent to:

```bash
git branch feature/user-authentication
git checkout feature/user-authentication
```

### Creating from a Specific Point

```bash
# Create from a specific commit
git checkout -b feature/fix abc1234

# Create from a remote branch
git checkout -b feature/login origin/feature/login

# Create from a tag
git checkout -b hotfix v2.0.1
```


## Handling Uncommitted Changes

When switching branches with `git checkout`:

- If your changes don't conflict with the target branch, Git carries them over automatically.
- If there are conflicts, Git will refuse to switch and tell you to commit or stash first.

```bash
# Option 1: Commit first
git add .
git commit -m "WIP: Work in progress"
git checkout other-branch

# Option 2: Stash changes
git stash
git checkout other-branch
git stash pop  # Apply stashed changes later

# Option 3: Force switch (WARNING: discards changes)
git checkout -f other-branch
```


## git checkout vs git switch

With Git 2.23+, it's recommended to use `git switch` for branch operations instead:

| Action | Old way (git checkout) | New way (git switch) |
|--------|----------------------|---------------------|
| Switch to branch | `git checkout main` | `git switch main` |
| Create and switch | `git checkout -b new-branch` | `git switch -c new-branch` |
| Switch to previous | `git checkout -` | `git switch -` |
| Restore a file | `git checkout -- file.js` | `git restore file.js` |
| Checkout a commit | `git checkout abc1234` | `git switch --detach abc1234` |

The reasons to prefer `git switch` for branch operations:
- More explicit and focused on branches only
- Clearer error messages
- Safer behavior with uncommitted changes
- `git checkout` does too many things, which can be confusing

That said, `git checkout` remains available and works perfectly — you'll often see it in older guides and scripts.


## Practical Examples

```bash
# Start working on a new feature
git checkout -b feature/payment-integration

# Work on the feature...
git add .
git commit -m "Add payment gateway integration"

# Switch back to main for a hotfix
git checkout main
git checkout -b hotfix/security-patch

# Apply the hotfix
git add .
git commit -m "Fix XSS vulnerability in user input"

# Merge the hotfix
git checkout main
git merge hotfix/security-patch

# Delete the hotfix branch
git branch -d hotfix/security-patch
```

## Conclusion

`git checkout` is a powerful but multi-purpose command. For branch switching, use `git switch` if you're on Git 2.23+. For newer Git projects, reserve `git checkout` for its historical context or when working in environments that require it.
