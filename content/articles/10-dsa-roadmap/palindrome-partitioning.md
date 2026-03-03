---
title: Palindrome Partitioning
description: Master Palindrome Partitioning in the Recursion & Backtracking
  module. Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given a string `s`, partition `s` such that every substring of the partition is a **palindrome**\. Return _all possible palindrome partitioning of_ `s`\.

##### **Example 1:**

**Input:** s = "aab"

**Output:** \[\["a","a","b"\],\["aa","b"\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">a</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">a</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">b</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">aa</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">b</span></div>
    </div>
  </div>
</div>

##### **Example 2:**

**Input:** s = "a"

**Output:** \[\["a"\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">a</span></div>
    </div>
  </div>
</div>

##### **Constraints:**

*   `1 <= s.length <= 16`
*   `s` contains only lowercase English letters\.


## Approaches

### 1\. Backtracking

#### Intuition:

The core idea is to use backtracking to generate all possible partitioning of the string, and for each partitioning, check if the substrings are palindromes\. Backtracking is well\-suited for this type of problem because we can recursively try each possible partition and backtrack if it does not lead to a solution\.

1.  Start from the beginning of the string and for each character at position `i`, check if the substring from the start to `i` is a palindrome\.
2.  If it is a palindrome, recursively partition the rest of the string from `i+1`\.
3.  If a partitioning of the entire string is found, add it to the result list\.

#### Code:

```java
class Solution {
   public List<List<String>> partition(String s) {
       List<List<String>> result = new ArrayList<>();
       backtrack(s, 0, new ArrayList<>(), result);
       return result;
   }
   
   private void backtrack(String s, int start, List<String> current, List<List<String>> result) {
       // Base case: If we've reached the end of the string, add the current partition to result
       if (start == s.length()) {
           result.add(new ArrayList<>(current));
           return;
       }
       
       // Try to partition at each possible position
       for (int end = start; end < s.length(); end++) {
           // Check if the substring s[start:end+1] is a palindrome
           if (isPalindrome(s, start, end)) {
               current.add(s.substring(start, end + 1)); // Make a choice
               backtrack(s, end + 1, current, result); // Explore
               current.remove(current.size() - 1); // Undo the choice
           }
       }
   }
   
   private boolean isPalindrome(String s, int left, int right) {
       // Check if the string between left and right is a palindrome
       while (left < right) {
           if (s.charAt(left) != s.charAt(right)) {
               return false;
           }
           left++;
           right--;
       }
       return true;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n \* 2^n\), where n is the length of the string\. This complexity is due to the fact that each character might either start its own substring or extend a previous one, leading to exponential possibilities\.
*   **Space Complexity:** O\(n\), where n is the depth of the recursion\. The space is used by the recursive call stack\.

### 2\. Dynamic Programming \+ Backtracking

#### Intuition:

We can optimize the palindrome checking part by using dynamic programming \(DP\)\. Using a 2D DP array, we can store the palindrome status of substrings to avoid recomputing this information repeatedly\.

1.  Precompute a 2D array `dp` where `dp[i][j]` is true if the substring `s[i:j+1]` is a palindrome\.
2.  Use this DP table in the backtracking process to quickly check if a substring is a palindrome\.

#### Code:

```java
class Solution {
   public List<List<String>> partition(String s) {
       int n = s.length();
       boolean[][] dp = new boolean[n][n];
       // Precompute whether s[i, j] is a palindrome
       for (int length = 1; length <= n; length++) {
           for (int i = 0; i <= n - length; i++) {
               int j = i + length - 1;
               if (s.charAt(i) == s.charAt(j) && (length <= 2 || dp[i+1][j-1])) {
                   dp[i][j] = true;
               }
           }
       }
       
       List<List<String>> result = new ArrayList<>();
       backtrack(s, 0, new ArrayList<>(), result, dp);
       return result;
   }
   
   private void backtrack(String s, int start, List<String> current, List<List<String>> result, boolean[][] dp) {
       if (start == s.length()) {
           result.add(new ArrayList<>(current));
           return;
       }
       
       for (int end = start; end < s.length(); end++) {
           // Use precomputed DP table to check for palindrome
           if (dp[start][end]) {
               current.add(s.substring(start, end + 1));
               backtrack(s, end + 1, current, result, dp);
               current.remove(current.size() - 1);
           }
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2 \* 2^n\), where n is the length of the string\. The DP precomputation is O\(n^2\), and the backtracking process remains exponential\.
*   **Space Complexity:** O\(n^2\) for the DP table plus O\(n\) for the recursion stack\.

#### [Solve it on LeetCode](https://leetcode.com/problems/palindrome-partitioning)
