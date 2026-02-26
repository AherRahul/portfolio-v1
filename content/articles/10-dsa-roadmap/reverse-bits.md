---
title: Reverse Bits
description: Master Reverse Bits in the Bit Manipulation module. Comprehensive
  guide and algorithmic problem solving.
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

Reverse bits of a given 32 bits signed integer\.

##### **Example 1:**

**Input:** n = 43261596

**Output:** 964176192

**Explanation:**

43261596 \-> 00000010100101000001111010011100

964176192 \-> 00111001011110000010100101000000

##### **Example 2:**

**Input:** n = 2147483644

**Output:** 1073741822

**Explanation:**

2147483644 \-> 01111111111111111111111111111100

1073741822 \-> 00111111111111111111111111111110 

##### **Constraints:**

*   **0 <= n <= 2****31** **\- 2**
*   `n` is even\.

**Follow up:** If this function is called many times, how would you optimize it?

#### [Solve it on LeetCode](https://leetcode.com/problems/reverse-bits/)

# Approaches

## 1\. Simple Bit Manipulation

#### Intuition:

The problem of reversing bits can be solved by taking each bit from the rightmost side of the input number and placing it in the leftmost side of the result number\. We need to iterate over all 32 bits since the function requires us to handle a 32\-bit unsigned integer\.

#### Steps:

1.  Initialize a result variable to zero to store the reversed bits\.
2.  Use a loop to process all 32 bits of the number\.
3.  In each iteration, check if the least significant bit of the number is 1\.
4.  If it is 1, set the corresponding bit in the result by using left shift on the result and then OR operation\.
5.  Right shift the input number to process the next bit\.
6.  After processing all 32 bits, the 'result' variable will contain the reversed bits\.

#### Code:

Complexity Analysis

*   **Time Complexity:** O\(32\) = O\(1\), since we perform a constant amount of work \(32 iterations\)\.
*   **Space Complexity:** O\(1\), since we use a constant amount of space\.

## 2\. Efficient Bit Manipulation

#### Intuition:

Reversing bits one\-by\-one is slow because each bit must be individually inspected and moved\. A far more efficient approach is to **reverse bits in groups** using masks and shifts\.

The idea is:

*   First swap neighboring bits \(groups of 1\)\.
*   Then swap groups of 2 bits\.
*   Then 4\-bit groups \(nibbles\)\.
*   Then 8\-bit groups \(bytes\)\.
*   Then 16\-bit groups \(half\-words\)\.

By progressively doubling the size of the swapped chunks, we can reverse all 32 bits in only **5 operations,** dramatically faster than looping through all bits\.

This method exploits the power of:

*   **bit masks** to isolate specific chunks of bits
*   **bit shifts** to move those chunks into their reversed positions
*   **bitwise OR** to recombine the results

##### How the masks work:

Let’s imagine the 32\-bit number as:

#### Steps:

1.  Use masks to isolate and swap bits at target positions\.
2.  Start by swapping adjacent pairs, followed by swapping nibbles \(4\-bit groups\), then octets \(8\-bit groups\), and finally by half\-words \(16\-bit groups\)\.
3.  This approach exploits the property of bit manipulation using masks and shifts to achieve a similar result in fewer operations\.

#### Code:

Complexity Analysis

*   **Time Complexity**: O\(1\), since we're performing a fixed number of operations\.
*   **Space Complexity**: O\(1\), as only a constant amount of space is required\.