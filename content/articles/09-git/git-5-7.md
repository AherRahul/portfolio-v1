---
title: "git commit --amend"
description: "Learn how to use git commit --amend to modify the most recent commit — fix typos in commit messages, add forgotten files, update staged changes without creating a new commit."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---

# git commit --amend — Fixing the Last Commit

`git commit --amend` lets you modify the most recent commit. You can update the commit message, add forgotten files, or change the staged content — all without creating a new commit in the history.

## What --amend Does

`git commit --amend` replaces the most recent commit with a new one. It creates a brand-new commit object (different SHA-1), discarding the old commit. This is why **you should never amend commits that have already been pushed to a shared branch**.

## Fixing a Commit Message

```bash
# Opens your default editor to modify the message
git commit --amend
```

This lets you change the commit message. Save and close the editor to apply.

```bash
# Fix the message inline (without opening editor)
git commit --amend -m "Correct commit message here"
```

## Adding a Forgotten File

You committed but forgot to include a file:

```bash
# Make your fix
echo "extra content" >> forgotten-file.js

# Stage the forgotten file
git add forgotten-file.js

# Amend the commit to include it
git commit --amend --no-edit   # --no-edit keeps the original message
```

## Amending Staged Changes

You want to change the staged content of the last commit:

```bash
# Make the fix to the file
# Re-stage with the correction
git add src/auth.js

# Amend
git commit --amend --no-edit
```

## Viewing the Difference

```bash
# Before amend
git log --oneline -1
# abc1234 Add authenicaton (typo!)

# Amend
git commit --amend -m "Add authentication"

# After amend — new hash!
git log --oneline -1
# def5678 Add authentication
```

## Amending Author Information

```bash
# Fix the author of the last commit
git commit --amend --author="Correct Name <correct@email.com>"

# Fix using git config values
git config user.name "Correct Name"
git commit --amend --reset-author --no-edit
```

## Amending Commit Date

```bash
# Set current time as commit date
git commit --amend --date="$(date -R)" --no-edit

# Set a specific date
git commit --amend --date="2024-01-15T10:00:00" --no-edit
```

## ⚠️ When NOT to Amend

> **Never amend commits that have been pushed to a shared/public branch.**

Amending rewrites history (creates a new SHA-1). If others have already based work on the original commit, this causes divergence.

✅ **Safe to amend:**
- Local branches not yet pushed
- Your own feature branches where you're the only one working

❌ **Unsafe to amend:**
- `main`, `develop`, or any shared branch
- Commits you already pushed (unless you sole-own the branch)

If you must update a pushed commit on your own feature branch:

```bash
git commit --amend --no-edit
git push --force-with-lease origin feature/my-branch
```
