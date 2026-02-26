---
title: Random Pick with Weight
description: Master Random Pick with Weight in the Binary Search module.
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

You are given a **0\-indexed** array of positive integers `w` where `w[i]` describes the **weight** of the `i``th` index\.

You need to implement the function `pickIndex()`, which **randomly** picks an index in the range `[0, w.length - 1]` \(**inclusive**\) and returns it\. The **probability** of picking an index `i` is `w[i] / sum(w)`\.

*   For example, if `w = [1, 3]`, the probability of picking index `0` is `1 / (1 + 3) = 0.25` \(i\.e\., `25%`\), and the probability of picking index `1` is `3 / (1 + 3) = 0.75` \(i\.e\., `75%`\)\.

##### **Example 1:**

**Input**

\["Solution","pickIndex"\]

\[\[\[1\]\],\[\]\]

**Output**

\[null,0\]

**Explanation**

```java
Solution solution = new Solution([1]);
solution.pickIndex(); // return 0. The only option is to return 0 since there is only one element in w.
```

##### **Example 2:**

**Input**

\["Solution","pickIndex","pickIndex","pickIndex","pickIndex","pickIndex"\]

\[\[\[1,3\]\],\[\],\[\],\[\],\[\],\[\]\]

**Output**

\[null,1,1,1,1,0\]

**Explanation**

```java
Solution solution = new Solution([1, 3]);
solution.pickIndex(); // return 1. It is returning the second element (index = 1) that has a probability of 3/4.
solution.pickIndex(); // return 1
solution.pickIndex(); // return 1
solution.pickIndex(); // return 1
solution.pickIndex(); // return 0. It is returning the first element (index = 0) that has a probability of 1/4.
```

Since this is a randomization problem, multiple answers are allowed\.

All of the following outputs can be considered correct:

\[null,1,1,1,1,0\]

\[null,1,1,1,1,1\]

\[null,1,1,1,0,0\]

\[null,1,1,1,0,1\]

\[null,1,0,1,0,0\]

\.\.\.\.\.\.and so on\.

##### **Constraints:**

*   **1 <= w\.length <= 10****4**
*   **1 <= w\[i\] <= 10****5**
*   `pickIndex` will be called at most `10``4` times\.

#### [Solve it on LeetCode](https://leetcode.com/problems/random-pick-with-weight)

# Approaches

## 1\. Prefix Sum \+ Binary Search Approach

#### **Intuition:**

The main goal is to pick an index `i` with a probability proportional to `w[i]`\. If we imagine each weight as a segment on a line of length `sum(weights)`, then we can pick a random point on this line and determine which segment it falls into using binary search\. Thus, the problem boils down to constructing a prefix sum array and using binary search to determine our pick\.

1.  Compute prefix sums of the weights\. This helps in cumulatively understanding the "length" of each segment\.
2.  Use random function to pick a target in the range of 0 to the total sum of weights\.
3.  Use binary search to find the index where the target falls in the prefix sum array\.

#### **Code:**

Java

```java
class Solution {
   private int[] prefixSums;
   private Random rand;
   private int totalSum;

   public Solution(int[] w) {
       this.prefixSums = new int[w.length];
       this.rand = new Random();
       
       // Compute the prefix sum array
       int runningSum = 0;
       for (int i = 0; i < w.length; i++) {
           runningSum += w[i];
           prefixSums[i] = runningSum;
       }
       this.totalSum = runningSum;  // Total weight sum
   }
   
   public int pickIndex() {
       // Generate a random number between 0 (inclusive) and totalSum (exclusive)
       int target = rand.nextInt(totalSum);
       
       // Binary search to find the correct index
       int low = 0, high = prefixSums.length - 1;
       while (low < high) {
           int mid = low + (high - low) / 2;
           if (prefixSums[mid] > target) {
               high = mid;
           } else {
               low = mid + 1;
           }
       }
       return low;
   }
}
```

Complexity Analysis

*   **Time Complexity:** Preprocessing: O\(N\), where N is the length of the weights array to compute prefix sums\. Pick Index: O\(log N\) due to binary search\.
*   **Space Complexity:** O\(N\) for storing the prefix sum array\.

## 2\. Binary Search Tree Approach \(Optimal\)

#### **Intuition:**

This approach uses a dynamic data structure like a balanced binary search tree \(e\.g\., `TreeMap` in Java\) to store cumulative weights, allowing for efficient cumulative lookup and random access\. This is especially efficient if weights frequently update or if the number of weights \(N\) is very large\.

1.  Store cumulative weights in a `TreeMap`, where each key is a cumulative weight, and the value is the corresponding index\.
2.  For each `pickIndex` call, randomly determine a target and find the smallest key in the map greater or equal to the target\.

#### **Code:**

Java

```java
class Solution {
   private TreeMap<Integer, Integer> map;
   private Random rand;
   private int totalSum;

   public Solution(int[] w) {
       this.map = new TreeMap<>();
       this.rand = new Random();
       
       int cumulativeSum = 0;
       for (int i = 0; i < w.length; i++) {
           cumulativeSum += w[i];
           map.put(cumulativeSum, i);
       }
       this.totalSum = cumulativeSum;
   }
   
   public int pickIndex() {
       int target = rand.nextInt(totalSum);
       // Find the smallest key greater than target. This gives the cumulative weight.
       return map.higherEntry(target).getValue();
   }
}
```

Complexity Analysis

*   **Time Complexity:** Preprocessing: O\(N log N\) due to insertions into the tree map\. Pick Index: O\(log N\) since searching through the `TreeMap` is logarithmic on average\.
*   **Space Complexity:** O\(N\) due to storing the cumulative sums in the `TreeMap`\.