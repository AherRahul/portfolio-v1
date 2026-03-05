---
title: "Editing Commits"
description: "Learn how to edit previous commits in Git using git commit --amend and git rebase -i with the edit command — modify files, update messages, and add missing changes to past commits."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Editing Commits

Sometimes you need to modify a commit that you've already made — whether to fix the commit message, add a missing file, or change some code. Git provides several ways to edit commits.


## Amending the Most Recent Commit

The simplest case: modifying the **last commit** you made (before pushing).

### Edit Just the Message

```bash
git commit --amend
# Opens editor to change the commit message
```

Or inline (no editor):

```bash
git commit --amend -m "Better commit message"
```

### Add Missing Files to the Last Commit

```bash
# Stage the missing file
git add forgotten-file.js

# Amend the last commit to include it
git commit --amend --no-edit  # --no-edit keeps the message unchanged
```

### Both File and Message

```bash
git add missing-change.js
git commit --amend -m "Updated commit with all changes"
```

> **Important:** `git commit --amend` creates a **new commit** (with a new hash) that replaces the last one. After amending, you need to force-push if you've already pushed.


## Editing Older Commits with Interactive Rebase

For commits that aren't the most recent, use `git rebase -i` with the `edit` command:

```bash
git rebase -i HEAD~4   # Edit among the last 4 commits
```

In the editor, change `pick` to `edit` for the commit you want to modify:

```
pick abc1234 Add login form
edit def5678 Add user authentication   ← We want to edit this
pick g9h0i1j Add logout functionality
pick j0k1l2m Write tests
```

Save and close. Git will pause at `def5678`:

```
Stopped at def5678...  Add user authentication
You can amend the commit now, with

  git commit --amend

Once you are satisfied with your changes, run

  git rebase --continue
```

Now you can:

### Option A: Edit the commit message

```bash
git commit --amend -m "Add OAuth2 user authentication with JWT"
git rebase --continue
```

### Option B: Add or change files

```bash
# Make file changes
vim src/auth.js

# Stage them
git add src/auth.js

# Amend the paused commit
git commit --amend --no-edit

# Continue the rebase
git rebase --continue
```

### Option C: Split the commit into multiple

```bash
# Reset the commit (unstage its changes)
git reset HEAD~1

# Now stage and commit the parts separately
git add src/auth.js
git commit -m "Add authentication logic"

git add tests/auth.test.js
git commit -m "Add authentication tests"

# Continue the rebase
git rebase --continue
```


## After Editing

Since editing rewrites history:

```bash
# Force push is required for previously pushed branches
git push --force-with-lease origin feature/auth
```

## Common Scenarios

| Scenario | Command |
|---------|---------|
| Fix typo in last commit message | `git commit --amend` |
| Add forgotten file to last commit | `git add file; git commit --amend --no-edit` |
| Fix commit message deep in history | `git rebase -i HEAD~N` → reword |
| Add/change files in old commit | `git rebase -i HEAD~N` → edit |
| Split a large old commit | `git rebase -i HEAD~N` → edit, reset HEAD~1, re-commit |
