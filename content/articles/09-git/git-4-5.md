---
title: "Searching Git History"
description: "Learn how to search through your Git history to find specific commits, code changes, and authors — using git log grep, git log -S pickaxe, git log -G regex, and git log -L line-level tracking."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---

# Searching Git History

Git has powerful search capabilities built into `git log` that let you find specific commits, track when a particular piece of code was added or removed, and debug regressions without manually reviewing every commit.

## Searching Commit Messages (--grep)

Find commits whose message contains a specific string:

```bash
# Case-sensitive search in commit messages
git log --grep="authentication"

# Case-insensitive search
git log --grep="authentication" -i

# Combine multiple patterns (must match all)
git log --grep="auth" --grep="bug" --all-match

# Combine patterns (match any)
git log --grep="auth" --grep="bug"

# With one-liner output
git log --grep="Fix:" --oneline
```

## Searching Code Changes (-S "Pickaxe")

Find commits that **added or removed** a specific string — perfect for tracking when code was introduced:

```bash
# Find commits that changed the number of occurrences of "secretKey"
git log -S "secretKey"

# Find who first introduces a specific function
git log -S "function calculateTax"

# Show the changes too
git log -S "calculateTax" -p

# Search across all branches
git log -S "calculateTax" --all
```

## Searching with Regex (-G)

Similar to `-S` but matches commits where the **diff matches the regex**:

```bash
# Find commits where a regex matches in the diff
git log -G "auth.*middleware"

# Find commits touching any SQL query
git log -G "SELECT.*FROM"

# Detailed view with diff
git log -G "console\.log" -p
```

**Difference between -S and -G:**
- `-S "text"`: Commits where the count of the string changed (added or removed)
- `-G "regex"`: Commits where the diff matches the regex (even just changed)

## Finding Commits by Author

```bash
git log --author="Jane"
git log --author="jane@company.com"
git log --author="Jane\|Bob"   # Multiple authors
```

## Tracking Line-Level History (-L)

Track the history of a specific line range or function:

```bash
# Track history of lines 10-30 in a file
git log -L 10,30:src/auth.js

# Track history of a specific function
git log -L :calculateTax:src/tax.js
git log -L :login:src/auth.js

# This shows every commit that touched those lines
```

## Finding Deleted Files

```bash
# Find commits that deleted a specific file
git log --all --full-history -- deleted-file.js

# Restore the file from the commit before it was deleted
git checkout <hash>^ -- deleted-file.js
```

## Searching by Date

```bash
git log --after="2024-01-01"
git log --before="2024-06-30"
git log --after="2024-01-01" --before="2024-06-30"
git log --since="1 month ago"
git log --until="yesterday"
```

## Combining Search Options

```bash
# Find bug fix commits by a specific author in a date range
git log \
  --author="Jane" \
  --grep="fix" -i \
  --after="2024-01-01" \
  --oneline

# Find commits that removed the word "deprecated"
git log -S "deprecated" --diff-filter=D --oneline
```

## The --all-match Flag

By default, `--grep` is OR (match any). Use `--all-match` for AND:

```bash
# Only commits matching BOTH "auth" AND "login"
git log --grep="auth" --grep="login" --all-match
```

These search tools make it fast to navigate project history, understand when specific behavior was introduced, and identify the root cause of bugs.
