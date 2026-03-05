---
title: "git add"
description: "Master git add — the command for staging changes in Git. Learn all syntax variants, interactive staging, patch mode, and best practices for preparing precise commits."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---

# git add — Adding Files to the Staging Area

`git add` is the command you use to move changes from your **working directory** into the **staging area** (also called the index). It tells Git which changes you want to include in your next commit.

## The Three-State Model Reminder

```
Working Directory  →  git add  →  Staging Area  →  git commit  →  Repository
```

`git add` bridges the working directory and the staging area.

## Basic Syntax

```bash
# Stage a specific file
git add filename.js

# Stage multiple files
git add file1.js file2.js

# Stage all changes in the current directory (tracked + new)
git add .

# Stage all changes in the entire repository
git add -A
# or
git add --all
```

## Staging Specific Files vs. All Files

```bash
# Stage everything — use when all changes belong together
git add .

# Stage specific files — use when you want multiple targeted commits
git add src/auth.js           # Only stage auth changes
git commit -m "Add auth logic"

git add src/payment.js        # Only stage payment changes
git commit -m "Add payment logic"
```

## Interactive Staging (-i)

Launch an interactive menu to select which files to stage:

```bash
git add -i
```

Options in interactive mode:
- `s` — Status (see staged/unstaged)
- `u` — Update (stage modified tracked files)
- `r` — Revert (unstage files)
- `a` — Add untracked
- `p` — Patch (stage specific hunks)

## Patch Mode (-p)

Stage specific **chunks (hunks)** of a file rather than the entire file:

```bash
git add -p
# or
git add --patch
```

Git shows each changed hunk and asks:
- `y` — Stage this hunk
- `n` — Skip this hunk
- `s` — Split into smaller hunks
- `e` — Edit hunk manually
- `q` — Quit

Patch mode enables **surgical commits** where one file has unrelated changes you want to split into separate commits.

## Staging New vs. Modified Files

```bash
# git add . stages: modified files, new files, deleted files
git add .

# git add -u stages: ONLY modified and deleted (not new untracked files)
git add -u

# git add -A stages: everything (same as git add .)
git add -A
```

## Viewing What's Staged

After staging, check what will be committed:

```bash
git status              # See which files are staged
git diff --staged       # See the exact changes that are staged
git diff --cached       # Same as --staged
```

## Unstaging Files

If you staged something by mistake:

```bash
git restore --staged filename.js   # Unstage (keep changes in working dir)
git reset HEAD filename.js         # Older equivalent
```

## Best Practices

1. **Stage related changes together** — Each commit should tell one logical story.
2. **Use `git add -p`** for files with multiple unrelated changes.
3. **Review before staging:** Run `git diff` to check what you're staging.
4. **Avoid `git add .` blindly** — make sure your `.gitignore` is set up properly first.
