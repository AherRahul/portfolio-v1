---
title: "Resolving Conflicts"
description: "Learn how to identify, understand, and resolve Git merge conflicts step by step — using both command-line tools and visual merge tools, and best practices to minimize future conflicts."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Resolving Conflicts

Merge conflicts are an inevitable part of collaborative development. They occur when Git cannot automatically combine changes from different branches because the same parts of the same files were modified differently. Understanding how to resolve them confidently is a crucial skill.


## When Do Conflicts Occur?

Conflicts occur when:
- **Both branches modified the same lines** in a file differently.
- **One branch deleted a file** that the other branch modified.
- **Both branches added a file** with the same name but different content.

Git will pause the merge and tell you:

```
Auto-merging src/auth.js
CONFLICT (content): Merge conflict in src/auth.js
Automatic merge failed; fix conflicts and then commit the result.
```


## Identifying Conflicts

To see which files have conflicts:

```bash
git status
```

Output:

```
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   src/auth.js
        both modified:   src/config.js
```


## Understanding Conflict Markers

When a conflict occurs, Git inserts conflict markers into the affected file:

```javascript
<<<<<<< HEAD
// Your version (current branch / "ours")
const SESSION_TIMEOUT = 5000;
const MAX_RETRIES = 3;
=======
// Incoming version (branch being merged / "theirs")
const SESSION_TIMEOUT = 3000;
const MAX_RETRIES = 5;
>>>>>>> feature/login
```

- `<<<<<<< HEAD` — The start of the conflicting section from your current branch
- `=======` — The separator between the two versions
- `>>>>>>> feature/login` — The end of the conflicting section from the incoming branch


## Resolving Conflicts Step by Step

### Step 1: View All Conflicting Files

```bash
git status
# or
git diff --name-only --diff-filter=U  # Show only unmerged files
```

### Step 2: Open and Edit Each Conflicting File

Open the file in your editor and look for conflict markers. You have three choices:

1. **Keep "ours":** Delete the incoming changes and conflict markers.
2. **Keep "theirs":** Delete your changes and conflict markers.
3. **Keep both / create a new solution:** Edit to combine the best of both.

```javascript
// Resolution: keep both values, but use a more sensible combined approach
const SESSION_TIMEOUT = 3000;  // Use shorter timeout for better UX
const MAX_RETRIES = 5;         // Use more retries for resilience
```

**Important:** After resolving, make sure no conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) remain in the file.

### Step 3: Stage the Resolved Files

After resolving each conflict:

```bash
git add src/auth.js
git add src/config.js
```

### Step 4: Complete the Merge

```bash
git commit
# Git pre-fills the merge commit message with branch info
```


## Using a Visual Merge Tool

Many developers prefer visual tools for resolving conflicts:

```bash
# Configure VS Code as merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# Launch the merge tool
git mergetool
```

Other popular tools: IntelliJ IDEA, Sourcetree, GitKraken, Meld, P4Merge.

The typical three-panel view shows:
- **Left panel (Ours):** Your current branch changes
- **Center panel:** The editable result
- **Right panel (Theirs):** The incoming branch changes


## Conflict Resolution Strategies

### Taking One Side Entirely

If you know you want all changes from one side:

```bash
# Accept all changes from the current branch (ours)
git checkout --ours src/conflicting-file.js
git add src/conflicting-file.js

# Accept all changes from the incoming branch (theirs)
git checkout --theirs src/conflicting-file.js
git add src/conflicting-file.js
```


## Best Practices to Minimize Conflicts

1. **Merge `main` into your feature branch regularly** to stay synchronized:
   ```bash
   git switch feature/login
   git merge main   # Bring in latest changes
   ```

2. **Make commits small and focused** — large, sprawling commits create more conflicts.

3. **Communicate with your team** when working on the same files.

4. **Use a linter and formatter** that ensures consistent code style, reducing cosmetic conflicts.

5. **Complete features quickly** — the longer a branch lives, the more opportunities for conflict.


## Aborting a Merge

If conflicts are overwhelming or you made a mistake, abort the merge:

```bash
git merge --abort
```

This restores your working directory to the state it was in before the merge attempt.
