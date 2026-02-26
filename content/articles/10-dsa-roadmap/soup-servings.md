---
title: Soup Servings
description: Master Soup Servings in the Dynamic Programming module.
  Comprehensive guide and algorithmic problem solving.
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

You have two soups, **A** and **B**, each starting with `n` mL\. On every turn, one of the following four serving operations is chosen _at random_, each with probability `0.25` **independent** of all previous turns:

*   pour 100 mL from type A and 0 mL from type B
*   pour 75 mL from type A and 25 mL from type B
*   pour 50 mL from type A and 50 mL from type B
*   pour 25 mL from type A and 75 mL from type B

**Note:**

*   There is no operation that pours 0 mL from A and 100 mL from B\.
*   The amounts from A and B are poured _simultaneously_ during the turn\.
*   If an operation asks you to pour **more than** you have left of a soup, pour all that remains of that soup\.

The process stops immediately after any turn in which _one of the soups_ is used up\.

Return the probability that A is used up _before_ B, plus half the probability that both soups are used up in the **same turn**\. Answers within `10``-5` of the actual answer will be accepted\.

##### **Example 1:**

**Input:** n = 50

**Output:** 0\.62500

**Explanation:**

If we perform either of the first two serving operations, soup A will become empty first\.

If we perform the third operation, A and B will become empty at the same time\.

If we perform the fourth operation, B will become empty first\.

So the total probability of A becoming empty first plus half the probability that A and B become empty at the same time, is 0\.25 \* \(1 \+ 1 \+ 0\.5 \+ 0\) = 0\.625\.

##### **Example 2:**

**Input:** n = 100

**Output:** 0\.71875

**Explanation:**

If we perform the first serving operation, soup A will become empty first\.

If we perform the second serving operations, A will become empty on performing operation \[1, 2, 3\], and both A and B become empty on performing operation 4\.

If we perform the third operation, A will become empty on performing operation \[1, 2\], and both A and B become empty on performing operation 3\.

If we perform the fourth operation, A will become empty on performing operation 1, and both A and B become empty on performing operation 2\.

So the total probability of A becoming empty first plus half the probability that A and B become empty at the same time, is 0\.71875\.

##### **Constraints:**

*   0 <= n <= 109

#### [Solve it on LeetCode](https://leetcode.com/problems/soup-servings)

# Approaches

## 1\. Recursive Approach with Memoization

#### Intuition:

This problem involves serving units of soup A and soup B\. The operations have an equal probability of reducing different volumes of soups\. Our goal is to find the probability that soup A will be empty first\. We will use a recursive function to simulate the serving process, and optimize it with memoization to avoid redundant calculations\.

#### Approach:

*   Use a recursive function `serve(A, B)` to model the serving process\.
*   For each call, consider the probability of the next four outcomes\.
*   The base cases are when A or B is empty\.
*   Use memoization to store the results of `serve(A, B)` to prevent recalculating\.

#### Code:

Java

```java
class Solution {
   private Map<String, Double> memo;
   
   public double soupServings(int N) {
       if (N > 4800) return 1; // approximation for large N
       this.memo = new HashMap<>();
       return serve(N, N);
   }
   
   private double serve(int A, int B) {
       if (A <= 0 && B <= 0) return 0.5; // Both soups get empty
       if (A <= 0) return 1.0; // A gets empty first
       if (B <= 0) return 0.0; // B gets empty first
       
       String key = A + "," + B;
       if (memo.containsKey(key)) return memo.get(key);
       
       double probability = 0.25 * (
           serve(A - 100, B) + // Operation 1
           serve(A - 75, B - 25) + // Operation 2
           serve(A - 50, B - 50) + // Operation 3
           serve(A - 25, B - 75) // Operation 4
       );
       
       memo.put(key, probability);
       return probability;
   }
}
```

Complexity Analysis

*   **Time Complexity:** `O(N^2)` \- Each state \(A,B\) is computed at most once\.
*   **Space Complexity:** `O(N^2)` \- Due to memoization storage\.

## 2\. Dynamic Programming

#### Intuition:

To improve upon the recursive approach, we can instead use dynamic programming\. By iteratively building solutions for smaller subproblems, we can avoid recursion altogether\.

#### Approach:

*   Use a 2\-D table `dp[i][j]` where `dp[i][j]` is the probability that when A = i and B = j, soup A will run out first\.
*   Fill this table by considering the outcomes of serving operations\.
*   Start from base cases and build up to \(N, N\)\.

#### Code:

Java

```java
class Solution {
   public double soupServings(int N) {
       if (N > 4800) return 1;
       N = (int)Math.ceil(N / 25.0);

       double[][] dp = new double[N + 1][N + 1];
       
       for (int i = 0; i <= N; i++) {
           for (int j = 0; j <= N; j++) {
               if (i == 0 && j == 0) {
                   dp[i][j] = 0.5;
               } else if (i == 0) {
                   dp[i][j] = 1.0;
               } else if (j == 0) {
                   dp[i][j] = 0.0;
               } else {
                   dp[i][j] = 0.25 * (
                       dp[Math.max(i-4, 0)][j] +
                       dp[Math.max(i-3, 0)][Math.max(j-1, 0)] +
                       dp[Math.max(i-2, 0)][Math.max(j-2, 0)] +
                       dp[Math.max(i-1, 0)][Math.max(j-3, 0)]
                   );
               }
           }
       }
       
       return dp[N][N];
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N^2\)
*   **Space Complexity:** O\(N^2\)

## 3\. Optimized Mathematical Approach

#### Intuition:

When `N` becomes very large, the probability approaches 1 due to constraints of problem dynamics\. We can mathematically approximate the result to improve efficiency\.

#### Approach:

*   For a sufficiently large N \(found empirically to be around 4800\), the probability that soup A will run out first is virtually 1\.
*   For smaller N, use the DP solution as described\.

#### Code:

Java

```java
class Solution {
   public double soupServings(int N) {
       if (N > 4800) return 1.0; // Approximation for larger N
       N = (int)Math.ceil(N / 25.0);

       double[][] dp = new double[N + 1][N + 1];
       
       for (int i = 0; i <= N; i++) {
           for (int j = 0; j <= N; j++) {
               if (i == 0 && j == 0) {
                   dp[i][j] = 0.5;
               } else if (i == 0) {
                   dp[i][j] = 1.0;
               } else if (j == 0) {
                   dp[i][j] = 0.0;
               } else {
                   dp[i][j] = 0.25 * (
                       dp[Math.max(i-4, 0)][j] +
                       dp[Math.max(i-3, 0)][Math.max(j-1, 0)] +
                       dp[Math.max(i-2, 0)][Math.max(j-2, 0)] +
                       dp[Math.max(i-1, 0)][Math.max(j-3, 0)]
                   );
               }
           }
       }
       
       return dp[N][N];
   }
}
```

Complexity Analysis

*   **Time Complexity:** `O(1)` for large N, else `O(N^2)`
*   **Space Complexity:** `O(1)` for large N, else `O(N^2)`