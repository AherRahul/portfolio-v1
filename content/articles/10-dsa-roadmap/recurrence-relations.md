---
title: Recurrence Relations
description: Master Recurrence Relations in the Big O Notation module.
  Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

# Recurrence Relations

When you first start analyzing recursive algorithms, one question always pops up: **“How do I calculate how long this algorithm takes?”**

You might not know the exact time immediately, but there’s a pattern, each recursive call depends on smaller subproblems.

And that’s where **recurrence relations** come in.

## What Is a Recurrence Relation?

A **recurrence relation** expresses a sequence or function **in terms of its previous values**.

In simple words:

> A recurrence relation tells you how to get to the next step using the ones before it.

Let’s take the classic **Fibonacci sequence** as an example:

```shell
0, 1, 1, 2, 3, 5, 8, 13, ...
```

Each number is the sum of the two before it.

That rule can be expressed mathematically as: `F(n) = F(n−1) + F(n−2)`

with base cases: `F(0) = 0, F(1) = 1`

This simple formula is a **recurrence relation**. It defines how every term relates to its previous ones and that’s the same idea we use to analyze recursive algorithms.

## Why Do We Need Recurrence Relations?

When you write a recursive function, each call usually depends on results from smaller inputs.

That pattern naturally translates into a recurrence relation.

Take **Merge Sort**, for instance:

```shell
T(n) = 2T(n/2) + O(n)
```

Let’s decode it:

*   The array is split into 2 halves → `2T(n/2)`
*   The merge step takes linear time → `O(n)`

This recurrence shows how the algorithm’s total time `T(n)` depends on its subproblems. Solving it gives us the familiar time complexity `O(n log n)`.

In short, **recurrence relations are the mathematical expression of recursion**.

## The General Form

A recurrence relation generally looks like this:

```shell
T(n) = a×T(n/b) + f(n)
```

Where:

*   `a` = number of subproblems
*   `n/b` = size of each subproblem
*   `f(n)` = extra work done outside recursion (like merging or looping)

For example:

| **Algorithm** | Recurrence | Explanation |
| --- | --- | --- |
| **Binary Search** | T(n) = T(n/2) + O(1) | Divide problem into half each time |
| **Merge Sort** | T(n) = 2T(n/2) + O(n) | Split into 2 halves and merge |
| **Quick Sort (avg)** | T(n) = 2T(n/2) + O(n) | Partition and recurse on halves |
| **Tower of Hanoi** | T(n) = 2T(n−1) + O(1) | Move smaller stacks recursively |

## Visualizing Recurrence Relations

Let’s visualize the recurrence for **Merge Sort:** `T(n) = 2T(n/2) + n`

Imagine it as a **recursion tree**:

```shell
             T(n)
          /        \
       T(n/2)     T(n/2)
       /   \       /   \
  T(n/4) T(n/4) T(n/4) T(n/4)
        ...
```

At each level:

*   The total work = n
*   The number of levels = log n

So total work = **n × log n**

That’s how recurrence relations convert recursive code into predictable math.

## How to Solve Recurrence Relations

Writing a recurrence relation is only half the job.

The real challenge lies in **solving it,** that is, finding how fast your algorithm grows as input size increases.

Solving a recurrence gives you the **closed-form expression** or the **Big-O complexity** of your recursive algorithm.

There are three main techniques you’ll use again and again:

1.  **Substitution Method** (a.k.a. Guess and Check)
2.  **Recursion Tree Method**
3.  **Master Theorem**

Let’s go through each in depth.

### Substitution Method

This is the most intuitive method. You _guess_ the time complexity (using experience or patterns) and then _prove_ that your guess holds using **mathematical induction**.

Given recurrence: `T(n) = 2T(n/2) + n`

#### **Step 1. Guess the solution**

We suspect `T(n) = O(n log n)` — because we halve the problem twice and merge in linear time.

#### **Step 2. Prove by induction.**

We want to show: T(n) ≤ c×nlogn, for some constant `c`.

**Base Case:**

For small `n` (say `n = 1`), `T(1)` is constant, so the base holds.

**Inductive Step:**

Assume the formula holds for all smaller values (`k < n`).

Then:

T(n) = 2T(n/2) + n

Substitute the inductive hypothesis:

T(n)≤2c⋅2n​log2n​+nT(n)≤cn(logn−1)+nT(n)\=cnlogn−cn+nT(n)\=cnlogn−n(c−1)

For `c > 1`, this inequality holds true. Hence, T(n) = O(n log n)

### Recursion Tree Method

If you love visualization, this one’s for you. The recursion tree method **unfolds the recurrence** into a tree and lets you **sum the work done at each level**.

#### **Example: Merge Sort Again**

`T(n) = 2T(n/2) + n`

Let’s visualize:

```shell
Level 0:    Work = n
Level 1:    2 * (n/2) = n
Level 2:    4 * (n/4) = n
...
Level log n:  n * 1 = n
```

At each level, total work = `n`.

Number of levels = `log n`.

Total work:

```shell
T(n) = n + n + n +... + n = n × logn
```

### Master Theorem

When you see a recurrence like: `T(n) = aT(n/b) + f(n)`, you can jump directly to the result using the **Master Theorem**.

It's a powerful shortcut for most divide-and-conquer algorithms.

We will discuss it more in the next chapter.

### Iterative Expansion Method

If all else fails, **expand manually** until a pattern appears.

**Example:** `T(n) = T(n−1) + n`

Expand:

```shell
T(n) = T(n-1) + n
     = T(n-2) + (n-1) + n
     = T(n-3) + (n-2) + (n-1) + n
     = ...
     = T(1) + (2 + 3 + ... + n)
```

Sum of first n numbers = n(n+1)/2 → O(n²)