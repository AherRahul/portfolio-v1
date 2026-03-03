---
title: Remove Duplicates from Sorted List II
description: Master Remove Duplicates from Sorted List II in the Linked List
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

Given the `head` of a sorted linked list, _delete all nodes that have duplicate numbers, leaving only distinct numbers from the original list_\. Return _the linked list_ _**sorted**_ _as well_\. 

##### **Example 1:**

Input:head=\[1,3,3,4,4,5\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">5</span></div>
  </div>
</div>

null

Output:\[1,5\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">5</span></div>
  </div>
</div>

null

##### **Example 2:**

Input:head=\[1,1,1,2,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">3</span></div>
  </div>
</div>

null

Output:\[2,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
  </div>
</div>

null

##### **Constraints:**

*   The number of nodes in the list is in the range `[0, 300]`\.
*   `-100 <= Node.val <= 100`
*   The list is guaranteed to be **sorted** in ascending order\.


## Approaches

### 1\. Two Pointers with Dummy Node

#### **Intuition:**

In this problem, we are dealing with a sorted linked list\. The goal is to remove all nodes that have duplicate numbers, leaving only distinct numbers from the original list\.

*   The sorted nature of the list allows us to detect duplicates by simply comparing adjacent nodes\.
*   To handle edge cases, like a head that needs to be removed because it's duplicated, we can use a dummy node\. A dummy node is a temporary node that helps simplify edge case handling, such as head deletion\.
*   By using two pointers, `prev` and `current`, we can manage list traversal and modification efficiently\.

#### **Steps:**

1.  Initialize a dummy node that points to the head of the linked list\.
2.  Use a pointer `prev` to track the last node before the sequence of duplicates\.
3.  Use another pointer `current` to iterate through the list\.
4.  For each node, compare it with the next node to check if it's a start of a duplicate sequence\.
5.  When a series of duplicates is detected, `prev`’s next is linked to the node after the duplicates\.
6.  If no duplicates are found, simply move `prev` to `current`\.
7.  Continue this process until the end of the list\.
8.  Finally, return `dummy.next` because `dummy` was pointing to the beginning of the list structure we have built\.

#### **Code:**

```java
class Solution {
   public ListNode deleteDuplicates(ListNode head) {
       // Dummy node to handle edge cases easily
       ListNode dummy = new ListNode(0);
       dummy.next = head;
       
       // Prev points to the last unique node
       ListNode prev = dummy;
       
       // Current is used to traverse the list
       ListNode current = head;
       
       while (current != null) {
           // We enter this loop if we are looking at a duplicate
           while (current.next != null && current.val == current.next.val) {
               current = current.next;
           }
           
           // If prev.next is current, no duplicates found; move prev to the next
           if (prev.next == current) {
               prev = prev.next;
           } else {
               // If duplicates were found, skip them
               prev.next = current.next;
           }
           
           // Move current forward
           current = current.next;
       }
       
       // Return the head of the deduped list
       return dummy.next;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of nodes in the list\. We traverse the list once\.
*   **Space Complexity:** O\(1\), because we only use a fixed amount of extra space \(pointers\)\.

#### [Solve it on LeetCode](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii)
