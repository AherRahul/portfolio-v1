---
title: Introduction
description: Master Introduction in the Two Pointers module. Comprehensive guide
  and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

Watch Video Explanation

**Two pointers** is a technique where we use two index variables to traverse a data structure, typically an array or string\. The pointers move towards each other, away from each other, or in the same direction based on the problem's requirements\.

Using this approach, you can reduce the time complexity of many array and string related problems from O\(n²\) to O\(n\)\.

\.mermaid\-diagram\-container text, \.mermaid\-diagram\-container \.nodeLabel, \.mermaid\-diagram\-container \.edgeLabel, \.mermaid\-diagram\-container \.label, \.mermaid\-diagram\-container tspan \{ font\-weight: 600 \!important; \} \.mermaid\-diagram\-container \.flowchart\-link, \.mermaid\-diagram\-container \.edge\-pattern\-solid, \.mermaid\-diagram\-container \.messageLine0, \.mermaid\-diagram\-container \.messageLine1, \.mermaid\-diagram\-container path\.path \{ stroke\-width: 2px \!important; \} \.mermaid\-diagram\-container marker path \{ stroke\-width: 1px \!important; \} /\* Fix text cutoff in nodes \*/ \.mermaid\-diagram\-container svg \{ overflow: visible \!important; \} \.mermaid\-diagram\-container svg \* \{ overflow: visible \!important; \} \.mermaid\-diagram\-container foreignObject \{ overflow: visible \!important; \} \.mermaid\-diagram\-container foreignObject > \* \{ overflow: visible \!important; \} \.mermaid\-diagram\-container \.node, \.mermaid\-diagram\-container \.node \* \{ overflow: visible \!important; \} /\* Fix text centering in nodes \*/ \.mermaid\-diagram\-container foreignObject > div \{ display: flex \!important; justify\-content: center \!important; align\-items: center \!important; height: 100% \!important; \} /\* Fix text wrapping in subgraph/cluster labels \*/ \.mermaid\-diagram\-container \.cluster\-label, \.mermaid\-diagram\-container \.cluster\-label foreignObject, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > span, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > p, \.mermaid\-diagram\-container \.cluster\-label text, \.mermaid\-diagram\-container \.cluster\-label tspan \{ white\-space: nowrap \!important; overflow: visible \!important; \} /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ \.mermaid\-diagram\-container \.cluster\-label \{ z\-index: 10 \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject \{ transform: translateY\(\-8px\) \!important; overflow: visible \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject > div \{ display: flex \!important; justify\-content: center \!important; align\-items: center \!important; text\-align: center \!important; width: 100% \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > span, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > p \{ background\-color: var\(\-\-background, \#000\) \!important; padding: 2px 6px \!important; border\-radius: 3px \!important; font\-size: 16px \!important; font\-weight: 600 \!important; white\-space: nowrap \!important; \} /\* Sequence diagram note fix \- prevent text overflow \*/ \.mermaid\-diagram\-container \.note rect, \.mermaid\-diagram\-container rect\.note \{ rx: 5px \!important; ry: 5px \!important; \} \.mermaid\-diagram\-container \.note text, \.mermaid\-diagram\-container \.noteText \{ font\-size: 14px \!important; dominant\-baseline: central \!important; \} /\* State diagram specific styles \*/ \.mermaid\-state\-container svg \{ overflow: visible \!important; width: 100% \!important; height: auto \!important; max\-width: 100% \!important; \} \.mermaid\-state\-container \.statediagram\-state, \.mermaid\-state\-container \.stateGroup, \.mermaid\-state\-container \.state \{ overflow: visible \!important; \} \.mermaid\-state\-container text, \.mermaid\-state\-container \.nodeLabel, \.mermaid\-state\-container \.state\-text, \.mermaid\-state\-container tspan \{ white\-space: nowrap \!important; font\-size: 14px \!important; overflow: visible \!important; \} /\* Dark mode text colors for state diagrams \- only cluster labels, not state node text \*/ \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label text, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label tspan, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject span, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject p, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject div \{ fill: \#f0fdf4 \!important; color: \#f0fdf4 \!important; \} \.mermaid\-state\-container \.edgeLabel, \.mermaid\-state\-container \.edge\-label \{ white\-space: nowrap \!important; font\-size: 13px \!important; background\-color: transparent \!important; overflow: visible \!important; \} /\* Dark mode edge label colors \*/ \.dark \.mermaid\-state\-container \.edgeLabel, \.dark \.mermaid\-state\-container \.edgeLabel span, \.dark \.mermaid\-state\-container \.edge\-label \{ fill: \#fafafa \!important; color: \#fafafa \!important; \} \.mermaid\-state\-container \.transition, \.mermaid\-state\-container path\.transition \{ stroke\-width: 2px \!important; \} /\* Fix composite state title vertical positioning \*/ \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label text, \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label tspan \{ dominant\-baseline: middle \!important; alignment\-baseline: middle \!important; \}

\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688\{font\-family:inherit;font\-size:16px;fill:\#fafafa;\}@keyframes edge\-animation\-frame\{from\{stroke\-dashoffset:0;\}\}@keyframes dash\{to\{stroke\-dashoffset:0;\}\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.edge\-animation\-slow\{stroke\-dasharray:9,5\!important;stroke\-dashoffset:900;animation:dash 50s linear infinite;stroke\-linecap:round;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.edge\-animation\-fast\{stroke\-dasharray:9,5\!important;stroke\-dashoffset:900;animation:dash 20s linear infinite;stroke\-linecap:round;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.error\-icon\{fill:\#000000;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.error\-text\{fill:\#fafafa;stroke:\#fafafa;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.edge\-thickness\-normal\{stroke\-width:1px;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.edge\-thickness\-thick\{stroke\-width:3\.5px;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.edge\-pattern\-solid\{stroke\-dasharray:0;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.edge\-thickness\-invisible\{stroke\-width:0;fill:none;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.edge\-pattern\-dashed\{stroke\-dasharray:3;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.edge\-pattern\-dotted\{stroke\-dasharray:2;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.marker\{fill:\#22c55e;stroke:\#22c55e;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.marker\.cross\{stroke:\#22c55e;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 svg\{font\-family:inherit;font\-size:16px;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 p\{margin:0;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.label\{font\-family:inherit;color:\#f0fdf4;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.cluster\-label text\{fill:\#fafafa;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.cluster\-label span\{color:\#fafafa;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.cluster\-label span p\{background\-color:transparent;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.label text,\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 span\{fill:\#f0fdf4;color:\#f0fdf4;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.node rect,\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.node circle,\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.node ellipse,\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.node polygon,\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.node path\{fill:\#166534;stroke:\#22c55e;stroke\-width:1px;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.rough\-node \.label text,\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.node \.label text,\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.image\-shape \.label,\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.icon\-shape \.label\{text\-anchor:middle;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.node \.katex path\{fill:\#000;stroke:\#000;stroke\-width:1px;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.rough\-node \.label,\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.node \.label,\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.image\-shape \.label,\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.icon\-shape \.label\{text\-align:center;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.node\.clickable\{cursor:pointer;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.root \.anchor path\{fill:\#22c55e\!important;stroke\-width:0;stroke:\#22c55e;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.arrowheadPath\{fill:\#0b0b0b;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.edgePath \.path\{stroke:\#22c55e;stroke\-width:2\.0px;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.flowchart\-link\{stroke:\#22c55e;fill:none;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.edgeLabel\{background\-color:\#0a0a0a;text\-align:center;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.edgeLabel p\{background\-color:\#0a0a0a;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.edgeLabel rect\{opacity:0\.5;background\-color:\#0a0a0a;fill:\#0a0a0a;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.labelBkg\{background\-color:rgba\(10, 10, 10, 0\.5\);\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.cluster rect\{fill:\#1a1a1a;stroke:\#000000;stroke\-width:1px;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.cluster text\{fill:\#fafafa;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.cluster span\{color:\#fafafa;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 div\.mermaidTooltip\{position:absolute;text\-align:center;max\-width:200px;padding:2px;font\-family:inherit;font\-size:12px;background:\#000000;border:1px solid \#262626;border\-radius:2px;pointer\-events:none;z\-index:100;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.flowchartTitleText\{text\-anchor:middle;font\-size:18px;fill:\#fafafa;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 rect\.text\{fill:none;stroke\-width:0;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.icon\-shape,\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.image\-shape\{background\-color:\#0a0a0a;text\-align:center;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.icon\-shape p,\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.image\-shape p\{background\-color:\#0a0a0a;padding:2px;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.icon\-shape rect,\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.image\-shape rect\{opacity:0\.5;background\-color:\#0a0a0a;fill:\#0a0a0a;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.label\-icon\{display:inline\-block;height:1em;overflow:visible;vertical\-align:\-0\.125em;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 \.node \.label\-icon path\{fill:currentColor;stroke:revert;stroke\-width:revert;\}\#mermaid\-696c87fc6c76660e811ddb95\-1772124556688 :root\{\-\-mermaid\-font\-family:inherit;\}

Array: \[1, 2, 3, 4, 5, 6, 7\]

left

right

In this chapter, I’ll break down:

*   what the Two Pointers pattern is
*   types of two pointers
*   and when to use it

# What is a Pointer?

Let's first understand **what a pointer is**\.

A **pointer** is simply a variable that represents an **index or position** within a data structure, such as an array or linked list\.

pointer

The pointers can represent:

*   **Boundaries of a range** \(left and right ends\)
*   **Current position and a comparison position** \(for removing duplicates\)
*   **Two separate arrays** \(for merging or comparing\)
*   **Fast and slow traversal speeds** \(for cycle detection, covered separately\)

Using pointers at **different positions**, we can efficiently **compare elements and make decisions** without relying on **nested loops**, which would otherwise lead to **O\(n²\) time complexity**\.

# Variants of Two Pointers

The **Two Pointers** technique can be applied in different ways depending on the problem\.

Let’s explore the three most common strategies\.

## **1\.** Opposite Direction \(Converging Pointers\)

The most common variant\. One pointer starts at the beginning, the other at the end, and they move towards each other\.

start

end

The pointers adjust their positions based on comparisons, until a certain condition is met, or they cross each other\.

This strategy is ideal for problems where we need to compare elements from opposite ends of an array or string\.

### Template

```java
public void oppositeDirectionTemplate(int[] nums) {
   int left = 0;
   int right = nums.length - 1;

   while (left < right) {
       // Calculate or check current state
       int current = calculateSomething(nums, left, right);

       if (/* found answer */) {
           // Process and possibly return
           return;
       } else if (/* need to increase value */) {
           left++;
       } else {
           right--;
       }
   }
}
```

The key decision is knowing which pointer to move\. In sorted arrays:

*   Moving `left` right increases values \(if sorted ascending\)
*   Moving `right` left decreases values \(if sorted ascending\)

### **Example**

**Checking if a string is a palindrome**

A **palindrome** is a word, phrase, or sequence that reads the same forward and backward \(e\.g\., `"racecar"`, `"madam"`\)\.

To check if a string is a palindrome, we:

*   **Initialize two pointers:** one at the **beginning** and one at the **end**\.
*   **Compare characters** at both pointers:

*   If they match, move both pointers **inward**\.
*   If they don’t match, return `false`\.

*   **Repeat until the pointers meet**\.

## **2\.** Same Direction \(**Parallel Pointers\)**

In this approach, both pointers start at **the same end** \(usually the beginning\) and move **in the same direction** at different speeds or for different purposes\.

first

second

These pointers generally serve **two different but** complementary **roles**:

*   the **right pointer** is used to **explore** or **find new information**\.
*   and the left pointer is used to **track progress or maintain constraints**\.

### Template

```java
public int sameDirectionTemplate(int[] nums) {
   int left = 0;  // Write pointer or boundary of valid region
	int result = 0;

   for (int right = 0; right < nums.length; right++) {
       // Check if current element should be kept
       if (shouldKeep(nums[right])) {
			int current = calculateSomething(nums, left, right);
			updateResult();
           left++;
       }
   }

   // slow now represents the count of valid elements
   return result;
}
```

Here are the two popular variations of this approach:

*   **Sliding Window Technique**: In this approach, two pointers slide across an array or string while maintaining a dynamic range\. It’s commonly used to find subarrays or substrings that meet specific criteria, such as:

*   Finding the longest substring without repeating characters
*   or Finding the smallest subarray with a given sum

*   **Fast and Slow Pointers**: This involves two pointers moving at different speeds\. It’s commonly used to detect cycles in linked lists or find the middle node of a linked list\.

## **3\. Trigger\-Based Pointers**

In this approach, we move the first pointer independently until it finds an element that meets a certain condition\.

After this, we start traversing with the second pointer to find additional information related to what the first pointer found\.

This technique is particularly useful when we need to **process elements in stages** or maintain a **fixed distance** between two pointers\.

### Template

```java
public void triggerBasedTemplate(int[] nums) {
   int first = 0;
   int second = 0;
   boolean triggered = false;

   while (first < nums.length) {

       // 1) TRIGGER PHASE: advance first until a condition becomes true
       if (!triggered) {
           if (meetsCondition(nums[first])) {
               triggered = true;
               second = 0; // or second = someStartIndex, depending on the problem
           }
           first++;
           continue;
       }

       // 2) COUPLED PHASE: now advance second (or both) to extract info
       while (second < first) {
           processPair(nums, second, first - 1);
           second++;
       }

       // optional: reset trigger if the stage ends
       triggered = false;
   }
}
```

A good example of this approach is finding the Nth node from the end of a linked list\.

*   We move the first pointer n steps forward
*   Once the first pointer reaches the `N`th node, initialize the **second pointer** at the head\.
*   Move **both pointers** one step at a time until the **first pointer reaches the end**\.
*   At this point, the **second pointer** will be at the **Nth node from the end**\.

# When to use two pointers pattern?

A **Two\-Pointer algorithm** is generally applied to **linear data structures**, such as: array, strings or linked lists\.

A strong clue that a problem can be solved using the Two Pointers technique is if the **input data follows a predictable pattern** such as **sorted array or palindromic string**\.

It is the right tool when you see these patterns:

**1\. Sorted array with pair/triplet finding**

If the array is sorted \(or can be sorted\) and you need to find elements that satisfy some relationship, two pointers can often replace nested loops\.

**2\. In\-place array modification**

When you need to modify an array without using extra space, the read\-write pointer pattern is useful\.

**3\. Palindrome or symmetry checking**

Comparing elements from both ends naturally leads to two pointers converging\.

**4\. Merging or comparing sorted sequences**

When working with two sorted arrays, using a pointer for each is the natural approach\.

**5\. Subarray problems with monotonic conditions**

If expanding a window makes a condition "more true" \(or "more false"\) in a predictable way, two pointers can work\. This overlaps with sliding window, which is essentially two pointers with specific semantics\.

Scroll

Problem Type

Variant

Example

Find pair with target sum

Opposite direction

Two Sum II \(sorted array\)

Check palindrome

Opposite direction

Valid Palindrome

Remove duplicates

Same direction

Remove Duplicates from Sorted Array

Partition array

Same direction

Move Zeroes, Sort Colors

Merge sorted arrays

Two arrays

Merge Sorted Array

Maximum area

Opposite direction

Container With Most Water

### **When NOT to use two pointers:**

*   Array is not sorted and sorting would change the answer \(e\.g\., need original indices\)
*   No monotonic relationship between pointer positions and the condition
*   You need to find all pairs, not just check existence \(may still need O\(n^2\)\)
*   The problem requires looking at non\-contiguous elements in arbitrary combinations