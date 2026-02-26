---
title: Number of 1 Bits
description: Master Number of 1 Bits in the Bit Manipulation module.
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

Given a positive integer `n`, write a function that returns the number of set bits in its binary representation \(also known as the [Hamming weight](http://en.wikipedia.org/wiki/Hamming_weight)\)\. 

##### **Example 1:**

**Input:** n = 11

**Output:** 3

**Explanation:** The input binary string **1011** has a total of three set bits\.

##### **Example 2:**

**Input:** n = 128

**Output:** 1

**Explanation:** The input binary string **10000000** has a total of one set bit\.

##### **Example 3:**

**Input:** n = 2147483645

**Output:** 30

**Explanation:** The input binary string **1111111111111111111111111111101** has a total of thirty set bits\. 

##### **Constraints:**

*   **1 <= n <= 2****31** **\- 1**

**Follow up:** If this function is called many times, how would you optimize it?

#### [Solve it on LeetCode](https://leetcode.com/problems/number-of-1-bits/)

# Approaches

## 1\. Brute Force

#### Intuition:

Counting the number of 1 bits in an integer can be approached by iterating through each bit and checking whether it is 1\. This can be efficiently done by using bit shifts\.

#### Steps:

1.  Initialize a counter to keep track of the number of 1 bits\.
2.  Use a loop to iterate over each of the 32 bits of the integer\.
3.  Use a bitmask to isolate each bit and determine if it's 1\.
4.  For each bit that is 1, increment the counter\.
5.  Return the counter as the result\.

#### Code:

Java

```java
class Solution {
   // Function to count the number of 1 bits in an integer
   public int hammingWeight(int n) {
       int count = 0;
       // Iterate through all 32 bits of the integer
       for (int i = 0; i < 32; i++) {
           // Check if the least significant bit is 1
           if ((n & 1) == 1) {
               count++;
           }
           // Shift the bits of n to the right by 1 to check the next bit
           n >>= 1;
       }
       return count;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(32\) = O\(1\): Since the integer is a fixed 32\-bit value\.
*   **Space Complexity:** O\(1\): Only constant space is used\.

## 2\. Bit Manipulation

#### Intuition:

The brute force approach can be optimized by using a clever trick with bit manipulation\. By repeatedly turning off the rightmost 1\-bit, we can directly count the 1\-bits without checking each individual bit\.

Doing `**n & (n - 1)**` **removes the rightmost 1\-bit from** `**n**`**\.**

**Why?**

*   Subtracting 1 flips the lowest 1\-bit to 0 and turns all bits to its right into 1s\.
*   AND\-ing the result with the original number clears exactly that lowest 1\-bit\.

Each application of this operation removes **one** set bit\. So if we repeat this process and count how many times it happens, the count equals the number of 1\-bits\.

This allows us to skip all zero bits and only operate on actual 1\-bits making it much faster than a brute force bit scan\.

#### Example Walkthrough

Let’s count the 1\-bits in: **n = 13 → binary: 1101**

```shell
Iteration 1:
n      = 1101
n - 1  = 1100
--------------
new n  = 1100   (rightmost 1 removed)
count = 1
Iteration 2:
n      = 1100
n - 1  = 1011
--------------
new n  = 1000   (rightmost 1 removed)
count = 2
Iteration 3:
n      = 1000
n - 1  = 0111
--------------
new n  = 0000   (rightmost 1 removed)
count = 3
Loop ends because n = 0. Total 1-bits: 3
```

#### Steps:

1.  Initialize a counter to track the number of 1 bits\.
2.  Loop while `n` is not zero\.
3.  Apply `n = n & (n - 1)` to turn off the lowest 1\-bit\.
4.  Increment the counter\.
5.  When all 1\-bits are removed and `n` becomes zero, return the counter\.

#### Code:

Java

```java
class Solution {
   // Function to count the number of 1 bits in an integer
   public int hammingWeight(int n) {
       int count = 0;
       // Iterate until n becomes zero
       while (n != 0) {
           // Perform n & (n - 1) to remove the rightmost 1-bit
           n = n & (n - 1);
           // Increment the counter for each 1-bit removed
           count++;
       }
       return count;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(k\): k is the number of 1\-bits in the integer\. In the worst case, k can be up to 32 for a 32\-bit integer\.
*   **Space Complexity:** O\(1\): Only constant space is used\.