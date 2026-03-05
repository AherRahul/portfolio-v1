---
title: "git shortlog"
description: "Learn how to use git shortlog to summarize commit history by author — see who contributed what, generate changelogs, and produce formatted contributor lists for your repository."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---

# git shortlog — Commit Summary by Author

`git shortlog` summarizes the output of `git log`, grouping commits by author. It's useful for generating contributor lists, changelogs, and understanding who worked on what.

## Basic Usage

```bash
git shortlog
```

Output:

```
Jane Doe (12):
      Add user authentication
      Fix login bug
      Refactor session management
      ...

John Smith (7):
      Add payment gateway
      Update Stripe integration
      Fix webhook handling
      ...
```

## Options

```bash
# Summarize — show just the count, not commit messages
git shortlog -s

# Sort by number of commits (most commits first)
git shortlog -s -n
# or
git shortlog --summary --numbered

# Email addresses instead of author names
git shortlog -s -n -e

# Case-insensitive author grouping (merges "Jane Doe" and "jane doe")
git shortlog -c

# Commits from a specific date range
git shortlog --after="2024-01-01" --before="2024-12-31"
```

## Generating Contributor Lists

A popular use for `git shortlog -s -n`:

```bash
git shortlog -s -n
```

Output:

```
    47  Jane Doe
    23  John Smith
    15  Alice Johnson
     8  Bob Martinez
```

This is commonly used in open source projects to list contributors (e.g., in CONTRIBUTORS.md).

## Changelog Generation

```bash
# Commits since a specific tag (for release notes)
git shortlog v1.0.0..HEAD

# Output:
# Jane Doe (5):
#       feat: Add OAuth login
#       fix: Handle token expiry
#       ...
#
# John Smith (3):
#       feat: Add payment webhook
#       ...
```

## Comparing Branches

```bash
# Who worked on feature branch that's not yet in main?
git shortlog main..feature/payments

# Who worked in this month?
git shortlog --after="2024-09-01" --before="2024-09-30" -s -n
```

## Combining with grep

```bash
# Bug fix commits, grouped by author
git log --grep="fix" --oneline | awk '{$1=""; print}' # Just messages

# Shortlog only for fix commits
git log --grep="^fix" --format="%an" | sort | uniq -c | sort -rn
```

## Practical Example: Release Notes

```bash
# Generate release notes between v1.0 and v2.0
git shortlog v1.0..v2.0 --no-merges
```

This gives you a clean, organized summary of what changed between releases, grouped by contributor — perfect for changelogs, release announcements, and documenting contribution credits.
