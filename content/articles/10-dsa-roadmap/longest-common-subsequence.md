---
title: Longest Common Subsequence
description: Master Longest Common Subsequence in the Dynamic Programming
  module. Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

# Problem Description

Question

Given two strings `text1` and `text2`, return _the length of their longest_ _**common subsequence**__\._ If there is no **common subsequence**, return `0`\.

A **subsequence** of a string is a new string generated from the original string with some characters \(can be none\) deleted without changing the relative order of the remaining characters\.

*   For example, `"ace"` is a subsequence of `"abcde"`\.

A **common subsequence** of two strings is a subsequence that is common to both strings\.

##### **Example 1:**

**Input:** text1 = "abcde", text2 = "ace"

**Output:** 3

**Explanation:** The longest common subsequence is "ace" and its length is 3\.

##### **Example 2:**

**Input:** text1 = "abc", text2 = "abc"

**Output:** 3

**Explanation:** The longest common subsequence is "abc" and its length is 3\.

##### **Example 3:**

**Input:** text1 = "abc", text2 = "def"

**Output:** 0

**Explanation:** There is no such common subsequence, so the result is 0\.

##### **Constraints:**

*   `1 <= text1.length, text2.length <= 1000`
*   `text1` and `text2` consist of only lowercase English characters\.

#### [Solve it on LeetCode](https://leetcode.com/problems/longest-common-subsequence)

# Approaches

## 1\. Recursion

#### **Intuition:**

The simplest way to solve this problem is to use recursion\. For each character in the two strings, we have two choices:

1.  If the current characters in both strings are the same, consider the character as part of the subsequence and move to the next character in both strings\.
2.  If the characters do not match, independently consider the two possibilities:

*   Exclude the current character of the first string and include the possibility of the rest\.
*   Exclude the current character of the second string and include the possibility of the rest\.

The maximum of these choices will give us the length of the longest common subsequence\.

#### **Code:**

Java

```java
class Solution {
   public int longestCommonSubsequence(String text1, String text2) {
       return lcs(text1, text2, text1.length(), text2.length());
   }
   
   private int lcs(String text1, String text2, int m, int n) {
       // Base case: If either string length becomes 0
       if (m == 0 || n == 0) {
           return 0;
       }
       
       // If last characters match
       if (text1.charAt(m - 1) == text2.charAt(n - 1)) {
           return 1 + lcs(text1, text2, m - 1, n - 1);
       } else {
           // If they don't match, try both options
           return Math.max(lcs(text1, text2, m - 1, n), lcs(text1, text2, m, n - 1));
       }
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(2^\{min\(m, n\)\}\)\) due to exponential number of subproblems where \(m\) and \(n\) are the lengths of the two strings\.
*   **Space Complexity:** O\(m \+ n\) considering the call stack space\.

## 2\. Recursion with Memoization \(Top\-Down DP\)

#### **Intuition:**

Recursion leads to overlapping subproblems\. By storing and reusing already computed results, we can reduce unnecessary computations\. We use a 2D array \(memoization table\) to store the lengths of the longest common subsequence for substrings seen so far\.

#### **Code:**

Java

```java
class Solution {
   public int longestCommonSubsequence(String text1, String text2) {
       int[][] memo = new int[text1.length() + 1][text2.length() + 1];
       for (int i = 0; i <= text1.length(); i++) {
           Arrays.fill(memo[i], -1);
       }
       return lcs(text1, text2, text1.length(), text2.length(), memo);
   }
   
   private int lcs(String text1, String text2, int m, int n, int[][] memo) {
       if (m == 0 || n == 0) {
           return 0;
       }
       
       if (memo[m][n] != -1) {
           return memo[m][n];
       }
       
       if (text1.charAt(m - 1) == text2.charAt(n - 1)) {
           memo[m][n] = 1 + lcs(text1, text2, m - 1, n - 1, memo);
       } else {
           memo[m][n] = Math.max(lcs(text1, text2, m - 1, n, memo), lcs(text1, text2, m, n - 1, memo));
       }
       
       return memo[m][n];
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(m \* n\)
*   **Space Complexity:** O\(m \* n\), due to memoization table\.

## 3\. Dynamic Programming \(Bottom\-Up DP\)

#### **Intuition:**

Instead of solving the problem recursively, use an iterative approach by filling up a DP table where `dp[i][j]` represents the length of the longest common subsequence of `text1[0:i-1]` and `text2[0:j-1]`\.

*   Initialize a table with dimensions \(\(m\+1\) \\times \(n\+1\)\) to zero\.
*   Fill the table iteratively based on character match:

*   If characters match, `dp[i][j] = 1 + dp[i-1][j-1]`\.
*   Otherwise, `dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])`\.

#### **Code:**

Java

```java
class Solution {
   public int longestCommonSubsequence(String text1, String text2) {
       int m = text1.length();
       int n = text2.length();
       int[][] dp = new int[m + 1][n + 1];
       
       for (int i = 1; i <= m; i++) {
           for (int j = 1; j <= n; j++) {
               if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                   dp[i][j] = 1 + dp[i - 1][j - 1];
               } else {
                   dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
               }
           }
       }
       
       return dp[m][n];
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(m \* n\)
*   **Space Complexity:** O\(m \* n\)  though it can be improved to O\(min\(m, n\)\) by using a 1D array if desired\.

View Animation