---
title: "git rebase"
description: "Master the git rebase command — understand how commits are replayed onto a new base, handle rebase conflicts, use --continue and --abort, and apply rebase in real-world workflows."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# git rebase

The `git rebase` command is used to move or "rebase" a series of commits onto a new base commit. This powerful command can rewrite your commit history in useful ways while keeping the codebase clean and organized.


## Basic Syntax

```bash
git rebase <upstream>
git rebase <upstream> <branch>
```

- `<upstream>`: The branch or commit to rebase onto.
- `<branch>`: Optionally, the branch to rebase (defaults to current branch).


## How git rebase Works

When you run `git rebase main` on a feature branch:

1. Git finds the common ancestor between your feature branch and `main`.
2. Git saves all commits made in your feature branch (that aren't in `main`) to a temporary area.
3. Git resets your feature branch to match `main` (your branch's tip now points to `main`'s tip).
4. Git replays each saved commit one by one on top of the new base.

**Before:**

```
main:    A → B → C
feature:     B → D → E
```

**After `git rebase main` (from feature):**

```
main:      A → B → C
feature:             C → D' → E'
```

`D'` and `E'` are new commits with the same changes but different hashes.


## Standard Rebase Workflow

### Updating a Feature Branch with Latest Changes

```bash
# Update main branch first
git switch main
git pull origin main

# Rebase your feature branch onto updated main
git switch feature/login
git rebase main
```

After the rebase, your feature branch is now "in sync" with main and has all its latest changes, with your commits on top.

### Cleaning Up Before Creating a Pull Request

```bash
# Rebase onto main to catch up
git switch feature/login
git rebase main

# If needed, push with force (since history was rewritten)
git push origin feature/login --force-with-lease
```

**Note:** Always use `--force-with-lease` instead of `--force` — it's safer because it fails if someone else has pushed to the branch since you last fetched.


## Handling Rebase Conflicts

When rebasing, conflicts can occur just like during merging. Git will pause after each conflicting commit.

**When a conflict occurs:**

```
First, rewinding head to replay your work on top of it...
Applying: Add login form
CONFLICT (content): Merge conflict in src/auth.js
error: Failed to merge in the changes.
Patch failed at 0001 Add login form
```

### Resolving Rebase Conflicts

1. **Open the conflicting file** and resolve the conflict markers.

2. **Stage the resolved file:**
   ```bash
   git add src/auth.js
   ```

3. **Continue the rebase:**
   ```bash
   git rebase --continue
   ```

4. **Repeat** for each conflicting commit.


## Rebase Control Commands

```bash
# Continue after resolving conflicts
git rebase --continue

# Abort and go back to original state
git rebase --abort

# Skip the current commit (apply no change)
git rebase --skip
```


## Rebasing onto a Specific Commit

You don't have to rebase onto a branch — you can rebase onto any commit:

```bash
git rebase abc1234          # Rebase onto a specific commit
git rebase HEAD~3           # Rebase onto 3 commits before HEAD
git rebase --onto main HEAD~3  # Move last 3 commits to main
```


## Important Cautions

1. **Never rebase shared branches:** If others have based work on the original commits, rebasing will cause conflicts for them.

2. **Use `--force-with-lease` over `--force`:** When pushing a rebased branch, `--force-with-lease` ensures you don't overwrite someone else's changes.

3. **The commits change:** After rebasing, your commits have new SHA-1 hashes, even if the content is the same.

4. **Backup before risky rebases:** For complex or long rebases, consider creating a backup branch first:
   ```bash
   git branch backup-feature/login  # Keep the old branch
   git rebase main                  # Perform the rebase
   ```


## Conclusion

`git rebase` is a powerful tool for maintaining clean history, but it requires care and understanding of its implications. Use it primarily for local branches before sharing with others, and always communicate with your team when rebasing shared branches.
