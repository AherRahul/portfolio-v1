---
title: "Synchronized vs ReentrantLock"
description: "Synchronized vs ReentrantLock - Concurrency Interview Module 4"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Synchronized vs ReentrantLock

When multiple threads access shared data, you need a way to prevent race conditions. In Java, the two most common tools are `synchronized` and `ReentrantLock`. Both provide **mutual exclusion**, meaning only one thread can enter a critical section at a time.

`synchronized` is built into the language. It is simple to use, automatically releases the lock even if an exception occurs, and benefits from JVM optimizations.

`ReentrantLock` is part of `java.util.concurrent.locks` and offers more control: timed and interruptible lock acquisition, optional fairness, and multiple condition variables. That flexibility is useful in advanced scenarios, but it requires more discipline, especially always unlocking in a `finally` block.

In this chapter, we will compare both across usability, correctness, performance under contention, and when to choose each in real systems.

# How synchronized Works Internally

Every object in Java has an associated monitor (also called intrinsic lock). When a thread enters a synchronized block, it acquires the monitor. When it exits, it releases the monitor. Only one thread can hold a monitor at a time.

### Object Header and Mark Word

To understand synchronization, you need to understand the object header. Every Java object starts with a header containing metadata:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-h2pthvspx5k-1772709669396{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-h2pthvspx5k-1772709669396 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-h2pthvspx5k-1772709669396 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-h2pthvspx5k-1772709669396 .error-icon{fill:#000000;}#mermaid-h2pthvspx5k-1772709669396 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-h2pthvspx5k-1772709669396 .edge-thickness-normal{stroke-width:1px;}#mermaid-h2pthvspx5k-1772709669396 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-h2pthvspx5k-1772709669396 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-h2pthvspx5k-1772709669396 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-h2pthvspx5k-1772709669396 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-h2pthvspx5k-1772709669396 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-h2pthvspx5k-1772709669396 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-h2pthvspx5k-1772709669396 .marker.cross{stroke:#22c55e;}#mermaid-h2pthvspx5k-1772709669396 svg{font-family:inherit;font-size:16px;}#mermaid-h2pthvspx5k-1772709669396 p{margin:0;}#mermaid-h2pthvspx5k-1772709669396 .label{font-family:inherit;color:#f0fdf4;}#mermaid-h2pthvspx5k-1772709669396 .cluster-label text{fill:#fafafa;}#mermaid-h2pthvspx5k-1772709669396 .cluster-label span{color:#fafafa;}#mermaid-h2pthvspx5k-1772709669396 .cluster-label span p{background-color:transparent;}#mermaid-h2pthvspx5k-1772709669396 .label text,#mermaid-h2pthvspx5k-1772709669396 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-h2pthvspx5k-1772709669396 .node rect,#mermaid-h2pthvspx5k-1772709669396 .node circle,#mermaid-h2pthvspx5k-1772709669396 .node ellipse,#mermaid-h2pthvspx5k-1772709669396 .node polygon,#mermaid-h2pthvspx5k-1772709669396 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-h2pthvspx5k-1772709669396 .rough-node .label text,#mermaid-h2pthvspx5k-1772709669396 .node .label text,#mermaid-h2pthvspx5k-1772709669396 .image-shape .label,#mermaid-h2pthvspx5k-1772709669396 .icon-shape .label{text-anchor:middle;}#mermaid-h2pthvspx5k-1772709669396 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-h2pthvspx5k-1772709669396 .rough-node .label,#mermaid-h2pthvspx5k-1772709669396 .node .label,#mermaid-h2pthvspx5k-1772709669396 .image-shape .label,#mermaid-h2pthvspx5k-1772709669396 .icon-shape .label{text-align:center;}#mermaid-h2pthvspx5k-1772709669396 .node.clickable{cursor:pointer;}#mermaid-h2pthvspx5k-1772709669396 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-h2pthvspx5k-1772709669396 .arrowheadPath{fill:#0b0b0b;}#mermaid-h2pthvspx5k-1772709669396 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-h2pthvspx5k-1772709669396 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-h2pthvspx5k-1772709669396 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-h2pthvspx5k-1772709669396 .edgeLabel p{background-color:#0a0a0a;}#mermaid-h2pthvspx5k-1772709669396 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-h2pthvspx5k-1772709669396 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-h2pthvspx5k-1772709669396 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-h2pthvspx5k-1772709669396 .cluster text{fill:#fafafa;}#mermaid-h2pthvspx5k-1772709669396 .cluster span{color:#fafafa;}#mermaid-h2pthvspx5k-1772709669396 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-h2pthvspx5k-1772709669396 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-h2pthvspx5k-1772709669396 rect.text{fill:none;stroke-width:0;}#mermaid-h2pthvspx5k-1772709669396 .icon-shape,#mermaid-h2pthvspx5k-1772709669396 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-h2pthvspx5k-1772709669396 .icon-shape p,#mermaid-h2pthvspx5k-1772709669396 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-h2pthvspx5k-1772709669396 .icon-shape rect,#mermaid-h2pthvspx5k-1772709669396 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-h2pthvspx5k-1772709669396 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-h2pthvspx5k-1772709669396 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-h2pthvspx5k-1772709669396 :root{--mermaid-font-family:inherit;}

Object Header

Mark Word Contents

Identity HashCode

GC Age (4 bits)

Biased Lock Info

Lock Bits (2-3 bits)

Lock Record / Monitor Pointer

Mark Word  
(8 bytes)

Class Pointer  
(4-8 bytes)

The mark word is the key to understanding lock implementation. Its contents change based on the lock state:

Lock State

Mark Word Contents

Unlocked

HashCode, GC age, 01

Biased

Thread ID, epoch, GC age, 101

Thin (Lightweight)

Pointer to lock record in stack, 00

Fat (Heavyweight)

Pointer to monitor object, 10

GC marked

Forwarding address, 11

### Lock Escalation

The JVM uses a clever optimization called lock escalation (or lock inflation). Locks start cheap and become heavier only when contention requires it.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-nnw4ygl7p8-1772709669402{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-nnw4ygl7p8-1772709669402 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-nnw4ygl7p8-1772709669402 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-nnw4ygl7p8-1772709669402 .error-icon{fill:#000000;}#mermaid-nnw4ygl7p8-1772709669402 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-nnw4ygl7p8-1772709669402 .edge-thickness-normal{stroke-width:1px;}#mermaid-nnw4ygl7p8-1772709669402 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-nnw4ygl7p8-1772709669402 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-nnw4ygl7p8-1772709669402 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-nnw4ygl7p8-1772709669402 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-nnw4ygl7p8-1772709669402 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-nnw4ygl7p8-1772709669402 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-nnw4ygl7p8-1772709669402 .marker.cross{stroke:#22c55e;}#mermaid-nnw4ygl7p8-1772709669402 svg{font-family:inherit;font-size:16px;}#mermaid-nnw4ygl7p8-1772709669402 p{margin:0;}#mermaid-nnw4ygl7p8-1772709669402 defs #statediagram-barbEnd{fill:#22c55e;stroke:#22c55e;}#mermaid-nnw4ygl7p8-1772709669402 g.stateGroup text{fill:#22c55e;stroke:none;font-size:10px;}#mermaid-nnw4ygl7p8-1772709669402 g.stateGroup text{fill:#fafafa;stroke:none;font-size:10px;}#mermaid-nnw4ygl7p8-1772709669402 g.stateGroup .state-title{font-weight:bolder;fill:#166534;}#mermaid-nnw4ygl7p8-1772709669402 g.stateGroup rect{fill:#166534;stroke:#22c55e;}#mermaid-nnw4ygl7p8-1772709669402 g.stateGroup line{stroke:#22c55e;stroke-width:1;}#mermaid-nnw4ygl7p8-1772709669402 .transition{stroke:#22c55e;stroke-width:1;fill:none;}#mermaid-nnw4ygl7p8-1772709669402 .stateGroup .composit{fill:#f4f4f4;border-bottom:1px;}#mermaid-nnw4ygl7p8-1772709669402 .stateGroup .alt-composit{fill:#e0e0e0;border-bottom:1px;}#mermaid-nnw4ygl7p8-1772709669402 .state-note{stroke:#f59e0b;fill:#422006;}#mermaid-nnw4ygl7p8-1772709669402 .state-note text{fill:#fef3c7;stroke:none;font-size:10px;}#mermaid-nnw4ygl7p8-1772709669402 .stateLabel .box{stroke:none;stroke-width:0;fill:#166534;opacity:0.5;}#mermaid-nnw4ygl7p8-1772709669402 .edgeLabel .label rect{fill:#166534;opacity:0.5;}#mermaid-nnw4ygl7p8-1772709669402 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-nnw4ygl7p8-1772709669402 .edgeLabel p{background-color:#0a0a0a;}#mermaid-nnw4ygl7p8-1772709669402 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-nnw4ygl7p8-1772709669402 .edgeLabel .label text{fill:#fafafa;}#mermaid-nnw4ygl7p8-1772709669402 .label div .edgeLabel{color:#fafafa;}#mermaid-nnw4ygl7p8-1772709669402 .stateLabel text{fill:#166534;font-size:10px;font-weight:bold;}#mermaid-nnw4ygl7p8-1772709669402 .node circle.state-start{fill:#22c55e;stroke:#22c55e;}#mermaid-nnw4ygl7p8-1772709669402 .node .fork-join{fill:#22c55e;stroke:#22c55e;}#mermaid-nnw4ygl7p8-1772709669402 .node circle.state-end{fill:#22c55e;stroke:#f4f4f4;stroke-width:1.5;}#mermaid-nnw4ygl7p8-1772709669402 .end-state-inner{fill:#0a0a0a;stroke-width:1.5;}#mermaid-nnw4ygl7p8-1772709669402 .node rect{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-nnw4ygl7p8-1772709669402 .node polygon{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-nnw4ygl7p8-1772709669402 #statediagram-barbEnd{fill:#22c55e;}#mermaid-nnw4ygl7p8-1772709669402 .statediagram-cluster rect{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-nnw4ygl7p8-1772709669402 .cluster-label,#mermaid-nnw4ygl7p8-1772709669402 .nodeLabel{color:#166534;}#mermaid-nnw4ygl7p8-1772709669402 .statediagram-cluster rect.outer{rx:5px;ry:5px;}#mermaid-nnw4ygl7p8-1772709669402 .statediagram-state .divider{stroke:#22c55e;}#mermaid-nnw4ygl7p8-1772709669402 .statediagram-state .title-state{rx:5px;ry:5px;}#mermaid-nnw4ygl7p8-1772709669402 .statediagram-cluster.statediagram-cluster .inner{fill:#0a0a0a;}#mermaid-nnw4ygl7p8-1772709669402 .statediagram-cluster.statediagram-cluster-alt .inner{fill:#0a0a0a;}#mermaid-nnw4ygl7p8-1772709669402 .statediagram-cluster .inner{rx:0;ry:0;}#mermaid-nnw4ygl7p8-1772709669402 .statediagram-state rect.basic{rx:5px;ry:5px;}#mermaid-nnw4ygl7p8-1772709669402 .statediagram-state rect.divider{stroke-dasharray:10,10;fill:#0a0a0a;}#mermaid-nnw4ygl7p8-1772709669402 .note-edge{stroke-dasharray:5;}#mermaid-nnw4ygl7p8-1772709669402 .statediagram-note rect{fill:#422006;stroke:#f59e0b;stroke-width:1px;rx:0;ry:0;}#mermaid-nnw4ygl7p8-1772709669402 .statediagram-note rect{fill:#422006;stroke:#f59e0b;stroke-width:1px;rx:0;ry:0;}#mermaid-nnw4ygl7p8-1772709669402 .statediagram-note text{fill:#fef3c7;}#mermaid-nnw4ygl7p8-1772709669402 .statediagram-note .nodeLabel{color:#fef3c7;}#mermaid-nnw4ygl7p8-1772709669402 .statediagram .edgeLabel{color:red;}#mermaid-nnw4ygl7p8-1772709669402 #dependencyStart,#mermaid-nnw4ygl7p8-1772709669402 #dependencyEnd{fill:#22c55e;stroke:#22c55e;stroke-width:1;}#mermaid-nnw4ygl7p8-1772709669402 .statediagramTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-nnw4ygl7p8-1772709669402 :root{--mermaid-font-family:inherit;}#mermaid-nnw4ygl7p8-1772709669402 .unlocked>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-nnw4ygl7p8-1772709669402 .unlocked span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-nnw4ygl7p8-1772709669402 .unlocked tspan{fill:#000!important;}#mermaid-nnw4ygl7p8-1772709669402 .biased>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-nnw4ygl7p8-1772709669402 .biased span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-nnw4ygl7p8-1772709669402 .biased tspan{fill:#000!important;}#mermaid-nnw4ygl7p8-1772709669402 .thin>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-nnw4ygl7p8-1772709669402 .thin span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-nnw4ygl7p8-1772709669402 .thin tspan{fill:#000!important;}#mermaid-nnw4ygl7p8-1772709669402 .fat>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-nnw4ygl7p8-1772709669402 .fat span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-nnw4ygl7p8-1772709669402 .fat tspan{fill:#000!important;}

First thread acquires

Same thread re-acquires

Different thread tries to acquire

Same thread re-acquires  
(CAS succeeds)

Contention  
(CAS spins fail)

Any thread acquires/waits

Revocation  
(bulk or safepoint)

Thread exits sync block

Last thread exits  
(deflation, if enabled)

Unlocked

Biased

ThinLock

FatLock

**Biased Locking** (Deprecated in JDK 15, disabled by default in JDK 18+)

When a thread first acquires a lock, the JVM assumes the same thread will acquire it again. It "biases" the lock to that thread by storing the thread ID in the mark word. Subsequent acquisitions by the same thread require no atomic operations, just a comparison.

Java

```java
1// First acquisition by Thread A
2synchronized (obj) {  // Store Thread A's ID in mark word
3    // Work
4}
5
6// Second acquisition by Thread A
7synchronized (obj) {  // Just compare IDs - super fast!
8    // More work
9}
```

If a different thread tries to acquire a biased lock, bias revocation occurs at a safepoint, which is expensive.

#### **Thin (Lightweight) Locking**

When bias is revoked or disabled, the JVM uses thin locks. The acquiring thread:

1.  Creates a lock record in its stack frame
2.  Copies the mark word to the lock record
3.  Uses CAS to replace the mark word with a pointer to the lock record

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Object HeaderThread StackThreadObject HeaderThread StackThread#mermaid-df85izxyarg-1772709669403{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-df85izxyarg-1772709669403 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-df85izxyarg-1772709669403 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-df85izxyarg-1772709669403 .error-icon{fill:#000000;}#mermaid-df85izxyarg-1772709669403 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-df85izxyarg-1772709669403 .edge-thickness-normal{stroke-width:1px;}#mermaid-df85izxyarg-1772709669403 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-df85izxyarg-1772709669403 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-df85izxyarg-1772709669403 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-df85izxyarg-1772709669403 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-df85izxyarg-1772709669403 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-df85izxyarg-1772709669403 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-df85izxyarg-1772709669403 .marker.cross{stroke:#22c55e;}#mermaid-df85izxyarg-1772709669403 svg{font-family:inherit;font-size:16px;}#mermaid-df85izxyarg-1772709669403 p{margin:0;}#mermaid-df85izxyarg-1772709669403 .actor{stroke:#22c55e;fill:transparent;}#mermaid-df85izxyarg-1772709669403 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-df85izxyarg-1772709669403 .actor-line{stroke:#22c55e;}#mermaid-df85izxyarg-1772709669403 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-df85izxyarg-1772709669403 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-df85izxyarg-1772709669403 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-df85izxyarg-1772709669403 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-df85izxyarg-1772709669403 .sequenceNumber{fill:#f0fdf4;}#mermaid-df85izxyarg-1772709669403 #sequencenumber{fill:#fafafa;}#mermaid-df85izxyarg-1772709669403 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-df85izxyarg-1772709669403 .messageText{fill:#fafafa;stroke:none;}#mermaid-df85izxyarg-1772709669403 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-df85izxyarg-1772709669403 .labelText,#mermaid-df85izxyarg-1772709669403 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-df85izxyarg-1772709669403 .loopText,#mermaid-df85izxyarg-1772709669403 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-df85izxyarg-1772709669403 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-df85izxyarg-1772709669403 .note{stroke:#f59e0b;fill:#422006;}#mermaid-df85izxyarg-1772709669403 .noteText,#mermaid-df85izxyarg-1772709669403 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-df85izxyarg-1772709669403 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-df85izxyarg-1772709669403 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-df85izxyarg-1772709669403 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-df85izxyarg-1772709669403 .actorPopupMenu{position:absolute;}#mermaid-df85izxyarg-1772709669403 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-df85izxyarg-1772709669403 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-df85izxyarg-1772709669403 .actor-man circle,#mermaid-df85izxyarg-1772709669403 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-df85izxyarg-1772709669403 :root{--mermaid-font-family:inherit;}If spins exhausted, escalate to fat lockalt\[CAS Success\]\[CAS Fail\]Create Lock RecordStore displaced mark wordCAS (mark word → lock record ptr)Lock acquired!Spin and retry

Thin locks are still very fast because CAS is a single CPU instruction. They work well under low contention.

#### **Fat (Heavyweight) Locking**

When spinning fails repeatedly, the lock inflates to a fat lock. The JVM allocates a full monitor object (ObjectMonitor in HotSpot) that includes:

*   Owner thread
*   Entry count (for reentrancy)
*   Wait set (threads that called wait())
*   Entry list (threads waiting to acquire)

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-pi8sltdu9t-1772709669404{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-pi8sltdu9t-1772709669404 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-pi8sltdu9t-1772709669404 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-pi8sltdu9t-1772709669404 .error-icon{fill:#000000;}#mermaid-pi8sltdu9t-1772709669404 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-pi8sltdu9t-1772709669404 .edge-thickness-normal{stroke-width:1px;}#mermaid-pi8sltdu9t-1772709669404 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-pi8sltdu9t-1772709669404 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-pi8sltdu9t-1772709669404 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-pi8sltdu9t-1772709669404 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-pi8sltdu9t-1772709669404 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-pi8sltdu9t-1772709669404 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-pi8sltdu9t-1772709669404 .marker.cross{stroke:#22c55e;}#mermaid-pi8sltdu9t-1772709669404 svg{font-family:inherit;font-size:16px;}#mermaid-pi8sltdu9t-1772709669404 p{margin:0;}#mermaid-pi8sltdu9t-1772709669404 .label{font-family:inherit;color:#f0fdf4;}#mermaid-pi8sltdu9t-1772709669404 .cluster-label text{fill:#fafafa;}#mermaid-pi8sltdu9t-1772709669404 .cluster-label span{color:#fafafa;}#mermaid-pi8sltdu9t-1772709669404 .cluster-label span p{background-color:transparent;}#mermaid-pi8sltdu9t-1772709669404 .label text,#mermaid-pi8sltdu9t-1772709669404 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-pi8sltdu9t-1772709669404 .node rect,#mermaid-pi8sltdu9t-1772709669404 .node circle,#mermaid-pi8sltdu9t-1772709669404 .node ellipse,#mermaid-pi8sltdu9t-1772709669404 .node polygon,#mermaid-pi8sltdu9t-1772709669404 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-pi8sltdu9t-1772709669404 .rough-node .label text,#mermaid-pi8sltdu9t-1772709669404 .node .label text,#mermaid-pi8sltdu9t-1772709669404 .image-shape .label,#mermaid-pi8sltdu9t-1772709669404 .icon-shape .label{text-anchor:middle;}#mermaid-pi8sltdu9t-1772709669404 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-pi8sltdu9t-1772709669404 .rough-node .label,#mermaid-pi8sltdu9t-1772709669404 .node .label,#mermaid-pi8sltdu9t-1772709669404 .image-shape .label,#mermaid-pi8sltdu9t-1772709669404 .icon-shape .label{text-align:center;}#mermaid-pi8sltdu9t-1772709669404 .node.clickable{cursor:pointer;}#mermaid-pi8sltdu9t-1772709669404 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-pi8sltdu9t-1772709669404 .arrowheadPath{fill:#0b0b0b;}#mermaid-pi8sltdu9t-1772709669404 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-pi8sltdu9t-1772709669404 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-pi8sltdu9t-1772709669404 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-pi8sltdu9t-1772709669404 .edgeLabel p{background-color:#0a0a0a;}#mermaid-pi8sltdu9t-1772709669404 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-pi8sltdu9t-1772709669404 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-pi8sltdu9t-1772709669404 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-pi8sltdu9t-1772709669404 .cluster text{fill:#fafafa;}#mermaid-pi8sltdu9t-1772709669404 .cluster span{color:#fafafa;}#mermaid-pi8sltdu9t-1772709669404 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-pi8sltdu9t-1772709669404 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-pi8sltdu9t-1772709669404 rect.text{fill:none;stroke-width:0;}#mermaid-pi8sltdu9t-1772709669404 .icon-shape,#mermaid-pi8sltdu9t-1772709669404 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-pi8sltdu9t-1772709669404 .icon-shape p,#mermaid-pi8sltdu9t-1772709669404 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-pi8sltdu9t-1772709669404 .icon-shape rect,#mermaid-pi8sltdu9t-1772709669404 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-pi8sltdu9t-1772709669404 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-pi8sltdu9t-1772709669404 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-pi8sltdu9t-1772709669404 :root{--mermaid-font-family:inherit;}

Waiting Threads

ObjectMonitor Structure

called wait()

trying to acquire

recently arrived

\_owner: Thread\*

\_recursions: int

\_WaitSet: ObjectWaiter\*

\_EntryList: ObjectWaiter\*

\_cxq: ObjectWaiter\*

Thread 1

Thread 2

Thread 3

Fat locks are expensive because blocked threads must be parked (put to sleep by the OS) and later unparked, involving system calls and context switches.

# synchronized Mechanics

Now that we understand how locks escalate under the hood, let's look at how you actually use synchronized in practice. There are two forms: method synchronization and block synchronization.

### Method vs Block Synchronization

When you add `synchronized` to an instance method, the lock is the `this` object. When you add it to a static method, the lock is the Class object. The following examples show the equivalence between method and block forms.

Java

```java
1// Method synchronization - lock on 'this'
2public synchronized void instanceMethod() {
3    // ...
4}
5
6// Equivalent to:
7public void instanceMethod() {
8    synchronized (this) {
9        // ...
10    }
11}
12
13// Static method - lock on Class object
14public static synchronized void staticMethod() {
15    // ...
16}
17
18// Equivalent to:
19public static void staticMethod() {
20    synchronized (MyClass.class) {
21        // ...
22    }
23}
```

Understanding this equivalence matters because it affects what gets locked. Two `synchronized` instance methods on the same object cannot run concurrently. But a `synchronized` instance method and a `synchronized` static method can, because they lock different objects.

At the bytecode level:

*   Method synchronization uses the `ACC_SYNCHRONIZED` flag
*   Block synchronization uses `monitorenter` and `monitorexit` instructions

Java

```java
1// Block synchronization
2synchronized (obj) {
3    // code
4}
5
6// Compiles to:
7// monitorenter
8// <code>
9// monitorexit (normal path)
10// monitorexit (exception path - in finally block)
```

The compiler generates two `monitorexit` instructions: one for normal exit and one for exception handling. This ensures the lock is always released.

### Reentrancy

Why does reentrancy matter? Consider what happens without it. A thread acquires a lock, then calls another method that also needs the lock. Without reentrancy, the thread would deadlock waiting for itself to release a lock it's holding.

Both synchronized and ReentrantLock allow the same thread to acquire the lock multiple times. This is called reentrancy, and it solves a fundamental problem in object-oriented programming where methods often call other methods on the same object.

Here is a simple example showing reentrancy in action.

Java

```java
1public class ReentrantExample {
2    public synchronized void outer() {
3        System.out.println("In outer");
4        inner();  // Same thread can acquire again
5    }
6
7    public synchronized void inner() {
8        System.out.println("In inner");
9    }
10}
```

When `outer()` calls `inner()`, the thread already holds the lock on `this`. Without reentrancy, the thread would block forever waiting to acquire a lock it already holds. With reentrancy, the thread recognizes it already owns the lock and proceeds.

**How Entry Count Works**

The lock maintains an entry count (also called hold count or recursion count) that tracks how many times the owning thread has acquired the lock. Here is the mechanics.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Entry CountLock StateThread AEntry CountLock StateThread A#mermaid-7k0cnk66jl6-1772709669405{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-7k0cnk66jl6-1772709669405 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-7k0cnk66jl6-1772709669405 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-7k0cnk66jl6-1772709669405 .error-icon{fill:#000000;}#mermaid-7k0cnk66jl6-1772709669405 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-7k0cnk66jl6-1772709669405 .edge-thickness-normal{stroke-width:1px;}#mermaid-7k0cnk66jl6-1772709669405 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-7k0cnk66jl6-1772709669405 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-7k0cnk66jl6-1772709669405 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-7k0cnk66jl6-1772709669405 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-7k0cnk66jl6-1772709669405 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-7k0cnk66jl6-1772709669405 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-7k0cnk66jl6-1772709669405 .marker.cross{stroke:#22c55e;}#mermaid-7k0cnk66jl6-1772709669405 svg{font-family:inherit;font-size:16px;}#mermaid-7k0cnk66jl6-1772709669405 p{margin:0;}#mermaid-7k0cnk66jl6-1772709669405 .actor{stroke:#22c55e;fill:transparent;}#mermaid-7k0cnk66jl6-1772709669405 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-7k0cnk66jl6-1772709669405 .actor-line{stroke:#22c55e;}#mermaid-7k0cnk66jl6-1772709669405 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-7k0cnk66jl6-1772709669405 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-7k0cnk66jl6-1772709669405 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-7k0cnk66jl6-1772709669405 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-7k0cnk66jl6-1772709669405 .sequenceNumber{fill:#f0fdf4;}#mermaid-7k0cnk66jl6-1772709669405 #sequencenumber{fill:#fafafa;}#mermaid-7k0cnk66jl6-1772709669405 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-7k0cnk66jl6-1772709669405 .messageText{fill:#fafafa;stroke:none;}#mermaid-7k0cnk66jl6-1772709669405 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-7k0cnk66jl6-1772709669405 .labelText,#mermaid-7k0cnk66jl6-1772709669405 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-7k0cnk66jl6-1772709669405 .loopText,#mermaid-7k0cnk66jl6-1772709669405 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-7k0cnk66jl6-1772709669405 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-7k0cnk66jl6-1772709669405 .note{stroke:#f59e0b;fill:#422006;}#mermaid-7k0cnk66jl6-1772709669405 .noteText,#mermaid-7k0cnk66jl6-1772709669405 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-7k0cnk66jl6-1772709669405 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-7k0cnk66jl6-1772709669405 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-7k0cnk66jl6-1772709669405 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-7k0cnk66jl6-1772709669405 .actorPopupMenu{position:absolute;}#mermaid-7k0cnk66jl6-1772709669405 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-7k0cnk66jl6-1772709669405 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-7k0cnk66jl6-1772709669405 .actor-man circle,#mermaid-7k0cnk66jl6-1772709669405 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-7k0cnk66jl6-1772709669405 :root{--mermaid-font-family:inherit;}Unlocked, count=0Locked by Thread AStill locked by Thread AStill locked (count > 0)Fully unlockedouter() - acquire lockcount = 1inner() - acquire lock (reentrant)count = 2inner() returns - release lockcount = 1outer() returns - release lockcount = 0

The key insight is that each acquisition increments the count, and each release decrements it. The lock is only truly released when the count reaches zero. This allows methods to safely call other synchronized methods without worrying about lock ownership.

Here is a more detailed example that demonstrates the entry count mechanics.

Java

```java
1public class EntryCountDemo {
2    private final ReentrantLock lock = new ReentrantLock();
3
4    public void demonstrateReentrancy() {
5        System.out.println("Before any lock: holdCount = " + lock.getHoldCount());
6
7        lock.lock();  // First acquisition
8        try {
9            System.out.println("After first lock: holdCount = " + lock.getHoldCount());
10            // Output: 1
11
12            lock.lock();  // Second acquisition (reentrant)
13            try {
14                System.out.println("After second lock: holdCount = " + lock.getHoldCount());
15                // Output: 2
16
17                lock.lock();  // Third acquisition (reentrant)
18                try {
19                    System.out.println("After third lock: holdCount = " + lock.getHoldCount());
20                    // Output: 3
21                } finally {
22                    lock.unlock();  // count goes to 2
23                }
24
25                System.out.println("After third unlock: holdCount = " + lock.getHoldCount());
26                // Output: 2
27            } finally {
28                lock.unlock();  // count goes to 1
29            }
30
31            System.out.println("After second unlock: holdCount = " + lock.getHoldCount());
32            // Output: 1
33        } finally {
34            lock.unlock();  // count goes to 0, lock fully released
35        }
36
37        System.out.println("After final unlock: holdCount = " + lock.getHoldCount());
38        // Output: 0
39    }
40}
```

Running this produces the following output showing exactly how the entry count changes.

```shell
1Before any lock: holdCount = 0
2After first lock: holdCount = 1
3After second lock: holdCount = 2
4After third lock: holdCount = 3
5After third unlock: holdCount = 2
6After second unlock: holdCount = 1
7After final unlock: holdCount = 0
```

**A Common Reentrancy Mistake**

One subtle bug occurs when the number of unlocks does not match the number of locks.

Java

```java
1// WRONG - mismatched lock/unlock
2public void buggyMethod() {
3    lock.lock();
4    lock.lock();  // Reentrant acquisition
5    try {
6        doWork();
7    } finally {
8        lock.unlock();  // Only one unlock! Lock still held
9    }
10}
11
12// CORRECT - each lock has matching unlock
13public void correctMethod() {
14    lock.lock();
15    try {
16        lock.lock();
17        try {
18            doWork();
19        } finally {
20            lock.unlock();  // Matches inner lock
21        }
22    } finally {
23        lock.unlock();  // Matches outer lock
24    }
25}
```

The safest approach is to use try-finally for every `lock()` call. This ensures each acquisition has exactly one corresponding release, regardless of how deeply nested your reentrant calls become.

Now that we understand how both types of locks work internally, let's look at ReentrantLock specifically and see what additional capabilities it provides beyond the synchronized keyword.

# ReentrantLock Deep Dive

`ReentrantLock` is part of `java.util.concurrent.locks` and provides explicit lock operations with additional features. It was introduced in Java 5 as part of Doug Lea's java.util.concurrent package, giving developers more control over locking behavior.

### Basic Usage

The fundamental pattern for using ReentrantLock is lock-try-finally-unlock. This example shows a simple thread-safe counter.

Java

```java
1import java.util.concurrent.locks.ReentrantLock;
2
3public class ExplicitLocking {
4    private final ReentrantLock lock = new ReentrantLock();
5    private int count = 0;
6
7    public void increment() {
8        lock.lock();  // Acquire
9        try {
10            count++;
11        } finally {
12            lock.unlock();  // Always release in finally!
13        }
14    }
15}
```

Notice the structure: `lock()` is called before the try block, and `unlock()` is in the finally block. This ensures the lock is released regardless of whether an exception occurs. The try-finally pattern is essential because, unlike synchronized which guarantees release even on exception, ReentrantLock requires explicit unlock.

### ReentrantLock Internals

So how does ReentrantLock actually work under the hood? It is built on AbstractQueuedSynchronizer (AQS), a powerful framework for building locks and synchronizers. Understanding AQS helps you understand not just ReentrantLock, but also Semaphore, CountDownLatch, and other synchronizers.

The diagram below shows the key components of AQS.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-xjzwydijj-1772709669406{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-xjzwydijj-1772709669406 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-xjzwydijj-1772709669406 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-xjzwydijj-1772709669406 .error-icon{fill:#000000;}#mermaid-xjzwydijj-1772709669406 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-xjzwydijj-1772709669406 .edge-thickness-normal{stroke-width:1px;}#mermaid-xjzwydijj-1772709669406 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-xjzwydijj-1772709669406 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-xjzwydijj-1772709669406 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-xjzwydijj-1772709669406 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-xjzwydijj-1772709669406 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-xjzwydijj-1772709669406 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-xjzwydijj-1772709669406 .marker.cross{stroke:#22c55e;}#mermaid-xjzwydijj-1772709669406 svg{font-family:inherit;font-size:16px;}#mermaid-xjzwydijj-1772709669406 p{margin:0;}#mermaid-xjzwydijj-1772709669406 .label{font-family:inherit;color:#f0fdf4;}#mermaid-xjzwydijj-1772709669406 .cluster-label text{fill:#fafafa;}#mermaid-xjzwydijj-1772709669406 .cluster-label span{color:#fafafa;}#mermaid-xjzwydijj-1772709669406 .cluster-label span p{background-color:transparent;}#mermaid-xjzwydijj-1772709669406 .label text,#mermaid-xjzwydijj-1772709669406 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-xjzwydijj-1772709669406 .node rect,#mermaid-xjzwydijj-1772709669406 .node circle,#mermaid-xjzwydijj-1772709669406 .node ellipse,#mermaid-xjzwydijj-1772709669406 .node polygon,#mermaid-xjzwydijj-1772709669406 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-xjzwydijj-1772709669406 .rough-node .label text,#mermaid-xjzwydijj-1772709669406 .node .label text,#mermaid-xjzwydijj-1772709669406 .image-shape .label,#mermaid-xjzwydijj-1772709669406 .icon-shape .label{text-anchor:middle;}#mermaid-xjzwydijj-1772709669406 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-xjzwydijj-1772709669406 .rough-node .label,#mermaid-xjzwydijj-1772709669406 .node .label,#mermaid-xjzwydijj-1772709669406 .image-shape .label,#mermaid-xjzwydijj-1772709669406 .icon-shape .label{text-align:center;}#mermaid-xjzwydijj-1772709669406 .node.clickable{cursor:pointer;}#mermaid-xjzwydijj-1772709669406 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-xjzwydijj-1772709669406 .arrowheadPath{fill:#0b0b0b;}#mermaid-xjzwydijj-1772709669406 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-xjzwydijj-1772709669406 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-xjzwydijj-1772709669406 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-xjzwydijj-1772709669406 .edgeLabel p{background-color:#0a0a0a;}#mermaid-xjzwydijj-1772709669406 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-xjzwydijj-1772709669406 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-xjzwydijj-1772709669406 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-xjzwydijj-1772709669406 .cluster text{fill:#fafafa;}#mermaid-xjzwydijj-1772709669406 .cluster span{color:#fafafa;}#mermaid-xjzwydijj-1772709669406 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-xjzwydijj-1772709669406 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-xjzwydijj-1772709669406 rect.text{fill:none;stroke-width:0;}#mermaid-xjzwydijj-1772709669406 .icon-shape,#mermaid-xjzwydijj-1772709669406 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-xjzwydijj-1772709669406 .icon-shape p,#mermaid-xjzwydijj-1772709669406 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-xjzwydijj-1772709669406 .icon-shape rect,#mermaid-xjzwydijj-1772709669406 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-xjzwydijj-1772709669406 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-xjzwydijj-1772709669406 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-xjzwydijj-1772709669406 :root{--mermaid-font-family:inherit;}#mermaid-xjzwydijj-1772709669406 .decision>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-xjzwydijj-1772709669406 .decision span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-xjzwydijj-1772709669406 .decision tspan{fill:#000!important;}

CLH Queue (FIFO)

AbstractQueuedSynchronizer

Node Structure

thread: Thread

waitStatus: int

prev: Node

next: Node

state: int

head: Node

tail: Node

Node 1  
(waiting)

Node 2  
(waiting)

Node 3  
(waiting)

Key components:

*   **state**: 0 = unlocked, >0 = locked (value = hold count for reentrancy)
*   **CLH Queue**: A FIFO queue of waiting threads
*   **CAS operations**: Lock-free manipulation of state and queue

### Lock Acquisition Flow

When you call `lock()`, what actually happens? The following simplified code shows the acquisition path for a non-fair lock.

Java

```java
1// Simplified non-fair lock acquisition
2public void lock() {
3    if (compareAndSetState(0, 1)) {
4        setExclusiveOwnerThread(Thread.currentThread());
5    } else {
6        acquire(1);  // Failed CAS, go to queue
7    }
8}
9
10void acquire(int arg) {
11    if (!tryAcquire(arg)) {
12        // Add to queue and park
13        Node node = addWaiter(Node.EXCLUSIVE);
14        acquireQueued(node, arg);
15    }
16}
```

The first thing a thread does is try a CAS (compare-and-swap) to change state from 0 to 1. If successful, it owns the lock. If not, it checks whether it's the current owner (for reentrancy) and either increments the state or joins the CLH queue. The flowchart below visualizes this process.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-tqq2dpuirs-1772709669406{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-tqq2dpuirs-1772709669406 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-tqq2dpuirs-1772709669406 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-tqq2dpuirs-1772709669406 .error-icon{fill:#000000;}#mermaid-tqq2dpuirs-1772709669406 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-tqq2dpuirs-1772709669406 .edge-thickness-normal{stroke-width:1px;}#mermaid-tqq2dpuirs-1772709669406 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-tqq2dpuirs-1772709669406 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-tqq2dpuirs-1772709669406 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-tqq2dpuirs-1772709669406 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-tqq2dpuirs-1772709669406 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-tqq2dpuirs-1772709669406 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-tqq2dpuirs-1772709669406 .marker.cross{stroke:#22c55e;}#mermaid-tqq2dpuirs-1772709669406 svg{font-family:inherit;font-size:16px;}#mermaid-tqq2dpuirs-1772709669406 p{margin:0;}#mermaid-tqq2dpuirs-1772709669406 .label{font-family:inherit;color:#f0fdf4;}#mermaid-tqq2dpuirs-1772709669406 .cluster-label text{fill:#fafafa;}#mermaid-tqq2dpuirs-1772709669406 .cluster-label span{color:#fafafa;}#mermaid-tqq2dpuirs-1772709669406 .cluster-label span p{background-color:transparent;}#mermaid-tqq2dpuirs-1772709669406 .label text,#mermaid-tqq2dpuirs-1772709669406 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-tqq2dpuirs-1772709669406 .node rect,#mermaid-tqq2dpuirs-1772709669406 .node circle,#mermaid-tqq2dpuirs-1772709669406 .node ellipse,#mermaid-tqq2dpuirs-1772709669406 .node polygon,#mermaid-tqq2dpuirs-1772709669406 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-tqq2dpuirs-1772709669406 .rough-node .label text,#mermaid-tqq2dpuirs-1772709669406 .node .label text,#mermaid-tqq2dpuirs-1772709669406 .image-shape .label,#mermaid-tqq2dpuirs-1772709669406 .icon-shape .label{text-anchor:middle;}#mermaid-tqq2dpuirs-1772709669406 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-tqq2dpuirs-1772709669406 .rough-node .label,#mermaid-tqq2dpuirs-1772709669406 .node .label,#mermaid-tqq2dpuirs-1772709669406 .image-shape .label,#mermaid-tqq2dpuirs-1772709669406 .icon-shape .label{text-align:center;}#mermaid-tqq2dpuirs-1772709669406 .node.clickable{cursor:pointer;}#mermaid-tqq2dpuirs-1772709669406 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-tqq2dpuirs-1772709669406 .arrowheadPath{fill:#0b0b0b;}#mermaid-tqq2dpuirs-1772709669406 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-tqq2dpuirs-1772709669406 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-tqq2dpuirs-1772709669406 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-tqq2dpuirs-1772709669406 .edgeLabel p{background-color:#0a0a0a;}#mermaid-tqq2dpuirs-1772709669406 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-tqq2dpuirs-1772709669406 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-tqq2dpuirs-1772709669406 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-tqq2dpuirs-1772709669406 .cluster text{fill:#fafafa;}#mermaid-tqq2dpuirs-1772709669406 .cluster span{color:#fafafa;}#mermaid-tqq2dpuirs-1772709669406 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-tqq2dpuirs-1772709669406 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-tqq2dpuirs-1772709669406 rect.text{fill:none;stroke-width:0;}#mermaid-tqq2dpuirs-1772709669406 .icon-shape,#mermaid-tqq2dpuirs-1772709669406 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-tqq2dpuirs-1772709669406 .icon-shape p,#mermaid-tqq2dpuirs-1772709669406 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-tqq2dpuirs-1772709669406 .icon-shape rect,#mermaid-tqq2dpuirs-1772709669406 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-tqq2dpuirs-1772709669406 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-tqq2dpuirs-1772709669406 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-tqq2dpuirs-1772709669406 :root{--mermaid-font-family:inherit;}#mermaid-tqq2dpuirs-1772709669406 .decision>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-tqq2dpuirs-1772709669406 .decision span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-tqq2dpuirs-1772709669406 .decision tspan{fill:#000!important;}

Success

Fail

Yes

No

Success

Fail

lock() called

CAS: state 0 → 1

Set owner = current thread  
Lock acquired!

Is current thread owner?

Increment state  
Lock acquired!

Add to CLH queue

Park thread (sleep)

Thread unparked

Try to acquire

The key insight from this flow is that lock acquisition is optimistic: try the fast path first (CAS), only fall back to queuing if that fails. This design minimizes overhead in the common uncontended case while still providing correct behavior under contention.

# Feature Comparison

Now that we understand how both synchronized and ReentrantLock work internally, let's compare their features. This is where ReentrantLock really shines, offering capabilities that synchronized simply cannot provide.

### tryLock: Non-blocking Acquisition

One of the most useful features of ReentrantLock is `tryLock()`, which attempts to acquire the lock without blocking. Here is a basic example.

Java

```java
1ReentrantLock lock = new ReentrantLock();
2
3if (lock.tryLock()) {
4    try {
5        // Do work
6    } finally {
7        lock.unlock();
8    }
9} else {
10    // Lock not available, do something else
11}
```

No equivalent exists for synchronized. You either block waiting for the lock, or you do not try at all. This makes `tryLock()` invaluable for implementing patterns like "try the primary resource, fall back to secondary if busy."

### Timed Lock Acquisition

Building on `tryLock()`, you can specify a maximum wait time. This is essential for systems with SLAs or timeout requirements.

Java

```java
1if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
2    try {
3        // Do work
4    } finally {
5        lock.unlock();
6    }
7} else {
8    // Timed out - take alternative action
9    log.warn("Could not acquire lock within 100ms, returning cached value");
10    return cachedValue;
11}
```

Timed locking is invaluable for preventing deadlocks (if a lock cycle exists, one thread will eventually timeout) and implementing responsive systems that fail fast rather than hang indefinitely.

### Interruptible Lock Acquisition

What if you want to cancel a thread that is waiting for a lock? With synchronized, you cannot. The thread will wait until it acquires the lock or the JVM terminates. ReentrantLock solves this with `lockInterruptibly()`.

Java

```java
1try {
2    lock.lockInterruptibly();  // Can be interrupted while waiting
3    try {
4        // Do work
5    } finally {
6        lock.unlock();
7    }
8} catch (InterruptedException e) {
9    // Handle interruption - clean up, return, etc.
10    Thread.currentThread().interrupt();  // Restore interrupt status
11    return;
12}
```

This is essential for implementing graceful shutdown. When shutting down a server, you interrupt all worker threads. With synchronized, any thread blocked on a monitor wait continues blocking. With `lockInterruptibly()`, those threads receive an InterruptedException and can exit cleanly.

### Fairness

By default, ReentrantLock is non-fair: a thread arriving when the lock happens to be released can "barge" ahead of threads already waiting in the queue. This maximizes throughput but can cause starvation. Pass `true` to the constructor for a fair lock.

Java

```java
1ReentrantLock fairLock = new ReentrantLock(true);  // Fair lock
```

A fair lock grants access in strict FIFO order. Threads that have been waiting longest get the lock first. The difference in behavior is significant, as shown in this diagram.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-jjdyq7oyll8-1772709669407{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-jjdyq7oyll8-1772709669407 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-jjdyq7oyll8-1772709669407 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-jjdyq7oyll8-1772709669407 .error-icon{fill:#000000;}#mermaid-jjdyq7oyll8-1772709669407 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-jjdyq7oyll8-1772709669407 .edge-thickness-normal{stroke-width:1px;}#mermaid-jjdyq7oyll8-1772709669407 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-jjdyq7oyll8-1772709669407 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-jjdyq7oyll8-1772709669407 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-jjdyq7oyll8-1772709669407 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-jjdyq7oyll8-1772709669407 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-jjdyq7oyll8-1772709669407 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-jjdyq7oyll8-1772709669407 .marker.cross{stroke:#22c55e;}#mermaid-jjdyq7oyll8-1772709669407 svg{font-family:inherit;font-size:16px;}#mermaid-jjdyq7oyll8-1772709669407 p{margin:0;}#mermaid-jjdyq7oyll8-1772709669407 .label{font-family:inherit;color:#f0fdf4;}#mermaid-jjdyq7oyll8-1772709669407 .cluster-label text{fill:#fafafa;}#mermaid-jjdyq7oyll8-1772709669407 .cluster-label span{color:#fafafa;}#mermaid-jjdyq7oyll8-1772709669407 .cluster-label span p{background-color:transparent;}#mermaid-jjdyq7oyll8-1772709669407 .label text,#mermaid-jjdyq7oyll8-1772709669407 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-jjdyq7oyll8-1772709669407 .node rect,#mermaid-jjdyq7oyll8-1772709669407 .node circle,#mermaid-jjdyq7oyll8-1772709669407 .node ellipse,#mermaid-jjdyq7oyll8-1772709669407 .node polygon,#mermaid-jjdyq7oyll8-1772709669407 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-jjdyq7oyll8-1772709669407 .rough-node .label text,#mermaid-jjdyq7oyll8-1772709669407 .node .label text,#mermaid-jjdyq7oyll8-1772709669407 .image-shape .label,#mermaid-jjdyq7oyll8-1772709669407 .icon-shape .label{text-anchor:middle;}#mermaid-jjdyq7oyll8-1772709669407 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-jjdyq7oyll8-1772709669407 .rough-node .label,#mermaid-jjdyq7oyll8-1772709669407 .node .label,#mermaid-jjdyq7oyll8-1772709669407 .image-shape .label,#mermaid-jjdyq7oyll8-1772709669407 .icon-shape .label{text-align:center;}#mermaid-jjdyq7oyll8-1772709669407 .node.clickable{cursor:pointer;}#mermaid-jjdyq7oyll8-1772709669407 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-jjdyq7oyll8-1772709669407 .arrowheadPath{fill:#0b0b0b;}#mermaid-jjdyq7oyll8-1772709669407 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-jjdyq7oyll8-1772709669407 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-jjdyq7oyll8-1772709669407 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-jjdyq7oyll8-1772709669407 .edgeLabel p{background-color:#0a0a0a;}#mermaid-jjdyq7oyll8-1772709669407 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-jjdyq7oyll8-1772709669407 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-jjdyq7oyll8-1772709669407 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-jjdyq7oyll8-1772709669407 .cluster text{fill:#fafafa;}#mermaid-jjdyq7oyll8-1772709669407 .cluster span{color:#fafafa;}#mermaid-jjdyq7oyll8-1772709669407 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-jjdyq7oyll8-1772709669407 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-jjdyq7oyll8-1772709669407 rect.text{fill:none;stroke-width:0;}#mermaid-jjdyq7oyll8-1772709669407 .icon-shape,#mermaid-jjdyq7oyll8-1772709669407 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-jjdyq7oyll8-1772709669407 .icon-shape p,#mermaid-jjdyq7oyll8-1772709669407 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-jjdyq7oyll8-1772709669407 .icon-shape rect,#mermaid-jjdyq7oyll8-1772709669407 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-jjdyq7oyll8-1772709669407 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-jjdyq7oyll8-1772709669407 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-jjdyq7oyll8-1772709669407 :root{--mermaid-font-family:inherit;}#mermaid-jjdyq7oyll8-1772709669407 .decision>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-jjdyq7oyll8-1772709669407 .decision span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-jjdyq7oyll8-1772709669407 .decision tspan{fill:#000!important;}

Fair Lock

Thread arrives

Check queue

Queue empty?  
Try CAS

Queue not empty?  
Join queue

Non-Fair Lock

Thread arrives

Try CAS immediately

Success? Take lock!

Fail? Join queue

**Non-fair (default)**: An arriving thread tries to acquire immediately, potentially jumping ahead of queued threads. Better throughput, possible starvation.

**Fair**: Arriving threads always go to the back of the queue. Lower throughput (10-100x slower under contention), guaranteed no starvation.

### Condition Variables

The `synchronized` keyword uses `wait()`, `notify()`, and `notifyAll()` on the lock object for thread coordination. The limitation is that each object has exactly one wait set, so you cannot distinguish between different types of waiting threads.

Java

```java
1synchronized (lock) {
2    while (!condition) {
3        lock.wait();  // Only one wait condition possible
4    }
5}
6
7synchronized (lock) {
8    lock.notifyAll();  // Wakes ALL waiting threads - producers AND consumers!
9}
```

The problem becomes clear in producer-consumer scenarios: `notifyAll()` wakes all waiting threads, even if only consumers need to wake up. This causes unnecessary context switches and reduces throughput.

ReentrantLock solves this with Condition objects. You can create multiple conditions from a single lock, each with its own independent wait set.

Java

```java
1ReentrantLock lock = new ReentrantLock();
2Condition notEmpty = lock.newCondition();
3Condition notFull = lock.newCondition();
4
5// Producer
6lock.lock();
7try {
8    while (isFull()) {
9        notFull.await();  // Wait on "not full" condition
10    }
11    add(item);
12    notEmpty.signal();  // Signal one consumer
13} finally {
14    lock.unlock();
15}
16
17// Consumer
18lock.lock();
19try {
20    while (isEmpty()) {
21        notEmpty.await();  // Wait on "not empty" condition
22    }
23    item = remove();
24    notFull.signal();  // Signal one producer
25} finally {
26    lock.unlock();
27}
```

This code shows the producer-consumer pattern implemented cleanly: producers wait on `notFull` and signal `notEmpty`; consumers wait on `notEmpty` and signal `notFull`. No thread is ever woken unnecessarily.

Multiple conditions shine whenever you have different types of waiting threads sharing a single lock. Beyond producer-consumer, think of read-write scenarios where readers wait for writers and vice versa, or resource pools where different consumers wait for different resource types.

### Complete Feature Comparison

The table below summarizes all the feature differences between synchronized and ReentrantLock. Use this as a quick reference when making your choice.

Feature

synchronized

ReentrantLock

Basic mutual exclusion

Yes

Yes

Reentrancy

Yes

Yes

Automatic release

Yes (even on exception)

No (must use try-finally)

tryLock (non-blocking)

No

Yes

Timed lock

No

Yes

Interruptible waiting

No

Yes

Fairness policy

No (JVM decides)

Yes (configurable)

Multiple conditions

No (one per object)

Yes

Lock query (isLocked, etc.)

No

Yes

Memory footprint

Object header (8 bytes)

Object + AQS (~48 bytes)

# Decision Flowchart: When to Use Which

The flowchart below provides a quick decision path, but the real decision requires understanding the trade-offs in depth. Let's walk through both the decision tree and the reasoning behind each choice.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-vephrprxald-1772709669407{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-vephrprxald-1772709669407 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-vephrprxald-1772709669407 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-vephrprxald-1772709669407 .error-icon{fill:#000000;}#mermaid-vephrprxald-1772709669407 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-vephrprxald-1772709669407 .edge-thickness-normal{stroke-width:1px;}#mermaid-vephrprxald-1772709669407 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-vephrprxald-1772709669407 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-vephrprxald-1772709669407 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-vephrprxald-1772709669407 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-vephrprxald-1772709669407 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-vephrprxald-1772709669407 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-vephrprxald-1772709669407 .marker.cross{stroke:#22c55e;}#mermaid-vephrprxald-1772709669407 svg{font-family:inherit;font-size:16px;}#mermaid-vephrprxald-1772709669407 p{margin:0;}#mermaid-vephrprxald-1772709669407 .label{font-family:inherit;color:#f0fdf4;}#mermaid-vephrprxald-1772709669407 .cluster-label text{fill:#fafafa;}#mermaid-vephrprxald-1772709669407 .cluster-label span{color:#fafafa;}#mermaid-vephrprxald-1772709669407 .cluster-label span p{background-color:transparent;}#mermaid-vephrprxald-1772709669407 .label text,#mermaid-vephrprxald-1772709669407 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-vephrprxald-1772709669407 .node rect,#mermaid-vephrprxald-1772709669407 .node circle,#mermaid-vephrprxald-1772709669407 .node ellipse,#mermaid-vephrprxald-1772709669407 .node polygon,#mermaid-vephrprxald-1772709669407 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-vephrprxald-1772709669407 .rough-node .label text,#mermaid-vephrprxald-1772709669407 .node .label text,#mermaid-vephrprxald-1772709669407 .image-shape .label,#mermaid-vephrprxald-1772709669407 .icon-shape .label{text-anchor:middle;}#mermaid-vephrprxald-1772709669407 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-vephrprxald-1772709669407 .rough-node .label,#mermaid-vephrprxald-1772709669407 .node .label,#mermaid-vephrprxald-1772709669407 .image-shape .label,#mermaid-vephrprxald-1772709669407 .icon-shape .label{text-align:center;}#mermaid-vephrprxald-1772709669407 .node.clickable{cursor:pointer;}#mermaid-vephrprxald-1772709669407 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-vephrprxald-1772709669407 .arrowheadPath{fill:#0b0b0b;}#mermaid-vephrprxald-1772709669407 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-vephrprxald-1772709669407 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-vephrprxald-1772709669407 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-vephrprxald-1772709669407 .edgeLabel p{background-color:#0a0a0a;}#mermaid-vephrprxald-1772709669407 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-vephrprxald-1772709669407 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-vephrprxald-1772709669407 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-vephrprxald-1772709669407 .cluster text{fill:#fafafa;}#mermaid-vephrprxald-1772709669407 .cluster span{color:#fafafa;}#mermaid-vephrprxald-1772709669407 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-vephrprxald-1772709669407 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-vephrprxald-1772709669407 rect.text{fill:none;stroke-width:0;}#mermaid-vephrprxald-1772709669407 .icon-shape,#mermaid-vephrprxald-1772709669407 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-vephrprxald-1772709669407 .icon-shape p,#mermaid-vephrprxald-1772709669407 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-vephrprxald-1772709669407 .icon-shape rect,#mermaid-vephrprxald-1772709669407 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-vephrprxald-1772709669407 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-vephrprxald-1772709669407 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-vephrprxald-1772709669407 :root{--mermaid-font-family:inherit;}#mermaid-vephrprxald-1772709669407 .decision>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-vephrprxald-1772709669407 .decision span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-vephrprxald-1772709669407 .decision tspan{fill:#000!important;}

Yes

No

Yes

No

Yes

No

Yes

No

Yes

No

Need mutual exclusion?

Need tryLock or timeout?

Need interruptible waiting?

Need fairness guarantee?

Need multiple wait conditions?

Need lock query methods?

Use synchronized

Use ReentrantLock

### Prefer synchronized When

**Simple mutual exclusion with straightforward scope.** When your locking needs are simple (protect a method or a block of code), synchronized wins on simplicity. Consider a basic counter.

Java

```java
1// Simple, clean, impossible to forget to unlock
2public class Counter {
3    private int count = 0;
4
5    public synchronized void increment() {
6        count++;
7    }
8
9    public synchronized int getCount() {
10        return count;
11    }
12}
```

Compare this to the ReentrantLock version.

Java

```java
1// More verbose, easy to make mistakes
2public class Counter {
3    private final ReentrantLock lock = new ReentrantLock();
4    private int count = 0;
5
6    public void increment() {
7        lock.lock();
8        try {
9            count++;
10        } finally {
11            lock.unlock();
12        }
13    }
14
15    public int getCount() {
16        lock.lock();
17        try {
18            return count;
19        } finally {
20            lock.unlock();
21        }
22    }
23}
```

For simple cases, the extra boilerplate offers no benefit and introduces the risk of forgetting the try-finally.

**Automatic release is critical for correctness.** If your team is large, has varying experience levels, or the code will be maintained for years, synchronized reduces bug risk. The JVM guarantees release even on exceptions, panics, or OOM errors. With ReentrantLock, one forgotten `unlock()` can cause permanent deadlocks that are hard to debug.

**Lock scope is within a single method.** synchronized naturally maps to method or block scope. When you need to hold a lock across multiple methods or release it conditionally, synchronized becomes awkward, but for single-scope locking it's cleaner.

**Memory footprint matters.** If you have millions of objects that each need a lock, the difference matters. synchronized uses the object header (already exists), while ReentrantLock requires a separate object (~48 bytes). For a cache with 10 million entries, that's potentially 480MB extra just for locks.

Java

```java
1// Millions of these? synchronized uses zero extra memory
2class CacheEntry {
3    private final Object data;
4
5    public synchronized Object getData() { return data; }
6}
7
8// Each of these adds ~48 bytes
9class CacheEntryWithLock {
10    private final ReentrantLock lock = new ReentrantLock();
11    private final Object data;
12}
```

**Legacy code compatibility.** If your codebase already uses synchronized extensively, mixing in ReentrantLock creates cognitive overhead. Consistency has value.

### Prefer ReentrantLock When

**You need tryLock or timed locking.** This is the most common reason to choose ReentrantLock. When you cannot afford to block indefinitely or need to implement timeout behavior, synchronized simply cannot help.

Java

```java
1public class ResourcePool {
2    private final ReentrantLock lock = new ReentrantLock();
3    private final Resource resource;
4
5    public Resource acquireWithTimeout(long timeout, TimeUnit unit) {
6        try {
7            if (lock.tryLock(timeout, unit)) {
8                try {
9                    return resource;
10                } finally {
11                    lock.unlock();
12                }
13            } else {
14                throw new TimeoutException("Could not acquire resource within " + timeout);
15            }
16        } catch (InterruptedException e) {
17            Thread.currentThread().interrupt();
18            throw new RuntimeException("Interrupted while waiting for resource", e);
19        }
20    }
21}
```

Real-world use cases include connection pools, distributed systems with SLAs, and any scenario where waiting forever is unacceptable.

**You need to interrupt threads waiting for locks.** With synchronized, a thread blocked on a monitor wait is not responsive to interrupts. This makes it hard to implement graceful shutdown. ReentrantLock's `lockInterruptibly()` solves this problem.

Java

```java
1public class InterruptibleWorker implements Runnable {
2    private final ReentrantLock lock = new ReentrantLock();
3    private volatile boolean running = true;
4
5    @Override
6    public void run() {
7        while (running) {
8            try {
9                lock.lockInterruptibly();  // Can be cancelled!
10                try {
11                    doWork();
12                } finally {
13                    lock.unlock();
14                }
15            } catch (InterruptedException e) {
16                // Gracefully handle shutdown
17                running = false;
18            }
19        }
20    }
21}
```

This pattern is essential for thread pools, task executors, and any long-running service that needs clean shutdown.

**You need fairness guarantees.** When thread starvation is unacceptable, fair ReentrantLock ensures FIFO ordering. This is critical in systems with SLAs or regulatory requirements around resource access.

Java

```java
1// Fair lock prevents any thread from being starved
2private final ReentrantLock fairLock = new ReentrantLock(true);
```

Keep in mind the performance cost (10-100x slower under contention). Fair locks are a correctness feature, not a performance feature.

**You need multiple conditions for a single lock.** The producer-consumer pattern illustrates this perfectly. With synchronized, you have one wait set per object, so `notifyAll()` wakes both producers and consumers.

Java

```java
1// With Conditions, wake only the threads that need waking
2ReentrantLock lock = new ReentrantLock();
3Condition notEmpty = lock.newCondition();
4Condition notFull = lock.newCondition();
5
6// Producer only wakes consumers, not other producers
7notEmpty.signal();
8
9// Consumer only wakes producers, not other consumers
10notFull.signal();
```

This reduces unnecessary context switches and improves throughput.

**You need to query lock state for monitoring.** For debugging, metrics, or adaptive algorithms, ReentrantLock provides visibility that synchronized cannot.

Java

```java
1ReentrantLock lock = new ReentrantLock();
2
3// Debugging info
4boolean isLocked = lock.isLocked();
5boolean heldByMe = lock.isHeldByCurrentThread();
6int holdCount = lock.getHoldCount();
7int queueLength = lock.getQueueLength();
8boolean hasPending = lock.hasQueuedThreads();
```

This is valuable for monitoring dashboards, deadlock detection tools, and adaptive lock-striping strategies.

### When They're Essentially Equal

Sometimes either choice works fine, and you should pick based on team familiarity or codebase conventions. These scenarios include:

**Low contention, simple critical sections.** If your lock is rarely contested and protects a quick operation (a few memory accesses), both perform nearly identically. The 5 ns difference between synchronized (~20 ns uncontended) and ReentrantLock (~25 ns uncontended) is irrelevant compared to the work inside the critical section.

Java

```java
1// Either is fine here
2private int counter = 0;
3
4// Option A
5public synchronized void incrementA() {
6    counter++;
7}
8
9// Option B
10private final ReentrantLock lock = new ReentrantLock();
11public void incrementB() {
12    lock.lock();
13    try { counter++; } finally { lock.unlock(); }
14}
```

**The advanced features are "nice to have" but not required.** If you might use tryLock someday but do not need it now, do not over-engineer. Start with synchronized. You can always refactor later when the need becomes concrete.

**Mixed existing codebase.** If half your code uses synchronized and half uses ReentrantLock, pick whichever is used in the surrounding code for consistency.

The table below summarizes when each choice is clearly better versus when it is a toss-up.

Scenario

Best Choice

Reason

Simple mutual exclusion

synchronized

Simpler, safer

Timeout needed

ReentrantLock

Not possible otherwise

Interruptible waiting

ReentrantLock

Not possible otherwise

Fairness required

ReentrantLock

Not possible otherwise

Multiple conditions

ReentrantLock

More efficient signaling

Millions of lock objects

synchronized

Memory efficiency

Team unfamiliar with explicit locks

synchronized

Reduced bug risk

Monitoring/debugging needs

ReentrantLock

Query methods available

Low contention, simple code

Either

Pick based on convention

Understanding when to use each mechanism is important, but you also need to understand how they perform under different conditions. Let's look at the performance characteristics in detail.

# Performance Characteristics

Performance is a common reason developers consider switching between synchronized and ReentrantLock, but the reality is more nuanced than "X is faster than Y." Let's break down performance across different scenarios with concrete numbers.

### Uncontended Performance: Both Are Fast

When there is no contention (only one thread accesses the lock), both mechanisms are extremely fast because modern JVMs heavily optimize this common case.

Scenario

synchronized

ReentrantLock

Notes

Uncontended, single thread

~20 ns

~25 ns

Biased locking (if enabled) makes synchronized slightly faster

Lock elision (JIT optimized)

~0 ns

~0 ns

JIT removes lock entirely if proven safe

Lock coarsening

~20 ns total

~25 ns total

Multiple adjacent locks merged into one

Reentrant acquisition

~5 ns

~10 ns

Thread ID comparison vs. CAS

What do these numbers mean in practice? At 20 ns per lock/unlock cycle, you can perform 50 million lock operations per second on a single thread. For most applications, the lock itself is not the bottleneck, the work inside the critical section is.

**JIT Optimizations**

The JIT compiler performs two powerful optimizations that can eliminate lock overhead entirely.

_Lock Elision_ removes locks when the JIT proves the lock object does not escape the current thread.

Java

```java
1public String format(int value) {
2    StringBuilder sb = new StringBuilder();  // Local, doesn't escape
3    synchronized (sb) {  // JIT can prove this is never contended
4        sb.append("Value: ");
5        sb.append(value);
6    }
7    return sb.toString();  // sb is consumed, doesn't escape
8}
9// JIT compiles this to effectively:
10// StringBuilder sb = new StringBuilder();
11// sb.append("Value: ");
12// sb.append(value);
13// return sb.toString();
```

_Lock Coarsening_ merges multiple adjacent locks into one.

Java

```java
1// Before coarsening:
2synchronized (lock) { a++; }
3synchronized (lock) { b++; }
4synchronized (lock) { c++; }
5
6// After coarsening (JIT optimization):
7synchronized (lock) { a++; b++; c++; }
```

These optimizations work for both synchronized and ReentrantLock, so uncontended performance is rarely a differentiator.

### Low Contention Performance: Still Similar

With occasional contention (multiple threads, but they rarely collide), both mechanisms remain efficient.

Metric

synchronized

ReentrantLock

Acquisition when available

~20-25 ns (thin lock CAS)

~25-30 ns (AQS CAS)

Brief spin before parking

~500-2000 ns

~500-2000 ns

Wakeup latency

~5-10 μs

~5-10 μs

The diagram below shows what happens under low contention.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-36honka2s6b-1772709669408{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-36honka2s6b-1772709669408 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-36honka2s6b-1772709669408 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-36honka2s6b-1772709669408 .error-icon{fill:#000000;}#mermaid-36honka2s6b-1772709669408 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-36honka2s6b-1772709669408 .edge-thickness-normal{stroke-width:1px;}#mermaid-36honka2s6b-1772709669408 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-36honka2s6b-1772709669408 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-36honka2s6b-1772709669408 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-36honka2s6b-1772709669408 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-36honka2s6b-1772709669408 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-36honka2s6b-1772709669408 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-36honka2s6b-1772709669408 .marker.cross{stroke:#22c55e;}#mermaid-36honka2s6b-1772709669408 svg{font-family:inherit;font-size:16px;}#mermaid-36honka2s6b-1772709669408 p{margin:0;}#mermaid-36honka2s6b-1772709669408 .label{font-family:inherit;color:#f0fdf4;}#mermaid-36honka2s6b-1772709669408 .cluster-label text{fill:#fafafa;}#mermaid-36honka2s6b-1772709669408 .cluster-label span{color:#fafafa;}#mermaid-36honka2s6b-1772709669408 .cluster-label span p{background-color:transparent;}#mermaid-36honka2s6b-1772709669408 .label text,#mermaid-36honka2s6b-1772709669408 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-36honka2s6b-1772709669408 .node rect,#mermaid-36honka2s6b-1772709669408 .node circle,#mermaid-36honka2s6b-1772709669408 .node ellipse,#mermaid-36honka2s6b-1772709669408 .node polygon,#mermaid-36honka2s6b-1772709669408 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-36honka2s6b-1772709669408 .rough-node .label text,#mermaid-36honka2s6b-1772709669408 .node .label text,#mermaid-36honka2s6b-1772709669408 .image-shape .label,#mermaid-36honka2s6b-1772709669408 .icon-shape .label{text-anchor:middle;}#mermaid-36honka2s6b-1772709669408 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-36honka2s6b-1772709669408 .rough-node .label,#mermaid-36honka2s6b-1772709669408 .node .label,#mermaid-36honka2s6b-1772709669408 .image-shape .label,#mermaid-36honka2s6b-1772709669408 .icon-shape .label{text-align:center;}#mermaid-36honka2s6b-1772709669408 .node.clickable{cursor:pointer;}#mermaid-36honka2s6b-1772709669408 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-36honka2s6b-1772709669408 .arrowheadPath{fill:#0b0b0b;}#mermaid-36honka2s6b-1772709669408 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-36honka2s6b-1772709669408 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-36honka2s6b-1772709669408 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-36honka2s6b-1772709669408 .edgeLabel p{background-color:#0a0a0a;}#mermaid-36honka2s6b-1772709669408 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-36honka2s6b-1772709669408 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-36honka2s6b-1772709669408 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-36honka2s6b-1772709669408 .cluster text{fill:#fafafa;}#mermaid-36honka2s6b-1772709669408 .cluster span{color:#fafafa;}#mermaid-36honka2s6b-1772709669408 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-36honka2s6b-1772709669408 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-36honka2s6b-1772709669408 rect.text{fill:none;stroke-width:0;}#mermaid-36honka2s6b-1772709669408 .icon-shape,#mermaid-36honka2s6b-1772709669408 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-36honka2s6b-1772709669408 .icon-shape p,#mermaid-36honka2s6b-1772709669408 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-36honka2s6b-1772709669408 .icon-shape rect,#mermaid-36honka2s6b-1772709669408 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-36honka2s6b-1772709669408 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-36honka2s6b-1772709669408 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-36honka2s6b-1772709669408 :root{--mermaid-font-family:inherit;}

ReentrantLock (Low Contention)

CAS on AQS state

Brief spin  
adaptive

Success: acquire

synchronized (Low Contention)

Thin Lock  
CAS on mark word

Brief spin  
~100 iterations

Success: acquire

Both use CAS (compare-and-swap) operations and brief spinning before resorting to OS-level parking. Performance is nearly identical.

### High Contention Performance: Differences Emerge

Under heavy contention (many threads competing for the same lock), meaningful differences appear.

Metric

synchronized

ReentrantLock (non-fair)

ReentrantLock (fair)

Throughput (relative)

1.0x

1.0-1.2x

0.01-0.1x

Latency variance

Higher

Lower

Lowest

Lock inflation overhead

Yes (one-time ~10 μs)

None

None

Bias revocation overhead

Yes (safepoint, ~ms)

None

None

**Why ReentrantLock Often Wins Under High Contention**

1.  **No lock inflation overhead.** synchronized must inflate from thin to fat lock under contention, which costs ~10 μs the first time. ReentrantLock's AQS is always the same mechanism.
2.  **No bias revocation.** When a second thread contests a biased lock, bias revocation requires a safepoint (global JVM pause). This can take milliseconds. ReentrantLock has no such mechanism.
3.  **More predictable queuing.** ReentrantLock's CLH queue provides consistent FIFO-ish ordering. synchronized's entry list management is more complex and can have higher variance.
4.  **Adaptive spinning.** Both spin before parking, but ReentrantLock's spinning is more predictable and tunable.

Here is what high contention looks like.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-pn50xx6qjri-1772709669409{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-pn50xx6qjri-1772709669409 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-pn50xx6qjri-1772709669409 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-pn50xx6qjri-1772709669409 .error-icon{fill:#000000;}#mermaid-pn50xx6qjri-1772709669409 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-pn50xx6qjri-1772709669409 .edge-thickness-normal{stroke-width:1px;}#mermaid-pn50xx6qjri-1772709669409 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-pn50xx6qjri-1772709669409 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-pn50xx6qjri-1772709669409 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-pn50xx6qjri-1772709669409 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-pn50xx6qjri-1772709669409 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-pn50xx6qjri-1772709669409 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-pn50xx6qjri-1772709669409 .marker.cross{stroke:#22c55e;}#mermaid-pn50xx6qjri-1772709669409 svg{font-family:inherit;font-size:16px;}#mermaid-pn50xx6qjri-1772709669409 p{margin:0;}#mermaid-pn50xx6qjri-1772709669409 .label{font-family:inherit;color:#f0fdf4;}#mermaid-pn50xx6qjri-1772709669409 .cluster-label text{fill:#fafafa;}#mermaid-pn50xx6qjri-1772709669409 .cluster-label span{color:#fafafa;}#mermaid-pn50xx6qjri-1772709669409 .cluster-label span p{background-color:transparent;}#mermaid-pn50xx6qjri-1772709669409 .label text,#mermaid-pn50xx6qjri-1772709669409 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-pn50xx6qjri-1772709669409 .node rect,#mermaid-pn50xx6qjri-1772709669409 .node circle,#mermaid-pn50xx6qjri-1772709669409 .node ellipse,#mermaid-pn50xx6qjri-1772709669409 .node polygon,#mermaid-pn50xx6qjri-1772709669409 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-pn50xx6qjri-1772709669409 .rough-node .label text,#mermaid-pn50xx6qjri-1772709669409 .node .label text,#mermaid-pn50xx6qjri-1772709669409 .image-shape .label,#mermaid-pn50xx6qjri-1772709669409 .icon-shape .label{text-anchor:middle;}#mermaid-pn50xx6qjri-1772709669409 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-pn50xx6qjri-1772709669409 .rough-node .label,#mermaid-pn50xx6qjri-1772709669409 .node .label,#mermaid-pn50xx6qjri-1772709669409 .image-shape .label,#mermaid-pn50xx6qjri-1772709669409 .icon-shape .label{text-align:center;}#mermaid-pn50xx6qjri-1772709669409 .node.clickable{cursor:pointer;}#mermaid-pn50xx6qjri-1772709669409 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-pn50xx6qjri-1772709669409 .arrowheadPath{fill:#0b0b0b;}#mermaid-pn50xx6qjri-1772709669409 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-pn50xx6qjri-1772709669409 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-pn50xx6qjri-1772709669409 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-pn50xx6qjri-1772709669409 .edgeLabel p{background-color:#0a0a0a;}#mermaid-pn50xx6qjri-1772709669409 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-pn50xx6qjri-1772709669409 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-pn50xx6qjri-1772709669409 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-pn50xx6qjri-1772709669409 .cluster text{fill:#fafafa;}#mermaid-pn50xx6qjri-1772709669409 .cluster span{color:#fafafa;}#mermaid-pn50xx6qjri-1772709669409 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-pn50xx6qjri-1772709669409 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-pn50xx6qjri-1772709669409 rect.text{fill:none;stroke-width:0;}#mermaid-pn50xx6qjri-1772709669409 .icon-shape,#mermaid-pn50xx6qjri-1772709669409 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-pn50xx6qjri-1772709669409 .icon-shape p,#mermaid-pn50xx6qjri-1772709669409 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-pn50xx6qjri-1772709669409 .icon-shape rect,#mermaid-pn50xx6qjri-1772709669409 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-pn50xx6qjri-1772709669409 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-pn50xx6qjri-1772709669409 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-pn50xx6qjri-1772709669409 :root{--mermaid-font-family:inherit;}

ReentrantLock (High Contention)

Threads enqueue in  
CLH queue

Park via LockSupport

Unpark successor  
(~10-20 μs)

synchronized (High Contention)

Lock inflates to fat lock  
(~10 μs first time)

Threads park on  
ObjectMonitor

OS unpark on release  
(~10-20 μs context switch)

**Benchmark Numbers (Approximate)**

The following numbers come from various JMH benchmarks. Your results will vary based on hardware, JVM version, and workload characteristics.

Threads

synchronized (ops/μs)

ReentrantLock (ops/μs)

ReentrantLock fair (ops/μs)

1

45-50

40-45

35-40

2

20-25

22-28

2-4

4

10-15

12-18

0.5-1

8

5-8

6-10

0.2-0.5

16

3-5

4-7

0.1-0.3

Key observations from these benchmarks:

1.  **Single-threaded:** synchronized is slightly faster (biased locking advantage)
2.  **2-8 threads:** ReentrantLock is slightly faster (no inflation overhead)
3.  **16+ threads:** Both degrade significantly, ReentrantLock maintains a small edge
4.  **Fair lock:** 10-100x slower, but provides bounded latency

### When Performance Matters and When It Does Not

**Performance rarely matters** when:

*   Critical sections are short (a few memory operations)
*   Contention is low (< 2-4 threads typically)
*   Lock operations are infrequent (< 10,000/second)
*   The work inside the lock dominates (I/O, computation)

**Performance might matter** when:

*   Millions of lock operations per second
*   Many threads (> 8) contending on the same lock
*   Sub-millisecond latency requirements
*   Real-time or near-real-time systems

**The right response to high contention** is usually not to switch lock types, but to reduce contention:

*   Use finer-grained locks (lock striping)
*   Use lock-free data structures
*   Use optimistic locking (CAS-based algorithms)
*   Reduce critical section size
*   Use read-write locks for read-heavy workloads

The table below summarizes the performance guidance.

Your Situation

Recommendation

Uncontended or low contention

Either works, pick based on features

High contention, need max throughput

ReentrantLock (non-fair) has slight edge

High contention, need bounded latency

ReentrantLock (fair), but consider redesign

Performance-critical code

Profile first, then decide

"synchronized is slow" myth

It's not. Profile before switching.

**The Bottom Line:** Do not choose between synchronized and ReentrantLock based on performance unless you have profiled and proven that locking is your bottleneck. The feature differences (tryLock, fairness, conditions) are usually more important than the ~20% performance differences under contention.

With performance characteristics understood, let's look at the common mistakes developers make with both mechanisms and how to avoid them.

Launching soon
