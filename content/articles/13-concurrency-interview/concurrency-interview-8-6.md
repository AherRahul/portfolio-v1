---
title: "Thread Leakage"
description: "Thread Leakage - Concurrency Interview Module 8"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Thread Leakage

Thread leakage occurs when threads are created but never properly terminated. These threads consume resources, primarily memory for their stack, as well as OS-level resources like file descriptors and kernel data structures, without doing any useful work.

Unlike a memory leak where objects are retained unintentionally, thread leakage involves active threads that the application has lost control over. They're not garbage collected because they're still running, even if they're stuck or forgotten.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-5b0ercbhwac-1772709684331{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-5b0ercbhwac-1772709684331 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-5b0ercbhwac-1772709684331 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-5b0ercbhwac-1772709684331 .error-icon{fill:#000000;}#mermaid-5b0ercbhwac-1772709684331 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-5b0ercbhwac-1772709684331 .edge-thickness-normal{stroke-width:1px;}#mermaid-5b0ercbhwac-1772709684331 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-5b0ercbhwac-1772709684331 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-5b0ercbhwac-1772709684331 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-5b0ercbhwac-1772709684331 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-5b0ercbhwac-1772709684331 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-5b0ercbhwac-1772709684331 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-5b0ercbhwac-1772709684331 .marker.cross{stroke:#22c55e;}#mermaid-5b0ercbhwac-1772709684331 svg{font-family:inherit;font-size:16px;}#mermaid-5b0ercbhwac-1772709684331 p{margin:0;}#mermaid-5b0ercbhwac-1772709684331 .label{font-family:inherit;color:#f0fdf4;}#mermaid-5b0ercbhwac-1772709684331 .cluster-label text{fill:#fafafa;}#mermaid-5b0ercbhwac-1772709684331 .cluster-label span{color:#fafafa;}#mermaid-5b0ercbhwac-1772709684331 .cluster-label span p{background-color:transparent;}#mermaid-5b0ercbhwac-1772709684331 .label text,#mermaid-5b0ercbhwac-1772709684331 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-5b0ercbhwac-1772709684331 .node rect,#mermaid-5b0ercbhwac-1772709684331 .node circle,#mermaid-5b0ercbhwac-1772709684331 .node ellipse,#mermaid-5b0ercbhwac-1772709684331 .node polygon,#mermaid-5b0ercbhwac-1772709684331 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-5b0ercbhwac-1772709684331 .rough-node .label text,#mermaid-5b0ercbhwac-1772709684331 .node .label text,#mermaid-5b0ercbhwac-1772709684331 .image-shape .label,#mermaid-5b0ercbhwac-1772709684331 .icon-shape .label{text-anchor:middle;}#mermaid-5b0ercbhwac-1772709684331 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-5b0ercbhwac-1772709684331 .rough-node .label,#mermaid-5b0ercbhwac-1772709684331 .node .label,#mermaid-5b0ercbhwac-1772709684331 .image-shape .label,#mermaid-5b0ercbhwac-1772709684331 .icon-shape .label{text-align:center;}#mermaid-5b0ercbhwac-1772709684331 .node.clickable{cursor:pointer;}#mermaid-5b0ercbhwac-1772709684331 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-5b0ercbhwac-1772709684331 .arrowheadPath{fill:#0b0b0b;}#mermaid-5b0ercbhwac-1772709684331 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-5b0ercbhwac-1772709684331 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-5b0ercbhwac-1772709684331 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-5b0ercbhwac-1772709684331 .edgeLabel p{background-color:#0a0a0a;}#mermaid-5b0ercbhwac-1772709684331 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-5b0ercbhwac-1772709684331 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-5b0ercbhwac-1772709684331 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-5b0ercbhwac-1772709684331 .cluster text{fill:#fafafa;}#mermaid-5b0ercbhwac-1772709684331 .cluster span{color:#fafafa;}#mermaid-5b0ercbhwac-1772709684331 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-5b0ercbhwac-1772709684331 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-5b0ercbhwac-1772709684331 rect.text{fill:none;stroke-width:0;}#mermaid-5b0ercbhwac-1772709684331 .icon-shape,#mermaid-5b0ercbhwac-1772709684331 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-5b0ercbhwac-1772709684331 .icon-shape p,#mermaid-5b0ercbhwac-1772709684331 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-5b0ercbhwac-1772709684331 .icon-shape rect,#mermaid-5b0ercbhwac-1772709684331 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-5b0ercbhwac-1772709684331 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-5b0ercbhwac-1772709684331 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-5b0ercbhwac-1772709684331 :root{--mermaid-font-family:inherit;}#mermaid-5b0ercbhwac-1772709684331 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-5b0ercbhwac-1772709684331 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-5b0ercbhwac-1772709684331 .primary tspan{fill:#000!important;}#mermaid-5b0ercbhwac-1772709684331 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-5b0ercbhwac-1772709684331 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-5b0ercbhwac-1772709684331 .green tspan{fill:#000!important;}#mermaid-5b0ercbhwac-1772709684331 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-5b0ercbhwac-1772709684331 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-5b0ercbhwac-1772709684331 .orange tspan{fill:#000!important;}#mermaid-5b0ercbhwac-1772709684331 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-5b0ercbhwac-1772709684331 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-5b0ercbhwac-1772709684331 .red tspan{fill:#000!important;}#mermaid-5b0ercbhwac-1772709684331 .decision>\*{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-5b0ercbhwac-1772709684331 .decision span{fill:#ffd43b!important;stroke:#000!important;color:#000!important;}#mermaid-5b0ercbhwac-1772709684331 .decision tspan{fill:#000!important;}

Leak Zone

Yes

No - Exception

No - Blocked Forever

No - Forgotten

Application Start

Thread Created

Thread Completes Work?

Thread Terminates

Thread Dies Unexpectedly

Thread Stuck

Thread Orphaned

New Thread Created

Resource Held Forever

Every thread in a typical application consumes:

Resource

Typical Amount

Stack memory

512KB - 1MB per thread (configurable)

OS thread handle

~8KB kernel memory

Thread-local storage

Varies by application

JVM/runtime overhead

~2KB metadata

A few hundred leaked threads might go unnoticed. A few thousand will cause problems. Tens of thousands will crash your application.

# Why Thread Leakage Happens

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
