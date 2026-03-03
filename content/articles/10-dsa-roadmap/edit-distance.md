---
title: Edit Distance
description: Master Edit Distance in the Dynamic Programming module.
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

Given two strings `word1` and `word2`, return _the minimum number of operations required to convert_ `_word1_` _to_ `_word2_`\.

You have the following three operations permitted on a word:

*   Insert a character
*   Delete a character
*   Replace a character

##### **Example 1:**

**Input:** word1 = "horse", word2 = "ros"

**Output:** 3

**Explanation:**

horse \-> rorse \(replace 'h' with 'r'\)

rorse \-> rose \(remove 'r'\)

rose \-> ros \(remove 'e'\)

##### **Example 2:**

**Input:** word1 = "intention", word2 = "execution"

**Output:** 5

**Explanation:**

intention \-> inention \(remove 't'\)

inention \-> enention \(replace 'i' with 'e'\)

enention \-> exention \(replace 'n' with 'x'\)

exention \-> exection \(replace 'n' with 'c'\)

exection \-> execution \(insert 'u'\)

##### **Constraints:**

*   `0 <= word1.length, word2.length <= 500`
*   `word1` and `word2` consist of lowercase English letters\.


## Approaches

### 1\. Recursive Solution \(Basic\)

#### Intuition:

The problem is looking for the minimum number of operations required to convert one string into another\. A basic recursive solution would try to define the problem in terms of smaller sub\-problems:

*   If the last characters match, no operation is needed for them\. Proceed to check the rest of the string\.
*   If they don’t match, consider three operations:

1.  Insert a character and check\.
2.  Remove a character and check\.
3.  Replace a character and check\.

The minimum of these operations would be our answer for the sub\-problem\.

#### Code:

#### Complexity Analysis

*   **Time Complexity:** O\(3^\(m\+n\)\), where m and n are the lengths of the two strings\. This is because for each element, we make three recursive calls\.
*   **Space Complexity:** O\(m \+ n\), due to the recursion stack\.

### 2\. Recursive Solution with Memoization

#### Intuition:

The basic recursive solution computes the same sub\-problems multiple times\. Using memoization, we can store the results of already computed sub\-problems to avoid redundant calculations, thus optimizing the recursive approach\.

#### Code:

#### Complexity Analysis

*   **Time Complexity:** O\(m \* n\), since each subproblem is computed once\.
*   **Space Complexity:** O\(m \* n\), for the memoization array and recursion stack\.

### 3\. Dynamic Programming \(Optimal\)

#### Intuition:

The dynamic programming approach iteratively builds up solutions to smaller sub\-problems to get the result for the original problem\. This reduces the repeated computation caused by recursion\.

*   Create a 2D table `dp` where `dp[i][j]` represents the edit distance between the first `i` characters of `word1` and the first `j` characters of `word2`\.
*   The value of `dp[i][j]` is determined by:

1.  If the characters match, carry forward the diagonal value `dp[i-1][j-1]`\.
2.  Else, take the minimum of inserting into `dp[i][j-1]`, removing from `dp[i-1][j]`, or replacing via `dp[i-1][j-1]` and add 1\.

#### Code:

#### Complexity Analysis

*   **Time Complexity:** O\(m \* n\), because we fill out the entire dp table\.
*   **Space Complexity:** O\(m \* n\), for the dp array\.

#### [Solve it on LeetCode](https://leetcode.com/problems/edit-distance)
