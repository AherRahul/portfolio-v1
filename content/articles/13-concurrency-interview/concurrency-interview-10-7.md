---
title: "Bounded Buffer"
description: "Bounded Buffer - Concurrency Interview Module 10"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Bounded Buffer

The **Bounded Buffer Problem** is perhaps the most practical of all classic concurrency problems. Also known as the Producer-Consumer Problem, it models the fundamental pattern of data flow between components in virtually every software system.

What makes the Bounded Buffer Problem compelling is its directness. It has a clear goal: producers add items, consumers remove them, and the buffer has limited capacity. The challenge is coordinating these operations efficiently without losing data, corrupting the buffer, or deadlocking.

# Problem Statement

A fixed-size buffer shared between producer and consumer threads. Producers add items to the buffer, consumers remove them. The buffer can hold at most N items at any time.

#### The Setup

Understanding the three components is essential before we dive into solutions:

1.  **Producers:** Threads that generate data items and add them to the buffer. A producer must wait if the buffer is full.
2.  **Consumers:** Threads that remove items from the buffer and process them. A consumer must wait if the buffer is empty.
3.  **Buffer:** A fixed-size container (array, queue, or ring buffer) with capacity N. Items are typically added and removed in FIFO order.

Each component has a clear responsibility, but their interactions create subtle synchronization challenges. The producer can't just blindly add items, and the consumer can't just blindly remove them. They need to coordinate.

#### The Rules

The constraints that make this problem interesting are deceptively simple:

1.  A producer cannot add to a full buffer (must wait for space).
2.  A consumer cannot remove from an empty buffer (must wait for data).
3.  Multiple producers and consumers may operate concurrently.
4.  Buffer operations must be thread-safe (no data corruption).

These rules seem straightforward, but enforcing them correctly in a multi-threaded environment is where the challenge lies. Rule 1 and 2 require some form of blocking. Rule 3 requires coordination among multiple threads. Rule 4 requires mutual exclusion on shared state.

#### The Goal

We need a synchronization protocol that achieves all of the following:

*   **No deadlock:** System never freezes with producers waiting for consumers who are waiting for producers.
*   **No data loss:** Every produced item is consumed exactly once.
*   **No buffer corruption:** Concurrent operations don't corrupt buffer state.
*   **No busy waiting:** Threads sleep efficiently when they can't proceed.

Each goal eliminates a different class of bugs. Deadlock means the system hangs. Data loss means messages disappear. Buffer corruption means random crashes or wrong data. Busy waiting means wasted CPU and poor scalability.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-60po26e7uzi-1772709689950{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-60po26e7uzi-1772709689950 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-60po26e7uzi-1772709689950 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-60po26e7uzi-1772709689950 .error-icon{fill:#000000;}#mermaid-60po26e7uzi-1772709689950 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-60po26e7uzi-1772709689950 .edge-thickness-normal{stroke-width:1px;}#mermaid-60po26e7uzi-1772709689950 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-60po26e7uzi-1772709689950 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-60po26e7uzi-1772709689950 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-60po26e7uzi-1772709689950 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-60po26e7uzi-1772709689950 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-60po26e7uzi-1772709689950 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-60po26e7uzi-1772709689950 .marker.cross{stroke:#22c55e;}#mermaid-60po26e7uzi-1772709689950 svg{font-family:inherit;font-size:16px;}#mermaid-60po26e7uzi-1772709689950 p{margin:0;}#mermaid-60po26e7uzi-1772709689950 .label{font-family:inherit;color:#f0fdf4;}#mermaid-60po26e7uzi-1772709689950 .cluster-label text{fill:#fafafa;}#mermaid-60po26e7uzi-1772709689950 .cluster-label span{color:#fafafa;}#mermaid-60po26e7uzi-1772709689950 .cluster-label span p{background-color:transparent;}#mermaid-60po26e7uzi-1772709689950 .label text,#mermaid-60po26e7uzi-1772709689950 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-60po26e7uzi-1772709689950 .node rect,#mermaid-60po26e7uzi-1772709689950 .node circle,#mermaid-60po26e7uzi-1772709689950 .node ellipse,#mermaid-60po26e7uzi-1772709689950 .node polygon,#mermaid-60po26e7uzi-1772709689950 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-60po26e7uzi-1772709689950 .rough-node .label text,#mermaid-60po26e7uzi-1772709689950 .node .label text,#mermaid-60po26e7uzi-1772709689950 .image-shape .label,#mermaid-60po26e7uzi-1772709689950 .icon-shape .label{text-anchor:middle;}#mermaid-60po26e7uzi-1772709689950 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-60po26e7uzi-1772709689950 .rough-node .label,#mermaid-60po26e7uzi-1772709689950 .node .label,#mermaid-60po26e7uzi-1772709689950 .image-shape .label,#mermaid-60po26e7uzi-1772709689950 .icon-shape .label{text-align:center;}#mermaid-60po26e7uzi-1772709689950 .node.clickable{cursor:pointer;}#mermaid-60po26e7uzi-1772709689950 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-60po26e7uzi-1772709689950 .arrowheadPath{fill:#0b0b0b;}#mermaid-60po26e7uzi-1772709689950 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-60po26e7uzi-1772709689950 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-60po26e7uzi-1772709689950 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-60po26e7uzi-1772709689950 .edgeLabel p{background-color:#0a0a0a;}#mermaid-60po26e7uzi-1772709689950 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-60po26e7uzi-1772709689950 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-60po26e7uzi-1772709689950 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-60po26e7uzi-1772709689950 .cluster text{fill:#fafafa;}#mermaid-60po26e7uzi-1772709689950 .cluster span{color:#fafafa;}#mermaid-60po26e7uzi-1772709689950 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-60po26e7uzi-1772709689950 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-60po26e7uzi-1772709689950 rect.text{fill:none;stroke-width:0;}#mermaid-60po26e7uzi-1772709689950 .icon-shape,#mermaid-60po26e7uzi-1772709689950 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-60po26e7uzi-1772709689950 .icon-shape p,#mermaid-60po26e7uzi-1772709689950 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-60po26e7uzi-1772709689950 .icon-shape rect,#mermaid-60po26e7uzi-1772709689950 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-60po26e7uzi-1772709689950 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-60po26e7uzi-1772709689950 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-60po26e7uzi-1772709689950 :root{--mermaid-font-family:inherit;}#mermaid-60po26e7uzi-1772709689950 .actor>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-60po26e7uzi-1772709689950 .actor span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-60po26e7uzi-1772709689950 .actor tspan{fill:#000!important;}#mermaid-60po26e7uzi-1772709689950 .resource>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-60po26e7uzi-1772709689950 .resource span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-60po26e7uzi-1772709689950 .resource tspan{fill:#000!important;}

Consumers

Buffer

Producers

Producer 1

Producer 2

Producer 3

Buffer  
capacity = N

Consumer 1

Consumer 2

The diagram shows the classic producer-consumer architecture. Multiple producers feed items into a shared buffer, and multiple consumers drain items from it. The buffer acts as a decoupling layer, allowing producers and consumers to operate at different speeds.

The Bounded Buffer Problem isn't just an academic exercise. It's the core pattern behind countless real-world systems. Every time data flows from one component to another with a queue in between, you're looking at a bounded buffer.

Understanding this problem helps you design systems that handle backpressure gracefully, avoid memory exhaustion, and maintain throughput under varying loads. When a producer generates data faster than consumers can process it, the bounded buffer provides flow control. When consumers outpace producers, the buffer absorbs bursts.

### Real-World Analogies

Classic Problem

Real-World Equivalent

Producer

Web server receiving requests

Consumer

Worker thread processing requests

Buffer

Request queue (bounded to prevent memory exhaustion)

Full buffer

Backpressure signal (reject or block new requests)

Empty buffer

Workers idle, waiting for work

### Interview Relevance

Interviewers love this problem because it tests practical knowledge. Unlike purely theoretical problems, bounded buffer solutions are used in production systems. The interviewer can probe your understanding of blocking queues, semaphores, condition variables, and even lock-free programming.

Now that we understand why this problem matters, let's examine the specific synchronization challenges we need to solve.

# Synchronization Challenges

Before jumping into solutions, let's understand what makes this problem tricky. Each challenge represents a different class of bug, and our solution must address all of them.

### Challenge 1: Buffer Overflow

If a producer adds an item without checking whether the buffer is full, it either overwrites existing data (corruption) or writes beyond buffer bounds (crash). But here's the subtle part: the check-and-add must be atomic. Otherwise, two producers might both see "one slot available" and both try to add.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Buffer (size=5, count=4)Producer 2Producer 1Buffer (size=5, count=4)Producer 2Producer 1#mermaid-nf5ntmvd9in-1772709689961{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-nf5ntmvd9in-1772709689961 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-nf5ntmvd9in-1772709689961 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-nf5ntmvd9in-1772709689961 .error-icon{fill:#000000;}#mermaid-nf5ntmvd9in-1772709689961 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-nf5ntmvd9in-1772709689961 .edge-thickness-normal{stroke-width:1px;}#mermaid-nf5ntmvd9in-1772709689961 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-nf5ntmvd9in-1772709689961 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-nf5ntmvd9in-1772709689961 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-nf5ntmvd9in-1772709689961 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-nf5ntmvd9in-1772709689961 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-nf5ntmvd9in-1772709689961 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-nf5ntmvd9in-1772709689961 .marker.cross{stroke:#22c55e;}#mermaid-nf5ntmvd9in-1772709689961 svg{font-family:inherit;font-size:16px;}#mermaid-nf5ntmvd9in-1772709689961 p{margin:0;}#mermaid-nf5ntmvd9in-1772709689961 .actor{stroke:#22c55e;fill:transparent;}#mermaid-nf5ntmvd9in-1772709689961 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-nf5ntmvd9in-1772709689961 .actor-line{stroke:#22c55e;}#mermaid-nf5ntmvd9in-1772709689961 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-nf5ntmvd9in-1772709689961 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-nf5ntmvd9in-1772709689961 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-nf5ntmvd9in-1772709689961 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-nf5ntmvd9in-1772709689961 .sequenceNumber{fill:#f0fdf4;}#mermaid-nf5ntmvd9in-1772709689961 #sequencenumber{fill:#fafafa;}#mermaid-nf5ntmvd9in-1772709689961 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-nf5ntmvd9in-1772709689961 .messageText{fill:#fafafa;stroke:none;}#mermaid-nf5ntmvd9in-1772709689961 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-nf5ntmvd9in-1772709689961 .labelText,#mermaid-nf5ntmvd9in-1772709689961 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-nf5ntmvd9in-1772709689961 .loopText,#mermaid-nf5ntmvd9in-1772709689961 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-nf5ntmvd9in-1772709689961 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-nf5ntmvd9in-1772709689961 .note{stroke:#f59e0b;fill:#422006;}#mermaid-nf5ntmvd9in-1772709689961 .noteText,#mermaid-nf5ntmvd9in-1772709689961 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-nf5ntmvd9in-1772709689961 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-nf5ntmvd9in-1772709689961 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-nf5ntmvd9in-1772709689961 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-nf5ntmvd9in-1772709689961 .actorPopupMenu{position:absolute;}#mermaid-nf5ntmvd9in-1772709689961 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-nf5ntmvd9in-1772709689961 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-nf5ntmvd9in-1772709689961 .actor-man circle,#mermaid-nf5ntmvd9in-1772709689961 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-nf5ntmvd9in-1772709689961 :root{--mermaid-font-family:inherit;}Buffer corruptedCheck: count < 5? YesCheck: count < 5? YesAdd item, count=5Add item, count=6 (OVERFLOW!)

The diagram shows the classic "time-of-check to time-of-use" (TOCTOU) race condition. Both producers check the buffer and see space available. Both proceed to add, but only one slot was actually available. The second add corrupts the buffer. This is why we need atomicity: the check and the modification must happen as one indivisible operation.

### Challenge 2: Buffer Underflow

The mirror problem affects consumers: if a consumer removes an item without checking whether the buffer is empty, it reads garbage data or crashes. Again, the check-and-remove must be atomic. Two consumers could both see "one item available," and both try to remove it.

The pattern is identical to overflow. The only difference is the direction: producers worry about full buffers, consumers worry about empty buffers.

### Challenge 3: Lost Wakeup

This is the most subtle challenge, and it catches many developers off guard. When using condition variables, a producer might signal "buffer not full" just before a consumer starts waiting. The consumer then waits forever for a signal that already happened.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

ConditionConsumerProducerConditionConsumerProducer#mermaid-83k6jxoezkr-1772709689962{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-83k6jxoezkr-1772709689962 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-83k6jxoezkr-1772709689962 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-83k6jxoezkr-1772709689962 .error-icon{fill:#000000;}#mermaid-83k6jxoezkr-1772709689962 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-83k6jxoezkr-1772709689962 .edge-thickness-normal{stroke-width:1px;}#mermaid-83k6jxoezkr-1772709689962 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-83k6jxoezkr-1772709689962 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-83k6jxoezkr-1772709689962 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-83k6jxoezkr-1772709689962 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-83k6jxoezkr-1772709689962 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-83k6jxoezkr-1772709689962 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-83k6jxoezkr-1772709689962 .marker.cross{stroke:#22c55e;}#mermaid-83k6jxoezkr-1772709689962 svg{font-family:inherit;font-size:16px;}#mermaid-83k6jxoezkr-1772709689962 p{margin:0;}#mermaid-83k6jxoezkr-1772709689962 .actor{stroke:#22c55e;fill:transparent;}#mermaid-83k6jxoezkr-1772709689962 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-83k6jxoezkr-1772709689962 .actor-line{stroke:#22c55e;}#mermaid-83k6jxoezkr-1772709689962 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-83k6jxoezkr-1772709689962 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-83k6jxoezkr-1772709689962 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-83k6jxoezkr-1772709689962 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-83k6jxoezkr-1772709689962 .sequenceNumber{fill:#f0fdf4;}#mermaid-83k6jxoezkr-1772709689962 #sequencenumber{fill:#fafafa;}#mermaid-83k6jxoezkr-1772709689962 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-83k6jxoezkr-1772709689962 .messageText{fill:#fafafa;stroke:none;}#mermaid-83k6jxoezkr-1772709689962 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-83k6jxoezkr-1772709689962 .labelText,#mermaid-83k6jxoezkr-1772709689962 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-83k6jxoezkr-1772709689962 .loopText,#mermaid-83k6jxoezkr-1772709689962 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-83k6jxoezkr-1772709689962 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-83k6jxoezkr-1772709689962 .note{stroke:#f59e0b;fill:#422006;}#mermaid-83k6jxoezkr-1772709689962 .noteText,#mermaid-83k6jxoezkr-1772709689962 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-83k6jxoezkr-1772709689962 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-83k6jxoezkr-1772709689962 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-83k6jxoezkr-1772709689962 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-83k6jxoezkr-1772709689962 .actorPopupMenu{position:absolute;}#mermaid-83k6jxoezkr-1772709689962 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-83k6jxoezkr-1772709689962 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-83k6jxoezkr-1772709689962 .actor-man circle,#mermaid-83k6jxoezkr-1772709689962 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-83k6jxoezkr-1772709689962 :root{--mermaid-font-family:inherit;}Buffer empty, about to waitSignal sent (no one waiting)Waiting forever (missed signal)signal(notEmpty)wait(notEmpty)

The signal was sent, but no one was listening. By the time the consumer starts waiting, the signal has already been "used up." This is why the order of operations and the use of locks around condition checks matter so much. We'll see how to solve this in the condition variable solution.

### Analysis Criteria

When we evaluate solutions, we'll check each against these properties:

Property

Definition

Why It Matters

**Deadlock-free**

No circular waiting

System doesn't freeze

**Starvation-free**

Every thread eventually proceeds

Fairness

**No busy waiting**

Threads sleep when blocked

CPU efficiency

**High concurrency**

Multiple operations in parallel

Throughput

Each property addresses a different concern. A solution that deadlocks is useless. A solution that starves threads is unfair. A solution with busy waiting wastes resources. A solution with low concurrency limits throughput.

# Solution 1: Naive Approach (Single Lock with Busy Waiting)

Let's start with the simplest approach to understand why it's inadequate. This helps us appreciate what the better solutions achieve.

The naive idea is straightforward: protect the buffer with a single lock and use busy waiting to handle full/empty conditions. If you can't proceed, release the lock, sleep briefly, and try again.

This approach "works" in the sense that it produces correct results. But it's terribly inefficient. Let's see why.

### Approach

Here's the strategy:

1.  Acquire the buffer lock.
2.  If buffer is full (for producer) or empty (for consumer), release lock and retry.
3.  Perform the operation.
4.  Release the lock.

The flowchart below shows the producer's logic. Notice the retry loop, this is the busy waiting pattern.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-nqqjoj80i1o-1772709689963{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-nqqjoj80i1o-1772709689963 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-nqqjoj80i1o-1772709689963 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-nqqjoj80i1o-1772709689963 .error-icon{fill:#000000;}#mermaid-nqqjoj80i1o-1772709689963 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-nqqjoj80i1o-1772709689963 .edge-thickness-normal{stroke-width:1px;}#mermaid-nqqjoj80i1o-1772709689963 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-nqqjoj80i1o-1772709689963 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-nqqjoj80i1o-1772709689963 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-nqqjoj80i1o-1772709689963 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-nqqjoj80i1o-1772709689963 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-nqqjoj80i1o-1772709689963 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-nqqjoj80i1o-1772709689963 .marker.cross{stroke:#22c55e;}#mermaid-nqqjoj80i1o-1772709689963 svg{font-family:inherit;font-size:16px;}#mermaid-nqqjoj80i1o-1772709689963 p{margin:0;}#mermaid-nqqjoj80i1o-1772709689963 .label{font-family:inherit;color:#f0fdf4;}#mermaid-nqqjoj80i1o-1772709689963 .cluster-label text{fill:#fafafa;}#mermaid-nqqjoj80i1o-1772709689963 .cluster-label span{color:#fafafa;}#mermaid-nqqjoj80i1o-1772709689963 .cluster-label span p{background-color:transparent;}#mermaid-nqqjoj80i1o-1772709689963 .label text,#mermaid-nqqjoj80i1o-1772709689963 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-nqqjoj80i1o-1772709689963 .node rect,#mermaid-nqqjoj80i1o-1772709689963 .node circle,#mermaid-nqqjoj80i1o-1772709689963 .node ellipse,#mermaid-nqqjoj80i1o-1772709689963 .node polygon,#mermaid-nqqjoj80i1o-1772709689963 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-nqqjoj80i1o-1772709689963 .rough-node .label text,#mermaid-nqqjoj80i1o-1772709689963 .node .label text,#mermaid-nqqjoj80i1o-1772709689963 .image-shape .label,#mermaid-nqqjoj80i1o-1772709689963 .icon-shape .label{text-anchor:middle;}#mermaid-nqqjoj80i1o-1772709689963 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-nqqjoj80i1o-1772709689963 .rough-node .label,#mermaid-nqqjoj80i1o-1772709689963 .node .label,#mermaid-nqqjoj80i1o-1772709689963 .image-shape .label,#mermaid-nqqjoj80i1o-1772709689963 .icon-shape .label{text-align:center;}#mermaid-nqqjoj80i1o-1772709689963 .node.clickable{cursor:pointer;}#mermaid-nqqjoj80i1o-1772709689963 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-nqqjoj80i1o-1772709689963 .arrowheadPath{fill:#0b0b0b;}#mermaid-nqqjoj80i1o-1772709689963 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-nqqjoj80i1o-1772709689963 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-nqqjoj80i1o-1772709689963 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-nqqjoj80i1o-1772709689963 .edgeLabel p{background-color:#0a0a0a;}#mermaid-nqqjoj80i1o-1772709689963 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-nqqjoj80i1o-1772709689963 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-nqqjoj80i1o-1772709689963 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-nqqjoj80i1o-1772709689963 .cluster text{fill:#fafafa;}#mermaid-nqqjoj80i1o-1772709689963 .cluster span{color:#fafafa;}#mermaid-nqqjoj80i1o-1772709689963 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-nqqjoj80i1o-1772709689963 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-nqqjoj80i1o-1772709689963 rect.text{fill:none;stroke-width:0;}#mermaid-nqqjoj80i1o-1772709689963 .icon-shape,#mermaid-nqqjoj80i1o-1772709689963 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-nqqjoj80i1o-1772709689963 .icon-shape p,#mermaid-nqqjoj80i1o-1772709689963 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-nqqjoj80i1o-1772709689963 .icon-shape rect,#mermaid-nqqjoj80i1o-1772709689963 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-nqqjoj80i1o-1772709689963 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-nqqjoj80i1o-1772709689963 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-nqqjoj80i1o-1772709689963 :root{--mermaid-font-family:inherit;}#mermaid-nqqjoj80i1o-1772709689963 .state>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-nqqjoj80i1o-1772709689963 .state span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-nqqjoj80i1o-1772709689963 .state tspan{fill:#000!important;}#mermaid-nqqjoj80i1o-1772709689963 .blocked>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-nqqjoj80i1o-1772709689963 .blocked span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-nqqjoj80i1o-1772709689963 .blocked tspan{fill:#000!important;}#mermaid-nqqjoj80i1o-1772709689963 .decision>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-nqqjoj80i1o-1772709689963 .decision span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-nqqjoj80i1o-1772709689963 .decision tspan{fill:#000!important;}

Yes

No

Start

Acquire Lock

Buffer Full?

Release Lock

Sleep briefly

Add Item

Release Lock

Done

The problem is clear: when the buffer is full, the producer releases the lock, sleeps for some arbitrary time, then tries again. It has no idea when space will actually become available. It might wake up too early (wasting cycles) or too late (hurting throughput).

### Implementation

Java

```java
1import java.util.LinkedList;
2import java.util.Queue;
3
4public class NaiveBoundedBuffer<T> {
5    private final Queue<T> buffer;
6    private final int capacity;
7    private final Object lock = new Object();
8
9    public NaiveBoundedBuffer(int capacity) {
10        this.capacity = capacity;
11        this.buffer = new LinkedList<>();
12    }
13
14    public void produce(T item) throws InterruptedException {
15        while (true) {
16            synchronized (lock) {
17                if (buffer.size() < capacity) {
18                    buffer.add(item);
19                    return;  // Success
20                }
21            }
22            // Buffer full, busy wait
23            Thread.sleep(10);  // Inefficient!
24        }
25    }
26
27    public T consume() throws InterruptedException {
28        while (true) {
29            synchronized (lock) {
30                if (!buffer.isEmpty()) {
31                    return buffer.poll();  // Success
32                }
33            }
34            // Buffer empty, busy wait
35            Thread.sleep(10);  // Inefficient!
36        }
37    }
38}
```

### Analysis

Let's evaluate this solution against our criteria:

Property

Status

Explanation

Deadlock-free

Yes

Single lock, no circular wait possible

Starvation-free

No

Threads compete randomly on retry

No busy waiting

No

Sleep-retry loop wastes CPU

Concurrency

Low

Lock held during entire operation

The solution is correct but deeply inefficient. The busy-wait loop consumes CPU cycles even when no progress is possible. With many threads, this becomes a significant waste. The 10ms sleep is arbitrary: too short wastes CPU, too long hurts responsiveness.

### The Problem

What we really need is a way to sleep until conditions change, not just sleep for an arbitrary time and check again. The producer should wake up exactly when space becomes available. The consumer should wake up exactly when an item becomes available.

This is precisely what semaphores and condition variables provide. Let's see how.

# Solution 2: Semaphore-Based Solution

The classic textbook solution uses two counting semaphores: one to track empty slots (space for producers) and one to track full slots (items for consumers). This is the solution you'll find in every operating systems textbook, and for good reason.

### Key Insight

The key insight is to think of "empty slots" and "filled slots" as resources that can be counted. Instead of checking "is there space?" repeatedly, we use a semaphore that blocks when there's no space and unblocks when space becomes available. The semaphore's count IS the number of available resources.

Think of it this way:

*   The `empty` semaphore counts how many slots are available for producers
*   The `full` semaphore counts how many items are available for consumers
*   At any time: `empty.count + full.count = buffer.capacity`

When a producer wants to add an item, it needs an empty slot. It "acquires" from the empty semaphore, which decrements the count (and blocks if count is 0). After adding, it "releases" to the full semaphore, incrementing the count of available items.

### Approach

Here's how the semaphores coordinate producers and consumers:

1.  **Empty semaphore:** Initialized to N (buffer capacity). Producers decrement before adding, consumers increment after removing.
2.  **Full semaphore:** Initialized to 0. Producers increment after adding, consumers decrement before removing.
3.  **Mutex:** Protects the buffer itself during the actual add/remove operation.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-2f0nk9izqeb-1772709689963{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-2f0nk9izqeb-1772709689963 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-2f0nk9izqeb-1772709689963 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-2f0nk9izqeb-1772709689963 .error-icon{fill:#000000;}#mermaid-2f0nk9izqeb-1772709689963 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-2f0nk9izqeb-1772709689963 .edge-thickness-normal{stroke-width:1px;}#mermaid-2f0nk9izqeb-1772709689963 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-2f0nk9izqeb-1772709689963 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-2f0nk9izqeb-1772709689963 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-2f0nk9izqeb-1772709689963 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-2f0nk9izqeb-1772709689963 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-2f0nk9izqeb-1772709689963 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-2f0nk9izqeb-1772709689963 .marker.cross{stroke:#22c55e;}#mermaid-2f0nk9izqeb-1772709689963 svg{font-family:inherit;font-size:16px;}#mermaid-2f0nk9izqeb-1772709689963 p{margin:0;}#mermaid-2f0nk9izqeb-1772709689963 .label{font-family:inherit;color:#f0fdf4;}#mermaid-2f0nk9izqeb-1772709689963 .cluster-label text{fill:#fafafa;}#mermaid-2f0nk9izqeb-1772709689963 .cluster-label span{color:#fafafa;}#mermaid-2f0nk9izqeb-1772709689963 .cluster-label span p{background-color:transparent;}#mermaid-2f0nk9izqeb-1772709689963 .label text,#mermaid-2f0nk9izqeb-1772709689963 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-2f0nk9izqeb-1772709689963 .node rect,#mermaid-2f0nk9izqeb-1772709689963 .node circle,#mermaid-2f0nk9izqeb-1772709689963 .node ellipse,#mermaid-2f0nk9izqeb-1772709689963 .node polygon,#mermaid-2f0nk9izqeb-1772709689963 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-2f0nk9izqeb-1772709689963 .rough-node .label text,#mermaid-2f0nk9izqeb-1772709689963 .node .label text,#mermaid-2f0nk9izqeb-1772709689963 .image-shape .label,#mermaid-2f0nk9izqeb-1772709689963 .icon-shape .label{text-anchor:middle;}#mermaid-2f0nk9izqeb-1772709689963 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-2f0nk9izqeb-1772709689963 .rough-node .label,#mermaid-2f0nk9izqeb-1772709689963 .node .label,#mermaid-2f0nk9izqeb-1772709689963 .image-shape .label,#mermaid-2f0nk9izqeb-1772709689963 .icon-shape .label{text-align:center;}#mermaid-2f0nk9izqeb-1772709689963 .node.clickable{cursor:pointer;}#mermaid-2f0nk9izqeb-1772709689963 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-2f0nk9izqeb-1772709689963 .arrowheadPath{fill:#0b0b0b;}#mermaid-2f0nk9izqeb-1772709689963 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-2f0nk9izqeb-1772709689963 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-2f0nk9izqeb-1772709689963 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-2f0nk9izqeb-1772709689963 .edgeLabel p{background-color:#0a0a0a;}#mermaid-2f0nk9izqeb-1772709689963 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-2f0nk9izqeb-1772709689963 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-2f0nk9izqeb-1772709689963 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-2f0nk9izqeb-1772709689963 .cluster text{fill:#fafafa;}#mermaid-2f0nk9izqeb-1772709689963 .cluster span{color:#fafafa;}#mermaid-2f0nk9izqeb-1772709689963 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-2f0nk9izqeb-1772709689963 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-2f0nk9izqeb-1772709689963 rect.text{fill:none;stroke-width:0;}#mermaid-2f0nk9izqeb-1772709689963 .icon-shape,#mermaid-2f0nk9izqeb-1772709689963 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-2f0nk9izqeb-1772709689963 .icon-shape p,#mermaid-2f0nk9izqeb-1772709689963 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-2f0nk9izqeb-1772709689963 .icon-shape rect,#mermaid-2f0nk9izqeb-1772709689963 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-2f0nk9izqeb-1772709689963 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-2f0nk9izqeb-1772709689963 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-2f0nk9izqeb-1772709689963 :root{--mermaid-font-family:inherit;}#mermaid-2f0nk9izqeb-1772709689963 .state>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-2f0nk9izqeb-1772709689963 .state span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-2f0nk9izqeb-1772709689963 .state tspan{fill:#000!important;}#mermaid-2f0nk9izqeb-1772709689963 .decision>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-2f0nk9izqeb-1772709689963 .decision span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-2f0nk9izqeb-1772709689963 .decision tspan{fill:#000!important;}

Producer

Wait on empty  
semaphore

Acquire mutex

Add item

Release mutex

Signal full  
semaphore

Consumer

Wait on full  
semaphore

Acquire mutex

Remove item

Release mutex

Signal empty  
semaphore

Notice the symmetry. Producers wait on empty and signal full. Consumers wait on full and signal empty. The semaphores handle the waiting logic efficiently. A producer blocks on `empty` until space is available. A consumer blocks on `full` until items are available. No busy waiting.

Why do we need a separate mutex? The semaphores only handle coordination (how many slots/items). The mutex protects the buffer's internal data structures from concurrent modification.

### Implementation

Java

```java
1import java.util.LinkedList;
2import java.util.Queue;
3import java.util.concurrent.Semaphore;
4
5public class SemaphoreBoundedBuffer<T> {
6    private final Queue<T> buffer;
7    private final Semaphore empty;  // Counts empty slots
8    private final Semaphore full;   // Counts items
9    private final Semaphore mutex;  // Protects buffer access
10
11    public SemaphoreBoundedBuffer(int capacity) {
12        this.buffer = new LinkedList<>();
13        this.empty = new Semaphore(capacity);  // N empty slots initially
14        this.full = new Semaphore(0);          // 0 items initially
15        this.mutex = new Semaphore(1);         // Binary semaphore for mutex
16    }
17
18    public void produce(T item) throws InterruptedException {
19        empty.acquire();  // Wait for empty slot
20        try {
21            mutex.acquire();  // Protect buffer access
22            try {
23                buffer.add(item);
24            } finally {
25                mutex.release();
26            }
27        } finally {
28            full.release();  // Signal item available
29        }
30    }
31
32    public T consume() throws InterruptedException {
33        full.acquire();  // Wait for item
34        T item;
35        try {
36            mutex.acquire();  // Protect buffer access
37            try {
38                item = buffer.poll();
39            } finally {
40                mutex.release();
41            }
42        } finally {
43            empty.release();  // Signal slot available
44        }
45        return item;
46    }
47}
```

### Analysis

Property

Status

Explanation

Deadlock-free

Yes

Semaphores acquired in consistent order

Starvation-free

Depends

Depends on semaphore fairness implementation

No busy waiting

Yes

Semaphores block efficiently

Concurrency

Medium

Mutex serializes buffer access

The semaphore-based solution is elegant and efficient. The `empty` and `full` semaphores track available resources, while the mutex protects the buffer's internal state. This is the classic textbook answer and works well in practice.

### Why This Works

Let's trace through a scenario to see why this solution is correct:

1.  Initial state: `empty = 5`, `full = 0`, buffer is empty
2.  Producer 1 calls `produce()`: acquires from `empty` (now 4), adds item, releases to `full` (now 1)
3.  Producer 2 calls `produce()`: acquires from `empty` (now 3), adds item, releases to `full` (now 2)
4.  Consumer calls `consume()`: acquires from `full` (now 1), removes item, releases to `empty` (now 4)
5.  ... and so on

The semaphore counts always reflect reality: `empty + full = capacity`. No race conditions are possible because:

*   Producers can't add without acquiring from `empty` first
*   Consumers can't remove without acquiring from `full` first
*   The mutex ensures only one thread modifies the buffer at a time

# Solution 3: Monitor-Based Solution (Condition Variables)

Monitors with condition variables offer a more flexible approach than semaphores. They're particularly useful when conditions are more complex than simple counting, or when you want finer control over signaling.

### Key Insight

Instead of using semaphores to count resources, we use condition variables to wait for specific conditions (buffer not full, buffer not empty) and signal when those conditions change. The condition variable is tied to a lock, and the `wait()` operation atomically releases the lock and suspends the thread.

The key difference from semaphores: with condition variables, we explicitly check the condition we're waiting for. This makes the code more readable and handles complex conditions more naturally.

### Approach

Here's how the monitor coordinates producers and consumers:

1.  **Single lock:** Protects all buffer state.
2.  **notFull condition:** Producers wait on this when buffer is full.
3.  **notEmpty condition:** Consumers wait on this when buffer is empty.
4.  After each operation, signal the appropriate condition.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-adhemxc0xtr-1772709689964{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-adhemxc0xtr-1772709689964 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-adhemxc0xtr-1772709689964 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-adhemxc0xtr-1772709689964 .error-icon{fill:#000000;}#mermaid-adhemxc0xtr-1772709689964 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-adhemxc0xtr-1772709689964 .edge-thickness-normal{stroke-width:1px;}#mermaid-adhemxc0xtr-1772709689964 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-adhemxc0xtr-1772709689964 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-adhemxc0xtr-1772709689964 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-adhemxc0xtr-1772709689964 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-adhemxc0xtr-1772709689964 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-adhemxc0xtr-1772709689964 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-adhemxc0xtr-1772709689964 .marker.cross{stroke:#22c55e;}#mermaid-adhemxc0xtr-1772709689964 svg{font-family:inherit;font-size:16px;}#mermaid-adhemxc0xtr-1772709689964 p{margin:0;}#mermaid-adhemxc0xtr-1772709689964 .label{font-family:inherit;color:#f0fdf4;}#mermaid-adhemxc0xtr-1772709689964 .cluster-label text{fill:#fafafa;}#mermaid-adhemxc0xtr-1772709689964 .cluster-label span{color:#fafafa;}#mermaid-adhemxc0xtr-1772709689964 .cluster-label span p{background-color:transparent;}#mermaid-adhemxc0xtr-1772709689964 .label text,#mermaid-adhemxc0xtr-1772709689964 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-adhemxc0xtr-1772709689964 .node rect,#mermaid-adhemxc0xtr-1772709689964 .node circle,#mermaid-adhemxc0xtr-1772709689964 .node ellipse,#mermaid-adhemxc0xtr-1772709689964 .node polygon,#mermaid-adhemxc0xtr-1772709689964 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-adhemxc0xtr-1772709689964 .rough-node .label text,#mermaid-adhemxc0xtr-1772709689964 .node .label text,#mermaid-adhemxc0xtr-1772709689964 .image-shape .label,#mermaid-adhemxc0xtr-1772709689964 .icon-shape .label{text-anchor:middle;}#mermaid-adhemxc0xtr-1772709689964 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-adhemxc0xtr-1772709689964 .rough-node .label,#mermaid-adhemxc0xtr-1772709689964 .node .label,#mermaid-adhemxc0xtr-1772709689964 .image-shape .label,#mermaid-adhemxc0xtr-1772709689964 .icon-shape .label{text-align:center;}#mermaid-adhemxc0xtr-1772709689964 .node.clickable{cursor:pointer;}#mermaid-adhemxc0xtr-1772709689964 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-adhemxc0xtr-1772709689964 .arrowheadPath{fill:#0b0b0b;}#mermaid-adhemxc0xtr-1772709689964 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-adhemxc0xtr-1772709689964 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-adhemxc0xtr-1772709689964 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-adhemxc0xtr-1772709689964 .edgeLabel p{background-color:#0a0a0a;}#mermaid-adhemxc0xtr-1772709689964 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-adhemxc0xtr-1772709689964 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-adhemxc0xtr-1772709689964 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-adhemxc0xtr-1772709689964 .cluster text{fill:#fafafa;}#mermaid-adhemxc0xtr-1772709689964 .cluster span{color:#fafafa;}#mermaid-adhemxc0xtr-1772709689964 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-adhemxc0xtr-1772709689964 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-adhemxc0xtr-1772709689964 rect.text{fill:none;stroke-width:0;}#mermaid-adhemxc0xtr-1772709689964 .icon-shape,#mermaid-adhemxc0xtr-1772709689964 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-adhemxc0xtr-1772709689964 .icon-shape p,#mermaid-adhemxc0xtr-1772709689964 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-adhemxc0xtr-1772709689964 .icon-shape rect,#mermaid-adhemxc0xtr-1772709689964 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-adhemxc0xtr-1772709689964 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-adhemxc0xtr-1772709689964 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-adhemxc0xtr-1772709689964 :root{--mermaid-font-family:inherit;}#mermaid-adhemxc0xtr-1772709689964 .state>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-adhemxc0xtr-1772709689964 .state span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-adhemxc0xtr-1772709689964 .state tspan{fill:#000!important;}#mermaid-adhemxc0xtr-1772709689964 .waiting>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-adhemxc0xtr-1772709689964 .waiting span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-adhemxc0xtr-1772709689964 .waiting tspan{fill:#000!important;}#mermaid-adhemxc0xtr-1772709689964 .decision>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-adhemxc0xtr-1772709689964 .decision span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-adhemxc0xtr-1772709689964 .decision tspan{fill:#000!important;}

Producer Flow

Yes

No

Acquire lock

Buffer full?

Wait on notFull

Add item

Signal notEmpty

Release lock

The condition variable automatically releases the lock while waiting and reacquires it when signaled. This avoids deadlock from holding the lock while sleeping.

### Implementation

Java

```java
1import java.util.LinkedList;
2import java.util.Queue;
3import java.util.concurrent.locks.Condition;
4import java.util.concurrent.locks.Lock;
5import java.util.concurrent.locks.ReentrantLock;
6
7public class MonitorBoundedBuffer<T> {
8    private final Queue<T> buffer;
9    private final int capacity;
10    private final Lock lock;
11    private final Condition notFull;
12    private final Condition notEmpty;
13
14    public MonitorBoundedBuffer(int capacity) {
15        this.capacity = capacity;
16        this.buffer = new LinkedList<>();
17        this.lock = new ReentrantLock();
18        this.notFull = lock.newCondition();
19        this.notEmpty = lock.newCondition();
20    }
21
22    public void produce(T item) throws InterruptedException {
23        lock.lock();
24        try {
25            // Wait while buffer is full
26            while (buffer.size() == capacity) {
27                notFull.await();
28            }
29            buffer.add(item);
30            notEmpty.signal();  // Wake one waiting consumer
31        } finally {
32            lock.unlock();
33        }
34    }
35
36    public T consume() throws InterruptedException {
37        lock.lock();
38        try {
39            // Wait while buffer is empty
40            while (buffer.isEmpty()) {
41                notEmpty.await();
42            }
43            T item = buffer.poll();
44            notFull.signal();  // Wake one waiting producer
45            return item;
46        } finally {
47            lock.unlock();
48        }
49    }
50}
```

#### Code Walkthrough

Let's highlight the key synchronization points:

1.  **while loop for wait:** We use `while`, not `if`, because of spurious wakeups and stolen wakeups. A thread might wake up even when the condition isn't actually true. The C++ version uses `wait()` with a predicate which internally implements the while loop.
2.  **signal vs signalAll:** We use `signal()` (notify one) because each operation creates exactly one opportunity (one slot or one item). Using `signalAll()` would wake all waiters unnecessarily, causing thundering herd.
3.  **Lock ordering:** The lock is held during the entire check-wait-modify-signal sequence. This is safe because `await()`/`wait()` atomically releases the lock while sleeping. When the thread wakes up, it reacquires the lock before returning from `wait()`.

### Analysis

Property

Status

Explanation

Deadlock-free

Yes

Single lock, condition wait releases lock

Starvation-free

Depends

Depends on signal ordering in wait queues

No busy waiting

Yes

Condition variables block efficiently

Concurrency

Medium

Single lock serializes all operations

### Correctness Argument

Why is this solution correct? Let's trace through the invariants:

1.  **Mutual Exclusion:** The lock protects all buffer operations. Only one thread can modify the buffer at a time.
2.  **Progress:** When a producer adds an item, it signals notEmpty, waking a blocked consumer. When a consumer removes an item, it signals notFull, waking a blocked producer. No thread waits forever when progress is possible.
3.  **No Lost Wakeup:** The while loop re-checks the condition after waking, handling spurious wakeups. The lock is held when checking and when signaling, ensuring signals aren't lost to threads that haven't started waiting yet.
4.  **Bounded buffer invariant:** The buffer never exceeds capacity because producers only add when `buffer.size() < capacity`. The buffer never goes negative because consumers only remove when `!buffer.isEmpty()`.

# Solution Comparison

Approach

Deadlock-free

No Busy Wait

Concurrency

Complexity

Best For

Naive (sleep-retry)

Yes

No

Low

Simple

Prototyping only

Semaphore-based

Yes

Yes

Medium

Medium

Standard solution

Monitor-based

Yes

Yes

Medium

Medium

Complex conditions

Recommendation

Use the semaphore-based solution for interviews as it's the classic textbook answer. The monitor-based solution is equally good and more flexible for variations. Both are correct and efficient.

When should you prefer one over the other?

*   **Semaphores:** When your synchronization is about counting resources (slots, permits, connections). The counting is implicit in the semaphore value.
*   **Condition Variables:** When your conditions are more complex than simple counts ("wait until at least 3 items AND total value > 100"), or when you need multiple different conditions on the same data.

In practice, they're often interchangeable for the basic bounded buffer problem. The real difference emerges with variations.

# Alternative Solutions

For completeness, let's look at some alternative approaches you might encounter or be asked about in interviews.

### Alternative 1: Lock-Free Circular Buffer

For maximum throughput in single-producer, single-consumer (SPSC) scenarios, a lock-free circular buffer using atomic operations eliminates all blocking.

The key insight is that if there's exactly one producer and one consumer, they access different parts of the buffer. The producer writes at `tail` and only the producer modifies `tail`. The consumer reads at `head` and only the consumer modifies `head`. With careful use of atomic operations and memory ordering, no locks are needed.

Java

```java
1import java.util.concurrent.atomic.AtomicInteger;
2
3public class LockFreeRingBuffer<T> {
4    private final Object[] buffer;
5    private final int capacity;
6    private final AtomicInteger head = new AtomicInteger(0);
7    private final AtomicInteger tail = new AtomicInteger(0);
8
9    @SuppressWarnings("unchecked")
10    public LockFreeRingBuffer(int capacity) {
11        // Capacity must be power of 2 for efficient modulo
12        this.capacity = Integer.highestOneBit(capacity - 1) << 1;
13        this.buffer = new Object[this.capacity];
14    }
15
16    // Single producer only
17    public boolean tryProduce(T item) {
18        int currentTail = tail.get();
19        int nextTail = (currentTail + 1) & (capacity - 1);
20        if (nextTail == head.get()) {
21            return false;  // Buffer full
22        }
23        buffer[currentTail] = item;
24        tail.set(nextTail);  // Release store
25        return true;
26    }
27
28    // Single consumer only
29    @SuppressWarnings("unchecked")
30    public T tryConsume() {
31        int currentHead = head.get();
32        if (currentHead == tail.get()) {
33            return null;  // Buffer empty
34        }
35        T item = (T) buffer[currentHead];
36        head.set((currentHead + 1) & (capacity - 1));  // Release store
37        return item;
38    }
39}
```

**When to prefer:** High-performance SPSC scenarios like audio processing, network packet queues, or inter-thread message passing where lock contention is the bottleneck. The LMAX Disruptor, used in high-frequency trading systems, is based on this pattern.

**Important limitation:** This only works for single-producer, single-consumer. With multiple producers or multiple consumers, you need more complex lock-free algorithms (like Michael-Scott queues) or just use locks.

### Alternative 2: Blocking Queues

In real applications, don't reinvent the wheel. Every major language provides production-quality bounded queues:

Java

```java
1import java.util.concurrent.ArrayBlockingQueue;
2import java.util.concurrent.BlockingQueue;
3
4BlockingQueue<String> buffer = new ArrayBlockingQueue<>(100);
5
6// Producer
7buffer.put("item");  // Blocks if full
8
9// Consumer
10String item = buffer.take();  // Blocks if empty
```

These are production-grade, well-tested, and handle all edge cases including interruption, timeouts, and fairness.

Launching soon
