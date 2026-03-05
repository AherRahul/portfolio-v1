---
title: "Git Log Formatting"
description: "Master git log output formatting — custom formats, pretty-print options, graph visualization, date formats, and building your own powerful log aliases for better history navigation."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---

# git log Formatting

`git log`'s output is highly customizable. Mastering formatting lets you build the perfect view of your repository history for any situation.

## Built-in Format Options (--pretty)

```bash
# One-line summary per commit
git log --oneline
# abc1234 Add user authentication

# Full human-readable format
git log --pretty=full

# Raw format (all fields)
git log --pretty=fuller

# Email-style format
git log --pretty=email

# Short format
git log --pretty=short
```

## Custom Format (--format or --pretty=format:)

Use placeholders to build your own format:

```bash
# Custom one-line with hash, author, date, and message
git log --format="%h %an %ar %s"
# abc1234 Jane Doe 2 days ago Add authentication

# All common placeholders:
# %H = Full commit hash
# %h = Short hash
# %an = Author name
# %ae = Author email
# %ad = Author date
# %ar = Author date relative
# %cn = Committer name
# %s = Subject (first line of message)
# %b = Body (rest of message)
# %d = Decorations (branch/tag names)
# %n = Newline
# %Cred %Cgreen %Cblue = Colors
# %Creset = Reset color
```

## Adding Colors

```bash
# Colorful, informative log
git log --format="%C(bold blue)%h%Creset - %C(dim white)%an%Creset %C(green)%ar%Creset - %s"
```

A popular verbose format:

```bash
git log --graph \
  --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' \
  --abbrev-commit
```

## Graph View

```bash
# ASCII graph of branch history
git log --graph --oneline --all

# Beautiful graph with branches
git log --graph --oneline --decorate --all

# Full graph with full messages
git log --graph --pretty=fuller --all
```

## Date Format Options

```bash
# Relative times ("2 hours ago")
git log --format="%ar %s"

# ISO 8601
git log --format="%ci %s"

# Short date
git log --format="%ad %s" --date=short
# 2024-01-15 Add authentication

# Custom date format
git log --format="%ad %s" --date=format:'%Y-%m-%d %H:%M'

# Relative by default
git log --date=relative
```

## Filtering Combined with Formatting

```bash
# Last 10 commits, one line each
git log -10 --oneline

# Commits by specific author, compact
git log --author="Jane" --oneline

# Commits in date range with stats
git log --after="2024-01-01" --stat

# Commits on specific file with diff
git log --follow -p -- src/auth.js

# Compact: only show the most changed files
git log --dirstat --oneline -10
```

## Useful Aliases for log

Store these in `~/.gitconfig`:

```ini
[alias]
    # One-line log with relative dates and decorations
    lg = log --oneline --graph --decorate --all

    # Pretty graph log
    ll = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

    # Show what changed today (your commits)
    today = log --since=midnight --author='Your Name' --oneline

    # Compact with stats
    ls = log --oneline --stat

    # Changes to specific file
    lf = log --follow --oneline --

    # Pretty log with relative dates and author
    lb = log --format='%C(bold blue)%h%Creset %C(green)%ar%Creset %s %C(dim white)- %an%Creset'
```

## gitk — Visual Log Browser

```bash
# Launch built-in GUI log browser
gitk                  # Current branch
gitk --all            # All branches
gitk -- src/auth.js   # Only affecting this file
```

Modern alternatives:
- **VS Code:** GitLens or Git Graph extension
- **GitHub Desktop:** Visual history browser
- **Sourcetree:** Advanced GUI for Git
- **tig:** Terminal-based browser (`brew install tig`)
