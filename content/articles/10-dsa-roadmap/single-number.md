---
title: Single Number
description: Master Single Number in the Bit Manipulation module. Comprehensive
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

Given a **non\-empty** array of integers `nums`, every element appears _twice_ except for one\. Find that single one\.

You must implement a solution with a linear runtime complexity and use only constant extra space\. 

##### **Example 1:**

Input:nums=\[2,2,1\]

0

2

1

2

2

1

Output:1

1

##### **Example 2:**

Input:nums=\[4,1,2,1,2\]

0

4

1

1

2

2

3

1

4

2

Output:4

4

##### **Example 3:**

Input:nums=\[1\]

0

1

Output:1

1

##### **Constraints:**

*   **1 <= nums\.length <= 3 \* 10****4**
*   **\-3 \* 10****4** **<= nums\[i\] <= 3 \* 10****4**
*   Each element in the array appears twice except for one element which appears only once\.

#### [Solve it on LeetCode](https://leetcode.com/problems/single-number/)

# Approaches

## 1\. Brute Force

#### **Intuition:**

In a brute force approach, for each element in the array, we can check if it appears again in the array\. We can do this by comparing each element against all others\. The element that doesn't have a duplicate is the single number\.

#### Code:

Java

```java
class Solution {
   public int singleNumber(int[] nums) {
       // Iterate through each element in the array
       for (int i = 0; i < nums.length; i++) {
           boolean isSingle = true;
           // Compare the current element against all other elements
           for (int j = 0; j < nums.length; j++) {
               if (i != j && nums[i] == nums[j]) {
                   isSingle = false; // If a duplicate is found, set the flag to false
                   break;
               }
           }
           // If no duplicate is found, this is the single number
           if (isSingle) {
               return nums[i];
           }
       }
       return -1; // Edge case: should not reach here as the problem specifies one single element
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^2\), due to nested loops
*   **Space Complexity:** O\(1\)

## 2\. HashMap

#### **Intuition:**

Utilize a HashMap to count the occurrences of each element\. Then, iterate over the HashMap to find the element with a count of one, which is our single number\.

#### Code:

Java

```java
class Solution {
   public int singleNumber(int[] nums) {
       // Initialize a HashMap to count occurrences of each element
       Map<Integer, Integer> countMap = new HashMap<>();
       
       // Populate the HashMap with the number of occurrences of each element
       for (int num : nums) {
           countMap.put(num, countMap.getOrDefault(num, 0) + 1);
       }
       
       // Iterate over the HashMap to find the single number
       for (Map.Entry<Integer, Integer> entry : countMap.entrySet()) {
           if (entry.getValue() == 1) {
               return entry.getKey(); // Found the single number
           }
       }
       
       return -1; // Should never reach here as problem guarantees a single element
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\),
*   **Space Complexity:** O\(n\), due to hash map

## 3\. Bit Manipulation

#### **Intuition:**

The most optimal solution involves using the XOR operation\.

XOR has three important properties:

1.  **x ⊕ x = 0:** A number XOR'ed with itself cancels out\.
2.  **x ⊕ 0 = x:** XOR with zero leaves the number unchanged\.
3.  XOR is commutative and associative: **\(a ⊕ b\) ⊕ c = a ⊕ \(b ⊕ c\)**

**Putting these together:**

When we XOR all elements in the array, every duplicate pair cancels out to **0**, and only the unique element survives\.

Java

```java
class Solution {
   public int singleNumber(int[] nums) {
       int result = 0; // Initialize result which will hold our single number
       
       // XOR all elements; duplicates will cancel out
       for (int num : nums) {
           result ^= num; // XORing each number with the result
       }
       
       return result; // The resulting XOR is the single number
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\)
*   **Space Complexity:** O\(1\)

#### Example Walkthrough:

0

4

1

1

2

2

3

1

4

2

result = 0

Step 1 / 6