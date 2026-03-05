---
title: "Goroutines and Scheduler"
description: "Goroutines and Scheduler - Concurrency Interview Module 4"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Goroutines and Scheduler

A goroutine is Go's unit of concurrent execution. It's lighter than an OS thread, cheaper to create, and managed entirely by the Go runtime rather than the operating system.

Go

```go
1func main() {
2    go sayHello() // Spawn a goroutine
3    time.Sleep(time.Second) // Wait for it to run
4}
5
6func sayHello() {
7    fmt.Println("Hello from goroutine!")
8}
```

The `go` keyword spawns a new goroutine that runs concurrently with the calling code. The function executes in the background while `main()` continues.

### Goroutines vs Threads

Aspect

Goroutine

OS Thread

Initial stack size

~2KB

~1-8MB

Creation time

~0.3 microseconds

~10+ microseconds

Context switch

~100-200ns (user space)

~1-10 microseconds (kernel)

Maximum count

Millions

Thousands

Managed by

Go runtime

Operating system

Stack

Growable

Fixed

The small initial stack is a key advantage. An OS thread typically reserves 1-8MB of stack space upfront (even if unused), limiting you to thousands of threads. Goroutines start with ~2KB stacks that grow and shrink as needed, allowing millions of concurrent goroutines on a single machine.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-qbioh7y7n1l-1772709679047{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-qbioh7y7n1l-1772709679047 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-qbioh7y7n1l-1772709679047 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-qbioh7y7n1l-1772709679047 .error-icon{fill:#000000;}#mermaid-qbioh7y7n1l-1772709679047 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-qbioh7y7n1l-1772709679047 .edge-thickness-normal{stroke-width:1px;}#mermaid-qbioh7y7n1l-1772709679047 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-qbioh7y7n1l-1772709679047 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-qbioh7y7n1l-1772709679047 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-qbioh7y7n1l-1772709679047 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-qbioh7y7n1l-1772709679047 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-qbioh7y7n1l-1772709679047 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-qbioh7y7n1l-1772709679047 .marker.cross{stroke:#22c55e;}#mermaid-qbioh7y7n1l-1772709679047 svg{font-family:inherit;font-size:16px;}#mermaid-qbioh7y7n1l-1772709679047 p{margin:0;}#mermaid-qbioh7y7n1l-1772709679047 .label{font-family:inherit;color:#f0fdf4;}#mermaid-qbioh7y7n1l-1772709679047 .cluster-label text{fill:#fafafa;}#mermaid-qbioh7y7n1l-1772709679047 .cluster-label span{color:#fafafa;}#mermaid-qbioh7y7n1l-1772709679047 .cluster-label span p{background-color:transparent;}#mermaid-qbioh7y7n1l-1772709679047 .label text,#mermaid-qbioh7y7n1l-1772709679047 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-qbioh7y7n1l-1772709679047 .node rect,#mermaid-qbioh7y7n1l-1772709679047 .node circle,#mermaid-qbioh7y7n1l-1772709679047 .node ellipse,#mermaid-qbioh7y7n1l-1772709679047 .node polygon,#mermaid-qbioh7y7n1l-1772709679047 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-qbioh7y7n1l-1772709679047 .rough-node .label text,#mermaid-qbioh7y7n1l-1772709679047 .node .label text,#mermaid-qbioh7y7n1l-1772709679047 .image-shape .label,#mermaid-qbioh7y7n1l-1772709679047 .icon-shape .label{text-anchor:middle;}#mermaid-qbioh7y7n1l-1772709679047 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-qbioh7y7n1l-1772709679047 .rough-node .label,#mermaid-qbioh7y7n1l-1772709679047 .node .label,#mermaid-qbioh7y7n1l-1772709679047 .image-shape .label,#mermaid-qbioh7y7n1l-1772709679047 .icon-shape .label{text-align:center;}#mermaid-qbioh7y7n1l-1772709679047 .node.clickable{cursor:pointer;}#mermaid-qbioh7y7n1l-1772709679047 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-qbioh7y7n1l-1772709679047 .arrowheadPath{fill:#0b0b0b;}#mermaid-qbioh7y7n1l-1772709679047 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-qbioh7y7n1l-1772709679047 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-qbioh7y7n1l-1772709679047 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-qbioh7y7n1l-1772709679047 .edgeLabel p{background-color:#0a0a0a;}#mermaid-qbioh7y7n1l-1772709679047 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-qbioh7y7n1l-1772709679047 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-qbioh7y7n1l-1772709679047 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-qbioh7y7n1l-1772709679047 .cluster text{fill:#fafafa;}#mermaid-qbioh7y7n1l-1772709679047 .cluster span{color:#fafafa;}#mermaid-qbioh7y7n1l-1772709679047 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-qbioh7y7n1l-1772709679047 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-qbioh7y7n1l-1772709679047 rect.text{fill:none;stroke-width:0;}#mermaid-qbioh7y7n1l-1772709679047 .icon-shape,#mermaid-qbioh7y7n1l-1772709679047 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-qbioh7y7n1l-1772709679047 .icon-shape p,#mermaid-qbioh7y7n1l-1772709679047 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-qbioh7y7n1l-1772709679047 .icon-shape rect,#mermaid-qbioh7y7n1l-1772709679047 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-qbioh7y7n1l-1772709679047 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-qbioh7y7n1l-1772709679047 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-qbioh7y7n1l-1772709679047 :root{--mermaid-font-family:inherit;}#mermaid-qbioh7y7n1l-1772709679047 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-qbioh7y7n1l-1772709679047 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-qbioh7y7n1l-1772709679047 .red tspan{fill:#000!important;}#mermaid-qbioh7y7n1l-1772709679047 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-qbioh7y7n1l-1772709679047 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-qbioh7y7n1l-1772709679047 .green tspan{fill:#000!important;}#mermaid-qbioh7y7n1l-1772709679047 .yellow>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-qbioh7y7n1l-1772709679047 .yellow span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-qbioh7y7n1l-1772709679047 .yellow tspan{fill:#000!important;}

Go Runtime

Operating System

OS Thread (M)

OS Thread (M)

Goroutine  
2KB

Goroutine  
2KB

OS Thread 1  
Stack: 8MB

OS Thread 2  
Stack: 8MB

OS Thread N  
Stack: 8MB

Goroutine  
2KB

Goroutine  
2KB

Goroutine  
2KB

Thousands  
of threads

Millions  
of goroutines

### The Growable Stack

Goroutine stacks start small and grow dynamically:

Go

```go
1func recursive(n int) {
2    var arr [1024]byte // 1KB local variable
3    if n > 0 {
4        recursive(n - 1)
5    }
6    _ = arr
7}
8
9func main() {
10    go recursive(10000) // Stack grows to accommodate deep recursion
11    time.Sleep(time.Second)
12}
```

When a goroutine needs more stack space:

1.  The runtime allocates a new, larger stack (typically 2x the current size)
2.  Copies the old stack contents to the new stack
3.  Updates all pointers within the stack
4.  Continues execution

This is transparent to your code. Stacks can also shrink during garbage collection if they're using much less than allocated.

# The GMP Model

Go's scheduler uses the GMP model, named after its three core components:

*   **G (Goroutine):** The unit of work, representing a function to execute
*   **M (Machine):** An OS thread that executes goroutines
*   **P (Processor):** A logical processor that mediates between G and M

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-s8fmgw0cr-1772709679052{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-s8fmgw0cr-1772709679052 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-s8fmgw0cr-1772709679052 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-s8fmgw0cr-1772709679052 .error-icon{fill:#000000;}#mermaid-s8fmgw0cr-1772709679052 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-s8fmgw0cr-1772709679052 .edge-thickness-normal{stroke-width:1px;}#mermaid-s8fmgw0cr-1772709679052 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-s8fmgw0cr-1772709679052 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-s8fmgw0cr-1772709679052 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-s8fmgw0cr-1772709679052 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-s8fmgw0cr-1772709679052 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-s8fmgw0cr-1772709679052 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-s8fmgw0cr-1772709679052 .marker.cross{stroke:#22c55e;}#mermaid-s8fmgw0cr-1772709679052 svg{font-family:inherit;font-size:16px;}#mermaid-s8fmgw0cr-1772709679052 p{margin:0;}#mermaid-s8fmgw0cr-1772709679052 .label{font-family:inherit;color:#f0fdf4;}#mermaid-s8fmgw0cr-1772709679052 .cluster-label text{fill:#fafafa;}#mermaid-s8fmgw0cr-1772709679052 .cluster-label span{color:#fafafa;}#mermaid-s8fmgw0cr-1772709679052 .cluster-label span p{background-color:transparent;}#mermaid-s8fmgw0cr-1772709679052 .label text,#mermaid-s8fmgw0cr-1772709679052 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-s8fmgw0cr-1772709679052 .node rect,#mermaid-s8fmgw0cr-1772709679052 .node circle,#mermaid-s8fmgw0cr-1772709679052 .node ellipse,#mermaid-s8fmgw0cr-1772709679052 .node polygon,#mermaid-s8fmgw0cr-1772709679052 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-s8fmgw0cr-1772709679052 .rough-node .label text,#mermaid-s8fmgw0cr-1772709679052 .node .label text,#mermaid-s8fmgw0cr-1772709679052 .image-shape .label,#mermaid-s8fmgw0cr-1772709679052 .icon-shape .label{text-anchor:middle;}#mermaid-s8fmgw0cr-1772709679052 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-s8fmgw0cr-1772709679052 .rough-node .label,#mermaid-s8fmgw0cr-1772709679052 .node .label,#mermaid-s8fmgw0cr-1772709679052 .image-shape .label,#mermaid-s8fmgw0cr-1772709679052 .icon-shape .label{text-align:center;}#mermaid-s8fmgw0cr-1772709679052 .node.clickable{cursor:pointer;}#mermaid-s8fmgw0cr-1772709679052 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-s8fmgw0cr-1772709679052 .arrowheadPath{fill:#0b0b0b;}#mermaid-s8fmgw0cr-1772709679052 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-s8fmgw0cr-1772709679052 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-s8fmgw0cr-1772709679052 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-s8fmgw0cr-1772709679052 .edgeLabel p{background-color:#0a0a0a;}#mermaid-s8fmgw0cr-1772709679052 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-s8fmgw0cr-1772709679052 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-s8fmgw0cr-1772709679052 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-s8fmgw0cr-1772709679052 .cluster text{fill:#fafafa;}#mermaid-s8fmgw0cr-1772709679052 .cluster span{color:#fafafa;}#mermaid-s8fmgw0cr-1772709679052 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-s8fmgw0cr-1772709679052 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-s8fmgw0cr-1772709679052 rect.text{fill:none;stroke-width:0;}#mermaid-s8fmgw0cr-1772709679052 .icon-shape,#mermaid-s8fmgw0cr-1772709679052 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-s8fmgw0cr-1772709679052 .icon-shape p,#mermaid-s8fmgw0cr-1772709679052 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-s8fmgw0cr-1772709679052 .icon-shape rect,#mermaid-s8fmgw0cr-1772709679052 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-s8fmgw0cr-1772709679052 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-s8fmgw0cr-1772709679052 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-s8fmgw0cr-1772709679052 :root{--mermaid-font-family:inherit;}#mermaid-s8fmgw0cr-1772709679052 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-s8fmgw0cr-1772709679052 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-s8fmgw0cr-1772709679052 .primary tspan{fill:#000!important;}#mermaid-s8fmgw0cr-1772709679052 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-s8fmgw0cr-1772709679052 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-s8fmgw0cr-1772709679052 .orange tspan{fill:#000!important;}#mermaid-s8fmgw0cr-1772709679052 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-s8fmgw0cr-1772709679052 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-s8fmgw0cr-1772709679052 .green tspan{fill:#000!important;}

steal

steal

P (Processor 1)

Local Run Queue

G

G

P (Processor 0)

Local Run Queue

G

G

Global Run Queue

G

G

G

M (OS Thread)

M (OS Thread)

### G (Goroutine)

Each goroutine (G) contains:

*   Stack pointer and program counter
*   Stack bounds (for growth detection)
*   Status (runnable, running, waiting, dead)
*   Reference to the current M (if running)
*   Scheduling-related fields (preemption flag, etc.)

Go

```go
1// Simplified view of runtime.g structure
2type g struct {
3    stack       stack   // Current stack bounds
4    stackguard0 uintptr // For stack growth check
5    m           *m      // Current M executing this G
6    sched       gobuf   // Scheduling context (SP, PC, etc.)
7    atomicstatus uint32 // Status: runnable, running, etc.
8    goid         int64  // Goroutine ID
9    // ... many more fields
10}
```

### M (Machine)

An M is an OS thread. It executes goroutines and interacts with the operating system:

*   Can be parked (sleeping) when no work is available
*   Can be created as needed (up to `GOMAXPROCS` running simultaneously)
*   System calls cause M to detach from P temporarily
*   Each M has a "g0" goroutine for scheduling work

Go

```go
1// Simplified view of runtime.m structure
2type m struct {
3    g0      *g     // Scheduling goroutine
4    curg    *g     // Current running goroutine
5    p       *p     // Attached P (nil if not running)
6    nextp   *p     // P to attach to next
7    spinning bool  // Looking for work
8    // ...
9}
```

### P (Processor)

A P is a logical processor context. It acts as a token for executing Go code:

*   There are exactly `GOMAXPROCS` P's
*   Each P has a local run queue of goroutines
*   An M must acquire a P to execute Go code
*   P's enable work stealing between threads

Go

```go
1// Simplified view of runtime.p structure
2type p struct {
3    status   uint32       // idle, running, syscall, etc.
4    m        *m           // M currently attached
5    runq     [256]guintptr // Local run queue (circular buffer)
6    runqhead uint32
7    runqtail uint32
8    runnext  guintptr     // Next G to run (fast path)
9    // ...
10}
```

### Why P Exists

You might wonder why we need P when we have M. The answer becomes clear when you consider what would happen without P. Let's walk through three scenarios.

**Scenario 1: Without P, syscalls would waste CPUs**

Imagine a goroutine making a blocking syscall (reading a file). Without the P abstraction:

```shell
1Before P existed (Go 1.0):
2- Goroutine calls read()
3- OS thread blocks in kernel
4- That CPU core sits idle
5- Other goroutines can't run on that core
6- Result: 1000 goroutines doing I/O = 1000 blocked threads
```

With P, the runtime decouples the goroutine from the thread:

```shell
1With P (Go 1.1+):
2- Goroutine calls read()
3- M releases P before entering syscall
4- Another M picks up the P
5- Other goroutines continue running on that P
6- Result: 1000 goroutines doing I/O = maybe 8 threads, 8 busy CPUs
```

**Scenario 2: Without P, work stealing would need global locks**

Without local run queues attached to P's, all goroutines would be in one global queue:

```shell
1Without P:
2- Every schedule decision locks the global queue
3- 8 cores constantly fighting for one lock
4- Lock contention becomes the bottleneck
5- Parallelism suffers
```

With P's local run queues:

```shell
1With P:
2- Each P has its own lock-free local queue
3- Normal scheduling: no locks at all
4- Only steal from others when local queue is empty
5- Stealing takes half, amortizing the cost
```

**Scenario 3: Without P, controlling parallelism would be awkward**

How would you limit concurrency to 4 cores on an 8-core machine? Without P, you'd need to limit thread creation, but threads are also needed for syscalls.

```shell
1Without P:
2- GOMAXPROCS=4 means max 4 threads
3- But goroutine A does syscall, needs thread
4- Goroutine B does syscall, needs thread
5- Now you've hit the limit
6- Goroutines C-Z can't run even though they're CPU-ready
```

With P:

```shell
1With P:
2- GOMAXPROCS=4 means 4 P's
3- Syscalls can spawn extra M's beyond GOMAXPROCS
4- 100 M's can exist (some blocked in syscalls)
5- But only 4 M's run Go code at once (one per P)
6- Perfect control over parallelism
```

In essence, P is a "CPU token" that separates scheduling (G on P) from execution (M runs P). This decoupling is what makes Go's scheduler efficient.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

OS KernelM2 (Thread)M1 (Thread)ProcessorGoroutineOS KernelM2 (Thread)M1 (Thread)ProcessorGoroutine#mermaid-zqrcuczbprn-1772709679053{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-zqrcuczbprn-1772709679053 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-zqrcuczbprn-1772709679053 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-zqrcuczbprn-1772709679053 .error-icon{fill:#000000;}#mermaid-zqrcuczbprn-1772709679053 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-zqrcuczbprn-1772709679053 .edge-thickness-normal{stroke-width:1px;}#mermaid-zqrcuczbprn-1772709679053 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-zqrcuczbprn-1772709679053 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-zqrcuczbprn-1772709679053 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-zqrcuczbprn-1772709679053 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-zqrcuczbprn-1772709679053 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-zqrcuczbprn-1772709679053 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-zqrcuczbprn-1772709679053 .marker.cross{stroke:#22c55e;}#mermaid-zqrcuczbprn-1772709679053 svg{font-family:inherit;font-size:16px;}#mermaid-zqrcuczbprn-1772709679053 p{margin:0;}#mermaid-zqrcuczbprn-1772709679053 .actor{stroke:#22c55e;fill:transparent;}#mermaid-zqrcuczbprn-1772709679053 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-zqrcuczbprn-1772709679053 .actor-line{stroke:#22c55e;}#mermaid-zqrcuczbprn-1772709679053 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-zqrcuczbprn-1772709679053 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-zqrcuczbprn-1772709679053 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-zqrcuczbprn-1772709679053 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-zqrcuczbprn-1772709679053 .sequenceNumber{fill:#f0fdf4;}#mermaid-zqrcuczbprn-1772709679053 #sequencenumber{fill:#fafafa;}#mermaid-zqrcuczbprn-1772709679053 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-zqrcuczbprn-1772709679053 .messageText{fill:#fafafa;stroke:none;}#mermaid-zqrcuczbprn-1772709679053 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-zqrcuczbprn-1772709679053 .labelText,#mermaid-zqrcuczbprn-1772709679053 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-zqrcuczbprn-1772709679053 .loopText,#mermaid-zqrcuczbprn-1772709679053 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-zqrcuczbprn-1772709679053 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-zqrcuczbprn-1772709679053 .note{stroke:#f59e0b;fill:#422006;}#mermaid-zqrcuczbprn-1772709679053 .noteText,#mermaid-zqrcuczbprn-1772709679053 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-zqrcuczbprn-1772709679053 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-zqrcuczbprn-1772709679053 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-zqrcuczbprn-1772709679053 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-zqrcuczbprn-1772709679053 .actorPopupMenu{position:absolute;}#mermaid-zqrcuczbprn-1772709679053 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-zqrcuczbprn-1772709679053 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-zqrcuczbprn-1772709679053 .actor-man circle,#mermaid-zqrcuczbprn-1772709679053 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-zqrcuczbprn-1772709679053 :root{--mermaid-font-family:inherit;}Normal executionM1 enters syscall, releases PM2 continues running goroutinesM1 tries to reacquire P or parksExecute goroutineSystem call (file read)Release PHandoff to M2Execute other goroutinesSyscall returns

# GOMAXPROCS

`GOMAXPROCS` controls the number of P's, which determines the maximum number of goroutines executing simultaneously:

Go

```go
1import "runtime"
2
3func main() {
4    // Get current value
5    fmt.Println(runtime.GOMAXPROCS(0)) // Returns current without changing
6
7    // Set to number of CPUs (this is the default)
8    runtime.GOMAXPROCS(runtime.NumCPU())
9
10    // Set to specific value
11    runtime.GOMAXPROCS(4)
12}
```

Or set via environment variable:

Shell

```shell
1GOMAXPROCS=4 go run main.go
```

**Default behavior:** Since Go 1.5, `GOMAXPROCS` defaults to the number of available CPUs. Before that, it defaulted to 1.

**When to change it:**

*   Running in containers with CPU limits: Set it to match the container's CPU quota
*   CPU-bound workloads: Usually leave at default
*   I/O-bound workloads: Might benefit from higher values (more M's waiting on I/O)
*   Debugging: Set to 1 to serialize execution

`GOMAXPROCS` doesn't limit the number of goroutines or OS threads. It limits how many goroutines run _simultaneously_. You can have millions of goroutines with `GOMAXPROCS=4`, they just take turns running on those 4 P's.

# How the Scheduler Works

### Creating a Goroutine

When you write `go f()`:

1.  Runtime creates a new G with an initial 2KB stack
2.  G is added to the current P's local run queue (or global queue if local is full)
3.  The creating goroutine continues executing
4.  Eventually, the scheduler runs the new G

Go

```go
1func main() {
2    for i := 0; i < 10; i++ {
3        go worker(i) // Each creates a new G
4    }
5    time.Sleep(time.Second)
6}
7
8func worker(id int) {
9    fmt.Printf("Worker %d\n", id)
10}
```

### The Scheduling Loop

Each M runs a scheduling loop:

Shell

```shell
1schedule() → find runnable G → execute G → G exits or blocks → schedule()
```

Finding a runnable G follows a priority order:

1.  Check `runnext` (single slot for the next G to run, cache-friendly)
2.  Check local run queue
3.  Check global run queue
4.  Network poller (for goroutines waiting on I/O)
5.  Steal from other P's

### Work Stealing

When a P's local queue is empty, it steals work from other P's:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-4zku77n3fb8-1772709679053{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-4zku77n3fb8-1772709679053 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-4zku77n3fb8-1772709679053 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-4zku77n3fb8-1772709679053 .error-icon{fill:#000000;}#mermaid-4zku77n3fb8-1772709679053 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-4zku77n3fb8-1772709679053 .edge-thickness-normal{stroke-width:1px;}#mermaid-4zku77n3fb8-1772709679053 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-4zku77n3fb8-1772709679053 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-4zku77n3fb8-1772709679053 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-4zku77n3fb8-1772709679053 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-4zku77n3fb8-1772709679053 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-4zku77n3fb8-1772709679053 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-4zku77n3fb8-1772709679053 .marker.cross{stroke:#22c55e;}#mermaid-4zku77n3fb8-1772709679053 svg{font-family:inherit;font-size:16px;}#mermaid-4zku77n3fb8-1772709679053 p{margin:0;}#mermaid-4zku77n3fb8-1772709679053 .label{font-family:inherit;color:#f0fdf4;}#mermaid-4zku77n3fb8-1772709679053 .cluster-label text{fill:#fafafa;}#mermaid-4zku77n3fb8-1772709679053 .cluster-label span{color:#fafafa;}#mermaid-4zku77n3fb8-1772709679053 .cluster-label span p{background-color:transparent;}#mermaid-4zku77n3fb8-1772709679053 .label text,#mermaid-4zku77n3fb8-1772709679053 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-4zku77n3fb8-1772709679053 .node rect,#mermaid-4zku77n3fb8-1772709679053 .node circle,#mermaid-4zku77n3fb8-1772709679053 .node ellipse,#mermaid-4zku77n3fb8-1772709679053 .node polygon,#mermaid-4zku77n3fb8-1772709679053 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-4zku77n3fb8-1772709679053 .rough-node .label text,#mermaid-4zku77n3fb8-1772709679053 .node .label text,#mermaid-4zku77n3fb8-1772709679053 .image-shape .label,#mermaid-4zku77n3fb8-1772709679053 .icon-shape .label{text-anchor:middle;}#mermaid-4zku77n3fb8-1772709679053 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-4zku77n3fb8-1772709679053 .rough-node .label,#mermaid-4zku77n3fb8-1772709679053 .node .label,#mermaid-4zku77n3fb8-1772709679053 .image-shape .label,#mermaid-4zku77n3fb8-1772709679053 .icon-shape .label{text-align:center;}#mermaid-4zku77n3fb8-1772709679053 .node.clickable{cursor:pointer;}#mermaid-4zku77n3fb8-1772709679053 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-4zku77n3fb8-1772709679053 .arrowheadPath{fill:#0b0b0b;}#mermaid-4zku77n3fb8-1772709679053 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-4zku77n3fb8-1772709679053 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-4zku77n3fb8-1772709679053 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-4zku77n3fb8-1772709679053 .edgeLabel p{background-color:#0a0a0a;}#mermaid-4zku77n3fb8-1772709679053 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-4zku77n3fb8-1772709679053 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-4zku77n3fb8-1772709679053 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-4zku77n3fb8-1772709679053 .cluster text{fill:#fafafa;}#mermaid-4zku77n3fb8-1772709679053 .cluster span{color:#fafafa;}#mermaid-4zku77n3fb8-1772709679053 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-4zku77n3fb8-1772709679053 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-4zku77n3fb8-1772709679053 rect.text{fill:none;stroke-width:0;}#mermaid-4zku77n3fb8-1772709679053 .icon-shape,#mermaid-4zku77n3fb8-1772709679053 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-4zku77n3fb8-1772709679053 .icon-shape p,#mermaid-4zku77n3fb8-1772709679053 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-4zku77n3fb8-1772709679053 .icon-shape rect,#mermaid-4zku77n3fb8-1772709679053 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-4zku77n3fb8-1772709679053 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-4zku77n3fb8-1772709679053 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-4zku77n3fb8-1772709679053 :root{--mermaid-font-family:inherit;}#mermaid-4zku77n3fb8-1772709679053 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-4zku77n3fb8-1772709679053 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-4zku77n3fb8-1772709679053 .green tspan{fill:#000!important;}#mermaid-4zku77n3fb8-1772709679053 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-4zku77n3fb8-1772709679053 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-4zku77n3fb8-1772709679053 .red tspan{fill:#000!important;}

steal half

After Stealing

P2

G G G G

P1

G G G G

P2 (Idle)

empty

P1 (Busy)

G G G G G G G G

Work stealing takes half the victim's run queue, balancing load across processors.

### Preemption

Go uses preemption to prevent a single goroutine from monopolizing a P.

**Cooperative preemption (before Go 1.14):**

*   Preemption only at safe points: function calls, channel operations, etc.
*   A tight loop with no function calls could block other goroutines indefinitely

Go

```go
1// This would never yield in Go < 1.14
2func busyLoop() {
3    for {
4        // No function calls, no preemption points
5    }
6}
```

**Asynchronous preemption (Go 1.14+):**

*   Runtime uses OS signals (SIGURG on Unix) to preempt goroutines
*   Even tight loops can be preempted
*   The scheduler sends a signal, and the goroutine stops at the next safe point

Go

```go
1// Now works correctly - gets preempted
2func busyLoop() {
3    for {
4        // Signal-based preemption can stop this
5    }
6}
```

# Goroutine States

A goroutine transitions through several states during its lifetime. Understanding these states helps with debugging and performance analysis.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-4w2nind3aed-1772709679054{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-4w2nind3aed-1772709679054 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-4w2nind3aed-1772709679054 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-4w2nind3aed-1772709679054 .error-icon{fill:#000000;}#mermaid-4w2nind3aed-1772709679054 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-4w2nind3aed-1772709679054 .edge-thickness-normal{stroke-width:1px;}#mermaid-4w2nind3aed-1772709679054 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-4w2nind3aed-1772709679054 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-4w2nind3aed-1772709679054 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-4w2nind3aed-1772709679054 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-4w2nind3aed-1772709679054 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-4w2nind3aed-1772709679054 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-4w2nind3aed-1772709679054 .marker.cross{stroke:#22c55e;}#mermaid-4w2nind3aed-1772709679054 svg{font-family:inherit;font-size:16px;}#mermaid-4w2nind3aed-1772709679054 p{margin:0;}#mermaid-4w2nind3aed-1772709679054 defs #statediagram-barbEnd{fill:#22c55e;stroke:#22c55e;}#mermaid-4w2nind3aed-1772709679054 g.stateGroup text{fill:#22c55e;stroke:none;font-size:10px;}#mermaid-4w2nind3aed-1772709679054 g.stateGroup text{fill:#fafafa;stroke:none;font-size:10px;}#mermaid-4w2nind3aed-1772709679054 g.stateGroup .state-title{font-weight:bolder;fill:#166534;}#mermaid-4w2nind3aed-1772709679054 g.stateGroup rect{fill:#166534;stroke:#22c55e;}#mermaid-4w2nind3aed-1772709679054 g.stateGroup line{stroke:#22c55e;stroke-width:1;}#mermaid-4w2nind3aed-1772709679054 .transition{stroke:#22c55e;stroke-width:1;fill:none;}#mermaid-4w2nind3aed-1772709679054 .stateGroup .composit{fill:#f4f4f4;border-bottom:1px;}#mermaid-4w2nind3aed-1772709679054 .stateGroup .alt-composit{fill:#e0e0e0;border-bottom:1px;}#mermaid-4w2nind3aed-1772709679054 .state-note{stroke:#f59e0b;fill:#422006;}#mermaid-4w2nind3aed-1772709679054 .state-note text{fill:#fef3c7;stroke:none;font-size:10px;}#mermaid-4w2nind3aed-1772709679054 .stateLabel .box{stroke:none;stroke-width:0;fill:#166534;opacity:0.5;}#mermaid-4w2nind3aed-1772709679054 .edgeLabel .label rect{fill:#166534;opacity:0.5;}#mermaid-4w2nind3aed-1772709679054 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-4w2nind3aed-1772709679054 .edgeLabel p{background-color:#0a0a0a;}#mermaid-4w2nind3aed-1772709679054 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-4w2nind3aed-1772709679054 .edgeLabel .label text{fill:#fafafa;}#mermaid-4w2nind3aed-1772709679054 .label div .edgeLabel{color:#fafafa;}#mermaid-4w2nind3aed-1772709679054 .stateLabel text{fill:#166534;font-size:10px;font-weight:bold;}#mermaid-4w2nind3aed-1772709679054 .node circle.state-start{fill:#22c55e;stroke:#22c55e;}#mermaid-4w2nind3aed-1772709679054 .node .fork-join{fill:#22c55e;stroke:#22c55e;}#mermaid-4w2nind3aed-1772709679054 .node circle.state-end{fill:#22c55e;stroke:#f4f4f4;stroke-width:1.5;}#mermaid-4w2nind3aed-1772709679054 .end-state-inner{fill:#0a0a0a;stroke-width:1.5;}#mermaid-4w2nind3aed-1772709679054 .node rect{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-4w2nind3aed-1772709679054 .node polygon{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-4w2nind3aed-1772709679054 #statediagram-barbEnd{fill:#22c55e;}#mermaid-4w2nind3aed-1772709679054 .statediagram-cluster rect{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-4w2nind3aed-1772709679054 .cluster-label,#mermaid-4w2nind3aed-1772709679054 .nodeLabel{color:#166534;}#mermaid-4w2nind3aed-1772709679054 .statediagram-cluster rect.outer{rx:5px;ry:5px;}#mermaid-4w2nind3aed-1772709679054 .statediagram-state .divider{stroke:#22c55e;}#mermaid-4w2nind3aed-1772709679054 .statediagram-state .title-state{rx:5px;ry:5px;}#mermaid-4w2nind3aed-1772709679054 .statediagram-cluster.statediagram-cluster .inner{fill:#0a0a0a;}#mermaid-4w2nind3aed-1772709679054 .statediagram-cluster.statediagram-cluster-alt .inner{fill:#0a0a0a;}#mermaid-4w2nind3aed-1772709679054 .statediagram-cluster .inner{rx:0;ry:0;}#mermaid-4w2nind3aed-1772709679054 .statediagram-state rect.basic{rx:5px;ry:5px;}#mermaid-4w2nind3aed-1772709679054 .statediagram-state rect.divider{stroke-dasharray:10,10;fill:#0a0a0a;}#mermaid-4w2nind3aed-1772709679054 .note-edge{stroke-dasharray:5;}#mermaid-4w2nind3aed-1772709679054 .statediagram-note rect{fill:#422006;stroke:#f59e0b;stroke-width:1px;rx:0;ry:0;}#mermaid-4w2nind3aed-1772709679054 .statediagram-note rect{fill:#422006;stroke:#f59e0b;stroke-width:1px;rx:0;ry:0;}#mermaid-4w2nind3aed-1772709679054 .statediagram-note text{fill:#fef3c7;}#mermaid-4w2nind3aed-1772709679054 .statediagram-note .nodeLabel{color:#fef3c7;}#mermaid-4w2nind3aed-1772709679054 .statediagram .edgeLabel{color:red;}#mermaid-4w2nind3aed-1772709679054 #dependencyStart,#mermaid-4w2nind3aed-1772709679054 #dependencyEnd{fill:#22c55e;stroke:#22c55e;stroke-width:1;}#mermaid-4w2nind3aed-1772709679054 .statediagramTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-4w2nind3aed-1772709679054 :root{--mermaid-font-family:inherit;}#mermaid-4w2nind3aed-1772709679054 .runnable>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-4w2nind3aed-1772709679054 .runnable span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-4w2nind3aed-1772709679054 .runnable tspan{fill:#000!important;}#mermaid-4w2nind3aed-1772709679054 .running>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-4w2nind3aed-1772709679054 .running span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-4w2nind3aed-1772709679054 .running tspan{fill:#000!important;}#mermaid-4w2nind3aed-1772709679054 .waiting>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-4w2nind3aed-1772709679054 .waiting span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-4w2nind3aed-1772709679054 .waiting tspan{fill:#000!important;}#mermaid-4w2nind3aed-1772709679054 .dead>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-4w2nind3aed-1772709679054 .dead span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-4w2nind3aed-1772709679054 .dead tspan{fill:#000!important;}

go f()

scheduled on M

preempted

channel/mutex/syscall

unblocked

return/panic

Runnable

Running

Waiting

Dead

### State Details

State

Triggers

Duration

Debugging Visibility

**Runnable**

`go` statement, unblocked from wait

Typically microseconds to milliseconds

Visible in pprof as "runnable", in GODEBUG as local/global queue

**Running**

Scheduled by P

Until blocked, preempted, or finished

Current goroutine in stack trace

**Waiting**

Channel op, mutex, I/O, sleep, select

Varies: nanoseconds to forever (leak!)

Visible in pprof with blocking reason

**Dead**

Return, panic, runtime.Goexit

Instant (becomes garbage)

Not visible; memory reclaimed

**Runnable state:** The goroutine is ready to execute but waiting for a P. This happens when:

*   A new goroutine is created (`go f()`)
*   A goroutine is unblocked (channel receive completes, mutex acquired)
*   A goroutine is preempted (ran too long, yielded for GC)

High runnable counts mean goroutines are competing for limited P's. Consider whether you're spawning too many goroutines or if GOMAXPROCS is too low.

**Running state:** The goroutine is actively executing on an M+P pair. Only `GOMAXPROCS` goroutines can be in this state simultaneously.

**Waiting state:** The goroutine is blocked, not consuming CPU. Common reasons:

*   `chan receive`: Waiting for data on a channel
*   `chan send`: Waiting for receiver on a full/unbuffered channel
*   `select`: Waiting for any case to be ready
*   `sync.Mutex.Lock`: Waiting for mutex
*   `sync.Cond.Wait`: Waiting for condition signal
*   `time.Sleep`: Waiting for timer
*   `IO wait`: Network I/O via netpoller
*   `syscall`: Blocking syscall (M also blocked)

**Debugging tip:** In pprof goroutine profiles, the waiting reason shows why a goroutine is blocked. Look for goroutines stuck in `chan receive` with no matching sender: that's likely a leak.

### What Causes Blocking?

When a goroutine blocks, it releases its M (and P) so others can run:

Operation

Effect

Channel send (full buffer/no receiver)

G moves to channel's wait queue

Channel receive (empty buffer/no sender)

G moves to channel's wait queue

Mutex Lock (already locked)

G moves to mutex's wait queue

`time.Sleep()`

G moves to timer heap

I/O operation

M enters syscall, P handed off

`runtime.Gosched()`

G yields, moves to run queue

Go

```go
1func example() {
2    ch := make(chan int)
3
4    go func() {
5        ch <- 1 // Blocks until receiver is ready
6    }()
7
8    time.Sleep(time.Second) // Goroutine is waiting
9
10    <-ch // Unblocks the sender
11}
```

# System Calls and the Scheduler

System calls (file I/O, network I/O, etc.) require special handling because they block the OS thread:

### Blocking System Calls

When a goroutine makes a blocking syscall:

1.  The M enters the syscall, releasing its P
2.  The P is handed to another M (or a new M is created)
3.  When the syscall returns, the M tries to reacquire a P
4.  If no P is available, the G goes to the global queue, and the M parks

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

OS KernelM2ProcessorM1GoroutineOS KernelM2ProcessorM1Goroutine#mermaid-oqmrtuo97d-1772709679058{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-oqmrtuo97d-1772709679058 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-oqmrtuo97d-1772709679058 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-oqmrtuo97d-1772709679058 .error-icon{fill:#000000;}#mermaid-oqmrtuo97d-1772709679058 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-oqmrtuo97d-1772709679058 .edge-thickness-normal{stroke-width:1px;}#mermaid-oqmrtuo97d-1772709679058 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-oqmrtuo97d-1772709679058 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-oqmrtuo97d-1772709679058 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-oqmrtuo97d-1772709679058 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-oqmrtuo97d-1772709679058 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-oqmrtuo97d-1772709679058 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-oqmrtuo97d-1772709679058 .marker.cross{stroke:#22c55e;}#mermaid-oqmrtuo97d-1772709679058 svg{font-family:inherit;font-size:16px;}#mermaid-oqmrtuo97d-1772709679058 p{margin:0;}#mermaid-oqmrtuo97d-1772709679058 .actor{stroke:#22c55e;fill:transparent;}#mermaid-oqmrtuo97d-1772709679058 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-oqmrtuo97d-1772709679058 .actor-line{stroke:#22c55e;}#mermaid-oqmrtuo97d-1772709679058 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-oqmrtuo97d-1772709679058 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-oqmrtuo97d-1772709679058 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-oqmrtuo97d-1772709679058 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-oqmrtuo97d-1772709679058 .sequenceNumber{fill:#f0fdf4;}#mermaid-oqmrtuo97d-1772709679058 #sequencenumber{fill:#fafafa;}#mermaid-oqmrtuo97d-1772709679058 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-oqmrtuo97d-1772709679058 .messageText{fill:#fafafa;stroke:none;}#mermaid-oqmrtuo97d-1772709679058 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-oqmrtuo97d-1772709679058 .labelText,#mermaid-oqmrtuo97d-1772709679058 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-oqmrtuo97d-1772709679058 .loopText,#mermaid-oqmrtuo97d-1772709679058 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-oqmrtuo97d-1772709679058 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-oqmrtuo97d-1772709679058 .note{stroke:#f59e0b;fill:#422006;}#mermaid-oqmrtuo97d-1772709679058 .noteText,#mermaid-oqmrtuo97d-1772709679058 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-oqmrtuo97d-1772709679058 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-oqmrtuo97d-1772709679058 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-oqmrtuo97d-1772709679058 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-oqmrtuo97d-1772709679058 .actorPopupMenu{position:absolute;}#mermaid-oqmrtuo97d-1772709679058 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-oqmrtuo97d-1772709679058 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-oqmrtuo97d-1772709679058 .actor-man circle,#mermaid-oqmrtuo97d-1772709679058 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-oqmrtuo97d-1772709679058 :root{--mermaid-font-family:inherit;}P needs a new MIf no P available, park M1Runningsyscall(read)Release P (entering syscall)Acquire M2Run other goroutinessyscall returnsTry to get P

### Network I/O: The Netpoller

Network I/O is different from file I/O. While file reads truly block in the kernel, network operations can be made non-blocking with the right OS facilities. The netpoller is Go's integration with these facilities (epoll on Linux, kqueue on BSD/macOS, IOCP on Windows).

**What the netpoller enables:**

1.  **No thread blocked:** When waiting for network data, the goroutine is parked (sleeping) but the M is free to run other goroutines. A server can have 100,000 goroutines waiting for network I/O with only a handful of threads.
2.  **Efficient multiplexing:** Instead of one thread per connection (the thread-per-request model), Go uses a small number of threads to manage many connections via OS-level event notification.
3.  **Seamless integration:** Your code looks like blocking I/O (`conn.Read(buf)`), but under the hood it's non-blocking and event-driven.

**How it works:**

1.  When a goroutine does network I/O that would block:

*   The runtime sets the socket to non-blocking mode
*   The socket is registered with the netpoller
*   The goroutine is parked (moved to waiting state)
*   The M continues running other goroutines

3.  When the socket is ready:

*   The netpoller (running on a background thread) detects readiness
*   The goroutine is marked as runnable
*   The goroutine is added back to a run queue
*   An M picks it up and resumes execution

This is why Go handles thousands of concurrent network connections efficiently. The M's don't block on I/O.

Go

```go
1func handleConnection(conn net.Conn) {
2    buf := make([]byte, 1024)
3    for {
4        n, err := conn.Read(buf) // Doesn't block M, uses netpoller
5        if err != nil {
6            return
7        }
8        conn.Write(buf[:n]) // Also uses netpoller
9    }
10}
```

# Goroutine Leaks

A goroutine leak occurs when goroutines are created but never terminate. They consume memory and may hold resources:

### Common Causes

**1\. Blocked channel operations:**

Go

```go
1// LEAK: receiver goroutine never terminates if ctx is cancelled
2func fetch(ctx context.Context, url string) {
3    result := make(chan string)
4
5    go func() {
6        resp := httpGet(url)
7        result <- resp // Blocks forever if no one receives
8    }()
9
10    select {
11    case r := <-result:
12        fmt.Println(r)
13    case <-ctx.Done():
14        return // result goroutine is leaked!
15    }
16}
```

**Fix: Use buffered channel or select with context.**

The fix addresses the root cause: the goroutine blocks because its send has no receiver. We have two options:

**Option 1: Buffered channel** - The send can complete even without a receiver, because the buffer absorbs the value. The goroutine can then exit, and the buffered value is garbage collected later.

Go

```go
1func fetchBuffered(ctx context.Context, url string) {
2    result := make(chan string, 1) // Buffer of 1: send never blocks
3
4    go func() {
5        resp := httpGet(url)
6        result <- resp  // Always succeeds, even if no receiver
7    }()
8
9    select {
10    case r := <-result:
11        fmt.Println(r)
12    case <-ctx.Done():
13        return  // Goroutine completes, value sits in buffer, both get GC'd
14    }
15}
```

**Option 2: Select with context** - The goroutine watches for cancellation and exits cleanly when the context is done.

Go

```go
1func fetchWithContext(ctx context.Context, url string) {
2    result := make(chan string)
3
4    go func() {
5        resp := httpGet(url)
6        select {
7        case result <- resp:  // Send if receiver is waiting
8        case <-ctx.Done():    // Or exit if cancelled
9            // Context cancelled, exit cleanly
10        }
11    }()
12
13    select {
14    case r := <-result:
15        fmt.Println(r)
16    case <-ctx.Done():
17        return
18    }
19}
```

**2\. Infinite loops without exit:**

Go

```go
1// LEAK: worker never stops
2func startWorker() {
3    go func() {
4        for {
5            doWork()
6        }
7    }()
8}
```

**Why this leaks:** The goroutine has no exit condition. Even if the function that called `startWorker()` returns, the goroutine runs forever, consuming memory and potentially CPU.

**Fix: Use context for cancellation.** Context is the idiomatic way to signal "please stop" to goroutines. The goroutine checks `ctx.Done()` regularly and exits when cancelled.

Go

```go
1func startWorker(ctx context.Context) {
2    go func() {
3        for {
4            select {
5            case <-ctx.Done():
6                return  // Clean exit when context cancelled
7            default:
8                doWork()
9            }
10        }
11    }()
12}
```

**3\. Missing case in select:**

Go

```go
1// LEAK: if ch never receives, goroutine blocks forever
2go func() {
3    val := <-ch
4    process(val)
5}()
```

**Why this leaks:** A bare receive (`<-ch`) blocks until a value arrives. If the sender crashes, the channel is abandoned, or the send never happens, this goroutine waits forever.

**Fix: Add timeout or context.** Every blocking operation should have an escape hatch. Use `time.After` for simple timeouts or `ctx.Done()` for cancellation that propagates through your call stack.

Go

```go
1go func() {
2    select {
3    case val := <-ch:
4        process(val)
5    case <-time.After(5 * time.Second):
6        log.Println("timeout waiting for value")
7    case <-ctx.Done():
8        return  // Parent cancelled, exit cleanly
9    }
10}()
```

**Important:** `time.After` creates a timer that isn't garbage collected until it fires. In hot paths, use `time.NewTimer` and call `timer.Stop()` to avoid memory leaks from accumulated timers.

### Detecting Goroutine Leaks

**Using runtime.NumGoroutine():**

Go

```go
1func TestNoLeak(t *testing.T) {
2    before := runtime.NumGoroutine()
3
4    // Run code that spawns goroutines
5    doSomething()
6
7    // Wait for goroutines to finish
8    time.Sleep(100 * time.Millisecond)
9
10    after := runtime.NumGoroutine()
11    if after > before {
12        t.Errorf("goroutine leak: before=%d, after=%d", before, after)
13    }
14}
```

**Using goleak (Uber's library):**

Go

```go
1import "go.uber.org/goleak"
2
3func TestMain(m *testing.M) {
4    goleak.VerifyTestMain(m)
5}
```

**Using pprof:**

Go

```go
1import _ "net/http/pprof"
2
3func main() {
4    go func() {
5        log.Println(http.ListenAndServe("localhost:6060", nil))
6    }()
7    // ...
8}
```

Then visit `http://localhost:6060/debug/pprof/goroutine?debug=1` to see all goroutines and their stack traces.

# Debugging the Scheduler

### GODEBUG Environment Variable

Shell

```shell
1# Scheduler trace: prints scheduler events
2GODEBUG=schedtrace=1000 go run main.go
3
4# Detailed scheduler trace
5GODEBUG=scheddetail=1,schedtrace=1000 go run main.go
```

Sample output:

Shell

```shell
1SCHED 0ms: gomaxprocs=8 idleprocs=7 threads=2 spinningthreads=0 idlethreads=0 runqueue=0 [0 0 0 0 0 0 0 0]
2SCHED 1000ms: gomaxprocs=8 idleprocs=4 threads=5 spinningthreads=1 idlethreads=0 runqueue=2 [15 12 8 3 0 0 0 0]
```

Fields:

*   `gomaxprocs`: Number of P's
*   `idleprocs`: P's with no work
*   `threads`: Total M's
*   `spinningthreads`: M's looking for work
*   `runqueue`: Global run queue size
*   `[...]`: Local run queue sizes for each P

### Stack Traces

Go

```go
1import "runtime/debug"
2
3func printStacks() {
4    debug.PrintStack() // Current goroutine only
5}
6
7// Or all goroutines
8func printAllStacks() {
9    buf := make([]byte, 1024*1024)
10    n := runtime.Stack(buf, true) // true = all goroutines
11    fmt.Printf("%s\n", buf[:n])
12}
```

### Execution Tracer

Go

```go
1import "runtime/trace"
2
3func main() {
4    f, _ := os.Create("trace.out")
5    defer f.Close()
6
7    trace.Start(f)
8    defer trace.Stop()
9
10    // Your program here
11}
```

View with: `go tool trace trace.out`

The trace shows:

*   Goroutine creation and blocking
*   GC events
*   Syscalls
*   Network I/O
*   Scheduler decisions

# Performance Characteristics

Understanding the costs of goroutine operations helps you make informed design decisions.

### Creation and Memory

Metric

Value

Notes

Initial stack size

~2 KB

Grows/shrinks dynamically

Maximum stack size

1 GB (64-bit)

Runtime limit, configurable

Creation time

~0.3 microseconds

Much faster than OS thread (~10 μs)

Goroutine struct

~400 bytes

Runtime overhead per goroutine

**Practical implication:** Creating a million goroutines uses about 2-3 GB of memory (stack + struct overhead). This is feasible for connection-per-goroutine servers, but watch memory usage under load.

### Context Switch Costs

Operation

Cost

Notes

Goroutine switch

100-200 ns

User space, minimal state

OS thread switch

1-10 μs

Kernel mode, full context

Syscall (fast path)

~100 ns

No actual kernel entry

Syscall (slow path)

~1 μs

Enters kernel

**Why goroutine switches are fast:**

*   Only save/restore stack pointer + program counter
*   No kernel transition
*   No privilege level change
*   No TLB flush

### Scheduler Overhead

Operation

Cost

Notes

Work stealing

~200 ns

Per steal attempt

Global queue access

~50 ns

Lock contention possible

Local queue push/pop

~10 ns

Lock-free for owner

Netpoller check

~100 ns

Amortized across many goroutines

### Benchmarking Goroutine Creation

Go

```go
1func BenchmarkGoroutineCreation(b *testing.B) {
2    for i := 0; i < b.N; i++ {
3        done := make(chan struct{})
4        go func() {
5            close(done)
6        }()
7        <-done
8    }
9}
10
11// Typical results on modern hardware:
12// BenchmarkGoroutineCreation-8    3000000    400 ns/op
13// (includes creation + context switch + channel operation)
```

### Practical Guidelines

**When to use more goroutines:**

*   I/O-bound work (network, disk): goroutines are cheap, I/O is slow
*   Independent tasks that don't share state
*   Connection handling in servers

**When to limit goroutines:**

*   CPU-bound work: more goroutines than cores just adds overhead
*   Heavy memory usage per goroutine: watch total memory
*   Shared state with high contention: more goroutines = more contention

**Rule of thumb for worker pools:**

*   CPU-bound: `runtime.NumCPU()` workers
*   I/O-bound: 10-100x CPU count, tuned by benchmarking
*   Mixed: start with `runtime.NumCPU() * 2`, adjust based on profiling

Launching soon
