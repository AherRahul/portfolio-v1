---
title: "Renaming Files"
description: "Learn how to rename and move files in Git using git mv, understand how it maintains file history, and follow best practices for file organization."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# Renaming Files (git mv)

Git is an incredibly powerful tool for managing code, but it can feel overwhelming at times. One of the fundamental tasks you will encounter is moving or renaming files within your repository. Understanding how to do this effectively can save you time and prevent confusion later on.

Enter `git mv`, a command that simplifies this process while keeping your history intact.


## The Basics of git mv

The `git mv` command serves a dual purpose: it allows you to **move files from one location to another** or **rename them** in your Git repository. Unlike simply using shell commands to move or rename files, `git mv` not only performs the action but also **stages the changes for you** in one step.

### How it Works

When you execute `git mv`, Git updates its index to reflect the new location or name of the file. Under the hood, it effectively removes the file from its old location and adds it to the new one. This results in a single commit that captures both the deletion of the original file reference and the addition of the new one.

#### Command Syntax

```bash
git mv <source> <destination>
```

- `<source>`: The current path of the file or directory.
- `<destination>`: The new path or name for the file or directory.

If you are moving a directory that contains multiple files, `git mv` will recursively move all the files within that directory.


## Practical Examples

### Moving a Single File

Suppose you have a file named `app.js` in your project root and you want to move it into a `src` directory:

```bash
git mv app.js src/app.js
```

This command:
- Moves `app.js` from the root to the `src` directory.
- Stages the move for the next commit.

Running `git status` after this operation shows:

```
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        renamed:    app.js -> src/app.js
```

### Renaming a File

To rename `app.js` to `main.js`:

```bash
git mv app.js main.js
```

Again, `git status` will show:

```
Changes to be committed:
        renamed:    app.js -> main.js
```

This single command captures the rename and stages it, making your next commit cleaner and more intuitive.

### Moving a Directory

To move an entire directory:

```bash
git mv utils/ src/utils/
```

This moves the `utils` directory and all its contents into `src/`, staging all the changes at once.


## Why Use git mv?

Using `git mv` instead of manually moving or renaming files and then staging the changes with `git add` has several advantages:

### Automatic Staging

`git mv` automatically stages the move or rename operation, so you don't have to run `git add` separately. This streamlines your workflow.

### Clear Commit History

When you use `git mv`, Git recognizes the operation as a rename in the commit history. This makes it easier for collaborators to understand what happened to a file.

### Avoiding Mistakes

Manually moving files and then forgetting to stage the deletion of the old file is a common mistake. `git mv` handles this atomically, reducing the chance of errors.


## Common Pitfalls

### Moving Non-Tracked Files

If you try to move a file that isn't tracked by Git (not added to the repository), `git mv` will fail. Ensure the file is tracked before attempting to move it.

```bash
git mv untracked-file.txt new-location/  # Error: not under version control
```

### Case Sensitivity on Different File Systems

Be aware that different operating systems handle case sensitivity differently. On macOS and Windows (with default settings), the filesystem may be case-insensitive, but Git tracks files case-sensitively. Renaming `file.txt` to `File.txt` might not work as expected on these systems.

```bash
# Workaround for case-only rename on case-insensitive systems:
git mv file.txt temp.txt
git mv temp.txt File.txt
```


## Viewing Changes After git mv

### Checking Status

After using `git mv`, you can verify the changes by running `git status`. It will display the renamed or moved files under "Changes to be committed."

### Inspecting History

Once you commit the move, you can inspect the history to see the rename:

```bash
git log --follow -p src/app.js
```

The `--follow` flag allows Git to track the file even after it has been renamed, giving you a complete history of the file.


## Best Practices

### Commit After Moving

After using `git mv`, commit your changes promptly with a clear message:

```bash
git mv utils/ src/utils/
git commit -m "Refactor: Move utils directory to src/"
```

### Use Descriptive Names

When renaming files, choose names that clearly reflect the file's purpose. This makes the code more maintainable and helps collaborators understand the project structure.

### Organize Your Project Structure

Use `git mv` to gradually improve your project's structure. Having a well-organized file structure makes it easier for new contributors to navigate and understand the codebase.


## Conclusion

`git mv` is an indispensable tool for any developer working with Git. It simplifies the process of moving and renaming files while maintaining clean history and staging changes automatically. By understanding the nuances of `git mv`, you can keep your project well-organized and ensure that changes are clearly tracked in your commit history.
