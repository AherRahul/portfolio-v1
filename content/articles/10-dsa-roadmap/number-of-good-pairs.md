---
title: Number of Good Pairs
description: Master Number of Good Pairs in the Hash Tables module.
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

Given an array of integers `nums`, return _the number of_ _**good pairs**_\.

A pair `(i, j)` is called _good_ if `nums[i] == nums[j]` and `i` < `j`\. 

##### **Example 1:**

Input:nums=\[1,2,3,1,1,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">3</span></div>
  </div>
</div>

Output:4

**Explanation:** There are 4 good pairs \(0,3\), \(0,4\), \(3,4\), \(2,5\)\.

##### **Example 2:**

Input:nums=\[1,1,1,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
  </div>
</div>

Output:6

**Explanation:** Each pair in the array are _good_\.

##### **Example 3:**

Input:nums=\[1,2,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
  </div>
</div>

Output:0

##### **Constraints:**

*   **1 <= nums\.length <= 100**
*   **1 <= nums\[i\] <= 100**


## Approaches

### 1\. Brute Force

#### **Intuition:**

The simplest approach is to check every possible pair `(i, j)` where `0 <= i < j < nums.length` and check if they are equal\. If they are, we have found a "good pair\."

#### **Steps:**

1.  Initialize a counter `count` to zero to keep track of good pairs\.
2.  Use two nested loops, the outer loop \(`i`\) goes from `0` to `nums.length - 1`, and the inner loop \(`j`\) runs from `i+1` to `nums.length - 1`\.
3.  For each pair `(i, j)`, check if `nums[i] == nums[j]`\. If yes, increment the `count`\.
4.  Return the `count` after both loops have finished\.

#### Code:

```java
class Solution {
   public int numIdenticalPairs(int[] nums) {
       int count = 0;
       // Outer loop to fix the first element of the pair
       for (int i = 0; i < nums.length; i++) {
           // Inner loop to fix the second element of the pair
           for (int j = i + 1; j < nums.length; j++) {
               // Check if we have a good pair
               if (nums[i] == nums[j]) {
                   count++;
               }
           }
       }
       return count;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) due to nested for loops\.
*   **Space Complexity:** O\(1\)\.

### 2\. HashMap

#### **Intuition:**

Instead of comparing pairs directly \(which would take O\(n²\) time\), we can count how many times each number appears using a **HashMap**\. Every time we encounter a number we've already seen, it forms a “good pair” with all its previous occurrences\.

If a number appears **n** times, the total number of good pairs formed by that number is:

\[Pairs=2n\(n−1\)​\]

But rather than using the formula at the end, we can compute pairs **incrementally** as we traverse the array:

*   When the first occurrence arrives → contributes 0 pairs
*   Second occurrence → contributes 1 new pair
*   Third occurrence → contributes 2 new pairs
*   Fourth occurrence → contributes 3 new pairs
*   … and so on

So when we encounter a number again, we simply add its current frequency to the answer\.

#### **Steps:**

1.  Use a HashMap to store the frequency of each number in the array\.
2.  Iterate through the array, updating the frequency of each number in the HashMap\.
3.  For each number encountered again, increment the count of good pairs using the formula for combinations since each new occurrence can pair with all previous ones\.
4.  Return the total count of good pairs\.

#### Code:

```java
class Solution {
   public int numIdenticalPairs(int[] nums) {
       HashMap<Integer, Integer> map = new HashMap<>();
       int count = 0;
       
       // Iterate over each number in the array
       for (int num : nums) {
           // If number is already seen, it can form pairs with all previous occurrences
           if (map.containsKey(num)) {
               // Increment count by the number of occurrences seen so far
               count += map.get(num);
               // Increment the occurrence count in the map
               map.put(num, map.get(num) + 1);
           } else {
               // If number is seen for the first time, put it in the map
               map.put(num, 1);
           }
       }
       return count;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) since iterating through the array only once\.
*   **Space Complexity:** O\(n\) since using hashmap\. In the worse case, it may end up storing all the array elements\.

#### [Solve it on LeetCode](https://leetcode.com/problems/number-of-good-pairs)
