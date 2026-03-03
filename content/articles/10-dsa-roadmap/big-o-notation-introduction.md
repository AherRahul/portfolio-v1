---
title: Big O Notation Introduction
description: Master Introduction in the Big O Notation module. Comprehensive
  guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

# Big O Notation Introduction

**Big O Notation** is a way to measure how efficiently your code performs as the input size grows.

You’ve probably seen code that works perfectly on small inputs but slows down, crashes, or times out when the input becomes large.

Understanding Big O helps you avoid slow, inefficient solutions and write code that actually scales.

It’s also one of the **most important topics in coding interviews**.

You’ll almost always be asked to explain the **time and space complexity** of your solution and the more efficient your approach, the stronger your chances of passing the interview.

In this chapter, I’ll break down:

*   What Big O Notation actually means
*   The most common time complexities you’ll come across
*   What is space complexity
*   and rules to calculate Big O for any piece of code

![Big O](https://payload.algomaster.io/api/media/file/bigO-light.png)

## What is Big O?

So… what exactly is Big O Notation?

> Big O is a mathematical way to describe how the performance of an algorithm changes as the size of the input grows.

It doesn’t tell you the exact time your code will take.

Instead, it gives you a **high-level growth trend** — how fast the number of operations increases relative to the input size.

**For example:** if your input doubles, does your algorithm take twice as long? Ten times as long? Or does it barely change at all?

Big O helps you answer those questions without even running the code so you can choose the most efficient algorithm for large inputs.

Below is a rough visualization of how the time grows with input size `n`:

```shell
O(1)            ▓
O(log n)        ▓▓
O(n)            ▓▓▓▓▓▓
O(n log n)      ▓▓▓▓▓▓▓▓▓▓
O(n²)           ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
O(2^n)          ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

One important thing to note is that **Big O is machine-independent**.

It doesn’t matter whether your code runs on a fast laptop or a slow server, the growth pattern stays the same.

The key variable that drives BIG O is the **input size (N)**. As `N` increases, Big O helps you predict whether the algorithm will still be efficient or become impractical.

## Common Time Complexities

Now that you understand what Big O Notation is, let’s go over the most common time complexities you’ll encounter.

Even small differences in complexity (like O(n) vs. O(n log n)) make a **huge** impact as `n` grows.

### 1\. Constant Time – O(1)

This is the fastest and most efficient time complexity.

An algorithm is **O(1)** if it performs a fixed number of operations meaning the execution time does _not_ depend on the size of the input.

A classic example is **accessing an element in an array by index.**

```java
int[] a = {10, 20, 30, 40}

int x = a[3];

System.out.println(x);
```

It doesn’t matter if the array has 10 elements…or 10 million, the time it takes to access an element **stays exactly the same.**

There’s no looping, no scanning. You jump directly to the value using its index.

### 2\. Logarithmic Time – O(log n)

Next up is **logarithmic time**, or **O(log n).**

An algorithm runs in **O(log n)** time when every step reduces the problem size by a constant factor most often, by **half**.

This means the amount of work grows **very slowly**, even when the input becomes massive.

The most common example is **Binary Search**.

```java
int binarySearch(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) 
          return mid;
        if (a[mid] < target) 
          lo = mid + 1;
        else 
          hi = mid - 1;
    }
    return -1;
}
```

Suppose you have a sorted array of 1 million elements. Instead of scanning linearly:

1.  Look at the middle element
2.  If it’s not the target, eliminate half the array in one step
3.  Repeat on the remaining half

Each step discards **50% of the remaining data**.

To put that into perspective, here are the number of steps binary search takes for different input sizes.

*   Input size = 8 → max 3 steps
*   Input size = 1,000 → max 10 steps
*   Input size = 1,000,000 → max 20 steps
*   Input size = 1,000,000,000 → still just 30 steps!

Even with 100 million elements, binary search takes only ~20 steps.

Another great example of logarithmic time is searching in a **Balanced Binary Search Tree.**

At each node, you eliminate **half of the remaining subtree**, just like binary search.

### 3\. Linear Time – O(n)

Now let’s talk about **Linear Time**, or **O(n).**

An algorithm is **O(n)** when its running time grows **directly in proportion** to the size of the input.

If the input doubles, the number of operations also doubles.

A simple example is **finding the maximum value in an array**:

```java
int findMax(int[] array) {
    int max = array[0];
    for (int i = 1; i < array.length; i++) {
        if (array[i] > max) {
            max = array[i];
        }
    }
    return max;
}
```

*   You start with some initial max
*   Then you scan every element and compare it to the current max
*   Each comparison is O(1), but you do it `n` times so the overall time complexity becomes **O(n)**.

So with 10 elements, you do 10 comparisons.

With 1 million elements, you do 1 million comparisons.

Any algorithm that **visits every element exactly once** is linear time.

Other common examples of O(n) complexity includes:

*   Summing all values in a array
*   Printing every item in a linked list
*   Traversing all nodes in a tree or graph

In general, when your algorithm has to **look at each element at least once** whether it’s an array, a linked list, a tree, or any collection, you’re most likely dealing with **O(n)** time.

### 4\. Linearithmic Time – O(n log n)

Now we enter the world of **O(n log n)** also called **linearithmic time**.

Algorithms with **O(n log n)** time complexity combine two behaviors:

*   A **log n** factor from repeatedly splitting the input
*   An **n** factor from processing or merging the pieces

It’s often described as **logarithmic splitting with linear merging**.

The classic example is **Merge Sort**:

```java
class MergeSort {
    public static void sort(int[] a) {
        if (a == null || a.length < 2) return;
        int[] aux = new int[a.length];
        sort(a, aux, 0, a.length - 1);
    }

    private static void sort(int[] a, int[] aux, int lo, int hi) {
        if (lo >= hi) return;
        int mid = lo + (hi - lo) / 2;

        sort(a, aux, lo, mid);
        sort(a, aux, mid + 1, hi);

        if (a[mid] <= a[mid + 1]) return;

        merge(a, aux, lo, mid, hi);
    }

    private static void merge(int[] a, int[] aux, int lo, int mid, int hi) {
        System.arraycopy(a, lo, aux, lo, hi - lo + 1);

        int i = lo;
        int j = mid + 1;

        for (int k = lo; k <= hi; k++) {
            if (i > mid) a[k] = aux[j++];
            else if (j > hi) a[k] = aux[i++];
            else if (aux[i] <= aux[j]) a[k] = aux[i++];
            else a[k] = aux[j++];
        }
    }
}
```

*   First, it **recursively splits** the array in half over and over. That’s the **log n** part.
*   Then, it **merges** the sorted halves back together and that takes **n** steps in total.

Multiply those together and you get **O(n log n)**.

This complexity is slightly slower than linear time, but still very efficient and it’s the backbone of many fast sorting algorithms

### 5\. Quadratic Time – O(n²)

Next, up quadratic time or O(**n²**). This is where things start to get ugly.

In an O(n²) algorithm, the number of operations grows **proportionally** to the square of the input size. So if you have n elements, you perform roughly n × n operations.

This typically happens when you have **nested loops**, where for **each element** you iterate over **all other elements**.

```java
class NSquare {
    public int nsquare(int[] a) {
        int n = a.length;

        int pairSum = 0;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                pairSum += a[i] * a[j];
            }
        }
        return pairSum;
    }
}
```

Classic examples include simple sorting algorithms like:

*   **Bubble Sort**
*   **Selection Sort**
*   **Insertion Sort** (worst case)

All of them compare or swap elements in nested loops, leading to **O(n²)** behavior.

These algorithms are fine for small inputs, but they become painfully slow as `n` grows:

For `n = 1,000`, you’re doing around **1 million operations**. And if `n = 10,000`, you’re looking at **100 million** operations.

In coding interviews and wherever performance matters, you’ll often want to **avoid O(n²) and** look for ways to bring it down to O(n log n) or better.

That said, sometimes quadratic time is acceptable especially when `n` is small or no better solution exists.

### 6\. Exponential Time – O(2ⁿ)

Next, exponential time.

Exponential time algorithms usually appear when we try to solve a problem by **checking every possible combination** often through brute force or backtracking.

Think of it as the opposite of binary search: Instead of eliminating half the work at each step, you are often **doubling** the work with each extra input element.

This happens in problems where each element can branch into multiple recursive calls.

A classic example is generating all **subsets of a set** (also called the power set):

*   If the set has `n` elements, there are `2ⁿ` possible subsets.

That means, just for 30 elements, you’re looking at over **1 billion** possibilities. And for 40? Over **1 trillion**.:

*   n = 20 → ~1 million possibilities
*   n = 30 → ~1 billion possibilities
*   n = 40 → ~1 trillion possibilities

This kind of growth becomes **unmanageable very quickly.** Even a small increase in `n` makes the runtime explode.

But the good news is that many exponential-time problems can be optimized using techniques like **memoization** or **dynamic programming**

These techniques prevent us from recomputing the same subproblems, often reducing the time from **O(2ⁿ)** down to a much more practical **polynomial time**, which makes the solution usable in real-world scenarios.

In general, exponential algorithms are fine only for **very small inputs.** For anything larger, you must either optimize or rethink the approach.

### 7\. Factorial Time – O(n!)

And finally… we’ve reached the most explosive time complexity of them all: **Factorial Time**, or **O(n!)**

This is what you get when an algorithm tries **every possible arrangement** of a set of `n` elements.

The number of possibilities grows **faster than any other complexity** we’ve seen.

By definition, `n!` (n factorial) means: n × (n - 1) × (n - 2) × ... × 1

which means

*   3! = 3 × 2 × 1 = 6
*   5! = 120
*   10! = 3.6 million
*   15! = over **1 trillion**

Even at n = 15, the numbers are already in the trillions which makes it completely impractical to compute.

A classic example of O(n!) is **generating all permutations of a string**.

```java
class Permutations {
    public static List<String> permute(String s) {
        List<String> out = new ArrayList<>();
        char[] a = s.toCharArray();
        backtrack(a, 0, out);
        return out;
    }

    private static void backtrack(char[] a, int i, List<String> out) {
        if (i == a.length) {
            out.add(new String(a));
            return;
        }

        for (int j = i; j < a.length; j++) {
            swap(a, i, j);
            backtrack(a, i + 1, out);
            swap(a, i, j); // undo
        }
    }

    private static void swap(char[] a, int i, int j) {
        char t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
}
```

If you have a string of length 10 and try to print every permutation, that’s already several million operations and increasing `n` by just 1 doubles or triples the workload instantly.

These kinds of brute-force solutions are mostly used for very small inputs. Instead, we rely on smarter techniques like **dynamic programming**, **branch and bound** , or **heuristics** to reduce the problem space.

## Space Complexity

So far, we’ve focused on **time complexity,** how fast an algorithm runs as input size grows.

But Big O also applies to **memory usage** and that is called **space complexity**.

In interviews, you’ll often be asked to analyze **both time and space complexity** because in real systems, performance isn’t just about speed…**It’s also about how much memory your solution consumes.**

Space complexity tells you how much **extra memory** your algorithm uses _in addition to the input itself_.

This extra memory can come from:

*   Temporary data structures like arrays, hash maps, stacks, queues, etc.
*   Recursion call stack frames
*   or Intermediate buffers used during computation

Even if your algorithm is fast, it may still **waste memory** which can be a serious problem in large-scale systems or environments with limited RAM.

Now, lets look at popular space complexities you will come across:

### 1) O(1) — Constant Space

If you scan an array to find the maximum value, you only store **one variable** to track the current max.

```java
int maxValue(int[] a) {
    int max = a[0];

    for (int i = 1; i < a.length; i++) {
        if (a[i] > max) {
            max = a[i];
        }
    }

    return max;
}
```

So while the input size may grow, your extra space stays constant.

### 2) O(n) — Linear Space

Now suppose you collect all even numbers from the array into a new list.

```java
List<Integer> collectEvens(int[] a) {
    List<Integer> evens = new ArrayList<>();

    for (int x : a) {
        if ((x & 1) == 0)
            evens.add(x);
    }

    return evens;
}
```

If half the numbers are even, that’s roughly `n/2` elements which still counts as **O(n)** space.

### 3) O(n²) — Quadratic Space

Storing a full matrix (like an adjacency matrix or DP table) of size `n × n` takes **O(n²)** space.

    <span style="width:44px;text-align:center;font-size:10px;color:rgba(161,161,170,0.7);font-family:monospace;">0</span>
    <span style="width:44px;text-align:center;font-size:10px;color:rgba(161,161,170,0.7);font-family:monospace;">1</span>
    <span style="width:44px;text-align:center;font-size:10px;color:rgba(161,161,170,0.7);font-family:monospace;">2</span>
    <span style="width:44px;text-align:center;font-size:10px;color:rgba(161,161,170,0.7);font-family:monospace;">3</span>

### 4) Space from Recursion — O(h), O(n), or worse

Space complexity isn’t only about the extra data structures you create. Recursion also consumes memory through the **call stack**, and this often goes unnoticed.

Every recursive call adds a new frame to the stack until the function returns. Depending on the algorithm, this stack usage can range from logarithmic to linear, or even worse.

For example, the **naive recursive Fibonacci** solution branches twice for each call. It takes **O(2ⁿ)** time but still uses **O(n)** space because at most `n` calls are active on the stack at once.

For **Depth First Search (DFS)** on a tree, the stack depth is proportional to the **height** `**h**` **of the tree**.

*   In a **balanced tree**, `h = O(log n)` → so space is **O(log n)**
*   In the **worst case (a skewed tree)**, `h = O(n)` → so space becomes **O(n)**

## Rules for Calculating Big O

Now, lets talk about how to **actually calculate** the complexity of a piece of code.

The simplest way is to **break your code down into parts** and analyze each part separately.

### Rule 1: Add Complexities of Sequential Operations

If your algorithm performs one block of work **after** another, you **add** their time complexities.

Imagine your code has two separate, sequential loops:

```java
// Block A: O(n)
for (int i = 0; i < m; i++) {
    // ... do O(1) work
}

// Block B: O(n^2)
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        // ... do O(1) work
    }
}
```

The total runtime is the time for Block A _plus_ the time for Block B which comes out to be O(m) + O(n^2).

### Rule 2: Multiply Complexities of Nested Operations

If you algorithm has nested loop with the outer loop running n times and the inner loop running m times, the total complexity is O(n \* m).

```java
// Block A: Outer loop runs n times -> O(n)
for (int i = 0; i < n; i++) {

    // Block B: Inner loop runs m times -> O(m)
    for (int j = 0; j < m; j++) {
        // ... do O(1) work
    }
}
```

### Rule 3: Drop Constant Factors

This rule states that we can ignore any constant multipliers in a Big O expression.

When you derive a time complexity expression, you may end up with something like: **O(2n + 5)** or **O(n² + n + 10)**.

Big O is not about the **exact number of steps** — it’s about **how fast your algorithm grows** with input.

Whether your algorithm takes `n` steps or `5n` steps, both grow _linearly_ as `n` increases, the constant multiplier doesn’t affect the growth trend. If you double the input, the runtime for both will (roughly) double.

So we drop constant factors:

*   `O(2n^2)` simplifies to `O(n^2)`
*   `O(5n + 100)` becomes `O(n)`
*   `O(n/3)` simplifies to `O(n)` since 1/3 is also just a constant factor

### Rule 4: Drop Lower-Order Terms

If your final expression has multiple terms, you keep only the one that grows the fastest, the **dominant term**, and drop the rest.

Why? Because as `n` becomes very large, slower-growing terms become insignificant.

Lets use the example O(n^2 + n + 100). Imaging n = 1,000,000$ (one million).

*   `n²` which is the dominant term becomes one trillion
*   while `n` is just one million and the constant term stays at 100

At scale, the lower-order term **barely makes a dent** in the overall growth. So we only keep the term that dominates.

Here are more examples:

*   `O(n² + n)` simplifies to `O(n²)`
*   `O(n³ + 10n)` becomes `O(n³)`
*   `O(n³ + n² + n)` simplifies to `O(n³)`

Now that you understand what **Big O notation** means and how it helps us describe the growth rate of algorithms, it’s time to go one step deeper.

You’ve seen that Big O gives us an **upper bound,** it tells us how fast an algorithm’s running time can grow _in the worst case_.

But not every input triggers that worst-case behavior. Some inputs make an algorithm run **much faster**, while others make it **painfully slow**.

So how do we capture that difference?

That’s where **Best, Worst, and Average Case Complexity** comes in, a more nuanced way to describe how an algorithm behaves across different kinds of inputs.

In the next chapter, we’ll explore what these three cases mean, how to identify them, and why they matter when analyzing real-world algorithms.