---
title: "git blame"
description: "Learn how to use git blame to track authorship of code lines, identify who introduced specific changes, and use it effectively for debugging and code reviews."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


# git blame

Imagine working on a large codebase with multiple contributors. You encounter a function that appears to be misbehaving. You need to know who introduced it, when it was changed, and perhaps, why it was done. `git blame` reveals the history of each line of code in a file, shedding light on the context behind changes.


## Understanding git blame

At its essence, `git blame` allows you to **track the authorship of each line in a file**. Each line in your code is paired with its last modification details, giving you insights into who made changes and when. This is crucial when you are debugging or reviewing code.

The basic usage:

```bash
git blame <filename>
```

For example:

```bash
git blame src/auth.js
```

This command outputs a list that associates each line of the specified file with the last commit that modified it.

Example output:

```
9a3c6723 (Jane Doe 2025-12-06 10:23:45 +0000   1) const bcrypt = require('bcrypt');
7b1d2345 (John Smith 2025-12-05 15:47:22 +0000  2)
7b1d2345 (John Smith 2025-12-05 15:47:22 +0000  3) async function hashPassword(password) {
a5e7b123 (Jane Doe 2025-12-07 09:15:30 +0000   4)   const saltRounds = 10;
a5e7b123 (Jane Doe 2025-12-07 09:15:30 +0000   5)   return await bcrypt.hash(password, saltRounds);
7b1d2345 (John Smith 2025-12-05 15:47:22 +0000  6) }
```

Each line shows:
- The commit hash of the last modification
- The author of that modification
- The timestamp of the modification
- The line number


## Options and Flags

### Ignoring Whitespace

Often, code formatting or whitespace changes can obscure the true history of a file. Using the `-w` flag helps you ignore whitespace changes when generating the blame output:

```bash
git blame -w src/auth.js
```

This way, you can focus on the substantive changes in the code rather than superficial formatting.

### Limiting the Output

If you only want to see the blame for a specific range of lines, you can specify that range directly:

```bash
git blame -L 10,20 myfile.js
```

This command will show you the blame for only lines 10 through 20 in `myfile.js`.

### Including Author Email

Sometimes, knowing who made a change isn't enough; you also want to know their email for contact. The `-e` flag shows the email of the author alongside each line:

```bash
git blame -e src/auth.js
```

With this, you can reach out to the author for clarification if necessary.

### Showing Commit Summary

To include the commit message in the output:

```bash
git blame -M src/auth.js   # Also track moved lines
git blame -C src/auth.js   # Also track copied lines from other files
```


## Real-World Use Cases

### Debugging Bugs

When a bug is identified in the code, `git blame` helps you quickly find out who introduced the change and when. This information can be invaluable in tracing back through commits to understand what was changed and potentially why.

```bash
# Find who last modified line 42 of auth.js  
git blame -L 42,42 src/auth.js

# Then look at that commit for full context
git show <commit-hash>
```

### Code Reviews

During code reviews, `git blame` can provide context about why certain decisions were made. Understanding the history of a specific function or module can clarify the reasoning behind choices that might not be immediately apparent.

### Analyzing Code Ownership

If you want to understand who primarily owns or maintains different sections of your codebase, `git blame` allows you to quickly analyze the authorship across the entire file.


## Nuances and Tips

### Combining with Other Commands

`git blame` is most powerful when combined with other Git commands:

```bash
# Find out about the commit that last changed a line
COMMIT=$(git blame -L 42,42 src/auth.js | awk '{print $1}')
git show $COMMIT

# Use git log --follow to trace file renames
git log --follow -p src/auth.js
```

### Navigating History for Moved Code

If code was moved from one file to another, `git blame` by default will only show the last commit where the code changed in the current file. Use `-C` to detect copied or moved code:

```bash
git blame -C src/auth.js
```


## Common Mistakes

### Misinterpretation of Output

A common mistake is treating `git blame` output as an accusation tool. Remember, the output shows who **last modified** a line, not who wrote the original logic. Code can be modified for many legitimate reasons (refactoring, bug fixes, formatting), so always interpret the results with context.

### Ignoring Context

`git blame` shows you the last modification of each line, but it doesn't tell you the **why**. Always follow up with `git show <commit-hash>` to see the full context of the commit, including the commit message and related changes.


## Conclusion

`git blame` is one of the most useful tools in a developer's debugging arsenal. It connects lines of code to the commits that introduced them, giving you the context you need to understand, debug, and improve your codebase. Use it not to assign blame, but to build understanding.
