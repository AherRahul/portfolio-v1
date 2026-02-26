---
title: Perfect Squares
description: Master Perfect Squares in the Dynamic Programming module.
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

Given an integer `n`, return _the least number of perfect square numbers that sum to_ `n`\.

A **perfect square** is an integer that is the square of an integer; in other words, it is the product of some integer with itself\. For example, `1`, `4`, `9`, and `16` are perfect squares while `3` and `11` are not\.

##### **Example 1:**

**Input:** n = 12

**Output:** 3

**Explanation:** 12 = 4 \+ 4 \+ 4\.

##### **Example 2:**

**Input:** n = 13

**Output:** 2

**Explanation:** 13 = 4 \+ 9\.

##### **Constraints:**

*   **1 <= n <= 10****4**

#### [Solve it on LeetCode](https://leetcode.com/problems/perfect-squares)

# Approaches

## 1\. Brute Force using Recursion

#### **Intuition:**

The simplest way to solve the problem is by trying all combinations\. For a given number `n`, see if you can subtract a perfect square and solve the rest of the problem for `n - perfect_square` recursively\.

#### **Steps:**

1.  Recursive function will be called reducing `n` by `i*i`, where `i` goes from 1 to `sqrt(n)`\.
2.  Base case: If `n` is 0, return 0 as we do not need any squares to sum up to 0\.
3.  Return the minimum number of squares necessary\.

#### Code:

Java

```java
class Solution {
   public int numSquares(int n) {
       return recursiveNumSquares(n);
   }
   
   private int recursiveNumSquares(int n) {
       if (n == 0) return 0; // Base case: zero needs zero squares
       int minCount = Integer.MAX_VALUE;
       
       for (int i = 1; i * i <= n; i++) {
           // Recursively solve for n - i*i
           minCount = Math.min(minCount, recursiveNumSquares(n - i * i) + 1);
       }
       
       return minCount;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^\(n/2\)\), since each branch of recursion can branch further into `sqrt(n)` branches\.
*   **Space Complexity:** O\(n\), due to the recursion call stack\.

## 2\. Dynamic Programming

#### **Intuition:**

We can improve upon the recursive approach by storing results of subproblems \(memoization\)\. Use an array where `dp[i]` keeps track of the least number of perfect squares that sum up to `i`\.

#### **Steps:**

1.  Initialize an array `dp` of size `n + 1` where `dp[0] = 0`\.
2.  Iterate over each number up to `n` and compute `dp[i]` by adding a perfect square `j*j`\.
3.  For each `i`, `dp[i]` equals the min of `dp[i]` and `dp[i - j*j] + 1`\.

#### **Code:**

Java

```java
class Solution {
   public int numSquares(int n) {
       int[] dp = new int[n + 1];
       Arrays.fill(dp, Integer.MAX_VALUE);
       dp[0] = 0;
       
       for (int i = 1; i <= n; i++) {
           for (int j = 1; j * j <= i; j++) {
               dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
           }
       }
       
       return dp[n];
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n \* sqrt\(n\)\), as you go through each number and compute the squares up to `sqrt(n)`\.
*   **Space Complexity:** O\(n\), additional space for the `dp` array\.

## 3\. Mathematical Approach using Lagrange's Four Square Theorem

#### **Intuition:**

Lagrange's Four Square Theorem states that any natural number is the sum of four integer squares at most\. Using some mathematical deductions, especially checking for perfect squares can make the solution optimal\.

#### **Steps:**

1.  Check if `n` is a perfect square\.
2.  Applying a few checks based on the property of modulo 4 and perfect number subtraction\.

#### **Code:**

Java

```java
class Solution {
   public int numSquares(int n) {
       if (isPerfectSquare(n)) return 1;

       // Apply Legendre's three-square theorem
       while (n % 4 == 0) n /= 4;
       if (n % 8 == 7) return 4; // Check if n can be expressed in the form of 4^a*(8b+7)

       // After above checks, try to reduce with at most two squares
       for (int i = 1; i * i <= n; i++) {
           if (isPerfectSquare(n - i * i)) return 2;
       }
       
       return 3;
   }
   
   private boolean isPerfectSquare(int x) {
       int s = (int) Math.sqrt(x);
       return s * s == x;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(sqrt\(n\)\), due to verification of perfect squares\.
*   **Space Complexity:** O\(1\), using only constant space\.