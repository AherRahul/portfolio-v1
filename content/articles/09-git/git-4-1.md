---
title: "git log"
description: "Master git log to view commit history, filter commits by author or date, customize output format, and visualize branching history in your Git repository."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Viewing Commit History (git log)

Understanding the history of your project is crucial when working with Git. The `git log` command serves as your **time machine**, allowing you to see a detailed history of all your commits. It is not just a list of changes; it provides context, authorship, dates, and much more.


## The Basics of git log

At its core, `git log` displays the commit history of your repository. When you run this command, Git traverses the commit graph and presents a chronological list of commits. Each entry contains vital information, including:

- **Commit Hash:** A unique identifier for the commit (SHA-1).
- **Author:** The person who made the changes.
- **Date:** When the commit was created.
- **Commit Message:** A brief description of what changes were made.

### Basic Usage

```bash
git log
```

Output will look similar to:

```
commit 9a3c6723ab6b9e4e2e9c9a5e4b5f1e321e5b926e
Author: Jane Doe <jane@example.com>
Date:   Mon Dec 6 10:23:45 2025 +0000

    Add user authentication feature

commit 7b1d2345cd3c7e5e3e8d8b4e3c4f2e432e6c837f
Author: John Smith <john@example.com>
Date:   Sun Dec 5 15:47:22 2025 +0000

    Fix: Resolve null pointer exception in payment module
```

### Understanding the Output

Each log entry is a snapshot of the project at the time of the commit. The commit message is particularly important — a well-written commit message can save time later when you need to track down when and why changes were made.


## Customizing git log Output

While the default output is useful, you can customize `git log` to display information according to your needs.

### Format Options

Using the `--pretty` (or `--format`) flag, you can change how the output looks:

```bash
# Condense each commit to a single line
git log --oneline

# Pretty formatting with colors and stats
git log --pretty=format:"%h - %an, %ar : %s"
```

Custom format placeholders:
- `%h` — abbreviated commit hash
- `%an` — author name
- `%ar` — time since commit (e.g., "2 weeks ago")
- `%ad` — author date
- `%s` — commit message subject
- `%H` — full commit hash

### Filtering Output

You can filter the log based on several criteria:

**By Author:**

```bash
git log --author="John Smith"
```

**By Date Range:**

```bash
git log --since="2 weeks ago"
git log --since="2025-01-01" --until="2025-12-31"
```

**By Keyword in Message:**

```bash
git log --grep="authentication"
```

**By File:**

```bash
git log -- src/auth.js
```

**Number of Commits:**

```bash
git log -n 10        # Last 10 commits
git log -5           # Last 5 commits
```

### Combining Options

You can combine options to tailor the output further:

```bash
git log --oneline --author="Jane Doe" --since="1 month ago"
```


## Visualizing Commit History

Sometimes, seeing a graphical representation of your commit history can be more insightful than a flat list. Use the `--graph` option:

```bash
git log --oneline --graph --decorate
```

Output example:

```
* a3d4f21 (HEAD -> main) Merge feature-auth into main
|\
| * b2c3e20 (feature-auth) Add OAuth2 support
| * c1d2e10 Add login endpoint
* | d8e9f11 Update API documentation
|/
* e7f8g00 Initial commit
```

The `--decorate` flag adds branch names and tags to the output. This helps you quickly grasp the structure of your project history, revealing how branches and merges relate to each other.


## Exploring Changes with git log

`git log` is not just about listing commits — it can show you what changes were made too.

By appending the `-p` or `--patch` option, you can see the diffs for each commit:

```bash
git log -p
git log -p --follow src/auth.js   # Track file across renames
```

This command displays each commit along with the exact changes introduced by that commit.


## git shortlog

`git shortlog` is a summary view of your commit history, grouped by author. Instead of listing every commit line by line like `git log`, it collapses them into a readable "who did what" view, often used for changelogs or contribution summaries:

```bash
git shortlog
```

Output:

```
Jane Doe (5):
      Add user authentication feature
      Fix login validation
      Add password hashing
      Set up OAuth2 integration
      Write auth unit tests

John Smith (3):
      Fix null pointer exception
      Update payment module
      Improve error handling
```

With the `-s` flag, you get just summary counts:

```bash
git shortlog -sn    # Sorted by number of commits
```


## Conclusion

`git log` is one of the most powerful and flexible Git commands. By mastering its various options, you can quickly navigate your project's history, understand who made which changes and why, and diagnose issues more efficiently. Make it a habit to use `git log` regularly to stay connected with your project's evolution.
