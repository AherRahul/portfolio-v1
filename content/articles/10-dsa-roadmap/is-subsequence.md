---
title: Is Subsequence
description: Master Is Subsequence in the Strings module. Comprehensive guide
  and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given two strings `s` and `t`, return `true` _if_ `s` _is a_ _**subsequence**_ _of_ `t`_, or_ `false` _otherwise_\.

A **subsequence** of a string is a new string that is formed from the original string by deleting some \(can be none\) of the characters without disturbing the relative positions of the remaining characters\. \(i\.e\., **"ace"** is a subsequence of **"****a****b****c****d****e****"** while **"aec"** is not\)\. 

##### **Example 1:**

**Input:** s = "abc", t = "ahbgdc"

**Output:** true

##### **Example 2:**

**Input:** s = "axc", t = "ahbgdc"

**Output:** false

##### **Constraints:**

*   **0 <= s\.length <= 100**
*   **0 <= t\.length <= 10****4**
*   `**s**` **and** `**t**` **consist only of lowercase English letters\.**

**Follow up:** Suppose there are lots of incoming `s`, say **s****1****, s****2****, \.\.\., s****k** where **k >= 10****9**, and you want to check one by one to see if `t` has its subsequence\. In this scenario, how would you change your code?


## Understanding the Problem

Before diving into solutions, let's make sure we understand what a subsequence is and how it differs from a substring\.

#### **Subsequence vs Substring:**

*   A **substring** is a contiguous sequence of characters within a string\. For "abcde", substrings include "abc", "bcd", "cde", "ab", etc\.
*   A **subsequence** is a sequence that can be derived by deleting zero or more elements from the original sequence without changing the order of remaining elements\. For "abcde", subsequences include "ace", "abd", "ae", "bd", "e", and even the empty string\.

The key difference: in a substring, characters must be adjacent; in a subsequence, they can be scattered but must maintain their relative order\.

Let's visualize this with an example:

```plaintext
t = "ahbgdc"
s = "abc"

t: a  h  b  g  d  c
  ^     ^        ^
  |     |        |
s: a     b        c

The characters 'a', 'b', 'c' appear in t in the same order as in s.
Even though other characters appear between them, s is a valid subsequence.
```

Another way to think about it: imagine you are reading through `t` from left to right, and you are trying to "check off" each character of `s` in order\. If you can check off all characters of `s` by the time you finish reading `t`, then `s` is a subsequence of `t`\.

## Approaches

### 1\. Two Pointers \(Optimal for Single Query\)

#### **Intuition**

The most natural way to solve this problem is to simulate the process of matching characters\. We use two pointers: one to track our current position in `s` \(the pattern we are looking for\) and another to scan through `t` \(the string we are searching in\)\.

As we scan through `t`, whenever we find a character that matches the current character we are looking for in `s`, we advance our pointer in `s`\. If we manage to match all characters in `s` before \(or exactly when\) we finish scanning `t`, then `s` is a subsequence\.

#### **Algorithm**

1.  Initialize two pointers: `i = 0` \(for string `s`\) and `j = 0` \(for string `t`\)
2.  While both pointers are within bounds:

*   If `s[i] == t[j]`, we found a match, so increment `i`
*   Always increment `j` to continue scanning `t`

4.  After the loop, if `i == s.length()`, we matched all characters in `s`, so return `true`
5.  Otherwise, return `false`

#### **Code**

```java
class Solution {
   public boolean isSubsequence(String s, String t) {
       int i = 0, j = 0;
       // Iterate through both strings
       while (i < s.length() && j < t.length()) {
           // If characters match, move the pointer for s
           if (s.charAt(i) == t.charAt(j)) {
               i++;
           }
           // Always move the pointer for t
           j++;
       }
       // If i is equal to the length of s, all characters of s were found in t
       return i == s.length();
   }
}
```

#### Complexity Analysis

**Time Complexity:** O\(n\) where n is the length of `t`

*   We traverse `t` at most once
*   Each character comparison is O\(1\)
*   In the worst case, we scan all of `t` \(when `s` is not a subsequence or matches at the very end\)

**Space Complexity:** O\(1\)

*   We only use two pointer variables
*   No additional data structures needed

This is the optimal solution for a single query\. But what happens when we have many queries?

### 2\. Binary Search \(Optimized for Multiple Queries\)

#### **Intuition**

The follow\-up question changes everything\. If we have billions of strings `s1, s2, ..., sk` to check against a single `t`, the two\-pointer approach gives us O\(k \* n\) time where n is the length of `t`\. Can we do better?

The key insight is that we are repeatedly traversing the same string `t`\. If we preprocess `t`, we can answer each query faster\.

Here is the idea: for each character in the alphabet, precompute all the positions where that character appears in `t`\. Store these positions in sorted lists\. Then, for each query string `s`, we use binary search to find valid positions\.

For example, if `t = "ahbgdc"`:

*   'a' appears at positions \[0\]
*   'b' appears at positions \[2\]
*   'c' appears at positions \[5\]
*   'd' appears at positions \[4\]
*   'g' appears at positions \[3\]
*   'h' appears at positions \[1\]

When checking if `s = "abc"` is a subsequence:

1.  Find 'a': binary search in \[0\] for position >= 0\. Found at index 0\. Next search starts from position > 0\.
2.  Find 'b': binary search in \[2\] for position > 0\. Found at index 2\. Next search starts from position > 2\.
3.  Find 'c': binary search in \[5\] for position > 2\. Found at index 5\. All characters matched\!

**Why Binary Search?**

For each character in `s`, we need to find the first occurrence in `t` that comes after our current position\. Since the position lists are sorted, binary search gives us this in O\(log n\) time instead of O\(n\) with linear search\.

#### **Algorithm**

1.  **Preprocessing:** Create a map where each key is a character and each value is a list of indices where that character appears in `t`
2.  **Query Processing:** For each string `s`:

*   Initialize `currentPos = -1` \(we start before the string\)
*   For each character `c` in `s`:

*   Get the list of positions for `c`
*   Binary search for the smallest position > `currentPos`
*   If found, update `currentPos` to this position
*   If not found, return `false`

*   If all characters are matched, return `true`

#### Code

```java
class Solution {
   private Map<Character, List<Integer>> charPositions;

   // Preprocessing: call once for string t
   public void preprocess(String t) {
       charPositions = new HashMap<>();

       for (int i = 0; i < t.length(); i++) {
           char c = t.charAt(i);
           charPositions.computeIfAbsent(c, k -> new ArrayList<>()).add(i);
       }
   }

   // Query: call for each string s
   public boolean isSubsequence(String s, String t) {
       // For single query, preprocess on the fly
       if (charPositions == null) {
           preprocess(t);
       }

       int currentPos = -1;

       for (char c : s.toCharArray()) {
           List<Integer> positions = charPositions.get(c);

           // Character not found in t
           if (positions == null) {
               return false;
           }

           // Binary search for first position > currentPos
           int idx = binarySearchGreater(positions, currentPos);

           // No valid position found
           if (idx == positions.size()) {
               return false;
           }

           currentPos = positions.get(idx);
       }

       return true;
   }

   // Find first index where positions[idx] > target
   private int binarySearchGreater(List<Integer> positions, int target) {
       int left = 0;
       int right = positions.size();

       while (left < right) {
           int mid = left + (right - left) / 2;
           if (positions.get(mid) <= target) {
               left = mid + 1;
           } else {
               right = mid;
           }
       }

       return left;
   }
}
```

#### Complexity Analysis

**Preprocessing Time:** O\(n\) where n is the length of `t`

*   We scan through `t` once to build the position map
*   Each insertion into the map is O\(1\) amortized

**Preprocessing Space:** O\(n\)

*   We store at most n positions total \(each character in `t` contributes one position\)
*   The map has at most 26 keys \(lowercase English letters\)

**Query Time:** O\(m \* log n\) where m is the length of query string `s`

*   For each of the m characters in `s`, we perform one binary search
*   Each binary search is O\(log n\) in the worst case \(when all characters in `t` are the same\)

**Total Time for k Queries:** O\(n \+ k _m_ log n\)

*   This is significantly better than O\(k \* n\) from the two\-pointer approach when k is large
*   The crossover point depends on the lengths: binary search wins when k is large or m is small relative to n

#### [Solve it on LeetCode](https://leetcode.com/problems/is-subsequence)
