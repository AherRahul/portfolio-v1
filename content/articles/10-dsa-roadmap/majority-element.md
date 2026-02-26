---
title: Majority Element
description: Master Majority Element in the Arrays module. Comprehensive guide
  and algorithmic problem solving.
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

Given an array `nums` of size `n`, return _the majority element_\.

The majority element is the element that appears more than `⌊n / 2⌋` times\. You may assume that the majority element always exists in the array\.

##### **Example 1:**

Input:nums=\[3,2,3\]

0

3

1

2

2

3

Output:3

3

##### **Example 2:**

Input:nums=\[2,2,1,1,1,2,2\]

0

2

1

2

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

Output:2

2

##### **Constraints:**

*   **n == nums\.length**
*   **1 <= n <= 5 \* 10****4**
*   **\-10****9** **<= nums\[i\] <= 10****9**

**Follow\-up:** Could you solve the problem in linear time and in `O(1)` space?

#### [Solve it on LeetCode](https://leetcode.com/problems/majority-element/)

# Understanding the Problem

Before diving into solutions, let us make sure we understand what a "majority element" really means\.

An element is the majority if it appears **more than** `n/2` times\. This is a strict inequality\. For an array of size 5, a majority element must appear at least 3 times\. For an array of size 6, it must appear at least 4 times\.

This definition has a powerful implication: **there can be at most one majority element\.** Think about it\. If one element appears more than half the time, there simply are not enough positions left in the array for any other element to also appear more than half the time\.

The problem guarantees that a majority element always exists\. In a real interview, you might want to clarify this assumption\. Without it, you would need to verify that your candidate actually appears more than `n/2` times before returning it\.

Another key observation: since the majority element appears more than half the time, if you pair up each occurrence of the majority element with a non\-majority element, you would still have majority elements left over\. This insight becomes crucial when we discuss the Boyer\-Moore algorithm\.

# Approaches

## 1\. Brute Force

#### Intuition:

The brute\-force method checks each element in the array and counts how many times it appears\. If any element occurs more than `n/2` times \(where `n` is the length of the array\), that element is the majority element\.

This approach is simple to understand but inefficient because it performs a full scan for every element\.

#### Code:

Java

```java
class Solution {
   public int majorityElement(int[] nums) {
       int n = nums.length;
       for (int i = 0; i < n; i++) {
           int count = 0;
           // Count occurrences of nums[i]
           for (int j = 0; j < n; j++) {
               if (nums[j] == nums[i]) {
                   count++;
               }
           }
           // If count exceed n/2, nums[i] is the majority element
           if (count > n / 2) {
               return nums[i];
           }
       }
       return -1; // Should never be reached if majority element assumption holds
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^2\) because for each element, we are iterating through the list to count occurrences\.
*   **Space Complexity:** O\(1\) because no extra space is used aside from variables\.

## 2\. HashMap

#### Intuition:

We can optimize the brute force approach by using a HashMap to store the frequency of each element\.

Traverse the array, and increment the counter for each element encountered\. The element with a frequency greater than `n/2` will be the majority element\.

#### Code:

Java

```java
class Solution {
   public int majorityElement(int[] nums) {
       HashMap<Integer, Integer> countMap = new HashMap<>();
       int n = nums.length;
       for (int num : nums) {
           countMap.put(num, countMap.getOrDefault(num, 0) + 1);
           // If an element's count exceeds n/2, return it
           if (countMap.get(num) > n / 2) {
               return num;
           }
       }
       return -1; // Shouldn't reach here if input is valid
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\) because we iterate over the array once\.
*   **Space Complexity:** O\(n\) because we might store all elements in the map in the worst case\.

## 3\. Sorting

#### Intuition:

If we sort the array, all identical elements naturally group together\. Since the majority element appears more than `n/2` times, it must occupy the entire middle region of the sorted array\.

That means the element at index `n/2` will always be the majority element\.

#### Code:

Java

```java
class Solution {
   public int majorityElement(int[] nums) {
       Arrays.sort(nums);
       return nums[nums.length / 2];
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n log n\) due to sorting\.
*   **Space Complexity:** O\(1\) when using in\-place sorting \(ignoring input space\)\.

#### Example Walkthrough:

**Input:**

0

2

1

2

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

**After sorting:**

0

1

1

1

2

1

3

2

middle

4

2

5

2

6

2

## 4\. Boyer\-Moore Voting Algorithm

#### Intuition:

The Boyer\-Moore Voting Algorithm efficiently finds the majority element in linear time\.

It maintains:

*   **candidate**: current guess for the majority
*   **count**: confidence in the candidate

As you scan:

*   If `count == 0`, adopt the current number as the new `candidate`\.
*   If the current number equals `candidate`, increment `count`; otherwise, decrement it\.

If a true majority exists, this process guarantees the final `candidate` is that majority\.

#### Why does it work?

Think **cancellation**\. Pair up elements as we scan:

*   Each time we see a value **different** from the current `candidate`, we “cancel” one occurrence of the candidate with that different value by doing `count--`\.
*   Each time we see the **same** value as the candidate, we increase `count`, effectively “uncanceling” or reinforcing the candidate\.

If there truly is a majority element `M` \(appears more than ⌊n/2⌋ times\), then:

*   Across the entire array, every non\-`M` element can be paired with at most one `M` for cancellation\.
*   Since `M` occurs **strictly more** than all others combined, you cannot cancel all of the `M`s\. There will be a **surplus** of `M`s left unpaired\.
*   That surplus ensures the **final** surviving candidate is `M`\.

#### Code:

Java

```java
class Solution {
   public int majorityElement(int[] nums) {
       int candidate = nums[0];
       int count = 0;

       for (int num : nums) {
           if (count == 0) {
               candidate = num;
           }
           count += (num == candidate) ? 1 : -1;
       }
       return candidate;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\) since it passes through the array once\.
*   **Space Complexity:** O\(1\) since only a few additional variables are used\.

#### Example Walkthrough:

0

2

1

2

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

candidate = 2, count = 0

Step 1 / 8

View Animation