---
title: Furthest Building You Can Reach
description: Master Furthest Building You Can Reach in the Heaps module.
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

You are given an integer array `heights` representing the heights of buildings, some `bricks`, and some `ladders`\.

You start your journey from building `0` and move to the next building by possibly using bricks or ladders\.

While moving from building `i` to building `i+1` \(**0\-indexed**\),

*   If the current building's height is **greater than or equal** to the next building's height, you do **not** need a ladder or bricks\.
*   If the current building's height is **less than** the next building's height, you can either use **one ladder** or `(h[i+1] - h[i])` **bricks**\.

_Return the furthest building index \(0\-indexed\) you can reach if you use the given ladders and bricks optimally\._

##### **Example 1:**

**Input:** heights = \[4,2,7,6,9,14,12\], bricks = 5, ladders = 1

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">9</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">14</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">12</span></div>
  </div>
</div>

**Output:** 4

**Explanation:** Starting at building 0, you can follow these steps:

\- Go to building 1 without using ladders nor bricks since 4 >= 2\.

\- Go to building 2 using 5 bricks\. You must use either bricks or ladders because 2 < 7\.

\- Go to building 3 without using ladders nor bricks since 7 >= 6\.

\- Go to building 4 using your only ladder\. You must use either bricks or ladders because 6 < 9\.

It is impossible to go beyond building 4 because you do not have any more bricks or ladders\.

##### **Example 2:**

**Input:** heights = \[4,12,2,7,3,18,20,3,19\], bricks = 10, ladders = 2

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">12</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">18</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">20</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">7</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">8</span><span class="arr-val">19</span></div>
  </div>
</div>

**Output:** 7

##### **Example 3:**

**Input:** heights = \[14,3,19,3\], bricks = 17, ladders = 0

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">14</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">19</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">3</span></div>
  </div>
</div>

**Output:** 3

##### **Constraints:**

*   **1 <= heights\.length <= 10****5**
*   **1 <= heights\[i\] <= 10****6**
*   **0 <= bricks <= 10****9**
*   **0 <= ladders <= heights\.length**


## Approaches

### 1\. Brute Force with Linear Search

#### Intuition:

The simplest approach to solve the problem is to iterate through each building and determine whether the jump to the next building can be achieved using available bricks and ladders\. We attempt to use bricks first and only resort to ladders when bricks are insufficient\. This approach ensures we use available resources optimally, although it may not be the most efficient for larger inputs\.

#### Code:

```java
class Solution {
   public int furthestBuilding(int[] heights, int bricks, int ladders) {
       for (int i = 0; i < heights.length - 1; i++) {
           int diff = heights[i + 1] - heights[i];
           
           // Move to the next building if it is lower or the same height
           if (diff <= 0) continue;
           
           // Use bricks if the next building is higher
           if (diff <= bricks) {
               bricks -= diff;
           } 
           // Use a ladder if the bricks aren't enough
           else if (ladders > 0) {
               ladders--;
           } 
           // Return the index if neither bricks nor ladders are sufficient
           else {
               return i;
           }
       }
       return heights.length - 1;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of buildings\. We inspect each pair of buildings once\.
*   **Space Complexity:** O\(1\), as we use constant extra space\.

### 2\. Priority Queue

#### Intuition:

The Brute Force Method involves using resources optimally one at a time, but an optimal approach would be to strategically use ladders and conserve bricks for smaller gaps\. This can be managed better by utilizing a min\-heap \(priority queue\), focusing on the largest height differences where ladders are more beneficial\.

1.  Always attempt to use bricks for the jump\.
2.  If bricks run out, swap the largest brick usage with a ladder using the heap to track the largest jumps requiring bricks\.
3.  If the swap exhausts the ladders, return the index\.

#### Code:

```java
class Solution {
   public int furthestBuilding(int[] heights, int bricks, int ladders) {
       PriorityQueue<Integer> pq = new PriorityQueue<>();
       
       for (int i = 0; i < heights.length - 1; i++) {
           int diff = heights[i + 1] - heights[i];
           
           // Only consider jumps that require climbing up
           if (diff > 0) {
               pq.add(diff);  // Track this jump in the heap
               
               // If bricks are insufficient, replace the largest used bricks with a ladder
               if (pq.size() > ladders) {
                   bricks -= pq.poll();  // Remove the smallest jump once ladders replace enough bricks
               }
               
               // If bricks run out, return the current position
               if (bricks < 0) {
                   return i;
               }
           }
       }
       return heights.length - 1;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n log k\), where n is the number of buildings and k is the number of ladders, due to heap operations \(insertion and deletion\)\.
*   **Space Complexity:** O\(k\), where k is the number of ladders, corresponding to the maximum size of the heap\.

#### [Solve it on LeetCode](https://leetcode.com/problems/furthest-building-you-can-reach)
