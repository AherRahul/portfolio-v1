---
title: ".gitattributes"
description: "Learn how .gitattributes controls per-file settings in Git — line endings, diff behavior, merge strategies, binary file handling, and export-ignore settings for archives."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---

# .gitattributes — Per-File Git Settings

While `.gitignore` tells Git what to ignore, `.gitattributes` controls *how* Git handles specific files. It allows you to configure line endings, diff tools, merge strategies, and more on a per-file-pattern basis.

## Creating .gitattributes

```bash
touch .gitattributes
git add .gitattributes
git commit -m "Add .gitattributes"
```

## Syntax

```
<pattern>  <attribute>[=<value>]  [<attribute>...]
```

```gitattributes
# Set line endings for all text files
* text=auto

# Force CRLF for Windows-specific files
*.bat    text eol=crlf

# Force LF for shell scripts
*.sh     text eol=lf

# Binary files (no line ending conversion, no diffing content)
*.png    binary
*.jpg    binary
*.pdf    binary
*.zip    binary
```

## Line Ending Normalization

The most common use case — ensuring consistent line endings across different operating systems:

```gitattributes
# Auto-detect text files and normalize to LF in repo, convert on checkout
* text=auto

# Always use LF in repo AND checkout for Unix scripts
*.sh text eol=lf

# Always use CRLF for Windows batch files
*.bat text eol=crlf
*.cmd text eol=crlf

# Mark as binary (no line ending changes)
*.png binary
*.jpg binary
*.gif binary
*.ico binary
*.woff binary
*.ttf binary
```

## Custom Diff for Binary Files

Make binary files more meaningful in diffs:

```gitattributes
# Use exif tool to diff image metadata
*.jpg diff=exif

# Use pandoc to diff Word documents as text
*.docx diff=word
```

Configure the driver:

```bash
git config diff.exif.textconv exiftool
git config diff.word.textconv "pandoc --to=plain"
```

## Merge Strategies

Control how Git merges specific files:

```gitattributes
# Always use "ours" strategy for this file (never merge)
package-lock.json merge=ours

# Use union merge strategy for changelog
CHANGELOG.md merge=union
```

## Export-Ignore

Exclude files from `git archive` exports (used for releases/downloads):

```gitattributes
# These files won't appear in git archive downloads
.gitignore        export-ignore
.gitattributes    export-ignore
tests/            export-ignore
.github/          export-ignore
*.test.js         export-ignore
```

## Linguist Overrides (GitHub)

Control how GitHub detects languages and statistics:

```gitattributes
# Don't count these in language statistics
vendor/* linguist-vendored
*.min.js linguist-generated=true

# Force a specific language
*.html linguist-language=Vue
```

## Viewing Current Attributes

```bash
# Check attributes for a specific file
git check-attr -a package.json

# Check a specific attribute
git check-attr eol src/app.js
```

## Example: Complete .gitattributes for a Node.js Project

```gitattributes
# Default: auto-detect text and normalize
* text=auto

# Explicitly text files (always LF in repo)
*.js    text eol=lf
*.mjs   text eol=lf
*.ts    text eol=lf
*.tsx   text eol=lf
*.json  text eol=lf
*.md    text eol=lf
*.yml   text eol=lf
*.css   text eol=lf
*.html  text eol=lf

# Windows scripts use CRLF
*.bat   text eol=crlf
*.cmd   text eol=crlf

# Binary files
*.png   binary
*.jpg   binary
*.gif   binary
*.svg   text eol=lf
*.woff  binary
*.woff2 binary
*.ttf   binary
*.pdf   binary
*.zip   binary

# Exports
.gitattributes  export-ignore
.gitignore      export-ignore
tests/          export-ignore
```
