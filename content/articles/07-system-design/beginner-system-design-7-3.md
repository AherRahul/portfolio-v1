---
title: "Server-Sent Events (SSE)"
description: "Server-Sent Events (SSE) - System Design Module 7"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Server-Sent Events (SSE)

Lets say you are building a dashboard that displays live stock prices. Every second, prices change, and users expect to see updates without refreshing the page. The data flows one direction: from your servers to the browser. Users watch the numbers tick, but they do not send stock prices back.

This is a common pattern. Live sports scores, build pipeline status, social media feeds, breaking news alerts. Data streams from server to client, and the client just listens.

WebSockets can handle this, but they feel like overkill. You do not need bidirectional communication. You do not want to manage a custom protocol. You just want the server to push updates to the browser.

**Server-Sent Events (SSE)** is designed exactly for this scenario. It provides a simple, standardized way for servers to push data to browsers over a single HTTP connection.

The browser handles reconnection automatically. The protocol is text-based and easy to debug. And it works with your existing HTTP infrastructure.

In this chapter, we will explore:

*   What Server-Sent Events are and how they differ from other approaches
*   How the SSE protocol works under the hood
*   The EventSource API and automatic reconnection
*   Implementation patterns for client and server
*   When SSE is the right choice vs alternatives

# What are Server-Sent Events?

Server-Sent Events is a web technology that allows servers to push updates to clients over a persistent HTTP connection. Unlike traditional request-response HTTP where the client initiates every exchange, SSE flips the model: the client opens a connection once, and the server sends data whenever it wants.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

DataSourceServerClientDataSourceServerClient#mermaid-fqo54dej2wm-1772708240830{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-fqo54dej2wm-1772708240830 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-fqo54dej2wm-1772708240830 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-fqo54dej2wm-1772708240830 .error-icon{fill:#000000;}#mermaid-fqo54dej2wm-1772708240830 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-fqo54dej2wm-1772708240830 .edge-thickness-normal{stroke-width:1px;}#mermaid-fqo54dej2wm-1772708240830 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-fqo54dej2wm-1772708240830 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-fqo54dej2wm-1772708240830 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-fqo54dej2wm-1772708240830 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-fqo54dej2wm-1772708240830 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-fqo54dej2wm-1772708240830 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-fqo54dej2wm-1772708240830 .marker.cross{stroke:#22c55e;}#mermaid-fqo54dej2wm-1772708240830 svg{font-family:inherit;font-size:16px;}#mermaid-fqo54dej2wm-1772708240830 p{margin:0;}#mermaid-fqo54dej2wm-1772708240830 .actor{stroke:#22c55e;fill:transparent;}#mermaid-fqo54dej2wm-1772708240830 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-fqo54dej2wm-1772708240830 .actor-line{stroke:#22c55e;}#mermaid-fqo54dej2wm-1772708240830 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-fqo54dej2wm-1772708240830 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-fqo54dej2wm-1772708240830 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-fqo54dej2wm-1772708240830 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-fqo54dej2wm-1772708240830 .sequenceNumber{fill:#f0fdf4;}#mermaid-fqo54dej2wm-1772708240830 #sequencenumber{fill:#fafafa;}#mermaid-fqo54dej2wm-1772708240830 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-fqo54dej2wm-1772708240830 .messageText{fill:#fafafa;stroke:none;}#mermaid-fqo54dej2wm-1772708240830 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-fqo54dej2wm-1772708240830 .labelText,#mermaid-fqo54dej2wm-1772708240830 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-fqo54dej2wm-1772708240830 .loopText,#mermaid-fqo54dej2wm-1772708240830 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-fqo54dej2wm-1772708240830 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-fqo54dej2wm-1772708240830 .note{stroke:#f59e0b;fill:#422006;}#mermaid-fqo54dej2wm-1772708240830 .noteText,#mermaid-fqo54dej2wm-1772708240830 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-fqo54dej2wm-1772708240830 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-fqo54dej2wm-1772708240830 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-fqo54dej2wm-1772708240830 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-fqo54dej2wm-1772708240830 .actorPopupMenu{position:absolute;}#mermaid-fqo54dej2wm-1772708240830 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-fqo54dej2wm-1772708240830 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-fqo54dej2wm-1772708240830 .actor-man circle,#mermaid-fqo54dej2wm-1772708240830 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-fqo54dej2wm-1772708240830 :root{--mermaid-font-family:inherit;}Single HTTP connection stays openConnection stays open indefinitely...Open SSE connectionPrice updateevent: pricedata: {"symbol": "AAPL", "price": 185.50}Price updateevent: pricedata: {"symbol": "AAPL", "price": 185.75}Price updateevent: pricedata: {"symbol": "AAPL", "price": 186.00}

The key characteristics of SSE:

*   **Unidirectional:** Data flows from server to client only
*   **Text-based:** Uses a simple text protocol over HTTP
*   **Persistent:** Single connection stays open for multiple messages
*   **Auto-reconnecting:** Browser automatically reconnects if the connection drops
*   **Native browser support:** Built into all modern browsers via the EventSource API

Think of SSE as a one-way radio broadcast. The server is the radio station, continuously transmitting. Clients tune in and listen. They cannot talk back through the same channel, but that is fine because they just need to receive.

# How SSE Differs from Other Approaches

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
