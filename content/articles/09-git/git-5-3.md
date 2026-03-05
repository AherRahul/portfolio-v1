---
title: "git revert"
description: "Learn how to safely undo commits in Git using git revert, which creates new commits to reverse changes without rewriting history — safe for collaborative repos."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# git revert

If you've ever found yourself in a situation where you needed to undo a commit but wanted to preserve the history, `git revert` is your go-to tool.

Unlike other commands that alter history, `git revert` **creates a new commit that undoes the changes of a previous commit**. This makes it a safe option for collaborative environments, where rewriting history can lead to confusion or lost work.


## What is git revert?

At its core, `git revert` is a command that takes a commit and produces a **new commit that negates the changes** introduced by the original commit. This means that instead of deleting the commit from the history, it applies the inverse of the changes, keeping the overall commit history linear and transparent.

When you run `git revert`, Git creates a new commit that effectively undoes the changes made in the specified commit. This is particularly useful in shared repositories, as it allows team members to see:
- What was changed
- Why it was reverted
- The complete history of both the original change and its reversal

For example, if you accidentally introduced a bug in your code and committed the change, you can use `git revert` to create a new commit that reverts the changes made by the buggy commit.


## How to Use git revert

The basic command syntax is:

```bash
git revert <commit_hash>
```

Here, `<commit_hash>` is the SHA-1 identifier of the commit you want to revert. You can find this identifier with `git log`.

### Example Scenario

Say you have the following commit history:

```
A → B → C → D (HEAD)
```

And commit `C` introduced a bug. Running `git revert C` will create a new commit `E` that undoes the changes from `C`:

```
A → B → C → D → E (HEAD)
```

Your commit history is fully preserved, and `E` is a new commit that reverses `C`'s changes.

```bash
# Find the commit to revert
git log --oneline

# Revert the specific commit
git revert abc1234

# Git opens your editor to write a commit message
# (default message is already pre-filled)
# Save and close to create the revert commit
```


## Handling Multiple Commits

You can revert multiple commits at once by specifying a range:

```bash
# Revert the last 3 commits (creates 3 separate revert commits)
git revert HEAD~3..HEAD

# Revert a range of commits as a single revert commit
git revert --no-commit HEAD~3..HEAD
git commit -m "Revert: Remove faulty authentication changes"
```

### Important Consideration

When reverting multiple commits, the order matters. Git reverts them in reverse chronological order to avoid conflicts. The more recent commit is reverted first.


## Understanding Merge Commits

Reverting a merge commit requires special handling. You must specify which parent commit to "keep" using the `-m` flag:

```bash
git revert -m 1 <merge-commit-hash>
```

The `-m 1` flag tells Git which branch (parent 1 = the branch that was merged into) to keep. This is necessary because a merge commit has two parents, and Git needs to know which changes to reverse.

### Example Scenario

If you merged a feature branch into `main` and want to undo the merge:

```bash
git log --oneline
# Shows: abc1234 Merge feature-auth into main

git revert -m 1 abc1234
# Creates a new commit that reverts the merge
```


## Dealing with Conflicts

Like any merge operation, `git revert` can result in conflicts if the changes in the commit you're reverting overlap with other changes. In that case:

1. Git will pause and show you the conflicting files.
2. Open the files, find the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), and resolve them.
3. Stage the resolved files: `git add <resolved-file>`
4. Continue the revert: `git revert --continue`

If you want to abort the revert entirely:

```bash
git revert --abort
```


## Best Practices for Using git revert

- **Prefer `git revert` over `git reset` for shared branches.** Since `git revert` doesn't rewrite history, it's safe to use in collaborative environments.

- **Write meaningful revert commit messages.** The default message (e.g., "Revert 'Add user authentication'") is a good start, but adding context about *why* you're reverting helps the team understand:

  ```
  Revert "Add user authentication"

  This reverts commit abc1234 because it introduced a critical
  security vulnerability in the token validation logic.
  The fix will be added in a separate commit after review.
  ```

- **Test before reverting in production.** Always verify the revert locally first by running your test suite.


## Real-World Applications

### Hotfixes

When a critical bug is deployed to production and you need a quick rollback:

```bash
# Find the bad commit
git log --oneline -10

# Revert it immediately
git revert abc1234
git push origin main
```

### Undoing Released Features

When a feature needs to be temporarily removed from a release:

```bash
git revert <feature-commit>
git tag v2.0.1-without-feature
git push origin main --tags
```


## git revert vs git reset

| Aspect | `git revert` | `git reset` |
|--------|-------------|-------------|
| History | Preserved (adds new commit) | Rewritten (removes commits) |
| Safety | Safe for shared repos | Dangerous for shared repos |
| Collaboration | ✅ Recommended | ❌ Avoid for pushed commits |
| When to use | Undo changes on shared branches | Undo local, unpushed work |


## Conclusion

`git revert` is a fundamental tool for safe, collaborative development. By creating a new commit that reverses previous changes rather than rewriting history, it allows teams to undo mistakes transparently while maintaining a clear and trustworthy commit history. Make it your default choice when you need to undo changes on any branch that has been shared with others.
