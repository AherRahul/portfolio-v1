---
title: Sort Colors
description: Master Sort Colors in the Sorting module. Comprehensive guide and
  algorithmic problem solving.
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

Given an array `nums` with `n` objects colored red, white, or blue, sort them [**in\-place**](https://en.wikipedia.org/wiki/In-place_algorithm) so that objects of the same color are adjacent, with the colors in the order red, white, and blue\.

We will use the integers `0`, `1`, and `2` to represent the color red, white, and blue, respectively\.

You must solve this problem without using the library's sort function\.

##### **Example 1:**

Input:nums=\[2,0,2,1,1,0\]

0

2

1

0

2

2

3

1

4

1

5

0

Output:\[0,0,1,1,2,2\]

0

0

1

0

2

1

3

1

4

2

5

2

##### **Example 2:**

Input:nums=\[2,0,1\]

0

2

1

0

2

1

Output:\[0,1,2\]

0

0

1

1

2

2

##### **Constraints:**

*   `n == nums.length`
*   `1 <= n <= 300`
*   `nums[i]` is either `0`, `1`, or `2`\.

**Follow up:** Could you come up with a one\-pass algorithm using only constant extra space?

#### [Solve it on LeetCode](https://leetcode.com/problems/sort-colors)

# Approaches

## 1\. Counting Sort

#### Intuition:

The problem can be solved by first counting the number of occurrences of each color \(0s, 1s, and 2s\)\. This information can be used to overwrite the original array by placing the colors consecutively as per the number of occurrences\. Although this is not done in one\-pass, it is straightforward and efficient\.

#### Steps:

1.  Count the number of `0s`, `1s`, and `2s` in the array\.
2.  Overwrite the array with the correct number of `0s`, followed by `1s`, and then `2s`\.

#### Code:

Java

```java
class Solution {
   public void sortColors(int[] nums) {
       int count0 = 0, count1 = 0, count2 = 0;
       // Count the number of 0s, 1s, and 2s
       for (int num : nums) {
           if (num == 0) count0++;
           else if (num == 1) count1++;
           else count2++;
       }

       // Overwrite the nums array with appropriate number of 0s, 1s, and 2s
       int index = 0;
       while (count0-- > 0) nums[index++] = 0;
       while (count1-- > 0) nums[index++] = 1;
       while (count2-- > 0) nums[index++] = 2;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of elements in the array\. We iterate over the array twice \(once to count and once to overwrite\), so it's linear\.
*   **Space Complexity:** O\(1\), since we are only using a fixed amount of extra space \(three counters and an index\)\.

## 2\. One\-pass Dutch National Flag Problem \(Three Pointers\)

#### Intuition:

This approach utilizes the famous Dutch National Flag algorithm which sorts the array using one pass and constant space by maintaining three pointers: `low`, `mid`, and `high`\.

*   `low` maintains the boundary of zeros\.
*   `mid` iterates over the array\.
*   `high` maintains the boundary of twos\.

#### Steps:

1.  Initialize three pointers: `low` at the start, `mid` at the start, and `high` at the end of the array\.
2.  While `mid` is less than or equal to `high`:

*   If the element at `mid` is `0`, swap it with the element at `low`\. Increment both `low` and `mid`\.
*   If the element at `mid` is `1`, just increment `mid`\.
*   If the element at `mid` is `2`, swap it with the element at `high`\. Decrement `high` \(do not increment `mid` because the swapped element from `high` may need further processing\)\.

#### Code:

Java

```java
class Solution {
   public void sortColors(int[] nums) {
       int low = 0, mid = 0, high = nums.length - 1;
       // Process all elements in the array
       while (mid <= high) {
           if (nums[mid] == 0) {
               // Swap nums[low] and nums[mid], increment low and mid
               int temp = nums[low];
               nums[low] = nums[mid];
               nums[mid] = temp;
               low++;
               mid++;
           } else if (nums[mid] == 1) {
               // Just increment mid, no need to swap
               mid++;
           } else {
               // Swap nums[mid] and nums[high], decrement high
               int temp = nums[mid];
               nums[mid] = nums[high];
               nums[high] = temp;
               high--;
           }
       }
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of elements in the array\. We perform a single linear scan of the array\.
*   **Space Complexity:** O\(1\), as we are using only constant extra space for the pointers\.

View Animation