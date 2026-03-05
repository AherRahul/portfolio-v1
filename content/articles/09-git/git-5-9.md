---
title: "git reset Deep Dive"
description: "Master git reset in depth — understand the three modes (soft, mixed, hard) precisely, when to use each, safe vs unsafe resets, and how to recover from accidental resets."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---

# git reset Deep Dive

`git reset` is one of Git's most powerful — and most dangerous — commands. Understanding exactly what it does in each mode is critical for using it safely.

## What git reset Moves

`git reset` moves the **current branch pointer** to a specified commit. It can also update the **staging area** and **working directory** depending on the mode.

There are three states to remember:
1. **Repository (HEAD)** — Last committed state
2. **Staging area (Index)** — Staged changes (ready to commit)
3. **Working directory** — Current files on disk

## The Three Modes

### --soft: Move HEAD Only

```bash
git reset --soft HEAD~1
```

- ✅ Moves HEAD (and branch) to specified commit
- ✅ Staging area: UNCHANGED (changes are still staged)
- ✅ Working directory: UNCHANGED

**Effect:** "Uncommit" — The changes from the reverted commit are now staged, ready to commit again differently.

**Use case:** Squash your last N commits into one:
```bash
git reset --soft HEAD~3  # Undo last 3 commits
git commit -m "All 3 as one clean commit"
```

### --mixed: Move HEAD + Reset Staging (DEFAULT)

```bash
git reset HEAD~1
git reset --mixed HEAD~1  # Same as above
```

- ✅ Moves HEAD to specified commit
- ✅ Staging area: RESET to match new HEAD
- ✅ Working directory: UNCHANGED

**Effect:** "Unstage" — Changes from the reverted commit are in the working directory but not staged.

**Use case:** Undo a commit and decide what to stage/not-stage:
```bash
git reset HEAD~1  # Undo commit, but keep changes in working dir
git add src/auth.js    # Only stage what you want
git commit -m "Better commit"
```

### --hard: Move HEAD + Reset Everything

```bash
git reset --hard HEAD~1
```

- ✅ Moves HEAD to specified commit
- ⚠️ Staging area: RESET to match new HEAD
- ⚠️ Working directory: RESET to match new HEAD

**Effect:** "Undo completely" — **All changes from the reverted commit are GONE.**

**Use case:** Truly discard all changes:
```bash
# Discard last commit and all its changes
git reset --hard HEAD~1

# Reset to a specific commit, losing ALL intervening work
git reset --hard abc1234

# Reset to match remote origin exactly
git reset --hard origin/main
```

## Visual Comparison

```
Command               HEAD    Index    Working Dir
git reset --soft      Moved   Same     Same
git reset --mixed     Moved   Reset    Same     ← Default
git reset --hard      Moved   Reset    Reset    ← Destructive!
```

## Reset for Specific Files

`git reset HEAD -- file.js` only resets the file in the staging area:

```bash
# Unstage a file (keep working dir changes)
git reset HEAD src/auth.js
# Modern equivalent:
git restore --staged src/auth.js
```

This is NOT the same as `git reset --mixed` (which resets the entire branch pointer).

## Safe vs Unsafe Resets

✅ **Safe (local unpushed commits):**

```bash
git reset --hard HEAD~3  # Remove last 3 commits locally
```

❌ **Unsafe (pushed commits):**

```bash
# After force-pushing, collaborators' history diverges!
git reset --hard HEAD~3
git push --force origin main  # DANGEROUS!
```

**Use `git revert` instead for pushed commits:**

```bash
# Creates a new commit that undoes changes — history is preserved
git revert abc1234
git push origin main  # Safe!
```

## Recovering from Hard Reset

If you accidentally lost commits with `--hard`:

```bash
# Find the lost commits in reflog
git reflog

# Restore
git reset --hard abc1234  # The commit from before the bad reset
```

**Reflog is your safety net** — commits are kept for at least 30 days.
