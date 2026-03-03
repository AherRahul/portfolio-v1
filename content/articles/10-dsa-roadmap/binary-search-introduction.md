---
title: Introduction
description: Master Introduction in the Binary Search module. Comprehensive
  guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

Imagine you are looking for a word in a physical dictionary\. You would not start from page one and flip through every page until you find it\. Instead, you would open the dictionary somewhere in the middle, see if your word comes before or after that page, and then repeat the process in the relevant half\. Within seconds, you narrow down thousands of pages to exactly the one you need\.

This simple idea, repeatedly halving the search space, is the essence of binary search\. It is one of the most powerful and frequently used techniques in computer science, appearing in everything from database indexing to machine learning algorithms\.

What makes binary search tricky is not the basic concept\. The tricky part is recognizing when to use it and handling the edge cases correctly\. Off\-by\-one errors haunt even experienced developers\. Master the templates in this chapter, and you will have a reliable framework for solving any binary search problem\.

# What Is Binary Search?

Binary search is a search algorithm that finds the position of a target value within a sorted collection\. Instead of checking each element one by one, it compares the target with the middle element and eliminates half of the remaining elements with each comparison\.

The key requirement is that the search space must have a monotonic property\. In the simplest case, this means the array is sorted\. But more generally, it means there is some condition that is false for all elements on one side of a boundary and true for all elements on the other side\.

\.mermaid\-diagram\-container text, \.mermaid\-diagram\-container \.nodeLabel, \.mermaid\-diagram\-container \.edgeLabel, \.mermaid\-diagram\-container \.label, \.mermaid\-diagram\-container tspan \{ font\-weight: 600 \!important; \} \.mermaid\-diagram\-container \.flowchart\-link, \.mermaid\-diagram\-container \.edge\-pattern\-solid, \.mermaid\-diagram\-container \.messageLine0, \.mermaid\-diagram\-container \.messageLine1, \.mermaid\-diagram\-container path\.path \{ stroke\-width: 2px \!important; \} \.mermaid\-diagram\-container marker path \{ stroke\-width: 1px \!important; \} /\* Fix text cutoff in nodes \*/ \.mermaid\-diagram\-container svg \{ overflow: visible \!important; \} \.mermaid\-diagram\-container svg \* \{ overflow: visible \!important; \} \.mermaid\-diagram\-container foreignObject \{ overflow: visible \!important; \} \.mermaid\-diagram\-container foreignObject > \* \{ overflow: visible \!important; \} \.mermaid\-diagram\-container \.node, \.mermaid\-diagram\-container \.node \* \{ overflow: visible \!important; \} /\* Fix text centering in nodes \*/ \.mermaid\-diagram\-container foreignObject > div \{ display: flex \!important; justify\-content: center \!important; align\-items: center \!important; height: 100% \!important; \} /\* Fix text wrapping in subgraph/cluster labels \*/ \.mermaid\-diagram\-container \.cluster\-label, \.mermaid\-diagram\-container \.cluster\-label foreignObject, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > span, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > p, \.mermaid\-diagram\-container \.cluster\-label text, \.mermaid\-diagram\-container \.cluster\-label tspan \{ white\-space: nowrap \!important; overflow: visible \!important; \} /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ \.mermaid\-diagram\-container \.cluster\-label \{ z\-index: 10 \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject \{ transform: translateY\(\-8px\) \!important; overflow: visible \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject > div \{ display: flex \!important; justify\-content: center \!important; align\-items: center \!important; text\-align: center \!important; width: 100% \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > span, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > p \{ background\-color: var\(\-\-background, \#000\) \!important; padding: 2px 6px \!important; border\-radius: 3px \!important; font\-size: 16px \!important; font\-weight: 600 \!important; white\-space: nowrap \!important; \} /\* Sequence diagram note fix \- prevent text overflow \*/ \.mermaid\-diagram\-container \.note rect, \.mermaid\-diagram\-container rect\.note \{ rx: 5px \!important; ry: 5px \!important; \} \.mermaid\-diagram\-container \.note text, \.mermaid\-diagram\-container \.noteText \{ font\-size: 14px \!important; dominant\-baseline: central \!important; \} /\* State diagram specific styles \*/ \.mermaid\-state\-container svg \{ overflow: visible \!important; width: 100% \!important; height: auto \!important; max\-width: 100% \!important; \} \.mermaid\-state\-container \.statediagram\-state, \.mermaid\-state\-container \.stateGroup, \.mermaid\-state\-container \.state \{ overflow: visible \!important; \} \.mermaid\-state\-container text, \.mermaid\-state\-container \.nodeLabel, \.mermaid\-state\-container \.state\-text, \.mermaid\-state\-container tspan \{ white\-space: nowrap \!important; font\-size: 14px \!important; overflow: visible \!important; \} /\* Dark mode text colors for state diagrams \- only cluster labels, not state node text \*/ \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label text, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label tspan, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject span, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject p, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject div \{ fill: \#f0fdf4 \!important; color: \#f0fdf4 \!important; \} \.mermaid\-state\-container \.edgeLabel, \.mermaid\-state\-container \.edge\-label \{ white\-space: nowrap \!important; font\-size: 13px \!important; background\-color: transparent \!important; overflow: visible \!important; \} /\* Dark mode edge label colors \*/ \.dark \.mermaid\-state\-container \.edgeLabel, \.dark \.mermaid\-state\-container \.edgeLabel span, \.dark \.mermaid\-state\-container \.edge\-label \{ fill: \#fafafa \!important; color: \#fafafa \!important; \} \.mermaid\-state\-container \.transition, \.mermaid\-state\-container path\.transition \{ stroke\-width: 2px \!important; \} /\* Fix composite state title vertical positioning \*/ \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label text, \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label tspan \{ dominant\-baseline: middle \!important; alignment\-baseline: middle \!important; \}

\#mermaid\-6mn3c4dnqd\-1772123225828\{font\-family:inherit;font\-size:16px;fill:\#fafafa;\}@keyframes edge\-animation\-frame\{from\{stroke\-dashoffset:0;\}\}@keyframes dash\{to\{stroke\-dashoffset:0;\}\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.edge\-animation\-slow\{stroke\-dasharray:9,5\!important;stroke\-dashoffset:900;animation:dash 50s linear infinite;stroke\-linecap:round;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.edge\-animation\-fast\{stroke\-dasharray:9,5\!important;stroke\-dashoffset:900;animation:dash 20s linear infinite;stroke\-linecap:round;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.error\-icon\{fill:\#000000;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.error\-text\{fill:\#fafafa;stroke:\#fafafa;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.edge\-thickness\-normal\{stroke\-width:1px;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.edge\-thickness\-thick\{stroke\-width:3\.5px;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.edge\-pattern\-solid\{stroke\-dasharray:0;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.edge\-thickness\-invisible\{stroke\-width:0;fill:none;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.edge\-pattern\-dashed\{stroke\-dasharray:3;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.edge\-pattern\-dotted\{stroke\-dasharray:2;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.marker\{fill:\#22c55e;stroke:\#22c55e;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.marker\.cross\{stroke:\#22c55e;\}\#mermaid\-6mn3c4dnqd\-1772123225828 svg\{font\-family:inherit;font\-size:16px;\}\#mermaid\-6mn3c4dnqd\-1772123225828 p\{margin:0;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.label\{font\-family:inherit;color:\#f0fdf4;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.cluster\-label text\{fill:\#fafafa;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.cluster\-label span\{color:\#fafafa;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.cluster\-label span p\{background\-color:transparent;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.label text,\#mermaid\-6mn3c4dnqd\-1772123225828 span\{fill:\#f0fdf4;color:\#f0fdf4;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.node rect,\#mermaid\-6mn3c4dnqd\-1772123225828 \.node circle,\#mermaid\-6mn3c4dnqd\-1772123225828 \.node ellipse,\#mermaid\-6mn3c4dnqd\-1772123225828 \.node polygon,\#mermaid\-6mn3c4dnqd\-1772123225828 \.node path\{fill:\#166534;stroke:\#22c55e;stroke\-width:1px;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.rough\-node \.label text,\#mermaid\-6mn3c4dnqd\-1772123225828 \.node \.label text,\#mermaid\-6mn3c4dnqd\-1772123225828 \.image\-shape \.label,\#mermaid\-6mn3c4dnqd\-1772123225828 \.icon\-shape \.label\{text\-anchor:middle;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.node \.katex path\{fill:\#000;stroke:\#000;stroke\-width:1px;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.rough\-node \.label,\#mermaid\-6mn3c4dnqd\-1772123225828 \.node \.label,\#mermaid\-6mn3c4dnqd\-1772123225828 \.image\-shape \.label,\#mermaid\-6mn3c4dnqd\-1772123225828 \.icon\-shape \.label\{text\-align:center;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.node\.clickable\{cursor:pointer;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.root \.anchor path\{fill:\#22c55e\!important;stroke\-width:0;stroke:\#22c55e;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.arrowheadPath\{fill:\#0b0b0b;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.edgePath \.path\{stroke:\#22c55e;stroke\-width:2\.0px;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.flowchart\-link\{stroke:\#22c55e;fill:none;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.edgeLabel\{background\-color:\#0a0a0a;text\-align:center;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.edgeLabel p\{background\-color:\#0a0a0a;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.edgeLabel rect\{opacity:0\.5;background\-color:\#0a0a0a;fill:\#0a0a0a;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.labelBkg\{background\-color:rgba\(10, 10, 10, 0\.5\);\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.cluster rect\{fill:\#1a1a1a;stroke:\#000000;stroke\-width:1px;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.cluster text\{fill:\#fafafa;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.cluster span\{color:\#fafafa;\}\#mermaid\-6mn3c4dnqd\-1772123225828 div\.mermaidTooltip\{position:absolute;text\-align:center;max\-width:200px;padding:2px;font\-family:inherit;font\-size:12px;background:\#000000;border:1px solid \#262626;border\-radius:2px;pointer\-events:none;z\-index:100;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.flowchartTitleText\{text\-anchor:middle;font\-size:18px;fill:\#fafafa;\}\#mermaid\-6mn3c4dnqd\-1772123225828 rect\.text\{fill:none;stroke\-width:0;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.icon\-shape,\#mermaid\-6mn3c4dnqd\-1772123225828 \.image\-shape\{background\-color:\#0a0a0a;text\-align:center;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.icon\-shape p,\#mermaid\-6mn3c4dnqd\-1772123225828 \.image\-shape p\{background\-color:\#0a0a0a;padding:2px;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.icon\-shape rect,\#mermaid\-6mn3c4dnqd\-1772123225828 \.image\-shape rect\{opacity:0\.5;background\-color:\#0a0a0a;fill:\#0a0a0a;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.label\-icon\{display:inline\-block;height:1em;overflow:visible;vertical\-align:\-0\.125em;\}\#mermaid\-6mn3c4dnqd\-1772123225828 \.node \.label\-icon path\{fill:currentColor;stroke:revert;stroke\-width:revert;\}\#mermaid\-6mn3c4dnqd\-1772123225828 :root\{\-\-mermaid\-font\-family:inherit;\}

Sorted Array

11

13

Target: 9

In this diagram, we are searching for 9\. We check the middle element \(7\), find that 9 is greater, so we eliminate the left half \(red\) and continue searching in the right half \(blue\)\. The target \(green\) is found in the next iteration\.

### Why O\(log n\)?

With each comparison, binary search eliminates half the remaining elements\. If you start with n elements:

*   After 1 comparison: n/2 elements remain
*   After 2 comparisons: n/4 elements remain
*   After k comparisons: n/2^k elements remain

We stop when only 1 element remains: n/2^k = 1, which gives k = log₂\(n\)\.

For an array of 1 billion elements, binary search needs at most 30 comparisons\. Linear search might need 1 billion\.

# When to Use Binary Search

Binary search is the right tool when your problem has these characteristics:

**1\. The search space is sorted or has a monotonic property**

The classic case is a sorted array\. But the search space could also be a range of possible answers where you can determine if an answer is "too small" or "too big\."

**2\. You can eliminate half the search space with each check**

Given any point in the search space, you must be able to determine which half contains the answer\. This is the key insight that makes binary search work\.

**3\. Random access is available**

You need O\(1\) access to any element in the search space\. This is why binary search works on arrays but not on linked lists\.

Here are common problem types where binary search excels:

Problem Type

Examples

Finding exact value

Search in sorted array, search in matrix

Finding boundary

First/last occurrence, first bad version

Finding peak/valley

Find peak element, find minimum in rotated array

Search on answer

Koko eating bananas, capacity to ship packages

Optimization

Minimize maximum, maximize minimum

# Binary Search Variants and Templates

The power of binary search comes from its variants\. While the core idea is the same, small changes in the template let you solve very different problems\. Let us go through each variant with a reusable template\.

### Variant 1: Standard Binary Search \(Find Exact Target\)

This is the classic version\. Given a sorted array, find if a target exists and return its index\.

**Template:**

```java
public int binarySearch(int[] nums, int target) {
   int left = 0;
   int right = nums.length - 1;

   while (left <= right) {
       int mid = left + (right - left) / 2;  // Avoid overflow

       if (nums[mid] == target) {
           return mid;  // Found it
       } else if (nums[mid] < target) {
           left = mid + 1;  // Target is in right half
       } else {
           right = mid - 1;  // Target is in left half
       }
   }

   return -1;  // Not found
}
```

**Key Points:**

*   Use `left <= right` because when `left == right`, we still have one element to check
*   Use `left + (right - left) / 2` instead of `(left + right) / 2` to avoid integer overflow
*   Return immediately when target is found

**Example Walkthrough:**

```plaintext
Array: [1, 3, 5, 7, 9, 11, 13], Target: 9

Step 1: left=0, right=6, mid=3
       nums[3]=7 < 9, so target is in right half
       left = 4

Step 2: left=4, right=6, mid=5
       nums[5]=11 > 9, so target is in left half
       right = 4

Step 3: left=4, right=4, mid=4
       nums[4]=9 == 9, FOUND!
       Return 4
```

### Variant 2: Find Lower Bound \(First Occurrence\)

When duplicates exist, standard binary search might return any occurrence\. This variant finds the first \(leftmost\) occurrence of the target\.

**Template:**

```java
public int lowerBound(int[] nums, int target) {
   int left = 0;
   int right = nums.length;  // Note: right is nums.length, not nums.length - 1

   while (left < right) {  // Note: < not <=
       int mid = left + (right - left) / 2;

       if (nums[mid] < target) {
           left = mid + 1;  // All elements at mid and before are too small
       } else {
           right = mid;  // This could be the answer, but check left half too
       }
   }

   // left is the index of first element >= target
   // Check if it equals target
   if (left < nums.length && nums[left] == target) {
       return left;
   }
   return -1;  // Target not found
}
```

**Key Points:**

*   Use `left < right` \(not `<=`\) because we are looking for a boundary
*   When `nums[mid] >= target`, we keep `mid` in the search space \(`right = mid`\) because it might be the answer
*   The loop terminates when `left == right`, pointing to the first element >= target

**Example Walkthrough:**

```plaintext
Array: [1, 2, 2, 2, 3, 4], Target: 2

Step 1: left=0, right=6, mid=3
       nums[3]=2 >= 2, so first occurrence might be at mid or earlier
       right = 3

Step 2: left=0, right=3, mid=1
       nums[1]=2 >= 2, so first occurrence might be at mid or earlier
       right = 1

Step 3: left=0, right=1, mid=0
       nums[0]=1 < 2, so first occurrence is to the right
       left = 1

Step 4: left=1, right=1, loop ends
       nums[1]=2 == 2, FOUND!
       Return 1 (first occurrence)
```

### Variant 3: Find Upper Bound \(Last Occurrence\)

This variant finds the last \(rightmost\) occurrence of the target\.

**Template:**

```java
public int upperBound(int[] nums, int target) {
   int left = 0;
   int right = nums.length;

   while (left < right) {
       int mid = left + (right - left) / 2;

       if (nums[mid] <= target) {
           left = mid + 1;  // All elements at mid and before might be the target or smaller
       } else {
           right = mid;  // This element is too big
       }
   }

   // left is the index of first element > target
   // So last occurrence of target (if exists) is at left - 1
   if (left > 0 && nums[left - 1] == target) {
       return left - 1;
   }
   return -1;  // Target not found
}
```

**Key Points:**

*   When `nums[mid] <= target`, we move `left` to `mid + 1` because we want to find something strictly greater
*   The loop finds the first element strictly greater than target
*   The last occurrence is at index `left - 1`

**Example Walkthrough:**

```plaintext
Array: [1, 2, 2, 2, 3, 4], Target: 2

Step 1: left=0, right=6, mid=3
       nums[3]=2 <= 2, so last occurrence might be at mid or later
       left = 4

Step 2: left=4, right=6, mid=5
       nums[5]=4 > 2, so last occurrence is before mid
       right = 5

Step 3: left=4, right=5, mid=4
       nums[4]=3 > 2, so last occurrence is before mid
       right = 4

Step 4: left=4, right=4, loop ends
       left-1=3, nums[3]=2 == 2, FOUND!
       Return 3 (last occurrence)
```

### Variant 4: Find First Element Greater Than Target

Sometimes you need the first element strictly greater than a given value\. This is useful for insertion points and range queries\.

**Template:**

```java
public int firstGreater(int[] nums, int target) {
   int left = 0;
   int right = nums.length;

   while (left < right) {
       int mid = left + (right - left) / 2;

       if (nums[mid] <= target) {
           left = mid + 1;  // Need something strictly greater
       } else {
           right = mid;  // This could be the answer
       }
   }

   // left is the index of first element > target
   // Returns nums.length if no such element exists
   return left;
}
```

**Example Walkthrough:**

```plaintext
Array: [1, 3, 5, 7, 9], Target: 6

Step 1: left=0, right=5, mid=2
       nums[2]=5 <= 6, need something greater
       left = 3

Step 2: left=3, right=5, mid=4
       nums[4]=9 > 6, this could be the answer
       right = 4

Step 3: left=3, right=4, mid=3
       nums[3]=7 > 6, this could be the answer
       right = 3

Step 4: left=3, right=3, loop ends
       Return 3 (first element > 6 is 7 at index 3)
```

### Variant 5: Find First Element Greater Than or Equal To Target

This is equivalent to finding the insertion point if you were to insert the target while maintaining sorted order\.

**Template:**

```java
public int firstGreaterOrEqual(int[] nums, int target) {
   int left = 0;
   int right = nums.length;

   while (left < right) {
       int mid = left + (right - left) / 2;

       if (nums[mid] < target) {
           left = mid + 1;  // Need something >= target
       } else {
           right = mid;  // This could be the answer
       }
   }

   // left is the index of first element >= target
   return left;
}
```

This is identical to the lower bound template\. The difference is in how you use the result\.

### Variant 6: Binary Search on Answer Space

This is perhaps the most powerful variant\. Instead of searching in an array, you search in a range of possible answers\. The key insight is that if a certain value works as an answer, then all values more lenient than it also work\.

**Template:**

```java
public int binarySearchOnAnswer(int minAnswer, int maxAnswer) {
   int left = minAnswer;
   int right = maxAnswer;

   while (left < right) {
       int mid = left + (right - left) / 2;

       if (isFeasible(mid)) {
           right = mid;  // This works, but maybe we can do better
       } else {
           left = mid + 1;  // This does not work, need a larger value
       }
   }

   return left;  // Minimum feasible answer
}

private boolean isFeasible(int candidate) {
   // Check if 'candidate' is a valid answer
   // This is problem-specific
}
```

**Key Points:**

*   Define the search space as the range of possible answers
*   Write a helper function to check if a candidate answer is feasible
*   If you are minimizing, search for the first feasible value
*   If you are maximizing, search for the last feasible value

**Example: Minimum Capacity to Ship Packages**

Given packages with weights and a required number of days, find the minimum ship capacity needed\.

```plaintext
Weights: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], Days: 5

Possible capacities range from max(weights)=10 to sum(weights)=55.

Is capacity=15 feasible?
Day 1: [1,2,3,4,5] = 15 ✓
Day 2: [6,7] = 13 ✓
Day 3: [8] = 8 ✓
Day 4: [9] = 9 ✓
Day 5: [10] = 10 ✓
Yes, 15 works in 5 days.

Is capacity=14 feasible?
Day 1: [1,2,3,4] = 10 ✓
Day 2: [5,6] = 11 ✓
Day 3: [7] = 7 ✓
Day 4: [8] = 8 ✓
Day 5: [9] = 9 ✓
Day 6: [10] = 10 ✓
No, 14 needs 6 days.

Binary search between 10 and 55 to find minimum feasible capacity = 15.
```

# Choosing the Right Template

Here is a quick reference for choosing the correct variant:

Problem Type

Template

Loop Condition

Result

Find exact value

Variant 1

`left <= right`

Index or \-1

First occurrence

Variant 2

`left < right`

Left bound

Last occurrence

Variant 3

`left < right`

Right bound \- 1

First > target

Variant 4

`left < right`

Left \(insertion point\)

First >= target

Variant 5

`left < right`

Left \(insertion point\)

Minimum feasible

Variant 6

`left < right`

Minimum answer

Maximum feasible

Variant 6 \(modified\)

`left < right`

Maximum answer

# Example Walkthrough: Count Elements in Range

Let us solve a problem that combines multiple variants\. Given a sorted array with duplicates, count how many elements fall within a range \[lo, hi\]\.

**Problem:** Given `nums = [1, 2, 2, 3, 3, 3, 4, 5]`, count elements in range \[2, 3\]\.

**Solution:** Find the first element >= 2 and the first element > 3\. The count is the difference of their indices\.

```java
public int countInRange(int[] nums, int lo, int hi) {
   int leftBound = firstGreaterOrEqual(nums, lo);   // First >= lo
   int rightBound = firstGreater(nums, hi);          // First > hi
   return rightBound - leftBound;
}
```

```shell
nums = [1, 2, 2, 3, 3, 3, 4, 5]
        0  1  2  3  4  5  6  7

First >= 2: index 1 (nums[1]=2)
First > 3: index 6 (nums[6]=4)

Count = 6 - 1 = 5 elements in range [2, 3]
Verification: [2, 2, 3, 3, 3] = 5 elements ✓
```

# Common Mistakes and How to Avoid Them

### Mistake 1: Off\-by\-One Errors in Loop Condition

The most common source of bugs is mixing up `left <= right` and `left < right`\.

*   Use `left <= right` when you want to check every element \(Variant 1\)
*   Use `left < right` when you want to converge to a boundary \(Variants 2\-6\)

### Mistake 2: Integer Overflow in Mid Calculation

```java
// WRONG: Can overflow if left + right exceeds Integer.MAX_VALUE
int mid = (left + right) / 2;

// CORRECT: Always safe
int mid = left + (right - left) / 2;
```

### Mistake 3: Infinite Loop from Wrong Update

```java
// WRONG: If left = mid when left + 1 = right, infinite loop
if (condition) {
   left = mid;  // Dangerous!
} else {
   right = mid - 1;
}

// CORRECT: Always make progress
if (condition) {
   left = mid + 1;  // Safe
} else {
   right = mid;
}
```

When using `left = mid`, use `mid = left + (right - left + 1) / 2` \(round up\) to avoid infinite loops\.

### Mistake 4: Wrong Initial Bounds

```java
// For finding in array of length n:
int right = nums.length - 1;  // When searching for existing element
int right = nums.length;       // When finding insertion point (can be at end)
```

### Mistake 5: Not Handling Edge Cases

Always consider:

*   Empty array
*   Single element array
*   Target smaller than all elements
*   Target larger than all elements
*   All elements are the same