---
title: Counting Bits
description: Master Counting Bits in the Bit Manipulation module. Comprehensive
  guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given an integer `n`, return _an array_ `ans` _of length_ `n + 1` _such that for each_ `i` \(`0 <= i <= n`\)_,_ `ans[i]` _is the_ _**number of**_ `1`_**'s**_ _in the binary representation of_ `i`\.

##### **Example 1:**

**Input:** n = 2

**Output:** \[0,1,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
  </div>
</div>

**Explanation:**

```shell
--> 0
--> 1
--> 10
```

##### **Example 2:**

**Input:** n = 5

**Output:** \[0,1,1,2,1,2\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
  </div>
</div>

**Explanation:**

```shell
--> 0
--> 1
--> 10
--> 11
--> 100
--> 101
```

##### **Constraints:**

*   **0 <= n <= 10****5**

##### **Follow up:**

*   It is very easy to come up with a solution with a runtime of `O(n log n)`\. Can you do it in linear time `O(n)` and possibly in a single pass?
*   Can you do it without using any built\-in function \(i\.e\., like `__builtin_popcount` in C\+\+\)?


## Approaches

### 1\. Naive Approach

#### Intuition:

The naive approach involves iterating over each number from 0 to n and calculating the number of 1's in its binary representation\. This can be achieved by repeatedly dividing the number by 2 and counting the remainder when divided by 2\.

#### Code:

```java
class Solution {
   public int[] countBits(int n) {
       int[] res = new int[n + 1];
       
       for (int i = 0; i <= n; i++) {
           int count = 0;
           int num = i;
           // Count the number of 1's in the binary representation of 'i'
           while (num > 0) {
               count += num % 2; // Add 1 to count if the least-significant bit is set
               num /= 2; // Right shift the number
           }
           res[i] = count;
       }
       return res;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n \* log\(n\)\) because for each number up to n, we are performing shifts proportional to log\(n\)\.
*   **Space Complexity:** O\(n\) for the output array\.

### 2\. DP with Last Significant Bit

#### Intuition:

A powerful way to compute the number of 1\-bits for all numbers from `0` to `n` is to use a simple observation about binary numbers:

For any number `i`:

```shell
countBits(i) = countBits(i >> 1) + (i & 1)
```

1.  **Right shift \(**`**i >> 1**`**\) removes the last bit\.** This means `i >> 1` is simply `i / 2` \(integer division\)\. So `i >> 1` has the same bits as `i` _except for the least significant bit_\.
2.  `**i & 1**` **extracts the last bit of** `**i**`**\.**

*   If it's odd → last bit is 1 → contributes \+1
*   If it's even → last bit is 0 → contributes \+0

This allows us to build the result using previously computed values, making the solution both efficient and elegant\.

Instead of counting bits from scratch for every number, we reuse the results from smaller numbers\.

#### Code:

```java
class Solution {
   public int[] countBits(int n) {
       int[] res = new int[n + 1];
       res[0] = 0;
       
       for (int i = 1; i <= n; i++) {
           // Use results from smaller numbers and add 1 if the current number is odd
           res[i] = res[i >> 1] + (i & 1);
       }
       return res;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) because we compute the number of bits for each number up to n exactly once\.
*   **Space Complexity:** O\(n\) for the output array\.

#### Example Walkthrough:

Let’s compute `res[0..7]`

*   `res[0] = 0`
*   `i = 1` → `res[1] = res[0] + 1 = 1`
*   `i = 2` → `res[2] = res[1] + 0 = 1`
*   `i = 3` → `res[3] = res[1] + 1 = 2`
*   `i = 4` → `res[4] = res[2] + 0 = 1`
*   `i = 5` → `res[5] = res[2] + 1 = 2`
*   `i = 6` → `res[6] = res[3] + 0 = 2`
*   `i = 7` → `res[7] = res[3] + 1 = 3`

### 3\. Powers of two

#### Intuition:

This approach relies on understanding how binary representations behave around powers of two\.

For any number **x**, if it lies in the interval: `2^m ≤ x < 2^(m+1)`

then we can express it as: `x = 2^m + k` where 0 ≤ k < 2^m

What does this mean in terms of set bits?

*   `2^m` has exactly **one** 1\-bit, and it appears at position _m_\.
*   The remaining part, `k`, contains whatever lower bits x has\.

So the number of 1\-bits in `x` becomes:

```shell
bits(x) = bits(k) + 1
```

This allows us to reuse previously computed results from the range `[0 … 2^m − 1]`\.

We simply identify the most recent power of two, subtract it from `x` to get `k`, and use:

```shell
res[x] = res[x - power_of_two] + 1
```

#### Code:

```java
class Solution {
   public int[] countBits(int n) {
       int[] res = new int[n + 1];
       int pow = 1; // Current power of two
       int x = 1; // Index at the current power level

       for (int i = 1; i <= n; i++) {
           if (i == pow) {
               pow *= 2; // Move to the next power of two
               x = i;
           }
           res[i] = res[i - x] + 1; // Use the result from a smaller index plus one
       }
       return res;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) because we are iterating over each element only once\.
*   **Space Complexity:** O\(n\) for the output array\.

#### [Solve it on LeetCode](https://leetcode.com/problems/counting-bits)
