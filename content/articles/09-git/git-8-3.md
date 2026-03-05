---
title: "Interactive Rebase"
description: "Master git rebase -i (interactive rebase) to rewrite commit history — squash commits, reorder commits, edit commit messages, split commits, and drop unwanted commits before sharing your work."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Interactive Rebase

Interactive rebase (`git rebase -i`) is one of Git's most powerful tools for **rewriting commit history**. It lets you modify commits before they become part of the permanent record — squashing messy WIP commits, reordering, editing commit messages, and more.


## Starting an Interactive Rebase

```bash
git rebase -i HEAD~N      # Rebase last N commits
git rebase -i <commit>    # Rebase all commits after <commit>
git rebase -i main        # Rebase all commits on current branch not in main
```

For example, to edit the last 3 commits:

```bash
git rebase -i HEAD~3
```

Git opens an editor with a list of commits:

```
pick abc1234 Add login form UI
pick def5678 Fix typo in login form
pick g9h0i1j Add form validation

# Rebase abc1234..g9h0i1j onto abc1234 (3 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
```

Commits are listed **oldest first** (top = oldest, bottom = newest).


## Available Commands

### pick

Keep the commit as-is. This is the default.

```
pick abc1234 Add login form UI
```

### reword (r)

Keep the commit but change its message.

```
reword abc1234 Add login form UI
```

Git will pause and open the editor for you to write a new message.

### edit (e)

Pause after applying the commit to amend it (add files, change code, split it).

```
edit abc1234 Add login form UI
```

When Git pauses:

```bash
# Make your changes
git add additional-file.js
git commit --amend   # Amend the commit
git rebase --continue
```

### squash (s)

Combine this commit with the **previous commit**. Git opens the editor to combine the messages.

```
pick abc1234 Add login form UI
squash def5678 Fix typo in login form
squash g9h0i1j Add form validation
```

Result: All three commits become one, and you choose the final message.

### fixup (f)

Like `squash` but **discards the commit message** (just keeps the code changes).

```
pick abc1234 Add login form UI
fixup def5678 Fix typo in login form
```

The fixup commit's message is thrown away — no editor prompt.

### drop (d)

Remove the commit entirely.

```
drop abc1234 Accidentally committed node_modules
```


## Common Interactive Rebase Use Cases

### Squashing "WIP" Commits

When you've been committing frequently with messages like "WIP", "fix", "more fixes":

**Before:**

```
pick a1b2c3 Add payment feature
pick d4e5f6 WIP
pick g7h8i9 fix
pick j0k1l2 more fixes
pick m3n4o5 actually finish payment feature
```

**After editing (squash all WIP into the main commit):**

```
pick a1b2c3 Add payment feature
fixup d4e5f6 WIP
fixup g7h8i9 fix
fixup j0k1l2 more fixes
pick m3n4o5 actually finish payment feature
```

Or better (combine everything):

```
pick a1b2c3 Add payment feature
fixup d4e5f6 WIP
fixup g7h8i9 fix
fixup j0k1l2 more fixes
fixup m3n4o5 actually finish payment feature
```

### Reordering Commits

Simply change the order of lines in the editor:

**Before:**

```
pick abc Add login
pick def Add payment
pick ghi Add profile
```

**After (move payment to after profile):**

```
pick abc Add login
pick ghi Add profile
pick def Add payment
```

### Editing a Past Commit Message

```bash
git rebase -i HEAD~3
# Change `pick` to `reword` on the commit you want to fix
reword abc1234 Old bad message
```

Git pauses and lets you write a new message.


## After the Rebase

After interactive rebase:

```bash
# Commits have new hashes, so force push is needed for remote branches
git push origin feature/login --force-with-lease
```

> **Never interactive-rebase commits that have been pushed to a shared branch** that others are working from.
