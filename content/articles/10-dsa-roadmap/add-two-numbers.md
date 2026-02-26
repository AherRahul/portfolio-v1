---
title: Add Two Numbers
description: Master Add Two Numbers in the Linked List module. Comprehensive
  guide and algorithmic problem solving.
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

You are given two **non\-empty** linked lists representing two non\-negative integers\. The digits are stored in **reverse order**, and each of their nodes contains a single digit\. Add the two numbers and return the sum as a linked list\.

You may assume the two numbers do not contain any leading zero, except the number 0 itself\. 

##### **Example 1:**

**Input:** l1 = \[2,4,3\], l2 = \[5,6,4\]

**Output:** \[7,0,8\]

**Explanation:** 342 \+ 465 = 807\.

##### **Example 2:**

**Input:** l1 = \[0\], l2 = \[0\]

**Output:** \[0\]

##### **Example 3:**

**Input:** l1 = \[9,9,9,9,9,9,9\], l2 = \[9,9,9,9\]

**Output:** \[8,9,9,9,0,0,0,1\]

##### **Constraints:**

*   The number of nodes in each linked list is in the range `[1, 100]`\.
*   `0 <= Node.val <= 9`
*   It is guaranteed that the list represents a number that does not have leading zeros\.

#### [Solve it on LeetCode](https://leetcode.com/problems/add-two-numbers)

# Approaches

## 1\. Iterative Approach

The naive approach involves iterating through both linked lists simultaneously, adding the digits, and managing the carry\.

#### Intuition:

*   The core idea is to traverse both linked lists while simultaneously keeping track of the carry, resulting from the sum of respective digits\.
*   When one of the linked lists is exhausted, continue the addition with the remaining linked list considering the carry\.
*   If we are left with a carry after completely processing both lists, add a new node to represent that carry\.

#### Algorithm:

1.  Initialize a `dummyHead` with value `0`\. This will help to easily return the head of the new linked list\.
2.  Initialize `current` pointer to point at `dummyHead`\.
3.  Initialize a variable `carry` to `0`\.
4.  Loop over the linked lists as long as there are digits to process from either one or there is a carry to consider\.

*   Compute the sum of the current digits \(considering `null` to represent value `0`\) and the carry\.
*   Update the carry based on the sum \(it'll be either `0` or `1`\)\.
*   Create a new node with the digit value of `sum % 10` and attach it to `current`\.
*   Advance to the next nodes in the linked lists as well as move `current`\.

6.  Return `dummyHead.next`\.

#### Code:

Java

```java
class Solution {
   public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
       ListNode dummyHead = new ListNode(0); // Dummy node to form the result list
       ListNode p = l1, q = l2, current = dummyHead; // Pointers for list traversal
       int carry = 0; // Initialize carry to zero
       
       while (p != null || q != null) {
           // Get the current values from the list nodes or use 0 if node is null
           int x = (p != null) ? p.val : 0;
           int y = (q != null) ? q.val : 0;
           
           int sum = carry + x + y; // Sum current digits and carry
           carry = sum / 10; // Update carry for next iteration
           
           current.next = new ListNode(sum % 10); // Create node for the digit sum
           current = current.next; // Move to the next node in result
           
           // Advance p and q pointers
           if (p != null) p = p.next;
           if (q != null) q = q.next;
       }
       
       // If there's a carry left, create a new node for it
       if (carry > 0) {
           current.next = new ListNode(carry);
       }
       
       return dummyHead.next; // Skip dummy node and return result list
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(max\(m, n\)\), where `m` and `n` are the lengths of the two lists\. We iterate through both lists once\.
*   **Space Complexity:** O\(max\(m, n\)\)\. The result can be at most max\(m, n\) \+ 1 in length to accommodate any carry\.

View Animation