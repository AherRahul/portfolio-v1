---
title: Merge Two Sorted Lists
description: Master Merge Two Sorted Lists in the Recursion & Backtracking
  module. Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

You are given the heads of two sorted linked lists `list1` and `list2`\.

Merge the two lists into one **sorted** list\. The list should be made by splicing together the nodes of the first two lists\.

Return _the head of the merged linked list_\. 

##### **Example 1:**

**Input:** list1 = \[1,2,4\], list2 = \[1,3,4\]

**Output:** \[1,1,2,3,4,4\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">4</span></div>
  </div>
</div>

##### **Example 2:**

**Input:** list1 = \[\], list2 = \[\]

**Output:** \[\]

##### **Example 3:**

**Input:** list1 = \[\], list2 = \[0\]

**Output:** \[0\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
  </div>
</div>

##### **Constraints:**

*   The number of nodes in both lists is in the range `[0, 50]`\.
*   `-100 <= Node.val <= 100`
*   Both `list1` and `list2` are sorted in **non\-decreasing** order\.


## Approaches

### 1\. Iterative Merge Approach

#### Intuition:

The easiest way to merge two sorted lists is to use an iterative approach\. We can start by creating a dummy node that acts as a placeholder for the start of the merged list\. We then use a current pointer to iterate through both lists and append the smaller node to the current node until we reach the end of one of the lists\. Finally, we append any remaining nodes from the non\-empty list\.

#### Code:

```java
class Solution {
   public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
       // Create a dummy node to act as the start of the merged list
       ListNode dummy = new ListNode(0);
       ListNode current = dummy;

       // While neither list is empty, pick the smaller head and append it to the merged list
       while (list1 != null && list2 != null) {
           if (list1.val <= list2.val) {
               current.next = list1;
               list1 = list1.next;
           } else {
               current.next = list2;
               list2 = list2.next;
           }
           current = current.next;
       }

       // At this point, at least one of the two lists is null
       // Append the remaining non-null list to the merged list
       if (list1 != null) {
           current.next = list1;
       } else {
           current.next = list2;
       }

       // Return the merged list starting from the node after the dummy node
       return dummy.next;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n \+ m\) where n and m are the lengths of the input lists\.
*   **Space Complexity:** O\(1\) since no additional space proportional to input size is used\.

### 2\. Recursive Merge Approach

#### Intuition:

Alternatively, we can use a recursive solution to merge the two lists\. The recursive approach involves merging the first nodes of each list, followed by the recursively merged result of the remainder of the lists\. This is achieved by continually selecting the smaller head node between the two lists until all nodes have been merged\.

#### Code:

```java
class Solution {
   public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
       // Base cases: if one list is empty, return the other list
       if (list1 == null) {
           return list2;
       }
       if (list2 == null) {
           return list1;
       }

       // Recursive merging: select the smaller head and merge with the rest
       if (list1.val <= list2.val) {
           list1.next = mergeTwoLists(list1.next, list2);
           return list1;
       } else {
           list2.next = mergeTwoLists(list1, list2.next);
           return list2;
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n \+ m\) where n and m are the lengths of the input lists, as each node is only visited once\.
*   **Space Complexity:** O\(n \+ m\) due to the recursion stack, which holds a frame for each recursive call\.

#### [Solve it on LeetCode](https://leetcode.com/problems/merge-two-sorted-lists)
