---
title: "Branch Listing"
description: "Learn how to list local and remote branches in Git, view branch details, filter branches, and understand the output of git branch commands."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Branch Listing

Keeping track of all the branches in your repository is essential for an organized and efficient development workflow. Git provides several commands to list and inspect branches.


## Listing Local Branches

To see all local branches:

```bash
git branch
```

Output:

```
  bugfix/fix-header
  feature/login
  feature/payment
* main
```

The asterisk (`*`) indicates the **currently active branch** (where `HEAD` is pointing).


## Listing All Branches (Local + Remote)

To see both local and remote branches:

```bash
git branch -a
```

Output:

```
  feature/login
* main
  remotes/origin/HEAD -> origin/main
  remotes/origin/feature/login
  remotes/origin/feature/payment
  remotes/origin/main
```

Remote branches are shown prefixed with `remotes/origin/` (or whatever your remote is named).

For only remote tracking branches:

```bash
git branch -r
```


## Viewing Branch Details

To see more information about each branch (last commit, tracking info):

```bash
git branch -v
```

Output:

```
  feature/login   abc1234 Add login form UI
  feature/payment def5678 Integrate payment gateway
* main            g9h0i1j Merge feature/login
```

For even more detailed information including upstream tracking:

```bash
git branch -vv
```

Output:

```
  feature/login   abc1234 [origin/feature/login] Add login form UI
  feature/payment def5678 [origin/feature/payment: ahead 2] Integrate gateway
* main            g9h0i1j [origin/main] Merge feature/login
```

The `[origin/branch: ahead N]` indicates that your local branch is N commits ahead of the remote tracking branch.


## Filtering Branches

### By Merge Status

List branches that have been merged into the current branch:

```bash
git branch --merged
```

List branches that have **not** been merged:

```bash
git branch --no-merged
```

### By Pattern

Filter branches using grep:

```bash
git branch | grep feature     # All feature branches
git branch | grep hotfix      # All hotfix branches
git branch -r | grep release  # All remote release branches
```


## Viewing Branch Details with git log

To see recent commits on each branch:

```bash
# One-line summary for each branch
git log --oneline --all --graph

# Show branches and their tips
git for-each-ref --format='%(refname:short) %(objectname:short)' refs/heads/
```


## Best Practices

1. **Regularly review your branches:** Run `git branch -vv` periodically to see which branches are ahead, behind, or in sync with their remotes.

2. **Clean up merged branches:** Use `git branch --merged | xargs git branch -d` to delete all merged local branches.

3. **Prune remote tracking branches:** Run `git fetch --prune` to remove local references to deleted remote branches.

4. **Use descriptive names:** Well-named branches are easy to find in the branch list. Follow your team's naming convention consistently.
