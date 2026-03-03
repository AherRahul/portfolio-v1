---
title: Introduction
description: Master Introduction in the Kadane's Algorithm module. Comprehensive
  guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

**Kadane’s algorithm** is a problem solving technique that is used to efficiently solve the **Maximum Subarray Problem**\.

#### **What’s the maximum subarray problem?**

You are given an array and you need to find the subarray with the maximum sum\.

A **subarray** is a contiguous sequence of elements within the array\.

If the array contains only positive numbers, the solution is straightforward: the subarray with the maximum sum would include all elements in the array\.

But the challenge arises when the array contains negative numbers, making it tricky to decide which elements to include\.

For example, in the array:

the subarray with the maximum sum is `**[4, -1, 2, 1]**`, with a total sum of `6`\.

#### **Brute Force Approach**

The brute force approach to solve this problem is simple\.

1.  Check every possible subarray using nested loops\.
2.  Calculate the sum for each subarray and keep track of the maximum sum\.

While it works, this approach has a **time complexity of O\(n²\)**, which is too slow for large inputs\.

#### Kadane’s Algorithm

Kadane’s Algorithm optimizes this process to run in **O\(n\)** time by dynamically deciding whether to:

*   **Extend the current subarray**, or
*   **Start fresh** with a new subarray\.

If adding the current element to the subarray increases the sum, extend the subarray\. Otherwise, start fresh with the current element\.

This ensures the sum remains as large as possible\.

Let’s walk through the **four possible scenarios** for each element:

*   **If the subarray sum is positive and current element is also positive**: extend the subarray , as adding the current element will increase the sum further\.
*   **If the subarray sum is Negative and current element is Positive**: Start a new subarray with the current element, as it’s greater than adding it to a negative sum\.
*   **If the subarray sum is positive and current element is Negative**: Extend the subarray, as the overall sum will still be larger than starting fresh\.
*   **If the subarray sum is negative and the current element is also Negative**: Start a new subarray to avoid reducing the sum even further\.

Here’s how Kadane’s Algorithm looks in code:

```java
public int maxSubArray(int[] nums) {
   // Initialize variables to track the current subarray sum and the maximum sum
   int currentSum = nums[0];
   int maxSum = nums[0];

   // Iterate through the array, starting from the second element
   for (int i = 1; i < nums.length; i++) {
       // Decide whether to extend the current subarray or start a new one
       currentSum = Math.max(nums[i], currentSum + nums[i]);

       // Update the global maximum sum if the current sum is larger
       maxSum = Math.max(maxSum, currentSum);
   }

   // Return the maximum sum found
   return maxSum;
}
```

*   Start by initializing variables to track the current subarray sum and the maximum sum

*   `currentSum` tracks the sum of the current subarray\. We initialize it to the first element because that’s the only subarray we have at the start\.
*   `maxSum` keeps track of the highest sum found so far\.

*   Iterate through the array, starting from the second element\. Decide whether to start a new subarray or extend the current one by comparing:

*   The current element itself \(`**nums[i]**`\) and the current element added to the previous subarray sum \(`**currentSum + nums[i]**`\)
*   Update the `**currentSum**` to the maximum of these two\.

*   Then, update maxSum if currentSum exceeds it
*   After completing the loop, return the maximum sum found\.