---
title: "Committing Changes"
description: "Learn how to commit changes in Git effectively using git commit, understand commit objects, commit best practices, and common commit flags like --amend."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Committing Changes (git commit)

When you're ready to solidify your changes in Git, you need to use `git commit`.

A commit is Git's way of taking a **snapshot** of your project at a specific moment in time. It captures exactly what's in the staging area and saves it into your repository's history, along with a message that explains **why** the change was made.


## The Commit Process

When you run `git commit`, Git takes everything that's currently staged (the changes you added with `git add`) and turns it into a new **commit object**. You can think of this as saving a new checkpoint in your project's history.

That commit object contains three key pieces of information:

1. **A snapshot** of your files as they exist in the staging area.
2. **Metadata** — such as the author, timestamp, and commit message.
3. **A pointer** to the previous commit, which links this new commit into the existing chain of history.

You can visualize this as a simple commit graph:

```
A → B → C
```

When you create a new commit, it points to the previous commit (`C`), creating a new state:

```
A → B → C → D
```

Here, `D` is the new commit you just created, and it points back to `C` as its parent. This linked structure is what allows Git to move through your history, compare different points in time, and let you rewind or branch your work safely.


## Basic Usage of git commit

The simplest way to create a commit is by running:

```bash
git commit -m "Your commit message"
```

The `-m` flag allows you to specify the commit message directly in the command line.

Always aim to write **meaningful commit messages** that clearly describe the changes made. This will help both you and your collaborators understand the history later.

> **Note:** If you forget to stage files before committing, Git will remind you that there are no changes to commit. Remember, `git commit` only works with staged changes.

### Example

```bash
# Stage the file
git add file.txt

# Commit with a descriptive message
git commit -m "Fix: Update file.txt to resolve processing issue"
```

In this example, `file.txt` is staged for commit, and the commit message conveys the context of the changes made.


## Commit Options and Flags

Git provides several options with `git commit` that enhance its functionality.

### `--amend`

If you want to change the most recent commit (for example, to edit the commit message or add missed changes), you can use the `--amend` flag:

```bash
git commit --amend
```

This command will replace the last commit with a new one that includes both the previous changes and any new modifications staged.

> **Warning:** Amending a commit alters history. Avoid using this on commits that have already been pushed to shared repositories, as it can lead to confusion and conflicts.

### `--no-edit`

If you want to amend the commit without changing its message:

```bash
git commit --amend --no-edit
```

This is useful for quickly adding changes to your last commit while keeping the original message intact.

### `--dry-run`

Before committing, you might want to see what changes will be included without actually making any commits:

```bash
git commit --dry-run
```

This allows you to verify your staged changes without altering any commit history.


## Understanding Commit Objects

When you create a commit, Git doesn't just save "some changes." It creates a **commit object** with a well-defined structure.

Each commit object contains:

- **A tree** — a reference to the snapshot of your project's files at that moment.
- **One or more parent commits** — which link it to the previous commit(s) and form your project's history.
- **Author and committer information** — including names, email addresses, and timestamps.

Together, these pieces allow Git to reconstruct how your project looked at any point in time and to support powerful features like branching, merging, and rebasing.

### Exploring the .git Directory

All of this data lives inside the hidden `.git` directory at the root of your repository. Commit objects are stored there under filenames derived from their SHA-1 hashes.

If you'd like to inspect a commit "by hand," you can use:

```bash
git cat-file -p <commit_hash>
```

This command prints the raw contents of the commit object, including its tree reference, parent commit(s), and metadata. It's a great way to see how Git actually represents the commits you work with every day.


## Best Practices for Commits

To maintain a clean and efficient commit history, consider the following best practices:

- **Commit Often, but Meaningfully:** Make commits that encapsulate a complete thought or feature. Avoid committing every minor change.
- **Use Branches for Features:** Keep your commits organized by working on feature branches. This allows you to develop in isolation.
- **Review Before Committing:** Use `git diff --cached` to review what will be committed. This helps catch mistakes beforehand.
- **Keep Commits Atomic:** Each commit should represent a single logical change. This makes it easier to revert specific changes if needed.

By following these practices, you'll create a commit history that is not only clean but also highly useful for collaboration and debugging.

In the next chapter, we will look at how to view the current state of your repository using `git status`.
