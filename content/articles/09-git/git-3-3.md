---
title: "File Permissions"
description: "Understand how file permissions work in Git, how to manage executable bits, handle cross-platform permission issues, and use .gitattributes for permission management."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# File Permissions

Understanding file permissions is crucial in any collaborative development environment, especially when using Git. File permissions dictate who can read, write, or execute a file, and incorrect settings can lead to frustrating issues. While Git primarily focuses on tracking changes to files, understanding how file permissions interact with Git operations is essential for effective version control.


## Basics of File Permissions

At the core of file permissions in Unix-like systems are three primary types of permissions: **read**, **write**, and **execute**. These permissions can be assigned to three categories of users:

- **Owner:** The user who owns the file.
- **Group:** A set of users who share access to the file.
- **Others:** All users who are not the owner or part of the group.

### Symbolic Representation

Permissions are typically shown in symbolic format using the characters `r`, `w`, and `x`:

```
-rwxr-xr--
```

Breaking this down:
- `-` — Regular file (or `d` for directory)
- `rwx` — Owner has read, write, execute
- `r-x` — Group has read and execute
- `r--` — Others have read only

### Octal Representation

Permissions can also be represented as octal numbers:

| Permission | Symbolic | Octal |
|-----------|---------|-------|
| Read      | `r`     | 4     |
| Write     | `w`     | 2     |
| Execute   | `x`     | 1     |
| None      | `-`     | 0     |

Common permission sets:
- `755` = `rwxr-xr-x` (executable by owner, readable/executable by all)
- `644` = `rw-r--r--` (readable by all, writable by owner only)
- `600` = `rw-------` (readable/writable by owner only)


## Setting File Permissions

You can change file permissions using the `chmod` command. This command accepts both symbolic and octal representations.

### Using chmod

```bash
# Using symbolic representation
chmod +x script.sh    # Add execute permission
chmod -x script.sh    # Remove execute permission
chmod 755 script.sh   # Full control for owner, read/execute for others

# Using octal representation
chmod 644 config.txt  # Read/write for owner, read-only for others
```

### Why It Matters in Git

Understanding how to manage file permissions is crucial in a Git context because **Git tracks executable bits for files**. If you accidentally change a file's permissions, it can affect its behavior and potentially break scripts or applications relying on those files.

Git monitors the executable bit (`+x`) of files. If you run `git status` after changing a file's permissions but not its content, Git may report the file as modified.


## Viewing File Permissions

To view file permissions in your repository:

```bash
ls -la
```

This shows a detailed listing with permission bits for each file.

To see how Git tracks permissions:

```bash
git ls-files --stage
```

This shows the file mode along with the staging information. Files with mode `100755` are executable; `100644` are not.


## Common Permission Issues in Git

### 1. Executable Scripts Not Running

When you create a shell script and it's not executable, you need to explicitly add the execute bit:

```bash
chmod +x deploy.sh
git add deploy.sh
git commit -m "Make deploy script executable"
```

### 2. Wrong Permissions After Cloning

When cloning a repository on a different system, file permissions might not transfer correctly. To reset permissions:

```bash
git checkout -- .
```

Or use `git config core.fileMode` to control permission tracking:

```bash
# Disable permission tracking (useful on Windows)
git config core.fileMode false
```

### 3. Git Hooks and Permissions

Git hooks are scripts located in `.git/hooks/`. For hooks to run, they must be executable:

```bash
ls -la .git/hooks/
chmod +x .git/hooks/pre-commit
```

### 4. Collaboration Conflicts

When collaborating across different operating systems (Windows, macOS, Linux), permission conflicts can arise. The `core.fileMode` setting can help:

```bash
# For repositories used across Windows and Unix systems
git config core.fileMode false
```


## Using .gitattributes for Permissions

The `.gitattributes` file allows you to define attributes for specific file patterns, including handling permissions.

### Example of .gitattributes

```
# Mark all shell scripts as executable
*.sh text eol=lf
*.sh diff=bash
```

### Setting Executable Bit in .gitattributes

For ensuring scripts have the right permissions:

```bash
# In .gitattributes
scripts/*.sh eol=lf
```

And then manually ensuring the executable bit is set:

```bash
git update-index --chmod=+x scripts/*.sh
git commit -m "Set executable bit for all shell scripts"
```


## Git and File Permissions on Different Operating Systems

### Unix/Linux

On Unix-like systems, Git fully respects file permissions. The executable bit is tracked, and changing permissions will show up as a modified file in `git status`.

### Windows

Windows has no concept of Unix-style file permissions. By default, Git on Windows doesn't track the executable bit (`core.fileMode = false`). All files are treated as non-executable unless specified.

### Cross-Platform Considerations

When working in teams that span multiple operating systems:

1. Use `.gitattributes` to normalize line endings (`eol=lf` or `eol=crlf`).
2. Disable `core.fileMode` on Windows machines.
3. Explicitly set the executable bit for scripts using `git update-index --chmod=+x`.


## Conclusion

File permissions play an important role in ensuring that your code works correctly across environments and that your Git history accurately reflects the state of your files. By understanding how Git handles permissions, you can avoid common pitfalls and ensure smooth collaboration across different operating systems.
