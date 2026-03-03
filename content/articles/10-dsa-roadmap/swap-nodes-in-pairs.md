---
title: Swap Nodes in Pairs
description: Master Swap Nodes in Pairs in the Linked List module. Comprehensive
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

Given a linked list, swap every two adjacent nodes and return its head\. You must solve the problem without modifying the values in the list's nodes \(i\.e\., only nodes themselves may be changed\.\) 

##### **Example 1:**

Input:head=\[1,2,3,4\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
  </div>
</div>

null

Output:\[2,1,4,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">3</span></div>
  </div>
</div>

null

##### **Example 2:**

Input:head=\[\]

null

Output:\[\]

null

##### **Example 3:**

Input:head=\[1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
  </div>
</div>

null

Output:\[1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
  </div>
</div>

null

##### **Example 3:**

Input:head=\[1,2,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
  </div>
</div>

Output:\[2,1,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
  </div>
</div>

null

##### **Constraints:**

*   The number of nodes in the list is in the range `[0, 100]`\.
*   `0 <= Node.val <= 100`


## Approaches

### 1\. Recursive Approach

The recursive approach involves swapping nodes in pairs and continues until the end of the linked list is reached\. Here's the idea:

1.  **Base Case**: If the list is empty or has only one node, no swap is needed\. Return the head\.
2.  **Recursive Step**:

*   Swap the first two nodes\.
*   Continue swapping for the rest of the list using recursion\.

#### Code:

```java
class Solution {
   public ListNode swapPairsRecursive(ListNode head) {
       // Base case: If list is empty or has only one node, no swap is needed
       if (head == null || head.next == null) {
           return head;
       }

       // Nodes to be swapped
       ListNode firstNode = head;
       ListNode secondNode = head.next;

       // Swapping process - secondNode becomes the new head
       firstNode.next = swapPairsRecursive(secondNode.next);
       secondNode.next = firstNode;

       // Return the new head of the swapped pair
       return secondNode;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), since each pair of nodes is processed once and in constant time\.
*   **Space Complexity:** O\(n\) due to recursion stack space used for each node\.

## Iterative Approach

The iterative approach involves using a dummy node to facilitate the swapping process as we walk through the list:

1.  **Setup a Dummy Node**: This helps manage edge cases and makes node swapping easier\.
2.  **Traversal and Swapping**:

*   Swap nodes by adjusting pointers\.
*   Use a loop to continue swapping until the end of the list is reached\.

#### Code:

```java
class Solution {
   public ListNode swapPairsIterative(ListNode head) {
       // Initial dummy node to simplify edge cases
       ListNode dummy = new ListNode(0);
       dummy.next = head;
       ListNode current = dummy;

       // Traverse and swap pairs while there are at least two nodes remaining
       while (current.next != null && current.next.next != null) {
           // Nodes to be swapped
           ListNode firstNode = current.next;
           ListNode secondNode = current.next.next;

           // Adjusting pointers for swap
           firstNode.next = secondNode.next;
           current.next = secondNode;
           secondNode.next = firstNode;

           // Move the pointer by two nodes for next pair
           current = firstNode;
       }

       // Return new head at dummy's next
       return dummy.next;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\) since we traverse each node of the list exactly once\.
*   **Space Complexity:** O\(1\) as no additional space is used other than a few pointers\.

#### [Solve it on LeetCode](https://leetcode.com/problems/swap-nodes-in-pairs)
