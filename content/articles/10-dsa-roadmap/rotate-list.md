---
title: Rotate List
description: Master Rotate List in the Linked List module. Comprehensive guide
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

Given the `head` of a linked list, rotate the list to the right by `k` places\.

##### **Example 1:**

**Input:** head = \[1,2,3,4,5\], k = 2

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

**Output:** \[4,5,1,2,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">3</span></div>
  </div>
</div>

null

##### **Example 2:**

**Input:** head = \[0,1,2\], k = 4

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
  </div>
</div>

null

**Output:** \[2,0,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
  </div>
</div>

null

##### **Constraints:**

*   The number of nodes in the list is in the range `[0, 500]`\.
*   **\-100 <= Node\.val <= 100**
*   **0 <= k <= 2 \* 10****9**


## Approaches

### 1\. Convert to Array

#### Intuition:

The basic idea in this approach is to first convert the linked list to an array\. Once we have the array representation, rotating the list becomes straightforward\. After performing the rotation on the array, we convert it back to a linked list\.

#### Steps:

1.  Convert the linked list to an array\.
2.  Rotate the array k times to the right\.
3.  Convert the array back to a linked list\.

#### Code:

```java
class Solution {
   public ListNode rotateRight(ListNode head, int k) {
       if (head == null || head.next == null || k == 0) return head;
       
       // Convert linked list to ArrayList
       List<ListNode> nodeList = new ArrayList<>();
       ListNode current = head;
       while (current != null) {
           nodeList.add(current);
           current = current.next;
       }
       
       // Determine the rotation
       int n = nodeList.size();
       k = k % n;
       if (k == 0) return head; // Rotation results in same list

       // Rearrange nodes in ArrayList
       Collections.rotate(nodeList, k);
       
       // Reconnect nodes to form a linked list
       for (int i = 0; i < n - 1; i++) {
           nodeList.get(i).next = nodeList.get(i + 1);
       }
       nodeList.get(n - 1).next = null;
       
       return nodeList.get(0);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes in the list\. Conversion to and from the array takes linear time\.
*   **Space Complexity:** O\(N\), for storing the nodes in an ArrayList\.

### 2\. Iterative In\-Place Rotation

#### Intuition:

Without converting to an array, we can perform the rotations directly on the linked list\. This involves finding the new head and tail of the list after rotation\.

#### Steps:

1.  Count the length of the list\.
2.  Adjust k to handle cases where k is greater than the length\.
3.  Make the list circular by connecting the tail to the head\.
4.  Find the new tail and break the circle to form the new list\.

#### Code:

```java
class Solution {
   public ListNode rotateRight(ListNode head, int k) {
       if (head == null || head.next == null) return head;

       // Calculate the length of the list
       int length = 1;
       ListNode tail = head;
       while (tail.next != null) {
           tail = tail.next;
           length++;
       }
       
       // Make the list circular
       tail.next = head;

       // Find the new head and tail
       k = k % length;
       int stepsToNewHead = length - k;
       ListNode newTail = tail;
       while (stepsToNewHead-- > 0) {
           newTail = newTail.next;
       }
       ListNode newHead = newTail.next;
       newTail.next = null;
       
       return newHead;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes in the list\.
*   **Space Complexity:** O\(1\), no extra space except for pointers\.

#### [Solve it on LeetCode](https://leetcode.com/problems/rotate-list)
