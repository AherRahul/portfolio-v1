---
title: Contains Duplicate II
description: Master Contains Duplicate II in the Hash Tables module.
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

Given an integer array `nums` and an integer `k`, return `true` _if there are two_ _**distinct indices**_ `i` _and_ `j` _in the array such that_ `nums[i] == nums[j]` _and_ `abs(i - j) <= k`\. 

##### **Example 1:**

**Input:** nums = \[1,2,3,1\], k = 3

0

1

1

2

2

3

3

1

**Output:** true

##### **Example 2:**

**Input:** nums = \[1,0,1,1\], k = 1

0

1

1

0

2

1

3

1

**Output:** true

##### **Example 3:**

**Input:** nums = \[1,2,3,1,2,3\], k = 2

0

1

1

2

2

3

3

1

4

2

5

3

**Output:** false 

##### **Constraints:**

*   **1 <= nums\.length <= 10****5**
*   **\-10****9** **<= nums\[i\] <= 10****9**
*   **0 <= k <= 10****5**

#### [Solve it on LeetCode](https://leetcode.com/problems/contains-duplicate-ii)

# Approaches

## 1\. Brute Force

#### Intuition:

The simplest approach to solve this problem is to check every pair of elements in the array\. If two elements are the same and are within the given range `k` from each other, we return true\. Otherwise, we continue checking all possible pairs\.

#### Code:

Java

```java
class Solution {
   public boolean containsNearbyDuplicate(int[] nums, int k) {
       // Loop through each element in the array as the first element of the pair
       for (int i = 0; i < nums.length; i++) {
           // Loop through each element after the i-th element
           for (int j = i + 1; j <= i + k && j < nums.length; j++) {
               // If the same element is found within k distance, return true
               if (nums[i] == nums[j]) {
                   return true;
               }
           }
       }
       // If no such pair is found, return false
       return false;
   }
}
```

Complexity Analysis

*   **Time Complexity:** **O\(n \* k\)**: This approach involves checking all possible pairs in the array where `n` is the length of the array\.
*   **Space Complexity:** **O\(1\)**: We are only using a constant amount of extra space\.

## 2\. Sliding Window with HashSet

#### Intuition:

Instead of checking each pair, we can use a sliding window of size `k` and a HashSet to track the elements within that window\. As we slide the window through the array, we can keep checking if the current element already exists in the HashSet\. If it does, it means we found a duplicate within the given range\.

#### Code:

Java

```java
class Solution {
   public boolean containsNearbyDuplicate(int[] nums, int k) {
       HashSet<Integer> set = new HashSet<>();
       
       for (int i = 0; i < nums.length; i++) {
           // If set already contains this number, we found a duplicate within k distance
           if (set.contains(nums[i])) {
               return true;
           }
           // Add current number to the set
           set.add(nums[i]);
           // If the size of the set exceeds k, remove the oldest element
           if (set.size() > k) {
               set.remove(nums[i - k]);
           }
       }
       // If no duplicates found, return false
       return false;
   }
}
```

Complexity Analysis

*   **Time Complexity:** **O\(n\)**: We iterate through the list once, each operation \(add, remove, contains\) of HashSet takes O\(1\) on average\.
*   **Space Complexity:** **O\(min\(n, k\)\)**: The space used by the HashSet scales with the size of `k`, as it only keeps track of `k` elements at a time\.

## 3\. Sliding Window with HashMap

#### Intuition:

A small optimization can be done over the HashSet approach by using a HashMap which stores the indices\. By keeping track of indices, we can avoid unnecessary otherwise possible duplicates removal\. This approach reduces operations to a bare minimum required for ensuring unique elements within the window\.

#### Code:

Java

```java
class Solution {
   public boolean containsNearbyDuplicate(int[] nums, int k) {
       HashMap<Integer, Integer> map = new HashMap<>();
       
       for (int i = 0; i < nums.length; i++) {
           // If map already has the number and the difference between indices is <= k
           if (map.containsKey(nums[i]) && i - map.get(nums[i]) <= k) {
               return true;
           }
           // Update the latest index of the current number
           map.put(nums[i], i);
       }
       // If no such pair found, return false
       return false;
   }
}
```

Complexity Analysis

*   **Time Complexity:** **O\(n\)**: We traverse the array once, each operation with HashMap is O\(1\) on average\.
*   **Space Complexity:** **O\(n\)**: In the worst case, all elements might be unique in the array\. Hence, the HashMap can store up to `n` unique elements and their last seen indices\.