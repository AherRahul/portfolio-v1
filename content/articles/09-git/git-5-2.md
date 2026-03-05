---
title: "git reset"
description: "Understand git reset's three modes (soft, mixed, hard), how to use it to undo commits, unstage changes, and recover from mistakes using git reflog."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# git reset

`git reset` is a command that can alter the state of your working directory, the staging area, and the commit history itself. Understanding how `git reset` operates will not only help you manage your code more effectively but will also empower you to navigate complex scenarios with confidence.


## What is git reset?

At its core, `git reset` is a way to **move the current branch pointer to a different commit**. Unlike `git checkout` (which allows navigation between branches and commits without changing the current branch), `git reset` alters the commit history of your branch.

When you invoke `git reset`, you have the ability to modify three key areas:

- **HEAD:** The current commit your branch points to.
- **Staging Area:** The index where changes are prepared for the next commit.
- **Working Directory:** The files you currently have in your project.

By understanding this command, you'll learn how to easily undo mistakes, whether they're accidental commits or unwanted changes.


## The Anatomy of git reset

To fully grasp how `git reset` works, consider the following scenario where you have this commit history:

```
A → B → C → D (HEAD)
```

If you run `git reset --hard B`, you move `HEAD` back to commit `B`. The commit graph then looks like this:

```
A → B (HEAD)
```

Commits `C` and `D` are no longer referenced by the master branch. Depending on the reset mode you choose, this operation can have different effects on your staging area and working directory.


## Understanding Reset Modes

The behavior of `git reset` is strongly influenced by the **mode** you choose: `--soft`, `--mixed`, or `--hard`.

### Soft Reset (`--soft`)

```bash
git reset --soft <commit>
```

- Moves `HEAD` to the specified commit.
- **Leaves** the staging area and working directory **unchanged**.
- All changes from the "undone" commits are now staged, ready to be re-committed.

**Use case:** You committed too early and want to redo the commit with different changes:

```bash
git reset --soft HEAD~1
# Now you can re-stage and re-commit with the right changes
git commit -m "Better commit message"
```

### Mixed Reset (`--mixed`) — Default

```bash
git reset <commit>
# or
git reset --mixed <commit>
```

- Moves `HEAD` to the specified commit.
- **Resets the staging area** to match the new `HEAD`.
- **Leaves the working directory unchanged** — your files still have the changes, but they are unstaged.

**Use case:** You want to unstage changes while keeping them in your working directory:

```bash
git reset HEAD~1
# Changes are still in working directory but no longer staged
git add specific-file.js
git commit -m "More focused commit"
```

### Hard Reset (`--hard`)

```bash
git reset --hard <commit>
```

- Moves `HEAD` to the specified commit.
- **Resets the staging area** to match the new `HEAD`.
- **Resets the working directory** to match the new `HEAD` — all changes are discarded.

> **Warning:** This is a destructive operation. Any uncommitted changes in your working directory will be permanently lost.

**Use case:** You want to completely abandon recent commits and start fresh:

```bash
git reset --hard HEAD~3  # Go back 3 commits, discard all recent changes
```


## Practical Use Cases

### Uncommitting Changes

If you accidentally committed something to the wrong branch:

```bash
git reset --soft HEAD~1
# Now the changes are staged
git stash  # or checkout the correct branch
```

### Unstaging Changes

If you accidentally staged all files but only want to commit some of them:

```bash
git reset HEAD
# All files are now unstaged but changes remain in working directory
git add specific-file.js
git commit -m "Targeted commit"
```

### Discarding Changes

If you've been experimenting and want to reset to a clean state:

```bash
git reset --hard HEAD
```

This restores all tracked files to their last committed state.


## Common Mistakes with git reset

### Forgetting About the Working Directory

When using `--hard`, it's easy to forget that changes to the working directory are lost permanently. Always make sure you don't have important uncommitted changes before doing a hard reset.

### Using Reset in Collaboration

**Never use `git reset` to undo commits that have already been pushed to a shared remote repository.** This rewrites history and will cause problems for your collaborators. Use `git revert` instead for shared commits.

```bash
# Safe for collaborative repos:
git revert <commit-hash>

# Only safe for local, unpushed commits:
git reset --hard <commit>
```


## Recovering from a Mistake

If you accidentally discarded important changes with `git reset --hard`, you can try to recover using `git reflog`:

```bash
git reflog
```

`git reflog` shows a log of where `HEAD` has been, including after `reset` operations. You can restore to a previous state:

```bash
git reset --hard HEAD@{2}
# or
git reset --hard <hash-from-reflog>
```

> **Note:** `git reflog` entries expire after 90 days by default, so recovery is only possible within that window.


## Summary

| Mode | HEAD | Staging Area | Working Dir |
|------|------|-------------|-------------|
| `--soft` | Moved | Unchanged | Unchanged |
| `--mixed` (default) | Moved | Reset | Unchanged |
| `--hard` | Moved | Reset | **Reset (destructive)** |

`git reset` is a powerful tool but use it carefully, especially with `--hard`. For undoing changes in shared repositories, prefer `git revert` to maintain a safe and collaborative history.
