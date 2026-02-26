---
title: Smallest Range Covering Elements from K Lists
description: Master Smallest Range Covering Elements from K Lists in the Heaps
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

You have `k` lists of sorted integers in **non\-decreasing order**\. Find the **smallest** range that includes at least one number from each of the `k` lists\.

We define the range `[a, b]` is smaller than range `[c, d]` if `b - a < d - c` **or** `a < c` if `b - a == d - c`\.

##### **Example 1:**

**Input:** nums = \[\[4,10,15,24,26\],\[0,9,12,20\],\[5,18,22,30\]\]

**Output:** \[20,24\]

**Explanation:**

List 1: \[4, 10, 15, 24,26\], 24 is in range \[20,24\]\.

List 2: \[0, 9, 12, 20\], 20 is in range \[20,24\]\.

List 3: \[5, 18, 22, 30\], 22 is in range \[20,24\]\.

##### **Example 2:**

**Input:** nums = \[\[1,2,3\],\[1,2,3\],\[1,2,3\]\]

**Output:** \[1,1\]

##### **Constraints:**

*   **nums\.length == k**
*   **1 <= k <= 3500**
*   **1 <= nums\[i\]\.length <= 50**
*   **\-10****5** **<= nums\[i\]\[j\] <= 10****5**
*   **nums\[i\] is sorted in non\-decreasing order\.**

#### [Solve it on LeetCode](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists)

# Approaches

## 1\. Priority Queue \(Heap\) Approach

#### Intuition:

The problem requires finding the smallest range that includes at least one number from each of K lists\. We can use a min\-heap to efficiently track the smallest current number across all lists and try to widen our range by tracking maximum elements simultaneously\.

1.  Initialize a min\-heap and add the first element of each list along with its index\.
2.  Track the current maximum number across list frontrunners\.
3.  Expand the smallest number \(from the heap\) by pulling the next element from the same list\.
4.  Update and check the range every time the heap is updated\.

#### Code:

Java

```java
class Solution {
   public int[] smallestRange(List<List<Integer>> nums) {
       // Define a min-heap to store elements as (value, list index, element index)
       PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
       int max = Integer.MIN_VALUE;
       
       // Initialize the heap with the first element from each list
       for (int i = 0; i < nums.size(); i++) {
           int current = nums.get(i).get(0);
           minHeap.offer(new int[] {current, i, 0});
           max = Math.max(max, current); // Track the max initial element
       }

       int start = 0, end = Integer.MAX_VALUE;
       
       // Process until we run out of elements to form a valid range
       while (minHeap.size() == nums.size()) {
           // Extract the smallest element
           int[] e = minHeap.poll();
           int value = e[0], listIndex = e[1], elementIndex = e[2];

           // Update range if it's smaller
           if (max - value < end - start) {
               start = value;
               end = max;
           }
           
           // Add next element in the list if available
           if (elementIndex + 1 < nums.get(listIndex).size()) {
               int nextVal = nums.get(listIndex).get(elementIndex + 1);
               minHeap.offer(new int[] {nextVal, listIndex, elementIndex + 1});
               max = Math.max(max, nextVal); // Update max if necessary
           }
       }

       return new int[] {start, end};
   }
}
```

Complexity Analysis

*   **Time Complexity:** **O\(N log K\)**, where N is the total number of elements across all lists and K is the number of lists\. The heap operations \(insert, delete\) are log K, performed N times\.
*   **Space Complexity:** **O\(K\)**, where K is the number of lists\. This is due to storing one element from each list in the heap\.

## 2\. Two Pointers with Sorted List

#### Intuition:

By flattening all lists into a single sorted list while keeping track of their origins, we can use a two\-pointer technique to identify the smallest range covering all lists\.

1.  Flatten the list with additional information to identify elements' origin\.
2.  Use two pointers to scan through the list and check complete coverage\.
3.  Attempt to shrink the range by moving the left pointer once coverage is ensured\.

#### Code:

Java

```java
class Solution {
   public int[] smallestRange(List<List<Integer>> nums) {
       List<int[]> sortedElements = new ArrayList<>();
       
       // Collect all elements with list indices
       for (int i = 0; i < nums.size(); i++) {
           for (int num : nums.get(i)) {
               sortedElements.add(new int[] {num, i});
           }
       }
       
       // Sort the list based on the values
       Collections.sort(sortedElements, Comparator.comparingInt(a -> a[0]));
       
       int start = 0, minRange = Integer.MAX_VALUE;
       int[] range = new int[2];
       int count = 0, left = 0;
       int[] frequency = new int[nums.size()];
       
       // Use a sliding window approach
       for (int right = 0; right < sortedElements.size(); right++) {
           int[] element = sortedElements.get(right);
           frequency[element[1]]++;
           
           // Increase the count when the current list first element is included
           if (frequency[element[1]] == 1) {
               count++;
           }

           // Once all lists are covered, try to shrink the range
           while (count == nums.size()) {
               int leftVal = sortedElements.get(left)[0];
               int rightVal = sortedElements.get(right)[0];
               
               if (rightVal - leftVal < minRange) {
                   minRange = rightVal - leftVal;
                   range[0] = leftVal;
                   range[1] = rightVal;
               }
               
               // Shrink from the left
               int leftListIndex = sortedElements.get(left)[1];
               frequency[leftListIndex]--;
               
               if (frequency[leftListIndex] == 0) {
                   count--; // No full coverage if we lose a list
               }
               
               left++;
           }
       }
       
       return range;
   }
}
```

Complexity Analysis

*   **Time Complexity:** **O\(N log N\)**, where N is the total number of elements across all lists due to the sorting process\.
*   **Space Complexity:** **O\(N\)**, because we store all elements with their list indices and frequency map\.