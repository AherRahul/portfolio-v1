---
title: Fair Distribution of Cookies
description: Master Fair Distribution of Cookies in the Dynamic Programming
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

You are given an integer array `cookies`, where `cookies[i]` denotes the number of cookies in the `i``th` bag\. You are also given an integer `k` that denotes the number of children to distribute **all** the bags of cookies to\. All the cookies in the same bag must go to the same child and cannot be split up\.

The **unfairness** of a distribution is defined as the **maximum** **total** cookies obtained by a single child in the distribution\.

Return _the_ _**minimum**_ _unfairness of all distributions_\.

##### **Example 1:**

**Input:** cookies = \[8,15,10,20,8\], k = 2

**Output:** 31

**Explanation:** One optimal distribution is \[8,15,8\] and \[10,20\]

\- The 1st child receives \[8,15,8\] which has a total of 8 \+ 15 \+ 8 = 31 cookies\.

\- The 2nd child receives \[10,20\] which has a total of 10 \+ 20 = 30 cookies\.

The unfairness of the distribution is max\(31,30\) = 31\. It can be shown that there is no distribution with an unfairness less than 31\.

**Example 2:**

**Input:** cookies = \[6,1,3,2,2,4,1,2\], k = 3

**Output:** 7

**Explanation:** One optimal distribution is \[6,1\], \[3,2,2\], and \[4,1,2\]

\- The 1st child receives \[6,1\] which has a total of 6 \+ 1 = 7 cookies\.

\- The 2nd child receives \[3,2,2\] which has a total of 3 \+ 2 \+ 2 = 7 cookies\.

\- The 3rd child receives \[4,1,2\] which has a total of 4 \+ 1 \+ 2 = 7 cookies\.

The unfairness of the distribution is max\(7,7,7\) = 7\. It can be shown that there is no distribution with an unfairness less than 7\.

##### **Constraints:**

*   2 <= cookies\.length <= 8
*   1 <= cookies\[i\] <= 105
*   2 <= k <= cookies\.length

#### [Solve it on LeetCode](https://leetcode.com/problems/fair-distribution-of-cookies)

# Approaches

## 1\. Backtracking \(Brute Force\)

#### Intuition:

The problem involves assigning cookies to children in such a way that the most "unfortunate" child \(one with the most cookies\) is as fortunate as possible\. Given the constraints, a brute force backtracking approach can be applied to attempt all possible distributions of cookies to the children\.

#### Approach:

1.  Utilize a backtracking approach to try distributing cookies in every possible way\.
2.  Use a recursive function to decide at each step which child should receive the current cookie\.
3.  After assigning all cookies, calculate the current unfairness by identifying the child with the maximum cookies and update the result\.
4.  Due to the factorial time complexity of trying every distribution, this approach will be inefficient for larger inputs but demonstrates a straightforward solution\.

#### Code:

Java

```java
class Solution {
   public int distributeCookies(int[] cookies, int k) {
       // Array where `childBins[i]` indicates the number of cookies given to the i-th child
       int[] childBins = new int[k];
       // Recursive backtracking function to distribute cookies
       return backtrack(cookies, childBins, 0, Integer.MAX_VALUE);
   }

   private int backtrack(int[] cookies, int[] childBins, int index, int minUnfairness) {
       if (index == cookies.length) {
           // Get the maximum number of cookies any one child has, to represent unfairness
           int currentMax = 0;
           for (int cookieCount : childBins) {
               currentMax = Math.max(currentMax, cookieCount);
           }
           // Return the minimal unfairness encountered across all paths
           return Math.min(minUnfairness, currentMax);
       }

       for (int i = 0; i < childBins.length; i++) {
           // Assign cookie `index` to the i-th child and backtrack further
           childBins[i] += cookies[index];
           minUnfairness = backtrack(cookies, childBins, index + 1, minUnfairness);
           // Backtrack: remove the assigned cookie from the i-th child
           childBins[i] -= cookies[index];
       }
       return minUnfairness;
   }
}
```

Complexity Analysis

*   **Time Complexity:** **O\(k^n\) \-** For each cookie, there are k children to whom it can be assigned\.
*   **Space Complexity:** O\(k\) \- To store the cookie count for each child\.

## 2\. Backtracking with Early Pruning

#### Intuition:

We can enhance the previous backtracking approach by pruning paths early when they don't promise a better result\. This can be done by ensuring that no intermediate state has an unfairness greater than the currently found best solution\.

#### Approach:

1.  Similar to the previous method, but with a check before descending deeper into recursion\.
2.  Each time a cookie is assigned, check if the current unfairness already exceeds the current best solution\.
3.  If it does, prune this path \(do not continue recursively\)\.
4.  This limits unnecessary computation and reduces search space\.

#### Code:

Java

```java
class Solution {
   public int distributeCookies(int[] cookies, int k) {
       int[] childBins = new int[k];
       // Initial call with a very large unfairness (Infinity) as the starting point
       return backtrack(cookies, childBins, 0, Integer.MAX_VALUE);
   }

   private int backtrack(int[] cookies, int[] childBins, int index, int minUnfairness) {
       if (index == cookies.length) {
           int currentMax = 0;
           for (int cookieCount : childBins) {
               currentMax = Math.max(currentMax, cookieCount);
           }
           return Math.min(minUnfairness, currentMax);
       }

       for (int i = 0; i < childBins.length; i++) {
           childBins[i] += cookies[index];
           
           // Compute current max unfairness after new assignment
           int currentMax = 0;
           for (int cookieCount : childBins) {
               currentMax = Math.max(currentMax, cookieCount);
           }

           if (currentMax < minUnfairness) {
               minUnfairness = backtrack(cookies, childBins, index + 1, minUnfairness);
           }
           childBins[i] -= cookies[index];
       }
       return minUnfairness;
   }
}
```

Complexity Analysis

*   **Time Complexity:** **O\(k^n\)** in the worst case, but with pruning, often much faster\.
*   **Space Complexity:** **O\(k\)**: For storing cookies counts per child\.