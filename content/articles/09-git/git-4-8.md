---
title: "git show"
description: "Learn how to use git show to inspect any Git object — commits, tags, trees, and blobs — and view the details and diffs associated with a specific commit or reference."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---

# git show — Inspecting Git Objects

`git show` displays information about any Git object (commits, tags, blobs, trees). Most commonly, it shows the details of a specific commit — the metadata and the complete diff.

## Basic Usage

```bash
# Show the most recent commit (HEAD)
git show

# Show a specific commit
git show abc1234

# Show a commit by short hash
git show abc1234

# Show a commit referenced by a branch
git show feature/login

# Show a tagged commit
git show v1.0.0

# Show a commit relative to HEAD
git show HEAD~3   # 3 commits back
git show HEAD^    # 1 commit back (same as HEAD~1)
```

## Output Format

`git show` for a commit displays:

```
commit abc1234def5678... (HEAD -> main, origin/main)
Author: Jane Doe <jane@example.com>
Date:   Mon Jan 15 10:20:30 2024 +0000

    Add JWT authentication

    Implements JWT token generation and validation for user sessions.
    Closes #234

diff --git a/src/auth.js b/src/auth.js
index... 100644
--- a/src/auth.js
+++ b/src/auth.js
@@ -1,5 +1,15 @@
+const jwt = require('jsonwebtoken');
+
+function generateToken(user) {
+  return jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '7d' });
+}
...
```

## Showing Specific Files

```bash
# Show only changes to a specific file in a commit
git show abc1234 -- src/auth.js

# Show just the content of a file at a specific commit
git show abc1234:src/auth.js

# Show the file at HEAD
git show HEAD:src/auth.js
```

## Formatting Options

```bash
# Show without the diff (just metadata)
git show --stat abc1234

# Show a summary of what changed
git show --stat

# Show file names only
git show --name-only

# Show names with status (A=added, M=modified, D=deleted)
git show --name-status

# Custom format
git show --format="%h %an %s" --no-patch

# No patch (metadata only)
git show --no-patch abc1234
```

## Showing Tags

```bash
# Show tag object details (annotated tag)
git show v1.0.0

# Output includes:
# tag v1.0.0
# Tagger: Jane Doe <jane@example.com>
# Date: ...
# Release v1.0.0
# 
# Then shows the tagged commit details
```

## Showing Tree and Blob Objects

```bash
# Show the directory tree of a commit
git show HEAD^{tree}

# Show contents of a specific blob (file)
git show HEAD:package.json

# Show the tree at HEAD
git ls-tree HEAD
```

## Practical Examples

```bash
# What exactly changed in the last commit?
git show

# Review a specific commit before cherry-picking
git show abc1234 --stat

# Check what a file looked like 5 commits ago
git show HEAD~5:src/database.js

# Show the last commit that touched auth.js
git log --oneline -1 -- src/auth.js | awk '{print $1}' | xargs git show
```

## git show vs git log

| Command | Purpose |
|---------|---------|
| `git log` | Browse commit history (list of commits) |
| `git show` | Inspect a specific commit (details + diff) |
| `git diff` | Compare states (working dir, staging, commits) |
| `git cat-file` | Low-level object inspection |
