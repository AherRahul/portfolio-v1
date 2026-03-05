---
title: "Rebase Conflicts"
description: "Learn how to handle conflicts during a git rebase — understand why rebase conflicts differ from merge conflicts, how to resolve them commit by commit, and how to continue or abort the rebase."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Rebase Conflicts

When rebasing commits onto a new base, conflicts can occur just as they do during merging. However, rebase conflicts work differently — they appear **one commit at a time**, as Git replays each commit onto the new base.


## How Rebase Conflicts Differ from Merge Conflicts

During a **merge**, all changes are combined at once and any conflicts are presented together.

During a **rebase**, each commit is applied one by one. If a commit conflicts, Git pauses and you must resolve that specific commit's conflicts before moving to the next one.

This means a rebase with 5 conflicting commits could require 5 separate conflict resolution steps.


## When a Rebase Conflict Occurs

```bash
git switch feature/login
git rebase main
```

If a conflict occurs:

```
Auto-merging src/auth.js
CONFLICT (content): Merge conflict in src/auth.js
error: could not apply abc1234... Add login validation
hint: Resolve all conflicts manually, mark them as resolved with
hint: "git add/rm <conflicted_files>", then run "git rebase --continue".
hint: You can instead skip this commit: run "git rebase --skip".
hint: To abort and get back to the state before "git rebase", run "git rebase --abort".
```

Notice that Git tells you **exactly which commit** is being applied: "Add login validation".


## Resolving Rebase Conflicts

### Step 1: Check Status

```bash
git status
```

Output:

```
interactive rebase in progress; onto abc1234
Last command done (1 command done):
   pick def5678 Add login validation
No commands remaining.
...
Unmerged paths:
  both modified:   src/auth.js
```

### Step 2: Open and Resolve Conflicting Files

Open the conflicting file(s), look for conflict markers, and resolve them:

```javascript
<<<<<<< HEAD
// From the new base (main)
const validateEmail = (email) => EMAIL_REGEX.test(email);
=======
// From the commit being rebased
const validateEmail = (email) => email.includes('@');
>>>>>>> abc1234... (Add login validation)
```

Edit to the desired resolution:

```javascript
const validateEmail = (email) => EMAIL_REGEX.test(email);  // Use the regex approach
```

### Step 3: Stage the Resolved File

```bash
git add src/auth.js
```

### Step 4: Continue the Rebase

```bash
git rebase --continue
```

Git applies the next commit and repeats until all commits have been replayed (or more conflicts occur).


## Rebase Control Commands

```bash
# Continue after resolving conflicts in the current commit
git rebase --continue

# Skip the current commit entirely (don't apply it)
git rebase --skip

# Abort the rebase and return to the original state
git rebase --abort
```


## Understanding --skip vs --continue

- **`--continue`:** Used after resolving conflicts. Continues replaying the next commit.
- **`--skip`:** Completely skips the current commit from your branch (be careful — this drops changes from that commit).

Skip is useful when a commit's changes were already integrated into the base branch (making the commit redundant).


## Tips for Handling Rebase Conflicts

1. **Use `git rerere`:** Enable `git rerere` to automatically re-apply previously recorded conflict resolutions during rebases.

2. **Rebase onto the latest base:** Always pull the latest changes from the target branch before rebasing to minimize the divergence window.

3. **Smaller commits = fewer conflicts:** Smaller, focused commits cause fewer conflicts and are easier to reason about when resolving.

4. **Use a visual merge tool:**
   ```bash
   git mergetool   # Opens configured visual tool for conflict resolution
   ```

5. **If overwhelmed, abort and reconsider:**
   ```bash
   git rebase --abort   # Returns everything to the pre-rebase state
   ```
   Then consider merging instead, or rebasing in smaller chunks.
