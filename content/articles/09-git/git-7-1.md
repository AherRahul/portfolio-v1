---
title: "Merging Basics"
description: "Understand what merging is in Git, how the commit graph relates to merging, the difference between merge commits and fast-forward merges, and best practices for merging branches."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Merging Basics

Merging code changes is a fundamental part of working with Git. When collaborating on software projects, multiple developers often contribute to the same codebase. Merging allows these contributions to be integrated, creating a unified version of the code.


## What is Merging?

Merging in Git is the process of **integrating changes from one branch into another**. Branches in Git are simply pointers to specific commits, allowing developers to work on features, fixes, or experiments in isolation. When it's time to combine those changes, Git performs a merge operation.

By default, Git uses a **three-way merge strategy** to combine changes. This involves using the latest common ancestor of the two branches being merged along with the changes made in each branch.


## Understanding the Commit Graph

To visualize how merging works, consider this commit graph:

```
main:    A → B → C
                  
feature:      B → D → E
```

In this example:
- `main` has commits `A`, `B`, and `C`.
- `feature` diverges from commit `B` and adds commits `D` and `E`.

When you merge `feature` back into `main`, Git needs to reconcile the differences between commits `C` and `E`, using commit `B` as the common base.


## The Merge Process

The merging process can be broken down into several steps:

1. **Identify the Branches:** Determine which branch you want to merge into and which branch contains the changes.

2. **Perform the Merge:** Use the `git merge` command to start the merge process. Git automatically finds the common ancestor and performs the three-way merge.

3. **Handle Merge Conflicts:** If both branches modified the same lines in conflicting ways, Git will pause the merge and mark the conflicts for you to resolve.

4. **Finalize the Merge:** Once conflicts are resolved, complete the merge by committing the changes.

```bash
# Switch to the branch you want to merge INTO
git switch main

# Merge the feature branch INTO main
git merge feature/login
```


## Merge Commit vs. Fast-Forward

When merging, Git can handle the integration in two main ways:

### Merge Commit

A merge commit is created when the branches have **diverged** (both have new commits). Git creates a new commit with two parents.

```
main:     A → B → C → M
               ↑       ↑
feature:       B → D → E
```

Here, `M` is the merge commit that has two parents: `C` (from main) and `E` (from feature). This keeps a clear record of when and how the branches were integrated.

### Fast-Forward Merge

A fast-forward merge happens when the target branch has **no new commits** since the feature branch was created. Git simply moves the branch pointer forward — no extra commit is created.

```
Before:
main:     A → B
feature:       B → C → D

After fast-forward:
main:     A → B → C → D
```

The history stays perfectly linear with no extra merge commit.

### Which One to Use?

| Scenario | Recommended |
|----------|------------|
| Long-running feature branches | Merge commit |
| Short-lived, linear branches | Fast-forward |
| Need to see branch structure in history | Merge commit |
| Want linear, clean history | Fast-forward or rebase first |

Many teams choose merge commits for long-running features (`git merge`) and fast-forward for small, short-lived branches (`git merge --ff-only`).


## Best Practices for Merging

1. **Keep your feature branch up to date:** Before merging, pull the latest changes from the target branch to reduce conflicts:
   ```bash
   git switch feature/login
   git merge main   # Or: git rebase main
   ```

2. **Test before merging:** Run your full test suite on the branch before merging to ensure nothing is broken.

3. **Use descriptive merge commit messages:** When creating merge commits, write a meaningful message that explains what was merged and why.

4. **Review changes with diff before merging:**
   ```bash
   git diff main...feature/login  # See all changes that will be merged
   ```

5. **Delete branches after merging:** Once merged, delete the feature branch to keep the repository clean.
