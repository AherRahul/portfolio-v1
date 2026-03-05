---
title: "Removing Files"
description: "Learn how to remove files from Git repositories using git rm, understand options like force removal and keeping local copies, and how to recover accidentally deleted files."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Removing Files (git rm)

Removing files from a Git repository can feel daunting, but with the right understanding of `git rm`, this task becomes straightforward. Let's dive into how this command works, its options, and practical scenarios where it's beneficial.


## What is git rm?

The `git rm` command is used to remove files from both your **working directory** and the **index (staging area)**. This means that not only does it delete the file from your local filesystem, but it also stages this deletion for your next commit.

Unlike simply deleting files with your operating system's file management system (like `rm` or file explorer), using `git rm` ensures that Git tracks the removal and can reflect these changes in your commit history.

### How It Works Under the Hood

When you execute `git rm`, Git performs two key actions:

1. **Removal from the Working Directory:** The specified file is deleted from your local filesystem.
2. **Staging the Removal:** The deletion is staged, which prepares it for the next commit. This change is reflected in the index.


## Basic Usage of git rm

The simplest way to remove a file is:

```bash
git rm file.txt
```

This command does two things: it removes `file.txt` from your working directory and stages this change. It's essential to ensure that you really want to delete the file, as this action cannot be undone without recovery methods.

### Confirming the Removal

After running `git rm`, you can confirm that the file has been staged for removal by using:

```bash
git status
```

You should see a message indicating that the file has been deleted and is ready to be committed:

```
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        deleted:    file.txt
```


## Common Options for git rm

`git rm` comes with several options that can modify its behavior, allowing for greater flexibility in file management.

### Recursive Removal

If you want to remove a directory along with all its contents, use the `-r` option:

```bash
git rm -r directory/
```

This will delete the directory and all files contained within it. Be cautious when using this option, as it permanently removes the directory structure.

### Force Removal

In cases where a file has been modified and is not staged, Git will prevent its removal to avoid data loss. If you're sure you want to remove such a file, use the `-f` option:

```bash
git rm -f modified_file.txt
```

This command forces the removal of `modified_file.txt`, regardless of its state in the working directory.

### Keep the Local Copy (--cached)

Sometimes, you may want to remove a file from the Git index but **keep it in your working directory**. In this case, use the `--cached` option:

```bash
git rm --cached file.txt
```

This command removes `file.txt` from the staging area but leaves it in your working directory. This is useful when you realize a file should not be tracked by Git anymore (for example, a file you forgot to add to `.gitignore`).


## Practical Scenarios for Using git rm

### Cleaning Up Unused Files

As your project evolves, you might accumulate files that are no longer needed. Using `git rm` can help clean up these unnecessary files from your repository:

```bash
git rm old-config.json
git commit -m "Remove unused configuration file"
```

### Untracking Files That Should Be in .gitignore

A common scenario: you committed a file that should have been ignored (like `node_modules/` or `.env`). You can untrack it without deleting it:

```bash
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "Remove .env from tracking, add to .gitignore"
```

### Managing Large Files

If you've accidentally committed large files that shouldn't be in your repository, `git rm` allows you to remove them:

```bash
git rm large-file.zip
git commit -m "Remove accidentally committed large file"
```


## Recovery Methods After Using git rm

Mistakes happen, and sometimes you may accidentally remove a file you didn't intend to. Don't worry — there are ways to recover.

### Recovering a Deleted File (Before Commit)

If you've accidentally removed a file and **haven't committed the change yet**, you can restore it using:

```bash
git restore file.txt
```

This command restores `file.txt` from the last committed state.

### Recovering After a Commit

If you've already committed the removal, you can still recover the file by checking out the previous commit where the file existed:

```bash
git checkout HEAD~1 -- file.txt
```

This command retrieves the file from the commit prior to the last one, effectively restoring it back to your working directory. After restoring, you can commit it again to add it back to the current state.


## Conclusion

Now that you understand how to use `git rm` to cleanly remove files from your repository, you are ready to explore `git mv`. In the next chapter, we will look at how to rename and move files within your project while keeping Git tracking them seamlessly.
