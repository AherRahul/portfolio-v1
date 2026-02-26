---
title: Split Array into Consecutive Subsequences
description: Master Split Array into Consecutive Subsequences in the Hash Tables
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

You are given an integer array `nums` that is **sorted in non\-decreasing order**\.

Determine if it is possible to split `nums` into **one or more subsequences** such that **both** of the following conditions are true:

*   Each subsequence is a **consecutive increasing sequence** \(i\.e\. each integer is **exactly one** more than the previous integer\)\.
*   All subsequences have a length of `3` **or more**\.

Return `true` _if you can split_ `nums` _according to the above conditions, or_ `false` _otherwise_\.

A **subsequence** of an array is a new array that is formed from the original array by deleting some \(can be none\) of the elements without disturbing the relative positions of the remaining elements\. \(i\.e\., `[1,3,5]` is a subsequence of `[``1``,2,``3``,4,``5``]` while `[1,3,2]` is not\)\. 

##### **Example 1:**

**Input:** nums = \[1,2,3,3,4,5\]

**Output:** true

**Explanation:** nums can be split into the following subsequences:

\[**1**,**2**,**3**,3,4,5\] \-\-> 1, 2, 3

\[1,2,3,**3**,**4**,**5**\] \-\-> 3, 4, 5

##### **Example 2:**

**Input:** nums = \[1,2,3,3,4,4,5,5\]

**Output:** true

**Explanation:** nums can be split into the following subsequences:

\[**1**,**2**,**3**,3,**4**,4,**5**,5\] \-\-> 1, 2, 3, 4, 5

\[1,2,3,**3**,4,**4**,5,**5**\] \-\-> 3, 4, 5

##### **Example 3:**

**Input:** nums = \[1,2,3,4,4,5\]

**Output:** false

**Explanation:** It is impossible to split nums into consecutive increasing subsequences of length 3 or more\.

##### **Constraints:**

*   **1 <= nums\.length <= 10****4**
*   **\-1000 <= nums\[i\] <= 1000**
*   `nums` is sorted in **non\-decreasing** order\.

#### [Solve it on LeetCode](https://leetcode.com/problems/split-array-into-consecutive-subsequences)

# Approaches

## 1\. Greedy with Frequency and Append Maps

#### **Intuition:**

The task is to determine if we can split a given array into consecutive subsequences of length at least 3\. The approach involves using two hash maps:

1.  `frequency` map to keep track of the remaining occurrences of each element\.
2.  `appendNeeded` map to track the need to append an element to a previously formed subsequence\.

The basic greedy strategy is:

*   We iterate through the array and for each element `num`:

*   First, check if `num` can be added to an existing subsequence where it can help form a valid consecutive sequence\.
*   If `num` can't be added to any existing subsequence, try to start a new subsequence from it\.
*   If neither is possible, we should return false because it is impossible to form the desired subsequences\.

#### **Steps:**

1.  Use a `frequency` map to track the available counts of each number\.
2.  Use an `appendNeeded` map to track if a number needs to be the next element in a subsequence\.
3.  Loop through each number `num` in the input:

*   If the `frequency` of `num` is zero, continue, meaning it's already used\.
*   If `num` can be appended to a subsequence \(i\.e\., `appendNeeded[num] > 0`\), reduce the need and increase the need for the next number\.
*   If `num` can't be appended, try starting a new subsequence `num, num+1, num+2` and update the necessary maps\.
*   If neither appending to a subsequence nor starting one is possible, return false\.

5.  If we can iterate through without issue, return true\.

#### Code:

Java

```java
class Solution {
   public boolean isPossible(int[] nums) {
       // Frequency map to track counts of each number
       Map<Integer, Integer> frequency = new HashMap<>();
       // To track where an element is needed to continue a sequence
       Map<Integer, Integer> appendNeeded = new HashMap<>();

       // Populate the frequency map
       for (int num : nums) {
           frequency.put(num, frequency.getOrDefault(num, 0) + 1);
       }

       // Iterate over the array
       for (int num : nums) {
           if (frequency.get(num) == 0) {
               continue;
           }

           // If there is a requirement to append num to a sequence
           if (appendNeeded.getOrDefault(num, 0) > 0) {
               // Reduce the need and increase the need for num+1
               appendNeeded.put(num, appendNeeded.get(num) - 1);
               appendNeeded.put(num + 1, appendNeeded.getOrDefault(num + 1, 0) + 1);
           }
           // Try to create a new sequence [num, num+1, num+2]
           else if (frequency.getOrDefault(num + 1, 0) > 0 && frequency.getOrDefault(num + 2, 0) > 0) {
               // Use num, num+1 and num+2
               frequency.put(num + 1, frequency.get(num + 1) - 1);
               frequency.put(num + 2, frequency.get(num + 2) - 1);
               // Now num+3 is awaited
               appendNeeded.put(num + 3, appendNeeded.getOrDefault(num + 3, 0) + 1);
           }
           // If none of the above actions are possible, return false
           else {
               return false;
           }

           // Decrease frequency of current number as it's used
           frequency.put(num, frequency.get(num) - 1);
       }

       // Returning true as all numbers can be split into subsequences
       return true;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of elements in the input array\. Each element is processed a constant number of times\.
*   **Space Complexity:** O\(n\), as we use extra space for the frequency and appendNeeded maps\.