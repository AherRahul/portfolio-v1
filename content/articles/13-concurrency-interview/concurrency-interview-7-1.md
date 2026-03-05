---
title: "Compare-And-Swap (CAS)"
description: "Compare-And-Swap (CAS) - Concurrency Interview Module 7"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Compare-And-Swap (CAS)

**Compare-and-Swap**, or **CAS**, is the foundation of lock-free programming. It is a single atomic instruction provided by modern CPUs that allows threads to update shared memory without acquiring locks.

Instead of blocking other threads, CAS lets threads detect conflicts and retry. When contention is moderate, this approach often outperforms locks. When contention is extreme, the trade-offs become more nuanced.

This chapter covers how CAS works at the hardware level, how to use it correctly in your code, and the subtle bugs that can bite you if you are not careful.

# What is Compare-and-Swap?

Real-World Analogy

Imagine you are updating a shared document with a colleague. Before making changes, you note the document's version number: version 5. You spend time writing your edits.

When you try to save, the system checks: is the document still on version 5? If yes, your changes are saved and the version becomes 6. If no, someone else edited it while you were working, and you must re-read, merge, and try again.

CAS works exactly like this, but at the CPU level and in nanoseconds.

In technical terms, CAS is an atomic operation that takes three arguments: a memory location, an expected value, and a new value. It atomically compares the current value at the memory location with the expected value. If they match, it replaces the current value with the new value and returns success. If they do not match, it leaves the memory unchanged and returns failure.

The key insight is that the comparison and the swap happen as a single atomic operation. No other thread can intervene between the check and the update.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-xwqdpxmylo-1772709682431{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-xwqdpxmylo-1772709682431 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-xwqdpxmylo-1772709682431 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-xwqdpxmylo-1772709682431 .error-icon{fill:#000000;}#mermaid-xwqdpxmylo-1772709682431 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-xwqdpxmylo-1772709682431 .edge-thickness-normal{stroke-width:1px;}#mermaid-xwqdpxmylo-1772709682431 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-xwqdpxmylo-1772709682431 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-xwqdpxmylo-1772709682431 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-xwqdpxmylo-1772709682431 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-xwqdpxmylo-1772709682431 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-xwqdpxmylo-1772709682431 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-xwqdpxmylo-1772709682431 .marker.cross{stroke:#22c55e;}#mermaid-xwqdpxmylo-1772709682431 svg{font-family:inherit;font-size:16px;}#mermaid-xwqdpxmylo-1772709682431 p{margin:0;}#mermaid-xwqdpxmylo-1772709682431 .label{font-family:inherit;color:#f0fdf4;}#mermaid-xwqdpxmylo-1772709682431 .cluster-label text{fill:#fafafa;}#mermaid-xwqdpxmylo-1772709682431 .cluster-label span{color:#fafafa;}#mermaid-xwqdpxmylo-1772709682431 .cluster-label span p{background-color:transparent;}#mermaid-xwqdpxmylo-1772709682431 .label text,#mermaid-xwqdpxmylo-1772709682431 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-xwqdpxmylo-1772709682431 .node rect,#mermaid-xwqdpxmylo-1772709682431 .node circle,#mermaid-xwqdpxmylo-1772709682431 .node ellipse,#mermaid-xwqdpxmylo-1772709682431 .node polygon,#mermaid-xwqdpxmylo-1772709682431 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-xwqdpxmylo-1772709682431 .rough-node .label text,#mermaid-xwqdpxmylo-1772709682431 .node .label text,#mermaid-xwqdpxmylo-1772709682431 .image-shape .label,#mermaid-xwqdpxmylo-1772709682431 .icon-shape .label{text-anchor:middle;}#mermaid-xwqdpxmylo-1772709682431 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-xwqdpxmylo-1772709682431 .rough-node .label,#mermaid-xwqdpxmylo-1772709682431 .node .label,#mermaid-xwqdpxmylo-1772709682431 .image-shape .label,#mermaid-xwqdpxmylo-1772709682431 .icon-shape .label{text-align:center;}#mermaid-xwqdpxmylo-1772709682431 .node.clickable{cursor:pointer;}#mermaid-xwqdpxmylo-1772709682431 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-xwqdpxmylo-1772709682431 .arrowheadPath{fill:#0b0b0b;}#mermaid-xwqdpxmylo-1772709682431 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-xwqdpxmylo-1772709682431 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-xwqdpxmylo-1772709682431 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-xwqdpxmylo-1772709682431 .edgeLabel p{background-color:#0a0a0a;}#mermaid-xwqdpxmylo-1772709682431 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-xwqdpxmylo-1772709682431 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-xwqdpxmylo-1772709682431 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-xwqdpxmylo-1772709682431 .cluster text{fill:#fafafa;}#mermaid-xwqdpxmylo-1772709682431 .cluster span{color:#fafafa;}#mermaid-xwqdpxmylo-1772709682431 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-xwqdpxmylo-1772709682431 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-xwqdpxmylo-1772709682431 rect.text{fill:none;stroke-width:0;}#mermaid-xwqdpxmylo-1772709682431 .icon-shape,#mermaid-xwqdpxmylo-1772709682431 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-xwqdpxmylo-1772709682431 .icon-shape p,#mermaid-xwqdpxmylo-1772709682431 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-xwqdpxmylo-1772709682431 .icon-shape rect,#mermaid-xwqdpxmylo-1772709682431 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-xwqdpxmylo-1772709682431 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-xwqdpxmylo-1772709682431 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-xwqdpxmylo-1772709682431 :root{--mermaid-font-family:inherit;}#mermaid-xwqdpxmylo-1772709682431 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-xwqdpxmylo-1772709682431 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-xwqdpxmylo-1772709682431 .primary tspan{fill:#000!important;}#mermaid-xwqdpxmylo-1772709682431 .secondary>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-xwqdpxmylo-1772709682431 .secondary span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-xwqdpxmylo-1772709682431 .secondary tspan{fill:#000!important;}#mermaid-xwqdpxmylo-1772709682431 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-xwqdpxmylo-1772709682431 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-xwqdpxmylo-1772709682431 .green tspan{fill:#000!important;}#mermaid-xwqdpxmylo-1772709682431 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-xwqdpxmylo-1772709682431 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-xwqdpxmylo-1772709682431 .red tspan{fill:#000!important;}#mermaid-xwqdpxmylo-1772709682431 .decision>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-xwqdpxmylo-1772709682431 .decision span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-xwqdpxmylo-1772709682431 .decision tspan{fill:#000!important;}

Yes

No

CAS Operation

Read current value  
from memory location

Current value  
\== Expected?

Atomically write  
new value

Return failure  
Value unchanged

Return success

The diagram above shows the CAS decision flow. The operation reads the current value, compares it against what you expected, and either atomically swaps in the new value (success path in green) or leaves everything unchanged (failure path in red). The atomicity guarantee means no thread can see a half-completed CAS. Either the swap happened completely, or it did not happen at all.

The semantics in pseudocode look like this:

```shell
1function CAS(location, expected, new):
2    atomic:
3        if *location == expected:
4            *location = new
5            return true
6        else:
7            return false
```

This simple primitive is powerful enough to build counters, stacks, queues, and complex concurrent data structures, all without traditional locks.

# Benefits of CAS

### Performance Benefits

Locks have overhead. Acquiring a mutex involves system calls, context switches, and thread scheduling. Even an uncontended lock takes 10-100 nanoseconds. Under contention, a thread might sleep for microseconds or milliseconds waiting for the lock holder.

CAS avoids all of this. A successful CAS is just a few CPU cycles. A failed CAS returns immediately, letting the thread retry without involving the operating system.

Scenario

Mutex Lock

CAS Operation

Uncontended

~25 ns

~5-10 ns

Low contention

~50-100 ns

~10-30 ns

High contention

1-10 μs (blocking)

50-500 ns (spinning)

These numbers vary by hardware, but the pattern holds: CAS is faster when you can afford to spin and retry.

### No Blocking

With a mutex, if one thread crashes or gets stuck in an infinite loop while holding the lock, every other thread waiting for that lock is blocked forever. This is the fundamental vulnerability of lock-based programming.

With CAS, there is no lock to hold. A thread that crashes simply stops participating. Other threads continue their CAS operations without waiting. This property, where system progress does not depend on any single thread, is called lock-freedom, and CAS is the primitive that makes it possible.

### Real-World Usage

CAS is not academic. It is everywhere in production systems:

*   **Java ConcurrentHashMap:** Uses CAS for lock-free bucket updates
*   **Linux Kernel:** Atomic reference counting, spinlocks built on CAS
*   **Go runtime:** Lock-free scheduler queues
*   **Rust std::sync::atomic:** All atomic types use CAS internally
*   **Database engines:** Lock-free buffer pools, transaction markers

When you call `AtomicInteger.incrementAndGet()` in Java or use `std::atomic<int>::fetch_add()` in C++, you are using CAS under the hood.

# How CAS Works

### Hardware-Level Implementation

Modern CPUs provide CAS as a single machine instruction. On x86/x64 processors, it is called `CMPXCHG` (compare and exchange). On ARM, the equivalent is a pair of instructions: `LDREX` (load exclusive) and `STREX` (store exclusive). These instructions coordinate with the CPU's cache coherence protocol to ensure atomicity across all cores.

When a core executes `CMPXCHG`:

1.  The core signals the memory bus that it wants exclusive access to the cache line
2.  Other cores invalidate their copies of that cache line (MESI protocol)
3.  The comparison and conditional swap execute atomically
4.  Other cores must reload the cache line if they need the value

This hardware coordination is what makes CAS truly atomic, not just "fast" but impossible to interrupt.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Core 2Cache/MemoryCore 1Core 2Cache/MemoryCore 1#mermaid-2mqu0dq7a2x-1772709682437{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-2mqu0dq7a2x-1772709682437 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-2mqu0dq7a2x-1772709682437 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-2mqu0dq7a2x-1772709682437 .error-icon{fill:#000000;}#mermaid-2mqu0dq7a2x-1772709682437 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-2mqu0dq7a2x-1772709682437 .edge-thickness-normal{stroke-width:1px;}#mermaid-2mqu0dq7a2x-1772709682437 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-2mqu0dq7a2x-1772709682437 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-2mqu0dq7a2x-1772709682437 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-2mqu0dq7a2x-1772709682437 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-2mqu0dq7a2x-1772709682437 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-2mqu0dq7a2x-1772709682437 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-2mqu0dq7a2x-1772709682437 .marker.cross{stroke:#22c55e;}#mermaid-2mqu0dq7a2x-1772709682437 svg{font-family:inherit;font-size:16px;}#mermaid-2mqu0dq7a2x-1772709682437 p{margin:0;}#mermaid-2mqu0dq7a2x-1772709682437 .actor{stroke:#22c55e;fill:transparent;}#mermaid-2mqu0dq7a2x-1772709682437 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-2mqu0dq7a2x-1772709682437 .actor-line{stroke:#22c55e;}#mermaid-2mqu0dq7a2x-1772709682437 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-2mqu0dq7a2x-1772709682437 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-2mqu0dq7a2x-1772709682437 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-2mqu0dq7a2x-1772709682437 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-2mqu0dq7a2x-1772709682437 .sequenceNumber{fill:#f0fdf4;}#mermaid-2mqu0dq7a2x-1772709682437 #sequencenumber{fill:#fafafa;}#mermaid-2mqu0dq7a2x-1772709682437 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-2mqu0dq7a2x-1772709682437 .messageText{fill:#fafafa;stroke:none;}#mermaid-2mqu0dq7a2x-1772709682437 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-2mqu0dq7a2x-1772709682437 .labelText,#mermaid-2mqu0dq7a2x-1772709682437 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-2mqu0dq7a2x-1772709682437 .loopText,#mermaid-2mqu0dq7a2x-1772709682437 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-2mqu0dq7a2x-1772709682437 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-2mqu0dq7a2x-1772709682437 .note{stroke:#f59e0b;fill:#422006;}#mermaid-2mqu0dq7a2x-1772709682437 .noteText,#mermaid-2mqu0dq7a2x-1772709682437 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-2mqu0dq7a2x-1772709682437 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-2mqu0dq7a2x-1772709682437 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-2mqu0dq7a2x-1772709682437 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-2mqu0dq7a2x-1772709682437 .actorPopupMenu{position:absolute;}#mermaid-2mqu0dq7a2x-1772709682437 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-2mqu0dq7a2x-1772709682437 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-2mqu0dq7a2x-1772709682437 .actor-man circle,#mermaid-2mqu0dq7a2x-1772709682437 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-2mqu0dq7a2x-1772709682437 :root{--mermaid-font-family:inherit;}Compare and swapatomicallyCMPXCHG request (exclusive access)Invalidate cache lineAcknowledge invalidationExclusive access grantedWrite new valueRead (cache miss, reload)Return new value

The sequence diagram shows how cache coherence makes CAS atomic across cores. When Core 1 initiates a CAS, it first gains exclusive access to the relevant cache line. Core 2 must invalidate its cached copy. Only after Core 1 has exclusive access does the compare-and-swap execute. If Core 2 later reads the value, it gets a cache miss and reloads the updated value.

### The CAS Loop Pattern

A single CAS can fail if another thread modified the value first. In practice, you almost always wrap CAS in a retry loop:

```shell
1function incrementWithCAS(location):
2    loop:
3        current = *location          # Read current value
4        new = current + 1            # Compute new value
5        if CAS(location, current, new):
6            return new               # Success: we updated the value
7        # Failure: another thread changed it, retry
```

This pattern is called a CAS loop or a lock-free update loop. You read the current value, compute what you want to change it to, and attempt the CAS. If another thread beat you to it, your expected value no longer matches, the CAS fails, and you retry with the new current value.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-346dvivk919-1772709682440{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-346dvivk919-1772709682440 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-346dvivk919-1772709682440 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-346dvivk919-1772709682440 .error-icon{fill:#000000;}#mermaid-346dvivk919-1772709682440 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-346dvivk919-1772709682440 .edge-thickness-normal{stroke-width:1px;}#mermaid-346dvivk919-1772709682440 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-346dvivk919-1772709682440 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-346dvivk919-1772709682440 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-346dvivk919-1772709682440 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-346dvivk919-1772709682440 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-346dvivk919-1772709682440 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-346dvivk919-1772709682440 .marker.cross{stroke:#22c55e;}#mermaid-346dvivk919-1772709682440 svg{font-family:inherit;font-size:16px;}#mermaid-346dvivk919-1772709682440 p{margin:0;}#mermaid-346dvivk919-1772709682440 .label{font-family:inherit;color:#f0fdf4;}#mermaid-346dvivk919-1772709682440 .cluster-label text{fill:#fafafa;}#mermaid-346dvivk919-1772709682440 .cluster-label span{color:#fafafa;}#mermaid-346dvivk919-1772709682440 .cluster-label span p{background-color:transparent;}#mermaid-346dvivk919-1772709682440 .label text,#mermaid-346dvivk919-1772709682440 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-346dvivk919-1772709682440 .node rect,#mermaid-346dvivk919-1772709682440 .node circle,#mermaid-346dvivk919-1772709682440 .node ellipse,#mermaid-346dvivk919-1772709682440 .node polygon,#mermaid-346dvivk919-1772709682440 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-346dvivk919-1772709682440 .rough-node .label text,#mermaid-346dvivk919-1772709682440 .node .label text,#mermaid-346dvivk919-1772709682440 .image-shape .label,#mermaid-346dvivk919-1772709682440 .icon-shape .label{text-anchor:middle;}#mermaid-346dvivk919-1772709682440 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-346dvivk919-1772709682440 .rough-node .label,#mermaid-346dvivk919-1772709682440 .node .label,#mermaid-346dvivk919-1772709682440 .image-shape .label,#mermaid-346dvivk919-1772709682440 .icon-shape .label{text-align:center;}#mermaid-346dvivk919-1772709682440 .node.clickable{cursor:pointer;}#mermaid-346dvivk919-1772709682440 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-346dvivk919-1772709682440 .arrowheadPath{fill:#0b0b0b;}#mermaid-346dvivk919-1772709682440 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-346dvivk919-1772709682440 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-346dvivk919-1772709682440 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-346dvivk919-1772709682440 .edgeLabel p{background-color:#0a0a0a;}#mermaid-346dvivk919-1772709682440 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-346dvivk919-1772709682440 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-346dvivk919-1772709682440 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-346dvivk919-1772709682440 .cluster text{fill:#fafafa;}#mermaid-346dvivk919-1772709682440 .cluster span{color:#fafafa;}#mermaid-346dvivk919-1772709682440 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-346dvivk919-1772709682440 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-346dvivk919-1772709682440 rect.text{fill:none;stroke-width:0;}#mermaid-346dvivk919-1772709682440 .icon-shape,#mermaid-346dvivk919-1772709682440 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-346dvivk919-1772709682440 .icon-shape p,#mermaid-346dvivk919-1772709682440 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-346dvivk919-1772709682440 .icon-shape rect,#mermaid-346dvivk919-1772709682440 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-346dvivk919-1772709682440 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-346dvivk919-1772709682440 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-346dvivk919-1772709682440 :root{--mermaid-font-family:inherit;}#mermaid-346dvivk919-1772709682440 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-346dvivk919-1772709682440 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-346dvivk919-1772709682440 .primary tspan{fill:#000!important;}#mermaid-346dvivk919-1772709682440 .secondary>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-346dvivk919-1772709682440 .secondary span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-346dvivk919-1772709682440 .secondary tspan{fill:#000!important;}#mermaid-346dvivk919-1772709682440 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-346dvivk919-1772709682440 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-346dvivk919-1772709682440 .orange tspan{fill:#000!important;}#mermaid-346dvivk919-1772709682440 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-346dvivk919-1772709682440 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-346dvivk919-1772709682440 .green tspan{fill:#000!important;}#mermaid-346dvivk919-1772709682440 .yellow>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-346dvivk919-1772709682440 .yellow span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-346dvivk919-1772709682440 .yellow tspan{fill:#000!important;}#mermaid-346dvivk919-1772709682440 .decision>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-346dvivk919-1772709682440 .decision span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-346dvivk919-1772709682440 .decision tspan{fill:#000!important;}

Success

Failure

Start

Read current  
value

Compute  
new value

CAS  
attempt

Done

The retry loop (shown as the arrow from CAS failure back to Read) is what distinguishes lock-free algorithms from lock-based ones. A thread might retry multiple times under contention, but it will never block indefinitely waiting for another thread.

### Weak vs Strong CAS

Some platforms distinguish between strong CAS and weak CAS:

*   **Strong CAS:** Only fails if the value actually changed. If the current value equals expected, the swap always succeeds.
*   **Weak CAS:** May fail spuriously even if the values match. The hardware might report failure due to cache-related events, not actual value changes.

CAS Type

Spurious Failure?

Use Case

Languages

Strong

No

When single-attempt matters

Java `compareAndSet`

Weak

Yes

In loops where retry is cheap

C++ `compare_exchange_weak`

Weak CAS exists because on some architectures (like ARM), implementing a spurious-failure-free CAS requires extra synchronization that is expensive. If you are already in a retry loop, weak CAS is often faster because you are going to retry anyway.

In Java, `AtomicInteger.compareAndSet()` is always strong. In C++, you have both `compare_exchange_strong` and `compare_exchange_weak`. Use weak CAS in loops, strong CAS when you are making a one-shot attempt and need a definitive answer.

# CAS in Practice

### Basic Usage

JavaPythonC++C#Go

Java provides CAS through the `java.util.concurrent.atomic` package. The `compareAndSet` method performs the CAS operation.

Java

```java
1import java.util.concurrent.atomic.AtomicInteger;
2
3public class CASDemo {
4    private final AtomicInteger counter = new AtomicInteger(0);
5
6    // Single CAS attempt
7    public boolean tryIncrement() {
8        int current = counter.get();
9        int next = current + 1;
10        return counter.compareAndSet(current, next);
11        // Returns true if successful, false if value changed
12    }
13
14    // CAS loop (guaranteed to succeed eventually)
15    public int incrementAndGet() {
16        while (true) {
17            int current = counter.get();
18            int next = current + 1;
19            if (counter.compareAndSet(current, next)) {
20                return next;
21            }
22            // CAS failed, another thread modified counter
23            // Loop continues with fresh read
24        }
25    }
26
27    // Using built-in method (also uses CAS internally)
28    public int incrementBuiltIn() {
29        return counter.incrementAndGet();
30    }
31}
```

The `tryIncrement` method shows a single CAS attempt that may fail. The `incrementAndGet` method shows the CAS loop pattern where we retry until success. The built-in `incrementAndGet()` does the same thing internally but is optimized.

# Example: Lock-Free Counter

Let us build a complete lock-free counter and test it under contention:

Java

```java
1import java.util.concurrent.atomic.AtomicInteger;
2import java.util.ArrayList;
3import java.util.List;
4
5public class LockFreeCounterDemo {
6    public static void main(String[] args) throws InterruptedException {
7        LockFreeCounter counter = new LockFreeCounter();
8        List<Thread> threads = new ArrayList<>();
9
10        // 10 threads, each incrementing 100,000 times
11        for (int i = 0; i < 10; i++) {
12            Thread t = new Thread(() -> {
13                for (int j = 0; j < 100_000; j++) {
14                    counter.increment();
15                }
16            });
17            threads.add(t);
18            t.start();
19        }
20
21        for (Thread t : threads) {
22            t.join();
23        }
24
25        System.out.println("Final count: " + counter.get());
26        System.out.println("CAS failures: " + counter.getFailureCount());
27    }
28}
29
30class LockFreeCounter {
31    private final AtomicInteger value = new AtomicInteger(0);
32    private final AtomicInteger failures = new AtomicInteger(0);
33
34    public void increment() {
35        while (true) {
36            int current = value.get();
37            if (value.compareAndSet(current, current + 1)) {
38                return;  // Success
39            }
40            failures.incrementAndGet();  // Track failures
41        }
42    }
43
44    public int get() {
45        return value.get();
46    }
47
48    public int getFailureCount() {
49        return failures.get();
50    }
51}
```

The output shows that even though 10 threads performed 1,000,000 increments in total, the counter correctly reached 1,000,000. The CAS failures count shows how many times threads had to retry. Under high contention, failures are common, but correctness is maintained.

# The ABA Problem

The ABA problem is a subtle bug that can occur with CAS-based algorithms. Here is the scenario:

1.  Thread 1 reads value A from a location
2.  Thread 1 is preempted (paused by OS)
3.  Thread 2 changes the value from A to B
4.  Thread 2 changes the value from B back to A
5.  Thread 1 resumes and performs CAS, expecting A, seeing A
6.  CAS succeeds, but the state has actually changed!

The problem is that CAS only checks the value, not whether the value changed and changed back. Thread 1 thinks nothing happened because the value is still A, but Thread 2 might have done significant work in between.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Thread 2Memory \[A\]Thread 1Thread 2Memory \[A\]Thread 1#mermaid-0e7dfx5wzgo-1772709682443{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-0e7dfx5wzgo-1772709682443 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-0e7dfx5wzgo-1772709682443 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-0e7dfx5wzgo-1772709682443 .error-icon{fill:#000000;}#mermaid-0e7dfx5wzgo-1772709682443 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-0e7dfx5wzgo-1772709682443 .edge-thickness-normal{stroke-width:1px;}#mermaid-0e7dfx5wzgo-1772709682443 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-0e7dfx5wzgo-1772709682443 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-0e7dfx5wzgo-1772709682443 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-0e7dfx5wzgo-1772709682443 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-0e7dfx5wzgo-1772709682443 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-0e7dfx5wzgo-1772709682443 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-0e7dfx5wzgo-1772709682443 .marker.cross{stroke:#22c55e;}#mermaid-0e7dfx5wzgo-1772709682443 svg{font-family:inherit;font-size:16px;}#mermaid-0e7dfx5wzgo-1772709682443 p{margin:0;}#mermaid-0e7dfx5wzgo-1772709682443 .actor{stroke:#22c55e;fill:transparent;}#mermaid-0e7dfx5wzgo-1772709682443 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-0e7dfx5wzgo-1772709682443 .actor-line{stroke:#22c55e;}#mermaid-0e7dfx5wzgo-1772709682443 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-0e7dfx5wzgo-1772709682443 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-0e7dfx5wzgo-1772709682443 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-0e7dfx5wzgo-1772709682443 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-0e7dfx5wzgo-1772709682443 .sequenceNumber{fill:#f0fdf4;}#mermaid-0e7dfx5wzgo-1772709682443 #sequencenumber{fill:#fafafa;}#mermaid-0e7dfx5wzgo-1772709682443 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-0e7dfx5wzgo-1772709682443 .messageText{fill:#fafafa;stroke:none;}#mermaid-0e7dfx5wzgo-1772709682443 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-0e7dfx5wzgo-1772709682443 .labelText,#mermaid-0e7dfx5wzgo-1772709682443 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-0e7dfx5wzgo-1772709682443 .loopText,#mermaid-0e7dfx5wzgo-1772709682443 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-0e7dfx5wzgo-1772709682443 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-0e7dfx5wzgo-1772709682443 .note{stroke:#f59e0b;fill:#422006;}#mermaid-0e7dfx5wzgo-1772709682443 .noteText,#mermaid-0e7dfx5wzgo-1772709682443 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-0e7dfx5wzgo-1772709682443 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-0e7dfx5wzgo-1772709682443 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-0e7dfx5wzgo-1772709682443 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-0e7dfx5wzgo-1772709682443 .actorPopupMenu{position:absolute;}#mermaid-0e7dfx5wzgo-1772709682443 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-0e7dfx5wzgo-1772709682443 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-0e7dfx5wzgo-1772709682443 .actor-man circle,#mermaid-0e7dfx5wzgo-1772709682443 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-0e7dfx5wzgo-1772709682443 :root{--mermaid-font-family:inherit;}Preempted...Memory = BMemory = A (but state changed!)ResumesCAS succeeds!But intermediate state changemay have corrupted linked dataRead A (expected = A)Change A → BChange B → ACAS(A, newValue)

The diagram shows the classic ABA sequence. Thread 1 reads A and gets preempted. Thread 2 performs a complete A→B→A cycle. When Thread 1 resumes, it sees A and thinks nothing changed. But if A was a pointer to a node in a linked list, that node might have been freed and reallocated during the B phase. Thread 1's CAS succeeds, but it is now pointing to garbage or a completely different node.

### When It Matters

The ABA problem is most dangerous with pointer-based structures:

*   **Lock-free stacks:** Pop returns a node, another thread pops and pushes, reusing the same memory address
*   **Lock-free queues:** Similar issues with node recycling
*   **Memory pools:** Reused memory addresses look identical to CAS

For simple integer counters, ABA is usually not a problem. If a counter goes 5→6→5, the CAS might succeed unexpectedly, but the value is still valid.

### Solutions

#### **1\. Tagged Pointers / Version Numbers**

Add a version counter that increments on every modification. Instead of comparing just the pointer, compare pointer + version:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-nlfizfwcy4j-1772709682444{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-nlfizfwcy4j-1772709682444 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-nlfizfwcy4j-1772709682444 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-nlfizfwcy4j-1772709682444 .error-icon{fill:#000000;}#mermaid-nlfizfwcy4j-1772709682444 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-nlfizfwcy4j-1772709682444 .edge-thickness-normal{stroke-width:1px;}#mermaid-nlfizfwcy4j-1772709682444 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-nlfizfwcy4j-1772709682444 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-nlfizfwcy4j-1772709682444 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-nlfizfwcy4j-1772709682444 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-nlfizfwcy4j-1772709682444 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-nlfizfwcy4j-1772709682444 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-nlfizfwcy4j-1772709682444 .marker.cross{stroke:#22c55e;}#mermaid-nlfizfwcy4j-1772709682444 svg{font-family:inherit;font-size:16px;}#mermaid-nlfizfwcy4j-1772709682444 p{margin:0;}#mermaid-nlfizfwcy4j-1772709682444 .label{font-family:inherit;color:#f0fdf4;}#mermaid-nlfizfwcy4j-1772709682444 .cluster-label text{fill:#fafafa;}#mermaid-nlfizfwcy4j-1772709682444 .cluster-label span{color:#fafafa;}#mermaid-nlfizfwcy4j-1772709682444 .cluster-label span p{background-color:transparent;}#mermaid-nlfizfwcy4j-1772709682444 .label text,#mermaid-nlfizfwcy4j-1772709682444 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-nlfizfwcy4j-1772709682444 .node rect,#mermaid-nlfizfwcy4j-1772709682444 .node circle,#mermaid-nlfizfwcy4j-1772709682444 .node ellipse,#mermaid-nlfizfwcy4j-1772709682444 .node polygon,#mermaid-nlfizfwcy4j-1772709682444 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-nlfizfwcy4j-1772709682444 .rough-node .label text,#mermaid-nlfizfwcy4j-1772709682444 .node .label text,#mermaid-nlfizfwcy4j-1772709682444 .image-shape .label,#mermaid-nlfizfwcy4j-1772709682444 .icon-shape .label{text-anchor:middle;}#mermaid-nlfizfwcy4j-1772709682444 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-nlfizfwcy4j-1772709682444 .rough-node .label,#mermaid-nlfizfwcy4j-1772709682444 .node .label,#mermaid-nlfizfwcy4j-1772709682444 .image-shape .label,#mermaid-nlfizfwcy4j-1772709682444 .icon-shape .label{text-align:center;}#mermaid-nlfizfwcy4j-1772709682444 .node.clickable{cursor:pointer;}#mermaid-nlfizfwcy4j-1772709682444 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-nlfizfwcy4j-1772709682444 .arrowheadPath{fill:#0b0b0b;}#mermaid-nlfizfwcy4j-1772709682444 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-nlfizfwcy4j-1772709682444 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-nlfizfwcy4j-1772709682444 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-nlfizfwcy4j-1772709682444 .edgeLabel p{background-color:#0a0a0a;}#mermaid-nlfizfwcy4j-1772709682444 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-nlfizfwcy4j-1772709682444 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-nlfizfwcy4j-1772709682444 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-nlfizfwcy4j-1772709682444 .cluster text{fill:#fafafa;}#mermaid-nlfizfwcy4j-1772709682444 .cluster span{color:#fafafa;}#mermaid-nlfizfwcy4j-1772709682444 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-nlfizfwcy4j-1772709682444 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-nlfizfwcy4j-1772709682444 rect.text{fill:none;stroke-width:0;}#mermaid-nlfizfwcy4j-1772709682444 .icon-shape,#mermaid-nlfizfwcy4j-1772709682444 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-nlfizfwcy4j-1772709682444 .icon-shape p,#mermaid-nlfizfwcy4j-1772709682444 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-nlfizfwcy4j-1772709682444 .icon-shape rect,#mermaid-nlfizfwcy4j-1772709682444 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-nlfizfwcy4j-1772709682444 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-nlfizfwcy4j-1772709682444 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-nlfizfwcy4j-1772709682444 :root{--mermaid-font-family:inherit;}#mermaid-nlfizfwcy4j-1772709682444 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-nlfizfwcy4j-1772709682444 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-nlfizfwcy4j-1772709682444 .primary tspan{fill:#000!important;}#mermaid-nlfizfwcy4j-1772709682444 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-nlfizfwcy4j-1772709682444 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-nlfizfwcy4j-1772709682444 .orange tspan{fill:#000!important;}

Tagged Pointer (64-bit)

Pointer: 0x1234

Version: 42

Regular Pointer

Pointer: 0x1234

Even if the pointer returns to the same address, the version number will be different, causing the CAS to fail.

#### **2\. AtomicStampedReference (Java)**

Java provides `AtomicStampedReference` specifically for solving the ABA problem:

Java

```java
1import java.util.concurrent.atomic.AtomicStampedReference;
2
3public class ABASolution {
4    private final AtomicStampedReference<Node> head;
5
6    public ABASolution() {
7        head = new AtomicStampedReference<>(null, 0);
8    }
9
10    public void push(Node newNode) {
11        int[] stampHolder = new int[1];
12        Node currentHead;
13        do {
14            currentHead = head.get(stampHolder);
15            int currentStamp = stampHolder[0];
16            newNode.next = currentHead;
17            // CAS includes both reference AND stamp
18        } while (!head.compareAndSet(currentHead, newNode,
19                                      currentStamp, currentStamp + 1));
20    }
21
22    public Node pop() {
23        int[] stampHolder = new int[1];
24        Node currentHead;
25        Node newHead;
26        do {
27            currentHead = head.get(stampHolder);
28            if (currentHead == null) {
29                return null;
30            }
31            newHead = currentHead.next;
32        } while (!head.compareAndSet(currentHead, newHead,
33                                      stampHolder[0], stampHolder[0] + 1));
34        return currentHead;
35    }
36}
```

The stamp (version number) increments on every operation. Even if the reference returns to the same value, the stamp will be different.

#### **3\. Hazard Pointers**

A more sophisticated technique where threads publish pointers they are currently using. Other threads check these "hazard pointers" before freeing memory. This prevents the problematic memory reuse entirely.

#### **4\. Epoch-Based Reclamation**

Memory is not freed immediately. Instead, it is retired to a list. Only when all threads have advanced past the retirement epoch is the memory actually freed. This ensures no thread is using the memory during the ABA-vulnerable window.

# Performance Considerations

### CAS vs Lock Overhead

Operation

Uncontended

High Contention (8 threads)

Mutex lock/unlock

~25 ns

~1-10 μs

CAS (success)

~5-10 ns

~10-30 ns

CAS (failure + retry)

N/A

~50-200 ns average

CAS (extreme contention)

N/A

May exceed lock

### When CAS Wins

*   **Short critical sections:** Less time for contention to build
*   **Read-heavy workloads:** Readers do not conflict with each other
*   **Low to moderate contention:** Retries are rare
*   **Latency-sensitive applications:** No blocking means no tail latency spikes

### When Locks Win

*   **High contention:** CAS spinning wastes CPU
*   **Long critical sections:** Blocking is cheaper than burning cycles
*   **Priority scheduling needs:** Locks can support priority inheritance
*   **Simpler correctness reasoning:** Easier to verify

# Quiz

## Quiz: Compare-and-Swap (CAS)

1 / 8

Multiple Choice

What are the three arguments that a Compare-and-Swap (CAS) operation takes?

ALock handle, expected value, callback function to execute on successBMemory location, expected value, new valueCThread ID, current value, replacement value to swap inDMemory location, old value, timeout duration for the operation

PreviousNext

Launching soon
