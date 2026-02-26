---
title: Remove Duplicates from Sorted Array
description: Master Remove Duplicates from Sorted Array in the Arrays module.
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

Given an integer array `nums` sorted in **non\-decreasing order**, remove the duplicates [**in\-place**](https://en.wikipedia.org/wiki/In-place_algorithm) such that each unique element appears only **once**\. The **relative order** of the elements should be kept the **same**\. Then return _the number of unique elements in_ `nums`\.

Consider the number of unique elements of `nums` to be `k`, to get accepted, you need to do the following things:

*   Change the array `nums` such that the first `k` elements of `nums` contain the unique elements in the order they were present in `nums` initially\. The remaining elements of `nums` are not important as well as the size of `nums`\.
*   Return `k`\.

**Custom Judge:**

```java
The judge will test your solution with the following code:
int[] nums = [...]; // Input array
int[] expectedNums = [...]; // The expected answer with correct length
int k = removeDuplicates(nums); // Calls your implementation
assert k == expectedNums.length;
for (int i = 0; i < k; i++) {
    assert nums[i] == expectedNums[i];
}
If all assertions pass, then your solution will be accepted.
```

##### **Example 1:**

Input:nums=\[1,1,2\]

0

1

1

1

2

2

Output:\[1,2,\]

0

1

1

2

2

\-

**Explanation:** Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively\.It does not matter what you leave beyond the returned k \(hence they are underscores\)\.

##### **Example 2:**

Input:nums=\[0,0,1,1,1,2,2,3,3\]

0

0

1

0

2

1

3

1

4

1

5

2

6

2

7

3

8

3

Output:\[0,1,2,3,,,,,\]

0

0

1

1

2

2

3

3

4

\-

5

\-

6

\-

7

\-

8

\-

**Explanation:** Your function should return k = 4, with the first four elements of nums being 0, 1, 2, and 3 respectively\. It does not matter what you leave beyond the returned k\.

##### **Constraints:**

*   **1 <= nums\.length <= 3 \* 10****4**
*   **\-100 <= nums\[i\] <= 100**
*   `nums` is sorted in **non\-decreasing** order\.

#### [Solve it on LeetCode](https://leetcode.com/problems/remove-duplicates-from-sorted-array)

# Understanding the Problem

At first glance, removing duplicates seems trivial\. Just iterate through the array and keep track of unique elements, right? The catch is the **in\-place** requirement\. We cannot create a new array to store the results\. We must modify the original array and tell the caller how many unique elements exist\.

The problem gives us a crucial clue that many overlook: the array is **sorted**\. This means all duplicates are grouped together\. In `[1, 1, 2, 2, 2, 3]`, all the 1s are adjacent, all the 2s are adjacent, and so on\. We never have to worry about finding a duplicate "later" in the array that we missed earlier\.

This sorted property completely changes how we approach the problem\. Instead of using a hash set to track seen elements \(which would require extra space\), we can simply compare adjacent elements\. If two adjacent elements are the same, one of them is a duplicate\.

The expected return value is `k`, the count of unique elements\. But we also need to physically place those unique elements in the first `k` positions of the array\. The elements beyond position `k-1` can be anything since the caller will ignore them\.

# Approaches

## 1\. Two Pointers Approach

#### Intuition:

In a sorted array, duplicates always appear next to each other\.

This makes it easy to remove duplicates using a **two\-pointer technique**:

*   **writePos** – points to the position where the next unique element should be placed
*   **readPos** – scans the array to find the next unique element

Whenever we discover a new unique value, we move it to `nums[writePos]` and advance `writePos`\.

All unique elements end up at the front of the array\. Anything beyond `writePos` is irrelevant\.

#### Steps:

1.  If the array is empty, return `0` since no elements exist\.
2.  Initialize `writePos = 0`, marking where the next unique element should be placed\.
3.  Use `readPos` to scan from the second element onward\.
4.  If `nums[readPos]` is different from `nums[writePos]`, we found a new unique element\.

*   Increment `writePos`\.
*   Copy `nums[readPos]` to `nums[writePos]`\.

5.  Return `writePos + 1`, the count of unique elements\.

#### Code:

Java

```java
class Solution {
   public int removeDuplicates(int[] nums) {
       // If the array is empty, return 0.
       if (nums.length == 0) return 0;

       // writePos marks where the next unique element should be placed.
       int writePos = 0;

       // readPos scans through the array to find unique elements.
       for (int readPos = 1; readPos < nums.length; readPos++) {
           // When a new unique element is found
           if (nums[readPos] != nums[writePos]) {
               writePos++;               // Move writePos forward
               nums[writePos] = nums[readPos]; // Place the unique element
           }
       }

       // Number of unique elements is writePos + 1
       return writePos + 1;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of elements in the array\. We traverse the array with a single pass using the two pointers\.
*   **Space Complexity:** O\(1\), as we are using extra space only for the pointers and directly modifying the input array\.

View Animation