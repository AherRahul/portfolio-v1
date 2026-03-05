---
title: "Networking"
description: "Networking - System Design Interviews Module 4"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# Networking

Every system design interview involves networking. Whether you are designing a chat application, URL shortener, or video streaming platform, data must travel between clients and servers across networks.

Understanding networking fundamentals helps you make better design decisions and explain your choices to interviewers.

This chapter covers networking from the ground up.

We will start with how data moves through the network stack, then dive into TCP, UDP, DNS, and HTTP. We will explore real-time communication with WebSockets, security with TLS, and the unique challenges of networking in distributed systems.

# 1\. The Network Stack: OSI vs TCP/IP

When you click a link in your browser, dozens of things happen before the page appears. Your computer looks up the IP address, establishes a connection, negotiates encryption, sends the request, and receives the response.

Each step involves a different protocol, and these protocols are organized into layers.

**Why layers?**

Because networking is complex, and we need a way to manage that complexity. Each layer handles one concern, whether that is routing packets across the internet or ensuring data arrives without corruption.

### 1.1 The OSI Model

The OSI (Open Systems Interconnection) model divides networking into 7 layers. Think of it like an assembly line where each station does one job and passes the work to the next.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-gkjfnoxon0k-1772709239801{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-gkjfnoxon0k-1772709239801 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-gkjfnoxon0k-1772709239801 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-gkjfnoxon0k-1772709239801 .error-icon{fill:#000000;}#mermaid-gkjfnoxon0k-1772709239801 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-gkjfnoxon0k-1772709239801 .edge-thickness-normal{stroke-width:1px;}#mermaid-gkjfnoxon0k-1772709239801 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-gkjfnoxon0k-1772709239801 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-gkjfnoxon0k-1772709239801 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-gkjfnoxon0k-1772709239801 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-gkjfnoxon0k-1772709239801 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-gkjfnoxon0k-1772709239801 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-gkjfnoxon0k-1772709239801 .marker.cross{stroke:#22c55e;}#mermaid-gkjfnoxon0k-1772709239801 svg{font-family:inherit;font-size:16px;}#mermaid-gkjfnoxon0k-1772709239801 p{margin:0;}#mermaid-gkjfnoxon0k-1772709239801 .label{font-family:inherit;color:#f0fdf4;}#mermaid-gkjfnoxon0k-1772709239801 .cluster-label text{fill:#fafafa;}#mermaid-gkjfnoxon0k-1772709239801 .cluster-label span{color:#fafafa;}#mermaid-gkjfnoxon0k-1772709239801 .cluster-label span p{background-color:transparent;}#mermaid-gkjfnoxon0k-1772709239801 .label text,#mermaid-gkjfnoxon0k-1772709239801 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-gkjfnoxon0k-1772709239801 .node rect,#mermaid-gkjfnoxon0k-1772709239801 .node circle,#mermaid-gkjfnoxon0k-1772709239801 .node ellipse,#mermaid-gkjfnoxon0k-1772709239801 .node polygon,#mermaid-gkjfnoxon0k-1772709239801 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-gkjfnoxon0k-1772709239801 .rough-node .label text,#mermaid-gkjfnoxon0k-1772709239801 .node .label text,#mermaid-gkjfnoxon0k-1772709239801 .image-shape .label,#mermaid-gkjfnoxon0k-1772709239801 .icon-shape .label{text-anchor:middle;}#mermaid-gkjfnoxon0k-1772709239801 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-gkjfnoxon0k-1772709239801 .rough-node .label,#mermaid-gkjfnoxon0k-1772709239801 .node .label,#mermaid-gkjfnoxon0k-1772709239801 .image-shape .label,#mermaid-gkjfnoxon0k-1772709239801 .icon-shape .label{text-align:center;}#mermaid-gkjfnoxon0k-1772709239801 .node.clickable{cursor:pointer;}#mermaid-gkjfnoxon0k-1772709239801 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-gkjfnoxon0k-1772709239801 .arrowheadPath{fill:#0b0b0b;}#mermaid-gkjfnoxon0k-1772709239801 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-gkjfnoxon0k-1772709239801 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-gkjfnoxon0k-1772709239801 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-gkjfnoxon0k-1772709239801 .edgeLabel p{background-color:#0a0a0a;}#mermaid-gkjfnoxon0k-1772709239801 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-gkjfnoxon0k-1772709239801 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-gkjfnoxon0k-1772709239801 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-gkjfnoxon0k-1772709239801 .cluster text{fill:#fafafa;}#mermaid-gkjfnoxon0k-1772709239801 .cluster span{color:#fafafa;}#mermaid-gkjfnoxon0k-1772709239801 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-gkjfnoxon0k-1772709239801 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-gkjfnoxon0k-1772709239801 rect.text{fill:none;stroke-width:0;}#mermaid-gkjfnoxon0k-1772709239801 .icon-shape,#mermaid-gkjfnoxon0k-1772709239801 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-gkjfnoxon0k-1772709239801 .icon-shape p,#mermaid-gkjfnoxon0k-1772709239801 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-gkjfnoxon0k-1772709239801 .icon-shape rect,#mermaid-gkjfnoxon0k-1772709239801 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-gkjfnoxon0k-1772709239801 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-gkjfnoxon0k-1772709239801 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-gkjfnoxon0k-1772709239801 :root{--mermaid-font-family:inherit;}#mermaid-gkjfnoxon0k-1772709239801 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-gkjfnoxon0k-1772709239801 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-gkjfnoxon0k-1772709239801 .primary tspan{fill:#000!important;}#mermaid-gkjfnoxon0k-1772709239801 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-gkjfnoxon0k-1772709239801 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-gkjfnoxon0k-1772709239801 .orange tspan{fill:#000!important;}#mermaid-gkjfnoxon0k-1772709239801 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-gkjfnoxon0k-1772709239801 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-gkjfnoxon0k-1772709239801 .green tspan{fill:#000!important;}#mermaid-gkjfnoxon0k-1772709239801 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-gkjfnoxon0k-1772709239801 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-gkjfnoxon0k-1772709239801 .purple tspan{fill:#000!important;}#mermaid-gkjfnoxon0k-1772709239801 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-gkjfnoxon0k-1772709239801 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-gkjfnoxon0k-1772709239801 .red tspan{fill:#000!important;}

OSI Model

Layer 7: Application  
HTTP, FTP, SMTP, DNS

Layer 6: Presentation  
Encryption, Compression

Layer 5: Session  
Connection Management

Layer 4: Transport  
TCP, UDP

Layer 3: Network  
IP, ICMP, Routing

Layer 2: Data Link  
Ethernet, MAC, Switches

Layer 1: Physical  
Cables, Signals, NICs

#### **Why 7 layers?**

Each layer abstracts complexity from the layers above it.

When you write an HTTP request, you do not think about packet routing or electrical signals. The layers below handle that. This abstraction lets you focus on application logic while trusting the network stack to deliver your data.

More importantly, understanding layers helps you debug problems. If your service cannot reach a database, is it a DNS issue (Layer 7), a firewall blocking the port (Layer 4), or a routing problem (Layer 3)?

Knowing the stack helps you ask the right questions.

### 1.2 The TCP/IP Model

The OSI model is a teaching tool. In the real world, the TCP/IP model is what actually runs the internet. It combines several OSI layers and maps directly to the protocols you will use.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-shieknbdmap-1772709239806{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-shieknbdmap-1772709239806 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-shieknbdmap-1772709239806 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-shieknbdmap-1772709239806 .error-icon{fill:#000000;}#mermaid-shieknbdmap-1772709239806 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-shieknbdmap-1772709239806 .edge-thickness-normal{stroke-width:1px;}#mermaid-shieknbdmap-1772709239806 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-shieknbdmap-1772709239806 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-shieknbdmap-1772709239806 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-shieknbdmap-1772709239806 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-shieknbdmap-1772709239806 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-shieknbdmap-1772709239806 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-shieknbdmap-1772709239806 .marker.cross{stroke:#22c55e;}#mermaid-shieknbdmap-1772709239806 svg{font-family:inherit;font-size:16px;}#mermaid-shieknbdmap-1772709239806 p{margin:0;}#mermaid-shieknbdmap-1772709239806 .label{font-family:inherit;color:#f0fdf4;}#mermaid-shieknbdmap-1772709239806 .cluster-label text{fill:#fafafa;}#mermaid-shieknbdmap-1772709239806 .cluster-label span{color:#fafafa;}#mermaid-shieknbdmap-1772709239806 .cluster-label span p{background-color:transparent;}#mermaid-shieknbdmap-1772709239806 .label text,#mermaid-shieknbdmap-1772709239806 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-shieknbdmap-1772709239806 .node rect,#mermaid-shieknbdmap-1772709239806 .node circle,#mermaid-shieknbdmap-1772709239806 .node ellipse,#mermaid-shieknbdmap-1772709239806 .node polygon,#mermaid-shieknbdmap-1772709239806 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-shieknbdmap-1772709239806 .rough-node .label text,#mermaid-shieknbdmap-1772709239806 .node .label text,#mermaid-shieknbdmap-1772709239806 .image-shape .label,#mermaid-shieknbdmap-1772709239806 .icon-shape .label{text-anchor:middle;}#mermaid-shieknbdmap-1772709239806 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-shieknbdmap-1772709239806 .rough-node .label,#mermaid-shieknbdmap-1772709239806 .node .label,#mermaid-shieknbdmap-1772709239806 .image-shape .label,#mermaid-shieknbdmap-1772709239806 .icon-shape .label{text-align:center;}#mermaid-shieknbdmap-1772709239806 .node.clickable{cursor:pointer;}#mermaid-shieknbdmap-1772709239806 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-shieknbdmap-1772709239806 .arrowheadPath{fill:#0b0b0b;}#mermaid-shieknbdmap-1772709239806 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-shieknbdmap-1772709239806 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-shieknbdmap-1772709239806 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-shieknbdmap-1772709239806 .edgeLabel p{background-color:#0a0a0a;}#mermaid-shieknbdmap-1772709239806 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-shieknbdmap-1772709239806 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-shieknbdmap-1772709239806 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-shieknbdmap-1772709239806 .cluster text{fill:#fafafa;}#mermaid-shieknbdmap-1772709239806 .cluster span{color:#fafafa;}#mermaid-shieknbdmap-1772709239806 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-shieknbdmap-1772709239806 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-shieknbdmap-1772709239806 rect.text{fill:none;stroke-width:0;}#mermaid-shieknbdmap-1772709239806 .icon-shape,#mermaid-shieknbdmap-1772709239806 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-shieknbdmap-1772709239806 .icon-shape p,#mermaid-shieknbdmap-1772709239806 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-shieknbdmap-1772709239806 .icon-shape rect,#mermaid-shieknbdmap-1772709239806 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-shieknbdmap-1772709239806 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-shieknbdmap-1772709239806 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-shieknbdmap-1772709239806 :root{--mermaid-font-family:inherit;}#mermaid-shieknbdmap-1772709239806 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-shieknbdmap-1772709239806 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-shieknbdmap-1772709239806 .primary tspan{fill:#000!important;}#mermaid-shieknbdmap-1772709239806 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-shieknbdmap-1772709239806 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-shieknbdmap-1772709239806 .orange tspan{fill:#000!important;}#mermaid-shieknbdmap-1772709239806 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-shieknbdmap-1772709239806 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-shieknbdmap-1772709239806 .green tspan{fill:#000!important;}#mermaid-shieknbdmap-1772709239806 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-shieknbdmap-1772709239806 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-shieknbdmap-1772709239806 .purple tspan{fill:#000!important;}#mermaid-shieknbdmap-1772709239806 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-shieknbdmap-1772709239806 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-shieknbdmap-1772709239806 .red tspan{fill:#000!important;}

TCP/IP (4 Layers)

OSI (7 Layers)

Application

Presentation

Session

Transport

Network

Data Link

Physical

Application  
HTTP, DNS, FTP

Transport  
TCP, UDP

Internet  
IP, ICMP

Network Access  
Ethernet, WiFi

TCP/IP Layer

OSI Layers

Protocols

Application

7, 6, 5

HTTP, HTTPS, DNS, FTP, SMTP

Transport

4

TCP, UDP

Internet

3

IP, ICMP, ARP

Network Access

2, 1

Ethernet, WiFi, PPP

### 1.3 Data Encapsulation

Here is where it gets interesting. When your application sends data, it does not go directly to the network. Instead, each layer wraps the data with its own header, like putting a letter in an envelope, then putting that envelope in a package, then putting that package in a shipping container.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-ov0oufzf94e-1772709239807{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-ov0oufzf94e-1772709239807 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-ov0oufzf94e-1772709239807 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-ov0oufzf94e-1772709239807 .error-icon{fill:#000000;}#mermaid-ov0oufzf94e-1772709239807 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-ov0oufzf94e-1772709239807 .edge-thickness-normal{stroke-width:1px;}#mermaid-ov0oufzf94e-1772709239807 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-ov0oufzf94e-1772709239807 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-ov0oufzf94e-1772709239807 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-ov0oufzf94e-1772709239807 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-ov0oufzf94e-1772709239807 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-ov0oufzf94e-1772709239807 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-ov0oufzf94e-1772709239807 .marker.cross{stroke:#22c55e;}#mermaid-ov0oufzf94e-1772709239807 svg{font-family:inherit;font-size:16px;}#mermaid-ov0oufzf94e-1772709239807 p{margin:0;}#mermaid-ov0oufzf94e-1772709239807 .label{font-family:inherit;color:#f0fdf4;}#mermaid-ov0oufzf94e-1772709239807 .cluster-label text{fill:#fafafa;}#mermaid-ov0oufzf94e-1772709239807 .cluster-label span{color:#fafafa;}#mermaid-ov0oufzf94e-1772709239807 .cluster-label span p{background-color:transparent;}#mermaid-ov0oufzf94e-1772709239807 .label text,#mermaid-ov0oufzf94e-1772709239807 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-ov0oufzf94e-1772709239807 .node rect,#mermaid-ov0oufzf94e-1772709239807 .node circle,#mermaid-ov0oufzf94e-1772709239807 .node ellipse,#mermaid-ov0oufzf94e-1772709239807 .node polygon,#mermaid-ov0oufzf94e-1772709239807 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-ov0oufzf94e-1772709239807 .rough-node .label text,#mermaid-ov0oufzf94e-1772709239807 .node .label text,#mermaid-ov0oufzf94e-1772709239807 .image-shape .label,#mermaid-ov0oufzf94e-1772709239807 .icon-shape .label{text-anchor:middle;}#mermaid-ov0oufzf94e-1772709239807 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-ov0oufzf94e-1772709239807 .rough-node .label,#mermaid-ov0oufzf94e-1772709239807 .node .label,#mermaid-ov0oufzf94e-1772709239807 .image-shape .label,#mermaid-ov0oufzf94e-1772709239807 .icon-shape .label{text-align:center;}#mermaid-ov0oufzf94e-1772709239807 .node.clickable{cursor:pointer;}#mermaid-ov0oufzf94e-1772709239807 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-ov0oufzf94e-1772709239807 .arrowheadPath{fill:#0b0b0b;}#mermaid-ov0oufzf94e-1772709239807 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-ov0oufzf94e-1772709239807 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-ov0oufzf94e-1772709239807 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-ov0oufzf94e-1772709239807 .edgeLabel p{background-color:#0a0a0a;}#mermaid-ov0oufzf94e-1772709239807 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-ov0oufzf94e-1772709239807 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-ov0oufzf94e-1772709239807 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-ov0oufzf94e-1772709239807 .cluster text{fill:#fafafa;}#mermaid-ov0oufzf94e-1772709239807 .cluster span{color:#fafafa;}#mermaid-ov0oufzf94e-1772709239807 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-ov0oufzf94e-1772709239807 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-ov0oufzf94e-1772709239807 rect.text{fill:none;stroke-width:0;}#mermaid-ov0oufzf94e-1772709239807 .icon-shape,#mermaid-ov0oufzf94e-1772709239807 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-ov0oufzf94e-1772709239807 .icon-shape p,#mermaid-ov0oufzf94e-1772709239807 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-ov0oufzf94e-1772709239807 .icon-shape rect,#mermaid-ov0oufzf94e-1772709239807 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-ov0oufzf94e-1772709239807 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-ov0oufzf94e-1772709239807 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-ov0oufzf94e-1772709239807 :root{--mermaid-font-family:inherit;}#mermaid-ov0oufzf94e-1772709239807 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-ov0oufzf94e-1772709239807 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-ov0oufzf94e-1772709239807 .primary tspan{fill:#000!important;}#mermaid-ov0oufzf94e-1772709239807 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-ov0oufzf94e-1772709239807 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-ov0oufzf94e-1772709239807 .orange tspan{fill:#000!important;}#mermaid-ov0oufzf94e-1772709239807 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-ov0oufzf94e-1772709239807 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-ov0oufzf94e-1772709239807 .green tspan{fill:#000!important;}#mermaid-ov0oufzf94e-1772709239807 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-ov0oufzf94e-1772709239807 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-ov0oufzf94e-1772709239807 .purple tspan{fill:#000!important;}

DataLink

Network

Transport

Application

Data

TCP Header

Data

IP Header

TCP Header

Data

Ethernet Header

IP Header

TCP Header

Data

Ethernet Trailer

# 2\. IP Addressing and Routing

Every device on a network needs an address. Without addresses, packets would have no way to find their destination. IP addresses are like phone numbers, they identify where to send data.

### 2.1 IPv4 vs IPv6

When the internet was designed in the 1980s, 4.3 billion addresses seemed like plenty. That assumption has not aged well. With smartphones, IoT devices, and cloud services, we ran out of IPv4 addresses years ago.

**IPv4** uses 32-bit addresses like `192.168.1.1`. These addresses are scarce, so we resort to tricks like NAT (Network Address Translation) to share them.

**IPv6** solves this with 128-bit addresses like `2001:db8::1`. The address space is so large that we could assign an IP to every atom on Earth and still have addresses left over. Adoption has been slow, but it is happening.

```python
1IPv4: 192.168.1.1        (4 octets, 32 bits)
2IPv6: 2001:db8::1        (8 groups, 128 bits, :: compresses zeros)
```

For system design, IPv4 remains the default. You will occasionally see IPv6 in discussions about global scale or mobile networks, but most internal systems still run on IPv4.

### 2.2 Public vs Private IP Addresses

Not all IP addresses are created equal. Some addresses work only within private networks. Others are routable across the public internet.

Your database server should have a private IP that is not reachable from the internet. Your load balancer needs a public IP so users can reach it. Getting this wrong creates either security vulnerabilities or connectivity issues.

Scroll

Range

Type

Use

10.0.0.0/8

Private

Large organizations

172.16.0.0/12

Private

Medium networks

192.168.0.0/16

Private

Home/small office

Everything else

Public

Internet-routable

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-x6aiwytsr2g-1772709239808{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-x6aiwytsr2g-1772709239808 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-x6aiwytsr2g-1772709239808 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-x6aiwytsr2g-1772709239808 .error-icon{fill:#000000;}#mermaid-x6aiwytsr2g-1772709239808 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-x6aiwytsr2g-1772709239808 .edge-thickness-normal{stroke-width:1px;}#mermaid-x6aiwytsr2g-1772709239808 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-x6aiwytsr2g-1772709239808 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-x6aiwytsr2g-1772709239808 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-x6aiwytsr2g-1772709239808 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-x6aiwytsr2g-1772709239808 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-x6aiwytsr2g-1772709239808 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-x6aiwytsr2g-1772709239808 .marker.cross{stroke:#22c55e;}#mermaid-x6aiwytsr2g-1772709239808 svg{font-family:inherit;font-size:16px;}#mermaid-x6aiwytsr2g-1772709239808 p{margin:0;}#mermaid-x6aiwytsr2g-1772709239808 .label{font-family:inherit;color:#f0fdf4;}#mermaid-x6aiwytsr2g-1772709239808 .cluster-label text{fill:#fafafa;}#mermaid-x6aiwytsr2g-1772709239808 .cluster-label span{color:#fafafa;}#mermaid-x6aiwytsr2g-1772709239808 .cluster-label span p{background-color:transparent;}#mermaid-x6aiwytsr2g-1772709239808 .label text,#mermaid-x6aiwytsr2g-1772709239808 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-x6aiwytsr2g-1772709239808 .node rect,#mermaid-x6aiwytsr2g-1772709239808 .node circle,#mermaid-x6aiwytsr2g-1772709239808 .node ellipse,#mermaid-x6aiwytsr2g-1772709239808 .node polygon,#mermaid-x6aiwytsr2g-1772709239808 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-x6aiwytsr2g-1772709239808 .rough-node .label text,#mermaid-x6aiwytsr2g-1772709239808 .node .label text,#mermaid-x6aiwytsr2g-1772709239808 .image-shape .label,#mermaid-x6aiwytsr2g-1772709239808 .icon-shape .label{text-anchor:middle;}#mermaid-x6aiwytsr2g-1772709239808 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-x6aiwytsr2g-1772709239808 .rough-node .label,#mermaid-x6aiwytsr2g-1772709239808 .node .label,#mermaid-x6aiwytsr2g-1772709239808 .image-shape .label,#mermaid-x6aiwytsr2g-1772709239808 .icon-shape .label{text-align:center;}#mermaid-x6aiwytsr2g-1772709239808 .node.clickable{cursor:pointer;}#mermaid-x6aiwytsr2g-1772709239808 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-x6aiwytsr2g-1772709239808 .arrowheadPath{fill:#0b0b0b;}#mermaid-x6aiwytsr2g-1772709239808 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-x6aiwytsr2g-1772709239808 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-x6aiwytsr2g-1772709239808 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-x6aiwytsr2g-1772709239808 .edgeLabel p{background-color:#0a0a0a;}#mermaid-x6aiwytsr2g-1772709239808 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-x6aiwytsr2g-1772709239808 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-x6aiwytsr2g-1772709239808 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-x6aiwytsr2g-1772709239808 .cluster text{fill:#fafafa;}#mermaid-x6aiwytsr2g-1772709239808 .cluster span{color:#fafafa;}#mermaid-x6aiwytsr2g-1772709239808 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-x6aiwytsr2g-1772709239808 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-x6aiwytsr2g-1772709239808 rect.text{fill:none;stroke-width:0;}#mermaid-x6aiwytsr2g-1772709239808 .icon-shape,#mermaid-x6aiwytsr2g-1772709239808 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-x6aiwytsr2g-1772709239808 .icon-shape p,#mermaid-x6aiwytsr2g-1772709239808 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-x6aiwytsr2g-1772709239808 .icon-shape rect,#mermaid-x6aiwytsr2g-1772709239808 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-x6aiwytsr2g-1772709239808 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-x6aiwytsr2g-1772709239808 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-x6aiwytsr2g-1772709239808 :root{--mermaid-font-family:inherit;}#mermaid-x6aiwytsr2g-1772709239808 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-x6aiwytsr2g-1772709239808 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-x6aiwytsr2g-1772709239808 .primary tspan{fill:#000!important;}#mermaid-x6aiwytsr2g-1772709239808 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-x6aiwytsr2g-1772709239808 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-x6aiwytsr2g-1772709239808 .orange tspan{fill:#000!important;}#mermaid-x6aiwytsr2g-1772709239808 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-x6aiwytsr2g-1772709239808 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-x6aiwytsr2g-1772709239808 .green tspan{fill:#000!important;}#mermaid-x6aiwytsr2g-1772709239808 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-x6aiwytsr2g-1772709239808 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-x6aiwytsr2g-1772709239808 .purple tspan{fill:#000!important;}

Server (Public)

Internet

Home Network (Private)

NAT: 98.76.54.32

Laptop  
192.168.1.10

Phone  
192.168.1.11

Router  
192.168.1.1

Internet

Web Server  
203.0.113.50

**NAT (Network Address Translation)** allows multiple devices with private IPs to share a single public IP. Your home router performs NAT.

### 2.3 Subnetting and CIDR

When you design a system on AWS, GCP, or any cloud provider, one of the first decisions is how to carve up your network. CIDR notation helps you specify IP ranges concisely.

The notation `192.168.1.0/24` means "the first 24 bits are the network, the remaining 8 bits are for hosts." That gives you 256 addresses (254 usable, since one is the network address and one is broadcast).

```python
1192.168.1.0/24
2└── Network: 192.168.1.0
3└── Hosts: 192.168.1.1 - 192.168.1.254
4└── Broadcast: 192.168.1.255
5└── Available: 254 hosts
```

The smaller the number after the slash, the larger the network:

Scroll

CIDR

Subnet Mask

Hosts

Use Case

/8

255.0.0.0

16.7M

Large cloud providers

/16

255.255.0.0

65,534

VPCs, large networks

/24

255.255.255.0

254

Typical subnets

/28

255.255.255.240

14

Small subnets

/32

255.255.255.255

1

Single host

#### **Why bother with subnets?**

Subnets let you segment your network for security and control. A typical production setup might look like this:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-du94t8udp7v-1772709239808{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-du94t8udp7v-1772709239808 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-du94t8udp7v-1772709239808 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-du94t8udp7v-1772709239808 .error-icon{fill:#000000;}#mermaid-du94t8udp7v-1772709239808 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-du94t8udp7v-1772709239808 .edge-thickness-normal{stroke-width:1px;}#mermaid-du94t8udp7v-1772709239808 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-du94t8udp7v-1772709239808 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-du94t8udp7v-1772709239808 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-du94t8udp7v-1772709239808 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-du94t8udp7v-1772709239808 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-du94t8udp7v-1772709239808 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-du94t8udp7v-1772709239808 .marker.cross{stroke:#22c55e;}#mermaid-du94t8udp7v-1772709239808 svg{font-family:inherit;font-size:16px;}#mermaid-du94t8udp7v-1772709239808 p{margin:0;}#mermaid-du94t8udp7v-1772709239808 .label{font-family:inherit;color:#f0fdf4;}#mermaid-du94t8udp7v-1772709239808 .cluster-label text{fill:#fafafa;}#mermaid-du94t8udp7v-1772709239808 .cluster-label span{color:#fafafa;}#mermaid-du94t8udp7v-1772709239808 .cluster-label span p{background-color:transparent;}#mermaid-du94t8udp7v-1772709239808 .label text,#mermaid-du94t8udp7v-1772709239808 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-du94t8udp7v-1772709239808 .node rect,#mermaid-du94t8udp7v-1772709239808 .node circle,#mermaid-du94t8udp7v-1772709239808 .node ellipse,#mermaid-du94t8udp7v-1772709239808 .node polygon,#mermaid-du94t8udp7v-1772709239808 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-du94t8udp7v-1772709239808 .rough-node .label text,#mermaid-du94t8udp7v-1772709239808 .node .label text,#mermaid-du94t8udp7v-1772709239808 .image-shape .label,#mermaid-du94t8udp7v-1772709239808 .icon-shape .label{text-anchor:middle;}#mermaid-du94t8udp7v-1772709239808 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-du94t8udp7v-1772709239808 .rough-node .label,#mermaid-du94t8udp7v-1772709239808 .node .label,#mermaid-du94t8udp7v-1772709239808 .image-shape .label,#mermaid-du94t8udp7v-1772709239808 .icon-shape .label{text-align:center;}#mermaid-du94t8udp7v-1772709239808 .node.clickable{cursor:pointer;}#mermaid-du94t8udp7v-1772709239808 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-du94t8udp7v-1772709239808 .arrowheadPath{fill:#0b0b0b;}#mermaid-du94t8udp7v-1772709239808 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-du94t8udp7v-1772709239808 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-du94t8udp7v-1772709239808 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-du94t8udp7v-1772709239808 .edgeLabel p{background-color:#0a0a0a;}#mermaid-du94t8udp7v-1772709239808 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-du94t8udp7v-1772709239808 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-du94t8udp7v-1772709239808 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-du94t8udp7v-1772709239808 .cluster text{fill:#fafafa;}#mermaid-du94t8udp7v-1772709239808 .cluster span{color:#fafafa;}#mermaid-du94t8udp7v-1772709239808 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-du94t8udp7v-1772709239808 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-du94t8udp7v-1772709239808 rect.text{fill:none;stroke-width:0;}#mermaid-du94t8udp7v-1772709239808 .icon-shape,#mermaid-du94t8udp7v-1772709239808 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-du94t8udp7v-1772709239808 .icon-shape p,#mermaid-du94t8udp7v-1772709239808 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-du94t8udp7v-1772709239808 .icon-shape rect,#mermaid-du94t8udp7v-1772709239808 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-du94t8udp7v-1772709239808 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-du94t8udp7v-1772709239808 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-du94t8udp7v-1772709239808 :root{--mermaid-font-family:inherit;}#mermaid-du94t8udp7v-1772709239808 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-du94t8udp7v-1772709239808 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-du94t8udp7v-1772709239808 .primary tspan{fill:#000!important;}#mermaid-du94t8udp7v-1772709239808 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-du94t8udp7v-1772709239808 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-du94t8udp7v-1772709239808 .orange tspan{fill:#000!important;}#mermaid-du94t8udp7v-1772709239808 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-du94t8udp7v-1772709239808 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-du94t8udp7v-1772709239808 .purple tspan{fill:#000!important;}

VPC: 10.0.0.0/16

Data Subnet: 10.0.3.0/24

Private Subnet: 10.0.2.0/24

Public Subnet: 10.0.1.0/24

Database

Load Balancer

App Server 1

App Server 2

Cache

The public subnet holds your load balancer, which has a public IP. The private subnet holds your application servers, which are not directly reachable from the internet.

The data subnet holds your database, isolated from everything except the application servers. If someone compromises a server in the public subnet, they still cannot reach your database directly.

### 2.4 How Routing Works

IP addresses tell us where to send data, but they do not tell us how to get there. That is the job of routing. Every router along the path looks at the destination IP and decides which direction to forward the packet.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-vpbkhqttg9o-1772709239809{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-vpbkhqttg9o-1772709239809 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-vpbkhqttg9o-1772709239809 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-vpbkhqttg9o-1772709239809 .error-icon{fill:#000000;}#mermaid-vpbkhqttg9o-1772709239809 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-vpbkhqttg9o-1772709239809 .edge-thickness-normal{stroke-width:1px;}#mermaid-vpbkhqttg9o-1772709239809 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-vpbkhqttg9o-1772709239809 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-vpbkhqttg9o-1772709239809 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-vpbkhqttg9o-1772709239809 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-vpbkhqttg9o-1772709239809 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-vpbkhqttg9o-1772709239809 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-vpbkhqttg9o-1772709239809 .marker.cross{stroke:#22c55e;}#mermaid-vpbkhqttg9o-1772709239809 svg{font-family:inherit;font-size:16px;}#mermaid-vpbkhqttg9o-1772709239809 p{margin:0;}#mermaid-vpbkhqttg9o-1772709239809 .label{font-family:inherit;color:#f0fdf4;}#mermaid-vpbkhqttg9o-1772709239809 .cluster-label text{fill:#fafafa;}#mermaid-vpbkhqttg9o-1772709239809 .cluster-label span{color:#fafafa;}#mermaid-vpbkhqttg9o-1772709239809 .cluster-label span p{background-color:transparent;}#mermaid-vpbkhqttg9o-1772709239809 .label text,#mermaid-vpbkhqttg9o-1772709239809 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-vpbkhqttg9o-1772709239809 .node rect,#mermaid-vpbkhqttg9o-1772709239809 .node circle,#mermaid-vpbkhqttg9o-1772709239809 .node ellipse,#mermaid-vpbkhqttg9o-1772709239809 .node polygon,#mermaid-vpbkhqttg9o-1772709239809 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-vpbkhqttg9o-1772709239809 .rough-node .label text,#mermaid-vpbkhqttg9o-1772709239809 .node .label text,#mermaid-vpbkhqttg9o-1772709239809 .image-shape .label,#mermaid-vpbkhqttg9o-1772709239809 .icon-shape .label{text-anchor:middle;}#mermaid-vpbkhqttg9o-1772709239809 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-vpbkhqttg9o-1772709239809 .rough-node .label,#mermaid-vpbkhqttg9o-1772709239809 .node .label,#mermaid-vpbkhqttg9o-1772709239809 .image-shape .label,#mermaid-vpbkhqttg9o-1772709239809 .icon-shape .label{text-align:center;}#mermaid-vpbkhqttg9o-1772709239809 .node.clickable{cursor:pointer;}#mermaid-vpbkhqttg9o-1772709239809 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-vpbkhqttg9o-1772709239809 .arrowheadPath{fill:#0b0b0b;}#mermaid-vpbkhqttg9o-1772709239809 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-vpbkhqttg9o-1772709239809 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-vpbkhqttg9o-1772709239809 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-vpbkhqttg9o-1772709239809 .edgeLabel p{background-color:#0a0a0a;}#mermaid-vpbkhqttg9o-1772709239809 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-vpbkhqttg9o-1772709239809 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-vpbkhqttg9o-1772709239809 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-vpbkhqttg9o-1772709239809 .cluster text{fill:#fafafa;}#mermaid-vpbkhqttg9o-1772709239809 .cluster span{color:#fafafa;}#mermaid-vpbkhqttg9o-1772709239809 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-vpbkhqttg9o-1772709239809 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-vpbkhqttg9o-1772709239809 rect.text{fill:none;stroke-width:0;}#mermaid-vpbkhqttg9o-1772709239809 .icon-shape,#mermaid-vpbkhqttg9o-1772709239809 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-vpbkhqttg9o-1772709239809 .icon-shape p,#mermaid-vpbkhqttg9o-1772709239809 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-vpbkhqttg9o-1772709239809 .icon-shape rect,#mermaid-vpbkhqttg9o-1772709239809 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-vpbkhqttg9o-1772709239809 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-vpbkhqttg9o-1772709239809 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-vpbkhqttg9o-1772709239809 :root{--mermaid-font-family:inherit;}#mermaid-vpbkhqttg9o-1772709239809 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-vpbkhqttg9o-1772709239809 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-vpbkhqttg9o-1772709239809 .primary tspan{fill:#000!important;}#mermaid-vpbkhqttg9o-1772709239809 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-vpbkhqttg9o-1772709239809 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-vpbkhqttg9o-1772709239809 .orange tspan{fill:#000!important;}#mermaid-vpbkhqttg9o-1772709239809 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-vpbkhqttg9o-1772709239809 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-vpbkhqttg9o-1772709239809 .green tspan{fill:#000!important;}

Hop 1

Hop 2

Hop 3

Hop 4

Source  
192.168.1.10

Router 1

Router 2

Router 3

Destination  
203.0.113.50

Every router has a routing table that maps destination networks to next hops:

```python
1Destination     Gateway         Interface   Notes
20.0.0.0/0       192.168.1.1     eth0        Default route (everything else)
310.0.0.0/8      10.0.0.1        eth1        Internal network
4192.168.1.0/24  0.0.0.0         eth0        Directly connected
```

The router checks each destination against its table, finds the most specific match (longest prefix), and forwards the packet. If no specific route matches, it uses the default route (`0.0.0.0/0`).

Packets may take different paths across the internet, even within the same connection. Routers make independent decisions, and conditions change. This is why TCP needs sequence numbers to reassemble data in order.

Design implication

Network topology affects latency. Services in the same availability zone communicate in under a millisecond. Cross-region traffic adds tens of milliseconds. If two services talk frequently, put them in the same region, or better, the same AZ.

# 3\. TCP Deep Dive

TCP is the workhorse of the internet. Every HTTP request, database query, and microservice call typically runs over TCP. It handles the messy reality of networking, packets get lost, arrive out of order, or get corrupted, and makes it look like a reliable stream of bytes to your application.

### 3.1 TCP Connection Lifecycle

Before sending data, TCP establishes a connection. This takes a round trip, which is why connection reuse matters at scale.

The handshake accomplishes two things: verify that both sides can send and receive, and agree on initial sequence numbers.

1.  **SYN:** Client picks a random sequence number (say, 1000) and sends it. "I want to connect, starting at sequence 1000."
2.  **SYN-ACK:** Server picks its own sequence number (say, 5000) and acknowledges the client's. "Got it, I am starting at 5000, and I acknowledge your 1000."
3.  **ACK:** Client acknowledges the server's sequence number. "Got your 5000, we are ready."

**Why random sequence numbers?**

If they were predictable, an attacker could inject fake packets into a connection. Random numbers make this much harder.

**Why not two steps?**

With only two steps, the server would not know if the client received its response. Old, delayed SYN packets could trick the server into allocating resources for connections that will never complete.

### 3.2 TCP Header Structure

![TCP Header](/_next/image?url=https%3A%2F%2Fpayload.algomaster.io%2Fapi%2Fmedia%2Ffile%2Ftcp-header.png&w=1920&q=90)

**Key fields:**

Field

Purpose

Source/Dest Port

Identify application endpoints

Sequence Number

Order bytes in the stream

Acknowledgment

Confirm received bytes

Flags (SYN, ACK, FIN)

Control connection state

Window

Flow control (how much data sender can send)

Checksum

Error detection

### 3.3 Reliability Mechanisms

IP is unreliable. Packets can get lost, duplicated, corrupted, or arrive out of order. TCP adds reliability on top of IP through four mechanisms that work together.

#### **1\. Acknowledgments and Retransmission**

Every segment of data gets acknowledged. When the sender does not receive an ACK within a timeout period, it assumes the packet was lost and retransmits it.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

ReceiverSenderReceiverSender#mermaid-65wsayl6tts-1772709239810{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-65wsayl6tts-1772709239810 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-65wsayl6tts-1772709239810 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-65wsayl6tts-1772709239810 .error-icon{fill:#000000;}#mermaid-65wsayl6tts-1772709239810 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-65wsayl6tts-1772709239810 .edge-thickness-normal{stroke-width:1px;}#mermaid-65wsayl6tts-1772709239810 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-65wsayl6tts-1772709239810 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-65wsayl6tts-1772709239810 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-65wsayl6tts-1772709239810 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-65wsayl6tts-1772709239810 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-65wsayl6tts-1772709239810 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-65wsayl6tts-1772709239810 .marker.cross{stroke:#22c55e;}#mermaid-65wsayl6tts-1772709239810 svg{font-family:inherit;font-size:16px;}#mermaid-65wsayl6tts-1772709239810 p{margin:0;}#mermaid-65wsayl6tts-1772709239810 .actor{stroke:#22c55e;fill:transparent;}#mermaid-65wsayl6tts-1772709239810 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-65wsayl6tts-1772709239810 .actor-line{stroke:#22c55e;}#mermaid-65wsayl6tts-1772709239810 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-65wsayl6tts-1772709239810 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-65wsayl6tts-1772709239810 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-65wsayl6tts-1772709239810 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-65wsayl6tts-1772709239810 .sequenceNumber{fill:#f0fdf4;}#mermaid-65wsayl6tts-1772709239810 #sequencenumber{fill:#fafafa;}#mermaid-65wsayl6tts-1772709239810 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-65wsayl6tts-1772709239810 .messageText{fill:#fafafa;stroke:none;}#mermaid-65wsayl6tts-1772709239810 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-65wsayl6tts-1772709239810 .labelText,#mermaid-65wsayl6tts-1772709239810 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-65wsayl6tts-1772709239810 .loopText,#mermaid-65wsayl6tts-1772709239810 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-65wsayl6tts-1772709239810 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-65wsayl6tts-1772709239810 .note{stroke:#f59e0b;fill:#422006;}#mermaid-65wsayl6tts-1772709239810 .noteText,#mermaid-65wsayl6tts-1772709239810 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-65wsayl6tts-1772709239810 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-65wsayl6tts-1772709239810 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-65wsayl6tts-1772709239810 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-65wsayl6tts-1772709239810 .actorPopupMenu{position:absolute;}#mermaid-65wsayl6tts-1772709239810 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-65wsayl6tts-1772709239810 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-65wsayl6tts-1772709239810 .actor-man circle,#mermaid-65wsayl6tts-1772709239810 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-65wsayl6tts-1772709239810 :root{--mermaid-font-family:inherit;}Packet lost!Segment 1 (seq=1)ACK (ack=101)Segment 2 (seq=101)Segment 2 (seq=101) \[Retransmit\]ACK (ack=201)

#### **2\. Sequence Numbers**

Each byte in the stream has a sequence number. If packet 3 arrives before packet 2, the receiver holds packet 3 until packet 2 shows up, then delivers both in order. If the same packet arrives twice (a retransmission that was not needed), the receiver ignores the duplicate.

#### **3\. Checksums**

Every TCP segment includes a checksum computed over the header and data. If the receiver's checksum does not match, the packet was corrupted in transit, and TCP discards it silently. The sender will eventually retransmit.

#### **4\. Sliding Window**

Waiting for an ACK after every packet is slow, especially over high-latency links. The sliding window lets the sender have multiple packets "in flight" simultaneously.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-ybop0jy20wj-1772709239810{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-ybop0jy20wj-1772709239810 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-ybop0jy20wj-1772709239810 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-ybop0jy20wj-1772709239810 .error-icon{fill:#000000;}#mermaid-ybop0jy20wj-1772709239810 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-ybop0jy20wj-1772709239810 .edge-thickness-normal{stroke-width:1px;}#mermaid-ybop0jy20wj-1772709239810 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-ybop0jy20wj-1772709239810 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-ybop0jy20wj-1772709239810 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-ybop0jy20wj-1772709239810 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-ybop0jy20wj-1772709239810 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-ybop0jy20wj-1772709239810 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-ybop0jy20wj-1772709239810 .marker.cross{stroke:#22c55e;}#mermaid-ybop0jy20wj-1772709239810 svg{font-family:inherit;font-size:16px;}#mermaid-ybop0jy20wj-1772709239810 p{margin:0;}#mermaid-ybop0jy20wj-1772709239810 .label{font-family:inherit;color:#f0fdf4;}#mermaid-ybop0jy20wj-1772709239810 .cluster-label text{fill:#fafafa;}#mermaid-ybop0jy20wj-1772709239810 .cluster-label span{color:#fafafa;}#mermaid-ybop0jy20wj-1772709239810 .cluster-label span p{background-color:transparent;}#mermaid-ybop0jy20wj-1772709239810 .label text,#mermaid-ybop0jy20wj-1772709239810 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-ybop0jy20wj-1772709239810 .node rect,#mermaid-ybop0jy20wj-1772709239810 .node circle,#mermaid-ybop0jy20wj-1772709239810 .node ellipse,#mermaid-ybop0jy20wj-1772709239810 .node polygon,#mermaid-ybop0jy20wj-1772709239810 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-ybop0jy20wj-1772709239810 .rough-node .label text,#mermaid-ybop0jy20wj-1772709239810 .node .label text,#mermaid-ybop0jy20wj-1772709239810 .image-shape .label,#mermaid-ybop0jy20wj-1772709239810 .icon-shape .label{text-anchor:middle;}#mermaid-ybop0jy20wj-1772709239810 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-ybop0jy20wj-1772709239810 .rough-node .label,#mermaid-ybop0jy20wj-1772709239810 .node .label,#mermaid-ybop0jy20wj-1772709239810 .image-shape .label,#mermaid-ybop0jy20wj-1772709239810 .icon-shape .label{text-align:center;}#mermaid-ybop0jy20wj-1772709239810 .node.clickable{cursor:pointer;}#mermaid-ybop0jy20wj-1772709239810 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-ybop0jy20wj-1772709239810 .arrowheadPath{fill:#0b0b0b;}#mermaid-ybop0jy20wj-1772709239810 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-ybop0jy20wj-1772709239810 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-ybop0jy20wj-1772709239810 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-ybop0jy20wj-1772709239810 .edgeLabel p{background-color:#0a0a0a;}#mermaid-ybop0jy20wj-1772709239810 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-ybop0jy20wj-1772709239810 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-ybop0jy20wj-1772709239810 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-ybop0jy20wj-1772709239810 .cluster text{fill:#fafafa;}#mermaid-ybop0jy20wj-1772709239810 .cluster span{color:#fafafa;}#mermaid-ybop0jy20wj-1772709239810 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-ybop0jy20wj-1772709239810 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-ybop0jy20wj-1772709239810 rect.text{fill:none;stroke-width:0;}#mermaid-ybop0jy20wj-1772709239810 .icon-shape,#mermaid-ybop0jy20wj-1772709239810 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-ybop0jy20wj-1772709239810 .icon-shape p,#mermaid-ybop0jy20wj-1772709239810 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-ybop0jy20wj-1772709239810 .icon-shape rect,#mermaid-ybop0jy20wj-1772709239810 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-ybop0jy20wj-1772709239810 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-ybop0jy20wj-1772709239810 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-ybop0jy20wj-1772709239810 :root{--mermaid-font-family:inherit;}#mermaid-ybop0jy20wj-1772709239810 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-ybop0jy20wj-1772709239810 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-ybop0jy20wj-1772709239810 .green tspan{fill:#000!important;}#mermaid-ybop0jy20wj-1772709239810 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-ybop0jy20wj-1772709239810 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-ybop0jy20wj-1772709239810 .orange tspan{fill:#000!important;}#mermaid-ybop0jy20wj-1772709239810 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-ybop0jy20wj-1772709239810 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-ybop0jy20wj-1772709239810 .primary tspan{fill:#000!important;}#mermaid-ybop0jy20wj-1772709239810 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-ybop0jy20wj-1772709239810 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-ybop0jy20wj-1772709239810 .red tspan{fill:#000!important;}

Sliding Window

Sent, ACKed

Sent, waiting ACK

Can send

Cannot send yet

### 3.4 Flow Control

What happens if the sender transmits faster than the receiver can process? Without flow control, the receiver's buffers overflow, and packets get dropped. TCP prevents this by having the receiver advertise how much data it can accept.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

ReceiverSenderReceiverSender#mermaid-694a25629f4909e6a17df2a4-1772709239811{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .error-icon{fill:#000000;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .edge-thickness-normal{stroke-width:1px;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .marker.cross{stroke:#22c55e;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 svg{font-family:inherit;font-size:16px;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 p{margin:0;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .actor{stroke:#22c55e;fill:transparent;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .actor-line{stroke:#22c55e;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .sequenceNumber{fill:#f0fdf4;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 #sequencenumber{fill:#fafafa;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .messageText{fill:#fafafa;stroke:none;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .labelText,#mermaid-694a25629f4909e6a17df2a4-1772709239811 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .loopText,#mermaid-694a25629f4909e6a17df2a4-1772709239811 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .note{stroke:#f59e0b;fill:#422006;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .noteText,#mermaid-694a25629f4909e6a17df2a4-1772709239811 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .actorPopupMenu{position:absolute;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 .actor-man circle,#mermaid-694a25629f4909e6a17df2a4-1772709239811 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-694a25629f4909e6a17df2a4-1772709239811 :root{--mermaid-font-family:inherit;}Can send up to 64KBReceiver is processing, window shrinksMust stop! Receiver is fullProcessing...Can resume sendingACK, Window = 64KB32KB of dataACK, Window = 32KB32KB of dataACK, Window = 0ACK, Window = 64KB

This back-pressure mechanism is automatic. Your application just writes to the socket, and TCP handles the pacing. But if the receiver is consistently slower than the sender, you have a design problem that flow control cannot fix.

#### **Window Scaling for Modern Networks**

The original TCP header has a 16-bit window field, limiting it to 64KB. That was fine in the 1980s, but on a 1 Gbps link with 100ms latency, you can have 12.5MB of data in flight. Modern TCP uses a window scaling option negotiated during the handshake to support windows up to 1GB.

### 3.5 Congestion Control

Flow control prevents overwhelming the receiver. Congestion control prevents overwhelming the network.

Imagine a router in the middle of the internet handling traffic from thousands of connections. If everyone sends as fast as possible, the router's queues overflow, packets get dropped, and everyone's performance suffers. TCP tries to be a good citizen by detecting congestion and backing off.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-qebl1cuvry-1772709239811{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-qebl1cuvry-1772709239811 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-qebl1cuvry-1772709239811 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-qebl1cuvry-1772709239811 .error-icon{fill:#000000;}#mermaid-qebl1cuvry-1772709239811 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-qebl1cuvry-1772709239811 .edge-thickness-normal{stroke-width:1px;}#mermaid-qebl1cuvry-1772709239811 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-qebl1cuvry-1772709239811 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-qebl1cuvry-1772709239811 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-qebl1cuvry-1772709239811 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-qebl1cuvry-1772709239811 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-qebl1cuvry-1772709239811 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-qebl1cuvry-1772709239811 .marker.cross{stroke:#22c55e;}#mermaid-qebl1cuvry-1772709239811 svg{font-family:inherit;font-size:16px;}#mermaid-qebl1cuvry-1772709239811 p{margin:0;}#mermaid-qebl1cuvry-1772709239811 .label{font-family:inherit;color:#f0fdf4;}#mermaid-qebl1cuvry-1772709239811 .cluster-label text{fill:#fafafa;}#mermaid-qebl1cuvry-1772709239811 .cluster-label span{color:#fafafa;}#mermaid-qebl1cuvry-1772709239811 .cluster-label span p{background-color:transparent;}#mermaid-qebl1cuvry-1772709239811 .label text,#mermaid-qebl1cuvry-1772709239811 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-qebl1cuvry-1772709239811 .node rect,#mermaid-qebl1cuvry-1772709239811 .node circle,#mermaid-qebl1cuvry-1772709239811 .node ellipse,#mermaid-qebl1cuvry-1772709239811 .node polygon,#mermaid-qebl1cuvry-1772709239811 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-qebl1cuvry-1772709239811 .rough-node .label text,#mermaid-qebl1cuvry-1772709239811 .node .label text,#mermaid-qebl1cuvry-1772709239811 .image-shape .label,#mermaid-qebl1cuvry-1772709239811 .icon-shape .label{text-anchor:middle;}#mermaid-qebl1cuvry-1772709239811 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-qebl1cuvry-1772709239811 .rough-node .label,#mermaid-qebl1cuvry-1772709239811 .node .label,#mermaid-qebl1cuvry-1772709239811 .image-shape .label,#mermaid-qebl1cuvry-1772709239811 .icon-shape .label{text-align:center;}#mermaid-qebl1cuvry-1772709239811 .node.clickable{cursor:pointer;}#mermaid-qebl1cuvry-1772709239811 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-qebl1cuvry-1772709239811 .arrowheadPath{fill:#0b0b0b;}#mermaid-qebl1cuvry-1772709239811 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-qebl1cuvry-1772709239811 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-qebl1cuvry-1772709239811 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-qebl1cuvry-1772709239811 .edgeLabel p{background-color:#0a0a0a;}#mermaid-qebl1cuvry-1772709239811 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-qebl1cuvry-1772709239811 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-qebl1cuvry-1772709239811 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-qebl1cuvry-1772709239811 .cluster text{fill:#fafafa;}#mermaid-qebl1cuvry-1772709239811 .cluster span{color:#fafafa;}#mermaid-qebl1cuvry-1772709239811 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-qebl1cuvry-1772709239811 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-qebl1cuvry-1772709239811 rect.text{fill:none;stroke-width:0;}#mermaid-qebl1cuvry-1772709239811 .icon-shape,#mermaid-qebl1cuvry-1772709239811 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-qebl1cuvry-1772709239811 .icon-shape p,#mermaid-qebl1cuvry-1772709239811 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-qebl1cuvry-1772709239811 .icon-shape rect,#mermaid-qebl1cuvry-1772709239811 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-qebl1cuvry-1772709239811 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-qebl1cuvry-1772709239811 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-qebl1cuvry-1772709239811 :root{--mermaid-font-family:inherit;}#mermaid-qebl1cuvry-1772709239811 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-qebl1cuvry-1772709239811 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-qebl1cuvry-1772709239811 .green tspan{fill:#000!important;}#mermaid-qebl1cuvry-1772709239811 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-qebl1cuvry-1772709239811 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-qebl1cuvry-1772709239811 .primary tspan{fill:#000!important;}#mermaid-qebl1cuvry-1772709239811 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-qebl1cuvry-1772709239811 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-qebl1cuvry-1772709239811 .orange tspan{fill:#000!important;}

TCP Congestion Control

cwnd >= ssthresh

Timeout

3 duplicate ACKs

Recovery complete

Slow Start  
Exponential growth

Congestion Avoidance  
Linear growth

Fast Recovery  
After packet loss

**Slow Start:** A new connection does not know how much bandwidth is available. It starts with a small congestion window (typically 10 segments) and doubles every round trip. This exponential growth quickly finds the available capacity.

**Congestion Avoidance:** Once the window hits a threshold (or after recovering from loss), growth becomes linear. Add one segment per RTT. This cautious probing avoids triggering congestion.

**Fast Recovery:** If the sender receives three duplicate ACKs (same acknowledgment number three times), it means a packet was lost but subsequent packets arrived. The sender retransmits immediately and halves its window, rather than starting over.

**Timeout:** If no ACK arrives at all, something is seriously wrong. The sender resets to slow start with a minimal window.

Situation

What Happens

Impact

New connection

Slow start

First few RTTs are slow

Stable network

Congestion avoidance

Gradual optimization

Minor loss

Fast recovery

Brief slowdown

Major loss

Timeout reset

Significant slowdown

New TCP connections start slow. On a high-latency link (100ms RTT), it takes several round trips just to ramp up to full speed. If your system makes many short-lived connections, most of the time is spent in slow start, never reaching peak throughput.

This is why connection pooling and HTTP keep-alive are important. Reusing connections avoids the slow start penalty. Database connection pools, HTTP/2 multiplexing, and gRPC streaming all exist partly because of this TCP behavior.

#### **Modern Congestion Control Algorithms**

The classic algorithms (Reno, New Reno) use packet loss as the signal of congestion. Modern algorithms are smarter:

Algorithm

Approach

Best For

CUBIC

Aggressive after loss recovery

Linux default, high bandwidth

BBR

Measures bandwidth and RTT directly

Variable networks, Google's choice

Vegas

Detects congestion before loss

Low-latency applications

### 3.6 TCP Tuning Parameters

You rarely need to tune TCP, but when you do, these are the parameters that matter:

```shell
1# Linux kernel parameters (sysctl)
2net.core.somaxconn = 4096          # Max pending connections
3net.ipv4.tcp_max_syn_backlog = 4096 # SYN queue before accept()
4net.ipv4.tcp_fin_timeout = 30       # How long to wait in FIN-WAIT-2
5net.ipv4.tcp_keepalive_time = 300   # Seconds before sending keepalive
6net.ipv4.tcp_tw_reuse = 1           # Reuse sockets in TIME-WAIT
7net.core.rmem_max = 16777216        # Max receive buffer (16MB)
8net.core.wmem_max = 16777216        # Max send buffer (16MB)
```

#### **When You Hit TCP Limits**

Symptom

Likely Cause

Fix

"Connection refused" under load

Listen queue full

Increase `somaxconn`

Thousands of TIME-WAIT sockets

Many short connections

Enable `tw_reuse`, use connection pooling

Slow bulk transfers

Small buffers on high-latency link

Increase buffer sizes

High latency for first request

TCP + TLS handshakes

Enable TCP Fast Open

Connections dropping after idle

Firewall killing idle connections

Tune keepalive or use application-level pings

# 4\. UDP and When to Use It

TCP does a lot of work: connection setup, reliability, ordering, flow control, congestion control. That work takes time and bandwidth. Sometimes you do not need it. That is where UDP comes in.

UDP strips away all the complexity. It just takes your data, adds source and destination ports, and sends it. No handshakes, no acknowledgments, no retransmissions. If a packet gets lost, UDP does not care. If packets arrive out of order, UDP delivers them that way.

### 4.1 UDP vs TCP

The trade-off is fundamental: reliability versus latency.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-6fxw7hlotu3-1772709239812{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-6fxw7hlotu3-1772709239812 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-6fxw7hlotu3-1772709239812 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-6fxw7hlotu3-1772709239812 .error-icon{fill:#000000;}#mermaid-6fxw7hlotu3-1772709239812 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-6fxw7hlotu3-1772709239812 .edge-thickness-normal{stroke-width:1px;}#mermaid-6fxw7hlotu3-1772709239812 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-6fxw7hlotu3-1772709239812 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-6fxw7hlotu3-1772709239812 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-6fxw7hlotu3-1772709239812 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-6fxw7hlotu3-1772709239812 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-6fxw7hlotu3-1772709239812 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-6fxw7hlotu3-1772709239812 .marker.cross{stroke:#22c55e;}#mermaid-6fxw7hlotu3-1772709239812 svg{font-family:inherit;font-size:16px;}#mermaid-6fxw7hlotu3-1772709239812 p{margin:0;}#mermaid-6fxw7hlotu3-1772709239812 .label{font-family:inherit;color:#f0fdf4;}#mermaid-6fxw7hlotu3-1772709239812 .cluster-label text{fill:#fafafa;}#mermaid-6fxw7hlotu3-1772709239812 .cluster-label span{color:#fafafa;}#mermaid-6fxw7hlotu3-1772709239812 .cluster-label span p{background-color:transparent;}#mermaid-6fxw7hlotu3-1772709239812 .label text,#mermaid-6fxw7hlotu3-1772709239812 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-6fxw7hlotu3-1772709239812 .node rect,#mermaid-6fxw7hlotu3-1772709239812 .node circle,#mermaid-6fxw7hlotu3-1772709239812 .node ellipse,#mermaid-6fxw7hlotu3-1772709239812 .node polygon,#mermaid-6fxw7hlotu3-1772709239812 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-6fxw7hlotu3-1772709239812 .rough-node .label text,#mermaid-6fxw7hlotu3-1772709239812 .node .label text,#mermaid-6fxw7hlotu3-1772709239812 .image-shape .label,#mermaid-6fxw7hlotu3-1772709239812 .icon-shape .label{text-anchor:middle;}#mermaid-6fxw7hlotu3-1772709239812 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-6fxw7hlotu3-1772709239812 .rough-node .label,#mermaid-6fxw7hlotu3-1772709239812 .node .label,#mermaid-6fxw7hlotu3-1772709239812 .image-shape .label,#mermaid-6fxw7hlotu3-1772709239812 .icon-shape .label{text-align:center;}#mermaid-6fxw7hlotu3-1772709239812 .node.clickable{cursor:pointer;}#mermaid-6fxw7hlotu3-1772709239812 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-6fxw7hlotu3-1772709239812 .arrowheadPath{fill:#0b0b0b;}#mermaid-6fxw7hlotu3-1772709239812 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-6fxw7hlotu3-1772709239812 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-6fxw7hlotu3-1772709239812 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-6fxw7hlotu3-1772709239812 .edgeLabel p{background-color:#0a0a0a;}#mermaid-6fxw7hlotu3-1772709239812 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-6fxw7hlotu3-1772709239812 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-6fxw7hlotu3-1772709239812 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-6fxw7hlotu3-1772709239812 .cluster text{fill:#fafafa;}#mermaid-6fxw7hlotu3-1772709239812 .cluster span{color:#fafafa;}#mermaid-6fxw7hlotu3-1772709239812 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-6fxw7hlotu3-1772709239812 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-6fxw7hlotu3-1772709239812 rect.text{fill:none;stroke-width:0;}#mermaid-6fxw7hlotu3-1772709239812 .icon-shape,#mermaid-6fxw7hlotu3-1772709239812 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-6fxw7hlotu3-1772709239812 .icon-shape p,#mermaid-6fxw7hlotu3-1772709239812 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-6fxw7hlotu3-1772709239812 .icon-shape rect,#mermaid-6fxw7hlotu3-1772709239812 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-6fxw7hlotu3-1772709239812 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-6fxw7hlotu3-1772709239812 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-6fxw7hlotu3-1772709239812 :root{--mermaid-font-family:inherit;}#mermaid-6fxw7hlotu3-1772709239812 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-6fxw7hlotu3-1772709239812 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-6fxw7hlotu3-1772709239812 .green tspan{fill:#000!important;}#mermaid-6fxw7hlotu3-1772709239812 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-6fxw7hlotu3-1772709239812 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-6fxw7hlotu3-1772709239812 .primary tspan{fill:#000!important;}#mermaid-6fxw7hlotu3-1772709239812 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-6fxw7hlotu3-1772709239812 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-6fxw7hlotu3-1772709239812 .orange tspan{fill:#000!important;}#mermaid-6fxw7hlotu3-1772709239812 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-6fxw7hlotu3-1772709239812 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-6fxw7hlotu3-1772709239812 .red tspan{fill:#000!important;}

UDP

Connectionless

Unreliable

Unordered

No built-in control

Minimal overhead

TCP

Connection-oriented

Reliable delivery

Ordered

Flow/Congestion control

Higher overhead

Scroll

Aspect

TCP

UDP

Connection

Required handshake

None

Reliability

Guaranteed delivery

Best effort

Ordering

Maintained

Not guaranteed

Header size

20–60 bytes

8 bytes

Use cases

HTTP, databases, file transfer

DNS, video streaming, gaming

### 4.2 UDP Header

```shell
10      7 8     15 16    23 24    31
2+--------+--------+--------+--------+
3|     Source      |   Destination   |
4|      Port       |      Port       |
5+--------+--------+--------+--------+
6|     Length      |    Checksum     |
7+--------+--------+--------+--------+
8|          data octets ...          |
9+-----------------------------------+
```

Just 8 bytes. No sequence numbers, no acknowledgments, no connection state.

### 4.3 When to Use UDP

The question is not "is reliability important?" but rather "who should handle reliability?"

**DNS:** A DNS query is tiny (a few hundred bytes) and expects a quick response. If the response does not arrive in 2 seconds, the client just asks again. TCP's handshake would take longer than the actual query. UDP fits perfectly.

**Video Streaming:** When you are watching a video, a lost frame is annoying but tolerable. Waiting to retransmit it is worse because now multiple frames are stale. The video player interpolates or shows a brief glitch and moves on. UDP with application-level buffering works better than TCP here.

**Online Gaming:** In a multiplayer game, you send player position 60 times per second. If packet 42 is lost but packet 43 arrives, you do not want the old position. You want the latest state. TCP would deliver packet 42 first, adding latency and giving you outdated information.

**Voice/Video Calls:** Similar to gaming. A brief audio glitch is better than a half-second delay while TCP retransmits. Our brains are surprisingly good at filling in gaps.

**IoT Sensors:** A temperature sensor sending readings every second does not need guaranteed delivery. If one reading is lost, the next one arrives in a second anyway. UDP keeps the protocol stack minimal for constrained devices.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-6sptnbbehed-1772709239812{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-6sptnbbehed-1772709239812 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-6sptnbbehed-1772709239812 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-6sptnbbehed-1772709239812 .error-icon{fill:#000000;}#mermaid-6sptnbbehed-1772709239812 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-6sptnbbehed-1772709239812 .edge-thickness-normal{stroke-width:1px;}#mermaid-6sptnbbehed-1772709239812 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-6sptnbbehed-1772709239812 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-6sptnbbehed-1772709239812 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-6sptnbbehed-1772709239812 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-6sptnbbehed-1772709239812 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-6sptnbbehed-1772709239812 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-6sptnbbehed-1772709239812 .marker.cross{stroke:#22c55e;}#mermaid-6sptnbbehed-1772709239812 svg{font-family:inherit;font-size:16px;}#mermaid-6sptnbbehed-1772709239812 p{margin:0;}#mermaid-6sptnbbehed-1772709239812 .label{font-family:inherit;color:#f0fdf4;}#mermaid-6sptnbbehed-1772709239812 .cluster-label text{fill:#fafafa;}#mermaid-6sptnbbehed-1772709239812 .cluster-label span{color:#fafafa;}#mermaid-6sptnbbehed-1772709239812 .cluster-label span p{background-color:transparent;}#mermaid-6sptnbbehed-1772709239812 .label text,#mermaid-6sptnbbehed-1772709239812 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-6sptnbbehed-1772709239812 .node rect,#mermaid-6sptnbbehed-1772709239812 .node circle,#mermaid-6sptnbbehed-1772709239812 .node ellipse,#mermaid-6sptnbbehed-1772709239812 .node polygon,#mermaid-6sptnbbehed-1772709239812 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-6sptnbbehed-1772709239812 .rough-node .label text,#mermaid-6sptnbbehed-1772709239812 .node .label text,#mermaid-6sptnbbehed-1772709239812 .image-shape .label,#mermaid-6sptnbbehed-1772709239812 .icon-shape .label{text-anchor:middle;}#mermaid-6sptnbbehed-1772709239812 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-6sptnbbehed-1772709239812 .rough-node .label,#mermaid-6sptnbbehed-1772709239812 .node .label,#mermaid-6sptnbbehed-1772709239812 .image-shape .label,#mermaid-6sptnbbehed-1772709239812 .icon-shape .label{text-align:center;}#mermaid-6sptnbbehed-1772709239812 .node.clickable{cursor:pointer;}#mermaid-6sptnbbehed-1772709239812 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-6sptnbbehed-1772709239812 .arrowheadPath{fill:#0b0b0b;}#mermaid-6sptnbbehed-1772709239812 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-6sptnbbehed-1772709239812 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-6sptnbbehed-1772709239812 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-6sptnbbehed-1772709239812 .edgeLabel p{background-color:#0a0a0a;}#mermaid-6sptnbbehed-1772709239812 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-6sptnbbehed-1772709239812 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-6sptnbbehed-1772709239812 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-6sptnbbehed-1772709239812 .cluster text{fill:#fafafa;}#mermaid-6sptnbbehed-1772709239812 .cluster span{color:#fafafa;}#mermaid-6sptnbbehed-1772709239812 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-6sptnbbehed-1772709239812 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-6sptnbbehed-1772709239812 rect.text{fill:none;stroke-width:0;}#mermaid-6sptnbbehed-1772709239812 .icon-shape,#mermaid-6sptnbbehed-1772709239812 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-6sptnbbehed-1772709239812 .icon-shape p,#mermaid-6sptnbbehed-1772709239812 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-6sptnbbehed-1772709239812 .icon-shape rect,#mermaid-6sptnbbehed-1772709239812 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-6sptnbbehed-1772709239812 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-6sptnbbehed-1772709239812 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-6sptnbbehed-1772709239812 :root{--mermaid-font-family:inherit;}#mermaid-6sptnbbehed-1772709239812 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-6sptnbbehed-1772709239812 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-6sptnbbehed-1772709239812 .primary tspan{fill:#000!important;}#mermaid-6sptnbbehed-1772709239812 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-6sptnbbehed-1772709239812 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-6sptnbbehed-1772709239812 .green tspan{fill:#000!important;}#mermaid-6sptnbbehed-1772709239812 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-6sptnbbehed-1772709239812 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-6sptnbbehed-1772709239812 .orange tspan{fill:#000!important;}

Yes

Yes

No

Yes

No

No

Yes

No

Need reliable delivery?

Can tolerate retransmission latency?

TCP

Can implement reliability at app layer?

UDP + App Reliability

Need low latency?

UDP

### 4.4 Building Reliability on UDP

Sometimes you want UDP's speed but need reliability for certain messages. The solution is to implement reliability at the application layer, but only where you need it.

#### **QUIC (HTTP/3)**

Google built QUIC to fix TCP's limitations. It runs on UDP but implements its own reliability, ordering, and congestion control. The key innovation is that it can multiplex multiple streams without head-of-line blocking. If one stream loses a packet, other streams keep flowing. QUIC also has 0-RTT connection establishment for repeat visitors.

#### **Game Networking**

A game might have three types of messages:

1.  **Unreliable:** Player position (60 times/second, old data is useless)
2.  **Reliable unordered:** Chat messages (must arrive, order does not matter)
3.  **Reliable ordered:** Game state changes (must arrive in order)

The game protocol uses UDP underneath but tracks sequence numbers and acknowledgments only for the reliable messages.

# 5\. DNS: The Internet's Directory

Humans remember names. Computers need numbers. DNS bridges this gap, translating `google.com` into `142.250.80.46`.

DNS seems simple until you realize it is the most heavily relied-upon distributed system in the world. Every web request, API call, and email delivery starts with a DNS lookup. If DNS is slow, everything is slow. If DNS is down, nothing works.

### 5.1 DNS Hierarchy

DNS is not a single database. It is a hierarchical, distributed system with millions of servers worldwide.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-hfoyei46iy8-1772709239813{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-hfoyei46iy8-1772709239813 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-hfoyei46iy8-1772709239813 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-hfoyei46iy8-1772709239813 .error-icon{fill:#000000;}#mermaid-hfoyei46iy8-1772709239813 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-hfoyei46iy8-1772709239813 .edge-thickness-normal{stroke-width:1px;}#mermaid-hfoyei46iy8-1772709239813 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-hfoyei46iy8-1772709239813 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-hfoyei46iy8-1772709239813 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-hfoyei46iy8-1772709239813 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-hfoyei46iy8-1772709239813 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-hfoyei46iy8-1772709239813 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-hfoyei46iy8-1772709239813 .marker.cross{stroke:#22c55e;}#mermaid-hfoyei46iy8-1772709239813 svg{font-family:inherit;font-size:16px;}#mermaid-hfoyei46iy8-1772709239813 p{margin:0;}#mermaid-hfoyei46iy8-1772709239813 .label{font-family:inherit;color:#f0fdf4;}#mermaid-hfoyei46iy8-1772709239813 .cluster-label text{fill:#fafafa;}#mermaid-hfoyei46iy8-1772709239813 .cluster-label span{color:#fafafa;}#mermaid-hfoyei46iy8-1772709239813 .cluster-label span p{background-color:transparent;}#mermaid-hfoyei46iy8-1772709239813 .label text,#mermaid-hfoyei46iy8-1772709239813 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-hfoyei46iy8-1772709239813 .node rect,#mermaid-hfoyei46iy8-1772709239813 .node circle,#mermaid-hfoyei46iy8-1772709239813 .node ellipse,#mermaid-hfoyei46iy8-1772709239813 .node polygon,#mermaid-hfoyei46iy8-1772709239813 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-hfoyei46iy8-1772709239813 .rough-node .label text,#mermaid-hfoyei46iy8-1772709239813 .node .label text,#mermaid-hfoyei46iy8-1772709239813 .image-shape .label,#mermaid-hfoyei46iy8-1772709239813 .icon-shape .label{text-anchor:middle;}#mermaid-hfoyei46iy8-1772709239813 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-hfoyei46iy8-1772709239813 .rough-node .label,#mermaid-hfoyei46iy8-1772709239813 .node .label,#mermaid-hfoyei46iy8-1772709239813 .image-shape .label,#mermaid-hfoyei46iy8-1772709239813 .icon-shape .label{text-align:center;}#mermaid-hfoyei46iy8-1772709239813 .node.clickable{cursor:pointer;}#mermaid-hfoyei46iy8-1772709239813 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-hfoyei46iy8-1772709239813 .arrowheadPath{fill:#0b0b0b;}#mermaid-hfoyei46iy8-1772709239813 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-hfoyei46iy8-1772709239813 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-hfoyei46iy8-1772709239813 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-hfoyei46iy8-1772709239813 .edgeLabel p{background-color:#0a0a0a;}#mermaid-hfoyei46iy8-1772709239813 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-hfoyei46iy8-1772709239813 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-hfoyei46iy8-1772709239813 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-hfoyei46iy8-1772709239813 .cluster text{fill:#fafafa;}#mermaid-hfoyei46iy8-1772709239813 .cluster span{color:#fafafa;}#mermaid-hfoyei46iy8-1772709239813 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-hfoyei46iy8-1772709239813 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-hfoyei46iy8-1772709239813 rect.text{fill:none;stroke-width:0;}#mermaid-hfoyei46iy8-1772709239813 .icon-shape,#mermaid-hfoyei46iy8-1772709239813 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-hfoyei46iy8-1772709239813 .icon-shape p,#mermaid-hfoyei46iy8-1772709239813 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-hfoyei46iy8-1772709239813 .icon-shape rect,#mermaid-hfoyei46iy8-1772709239813 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-hfoyei46iy8-1772709239813 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-hfoyei46iy8-1772709239813 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-hfoyei46iy8-1772709239813 :root{--mermaid-font-family:inherit;}#mermaid-hfoyei46iy8-1772709239813 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-hfoyei46iy8-1772709239813 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-hfoyei46iy8-1772709239813 .red tspan{fill:#000!important;}#mermaid-hfoyei46iy8-1772709239813 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-hfoyei46iy8-1772709239813 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-hfoyei46iy8-1772709239813 .orange tspan{fill:#000!important;}#mermaid-hfoyei46iy8-1772709239813 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-hfoyei46iy8-1772709239813 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-hfoyei46iy8-1772709239813 .primary tspan{fill:#000!important;}

Root Servers  
.

.com TLD

.org TLD

.io TLD

google.com

wikipedia.org

github.io

When you look up , the query flows from your browser through multiple servers:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Authoritative (google.com)TLD Server (.com)Root Server (.)Resolver (ISP or 8.8.8.8)Your BrowserAuthoritative (google.com)TLD Server (.com)Root Server (.)Resolver (ISP or 8.8.8.8)Your Browser#mermaid-ed3iaw5yap-1772709239814{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-ed3iaw5yap-1772709239814 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-ed3iaw5yap-1772709239814 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-ed3iaw5yap-1772709239814 .error-icon{fill:#000000;}#mermaid-ed3iaw5yap-1772709239814 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-ed3iaw5yap-1772709239814 .edge-thickness-normal{stroke-width:1px;}#mermaid-ed3iaw5yap-1772709239814 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-ed3iaw5yap-1772709239814 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-ed3iaw5yap-1772709239814 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-ed3iaw5yap-1772709239814 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-ed3iaw5yap-1772709239814 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-ed3iaw5yap-1772709239814 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-ed3iaw5yap-1772709239814 .marker.cross{stroke:#22c55e;}#mermaid-ed3iaw5yap-1772709239814 svg{font-family:inherit;font-size:16px;}#mermaid-ed3iaw5yap-1772709239814 p{margin:0;}#mermaid-ed3iaw5yap-1772709239814 .actor{stroke:#22c55e;fill:transparent;}#mermaid-ed3iaw5yap-1772709239814 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-ed3iaw5yap-1772709239814 .actor-line{stroke:#22c55e;}#mermaid-ed3iaw5yap-1772709239814 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-ed3iaw5yap-1772709239814 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-ed3iaw5yap-1772709239814 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-ed3iaw5yap-1772709239814 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-ed3iaw5yap-1772709239814 .sequenceNumber{fill:#f0fdf4;}#mermaid-ed3iaw5yap-1772709239814 #sequencenumber{fill:#fafafa;}#mermaid-ed3iaw5yap-1772709239814 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-ed3iaw5yap-1772709239814 .messageText{fill:#fafafa;stroke:none;}#mermaid-ed3iaw5yap-1772709239814 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-ed3iaw5yap-1772709239814 .labelText,#mermaid-ed3iaw5yap-1772709239814 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-ed3iaw5yap-1772709239814 .loopText,#mermaid-ed3iaw5yap-1772709239814 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-ed3iaw5yap-1772709239814 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-ed3iaw5yap-1772709239814 .note{stroke:#f59e0b;fill:#422006;}#mermaid-ed3iaw5yap-1772709239814 .noteText,#mermaid-ed3iaw5yap-1772709239814 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-ed3iaw5yap-1772709239814 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-ed3iaw5yap-1772709239814 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-ed3iaw5yap-1772709239814 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-ed3iaw5yap-1772709239814 .actorPopupMenu{position:absolute;}#mermaid-ed3iaw5yap-1772709239814 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-ed3iaw5yap-1772709239814 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-ed3iaw5yap-1772709239814 .actor-man circle,#mermaid-ed3iaw5yap-1772709239814 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-ed3iaw5yap-1772709239814 :root{--mermaid-font-family:inherit;}Check cache firstCache this for next timeWhere is www.google.com?Who handles .com?Here are the .com TLD serversWho handles google.com?Here are google.com's nameserversWhat is www.google.com's IP?142.250.80.46142.250.80.46

This looks slow, but caching makes it fast. Most queries hit a cache at some level and return immediately. A full recursive lookup only happens when no cached answer exists.

### 5.2 DNS Record Types

Record

Purpose

Example

A

Domain to IPv4

google.com -> 142.250.80.46

AAAA

Domain to IPv6

google.com -> 2607:f8b0:4004:800::200e

CNAME

Alias to another domain

[www.google.com](http://www.google.com) -> google.com

MX

Mail server

google.com -> smtp.google.com

TXT

Arbitrary text

SPF, DKIM, verification

NS

Nameserver for domain

google.com -> ns1.google.com

SOA

Start of authority

Zone configuration

SRV

Service location

\_http.\_tcp.example.com

### 5.3 DNS Caching

Without caching, the internet would collapse. Every click would trigger multiple round trips across the globe. Caching makes DNS fast, but it also creates interesting trade-offs.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-m24kxrykuw9-1772709239815{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-m24kxrykuw9-1772709239815 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-m24kxrykuw9-1772709239815 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-m24kxrykuw9-1772709239815 .error-icon{fill:#000000;}#mermaid-m24kxrykuw9-1772709239815 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-m24kxrykuw9-1772709239815 .edge-thickness-normal{stroke-width:1px;}#mermaid-m24kxrykuw9-1772709239815 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-m24kxrykuw9-1772709239815 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-m24kxrykuw9-1772709239815 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-m24kxrykuw9-1772709239815 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-m24kxrykuw9-1772709239815 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-m24kxrykuw9-1772709239815 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-m24kxrykuw9-1772709239815 .marker.cross{stroke:#22c55e;}#mermaid-m24kxrykuw9-1772709239815 svg{font-family:inherit;font-size:16px;}#mermaid-m24kxrykuw9-1772709239815 p{margin:0;}#mermaid-m24kxrykuw9-1772709239815 .label{font-family:inherit;color:#f0fdf4;}#mermaid-m24kxrykuw9-1772709239815 .cluster-label text{fill:#fafafa;}#mermaid-m24kxrykuw9-1772709239815 .cluster-label span{color:#fafafa;}#mermaid-m24kxrykuw9-1772709239815 .cluster-label span p{background-color:transparent;}#mermaid-m24kxrykuw9-1772709239815 .label text,#mermaid-m24kxrykuw9-1772709239815 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-m24kxrykuw9-1772709239815 .node rect,#mermaid-m24kxrykuw9-1772709239815 .node circle,#mermaid-m24kxrykuw9-1772709239815 .node ellipse,#mermaid-m24kxrykuw9-1772709239815 .node polygon,#mermaid-m24kxrykuw9-1772709239815 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-m24kxrykuw9-1772709239815 .rough-node .label text,#mermaid-m24kxrykuw9-1772709239815 .node .label text,#mermaid-m24kxrykuw9-1772709239815 .image-shape .label,#mermaid-m24kxrykuw9-1772709239815 .icon-shape .label{text-anchor:middle;}#mermaid-m24kxrykuw9-1772709239815 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-m24kxrykuw9-1772709239815 .rough-node .label,#mermaid-m24kxrykuw9-1772709239815 .node .label,#mermaid-m24kxrykuw9-1772709239815 .image-shape .label,#mermaid-m24kxrykuw9-1772709239815 .icon-shape .label{text-align:center;}#mermaid-m24kxrykuw9-1772709239815 .node.clickable{cursor:pointer;}#mermaid-m24kxrykuw9-1772709239815 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-m24kxrykuw9-1772709239815 .arrowheadPath{fill:#0b0b0b;}#mermaid-m24kxrykuw9-1772709239815 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-m24kxrykuw9-1772709239815 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-m24kxrykuw9-1772709239815 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-m24kxrykuw9-1772709239815 .edgeLabel p{background-color:#0a0a0a;}#mermaid-m24kxrykuw9-1772709239815 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-m24kxrykuw9-1772709239815 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-m24kxrykuw9-1772709239815 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-m24kxrykuw9-1772709239815 .cluster text{fill:#fafafa;}#mermaid-m24kxrykuw9-1772709239815 .cluster span{color:#fafafa;}#mermaid-m24kxrykuw9-1772709239815 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-m24kxrykuw9-1772709239815 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-m24kxrykuw9-1772709239815 rect.text{fill:none;stroke-width:0;}#mermaid-m24kxrykuw9-1772709239815 .icon-shape,#mermaid-m24kxrykuw9-1772709239815 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-m24kxrykuw9-1772709239815 .icon-shape p,#mermaid-m24kxrykuw9-1772709239815 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-m24kxrykuw9-1772709239815 .icon-shape rect,#mermaid-m24kxrykuw9-1772709239815 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-m24kxrykuw9-1772709239815 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-m24kxrykuw9-1772709239815 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-m24kxrykuw9-1772709239815 :root{--mermaid-font-family:inherit;}#mermaid-m24kxrykuw9-1772709239815 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-m24kxrykuw9-1772709239815 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-m24kxrykuw9-1772709239815 .primary tspan{fill:#000!important;}#mermaid-m24kxrykuw9-1772709239815 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-m24kxrykuw9-1772709239815 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-m24kxrykuw9-1772709239815 .orange tspan{fill:#000!important;}#mermaid-m24kxrykuw9-1772709239815 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-m24kxrykuw9-1772709239815 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-m24kxrykuw9-1772709239815 .green tspan{fill:#000!important;}#mermaid-m24kxrykuw9-1772709239815 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-m24kxrykuw9-1772709239815 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-m24kxrykuw9-1772709239815 .purple tspan{fill:#000!important;}

DNS Cache Hierarchy

Browser Cache  
Minutes

OS Cache  
Minutes to Hours

Resolver Cache  
Hours to Days

Authoritative Server

#### **The TTL Dilemma**

Every DNS record has a TTL (Time To Live) that controls how long it can be cached. Choosing the right TTL is a trade-off:

TTL

Propagation Time

DNS Load

Use Case

60 seconds

~1 minute

High

Active failover, blue-green deploys

300 seconds

~5 minutes

Medium

Most production services

3600 seconds

~1 hour

Low

Stable services

86400 seconds

~1 day

Minimal

Static assets, rarely-changing configs

**The catch:** Caches do not always respect TTL. Some ISPs cache longer than they should. Corporate proxies add their own caching. When you change a DNS record, some users will see the old IP for longer than you expect. Plan for this during migrations.

### 5.4 DNS in System Design

DNS is more than name resolution. It is a tool for traffic management.

#### **Round-Robin Load Balancing**

Return multiple A records and let clients pick one:

```shell
1api.example.com.  60  IN  A  10.0.0.1
2api.example.com.  60  IN  A  10.0.0.2
3api.example.com.  60  IN  A  10.0.0.3
```

This spreads traffic across servers, but with significant limitations:

*   **No health checks:** DNS keeps returning dead servers
*   **Caching undermines distribution:** A cached response sends all requests to one server
*   **No session awareness:** The same user might hit different servers on each request

For these reasons, DNS load balancing is usually a first layer, with a real load balancer behind it.

#### **Geographic Routing**

DNS can route users to the nearest data center based on the source IP of their DNS resolver.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-r5i55fxv54j-1772709239815{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-r5i55fxv54j-1772709239815 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-r5i55fxv54j-1772709239815 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-r5i55fxv54j-1772709239815 .error-icon{fill:#000000;}#mermaid-r5i55fxv54j-1772709239815 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-r5i55fxv54j-1772709239815 .edge-thickness-normal{stroke-width:1px;}#mermaid-r5i55fxv54j-1772709239815 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-r5i55fxv54j-1772709239815 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-r5i55fxv54j-1772709239815 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-r5i55fxv54j-1772709239815 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-r5i55fxv54j-1772709239815 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-r5i55fxv54j-1772709239815 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-r5i55fxv54j-1772709239815 .marker.cross{stroke:#22c55e;}#mermaid-r5i55fxv54j-1772709239815 svg{font-family:inherit;font-size:16px;}#mermaid-r5i55fxv54j-1772709239815 p{margin:0;}#mermaid-r5i55fxv54j-1772709239815 .label{font-family:inherit;color:#f0fdf4;}#mermaid-r5i55fxv54j-1772709239815 .cluster-label text{fill:#fafafa;}#mermaid-r5i55fxv54j-1772709239815 .cluster-label span{color:#fafafa;}#mermaid-r5i55fxv54j-1772709239815 .cluster-label span p{background-color:transparent;}#mermaid-r5i55fxv54j-1772709239815 .label text,#mermaid-r5i55fxv54j-1772709239815 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-r5i55fxv54j-1772709239815 .node rect,#mermaid-r5i55fxv54j-1772709239815 .node circle,#mermaid-r5i55fxv54j-1772709239815 .node ellipse,#mermaid-r5i55fxv54j-1772709239815 .node polygon,#mermaid-r5i55fxv54j-1772709239815 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-r5i55fxv54j-1772709239815 .rough-node .label text,#mermaid-r5i55fxv54j-1772709239815 .node .label text,#mermaid-r5i55fxv54j-1772709239815 .image-shape .label,#mermaid-r5i55fxv54j-1772709239815 .icon-shape .label{text-anchor:middle;}#mermaid-r5i55fxv54j-1772709239815 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-r5i55fxv54j-1772709239815 .rough-node .label,#mermaid-r5i55fxv54j-1772709239815 .node .label,#mermaid-r5i55fxv54j-1772709239815 .image-shape .label,#mermaid-r5i55fxv54j-1772709239815 .icon-shape .label{text-align:center;}#mermaid-r5i55fxv54j-1772709239815 .node.clickable{cursor:pointer;}#mermaid-r5i55fxv54j-1772709239815 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-r5i55fxv54j-1772709239815 .arrowheadPath{fill:#0b0b0b;}#mermaid-r5i55fxv54j-1772709239815 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-r5i55fxv54j-1772709239815 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-r5i55fxv54j-1772709239815 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-r5i55fxv54j-1772709239815 .edgeLabel p{background-color:#0a0a0a;}#mermaid-r5i55fxv54j-1772709239815 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-r5i55fxv54j-1772709239815 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-r5i55fxv54j-1772709239815 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-r5i55fxv54j-1772709239815 .cluster text{fill:#fafafa;}#mermaid-r5i55fxv54j-1772709239815 .cluster span{color:#fafafa;}#mermaid-r5i55fxv54j-1772709239815 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-r5i55fxv54j-1772709239815 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-r5i55fxv54j-1772709239815 rect.text{fill:none;stroke-width:0;}#mermaid-r5i55fxv54j-1772709239815 .icon-shape,#mermaid-r5i55fxv54j-1772709239815 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-r5i55fxv54j-1772709239815 .icon-shape p,#mermaid-r5i55fxv54j-1772709239815 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-r5i55fxv54j-1772709239815 .icon-shape rect,#mermaid-r5i55fxv54j-1772709239815 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-r5i55fxv54j-1772709239815 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-r5i55fxv54j-1772709239815 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-r5i55fxv54j-1772709239815 :root{--mermaid-font-family:inherit;}#mermaid-r5i55fxv54j-1772709239815 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-r5i55fxv54j-1772709239815 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-r5i55fxv54j-1772709239815 .primary tspan{fill:#000!important;}#mermaid-r5i55fxv54j-1772709239815 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-r5i55fxv54j-1772709239815 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-r5i55fxv54j-1772709239815 .orange tspan{fill:#000!important;}#mermaid-r5i55fxv54j-1772709239815 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-r5i55fxv54j-1772709239815 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-r5i55fxv54j-1772709239815 .green tspan{fill:#000!important;}

US User

GeoDNS

EU User

Asia User

US Server  
us.api.example.com

EU Server  
eu.api.example.com

Asia Server  
asia.api.example.com

#### **Service discovery**

SRV records let you discover not just the IP but also the port and priority of a service:

```shell
1_mongodb._tcp.example.com.  60  IN  SRV  0 5 27017 mongo1.example.com.
2_mongodb._tcp.example.com.  60  IN  SRV  0 5 27017 mongo2.example.com.
```

Kubernetes and service meshes often use DNS for internal service discovery, though they may use specialized resolvers like CoreDNS rather than public DNS.

# 6\. HTTP/HTTPS Protocol

HTTP is how the web talks. Every API call, every page load, every image download uses HTTP. It is a simple request-response protocol built on top of TCP, and understanding its details helps you design better APIs and debug production issues.

### 6.1 HTTP Request/Response

An HTTP transaction is simple: the client sends a request, the server sends a response.

```shell
1GET /api/users/123 HTTP/1.1
2Host: api.example.com
3Authorization: Bearer eyJhbGc...
4Accept: application/json
```

```shell
1HTTP/1.1 200 OK
2Content-Type: application/json
3Cache-Control: max-age=3600
4Content-Length: 156
5
6{"id": 123, "name": "John", "email": "john@example.com"}
```

**Request components:**

Component

Purpose

Example

Method

Action to perform

GET, POST, PUT, DELETE

Path

Resource identifier

/api/users/123

Headers

Metadata

Authorization, Content-Type

Body

Data payload

JSON, form data

**Response components:**

Component

Purpose

Example

Status Code

Result indicator

200, 404, 500

Headers

Metadata

Content-Type, Cache-Control

Body

Response data

JSON, HTML

### 6.2 HTTP Methods

HTTP methods have semantic meaning. Using them correctly makes your API predictable.

Method

Purpose

Idempotent

Safe

Request Body

GET

Retrieve resource

Yes

Yes

No

POST

Create resource

No

No

Yes

PUT

Replace resource entirely

Yes

No

Yes

PATCH

Partial update

No

No

Yes

DELETE

Remove resource

Yes

No

Optional

HEAD

Get headers only

Yes

Yes

No

OPTIONS

Get allowed methods

Yes

Yes

No

**Idempotent** means you can retry safely. Sending the same PUT request twice leaves the resource in the same state. This matters for reliability, if the network drops and you are not sure if the request succeeded, you can retry an idempotent request without fear.

**Safe** means no side effects. GET requests should never modify data. This lets proxies cache them and lets browsers retry them automatically.

#### **Common mistakes:**

*   Using GET for actions that modify data (breaks caching, causes accidental repeats)
*   Using POST for everything (loses idempotency guarantees)
*   Treating PATCH as idempotent (it is not, by default)

### 6.3 HTTP Status Codes

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-o3xln6fj9ob-1772709239817{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-o3xln6fj9ob-1772709239817 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-o3xln6fj9ob-1772709239817 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-o3xln6fj9ob-1772709239817 .error-icon{fill:#000000;}#mermaid-o3xln6fj9ob-1772709239817 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-o3xln6fj9ob-1772709239817 .edge-thickness-normal{stroke-width:1px;}#mermaid-o3xln6fj9ob-1772709239817 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-o3xln6fj9ob-1772709239817 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-o3xln6fj9ob-1772709239817 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-o3xln6fj9ob-1772709239817 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-o3xln6fj9ob-1772709239817 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-o3xln6fj9ob-1772709239817 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-o3xln6fj9ob-1772709239817 .marker.cross{stroke:#22c55e;}#mermaid-o3xln6fj9ob-1772709239817 svg{font-family:inherit;font-size:16px;}#mermaid-o3xln6fj9ob-1772709239817 p{margin:0;}#mermaid-o3xln6fj9ob-1772709239817 .label{font-family:inherit;color:#f0fdf4;}#mermaid-o3xln6fj9ob-1772709239817 .cluster-label text{fill:#fafafa;}#mermaid-o3xln6fj9ob-1772709239817 .cluster-label span{color:#fafafa;}#mermaid-o3xln6fj9ob-1772709239817 .cluster-label span p{background-color:transparent;}#mermaid-o3xln6fj9ob-1772709239817 .label text,#mermaid-o3xln6fj9ob-1772709239817 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-o3xln6fj9ob-1772709239817 .node rect,#mermaid-o3xln6fj9ob-1772709239817 .node circle,#mermaid-o3xln6fj9ob-1772709239817 .node ellipse,#mermaid-o3xln6fj9ob-1772709239817 .node polygon,#mermaid-o3xln6fj9ob-1772709239817 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-o3xln6fj9ob-1772709239817 .rough-node .label text,#mermaid-o3xln6fj9ob-1772709239817 .node .label text,#mermaid-o3xln6fj9ob-1772709239817 .image-shape .label,#mermaid-o3xln6fj9ob-1772709239817 .icon-shape .label{text-anchor:middle;}#mermaid-o3xln6fj9ob-1772709239817 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-o3xln6fj9ob-1772709239817 .rough-node .label,#mermaid-o3xln6fj9ob-1772709239817 .node .label,#mermaid-o3xln6fj9ob-1772709239817 .image-shape .label,#mermaid-o3xln6fj9ob-1772709239817 .icon-shape .label{text-align:center;}#mermaid-o3xln6fj9ob-1772709239817 .node.clickable{cursor:pointer;}#mermaid-o3xln6fj9ob-1772709239817 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-o3xln6fj9ob-1772709239817 .arrowheadPath{fill:#0b0b0b;}#mermaid-o3xln6fj9ob-1772709239817 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-o3xln6fj9ob-1772709239817 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-o3xln6fj9ob-1772709239817 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-o3xln6fj9ob-1772709239817 .edgeLabel p{background-color:#0a0a0a;}#mermaid-o3xln6fj9ob-1772709239817 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-o3xln6fj9ob-1772709239817 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-o3xln6fj9ob-1772709239817 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-o3xln6fj9ob-1772709239817 .cluster text{fill:#fafafa;}#mermaid-o3xln6fj9ob-1772709239817 .cluster span{color:#fafafa;}#mermaid-o3xln6fj9ob-1772709239817 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-o3xln6fj9ob-1772709239817 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-o3xln6fj9ob-1772709239817 rect.text{fill:none;stroke-width:0;}#mermaid-o3xln6fj9ob-1772709239817 .icon-shape,#mermaid-o3xln6fj9ob-1772709239817 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-o3xln6fj9ob-1772709239817 .icon-shape p,#mermaid-o3xln6fj9ob-1772709239817 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-o3xln6fj9ob-1772709239817 .icon-shape rect,#mermaid-o3xln6fj9ob-1772709239817 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-o3xln6fj9ob-1772709239817 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-o3xln6fj9ob-1772709239817 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-o3xln6fj9ob-1772709239817 :root{--mermaid-font-family:inherit;}#mermaid-o3xln6fj9ob-1772709239817 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-o3xln6fj9ob-1772709239817 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-o3xln6fj9ob-1772709239817 .primary tspan{fill:#000!important;}#mermaid-o3xln6fj9ob-1772709239817 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-o3xln6fj9ob-1772709239817 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-o3xln6fj9ob-1772709239817 .green tspan{fill:#000!important;}#mermaid-o3xln6fj9ob-1772709239817 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-o3xln6fj9ob-1772709239817 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-o3xln6fj9ob-1772709239817 .orange tspan{fill:#000!important;}#mermaid-o3xln6fj9ob-1772709239817 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-o3xln6fj9ob-1772709239817 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-o3xln6fj9ob-1772709239817 .red tspan{fill:#000!important;}#mermaid-o3xln6fj9ob-1772709239817 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-o3xln6fj9ob-1772709239817 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-o3xln6fj9ob-1772709239817 .purple tspan{fill:#000!important;}

HTTP Status Codes

1xx Informational

2xx Success

3xx Redirection

4xx Client Error

5xx Server Error

**Common status codes:**

Code

Meaning

When to Use

200

OK

Successful GET, PUT

201

Created

Successful POST

204

No Content

Successful DELETE

301

Moved Permanently

URL changed permanently

302

Found

Temporary redirect

304

Not Modified

Cached version valid

400

Bad Request

Invalid input

401

Unauthorized

Missing/invalid auth

403

Forbidden

Valid auth, no permission

404

Not Found

Resource does not exist

429

Too Many Requests

Rate limited

500

Internal Server Error

Server bug

502

Bad Gateway

Upstream server error

503

Service Unavailable

Server overloaded

504

Gateway Timeout

Upstream timeout

### 6.4 HTTP/1.1 vs HTTP/2 vs HTTP/3

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-mitapty7oz-1772709239818{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-mitapty7oz-1772709239818 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-mitapty7oz-1772709239818 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-mitapty7oz-1772709239818 .error-icon{fill:#000000;}#mermaid-mitapty7oz-1772709239818 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-mitapty7oz-1772709239818 .edge-thickness-normal{stroke-width:1px;}#mermaid-mitapty7oz-1772709239818 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-mitapty7oz-1772709239818 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-mitapty7oz-1772709239818 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-mitapty7oz-1772709239818 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-mitapty7oz-1772709239818 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-mitapty7oz-1772709239818 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-mitapty7oz-1772709239818 .marker.cross{stroke:#22c55e;}#mermaid-mitapty7oz-1772709239818 svg{font-family:inherit;font-size:16px;}#mermaid-mitapty7oz-1772709239818 p{margin:0;}#mermaid-mitapty7oz-1772709239818 .label{font-family:inherit;color:#f0fdf4;}#mermaid-mitapty7oz-1772709239818 .cluster-label text{fill:#fafafa;}#mermaid-mitapty7oz-1772709239818 .cluster-label span{color:#fafafa;}#mermaid-mitapty7oz-1772709239818 .cluster-label span p{background-color:transparent;}#mermaid-mitapty7oz-1772709239818 .label text,#mermaid-mitapty7oz-1772709239818 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-mitapty7oz-1772709239818 .node rect,#mermaid-mitapty7oz-1772709239818 .node circle,#mermaid-mitapty7oz-1772709239818 .node ellipse,#mermaid-mitapty7oz-1772709239818 .node polygon,#mermaid-mitapty7oz-1772709239818 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-mitapty7oz-1772709239818 .rough-node .label text,#mermaid-mitapty7oz-1772709239818 .node .label text,#mermaid-mitapty7oz-1772709239818 .image-shape .label,#mermaid-mitapty7oz-1772709239818 .icon-shape .label{text-anchor:middle;}#mermaid-mitapty7oz-1772709239818 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-mitapty7oz-1772709239818 .rough-node .label,#mermaid-mitapty7oz-1772709239818 .node .label,#mermaid-mitapty7oz-1772709239818 .image-shape .label,#mermaid-mitapty7oz-1772709239818 .icon-shape .label{text-align:center;}#mermaid-mitapty7oz-1772709239818 .node.clickable{cursor:pointer;}#mermaid-mitapty7oz-1772709239818 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-mitapty7oz-1772709239818 .arrowheadPath{fill:#0b0b0b;}#mermaid-mitapty7oz-1772709239818 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-mitapty7oz-1772709239818 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-mitapty7oz-1772709239818 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-mitapty7oz-1772709239818 .edgeLabel p{background-color:#0a0a0a;}#mermaid-mitapty7oz-1772709239818 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-mitapty7oz-1772709239818 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-mitapty7oz-1772709239818 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-mitapty7oz-1772709239818 .cluster text{fill:#fafafa;}#mermaid-mitapty7oz-1772709239818 .cluster span{color:#fafafa;}#mermaid-mitapty7oz-1772709239818 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-mitapty7oz-1772709239818 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-mitapty7oz-1772709239818 rect.text{fill:none;stroke-width:0;}#mermaid-mitapty7oz-1772709239818 .icon-shape,#mermaid-mitapty7oz-1772709239818 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-mitapty7oz-1772709239818 .icon-shape p,#mermaid-mitapty7oz-1772709239818 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-mitapty7oz-1772709239818 .icon-shape rect,#mermaid-mitapty7oz-1772709239818 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-mitapty7oz-1772709239818 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-mitapty7oz-1772709239818 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-mitapty7oz-1772709239818 :root{--mermaid-font-family:inherit;}#mermaid-mitapty7oz-1772709239818 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-mitapty7oz-1772709239818 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-mitapty7oz-1772709239818 .orange tspan{fill:#000!important;}#mermaid-mitapty7oz-1772709239818 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-mitapty7oz-1772709239818 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-mitapty7oz-1772709239818 .green tspan{fill:#000!important;}#mermaid-mitapty7oz-1772709239818 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-mitapty7oz-1772709239818 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-mitapty7oz-1772709239818 .primary tspan{fill:#000!important;}

HTTP/3

Built on QUIC/UDP

No head-of-line blocking

Faster connection setup

Better mobile performance

HTTP/2

Multiplexed streams

Binary framing

Header compression

Server push

HTTP/1.1

Sequential requests

Text headers

6 connections per domain

#### **HTTP/1.1: The Problem**

In HTTP/1.1, each connection handles one request at a time. If you need 10 resources, you either wait for them sequentially or open multiple connections. Browsers limit themselves to 6 connections per domain, so you can fetch 6 resources in parallel at most. Developers worked around this with domain sharding (spreading assets across cdn1.example.com, cdn2.example.com, etc.).

#### **HTTP/2: Multiplexing**

HTTP/2 allows multiple requests on a single connection. All those requests interleave as "streams." No more connection limits, no more domain sharding. The protocol is binary rather than text, enabling better compression and parsing.

But HTTP/2 has a subtle problem: it runs on TCP. If a single TCP packet is lost, all streams are blocked until retransmission, even streams whose data arrived fine. This is TCP-level head-of-line blocking.

#### **HTTP/3: QUIC to the Rescue**

HTTP/3 uses QUIC instead of TCP. QUIC implements its own reliability per-stream, so a lost packet only blocks its own stream. Other streams continue flowing. QUIC also enables 0-RTT resumption, meaning repeat visitors can send data immediately without waiting for a handshake.

Feature

HTTP/1.1

HTTP/2

HTTP/3

Transport

TCP

TCP

QUIC (UDP)

Multiplexing

No

Yes

Yes

Header compression

No

HPACK

QPACK

Server push

No

Yes

Yes

Head-of-line blocking

Yes

Partial

No

### 6.5 HTTP Caching

Caching is the most effective way to improve performance. A request that never reaches your server is infinitely fast.

#### **Cache-Control headers**

The `Cache-Control` header tells browsers and CDNs what to cache and for how long:

```shell
1Cache-Control: public, max-age=3600
2Cache-Control: private, no-cache
3Cache-Control: no-store
```

Directive

What It Means

public

CDNs and proxies can cache

private

Only the user's browser can cache

max-age=N

Fresh for N seconds

no-cache

Must check with server before using

no-store

Never write to disk (PII, tokens)

immutable

Will never change, cache forever

#### **Conditional Requests: Efficient Revalidation**

When a cached response expires, the browser can ask "has this changed?" rather than re-downloading everything:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

ServerBrowserServerBrowser#mermaid-694a2aea9f4909e6a17df2b3-1772709239819{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .error-icon{fill:#000000;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .edge-thickness-normal{stroke-width:1px;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .marker.cross{stroke:#22c55e;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 svg{font-family:inherit;font-size:16px;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 p{margin:0;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .actor{stroke:#22c55e;fill:transparent;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .actor-line{stroke:#22c55e;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .sequenceNumber{fill:#f0fdf4;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 #sequencenumber{fill:#fafafa;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .messageText{fill:#fafafa;stroke:none;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .labelText,#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .loopText,#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .note{stroke:#f59e0b;fill:#422006;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .noteText,#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .actorPopupMenu{position:absolute;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 .actor-man circle,#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-694a2aea9f4909e6a17df2b3-1772709239819 :root{--mermaid-font-family:inherit;}Browser caches responseLater, cache expired...Use cached versionEven later, content changed...GET /data200 OK, ETag: "v123"GET /data, If-None-Match: "v123"304 Not ModifiedGET /data, If-None-Match: "v123"200 OK, ETag: "v456", new content

```shell
1# First request
2GET /api/data HTTP/1.1
3
4# Response
5HTTP/1.1 200 OK
6ETag: "abc123"
7Last-Modified: Tue, 15 Nov 2024 12:45:26 GMT
8
9# Subsequent request
10GET /api/data HTTP/1.1
11If-None-Match: "abc123"
12If-Modified-Since: Tue, 15 Nov 2024 12:45:26 GMT
13
14# Response if unchanged
15HTTP/1.1 304 Not Modified
```

# 7\. TLS/SSL and Security

HTTPS is HTTP with encryption. Without TLS, anyone on the network path, your ISP, a coffee shop router, a compromised backbone router, can read your traffic. With TLS, they see encrypted bytes.

TLS provides three things:

1.  **Encryption:** Data cannot be read in transit
2.  **Authentication:** You are talking to who you think you are
3.  **Integrity:** Data cannot be modified without detection

### 7.1 TLS Handshake

Before encrypted communication begins, client and server must agree on encryption keys. This is the TLS handshake.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

ServerClientServerClient#mermaid-j17qqnc21l-1772709239820{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-j17qqnc21l-1772709239820 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-j17qqnc21l-1772709239820 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-j17qqnc21l-1772709239820 .error-icon{fill:#000000;}#mermaid-j17qqnc21l-1772709239820 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-j17qqnc21l-1772709239820 .edge-thickness-normal{stroke-width:1px;}#mermaid-j17qqnc21l-1772709239820 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-j17qqnc21l-1772709239820 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-j17qqnc21l-1772709239820 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-j17qqnc21l-1772709239820 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-j17qqnc21l-1772709239820 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-j17qqnc21l-1772709239820 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-j17qqnc21l-1772709239820 .marker.cross{stroke:#22c55e;}#mermaid-j17qqnc21l-1772709239820 svg{font-family:inherit;font-size:16px;}#mermaid-j17qqnc21l-1772709239820 p{margin:0;}#mermaid-j17qqnc21l-1772709239820 .actor{stroke:#22c55e;fill:transparent;}#mermaid-j17qqnc21l-1772709239820 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-j17qqnc21l-1772709239820 .actor-line{stroke:#22c55e;}#mermaid-j17qqnc21l-1772709239820 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-j17qqnc21l-1772709239820 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-j17qqnc21l-1772709239820 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-j17qqnc21l-1772709239820 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-j17qqnc21l-1772709239820 .sequenceNumber{fill:#f0fdf4;}#mermaid-j17qqnc21l-1772709239820 #sequencenumber{fill:#fafafa;}#mermaid-j17qqnc21l-1772709239820 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-j17qqnc21l-1772709239820 .messageText{fill:#fafafa;stroke:none;}#mermaid-j17qqnc21l-1772709239820 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-j17qqnc21l-1772709239820 .labelText,#mermaid-j17qqnc21l-1772709239820 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-j17qqnc21l-1772709239820 .loopText,#mermaid-j17qqnc21l-1772709239820 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-j17qqnc21l-1772709239820 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-j17qqnc21l-1772709239820 .note{stroke:#f59e0b;fill:#422006;}#mermaid-j17qqnc21l-1772709239820 .noteText,#mermaid-j17qqnc21l-1772709239820 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-j17qqnc21l-1772709239820 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-j17qqnc21l-1772709239820 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-j17qqnc21l-1772709239820 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-j17qqnc21l-1772709239820 .actorPopupMenu{position:absolute;}#mermaid-j17qqnc21l-1772709239820 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-j17qqnc21l-1772709239820 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-j17qqnc21l-1772709239820 .actor-man circle,#mermaid-j17qqnc21l-1772709239820 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-j17qqnc21l-1772709239820 :root{--mermaid-font-family:inherit;}TLS 1.2 Handshake (2 RTT)Encrypted CommunicationClientHello (supported ciphers, random)ServerHello (chosen cipher, random)CertificateServerKeyExchangeServerHelloDoneClientKeyExchangeChangeCipherSpecFinishedChangeCipherSpecFinished

#### **TLS 1.3 improvements**

TLS 1.2 requires two round trips. TLS 1.3 cuts this to one.

TLS 1.3 also removes outdated cipher suites, encrypts more of the handshake (hiding which website you are visiting from observers), and supports 0-RTT resumption for repeat visitors.

### 7.2 Certificate Chain

How do you know you are really talking to google.com and not an attacker? Certificates.

Your browser trusts a set of Certificate Authorities (CAs). When a server presents its certificate, the browser verifies it was signed by a trusted CA.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-2o4868su1cb-1772709239820{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-2o4868su1cb-1772709239820 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-2o4868su1cb-1772709239820 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-2o4868su1cb-1772709239820 .error-icon{fill:#000000;}#mermaid-2o4868su1cb-1772709239820 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-2o4868su1cb-1772709239820 .edge-thickness-normal{stroke-width:1px;}#mermaid-2o4868su1cb-1772709239820 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-2o4868su1cb-1772709239820 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-2o4868su1cb-1772709239820 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-2o4868su1cb-1772709239820 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-2o4868su1cb-1772709239820 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-2o4868su1cb-1772709239820 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-2o4868su1cb-1772709239820 .marker.cross{stroke:#22c55e;}#mermaid-2o4868su1cb-1772709239820 svg{font-family:inherit;font-size:16px;}#mermaid-2o4868su1cb-1772709239820 p{margin:0;}#mermaid-2o4868su1cb-1772709239820 .label{font-family:inherit;color:#f0fdf4;}#mermaid-2o4868su1cb-1772709239820 .cluster-label text{fill:#fafafa;}#mermaid-2o4868su1cb-1772709239820 .cluster-label span{color:#fafafa;}#mermaid-2o4868su1cb-1772709239820 .cluster-label span p{background-color:transparent;}#mermaid-2o4868su1cb-1772709239820 .label text,#mermaid-2o4868su1cb-1772709239820 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-2o4868su1cb-1772709239820 .node rect,#mermaid-2o4868su1cb-1772709239820 .node circle,#mermaid-2o4868su1cb-1772709239820 .node ellipse,#mermaid-2o4868su1cb-1772709239820 .node polygon,#mermaid-2o4868su1cb-1772709239820 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-2o4868su1cb-1772709239820 .rough-node .label text,#mermaid-2o4868su1cb-1772709239820 .node .label text,#mermaid-2o4868su1cb-1772709239820 .image-shape .label,#mermaid-2o4868su1cb-1772709239820 .icon-shape .label{text-anchor:middle;}#mermaid-2o4868su1cb-1772709239820 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-2o4868su1cb-1772709239820 .rough-node .label,#mermaid-2o4868su1cb-1772709239820 .node .label,#mermaid-2o4868su1cb-1772709239820 .image-shape .label,#mermaid-2o4868su1cb-1772709239820 .icon-shape .label{text-align:center;}#mermaid-2o4868su1cb-1772709239820 .node.clickable{cursor:pointer;}#mermaid-2o4868su1cb-1772709239820 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-2o4868su1cb-1772709239820 .arrowheadPath{fill:#0b0b0b;}#mermaid-2o4868su1cb-1772709239820 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-2o4868su1cb-1772709239820 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-2o4868su1cb-1772709239820 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-2o4868su1cb-1772709239820 .edgeLabel p{background-color:#0a0a0a;}#mermaid-2o4868su1cb-1772709239820 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-2o4868su1cb-1772709239820 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-2o4868su1cb-1772709239820 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-2o4868su1cb-1772709239820 .cluster text{fill:#fafafa;}#mermaid-2o4868su1cb-1772709239820 .cluster span{color:#fafafa;}#mermaid-2o4868su1cb-1772709239820 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-2o4868su1cb-1772709239820 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-2o4868su1cb-1772709239820 rect.text{fill:none;stroke-width:0;}#mermaid-2o4868su1cb-1772709239820 .icon-shape,#mermaid-2o4868su1cb-1772709239820 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-2o4868su1cb-1772709239820 .icon-shape p,#mermaid-2o4868su1cb-1772709239820 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-2o4868su1cb-1772709239820 .icon-shape rect,#mermaid-2o4868su1cb-1772709239820 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-2o4868su1cb-1772709239820 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-2o4868su1cb-1772709239820 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-2o4868su1cb-1772709239820 :root{--mermaid-font-family:inherit;}#mermaid-2o4868su1cb-1772709239820 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-2o4868su1cb-1772709239820 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-2o4868su1cb-1772709239820 .red tspan{fill:#000!important;}#mermaid-2o4868su1cb-1772709239820 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-2o4868su1cb-1772709239820 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-2o4868su1cb-1772709239820 .orange tspan{fill:#000!important;}#mermaid-2o4868su1cb-1772709239820 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-2o4868su1cb-1772709239820 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-2o4868su1cb-1772709239820 .primary tspan{fill:#000!important;}#mermaid-2o4868su1cb-1772709239820 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-2o4868su1cb-1772709239820 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-2o4868su1cb-1772709239820 .green tspan{fill:#000!important;}

Signs

Signs

Trusts

Verifies chain

Root CA  
Stored in your browser/OS

Intermediate CA  
Signed by Root

Server Certificate  
example.com, signed by Intermediate

Browser

#### **What the browser checks:**

1.  Certificate chain leads to a trusted root CA
2.  Every signature in the chain is valid
3.  No certificate is expired or revoked
4.  The domain in the certificate matches the requested domain

If any check fails, the browser shows a warning. Never train users to click through these warnings.

### 7.3 TLS Termination Strategies

Where do you decrypt HTTPS traffic? This is a key architectural decision.

Strategy

When to Use

Trade-offs

Edge termination

Most web apps

Simple, but internal traffic is unencrypted

End-to-end TLS

Compliance requirements, zero-trust

Certificate rotation becomes complex

Mutual TLS

Service-to-service auth

Both sides need certificates, adds latency

For most applications, edge termination at the load balancer is sufficient. Your internal network is protected by VPCs and security groups. But for PCI compliance or zero-trust architectures, you may need end-to-end encryption.

### 7.4 HTTPS Best Practices

#### **Use Modern Cipher Suites**

TLS 1.3 simplifies this, it only includes modern ciphers. For TLS 1.2, prefer:

```shell
1TLS_AES_256_GCM_SHA384
2TLS_CHACHA20_POLY1305_SHA256  # Good for mobile (no AES hardware)
3TLS_AES_128_GCM_SHA256
```

Disable anything with "CBC", "3DES", or "RC4".

#### **Security Headers**

These HTTP headers strengthen your security posture:

```shell
1Strict-Transport-Security: max-age=31536000; includeSubDomains
2# "Always use HTTPS, browsers remember for 1 year"
3
4X-Content-Type-Options: nosniff
5# "Don't guess content types, trust the header"
6
7X-Frame-Options: DENY
8# "Don't allow this page in iframes"
9
10Content-Security-Policy: default-src 'self'
11# "Only load resources from our own domain"
```

#### **Automate Certificate Management**

Manual certificate renewal is a recipe for outages at 3 AM on a Saturday. Use:

*   **Let's Encrypt/ACME:** Free, automated certificates
*   **AWS Certificate Manager:** Handles rotation automatically for AWS services
*   **HashiCorp Vault:** For internal PKI and service certificates

# 8\. Network Performance and Latency

Users do not care about your architecture. They care about how fast your app feels. And that "feel" is dominated by latency, the time between clicking and seeing a response.

At scale, network latency often exceeds processing time. Your database query might take 5ms, but the network round trip to the user takes 100ms. Understanding where latency comes from helps you design faster systems.

### 8.1 Latency Components

When you send a packet across the internet, where does the time go?

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-xqw4gwc2rd-1772709239822{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-xqw4gwc2rd-1772709239822 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-xqw4gwc2rd-1772709239822 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-xqw4gwc2rd-1772709239822 .error-icon{fill:#000000;}#mermaid-xqw4gwc2rd-1772709239822 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-xqw4gwc2rd-1772709239822 .edge-thickness-normal{stroke-width:1px;}#mermaid-xqw4gwc2rd-1772709239822 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-xqw4gwc2rd-1772709239822 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-xqw4gwc2rd-1772709239822 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-xqw4gwc2rd-1772709239822 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-xqw4gwc2rd-1772709239822 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-xqw4gwc2rd-1772709239822 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-xqw4gwc2rd-1772709239822 .marker.cross{stroke:#22c55e;}#mermaid-xqw4gwc2rd-1772709239822 svg{font-family:inherit;font-size:16px;}#mermaid-xqw4gwc2rd-1772709239822 p{margin:0;}#mermaid-xqw4gwc2rd-1772709239822 .label{font-family:inherit;color:#f0fdf4;}#mermaid-xqw4gwc2rd-1772709239822 .cluster-label text{fill:#fafafa;}#mermaid-xqw4gwc2rd-1772709239822 .cluster-label span{color:#fafafa;}#mermaid-xqw4gwc2rd-1772709239822 .cluster-label span p{background-color:transparent;}#mermaid-xqw4gwc2rd-1772709239822 .label text,#mermaid-xqw4gwc2rd-1772709239822 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-xqw4gwc2rd-1772709239822 .node rect,#mermaid-xqw4gwc2rd-1772709239822 .node circle,#mermaid-xqw4gwc2rd-1772709239822 .node ellipse,#mermaid-xqw4gwc2rd-1772709239822 .node polygon,#mermaid-xqw4gwc2rd-1772709239822 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-xqw4gwc2rd-1772709239822 .rough-node .label text,#mermaid-xqw4gwc2rd-1772709239822 .node .label text,#mermaid-xqw4gwc2rd-1772709239822 .image-shape .label,#mermaid-xqw4gwc2rd-1772709239822 .icon-shape .label{text-anchor:middle;}#mermaid-xqw4gwc2rd-1772709239822 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-xqw4gwc2rd-1772709239822 .rough-node .label,#mermaid-xqw4gwc2rd-1772709239822 .node .label,#mermaid-xqw4gwc2rd-1772709239822 .image-shape .label,#mermaid-xqw4gwc2rd-1772709239822 .icon-shape .label{text-align:center;}#mermaid-xqw4gwc2rd-1772709239822 .node.clickable{cursor:pointer;}#mermaid-xqw4gwc2rd-1772709239822 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-xqw4gwc2rd-1772709239822 .arrowheadPath{fill:#0b0b0b;}#mermaid-xqw4gwc2rd-1772709239822 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-xqw4gwc2rd-1772709239822 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-xqw4gwc2rd-1772709239822 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-xqw4gwc2rd-1772709239822 .edgeLabel p{background-color:#0a0a0a;}#mermaid-xqw4gwc2rd-1772709239822 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-xqw4gwc2rd-1772709239822 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-xqw4gwc2rd-1772709239822 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-xqw4gwc2rd-1772709239822 .cluster text{fill:#fafafa;}#mermaid-xqw4gwc2rd-1772709239822 .cluster span{color:#fafafa;}#mermaid-xqw4gwc2rd-1772709239822 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-xqw4gwc2rd-1772709239822 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-xqw4gwc2rd-1772709239822 rect.text{fill:none;stroke-width:0;}#mermaid-xqw4gwc2rd-1772709239822 .icon-shape,#mermaid-xqw4gwc2rd-1772709239822 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-xqw4gwc2rd-1772709239822 .icon-shape p,#mermaid-xqw4gwc2rd-1772709239822 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-xqw4gwc2rd-1772709239822 .icon-shape rect,#mermaid-xqw4gwc2rd-1772709239822 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-xqw4gwc2rd-1772709239822 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-xqw4gwc2rd-1772709239822 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-xqw4gwc2rd-1772709239822 :root{--mermaid-font-family:inherit;}#mermaid-xqw4gwc2rd-1772709239822 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-xqw4gwc2rd-1772709239822 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-xqw4gwc2rd-1772709239822 .primary tspan{fill:#000!important;}#mermaid-xqw4gwc2rd-1772709239822 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-xqw4gwc2rd-1772709239822 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-xqw4gwc2rd-1772709239822 .orange tspan{fill:#000!important;}#mermaid-xqw4gwc2rd-1772709239822 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-xqw4gwc2rd-1772709239822 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-xqw4gwc2rd-1772709239822 .green tspan{fill:#000!important;}#mermaid-xqw4gwc2rd-1772709239822 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-xqw4gwc2rd-1772709239822 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-xqw4gwc2rd-1772709239822 .purple tspan{fill:#000!important;}

Total Latency

Propagation  
Physical distance

Transmission  
Data size/bandwidth

Processing  
Router/server time

Queuing  
Wait in buffers

Component

Definition

Typical Values

Propagation

Time for signal to travel

~5ms per 1000km

Transmission

Time to put data on wire

Depends on bandwidth

Processing

Router/server processing

<1ms typically

Queuing

Wait time in buffers

Variable, can spike

### 8.2 Latency Numbers You Should Know

These numbers shape system design decisions:

```shell
1Operation                              Time          Notes
2---------------------------------------------------------------
3L1 cache reference                     0.5 ns        CPU cycles
4Main memory reference                  100 ns        ~200x slower than L1
5SSD random read                        150 μs        ~1000x slower than RAM
6Round trip in same datacenter          0.5 ms        Within same AZ
7Read 1 MB from SSD                     1 ms          Sequential read
8Round trip across datacenter           5 ms          Different AZs
9Round trip US coast to coast           60 ms         Speed of light limit
10Round trip US to Europe                100 ms        Transatlantic
11Round trip US to Asia                  200 ms        Transpacific
```

**The key insight:** Once you leave the machine, latency jumps by orders of magnitude. A database query taking 1ms is dwarfed by 100ms of network latency to the user. Optimizing your code from 2ms to 1ms saves less than moving your servers closer to users.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-694a2e399f4909e6a17df2b8-1772709239823{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .error-icon{fill:#000000;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .edge-thickness-normal{stroke-width:1px;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .marker.cross{stroke:#22c55e;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 svg{font-family:inherit;font-size:16px;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 p{margin:0;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .label{font-family:inherit;color:#f0fdf4;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .cluster-label text{fill:#fafafa;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .cluster-label span{color:#fafafa;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .cluster-label span p{background-color:transparent;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .label text,#mermaid-694a2e399f4909e6a17df2b8-1772709239823 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .node rect,#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .node circle,#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .node ellipse,#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .node polygon,#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .rough-node .label text,#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .node .label text,#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .image-shape .label,#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .icon-shape .label{text-anchor:middle;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .rough-node .label,#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .node .label,#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .image-shape .label,#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .icon-shape .label{text-align:center;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .node.clickable{cursor:pointer;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .arrowheadPath{fill:#0b0b0b;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .edgeLabel p{background-color:#0a0a0a;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .cluster text{fill:#fafafa;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .cluster span{color:#fafafa;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 rect.text{fill:none;stroke-width:0;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .icon-shape,#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .icon-shape p,#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .icon-shape rect,#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 :root{--mermaid-font-family:inherit;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .green tspan{fill:#000!important;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .primary tspan{fill:#000!important;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .orange tspan{fill:#000!important;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-694a2e399f4909e6a17df2b8-1772709239823 .red tspan{fill:#000!important;}

Across the World

Same Datacenter

Same Machine

L1 Cache  
0.5 ns

RAM  
100 ns

SSD  
150 μs

Network  
0.5 ms

US Coast-Coast  
60 ms

US to Asia  
200 ms

### 8.3 Bandwidth vs Latency

People often confuse these. They are different things, and optimizing for one does not help the other.

**Bandwidth:** How much data can flow per second. Think of it as pipe width.

**Latency:** How long it takes for the first byte to arrive. Think of it as pipe length.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-694a2e629f4909e6a17df2b9-1772709239824{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .error-icon{fill:#000000;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .edge-thickness-normal{stroke-width:1px;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .marker.cross{stroke:#22c55e;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 svg{font-family:inherit;font-size:16px;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 p{margin:0;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .label{font-family:inherit;color:#f0fdf4;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .cluster-label text{fill:#fafafa;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .cluster-label span{color:#fafafa;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .cluster-label span p{background-color:transparent;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .label text,#mermaid-694a2e629f4909e6a17df2b9-1772709239824 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .node rect,#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .node circle,#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .node ellipse,#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .node polygon,#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .rough-node .label text,#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .node .label text,#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .image-shape .label,#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .icon-shape .label{text-anchor:middle;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .rough-node .label,#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .node .label,#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .image-shape .label,#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .icon-shape .label{text-align:center;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .node.clickable{cursor:pointer;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .arrowheadPath{fill:#0b0b0b;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .edgeLabel p{background-color:#0a0a0a;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .cluster text{fill:#fafafa;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .cluster span{color:#fafafa;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 rect.text{fill:none;stroke-width:0;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .icon-shape,#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .icon-shape p,#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .icon-shape rect,#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 :root{--mermaid-font-family:inherit;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .primary tspan{fill:#000!important;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-694a2e629f4909e6a17df2b9-1772709239824 .orange tspan{fill:#000!important;}

Analogy: Water Pipe

Wide Pipe  
High Bandwidth  
Lots of water per second

Long Pipe  
High Latency  
Takes time for water to arrive

**For small requests (API calls, web pages):** Latency dominates. Sending 10KB on a 1 Gbps link takes 0.08ms. But if latency is 100ms, total time is 100.08ms. The bandwidth was irrelevant.

**For large transfers (backups, video):** Bandwidth dominates. Sending 1GB takes 8 seconds on 1 Gbps, 80 seconds on 100 Mbps. Latency of 100ms is noise.

```shell
1Small request (10 KB) over 100 Mbps, 50ms latency:
2  Transmission: 10 KB / 100 Mbps = 0.8 ms
3  Total: 50 + 0.8 ≈ 51 ms  ← Latency is 98% of the time
4
5Large transfer (100 MB) over 100 Mbps, 50ms latency:
6  Transmission: 100 MB / 100 Mbps = 8000 ms
7  Total: 50 + 8000 ≈ 8050 ms  ← Bandwidth is 99% of the time
```

For web applications serving small responses, focus on latency. For batch data pipelines, focus on bandwidth.

### 8.4 Reducing Latency

You cannot beat the speed of light. But you can reduce the distance it travels and the number of trips it makes.

#### **1\. Move computation closer to users**

CDNs for static content, edge functions for dynamic content, and multi-region deployments for global applications.

#### **2\. Reduce round trips**

Every round trip adds latency. Batch multiple operations into one request. Use HTTP/2 multiplexing. Keep connections alive instead of reconnecting.

#### **3\. Cache aggressively**

The fastest request is one you do not make. Cache at every layer: browser, CDN, application, database.

#### **4\. Compress data**

Less data = less transmission time. Use gzip or Brotli for text. Use efficient binary formats (Protocol Buffers, MessagePack) for internal APIs.

#### **5\. Process asynchronously**

Return a quick acknowledgment, process in the background, notify when done. The user sees a fast response even if the actual work takes time.

### 8.5 Tail Latency

Average latency lies. If 99% of your requests take 10ms but 1% take 5 seconds, your average looks fine while some users have a terrible experience.

```shell
1Latency percentiles for an API:
2├── p50 (median): 10ms   ← Half of requests
3├── p95: 50ms            ← Most users see this or better
4├── p99: 200ms           ← 1 in 100 requests
5└── p99.9: 1000ms        ← 1 in 1000 requests
```

#### **Why p99 matters more than average:**

A single page load might make 50+ requests. If any one of them is slow, the page feels slow.

```shell
1Probability of hitting p99 at least once with N requests:
2  1 - (0.99)^N
3
4  10 requests:  10% chance of hitting p99
5  50 requests:  39% chance
6  100 requests: 63% chance
```

A user loading a page with 50 API calls has a 39% chance of experiencing p99 latency. Monitor p99, not averages.

#### **Common Causes of Tail Latency:**

Cause

Symptom

Fix

GC pauses

Random spikes

Tune GC, allocate less

Cold cache

Spikes after deploy

Pre-warm caches

Resource contention

Correlates with load

Better isolation

Slow dependencies

Consistent tail

Timeouts, circuit breakers

Database locks

Transaction-heavy spikes

Optimize queries, shorter transactions

# 9\. Networking in Distributed Systems

Everything we have discussed so far gets harder in distributed systems. Instead of one server, you have dozens or thousands. Instead of one network hop, you have many. Instead of occasional failures, you have constant failures somewhere in the system.

The network is not just a pipe between your laptop and a server. It is a complex mesh connecting thousands of machines, and something is always broken.

### 9.1 The Network is Unreliable

In a distributed system, you cannot distinguish between "the network is slow" and "the server is down." Both look the same: no response.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-zsvw972tcpg-1772709239824{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-zsvw972tcpg-1772709239824 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-zsvw972tcpg-1772709239824 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-zsvw972tcpg-1772709239824 .error-icon{fill:#000000;}#mermaid-zsvw972tcpg-1772709239824 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-zsvw972tcpg-1772709239824 .edge-thickness-normal{stroke-width:1px;}#mermaid-zsvw972tcpg-1772709239824 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-zsvw972tcpg-1772709239824 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-zsvw972tcpg-1772709239824 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-zsvw972tcpg-1772709239824 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-zsvw972tcpg-1772709239824 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-zsvw972tcpg-1772709239824 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-zsvw972tcpg-1772709239824 .marker.cross{stroke:#22c55e;}#mermaid-zsvw972tcpg-1772709239824 svg{font-family:inherit;font-size:16px;}#mermaid-zsvw972tcpg-1772709239824 p{margin:0;}#mermaid-zsvw972tcpg-1772709239824 .label{font-family:inherit;color:#f0fdf4;}#mermaid-zsvw972tcpg-1772709239824 .cluster-label text{fill:#fafafa;}#mermaid-zsvw972tcpg-1772709239824 .cluster-label span{color:#fafafa;}#mermaid-zsvw972tcpg-1772709239824 .cluster-label span p{background-color:transparent;}#mermaid-zsvw972tcpg-1772709239824 .label text,#mermaid-zsvw972tcpg-1772709239824 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-zsvw972tcpg-1772709239824 .node rect,#mermaid-zsvw972tcpg-1772709239824 .node circle,#mermaid-zsvw972tcpg-1772709239824 .node ellipse,#mermaid-zsvw972tcpg-1772709239824 .node polygon,#mermaid-zsvw972tcpg-1772709239824 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-zsvw972tcpg-1772709239824 .rough-node .label text,#mermaid-zsvw972tcpg-1772709239824 .node .label text,#mermaid-zsvw972tcpg-1772709239824 .image-shape .label,#mermaid-zsvw972tcpg-1772709239824 .icon-shape .label{text-anchor:middle;}#mermaid-zsvw972tcpg-1772709239824 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-zsvw972tcpg-1772709239824 .rough-node .label,#mermaid-zsvw972tcpg-1772709239824 .node .label,#mermaid-zsvw972tcpg-1772709239824 .image-shape .label,#mermaid-zsvw972tcpg-1772709239824 .icon-shape .label{text-align:center;}#mermaid-zsvw972tcpg-1772709239824 .node.clickable{cursor:pointer;}#mermaid-zsvw972tcpg-1772709239824 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-zsvw972tcpg-1772709239824 .arrowheadPath{fill:#0b0b0b;}#mermaid-zsvw972tcpg-1772709239824 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-zsvw972tcpg-1772709239824 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-zsvw972tcpg-1772709239824 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-zsvw972tcpg-1772709239824 .edgeLabel p{background-color:#0a0a0a;}#mermaid-zsvw972tcpg-1772709239824 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-zsvw972tcpg-1772709239824 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-zsvw972tcpg-1772709239824 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-zsvw972tcpg-1772709239824 .cluster text{fill:#fafafa;}#mermaid-zsvw972tcpg-1772709239824 .cluster span{color:#fafafa;}#mermaid-zsvw972tcpg-1772709239824 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-zsvw972tcpg-1772709239824 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-zsvw972tcpg-1772709239824 rect.text{fill:none;stroke-width:0;}#mermaid-zsvw972tcpg-1772709239824 .icon-shape,#mermaid-zsvw972tcpg-1772709239824 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-zsvw972tcpg-1772709239824 .icon-shape p,#mermaid-zsvw972tcpg-1772709239824 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-zsvw972tcpg-1772709239824 .icon-shape rect,#mermaid-zsvw972tcpg-1772709239824 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-zsvw972tcpg-1772709239824 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-zsvw972tcpg-1772709239824 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-zsvw972tcpg-1772709239824 :root{--mermaid-font-family:inherit;}#mermaid-zsvw972tcpg-1772709239824 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-zsvw972tcpg-1772709239824 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-zsvw972tcpg-1772709239824 .red tspan{fill:#000!important;}#mermaid-zsvw972tcpg-1772709239824 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-zsvw972tcpg-1772709239824 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-zsvw972tcpg-1772709239824 .orange tspan{fill:#000!important;}

Network Failure Modes

Packet loss

Packet delay

Packet reordering

Packet duplication

Network partition

Total failure

**Dealing with failures:**

Failure

Detection

Response

Packet loss

Timeout, no ACK

Retry

Delay

Timeout (false positive possible)

Retry, may cause duplicate

Partition

Timeout from multiple nodes

Failover, accept inconsistency

### 9.2 Timeouts

When a request does not get a response, how long do you wait? This simple question has no good answer.

**Too short:** You give up on requests that would have succeeded. You trigger retries that create duplicate work. Under load, you make things worse.

**Too long:** Users wait forever. Resources (connections, threads) stay tied up. You detect failures slowly.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-er3jykn1orr-1772709239825{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-er3jykn1orr-1772709239825 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-er3jykn1orr-1772709239825 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-er3jykn1orr-1772709239825 .error-icon{fill:#000000;}#mermaid-er3jykn1orr-1772709239825 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-er3jykn1orr-1772709239825 .edge-thickness-normal{stroke-width:1px;}#mermaid-er3jykn1orr-1772709239825 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-er3jykn1orr-1772709239825 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-er3jykn1orr-1772709239825 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-er3jykn1orr-1772709239825 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-er3jykn1orr-1772709239825 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-er3jykn1orr-1772709239825 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-er3jykn1orr-1772709239825 .marker.cross{stroke:#22c55e;}#mermaid-er3jykn1orr-1772709239825 svg{font-family:inherit;font-size:16px;}#mermaid-er3jykn1orr-1772709239825 p{margin:0;}#mermaid-er3jykn1orr-1772709239825 .label{font-family:inherit;color:#f0fdf4;}#mermaid-er3jykn1orr-1772709239825 .cluster-label text{fill:#fafafa;}#mermaid-er3jykn1orr-1772709239825 .cluster-label span{color:#fafafa;}#mermaid-er3jykn1orr-1772709239825 .cluster-label span p{background-color:transparent;}#mermaid-er3jykn1orr-1772709239825 .label text,#mermaid-er3jykn1orr-1772709239825 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-er3jykn1orr-1772709239825 .node rect,#mermaid-er3jykn1orr-1772709239825 .node circle,#mermaid-er3jykn1orr-1772709239825 .node ellipse,#mermaid-er3jykn1orr-1772709239825 .node polygon,#mermaid-er3jykn1orr-1772709239825 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-er3jykn1orr-1772709239825 .rough-node .label text,#mermaid-er3jykn1orr-1772709239825 .node .label text,#mermaid-er3jykn1orr-1772709239825 .image-shape .label,#mermaid-er3jykn1orr-1772709239825 .icon-shape .label{text-anchor:middle;}#mermaid-er3jykn1orr-1772709239825 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-er3jykn1orr-1772709239825 .rough-node .label,#mermaid-er3jykn1orr-1772709239825 .node .label,#mermaid-er3jykn1orr-1772709239825 .image-shape .label,#mermaid-er3jykn1orr-1772709239825 .icon-shape .label{text-align:center;}#mermaid-er3jykn1orr-1772709239825 .node.clickable{cursor:pointer;}#mermaid-er3jykn1orr-1772709239825 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-er3jykn1orr-1772709239825 .arrowheadPath{fill:#0b0b0b;}#mermaid-er3jykn1orr-1772709239825 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-er3jykn1orr-1772709239825 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-er3jykn1orr-1772709239825 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-er3jykn1orr-1772709239825 .edgeLabel p{background-color:#0a0a0a;}#mermaid-er3jykn1orr-1772709239825 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-er3jykn1orr-1772709239825 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-er3jykn1orr-1772709239825 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-er3jykn1orr-1772709239825 .cluster text{fill:#fafafa;}#mermaid-er3jykn1orr-1772709239825 .cluster span{color:#fafafa;}#mermaid-er3jykn1orr-1772709239825 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-er3jykn1orr-1772709239825 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-er3jykn1orr-1772709239825 rect.text{fill:none;stroke-width:0;}#mermaid-er3jykn1orr-1772709239825 .icon-shape,#mermaid-er3jykn1orr-1772709239825 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-er3jykn1orr-1772709239825 .icon-shape p,#mermaid-er3jykn1orr-1772709239825 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-er3jykn1orr-1772709239825 .icon-shape rect,#mermaid-er3jykn1orr-1772709239825 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-er3jykn1orr-1772709239825 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-er3jykn1orr-1772709239825 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-er3jykn1orr-1772709239825 :root{--mermaid-font-family:inherit;}#mermaid-er3jykn1orr-1772709239825 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-er3jykn1orr-1772709239825 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-er3jykn1orr-1772709239825 .red tspan{fill:#000!important;}#mermaid-er3jykn1orr-1772709239825 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-er3jykn1orr-1772709239825 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-er3jykn1orr-1772709239825 .orange tspan{fill:#000!important;}

Timeout too short

False positives

Unnecessary retries

Cascading failures

Timeout too long

Slow failure detection

Poor user experience

Resource holding

**Strategies:**

Strategy

How It Works

Best For

Static

Fixed value (e.g., 5s)

Simple cases

Adaptive

Based on recent p99 + buffer

Variable latency

Deadline propagation

Pass remaining budget to downstream

Multi-hop requests

Circuit breaker

Stop trying after N failures

Failing dependencies

**In practice:** Set connection timeout short (1-2s), read timeout based on expected operation time. For chained calls, propagate deadlines, if you have 5 seconds total and already spent 2 seconds, downstream only gets 3 seconds.

### 9.3 Retries and Idempotency

You sent a request. It timed out. What happened?

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-8vi1aqa2spt-1772709239829{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-8vi1aqa2spt-1772709239829 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-8vi1aqa2spt-1772709239829 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-8vi1aqa2spt-1772709239829 .error-icon{fill:#000000;}#mermaid-8vi1aqa2spt-1772709239829 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-8vi1aqa2spt-1772709239829 .edge-thickness-normal{stroke-width:1px;}#mermaid-8vi1aqa2spt-1772709239829 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-8vi1aqa2spt-1772709239829 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-8vi1aqa2spt-1772709239829 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-8vi1aqa2spt-1772709239829 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-8vi1aqa2spt-1772709239829 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-8vi1aqa2spt-1772709239829 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-8vi1aqa2spt-1772709239829 .marker.cross{stroke:#22c55e;}#mermaid-8vi1aqa2spt-1772709239829 svg{font-family:inherit;font-size:16px;}#mermaid-8vi1aqa2spt-1772709239829 p{margin:0;}#mermaid-8vi1aqa2spt-1772709239829 .label{font-family:inherit;color:#f0fdf4;}#mermaid-8vi1aqa2spt-1772709239829 .cluster-label text{fill:#fafafa;}#mermaid-8vi1aqa2spt-1772709239829 .cluster-label span{color:#fafafa;}#mermaid-8vi1aqa2spt-1772709239829 .cluster-label span p{background-color:transparent;}#mermaid-8vi1aqa2spt-1772709239829 .label text,#mermaid-8vi1aqa2spt-1772709239829 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-8vi1aqa2spt-1772709239829 .node rect,#mermaid-8vi1aqa2spt-1772709239829 .node circle,#mermaid-8vi1aqa2spt-1772709239829 .node ellipse,#mermaid-8vi1aqa2spt-1772709239829 .node polygon,#mermaid-8vi1aqa2spt-1772709239829 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-8vi1aqa2spt-1772709239829 .rough-node .label text,#mermaid-8vi1aqa2spt-1772709239829 .node .label text,#mermaid-8vi1aqa2spt-1772709239829 .image-shape .label,#mermaid-8vi1aqa2spt-1772709239829 .icon-shape .label{text-anchor:middle;}#mermaid-8vi1aqa2spt-1772709239829 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-8vi1aqa2spt-1772709239829 .rough-node .label,#mermaid-8vi1aqa2spt-1772709239829 .node .label,#mermaid-8vi1aqa2spt-1772709239829 .image-shape .label,#mermaid-8vi1aqa2spt-1772709239829 .icon-shape .label{text-align:center;}#mermaid-8vi1aqa2spt-1772709239829 .node.clickable{cursor:pointer;}#mermaid-8vi1aqa2spt-1772709239829 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-8vi1aqa2spt-1772709239829 .arrowheadPath{fill:#0b0b0b;}#mermaid-8vi1aqa2spt-1772709239829 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-8vi1aqa2spt-1772709239829 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-8vi1aqa2spt-1772709239829 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-8vi1aqa2spt-1772709239829 .edgeLabel p{background-color:#0a0a0a;}#mermaid-8vi1aqa2spt-1772709239829 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-8vi1aqa2spt-1772709239829 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-8vi1aqa2spt-1772709239829 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-8vi1aqa2spt-1772709239829 .cluster text{fill:#fafafa;}#mermaid-8vi1aqa2spt-1772709239829 .cluster span{color:#fafafa;}#mermaid-8vi1aqa2spt-1772709239829 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-8vi1aqa2spt-1772709239829 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-8vi1aqa2spt-1772709239829 rect.text{fill:none;stroke-width:0;}#mermaid-8vi1aqa2spt-1772709239829 .icon-shape,#mermaid-8vi1aqa2spt-1772709239829 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-8vi1aqa2spt-1772709239829 .icon-shape p,#mermaid-8vi1aqa2spt-1772709239829 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-8vi1aqa2spt-1772709239829 .icon-shape rect,#mermaid-8vi1aqa2spt-1772709239829 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-8vi1aqa2spt-1772709239829 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-8vi1aqa2spt-1772709239829 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-8vi1aqa2spt-1772709239829 :root{--mermaid-font-family:inherit;}#mermaid-8vi1aqa2spt-1772709239829 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-8vi1aqa2spt-1772709239829 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-8vi1aqa2spt-1772709239829 .primary tspan{fill:#000!important;}#mermaid-8vi1aqa2spt-1772709239829 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-8vi1aqa2spt-1772709239829 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-8vi1aqa2spt-1772709239829 .orange tspan{fill:#000!important;}#mermaid-8vi1aqa2spt-1772709239829 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-8vi1aqa2spt-1772709239829 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-8vi1aqa2spt-1772709239829 .purple tspan{fill:#000!important;}#mermaid-8vi1aqa2spt-1772709239829 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-8vi1aqa2spt-1772709239829 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-8vi1aqa2spt-1772709239829 .green tspan{fill:#000!important;}#mermaid-8vi1aqa2spt-1772709239829 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-8vi1aqa2spt-1772709239829 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-8vi1aqa2spt-1772709239829 .red tspan{fill:#000!important;}

Network lost request

Server processed, response lost

Server still processing

Request sent

Timeout - no response

What happened?

Safe to retry

Retry = duplicate!

Retry might duplicate

You cannot tell which case you are in. The solution is idempotency: design operations so that doing them twice has the same effect as doing them once.

#### **Which Operations Are Naturally Idempotent?**

Operation

Idempotent?

Why

GET /users/123

Yes

Reading never changes state

PUT /users/123 {data}

Yes

Sets to specific value

DELETE /users/123

Yes

Already deleted = still deleted

POST /orders

No

Creates new order each time

POST /transfer $100

No

Transfers $100 each time

#### **Making Non-Idempotent Operations Safe**

Use an idempotency key:

Shell

```shell
1POST /orders HTTP/1.1
2Idempotency-Key: order-abc-123-retry-1
3
4Server logic:
51. Check if key exists in cache/database
62. If exists, return stored response
73. If not, process request, store response with key
84. Client can safely retry with same key
```

Many payment APIs (Stripe, PayPal) require idempotency keys for this reason. A retry will not charge the customer twice.

### 9.4 Service Discovery

In a dynamic environment, IP addresses change. Servers come and go. How does Service A find Service B?

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-75iaojig1ms-1772709239829{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-75iaojig1ms-1772709239829 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-75iaojig1ms-1772709239829 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-75iaojig1ms-1772709239829 .error-icon{fill:#000000;}#mermaid-75iaojig1ms-1772709239829 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-75iaojig1ms-1772709239829 .edge-thickness-normal{stroke-width:1px;}#mermaid-75iaojig1ms-1772709239829 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-75iaojig1ms-1772709239829 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-75iaojig1ms-1772709239829 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-75iaojig1ms-1772709239829 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-75iaojig1ms-1772709239829 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-75iaojig1ms-1772709239829 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-75iaojig1ms-1772709239829 .marker.cross{stroke:#22c55e;}#mermaid-75iaojig1ms-1772709239829 svg{font-family:inherit;font-size:16px;}#mermaid-75iaojig1ms-1772709239829 p{margin:0;}#mermaid-75iaojig1ms-1772709239829 .label{font-family:inherit;color:#f0fdf4;}#mermaid-75iaojig1ms-1772709239829 .cluster-label text{fill:#fafafa;}#mermaid-75iaojig1ms-1772709239829 .cluster-label span{color:#fafafa;}#mermaid-75iaojig1ms-1772709239829 .cluster-label span p{background-color:transparent;}#mermaid-75iaojig1ms-1772709239829 .label text,#mermaid-75iaojig1ms-1772709239829 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-75iaojig1ms-1772709239829 .node rect,#mermaid-75iaojig1ms-1772709239829 .node circle,#mermaid-75iaojig1ms-1772709239829 .node ellipse,#mermaid-75iaojig1ms-1772709239829 .node polygon,#mermaid-75iaojig1ms-1772709239829 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-75iaojig1ms-1772709239829 .rough-node .label text,#mermaid-75iaojig1ms-1772709239829 .node .label text,#mermaid-75iaojig1ms-1772709239829 .image-shape .label,#mermaid-75iaojig1ms-1772709239829 .icon-shape .label{text-anchor:middle;}#mermaid-75iaojig1ms-1772709239829 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-75iaojig1ms-1772709239829 .rough-node .label,#mermaid-75iaojig1ms-1772709239829 .node .label,#mermaid-75iaojig1ms-1772709239829 .image-shape .label,#mermaid-75iaojig1ms-1772709239829 .icon-shape .label{text-align:center;}#mermaid-75iaojig1ms-1772709239829 .node.clickable{cursor:pointer;}#mermaid-75iaojig1ms-1772709239829 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-75iaojig1ms-1772709239829 .arrowheadPath{fill:#0b0b0b;}#mermaid-75iaojig1ms-1772709239829 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-75iaojig1ms-1772709239829 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-75iaojig1ms-1772709239829 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-75iaojig1ms-1772709239829 .edgeLabel p{background-color:#0a0a0a;}#mermaid-75iaojig1ms-1772709239829 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-75iaojig1ms-1772709239829 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-75iaojig1ms-1772709239829 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-75iaojig1ms-1772709239829 .cluster text{fill:#fafafa;}#mermaid-75iaojig1ms-1772709239829 .cluster span{color:#fafafa;}#mermaid-75iaojig1ms-1772709239829 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-75iaojig1ms-1772709239829 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-75iaojig1ms-1772709239829 rect.text{fill:none;stroke-width:0;}#mermaid-75iaojig1ms-1772709239829 .icon-shape,#mermaid-75iaojig1ms-1772709239829 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-75iaojig1ms-1772709239829 .icon-shape p,#mermaid-75iaojig1ms-1772709239829 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-75iaojig1ms-1772709239829 .icon-shape rect,#mermaid-75iaojig1ms-1772709239829 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-75iaojig1ms-1772709239829 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-75iaojig1ms-1772709239829 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-75iaojig1ms-1772709239829 :root{--mermaid-font-family:inherit;}#mermaid-75iaojig1ms-1772709239829 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-75iaojig1ms-1772709239829 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-75iaojig1ms-1772709239829 .primary tspan{fill:#000!important;}#mermaid-75iaojig1ms-1772709239829 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-75iaojig1ms-1772709239829 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-75iaojig1ms-1772709239829 .orange tspan{fill:#000!important;}#mermaid-75iaojig1ms-1772709239829 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-75iaojig1ms-1772709239829 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-75iaojig1ms-1772709239829 .green tspan{fill:#000!important;}#mermaid-75iaojig1ms-1772709239829 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-75iaojig1ms-1772709239829 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-75iaojig1ms-1772709239829 .purple tspan{fill:#000!important;}

DNS-Based

api.internal

Service A

DNS

Service B

Service Registry

Register

Service A

Registry  
Consul/etcd

Service B

Service Mesh

Service A

Sidecar

Sidecar

Service B

Approach

Complexity

Features

Best For

DNS

Low

Basic resolution

Simple setups

Service registry

Medium

Health checks, metadata

Microservices

Service mesh

High

mTLS, observability, traffic control

Complex systems, security requirements

Most cloud environments use a combination. Kubernetes uses DNS (CoreDNS) internally, with optional service mesh (Istio, Linkerd) for advanced features.

### 9.5 Load Balancing in Distributed Systems

Load balancers distribute traffic across servers. The choice of algorithm affects performance and reliability.

#### **Layer 4 vs Layer 7**

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-slg9eji06vd-1772709239830{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-slg9eji06vd-1772709239830 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-slg9eji06vd-1772709239830 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-slg9eji06vd-1772709239830 .error-icon{fill:#000000;}#mermaid-slg9eji06vd-1772709239830 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-slg9eji06vd-1772709239830 .edge-thickness-normal{stroke-width:1px;}#mermaid-slg9eji06vd-1772709239830 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-slg9eji06vd-1772709239830 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-slg9eji06vd-1772709239830 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-slg9eji06vd-1772709239830 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-slg9eji06vd-1772709239830 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-slg9eji06vd-1772709239830 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-slg9eji06vd-1772709239830 .marker.cross{stroke:#22c55e;}#mermaid-slg9eji06vd-1772709239830 svg{font-family:inherit;font-size:16px;}#mermaid-slg9eji06vd-1772709239830 p{margin:0;}#mermaid-slg9eji06vd-1772709239830 .label{font-family:inherit;color:#f0fdf4;}#mermaid-slg9eji06vd-1772709239830 .cluster-label text{fill:#fafafa;}#mermaid-slg9eji06vd-1772709239830 .cluster-label span{color:#fafafa;}#mermaid-slg9eji06vd-1772709239830 .cluster-label span p{background-color:transparent;}#mermaid-slg9eji06vd-1772709239830 .label text,#mermaid-slg9eji06vd-1772709239830 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-slg9eji06vd-1772709239830 .node rect,#mermaid-slg9eji06vd-1772709239830 .node circle,#mermaid-slg9eji06vd-1772709239830 .node ellipse,#mermaid-slg9eji06vd-1772709239830 .node polygon,#mermaid-slg9eji06vd-1772709239830 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-slg9eji06vd-1772709239830 .rough-node .label text,#mermaid-slg9eji06vd-1772709239830 .node .label text,#mermaid-slg9eji06vd-1772709239830 .image-shape .label,#mermaid-slg9eji06vd-1772709239830 .icon-shape .label{text-anchor:middle;}#mermaid-slg9eji06vd-1772709239830 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-slg9eji06vd-1772709239830 .rough-node .label,#mermaid-slg9eji06vd-1772709239830 .node .label,#mermaid-slg9eji06vd-1772709239830 .image-shape .label,#mermaid-slg9eji06vd-1772709239830 .icon-shape .label{text-align:center;}#mermaid-slg9eji06vd-1772709239830 .node.clickable{cursor:pointer;}#mermaid-slg9eji06vd-1772709239830 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-slg9eji06vd-1772709239830 .arrowheadPath{fill:#0b0b0b;}#mermaid-slg9eji06vd-1772709239830 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-slg9eji06vd-1772709239830 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-slg9eji06vd-1772709239830 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-slg9eji06vd-1772709239830 .edgeLabel p{background-color:#0a0a0a;}#mermaid-slg9eji06vd-1772709239830 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-slg9eji06vd-1772709239830 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-slg9eji06vd-1772709239830 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-slg9eji06vd-1772709239830 .cluster text{fill:#fafafa;}#mermaid-slg9eji06vd-1772709239830 .cluster span{color:#fafafa;}#mermaid-slg9eji06vd-1772709239830 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-slg9eji06vd-1772709239830 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-slg9eji06vd-1772709239830 rect.text{fill:none;stroke-width:0;}#mermaid-slg9eji06vd-1772709239830 .icon-shape,#mermaid-slg9eji06vd-1772709239830 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-slg9eji06vd-1772709239830 .icon-shape p,#mermaid-slg9eji06vd-1772709239830 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-slg9eji06vd-1772709239830 .icon-shape rect,#mermaid-slg9eji06vd-1772709239830 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-slg9eji06vd-1772709239830 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-slg9eji06vd-1772709239830 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-slg9eji06vd-1772709239830 :root{--mermaid-font-family:inherit;}#mermaid-slg9eji06vd-1772709239830 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-slg9eji06vd-1772709239830 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-slg9eji06vd-1772709239830 .primary tspan{fill:#000!important;}#mermaid-slg9eji06vd-1772709239830 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-slg9eji06vd-1772709239830 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-slg9eji06vd-1772709239830 .green tspan{fill:#000!important;}#mermaid-slg9eji06vd-1772709239830 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-slg9eji06vd-1772709239830 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-slg9eji06vd-1772709239830 .orange tspan{fill:#000!important;}

Layer 7 (HTTP)

Sees: URL, headers, cookies

Smart routing, caching

More CPU, terminates connections

Layer 4 (TCP)

Sees: IP, port

Fast, simple

Cannot route by URL/header

#### **Load balancing algorithms**

Algorithm

How It Works

Best For

Round robin

Each request to next server

Uniform requests, stateless

Least connections

Route to server with fewest active connections

Long-lived connections, variable duration

Weighted

Higher weight = more traffic

Mixed server capacity

Consistent hashing

Same user/key hits same server

Caching, session affinity

Random (power of 2)

Pick 2 random servers, choose less loaded

Large clusters

#### **Server-Side vs Client-Side**

Approach

Pros

Cons

Server-side LB

Simple clients, central control

Extra hop, potential bottleneck

Client-side

Direct connection, no bottleneck

Clients need discovery logic

# Summary

Networking knowledge separates good system designs from great ones. Here are the key takeaways:

1.  **Understand the stack.** Know which layer handles what. TCP provides reliability, IP provides routing, HTTP provides application semantics. Problems at different layers require different solutions.
2.  **TCP is not magic.** It provides reliability through acknowledgments, retries, and ordering. These features have costs: latency, overhead, head-of-line blocking. Know when UDP is better.
3.  **Latency is often the bottleneck.** At scale, network latency dominates processing time. Design to minimize round trips, move computation close to users, and cache aggressively.
4.  **Networks fail.** Design for packet loss, delays, partitions, and total failures. Use timeouts, retries with idempotency, and circuit breakers.
5.  **DNS is critical infrastructure.** Understand TTLs, caching, and how DNS enables geographic load balancing and failover.
6.  **HTTP evolves.** HTTP/2 and HTTP/3 address HTTP/1.1 limitations. Know the differences and when they matter.
7.  **Security is not optional.** TLS protects data in transit. Understand handshakes, certificates, and termination strategies.
8.  **Real-time needs different approaches.** WebSockets, SSE, and polling each have trade-offs. Choose based on direction, frequency, and infrastructure constraints.
9.  **Distributed systems amplify network challenges.** Service discovery, load balancing, and handling partial failures become essential.
10.  **Monitor and measure.** Track latency percentiles, not averages. Instrument at every layer. Distributed tracing is invaluable.

# Quiz

## Networking Quiz

1 / 20

Multiple Choice

In the OSI model, which layer is primarily responsible for routing packets between networks?

AData link layerBTransport layerCNetwork layerDApplication layer

PreviousNext

Launching soon
