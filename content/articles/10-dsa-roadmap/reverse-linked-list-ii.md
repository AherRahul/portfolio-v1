---
title: Reverse Linked List II
description: Master Reverse Linked List II in the Linked List module.
  Comprehensive guide and algorithmic problem solving.
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

Given the `head` of a singly linked list and two integers `left` and `right` where `left <= right`, reverse the nodes of the list from position `left` to position `right`, and return _the reversed list_\. 

##### **Example 1:**

**Input:** head = \[1,2,3,4,5\], left = 2, right = 4

1

2

3

4

5

null

**Output:** \[1,4,3,2,5\]

1

4

3

2

5

null

##### **Example 2:**

**Input:** head = \[5\], left = 1, right = 1

**Output:** \[5\] 

##### **Constraints:**

*   The number of nodes in the list is `n`\.
*   `1 <= n <= 500`
*   `-500 <= Node.val <= 500`
*   `1 <= left <= right <= n`

**Follow up:** Could you do it in one pass?

#### [Solve it on LeetCode](https://leetcode.com/problems/reverse-linked-list-ii)

# Approaches

## 1\. Iterative Reversal with Extra Space

#### Intuition:

This approach leverages an extra data structure to reverse the segment of the linked list\. We first traverse the list to the position where the reversal starts, collect nodes in an array for the part to be reversed, reverse the array, and finally rebuild the linked list using this array\.

#### Steps:

1.  Traverse the list to find the part of the list that needs to be reversed\.
2.  Store nodes to be reversed into an array\.
3.  Reverse the array contents\.
4.  Reconnect the nodes before, within, and after the reversed segment accordingly\.

#### Code:

Java

```java
class Solution {
   public ListNode reverseBetween(ListNode head, int m, int n) {
       if (head == null || m == n) return head;
       
       // Step 1: Initialize variables
       ListNode dummy = new ListNode(0); // Create a dummy node to simplify edge cases
       dummy.next = head;
       ListNode pre = dummy;
       
       // Step 2: Traverse list to node before 'm'
       for (int i = 1; i < m; i++) {
           pre = pre.next;
       }
       
       // Step 3: Use a stack to keep track of nodes to be reversed
       ListNode current = pre.next;
       Stack<ListNode> stack = new Stack<>();
       
       for (int i = m; i <= n; i++) {
           stack.push(current);
           current = current.next;
       }
       
       // Step 4: Reconnect
       while (!stack.isEmpty()) {
           pre.next = stack.pop(); // Reverse the nodes
           pre = pre.next;
       }
       pre.next = current;
       
       return dummy.next;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of nodes in the list since we traverse the list a constant number of times\.
*   **Space Complexity:** O\(n\), due to the stack used for storing nodes to be reversed\.

## 2\. Iterative In\-Place Reversal

#### Intuition:

Instead of using extra space, this approach manages all operations directly within the list structure\. The key is to carefully manage pointers to reverse the sublist in place by detaching and reattaching nodes\.

#### Steps:

1.  Traverse the linked list to the starting position of reversal\.
2.  Reverse the sublist by changing pointers in place\.
3.  Reconnect the reversed section to the remainder of the list\.

#### Code:

Java

```java
class Solution {
   public ListNode reverseBetween(ListNode head, int m, int n) {
       if (head == null || m == n) return head;
       
       ListNode dummy = new ListNode(0); // Create a dummy node for simplicity
       dummy.next = head;
       ListNode pre = dummy;
       
       // Move `pre` to just before the part to be reversed
       for (int i = 1; i < m; i++) {
           pre = pre.next;
       }
       
       ListNode start = pre.next; // `start` will be the first node to be reversed
       ListNode then = start.next; // `then` is the node that will be reversed
       
       // Iteratively reverse the sublist
       for (int i = 0; i < n - m; i++) {
           // Adjust the pointers
           start.next = then.next;
           then.next = pre.next;
           pre.next = then;
           then = start.next;
       }
       
       return dummy.next;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of nodes in the list, as we make a linear pass through the list\.
*   **Space Complexity:** O\(1\), no additional space is used; reversal is done in place\.