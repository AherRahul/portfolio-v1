---
title: "Undoing Changes Overview"
description: "Understand Git's three primary states (working directory, staging area, repository) and learn the various strategies available for undoing changes in each state."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Undoing Changes Overview

In the fast-paced world of software development, mistakes happen. Whether it's a misplaced line of code, an unintended commit, or a misconfigured branch, the ability to **undo changes** is critical. Git provides a robust toolkit for reversing mistakes, allowing developers to navigate the treacherous waters of version control with confidence.

Understanding how Git allows you to revert changes empowers you to experiment and make bold decisions without the fear of making irreversible errors.


## Understanding Git's Model

Before diving into the specifics of undoing changes, it is essential to grasp Git's underlying model. Git operates using **three primary states**:

- **Working Directory:** This is where you make changes to your files. It reflects the current state of your project.
- **Staging Area:** This is an intermediate area where changes are prepared before being finalized in a commit.
- **Repository:** This is the history of your project, consisting of commits that are tracked and stored.

When you make changes in your working directory, they reside there until you stage them. Once staged, they can be committed to the repository. Understanding these states helps clarify how different Git commands affect your project.

```
Working Directory → Staging Area → Repository
(git add)           (git commit)
```

The "undo" tools in Git map to these states:

| Where the change is | How to undo |
|--------------------|------------|
| Working directory (unstaged) | `git restore <file>` |
| Staging area (staged, not committed) | `git restore --staged <file>` |
| Last commit (not pushed) | `git reset HEAD~1` or `git commit --amend` |
| Pushed commit | `git revert <commit>` |


## Common Scenarios for Undoing Changes

### Mistaken Edits

You've edited a file locally and want to discard the changes:

```bash
git restore example.txt
```

This restores the file to its last committed state.

### Unintended Commits

You've committed something you shouldn't have:

```bash
# Undo the last commit but keep the changes staged
git reset --soft HEAD~1

# Undo the last commit and unstage the changes (but keep them in working dir)
git reset HEAD~1

# Undo the last commit and DISCARD the changes
git reset --hard HEAD~1
```

### Multi-File Changes

You've modified many files and want to discard all changes:

```bash
git restore .        # Restore all changed files in working directory
git restore --staged .  # Unstage everything
```


## The Importance of Staging Area

The staging area is a powerful checkpoint in the Git workflow. It allows you to:

### Staged vs. Unstaged Changes

Git distinguishes between changes that are staged and those that are not. Staged changes are ready to be committed, while unstaged changes are still in the working directory.

```bash
git status          # See both staged and unstaged changes
git diff            # See unstaged changes
git diff --cached   # See staged changes
```

### Partial Staging

One of the key benefits of the staging area is the ability to stage only part of a file's changes:

```bash
git add -p file.js   # Interactively select which changes to stage
```

This allows you to create clean, focused commits even when a file has multiple, unrelated changes.


## The Role of Commits

Commits are the permanent record of your project's history. Understanding how to safely manipulate them is crucial.

### Reverting Commits

`git revert` creates a new commit that undoes a specific commit, without rewriting history:

```bash
git revert <commit-hash>   # Safe for shared branches
```

### Amending Commits

`git commit --amend` allows you to modify the most recent commit (before it's pushed):

```bash
git add forgotten-file.js
git commit --amend   # Opens editor to optionally update the message
```


## Recovery from Mistakes

### Viewing Commit History

Before undoing anything, understand where you are:

```bash
git log --oneline -10   # See last 10 commits
```

### Using the Reflog

Even after "losing" commits with `git reset --hard`, Git maintains a reflog — a log of where `HEAD` has been:

```bash
git reflog    # See the history of HEAD movements
```

This gives you a recovery mechanism even after destructive operations.


## Summary: Choosing the Right Tool

| Situation | Command | Safety |
|-----------|---------|--------|
| Discard working dir changes | `git restore <file>` | Safe (unstaged changes lost) |
| Unstage changes | `git restore --staged <file>` | Safe |
| Undo last commit (keep changes) | `git reset --soft HEAD~1` | Safe for local only |
| Undo last commit (discard) | `git reset --hard HEAD~1` | Destructive (local only) |
| Undo a pushed commit | `git revert <hash>` | Safe for all |
| Fix last commit message | `git commit --amend` | Safe for local only |
| Recover from reflog | `git reset --hard HEAD@{N}` | Safe (if reflog still has entry) |

The key principle: always prefer non-destructive operations (`git revert`, `git restore`) for shared branches, and use the more powerful operations (`git reset --hard`) only for local, unpushed changes.
