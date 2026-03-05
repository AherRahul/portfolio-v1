---
title: "Deleting Branches"
description: "Learn how to safely delete local and remote Git branches after merging, handle unmerged branches with force deletion, and keep your repository clean."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Deleting Branches

As you work with branches in Git, your list of active branches can grow over time. Deleting branches that have been merged or are no longer needed keeps your repository organized and helps your team navigate the project more effectively.


## Deleting a Local Branch

To delete a local branch after it has been merged:

```bash
git branch -d <branch-name>
```

The `-d` flag (safe delete) will only delete the branch if it has been fully merged into its upstream branch. This prevents accidental loss of unmerged work.

Example:

```bash
git branch -d feature/login
```

If the branch has not been merged, Git will show an error:

```
error: The branch 'feature/login' is not fully merged.
If you are sure you want to delete it, run 'git branch -D feature/login'.
```

### Force Deleting an Unmerged Branch

If you're sure you want to delete a branch even if it hasn't been merged (for example, you abandoned a feature):

```bash
git branch -D <branch-name>
```

> **Warning:** This permanently removes the branch and all commits that exist only on it. Make sure you want to discard these changes.

```bash
git branch -D feature/abandoned-experiment
```


## Deleting Multiple Branches

You can delete multiple local branches at once:

```bash
git branch -d feature/login feature/payment feature/profile
```

Or to delete all merged branches (except `main`):

```bash
git branch --merged main | grep -v "^\* main$" | xargs git branch -d
```


## Deleting a Remote Branch

To delete a branch from the remote repository:

```bash
git push origin --delete <branch-name>
```

Example:

```bash
git push origin --delete feature/login
```

After deleting a remote branch, other team members need to prune their remote tracking references:

```bash
git fetch --prune    # Remove remote-tracking references for deleted remote branches
```

Or configure Git to prune automatically during fetch:

```bash
git config --global fetch.prune true
```


## Checking for Merged Branches

Before deleting, you can check which branches have been merged into the current branch:

```bash
git branch --merged       # Branches already merged into current branch
git branch --no-merged    # Branches not yet merged
```

Output:

```
$ git branch --merged
  feature/login      ← safe to delete
  feature/payment    ← safe to delete
* main
```


## Best Practices

1. **Always merge before deleting:** Use safe delete (`-d`) to avoid losing unmerged work.

2. **Clean up after merging pull requests:** As part of your team's workflow, delete branches after merge:
   ```bash
   git branch -d feature/login
   git push origin --delete feature/login
   ```

3. **Regularly prune your local repo:** Run `git fetch --prune` regularly to remove references to deleted remote branches.

4. **Recover an accidentally deleted branch:** If you accidentally delete an unmerged branch, use the reflog to recover it:
   ```bash
   git reflog
   git checkout -b recovered-branch abc1234  # Use the last commit hash from reflog
   ```

5. **Use branch protection rules:** In GitHub/GitLab, enable branch protection to prevent direct deletion of important branches like `main`.
