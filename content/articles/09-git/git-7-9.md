---
title: "Merge Commits"
description: "Understand what merge commits are, how they represent the joining of two branches in history, when to create or avoid them, and how to write meaningful merge commit messages."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Merge Commits

A **merge commit** is a special type of commit in Git that has **two or more parent commits**. It represents the point where two branches were joined together. Understanding merge commits is essential for reading and managing complex project histories.


## What is a Merge Commit?

When two branches with diverged histories are merged, Git creates a merge commit to record the event. Unlike regular commits (which have exactly one parent), merge commits have two parents:

- **Parent 1:** The last commit on the branch you merged into (e.g., `main`)
- **Parent 2:** The last commit on the branch you merged in (e.g., `feature/login`)

**Commit graph with a merge commit:**

```
A → B → C → M (merge commit)
         ↑   ↑
         |   |
         D → E (feature/login)
```

Where:
- `C` is the last commit on `main` before the merge
- `E` is the last commit on `feature/login`
- `M` is the merge commit with two parents: `C` and `E`


## Viewing Merge Commits

```bash
# See all commits including merge commits
git log --all --graph --oneline

# Show only merge commits
git log --merges

# Show commits that are NOT merge commits
git log --no-merges

# Show a specific merge commit
git show <merge-commit-hash>
```


## How Git Records Merge Commits

You can inspect a merge commit to see its two parents:

```bash
git cat-file -p <merge-commit-hash>
```

Output:

```
tree a3d4f21e...
parent abc12345   ← First parent (from current branch)
parent def67890   ← Second parent (from merged branch)
author Jane Doe <jane@example.com> 1704067200 +0000
committer Jane Doe <jane@example.com> 1704067200 +0000

Merge branch 'feature/login' into main
```


## Writing Good Merge Commit Messages

By default, Git generates a merge commit message like:

```
Merge branch 'feature/login' into main
```

You can customize this message:

```bash
git merge feature/login -m "Merge feature/login: Add user authentication endpoints"
```

A good merge commit message should:
- Describe **what was merged** and **why**
- Reference ticket/issue numbers if applicable
- Optionally note any post-merge actions taken

**Example:**

```
Merge feature/user-authentication into main

Adds OAuth2 user authentication including:
- Google sign-in integration
- JWT token generation
- Session management
- Unit tests for auth flows

Closes #234, Closes #235
```


## When Merge Commits Are Created

Merge commits are created when:
1. **Branches have diverged** — both have new commits since forking.
2. **`--no-ff` flag is used** — even if fast-forward is possible.

Merge commits are **NOT** created when:
- The merge is a **fast-forward** (no new commits on the target branch since forking).
- Using `git rebase` (rebasing re-applies commits without merge commits).
- Using `git merge --squash` (creates a single new commit instead).


## Reverting a Merge Commit

Reverting a merge commit requires specifying which parent to consider "the mainline":

```bash
git revert -m 1 <merge-commit-hash>
```

- `-m 1` means "keep the first parent's history" (the branch you merged into)
- `-m 2` would keep the second parent's history (the branch you merged in)


## Pro and Con of Merge Commits

**Pros:**
- Preserves the complete true history of the project
- Makes it clear when and how branches were merged
- Allows precise reverting of entire features

**Cons:**
- Creates a non-linear history that can be harder to read
- In heavily active repos, the graph can become complex ("spaghetti history")
- Some developers prefer the linear history that rebasing provides


## Summary

Merge commits are the permanent record of branch integration events in Git. They're a central part of the history of any collaborative project, providing a clear audit trail of when features were merged and what was combined. Understanding how they work makes it easier to navigate complex project histories and make informed decisions about when to use merge commits, fast-forward merges, or rebasing.
