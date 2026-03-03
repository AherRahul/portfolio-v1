---
title: Merge Intervals
description: Master Merge Intervals in the Intervals module. Comprehensive guide
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

Given an array of `intervals` where **intervals\[i\] = \[start****i****, end****i****\]**, merge all overlapping intervals, and return _an array of the non\-overlapping intervals that cover all the intervals in the input_\.

##### **Example 1:**

**Input:** intervals = \[\[1,3\],\[2,6\],\[8,10\],\[15,18\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">6</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">8</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">10</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">15</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">18</span></div>
    </div>
  </div>
</div>

**Output:** \[\[1,6\],\[8,10\],\[15,18\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">6</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">8</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">10</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">15</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">18</span></div>
    </div>
  </div>
</div>

**Explanation:** Since intervals \[1,3\] and \[2,6\] overlap, merge them into \[1,6\]\.

##### **Example 2:**

**Input:** intervals = \[\[1,4\],\[4,5\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
    </div>
  </div>
</div>

**Output:** \[\[1,5\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">5</span></div>
    </div>
  </div>
</div>

**Explanation:** Intervals \[1,4\] and \[4,5\] are considered overlapping\.

##### **Example 3:**

**Input:** intervals = \[\[4,7\],\[1,4\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">7</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
    </div>
  </div>
</div>

**Output:** \[\[1,7\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">7</span></div>
    </div>
  </div>
</div>

**Explanation:** Intervals \[1,4\] and \[4,7\] are considered overlapping\.

##### **Constraints:**

*   **1 <= intervals\.length <= 10****4**
*   **intervals\[i\]\.length == 2**
*   **0 <= start****i** **<= end****i** **<= 10****4**


## Approaches

### 1\. Brute Force \- Comparing All Intervals

#### Intuition:

The simplest, although not the most efficient, way to solve the problem is to compare each interval with every other interval to check for any overlapping\. If two intervals overlap, they are merged into one\. This process continues until we can no longer find any new intervals to merge, indicating all possible merges have been completed\.

#### Steps:

1.  Iterate over every interval and check with all other intervals whether they overlap\.
2.  If two intervals overlap, merge them and replace in the original list\.
3.  Continue this until no more merges can occur\.

#### Code:

```java
class MergeIntervals {
   public int[][] merge(int[][] intervals) {
       // We need to continue merging until no more merges are possible
       boolean hasMerged;
       do {
           hasMerged = false;
           List<int[]> merged = new ArrayList<>();
           for (int i = 0; i < intervals.length; i++) {
               boolean mergedCurrent = false;
               for (int j = 0; j < merged.size(); j++) {
                   // Check if intervals[i] overlaps with an interval in merged
                   if (merged.get(j)[1] >= intervals[i][0] && merged.get(j)[0] <= intervals[i][1]) {
                       // They overlap, merge them
                       merged.get(j)[0] = Math.min(merged.get(j)[0], intervals[i][0]);
                       merged.get(j)[1] = Math.max(merged.get(j)[1], intervals[i][1]);
                       hasMerged = true;
                       mergedCurrent = true;
                       break;
                   }
               }
               if (!mergedCurrent) {
                   // If current interval has not been merged, add it to the list
                   merged.add(intervals[i].clone());
               }
           }
           intervals = merged.toArray(new int[merged.size()][]);
       } while (hasMerged);
       return intervals;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\), where n is the number of intervals\. Each interval can potentially be compared with every other interval\.
*   **Space Complexity:** O\(n\), used for storing the merged intervals\.

### 2\. Sort and Merge

#### Intuition:

A more optimal way to tackle the problem is to take advantage of sorting\. By sorting intervals based on the start time, we can efficiently check for overlaps by comparing each interval with the last interval in a merged list\. If they overlap, merge them; otherwise, just add the interval to the merged list\.

#### Steps:

1.  Sort the list of intervals based on the starting time\.
2.  Iterate through sorted intervals\.
3.  Compare the current interval with the last merged interval:

*   If they overlap, merge them\.
*   If not, simply add the current interval to the result\.

#### Code:

```java
class MergeIntervals {
   public int[][] merge(int[][] intervals) {
       if (intervals.length <= 1) {
           return intervals;
       }
       
       // Sort the intervals by their start time
       Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
       
       // Use a LinkedList to hold the merged intervals
       LinkedList<int[]> merged = new LinkedList<>();
       
       // Iterate through the sorted intervals
       for (int[] interval : intervals) {
           // If merged list is empty or no overlap with the last interval in merged
           if (merged.isEmpty() || merged.getLast()[1] < interval[0]) {
               merged.add(interval);
           } else {
               // If there is an overlap, merge the current interval with the last one
               merged.getLast()[1] = Math.max(merged.getLast()[1], interval[1]);
           }
       }
       
       return merged.toArray(new int[merged.size()][]);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n log n\), where n is the number of intervals\. Sorting the intervals dominates the time complexity\.
*   **Space Complexity:** O\(n\), used for storing the merged intervals\.

#### [Solve it on LeetCode](https://leetcode.com/problems/merge-intervals)
