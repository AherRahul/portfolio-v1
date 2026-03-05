---
title: "git clean"
description: "Learn how to use git clean to remove untracked files and directories from your working tree, use the dry-run flag safely, and understand when to clean vs stash untracked files."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---

# git clean — Removing Untracked Files

`git clean` removes **untracked files** from your working directory. These are files that Git doesn't know about (not staged, not committed, not in `.gitignore`). It's useful when you want a pristine working directory.

## What are Untracked Files?

Untracked files are files that exist in your working directory but haven't been added to Git's tracking with `git add`. Examples:
- Build artifacts accidentally created
- Test output files
- Files you created temporarily while experimenting

## Basic Usage

> ⚠️ **Warning:** `git clean` permanently deletes files! Always use `--dry-run` first.

```bash
# ALWAYS run this first to see what would be deleted
git clean -n
git clean --dry-run

# Remove untracked files (NOT directories)
git clean -f

# Remove untracked files AND directories
git clean -fd

# Remove untracked files AND ignored files too
git clean -fx

# Remove everything including ignored files and directories
git clean -fdx
```

## Flags Explained

| Flag | Meaning |
|------|---------|
| `-n` / `--dry-run` | Preview what would be deleted (don't actually delete) |
| `-f` / `--force` | Required to actually delete (safety guard) |
| `-d` | Also remove untracked directories |
| `-x` | Also remove files ignored by `.gitignore` |
| `-X` | Remove ONLY ignored files (not regular untracked) |
| `-i` | Interactive mode — choose files to remove |

## Safe Workflow

```bash
# Step 1: Always preview first
git clean -nfd

# Output: 
# Would remove build/
# Would remove temp-test.js
# Would remove node_modules/ (if not in .gitignore)

# Step 2: If output looks right, then actually clean
git clean -fd
```

## Interactive Mode (-i)

For more control, use interactive mode:

```bash
git clean -id
```

Git presents a menu:
1. Clean — remove all listed files
2. Filter — select which to remove
3. Select by numbers
4. Ask each — confirm each file individually

## Common Use Cases

```bash
# After a build, clean up artifacts
git clean -fd

# Reset to exact state of last commit (including untracked)
git reset --hard HEAD
git clean -fd

# Remove only .log files
git clean -f "*.log"

# Clean everything including ignored build artifacts
git clean -fdx
```

## git clean vs git stash

| Scenario | Use |
|----------|-----|
| Want to temporarily save untracked files | `git stash -u` (stash + untracked) |
| Want to permanently discard untracked files | `git clean -fd` |
| Unsure — want to preview | `git clean -nfd` |
