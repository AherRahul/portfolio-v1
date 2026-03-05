---
title: "Adding Files"
description: "Learn how to use git add to stage changes, understand the role of the staging area, and follow best practices for selecting the right changes to commit."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Adding Files to Staging Area (git add)

Understanding how to properly use `git add` is crucial for developers looking to manage their source code effectively. This command is the gateway between your working directory and the staging area, where changes are prepared for commit.


## The Role of git add

At its core, `git add` does one simple but powerful thing: it takes changes you've made in your working directory and prepares them for the next commit.

Git doesn't commit your edits automatically. Instead, it uses the staging area to keep track of exactly which changes should go into the next snapshot.

When you run `git add`, you're effectively telling Git:

> "These are the changes I want to include in my next commit."

Later, when you run `git commit`, Git takes whatever is staged and turns it into a permanent commit in your repository's history.


## Basic Usage

The most common usage of `git add` is very direct:

```bash
git add <file>
```

This command adds the specified file to the staging area. For example:

```bash
git add app.js
```

This stages the current version of `app.js` for the next commit.

You can also stage **multiple files** by listing them:

```bash
git add file1.js file2.js file3.js
```

If you want to stage **all modified and newly created files** in the current directory and its subdirectories:

```bash
git add .
```

This is convenient, but it also means you should be careful — you might stage more than you intended if you're not paying attention.

### Working with Directories

You can also add entire directories:

```bash
git add src/
```

This stages all changes inside the `src` directory (and any of its subdirectories): new files, modified files, and deleted files. It's a quick way to stage a whole part of your project when you know all the changes in that folder belong together in a single commit.

### Staging Specific Parts of a File (Patch Mode)

Sometimes you only want to stage part of a file — for example, when you've made two unrelated changes in the same file and want to commit them separately. You can use the `-p` (patch) flag:

```bash
git add -p <file>
```

Git will show you each "hunk" (chunk of changes) one at a time and ask you what to do with it. You can stage it (`y`), skip it (`n`), split it into smaller hunks (`s`), or manually edit it (`e`). This gives you incredibly fine-grained control over what goes into each commit.


## Verifying What's Staged

After staging files, it's a good practice to verify what's in the staging area before committing:

```bash
git status
```

This shows you which files are staged for commit vs. which are still unstaged.

You can also see the exact diff of what's staged:

```bash
git diff --staged
```

This is especially helpful before running `git commit` to catch any accidental inclusions.


## Best Practices for Using git add

As you become more comfortable with `git add`, consider these best practices to maintain a clean and manageable commit history.

### Commit Related Changes Together

When using `git add`, aim to stage changes that are related to the same logical task. For instance, if you're fixing a bug, stage all changes related to that bug fix together. This makes your commit history clearer and more meaningful.

### Use .gitignore Wisely

Ensure you have a proper `.gitignore` file in place. This file tells Git which files or directories to ignore, preventing them from being accidentally staged. Typical examples include:

- Build artifacts
- Log files  
- Dependency directories (`node_modules/`)
- Environment files (`.env`)

### Stage with Intent

Instead of running `git add .` mindlessly, take the time to review changes with `git status` and `git diff`. This ensures you're only staging what you truly want to commit, reducing the likelihood of including unwanted changes.

```bash
# Review changes first
git status
git diff

# Then selectively stage
git add specific-file.js
```


## Conclusion

Now that you understand how to use `git add` to prepare your changes for commit, you're ready to explore the next step in the Git workflow — **committing** those changes.

In the next chapter, we will look at how to finalize your modifications and share them with your team, ensuring your commits tell a coherent story.
