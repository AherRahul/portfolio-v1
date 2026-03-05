---
title: "git mv"
description: "Learn how to use git mv to move or rename files within a Git repository while preserving their history, and understand what happens internally when Git tracks renames."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---

# git mv — Moving and Renaming Files

`git mv` is a convenient shorthand command for moving or renaming files while keeping Git tracking intact. It combines three actions in one: rename the file, stage the deletion of the old name, and stage the addition of the new name.

## Basic Usage

```bash
# Rename a file
git mv old-name.js new-name.js

# Move a file to a different directory
git mv src/utils.js lib/utils.js

# Move and rename at the same time
git mv src/old-utils.js lib/new-utils.js
```

After `git mv`, the change is automatically staged:

```bash
git status
# Changes to be committed:
#   renamed:    old-name.js -> new-name.js
```

## What git mv Does Internally

`git mv` is exactly equivalent to:

```bash
# Move/rename the file in the OS
mv old-name.js new-name.js

# Stage the deletion of the old file
git add old-name.js   # (records as deleted)

# Stage the new file
git add new-name.js
```

Git detects the rename by comparing file content similarity — if content is >50% similar, Git considers it a rename (not a delete + add).

## Git's Rename Detection

Git doesn't store renames explicitly in its object model — it detects them based on content similarity at diff/log time.

```bash
# See rename detection in log
git log --follow new-name.js   # Shows history before rename

# Without --follow, history stops at the rename
git log new-name.js
```

The `--follow` flag tells `git log` to follow renames through history.

## Moving Entire Directories

```bash
# Move all files from old dir to new dir
git mv old-dir/ new-dir/

# Move all .js files into a src/ subdirectory
mkdir src/
git mv *.js src/
```

## When to Use git mv vs OS Rename

Always use `git mv` (or manually add after OS rename) — don't just rename in your OS without staging.

| Action | Result |
|--------|--------|
| `git mv old.js new.js` | Automatically staged as rename ✅ |
| OS rename only | Git sees as deleted (old) + untracked (new) ❌ |
| OS rename + `git add -A` | Git detects rename via content similarity ✅ |

## Renaming Branches vs Files

Note: `git mv` is for **files only**. To rename a **branch**, use:

```bash
git branch -m old-branch new-branch   # Rename branch
```
