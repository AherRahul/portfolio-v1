---
title: Insert Interval
description: Master Insert Interval in the Intervals module. Comprehensive guide
  and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

You are given an array of non\-overlapping intervals `intervals` where **intervals\[i\] = \[start****i****, end****i****\]** represent the start and the end of the **i****th** interval and `intervals` is sorted in ascending order by **start****i**\. You are also given an interval `newInterval = [start, end]` that represents the start and end of another interval\.

Insert `newInterval` into `intervals` such that `intervals` is still sorted in ascending order by **start****i** and `intervals` still does not have any overlapping intervals \(merge overlapping intervals if necessary\)\.

Return `intervals` _after the insertion_\.

**Note** that you don't need to modify `intervals` in\-place\. You can make a new array and return it\.

##### **Example 1:**

**Input:** intervals = \[\[1,3\],\[6,9\]\], newInterval = \[2,5\]

**Output:** \[\[1,5\],\[6,9\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">5</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">6</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">9</span></div>
    </div>
  </div>
</div>

##### **Example 2:**

**Input:** intervals = \[\[1,2\],\[3,5\],\[6,7\],\[8,10\],\[12,16\]\], newInterval = \[4,8\]

**Output:** \[\[1,2\],\[3,10\],\[12,16\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">2</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">10</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">12</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">16</span></div>
    </div>
  </div>
</div>

**Explanation:** Because the new interval \[4,8\] overlaps with \[3,5\],\[6,7\],\[8,10\]\.

##### **Constraints:**

*   **0 <= intervals\.length <= 10****4**
*   **intervals\[i\]\.length == 2**
*   **0 <= start****i** **<= end****i** **<= 10****5**
*   **intervals is sorted by start****i** **in ascending order\.**
*   **newInterval\.length == 2**
*   **0 <= start <= end <= 10****5**


## Approaches

### 1\. Basic Linear Scan Insertion

#### Intuition:

The idea is to go through the intervals and find where the `newInterval` should fit\. We do this by keeping track of whether we are before the new interval, within it, or past it\. We can add all non\-merged intervals to a result list and then merge the new interval where necessary\.

#### Code:

#### Complexity Analysis

*   **Time Complexity:** O\(n\) \- We make a single pass over the intervals\.
*   **Space Complexity:** O\(n\) \- We store the result in a new list which, in the worst case, could be as large as the input\.

### 2\. Optimal Merge Based Insertion

#### Intuition:

While the first solution is efficient, this slightly optimized version ensures that we're minimizing operations on the intervals by directly placing them without additional checks once the current interval doesn't overlap\. The core idea remains the same, making use of efficient merging and non\-overlapping checks\.

#### Code:

#### Complexity Analysis

*   **Time Complexity:** O\(n\) \- Similar to the first approach, as each interval is visited once\.
*   **Space Complexity:** O\(n\) \- Storing the resulting intervals in a list\.

#### [Solve it on LeetCode](https://leetcode.com/problems/insert-interval)
