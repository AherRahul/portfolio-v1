---
title: "Reset Modes"
description: "Understand git reset's three modes (soft, mixed, hard) in depth — when to use each mode, practical examples, and how they affect HEAD, the staging area, and the working directory."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Reset Modes (soft, mixed, hard)

When it comes to managing your Git repository, knowing how to reset your changes can be a lifesaver. You might find yourself in situations where you realize that your latest commits, staged changes, or even edits in your working directory are not quite what you intended. This is where Git's `reset` command shines, particularly through its three main modes: **soft**, **mixed**, and **hard**.


## Understanding Reset Modes

The `git reset` command changes the current branch's `HEAD` pointer to a specified state. Depending on the mode you choose, it also affects the staging area and the working directory.

Here's a high-level overview of how the three modes differ:

| Mode | HEAD | Staging Area | Working Directory |
|------|------|-------------|-------------------|
| `--soft` | Moved | **Unchanged** | **Unchanged** |
| `--mixed` | Moved | **Reset** | Unchanged |
| `--hard` | Moved | **Reset** | **Reset (Destructive)** |

Understanding these differences will help you choose the right mode for your situation.


## Soft Reset

The soft reset is often your first choice when you want to undo commits while keeping your changes intact for further editing or staging.

### What It Does

When you use `git reset --soft <commit>`, Git:
1. Moves the `HEAD` pointer to the specified commit.
2. **Leaves the staging area unchanged.** All changes from the "undone" commits remain staged.
3. **Leaves the working directory unchanged.** Your files are exactly as they were.

### Practical Example

Say you just made two commits that you want to combine into one:

```bash
# Current state: A → B → C → D (HEAD)
git reset --soft HEAD~2

# New state: A → B (HEAD)
# Changes from C and D are now staged
```

Now you can create a single, clean commit:

```bash
git commit -m "Combined feature implementation"
```

### Why Use Soft Reset?

- **Rewrite commit history** locally before pushing.
- **Combine multiple commits** into a single, meaningful commit.
- **Fix a bad commit message** on a commit that's not yet pushed.


## Mixed Reset

The mixed reset is the **default mode** when no flag is specified. It's a middle ground between soft and hard reset.

### What It Does

When you use `git reset --mixed <commit>` (or just `git reset <commit>`), Git:
1. Moves the `HEAD` pointer to the specified commit.
2. **Resets the staging area** to match the new `HEAD` — previously staged changes are now unstaged.
3. **Leaves the working directory unchanged.** Your file edits remain intact.

### Practical Example

You want to undo a commit and choose which changes to re-stage:

```bash
# Current state: A → B → C (HEAD)
git reset HEAD~1   # Same as git reset --mixed HEAD~1

# New state: A → B (HEAD)
# Changes that were in C are in working directory but unstaged
```

Now you can selectively re-stage only the changes you want:

```bash
git add specific-feature.js
git commit -m "Only the specific feature"
```

### Why Use Mixed Reset?

- **Unstage accidentally staged files** while keeping changes in the working directory.
- **Reorganize a commit** that has too many unrelated changes.
- **Clean up before pushing**, when you want to re-structure your commits.


## Hard Reset

The hard reset is the most powerful and destructive of the three modes.

### What It Does

When you use `git reset --hard <commit>`, Git:
1. Moves the `HEAD` pointer to the specified commit.
2. **Resets the staging area** to match the new `HEAD`.
3. **Resets the working directory** to match the new `HEAD` — all uncommitted changes are permanently discarded.

> **Warning:** This operation is **irreversible** for uncommitted changes. Use with extreme caution.

### Practical Example

Your working branch has gotten into a broken state and you want to start fresh from the last good commit:

```bash
# Completely discard the last 3 commits and all working directory changes
git reset --hard HEAD~3
```

Or to reset to a specific commit:

```bash
git reset --hard abc1234
```

### Emergency Recovery

If you accidentally used `--hard` and lost important commits, check the reflog:

```bash
git reflog
# Find the commit you want to recover
git reset --hard HEAD@{3}  # Go back to 3 moves ago
```

### Why Use Hard Reset?

- **Completely abandon** experimental changes that didn't work out.
- **Align your local branch** with the remote branch after a force-push (though this is rare and needs care).
- **Clean up messy experiments** when you're sure you want to discard all changes.


## Choosing the Right Reset Mode

When deciding which reset mode to use, ask yourself these questions:

1. **Do I want to keep my changes?**
   - Yes → Use `--soft` or `--mixed`
   - No → Use `--hard` (but be sure!)

2. **Do I want changes staged or unstaged?**
   - Keep them staged → Use `--soft`
   - Unstage them → Use `--mixed`

3. **Have I pushed these commits?**
   - No → Any reset mode is safe to use
   - Yes → **Do not use reset!** Use `git revert` instead.


## Visualizing Reset Modes

Here's a visual representation of the three modes applied to the same starting state:

**Starting state:** `A → B → C → D (HEAD)` with some staged and working dir changes.

After `git reset HEAD~2` with each mode:

```
Soft:   HEAD→B  |  Staging: C+D changes staged  |  WorkDir: unchanged
Mixed:  HEAD→B  |  Staging: empty               |  WorkDir: C+D changes present
Hard:   HEAD→B  |  Staging: empty               |  WorkDir: changes GONE
```

This clear distinction governs when to use each mode based on your needs.


## Conclusion

Mastering the three reset modes gives you precise control over your commit history, staging area, and working directory. Use `--soft` to redo commits cleanly, `--mixed` to reorganize staged changes, and `--hard` cautiously to discard unwanted work entirely. Always remember: for commits that have already been pushed, prefer `git revert` to maintain a safe, collaborative history.
