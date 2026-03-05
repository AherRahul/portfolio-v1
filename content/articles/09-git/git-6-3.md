---
title: "git switch"
description: "Learn how to use git switch to change branches safely, create new branches, handle uncommitted changes during switching, and understand why switch is preferred over checkout for branch operations."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# git switch

The `git switch` command is a relatively recent addition to Git (introduced in version 2.23), designed to simplify and clarify the process of switching branches. It serves a specific purpose that helps to distinguish the intent of branch switching from other operations, particularly the more complex `git checkout`.


## The Purpose of git switch

The primary purpose of `git switch` is to **change branches** in your Git repository. While `git checkout` can do this, it also handles other tasks such as restoring files or checking out specific commits. This duality can lead to unintended consequences, like accidentally overwriting changes.

`git switch` focuses **solely on branch switching**, making it clearer and safer for users.

When you run `git switch`, Git performs several operations:

1. Updates the `HEAD` pointer to the desired branch.
2. Updates the working directory to match the state of that branch.
3. If there are uncommitted changes in your working directory, Git checks if those changes can be applied to the target branch.

This clarity helps developers understand their actions better, promoting safer workflows.


## Basic Usage of git switch

The simplest form of the `git switch` command:

```bash
git switch <branch-name>
```

For example, to switch from `main` to `feature/new-ui`:

```bash
git switch feature/new-ui
```

If you run this command while on the `main` branch, Git will change your working directory to the state of the `feature/new-ui` branch.

> **Note:** If you have uncommitted changes that conflict with the branch you are switching to, Git will block the switch to prevent potential conflicts or loss of work.


## Creating and Switching Branches

One of the powerful features of `git switch` is its ability to create and switch to a new branch in a single command using the `-c` flag (create):

```bash
git switch -c <new-branch-name>
```

This command is equivalent to running:

```bash
git branch <new-branch-name>
git switch <new-branch-name>
```

In practice:

```bash
git switch -c feature/login
```

This creates a new branch called `feature/login` and switches to it immediately. 

To create and switch to a branch based on a remote branch:

```bash
git switch -c feature/login origin/feature/login
```


## Handling Uncommitted Changes

What happens if you attempt to switch branches with uncommitted changes?

In scenarios where the changes in your working directory conflict with the files in the target branch, Git will prevent the switch and display an error message. This safety feature is designed to protect your work.

To manage this situation, you have several options:

### Stash Your Changes

If you're not ready to commit, temporarily store your changes using `git stash`:

```bash
git stash
git switch other-branch
# Work on other-branch...
git switch -    # Switch back to previous branch
git stash pop   # Retrieve your stashed changes
```

### Commit Your Changes

If the changes are ready to be committed:

```bash
git add .
git commit -m "Save progress on feature"
git switch other-branch
```

### Discard Changes

If you don't need the changes:

```bash
git restore .       # Discard all working directory changes
git switch other-branch
```

> **Caution:** Discarding changes is irreversible. Make sure you don't lose any important work.


## Understanding the Context of Switching

When switching branches, it's important to understand the context of your current changes and the relationship between branches.

```
         HEAD
          ↓
A → B → C (main)
         ↘
          D → E (feature/login)
```

When you `git switch feature/login`, your working directory will reflect the changes made in commits `D` and `E`. The files will appear as they were last committed on the `feature/login` branch.

Use `git log --oneline --graph --decorate` to get a visual representation of your commit history and understand where branches diverge before switching.


## git switch vs git checkout

| Operation | `git switch` | `git checkout` |
|-----------|-------------|----------------|
| Switch to branch | `git switch <branch>` | `git checkout <branch>` |
| Create and switch | `git switch -c <branch>` | `git checkout -b <branch>` |
| Restore a file | ❌ Use `git restore` | `git checkout -- <file>` |
| Detached HEAD | `git switch --detach <hash>` | `git checkout <hash>` |
| Remote branch | `git switch -c local origin/remote` | `git checkout -b local origin/remote` |

**Recommendation:** Use `git switch` for branch operations and `git restore` for file operations. This clear separation of responsibilities leads to safer, more intentional Git workflows.
