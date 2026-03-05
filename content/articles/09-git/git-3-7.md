---
title: ".gitignore"
description: "Learn how .gitignore works in Git — syntax patterns, what to ignore, global ignore files, fixing files already tracked, and generating .gitignore templates for different environments."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---

# .gitignore — Ignoring Files

The `.gitignore` file tells Git which files and directories to ignore and never track. It's one of the first things you should set up in every repository.

## Creating a .gitignore

```bash
# Create in the root of your repository
touch .gitignore

# Then commit it
git add .gitignore
git commit -m "Add .gitignore"
```

## .gitignore Syntax

```gitignore
# Comments start with #

# Ignore specific file
secret.env

# Ignore all .log files anywhere
*.log

# Ignore a specific directory (and all contents)
node_modules/

# Ignore all files in a specific folder
build/*

# Ignore only in the root (not in subdirectories)
/dist

# Ignore all files in any directory named "cache"
**/cache/

# Exception: don't ignore this specific file
!important.log

# Ignore all .tmp files in any subdirectory
**/*.tmp
```

## Pattern Rules

| Pattern | Matches |
|---------|---------|
| `*.log` | Any file ending in `.log` |
| `build/` | A directory named `build` |
| `/build` | Only `build` in the root |
| `**/logs` | `logs` directory anywhere |
| `doc/**/*.pdf` | All `.pdf` files in `doc/` |
| `!file.txt` | Exception (don't ignore this) |

## What to Ignore

**Always ignore:**

```gitignore
# Dependencies
node_modules/
vendor/
.venv/

# Build output
dist/
build/
.next/
out/

# Environment and secrets
.env
.env.local
*.pem
*.key

# OS files
.DS_Store
Thumbs.db
desktop.ini

# Editors
.vscode/
.idea/
*.swp

# Logs and coverage
*.log
coverage/
.nyc_output/
```

## Global .gitignore

For files you always want to ignore across ALL projects (like OS and editor files):

```bash
# Create a global gitignore
git config --global core.excludesFile ~/.gitignore_global
```

`~/.gitignore_global`:
```gitignore
.DS_Store
.idea/
*.swp
Thumbs.db
```

## Fixing Files Already Tracked

If you committed a file that should be ignored:

```bash
# Remove from tracking (keeps file locally)
git rm --cached secret.env

# Add to .gitignore
echo "secret.env" >> .gitignore

# Commit the removal
git commit -am "Remove secret.env from tracking"
```

## Generating .gitignore Templates

Use [gitignore.io](https://gitignore.io) to auto-generate templates:

```bash
# Download a Node.js + macOS + VS Code template
curl -L https://gitignore.io/api/node,macos,visualstudiocode > .gitignore
```

Or use GitHub's built-in template when creating a new repository.

## Debugging .gitignore

```bash
# Why is this file being ignored?
git check-ignore -v filename.env
# Output: .gitignore:5:*.env   filename.env

# List all currently ignored files
git ls-files --others --ignored --exclude-standard
```
