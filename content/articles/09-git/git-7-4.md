---
title: "Three-Way Merge"
description: "Understand how Git performs three-way merges, the role of the common ancestor in the merge algorithm, how conflicts arise, and what Git does to resolve them automatically versus manually."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Three-Way Merge

When two branches have diverged (both have new commits since they split), Git uses a **three-way merge** algorithm to combine the changes. This is Git's default merge strategy and the foundation of how collaborative development works.


## What is a Three-Way Merge?

A three-way merge involves **three commits**:

1. **The common ancestor (merge base):** The last commit that both branches share.
2. **The tip of the current branch (ours):** The latest commit on the branch you're merging into.
3. **The tip of the branch being merged (theirs):** The latest commit on the branch being merged.

```
      Base
     /    \
 Ours    Theirs
```

Git uses these three points to determine:
- What changed in "ours" relative to the base?
- What changed in "theirs" relative to the base?
- Where do these changes overlap or conflict?


## The Three-Way Merge Algorithm

For each line in the resulting file, Git applies the following logic:

| Base | Ours | Theirs | Result |
|------|------|--------|--------|
| Same | Same | Same | Use the line (unchanged) |
| Same | Changed | Same | Use "ours" change |
| Same | Same | Changed | Use "theirs" change |
| Same | Changed | Changed (same change) | Use the change |
| Same | Changed | Changed (different) | **CONFLICT** |
| Same | Deleted | Same | Delete the line |
| Same | Same | Deleted | Delete the line |
| Same | Changed | Deleted | **CONFLICT** |


## Visualizing a Three-Way Merge

**Commit graph:**

```
main:    A → B → C
                  ↑
feature: A → B → D → E
         ↑
         (B is the merge base)
```

If you run `git merge feature` from `main`:

1. Git finds `B` as the merge base (common ancestor)
2. Git computes: "What changed in `main` from `B` to `C`?"
3. Git computes: "What changed in `feature` from `B` to `E`?"
4. Git applies both sets of changes to create a new merge commit `M`

**After merge:**

```
main:    A → B → C → M
                  ↘  ↗
feature: A → B → D → E
```


## Automatic Merging

When changes are in **different parts of the files** (no overlap), Git merges them automatically:

```bash
git switch main
git merge feature/login
```

If no conflicts:

```
Merge made by the 'ort' strategy.
 src/auth.js    | 30 ++++++++++++++++++
 src/login.html | 25 +++++++++++++++++
 2 files changed, 55 insertions(+)
```


## When Conflicts Occur

Conflicts arise when **both branches modified the same lines differently** since their common ancestor.

Git marks conflicts with conflict markers:

```
<<<<<<< HEAD
// main branch version
const timeout = 5000;
=======
// feature branch version
const timeout = 3000;
>>>>>>> feature/login
```

- Lines between `<<<<<<< HEAD` and `=======` are from your current branch.
- Lines between `=======` and `>>>>>>> feature/login` are from the branch being merged.


## The Merge Base

You can find the exact merge base that Git will use:

```bash
git merge-base main feature/login
# Output: abc1234...  (the common ancestor commit hash)
```

```bash
# See what changed since the merge base (in main)
git diff $(git merge-base main feature/login) main

# See what changed since the merge base (in feature)
git diff $(git merge-base main feature/login) feature/login
```


## Tools for Understanding Three-Way Merges

### Visual Diff Tools

Set up a visual merge tool to make three-way merges easier:

```bash
# Configure VS Code as merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# Start the merge tool for conflicts
git mergetool
```

The three-way view in VS Code shows:
- **Left panel:** Your changes (current branch / "ours")
- **Center panel:** The result file (what you're editing)
- **Right panel:** The incoming changes (the branch being merged / "theirs")


## Conclusion

The three-way merge is the heart of Git's collaboration model. By identifying what changed in each branch relative to their common ancestor, Git can automatically combine most changes while clearly marking the areas that need human judgment (conflicts). Understanding this algorithm helps you approach conflicts with confidence and make the right choices when resolving them.
