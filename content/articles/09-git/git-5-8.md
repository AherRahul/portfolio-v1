---
title: "git checkout (files)"
description: "Learn how to use git checkout to restore specific files from a commit, discard working directory changes, and recover deleted files — and how git restore is the modern replacement."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---

# git checkout (Files) — Restoring File Contents

While `git checkout` is commonly known for switching branches, it can also **restore specific files** from commits or the staging area. In modern Git (2.23+), `git restore` is the preferred command for this, but understanding the `checkout` file usage remains valuable.

## Discarding Working Directory Changes

Restore a file to its **last committed state** (discard all local modifications):

```bash
# Old syntax (still works)
git checkout -- filename.js

# Modern replacement (preferred)
git restore filename.js
```

> The `--` is important — it separates the branch name from the filename, avoiding ambiguity if a file and branch have the same name.

## Restoring from a Specific Commit

```bash
# Restore a file to how it looked in a specific commit
git checkout abc1234 -- src/auth.js

# Restore from HEAD~3 (3 commits back)
git checkout HEAD~3 -- src/auth.js

# Restore from a tag
git checkout v1.0.0 -- src/auth.js
```

After this, the file is **staged** with the content from that commit. You can review it with `git diff --staged` and then commit it.

## Recovering a Deleted File

If you accidentally deleted a file and haven't committed yet:

```bash
# Restore the deleted file from HEAD
git checkout -- deleted-file.js

# Or with modern syntax
git restore deleted-file.js
```

If the file was deleted in a previous commit:

```bash
# Find the commit that deleted it
git log --all --full-history -- filename.js

# Restore it from the commit BEFORE deletion
git checkout <hash-before-deletion>^ -- filename.js
```

## Restoring Multiple Files

```bash
# Restore all .js files
git checkout -- '*.js'

# Restore all files in a directory
git checkout -- src/

# Restore everything (discard all changes in working dir)
git checkout -- .
```

## Restoring Staged Changes

To restore a file back to HEAD in the staging area (unstage AND reset content):

```bash
# Unstages changes AND resets file content to HEAD
git checkout HEAD -- filename.js
```

Compare with `git restore`:

```bash
git restore --staged filename.js    # Unstage only (keep working dir changes)
git restore filename.js             # Reset working dir only
git restore --source HEAD --staged --worktree filename.js  # Both
```

## Modern Alternative: git restore

Git 2.23+ introduced `git restore` specifically for restoring files (cleaner semantics):

```bash
# git checkout equivalent → git restore
git checkout -- file.js              →  git restore file.js
git checkout HEAD -- file.js         →  git restore --source HEAD file.js
git checkout abc1234 -- file.js      →  git restore --source abc1234 file.js
git checkout -- .                    →  git restore .
```

`git restore` is recommended because:
- Cleaner, single-purpose command
- No ambiguity between switching branches and restoring files
- Clearer flags (`--staged`, `--worktree`, `--source`)
