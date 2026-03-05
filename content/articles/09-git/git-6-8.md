---
title: "HEAD Pointer"
description: "Understand how the HEAD pointer works in Git, how it tracks your current position in the commit graph, and how it relates to branches and commits."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# HEAD Pointer

The concept of the HEAD pointer in Git is fundamental yet often misunderstood. It's the compass that guides your development journey, indicating where you currently stand in your repository. Understanding HEAD is crucial for navigating branches, commits, and advanced operations.


## What is HEAD?

In Git, `HEAD` is a **special pointer** that refers to the current commit in your working directory. Think of it as a bookmark that tells Git:
1. Which branch you are currently on, **or**
2. Which specific commit you are currently viewing (in detached HEAD state)

When you make new commits, `HEAD` advances to point to the latest commit on your current branch.

Here's a visualization of how HEAD works:

```
A → B → C → D (HEAD → main)
```

In this example, `HEAD` points to the `main` branch, which in turn points to commit `D`. When you commit, `HEAD` moves forward with the branch.


## How HEAD Works with Branches

The HEAD pointer can be thought of more dynamically in relation to branches. Git employs a simple structure to manage this:

- **HEAD points to a branch reference:** When you're on a branch (like `main` or `feature`), HEAD points to that branch's latest commit. This is the **normal state**.

- **HEAD can also point directly to commits:** This happens in a "detached HEAD state", which we'll explore in the next chapter.

```
HEAD → main → D → C → B → A
```

When you run `git branch`, you can see which branch is currently active by checking where HEAD is pointing (the asterisk `*` indicates HEAD's branch).


## Navigating with HEAD

### Relative References

You can use HEAD with relative syntax (`~` and `^`) to navigate commits:

```bash
HEAD~1  # One commit before HEAD (parent)
HEAD~2  # Two commits before HEAD (grandparent)
HEAD^   # First parent of HEAD (same as HEAD~1 for linear history)
HEAD^2  # Second parent of HEAD (used with merge commits)
```

Examples:

```bash
git show HEAD~1       # Show the previous commit
git diff HEAD~3 HEAD  # Show changes from 3 commits ago to now
git reset HEAD~1      # Undo the last commit
```

### Checking Out Branches

When you check out a branch, HEAD moves to that branch:

```bash
git switch feature/login
# Now: HEAD → feature/login → <latest commit on feature/login>
```

### Creating New Branches

When you create a new branch, it starts at the same commit as HEAD:

```bash
git switch -c new-feature
# HEAD and new-feature both point to the same commit initially
```


## The Role of HEAD in Commits

Every time you make a commit, Git uses HEAD to determine:
1. **Where to add the commit** — it becomes the new child commit of whatever HEAD currently points to.
2. **How to update the branch** — the branch that HEAD points to is advanced to the new commit.

```bash
git commit -m "Add feature"
# Creates new commit → Updates branch HEAD points to → HEAD advances
```


## Reading HEAD

You can see where HEAD is pointing:

```bash
cat .git/HEAD
# If on a branch: ref: refs/heads/main
# If detached: abc1234def5678...  (a commit hash)

git symbolic-ref HEAD   # Shows the branch HEAD is pointing to
git rev-parse HEAD      # Shows the commit hash HEAD points to
```


## Understanding Detached HEAD

When HEAD points directly to a commit (not through a branch reference), you're in "detached HEAD state". This will be covered in detail in the next chapter.

```
          HEAD
           ↓
A → B → C (detached, no branch)
```

vs. normal state:

```
HEAD → main
              ↓
A → B → C → D
```


## Best Practices with HEAD

1. **Know where HEAD is before performing resets:** Run `git log --oneline -5` to see your current position.

2. **Use relative references carefully:** `HEAD~3` is intuitive, but counting wrong can lead to unintended resets.

3. **Be cautious in detached HEAD state:** Any commits you make won't be attached to a branch — they can be lost if you switch branches without creating a branch first.

4. **Check HEAD before force-pushing:** Always verify where HEAD is before `git push --force` to avoid overwriting the wrong history.
