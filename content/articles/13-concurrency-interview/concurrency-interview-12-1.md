---
title: "Design Concurrent HashMap"
description: "Design Concurrent HashMap - Concurrency Interview Module 12"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Design Concurrent HashMap

A hash map is one of the most used data structures in real systems, and making it work correctly under concurrency is harder than it looks.

Multiple threads can insert, remove, and resize at the same time, and a naive lock around the whole map quickly becomes a bottleneck. The goal of a concurrent hash map is to provide safe, scalable access with high throughput under contention.

In this chapter, we will design a concurrent hash map step by step. We will start with a simple coarse-grained lock, then evolve toward finer-grained locking and CAS based approach.

# Problem Statement

### What We're Building

A thread-safe HashMap that allows multiple threads to read and write concurrently without corrupting data or losing updates. The goal is to maximize throughput by allowing independent operations to proceed in parallel while maintaining correctness guarantees.

### Required Operations

Operation

Description

Expected Complexity

`put(key, value)`

Insert or update a key-value pair

O(1) average

`get(key)`

Retrieve value for a key

O(1) average

`remove(key)`

Delete a key-value pair

O(1) average

`putIfAbsent(key, value)`

Insert only if key doesn't exist

O(1) average

`computeIfAbsent(key, func)`

Compute and insert if key missing

O(1) average

`size()`

Return number of entries

O(1) or O(segments)

### Thread-Safety Requirements

*   Multiple threads can call `get()` simultaneously without blocking each other
*   Multiple threads can call `put()` on different keys simultaneously
*   Operations on the same key must be serialized to prevent lost updates
*   Compound operations like `putIfAbsent()` must be atomic
*   No thread should see partially constructed entries
*   Iterators should be weakly consistent (no ConcurrentModificationException)

# Data Structure Fundamentals

Before adding concurrency, let's understand how a single-threaded HashMap works. This baseline is essential because concurrent solutions must preserve these mechanics while adding thread safety.

### Core Concepts

1.  **Bucket Array:** A HashMap stores entries in an array of "buckets." Each bucket holds entries that hash to the same index.
2.  **Hash Function:** Keys are converted to array indices using `hash(key) % capacity`. A good hash function distributes keys uniformly across buckets.
3.  **Collision Handling (Chaining):** When multiple keys hash to the same bucket, entries are stored in a linked list (or tree for large buckets in Java 8+).
4.  **Load Factor:** The ratio of entries to buckets. When it exceeds a threshold (typically 0.75), the table resizes to maintain O(1) performance.

### Single-Threaded Implementation

Java

```java
1public class SimpleHashMap<K, V> {
2    private static final int DEFAULT_CAPACITY = 16;
3    private static final float LOAD_FACTOR = 0.75f;
4
5    private Node<K, V>[] table;
6    private int size;
7
8    static class Node<K, V> {
9        final int hash;
10        final K key;
11        V value;
12        Node<K, V> next;
13
14        Node(int hash, K key, V value, Node<K, V> next) {
15            this.hash = hash;
16            this.key = key;
17            this.value = value;
18            this.next = next;
19        }
20    }
21
22    @SuppressWarnings("unchecked")
23    public SimpleHashMap() {
24        table = new Node[DEFAULT_CAPACITY];
25    }
26
27    public V put(K key, V value) {
28        int hash = hash(key);
29        int index = hash & (table.length - 1);
30
31        // Check if key exists
32        for (Node<K, V> node = table[index]; node != null; node = node.next) {
33            if (node.hash == hash && key.equals(node.key)) {
34                V oldValue = node.value;
35                node.value = value;
36                return oldValue;
37            }
38        }
39
40        // Add new node at head of chain
41        table[index] = new Node<>(hash, key, value, table[index]);
42        if (++size > table.length * LOAD_FACTOR) {
43            resize();
44        }
45        return null;
46    }
47
48    public V get(K key) {
49        int hash = hash(key);
50        int index = hash & (table.length - 1);
51
52        for (Node<K, V> node = table[index]; node != null; node = node.next) {
53            if (node.hash == hash && key.equals(node.key)) {
54                return node.value;
55            }
56        }
57        return null;
58    }
59
60    private int hash(K key) {
61        int h = key.hashCode();
62        return h ^ (h >>> 16);  // Spread higher bits
63    }
64
65    private void resize() { /* Double capacity and rehash */ }
66}
```

### Internal Structure

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-3ae9bxqxi97-1772709692688{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-3ae9bxqxi97-1772709692688 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-3ae9bxqxi97-1772709692688 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-3ae9bxqxi97-1772709692688 .error-icon{fill:#000000;}#mermaid-3ae9bxqxi97-1772709692688 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-3ae9bxqxi97-1772709692688 .edge-thickness-normal{stroke-width:1px;}#mermaid-3ae9bxqxi97-1772709692688 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-3ae9bxqxi97-1772709692688 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-3ae9bxqxi97-1772709692688 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-3ae9bxqxi97-1772709692688 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-3ae9bxqxi97-1772709692688 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-3ae9bxqxi97-1772709692688 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-3ae9bxqxi97-1772709692688 .marker.cross{stroke:#22c55e;}#mermaid-3ae9bxqxi97-1772709692688 svg{font-family:inherit;font-size:16px;}#mermaid-3ae9bxqxi97-1772709692688 p{margin:0;}#mermaid-3ae9bxqxi97-1772709692688 .label{font-family:inherit;color:#f0fdf4;}#mermaid-3ae9bxqxi97-1772709692688 .cluster-label text{fill:#fafafa;}#mermaid-3ae9bxqxi97-1772709692688 .cluster-label span{color:#fafafa;}#mermaid-3ae9bxqxi97-1772709692688 .cluster-label span p{background-color:transparent;}#mermaid-3ae9bxqxi97-1772709692688 .label text,#mermaid-3ae9bxqxi97-1772709692688 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-3ae9bxqxi97-1772709692688 .node rect,#mermaid-3ae9bxqxi97-1772709692688 .node circle,#mermaid-3ae9bxqxi97-1772709692688 .node ellipse,#mermaid-3ae9bxqxi97-1772709692688 .node polygon,#mermaid-3ae9bxqxi97-1772709692688 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-3ae9bxqxi97-1772709692688 .rough-node .label text,#mermaid-3ae9bxqxi97-1772709692688 .node .label text,#mermaid-3ae9bxqxi97-1772709692688 .image-shape .label,#mermaid-3ae9bxqxi97-1772709692688 .icon-shape .label{text-anchor:middle;}#mermaid-3ae9bxqxi97-1772709692688 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-3ae9bxqxi97-1772709692688 .rough-node .label,#mermaid-3ae9bxqxi97-1772709692688 .node .label,#mermaid-3ae9bxqxi97-1772709692688 .image-shape .label,#mermaid-3ae9bxqxi97-1772709692688 .icon-shape .label{text-align:center;}#mermaid-3ae9bxqxi97-1772709692688 .node.clickable{cursor:pointer;}#mermaid-3ae9bxqxi97-1772709692688 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-3ae9bxqxi97-1772709692688 .arrowheadPath{fill:#0b0b0b;}#mermaid-3ae9bxqxi97-1772709692688 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-3ae9bxqxi97-1772709692688 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-3ae9bxqxi97-1772709692688 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-3ae9bxqxi97-1772709692688 .edgeLabel p{background-color:#0a0a0a;}#mermaid-3ae9bxqxi97-1772709692688 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-3ae9bxqxi97-1772709692688 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-3ae9bxqxi97-1772709692688 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-3ae9bxqxi97-1772709692688 .cluster text{fill:#fafafa;}#mermaid-3ae9bxqxi97-1772709692688 .cluster span{color:#fafafa;}#mermaid-3ae9bxqxi97-1772709692688 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-3ae9bxqxi97-1772709692688 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-3ae9bxqxi97-1772709692688 rect.text{fill:none;stroke-width:0;}#mermaid-3ae9bxqxi97-1772709692688 .icon-shape,#mermaid-3ae9bxqxi97-1772709692688 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-3ae9bxqxi97-1772709692688 .icon-shape p,#mermaid-3ae9bxqxi97-1772709692688 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-3ae9bxqxi97-1772709692688 .icon-shape rect,#mermaid-3ae9bxqxi97-1772709692688 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-3ae9bxqxi97-1772709692688 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-3ae9bxqxi97-1772709692688 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-3ae9bxqxi97-1772709692688 :root{--mermaid-font-family:inherit;}#mermaid-3ae9bxqxi97-1772709692688 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-3ae9bxqxi97-1772709692688 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-3ae9bxqxi97-1772709692688 .primary tspan{fill:#000!important;}#mermaid-3ae9bxqxi97-1772709692688 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-3ae9bxqxi97-1772709692688 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-3ae9bxqxi97-1772709692688 .purple tspan{fill:#000!important;}#mermaid-3ae9bxqxi97-1772709692688 .secondary>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-3ae9bxqxi97-1772709692688 .secondary span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-3ae9bxqxi97-1772709692688 .secondary tspan{fill:#000!important;}

Bucket Array (capacity=8)

Bucket 0

Bucket 1

Bucket 2

Bucket 3

Bucket 4

Bucket 5

Bucket 6

Bucket 7

Node  
key=A  
hash=2

Node  
key=I  
hash=10

null

Node  
key=E  
hash=5

null

Node  
key=G  
hash=7

Node  
key=O  
hash=15

null

The diagram shows a HashMap with 8 buckets. Keys A and I both hash to bucket 2 (hash % 8 = 2), forming a chain. Keys G and O share bucket 7. Empty buckets (0, 1, 3, 4, 6) contain null. This chaining approach handles collisions but creates the first concurrency challenge: two threads modifying the same chain can corrupt it.

# Concurrency Challenges

Before diving into solutions, let's understand what makes HashMap challenging to parallelize. These challenges will guide our design decisions.

### Challenge 1: Race Condition on Put

Consider two threads inserting keys that hash to the same bucket.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Thread 2HashMap Bucket 3Thread 1Thread 2HashMap Bucket 3Thread 1#mermaid-3955pvfealj-1772709692696{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-3955pvfealj-1772709692696 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-3955pvfealj-1772709692696 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-3955pvfealj-1772709692696 .error-icon{fill:#000000;}#mermaid-3955pvfealj-1772709692696 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-3955pvfealj-1772709692696 .edge-thickness-normal{stroke-width:1px;}#mermaid-3955pvfealj-1772709692696 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-3955pvfealj-1772709692696 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-3955pvfealj-1772709692696 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-3955pvfealj-1772709692696 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-3955pvfealj-1772709692696 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-3955pvfealj-1772709692696 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-3955pvfealj-1772709692696 .marker.cross{stroke:#22c55e;}#mermaid-3955pvfealj-1772709692696 svg{font-family:inherit;font-size:16px;}#mermaid-3955pvfealj-1772709692696 p{margin:0;}#mermaid-3955pvfealj-1772709692696 .actor{stroke:#22c55e;fill:transparent;}#mermaid-3955pvfealj-1772709692696 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-3955pvfealj-1772709692696 .actor-line{stroke:#22c55e;}#mermaid-3955pvfealj-1772709692696 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-3955pvfealj-1772709692696 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-3955pvfealj-1772709692696 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-3955pvfealj-1772709692696 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-3955pvfealj-1772709692696 .sequenceNumber{fill:#f0fdf4;}#mermaid-3955pvfealj-1772709692696 #sequencenumber{fill:#fafafa;}#mermaid-3955pvfealj-1772709692696 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-3955pvfealj-1772709692696 .messageText{fill:#fafafa;stroke:none;}#mermaid-3955pvfealj-1772709692696 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-3955pvfealj-1772709692696 .labelText,#mermaid-3955pvfealj-1772709692696 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-3955pvfealj-1772709692696 .loopText,#mermaid-3955pvfealj-1772709692696 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-3955pvfealj-1772709692696 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-3955pvfealj-1772709692696 .note{stroke:#f59e0b;fill:#422006;}#mermaid-3955pvfealj-1772709692696 .noteText,#mermaid-3955pvfealj-1772709692696 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-3955pvfealj-1772709692696 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-3955pvfealj-1772709692696 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-3955pvfealj-1772709692696 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-3955pvfealj-1772709692696 .actorPopupMenu{position:absolute;}#mermaid-3955pvfealj-1772709692696 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-3955pvfealj-1772709692696 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-3955pvfealj-1772709692696 .actor-man circle,#mermaid-3955pvfealj-1772709692696 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-3955pvfealj-1772709692696 :root{--mermaid-font-family:inherit;}Bucket 3 = \[X\]head = Xhead = XBucket 3 = \[A → X\]Bucket 3 = \[B → X\]A is lost!Read head of bucket 3Read head of bucket 3Insert A (A.next = X)Insert B (B.next = X)

Both threads read the same head pointer (X). Thread 1 inserts A pointing to X. Thread 2 then overwrites the bucket head with B pointing to X. Node A is orphaned, and its entry is silently lost. This is a classic lost update problem.

### Challenge 2: Read-Modify-Write Without Atomicity

The `put` operation is inherently a read-modify-write sequence:

1.  **Read:** Find the bucket, traverse to check if key exists
2.  **Modify:** Either update existing node's value or create new node
3.  **Write:** Update bucket head or node pointer

Without atomicity, another thread can interleave between steps 1 and 3, causing:

*   Lost updates (as shown above)
*   Duplicate entries for the same key
*   Corrupted linked list structure (cycles or broken chains)

### Challenge 3: Resize Hazards

When the load factor threshold is exceeded, the table must double in capacity and rehash all entries. This is dangerous during concurrent access:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Thread 2 (Get)HashMapThread 1 (Resize)Thread 2 (Get)HashMapThread 1 (Resize)#mermaid-tt7e3lr1lc9-1772709692698{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-tt7e3lr1lc9-1772709692698 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-tt7e3lr1lc9-1772709692698 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-tt7e3lr1lc9-1772709692698 .error-icon{fill:#000000;}#mermaid-tt7e3lr1lc9-1772709692698 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-tt7e3lr1lc9-1772709692698 .edge-thickness-normal{stroke-width:1px;}#mermaid-tt7e3lr1lc9-1772709692698 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-tt7e3lr1lc9-1772709692698 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-tt7e3lr1lc9-1772709692698 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-tt7e3lr1lc9-1772709692698 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-tt7e3lr1lc9-1772709692698 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-tt7e3lr1lc9-1772709692698 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-tt7e3lr1lc9-1772709692698 .marker.cross{stroke:#22c55e;}#mermaid-tt7e3lr1lc9-1772709692698 svg{font-family:inherit;font-size:16px;}#mermaid-tt7e3lr1lc9-1772709692698 p{margin:0;}#mermaid-tt7e3lr1lc9-1772709692698 .actor{stroke:#22c55e;fill:transparent;}#mermaid-tt7e3lr1lc9-1772709692698 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-tt7e3lr1lc9-1772709692698 .actor-line{stroke:#22c55e;}#mermaid-tt7e3lr1lc9-1772709692698 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-tt7e3lr1lc9-1772709692698 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-tt7e3lr1lc9-1772709692698 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-tt7e3lr1lc9-1772709692698 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-tt7e3lr1lc9-1772709692698 .sequenceNumber{fill:#f0fdf4;}#mermaid-tt7e3lr1lc9-1772709692698 #sequencenumber{fill:#fafafa;}#mermaid-tt7e3lr1lc9-1772709692698 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-tt7e3lr1lc9-1772709692698 .messageText{fill:#fafafa;stroke:none;}#mermaid-tt7e3lr1lc9-1772709692698 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-tt7e3lr1lc9-1772709692698 .labelText,#mermaid-tt7e3lr1lc9-1772709692698 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-tt7e3lr1lc9-1772709692698 .loopText,#mermaid-tt7e3lr1lc9-1772709692698 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-tt7e3lr1lc9-1772709692698 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-tt7e3lr1lc9-1772709692698 .note{stroke:#f59e0b;fill:#422006;}#mermaid-tt7e3lr1lc9-1772709692698 .noteText,#mermaid-tt7e3lr1lc9-1772709692698 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-tt7e3lr1lc9-1772709692698 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-tt7e3lr1lc9-1772709692698 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-tt7e3lr1lc9-1772709692698 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-tt7e3lr1lc9-1772709692698 .actorPopupMenu{position:absolute;}#mermaid-tt7e3lr1lc9-1772709692698 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-tt7e3lr1lc9-1772709692698 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-tt7e3lr1lc9-1772709692698 .actor-man circle,#mermaid-tt7e3lr1lc9-1772709692698 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-tt7e3lr1lc9-1772709692698 :root{--mermaid-font-family:inherit;}Old table, capacity=16May miss entries orread stale dataStart resizeCreate new table, capacity=32get(key) on old tableMove entries to new tableSet table = newTableStill reading old table!

A reader using the old table reference might access entries that are being moved or have already been moved to the new table. The reader could return null for a key that actually exists.

### Challenge 4: Compound Operations

`putIfAbsent(key, value)` must atomically:

1.  Check if key exists
2.  If not, insert the value
3.  Return the existing value or null

Without atomicity:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Thread 2HashMapThread 1Thread 2HashMapThread 1#mermaid-aleqffvh3h6-1772709692700{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-aleqffvh3h6-1772709692700 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-aleqffvh3h6-1772709692700 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-aleqffvh3h6-1772709692700 .error-icon{fill:#000000;}#mermaid-aleqffvh3h6-1772709692700 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-aleqffvh3h6-1772709692700 .edge-thickness-normal{stroke-width:1px;}#mermaid-aleqffvh3h6-1772709692700 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-aleqffvh3h6-1772709692700 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-aleqffvh3h6-1772709692700 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-aleqffvh3h6-1772709692700 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-aleqffvh3h6-1772709692700 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-aleqffvh3h6-1772709692700 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-aleqffvh3h6-1772709692700 .marker.cross{stroke:#22c55e;}#mermaid-aleqffvh3h6-1772709692700 svg{font-family:inherit;font-size:16px;}#mermaid-aleqffvh3h6-1772709692700 p{margin:0;}#mermaid-aleqffvh3h6-1772709692700 .actor{stroke:#22c55e;fill:transparent;}#mermaid-aleqffvh3h6-1772709692700 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-aleqffvh3h6-1772709692700 .actor-line{stroke:#22c55e;}#mermaid-aleqffvh3h6-1772709692700 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-aleqffvh3h6-1772709692700 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-aleqffvh3h6-1772709692700 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-aleqffvh3h6-1772709692700 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-aleqffvh3h6-1772709692700 .sequenceNumber{fill:#f0fdf4;}#mermaid-aleqffvh3h6-1772709692700 #sequencenumber{fill:#fafafa;}#mermaid-aleqffvh3h6-1772709692700 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-aleqffvh3h6-1772709692700 .messageText{fill:#fafafa;stroke:none;}#mermaid-aleqffvh3h6-1772709692700 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-aleqffvh3h6-1772709692700 .labelText,#mermaid-aleqffvh3h6-1772709692700 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-aleqffvh3h6-1772709692700 .loopText,#mermaid-aleqffvh3h6-1772709692700 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-aleqffvh3h6-1772709692700 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-aleqffvh3h6-1772709692700 .note{stroke:#f59e0b;fill:#422006;}#mermaid-aleqffvh3h6-1772709692700 .noteText,#mermaid-aleqffvh3h6-1772709692700 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-aleqffvh3h6-1772709692700 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-aleqffvh3h6-1772709692700 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-aleqffvh3h6-1772709692700 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-aleqffvh3h6-1772709692700 .actorPopupMenu{position:absolute;}#mermaid-aleqffvh3h6-1772709692700 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-aleqffvh3h6-1772709692700 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-aleqffvh3h6-1772709692700 .actor-man circle,#mermaid-aleqffvh3h6-1772709692700 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-aleqffvh3h6-1772709692700 :root{--mermaid-font-family:inherit;}SessionA overwritten!Both threads think they woncontainsKey("user-123")?falsecontainsKey("user-123")?falseput("user-123", SessionA)put("user-123", SessionB)

Both threads see the key as absent and both insert. One value is silently lost, and both callers believe their insert succeeded.

### Consistency Model Requirements

Property

Requirement

Why It Matters

**Atomicity**

Single-key operations must be atomic

Prevents lost updates

**Visibility**

Writes must be visible to subsequent reads

Prevents stale reads

**Linearizability**

Operations appear to happen at a single instant

Enables reasoning about concurrent behavior

**Progress**

At least one thread makes progress

Prevents system-wide stall

# Approach 1: Coarse-Grained Locking

The simplest approach: wrap the entire HashMap with a single lock. Every operation acquires this lock, serializing all access.

### Implementation

Java

```java
1import java.util.HashMap;
2import java.util.concurrent.locks.ReentrantLock;
3
4public class SynchronizedHashMap<K, V> {
5    private final HashMap<K, V> map = new HashMap<>();
6    private final ReentrantLock lock = new ReentrantLock();
7
8    public V put(K key, V value) {
9        lock.lock();
10        try {
11            return map.put(key, value);
12        } finally {
13            lock.unlock();
14        }
15    }
16
17    public V get(K key) {
18        lock.lock();
19        try {
20            return map.get(key);
21        } finally {
22            lock.unlock();
23        }
24    }
25
26    public V remove(K key) {
27        lock.lock();
28        try {
29            return map.remove(key);
30        } finally {
31            lock.unlock();
32        }
33    }
34
35    public V putIfAbsent(K key, V value) {
36        lock.lock();
37        try {
38            V existing = map.get(key);
39            if (existing == null) {
40                map.put(key, value);
41                return null;
42            }
43            return existing;
44        } finally {
45            lock.unlock();
46        }
47    }
48
49    public int size() {
50        lock.lock();
51        try {
52            return map.size();
53        } finally {
54            lock.unlock();
55        }
56    }
57}
```

### Analysis

Property

Status

Explanation

Thread-safe

Yes

Single lock serializes all access

Deadlock-free

Yes

Only one lock, no circular wait possible

Starvation-free

Depends

ReentrantLock with fairness=true guarantees it

Scalability

Poor

All operations serialize, zero parallelism

### Single Lock Bottleneck

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-bxsuc3doiu8-1772709692702{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-bxsuc3doiu8-1772709692702 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-bxsuc3doiu8-1772709692702 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-bxsuc3doiu8-1772709692702 .error-icon{fill:#000000;}#mermaid-bxsuc3doiu8-1772709692702 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-bxsuc3doiu8-1772709692702 .edge-thickness-normal{stroke-width:1px;}#mermaid-bxsuc3doiu8-1772709692702 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-bxsuc3doiu8-1772709692702 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-bxsuc3doiu8-1772709692702 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-bxsuc3doiu8-1772709692702 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-bxsuc3doiu8-1772709692702 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-bxsuc3doiu8-1772709692702 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-bxsuc3doiu8-1772709692702 .marker.cross{stroke:#22c55e;}#mermaid-bxsuc3doiu8-1772709692702 svg{font-family:inherit;font-size:16px;}#mermaid-bxsuc3doiu8-1772709692702 p{margin:0;}#mermaid-bxsuc3doiu8-1772709692702 .label{font-family:inherit;color:#f0fdf4;}#mermaid-bxsuc3doiu8-1772709692702 .cluster-label text{fill:#fafafa;}#mermaid-bxsuc3doiu8-1772709692702 .cluster-label span{color:#fafafa;}#mermaid-bxsuc3doiu8-1772709692702 .cluster-label span p{background-color:transparent;}#mermaid-bxsuc3doiu8-1772709692702 .label text,#mermaid-bxsuc3doiu8-1772709692702 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-bxsuc3doiu8-1772709692702 .node rect,#mermaid-bxsuc3doiu8-1772709692702 .node circle,#mermaid-bxsuc3doiu8-1772709692702 .node ellipse,#mermaid-bxsuc3doiu8-1772709692702 .node polygon,#mermaid-bxsuc3doiu8-1772709692702 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-bxsuc3doiu8-1772709692702 .rough-node .label text,#mermaid-bxsuc3doiu8-1772709692702 .node .label text,#mermaid-bxsuc3doiu8-1772709692702 .image-shape .label,#mermaid-bxsuc3doiu8-1772709692702 .icon-shape .label{text-anchor:middle;}#mermaid-bxsuc3doiu8-1772709692702 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-bxsuc3doiu8-1772709692702 .rough-node .label,#mermaid-bxsuc3doiu8-1772709692702 .node .label,#mermaid-bxsuc3doiu8-1772709692702 .image-shape .label,#mermaid-bxsuc3doiu8-1772709692702 .icon-shape .label{text-align:center;}#mermaid-bxsuc3doiu8-1772709692702 .node.clickable{cursor:pointer;}#mermaid-bxsuc3doiu8-1772709692702 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-bxsuc3doiu8-1772709692702 .arrowheadPath{fill:#0b0b0b;}#mermaid-bxsuc3doiu8-1772709692702 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-bxsuc3doiu8-1772709692702 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-bxsuc3doiu8-1772709692702 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-bxsuc3doiu8-1772709692702 .edgeLabel p{background-color:#0a0a0a;}#mermaid-bxsuc3doiu8-1772709692702 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-bxsuc3doiu8-1772709692702 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-bxsuc3doiu8-1772709692702 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-bxsuc3doiu8-1772709692702 .cluster text{fill:#fafafa;}#mermaid-bxsuc3doiu8-1772709692702 .cluster span{color:#fafafa;}#mermaid-bxsuc3doiu8-1772709692702 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-bxsuc3doiu8-1772709692702 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-bxsuc3doiu8-1772709692702 rect.text{fill:none;stroke-width:0;}#mermaid-bxsuc3doiu8-1772709692702 .icon-shape,#mermaid-bxsuc3doiu8-1772709692702 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-bxsuc3doiu8-1772709692702 .icon-shape p,#mermaid-bxsuc3doiu8-1772709692702 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-bxsuc3doiu8-1772709692702 .icon-shape rect,#mermaid-bxsuc3doiu8-1772709692702 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-bxsuc3doiu8-1772709692702 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-bxsuc3doiu8-1772709692702 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-bxsuc3doiu8-1772709692702 :root{--mermaid-font-family:inherit;}#mermaid-bxsuc3doiu8-1772709692702 .waiting>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-bxsuc3doiu8-1772709692702 .waiting span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-bxsuc3doiu8-1772709692702 .waiting tspan{fill:#000!important;}#mermaid-bxsuc3doiu8-1772709692702 .lock>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-bxsuc3doiu8-1772709692702 .lock span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-bxsuc3doiu8-1772709692702 .lock tspan{fill:#000!important;}#mermaid-bxsuc3doiu8-1772709692702 .data>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-bxsuc3doiu8-1772709692702 .data span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-bxsuc3doiu8-1772709692702 .data tspan{fill:#000!important;}

Threads

Thread 1  
get A

Thread 2  
put B

Thread 3  
get C

Thread 4  
remove D

Single  
Lock

HashMap

The diagram shows the fundamental problem: all four threads must wait for a single lock, even though they're accessing completely independent keys. Threads 1 and 3 are both reading (could run in parallel) and accessing different keys (definitely could run in parallel). But the coarse-grained lock forces them to wait.

### Pros

*   Simple to implement and verify correctness
*   No risk of deadlock or complex synchronization bugs
*   Compound operations are naturally atomic
*   Good when contention is low

### Cons

*   Zero parallelism, even for independent keys
*   Read operations block each other
*   Throughput doesn't scale with cores
*   A slow operation blocks all other threads

#### **When to Use:**

*   Prototyping and testing
*   Low-contention scenarios (few threads, infrequent access)
*   When simplicity is more important than performance
*   As a correctness baseline for testing optimized implementations

# Approach 2: Fine-Grained Locking (Lock Striping)

The key insight: most HashMap operations only touch one bucket. If we lock individual buckets (or groups of buckets), operations on different buckets can proceed in parallel. This is the approach used by Java 7's ConcurrentHashMap.

### Strategy: Segment-Based Locking

Divide the hash table into segments, each with its own lock. The default is 16 segments. To access a key:

1.  Compute the segment: `segment = hash(key) % NUM_SEGMENTS`
2.  Acquire that segment's lock
3.  Perform the operation
4.  Release the lock

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-6uny608zllj-1772709692703{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-6uny608zllj-1772709692703 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-6uny608zllj-1772709692703 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-6uny608zllj-1772709692703 .error-icon{fill:#000000;}#mermaid-6uny608zllj-1772709692703 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-6uny608zllj-1772709692703 .edge-thickness-normal{stroke-width:1px;}#mermaid-6uny608zllj-1772709692703 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-6uny608zllj-1772709692703 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-6uny608zllj-1772709692703 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-6uny608zllj-1772709692703 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-6uny608zllj-1772709692703 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-6uny608zllj-1772709692703 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-6uny608zllj-1772709692703 .marker.cross{stroke:#22c55e;}#mermaid-6uny608zllj-1772709692703 svg{font-family:inherit;font-size:16px;}#mermaid-6uny608zllj-1772709692703 p{margin:0;}#mermaid-6uny608zllj-1772709692703 .label{font-family:inherit;color:#f0fdf4;}#mermaid-6uny608zllj-1772709692703 .cluster-label text{fill:#fafafa;}#mermaid-6uny608zllj-1772709692703 .cluster-label span{color:#fafafa;}#mermaid-6uny608zllj-1772709692703 .cluster-label span p{background-color:transparent;}#mermaid-6uny608zllj-1772709692703 .label text,#mermaid-6uny608zllj-1772709692703 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-6uny608zllj-1772709692703 .node rect,#mermaid-6uny608zllj-1772709692703 .node circle,#mermaid-6uny608zllj-1772709692703 .node ellipse,#mermaid-6uny608zllj-1772709692703 .node polygon,#mermaid-6uny608zllj-1772709692703 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-6uny608zllj-1772709692703 .rough-node .label text,#mermaid-6uny608zllj-1772709692703 .node .label text,#mermaid-6uny608zllj-1772709692703 .image-shape .label,#mermaid-6uny608zllj-1772709692703 .icon-shape .label{text-anchor:middle;}#mermaid-6uny608zllj-1772709692703 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-6uny608zllj-1772709692703 .rough-node .label,#mermaid-6uny608zllj-1772709692703 .node .label,#mermaid-6uny608zllj-1772709692703 .image-shape .label,#mermaid-6uny608zllj-1772709692703 .icon-shape .label{text-align:center;}#mermaid-6uny608zllj-1772709692703 .node.clickable{cursor:pointer;}#mermaid-6uny608zllj-1772709692703 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-6uny608zllj-1772709692703 .arrowheadPath{fill:#0b0b0b;}#mermaid-6uny608zllj-1772709692703 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-6uny608zllj-1772709692703 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-6uny608zllj-1772709692703 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-6uny608zllj-1772709692703 .edgeLabel p{background-color:#0a0a0a;}#mermaid-6uny608zllj-1772709692703 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-6uny608zllj-1772709692703 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-6uny608zllj-1772709692703 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-6uny608zllj-1772709692703 .cluster text{fill:#fafafa;}#mermaid-6uny608zllj-1772709692703 .cluster span{color:#fafafa;}#mermaid-6uny608zllj-1772709692703 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-6uny608zllj-1772709692703 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-6uny608zllj-1772709692703 rect.text{fill:none;stroke-width:0;}#mermaid-6uny608zllj-1772709692703 .icon-shape,#mermaid-6uny608zllj-1772709692703 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-6uny608zllj-1772709692703 .icon-shape p,#mermaid-6uny608zllj-1772709692703 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-6uny608zllj-1772709692703 .icon-shape rect,#mermaid-6uny608zllj-1772709692703 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-6uny608zllj-1772709692703 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-6uny608zllj-1772709692703 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-6uny608zllj-1772709692703 :root{--mermaid-font-family:inherit;}#mermaid-6uny608zllj-1772709692703 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-6uny608zllj-1772709692703 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-6uny608zllj-1772709692703 .primary tspan{fill:#000!important;}#mermaid-6uny608zllj-1772709692703 .waiting>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-6uny608zllj-1772709692703 .waiting span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-6uny608zllj-1772709692703 .waiting tspan{fill:#000!important;}#mermaid-6uny608zllj-1772709692703 .lock>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-6uny608zllj-1772709692703 .lock span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-6uny608zllj-1772709692703 .lock tspan{fill:#000!important;}#mermaid-6uny608zllj-1772709692703 .data>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-6uny608zllj-1772709692703 .data span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-6uny608zllj-1772709692703 .data tspan{fill:#000!important;}

Lock Striping (16 Segments)

Segment 2

Segment 1

Segment 0

Segment 3

Lock 3

Buckets 12-15

Lock 0

Buckets 0-3

Lock 1

Buckets 4-7

Lock 2

Buckets 8-11

Thread 1  
key A → Seg 0

Thread 2  
key B → Seg 2

Thread 3  
key C → Seg 1

Thread 4  
key D → Seg 0

Threads 1, 2, and 3 access different segments and proceed in parallel. Thread 4 hashes to the same segment as Thread 1, so it waits. But overall concurrency is much higher than with a single lock.

### Implementation

Java

```java
1import java.util.concurrent.locks.ReentrantLock;
2
3public class StripedConcurrentHashMap<K, V> {
4    private static final int DEFAULT_SEGMENTS = 16;
5    private static final int DEFAULT_CAPACITY_PER_SEGMENT = 16;
6    private static final float LOAD_FACTOR = 0.75f;
7
8    private final Segment<K, V>[] segments;
9
10    @SuppressWarnings("unchecked")
11    public StripedConcurrentHashMap() {
12        this(DEFAULT_SEGMENTS);
13    }
14
15    @SuppressWarnings("unchecked")
16    public StripedConcurrentHashMap(int numSegments) {
17        segments = new Segment[numSegments];
18        for (int i = 0; i < numSegments; i++) {
19            segments[i] = new Segment<>(DEFAULT_CAPACITY_PER_SEGMENT);
20        }
21    }
22
23    private int hash(K key) {
24        int h = key.hashCode();
25        // Spread bits to reduce collisions in segment selection
26        h ^= (h >>> 20) ^ (h >>> 12) ^ (h >>> 7) ^ (h >>> 4);
27        return h;
28    }
29
30    private Segment<K, V> segmentFor(K key) {
31        int hash = hash(key);
32        int segmentIndex = (hash >>> 28) & (segments.length - 1);
33        return segments[segmentIndex];
34    }
35
36    public V put(K key, V value) {
37        return segmentFor(key).put(key, hash(key), value);
38    }
39
40    public V get(K key) {
41        return segmentFor(key).get(key, hash(key));
42    }
43
44    public V remove(K key) {
45        return segmentFor(key).remove(key, hash(key));
46    }
47
48    public V putIfAbsent(K key, V value) {
49        return segmentFor(key).putIfAbsent(key, hash(key), value);
50    }
51
52    public int size() {
53        // Must lock all segments for accurate count
54        int total = 0;
55
56        // Lock all segments in order to prevent deadlock
57        for (Segment<K, V> segment : segments) {
58            segment.lock.lock();
59        }
60
61        try {
62            for (Segment<K, V> segment : segments) {
63                total += segment.count;
64            }
65        } finally {
66            // Unlock in reverse order (not strictly necessary but good practice)
67            for (int i = segments.length - 1; i >= 0; i--) {
68                segments[i].lock.unlock();
69            }
70        }
71
72        return total;
73    }
74
75    // Inner Segment class - essentially a small synchronized HashMap
76    private static class Segment<K, V> {
77        final ReentrantLock lock = new ReentrantLock();
78        Node<K, V>[] table;
79        int count;
80
81        @SuppressWarnings("unchecked")
82        Segment(int capacity) {
83            table = new Node[capacity];
84            count = 0;
85        }
86
87        V put(K key, int hash, V value) {
88            lock.lock();
89            try {
90                int index = hash & (table.length - 1);
91
92                for (Node<K, V> node = table[index]; node != null; node = node.next) {
93                    if (node.hash == hash && key.equals(node.key)) {
94                        V oldValue = node.value;
95                        node.value = value;
96                        return oldValue;
97                    }
98                }
99
100                // Add new node
101                table[index] = new Node<>(hash, key, value, table[index]);
102                count++;
103
104                // Resize if needed (within segment)
105                if (count > table.length * LOAD_FACTOR) {
106                    resize();
107                }
108
109                return null;
110            } finally {
111                lock.unlock();
112            }
113        }
114
115        V get(K key, int hash) {
116            lock.lock();
117            try {
118                int index = hash & (table.length - 1);
119                for (Node<K, V> node = table[index]; node != null; node = node.next) {
120                    if (node.hash == hash && key.equals(node.key)) {
121                        return node.value;
122                    }
123                }
124                return null;
125            } finally {
126                lock.unlock();
127            }
128        }
129
130        V remove(K key, int hash) {
131            lock.lock();
132            try {
133                int index = hash & (table.length - 1);
134                Node<K, V> prev = null;
135
136                for (Node<K, V> node = table[index]; node != null; prev = node, node = node.next) {
137                    if (node.hash == hash && key.equals(node.key)) {
138                        if (prev == null) {
139                            table[index] = node.next;
140                        } else {
141                            prev.next = node.next;
142                        }
143                        count--;
144                        return node.value;
145                    }
146                }
147                return null;
148            } finally {
149                lock.unlock();
150            }
151        }
152
153        V putIfAbsent(K key, int hash, V value) {
154            lock.lock();
155            try {
156                int index = hash & (table.length - 1);
157
158                for (Node<K, V> node = table[index]; node != null; node = node.next) {
159                    if (node.hash == hash && key.equals(node.key)) {
160                        return node.value;  // Key exists, return current value
161                    }
162                }
163
164                // Key doesn't exist, add it
165                table[index] = new Node<>(hash, key, value, table[index]);
166                count++;
167
168                if (count > table.length * LOAD_FACTOR) {
169                    resize();
170                }
171
172                return null;
173            } finally {
174                lock.unlock();
175            }
176        }
177
178        @SuppressWarnings("unchecked")
179        private void resize() {
180            Node<K, V>[] oldTable = table;
181            int newCapacity = oldTable.length * 2;
182            Node<K, V>[] newTable = new Node[newCapacity];
183
184            for (Node<K, V> head : oldTable) {
185                for (Node<K, V> node = head; node != null; ) {
186                    Node<K, V> next = node.next;
187                    int newIndex = node.hash & (newCapacity - 1);
188                    node.next = newTable[newIndex];
189                    newTable[newIndex] = node;
190                    node = next;
191                }
192            }
193
194            table = newTable;
195        }
196    }
197
198    private static class Node<K, V> {
199        final int hash;
200        final K key;
201        volatile V value;
202        Node<K, V> next;
203
204        Node(int hash, K key, V value, Node<K, V> next) {
205            this.hash = hash;
206            this.key = key;
207            this.value = value;
208            this.next = next;
209        }
210    }
211}
```

### Handling Cross-Segment Operations

The `size()` method demonstrates the challenge of operations spanning multiple segments. We must lock all segments to get an accurate count. Without locking all, entries could be added or removed during counting, giving an inconsistent result.

### Weakly Consistent Iteration

Iterating over a striped map can't guarantee a point-in-time snapshot without locking everything. Instead, we provide "weakly consistent" iteration:

*   May or may not reflect concurrent modifications
*   Never throws ConcurrentModificationException
*   Each element is returned at most once

This is acceptable for most use cases (logging, monitoring, debugging) where an approximate view is sufficient.

### Analysis

Property

Status

Explanation

Thread-safe

Yes

Each segment protected by its own lock

Deadlock-free

Yes

Single-segment ops use one lock; `size()` acquires in fixed order

Scalability

Good

Up to 16x parallelism (or more with more segments)

Complexity

Medium

More code, segment management logic

### Pros

*   Much better parallelism than coarse-grained locking
*   Operations on different segments don't block each other
*   Resize is per-segment, not global
*   Compound operations (putIfAbsent) are straightforward within a segment

### Cons

*   size() requires locking all segments (expensive)
*   Memory overhead for multiple locks
*   Still serializes operations within the same segment
*   Iteration is weakly consistent, not snapshot

# Approach 3: CAS-Based

Java 8 redesigned ConcurrentHashMap to eliminate segment locks for most operations. The key innovations:

1.  **Lock-free reads:** Use volatile reads, no locking for `get()`
2.  **CAS for empty buckets:** Insert into empty bucket using atomic CAS
3.  **Synchronized on bucket head:** Only lock when there's a collision
4.  **Incremental resize:** Spread resize work across threads using forwarding nodes

### Key Insight

Most HashMap buckets are either empty or have very few entries. Java 8's approach optimizes for this:

*   Empty bucket? Use CAS to install the first node (lock-free)
*   Non-empty bucket? Synchronize on the first node (fine-grained, per-bucket lock)
*   Reading? Just read the volatile table reference and traverse (no lock)

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-jjyowom6pzn-1772709692705{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-jjyowom6pzn-1772709692705 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-jjyowom6pzn-1772709692705 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-jjyowom6pzn-1772709692705 .error-icon{fill:#000000;}#mermaid-jjyowom6pzn-1772709692705 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-jjyowom6pzn-1772709692705 .edge-thickness-normal{stroke-width:1px;}#mermaid-jjyowom6pzn-1772709692705 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-jjyowom6pzn-1772709692705 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-jjyowom6pzn-1772709692705 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-jjyowom6pzn-1772709692705 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-jjyowom6pzn-1772709692705 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-jjyowom6pzn-1772709692705 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-jjyowom6pzn-1772709692705 .marker.cross{stroke:#22c55e;}#mermaid-jjyowom6pzn-1772709692705 svg{font-family:inherit;font-size:16px;}#mermaid-jjyowom6pzn-1772709692705 p{margin:0;}#mermaid-jjyowom6pzn-1772709692705 .label{font-family:inherit;color:#f0fdf4;}#mermaid-jjyowom6pzn-1772709692705 .cluster-label text{fill:#fafafa;}#mermaid-jjyowom6pzn-1772709692705 .cluster-label span{color:#fafafa;}#mermaid-jjyowom6pzn-1772709692705 .cluster-label span p{background-color:transparent;}#mermaid-jjyowom6pzn-1772709692705 .label text,#mermaid-jjyowom6pzn-1772709692705 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-jjyowom6pzn-1772709692705 .node rect,#mermaid-jjyowom6pzn-1772709692705 .node circle,#mermaid-jjyowom6pzn-1772709692705 .node ellipse,#mermaid-jjyowom6pzn-1772709692705 .node polygon,#mermaid-jjyowom6pzn-1772709692705 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-jjyowom6pzn-1772709692705 .rough-node .label text,#mermaid-jjyowom6pzn-1772709692705 .node .label text,#mermaid-jjyowom6pzn-1772709692705 .image-shape .label,#mermaid-jjyowom6pzn-1772709692705 .icon-shape .label{text-anchor:middle;}#mermaid-jjyowom6pzn-1772709692705 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-jjyowom6pzn-1772709692705 .rough-node .label,#mermaid-jjyowom6pzn-1772709692705 .node .label,#mermaid-jjyowom6pzn-1772709692705 .image-shape .label,#mermaid-jjyowom6pzn-1772709692705 .icon-shape .label{text-align:center;}#mermaid-jjyowom6pzn-1772709692705 .node.clickable{cursor:pointer;}#mermaid-jjyowom6pzn-1772709692705 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-jjyowom6pzn-1772709692705 .arrowheadPath{fill:#0b0b0b;}#mermaid-jjyowom6pzn-1772709692705 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-jjyowom6pzn-1772709692705 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-jjyowom6pzn-1772709692705 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-jjyowom6pzn-1772709692705 .edgeLabel p{background-color:#0a0a0a;}#mermaid-jjyowom6pzn-1772709692705 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-jjyowom6pzn-1772709692705 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-jjyowom6pzn-1772709692705 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-jjyowom6pzn-1772709692705 .cluster text{fill:#fafafa;}#mermaid-jjyowom6pzn-1772709692705 .cluster span{color:#fafafa;}#mermaid-jjyowom6pzn-1772709692705 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-jjyowom6pzn-1772709692705 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-jjyowom6pzn-1772709692705 rect.text{fill:none;stroke-width:0;}#mermaid-jjyowom6pzn-1772709692705 .icon-shape,#mermaid-jjyowom6pzn-1772709692705 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-jjyowom6pzn-1772709692705 .icon-shape p,#mermaid-jjyowom6pzn-1772709692705 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-jjyowom6pzn-1772709692705 .icon-shape rect,#mermaid-jjyowom6pzn-1772709692705 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-jjyowom6pzn-1772709692705 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-jjyowom6pzn-1772709692705 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-jjyowom6pzn-1772709692705 :root{--mermaid-font-family:inherit;}#mermaid-jjyowom6pzn-1772709692705 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-jjyowom6pzn-1772709692705 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-jjyowom6pzn-1772709692705 .primary tspan{fill:#000!important;}#mermaid-jjyowom6pzn-1772709692705 .secondary>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-jjyowom6pzn-1772709692705 .secondary span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-jjyowom6pzn-1772709692705 .secondary tspan{fill:#000!important;}#mermaid-jjyowom6pzn-1772709692705 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-jjyowom6pzn-1772709692705 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-jjyowom6pzn-1772709692705 .green tspan{fill:#000!important;}#mermaid-jjyowom6pzn-1772709692705 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-jjyowom6pzn-1772709692705 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-jjyowom6pzn-1772709692705 .orange tspan{fill:#000!important;}#mermaid-jjyowom6pzn-1772709692705 .decision>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-jjyowom6pzn-1772709692705 .decision span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-jjyowom6pzn-1772709692705 .decision tspan{fill:#000!important;}

Yes

Yes

No (contention)

No

put(key, value)

hash = spread(key.hashCode)

index = hash & (table.length - 1)

table\[index\]  
empty?

CAS: null → newNode

CAS  
succeeded?

synchronized(firstNode)

Traverse chain/tree

Update or append

Return

### CAS Insertion for Empty Buckets

JavaPythonC++C#Go

Java

```java
1import java.util.concurrent.atomic.AtomicReferenceArray;
2
3public class CASHashMap<K, V> {
4    private volatile AtomicReferenceArray<Node<K, V>> table;
5    private static final int DEFAULT_CAPACITY = 16;
6
7    static class Node<K, V> {
8        final int hash;
9        final K key;
10        volatile V value;
11        volatile Node<K, V> next;
12
13        Node(int hash, K key, V value, Node<K, V> next) {
14            this.hash = hash;
15            this.key = key;
16            this.value = value;
17            this.next = next;
18        }
19    }
20
21    public CASHashMap() {
22        table = new AtomicReferenceArray<>(DEFAULT_CAPACITY);
23    }
24
25    private int spread(int h) {
26        return (h ^ (h >>> 16)) & 0x7fffffff;
27    }
28
29    public V put(K key, V value) {
30        int hash = spread(key.hashCode());
31
32        for (;;) {
33            AtomicReferenceArray<Node<K, V>> tab = table;
34            int n = tab.length();
35            int index = hash & (n - 1);
36
37            Node<K, V> first = tab.get(index);
38
39            if (first == null) {
40                // Empty bucket - try CAS
41                Node<K, V> newNode = new Node<>(hash, key, value, null);
42                if (tab.compareAndSet(index, null, newNode)) {
43                    return null;  // Successfully added
44                }
45                // CAS failed, retry
46                continue;
47            }
48
49            // Non-empty bucket - synchronize on first node
50            synchronized (first) {
51                // Double-check the first node hasn't changed
52                if (tab.get(index) != first) {
53                    continue;  // Retry
54                }
55
56                // Traverse and update or append
57                for (Node<K, V> node = first; ; ) {
58                    if (node.hash == hash && key.equals(node.key)) {
59                        V oldValue = node.value;
60                        node.value = value;
61                        return oldValue;
62                    }
63
64                    Node<K, V> next = node.next;
65                    if (next == null) {
66                        node.next = new Node<>(hash, key, value, null);
67                        return null;
68                    }
69                    node = next;
70                }
71            }
72        }
73    }
74
75    public V get(K key) {
76        int hash = spread(key.hashCode());
77        AtomicReferenceArray<Node<K, V>> tab = table;
78        int n = tab.length();
79        int index = hash & (n - 1);
80
81        // Lock-free read - just traverse the chain
82        for (Node<K, V> node = tab.get(index); node != null; node = node.next) {
83            if (node.hash == hash && key.equals(node.key)) {
84                return node.value;  // volatile read ensures visibility
85            }
86        }
87        return null;
88    }
89}
```

The key insight: `get()` never locks. It relies on:

*   `table` being volatile (sees latest array reference)
*   `Node.value` being volatile (sees latest value)
*   Node objects being immutable once published (hash, key don't change)

### Incremental Resize with Forwarding Nodes

When resizing, Java 8's ConcurrentHashMap doesn't stop the world. Instead:

1.  Create a new, larger table
2.  Mark buckets being migrated with "forwarding nodes"
3.  Spread migration work across threads
4.  Readers/writers that encounter forwarding nodes help migrate or access new table

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-1bwbylzr8i5-1772709692707{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-1bwbylzr8i5-1772709692707 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-1bwbylzr8i5-1772709692707 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-1bwbylzr8i5-1772709692707 .error-icon{fill:#000000;}#mermaid-1bwbylzr8i5-1772709692707 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-1bwbylzr8i5-1772709692707 .edge-thickness-normal{stroke-width:1px;}#mermaid-1bwbylzr8i5-1772709692707 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-1bwbylzr8i5-1772709692707 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-1bwbylzr8i5-1772709692707 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-1bwbylzr8i5-1772709692707 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-1bwbylzr8i5-1772709692707 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-1bwbylzr8i5-1772709692707 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-1bwbylzr8i5-1772709692707 .marker.cross{stroke:#22c55e;}#mermaid-1bwbylzr8i5-1772709692707 svg{font-family:inherit;font-size:16px;}#mermaid-1bwbylzr8i5-1772709692707 p{margin:0;}#mermaid-1bwbylzr8i5-1772709692707 .label{font-family:inherit;color:#f0fdf4;}#mermaid-1bwbylzr8i5-1772709692707 .cluster-label text{fill:#fafafa;}#mermaid-1bwbylzr8i5-1772709692707 .cluster-label span{color:#fafafa;}#mermaid-1bwbylzr8i5-1772709692707 .cluster-label span p{background-color:transparent;}#mermaid-1bwbylzr8i5-1772709692707 .label text,#mermaid-1bwbylzr8i5-1772709692707 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-1bwbylzr8i5-1772709692707 .node rect,#mermaid-1bwbylzr8i5-1772709692707 .node circle,#mermaid-1bwbylzr8i5-1772709692707 .node ellipse,#mermaid-1bwbylzr8i5-1772709692707 .node polygon,#mermaid-1bwbylzr8i5-1772709692707 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-1bwbylzr8i5-1772709692707 .rough-node .label text,#mermaid-1bwbylzr8i5-1772709692707 .node .label text,#mermaid-1bwbylzr8i5-1772709692707 .image-shape .label,#mermaid-1bwbylzr8i5-1772709692707 .icon-shape .label{text-anchor:middle;}#mermaid-1bwbylzr8i5-1772709692707 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-1bwbylzr8i5-1772709692707 .rough-node .label,#mermaid-1bwbylzr8i5-1772709692707 .node .label,#mermaid-1bwbylzr8i5-1772709692707 .image-shape .label,#mermaid-1bwbylzr8i5-1772709692707 .icon-shape .label{text-align:center;}#mermaid-1bwbylzr8i5-1772709692707 .node.clickable{cursor:pointer;}#mermaid-1bwbylzr8i5-1772709692707 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-1bwbylzr8i5-1772709692707 .arrowheadPath{fill:#0b0b0b;}#mermaid-1bwbylzr8i5-1772709692707 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-1bwbylzr8i5-1772709692707 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-1bwbylzr8i5-1772709692707 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-1bwbylzr8i5-1772709692707 .edgeLabel p{background-color:#0a0a0a;}#mermaid-1bwbylzr8i5-1772709692707 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-1bwbylzr8i5-1772709692707 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-1bwbylzr8i5-1772709692707 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-1bwbylzr8i5-1772709692707 .cluster text{fill:#fafafa;}#mermaid-1bwbylzr8i5-1772709692707 .cluster span{color:#fafafa;}#mermaid-1bwbylzr8i5-1772709692707 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-1bwbylzr8i5-1772709692707 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-1bwbylzr8i5-1772709692707 rect.text{fill:none;stroke-width:0;}#mermaid-1bwbylzr8i5-1772709692707 .icon-shape,#mermaid-1bwbylzr8i5-1772709692707 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-1bwbylzr8i5-1772709692707 .icon-shape p,#mermaid-1bwbylzr8i5-1772709692707 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-1bwbylzr8i5-1772709692707 .icon-shape rect,#mermaid-1bwbylzr8i5-1772709692707 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-1bwbylzr8i5-1772709692707 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-1bwbylzr8i5-1772709692707 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-1bwbylzr8i5-1772709692707 :root{--mermaid-font-family:inherit;}#mermaid-1bwbylzr8i5-1772709692707 .empty>\*{fill:#e9ecef!important;stroke:#000!important;color:#000!important;}#mermaid-1bwbylzr8i5-1772709692707 .empty span{fill:#e9ecef!important;stroke:#000!important;color:#000!important;}#mermaid-1bwbylzr8i5-1772709692707 .empty tspan{fill:#000!important;}#mermaid-1bwbylzr8i5-1772709692707 .data>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-1bwbylzr8i5-1772709692707 .data span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-1bwbylzr8i5-1772709692707 .data tspan{fill:#000!important;}#mermaid-1bwbylzr8i5-1772709692707 .forward>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-1bwbylzr8i5-1772709692707 .forward span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-1bwbylzr8i5-1772709692707 .forward tspan{fill:#000!important;}#mermaid-1bwbylzr8i5-1772709692707 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-1bwbylzr8i5-1772709692707 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-1bwbylzr8i5-1772709692707 .green tspan{fill:#000!important;}

Old Table (capacity=8)

forwards to

forwards to

forwards to

New Table (capacity=16)

\[2\] migrated

\[3\] migrated

\[10\] migrated

\[11\] migrated

\[7\] migrated

\[15\] migrated

\[0\] null

\[1\] A→B

\[2\] FWD

\[3\] FWD

\[4\] C

\[5\] null

\[6\] D→E→F

\[7\] FWD

Buckets 2, 3, and 7 are marked with forwarding nodes (FWD). Their entries have been moved to the new table. Buckets 1, 4, and 6 are still in the old table. A `get(key)` that hashes to bucket 2 sees the forwarding node and looks in the new table instead.

### Atomic Compound Operations

`putIfAbsent` and `computeIfAbsent` must be atomic. In the CAS-based approach:

Java

```java
1public V putIfAbsent(K key, V value) {
2    int hash = spread(key.hashCode());
3    int index = hash & (table.length - 1);
4
5    for (;;) {
6        Node<K, V> first = table.get(index);
7
8        if (first == null) {
9            Node<K, V> newNode = new Node<>(hash, key, value, null);
10            if (table.compareAndSet(index, null, newNode)) {
11                return null;  // Inserted
12            }
13            continue;  // Retry
14        }
15
16        synchronized (first) {
17            if (table.get(index) != first) continue;
18
19            // Check if key exists
20            for (Node<K, V> node = first; node != null; node = node.next) {
21                if (node.hash == hash && key.equals(node.key)) {
22                    return node.value;  // Already exists
23                }
24            }
25
26            // Key doesn't exist, add at end
27            Node<K, V> last = first;
28            while (last.next != null) last = last.next;
29            last.next = new Node<>(hash, key, value, null);
30            return null;
31        }
32    }
33}
```

The synchronized block ensures the check-then-insert happens atomically. Between the existence check and the insert, no other thread can modify the bucket.

### Analysis

Property

Status

Explanation

Thread-safe

Yes

CAS + synchronized ensures correctness

Lock-free reads

Yes

No locking for get()

Scalability

Excellent

Per-bucket locking, lock-free reads

Complexity

High

CAS loops, forwarding nodes, memory ordering

# Solution Comparison

Aspect

Coarse-Grained

Fine-Grained (Striping)

CAS-Based (Java 8)

**Read concurrency**

1 reader at a time

N readers (different segments)

Unlimited (lock-free)

**Write concurrency**

1 writer at a time

N writers (different segments)

N writers (different buckets)

**Lock overhead**

1 lock

16 locks (default)

Per-bucket sync, no global lock

**Read performance**

Blocked by writes

Blocked by same-segment writes

Never blocked

**size() complexity**

O(1)

O(segments) + locking all

O(n) or approximate

**Implementation complexity**

Simple

Medium

High

**Memory overhead**

Minimal

16 locks

Per-bucket potential lock

**Resize strategy**

Global, stop-the-world

Per-segment

Incremental, concurrent

### Decision Tree for Choosing Approach

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-jcto7atrb9j-1772709692708{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-jcto7atrb9j-1772709692708 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-jcto7atrb9j-1772709692708 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-jcto7atrb9j-1772709692708 .error-icon{fill:#000000;}#mermaid-jcto7atrb9j-1772709692708 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-jcto7atrb9j-1772709692708 .edge-thickness-normal{stroke-width:1px;}#mermaid-jcto7atrb9j-1772709692708 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-jcto7atrb9j-1772709692708 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-jcto7atrb9j-1772709692708 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-jcto7atrb9j-1772709692708 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-jcto7atrb9j-1772709692708 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-jcto7atrb9j-1772709692708 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-jcto7atrb9j-1772709692708 .marker.cross{stroke:#22c55e;}#mermaid-jcto7atrb9j-1772709692708 svg{font-family:inherit;font-size:16px;}#mermaid-jcto7atrb9j-1772709692708 p{margin:0;}#mermaid-jcto7atrb9j-1772709692708 .label{font-family:inherit;color:#f0fdf4;}#mermaid-jcto7atrb9j-1772709692708 .cluster-label text{fill:#fafafa;}#mermaid-jcto7atrb9j-1772709692708 .cluster-label span{color:#fafafa;}#mermaid-jcto7atrb9j-1772709692708 .cluster-label span p{background-color:transparent;}#mermaid-jcto7atrb9j-1772709692708 .label text,#mermaid-jcto7atrb9j-1772709692708 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-jcto7atrb9j-1772709692708 .node rect,#mermaid-jcto7atrb9j-1772709692708 .node circle,#mermaid-jcto7atrb9j-1772709692708 .node ellipse,#mermaid-jcto7atrb9j-1772709692708 .node polygon,#mermaid-jcto7atrb9j-1772709692708 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-jcto7atrb9j-1772709692708 .rough-node .label text,#mermaid-jcto7atrb9j-1772709692708 .node .label text,#mermaid-jcto7atrb9j-1772709692708 .image-shape .label,#mermaid-jcto7atrb9j-1772709692708 .icon-shape .label{text-anchor:middle;}#mermaid-jcto7atrb9j-1772709692708 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-jcto7atrb9j-1772709692708 .rough-node .label,#mermaid-jcto7atrb9j-1772709692708 .node .label,#mermaid-jcto7atrb9j-1772709692708 .image-shape .label,#mermaid-jcto7atrb9j-1772709692708 .icon-shape .label{text-align:center;}#mermaid-jcto7atrb9j-1772709692708 .node.clickable{cursor:pointer;}#mermaid-jcto7atrb9j-1772709692708 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-jcto7atrb9j-1772709692708 .arrowheadPath{fill:#0b0b0b;}#mermaid-jcto7atrb9j-1772709692708 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-jcto7atrb9j-1772709692708 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-jcto7atrb9j-1772709692708 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-jcto7atrb9j-1772709692708 .edgeLabel p{background-color:#0a0a0a;}#mermaid-jcto7atrb9j-1772709692708 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-jcto7atrb9j-1772709692708 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-jcto7atrb9j-1772709692708 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-jcto7atrb9j-1772709692708 .cluster text{fill:#fafafa;}#mermaid-jcto7atrb9j-1772709692708 .cluster span{color:#fafafa;}#mermaid-jcto7atrb9j-1772709692708 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-jcto7atrb9j-1772709692708 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-jcto7atrb9j-1772709692708 rect.text{fill:none;stroke-width:0;}#mermaid-jcto7atrb9j-1772709692708 .icon-shape,#mermaid-jcto7atrb9j-1772709692708 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-jcto7atrb9j-1772709692708 .icon-shape p,#mermaid-jcto7atrb9j-1772709692708 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-jcto7atrb9j-1772709692708 .icon-shape rect,#mermaid-jcto7atrb9j-1772709692708 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-jcto7atrb9j-1772709692708 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-jcto7atrb9j-1772709692708 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-jcto7atrb9j-1772709692708 :root{--mermaid-font-family:inherit;}#mermaid-jcto7atrb9j-1772709692708 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-jcto7atrb9j-1772709692708 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-jcto7atrb9j-1772709692708 .primary tspan{fill:#000!important;}#mermaid-jcto7atrb9j-1772709692708 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-jcto7atrb9j-1772709692708 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-jcto7atrb9j-1772709692708 .orange tspan{fill:#000!important;}#mermaid-jcto7atrb9j-1772709692708 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-jcto7atrb9j-1772709692708 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-jcto7atrb9j-1772709692708 .green tspan{fill:#000!important;}#mermaid-jcto7atrb9j-1772709692708 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-jcto7atrb9j-1772709692708 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-jcto7atrb9j-1772709692708 .purple tspan{fill:#000!important;}#mermaid-jcto7atrb9j-1772709692708 .decision>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-jcto7atrb9j-1772709692708 .decision span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-jcto7atrb9j-1772709692708 .decision tspan{fill:#000!important;}

Yes

No

Yes

No

High

Low

Yes

No

Choose ConcurrentHashMap  
Implementation

Read-heavy  
workload?

High write  
contention?

Need simple  
implementation?

Team familiar  
with CAS?

Coarse-Grained  
Simple, correct, slow

Lock Striping  
Good balance, interview-friendly

CAS-Based  
Best performance, complex

#### **Recommendation:**

*   **Interviews:** Start with lock striping. It's conceptually clear, demonstrates understanding of concurrency trade-offs, and is what most interviewers expect. Mention the CAS-based approach as an optimization.
*   **Production Java:** Use `java.util.concurrent.ConcurrentHashMap`. It's battle-tested and implements the Java 8 optimizations.
*   **Production C++:** Use `tbb::concurrent_hash_map` from Intel TBB or `folly::ConcurrentHashMap` from Facebook.
*   **Production Python:** For true concurrency, use `multiprocessing.Manager().dict()` or database-backed solutions.

# Complete Implementation

This section provides the production-ready lock striping implementation, which is most relevant for interviews. The code is complete, tested, and includes all methods discussed.

Java

```java
1import java.util.concurrent.atomic.AtomicInteger;
2import java.util.concurrent.locks.ReentrantLock;
3import java.util.function.Function;
4
5/**
6 * Thread-safe HashMap using lock striping (segment-based locking).
7 *
8 * Thread Safety: Operations on different segments proceed in parallel.
9 *                Operations on the same segment are serialized.
10 * Performance: Up to 16x parallelism over synchronized HashMap.
11 *
12 * @param <K> Key type
13 * @param <V> Value type
14 */
15public class ConcurrentHashMap<K, V> {
16    private static final int DEFAULT_SEGMENTS = 16;
17    private static final int DEFAULT_CAPACITY_PER_SEGMENT = 16;
18    private static final float LOAD_FACTOR = 0.75f;
19
20    private final Segment<K, V>[] segments;
21    private final AtomicInteger totalSize = new AtomicInteger(0);
22
23    @SuppressWarnings("unchecked")
24    public ConcurrentHashMap() {
25        this(DEFAULT_SEGMENTS, DEFAULT_CAPACITY_PER_SEGMENT);
26    }
27
28    @SuppressWarnings("unchecked")
29    public ConcurrentHashMap(int numSegments, int capacityPerSegment) {
30        // Ensure power of 2 for fast modulo
31        numSegments = tableSizeFor(numSegments);
32        segments = new Segment[numSegments];
33        for (int i = 0; i < numSegments; i++) {
34            segments[i] = new Segment<>(capacityPerSegment);
35        }
36    }
37
38    // Hash spreading function
39    private int spread(int h) {
40        return (h ^ (h >>> 16)) & 0x7fffffff;
41    }
42
43    // Get segment for a key
44    private Segment<K, V> segmentFor(K key) {
45        int hash = spread(key.hashCode());
46        int segmentIndex = hash & (segments.length - 1);
47        return segments[segmentIndex];
48    }
49
50    /**
51     * Associates the specified value with the specified key.
52     * @return previous value, or null if no previous mapping
53     */
54    public V put(K key, V value) {
55        if (key == null || value == null) throw new NullPointerException();
56        Segment<K, V> segment = segmentFor(key);
57        V oldValue = segment.put(key, spread(key.hashCode()), value);
58        if (oldValue == null) {
59            totalSize.incrementAndGet();
60        }
61        return oldValue;
62    }
63
64    /**
65     * Returns the value for the specified key, or null if not found.
66     */
67    public V get(K key) {
68        if (key == null) throw new NullPointerException();
69        return segmentFor(key).get(key, spread(key.hashCode()));
70    }
71
72    /**
73     * Removes the mapping for the specified key.
74     * @return previous value, or null if no mapping existed
75     */
76    public V remove(K key) {
77        if (key == null) throw new NullPointerException();
78        Segment<K, V> segment = segmentFor(key);
79        V oldValue = segment.remove(key, spread(key.hashCode()));
80        if (oldValue != null) {
81            totalSize.decrementAndGet();
82        }
83        return oldValue;
84    }
85
86    /**
87     * Inserts the value only if the key is not already present.
88     * @return existing value if present, null if inserted
89     */
90    public V putIfAbsent(K key, V value) {
91        if (key == null || value == null) throw new NullPointerException();
92        Segment<K, V> segment = segmentFor(key);
93        V result = segment.putIfAbsent(key, spread(key.hashCode()), value);
94        if (result == null) {
95            totalSize.incrementAndGet();
96        }
97        return result;
98    }
99
100    /**
101     * Computes the value if the key is not present.
102     * The mapping function is called at most once.
103     */
104    public V computeIfAbsent(K key, Function<? super K, ? extends V> mappingFunction) {
105        if (key == null || mappingFunction == null) throw new NullPointerException();
106        Segment<K, V> segment = segmentFor(key);
107        return segment.computeIfAbsent(key, spread(key.hashCode()), mappingFunction, totalSize);
108    }
109
110    /**
111     * Returns true if the map contains the specified key.
112     */
113    public boolean containsKey(K key) {
114        return get(key) != null;
115    }
116
117    /**
118     * Returns the approximate number of entries.
119     * May not be accurate during concurrent modifications.
120     */
121    public int size() {
122        return totalSize.get();
123    }
124
125    /**
126     * Returns true if the map contains no entries.
127     */
128    public boolean isEmpty() {
129        return totalSize.get() == 0;
130    }
131
132    /**
133     * Removes all entries from the map.
134     */
135    public void clear() {
136        for (Segment<K, V> segment : segments) {
137            segment.clear();
138        }
139        totalSize.set(0);
140    }
141
142    // Compute next power of 2 >= n
143    private static int tableSizeFor(int n) {
144        n = n - 1;
145        n |= n >>> 1;
146        n |= n >>> 2;
147        n |= n >>> 4;
148        n |= n >>> 8;
149        n |= n >>> 16;
150        return (n < 0) ? 1 : (n >= (1 << 30)) ? (1 << 30) : n + 1;
151    }
152
153    // ==================== Inner Classes ====================
154
155    private static class Segment<K, V> {
156        private final ReentrantLock lock = new ReentrantLock();
157        private Node<K, V>[] table;
158        private int count;
159
160        @SuppressWarnings("unchecked")
161        Segment(int capacity) {
162            table = new Node[capacity];
163            count = 0;
164        }
165
166        V put(K key, int hash, V value) {
167            lock.lock();
168            try {
169                int index = hash & (table.length - 1);
170
171                for (Node<K, V> node = table[index]; node != null; node = node.next) {
172                    if (node.hash == hash && key.equals(node.key)) {
173                        V oldValue = node.value;
174                        node.value = value;
175                        return oldValue;
176                    }
177                }
178
179                table[index] = new Node<>(hash, key, value, table[index]);
180                count++;
181
182                if (count > table.length * LOAD_FACTOR) {
183                    resize();
184                }
185
186                return null;
187            } finally {
188                lock.unlock();
189            }
190        }
191
192        V get(K key, int hash) {
193            lock.lock();
194            try {
195                int index = hash & (table.length - 1);
196                for (Node<K, V> node = table[index]; node != null; node = node.next) {
197                    if (node.hash == hash && key.equals(node.key)) {
198                        return node.value;
199                    }
200                }
201                return null;
202            } finally {
203                lock.unlock();
204            }
205        }
206
207        V remove(K key, int hash) {
208            lock.lock();
209            try {
210                int index = hash & (table.length - 1);
211                Node<K, V> prev = null;
212
213                for (Node<K, V> node = table[index]; node != null; prev = node, node = node.next) {
214                    if (node.hash == hash && key.equals(node.key)) {
215                        if (prev == null) {
216                            table[index] = node.next;
217                        } else {
218                            prev.next = node.next;
219                        }
220                        count--;
221                        return node.value;
222                    }
223                }
224                return null;
225            } finally {
226                lock.unlock();
227            }
228        }
229
230        V putIfAbsent(K key, int hash, V value) {
231            lock.lock();
232            try {
233                int index = hash & (table.length - 1);
234
235                for (Node<K, V> node = table[index]; node != null; node = node.next) {
236                    if (node.hash == hash && key.equals(node.key)) {
237                        return node.value;
238                    }
239                }
240
241                table[index] = new Node<>(hash, key, value, table[index]);
242                count++;
243
244                if (count > table.length * LOAD_FACTOR) {
245                    resize();
246                }
247
248                return null;
249            } finally {
250                lock.unlock();
251            }
252        }
253
254        V computeIfAbsent(K key, int hash, Function<? super K, ? extends V> mapper,
255                         AtomicInteger totalSize) {
256            lock.lock();
257            try {
258                int index = hash & (table.length - 1);
259
260                for (Node<K, V> node = table[index]; node != null; node = node.next) {
261                    if (node.hash == hash && key.equals(node.key)) {
262                        return node.value;
263                    }
264                }
265
266                V value = mapper.apply(key);
267                if (value != null) {
268                    table[index] = new Node<>(hash, key, value, table[index]);
269                    count++;
270                    totalSize.incrementAndGet();
271
272                    if (count > table.length * LOAD_FACTOR) {
273                        resize();
274                    }
275                }
276
277                return value;
278            } finally {
279                lock.unlock();
280            }
281        }
282
283        void clear() {
284            lock.lock();
285            try {
286                for (int i = 0; i < table.length; i++) {
287                    table[i] = null;
288                }
289                count = 0;
290            } finally {
291                lock.unlock();
292            }
293        }
294
295        @SuppressWarnings("unchecked")
296        private void resize() {
297            Node<K, V>[] oldTable = table;
298            int newCapacity = oldTable.length * 2;
299            Node<K, V>[] newTable = new Node[newCapacity];
300
301            for (Node<K, V> head : oldTable) {
302                while (head != null) {
303                    Node<K, V> next = head.next;
304                    int newIndex = head.hash & (newCapacity - 1);
305                    head.next = newTable[newIndex];
306                    newTable[newIndex] = head;
307                    head = next;
308                }
309            }
310
311            table = newTable;
312        }
313    }
314
315    private static class Node<K, V> {
316        final int hash;
317        final K key;
318        volatile V value;
319        Node<K, V> next;
320
321        Node(int hash, K key, V value, Node<K, V> next) {
322            this.hash = hash;
323            this.key = key;
324            this.value = value;
325            this.next = next;
326        }
327    }
328}
```

Launching soon
