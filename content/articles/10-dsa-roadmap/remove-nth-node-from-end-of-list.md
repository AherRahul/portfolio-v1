---
title: Remove Nth Node From End of List
description: Master Remove Nth Node From End of List in the Linked List module.
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

Given the `head` of a linked list, remove the `n``th` node from the end of the list and return its head\. 

##### **Example 1:**

**Input:** head = \[1,2,3,4,5\], n = 2

1

2

3

4

5

null

**Output:** \[1,2,3,5\]

1

2

3

5

null

##### **Example 2:**

**Input:** head = \[1\], n = 1

1

null

**Output:** \[\]

null

##### **Example 3:**

**Input:** head = \[1,2\], n = 1

1

2

null

**Output:** \[1\]

1

null

##### **Constraints:**

*   The number of nodes in the list is `sz`\.
*   `1 <= sz <= 30`
*   `0 <= Node.val <= 100`
*   `1 <= n <= sz`

**Follow up:** Could you do this in one pass?

#### [Solve it on LeetCode](https://leetcode.com/problems/remove-nth-node-from-end-of-list)

# Approaches

## 1\. Two Pass

#### Intuition:

The basic idea behind this approach is to determine the length of the linked list and then remove the \(L\-n\+1\)'th node from the beginning \(where L is the length of the list\)\. In the first pass, we calculate the total length of the linked list\. Then in the second pass, we traverse the list again up to the \(L\-n\+1\)'th node and remove it\.

#### Steps:

1.  Traverse the entire list to compute the total length `L`\.
2.  Find the node just before the \(L\-n\+1\)th node \(this will be at position \(L\-n\)\) and change its next pointer to skip the nth node from the end\.
3.  Return the head of the modified list\.

#### Code:

Java

```java
class Solution {
   public ListNode removeNthFromEnd(ListNode head, int n) {
       // Create dummy node which further helps to handle edge cases such as removing the first node.
       ListNode dummy = new ListNode(0);
       dummy.next = head;
       
       // Calculate the total length of the list
       int length = 0;
       ListNode current = head;
       while (current != null) {
           length++;
           current = current.next;
       }
       
       // Find the node preceding the one to be deleted
       length -= n;
       current = dummy;
       while (length > 0) {
           length--;
           current = current.next;
       }
       
       // Remove nth node from end
       current.next = current.next.next;
       
       return dummy.next;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(L\) since we perform two full traversals of the list, where L is the length of the list\.
*   **Space Complexity:** O\(1\) since only a constant amount of extra space is used\.

## 2\. One Pass using Two Pointers

#### Intuition:

We can improve our solution by using two pointers with a gap of n nodes between them\. By moving both pointers simultaneously until the fast one reaches the end, the slow pointer will be just before the node we want to remove\.

#### Steps:

1.  Initialize two pointers: `fast` and `slow` both pointing to a dummy node ahead of head\.
2.  Move `fast` pointer `n+1` steps forward to maintain a gap of `n` between `slow` and `fast`\.
3.  Move both `fast` and `slow` pointers until `fast` pointer reaches the end\.
4.  The `slow` pointer will be at the node just before the target node\. Adjust its next pointer to skip the nth node from the end\.
5.  Return the head of the modified list\.

#### Code:

Java

```java
class Solution {
   public ListNode removeNthFromEnd(ListNode head, int n) {
       // Initialize a dummy node which helps in handling edge cases like removing the head
       ListNode dummy = new ListNode(0);
       dummy.next = head;
       
       // Initialize two pointers both at the dummy node
       ListNode slow = dummy;
       ListNode fast = dummy;
       
       // Move fast ahead by n+1 steps to create the required gap
       for (int i = 0; i <= n; i++) {
           fast = fast.next;
       }
       
       // Move both pointers till fast reaches the end of the list
       while (fast != null) {
           slow = slow.next;
           fast = fast.next;
       }
       
       // Adjust the pointers to skip the nth node
       slow.next = slow.next.next;
       
       // Return the updated list starting from the node next to dummy
       return dummy.next;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(L\) since We make a single traversal of the list\.
*   **Space Complexity:** O\(1\) since only a constant amount of extra space is used\.

View Animation