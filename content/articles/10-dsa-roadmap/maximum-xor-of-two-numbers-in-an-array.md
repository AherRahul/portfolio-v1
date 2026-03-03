---
title: Maximum XOR of Two Numbers in an Array
description: Master Maximum XOR of Two Numbers in an Array in the Tries module.
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

Given an integer array `nums`, return _the maximum result of_ `nums[i] XOR nums[j]`, where `0 <= i <= j < n`\.

##### **Example 1:**

**Input:** nums = \[3,10,5,25,2,8\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">10</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">25</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">8</span></div>
  </div>
</div>

**Output:** 28

**Explanation:** The maximum result is 5 XOR 25 = 28\.

##### **Example 2:**

**Input:** nums = \[14,70,53,83,49,91,36,80,92,51,66,70\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">14</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">70</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">53</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">83</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">49</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">91</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">36</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">7</span><span class="arr-val">80</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">8</span><span class="arr-val">92</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">9</span><span class="arr-val">51</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">10</span><span class="arr-val">66</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">11</span><span class="arr-val">70</span></div>
  </div>
</div>

**Output:** 127

##### **Constraints:**

*   **1 <= nums\.length <= 2 \* 10****5**
*   **0 <= nums\[i\] <= 2****31** **\- 1**


## Approaches

### 1\. Brute Force Approach

#### Intuition:

For the brute force method, we consider each possible pair of numbers in the array and calculate their XOR\. The XOR operation will give us a number with bits set where the bits differ between the two numbers\. Our task is to find the two numbers that maximize this XOR\. This approach checks all pairs and picks the one with the maximum XOR value\.

#### Steps:

1.  Initialize a variable `maxXOR` to zero\.
2.  For every pair of numbers `(A[i], A[j])` in the array, compute the XOR `A[i] ^ A[j]`\.
3.  Update `maxXOR` if the computed XOR is greater than `maxXOR`\.
4.  Return `maxXOR`\.

#### Code:

```java
class Solution {
   public int findMaximumXOR(int[] nums) {
       int maxXOR = 0;
       for (int i = 0; i < nums.length; i++) {
           for (int j = i + 1; j < nums.length; j++) {
               // Calculate the XOR for this pair
               int currentXOR = nums[i] ^ nums[j];
               // Update maxXOR if the currentXOR is larger
               maxXOR = Math.max(maxXOR, currentXOR);
           }
       }
       return maxXOR;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) \- We iterate over all possible pairs in the array\.
*   **Space Complexity:** O\(1\) \- No additional space is used except for a few variables\.

### 2\. Optimal Approach Using Trie

#### Intuition:

The key idea is to use a Trie \(prefix tree\) to efficiently find two numbers in the array that can form the maximum XOR result\. By inserting all numbers in the Trie and using bit manipulation, we can find pairs leading to maximum XOR efficiently\. This relies on the fact that XOR tends to maximize when we have opposing bits \(i\.e\., one bit is `0`, the other is `1`\)\.

#### Steps:

1.  Define a Trie structure with only two children for each node, representing a bit of `0` or `1`\.
2.  Insert each number in the array into the Trie\.
3.  As each number is inserted, simultaneously calculate the maximum XOR for that number with the previously inserted numbers in the Trie\.
4.  Return the highest XOR obtained\.

#### Code:

```java
class TrieNode {
   TrieNode[] children = new TrieNode[2];
}

class Solution {
   public int findMaximumXOR(int[] nums) {
       TrieNode root = new TrieNode();
       int maxXOR = 0;

       for (int num : nums) {
           TrieNode current = root, complement = root;
           int currentXOR = 0;
           for (int i = 31; i >= 0; i--) {
               int bit = (num >> i) & 1;
               // Insert bit in Trie
               if (current.children[bit] == null) {
                   current.children[bit] = new TrieNode();
               }
               current = current.children[bit];
               
               // Search for complement bit
               int toggledBit = bit ^ 1;
               if (complement.children[toggledBit] != null) {
                   currentXOR = (currentXOR << 1) | 1;
                   complement = complement.children[toggledBit];
               } else {
                   currentXOR = (currentXOR << 1);
                   complement = complement.children[bit];
               }
           }
           // Update maxXOR with the current number's optimum XOR
           maxXOR = Math.max(maxXOR, currentXOR);
       }

       return maxXOR;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n \* 32\) \- Each number is pushed into the Trie in O\(32\) time complexity, equivalent to the number of bits in an integer, and we process each number\.
*   **Space Complexity:** O\(n \* 32\) \- Space used in the Trie for storing all n numbers, each represented by a sequence of 32 bits\.

#### [Solve it on LeetCode](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array)
