---
title: "git rm"
description: "Learn how to remove files from Git tracking using git rm, the difference between removing from staging only versus deleting from disk, and how to recover removed files."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---

# git rm — Removing Files

`git rm` removes files from both the working directory and Git's tracking (staging area). Unlike simply deleting a file manually, `git rm` ensures the deletion is staged and ready to be committed.

## How git rm Works

When you delete a file manually with your OS, Git sees it as an "unstaged deletion." You still need to `git add` the deletion to stage it. `git rm` does both steps at once:

```bash
# Equivalent to: delete file + git add (the deletion)
git rm filename.js
```

After `git rm`, the file deletion is staged and will be committed with your next `git commit`.

## Syntax and Options

```bash
# Remove a file (deletes from disk AND stages the deletion)
git rm filename.js

# Remove a directory recursively
git rm -r directory/

# Force removal even if file has staged changes
git rm -f filename.js

# Remove from tracking only (keep file on disk)
git rm --cached filename.js

# Dry run — see what would be removed
git rm -n filename.js
git rm --dry-run filename.js
```

## --cached: Remove from Tracking Without Deleting

The most commonly used variant: remove a file from Git's tracking while keeping it in your working directory.

**Use case:** You accidentally committed a file that should be in `.gitignore`:

```bash
# Stop tracking the file (stays on your disk)
git rm --cached secret-config.json

# Now add it to .gitignore
echo "secret-config.json" >> .gitignore

# Commit the removal
git add .gitignore
git commit -m "Stop tracking secret-config.json"
```

## Removing Multiple Files

```bash
# Wildcard for specific pattern
git rm '*.log'

# Remove all files in a directory
git rm -r dist/

# Remove multiple specific files
git rm file1.js file2.js file3.js
```

## Recovering a Removed File

If you ran `git rm` but haven't committed yet:

```bash
# Unstage the deletion and restore the file
git restore --staged filename.js
git restore filename.js
```

If already committed, use the reflog or checkout from a previous commit:

```bash
git log --all -- filename.js   # Find the last commit that had it
git checkout <hash>^ -- filename.js  # Restore from before deletion
```

## git rm vs Manual Deletion

| Method | Staged? | File on disk |
|--------|---------|-------------|
| `git rm file.js` | ✅ Yes | ❌ Deleted |
| `git rm --cached file.js` | ✅ Yes | ✅ Kept |
| Manual delete (OS) | ❌ No | ❌ Deleted |
| Manual delete + `git add -u` | ✅ Yes | ❌ Deleted |
