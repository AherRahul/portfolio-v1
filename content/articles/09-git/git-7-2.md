---
title: "git merge"
description: "Learn how to use git merge to combine changes from different branches, understand the three-way merge process, handle merge scenarios, and recover from merge issues."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# git merge

The `git merge` command is a powerful feature that allows developers to combine changes from different branches within a Git repository. While the concept of merging may seem straightforward, understanding the intricacies of how Git performs the merge operation can greatly improve your workflow and help you avoid common pitfalls.


## Understanding Git Merge

At a high level, `git merge` combines the changes from one branch into another. The branch you're merging **from** is the "source branch," while the branch you're merging **into** is the "target branch." When you execute a merge, Git creates a new commit that represents the combined changes.

This operation relies on Git's internal structure of commits forming a directed acyclic graph (DAG). When you run `git merge`, Git takes the snapshot of the source branch and applies it to the target branch.


## The Merge Process

### Step 1: Identifying the Merge Base

Git first identifies the common ancestor (merge base) of the two branches. This is the commit where the branches diverged.

```bash
# Find the common ancestor of two branches
git merge-base main feature/login
```

### Step 2: Creating a New Merge Commit

Git then takes the changes from both branches since the merge base and combines them. If there are no conflicts, Git creates a merge commit automatically.

```bash
# Switch to the target branch
git switch main

# Merge the source branch
git merge feature/login
```

A successful merge message:

```
Merge made by the 'ort' strategy.
 src/auth.js     | 45 ++++++++++++++++++++++++++++++
 src/login.html  | 32 ++++++++++++++++++++++
 2 files changed, 77 insertions(+)
```

### Step 3: Handling Conflicts

If both branches modified the same lines, Git will pause and mark the conflicts:

```
Auto-merging src/app.js
CONFLICT (content): Merge conflict in src/app.js
Automatic merge failed; fix conflicts and then commit the result.
```


## Common Merge Scenarios

### Merging Feature Branches

The most common workflow — merging a completed feature into `main`:

```bash
git switch main
git pull origin main  # Update main first
git merge feature/login
git push origin main
```

### Keeping a Feature Branch Updated

Periodically update your feature branch with changes from `main`:

```bash
git switch feature/login
git merge main   # Bring main's changes into feature branch
```

### Merge Options

```bash
# Create a merge commit even for fast-forward merges
git merge --no-ff feature/login

# Only allow fast-forward (fail if not possible)
git merge --ff-only feature/login

# Squash all commits from feature branch into one staged change
git merge --squash feature/login
git commit -m "Add login feature"

# Merge but don't commit yet (useful for reviewing before finalizing)
git merge --no-commit feature/login
git diff --cached  # Review what's staged
git commit -m "Merge feature/login"
```


## Best Practices for Merging

1. **Keep branches up to date:** Before merging, update the target branch and bring changes into the feature branch to minimize conflicts:
   ```bash
   git switch feature/login
   git merge main  # or git rebase main
   ```

2. **Use descriptive commit messages:** When creating merge commits, write a meaningful message.

3. **Review changes before merging:**
   ```bash
   git diff main...feature/login   # Changes in feature branch
   git log main..feature/login     # Commits in feature not in main
   ```

4. **Test before merging:** Always run tests on the feature branch before merging to `main`.


## Recovering from Merge Issues

### Undoing a Merge (Before Commit)

If a merge has conflicts and you want to abort:

```bash
git merge --abort
```

### Undoing a Merge (After Commit)

If you already completed the merge but want to undo it:

```bash
git reset --hard HEAD~1  # For local merge only
# or
git revert -m 1 HEAD     # For already-pushed merges
```

### Reverting a Merge Commit

To safely undo a merge in a shared repository:

```bash
# Find the merge commit hash
git log --oneline

# Revert it safely
git revert -m 1 <merge-commit-hash>
```

The `-m 1` specifies which parent (1 = the branch you merged into) to keep.
