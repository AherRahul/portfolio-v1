---
title: Introduction
description: Master Introduction in the Prefix Sum module. Comprehensive guide
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

Imagine you are given an array and asked to calculate the sum of elements between two indices\. Easy enough, you loop through and add them up\. But what if you need to answer thousands of such queries on the same array?

Suddenly, that simple loop becomes a bottleneck\.

This is where **prefix sum** comes in\. It is one of the most powerful preprocessing techniques in algorithm design, transforming range sum queries from O\(n\) to O\(1\)\.

# What is Prefix Sum?

A prefix sum \(also called cumulative sum or running total\) is a technique where we precompute the sum of all elements from the beginning of an array up to each index\.

This preprocessing allows us to answer range sum queries in constant time\.

Given an array `nums` of length `n`:

*   `prefix[0] = nums[0]`
*   `prefix[1] = nums[0] + nums[1]`
*   `prefix[2] = nums[0] + nums[1] + nums[2]`
*   \.\.\.
*   `prefix[i] = nums[0] + nums[1] + ... + nums[i]`

In other words, `prefix[i]` stores the sum of all elements from index 0 to index i\.

If the input array is:

0

2

1

4

2

6

3

8

4

10

The prefix sum array will look like this:

0

2

1

6

2

12

3

20

4

30

# The Key Insight: Range Sums in O\(1\)

Here is the magic\. Once we have the prefix sum array, we can find the sum of any range `[left, right]` using a simple formula:

`sum(left, right) = prefix[right] - prefix[left - 1]`

Why does this work? Think about it:

*   `prefix[right]` contains the sum from index 0 to right
*   `prefix[left - 1]` contains the sum from index 0 to left \- 1
*   Subtracting removes the elements we do not want, leaving exactly the sum from left to right

\.mermaid\-diagram\-container text, \.mermaid\-diagram\-container \.nodeLabel, \.mermaid\-diagram\-container \.edgeLabel, \.mermaid\-diagram\-container \.label, \.mermaid\-diagram\-container tspan \{ font\-weight: 600 \!important; \} \.mermaid\-diagram\-container \.flowchart\-link, \.mermaid\-diagram\-container \.edge\-pattern\-solid, \.mermaid\-diagram\-container \.messageLine0, \.mermaid\-diagram\-container \.messageLine1, \.mermaid\-diagram\-container path\.path \{ stroke\-width: 2px \!important; \} \.mermaid\-diagram\-container marker path \{ stroke\-width: 1px \!important; \} /\* Fix text cutoff in nodes \*/ \.mermaid\-diagram\-container svg \{ overflow: visible \!important; \} \.mermaid\-diagram\-container svg \* \{ overflow: visible \!important; \} \.mermaid\-diagram\-container foreignObject \{ overflow: visible \!important; \} \.mermaid\-diagram\-container foreignObject > \* \{ overflow: visible \!important; \} \.mermaid\-diagram\-container \.node, \.mermaid\-diagram\-container \.node \* \{ overflow: visible \!important; \} /\* Fix text centering in nodes \*/ \.mermaid\-diagram\-container foreignObject > div \{ display: flex \!important; justify\-content: center \!important; align\-items: center \!important; height: 100% \!important; \} /\* Fix text wrapping in subgraph/cluster labels \*/ \.mermaid\-diagram\-container \.cluster\-label, \.mermaid\-diagram\-container \.cluster\-label foreignObject, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > span, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > p, \.mermaid\-diagram\-container \.cluster\-label text, \.mermaid\-diagram\-container \.cluster\-label tspan \{ white\-space: nowrap \!important; overflow: visible \!important; \} /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ \.mermaid\-diagram\-container \.cluster\-label \{ z\-index: 10 \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject \{ transform: translateY\(\-8px\) \!important; overflow: visible \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject > div \{ display: flex \!important; justify\-content: center \!important; align\-items: center \!important; text\-align: center \!important; width: 100% \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > span, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > p \{ background\-color: var\(\-\-background, \#000\) \!important; padding: 2px 6px \!important; border\-radius: 3px \!important; font\-size: 16px \!important; font\-weight: 600 \!important; white\-space: nowrap \!important; \} /\* Sequence diagram note fix \- prevent text overflow \*/ \.mermaid\-diagram\-container \.note rect, \.mermaid\-diagram\-container rect\.note \{ rx: 5px \!important; ry: 5px \!important; \} \.mermaid\-diagram\-container \.note text, \.mermaid\-diagram\-container \.noteText \{ font\-size: 14px \!important; dominant\-baseline: central \!important; \} /\* State diagram specific styles \*/ \.mermaid\-state\-container svg \{ overflow: visible \!important; width: 100% \!important; height: auto \!important; max\-width: 100% \!important; \} \.mermaid\-state\-container \.statediagram\-state, \.mermaid\-state\-container \.stateGroup, \.mermaid\-state\-container \.state \{ overflow: visible \!important; \} \.mermaid\-state\-container text, \.mermaid\-state\-container \.nodeLabel, \.mermaid\-state\-container \.state\-text, \.mermaid\-state\-container tspan \{ white\-space: nowrap \!important; font\-size: 14px \!important; overflow: visible \!important; \} /\* Dark mode text colors for state diagrams \- only cluster labels, not state node text \*/ \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label text, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label tspan, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject span, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject p, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject div \{ fill: \#f0fdf4 \!important; color: \#f0fdf4 \!important; \} \.mermaid\-state\-container \.edgeLabel, \.mermaid\-state\-container \.edge\-label \{ white\-space: nowrap \!important; font\-size: 13px \!important; background\-color: transparent \!important; overflow: visible \!important; \} /\* Dark mode edge label colors \*/ \.dark \.mermaid\-state\-container \.edgeLabel, \.dark \.mermaid\-state\-container \.edgeLabel span, \.dark \.mermaid\-state\-container \.edge\-label \{ fill: \#fafafa \!important; color: \#fafafa \!important; \} \.mermaid\-state\-container \.transition, \.mermaid\-state\-container path\.transition \{ stroke\-width: 2px \!important; \} /\* Fix composite state title vertical positioning \*/ \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label text, \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label tspan \{ dominant\-baseline: middle \!important; alignment\-baseline: middle \!important; \}

\#mermaid\-696be4c8d57f2553e819b064\-1772124171552\{font\-family:inherit;font\-size:16px;fill:\#fafafa;\}@keyframes edge\-animation\-frame\{from\{stroke\-dashoffset:0;\}\}@keyframes dash\{to\{stroke\-dashoffset:0;\}\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.edge\-animation\-slow\{stroke\-dasharray:9,5\!important;stroke\-dashoffset:900;animation:dash 50s linear infinite;stroke\-linecap:round;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.edge\-animation\-fast\{stroke\-dasharray:9,5\!important;stroke\-dashoffset:900;animation:dash 20s linear infinite;stroke\-linecap:round;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.error\-icon\{fill:\#000000;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.error\-text\{fill:\#fafafa;stroke:\#fafafa;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.edge\-thickness\-normal\{stroke\-width:1px;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.edge\-thickness\-thick\{stroke\-width:3\.5px;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.edge\-pattern\-solid\{stroke\-dasharray:0;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.edge\-thickness\-invisible\{stroke\-width:0;fill:none;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.edge\-pattern\-dashed\{stroke\-dasharray:3;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.edge\-pattern\-dotted\{stroke\-dasharray:2;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.marker\{fill:\#22c55e;stroke:\#22c55e;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.marker\.cross\{stroke:\#22c55e;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 svg\{font\-family:inherit;font\-size:16px;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 p\{margin:0;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.label\{font\-family:inherit;color:\#f0fdf4;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.cluster\-label text\{fill:\#fafafa;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.cluster\-label span\{color:\#fafafa;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.cluster\-label span p\{background\-color:transparent;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.label text,\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 span\{fill:\#f0fdf4;color:\#f0fdf4;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.node rect,\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.node circle,\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.node ellipse,\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.node polygon,\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.node path\{fill:\#166534;stroke:\#22c55e;stroke\-width:1px;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.rough\-node \.label text,\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.node \.label text,\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.image\-shape \.label,\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.icon\-shape \.label\{text\-anchor:middle;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.node \.katex path\{fill:\#000;stroke:\#000;stroke\-width:1px;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.rough\-node \.label,\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.node \.label,\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.image\-shape \.label,\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.icon\-shape \.label\{text\-align:center;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.node\.clickable\{cursor:pointer;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.root \.anchor path\{fill:\#22c55e\!important;stroke\-width:0;stroke:\#22c55e;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.arrowheadPath\{fill:\#0b0b0b;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.edgePath \.path\{stroke:\#22c55e;stroke\-width:2\.0px;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.flowchart\-link\{stroke:\#22c55e;fill:none;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.edgeLabel\{background\-color:\#0a0a0a;text\-align:center;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.edgeLabel p\{background\-color:\#0a0a0a;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.edgeLabel rect\{opacity:0\.5;background\-color:\#0a0a0a;fill:\#0a0a0a;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.labelBkg\{background\-color:rgba\(10, 10, 10, 0\.5\);\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.cluster rect\{fill:\#1a1a1a;stroke:\#000000;stroke\-width:1px;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.cluster text\{fill:\#fafafa;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.cluster span\{color:\#fafafa;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 div\.mermaidTooltip\{position:absolute;text\-align:center;max\-width:200px;padding:2px;font\-family:inherit;font\-size:12px;background:\#000000;border:1px solid \#262626;border\-radius:2px;pointer\-events:none;z\-index:100;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.flowchartTitleText\{text\-anchor:middle;font\-size:18px;fill:\#fafafa;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 rect\.text\{fill:none;stroke\-width:0;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.icon\-shape,\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.image\-shape\{background\-color:\#0a0a0a;text\-align:center;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.icon\-shape p,\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.image\-shape p\{background\-color:\#0a0a0a;padding:2px;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.icon\-shape rect,\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.image\-shape rect\{opacity:0\.5;background\-color:\#0a0a0a;fill:\#0a0a0a;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.label\-icon\{display:inline\-block;height:1em;overflow:visible;vertical\-align:\-0\.125em;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 \.node \.label\-icon path\{fill:currentColor;stroke:revert;stroke\-width:revert;\}\#mermaid\-696be4c8d57f2553e819b064\-1772124171552 :root\{\-\-mermaid\-font\-family:inherit;\}

Finding sum\(2, 4\)

prefix\[4\] = 15  
\(sum of indices 0\-4\)

15 \- 6 = 9  
\(sum of indices 2\-4\)

prefix\[1\] = 6  
\(sum of indices 0\-1\)

For our example array \[2, 4, 1, 3, 5\]:

*   sum\(2, 4\) = prefix\[4\] \- prefix\[1\] = 15 \- 6 = 9
*   Let us verify: nums\[2\] \+ nums\[3\] \+ nums\[4\] = 1 \+ 3 \+ 5 = 9 ✓

**Edge case**: When left = 0, there is no prefix\[left \- 1\]\. In this case, sum\(0, right\) = prefix\[right\]\.

# When to Use Prefix Sum

Prefix sum is the right tool when you see these patterns:

**1\. Multiple range sum queries on a static array**

If the array does not change and you need to answer many range sum queries, preprocessing with prefix sum is almost always the right approach\.

**2\. Counting subarrays with a specific sum**

Problems like "find subarrays that sum to k" become tractable with prefix sums combined with a hash map\.

**3\. Finding equilibrium points or balance conditions**

When you need to compare sums of left and right portions of an array\.

**4\. 2D grid problems involving rectangular sums**

Prefix sums extend naturally to 2D for calculating sums of any rectangular region\.

Problem Type

Examples

Range sum queries

Range Sum Query \- Immutable, Range Sum Query 2D

Subarray sum equals target

Subarray Sum Equals K, Continuous Subarray Sum

Subarray divisibility

Subarray Sums Divisible by K

Product\-based queries

Product of Array Except Self \(uses prefix products\)

Equilibrium problems

Find Pivot Index, Partition Array Into Three Parts

Grid problems

Matrix Block Sum, Maximal Square

# The Prefix Sum Template

Every prefix sum solution follows a similar structure\. Let us establish a template\.

### Building the Prefix Sum Array

Java

```java
public int[] buildPrefixSum(int[] nums) {
   int n = nums.length;
   int[] prefix = new int[n];

   prefix[0] = nums[0];
   for (int i = 1; i < n; i++) {
       prefix[i] = prefix[i - 1] + nums[i];
   }

   return prefix;
}
```

### Querying a Range Sum

Java

```java
public int rangeSum(int[] prefix, int left, int right) {
   if (left == 0) {
       return prefix[right];
   }
   return prefix[right] - prefix[left - 1];
}
```

### Alternative: Using prefix\[0\] = 0 Convention

Many implementations use a prefix array of size n \+ 1, where prefix\[0\] = 0\. This eliminates the edge case for left = 0:

Java

```java
public int[] buildPrefixSum(int[] nums) {
   int n = nums.length;
   int[] prefix = new int[n + 1];

   prefix[0] = 0;  // Sum of zero elements
   for (int i = 0; i < n; i++) {
       prefix[i + 1] = prefix[i] + nums[i];
   }

   return prefix;
}

public int rangeSum(int[] prefix, int left, int right) {
   // No edge case needed!
   return prefix[right + 1] - prefix[left];
}
```

In this convention:

*   `prefix[i]` represents the sum of the first i elements \(indices 0 to i\-1\)
*   Range sum from left to right is `prefix[right + 1] - prefix[left]`

Both conventions are valid\. Choose whichever feels more natural, but be consistent\.

Note

Sometimes, you don't even need a new array\. You can modify the original array itself and use it as a prefix sum array if memory is a constraint\.

# Prefix Sum \+ HashMap: A Powerful Combination

Many problems combine prefix sums with a hash map to achieve O\(n\) solutions for finding subarrays with specific properties\.

The key insight is: if `prefix[j] - prefix[i] = k`, then the subarray from index i\+1 to j has sum k\.

Rearranging: `prefix[i] = prefix[j] - k`

So as we compute prefix sums, we can use a hash map to look up whether we have seen a prefix sum that would complete a valid subarray\.

\.mermaid\-diagram\-container text, \.mermaid\-diagram\-container \.nodeLabel, \.mermaid\-diagram\-container \.edgeLabel, \.mermaid\-diagram\-container \.label, \.mermaid\-diagram\-container tspan \{ font\-weight: 600 \!important; \} \.mermaid\-diagram\-container \.flowchart\-link, \.mermaid\-diagram\-container \.edge\-pattern\-solid, \.mermaid\-diagram\-container \.messageLine0, \.mermaid\-diagram\-container \.messageLine1, \.mermaid\-diagram\-container path\.path \{ stroke\-width: 2px \!important; \} \.mermaid\-diagram\-container marker path \{ stroke\-width: 1px \!important; \} /\* Fix text cutoff in nodes \*/ \.mermaid\-diagram\-container svg \{ overflow: visible \!important; \} \.mermaid\-diagram\-container svg \* \{ overflow: visible \!important; \} \.mermaid\-diagram\-container foreignObject \{ overflow: visible \!important; \} \.mermaid\-diagram\-container foreignObject > \* \{ overflow: visible \!important; \} \.mermaid\-diagram\-container \.node, \.mermaid\-diagram\-container \.node \* \{ overflow: visible \!important; \} /\* Fix text centering in nodes \*/ \.mermaid\-diagram\-container foreignObject > div \{ display: flex \!important; justify\-content: center \!important; align\-items: center \!important; height: 100% \!important; \} /\* Fix text wrapping in subgraph/cluster labels \*/ \.mermaid\-diagram\-container \.cluster\-label, \.mermaid\-diagram\-container \.cluster\-label foreignObject, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > span, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > p, \.mermaid\-diagram\-container \.cluster\-label text, \.mermaid\-diagram\-container \.cluster\-label tspan \{ white\-space: nowrap \!important; overflow: visible \!important; \} /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ \.mermaid\-diagram\-container \.cluster\-label \{ z\-index: 10 \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject \{ transform: translateY\(\-8px\) \!important; overflow: visible \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject > div \{ display: flex \!important; justify\-content: center \!important; align\-items: center \!important; text\-align: center \!important; width: 100% \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > span, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > p \{ background\-color: var\(\-\-background, \#000\) \!important; padding: 2px 6px \!important; border\-radius: 3px \!important; font\-size: 16px \!important; font\-weight: 600 \!important; white\-space: nowrap \!important; \} /\* Sequence diagram note fix \- prevent text overflow \*/ \.mermaid\-diagram\-container \.note rect, \.mermaid\-diagram\-container rect\.note \{ rx: 5px \!important; ry: 5px \!important; \} \.mermaid\-diagram\-container \.note text, \.mermaid\-diagram\-container \.noteText \{ font\-size: 14px \!important; dominant\-baseline: central \!important; \} /\* State diagram specific styles \*/ \.mermaid\-state\-container svg \{ overflow: visible \!important; width: 100% \!important; height: auto \!important; max\-width: 100% \!important; \} \.mermaid\-state\-container \.statediagram\-state, \.mermaid\-state\-container \.stateGroup, \.mermaid\-state\-container \.state \{ overflow: visible \!important; \} \.mermaid\-state\-container text, \.mermaid\-state\-container \.nodeLabel, \.mermaid\-state\-container \.state\-text, \.mermaid\-state\-container tspan \{ white\-space: nowrap \!important; font\-size: 14px \!important; overflow: visible \!important; \} /\* Dark mode text colors for state diagrams \- only cluster labels, not state node text \*/ \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label text, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label tspan, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject span, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject p, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject div \{ fill: \#f0fdf4 \!important; color: \#f0fdf4 \!important; \} \.mermaid\-state\-container \.edgeLabel, \.mermaid\-state\-container \.edge\-label \{ white\-space: nowrap \!important; font\-size: 13px \!important; background\-color: transparent \!important; overflow: visible \!important; \} /\* Dark mode edge label colors \*/ \.dark \.mermaid\-state\-container \.edgeLabel, \.dark \.mermaid\-state\-container \.edgeLabel span, \.dark \.mermaid\-state\-container \.edge\-label \{ fill: \#fafafa \!important; color: \#fafafa \!important; \} \.mermaid\-state\-container \.transition, \.mermaid\-state\-container path\.transition \{ stroke\-width: 2px \!important; \} /\* Fix composite state title vertical positioning \*/ \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label text, \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label tspan \{ dominant\-baseline: middle \!important; alignment\-baseline: middle \!important; \}

\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588\{font\-family:inherit;font\-size:16px;fill:\#fafafa;\}@keyframes edge\-animation\-frame\{from\{stroke\-dashoffset:0;\}\}@keyframes dash\{to\{stroke\-dashoffset:0;\}\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.edge\-animation\-slow\{stroke\-dasharray:9,5\!important;stroke\-dashoffset:900;animation:dash 50s linear infinite;stroke\-linecap:round;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.edge\-animation\-fast\{stroke\-dasharray:9,5\!important;stroke\-dashoffset:900;animation:dash 20s linear infinite;stroke\-linecap:round;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.error\-icon\{fill:\#000000;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.error\-text\{fill:\#fafafa;stroke:\#fafafa;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.edge\-thickness\-normal\{stroke\-width:1px;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.edge\-thickness\-thick\{stroke\-width:3\.5px;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.edge\-pattern\-solid\{stroke\-dasharray:0;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.edge\-thickness\-invisible\{stroke\-width:0;fill:none;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.edge\-pattern\-dashed\{stroke\-dasharray:3;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.edge\-pattern\-dotted\{stroke\-dasharray:2;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.marker\{fill:\#22c55e;stroke:\#22c55e;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.marker\.cross\{stroke:\#22c55e;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 svg\{font\-family:inherit;font\-size:16px;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 p\{margin:0;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.label\{font\-family:inherit;color:\#f0fdf4;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.cluster\-label text\{fill:\#fafafa;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.cluster\-label span\{color:\#fafafa;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.cluster\-label span p\{background\-color:transparent;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.label text,\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 span\{fill:\#f0fdf4;color:\#f0fdf4;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.node rect,\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.node circle,\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.node ellipse,\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.node polygon,\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.node path\{fill:\#166534;stroke:\#22c55e;stroke\-width:1px;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.rough\-node \.label text,\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.node \.label text,\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.image\-shape \.label,\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.icon\-shape \.label\{text\-anchor:middle;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.node \.katex path\{fill:\#000;stroke:\#000;stroke\-width:1px;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.rough\-node \.label,\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.node \.label,\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.image\-shape \.label,\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.icon\-shape \.label\{text\-align:center;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.node\.clickable\{cursor:pointer;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.root \.anchor path\{fill:\#22c55e\!important;stroke\-width:0;stroke:\#22c55e;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.arrowheadPath\{fill:\#0b0b0b;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.edgePath \.path\{stroke:\#22c55e;stroke\-width:2\.0px;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.flowchart\-link\{stroke:\#22c55e;fill:none;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.edgeLabel\{background\-color:\#0a0a0a;text\-align:center;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.edgeLabel p\{background\-color:\#0a0a0a;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.edgeLabel rect\{opacity:0\.5;background\-color:\#0a0a0a;fill:\#0a0a0a;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.labelBkg\{background\-color:rgba\(10, 10, 10, 0\.5\);\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.cluster rect\{fill:\#1a1a1a;stroke:\#000000;stroke\-width:1px;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.cluster text\{fill:\#fafafa;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.cluster span\{color:\#fafafa;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 div\.mermaidTooltip\{position:absolute;text\-align:center;max\-width:200px;padding:2px;font\-family:inherit;font\-size:12px;background:\#000000;border:1px solid \#262626;border\-radius:2px;pointer\-events:none;z\-index:100;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.flowchartTitleText\{text\-anchor:middle;font\-size:18px;fill:\#fafafa;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 rect\.text\{fill:none;stroke\-width:0;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.icon\-shape,\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.image\-shape\{background\-color:\#0a0a0a;text\-align:center;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.icon\-shape p,\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.image\-shape p\{background\-color:\#0a0a0a;padding:2px;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.icon\-shape rect,\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.image\-shape rect\{opacity:0\.5;background\-color:\#0a0a0a;fill:\#0a0a0a;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.label\-icon\{display:inline\-block;height:1em;overflow:visible;vertical\-align:\-0\.125em;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 \.node \.label\-icon path\{fill:currentColor;stroke:revert;stroke\-width:revert;\}\#mermaid\-696be81bcd56b16be5134bbf\-1772124171588 :root\{\-\-mermaid\-font\-family:inherit;\}

Yes

No

Compute prefix\[j\]

Calculate target = prefix\[j\] \- k

Is target in HashMap?

Found subarray\!  
Count \+= frequency of target

No matching subarray ending at j

Add prefix\[j\] to HashMap

This pattern appears in:

*   Subarray Sum Equals K
*   Contiguous Array \(equal 0s and 1s\)
*   Subarray Sums Divisible by K

We will explore these in detail in the following chapters\.

# Extending to 2D: Matrix Prefix Sums

Prefix sums extend naturally to 2D grids\. For a matrix, we precompute sums of all rectangles from \(0,0\) to \(i,j\)\.

Java

```java
public int[][] build2DPrefixSum(int[][] matrix) {
   int m = matrix.length, n = matrix[0].length;
   int[][] prefix = new int[m + 1][n + 1];

   for (int i = 1; i <= m; i++) {
       for (int j = 1; j <= n; j++) {
           prefix[i][j] = matrix[i-1][j-1]
                        + prefix[i-1][j]
                        + prefix[i][j-1]
                        - prefix[i-1][j-1];  // Subtract overlap
       }
   }

   return prefix;
}
```

To find the sum of any rectangle from \(r1, c1\) to \(r2, c2\):

Java

```java
public int regionSum(int[][] prefix, int r1, int c1, int r2, int c2) {
   return prefix[r2+1][c2+1]
        - prefix[r1][c2+1]
        - prefix[r2+1][c1]
        + prefix[r1][c1];  // Add back the doubly-subtracted corner
}
```

This achieves O\(mn\) preprocessing and O\(1\) per query, the same trade\-off as 1D\.