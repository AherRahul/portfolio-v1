---
title: Amortized Analysis
description: Master Amortized Analysis in the Big O Notation module.
  Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

# Amortized Analysis

So far, we've analyzed algorithms using **Worst\-Case Analysis**\. We look at a single operation and ask, "What is the absolute most work this one operation could ever do?"

This is the Big O we've been calculating, and it's a vital tool\.

But sometimes, worst\-case analysis can be too pessimistic\. It can make a fast algorithm look slow\.

If you’ve ever worked with a **dynamic array \(like ArrayList in Java or vector in C\+\+\)**, you might’ve noticed something strange:

*   Most of the time, adding an element is **instant \(O\(1\)\)**\.
*   But sometimes, it suddenly takes longer, when the array resizes itself\.

So what’s the _real_ cost of inserting into a dynamic array? Is it O\(1\)? Or is it O\(n\)?

The answer lies in a powerful idea called **Amortized Analysis**\.

## The Problem That Amortized Analysis Solves

In many algorithms, some operations are cheap and others are expensive but **the expensive ones don’t happen often**\.

If we only analyze the _worst case per operation_, it looks bad\. But if we look at the **average cost per operation over a sequence**, the picture changes\.

That’s what **Amortized Analysis** does:

> It gives a more realistic view of an algorithm’s performance by averaging the total cost of a series of operations\.

> #### Real\-World Analogy
> 
> Imagine you're a daily commuter\.
> 
> *   **Pay\-per\-ride:** Each trip costs you $2\.75\. The cost is predictable and always the same\. This is like a true O\(1\) operation\.
> *   **Monthly Pass:** At the start of the month, you pay a big, one\-time cost of $130\. After that, every single ride for the rest of the month is "free"\.
> 
> If someone asked you "How much does a ride cost?", how would you answer?
> 
> *   The **worst\-case cost** for a ride is over $130 \(the first ride of the month\)\.
> *   The **best\-case cost** is $0 \(every other ride\)\.

Neither answer tells the whole story\. The most useful answer is the average cost per ride over the whole month\. If you take 50 rides, the cost is $130 / 50 = $2\.60 per ride\. This is the **amortized cost**\.

**Amortized Analysis** isn't about probability or average inputs\. It's about finding the average cost of an operation over a **sequence** of operations, where occasional, expensive operations are "paid for" by many cheap ones\.

It's a guarantee: over a long sequence, the average performance will be X, even if a single operation is occasionally much worse\.

## Amortized vs Average vs Worst Case

Before diving deeper, let’s clarify the difference:

| Type | What It Measures | Depends On | Example |
|------|------------------|------------|---------|
| **Worst Case** | Maximum time for any single operation | The _most difficult_ input | Sorting a reverse-sorted array using Bubble Sort |
| **Average Case** | Expected time over _all inputs_ | _Probability distribution_ of inputs | Searching in a random array |
| **Amortized Case** | Average time _over a sequence_ of operations | _Behavior of algorithm_, not inputs | Resizing in dynamic array |

**Amortized analysis** doesn’t rely on input randomness\. It guarantees that even though some operations are costly, the _average cost per operation stays low_\.

## Example — Dynamic Array Resizing

Let’s take the example of inserting elements into a **dynamic array** \(like Java’s `ArrayList`\)\.

An ArrayList uses a regular, fixed\-size array internally\. When you create it, it might have a default capacity, say, 4\.

<div class="mb-4 flex justify-start"><div class="block text-left" style="width: 100%;"><div class="inline-flex flex-col gap-2 items-center"><div class="inline-flex flex-col items-center gap-2"><div class="flex flex-wrap gap-2"><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">0</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center dark:bg-transparent border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">-</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">1</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center dark:bg-transparent border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">-</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">2</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center dark:bg-transparent border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">-</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">3</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center dark:bg-transparent border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">-</div></div></div></div></div><div class="text-sm font-semibold text-muted-foreground text-center">(size=0, capacity=4)</div></div></div></div>

**add\(10\)**

<div class="mb-4 flex justify-start"><div class="block text-left" style="width: 100%;"><div class="inline-flex flex-col gap-2 items-center"><div class="inline-flex flex-col items-center gap-2"><div class="flex flex-wrap gap-2"><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">0</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center bg-red-600 hover:bg-red-500 border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">10</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">1</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center dark:bg-transparent border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">-</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">2</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center dark:bg-transparent border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">-</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">3</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center dark:bg-transparent border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">-</div></div></div></div></div><div class="text-sm font-semibold text-muted-foreground text-center">(size=1, capacity=4)</div></div></div></div>

**add\(20\)**

<div class="mb-4 flex justify-start"><div class="block text-left" style="width: 100%;"><div class="inline-flex flex-col gap-2 items-center"><div class="inline-flex flex-col items-center gap-2"><div class="flex flex-wrap gap-2"><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">0</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center bg-red-600 hover:bg-red-500 border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">10</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">1</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center bg-red-600 hover:bg-red-500 border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">20</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">2</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center dark:bg-transparent border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">-</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">3</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center dark:bg-transparent border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">-</div></div></div></div></div><div class="text-sm font-semibold text-muted-foreground text-center">(size=2, capacity=4)</div></div></div></div>

**add\(30\)**

<div class="mb-4 flex justify-start"><div class="block text-left" style="width: 100%;"><div class="inline-flex flex-col gap-2 items-center"><div class="inline-flex flex-col items-center gap-2"><div class="flex flex-wrap gap-2"><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">0</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center bg-red-600 hover:bg-red-500 border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">10</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">1</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center bg-red-600 hover:bg-red-500 border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">20</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">2</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center bg-red-600 hover:bg-red-500 border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">30</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">3</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center dark:bg-transparent border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">-</div></div></div></div></div><div class="text-sm font-semibold text-muted-foreground text-center">(size=3, capacity=4)</div></div></div></div>

**add\(40\)**

<div class="mb-4 flex justify-start"><div class="block text-left" style="width: 100%;"><div class="inline-flex flex-col gap-2 items-center"><div class="inline-flex flex-col items-center gap-2"><div class="flex flex-wrap gap-2"><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">0</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center bg-red-600 hover:bg-red-500 border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">10</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">1</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center bg-red-600 hover:bg-red-500 border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">20</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">2</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center bg-red-600 hover:bg-red-500 border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">30</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">3</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center bg-red-600 hover:bg-red-500 border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">40</div></div></div></div></div><div class="text-sm font-semibold text-muted-foreground text-center">(size=4, capacity=4)</div></div></div></div>

Now, the internal array is full\. What happens when we call add\(50\)?

#### The Expensive Operation:

1.  A new, larger array is allocated, typically double the size \(capacity = 8\)\.
2.  All the old elements \(10, 20, 30, 40\) are copied from the old array to the new one\.
3.  The new element \(50\) is added at the end\.
4.  The old array is discarded\.

<div class="mb-4 flex justify-start"><div class="block text-left" style="width: 100%;"><div class="inline-flex flex-col gap-2 items-center"><div class="inline-flex flex-col items-center gap-2"><div class="flex flex-wrap gap-2"><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">0</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center bg-[#00d084]/70 bg-red-600 hover:bg-red-500 border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200">10</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">1</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center bg-[#00d084]/70 bg-red-600 hover:bg-red-500 border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200">20</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">2</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center bg-[#00d084]/70 bg-red-600 hover:bg-red-500 border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200">30</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">3</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center bg-[#00d084]/70 bg-red-600 hover:bg-red-500 border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200">40</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">4</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center bg-[#00d084]/70 bg-red-600 hover:bg-red-500 border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200">50</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">5</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center dark:bg-transparent border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">-</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">6</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center dark:bg-transparent border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">-</div></div></div><div class="relative group transition-all duration-200"><div class="text-xs text-muted-foreground mb-1 text-center font-mono">7</div><div class="relative"><div class="px-4 py-2 rounded-lg border-2 font-mono text-base min-w-[60px] min-h-[36px] flex items-center justify-center text-center dark:bg-transparent border-black dark:border-[#00d084]/80 hover:border-black dark:hover:border-[#00d084] shadow-sm hover:shadow-md transition-all duration-200 bg-muted/30 border-dashed text-muted-foreground">-</div></div></div></div></div><div class="text-sm font-semibold text-muted-foreground text-center">(size=5, capacity=8)</div></div></div></div>

**Cost: 4 copies \+ 1 write = 5 operations\.**

This one operation was **O\(N\)**, where N was the current size of the list\. The next few adds, however, will be cheap again:

*   add\(60\): **Cost: 1 write\.**
*   add\(70\): **Cost: 1 write\.**
*   add\(80\): **Cost: 1 write\.**

Then we'll have another expensive O\(N\) resize\.

If we perform **n insertions**, how much total work is done?

Most insertions cost 1 unit \(O\(1\)\), but occasionally we pay extra when the array resizes\.

Let’s add them up:

```shell
Resize costs: 1 + 2 + 4 + 8 + ... + n/2 ≈ 2n
```

Total cost = `n` \(for simple inserts\) \+ `2n` \(for copies\) = **O\(3n\)** = **O\(n\)**

So, **n insertions cost O\(n\)** total, meaning the **average cost per insertion = O\(1\)**\.

**Amortized cost per operation = O\(1\)**

## Types of Amortized Analysis

There are three main ways to perform amortized analysis mathematically:

### \(a\) Aggregate Method

Compute the **total cost** of all operations and divide by `n`\.

**Example:**

For dynamic array insertions: Total cost = O\(n\) for n operations → amortized O\(1\) per operation\.

### \(b\) Accounting Method \(a\.k\.a\. Banker's Method\)

Assign **credits** \(or tokens\) to operations\.

*   Cheap operations “save” credits\.
*   Expensive operations “spend” saved credits\.

**Example:**

*   Charge each insertion a fixed 3 units\.

*   1 for the actual insert\.
*   2 saved for future resizing\.

*   When resizing occurs, the saved credits pay for the copying\.

Thus, the **average charge per operation** is constant → O\(1\)\.

### \(c\) Potential Method

We define a **potential function \(Φ\)** that represents “stored energy” in the system\.

When operations happen:

*   The actual cost may increase or decrease potential\.
*   We analyze the change in potential to determine amortized cost\.

**Formula:**

```shell
Amortized cost=Actual cost+(Φnew​−Φold​)
```

This method is more formal and used in advanced analysis \(e\.g\., Union\-Find\)\.

So far, we’ve focused on analyzing algorithms that perform **repeated operations \(**sometimes cheap, sometimes costly\) and we learned how **amortized analysis** helps us find the _true average cost_ over a long sequence\.

But what about **recursive algorithms**, where a problem breaks itself into smaller subproblems again and again like **Merge Sort**, **Binary Search**, or **Quick Sort**?

In those cases, the running time of the algorithm depends on the **time taken by its smaller instances**, forming a mathematical relationship between them\.

To analyze such recursive behavior, we need a new tool — the **Recurrence Relation**\.

In the next chapter, we’ll learn how to express an algorithm’s time complexity as a recurrence and solve it to uncover its Big\-O performance\.