---
title: "git show"
description: "Learn how to use git show to inspect commits, view changes, examine tags and other Git objects, and effectively review project history."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# git show

Understanding how to view the details of your Git history is crucial for effective version control. Among the tools available in Git, `git show` stands out as a powerful command for inspecting the contents and changes of commits, tags, and other objects. This command allows you to dive deep into the specifics of your project's evolution, making it an essential part of any developer's toolkit.


## Overview of Git Show

At its core, `git show` is designed to display information about a specific commit or Git object. By default, when you run `git show` followed by a commit hash, it reveals the changes introduced in that commit along with relevant metadata such as the author, date, and commit message.

This command is beneficial for various tasks, including:

- Reviewing changes before merging.
- Understanding the context of a specific commit.
- Finding detailed information about tags and branches.

The versatility of `git show` comes from its ability to present not just changes but also the history behind them.

### The Basic Syntax

```bash
git show <commit-hash>
```

For example:

```bash
git show a3d4f21
```

Or to see the most recent commit:

```bash
git show HEAD
```


## Understanding the Output

When you execute `git show`, the output includes several key components:

**1. Commit Metadata:**
- **Author:** The individual who made the commit.
- **Date:** When the commit was made.
- **Commit hash:** A unique identifier for the commit.
- **Commit Message:** This provides context for why the changes were made.

**2. Diff Output:**

The most significant part of `git show` is the diff, which displays the changes made in that commit. It shows lines added (prefixed with `+`) and lines removed (prefixed with `-`).

Example output:

```
commit a3d4f21e9f4b3c7d2e8a6f891b2c3d4e5f6a7b8c
Author: Jane Doe <jane@example.com>
Date:   Mon Dec 6 10:23:45 2025 +0000

    Add user authentication feature

diff --git a/src/auth.js b/src/auth.js
new file mode 100644
index 0000000..e69de29
--- /dev/null
+++ b/src/auth.js
@@ -0,0 +1,15 @@
+const bcrypt = require('bcrypt');
+
+async function hashPassword(password) {
+  const saltRounds = 10;
+  return await bcrypt.hash(password, saltRounds);
+}
```


## Common Use Cases

### Reviewing a Commit Before Merging

Before merging a feature branch into the main branch, you can use `git show` to review the specific commit you're about to incorporate:

```bash
git show feature-branch
```

This ensures you understand all the changes that are about to be integrated.

### Inspecting Tags

You can use `git show` to view the details of a tag, including the annotation and the commit it points to:

```bash
git show v1.0.0
```

### Checking Changes in Branches

To see what changed in the latest commit on a different branch:

```bash
git show other-branch
```


## Options and Modifiers

### Specify Formats

You can control the output format of `git show`:

```bash
# Show only the commit message
git show --format="%s" <hash>

# Show in "format" style with custom fields
git show --format="%h - %an, %ar : %s" <hash>
```

### Show Specific Files

To see only the changes to a specific file in a commit:

```bash
git show <commit-hash> -- src/app.js
```

### Diff Options

```bash
# Show only file names that changed
git show --name-only <hash>

# Show statistics (lines added/removed per file)
git show --stat <hash>

# Ignore whitespace changes
git show -w <hash>
```


## Handling Common Mistakes

### Wrong Commit Hash

If you provide an incorrect commit hash, Git will display an error. Use `git log` to find the correct hash:

```bash
git log --oneline
# Copy the correct hash, then:
git show abc1234
```

### Overwhelming Output

For large commits with many changes, the output of `git show` can be overwhelming. Use options like `--stat` for a summary, or `--name-only` to see just the affected files first before drilling into specifics.


## Conclusion

`git show` is a versatile command that gives you direct access to the details of any commit, tag, or Git object. Whether you're reviewing changes before a merge, investigating a bug introduced in a specific commit, or examining what a tag contains, `git show` provides the focused information you need.
