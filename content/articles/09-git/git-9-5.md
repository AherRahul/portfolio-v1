---
title: "git push"
description: "Learn how to push your local commits to a remote repository using git push, set up branch tracking, handle push rejections, force-push safely, and follow best practices for sharing your work."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# git push

`git push` is the command that uploads your local commits to a remote repository, making them available to collaborators. It's the primary way you share your work with the world.


## Basic Usage

```bash
# Push current branch to its tracked remote branch
git push

# Push to a specific remote and branch
git push origin main

# Push and set upstream tracking
git push -u origin feature/login

# Push all branches
git push --all origin
```


## Setting Up Upstream Tracking

When pushing a new branch for the first time, use `-u` (or `--set-upstream`) to set up tracking:

```bash
git push -u origin feature/login
```

After this, `git push` and `git pull` on this branch will automatically know which remote/branch to use:

```bash
# Future pushes (no need to specify remote/branch)
git push
```


## Push Options

```bash
# Push all local tags to remote
git push --tags

# Push a single tag
git push origin v1.0.0

# Delete a branch from remote
git push origin --delete feature/old-branch

# Delete a tag from remote  
git push origin --delete v1.0.0-beta

# Dry run (show what would be pushed without actually pushing)
git push --dry-run origin main
```


## Handling Push Rejections

The most common push rejection occurs when the remote has changes you don't have locally:

```
! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'origin'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally.
```

**Solution:** Pull first, then push:

```bash
git pull origin main   # or git pull --rebase origin main
git push origin main
```


## Force Pushing

Sometimes you need to override the remote branch with your local version (e.g., after a rebase):

```bash
# Force push (DANGEROUS - overwrites remote history)
git push --force origin feature/login

# Safer force push - fails if someone else pushed in the meantime
git push --force-with-lease origin feature/login
```

> **Always prefer `--force-with-lease` over `--force`!** The lease check protects against overwriting others' work.

### When Force Push is Appropriate

✅ **OK to force push:**
- Your own feature branch that no one else is working on
- After rebasing or amending commits on a personal branch

❌ **NEVER force push:**
- `main`, `develop`, or any shared/protected branch
- Any branch that others have based their work on


## Push and Pull Access Control

Remote repositories (especially on GitHub/GitLab) can have **branch protection rules**:
- Require pull requests before merging to `main`
- Require approvals before merging
- Prevent force pushing

If you get a permissions error, check the repository's branch protection settings.


## Pushing Tags

Tags represent specific versions and need to be explicitly pushed:

```bash
# push a single tag
git push origin v1.0.0

# Push all local tags not on remote
git push --tags origin

# Push a tag with specific configuration
git push -u origin refs/tags/v1.0.0
```


## Viewing Push Status

After pushing:

```bash
git log --oneline origin/main..main   # Commits in local but not remote
git status                            # Shows "ahead of origin/main by N commits"
```


## Practical Workflow

```bash
# 1. Work on feature
git switch -c feature/payment
# ... make commits ...

# 2. Push new branch to remote
git push -u origin feature/payment

# 3. Continue pushing updates
git push   # Simple push since -u was used

# 4. After PR merge, delete the branch
git push origin --delete feature/payment
git switch main
git pull origin main  # Update local main
git branch -d feature/payment  # Delete local branch
```
