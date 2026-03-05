---
title: "Squashing Commits"
description: "Learn how to squash multiple commits into one using git rebase -i and git merge --squash, when and why to squash, and best practices for cleaner commit history."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Squashing Commits

Squashing commits is the process of combining multiple commits into a single, unified commit. This is commonly used to clean up messy "WIP", "fix", "typo" commits before merging a feature branch, resulting in a clean, meaningful commit in the main history.


## Why Squash Commits?

During development, you might create many incremental commits:

```
abc1234 Add login form skeleton
def5678 WIP: add form validation
g9h0i1j fix: label typo
j0k1l2m chore: remove console.log
m3n4o5p actually working now!
```

These commits tell the story of development but are noisy in the final history. Squashing combines them into one meaningful commit:

```
abc1234 Add user login form with validation
```


## Method 1: Squashing with Interactive Rebase

The most flexible approach is `git rebase -i`:

```bash
# Squash last 5 commits
git rebase -i HEAD~5
```

In the editor, change `pick` to `squash` (or `fixup`) for commits you want to combine:

```
pick abc1234 Add login form skeleton     ← Keep this commit's message
squash def5678 WIP: add form validation  ← Combine into above
fixup g9h0i1j fix: label typo           ← Combine (discard this message)
fixup j0k1l2m chore: remove console.log ← Combine (discard this message)
squash m3n4o5p actually working now!    ← Combine (include message in editor)
```

- **`squash`:** Combines the commit and opens editor to merge commit messages
- **`fixup`:** Combines the commit but discards the message (no editor prompt)

After saving, Git opens a message editor for the combined commit. Write a clean, descriptive final message.


## Method 2: Squashing with git merge --squash

When merging a feature branch into main, you can squash all the feature's commits into one:

```bash
git switch main
git merge --squash feature/login
git commit -m "Add user login form with validation"
```

This takes all changes from `feature/login` but doesn't create a merge commit or preserve the individual commits. The result in `main` is a single commit with all the feature's changes.

**Note:** After this, `feature/login` is NOT marked as merged in Git's sense, so you should delete it manually.


## Method 3: Squashing with git reset

Another approach is to reset to where the branch started and recommit:

```bash
# Find where the feature branch started
git log --oneline

# Reset to before all feature commits (soft reset keeps changes staged)
git reset --soft main

# Commit all changes as a single commit
git commit -m "Add user login form with validation"
```

This approach works well for simple cases.


## Squash Workflow Examples

### Before Creating a Pull Request

```bash
# View your commits
git log --oneline main..HEAD

# Squash commits to clean up
git rebase -i main

# Force push to update remote
git push --force-with-lease origin feature/login
```

### Automated Squash During Merge (GitHub)

Many teams use GitHub's "Squash and merge" button in pull requests. This squashes all commits from the PR into a single commit on `main` without requiring manual rebase.


## When to Squash

✅ **DO squash when:**
- Cleaning up WIP/progress commits before a PR review
- Combining "fix typo", "remove debug", "oops" commits
- Creating a single logical unit commit for one feature

❌ **DON'T squash when:**
- The individual commits tell a meaningful story
- The commits represent distinct logical changes that should be reviewable separately
- You need to bisect future bugs (keeping granular commits helps `git bisect`)

## Best Practices

1. **Squash before opening a PR**, not after reviewers have already commented on specific commits.
2. **Write a comprehensive commit message** for the squashed commit — it now represents all the work.
3. **Never squash commits that have been pushed** to a branch others are working on.
