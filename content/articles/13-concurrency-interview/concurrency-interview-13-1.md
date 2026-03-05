---
title: "Multi-threaded Merge Sort"
description: "Multi-threaded Merge Sort - Concurrency Interview Module 13"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Multi-threaded Merge Sort

Merge sort is naturally suited for parallelism: each half of the array can be sorted independently, then merged to produce the final result. A multi-threaded merge sort takes advantage of this by recursively splitting the input, sorting subarrays concurrently, and joining the results at each merge step.

In this chapter, we'll build multi-threaded merge sort from scratch, explore three different parallelization approaches, analyze their trade-offs, and understand why the merge phase becomes the bottleneck at scale.

# Sequential Merge Sort Recap

Merge sort follows a simple recursive pattern: divide the array in half, sort each half recursively, then merge the two sorted halves. The recurrence relation is:

This gives us O(n log n) time complexity. The O(n) term comes from the merge step, which must examine every element to combine two sorted halves into one.

The diagram shows how merge sort recursively divides the array until reaching single elements, then merges sorted pieces back together. Each level of the tree does O(n) total work across all merges, and there are log n levels, giving O(n log n) total.

### The Parallelization Goal

In sequential merge sort, we process one recursive call at a time. But notice something: when sorting the left half, we don't need any information from the right half. They're completely independent until the merge step. This independence is the key to parallelism.

If we have two threads, one can sort the left half while the other sorts the right half. With four threads, we can parallelize one level deeper. The goal is to reduce the **span** (the longest chain of dependent operations) while keeping the **work** (total operations) the same.

**Performance Metrics:**

Metric

Sequential

Parallel (sequential merge)

Parallel (parallel merge)

Work

O(n log n)

O(n log n)

O(n log n)

Span

O(n log n)

O(n)

O(log² n)

Parallelism

1

O(log n)

O(n / log n)

The span with sequential merge is O(n) because even if we parallelize all the recursive calls, we still need O(n) time to merge the final two halves. This limits our speedup. We'll address this later with parallel merge.

### API Design

We want a simple API that hides the complexity:

The implementation should:

*   Use all cores efficiently
*   Fall back to sequential sort for small subarrays
*   Handle edge cases (empty arrays, single elements)
*   Be thread-safe and produce correct results

# Sequential Baseline

Before parallelizing, let's establish a clean sequential implementation. This serves as our correctness baseline and helps identify parallelization opportunities.

### Identifying Parallelization Opportunities

Looking at the recursive structure, two things become clear:

1.  **Independent subproblems:** The left and right recursive calls don't depend on each other. They can run in parallel.
2.  **Sequential dependency:** The merge step must wait for both halves to be sorted. This creates a synchronization point.

The green boxes show tasks that can run in parallel. The orange and red boxes show merge operations that must wait for their children. Notice that at each level, all recursive sorts at that level can run simultaneously, but merges at each level depend on the sorts completing.

The critical path (longest dependency chain) goes through: one sort at each level down to the base case, then one merge at each level back up. The merge at level 0 processes all n elements, making it the bottleneck.

# Parallelism Analysis

Before diving into implementations, let's analyze the theoretical limits of parallel merge sort using work-span analysis.

### Work and Span

**Work (T₁):** Total operations if run on one processor.

For merge sort, work is O(n log n). This doesn't change with parallelization. We're doing the same operations, just on multiple cores.

**Span (T∞):** Longest chain of sequential dependencies. Also called "critical path length."

With sequential merge, the span is:

*   Span of recursive calls: O(log n) levels, with O(1) work per level for forking
*   Span of merges: O(n) for the final merge

Total span: O(n)

**Parallelism (T₁ / T∞):** Maximum useful processors.

With sequential merge: O(n log n) / O(n) = O(log n)

This means with 8 cores, we can expect maybe 3x speedup, not 8x. The merge bottleneck limits us.

### Dependency Analysis

Task

Depends On

Can Parallelize With

sort(left)

Parent's fork

sort(right)

sort(right)

Parent's fork

sort(left)

merge(parent)

sort(left), sort(right)

Nothing at same level

Final result

All merges

Nothing

The dependency structure forms a tree where sorts are leaves (independent) and merges are internal nodes (depend on children).

### Theoretical vs. Practical Speedup

The speedup formula is:

Where Tₚ is time on p processors. Ideally:

For our case with p = 8 cores and n = 100M:

*   T₁ = n log n ≈ 100M × 27 ≈ 2.7B operations
*   T∞ = n = 100M operations (merge bottleneck)
*   T₈ ≈ 2.7B/8 + 100M ≈ 437M operations
*   Speedup ≈ 2.7B / 437M ≈ 6.2x

Not 8x, because 100M operations are sequential no matter how many cores we have.

# Approach 1: Thread-per-Subtask (Naive)

The simplest parallelization: create a new thread for each recursive call. This is instructive to understand why naive approaches fail.

**Note:** Python's GIL makes this approach doubly bad. Threads don't actually run in parallel for CPU-bound work, and you still pay the thread creation overhead.

**Note:** While Go's goroutines are much cheaper than OS threads, creating millions of goroutines still has significant overhead. The goroutine stack starts at 2KB (vs ~1MB for threads), but the scheduler still incurs costs managing them all.

### The Thread Explosion Problem

This approach creates 2 threads at every level of recursion. For an array of n elements:

*   Level 0: 1 task
*   Level 1: 2 threads
*   Level 2: 4 threads
*   Level k: 2^k threads

For n = 1 million elements with log₂(n) = 20 levels, we create approximately 2^20 = 1 million threads!

**Why This Fails:**

Problem

Impact

Thread creation overhead

~1ms per thread × 1M threads = 1000 seconds just creating threads

Memory per thread

~1MB stack × 1M threads = 1TB of stack memory

Context switching

OS can't efficiently schedule millions of threads

No benefit

Only 8 cores, so only 8 threads can run at once

### Analysis

Criteria

Assessment

Correctness

Yes, produces correct results

Efficiency

Very poor, massive overhead

Scalability

Terrible, creates O(n) threads

Practical use

Never use this approach

The key insight: we don't need a thread per task. We need a small pool of threads that can execute many tasks.

# Approach 2: Thread Pool with Threshold

The fix is straightforward: use a fixed thread pool and only parallelize until we have enough tasks for all threads. Below a certain threshold, switch to sequential sorting.

### Choosing the Threshold

The threshold determines when to stop parallelizing and switch to sequential sorting. Two factors compete:

1.  **Too low threshold:** Creates too many tasks, overhead dominates
2.  **Too high threshold:** Not enough parallelism, cores sit idle

#### **Rule of Thumb**

This creates roughly 10 tasks per thread, giving the scheduler flexibility to balance load while keeping overhead manageable.

For 100M elements and 8 threads:

In practice, 10,000-100,000 often works well. Profile with your specific data.

### Analysis

Criteria

Assessment

Correctness

Yes, produces correct results

Efficiency

Good, bounded overhead

Scalability

Good, fixed number of threads

Practical use

Viable for production

This approach is much better than thread-per-task. However, it still has a limitation: when threads are blocked waiting for subtasks, they can't do other useful work. The next approach addresses this.

# Approach 3: Fork-Join Framework

The fork-join framework is specifically designed for divide-and-conquer algorithms. It provides work stealing, efficient task management, and proper handling of recursive task decomposition.

### Why Fork-Join is Ideal

The fork-join framework solves several problems that plague simpler approaches:

**Work Stealing:** When a worker finishes its tasks, it steals from other workers' queues. This automatically balances load without central coordination.

**Efficient Joining:** When a task calls `join()`, the worker doesn't just block. It can execute other tasks from its queue or help execute the joined task. This keeps threads productive.

**LIFO/FIFO Separation:** Workers pop from the head (most recent tasks, likely small), thieves steal from the tail (older tasks, likely large). This optimizes cache locality and minimizes stealing overhead.

### Analysis

Criteria

Assessment

Correctness

Yes, produces correct results

Efficiency

Excellent, minimal overhead

Scalability

Excellent, work stealing balances load

Practical use

Recommended for production

# Advanced: Parallel Merge

So far, our merge step is sequential. For very large arrays, this becomes the bottleneck. Can we parallelize merge itself?

### The Merge Bottleneck

Consider merging two sorted arrays of n/2 elements each. Sequential merge takes O(n) time. Even with perfectly parallel recursive sorts, we spend O(n) time on the final merge.

With parallel merge, we can reduce the span of merging from O(n) to O(log n). Here's the key insight:

1.  Find the median element of the combined result
2.  This median splits both input arrays
3.  Recursively merge the two halves in parallel

### Parallel Merge Algorithm

The algorithm uses binary search to find where elements from one array would be inserted into the other:

1.  Take the median of the larger array (element at position m)
2.  Binary search to find where m would be inserted in the smaller array (position j)
3.  All elements before positions m and j go in the lower half of output
4.  All elements after go in the upper half
5.  Recurse on both halves in parallel

### Trade-offs

Aspect

Sequential Merge

Parallel Merge

Span

O(n)

O(log² n)

Code complexity

Simple

Complex

Cache efficiency

Good (sequential access)

Poor (random access)

Overhead

None

Binary search at each level

When to use

n < 1M elements

n > 10M elements

Parallel merge is only worthwhile for very large arrays. The binary search overhead and cache misses often make it slower than sequential merge for moderately-sized inputs. Profile before adopting.

Launching soon
