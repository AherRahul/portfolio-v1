---
title: Rotate Array
description: Master Rotate Array in the Arrays module. Comprehensive guide and
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

Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non\-negative\.

##### **Example 1:**

**Input:** nums = \[1,2,3,4,5,6,7\], k = 3

0

1

1

2

2

3

3

4

4

5

5

6

6

7

**Output:** \[5,6,7,1,2,3,4\]

0

5

1

6

2

7

3

1

4

2

5

3

6

4

**Explanation:**

*   rotate 1 steps to the right: \[7,1,2,3,4,5,6\]
*   rotate 2 steps to the right: \[6,7,1,2,3,4,5\]
*   rotate 3 steps to the right: \[5,6,7,1,2,3,4\]

##### **Example 2:**

**Input:** nums = \[\-1,\-100,3,99\], k = 2

0

\-1

1

\-100

2

3

3

99

**Output:** \[3,99,\-1,\-100\]

0

3

1

99

2

\-1

3

\-100

**Explanation:**

*   rotate 1 steps to the right: \[99,\-1,\-100,3\]
*   rotate 2 steps to the right: \[3,99,\-1,\-100\]

##### **Constraints:**

*   **1 <= nums\.length <= 10****5**
*   **\-2****31** **<= nums\[i\] <= 2****31** **\- 1**
*   **0 <= k <= 10****5**

##### **Follow up:**

*   Try to come up with as many solutions as you can\. There are at least **three** different ways to solve this problem\.
*   Could you do it in\-place with `O(1)` extra space?

#### [Solve it on LeetCode](https://leetcode.com/problems/rotate-array)

# Approaches

## 1\. Brute Force

#### Intuition:

The brute force approach involves rotating the array elements one step at a time\. For each rotation, we move all the elements to their next position, simulating the rotation `k` times\.

This matches the literal definition of “rotate right by k,” but it’s inefficient because elements are moved many times\.

#### Steps:

Do this **k** times:

*   Save the last element\.
*   Shift every element one step right\.
*   Put the saved element at the front\.

#### Code:

Java

```java
class Solution {
   public void rotate(int[] nums, int k) {
       int n = nums.length;
       // Each rotation moves all elements 1 step to the right
       k = k % n; // Handle cases where k >= n
       for (int i = 0; i < k; i++) {
           // Store the last element
           int previous = nums[n - 1];
           // Shift all elements right
           for (int j = n - 1; j > 0; j--) {
               nums[j] = nums[j - 1];
           }
           // Place the stored element at the first position
           nums[0] = previous;
       }
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n \* k\) \- Performing `k` rotations, each requiring O\(n\) time\.
*   **Space Complexity:** O\(1\) \- No additional space used apart from input array\.

## 2\. Extra Array

#### Intuition:

By using an additional array, you can directly place each element in its rotated position\. This avoids costly movement within the original array but requires additional space for storing the results\.

#### Steps:

1.  Create a new array to hold rotated elements\.
2.  Calculate and place each element in its final position\.
3.  Copy the result back into the original array\.

#### Code:

Java

```java
class Solution {
   public void rotate(int[] nums, int k) {
       int n = nums.length;
       int[] rotated = new int[n];
       k = k % n; // Handle cases where k >= n
       
       // Place elements in the new positions
       for (int i = 0; i < n; i++) {
           rotated[(i + k) % n] = nums[i];
       }
       
       // Copy the content of rotated array to the original array
       for (int i = 0; i < n; i++) {
           nums[i] = rotated[i];
       }
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\) \- Each element is processed a constant number of times\.
*   **Space Complexity:** O\(n\) \- Additional array to hold rotated order\.

## 3\. Reverse the Array

#### Intuition:

The optimal solution utilizes array reversing\. The underlying idea is that rotating an array is equivalent to reversing parts of the array\.

#### Steps:

1.  Reverse the whole array\.
2.  Reverse the first `k` elements\.
3.  Reverse the remaining `n-k` elements\.

#### Code:

Java

```java
class Solution {
   public void rotate(int[] nums, int k) {
       int n = nums.length;
       k = k % n; // Handle cases where k >= n
       
       // Step 1: Reverse the whole array
       reverse(nums, 0, n - 1);
       // Step 2: Reverse the first k elements
       reverse(nums, 0, k - 1);
       // Step 3: Reverse the remaining elements
       reverse(nums, k, n - 1);
   }

   private void reverse(int[] nums, int start, int end) {
       while (start < end) {
           int temp = nums[start];
           nums[start] = nums[end];
           nums[end] = temp;
           start++;
           end--;
       }
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\) \- Each reverse operation is O\(n\), and we perform a constant number of them\.
*   **Space Complexity:** O\(1\) \- Reversal done in\-place without extra space\.

#### Example Walkthrough:

**Input:** nums = \[1,2,3,4,5,6,7\], k = 3

0

1

1

2

2

3

3

4

4

5

5

6

6

7

**Step 1:** Reverse the whole array\.

0

7

1

6

2

5

3

4

4

3

5

2

6

1

**Step 2:** Reverse the first 3 elements\.

0

5

1

6

2

7

3

4

4

3

5

2

6

1

**Step 3:** Reverse the remaining 4 \(7 \- 3\) elements\.

0

5

1

6

2

7

3

1

4

2

5

3

6

4

View Animation