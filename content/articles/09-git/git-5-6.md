---
title: "git reflog"
description: "Learn how to use git reflog to recover lost commits and branches, understand the reflog's structure, and use it as a safety net in your Git workflow."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# git reflog

It's easy to lose track of where you are in your Git history, especially when you're juggling branches and commits. Imagine you're working on a new feature, and in the process, you accidentally reset your branch or made a series of changes you want to undo. Fortunately, Git has a powerful safety net called `reflog` that can help you recover from these missteps.


## Understanding Reflog

The **reflog** (short for "reference log") is a mechanism in Git that records when the tips of branches and other references were updated. Unlike `git log` which shows the commit history of a branch, the reflog records every time `HEAD` was updated — even if those updates have since been "undone" by a reset or other operations.

Think of the reflog as a **local undo history** for your entire Git workflow. Every time you:
- Make a commit
- Switch branches
- Reset to a commit
- Merge or rebase
- Amend a commit

...Git records an entry in the reflog.


## Accessing Reflog

To view the reflog:

```bash
git reflog
```

Output example:

```
abc1234 HEAD@{0}: commit: Add user authentication
def5678 HEAD@{1}: reset: moving to HEAD~1
9a0b1c2 HEAD@{2}: commit: Add login page
3d4e5f6 HEAD@{3}: checkout: moving from main to feature-auth
7g8h9i0 HEAD@{4}: commit: Initial setup
```

Each entry shows:
- The **commit hash** that HEAD points to at that moment
- The **HEAD@{N}** reference (N=0 means most recent)
- A description of **what action was taken**

You can also view the reflog for a specific branch:

```bash
git reflog show main
git reflog show feature-auth
```


## Common Use Cases for Reflog

### Recovering Lost Commits

The most powerful use case for reflog is recovering commits that appear to be "lost" after a `git reset --hard`.

**Scenario:** You accidentally ran `git reset --hard HEAD~5`, discarding 5 commits.

```bash
# 1. View the reflog to find the lost commit
git reflog

# Output shows:
# abc1234 HEAD@{0}: reset: moving to HEAD~5
# def5678 HEAD@{1}: commit: Feature I worked hard on  ← This is what I want!

# 2. Restore to the lost commit
git reset --hard def5678
# or
git reset --hard HEAD@{1}
```

Your "lost" commits are now recovered!

### Undoing a Bad Merge

If a merge went wrong and you want to undo it entirely:

```bash
git reflog
# Find the commit before the merge
git reset --hard HEAD@{2}   # Go back to before the merge
```

### Revisiting a Previous State

If you deleted a branch and want to recover its commits:

```bash
git reflog
# Find the last commit on the deleted branch
git checkout -b recovered-branch <hash>
```

### Recovering After a Rebase

Interactive rebases can sometimes go wrong. If you need to undo a rebase:

```bash
git reflog
# Find the commit before "rebase: start" entry
git reset --hard ORIG_HEAD  # Git stores the pre-rebase state automatically
# or
git reset --hard HEAD@{N}   # Use the N where the rebase started
```


## The Lifespan of Reflog Entries

Reflog entries are **not permanent**. They expire after a set period:

- By default, reflog entries are kept for **90 days**.
- Entries that reference commits unreachable from any branch are kept for only **30 days**.

You can view and modify these settings:

```bash
git config gc.reflogExpire          # Default: 90 days
git config gc.reflogExpireUnreachable  # Default: 30 days
```

This means:
- ✅ Within 90 days: You can recover almost anything with reflog
- ⚠️ After 90 days: Entries are purged by `git gc`
- ❌ After recovery window: The commits may be garbage collected and truly lost


## Advanced Reflog Techniques

### Viewing Reflog with Time

You can use time-based references to navigate history:

```bash
git checkout HEAD@{yesterday}  # Where HEAD was yesterday
git checkout HEAD@{1 week ago}  # Where HEAD was a week ago
git checkout HEAD@{2025-01-01 10:00:00}  # Specific date/time
```

### Checking What ORIG_HEAD Was

Git automatically stores `ORIG_HEAD` before major operations (merge, reset, rebase):

```bash
git reset --hard ORIG_HEAD   # Undo the last merge/rebase/reset
```


## Reflog and Collaboration

An important distinction: **reflog is purely local**. Each developer's reflog records their own Git operations. When you push to a remote or pull from a remote, those actions are recorded in your local reflog, but the remote server does not keep a reflog for you.

This means:
- ✅ You can recover commits you've lost locally using reflog
- ❌ You cannot use reflog to recover commits that were pushed and then force-deleted on the remote

For remote collaboration, the safety net is `git revert` (which preserves history) rather than `git reset` (which rewrites it).


## Summary

The `git reflog` is one of Git's most powerful safety mechanisms. It provides a complete history of where your `HEAD` has been, enabling you to:

1. **Recover accidentally deleted branches** or commits
2. **Undo destructive operations** like `git reset --hard`
3. **Navigate to any point** in your recent Git history

Make it a habit to check the reflog when you feel like you've "lost" work — in most cases, it can be recovered within the 90-day window.

```bash
git reflog              # View full reflog
git reflog show <branch>  # View reflog for specific branch
git reset --hard HEAD@{N}  # Restore to N steps ago in reflog
```
