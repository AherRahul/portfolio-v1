---
title: In-place Reversal
description: Master In-place Reversal in the Linked List module. Comprehensive
  guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

Watch Video Explanation

Linked List In\-Place Reversal is a technique that reverses the direction of pointers in a linked list to change the order of nodes\. Instead of creating a new reversed list or using extra storage, we modify the existing next pointers so that each node points to its predecessor rather than its successor\.

The core operation involves three pointers working together:

*   **prev**: Points to the previously processed node \(starts as null\)
*   **curr**: Points to the current node being processed
*   **next**: Temporarily stores the next node before we modify curr\.next

\.mermaid\-diagram\-container text, \.mermaid\-diagram\-container \.nodeLabel, \.mermaid\-diagram\-container \.edgeLabel, \.mermaid\-diagram\-container \.label, \.mermaid\-diagram\-container tspan \{ font\-weight: 600 \!important; \} \.mermaid\-diagram\-container \.flowchart\-link, \.mermaid\-diagram\-container \.edge\-pattern\-solid, \.mermaid\-diagram\-container \.messageLine0, \.mermaid\-diagram\-container \.messageLine1, \.mermaid\-diagram\-container path\.path \{ stroke\-width: 2px \!important; \} \.mermaid\-diagram\-container marker path \{ stroke\-width: 1px \!important; \} /\* Fix text cutoff in nodes \*/ \.mermaid\-diagram\-container svg \{ overflow: visible \!important; \} \.mermaid\-diagram\-container svg \* \{ overflow: visible \!important; \} \.mermaid\-diagram\-container foreignObject \{ overflow: visible \!important; \} \.mermaid\-diagram\-container foreignObject > \* \{ overflow: visible \!important; \} \.mermaid\-diagram\-container \.node, \.mermaid\-diagram\-container \.node \* \{ overflow: visible \!important; \} /\* Fix text centering in nodes \*/ \.mermaid\-diagram\-container foreignObject > div \{ display: flex \!important; justify\-content: center \!important; align\-items: center \!important; height: 100% \!important; \} /\* Fix text wrapping in subgraph/cluster labels \*/ \.mermaid\-diagram\-container \.cluster\-label, \.mermaid\-diagram\-container \.cluster\-label foreignObject, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > span, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > p, \.mermaid\-diagram\-container \.cluster\-label text, \.mermaid\-diagram\-container \.cluster\-label tspan \{ white\-space: nowrap \!important; overflow: visible \!important; \} /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ \.mermaid\-diagram\-container \.cluster\-label \{ z\-index: 10 \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject \{ transform: translateY\(\-8px\) \!important; overflow: visible \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject > div \{ display: flex \!important; justify\-content: center \!important; align\-items: center \!important; text\-align: center \!important; width: 100% \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > span, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > p \{ background\-color: var\(\-\-background, \#000\) \!important; padding: 2px 6px \!important; border\-radius: 3px \!important; font\-size: 16px \!important; font\-weight: 600 \!important; white\-space: nowrap \!important; \} /\* Sequence diagram note fix \- prevent text overflow \*/ \.mermaid\-diagram\-container \.note rect, \.mermaid\-diagram\-container rect\.note \{ rx: 5px \!important; ry: 5px \!important; \} \.mermaid\-diagram\-container \.note text, \.mermaid\-diagram\-container \.noteText \{ font\-size: 14px \!important; dominant\-baseline: central \!important; \} /\* State diagram specific styles \*/ \.mermaid\-state\-container svg \{ overflow: visible \!important; width: 100% \!important; height: auto \!important; max\-width: 100% \!important; \} \.mermaid\-state\-container \.statediagram\-state, \.mermaid\-state\-container \.stateGroup, \.mermaid\-state\-container \.state \{ overflow: visible \!important; \} \.mermaid\-state\-container text, \.mermaid\-state\-container \.nodeLabel, \.mermaid\-state\-container \.state\-text, \.mermaid\-state\-container tspan \{ white\-space: nowrap \!important; font\-size: 14px \!important; overflow: visible \!important; \} /\* Dark mode text colors for state diagrams \- only cluster labels, not state node text \*/ \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label text, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label tspan, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject span, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject p, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject div \{ fill: \#f0fdf4 \!important; color: \#f0fdf4 \!important; \} \.mermaid\-state\-container \.edgeLabel, \.mermaid\-state\-container \.edge\-label \{ white\-space: nowrap \!important; font\-size: 13px \!important; background\-color: transparent \!important; overflow: visible \!important; \} /\* Dark mode edge label colors \*/ \.dark \.mermaid\-state\-container \.edgeLabel, \.dark \.mermaid\-state\-container \.edgeLabel span, \.dark \.mermaid\-state\-container \.edge\-label \{ fill: \#fafafa \!important; color: \#fafafa \!important; \} \.mermaid\-state\-container \.transition, \.mermaid\-state\-container path\.transition \{ stroke\-width: 2px \!important; \} /\* Fix composite state title vertical positioning \*/ \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label text, \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label tspan \{ dominant\-baseline: middle \!important; alignment\-baseline: middle \!important; \}

\#mermaid\-tlosa8z8abp\-1772123806805\{font\-family:inherit;font\-size:16px;fill:\#fafafa;\}@keyframes edge\-animation\-frame\{from\{stroke\-dashoffset:0;\}\}@keyframes dash\{to\{stroke\-dashoffset:0;\}\}\#mermaid\-tlosa8z8abp\-1772123806805 \.edge\-animation\-slow\{stroke\-dasharray:9,5\!important;stroke\-dashoffset:900;animation:dash 50s linear infinite;stroke\-linecap:round;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.edge\-animation\-fast\{stroke\-dasharray:9,5\!important;stroke\-dashoffset:900;animation:dash 20s linear infinite;stroke\-linecap:round;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.error\-icon\{fill:\#000000;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.error\-text\{fill:\#fafafa;stroke:\#fafafa;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.edge\-thickness\-normal\{stroke\-width:1px;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.edge\-thickness\-thick\{stroke\-width:3\.5px;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.edge\-pattern\-solid\{stroke\-dasharray:0;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.edge\-thickness\-invisible\{stroke\-width:0;fill:none;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.edge\-pattern\-dashed\{stroke\-dasharray:3;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.edge\-pattern\-dotted\{stroke\-dasharray:2;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.marker\{fill:\#22c55e;stroke:\#22c55e;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.marker\.cross\{stroke:\#22c55e;\}\#mermaid\-tlosa8z8abp\-1772123806805 svg\{font\-family:inherit;font\-size:16px;\}\#mermaid\-tlosa8z8abp\-1772123806805 p\{margin:0;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.label\{font\-family:inherit;color:\#f0fdf4;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.cluster\-label text\{fill:\#fafafa;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.cluster\-label span\{color:\#fafafa;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.cluster\-label span p\{background\-color:transparent;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.label text,\#mermaid\-tlosa8z8abp\-1772123806805 span\{fill:\#f0fdf4;color:\#f0fdf4;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.node rect,\#mermaid\-tlosa8z8abp\-1772123806805 \.node circle,\#mermaid\-tlosa8z8abp\-1772123806805 \.node ellipse,\#mermaid\-tlosa8z8abp\-1772123806805 \.node polygon,\#mermaid\-tlosa8z8abp\-1772123806805 \.node path\{fill:\#166534;stroke:\#22c55e;stroke\-width:1px;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.rough\-node \.label text,\#mermaid\-tlosa8z8abp\-1772123806805 \.node \.label text,\#mermaid\-tlosa8z8abp\-1772123806805 \.image\-shape \.label,\#mermaid\-tlosa8z8abp\-1772123806805 \.icon\-shape \.label\{text\-anchor:middle;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.node \.katex path\{fill:\#000;stroke:\#000;stroke\-width:1px;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.rough\-node \.label,\#mermaid\-tlosa8z8abp\-1772123806805 \.node \.label,\#mermaid\-tlosa8z8abp\-1772123806805 \.image\-shape \.label,\#mermaid\-tlosa8z8abp\-1772123806805 \.icon\-shape \.label\{text\-align:center;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.node\.clickable\{cursor:pointer;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.root \.anchor path\{fill:\#22c55e\!important;stroke\-width:0;stroke:\#22c55e;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.arrowheadPath\{fill:\#0b0b0b;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.edgePath \.path\{stroke:\#22c55e;stroke\-width:2\.0px;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.flowchart\-link\{stroke:\#22c55e;fill:none;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.edgeLabel\{background\-color:\#0a0a0a;text\-align:center;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.edgeLabel p\{background\-color:\#0a0a0a;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.edgeLabel rect\{opacity:0\.5;background\-color:\#0a0a0a;fill:\#0a0a0a;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.labelBkg\{background\-color:rgba\(10, 10, 10, 0\.5\);\}\#mermaid\-tlosa8z8abp\-1772123806805 \.cluster rect\{fill:\#1a1a1a;stroke:\#000000;stroke\-width:1px;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.cluster text\{fill:\#fafafa;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.cluster span\{color:\#fafafa;\}\#mermaid\-tlosa8z8abp\-1772123806805 div\.mermaidTooltip\{position:absolute;text\-align:center;max\-width:200px;padding:2px;font\-family:inherit;font\-size:12px;background:\#000000;border:1px solid \#262626;border\-radius:2px;pointer\-events:none;z\-index:100;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.flowchartTitleText\{text\-anchor:middle;font\-size:18px;fill:\#fafafa;\}\#mermaid\-tlosa8z8abp\-1772123806805 rect\.text\{fill:none;stroke\-width:0;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.icon\-shape,\#mermaid\-tlosa8z8abp\-1772123806805 \.image\-shape\{background\-color:\#0a0a0a;text\-align:center;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.icon\-shape p,\#mermaid\-tlosa8z8abp\-1772123806805 \.image\-shape p\{background\-color:\#0a0a0a;padding:2px;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.icon\-shape rect,\#mermaid\-tlosa8z8abp\-1772123806805 \.image\-shape rect\{opacity:0\.5;background\-color:\#0a0a0a;fill:\#0a0a0a;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.label\-icon\{display:inline\-block;height:1em;overflow:visible;vertical\-align:\-0\.125em;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.node \.label\-icon path\{fill:currentColor;stroke:revert;stroke\-width:revert;\}\#mermaid\-tlosa8z8abp\-1772123806805 :root\{\-\-mermaid\-font\-family:inherit;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.cyan>\*\{fill:\#00ceff\!important;stroke:\#000\!important;color:\#000\!important;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.cyan span\{fill:\#00ceff\!important;stroke:\#000\!important;color:\#000\!important;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.cyan tspan\{fill:\#000\!important;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.green>\*\{fill:\#69db7c\!important;stroke:\#000\!important;color:\#000\!important;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.green span\{fill:\#69db7c\!important;stroke:\#000\!important;color:\#000\!important;\}\#mermaid\-tlosa8z8abp\-1772123806805 \.green tspan\{fill:\#000\!important;\}

After Reversal

4

3

2

1

null

Before Reversal

1

2

3

4

null

The beauty of this approach is that we are not moving data around or allocating new nodes\. We are simply rewiring the connections between existing nodes\. Each node stays in its memory location; only the pointers change\.

# Why Does This Technique Work?

The in\-place reversal technique works because linked list nodes are independent objects connected only by pointers\. Unlike arrays where elements must be contiguous in memory, linked list nodes can exist anywhere in memory and rely solely on their next pointer to define the sequence\.

When we reverse a linked list in\-place:

1.  **No data movement**: The values stored in each node remain untouched\. We only modify the next pointers\.
2.  **Constant extra space**: We need only a fixed number of pointer variables \(typically 3\), regardless of the list length\. This gives us O\(1\) space complexity\.
3.  **Single pass efficiency**: By processing each node exactly once and updating its pointer, we achieve O\(n\) time complexity\.

The key insight is that each node's next pointer is independent\. When we change node A's next to point to something else, it does not affect what node B's next points to\. This independence allows us to systematically redirect all pointers in a single pass through the list\.

# When to Use This Pattern

The in\-place reversal pattern is your go\-to technique when you encounter these situations:

**1\. Reversing a linked list \(full or partial\)**

Whenever a problem asks you to reverse all or part of a linked list, this is the primary technique\. Whether it is the entire list or just a section between two positions, the same pointer manipulation applies\.

**2\. Checking for palindromes**

To check if a linked list is a palindrome, you can reverse the second half and compare it with the first half\. This combines the fast\-slow pointer technique \(to find the middle\) with in\-place reversal\.

**3\. Reordering nodes**

Problems that ask you to reorder nodes in a specific pattern often require reversing parts of the list\. For example, alternating nodes from the start and end of a list\.

**4\. K\-group operations**

When you need to process nodes in groups \(like reversing every k nodes\), in\-place reversal applied to each group is the core operation\.

Here are the telltale signs that a problem might need in\-place reversal:

Indicator

Examples

"Reverse" in problem statement

Reverse Linked List, Reverse Between

Checking palindrome

Palindrome Linked List

Reorder or interleave

Reorder List, Odd Even Linked List

K\-group processing

Reverse Nodes in k\-Group, Swap Nodes in Pairs

Comparing first and second half

Palindrome checks, fold matching

# Pattern Variants

The in\-place reversal technique manifests in several forms, each building on the basic idea but adding complexity:

### Variant 1: Full List Reversal

The simplest case\. Reverse the entire linked list from head to tail\. The original head becomes the tail, and the original tail becomes the new head\.

```shell
Before: 1 -> 2 -> 3 -> 4 -> null
After:  4 -> 3 -> 2 -> 1 -> null
```

### Variant 2: Partial Reversal \(Between Positions\)

Reverse only a portion of the list, from position m to position n\. Nodes before m and after n remain in their original order\. This requires careful handling of the connection points\.

```shell
Before: 1 -> 2 -> 3 -> 4 -> 5, reverse from position 2 to 4
After:  1 -> 4 -> 3 -> 2 -> 5
```

### Variant 3: K\-Group Reversal

Reverse nodes in groups of k\. If the remaining nodes are fewer than k, they may be left as\-is or reversed depending on the problem variant\.

```shell
Before: 1 -> 2 -> 3 -> 4 -> 5, k = 2
After:  2 -> 1 -> 4 -> 3 -> 5
```

### Variant 4: Alternating Reversal

Reverse alternate groups\. For example, reverse the first k nodes, keep the next k as\-is, reverse the next k, and so on\.

```shell
Before: 1 -> 2 -> 3 -> 4 -> 5 -> 6, k = 2
After:  2 -> 1 -> 3 -> 4 -> 6 -> 5 (reverse groups 1, skip group 2, reverse group 3)
```

Each variant requires understanding the basic reversal mechanism and then adapting it to handle boundaries and connections appropriately\.

# The Reversal Templates

Most in\-place reversal problems use one of two fundamental approaches\. Let us establish them clearly\.

### Template 1: Iterative Reversal \(Three\-Pointer Technique\)

This is the workhorse of linked list reversal\. Three pointers work in coordination to reverse the list in a single pass\.

Java

```java
public ListNode reverseList(ListNode head) {
   ListNode prev = null;
   ListNode curr = head;

   while (curr != null) {
       ListNode next = curr.next;  // Save next node
       curr.next = prev;           // Reverse the pointer
       prev = curr;                // Move prev forward
       curr = next;                // Move curr forward
   }

   return prev;  // prev is the new head
}
```

**The four operations inside the loop \(in order\):**

1.  **Save**: Store curr\.next before we overwrite it
2.  **Reverse**: Point curr\.next backward to prev
3.  **Advance prev**: Move prev to curr
4.  **Advance curr**: Move curr to the saved next

The order of these operations is critical\. Changing the order will break the algorithm\.

### Template 2: Recursive Reversal

The recursive approach is elegant but uses O\(n\) stack space\. It works by recursing to the end of the list, then rewiring pointers on the way back\.

Java

```java
public ListNode reverseListRecursive(ListNode head) {
   // Base case: empty list or single node
   if (head == null || head.next == null) {
       return head;
   }

   // Recurse to reverse the rest of the list
   ListNode newHead = reverseListRecursive(head.next);

   // After recursion, head.next is the last node of the reversed portion
   // Make it point back to head
   head.next.next = head;
   head.next = null;  // Prevent cycle

   return newHead;
}
```

**How the recursion works:**

1.  Recurse until you reach the last node \(base case\)
2.  The last node becomes the new head
3.  On the way back, each node makes its next node point to itself
4.  Each node sets its own next to null to prevent cycles

The recursive approach is less intuitive but demonstrates a beautiful property of recursion: solving the smaller problem first, then handling the connection\.

### When to Use Which

Approach

Pros

Cons

Best For

Iterative

O\(1\) space, straightforward

More code

Production code, interviews

Recursive

Elegant, less code

O\(n\) stack space

Understanding concepts, small lists

In interviews, the iterative approach is generally preferred because it uses constant space\. However, being able to explain both shows deeper understanding\.