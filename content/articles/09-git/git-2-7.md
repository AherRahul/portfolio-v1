---
title: "Viewing Differences"
description: "Learn how to use git diff to compare file changes, view staged changes, compare commits and branches, and understand diff output format for better code review."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Viewing Changes (git diff)

Understanding the differences between commits, branches, and your current working directory is a vital skill in Git. The `git diff` command is your go-to tool for visualizing those differences. It helps you see what has been changed, added, or removed, and can be a lifesaver in the development process.


## The Basics of git diff

At its core, `git diff` shows the differences between various states of your Git repository. This could be differences between:

- Your working directory and the staging area
- The staging area and the last commit
- Two different commits or branches

The command outputs a **line-by-line comparison** of files, clearly indicating what has changed, been added, or deleted.

### Understanding the Output

The output of `git diff` can seem complex at first glance. Here's how to read it:

- Lines starting with `-` (minus) indicate lines that were **removed**.
- Lines starting with `+` (plus) indicate lines that were **added**.
- Context lines (lines without a prefix) provide surrounding context for the changes.
- The `@@` line indicates the hunk of differences, showing the line range in the original and modified file.

Example output:

```diff
--- a/file.txt
+++ b/file.txt
@@ -1,4 +1,4 @@
 This is line 1.
-This is the old line 2.
+This is the new line 2.
 This is line 3.
 This is line 4.
```


## Comparing Different States

### Working Directory vs. Staging Area

To see the changes you've made in your working directory that haven't yet been staged:

```bash
git diff
```

You can also specify a specific file:

```bash
git diff <filename>
```

This allows you to see what modifications are pending for that specific file before staging or committing.

### Staging Area vs. Last Commit

After staging your changes, you might want to review what you've staged against the last commit. Use the `--cached` (or `--staged`) flag:

```bash
git diff --cached
```

Or for a specific file:

```bash
git diff --cached <filename>
```

This command is particularly useful just before you run `git commit` to ensure that only the desired changes are included in your next commit.

### Working Directory vs. Last Commit

To see all changes since the last commit (both staged and unstaged):

```bash
git diff HEAD
```


## Comparing Commits

### Between Two Commits

Git allows you to compare any two commits. The command format is:

```bash
git diff <commit1> <commit2>
```

For example, to compare the last commit to its immediate predecessor:

```bash
git diff HEAD~1 HEAD
```

You can specify commit hashes, tags, or branch names. For example:

```bash
git diff abc1234 def5678
```

### Between Branches

You can also compare entire branches. This is useful when you want to see what changes are in a feature branch that aren't in the main branch:

```bash
git diff main feature-branch
```

This shows the changes that would be applied to `main` if you were to merge `feature-branch` into it.


## Using Diff Options

The `git diff` command comes with several helpful options.

### Word Diff

To see changes at the word level instead of line level:

```bash
git diff --word-diff
```

This is useful when you've made small edits within a line.

### Stat Option

To see a summary of which files changed and how many lines were added or removed:

```bash
git diff --stat
```

Output example:
```
 src/app.js | 10 ++++--
 README.md  |  5 ++---
 2 files changed, 8 insertions(+), 7 deletions(-)
```

### Name Only

To see only the names of files that have changed:

```bash
git diff --name-only
```

### Ignore Whitespace

To compare files while ignoring whitespace changes:

```bash
git diff -w
```


## Conclusion

`git diff` is an indispensable tool for any Git workflow. Whether you're reviewing your own changes before committing, comparing branches before merging, or investigating what changed between two commits, mastering `git diff` will significantly improve your development confidence and code quality.
