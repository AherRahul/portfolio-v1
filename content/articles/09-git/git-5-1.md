---
title: "git restore"
description: "Learn how to use git restore to discard working directory changes, unstage files, and restore files from specific commits without altering history."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# git restore

If you've ever found yourself in a situation where you made changes to a file in your Git repository and wanted to go back to a previous state without disrupting your commit history, you're not alone. The `git restore` command is a powerful tool designed for undoing changes in a more granular way. It allows you to selectively discard changes in your working directory or staging area, providing a safety net for your workflows.


## What is git restore?

The `git restore` command was introduced in Git 2.23 as part of a larger effort to simplify the command-line interface. Its primary purpose is to **restore files in the working directory or the staging area**. While it may seem similar to `git checkout`, `git restore` is more focused and user-friendly for undoing changes.

When you use `git restore`, you're interacting specifically with the contents of your files, either to discard changes you've made or to bring back a version from the repository. This command acts on the following three primary areas:

- **Working directory:** The files you're actively editing.
- **Staging area (index):** The files that are ready to be committed.
- **Repository:** The historical commits where you can pull previous versions of files.


## Discarding Changes in the Working Directory

One of the most common scenarios for using `git restore` is to discard uncommitted changes in your working directory. This is particularly useful when you've made modifications to a file and realize you want to revert those changes.

### Basic Usage

To discard changes in a file:

```bash
git restore <filename>
```

This command will reset the specified file in your working directory to the state of the last commit. For example:

```bash
git restore example.txt
```

After executing this command, `example.txt` will go back to the last committed state, losing all uncommitted changes.

> **Warning:** Be cautious with `git restore` as it **permanently discards** any uncommitted changes in the specified file(s). Always ensure you really want to lose those changes.

### Discarding Changes in Multiple Files

You can restore multiple files at once:

```bash
git restore file1.js file2.js
```

Or discard all changes in the working directory:

```bash
git restore .
```


## Restoring Staged Changes

If you've added files to the staging area but want to **unstage** them (move them back to the working directory without losing the changes), use the `--staged` flag:

### Unstaging Files

```bash
git restore --staged <filename>
```

For example:

```bash
git restore --staged auth.js
```

This removes `auth.js` from the staging area but keeps your changes in the working directory. You can then re-stage only the parts you want.

### Unstaging Multiple Files

```bash
git restore --staged .
```

This unstages all staged files, putting them back in the working directory.


## Restoring to a Specific Commit

What if you want to restore a file to its state at a specific commit in the past?

### Restoring from a Commit

Use the `--source` flag to specify a commit:

```bash
git restore --source=<commit-hash> <filename>
```

For example, to restore `config.json` to its state 3 commits ago:

```bash
git restore --source=HEAD~3 config.json
```

Or to restore from a specific commit hash:

```bash
git restore --source=abc1234 config.json
```

This restores the file content from that commit but keeps it **unstaged** in your working directory, so you can review it before deciding whether to commit it again.


## Real-World Use Cases

### Mistaken Edits

You've accidentally edited the wrong file:

```bash
git restore wrong-file.js
```

This immediately reverts it to the last committed state.

### Pre-Commit Adjustments

You've staged too many changes and want to be selective about what goes into the commit:

```bash
git restore --staged feature.js   # Unstage this file
git restore --staged helper.js    # Unstage this file too

# Now only the files you want remain staged
git commit -m "Implement specific feature only"
```

### Experimentation with Version History

You want to temporarily look at an older version of a file to understand how it worked:

```bash
git restore --source=v1.0.0 utils.js
# Review the old version...
# Then restore it back to HEAD
git restore utils.js
```


## git restore vs git checkout vs git reset

| Command | What it does |
|---------|-------------|
| `git restore <file>` | Discard working directory changes for a file |
| `git restore --staged <file>` | Unstage a file (keep working directory changes) |
| `git checkout <file>` | Old way to do what `git restore` does (avoid in newer Git) |
| `git reset HEAD <file>` | Old way to unstage (avoid in newer Git) |
| `git reset --hard` | Discard ALL changes to ALL files AND move HEAD (dangerous) |


## Summary

The `git restore` command is a safe and focused tool for undoing specific changes without affecting your commit history. Use it to:

- Discard working directory changes (`git restore <file>`)
- Unstage staged changes (`git restore --staged <file>`)
- Restore files from historical commits (`git restore --source=<hash> <file>`)

In the next chapter, we'll look at `git reset`, which operates at a higher level — moving the branch pointer itself rather than just restoring individual files.
