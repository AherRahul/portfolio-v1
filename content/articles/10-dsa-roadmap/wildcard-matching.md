---
title: Wildcard Matching
description: Master Wildcard Matching in the Dynamic Programming module.
  Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given an input string \(`s`\) and a pattern \(`p`\), implement wildcard pattern matching with support for `'?'` and `'*'` where:

*   `'?'` Matches any single character\.
*   `'*'` Matches any sequence of characters \(including the empty sequence\)\.

The matching should cover the **entire** input string \(not partial\)\.

##### **Example 1:**

**Input:** s = "aa", p = "a"

**Output:** false

**Explanation:** "a" does not match the entire string "aa"\.

##### **Example 2:**

**Input:** s = "aa", p = "\*"

**Output:** true

**Explanation:** '\*' matches any sequence\.

##### **Example 3:**

**Input:** s = "cb", p = "?a"

**Output:** false

**Explanation:** '?' matches 'c', but the second letter is 'a', which does not match 'b'\.

##### **Constraints:**

*   `0 <= s.length, p.length <= 2000`
*   `s` contains only lowercase English letters\.
*   `p` contains only lowercase English letters, `'?'` or `'*'`\.


## Approaches

### 1\. Recursive Backtracking

#### Intuition:

The problem of wildcard matching can be thought of in a recursive manner by breaking down the problem into simpler sub\-problems\. If the current characters match \(considering `?` matches any single character\), we can recursively match the rest of the string\. If we encounter a `*`, we have the choice to ignore it or assume it matches one or more characters\. This approach, however, is non\-optimal due to potential overlapping sub\-problems but provides a good base for understanding\.

#### Code:

```java
class Solution {
   public boolean isMatch(String s, String p) {
       return backtrack(s, p, 0, 0);
   }
   
   private boolean backtrack(String s, String p, int i, int j) {
       // If we've reached the end of the pattern, check if we've also reached the end of the string.
       if (j == p.length()) return i == s.length();
       
       // Match if current character of both string and pattern match or pattern has '?'.
       if (j < p.length() && (i < s.length() && (p.charAt(j) == s.charAt(i) || p.charAt(j) == '?'))) {
           return backtrack(s, p, i + 1, j + 1);
       }
       
       // If the pattern has '*', try two options:
       // 1. Treat '*' as empty and move to next character in pattern.
       // 2. Treat '*' as matching current character in string and move to next character in string.
       if (j < p.length() && p.charAt(j) == '*') {
           return backtrack(s, p, i, j + 1) || (i < s.length() && backtrack(s, p, i + 1, j));
       }
       
       // Otherwise, no match
       return false;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(2^\(m\+n\)\), where m and n are lengths of the string and pattern respectively\. The recursion can branch exponentially in the worst case\.
*   **Space Complexity:** O\(m\+n\), due to the recursion stack\.

### 2\. Memoization

#### Intuition:

Memoization optimizes the recursive approach by storing results of previously solved sub\-problems, so they are not recomputed\. This reduces the time complexity significantly by caching intermediate results\.

#### Code:

```java
class Solution {
   public boolean isMatch(String s, String p) {
       return isMatch(s, p, 0, 0, new HashMap<>());
   }
   
   private boolean isMatch(String s, String p, int i, int j, Map<String, Boolean> memo) {
       String key = i + "," + j;
       
       if (memo.containsKey(key)) {
           return memo.get(key);
       }
       
       if (j == p.length()) {
           return i == s.length();
       }
       
       if (j < p.length() && (i < s.length() && (p.charAt(j) == s.charAt(i) || p.charAt(j) == '?'))) {
           boolean result = isMatch(s, p, i + 1, j + 1, memo);
           memo.put(key, result);
           return result;
       }
       
       if (j < p.length() && p.charAt(j) == '*') {
           boolean result = isMatch(s, p, i, j + 1, memo) || (i < s.length() && isMatch(s, p, i + 1, j, memo));
           memo.put(key, result);
           return result;
       }
       
       memo.put(key, false);
       return false;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(m\*n\), as each sub\-problem is solved once\.
*   **Space Complexity:** O\(m\*n\) for storage used in memoization\.

### 3\. Dynamic Programming

#### Intuition:

The dynamic programming solution uses a 2D table where `dp[i][j]` stores whether the first `i` characters of the string match the first `j` characters of the pattern\. Use iteration to fill out the DP table based on matching rules and previously computed values\. This ensures optimal substructure and overlapping sub\-problems are effectively handled\.

#### Code:

```java
class Solution {
   public boolean isMatch(String s, String p) {
       int m = s.length(), n = p.length();
       boolean[][] dp = new boolean[m + 1][n + 1];
       
       // Base case: empty pattern matches empty string
       dp[0][0] = true;
       
       // Base case: pattern starting with '*' can match an empty string
       for (int j = 1; j <= n; j++) {
           if (p.charAt(j - 1) == '*') {
               dp[0][j] = dp[0][j - 1];
           }
       }
       
       for (int i = 1; i <= m; i++) {
           for (int j = 1; j <= n; j++) {
               if (p.charAt(j - 1) == s.charAt(i - 1) || p.charAt(j - 1) == '?') {
                   dp[i][j] = dp[i - 1][j - 1];
               } else if (p.charAt(j - 1) == '*') {
                   dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
               }
           }
       }
       
       return dp[m][n];
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(m\*n\), with m and n representing the lengths of the input string and pattern\.
*   **Space Complexity:** O\(m\*n\), due to the DP table storage\.

#### [Solve it on LeetCode](https://leetcode.com/problems/wildcard-matching)
