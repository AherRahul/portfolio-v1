---
title: Array - Introduction
description: Master Introduction in the Arrays module. Comprehensive guide and
  algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

Arrays are one of the most **fundamental data structures** in computer science\. The are the building block and form the foundation for many other data structures and algorithms\.

You'll see arrays everywhere from basic loops and sorting to advanced interview techniques like **two pointers**, **sliding window**, and **dynamic programming**\.

In this chapter, I'll break down:

*   What an array is and how it works
*   What are dynamic arrays
*   Common array operations and their time complexities
*   and some of the most popular interview patterns that use arrays

Lets get started\.

## What is an Array?

So… **what exactly is an array?**

At its core, an **array** is a data structure used to store a **collection of elements of the same type**, arranged in a **contiguous block of memory**\.

**Integer array:**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">10</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">20</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">30</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">40</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">50</span></div>
  </div>
</div>


**Boolean array:**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">true</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">false</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">false</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">true</span></div>
  </div>
</div>


**String array:**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">"A"</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">"B"</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">"C"</span></div>
  </div>
</div>


Suppose you want to store 100 numbers\. You wouldn't create variables like `num1, num2, ..., num100` — that would be impossible to manage\.

Instead, you store them in one structure:

Now you can access any value using an **index**: `arr[0]`, `arr[1]`, `arr[2]`, \.\.\.

Most programming languages use **zero\-based indexing**, so the first element is at index `0`\.

Accessing an element in an array is extremely fast because elements are stored **next to each other in memory\.**

We can compute the address of any index using simple math:

`address of arr[i] = base address + (i × size of each element)`

This allows you to retrieve any element in **constant time, O\(1\),** no matter how large the array is\.

But arrays aren't perfect\.

In languages like **C\+\+** and **Java**, arrays have a **fixed size**\. Once you allocate memory for 100 elements, you can't expand it\.

If you need more space, you'll have to create a new, larger array and copy the data over, which takes **O\(n\)** time\.

Most programming languages like **Python**, **Java, C\+\+, and** **JavaScript** offer more flexible alternatives like List, ArrayList, and Vector which are dynamic in nature\.

*   **Python** → `list`
*   **Java** → `ArrayList`
*   **C\+\+** → `vector`

Dynamic arrays can **resize automatically** as new elements are added\.

But how does that work?

Behind the scenes, dynamic arrays **allocate more memory than needed**\. For example, if you insert 5 elements, it might allocate space for 8 or 10\.

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">5</span><span class="arr-val">_</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">6</span><span class="arr-val">_</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">7</span><span class="arr-val">_</span></div>
  </div>
  <p class="arr-caption">size = 5 &nbsp;|&nbsp; capacity = 8</p>
</div>


This way, the array don't require resizing for each insertion\.

When the array runs out of space, it typically **doubles** its capacity — allocating a bigger chunk of memory, and **coping all elements** from the old array to the new one\.

This operation is expensive, it takes **O\(n\)** time\.

But because it doesn't happen often, the average time for inserting at the end remains **O\(1\)\.**

## Common Array operations

Now that you understand what arrays are and how they're stored in memory, let's go over some of the most **common operations** you'll perform on arrays and how efficient they are in terms of **time complexity**\.

### 1\. Accessing by Index

Since the elements are stored in **contiguous memory layout,** the address of any element can be calculated directly using a simple formula\.

```java
class ArrayAccessExample {
   public static void main(String[] args) {
       int[] arr = {10, 20, 30, 40, 50};

       // Access element at index 2 (3rd element)
       int index = 2;
       int value = arr[index];

       System.out.println("Element at index " + index + " = " + value);
   }
}
```

That's why accessing an element by index always takes constant time, whether the array has 10 elements or 10 million\.

### 2\. Traversal

Traversal means going through the array, one element at a time — commonly used for printing values, calculating a sum, or searching for a specific item\.

```java
class ArrayTraversalExample {
   public static void main(String[] args) {
       int[] arr = {3, 5, 7, 9, 11};

       // Traversal: visit each element exactly once
       System.out.print("Array elements: ");
       for (int i = 0; i < arr.length; i++) {
           System.out.print(arr[i] + " ");
       }
   }
}
```

Since each element is visited exactly once, this takes **O\(n\)** time, where `n` is the number of elements in the array\.

### 3\. Insertion

The performance of insertion depends entirely on _where_ the new element is placed\.

If you insert at the end, it's fast\. Just place the element at the next index, if there is free capacity\.

This takes **O\(1\)** time in dynamic arrays\.

If you insert at a the beginning or the middle, it gets slower since all elements after the insertion point must be **shifted one position to the right** to make space\. This shifting requires **O\(n\)** time in the worst case\.

Even though languages like Python \(`list`\) or Java \(`ArrayList`\) handle the shifting internally, the time complexity does not change — it still costs **O\(n\)** for inserting anywhere except the end\.

### 4\. Deletion

Removing an element is similar to insertion — it depends on the position\.

If you drop the last element, no shifting is required\. It takes **O\(1\)** time\.

But if you delete from start or middle, you'll need to **shift all following elements left** to fill the gap\. That takes **O\(n\)** time\.

So deleting the first element in a 1,000\-element array means 999 elements need to move one step left\.

### 5\. Search

The performance of searching depends heavily on whether the array is sorted\.

If the array is **unsorted**, you'll have to scan through each element one by one which takes O\(n\) time\.

But if the array is **sorted**, you can use **Binary Search**, which divides the search space in half with each step — reducing the time to **O\(log n\)**\.

## Common Array Interview Patterns

Arrays show up in almost every coding interview\. But the questions don't just ask you to "loop and print"\. Instead, they are often based on **problem\-solving patterns** that use arrays in clever ways\.

Here are the most common array patterns you should know\.

### 1\. Two Pointer Technique

This pattern works especially well for **sorted arrays** or problems where you compare values from both ends\.

You place one pointer at the start and another at the end, then move them inward based on certain logic\.

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="L">↓</span><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="R">↓</span><span class="arr-idx">4</span><span class="arr-val">9</span></div>
  </div>
  <p class="arr-step-label">Step 1 — Initial state</p>
</div>


<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="L">↓</span><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="R">↓</span><span class="arr-idx">4</span><span class="arr-val">9</span></div>
  </div>
  <p class="arr-step-label">Step 2 — Move left pointer</p>
</div>


<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="L">↓</span><span class="arr-idx">2</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="R">↓</span><span class="arr-idx">4</span><span class="arr-val">9</span></div>
  </div>
  <p class="arr-step-label">Step 3 — Move left pointer again</p>
</div>


<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="L">↓</span><span class="arr-idx">2</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="R">↓</span><span class="arr-idx">3</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">9</span></div>
  </div>
  <p class="arr-step-label">Step 4 — Move right pointer</p>
</div>


<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="L&R">↓</span><span class="arr-idx">2</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">9</span></div>
  </div>
  <p class="arr-step-label">Done — Pointers met</p>
</div>


This approach often turns an **O\(n²\)** brute\-force solution into a clean **O\(n\)** solution\.

Common use cases include:

*   Checking if a number pair sums to a target
*   Removing duplicates in a sorted array
*   Checking if a string is palindrome

### 2\. Sliding Window

It is used for problems that involve **subarrays** or **ranges**\.

Instead of recomputing from scratch each time, you "slide" a window over the array and update the answer efficiently\.

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
  </div>
  <p class="arr-step-label">Window of size 3 — Step 1</p>
</div>


<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
  </div>
  <p class="arr-step-label">Step 2 — Slide right</p>
</div>


<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
  </div>
  <p class="arr-step-label">Step 3 — Slide right</p>
</div>


<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
  </div>
  <p class="arr-step-label">Step 4 — Final window</p>
</div>


If we use sliding window cleverly, it can reduce the time complexity of many brute force solution from O\(n^2\) to O\(n\)\.

This technique is extremely useful for problems like:

*   Longest / shortest subarray with a condition
*   Maximum sum subarray \(fixed or variable size\)
*   Number of substrings with certain properties

### 3\. Prefix Sum

Prefix sums help you answer **range queries** in constant time\.

You precompute a running sum such that: sum\(L to R\) = prefix\[R\] – prefix\[L \- 1\]

**Input array:**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
  </div>
</div>


**Prefix Sum array:**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">10</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">15</span></div>
  </div>
</div>


This avoids recomputing sums for each query, which is critical in problems with many range checks\.

### 4\. Dynamic Programming or DP

Arrays also serve as the foundation for many **DP solutions**\.

They are used to store the results of smaller subproblems so you don't recompute them\.

Examples include:

*   Fibonacci sequence \(iterative bottom\-up\)
*   Coin change
*   Longest Increasing Subsequence
*   and Knapsack variants