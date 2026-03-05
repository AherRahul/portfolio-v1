---
title: "git blame"
description: "Learn how to use git blame to see who last modified each line of a file, trace the origin of changes, work with blame options, and use it effectively for code review and debugging."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---

# git blame — Line-by-Line History

`git blame` annotates each line of a file with the commit hash, author, and timestamp of the last commit that modified that line. It helps you understand *who* wrote each piece of code and *when*.

## Basic Usage

```bash
git blame filename.js
```

Output:

```
abc1234 (Jane Doe       2024-01-15 10:20:30 +0000  1) function authenticateUser(token) {
def5678 (John Smith     2023-12-01 09:15:00 +0000  2)   if (!token) return null;
abc1234 (Jane Doe       2024-01-15 10:20:30 +0000  3)   const decoded = jwt.verify(token, SECRET);
g9h0i1j (Alice Johnson  2024-02-20 14:30:00 +0000  4)   if (decoded.expired) throw new Error('Token expired');
def5678 (John Smith     2023-12-01 09:15:00 +0000  5)   return decoded.user;
abc1234 (Jane Doe       2024-01-15 10:20:30 +0000  6) }
```

Each line shows:
1. Abbreviated commit hash
2. Author name
3. Commit date and time
4. Line number
5. Line content

## Common Options

```bash
# Show full commit hash
git blame -l filename.js

# Show email address instead of name
git blame -e filename.js

# Blame only a specific line range
git blame -L 10,30 filename.js  # Lines 10 through 30
git blame -L 10,+20 filename.js # Lines 10 through 10+20=30

# Blame a file at a specific commit
git blame abc1234 -- src/auth.js

# Blame a file at a specific tag
git blame v1.0.0 -- src/auth.js

# Ignore whitespace changes
git blame -w filename.js

# Detect code moved from another file in the same commit
git blame -C filename.js

# Detect code moved from ANY commit
git blame -CCC filename.js
```

## Blaming Specific Line Ranges

```bash
# Show blame for only lines 15-25
git blame -L 15,25 src/auth.js

# Using a function name (requires ctags)
git blame -L :authenticateUser src/auth.js
```

## Practical Use Cases

### Investigating a Bug

```bash
# You see suspicious code on line 42
git blame -L 42,42 src/payment.js
# abc1234 (Dave Lee 2024-03-01 ...) processPayment without validation

git show abc1234  # See the full commit context
```

### Code Reviews

```bash
# See who wrote the code you're reviewing
git blame src/newfeature.js | grep "John"  # Lines by specific author
```

### Understanding Context

```bash
# Who wrote this section and when was it last touched?
git blame -L 50,80 src/core.js
```

## git annotate (Alias)

`git annotate` is an older alias for `git blame` with slightly different output format:

```bash
git annotate src/auth.js
```

## Limitations of git blame

- Blame shows the **last** commit to touch each line, not necessarily who originally wrote it.
- Reformatting commits (like changing indentation) will update the blame without a logic change.
- Use `-w` to ignore whitespace changes, or `-C` to detect copy/paste across files.

## In IDE Integration

Most editors integrate git blame directly:
- **VS Code:** GitLens extension shows inline blame on each line
- **JetBrains IDEs:** Built-in "Annotate" view
- **GitHub:** Click any line number → "View git blame"
