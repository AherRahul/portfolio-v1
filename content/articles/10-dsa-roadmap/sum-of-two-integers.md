---
title: Sum of Two Integers
description: Master Sum of Two Integers in the Bit Manipulation module.
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

Given two integers `a` and `b`, return _the sum of the two integers without using the operators_ `+` _and_ `-`\.

##### **Example 1:**

**Input:** a = 1, b = 2

**Output:** 3

##### **Example 2:**

**Input:** a = 2, b = 3

**Output:** 5 

**Constraints:**

*   `-1000 <= a, b <= 1000`


## Approaches

### 1\. Iterative Bit Manipulation

The problem states that we need to sum two integers without using the operators `+` or `-`\. This can be achieved through bit manipulation using the concepts of XOR and carry\. Here's the step\-by\-step breakdown:

*   **XOR operation \(**`**a ^ b**`**\)**: This operation is like addition but ignores the carry\. If only one of the bits is set \(either in `a` or in `b`, but not both\), it will be set in the result\.
*   **AND operation \(**`**a & b**`**\)**: This helps to determine where there would be a carry\. When both bits are set \(in `a` and `b`\), a carry is generated\.
*   **Left shift operation \(**`**<<**`**\)**: After identifying the carry bits using `AND`, they need to be shifted left to add them at the next higher bit position\.
*   Repeat this process until there are no carries left to process\.

#### Code:

```java
class Solution {
   public int getSum(int a, int b) {
       // Continue the loop until there are no carries left
       while (b != 0) {
           // Calculate the carry
           int carry = a & b;
           // Calculate sum ignoring the carry
           a = a ^ b;
           // Update the carry, shifted left
           b = carry << 1;
       }
       // Finally, a contains the sum
       return a;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(1\), because the number of bits is fixed, the loop will iterate a finite number of times\.
*   **Space Complexity:** O\(1\), as no additional space is used\.

#### Example Walkthrough:

```shell
| Step | a (dec/bin)   | b (dec/bin)  | carry = a & b (bin) | next a = a ^ b (bin) | next b = carry << 1 (bin) |
| ---: | ------------- | ------------ | ------------------- | -------------------- | ------------------------- |
|    0 | 5 / 00000101  | 9 / 00001001 | –                   | –                    | –                         |
|    1 | 5 / 00000101  | 9 / 00001001 | 00000001            | 00001100 (12)        | 00000010 (2)              |
|    2 | 12 / 00001100 | 2 / 00000010 | 00000000            | 00001110 (14)        | 00000000 (0)              |
```

Stop when `b == 0`\. Final `a = 14` → `5 + 9 = 14`\.

### 2\. Recursive Bit Manipulation

This approach uses the same logic as the iterative approach but utilizes recursion instead\.

#### Code:

```java
class Solution {
   public int getSum(int a, int b) {
       // Base case: when there are no more carries to process
       if (b == 0) return a;
       // Calculate sum ignoring carries, and calculate the carry
       return getSum(a ^ b, (a & b) << 1);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(1\) since the recursion depth is limited by the number of bits in an integer\.
*   **Space Complexity:** O\(1\) if we consider just the computation\. However, there is a recursive call stack used which would typically be O\(n\) where n is the number of bits, but due to limits in integer size, it is effectively constant\.

#### [Solve it on LeetCode](https://leetcode.com/problems/sum-of-two-integers/)
