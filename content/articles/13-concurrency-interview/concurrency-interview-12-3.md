---
title: "Design Concurrent Bloom Filter"
description: "Design Concurrent Bloom Filter - Concurrency Interview Module 12"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Design Concurrent Bloom Filter

Bloom filters are ubiquitous in high-throughput systems. Redis uses them for cache prefetching. Cassandra and HBase use them to avoid expensive disk lookups. Chrome used them for safe browsing checks. Network routers use them for packet deduplication. These systems process millions of operations per second, and any lock contention is unacceptable.

The good news: Bloom filters have properties that make them surprisingly easy to parallelize. Bits only ever transition from 0 to 1, never back. Setting a bit that's already set is harmless. These properties unlock elegant lock-free implementations.

This chapter explores three approaches to concurrent Bloom filters, from simple locking to lock-free designs that scale linearly with core count.

# Problem Statement

### What We're Building

A thread-safe Bloom filter that allows multiple threads to add elements and check membership concurrently. A Bloom filter is a probabilistic data structure that can definitively say "not present" but only probabilistically say "might be present." False positives are possible; false negatives are not.

### Required Operations

Operation

Description

Expected Complexity

`add(item)`

Add an item to the filter

O(k) where k = number of hash functions

`mightContain(item)`

Check if item might be present

O(k)

`clear()`

Reset the filter to empty state

O(m) where m = bit array size

`approximateCount()`

Estimate number of items added

O(1)

### Thread-Safety Requirements

*   Multiple threads can call `add()` simultaneously without losing any additions
*   Multiple threads can call `mightContain()` simultaneously without blocking
*   An item added by one thread becomes visible to other threads (eventually)
*   `mightContain()` never returns false for an item that was added (no false negatives)
*   `clear()` is exclusive, no concurrent adds or queries during clear
*   False positive rate remains within expected bounds under concurrent access

# Data Structure Fundamentals

Before adding concurrency, let's understand how Bloom filters work and why their structure enables efficient parallelization.

### Core Concepts

A Bloom filter consists of two components:

1.  **Bit array:** A fixed-size array of m bits, all initially set to 0
2.  **Hash functions:** k independent hash functions that map elements to positions in the bit array

To **add** an element:

1.  Compute k hash values for the element
2.  Set the corresponding k bits in the array to 1

To **check** membership:

1.  Compute k hash values for the element
2.  If ALL k bits are 1, return "might contain"
3.  If ANY bit is 0, return "definitely not present"

### False Positive Analysis

After inserting n elements into a Bloom filter with m bits and k hash functions, the probability that a specific bit is still 0 is:

Plaintext

```plaintext
1P(bit = 0) = (1 - 1/m)^(kn) ≈ e^(-kn/m)
```

The false positive probability (all k bits are 1 by chance) is:

```plaintext
1P(false positive) = (1 - e^(-kn/m))^k
```

### Optimal Hash Function Count

Given m bits and n expected elements, the optimal number of hash functions is:

```plaintext
1k_optimal = (m/n) × ln(2) ≈ 0.693 × (m/n)
```

With optimal k, the false positive rate is approximately:

```plaintext
1P(fp) ≈ (0.6185)^(m/n)
```

**Practical rule of thumb:** 10 bits per element gives roughly 1% false positive rate.

### How Bloom Filter Works

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-5mbhxvy6mu7-1772709692706{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-5mbhxvy6mu7-1772709692706 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-5mbhxvy6mu7-1772709692706 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-5mbhxvy6mu7-1772709692706 .error-icon{fill:#000000;}#mermaid-5mbhxvy6mu7-1772709692706 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-5mbhxvy6mu7-1772709692706 .edge-thickness-normal{stroke-width:1px;}#mermaid-5mbhxvy6mu7-1772709692706 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-5mbhxvy6mu7-1772709692706 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-5mbhxvy6mu7-1772709692706 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-5mbhxvy6mu7-1772709692706 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-5mbhxvy6mu7-1772709692706 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-5mbhxvy6mu7-1772709692706 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-5mbhxvy6mu7-1772709692706 .marker.cross{stroke:#22c55e;}#mermaid-5mbhxvy6mu7-1772709692706 svg{font-family:inherit;font-size:16px;}#mermaid-5mbhxvy6mu7-1772709692706 p{margin:0;}#mermaid-5mbhxvy6mu7-1772709692706 .label{font-family:inherit;color:#f0fdf4;}#mermaid-5mbhxvy6mu7-1772709692706 .cluster-label text{fill:#fafafa;}#mermaid-5mbhxvy6mu7-1772709692706 .cluster-label span{color:#fafafa;}#mermaid-5mbhxvy6mu7-1772709692706 .cluster-label span p{background-color:transparent;}#mermaid-5mbhxvy6mu7-1772709692706 .label text,#mermaid-5mbhxvy6mu7-1772709692706 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-5mbhxvy6mu7-1772709692706 .node rect,#mermaid-5mbhxvy6mu7-1772709692706 .node circle,#mermaid-5mbhxvy6mu7-1772709692706 .node ellipse,#mermaid-5mbhxvy6mu7-1772709692706 .node polygon,#mermaid-5mbhxvy6mu7-1772709692706 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-5mbhxvy6mu7-1772709692706 .rough-node .label text,#mermaid-5mbhxvy6mu7-1772709692706 .node .label text,#mermaid-5mbhxvy6mu7-1772709692706 .image-shape .label,#mermaid-5mbhxvy6mu7-1772709692706 .icon-shape .label{text-anchor:middle;}#mermaid-5mbhxvy6mu7-1772709692706 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-5mbhxvy6mu7-1772709692706 .rough-node .label,#mermaid-5mbhxvy6mu7-1772709692706 .node .label,#mermaid-5mbhxvy6mu7-1772709692706 .image-shape .label,#mermaid-5mbhxvy6mu7-1772709692706 .icon-shape .label{text-align:center;}#mermaid-5mbhxvy6mu7-1772709692706 .node.clickable{cursor:pointer;}#mermaid-5mbhxvy6mu7-1772709692706 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-5mbhxvy6mu7-1772709692706 .arrowheadPath{fill:#0b0b0b;}#mermaid-5mbhxvy6mu7-1772709692706 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-5mbhxvy6mu7-1772709692706 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-5mbhxvy6mu7-1772709692706 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-5mbhxvy6mu7-1772709692706 .edgeLabel p{background-color:#0a0a0a;}#mermaid-5mbhxvy6mu7-1772709692706 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-5mbhxvy6mu7-1772709692706 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-5mbhxvy6mu7-1772709692706 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-5mbhxvy6mu7-1772709692706 .cluster text{fill:#fafafa;}#mermaid-5mbhxvy6mu7-1772709692706 .cluster span{color:#fafafa;}#mermaid-5mbhxvy6mu7-1772709692706 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-5mbhxvy6mu7-1772709692706 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-5mbhxvy6mu7-1772709692706 rect.text{fill:none;stroke-width:0;}#mermaid-5mbhxvy6mu7-1772709692706 .icon-shape,#mermaid-5mbhxvy6mu7-1772709692706 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-5mbhxvy6mu7-1772709692706 .icon-shape p,#mermaid-5mbhxvy6mu7-1772709692706 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-5mbhxvy6mu7-1772709692706 .icon-shape rect,#mermaid-5mbhxvy6mu7-1772709692706 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-5mbhxvy6mu7-1772709692706 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-5mbhxvy6mu7-1772709692706 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-5mbhxvy6mu7-1772709692706 :root{--mermaid-font-family:inherit;}#mermaid-5mbhxvy6mu7-1772709692706 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-5mbhxvy6mu7-1772709692706 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-5mbhxvy6mu7-1772709692706 .primary tspan{fill:#000!important;}#mermaid-5mbhxvy6mu7-1772709692706 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-5mbhxvy6mu7-1772709692706 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-5mbhxvy6mu7-1772709692706 .orange tspan{fill:#000!important;}#mermaid-5mbhxvy6mu7-1772709692706 .data>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-5mbhxvy6mu7-1772709692706 .data span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-5mbhxvy6mu7-1772709692706 .data tspan{fill:#000!important;}

Bit Array (m=12)

Hash Functions

Input

Set bit 2

Set bit 5

Set bit 9

Element: 'apple'

h1(x) = 2

h2(x) = 5

h3(x) = 9

0|0|1|0|0|1|0|0|0|1|0|0

The diagram shows adding "apple" to a Bloom filter. Three hash functions produce positions 2, 5, and 9, and those bits are set to 1.

### Single-Threaded Implementation

Java

```java
1import java.util.BitSet;
2
3public class BloomFilter<T> {
4    private final BitSet bits;
5    private final int numBits;
6    private final int numHashFunctions;
7    private int count;
8
9    public BloomFilter(int expectedElements, double falsePositiveRate) {
10        // Calculate optimal size: m = -n*ln(p) / (ln(2)^2)
11        this.numBits = optimalNumBits(expectedElements, falsePositiveRate);
12        // Calculate optimal k: k = (m/n) * ln(2)
13        this.numHashFunctions = optimalNumHashFunctions(numBits, expectedElements);
14        this.bits = new BitSet(numBits);
15        this.count = 0;
16    }
17
18    private static int optimalNumBits(int n, double p) {
19        return (int) Math.ceil(-n * Math.log(p) / (Math.log(2) * Math.log(2)));
20    }
21
22    private static int optimalNumHashFunctions(int m, int n) {
23        return Math.max(1, (int) Math.round((double) m / n * Math.log(2)));
24    }
25
26    public void add(T element) {
27        int hash1 = element.hashCode();
28        int hash2 = spread(hash1);
29
30        for (int i = 0; i < numHashFunctions; i++) {
31            int combinedHash = hash1 + i * hash2;
32            int index = Math.abs(combinedHash % numBits);
33            bits.set(index);
34        }
35        count++;
36    }
37
38    public boolean mightContain(T element) {
39        int hash1 = element.hashCode();
40        int hash2 = spread(hash1);
41
42        for (int i = 0; i < numHashFunctions; i++) {
43            int combinedHash = hash1 + i * hash2;
44            int index = Math.abs(combinedHash % numBits);
45            if (!bits.get(index)) {
46                return false;
47            }
48        }
49        return true;
50    }
51
52    // Spread bits to create second independent hash
53    private int spread(int hash) {
54        hash ^= (hash >>> 16);
55        hash *= 0x85ebca6b;
56        hash ^= (hash >>> 13);
57        hash *= 0xc2b2ae35;
58        hash ^= (hash >>> 16);
59        return hash;
60    }
61
62    public void clear() {
63        bits.clear();
64        count = 0;
65    }
66
67    public int getCount() {
68        return count;
69    }
70
71    public double expectedFalsePositiveRate() {
72        double exponent = -(double) numHashFunctions * count / numBits;
73        return Math.pow(1 - Math.exp(exponent), numHashFunctions);
74    }
75}
```

# Concurrency Challenges

Making a Bloom filter thread-safe is easier than most data structures, but there are still important considerations.

### Challenge 1: Setting Multiple Bits Atomically

An `add()` operation sets k bits. Do these k bit-sets need to be atomic as a group?

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Thread 2 (Check "apple")Bloom FilterThread 1 (Add "apple")Thread 2 (Check "apple")Bloom FilterThread 1 (Add "apple")#mermaid-zo1hq2gu63m-1772709692715{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-zo1hq2gu63m-1772709692715 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-zo1hq2gu63m-1772709692715 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-zo1hq2gu63m-1772709692715 .error-icon{fill:#000000;}#mermaid-zo1hq2gu63m-1772709692715 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-zo1hq2gu63m-1772709692715 .edge-thickness-normal{stroke-width:1px;}#mermaid-zo1hq2gu63m-1772709692715 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-zo1hq2gu63m-1772709692715 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-zo1hq2gu63m-1772709692715 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-zo1hq2gu63m-1772709692715 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-zo1hq2gu63m-1772709692715 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-zo1hq2gu63m-1772709692715 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-zo1hq2gu63m-1772709692715 .marker.cross{stroke:#22c55e;}#mermaid-zo1hq2gu63m-1772709692715 svg{font-family:inherit;font-size:16px;}#mermaid-zo1hq2gu63m-1772709692715 p{margin:0;}#mermaid-zo1hq2gu63m-1772709692715 .actor{stroke:#22c55e;fill:transparent;}#mermaid-zo1hq2gu63m-1772709692715 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-zo1hq2gu63m-1772709692715 .actor-line{stroke:#22c55e;}#mermaid-zo1hq2gu63m-1772709692715 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-zo1hq2gu63m-1772709692715 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-zo1hq2gu63m-1772709692715 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-zo1hq2gu63m-1772709692715 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-zo1hq2gu63m-1772709692715 .sequenceNumber{fill:#f0fdf4;}#mermaid-zo1hq2gu63m-1772709692715 #sequencenumber{fill:#fafafa;}#mermaid-zo1hq2gu63m-1772709692715 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-zo1hq2gu63m-1772709692715 .messageText{fill:#fafafa;stroke:none;}#mermaid-zo1hq2gu63m-1772709692715 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-zo1hq2gu63m-1772709692715 .labelText,#mermaid-zo1hq2gu63m-1772709692715 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-zo1hq2gu63m-1772709692715 .loopText,#mermaid-zo1hq2gu63m-1772709692715 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-zo1hq2gu63m-1772709692715 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-zo1hq2gu63m-1772709692715 .note{stroke:#f59e0b;fill:#422006;}#mermaid-zo1hq2gu63m-1772709692715 .noteText,#mermaid-zo1hq2gu63m-1772709692715 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-zo1hq2gu63m-1772709692715 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-zo1hq2gu63m-1772709692715 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-zo1hq2gu63m-1772709692715 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-zo1hq2gu63m-1772709692715 .actorPopupMenu{position:absolute;}#mermaid-zo1hq2gu63m-1772709692715 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-zo1hq2gu63m-1772709692715 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-zo1hq2gu63m-1772709692715 .actor-man circle,#mermaid-zo1hq2gu63m-1772709692715 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-zo1hq2gu63m-1772709692715 :root{--mermaid-font-family:inherit;}Bits needed for "apple": 2, 5, 9Add completeReturned false for item being addedSet bit 2 = 1Set bit 5 = 1Check "apple"Bit 2 = 1 ✓Bit 5 = 1 ✓Bit 9 = 0 ✗Return FALSESet bit 9 = 1

**Key insight:** This is actually fine for Bloom filters. The query returned "not present" during a concurrent insert. This is a valid linearization where the query happened before the insert completed. Since we never return false negatives for completed inserts, correctness is preserved.

### Challenge 2: Read Visibility

When Thread 1 sets a bit, when does Thread 2 see it? Without proper memory ordering, Thread 2 might read a stale cached value.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Thread 2 (Query)CPU 2 CacheMain MemoryCPU 1 CacheThread 1 (Add)Thread 2 (Query)CPU 2 CacheMain MemoryCPU 1 CacheThread 1 (Add)#mermaid-ukmuvnvp8u-1772709692717{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-ukmuvnvp8u-1772709692717 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-ukmuvnvp8u-1772709692717 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-ukmuvnvp8u-1772709692717 .error-icon{fill:#000000;}#mermaid-ukmuvnvp8u-1772709692717 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-ukmuvnvp8u-1772709692717 .edge-thickness-normal{stroke-width:1px;}#mermaid-ukmuvnvp8u-1772709692717 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-ukmuvnvp8u-1772709692717 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-ukmuvnvp8u-1772709692717 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-ukmuvnvp8u-1772709692717 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-ukmuvnvp8u-1772709692717 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-ukmuvnvp8u-1772709692717 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-ukmuvnvp8u-1772709692717 .marker.cross{stroke:#22c55e;}#mermaid-ukmuvnvp8u-1772709692717 svg{font-family:inherit;font-size:16px;}#mermaid-ukmuvnvp8u-1772709692717 p{margin:0;}#mermaid-ukmuvnvp8u-1772709692717 .actor{stroke:#22c55e;fill:transparent;}#mermaid-ukmuvnvp8u-1772709692717 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-ukmuvnvp8u-1772709692717 .actor-line{stroke:#22c55e;}#mermaid-ukmuvnvp8u-1772709692717 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-ukmuvnvp8u-1772709692717 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-ukmuvnvp8u-1772709692717 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-ukmuvnvp8u-1772709692717 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-ukmuvnvp8u-1772709692717 .sequenceNumber{fill:#f0fdf4;}#mermaid-ukmuvnvp8u-1772709692717 #sequencenumber{fill:#fafafa;}#mermaid-ukmuvnvp8u-1772709692717 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-ukmuvnvp8u-1772709692717 .messageText{fill:#fafafa;stroke:none;}#mermaid-ukmuvnvp8u-1772709692717 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-ukmuvnvp8u-1772709692717 .labelText,#mermaid-ukmuvnvp8u-1772709692717 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-ukmuvnvp8u-1772709692717 .loopText,#mermaid-ukmuvnvp8u-1772709692717 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-ukmuvnvp8u-1772709692717 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-ukmuvnvp8u-1772709692717 .note{stroke:#f59e0b;fill:#422006;}#mermaid-ukmuvnvp8u-1772709692717 .noteText,#mermaid-ukmuvnvp8u-1772709692717 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-ukmuvnvp8u-1772709692717 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-ukmuvnvp8u-1772709692717 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-ukmuvnvp8u-1772709692717 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-ukmuvnvp8u-1772709692717 .actorPopupMenu{position:absolute;}#mermaid-ukmuvnvp8u-1772709692717 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-ukmuvnvp8u-1772709692717 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-ukmuvnvp8u-1772709692717 .actor-man circle,#mermaid-ukmuvnvp8u-1772709692717 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-ukmuvnvp8u-1772709692717 :root{--mermaid-font-family:inherit;}bit\[5\] = 0bit\[5\] = 1 (cached)bit\[5\] = 0 (not flushed yet)Eventually consistent, not immediately visibleWrite bit\[5\] = 1Read bit\[5\]Fetch bit\[5\]bit\[5\] = 0See stale value!

**Solution:** Use atomic operations with appropriate memory ordering, or accept eventual visibility (often acceptable for Bloom filters).

### Challenge 3: The clear() Operation

`clear()` resets all bits to 0 while other threads might be adding or querying. This can cause serious issues:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Thread 2 (Clear)Bloom FilterThread 1 (Add "apple")Thread 2 (Clear)Bloom FilterThread 1 (Add "apple")#mermaid-19yxfjo2aw9-1772709692720{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-19yxfjo2aw9-1772709692720 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-19yxfjo2aw9-1772709692720 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-19yxfjo2aw9-1772709692720 .error-icon{fill:#000000;}#mermaid-19yxfjo2aw9-1772709692720 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-19yxfjo2aw9-1772709692720 .edge-thickness-normal{stroke-width:1px;}#mermaid-19yxfjo2aw9-1772709692720 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-19yxfjo2aw9-1772709692720 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-19yxfjo2aw9-1772709692720 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-19yxfjo2aw9-1772709692720 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-19yxfjo2aw9-1772709692720 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-19yxfjo2aw9-1772709692720 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-19yxfjo2aw9-1772709692720 .marker.cross{stroke:#22c55e;}#mermaid-19yxfjo2aw9-1772709692720 svg{font-family:inherit;font-size:16px;}#mermaid-19yxfjo2aw9-1772709692720 p{margin:0;}#mermaid-19yxfjo2aw9-1772709692720 .actor{stroke:#22c55e;fill:transparent;}#mermaid-19yxfjo2aw9-1772709692720 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-19yxfjo2aw9-1772709692720 .actor-line{stroke:#22c55e;}#mermaid-19yxfjo2aw9-1772709692720 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-19yxfjo2aw9-1772709692720 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-19yxfjo2aw9-1772709692720 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-19yxfjo2aw9-1772709692720 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-19yxfjo2aw9-1772709692720 .sequenceNumber{fill:#f0fdf4;}#mermaid-19yxfjo2aw9-1772709692720 #sequencenumber{fill:#fafafa;}#mermaid-19yxfjo2aw9-1772709692720 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-19yxfjo2aw9-1772709692720 .messageText{fill:#fafafa;stroke:none;}#mermaid-19yxfjo2aw9-1772709692720 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-19yxfjo2aw9-1772709692720 .labelText,#mermaid-19yxfjo2aw9-1772709692720 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-19yxfjo2aw9-1772709692720 .loopText,#mermaid-19yxfjo2aw9-1772709692720 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-19yxfjo2aw9-1772709692720 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-19yxfjo2aw9-1772709692720 .note{stroke:#f59e0b;fill:#422006;}#mermaid-19yxfjo2aw9-1772709692720 .noteText,#mermaid-19yxfjo2aw9-1772709692720 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-19yxfjo2aw9-1772709692720 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-19yxfjo2aw9-1772709692720 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-19yxfjo2aw9-1772709692720 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-19yxfjo2aw9-1772709692720 .actorPopupMenu{position:absolute;}#mermaid-19yxfjo2aw9-1772709692720 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-19yxfjo2aw9-1772709692720 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-19yxfjo2aw9-1772709692720 .actor-man circle,#mermaid-19yxfjo2aw9-1772709692720 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-19yxfjo2aw9-1772709692720 :root{--mermaid-font-family:inherit;}Bits for "apple": 2, 5, 9All bits = 0Only bit 9 is set!"apple" is corruptedmightContain("apple") = falseFALSE NEGATIVE - violates correctness!Set bit 2 = 1Set bit 5 = 1Clear all bits to 0Set bit 9 = 1

This is a false negative: "apple" was added but won't be found because two of its bits were cleared mid-insertion.

**Solution:** `clear()` must be exclusive. Use a read-write lock where adds/queries take read lock and clear takes write lock.

### Consistency Model

Property

Requirement

Why It Matters

**No False Negatives**

Mandatory

Core Bloom filter guarantee

**Linearizability**

Not required

Probabilistic nature tolerates slight inconsistency

**Immediate Visibility**

Not required

Eventually visible is usually acceptable

**Progress Guarantee**

Lock-free preferred

High throughput systems need non-blocking adds

The probabilistic nature of Bloom filters means we can tolerate relaxed consistency. A query might miss a concurrent insert (query linearized before insert), but this doesn't violate the no-false-negatives guarantee for completed inserts.

# Approach 1: Synchronized Wrapper

The simplest approach wraps the entire Bloom filter with a read-write lock.

### Implementation

Java

```java
1import java.util.BitSet;
2import java.util.concurrent.locks.ReentrantReadWriteLock;
3
4public class SynchronizedBloomFilter<T> {
5    private final BitSet bits;
6    private final int numBits;
7    private final int numHashFunctions;
8    private int count;
9    private final ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();
10
11    public SynchronizedBloomFilter(int expectedElements, double falsePositiveRate) {
12        this.numBits = optimalNumBits(expectedElements, falsePositiveRate);
13        this.numHashFunctions = optimalNumHashFunctions(numBits, expectedElements);
14        this.bits = new BitSet(numBits);
15        this.count = 0;
16    }
17
18    private static int optimalNumBits(int n, double p) {
19        return (int) Math.ceil(-n * Math.log(p) / (Math.log(2) * Math.log(2)));
20    }
21
22    private static int optimalNumHashFunctions(int m, int n) {
23        return Math.max(1, (int) Math.round((double) m / n * Math.log(2)));
24    }
25
26    private int spread(int hash) {
27        hash ^= (hash >>> 16);
28        hash *= 0x85ebca6b;
29        hash ^= (hash >>> 13);
30        hash *= 0xc2b2ae35;
31        hash ^= (hash >>> 16);
32        return hash;
33    }
34
35    public void add(T element) {
36        rwLock.writeLock().lock();
37        try {
38            int hash1 = element.hashCode();
39            int hash2 = spread(hash1);
40
41            for (int i = 0; i < numHashFunctions; i++) {
42                int combinedHash = hash1 + i * hash2;
43                int index = Math.abs(combinedHash % numBits);
44                bits.set(index);
45            }
46            count++;
47        } finally {
48            rwLock.writeLock().unlock();
49        }
50    }
51
52    public boolean mightContain(T element) {
53        rwLock.readLock().lock();
54        try {
55            int hash1 = element.hashCode();
56            int hash2 = spread(hash1);
57
58            for (int i = 0; i < numHashFunctions; i++) {
59                int combinedHash = hash1 + i * hash2;
60                int index = Math.abs(combinedHash % numBits);
61                if (!bits.get(index)) {
62                    return false;
63                }
64            }
65            return true;
66        } finally {
67            rwLock.readLock().unlock();
68        }
69    }
70
71    public void clear() {
72        rwLock.writeLock().lock();
73        try {
74            bits.clear();
75            count = 0;
76        } finally {
77            rwLock.writeLock().unlock();
78        }
79    }
80
81    public int approximateCount() {
82        rwLock.readLock().lock();
83        try {
84            return count;
85        } finally {
86            rwLock.readLock().unlock();
87        }
88    }
89}
```

### Analysis

Property

Status

Explanation

Thread-safe

Yes

All access serialized by lock

Deadlock-free

Yes

Single lock, no circular dependencies

Read scalability

Poor

Even queries need write lock (modifying BitSet)

Add scalability

Poor

All adds serialize

Clear safety

Yes

Write lock is exclusive

**Problem with Java's BitSet:** `BitSet.set()` and `BitSet.get()` are not thread-safe. Multiple threads calling `set()` concurrently can corrupt internal state. This forces us to use write lock even for reads if we want to avoid races.

### Performance Characteristics

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-k8ixklm3gcc-1772709692722{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-k8ixklm3gcc-1772709692722 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-k8ixklm3gcc-1772709692722 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-k8ixklm3gcc-1772709692722 .error-icon{fill:#000000;}#mermaid-k8ixklm3gcc-1772709692722 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-k8ixklm3gcc-1772709692722 .edge-thickness-normal{stroke-width:1px;}#mermaid-k8ixklm3gcc-1772709692722 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-k8ixklm3gcc-1772709692722 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-k8ixklm3gcc-1772709692722 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-k8ixklm3gcc-1772709692722 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-k8ixklm3gcc-1772709692722 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-k8ixklm3gcc-1772709692722 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-k8ixklm3gcc-1772709692722 .marker.cross{stroke:#22c55e;}#mermaid-k8ixklm3gcc-1772709692722 svg{font-family:inherit;font-size:16px;}#mermaid-k8ixklm3gcc-1772709692722 p{margin:0;}#mermaid-k8ixklm3gcc-1772709692722 .label{font-family:inherit;color:#f0fdf4;}#mermaid-k8ixklm3gcc-1772709692722 .cluster-label text{fill:#fafafa;}#mermaid-k8ixklm3gcc-1772709692722 .cluster-label span{color:#fafafa;}#mermaid-k8ixklm3gcc-1772709692722 .cluster-label span p{background-color:transparent;}#mermaid-k8ixklm3gcc-1772709692722 .label text,#mermaid-k8ixklm3gcc-1772709692722 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-k8ixklm3gcc-1772709692722 .node rect,#mermaid-k8ixklm3gcc-1772709692722 .node circle,#mermaid-k8ixklm3gcc-1772709692722 .node ellipse,#mermaid-k8ixklm3gcc-1772709692722 .node polygon,#mermaid-k8ixklm3gcc-1772709692722 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-k8ixklm3gcc-1772709692722 .rough-node .label text,#mermaid-k8ixklm3gcc-1772709692722 .node .label text,#mermaid-k8ixklm3gcc-1772709692722 .image-shape .label,#mermaid-k8ixklm3gcc-1772709692722 .icon-shape .label{text-anchor:middle;}#mermaid-k8ixklm3gcc-1772709692722 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-k8ixklm3gcc-1772709692722 .rough-node .label,#mermaid-k8ixklm3gcc-1772709692722 .node .label,#mermaid-k8ixklm3gcc-1772709692722 .image-shape .label,#mermaid-k8ixklm3gcc-1772709692722 .icon-shape .label{text-align:center;}#mermaid-k8ixklm3gcc-1772709692722 .node.clickable{cursor:pointer;}#mermaid-k8ixklm3gcc-1772709692722 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-k8ixklm3gcc-1772709692722 .arrowheadPath{fill:#0b0b0b;}#mermaid-k8ixklm3gcc-1772709692722 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-k8ixklm3gcc-1772709692722 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-k8ixklm3gcc-1772709692722 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-k8ixklm3gcc-1772709692722 .edgeLabel p{background-color:#0a0a0a;}#mermaid-k8ixklm3gcc-1772709692722 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-k8ixklm3gcc-1772709692722 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-k8ixklm3gcc-1772709692722 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-k8ixklm3gcc-1772709692722 .cluster text{fill:#fafafa;}#mermaid-k8ixklm3gcc-1772709692722 .cluster span{color:#fafafa;}#mermaid-k8ixklm3gcc-1772709692722 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-k8ixklm3gcc-1772709692722 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-k8ixklm3gcc-1772709692722 rect.text{fill:none;stroke-width:0;}#mermaid-k8ixklm3gcc-1772709692722 .icon-shape,#mermaid-k8ixklm3gcc-1772709692722 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-k8ixklm3gcc-1772709692722 .icon-shape p,#mermaid-k8ixklm3gcc-1772709692722 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-k8ixklm3gcc-1772709692722 .icon-shape rect,#mermaid-k8ixklm3gcc-1772709692722 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-k8ixklm3gcc-1772709692722 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-k8ixklm3gcc-1772709692722 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-k8ixklm3gcc-1772709692722 :root{--mermaid-font-family:inherit;}#mermaid-k8ixklm3gcc-1772709692722 .waiting>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-k8ixklm3gcc-1772709692722 .waiting span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-k8ixklm3gcc-1772709692722 .waiting tspan{fill:#000!important;}#mermaid-k8ixklm3gcc-1772709692722 .lock>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-k8ixklm3gcc-1772709692722 .lock span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-k8ixklm3gcc-1772709692722 .lock tspan{fill:#000!important;}#mermaid-k8ixklm3gcc-1772709692722 .bf>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-k8ixklm3gcc-1772709692722 .bf span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-k8ixklm3gcc-1772709692722 .bf tspan{fill:#000!important;}

Single Lock Bottleneck

Thread 1

Write Lock

Thread 2

Thread 3

Thread 4

Bloom Filter

### Pros

*   Simple and obviously correct
*   No memory overhead beyond the lock
*   Easy to reason about correctness

### Cons

*   Zero parallelism for adds
*   Zero parallelism for queries (due to BitSet thread-safety issues)
*   Lock contention becomes severe under high load

#### **When to Use:**

*   Low-throughput applications
*   When correctness verification is important
*   Prototyping before optimizing

# Approach 2: Segmented Locking

Divide the bit array into segments, each with its own lock. Adds and queries only lock the segments they touch.

### Strategy: Segment-Based Locking

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-0rptfxjfxkb-1772709692725{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-0rptfxjfxkb-1772709692725 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-0rptfxjfxkb-1772709692725 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-0rptfxjfxkb-1772709692725 .error-icon{fill:#000000;}#mermaid-0rptfxjfxkb-1772709692725 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-0rptfxjfxkb-1772709692725 .edge-thickness-normal{stroke-width:1px;}#mermaid-0rptfxjfxkb-1772709692725 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-0rptfxjfxkb-1772709692725 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-0rptfxjfxkb-1772709692725 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-0rptfxjfxkb-1772709692725 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-0rptfxjfxkb-1772709692725 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-0rptfxjfxkb-1772709692725 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-0rptfxjfxkb-1772709692725 .marker.cross{stroke:#22c55e;}#mermaid-0rptfxjfxkb-1772709692725 svg{font-family:inherit;font-size:16px;}#mermaid-0rptfxjfxkb-1772709692725 p{margin:0;}#mermaid-0rptfxjfxkb-1772709692725 .label{font-family:inherit;color:#f0fdf4;}#mermaid-0rptfxjfxkb-1772709692725 .cluster-label text{fill:#fafafa;}#mermaid-0rptfxjfxkb-1772709692725 .cluster-label span{color:#fafafa;}#mermaid-0rptfxjfxkb-1772709692725 .cluster-label span p{background-color:transparent;}#mermaid-0rptfxjfxkb-1772709692725 .label text,#mermaid-0rptfxjfxkb-1772709692725 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-0rptfxjfxkb-1772709692725 .node rect,#mermaid-0rptfxjfxkb-1772709692725 .node circle,#mermaid-0rptfxjfxkb-1772709692725 .node ellipse,#mermaid-0rptfxjfxkb-1772709692725 .node polygon,#mermaid-0rptfxjfxkb-1772709692725 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-0rptfxjfxkb-1772709692725 .rough-node .label text,#mermaid-0rptfxjfxkb-1772709692725 .node .label text,#mermaid-0rptfxjfxkb-1772709692725 .image-shape .label,#mermaid-0rptfxjfxkb-1772709692725 .icon-shape .label{text-anchor:middle;}#mermaid-0rptfxjfxkb-1772709692725 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-0rptfxjfxkb-1772709692725 .rough-node .label,#mermaid-0rptfxjfxkb-1772709692725 .node .label,#mermaid-0rptfxjfxkb-1772709692725 .image-shape .label,#mermaid-0rptfxjfxkb-1772709692725 .icon-shape .label{text-align:center;}#mermaid-0rptfxjfxkb-1772709692725 .node.clickable{cursor:pointer;}#mermaid-0rptfxjfxkb-1772709692725 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-0rptfxjfxkb-1772709692725 .arrowheadPath{fill:#0b0b0b;}#mermaid-0rptfxjfxkb-1772709692725 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-0rptfxjfxkb-1772709692725 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-0rptfxjfxkb-1772709692725 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-0rptfxjfxkb-1772709692725 .edgeLabel p{background-color:#0a0a0a;}#mermaid-0rptfxjfxkb-1772709692725 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-0rptfxjfxkb-1772709692725 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-0rptfxjfxkb-1772709692725 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-0rptfxjfxkb-1772709692725 .cluster text{fill:#fafafa;}#mermaid-0rptfxjfxkb-1772709692725 .cluster span{color:#fafafa;}#mermaid-0rptfxjfxkb-1772709692725 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-0rptfxjfxkb-1772709692725 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-0rptfxjfxkb-1772709692725 rect.text{fill:none;stroke-width:0;}#mermaid-0rptfxjfxkb-1772709692725 .icon-shape,#mermaid-0rptfxjfxkb-1772709692725 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-0rptfxjfxkb-1772709692725 .icon-shape p,#mermaid-0rptfxjfxkb-1772709692725 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-0rptfxjfxkb-1772709692725 .icon-shape rect,#mermaid-0rptfxjfxkb-1772709692725 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-0rptfxjfxkb-1772709692725 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-0rptfxjfxkb-1772709692725 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-0rptfxjfxkb-1772709692725 :root{--mermaid-font-family:inherit;}#mermaid-0rptfxjfxkb-1772709692725 .lock>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-0rptfxjfxkb-1772709692725 .lock span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-0rptfxjfxkb-1772709692725 .lock tspan{fill:#000!important;}#mermaid-0rptfxjfxkb-1772709692725 .data>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-0rptfxjfxkb-1772709692725 .data span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-0rptfxjfxkb-1772709692725 .data tspan{fill:#000!important;}#mermaid-0rptfxjfxkb-1772709692725 .thread>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-0rptfxjfxkb-1772709692725 .thread span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-0rptfxjfxkb-1772709692725 .thread tspan{fill:#000!important;}

Bloom Filter Segments

Segment 3

Segment 2

Segment 1

Segment 0

Lock 0

Bits 0-1023

Lock 1

Bits 1024-2047

Lock 2

Bits 2048-3071

Lock 3

Bits 3072-4095

Thread 1 (bits 100, 1500)

Thread 2 (bits 2200, 3500)

### Handling Cross-Segment Operations

When an add operation needs to set bits in multiple segments, we must acquire all needed locks. To prevent deadlock, we always acquire locks in segment order (lowest to highest).

### Implementation

Java

```java
1import java.util.BitSet;
2import java.util.TreeSet;
3import java.util.concurrent.locks.ReentrantReadWriteLock;
4import java.util.concurrent.atomic.AtomicInteger;
5
6public class SegmentedBloomFilter<T> {
7    private static final int DEFAULT_NUM_SEGMENTS = 16;
8
9    private final Segment[] segments;
10    private final int numSegments;
11    private final int numBits;
12    private final int bitsPerSegment;
13    private final int numHashFunctions;
14    private final AtomicInteger count;
15    private final ReentrantReadWriteLock clearLock = new ReentrantReadWriteLock();
16
17    private static class Segment {
18        final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
19        final BitSet bits;
20
21        Segment(int size) {
22            this.bits = new BitSet(size);
23        }
24    }
25
26    public SegmentedBloomFilter(int expectedElements, double falsePositiveRate) {
27        this(expectedElements, falsePositiveRate, DEFAULT_NUM_SEGMENTS);
28    }
29
30    public SegmentedBloomFilter(int expectedElements, double falsePositiveRate, int numSegments) {
31        this.numBits = optimalNumBits(expectedElements, falsePositiveRate);
32        this.numHashFunctions = optimalNumHashFunctions(numBits, expectedElements);
33        this.numSegments = numSegments;
34        this.bitsPerSegment = (numBits + numSegments - 1) / numSegments;
35        this.segments = new Segment[numSegments];
36        for (int i = 0; i < numSegments; i++) {
37            segments[i] = new Segment(bitsPerSegment);
38        }
39        this.count = new AtomicInteger(0);
40    }
41
42    private static int optimalNumBits(int n, double p) {
43        return (int) Math.ceil(-n * Math.log(p) / (Math.log(2) * Math.log(2)));
44    }
45
46    private static int optimalNumHashFunctions(int m, int n) {
47        return Math.max(1, (int) Math.round((double) m / n * Math.log(2)));
48    }
49
50    private int spread(int hash) {
51        hash ^= (hash >>> 16);
52        hash *= 0x85ebca6b;
53        hash ^= (hash >>> 13);
54        hash *= 0xc2b2ae35;
55        hash ^= (hash >>> 16);
56        return hash;
57    }
58
59    private int[] getIndices(T element) {
60        int[] indices = new int[numHashFunctions];
61        int hash1 = element.hashCode();
62        int hash2 = spread(hash1);
63
64        for (int i = 0; i < numHashFunctions; i++) {
65            int combinedHash = hash1 + i * hash2;
66            indices[i] = Math.abs(combinedHash % numBits);
67        }
68        return indices;
69    }
70
71    public void add(T element) {
72        // Prevent concurrent clear
73        clearLock.readLock().lock();
74        try {
75            int[] indices = getIndices(element);
76
77            // Find all segments we need to lock (sorted to prevent deadlock)
78            TreeSet<Integer> segmentsToLock = new TreeSet<>();
79            for (int index : indices) {
80                segmentsToLock.add(index / bitsPerSegment);
81            }
82
83            // Lock all segments in order
84            for (int segmentId : segmentsToLock) {
85                segments[segmentId].lock.writeLock().lock();
86            }
87
88            try {
89                // Set all bits
90                for (int index : indices) {
91                    int segmentId = index / bitsPerSegment;
92                    int localIndex = index % bitsPerSegment;
93                    segments[segmentId].bits.set(localIndex);
94                }
95                count.incrementAndGet();
96            } finally {
97                // Unlock in reverse order
98                for (int segmentId : segmentsToLock.descendingSet()) {
99                    segments[segmentId].lock.writeLock().unlock();
100                }
101            }
102        } finally {
103            clearLock.readLock().unlock();
104        }
105    }
106
107    public boolean mightContain(T element) {
108        clearLock.readLock().lock();
109        try {
110            int[] indices = getIndices(element);
111
112            // Find all segments we need to lock (sorted)
113            TreeSet<Integer> segmentsToLock = new TreeSet<>();
114            for (int index : indices) {
115                segmentsToLock.add(index / bitsPerSegment);
116            }
117
118            // Lock all segments in order (read locks)
119            for (int segmentId : segmentsToLock) {
120                segments[segmentId].lock.readLock().lock();
121            }
122
123            try {
124                // Check all bits
125                for (int index : indices) {
126                    int segmentId = index / bitsPerSegment;
127                    int localIndex = index % bitsPerSegment;
128                    if (!segments[segmentId].bits.get(localIndex)) {
129                        return false;
130                    }
131                }
132                return true;
133            } finally {
134                // Unlock in reverse order
135                for (int segmentId : segmentsToLock.descendingSet()) {
136                    segments[segmentId].lock.readLock().unlock();
137                }
138            }
139        } finally {
140            clearLock.readLock().unlock();
141        }
142    }
143
144    public void clear() {
145        // Exclusive lock prevents concurrent adds/queries
146        clearLock.writeLock().lock();
147        try {
148            for (Segment segment : segments) {
149                segment.bits.clear();
150            }
151            count.set(0);
152        } finally {
153            clearLock.writeLock().unlock();
154        }
155    }
156
157    public int approximateCount() {
158        return count.get();
159    }
160}
```

### Analysis

Property

Status

Explanation

Thread-safe

Yes

Segment locks + clear lock protect all operations

Deadlock-free

Yes

Always acquire segment locks in order

Read scalability

Good

Different elements often hit different segments

Add scalability

Good

Parallel adds on different segments

Complexity

Medium

Lock ordering logic, segment management

### Pros

*   Much better parallelism than global lock
*   Independent elements don't contend
*   Read-write locks allow concurrent queries within a segment

### Cons

*   Lock overhead for acquiring multiple segment locks
*   If k hash functions spread across many segments, locks become a bottleneck
*   Memory overhead for multiple locks

#### **When to Use:**

*   Moderate concurrency requirements
*   When elements tend to hash to similar regions
*   When simplicity of global lock isn't sufficient

# Approach 3: Lock-Free with AtomicLongArray

This approach eliminates locks entirely for `add()` and `mightContain()` operations using atomic bit manipulation.

### Key Insight: Idempotent Bit Setting

The crucial observation that enables lock-free Bloom filters:

**Setting a bit to 1 when it's already 1 is harmless.**

In other data structures, concurrent modifications cause lost updates:

*   HashMap: Two threads inserting can lose one entry
*   Counter: Two increments without synchronization can become one

But in a Bloom filter:

*   Thread 1 sets bit 5 to 1
*   Thread 2 sets bit 5 to 1
*   Result: bit 5 is 1

The bit is set regardless of who "wins." There are no lost updates because `1 OR 1 = 1`.

### No ABA Problem

The ABA problem occurs when a value changes from A → B → A, and a CAS operation incorrectly succeeds because it only sees the final A. Bloom filters are immune because bits only ever transition `0 → 1`, never back to 0 (except during `clear()`, which is exclusive).

### Implementation Using AtomicLongArray

We store bits in an array of `long` values, where each `long` holds 64 bits. This allows efficient atomic operations on groups of bits.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-u7ek9j4g5qk-1772709692727{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-u7ek9j4g5qk-1772709692727 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-u7ek9j4g5qk-1772709692727 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-u7ek9j4g5qk-1772709692727 .error-icon{fill:#000000;}#mermaid-u7ek9j4g5qk-1772709692727 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-u7ek9j4g5qk-1772709692727 .edge-thickness-normal{stroke-width:1px;}#mermaid-u7ek9j4g5qk-1772709692727 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-u7ek9j4g5qk-1772709692727 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-u7ek9j4g5qk-1772709692727 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-u7ek9j4g5qk-1772709692727 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-u7ek9j4g5qk-1772709692727 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-u7ek9j4g5qk-1772709692727 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-u7ek9j4g5qk-1772709692727 .marker.cross{stroke:#22c55e;}#mermaid-u7ek9j4g5qk-1772709692727 svg{font-family:inherit;font-size:16px;}#mermaid-u7ek9j4g5qk-1772709692727 p{margin:0;}#mermaid-u7ek9j4g5qk-1772709692727 .label{font-family:inherit;color:#f0fdf4;}#mermaid-u7ek9j4g5qk-1772709692727 .cluster-label text{fill:#fafafa;}#mermaid-u7ek9j4g5qk-1772709692727 .cluster-label span{color:#fafafa;}#mermaid-u7ek9j4g5qk-1772709692727 .cluster-label span p{background-color:transparent;}#mermaid-u7ek9j4g5qk-1772709692727 .label text,#mermaid-u7ek9j4g5qk-1772709692727 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-u7ek9j4g5qk-1772709692727 .node rect,#mermaid-u7ek9j4g5qk-1772709692727 .node circle,#mermaid-u7ek9j4g5qk-1772709692727 .node ellipse,#mermaid-u7ek9j4g5qk-1772709692727 .node polygon,#mermaid-u7ek9j4g5qk-1772709692727 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-u7ek9j4g5qk-1772709692727 .rough-node .label text,#mermaid-u7ek9j4g5qk-1772709692727 .node .label text,#mermaid-u7ek9j4g5qk-1772709692727 .image-shape .label,#mermaid-u7ek9j4g5qk-1772709692727 .icon-shape .label{text-anchor:middle;}#mermaid-u7ek9j4g5qk-1772709692727 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-u7ek9j4g5qk-1772709692727 .rough-node .label,#mermaid-u7ek9j4g5qk-1772709692727 .node .label,#mermaid-u7ek9j4g5qk-1772709692727 .image-shape .label,#mermaid-u7ek9j4g5qk-1772709692727 .icon-shape .label{text-align:center;}#mermaid-u7ek9j4g5qk-1772709692727 .node.clickable{cursor:pointer;}#mermaid-u7ek9j4g5qk-1772709692727 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-u7ek9j4g5qk-1772709692727 .arrowheadPath{fill:#0b0b0b;}#mermaid-u7ek9j4g5qk-1772709692727 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-u7ek9j4g5qk-1772709692727 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-u7ek9j4g5qk-1772709692727 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-u7ek9j4g5qk-1772709692727 .edgeLabel p{background-color:#0a0a0a;}#mermaid-u7ek9j4g5qk-1772709692727 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-u7ek9j4g5qk-1772709692727 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-u7ek9j4g5qk-1772709692727 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-u7ek9j4g5qk-1772709692727 .cluster text{fill:#fafafa;}#mermaid-u7ek9j4g5qk-1772709692727 .cluster span{color:#fafafa;}#mermaid-u7ek9j4g5qk-1772709692727 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-u7ek9j4g5qk-1772709692727 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-u7ek9j4g5qk-1772709692727 rect.text{fill:none;stroke-width:0;}#mermaid-u7ek9j4g5qk-1772709692727 .icon-shape,#mermaid-u7ek9j4g5qk-1772709692727 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-u7ek9j4g5qk-1772709692727 .icon-shape p,#mermaid-u7ek9j4g5qk-1772709692727 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-u7ek9j4g5qk-1772709692727 .icon-shape rect,#mermaid-u7ek9j4g5qk-1772709692727 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-u7ek9j4g5qk-1772709692727 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-u7ek9j4g5qk-1772709692727 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-u7ek9j4g5qk-1772709692727 :root{--mermaid-font-family:inherit;}#mermaid-u7ek9j4g5qk-1772709692727 .data>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-u7ek9j4g5qk-1772709692727 .data span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-u7ek9j4g5qk-1772709692727 .data tspan{fill:#000!important;}#mermaid-u7ek9j4g5qk-1772709692727 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-u7ek9j4g5qk-1772709692727 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-u7ek9j4g5qk-1772709692727 .orange tspan{fill:#000!important;}#mermaid-u7ek9j4g5qk-1772709692727 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-u7ek9j4g5qk-1772709692727 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-u7ek9j4g5qk-1772709692727 .primary tspan{fill:#000!important;}

Set bit 100

AtomicLongArray

long\[0\]  
bits 0-63

long\[1\]  
bits 64-127

long\[2\]  
bits 128-191

...

100 / 64 = 1  
100 % 64 = 36

mask = 1L << 36

CAS: long\[1\] |= mask

### Implementation

Java

```java
1import java.util.concurrent.atomic.AtomicLongArray;
2import java.util.concurrent.atomic.AtomicInteger;
3import java.util.concurrent.locks.ReentrantReadWriteLock;
4
5public class LockFreeBloomFilter<T> {
6    private final AtomicLongArray bits;
7    private final int numBits;
8    private final int numLongs;
9    private final int numHashFunctions;
10    private final AtomicInteger count;
11
12    // Only needed for clear() operation
13    private final ReentrantReadWriteLock clearLock = new ReentrantReadWriteLock();
14
15    public LockFreeBloomFilter(int expectedElements, double falsePositiveRate) {
16        this.numBits = optimalNumBits(expectedElements, falsePositiveRate);
17        this.numHashFunctions = optimalNumHashFunctions(numBits, expectedElements);
18        this.numLongs = (numBits + 63) / 64;  // Ceiling division
19        this.bits = new AtomicLongArray(numLongs);
20        this.count = new AtomicInteger(0);
21    }
22
23    private static int optimalNumBits(int n, double p) {
24        return (int) Math.ceil(-n * Math.log(p) / (Math.log(2) * Math.log(2)));
25    }
26
27    private static int optimalNumHashFunctions(int m, int n) {
28        return Math.max(1, (int) Math.round((double) m / n * Math.log(2)));
29    }
30
31    private int spread(int hash) {
32        hash ^= (hash >>> 16);
33        hash *= 0x85ebca6b;
34        hash ^= (hash >>> 13);
35        hash *= 0xc2b2ae35;
36        hash ^= (hash >>> 16);
37        return hash;
38    }
39
40    /**
41     * Set a single bit using CAS loop.
42     * Returns true if bit was actually changed (was 0, now 1).
43     */
44    private boolean setBit(int bitIndex) {
45        int longIndex = bitIndex / 64;
46        long mask = 1L << (bitIndex % 64);
47
48        while (true) {
49            long current = bits.get(longIndex);
50
51            // Bit already set - nothing to do
52            if ((current & mask) != 0) {
53                return false;
54            }
55
56            // Try to set the bit
57            long newValue = current | mask;
58            if (bits.compareAndSet(longIndex, current, newValue)) {
59                return true;
60            }
61            // CAS failed, another thread modified this long - retry
62        }
63    }
64
65    /**
66     * Check if a single bit is set.
67     * Uses volatile read for visibility.
68     */
69    private boolean getBit(int bitIndex) {
70        int longIndex = bitIndex / 64;
71        long mask = 1L << (bitIndex % 64);
72        return (bits.get(longIndex) & mask) != 0;
73    }
74
75    /**
76     * Add an element to the Bloom filter.
77     * Lock-free: uses CAS operations for each bit.
78     */
79    public void add(T element) {
80        // Prevent concurrent clear
81        clearLock.readLock().lock();
82        try {
83            int hash1 = element.hashCode();
84            int hash2 = spread(hash1);
85
86            for (int i = 0; i < numHashFunctions; i++) {
87                int combinedHash = hash1 + i * hash2;
88                int bitIndex = Math.abs(combinedHash % numBits);
89                setBit(bitIndex);
90            }
91            count.incrementAndGet();
92        } finally {
93            clearLock.readLock().unlock();
94        }
95    }
96
97    /**
98     * Check if an element might be in the filter.
99     * Completely lock-free: only reads.
100     */
101    public boolean mightContain(T element) {
102        // No lock needed for reads - just check bits
103        int hash1 = element.hashCode();
104        int hash2 = spread(hash1);
105
106        for (int i = 0; i < numHashFunctions; i++) {
107            int combinedHash = hash1 + i * hash2;
108            int bitIndex = Math.abs(combinedHash % numBits);
109            if (!getBit(bitIndex)) {
110                return false;
111            }
112        }
113        return true;
114    }
115
116    /**
117     * Clear the filter.
118     * Requires exclusive access - blocks all adds.
119     */
120    public void clear() {
121        clearLock.writeLock().lock();
122        try {
123            for (int i = 0; i < numLongs; i++) {
124                bits.set(i, 0L);
125            }
126            count.set(0);
127        } finally {
128            clearLock.writeLock().unlock();
129        }
130    }
131
132    public int approximateCount() {
133        return count.get();
134    }
135
136    /**
137     * Estimate population using bit counting.
138     * More accurate than count when many duplicates are added.
139     */
140    public double estimatedFillRatio() {
141        long setBits = 0;
142        for (int i = 0; i < numLongs; i++) {
143            setBits += Long.bitCount(bits.get(i));
144        }
145        return (double) setBits / numBits;
146    }
147
148    public double expectedFalsePositiveRate() {
149        double fillRatio = estimatedFillRatio();
150        return Math.pow(fillRatio, numHashFunctions);
151    }
152}
```

### CAS Loop Visualization

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-ih1c4yvpx0h-1772709692729{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-ih1c4yvpx0h-1772709692729 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-ih1c4yvpx0h-1772709692729 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-ih1c4yvpx0h-1772709692729 .error-icon{fill:#000000;}#mermaid-ih1c4yvpx0h-1772709692729 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-ih1c4yvpx0h-1772709692729 .edge-thickness-normal{stroke-width:1px;}#mermaid-ih1c4yvpx0h-1772709692729 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-ih1c4yvpx0h-1772709692729 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-ih1c4yvpx0h-1772709692729 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-ih1c4yvpx0h-1772709692729 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-ih1c4yvpx0h-1772709692729 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-ih1c4yvpx0h-1772709692729 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-ih1c4yvpx0h-1772709692729 .marker.cross{stroke:#22c55e;}#mermaid-ih1c4yvpx0h-1772709692729 svg{font-family:inherit;font-size:16px;}#mermaid-ih1c4yvpx0h-1772709692729 p{margin:0;}#mermaid-ih1c4yvpx0h-1772709692729 .label{font-family:inherit;color:#f0fdf4;}#mermaid-ih1c4yvpx0h-1772709692729 .cluster-label text{fill:#fafafa;}#mermaid-ih1c4yvpx0h-1772709692729 .cluster-label span{color:#fafafa;}#mermaid-ih1c4yvpx0h-1772709692729 .cluster-label span p{background-color:transparent;}#mermaid-ih1c4yvpx0h-1772709692729 .label text,#mermaid-ih1c4yvpx0h-1772709692729 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-ih1c4yvpx0h-1772709692729 .node rect,#mermaid-ih1c4yvpx0h-1772709692729 .node circle,#mermaid-ih1c4yvpx0h-1772709692729 .node ellipse,#mermaid-ih1c4yvpx0h-1772709692729 .node polygon,#mermaid-ih1c4yvpx0h-1772709692729 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-ih1c4yvpx0h-1772709692729 .rough-node .label text,#mermaid-ih1c4yvpx0h-1772709692729 .node .label text,#mermaid-ih1c4yvpx0h-1772709692729 .image-shape .label,#mermaid-ih1c4yvpx0h-1772709692729 .icon-shape .label{text-anchor:middle;}#mermaid-ih1c4yvpx0h-1772709692729 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-ih1c4yvpx0h-1772709692729 .rough-node .label,#mermaid-ih1c4yvpx0h-1772709692729 .node .label,#mermaid-ih1c4yvpx0h-1772709692729 .image-shape .label,#mermaid-ih1c4yvpx0h-1772709692729 .icon-shape .label{text-align:center;}#mermaid-ih1c4yvpx0h-1772709692729 .node.clickable{cursor:pointer;}#mermaid-ih1c4yvpx0h-1772709692729 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-ih1c4yvpx0h-1772709692729 .arrowheadPath{fill:#0b0b0b;}#mermaid-ih1c4yvpx0h-1772709692729 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-ih1c4yvpx0h-1772709692729 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-ih1c4yvpx0h-1772709692729 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-ih1c4yvpx0h-1772709692729 .edgeLabel p{background-color:#0a0a0a;}#mermaid-ih1c4yvpx0h-1772709692729 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-ih1c4yvpx0h-1772709692729 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-ih1c4yvpx0h-1772709692729 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-ih1c4yvpx0h-1772709692729 .cluster text{fill:#fafafa;}#mermaid-ih1c4yvpx0h-1772709692729 .cluster span{color:#fafafa;}#mermaid-ih1c4yvpx0h-1772709692729 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-ih1c4yvpx0h-1772709692729 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-ih1c4yvpx0h-1772709692729 rect.text{fill:none;stroke-width:0;}#mermaid-ih1c4yvpx0h-1772709692729 .icon-shape,#mermaid-ih1c4yvpx0h-1772709692729 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-ih1c4yvpx0h-1772709692729 .icon-shape p,#mermaid-ih1c4yvpx0h-1772709692729 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-ih1c4yvpx0h-1772709692729 .icon-shape rect,#mermaid-ih1c4yvpx0h-1772709692729 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-ih1c4yvpx0h-1772709692729 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-ih1c4yvpx0h-1772709692729 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-ih1c4yvpx0h-1772709692729 :root{--mermaid-font-family:inherit;}#mermaid-ih1c4yvpx0h-1772709692729 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-ih1c4yvpx0h-1772709692729 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-ih1c4yvpx0h-1772709692729 .primary tspan{fill:#000!important;}#mermaid-ih1c4yvpx0h-1772709692729 .op>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-ih1c4yvpx0h-1772709692729 .op span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-ih1c4yvpx0h-1772709692729 .op tspan{fill:#000!important;}#mermaid-ih1c4yvpx0h-1772709692729 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-ih1c4yvpx0h-1772709692729 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-ih1c4yvpx0h-1772709692729 .green tspan{fill:#000!important;}#mermaid-ih1c4yvpx0h-1772709692729 .orange>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-ih1c4yvpx0h-1772709692729 .orange span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-ih1c4yvpx0h-1772709692729 .orange tspan{fill:#000!important;}

Yes

No

Yes

No

setBit(100)

Read current = bits\[1\]

Bit already set?  
(current & mask) != 0

Return false  
(no change needed)

new = current | mask

CAS(current, new)  
succeeds?

Return true  
(bit was set)

Another thread modified  
Retry from read

### Memory Ordering Considerations

For Bloom filters, we can use relaxed memory ordering for most operations:

Operation

Memory Order

Rationale

Read for mightContain

acquire

See writes from other threads

CAS in setBit

release on success

Make bit visible to readers

count increment

relaxed

Approximate count, exact value not critical

clear() writes

relaxed

Protected by exclusive lock

The key insight: eventual visibility is acceptable. If a reader doesn't immediately see a just-set bit, the query returns "not present" for an in-progress insert. This is a valid linearization.

### Analysis

Property

Status

Explanation

Thread-safe

Yes

CAS ensures atomicity, no ABA problem

Lock-free (add)

Yes

CAS loop always makes progress

Wait-free (query)

Yes

No loops, just reads

Deadlock-free

Yes

No locks for normal operations

Memory overhead

Low

Just AtomicLongArray

### Pros

*   Maximum throughput for add and query
*   Queries are wait-free (no CAS needed)
*   Scales linearly with cores
*   Simple implementation

### Cons

*   Still needs lock for clear() operation
*   Slightly higher latency per add (CAS can retry)
*   Requires understanding of memory ordering

#### **When to Use:**

*   High-throughput systems (millions of ops/sec)
*   When clear() is rare or non-existent
*   When lock contention is measured bottleneck

# Solution Comparison

Aspect

Synchronized

Segmented

Lock-Free

**Add throughput**

Low

Medium

High

**Query throughput**

Low

Medium

Very High

**Add latency (avg)**

Low

Low

Very Low

**Add latency (p99)**

High (contention)

Medium

Low

**Query latency**

Low

Low

Minimal

**Memory overhead**

None

Locks per segment

None

**Implementation complexity**

Low

Medium

Medium

**clear() support**

Easy

Easy

Requires lock

### Decision Flowchart

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-ggaxnif0cu5-1772709692730{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-ggaxnif0cu5-1772709692730 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-ggaxnif0cu5-1772709692730 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-ggaxnif0cu5-1772709692730 .error-icon{fill:#000000;}#mermaid-ggaxnif0cu5-1772709692730 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-ggaxnif0cu5-1772709692730 .edge-thickness-normal{stroke-width:1px;}#mermaid-ggaxnif0cu5-1772709692730 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-ggaxnif0cu5-1772709692730 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-ggaxnif0cu5-1772709692730 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-ggaxnif0cu5-1772709692730 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-ggaxnif0cu5-1772709692730 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-ggaxnif0cu5-1772709692730 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-ggaxnif0cu5-1772709692730 .marker.cross{stroke:#22c55e;}#mermaid-ggaxnif0cu5-1772709692730 svg{font-family:inherit;font-size:16px;}#mermaid-ggaxnif0cu5-1772709692730 p{margin:0;}#mermaid-ggaxnif0cu5-1772709692730 .label{font-family:inherit;color:#f0fdf4;}#mermaid-ggaxnif0cu5-1772709692730 .cluster-label text{fill:#fafafa;}#mermaid-ggaxnif0cu5-1772709692730 .cluster-label span{color:#fafafa;}#mermaid-ggaxnif0cu5-1772709692730 .cluster-label span p{background-color:transparent;}#mermaid-ggaxnif0cu5-1772709692730 .label text,#mermaid-ggaxnif0cu5-1772709692730 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-ggaxnif0cu5-1772709692730 .node rect,#mermaid-ggaxnif0cu5-1772709692730 .node circle,#mermaid-ggaxnif0cu5-1772709692730 .node ellipse,#mermaid-ggaxnif0cu5-1772709692730 .node polygon,#mermaid-ggaxnif0cu5-1772709692730 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-ggaxnif0cu5-1772709692730 .rough-node .label text,#mermaid-ggaxnif0cu5-1772709692730 .node .label text,#mermaid-ggaxnif0cu5-1772709692730 .image-shape .label,#mermaid-ggaxnif0cu5-1772709692730 .icon-shape .label{text-anchor:middle;}#mermaid-ggaxnif0cu5-1772709692730 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-ggaxnif0cu5-1772709692730 .rough-node .label,#mermaid-ggaxnif0cu5-1772709692730 .node .label,#mermaid-ggaxnif0cu5-1772709692730 .image-shape .label,#mermaid-ggaxnif0cu5-1772709692730 .icon-shape .label{text-align:center;}#mermaid-ggaxnif0cu5-1772709692730 .node.clickable{cursor:pointer;}#mermaid-ggaxnif0cu5-1772709692730 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-ggaxnif0cu5-1772709692730 .arrowheadPath{fill:#0b0b0b;}#mermaid-ggaxnif0cu5-1772709692730 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-ggaxnif0cu5-1772709692730 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-ggaxnif0cu5-1772709692730 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-ggaxnif0cu5-1772709692730 .edgeLabel p{background-color:#0a0a0a;}#mermaid-ggaxnif0cu5-1772709692730 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-ggaxnif0cu5-1772709692730 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-ggaxnif0cu5-1772709692730 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-ggaxnif0cu5-1772709692730 .cluster text{fill:#fafafa;}#mermaid-ggaxnif0cu5-1772709692730 .cluster span{color:#fafafa;}#mermaid-ggaxnif0cu5-1772709692730 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-ggaxnif0cu5-1772709692730 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-ggaxnif0cu5-1772709692730 rect.text{fill:none;stroke-width:0;}#mermaid-ggaxnif0cu5-1772709692730 .icon-shape,#mermaid-ggaxnif0cu5-1772709692730 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-ggaxnif0cu5-1772709692730 .icon-shape p,#mermaid-ggaxnif0cu5-1772709692730 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-ggaxnif0cu5-1772709692730 .icon-shape rect,#mermaid-ggaxnif0cu5-1772709692730 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-ggaxnif0cu5-1772709692730 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-ggaxnif0cu5-1772709692730 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-ggaxnif0cu5-1772709692730 :root{--mermaid-font-family:inherit;}#mermaid-ggaxnif0cu5-1772709692730 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-ggaxnif0cu5-1772709692730 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-ggaxnif0cu5-1772709692730 .primary tspan{fill:#000!important;}#mermaid-ggaxnif0cu5-1772709692730 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-ggaxnif0cu5-1772709692730 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-ggaxnif0cu5-1772709692730 .orange tspan{fill:#000!important;}#mermaid-ggaxnif0cu5-1772709692730 .green>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-ggaxnif0cu5-1772709692730 .green span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-ggaxnif0cu5-1772709692730 .green tspan{fill:#000!important;}#mermaid-ggaxnif0cu5-1772709692730 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-ggaxnif0cu5-1772709692730 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-ggaxnif0cu5-1772709692730 .purple tspan{fill:#000!important;}

< 100K

\> 100K

Yes

No

No

Yes

Choose Bloom Filter Implementation

Expected ops/sec?

Need frequent clear()?

Team comfortable  
with atomics?

Synchronized  
(Simple baseline)

Segmented  
(Balanced)

Lock-Free  
(Maximum performance)

### Recommendation

For most high-performance use cases, the lock-free implementation is the best choice:

1.  Queries are completely wait-free
2.  Adds use lightweight CAS operations
3.  No lock contention under load
4.  Simple to implement correctly (idempotent bit-setting)

Use synchronized or segmented approaches only when:

*   Throughput requirements are modest (< 100K ops/sec)
*   Frequent clear() operations are needed
*   Team is unfamiliar with lock-free programming

# Complete Implementation

This section provides a production-ready lock-free Bloom filter with all features.

Java

```java
1import java.util.concurrent.atomic.AtomicLongArray;
2import java.util.concurrent.atomic.AtomicLong;
3import java.util.concurrent.locks.ReentrantReadWriteLock;
4
5/**
6 * Thread-safe Bloom filter using lock-free operations for add and query.
7 *
8 * Thread Safety:
9 * - add(): Lock-free using CAS on AtomicLongArray
10 * - mightContain(): Wait-free, only reads
11 * - clear(): Requires exclusive lock
12 *
13 * False Positive Rate:
14 * - Configurable via constructor
15 * - Use expectedFalsePositiveRate() to monitor actual rate
16 *
17 * Performance:
18 * - add(): O(k) where k = number of hash functions
19 * - mightContain(): O(k)
20 * - Scales linearly with cores for add/query operations
21 */
22public class ConcurrentBloomFilter<T> {
23    private final AtomicLongArray bits;
24    private final int numBits;
25    private final int numLongs;
26    private final int numHashFunctions;
27    private final AtomicLong addCount;
28    private final double targetFalsePositiveRate;
29    private final int expectedElements;
30
31    private final ReentrantReadWriteLock clearLock = new ReentrantReadWriteLock();
32
33    /**
34     * Create a Bloom filter with specified capacity and false positive rate.
35     *
36     * @param expectedElements Expected number of elements to add
37     * @param falsePositiveRate Desired false positive probability (0.0 to 1.0)
38     */
39    public ConcurrentBloomFilter(int expectedElements, double falsePositiveRate) {
40        if (expectedElements <= 0) {
41            throw new IllegalArgumentException("Expected elements must be positive");
42        }
43        if (falsePositiveRate <= 0 || falsePositiveRate >= 1) {
44            throw new IllegalArgumentException("False positive rate must be between 0 and 1");
45        }
46
47        this.expectedElements = expectedElements;
48        this.targetFalsePositiveRate = falsePositiveRate;
49        this.numBits = optimalNumBits(expectedElements, falsePositiveRate);
50        this.numHashFunctions = optimalNumHashFunctions(numBits, expectedElements);
51        this.numLongs = (numBits + 63) / 64;
52        this.bits = new AtomicLongArray(numLongs);
53        this.addCount = new AtomicLong(0);
54    }
55
56    /**
57     * Calculate optimal number of bits.
58     * Formula: m = -n * ln(p) / (ln(2)^2)
59     */
60    private static int optimalNumBits(int n, double p) {
61        long m = (long) Math.ceil(-n * Math.log(p) / (Math.log(2) * Math.log(2)));
62        // Cap at Integer.MAX_VALUE (2GB bit array)
63        return (int) Math.min(m, Integer.MAX_VALUE);
64    }
65
66    /**
67     * Calculate optimal number of hash functions.
68     * Formula: k = (m/n) * ln(2)
69     */
70    private static int optimalNumHashFunctions(int m, int n) {
71        return Math.max(1, (int) Math.round((double) m / n * Math.log(2)));
72    }
73
74    /**
75     * Spread hash bits for better distribution.
76     * Based on MurmurHash3 finalizer.
77     */
78    private int spread(int hash) {
79        hash ^= (hash >>> 16);
80        hash *= 0x85ebca6b;
81        hash ^= (hash >>> 13);
82        hash *= 0xc2b2ae35;
83        hash ^= (hash >>> 16);
84        return hash;
85    }
86
87    /**
88     * Set a bit using CAS loop.
89     * Lock-free: always makes progress.
90     */
91    private void setBit(int bitIndex) {
92        int longIndex = bitIndex / 64;
93        long mask = 1L << (bitIndex % 64);
94
95        while (true) {
96            long current = bits.get(longIndex);
97
98            // Already set - we're done
99            if ((current & mask) != 0) {
100                return;
101            }
102
103            // Try to set the bit
104            if (bits.compareAndSet(longIndex, current, current | mask)) {
105                return;
106            }
107            // CAS failed, retry
108        }
109    }
110
111    /**
112     * Check if a bit is set.
113     * Wait-free: single read.
114     */
115    private boolean getBit(int bitIndex) {
116        int longIndex = bitIndex / 64;
117        long mask = 1L << (bitIndex % 64);
118        return (bits.get(longIndex) & mask) != 0;
119    }
120
121    /**
122     * Add an element to the Bloom filter.
123     * Lock-free operation using CAS.
124     *
125     * @param element Element to add (must not be null)
126     * @return true always (Bloom filters don't track duplicates)
127     */
128    public boolean add(T element) {
129        if (element == null) {
130            throw new NullPointerException("Element cannot be null");
131        }
132
133        clearLock.readLock().lock();
134        try {
135            int hash1 = element.hashCode();
136            int hash2 = spread(hash1);
137
138            for (int i = 0; i < numHashFunctions; i++) {
139                int combinedHash = hash1 + i * hash2;
140                int bitIndex = Math.abs(combinedHash % numBits);
141                setBit(bitIndex);
142            }
143            addCount.incrementAndGet();
144            return true;
145        } finally {
146            clearLock.readLock().unlock();
147        }
148    }
149
150    /**
151     * Check if element might be in the filter.
152     * Wait-free operation - no locks, no CAS.
153     *
154     * @param element Element to check
155     * @return false if definitely not present, true if possibly present
156     */
157    public boolean mightContain(T element) {
158        if (element == null) {
159            return false;
160        }
161
162        int hash1 = element.hashCode();
163        int hash2 = spread(hash1);
164
165        for (int i = 0; i < numHashFunctions; i++) {
166            int combinedHash = hash1 + i * hash2;
167            int bitIndex = Math.abs(combinedHash % numBits);
168            if (!getBit(bitIndex)) {
169                return false;
170            }
171        }
172        return true;
173    }
174
175    /**
176     * Clear the filter, removing all elements.
177     * Requires exclusive access - blocks all adds.
178     */
179    public void clear() {
180        clearLock.writeLock().lock();
181        try {
182            for (int i = 0; i < numLongs; i++) {
183                bits.set(i, 0L);
184            }
185            addCount.set(0);
186        } finally {
187            clearLock.writeLock().unlock();
188        }
189    }
190
191    /**
192     * Get the number of add() calls.
193     * May include duplicates.
194     */
195    public long approximateCount() {
196        return addCount.get();
197    }
198
199    /**
200     * Estimate the fill ratio (fraction of bits set to 1).
201     */
202    public double fillRatio() {
203        long setBits = 0;
204        for (int i = 0; i < numLongs; i++) {
205            setBits += Long.bitCount(bits.get(i));
206        }
207        return (double) setBits / numBits;
208    }
209
210    /**
211     * Estimate current false positive rate based on fill ratio.
212     */
213    public double expectedFalsePositiveRate() {
214        double fillRatio = fillRatio();
215        return Math.pow(fillRatio, numHashFunctions);
216    }
217
218    /**
219     * Estimate number of unique elements added.
220     * Uses the formula: n* = -m/k * ln(1 - X/m)
221     * where X is number of bits set.
222     */
223    public long estimatedSize() {
224        long setBits = 0;
225        for (int i = 0; i < numLongs; i++) {
226            setBits += Long.bitCount(bits.get(i));
227        }
228
229        if (setBits == 0) return 0;
230        if (setBits >= numBits) return expectedElements;  // Saturated
231
232        double ratio = (double) setBits / numBits;
233        return (long) (-numBits / (double) numHashFunctions * Math.log(1 - ratio));
234    }
235
236    /**
237     * Check if filter is saturated (too many elements added).
238     * Consider creating a new filter if this returns true.
239     */
240    public boolean isSaturated() {
241        return expectedFalsePositiveRate() > targetFalsePositiveRate * 2;
242    }
243
244    // Getters for configuration
245    public int getNumBits() { return numBits; }
246    public int getNumHashFunctions() { return numHashFunctions; }
247    public int getExpectedElements() { return expectedElements; }
248    public double getTargetFalsePositiveRate() { return targetFalsePositiveRate; }
249}
```

## Demo

Java

```java
1import java.util.concurrent.*;
2import java.util.concurrent.atomic.*;
3import java.util.*;
4
5public class ConcurrentBloomFilterDemo {
6    public static void main(String[] args) throws InterruptedException {
7        // Create filter for 1 million elements with 1% false positive rate
8        ConcurrentBloomFilter<String> filter = new ConcurrentBloomFilter<>(1_000_000, 0.01);
9
10        System.out.println("=== Bloom Filter Configuration ===");
11        System.out.println("Expected elements: " + filter.getExpectedElements());
12        System.out.println("Bits: " + filter.getNumBits());
13        System.out.println("Hash functions: " + filter.getNumHashFunctions());
14        System.out.println("Target FPR: " + filter.getTargetFalsePositiveRate());
15
16        // Concurrent stress test
17        int numThreads = 8;
18        int opsPerThread = 100_000;
19        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
20
21        CountDownLatch startLatch = new CountDownLatch(1);
22        CountDownLatch doneLatch = new CountDownLatch(numThreads);
23
24        AtomicInteger addCount = new AtomicInteger(0);
25        AtomicInteger queryCount = new AtomicInteger(0);
26        AtomicInteger truePositives = new AtomicInteger(0);
27        AtomicInteger falsePositives = new AtomicInteger(0);
28
29        // Track which items were actually added
30        ConcurrentHashMap<String, Boolean> added = new ConcurrentHashMap<>();
31
32        for (int t = 0; t < numThreads; t++) {
33            final int threadId = t;
34            executor.submit(() -> {
35                try {
36                    startLatch.await();
37                    ThreadLocalRandom rand = ThreadLocalRandom.current();
38
39                    for (int i = 0; i < opsPerThread; i++) {
40                        int op = rand.nextInt(100);
41
42                        if (op < 60) {
43                            // 60% adds
44                            String item = "item-" + rand.nextInt(500_000);
45                            filter.add(item);
46                            added.put(item, true);
47                            addCount.incrementAndGet();
48                        } else {
49                            // 40% queries
50                            String item = "item-" + rand.nextInt(1_000_000);
51                            boolean result = filter.mightContain(item);
52                            queryCount.incrementAndGet();
53
54                            if (result) {
55                                if (added.containsKey(item)) {
56                                    truePositives.incrementAndGet();
57                                } else {
58                                    falsePositives.incrementAndGet();
59                                }
60                            }
61                        }
62                    }
63                } catch (InterruptedException e) {
64                    Thread.currentThread().interrupt();
65                } finally {
66                    doneLatch.countDown();
67                }
68            });
69        }
70
71        System.out.println("\n=== Running Concurrent Stress Test ===");
72        long startTime = System.nanoTime();
73        startLatch.countDown();
74        doneLatch.await();
75        long endTime = System.nanoTime();
76
77        executor.shutdown();
78
79        double seconds = (endTime - startTime) / 1_000_000_000.0;
80        int totalOps = addCount.get() + queryCount.get();
81
82        System.out.println("\n=== Results ===");
83        System.out.println("Threads: " + numThreads);
84        System.out.println("Adds: " + addCount.get());
85        System.out.println("Queries: " + queryCount.get());
86        System.out.println("True positives: " + truePositives.get());
87        System.out.println("False positives: " + falsePositives.get());
88        System.out.printf("Time: %.2f seconds%n", seconds);
89        System.out.printf("Throughput: %.2f M ops/sec%n", totalOps / seconds / 1_000_000);
90
91        System.out.println("\n=== Filter Statistics ===");
92        System.out.println("Approximate count: " + filter.approximateCount());
93        System.out.println("Estimated unique items: " + filter.estimatedSize());
94        System.out.println("Actual unique items: " + added.size());
95        System.out.printf("Fill ratio: %.2f%%%n", filter.fillRatio() * 100);
96        System.out.printf("Expected FPR: %.4f%%%n", filter.expectedFalsePositiveRate() * 100);
97
98        int positiveQueries = truePositives.get() + falsePositives.get();
99        if (positiveQueries > 0) {
100            double observedFPR = (double) falsePositives.get() /
101                                 (falsePositives.get() + (queryCount.get() - truePositives.get() - falsePositives.get()));
102            System.out.printf("Observed FPR (approx): %.4f%%%n", observedFPR * 100);
103        }
104
105        System.out.println("Saturated: " + filter.isSaturated());
106
107        // Correctness verification
108        System.out.println("\n=== Verification ===");
109        int falseNegatives = 0;
110        for (String item : added.keySet()) {
111            if (!filter.mightContain(item)) {
112                falseNegatives++;
113            }
114        }
115        System.out.println("False negatives: " + falseNegatives);
116        System.out.println(falseNegatives == 0 ? "PASSED - No false negatives" : "FAILED - False negatives detected!");
117    }
118}
```

**Expected Output:**

```shell
1=== Bloom Filter Configuration ===
2Expected elements: 1000000
3Bits: 9585059
4Hash functions: 7
5Target FPR: 0.01
6
7=== Running Concurrent Stress Test ===
8
9=== Results ===
10Threads: 8
11Adds: 479823
12Queries: 320177
13True positives: 95234
14False positives: 2876
15Time: 0.31 seconds
16Throughput: 2.58 M ops/sec
17
18=== Filter Statistics ===
19Approximate count: 479823
20Estimated unique items: 321456
21Actual unique items: 321398
22Fill ratio: 20.12%
23Expected FPR: 0.0013%
24Observed FPR (approx): 1.28%
25Saturated: false
26
27=== Verification ===
28False negatives: 0
29PASSED - No false negatives
```

Launching soon
