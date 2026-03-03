---
title: Flatten a Multilevel Doubly Linked List
description: Master Flatten a Multilevel Doubly Linked List in the Linked List
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

You are given a doubly linked list, which contains nodes that have a next pointer, a previous pointer, and an additional **child pointer**\. This child pointer may or may not point to a separate doubly linked list, also containing these special nodes\. These child lists may have one or more children of their own, and so on, to produce a **multilevel data structure** as shown in the example below\.

Given the `head` of the first level of the list, **flatten** the list so that all the nodes appear in a single\-level, doubly linked list\. Let `curr` be a node with a child list\. The nodes in the child list should appear **after** `curr` and **before** `curr.next` in the flattened list\.

Return _the_ `head` _of the flattened list\. The nodes in the list must have_ _**all**_ _of their child pointers set to_ `null`\. 

##### **Example 1:**

**Input:** head = \[1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">6</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">7</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">8</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">9</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">10</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">11</span><span class="arr-val">9</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">12</span><span class="arr-val">10</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">13</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">14</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">15</span><span class="arr-val">11</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">16</span><span class="arr-val">12</span></div>
  </div>
</div>

**Output:** \[1,2,3,7,8,11,12,9,10,4,5,6\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">11</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">6</span><span class="arr-val">12</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">7</span><span class="arr-val">9</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">8</span><span class="arr-val">10</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">9</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">10</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">11</span><span class="arr-val">6</span></div>
  </div>
</div>

**Explanation:** The multilevel linked list in the input is shown\.

```shell
---2---3---4---5---6--NULL
         |
         7---8---9---10--NULL
             |
             11--12--NULL
```

##### **Example 2:**

**Input:** head = \[1,2,null,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">2</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">3</span></div>
  </div>
</div>

**Output:** \[1,3,2\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
  </div>
</div>

**Explanation:** The multilevel linked list in the input is shown\.

```shell
[1,    2,    3, 4, 5, 6, null]
             |
[null, null, 7,    8, 9, 10, null]
                   |
[            null, 11, 12, null]
```

**Example 3:**

**Input:** head = \[\]

**Output:** \[\]

**Explanation:** There could be empty list in the input\.

##### **Constraints:**

*   The number of Nodes will not exceed `1000`\.
*   **1 <= Node\.val <= 10****5**


## Approaches

### 1\. Recursive Depth\-First Search \(DFS\)

#### Intuition:

The multilevel doubly linked list can be visualized as a tree structure where some nodes have children\. The task is equivalent to performing a depth\-first traversal and flattening the tree into a single\-level doubly linked list\.

The recursive approach involves:

*   Traversing each node,
*   Recursively flattening any child node, and
*   Splicing the flattened child list into the main list\.

#### Steps:

1.  Start from the head of the list\.
2.  Traverse the list\. For each node, check if it has a child\.
3.  If a child exists, recursively flatten the child list\.
4.  Splice the child list between the current node and the rest of the main list\.
5.  Move the pointer to the next node and repeat the process\.

#### Code:

```java
class Solution {
   public Node flatten(Node head) {
       flattenHelper(head);
       return head;
   }

   // Recursive helper that returns the last node of the flattened list
   private Node flattenHelper(Node node) {
       Node curr = node;
       Node last = node;

       while (curr != null) {
           Node next = curr.next;
           if (curr.child != null) {
               Node childLast = flattenHelper(curr.child);

               // Splice child list into main list
               curr.next = curr.child;
               curr.child.prev = curr;

               if (next != null) {
                   childLast.next = next;
                   next.prev = childLast;
               }
               
               curr.child = null;
               last = childLast;
           } else {
               last = curr;
           }
           curr = next;
       }
       
       return last;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the total number of nodes because each node is visited once\.
*   **Space Complexity:** O\(N\) in the worst case due to the recursive function call stack\.

### 2\. Iterative Using Stack

#### Intuition:

An iterative approach can be implemented using a stack to simulate the recursive flow\. By using a stack, we can handle the nested and continuation structure of the list explicitly:

*   Traverse through the list
*   When encountering a node with a child, push the next node to a stack for later processing\.
*   Splice the child node into the main list\.

#### Steps:

1.  Use a stack to keep track of the remaining nodes after encountering a child\.
2.  Iterate over the list\.
3.  If a node has a child, push its next to the stack, splice the child into the list, and continue\.
4.  After processing the child, continue with the node from the stack if available\.

#### Code:

```java
class Solution {
   public Node flatten(Node head) {
       if (head == null) return head;

       Stack<Node> stack = new Stack<>();
       Node curr = head;

       while (curr != null) {
           if (curr.child != null) {
               if (curr.next != null) {
                   stack.push(curr.next);
               }

               // Connect the child list to the current node
               curr.next = curr.child;
               curr.child.prev = curr;
               curr.child = null; // Don't forget to clear the child pointer
           }

           if (curr.next == null && !stack.isEmpty()) {
               // Pop from stack and attach it to the end of the current list
               curr.next = stack.pop();
               curr.next.prev = curr;
           }

           curr = curr.next;
       }

       return head;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the total number of nodes processed\.
*   **Space Complexity:** O\(N\) due to the maximum size of the stack in the worst scenario\. Each node is pushed onto the stack once when its child is processed\.

#### [Solve it on LeetCode](https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list)
