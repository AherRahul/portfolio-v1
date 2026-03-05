---
title: "Reordering Commits"
description: "Learn how to reorder commits in Git using interactive rebase, understand the implications of changing commit order, and when reordering makes sense for a cleaner history."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Reordering Commits

Sometimes the order in which you made commits doesn't tell the clearest story about your work. Git's interactive rebase allows you to **reorder commits** to create a more logical, readable history before sharing your work.


## How to Reorder Commits

Use `git rebase -i` to start an interactive rebase:

```bash
git rebase -i HEAD~5   # Reorder among the last 5 commits
```

Git opens an editor with a list of commits (oldest first):

```
pick a1b2c3 Add login form HTML
pick d4e5f6 Add user database schema  
pick g7h8i9 Add form CSS styles
pick j0k1l2 Add login validation logic
pick m3n4o5 Write login unit tests
```

To reorder, simply **change the order of the lines**:

```
pick a1b2c3 Add login form HTML
pick g7h8i9 Add form CSS styles
pick j0k1l2 Add login validation logic
pick d4e5f6 Add user database schema
pick m3n4o5 Write login unit tests
```

Save and close the editor. Git replays commits in the new order.


## When Reordering Makes Sense

- **Grouping related changes:** Put all UI commits together, all backend commits together.
- **Creating a logical story:** Order commits so each one builds naturally on the previous.
- **Separating concerns:** Move a refactor commit before the feature commits that depend on it.

**Example — Before reordering:**

```
abc Added user dashboard
def Fixed typo in header
ghi Added user settings page
jkl Implemented API endpoint
```

**After reordering (logical story order):**

```
abc Fixed typo in header          ← Fix goes first (standalone)
def Implemented API endpoint       ← API before UI
ghi Added user dashboard           ← UI that uses the API
jkl Added user settings page       ← Additional UI feature
```


## Risks of Reordering

Reordering commits can cause conflicts if later commits depend on earlier ones. For example, if commit B introduces a function that commit A uses, swapping them would cause compilation errors.

If reordering causes a conflict:

```bash
# Resolve the conflict, then continue
git add <conflicted-file>
git rebase --continue

# Or abort and go back
git rebase --abort
```


## Combining Reordering with Other Operations

You can combine reordering with squashing, rewording, and other operations in a single interactive rebase session:

```
reword a1b2c3 Add login form HTML  ← Fix the commit message
pick g7h8i9 Add form CSS styles
squash j0k1l2 fix css typo         ← Squash this into the previous one
pick d4e5f6 Add user database schema
pick m3n4o5 Write login unit tests
```

**Best practice:** Reorder commits so that logically related commits are adjacent, making squashing easier.


## After Reordering

Since reordering rewrites history (creates new commit hashes), you'll need to force-push if you've already pushed the branch:

```bash
git push --force-with-lease origin feature/login
```

> **Important:** Only reorder commits on branches that only you are working on. Never reorder shared/public branch history.
