---
title: Monotonic Stack
description: Master Monotonic Stack in the Stacks module. Comprehensive guide
  and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

**Monotonic Stack** is a pattern that shows up in LeetCode problems where you need to find the next greater or smaller element in an array\.

With this pattern, you can reduce the time complexity of many array problems from **O\(n²\)** down to **O\(n\)**\.

In this chapter, you'll learn:

*   What a monotonic stack is?
*   When to use it?
*   How to implement it in code?

# What is a Monotonic Stack?

A **Monotonic Stack** is a stack that keeps its elements in a specific order — either always increasing or always decreasing\.

In a **Monotonic Increasing Stack**, each new element you push is **larger** than the ones already in the stack\.

2

5

8

10

Top

*   For example, if you have the numbers `2, 5, 8` in the stack, the next number you add must be **greater than 8**\.

In a **Monotonic Decreasing Stack**, each new element you push is **smaller** than the ones in the stack\.

9

6

4

1

Top

*   For example, if you have `9, 6, 4` in the stack, the next number must be **smaller than 4**\.

A quick tip: In most problems, it’s better to store the **indices** of the numbers in the stack rather than the actual values\.

This gives you more flexibility when accessing values from the array by index\.

## How to Implement a Monotonic Stack?

Let’s break it down with an example problem: **Next Greater Element**\.

The task is to find the next greater element for each number in an array\.

The "next greater element" is simply the first number to the right that’s larger than the current number\.

Let’s consider the array:

0

2

1

1

2

5

3

6

4

2

5

3

We want to find the next greater element for each number:

*   For `2` and `1`, the next greater element is `5`\.
*   For `5`, it’s `6`\.
*   For `6`, there’s no greater element to the right\.
*   For `2`, it’s `3`\.
*   For `3`, there’s no next greater element because it’s the last number\.

A brute force solution would involve a **nested loop** comparing each element with elements to its right until you find a greater element\.

Java

```java
class Solution {
   public int[] nextGreaterElementBruteForce(int[] nums) {
       int n = nums.length;
       int[] result = new int[n];
       
       // For each element
       for (int i = 0; i < n; i++) {
           result[i] = -1; // Default: no greater element found
           
           // Check all elements to the right
           for (int j = i + 1; j < n; j++) {
               if (nums[j] > nums[i]) {
                   result[i] = nums[j];
                   break; // Found the next greater, stop searching
               }
           }
       }
       
       return result;
   }
}
```

But this would take **O\(n²\)** time in the worst case\.

Using a monotonic stack, we can bring down the time complexity down to O\(n\)\.

Here's how it works:

*   We use a stack to store **indices**, and we maintain the elements in **decreasing order**\.
*   We’ll also use a **results list**, initially filled with `-1` \(which will store the next greater element for each index\)\.
*   As we go through the array:

*   If the current number is greater than the number at the top of the stack, we **pop** from the stack and update the result for that index\.
*   We continue this process, then push the index of the current number onto the stack\.

Java

```java
class Solution {
   public int[] nextGreaterElement(int[] nums) {
       int n = nums.length;
       int[] result = new int[n];
       Arrays.fill(result, -1); // Initialize all results to -1
       
       Stack<Integer> stack = new Stack<>(); // Store indices
       
       // Traverse the array
       for (int i = 0; i < n; i++) {
           // While stack is not empty AND current element is greater
           // than element at index stored at top of stack
           while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
               int index = stack.pop();
               result[index] = nums[i]; // Found next greater element
           }
           
           // Push current index onto stack
           stack.push(i);
       }
       
       // Remaining indices in stack have no next greater element
       // (already initialized to -1)
       
       return result;
   }
}
```

Let's walk through an example:

The array is `[2, 1, 5, 6, 2, 3]`\.

We’ll also maintain the following:

*   **Stack**: to store indices\.
*   **Results**: initialized to all \-1 values which is the default answer if no next greater element exists for an index\.

Now, let's go through the array step by step:

*   **At index 0** \(`2`\): The stack is empty, so we push index `0`\.
*   **At index 1** \(`1`\): Since `1` is smaller than `2`, we push index `1`\.
*   **At index 2** \(`5`\): `5` is greater than `1`\. We pop index `1` and update `result[1] = 5`\. `5` is also greater than `2`, so we pop index `0` and update `result[0] = 5`\. Then, we push index `2`\.
*   **At index 3** \(`6`\): `6` is greater than `5`\. We pop index `2` and set `result[2] = 6`\. Push index `3`\.
*   **At index 4** \(`2`\): Since `2` is less than `6`, we push index `4`\.
*   **At index 5** \(`3`\): `3` is greater than `2`\. We pop index `4` and set `result[4] = 3`\. Push index `5`\.

After processing all the numbers, our result array looks like this: `[5, 5, 6, -1, 3, -1]`\.

And there we have it—the next greater element for each index in **O\(n\)** time\.