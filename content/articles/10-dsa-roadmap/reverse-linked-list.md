---
title: Reverse Linked List
description: Master Reverse Linked List in the Linked List module. Comprehensive
  guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given the `head` of a singly linked list, reverse the list, and return _the reversed list_\. 

##### **Example 1:**

Input:head=\[1,2,3,4,5\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
  </div>
</div>

null

Output:\[5,4,3,2,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
  </div>
</div>

null

##### **Example 2:**

Input:head=\[1,2\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
  </div>
</div>

null

Output:\[2,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
  </div>
</div>

null

##### **Example 3:**

Input:head=\[\]

null

Output:\[\]

null

##### **Constraints:**

*   The number of nodes in the list is the range `[0, 5000]`\.
*   `-5000 <= Node.val <= 5000`

**Follow up:** A linked list can be reversed either iteratively or recursively\. Could you implement both?


## Approaches

### 1\. Iterative Solution

#### Intuition:

The iterative approach involves using a loop to reverse the pointers of the linked list's nodes one by one\. By starting from the head, we can keep track of the previous node and progressively change the current node's next pointer to point to this previous node\. We move through the list, effectively flipping all the pointers, until the entire list is reversed\.

#### Algorithm:

1.  Initialize three pointers: `prev` \(set to `null`\), `curr` \(set to `head`\), and `next` \(to store the `curr.next` node temporarily\)\.
2.  Iterate through the list:

*   Store `curr.next` in `next` to save the rest of the list\.
*   Reverse the pointer of the `curr` node to point to `prev`\.
*   Move `prev` and `curr` one step forward\.

4.  Continue until `curr` becomes `null`\.
5.  The new head of the list is the `prev` node\.

#### Code:

```java
class Solution {
   public ListNode reverseList(ListNode head) {
       ListNode prev = null; // Previous node, initially null
       ListNode curr = head; // Current node starts from the head
       while (curr != null) {
           ListNode next = curr.next; // Store next node
           curr.next = prev; // Reverse the current node's pointer
           prev = curr; // Move prev to current
           curr = next; // Move curr to next
       }
       return prev; // New head of the reversed list
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) – We are iterating through the list once, where `n` is the number of elements in the list\.
*   **Space Complexity:** O\(1\) – We use only a constant amount of extra space\.

### 2\. Recursive Solution

#### Intuition:

The recursive approach involves diving deeper into the list until we reach the end and starting the reversal from there\. As each recursive call returns, we reverse the pointers at that level\. This way, the pointers are adjusted in a postfix manner\.

#### Algorithm:

1.  Base Case: If `head` is `null` or `head.next` is `null`, return `head`\. This means we found the new head of the reversed list\.
2.  Recursive Case: Reverse the rest of the list and get the new head\.
3.  Once the rest of the list is reversed, connect `head.next.next` to `head` and set `head.next` to `null`\.
4.  Return the new head obtained from the recursive call\.

#### Code:

```java
class Solution {
   public ListNode reverseList(ListNode head) {
       if (head == null || head.next == null) {
           return head; // Base case: if list is empty or has one node
       }
       ListNode newHead = reverseList(head.next); // Recurse for the rest of the list
       head.next.next = head; // Reverse the current node's pointer
       head.next = null; // Set the current node's next to null
       return newHead; // Return new head result from recursion
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) – Each node's operation is constant, and we perform it for every node\.
*   **Space Complexity:** O\(n\) – The recursion stack will have `n` frames, one for each node in the list\.

#### [Solve it on LeetCode](https://leetcode.com/problems/reverse-linked-list)
