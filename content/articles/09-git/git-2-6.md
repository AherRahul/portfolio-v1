---
title: "Viewing Status"
description: "Learn how to use git status to monitor your working directory and staging area, understand different file states, and optimize your Git workflow."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Checking Status (git status)

Understanding the state of your repository is essential for working effectively with Git. The `git status` command shows you exactly what's going on in your working directory and staging area: which files are untracked, which are modified, and which are ready to be committed.


## What git status Does

At its core, `git status` provides a summary of your current repository state. It tells you:

- Which files have been modified in your working directory
- Which changes are staged and ready to commit
- Which files are untracked by Git
- The current branch you're on and how it relates to its remote counterpart

```bash
git status
```

### Understanding the Output

The output of `git status` provides valuable information organized into clear sections:

1. **Branch Information:** The first line indicates the current branch you are on and its relation to the remote branch. If your branch is behind or ahead of the remote, this line will alert you.

2. **Changes to be Committed (Staged):** Files in this section have been added to the staging area with `git add`. They will be included in your next commit.

3. **Changes Not Staged for Commit:** Files that have been modified but not yet added to the staging area. These changes will NOT be included in your next commit unless you stage them.

4. **Untracked Files:** New files in your working directory that Git is not tracking. They need to be added explicitly.

Understanding these sections helps you make informed decisions on whether to stage changes, commit them, or address untracked files.


## Practical Use Cases

The `git status` command is invaluable in numerous real-world scenarios.

### Before Committing Changes

Imagine you've been working on multiple files. Before committing, running `git status` can help you verify that you are including the correct changes.

```bash
git add fileA.txt fileB.txt
git status
# Output shows: fileA.txt and fileB.txt are staged for commit
```

This output confirms that both files are staged for commit. You can now safely proceed to commit, knowing these are the changes you intended to include.

### After Merging

After performing a merge, it's critical to review your repository's state. Merge conflicts can arise, and `git status` will inform you of any files that need your attention.

```bash
git merge feature-branch
git status
# Shows: conflicting-file.txt - both modified (needs resolution)
```

In this case, `git status` indicates that `conflicting-file.txt` requires resolution before you can proceed.

### Managing Untracked Files

When you create new files, they often remain untracked until you decide to add them. Running `git status` frequently helps you manage these files, ensuring nothing important goes unnoticed.

```bash
git status
# Shows: newFile.txt is untracked
```

If this file is important for your project, you can add it to the staging area with `git add newFile.txt`.


## Advanced Options

### Short Status

If you prefer a more concise output, use the `-s` or `--short` flag:

```bash
git status -s
```

This displays a compact two-character status code for each file:
- `M` — Modified
- `A` — Added
- `D` — Deleted
- `??` — Untracked

### Using Aliases

To speed up your workflow, you can create a Git alias for `git status`:

```bash
git config --global alias.st status
```

Now you can simply type `git st` to check your repository's status.

### Checking Specific Paths

You can limit `git status` output to a specific directory or file:

```bash
git status src/
```

This focuses the output on only the files within the `src/` directory.


## Common Mistakes and Recovery

### Forgetting to Stage Changes

One common mistake is forgetting to add a newly created file to the staging area before committing. If you realize you've missed a file, you can simply add it and then use `git commit --amend` to include it in your last commit.

```bash
git add missed-file.txt
git commit --amend --no-edit
```

### Confusing Untracked with Ignored Files

Files listed in `.gitignore` won't appear in `git status` at all, while untracked files do appear. If a file seems to be missing from `git status`, check your `.gitignore` file to see if it matches a pattern.

### Resolving Merge Conflicts

When `git status` shows "both modified" files, it means there are merge conflicts. You need to edit those files manually to resolve conflicts, then stage and commit them.

```bash
# Edit conflicted files to resolve conflicts
git add resolved-file.txt
git commit -m "Resolve merge conflicts"
```


## Conclusion

The `git status` command is one of the most frequently used Git commands. It gives you a real-time picture of your repository's state and helps you make informed decisions about what to stage, commit, or ignore. Make it a habit to run `git status` before and after key operations to stay in control of your Git workflow.
