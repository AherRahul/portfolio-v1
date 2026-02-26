---
title: Factorial Trailing Zeroes
description: Master Factorial Trailing Zeroes in the Maths / Geometry module.
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

Given an integer `n`, return _the number of trailing zeroes in_ `n!`\.

Note that `n! = n * (n - 1) * (n - 2) * ... * 3 * 2 * 1`\.

##### **Example 1:**

**Input:** n = 3

**Output:** 0

**Explanation:** 3\! = 6, no trailing zero\.

##### **Example 2:**

**Input:** n = 5

**Output:** 1

**Explanation:** 5\! = 120, one trailing zero\.

##### **Example 3:**

**Input:** n = 0

**Output:** 0

##### **Constraints:**

*   **0 <= n <= 10****4** 

**Follow up:** Could you write a solution that works in logarithmic time complexity?

#### [Solve it on LeetCode](https://leetcode.com/problems/factorial-trailing-zeroes)

# Approaches

## 1\. Count Factors of 5

#### Intuition:

The basic idea is to count how many times 5 is a factor of numbers from 1 to `n`\. Each multiple of 5 contributes at least one 5 to the factorization\. For example, numbers like 25, 125, etc\., which throw an additional power of 5, need to be considered as well\.

#### Steps:

1.  Iterate from 5 to `n`, stepping by 5s\.
2.  Count how many times 5 is a factor\.
3.  Return the count as the number of trailing zeroes\.

#### Code:

Java

```java
class Solution {
   public int trailingZeroes(int n) {
       // Initialize the count of trailing zeroes
       int count = 0;
       
       // Count factors of 5
       for (int i = 5; i <= n; i *= 5) {
           // Add the multiples of 5
           count += n / i;
       }
       
       return count;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(log5\(n\)\) \- We are dividing `n` by powers of 5\.
*   **Space Complexity:** O\(1\) \- Constant space is used\.

## 2\. Optimized Approach: Mathematical Insight

#### Intuition:

The count of trailing zeroes is determined by the number of times 5 is a factor in the numbers from 1 to `n`\. The mathematical insight is that we only count multiples of 5, 25, 125, etc\., because they contribute one or more extra 5s\.

#### Steps:

1.  Calculate how many multiples of 5, 25, 125, etc\., there are in numbers up to `n`\.
2.  This can be done by continuously dividing `n` by 5, 25, 125\.\.\. \(i\.e\., continuously dividing by 5\) and summing the quotient\.
3.  The sum will be our result\.

#### Code:

Java

```java
class Solution {
   public int trailingZeroes(int n) {
       // Initialize the count of trailing zeroes
       int count = 0;
       
       // Repeatedly divide n by 5 and sum the whole number quotients
       while (n >= 5) {
           n /= 5;
           count += n;
       }
       
       return count;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(log5\(n\)\) \- Each division step reduces `n` by a factor of 5\.
*   **Space Complexity:** O\(1\) \- We are using constant space\.