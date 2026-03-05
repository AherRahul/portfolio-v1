---
title: "git bisect"
description: "Learn how to use git bisect to efficiently find the commit that introduced a bug using binary search, and automate the process with scripts."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# git bisect

When a mysterious bug sneaks into your codebase, it can feel like searching for a needle in a haystack. You know it's there, but pinpointing the exact commit that introduced it can be a daunting task. `git bisect` is a powerful tool that allows you to efficiently track down the source of the issue by using a **binary search algorithm**.


## What is Git Bisect?

`git bisect` is a command-line tool that helps you identify which commit introduced a bug by performing a **binary search** through your commit history. This means instead of checking each commit one by one, it allows you to halve the number of commits you need to check after each test.

The goal is to get to the problematic commit as quickly as possible.

### How It Works

The basic idea behind `git bisect` is to mark a known **good commit** (where the code is functioning correctly) and a known **bad commit** (where the bug exists).

From there, `git bisect` will check out a commit in the middle of the range. If the bug is present in that commit, it will move the search to the earlier commits; if not, it will check later commits.

This continues until the specific commit with the bug is identified.

### Commit Graph Visualization

To visualize how this works, imagine a series of commits:

```
A → B → C → D → E → F → G → H
```

If `A` is good and `H` is bad, `git bisect` will first test `E`. Depending on whether `E` is good or bad, it will then search either the left half (`A-D`) or the right half (`F-H`). This continues until it narrows down to the specific commit.

In the worst case, binary search requires only log₂(n) tests instead of n tests — for 100 commits, that's just 7 tests!


## Getting Started with Git Bisect

### Step 1: Initiate Bisect

Navigate to your repository and start `git bisect`:

```bash
git bisect start
```

### Step 2: Mark Bad and Good Commits

Mark the current commit as bad (the one with the bug):

```bash
git bisect bad
```

Now, specify a known good commit (a commit hash, branch name, or tag where the bug didn't exist):

```bash
git bisect good v1.0.0
# or
git bisect good abc1234
```

Git will now check out a commit in the middle of your range.

### Step 3: Test the Commit

Test the checked-out commit. Run your tests or manually verify if the bug exists:

```bash
npm test
# or manually verify the behavior
```

If the commit is good (no bug), mark it:

```bash
git bisect good
```

If the bug is still present, mark it bad:

```bash
git bisect bad
```

### Step 4: Repeat Until Done

Continue testing the commits until you narrow down to the specific commit that introduced the bug. Once you find it, you will see a message like:

```
b3c4d5e6f is the first bad commit
commit b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2
Author: John Smith <john@example.com>
Date:   Wed Dec 3 14:22:11 2025 +0000

    Refactor authentication module
```

To finish the bisect session and return to your original branch:

```bash
git bisect reset
```


## Automating Tests

`git bisect` becomes even more powerful when you automate the testing with a script:

```bash
git bisect start
git bisect bad HEAD
git bisect good v1.0.0

# Automatically run tests and bisect
git bisect run npm test
```

When using `git bisect run`, Git will automatically mark commits as good or bad based on the exit code of your command:
- Exit code `0` = good commit
- Exit code `1-127` (non-zero) = bad commit
- Exit code `125` = skip this commit (use when you can't test this particular commit)


## Real-World Use Cases

### Debugging Production Issues

When a production bug is reported, you can use `git bisect` to quickly identify the commit that introduced the regression:

```bash
git bisect start
git bisect bad HEAD      # Current code is broken
git bisect good v2.1.0  # Last known good release

git bisect run python test_suite.py
```

### Collaborative Development

In large teams, `git bisect` helps you pinpoint which team member's commit introduced a problem without manual investigation through dozens of commits.


## Tips and Tricks

### Viewing Commit Details

When `git bisect` checks out a commit, you can inspect what changed:

```bash
git show HEAD   # See what's in the current bisect commit
git log HEAD -5 # See recent commits around this point
```

### Skipping Commits

If a commit can't be tested (e.g., build fails, or it's unrelated), skip it:

```bash
git bisect skip
```

### Handling Multiple Bugs

If you find multiple bugs, address each one separately. Start a new `git bisect` session for each bug to avoid confusion.


## Troubleshooting Common Issues

### Forgetting to Reset

If you forget to run `git bisect reset` after finding the bug, your repository will remain in bisect state. Running any `git bisect` command will remind you. Always reset when done.

### Incorrect Commit Marks

If you accidentally mark a good commit as bad or vice versa, reset and start over:

```bash
git bisect reset
git bisect start
```

### Large Repositories

For very large repositories with thousands of commits, even binary search might take many iterations. Consider using `git bisect good v2.0.0` (a more recent known-good state) to reduce the search range.


## Conclusion

`git bisect` is an invaluable tool for debugging regressions in complex codebases. By using binary search to trace the exact commit that introduced a bug, you can save hours of manual investigation and quickly focus your debugging efforts where they matter most.
