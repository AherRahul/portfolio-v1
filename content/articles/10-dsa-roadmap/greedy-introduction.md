---
title: Introduction
description: Master Introduction in the Greedy module. Comprehensive guide and
  algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

A greedy algorithm builds a solution piece by piece, always choosing the next piece that offers the most immediate benefit\. Once a choice is made, it is never reconsidered\.

Think of it like climbing a mountain in dense fog\. You cannot see the peak, only your immediate surroundings\. A greedy climber always takes the step that goes most steeply upward\. Sometimes this leads to the summit\. Other times, it leads to a local peak that is not the highest point\.

The key characteristics of greedy algorithms:

1.  **Makes one choice at a time**: At each step, select the option that looks best right now
2.  **Never reconsiders**: Once a choice is made, it is final
3.  **Builds solution incrementally**: Each choice extends the partial solution
4.  **Local optimization**: Each step is locally optimal, not necessarily globally optimal

\.mermaid\-diagram\-container text, \.mermaid\-diagram\-container \.nodeLabel, \.mermaid\-diagram\-container \.edgeLabel, \.mermaid\-diagram\-container \.label, \.mermaid\-diagram\-container tspan \{ font\-weight: 600 \!important; \} \.mermaid\-diagram\-container \.flowchart\-link, \.mermaid\-diagram\-container \.edge\-pattern\-solid, \.mermaid\-diagram\-container \.messageLine0, \.mermaid\-diagram\-container \.messageLine1, \.mermaid\-diagram\-container path\.path \{ stroke\-width: 2px \!important; \} \.mermaid\-diagram\-container marker path \{ stroke\-width: 1px \!important; \} /\* Fix text cutoff in nodes \*/ \.mermaid\-diagram\-container svg \{ overflow: visible \!important; \} \.mermaid\-diagram\-container svg \* \{ overflow: visible \!important; \} \.mermaid\-diagram\-container foreignObject \{ overflow: visible \!important; \} \.mermaid\-diagram\-container foreignObject > \* \{ overflow: visible \!important; \} \.mermaid\-diagram\-container \.node, \.mermaid\-diagram\-container \.node \* \{ overflow: visible \!important; \} /\* Fix text centering in nodes \*/ \.mermaid\-diagram\-container foreignObject > div \{ display: flex \!important; justify\-content: center \!important; align\-items: center \!important; height: 100% \!important; \} /\* Fix text wrapping in subgraph/cluster labels \*/ \.mermaid\-diagram\-container \.cluster\-label, \.mermaid\-diagram\-container \.cluster\-label foreignObject, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > span, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > p, \.mermaid\-diagram\-container \.cluster\-label text, \.mermaid\-diagram\-container \.cluster\-label tspan \{ white\-space: nowrap \!important; overflow: visible \!important; \} /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ \.mermaid\-diagram\-container \.cluster\-label \{ z\-index: 10 \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject \{ transform: translateY\(\-8px\) \!important; overflow: visible \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject > div \{ display: flex \!important; justify\-content: center \!important; align\-items: center \!important; text\-align: center \!important; width: 100% \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > span, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > p \{ background\-color: var\(\-\-background, \#000\) \!important; padding: 2px 6px \!important; border\-radius: 3px \!important; font\-size: 16px \!important; font\-weight: 600 \!important; white\-space: nowrap \!important; \} /\* Sequence diagram note fix \- prevent text overflow \*/ \.mermaid\-diagram\-container \.note rect, \.mermaid\-diagram\-container rect\.note \{ rx: 5px \!important; ry: 5px \!important; \} \.mermaid\-diagram\-container \.note text, \.mermaid\-diagram\-container \.noteText \{ font\-size: 14px \!important; dominant\-baseline: central \!important; \} /\* State diagram specific styles \*/ \.mermaid\-state\-container svg \{ overflow: visible \!important; width: 100% \!important; height: auto \!important; max\-width: 100% \!important; \} \.mermaid\-state\-container \.statediagram\-state, \.mermaid\-state\-container \.stateGroup, \.mermaid\-state\-container \.state \{ overflow: visible \!important; \} \.mermaid\-state\-container text, \.mermaid\-state\-container \.nodeLabel, \.mermaid\-state\-container \.state\-text, \.mermaid\-state\-container tspan \{ white\-space: nowrap \!important; font\-size: 14px \!important; overflow: visible \!important; \} /\* Dark mode text colors for state diagrams \- only cluster labels, not state node text \*/ \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label text, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label tspan, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject span, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject p, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject div \{ fill: \#f0fdf4 \!important; color: \#f0fdf4 \!important; \} \.mermaid\-state\-container \.edgeLabel, \.mermaid\-state\-container \.edge\-label \{ white\-space: nowrap \!important; font\-size: 13px \!important; background\-color: transparent \!important; overflow: visible \!important; \} /\* Dark mode edge label colors \*/ \.dark \.mermaid\-state\-container \.edgeLabel, \.dark \.mermaid\-state\-container \.edgeLabel span, \.dark \.mermaid\-state\-container \.edge\-label \{ fill: \#fafafa \!important; color: \#fafafa \!important; \} \.mermaid\-state\-container \.transition, \.mermaid\-state\-container path\.transition \{ stroke\-width: 2px \!important; \} /\* Fix composite state title vertical positioning \*/ \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label text, \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label tspan \{ dominant\-baseline: middle \!important; alignment\-baseline: middle \!important; \}

\#mermaid\-jhkz1isql6q\-1772123615833\{font\-family:inherit;font\-size:16px;fill:\#fafafa;\}@keyframes edge\-animation\-frame\{from\{stroke\-dashoffset:0;\}\}@keyframes dash\{to\{stroke\-dashoffset:0;\}\}\#mermaid\-jhkz1isql6q\-1772123615833 \.edge\-animation\-slow\{stroke\-dasharray:9,5\!important;stroke\-dashoffset:900;animation:dash 50s linear infinite;stroke\-linecap:round;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.edge\-animation\-fast\{stroke\-dasharray:9,5\!important;stroke\-dashoffset:900;animation:dash 20s linear infinite;stroke\-linecap:round;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.error\-icon\{fill:\#000000;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.error\-text\{fill:\#fafafa;stroke:\#fafafa;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.edge\-thickness\-normal\{stroke\-width:1px;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.edge\-thickness\-thick\{stroke\-width:3\.5px;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.edge\-pattern\-solid\{stroke\-dasharray:0;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.edge\-thickness\-invisible\{stroke\-width:0;fill:none;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.edge\-pattern\-dashed\{stroke\-dasharray:3;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.edge\-pattern\-dotted\{stroke\-dasharray:2;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.marker\{fill:\#22c55e;stroke:\#22c55e;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.marker\.cross\{stroke:\#22c55e;\}\#mermaid\-jhkz1isql6q\-1772123615833 svg\{font\-family:inherit;font\-size:16px;\}\#mermaid\-jhkz1isql6q\-1772123615833 p\{margin:0;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.label\{font\-family:inherit;color:\#f0fdf4;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.cluster\-label text\{fill:\#fafafa;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.cluster\-label span\{color:\#fafafa;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.cluster\-label span p\{background\-color:transparent;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.label text,\#mermaid\-jhkz1isql6q\-1772123615833 span\{fill:\#f0fdf4;color:\#f0fdf4;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.node rect,\#mermaid\-jhkz1isql6q\-1772123615833 \.node circle,\#mermaid\-jhkz1isql6q\-1772123615833 \.node ellipse,\#mermaid\-jhkz1isql6q\-1772123615833 \.node polygon,\#mermaid\-jhkz1isql6q\-1772123615833 \.node path\{fill:\#166534;stroke:\#22c55e;stroke\-width:1px;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.rough\-node \.label text,\#mermaid\-jhkz1isql6q\-1772123615833 \.node \.label text,\#mermaid\-jhkz1isql6q\-1772123615833 \.image\-shape \.label,\#mermaid\-jhkz1isql6q\-1772123615833 \.icon\-shape \.label\{text\-anchor:middle;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.node \.katex path\{fill:\#000;stroke:\#000;stroke\-width:1px;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.rough\-node \.label,\#mermaid\-jhkz1isql6q\-1772123615833 \.node \.label,\#mermaid\-jhkz1isql6q\-1772123615833 \.image\-shape \.label,\#mermaid\-jhkz1isql6q\-1772123615833 \.icon\-shape \.label\{text\-align:center;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.node\.clickable\{cursor:pointer;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.root \.anchor path\{fill:\#22c55e\!important;stroke\-width:0;stroke:\#22c55e;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.arrowheadPath\{fill:\#0b0b0b;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.edgePath \.path\{stroke:\#22c55e;stroke\-width:2\.0px;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.flowchart\-link\{stroke:\#22c55e;fill:none;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.edgeLabel\{background\-color:\#0a0a0a;text\-align:center;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.edgeLabel p\{background\-color:\#0a0a0a;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.edgeLabel rect\{opacity:0\.5;background\-color:\#0a0a0a;fill:\#0a0a0a;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.labelBkg\{background\-color:rgba\(10, 10, 10, 0\.5\);\}\#mermaid\-jhkz1isql6q\-1772123615833 \.cluster rect\{fill:\#1a1a1a;stroke:\#000000;stroke\-width:1px;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.cluster text\{fill:\#fafafa;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.cluster span\{color:\#fafafa;\}\#mermaid\-jhkz1isql6q\-1772123615833 div\.mermaidTooltip\{position:absolute;text\-align:center;max\-width:200px;padding:2px;font\-family:inherit;font\-size:12px;background:\#000000;border:1px solid \#262626;border\-radius:2px;pointer\-events:none;z\-index:100;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.flowchartTitleText\{text\-anchor:middle;font\-size:18px;fill:\#fafafa;\}\#mermaid\-jhkz1isql6q\-1772123615833 rect\.text\{fill:none;stroke\-width:0;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.icon\-shape,\#mermaid\-jhkz1isql6q\-1772123615833 \.image\-shape\{background\-color:\#0a0a0a;text\-align:center;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.icon\-shape p,\#mermaid\-jhkz1isql6q\-1772123615833 \.image\-shape p\{background\-color:\#0a0a0a;padding:2px;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.icon\-shape rect,\#mermaid\-jhkz1isql6q\-1772123615833 \.image\-shape rect\{opacity:0\.5;background\-color:\#0a0a0a;fill:\#0a0a0a;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.label\-icon\{display:inline\-block;height:1em;overflow:visible;vertical\-align:\-0\.125em;\}\#mermaid\-jhkz1isql6q\-1772123615833 \.node \.label\-icon path\{fill:currentColor;stroke:revert;stroke\-width:revert;\}\#mermaid\-jhkz1isql6q\-1772123615833 :root\{\-\-mermaid\-font\-family:inherit;\}

Problem

Greedy Choice 1

Greedy Choice 2

Greedy Choice 3

Solution

Other options  
\(ignored\)

Other options  
\(ignored\)

Other options  
\(ignored\)

The greedy path \(solid arrows\) commits to choices without exploring alternatives \(dotted arrows\)\. This is both its strength \(efficiency\) and its weakness \(may miss better solutions\)\.

# When Does Greedy Work?

Greedy algorithms work when the problem has two key properties:

### 1\. Greedy Choice Property

A globally optimal solution can be constructed by making locally optimal choices\. In other words, choosing what looks best right now will not prevent us from finding the best overall solution\.

For the coin change example with US denominations \(25, 10, 5, 1 cents\), always picking the largest coin that fits gives the minimum number of coins\. But this is not universally true\. If coins were \(1, 3, 4\) cents and we needed 6 cents, greedy would pick 4 \+ 1 \+ 1 = 3 coins, but 3 \+ 3 = 2 coins is optimal\.

### 2\. Optimal Substructure

An optimal solution to the problem contains optimal solutions to its subproblems\. After making a greedy choice, the remaining problem should also have an optimal solution that, combined with the greedy choice, gives the overall optimum\.

Consider activity selection: if we greedily pick an activity that ends earliest, the remaining problem is to select activities from those that start after this one ends\. The optimal solution to this subproblem, combined with our greedy choice, gives the global optimum\.

# Greedy vs Dynamic Programming vs Backtracking

Understanding when to use each technique is crucial\. Here is how they compare:

Aspect

Greedy

Dynamic Programming

Backtracking

**Approach**

Make best local choice

Try all options, cache results

Explore all paths

**Choice consideration**

One choice, final

All choices, pick best

All choices, explore each

**Subproblems**

No overlap assumed

Overlapping subproblems

Tree of choices

**Time complexity**

Usually O\(n\) or O\(n log n\)

Usually O\(n²\) or O\(n \* m\)

Usually exponential

**Space complexity**

Usually O\(1\) or O\(n\)

O\(n\) to O\(n²\)

O\(depth\)

**When to use**

Greedy choice property holds

Need optimal \+ overlapping subproblems

Need all solutions

**Example**

Activity selection

0/1 Knapsack

Generate permutations

#### **How to identify which to use:**

1.  **Try greedy first** if the problem is an optimization \(min/max\) and you can prove or intuit that local optimal leads to global optimal
2.  **Use DP** if greedy fails \(local optimal does not give global optimal\) and the problem has overlapping subproblems
3.  **Use backtracking** if you need all solutions or cannot decompose into subproblems

A common interview strategy: propose greedy, identify why it might fail with a counterexample, then pivot to DP if needed\.

# Common Greedy Patterns

Certain problem types have well\-known greedy solutions\. Recognizing these patterns helps you quickly identify when greedy applies\.

### Pattern 1: Interval Scheduling

**Problem type**: Select maximum non\-overlapping intervals, or minimum intervals to cover a range\.

**Greedy strategy**: Sort by end time and pick intervals that end earliest\.

**Why it works**: By picking the interval that ends earliest, we leave maximum room for subsequent intervals\.

**Problems using this pattern:**

*   Non\-overlapping Intervals \(LeetCode 435\)
*   Merge Intervals \(LeetCode 56\)
*   Meeting Rooms \(LeetCode 252, 253\)

### Pattern 2: Greedy Scheduling

**Problem type**: Minimize total wait time or maximize throughput\.

**Greedy strategy**: Process shortest jobs first \(SJF\) or prioritize by some efficiency metric\.

**Why it works**: Completing short tasks first reduces the total waiting time for all subsequent tasks\.

**Problems using this pattern:**

*   Task Scheduler \(LeetCode 621\)
*   Minimum Number of Arrows to Burst Balloons \(LeetCode 452\)

### Pattern 3: Two\-Pointer Greedy

**Problem type**: Problems involving sorted arrays where you need to find pairs or optimize based on positions\.

**Greedy strategy**: Use two pointers \(often start and end\) and greedily move the pointer that improves the solution\.

**Why it works**: Moving the "less promising" pointer cannot miss a better solution\.

**Problems using this pattern:**

*   Container With Most Water \(LeetCode 11\)
*   Two Sum II \(LeetCode 167\)
*   Trapping Rain Water \(partial greedy logic\)

### Pattern 4: Greedy Choice with Running State

**Problem type**: Problems where you track a running value \(sum, maximum, minimum\) and make greedy decisions based on it\.

**Greedy strategy**: Maintain state that captures the "best so far" and update greedily\.

**Why it works**: The greedy invariant ensures you never miss a better solution\.

**Problems using this pattern:**

*   Jump Game \(LeetCode 55\)
*   Jump Game II \(LeetCode 45\)
*   Gas Station \(LeetCode 134\)
*   Best Time to Buy and Sell Stock \(LeetCode 121\)

### Pattern 5: Huffman\-Style / Priority Queue Greedy

**Problem type**: Problems where you repeatedly select the smallest/largest elements and combine them\.

**Greedy strategy**: Use a heap to always process the optimal element first\.

**Why it works**: Processing in optimal order ensures each combination step is locally optimal\.

**Problems using this pattern:**

*   Merge k Sorted Lists \(LeetCode 23\)
*   Minimum Cost to Connect Sticks \(LeetCode 1167\)
*   Reorganize String \(LeetCode 767\)

# The Greedy Template

Most greedy solutions follow a similar structure:

Java

```java
public Result solveGreedy(Input input) {
   // Step 1: Sort or organize input (if needed)
   sort(input, byGreedyCriterion);

   // Step 2: Initialize result and tracking variables
   Result result = initialResult();
   State state = initialState();

   // Step 3: Iterate and make greedy choices
   for (Element element : input) {
       if (canInclude(element, state)) {
           // Make the greedy choice
           result = update(result, element);
           state = updateState(state, element);
       }
   }

   return result;
}
```

The key decisions when applying this template:

1.  **What is the greedy criterion?** How do you sort or prioritize elements?
2.  **What state do you track?** What information carries forward?
3.  **What is the greedy choice?** When do you include/exclude an element?
4.  **How do you update?** How does the result and state change with each choice?

# Example Walkthrough: Fractional Knapsack

Let us work through a complete example that demonstrates the greedy approach\.

**Problem**: You have a knapsack that can hold weight W\. Given n items, each with a weight and value, maximize the total value you can carry\. Unlike 0/1 knapsack, you can take fractions of items\.

**Example**:

*   Knapsack capacity: W = 50
*   Items: \[\(weight=10, value=60\), \(weight=20, value=100\), \(weight=30, value=120\)\]

### Step 1: Identify the Greedy Criterion

What makes an item "attractive"? Neither weight alone nor value alone tells the full story\. The key insight is **value per unit weight** \(value density\)\.

Item

Weight

Value

Value/Weight

1

10

60

6\.0

2

20

100

5\.0

3

30

120

4\.0

### Step 2: Sort by Greedy Criterion

Sort items by value/weight in descending order: Item 1, Item 2, Item 3\.

### Step 3: Make Greedy Choices

```plaintext
Knapsack capacity: 50

Step 1: Consider Item 1 (weight=10, value=60, ratio=6.0)
 - 10 <= 50 (fits completely)
 - Take all of Item 1
 - Remaining capacity: 50 - 10 = 40
 - Total value: 60

Step 2: Consider Item 2 (weight=20, value=100, ratio=5.0)
 - 20 <= 40 (fits completely)
 - Take all of Item 2
 - Remaining capacity: 40 - 20 = 20
 - Total value: 60 + 100 = 160

Step 3: Consider Item 3 (weight=30, value=120, ratio=4.0)
 - 30 > 20 (does NOT fit completely)
 - Take fraction: 20/30 = 2/3 of Item 3
 - Value from fraction: 120 * (20/30) = 80
 - Remaining capacity: 0
 - Total value: 160 + 80 = 240

Final answer: Maximum value = 240
```

### Implementation

Java

```java
public class FractionalKnapsack {

   public double maxValue(int capacity, int[][] items) {
       // items[i] = [weight, value]
       int n = items.length;

       // Step 1: Calculate value/weight ratio and sort
       double[][] itemsWithRatio = new double[n][3];
       for (int i = 0; i < n; i++) {
           itemsWithRatio[i][0] = items[i][0];  // weight
           itemsWithRatio[i][1] = items[i][1];  // value
           itemsWithRatio[i][2] = (double) items[i][1] / items[i][0];  // ratio
       }

       // Sort by ratio in descending order
       Arrays.sort(itemsWithRatio, (a, b) -> Double.compare(b[2], a[2]));

       // Step 2: Make greedy choices
       double totalValue = 0;
       int remainingCapacity = capacity;

       for (double[] item : itemsWithRatio) {
           int weight = (int) item[0];
           double value = item[1];

           if (remainingCapacity >= weight) {
               // Take the whole item
               totalValue += value;
               remainingCapacity -= weight;
           } else if (remainingCapacity > 0) {
               // Take a fraction of the item
               double fraction = (double) remainingCapacity / weight;
               totalValue += value * fraction;
               remainingCapacity = 0;
           }

           if (remainingCapacity == 0) {
               break;
           }
       }

       return totalValue;
   }
}
```

### Why Greedy Works Here

Fractional knapsack has the greedy choice property because:

1.  Taking the highest ratio item first maximizes value per weight used
2.  Since we can take fractions, there is no "blocking" effect\. We never regret taking a high\-ratio item because we can always fill remaining space optimally
3.  Each greedy choice leads to an optimal subproblem

**Contrast with 0/1 Knapsack**: If we cannot take fractions, greedy fails\. Consider W=10, items: \[\(6, 60\), \(5, 50\), \(5, 50\)\]\. Greedy takes \(6, 60\) first, then cannot fit anything else\. Optimal is \(5, 50\) \+ \(5, 50\) = 100 > 60\.

# Second Example: Activity Selection

Let us reinforce the greedy approach with another classic example that uses a different criterion\.

**Problem**: Given n activities with start and end times, select the maximum number of non\-overlapping activities\.

**Example**:

*   Activities: \[\(1,4\), \(3,5\), \(0,6\), \(5,7\), \(3,9\), \(5,9\), \(6,10\), \(8,11\)\]

### The Greedy Criterion

Which activity should we pick first? Several options seem reasonable:

*   **Earliest start time?** Might pick a long activity that blocks many others
*   **Shortest duration?** A short activity in the middle might still block others
*   **Earliest end time?** Leaves maximum room for remaining activities

The correct criterion is **earliest end time**\.

### The Algorithm

1.  Sort activities by end time
2.  Pick the first activity \(earliest end\)
3.  For each subsequent activity: if it starts after the last picked activity ends, pick it

### Walkthrough

```plaintext
Activities sorted by end time:
(1,4), (3,5), (0,6), (5,7), (3,9), (5,9), (6,10), (8,11)

Step 1: Pick (1,4). Last end = 4.
Step 2: (3,5) starts at 3 < 4. Skip.
Step 3: (0,6) starts at 0 < 4. Skip.
Step 4: (5,7) starts at 5 >= 4. Pick. Last end = 7.
Step 5: (3,9) starts at 3 < 7. Skip.
Step 6: (5,9) starts at 5 < 7. Skip.
Step 7: (6,10) starts at 6 < 7. Skip.
Step 8: (8,11) starts at 8 >= 7. Pick. Last end = 11.

Selected: (1,4), (5,7), (8,11) = 3 activities
```

### Implementation

Java

```java
public class ActivitySelection {

   public int maxActivities(int[][] activities) {
       // activities[i] = [start, end]
       // Sort by end time
       Arrays.sort(activities, (a, b) -> a[1] - b[1]);

       int count = 1;  // Always pick the first activity
       int lastEnd = activities[0][1];

       for (int i = 1; i < activities.length; i++) {
           if (activities[i][0] >= lastEnd) {
               count++;
               lastEnd = activities[i][1];
           }
       }

       return count;
   }
}
```

### Why Earliest End Time Works

The key insight: by picking the activity that ends earliest, we maximize the remaining time available for other activities\. Any other first choice would end later, leaving less room\.

**Proof by exchange argument**: Suppose an optimal solution O does not start with the earliest\-ending activity E\. Let O start with activity A instead\. Since E ends no later than A, we can replace A with E in O without causing any conflicts\. The modified solution is still valid and has the same count\. Repeating this argument, we can transform any optimal solution into the greedy solution\.

# Common Mistakes and Pitfalls

### Mistake 1: Assuming Greedy Works Without Proof

Just because a problem looks like it should be greedy does not mean it is\. Always verify with counterexamples\.

**Example**: Coin change with denominations \[1, 3, 4\] and target 6\.

*   Greedy: 4 \+ 1 \+ 1 = 3 coins
*   Optimal: 3 \+ 3 = 2 coins

Before committing to greedy in an interview, think: "Can I construct a case where the greedy choice leads to a suboptimal solution?"

### Mistake 2: Wrong Greedy Criterion

Choosing the wrong sorting or selection criterion leads to incorrect results\.

**Example**: For interval scheduling, sorting by start time instead of end time gives wrong answers\.

Interval

Start

End

A

1

10

B

2

3

C

4

5

*   Sort by start: Pick A \(1\-10\), no others fit\. Count = 1
*   Sort by end: Pick B \(2\-3\), then C \(4\-5\)\. Count = 2

### Mistake 3: Not Handling Edge Cases

Greedy algorithms often have subtle edge cases:

*   Empty input
*   Single element
*   All elements identical
*   No valid solution exists

Always consider these before submitting\.

### Mistake 4: Greedy for Counting Problems

If the problem asks "how many ways" or "count all solutions," greedy usually does not apply\. These typically need DP or backtracking\.

# How to Identify Greedy Problems in Interviews

Look for these indicators:

Signal

Explanation

"Maximum/Minimum" with O\(n\) or O\(n log n\) expected

Greedy often achieves these complexities

"Select/Schedule/Assign" problems

Classic greedy territory

"At each step" language

Hints at making sequential choices

Sorting seems natural

Many greedy solutions start with sorting

Local choice determines global optimum

The core greedy property

"Earliest/Latest/Shortest/Longest first" intuition

Common greedy strategies

**Red flags that greedy might not work:**

Signal

Explanation

"Count all ways" or "enumerate all solutions"

Usually needs DP or backtracking

Dependencies between choices

One choice affects what choices remain

"0/1" or "all or nothing" constraints

Often need DP

No obvious sorting criterion

Hard to define "greedy choice"