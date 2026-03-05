---
title: "PostgreSQL"
description: "PostgreSQL - System Design Interviews Module 5"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# PostgreSQL

In system design interviews, PostgreSQL often shows up as the default answer for “the main database.” And for good reason: it’s a battle-tested relational database with strong consistency, rich querying, and reliable transactions.

But choosing PostgreSQL is only the beginning. The difference between a good interview answer and a great one lies in the details. How do you prevent double-spending in a payment system? Which index type handles JSONB queries efficiently? When does PostgreSQL struggle, and what alternatives should you consider?

This chapter covers everything you need to confidently discuss PostgreSQL in system design interviews.

### PostGreSQL Architecture Overview

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-1jnehh8o5s8i-1772709236888{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-1jnehh8o5s8i-1772709236888 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-1jnehh8o5s8i-1772709236888 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-1jnehh8o5s8i-1772709236888 .error-icon{fill:#000000;}#mermaid-1jnehh8o5s8i-1772709236888 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-1jnehh8o5s8i-1772709236888 .edge-thickness-normal{stroke-width:1px;}#mermaid-1jnehh8o5s8i-1772709236888 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-1jnehh8o5s8i-1772709236888 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-1jnehh8o5s8i-1772709236888 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-1jnehh8o5s8i-1772709236888 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-1jnehh8o5s8i-1772709236888 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-1jnehh8o5s8i-1772709236888 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-1jnehh8o5s8i-1772709236888 .marker.cross{stroke:#22c55e;}#mermaid-1jnehh8o5s8i-1772709236888 svg{font-family:inherit;font-size:16px;}#mermaid-1jnehh8o5s8i-1772709236888 p{margin:0;}#mermaid-1jnehh8o5s8i-1772709236888 .label{font-family:inherit;color:#f0fdf4;}#mermaid-1jnehh8o5s8i-1772709236888 .cluster-label text{fill:#fafafa;}#mermaid-1jnehh8o5s8i-1772709236888 .cluster-label span{color:#fafafa;}#mermaid-1jnehh8o5s8i-1772709236888 .cluster-label span p{background-color:transparent;}#mermaid-1jnehh8o5s8i-1772709236888 .label text,#mermaid-1jnehh8o5s8i-1772709236888 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-1jnehh8o5s8i-1772709236888 .node rect,#mermaid-1jnehh8o5s8i-1772709236888 .node circle,#mermaid-1jnehh8o5s8i-1772709236888 .node ellipse,#mermaid-1jnehh8o5s8i-1772709236888 .node polygon,#mermaid-1jnehh8o5s8i-1772709236888 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-1jnehh8o5s8i-1772709236888 .rough-node .label text,#mermaid-1jnehh8o5s8i-1772709236888 .node .label text,#mermaid-1jnehh8o5s8i-1772709236888 .image-shape .label,#mermaid-1jnehh8o5s8i-1772709236888 .icon-shape .label{text-anchor:middle;}#mermaid-1jnehh8o5s8i-1772709236888 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-1jnehh8o5s8i-1772709236888 .rough-node .label,#mermaid-1jnehh8o5s8i-1772709236888 .node .label,#mermaid-1jnehh8o5s8i-1772709236888 .image-shape .label,#mermaid-1jnehh8o5s8i-1772709236888 .icon-shape .label{text-align:center;}#mermaid-1jnehh8o5s8i-1772709236888 .node.clickable{cursor:pointer;}#mermaid-1jnehh8o5s8i-1772709236888 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-1jnehh8o5s8i-1772709236888 .arrowheadPath{fill:#0b0b0b;}#mermaid-1jnehh8o5s8i-1772709236888 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-1jnehh8o5s8i-1772709236888 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-1jnehh8o5s8i-1772709236888 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-1jnehh8o5s8i-1772709236888 .edgeLabel p{background-color:#0a0a0a;}#mermaid-1jnehh8o5s8i-1772709236888 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-1jnehh8o5s8i-1772709236888 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-1jnehh8o5s8i-1772709236888 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-1jnehh8o5s8i-1772709236888 .cluster text{fill:#fafafa;}#mermaid-1jnehh8o5s8i-1772709236888 .cluster span{color:#fafafa;}#mermaid-1jnehh8o5s8i-1772709236888 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-1jnehh8o5s8i-1772709236888 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-1jnehh8o5s8i-1772709236888 rect.text{fill:none;stroke-width:0;}#mermaid-1jnehh8o5s8i-1772709236888 .icon-shape,#mermaid-1jnehh8o5s8i-1772709236888 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-1jnehh8o5s8i-1772709236888 .icon-shape p,#mermaid-1jnehh8o5s8i-1772709236888 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-1jnehh8o5s8i-1772709236888 .icon-shape rect,#mermaid-1jnehh8o5s8i-1772709236888 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-1jnehh8o5s8i-1772709236888 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-1jnehh8o5s8i-1772709236888 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-1jnehh8o5s8i-1772709236888 :root{--mermaid-font-family:inherit;}#mermaid-1jnehh8o5s8i-1772709236888 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-1jnehh8o5s8i-1772709236888 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-1jnehh8o5s8i-1772709236888 .primary tspan{fill:#000!important;}#mermaid-1jnehh8o5s8i-1772709236888 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-1jnehh8o5s8i-1772709236888 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-1jnehh8o5s8i-1772709236888 .orange tspan{fill:#000!important;}#mermaid-1jnehh8o5s8i-1772709236888 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-1jnehh8o5s8i-1772709236888 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-1jnehh8o5s8i-1772709236888 .green tspan{fill:#000!important;}#mermaid-1jnehh8o5s8i-1772709236888 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-1jnehh8o5s8i-1772709236888 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-1jnehh8o5s8i-1772709236888 .purple tspan{fill:#000!important;}#mermaid-1jnehh8o5s8i-1772709236888 .teal>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-1jnehh8o5s8i-1772709236888 .teal span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-1jnehh8o5s8i-1772709236888 .teal tspan{fill:#000!important;}

Read Replicas

PostgreSQL Primary

Connection Pooling

Client Applications

Writes

Reads

Reads

Streaming

Streaming

App Server 1

App Server 2

App Server N

PgBouncer

Query Parser

Query Optimizer

Executor

Buffer Manager

WAL Writer

Storage

Replica 1

Replica 2

Client applications (App Server 1..N) don’t connect to PostgreSQL directly. They go through **PgBouncer**, which maintains a smaller pool of database connections and multiplexes many client requests onto them. This keeps connection overhead low and improves throughput under high concurrency.

From PgBouncer, **writes are routed to the PostgreSQL Primary**.

Inside the primary, each SQL statement flows through the core execution pipeline:

*   **Query Parser**: validates SQL and builds an internal representation (parse tree).
*   **Query Optimizer**: picks an efficient plan (index scan vs seq scan, join strategy, etc.).
*   **Executor**: runs the chosen plan and produces results.

As the executor reads/writes data, it interacts with the **Buffer Manager**, which serves pages from memory when possible and fetches from **Storage** when needed. For durability, changes are recorded by the **WAL Writer** (Write-Ahead Log): PostgreSQL ensures the WAL is safely written before considering a transaction committed.

For scaling reads, PgBouncer also routes **read queries to replicas** (Replica 1/2). The replicas stay up to date via **streaming replication**, where the primary ships **WAL records** to replicas. This lets you offload read traffic, while keeping the primary as the source of truth for writes.

# 1\. When to Choose PostgreSQL

Every database excels at something and struggles with something else. The key to a strong interview answer is matching the database to the problem. PostgreSQL is remarkably versatile, but understanding exactly where it shines, and where it does not, lets you make defensible choices.

### 1.1 Choose PostgreSQL When You Have

#### **Complex queries and relationships**

Most real-world data is relational. Users have orders. Orders have products. Products have categories. When your queries need to traverse these relationships, PostgreSQL's full SQL support with JOINs, subqueries, CTEs, and window functions makes complex questions straightforward.

A query like "find all users who ordered a product in category X but never in category Y" is natural in SQL but awkward in most NoSQL databases.

#### **ACID transaction requirements**

When a payment transfer must either complete fully or not happen at all, you need atomicity. When your inventory count must never go negative, you need consistency.

PostgreSQL provides these guarantees by default, making it the natural choice for financial systems, inventory management, and booking platforms.

#### **Flexible querying needs**

NoSQL databases often require you to know your query patterns upfront and design your data model around them. PostgreSQL inverts this: you model your data naturally, and with proper indexing, the database handles whatever queries you throw at it.

This flexibility proves invaluable as requirements evolve.

#### **JSON and semi-structured data**

PostgreSQL's JSONB type bridges the gap between rigid schemas and document flexibility. You can store complex nested objects, query into them efficiently, and index specific fields, all while maintaining the relational guarantees you need for the rest of your data.

#### **Full-text search**

For many applications, PostgreSQL's built-in text search is sufficient, eliminating the operational complexity of maintaining a separate search engine.

When your search needs grow beyond what PostgreSQL handles well, you can add Elasticsearch incrementally.

#### **Geospatial data**

The PostGIS extension transforms PostgreSQL into a powerful geospatial database. If you are building anything location-aware, from delivery routing to store finders, PostGIS provides the primitives you need.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-8nlmb2hvxcs-1772709236896{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-8nlmb2hvxcs-1772709236896 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-8nlmb2hvxcs-1772709236896 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-8nlmb2hvxcs-1772709236896 .error-icon{fill:#000000;}#mermaid-8nlmb2hvxcs-1772709236896 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-8nlmb2hvxcs-1772709236896 .edge-thickness-normal{stroke-width:1px;}#mermaid-8nlmb2hvxcs-1772709236896 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-8nlmb2hvxcs-1772709236896 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-8nlmb2hvxcs-1772709236896 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-8nlmb2hvxcs-1772709236896 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-8nlmb2hvxcs-1772709236896 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-8nlmb2hvxcs-1772709236896 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-8nlmb2hvxcs-1772709236896 .marker.cross{stroke:#22c55e;}#mermaid-8nlmb2hvxcs-1772709236896 svg{font-family:inherit;font-size:16px;}#mermaid-8nlmb2hvxcs-1772709236896 p{margin:0;}#mermaid-8nlmb2hvxcs-1772709236896 .label{font-family:inherit;color:#f0fdf4;}#mermaid-8nlmb2hvxcs-1772709236896 .cluster-label text{fill:#fafafa;}#mermaid-8nlmb2hvxcs-1772709236896 .cluster-label span{color:#fafafa;}#mermaid-8nlmb2hvxcs-1772709236896 .cluster-label span p{background-color:transparent;}#mermaid-8nlmb2hvxcs-1772709236896 .label text,#mermaid-8nlmb2hvxcs-1772709236896 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-8nlmb2hvxcs-1772709236896 .node rect,#mermaid-8nlmb2hvxcs-1772709236896 .node circle,#mermaid-8nlmb2hvxcs-1772709236896 .node ellipse,#mermaid-8nlmb2hvxcs-1772709236896 .node polygon,#mermaid-8nlmb2hvxcs-1772709236896 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-8nlmb2hvxcs-1772709236896 .rough-node .label text,#mermaid-8nlmb2hvxcs-1772709236896 .node .label text,#mermaid-8nlmb2hvxcs-1772709236896 .image-shape .label,#mermaid-8nlmb2hvxcs-1772709236896 .icon-shape .label{text-anchor:middle;}#mermaid-8nlmb2hvxcs-1772709236896 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-8nlmb2hvxcs-1772709236896 .rough-node .label,#mermaid-8nlmb2hvxcs-1772709236896 .node .label,#mermaid-8nlmb2hvxcs-1772709236896 .image-shape .label,#mermaid-8nlmb2hvxcs-1772709236896 .icon-shape .label{text-align:center;}#mermaid-8nlmb2hvxcs-1772709236896 .node.clickable{cursor:pointer;}#mermaid-8nlmb2hvxcs-1772709236896 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-8nlmb2hvxcs-1772709236896 .arrowheadPath{fill:#0b0b0b;}#mermaid-8nlmb2hvxcs-1772709236896 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-8nlmb2hvxcs-1772709236896 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-8nlmb2hvxcs-1772709236896 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-8nlmb2hvxcs-1772709236896 .edgeLabel p{background-color:#0a0a0a;}#mermaid-8nlmb2hvxcs-1772709236896 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-8nlmb2hvxcs-1772709236896 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-8nlmb2hvxcs-1772709236896 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-8nlmb2hvxcs-1772709236896 .cluster text{fill:#fafafa;}#mermaid-8nlmb2hvxcs-1772709236896 .cluster span{color:#fafafa;}#mermaid-8nlmb2hvxcs-1772709236896 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-8nlmb2hvxcs-1772709236896 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-8nlmb2hvxcs-1772709236896 rect.text{fill:none;stroke-width:0;}#mermaid-8nlmb2hvxcs-1772709236896 .icon-shape,#mermaid-8nlmb2hvxcs-1772709236896 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-8nlmb2hvxcs-1772709236896 .icon-shape p,#mermaid-8nlmb2hvxcs-1772709236896 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-8nlmb2hvxcs-1772709236896 .icon-shape rect,#mermaid-8nlmb2hvxcs-1772709236896 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-8nlmb2hvxcs-1772709236896 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-8nlmb2hvxcs-1772709236896 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-8nlmb2hvxcs-1772709236896 :root{--mermaid-font-family:inherit;}#mermaid-8nlmb2hvxcs-1772709236896 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-8nlmb2hvxcs-1772709236896 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-8nlmb2hvxcs-1772709236896 .primary tspan{fill:#000!important;}#mermaid-8nlmb2hvxcs-1772709236896 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-8nlmb2hvxcs-1772709236896 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-8nlmb2hvxcs-1772709236896 .green tspan{fill:#000!important;}#mermaid-8nlmb2hvxcs-1772709236896 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-8nlmb2hvxcs-1772709236896 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-8nlmb2hvxcs-1772709236896 .orange tspan{fill:#000!important;}

Yes

No

Yes

No

Yes

No

Need complex queries or JOINs?

Need ACID guarantees?

Consider NoSQL

Data fits on single machine?

Consider eventual consistency DBs

PostgreSQL is excellent

PostgreSQL with sharding or NewSQL

### 1.2 When PostgreSQL Is Not the Right Fit

Understanding PostgreSQL's limitations is just as important as knowing its strengths. Proposing PostgreSQL for the wrong problem signals inexperience.

#### **Extreme write throughput**

PostgreSQL's ACID guarantees come with overhead. The database must coordinate transactions, maintain indexes, and ensure durability on every write.

For append-only workloads with millions of writes per second, such as event logging or IoT telemetry, databases like Cassandra or ClickHouse that sacrifice some consistency for write performance are better suited.

#### **Massive horizontal scaling**

PostgreSQL was designed as a single-node database. While you can shard it manually or with extensions like Citus, this adds significant operational complexity.

If your data will grow to hundreds of terabytes and require automatic horizontal scaling, native distributed databases like CockroachDB, Cassandra, or DynamoDB handle this more gracefully.

#### **Simple key-value access patterns**

If your access pattern is purely "get value by key" and "set key to value," PostgreSQL's query parser, planner, and executor are unnecessary overhead.

Redis provides sub-millisecond latency for these patterns, and DynamoDB offers managed key-value storage at scale.

#### **High-volume time-series data**

PostgreSQL can store time-series data, but it was not optimized for the append-heavy, time-windowed query patterns common in observability and IoT applications.

TimescaleDB (a PostgreSQL extension) or purpose-built databases like InfluxDB handle these workloads more efficiently.

#### **Caching layer**

PostgreSQL reads from disk. Even with aggressive caching, it cannot match the microsecond latencies of in-memory stores.

When you need sub-millisecond reads for hot data, Redis or Memcached belong in front of PostgreSQL, not instead of it.

### 1.3 Common Interview Systems Using PostgreSQL

System

Why PostgreSQL Works

Payment System

ACID transactions prevent double-spending

E-commerce (orders, inventory)

Complex relationships, transactions

User Management

Flexible queries, relationships

Booking System

Prevents double-booking with transactions

Financial Ledger

Audit trails, consistency guarantees

Content Management

JSONB for flexible content, full-text search

Multi-tenant SaaS

Row-level security, schemas for isolation

# 2\. ACID Transactions Deep Dive

ACID is more than an acronym to memorize. It represents a contract between your application and the database, a promise that certain bad things will never happen to your data. When you design a payment system or booking platform, ACID guarantees are what let you sleep at night.

Understanding these guarantees deeply, knowing exactly what each one provides and what it costs, separates engineers who can operate databases from those who merely use them.

### 2.1 What ACID Means

**Atomicity** ensures that transactions are all-or-nothing. Consider a money transfer: deducting from one account and crediting another. If the system crashes between these operations, atomicity guarantees you will never end up with money deducted but not credited. Either both operations complete, or neither does.

Sql

```sql
1BEGIN;
2UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;
3UPDATE accounts SET balance = balance + 100 WHERE user_id = 2;
4COMMIT;  -- Both succeed or both fail
```

**Consistency** means the database moves from one valid state to another. PostgreSQL enforces this through constraints: foreign keys that prevent orphaned records, check constraints that keep values in valid ranges, unique constraints that prevent duplicates. A transaction that would violate any constraint is rejected entirely.

**Isolation** addresses what happens when multiple transactions run concurrently. Without isolation, two transactions reading and modifying the same data could corrupt it. Isolation ensures each transaction operates as if it were the only one running, even when thousands execute simultaneously.

**Durability** promises that committed data survives failures. PostgreSQL achieves this through the Write-Ahead Log (WAL): before acknowledging a commit, the database writes the changes to durable storage. If the server crashes immediately after returning success, the data is safe.

### 2.2 Isolation Levels

Isolation is where things get interesting, and where interviews often probe your understanding.

Perfect isolation (every transaction behaves as if it ran alone) is expensive. Weaker isolation improves performance but allows certain anomalies. Understanding these trade-offs is essential for choosing the right level for each use case.

PostgreSQL supports four isolation levels, arranged from weakest to strongest:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-tlybmpex2x9-1772709236899{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-tlybmpex2x9-1772709236899 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-tlybmpex2x9-1772709236899 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-tlybmpex2x9-1772709236899 .error-icon{fill:#000000;}#mermaid-tlybmpex2x9-1772709236899 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-tlybmpex2x9-1772709236899 .edge-thickness-normal{stroke-width:1px;}#mermaid-tlybmpex2x9-1772709236899 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-tlybmpex2x9-1772709236899 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-tlybmpex2x9-1772709236899 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-tlybmpex2x9-1772709236899 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-tlybmpex2x9-1772709236899 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-tlybmpex2x9-1772709236899 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-tlybmpex2x9-1772709236899 .marker.cross{stroke:#22c55e;}#mermaid-tlybmpex2x9-1772709236899 svg{font-family:inherit;font-size:16px;}#mermaid-tlybmpex2x9-1772709236899 p{margin:0;}#mermaid-tlybmpex2x9-1772709236899 .label{font-family:inherit;color:#f0fdf4;}#mermaid-tlybmpex2x9-1772709236899 .cluster-label text{fill:#fafafa;}#mermaid-tlybmpex2x9-1772709236899 .cluster-label span{color:#fafafa;}#mermaid-tlybmpex2x9-1772709236899 .cluster-label span p{background-color:transparent;}#mermaid-tlybmpex2x9-1772709236899 .label text,#mermaid-tlybmpex2x9-1772709236899 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-tlybmpex2x9-1772709236899 .node rect,#mermaid-tlybmpex2x9-1772709236899 .node circle,#mermaid-tlybmpex2x9-1772709236899 .node ellipse,#mermaid-tlybmpex2x9-1772709236899 .node polygon,#mermaid-tlybmpex2x9-1772709236899 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-tlybmpex2x9-1772709236899 .rough-node .label text,#mermaid-tlybmpex2x9-1772709236899 .node .label text,#mermaid-tlybmpex2x9-1772709236899 .image-shape .label,#mermaid-tlybmpex2x9-1772709236899 .icon-shape .label{text-anchor:middle;}#mermaid-tlybmpex2x9-1772709236899 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-tlybmpex2x9-1772709236899 .rough-node .label,#mermaid-tlybmpex2x9-1772709236899 .node .label,#mermaid-tlybmpex2x9-1772709236899 .image-shape .label,#mermaid-tlybmpex2x9-1772709236899 .icon-shape .label{text-align:center;}#mermaid-tlybmpex2x9-1772709236899 .node.clickable{cursor:pointer;}#mermaid-tlybmpex2x9-1772709236899 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-tlybmpex2x9-1772709236899 .arrowheadPath{fill:#0b0b0b;}#mermaid-tlybmpex2x9-1772709236899 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-tlybmpex2x9-1772709236899 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-tlybmpex2x9-1772709236899 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-tlybmpex2x9-1772709236899 .edgeLabel p{background-color:#0a0a0a;}#mermaid-tlybmpex2x9-1772709236899 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-tlybmpex2x9-1772709236899 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-tlybmpex2x9-1772709236899 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-tlybmpex2x9-1772709236899 .cluster text{fill:#fafafa;}#mermaid-tlybmpex2x9-1772709236899 .cluster span{color:#fafafa;}#mermaid-tlybmpex2x9-1772709236899 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-tlybmpex2x9-1772709236899 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-tlybmpex2x9-1772709236899 rect.text{fill:none;stroke-width:0;}#mermaid-tlybmpex2x9-1772709236899 .icon-shape,#mermaid-tlybmpex2x9-1772709236899 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-tlybmpex2x9-1772709236899 .icon-shape p,#mermaid-tlybmpex2x9-1772709236899 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-tlybmpex2x9-1772709236899 .icon-shape rect,#mermaid-tlybmpex2x9-1772709236899 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-tlybmpex2x9-1772709236899 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-tlybmpex2x9-1772709236899 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-tlybmpex2x9-1772709236899 :root{--mermaid-font-family:inherit;}#mermaid-tlybmpex2x9-1772709236899 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-tlybmpex2x9-1772709236899 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-tlybmpex2x9-1772709236899 .red tspan{fill:#000!important;}#mermaid-tlybmpex2x9-1772709236899 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-tlybmpex2x9-1772709236899 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-tlybmpex2x9-1772709236899 .orange tspan{fill:#000!important;}#mermaid-tlybmpex2x9-1772709236899 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-tlybmpex2x9-1772709236899 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-tlybmpex2x9-1772709236899 .green tspan{fill:#000!important;}#mermaid-tlybmpex2x9-1772709236899 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-tlybmpex2x9-1772709236899 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-tlybmpex2x9-1772709236899 .purple tspan{fill:#000!important;}

Isolation Levels

Read Uncommitted

Read Committed

Repeatable Read

Serializable

Before examining each level, let us understand the anomalies they prevent:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-ikzhaakvjm-1772709236900{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-ikzhaakvjm-1772709236900 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-ikzhaakvjm-1772709236900 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-ikzhaakvjm-1772709236900 .error-icon{fill:#000000;}#mermaid-ikzhaakvjm-1772709236900 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-ikzhaakvjm-1772709236900 .edge-thickness-normal{stroke-width:1px;}#mermaid-ikzhaakvjm-1772709236900 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-ikzhaakvjm-1772709236900 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-ikzhaakvjm-1772709236900 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-ikzhaakvjm-1772709236900 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-ikzhaakvjm-1772709236900 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-ikzhaakvjm-1772709236900 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-ikzhaakvjm-1772709236900 .marker.cross{stroke:#22c55e;}#mermaid-ikzhaakvjm-1772709236900 svg{font-family:inherit;font-size:16px;}#mermaid-ikzhaakvjm-1772709236900 p{margin:0;}#mermaid-ikzhaakvjm-1772709236900 .label{font-family:inherit;color:#f0fdf4;}#mermaid-ikzhaakvjm-1772709236900 .cluster-label text{fill:#fafafa;}#mermaid-ikzhaakvjm-1772709236900 .cluster-label span{color:#fafafa;}#mermaid-ikzhaakvjm-1772709236900 .cluster-label span p{background-color:transparent;}#mermaid-ikzhaakvjm-1772709236900 .label text,#mermaid-ikzhaakvjm-1772709236900 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-ikzhaakvjm-1772709236900 .node rect,#mermaid-ikzhaakvjm-1772709236900 .node circle,#mermaid-ikzhaakvjm-1772709236900 .node ellipse,#mermaid-ikzhaakvjm-1772709236900 .node polygon,#mermaid-ikzhaakvjm-1772709236900 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-ikzhaakvjm-1772709236900 .rough-node .label text,#mermaid-ikzhaakvjm-1772709236900 .node .label text,#mermaid-ikzhaakvjm-1772709236900 .image-shape .label,#mermaid-ikzhaakvjm-1772709236900 .icon-shape .label{text-anchor:middle;}#mermaid-ikzhaakvjm-1772709236900 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-ikzhaakvjm-1772709236900 .rough-node .label,#mermaid-ikzhaakvjm-1772709236900 .node .label,#mermaid-ikzhaakvjm-1772709236900 .image-shape .label,#mermaid-ikzhaakvjm-1772709236900 .icon-shape .label{text-align:center;}#mermaid-ikzhaakvjm-1772709236900 .node.clickable{cursor:pointer;}#mermaid-ikzhaakvjm-1772709236900 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-ikzhaakvjm-1772709236900 .arrowheadPath{fill:#0b0b0b;}#mermaid-ikzhaakvjm-1772709236900 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-ikzhaakvjm-1772709236900 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-ikzhaakvjm-1772709236900 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-ikzhaakvjm-1772709236900 .edgeLabel p{background-color:#0a0a0a;}#mermaid-ikzhaakvjm-1772709236900 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-ikzhaakvjm-1772709236900 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-ikzhaakvjm-1772709236900 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-ikzhaakvjm-1772709236900 .cluster text{fill:#fafafa;}#mermaid-ikzhaakvjm-1772709236900 .cluster span{color:#fafafa;}#mermaid-ikzhaakvjm-1772709236900 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-ikzhaakvjm-1772709236900 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-ikzhaakvjm-1772709236900 rect.text{fill:none;stroke-width:0;}#mermaid-ikzhaakvjm-1772709236900 .icon-shape,#mermaid-ikzhaakvjm-1772709236900 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-ikzhaakvjm-1772709236900 .icon-shape p,#mermaid-ikzhaakvjm-1772709236900 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-ikzhaakvjm-1772709236900 .icon-shape rect,#mermaid-ikzhaakvjm-1772709236900 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-ikzhaakvjm-1772709236900 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-ikzhaakvjm-1772709236900 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-ikzhaakvjm-1772709236900 :root{--mermaid-font-family:inherit;}#mermaid-ikzhaakvjm-1772709236900 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-ikzhaakvjm-1772709236900 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-ikzhaakvjm-1772709236900 .red tspan{fill:#000!important;}#mermaid-ikzhaakvjm-1772709236900 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-ikzhaakvjm-1772709236900 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-ikzhaakvjm-1772709236900 .orange tspan{fill:#000!important;}#mermaid-ikzhaakvjm-1772709236900 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-ikzhaakvjm-1772709236900 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-ikzhaakvjm-1772709236900 .purple tspan{fill:#000!important;}

Isolation Anomalies

Dirty Read

Non-Repeatable Read

Phantom Read

Reading uncommitted changes  
from another transaction

Same query returns different  
values within a transaction

New rows appear that match  
a previously-run query

Isolation Level

Dirty Read

Non-Repeatable Read

Phantom Read

Performance

Read Uncommitted

Possible

Possible

Possible

Fastest

Read Committed (default)

No

Possible

Possible

Fast

Repeatable Read

No

No

No\*

Medium

Serializable

No

No

No

Slowest

\*PostgreSQL's Repeatable Read actually prevents phantom reads too, going beyond the SQL standard requirement.

**Read Committed (Default):** Each statement sees only committed data, but different statements within the same transaction may see different database states as other transactions commit.

Sql

```sql
1-- Transaction 1
2BEGIN;
3SELECT balance FROM accounts WHERE user_id = 1;  -- Returns 100
4-- Transaction 2 commits: UPDATE balance to 150
5SELECT balance FROM accounts WHERE user_id = 1;  -- Returns 150 (different!)
6COMMIT;
```

**Repeatable Read:** Transaction sees a consistent snapshot from start. No changes from other transactions visible.

Sql

```sql
1-- Transaction 1
2BEGIN ISOLATION LEVEL REPEATABLE READ;
3SELECT balance FROM accounts WHERE user_id = 1;  -- Returns 100
4-- Transaction 2 commits: UPDATE balance to 150
5SELECT balance FROM accounts WHERE user_id = 1;  -- Still returns 100
6COMMIT;
```

**Serializable:** The strongest level. PostgreSQL ensures transactions execute as if they ran one at a time, in some serial order. It accomplishes this by detecting potential conflicts and aborting transactions that would cause anomalies.

Sql

```sql
1-- Imagine two concurrent transactions, each computing a total
2-- and storing it. Without serializable isolation, they could
3-- each miss the other's changes.
4BEGIN ISOLATION LEVEL SERIALIZABLE;
5SELECT SUM(balance) FROM accounts;
6UPDATE totals SET sum = ...;  -- May fail with serialization error
7COMMIT;
```

When PostgreSQL detects that two serializable transactions would conflict, it aborts one with a serialization error. Your application must be prepared to retry.

### 2.3 When to Use Each Isolation Level

Use Case

Isolation Level

Why

Most read queries

Read Committed

Default, good performance

Reports requiring consistency

Repeatable Read

Consistent snapshot

Balance transfers

Repeatable Read or Serializable

Prevent inconsistencies

Inventory management

Serializable

Prevent overselling

Audit logs

Read Committed

Append-only, no conflicts

### 2.4 Handling Serialization Failures

Serializable isolation may abort transactions due to conflicts. Your application must retry:

Python

```python
1def transfer_funds(from_id, to_id, amount):
2    max_retries = 3
3    for attempt in range(max_retries):
4        try:
5            with connection.cursor() as cur:
6                cur.execute("BEGIN ISOLATION LEVEL SERIALIZABLE")
7                cur.execute("SELECT balance FROM accounts WHERE id = %s FOR UPDATE", (from_id,))
8                balance = cur.fetchone()[0]
9                if balance < amount:
10                    raise InsufficientFunds()
11                cur.execute("UPDATE accounts SET balance = balance - %s WHERE id = %s", (amount, from_id))
12                cur.execute("UPDATE accounts SET balance = balance + %s WHERE id = %s", (amount, to_id))
13                cur.execute("COMMIT")
14                return True
15        except SerializationFailure:
16            cur.execute("ROLLBACK")
17            if attempt == max_retries - 1:
18                raise
19            time.sleep(random.uniform(0.01, 0.1))  # Backoff
```

### 2.5 SELECT FOR UPDATE

For explicit row-level locking, use `SELECT FOR UPDATE`:

Sql

```sql
1BEGIN;
2SELECT * FROM inventory WHERE product_id = 123 FOR UPDATE;
3-- Row is locked, other transactions wait
4UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 123;
5COMMIT;  -- Lock released
```

**Variants:**

Lock Type

Behavior

FOR UPDATE

Exclusive lock, blocks all other locks

FOR NO KEY UPDATE

Blocks updates but allows foreign key checks

FOR SHARE

Shared lock, allows reads, blocks writes

FOR KEY SHARE

Weakest, only blocks exclusive locks

**In practice:** For critical financial operations like balance transfers, Serializable isolation eliminates race conditions at the database level. The trade-off is that your application must handle serialization failures with retry logic.

In most workloads, these failures are rare because truly conflicting transactions are uncommon. The few milliseconds of retry latency are acceptable for the guarantee that money never disappears or appears from nowhere.

# 3\. Indexing Strategies

A query without an appropriate index forces PostgreSQL to examine every row in the table. On a million-row table, that means reading millions of rows to find potentially just one.

Proper indexing transforms this from a sequential scan taking seconds to an index lookup taking milliseconds.

But indexes are not free. Each index slows down writes because PostgreSQL must update the index alongside the table. Each index consumes storage. The skill lies in knowing which indexes to create, when to use specialized index types, and how to verify your indexes actually help.

### 3.1 B-Tree Index (Default)

B-tree is the workhorse index type, suitable for the vast majority of use cases. It organizes data in a balanced tree structure that supports both equality lookups and range queries efficiently.

Sql

```sql
1CREATE INDEX idx_users_email ON users(email);
2
3-- All of these queries benefit from the B-tree index:
4SELECT * FROM users WHERE email = 'john@example.com';  -- Equality
5SELECT * FROM users WHERE email LIKE 'john%';           -- Prefix match
6SELECT * FROM users WHERE email > 'a' AND email < 'b';  -- Range
7SELECT * FROM users ORDER BY email LIMIT 10;            -- Sorting
```

**How B-tree works:**

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-kzwwu8axmoj-1772709236902{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-kzwwu8axmoj-1772709236902 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-kzwwu8axmoj-1772709236902 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-kzwwu8axmoj-1772709236902 .error-icon{fill:#000000;}#mermaid-kzwwu8axmoj-1772709236902 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-kzwwu8axmoj-1772709236902 .edge-thickness-normal{stroke-width:1px;}#mermaid-kzwwu8axmoj-1772709236902 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-kzwwu8axmoj-1772709236902 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-kzwwu8axmoj-1772709236902 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-kzwwu8axmoj-1772709236902 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-kzwwu8axmoj-1772709236902 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-kzwwu8axmoj-1772709236902 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-kzwwu8axmoj-1772709236902 .marker.cross{stroke:#22c55e;}#mermaid-kzwwu8axmoj-1772709236902 svg{font-family:inherit;font-size:16px;}#mermaid-kzwwu8axmoj-1772709236902 p{margin:0;}#mermaid-kzwwu8axmoj-1772709236902 .label{font-family:inherit;color:#f0fdf4;}#mermaid-kzwwu8axmoj-1772709236902 .cluster-label text{fill:#fafafa;}#mermaid-kzwwu8axmoj-1772709236902 .cluster-label span{color:#fafafa;}#mermaid-kzwwu8axmoj-1772709236902 .cluster-label span p{background-color:transparent;}#mermaid-kzwwu8axmoj-1772709236902 .label text,#mermaid-kzwwu8axmoj-1772709236902 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-kzwwu8axmoj-1772709236902 .node rect,#mermaid-kzwwu8axmoj-1772709236902 .node circle,#mermaid-kzwwu8axmoj-1772709236902 .node ellipse,#mermaid-kzwwu8axmoj-1772709236902 .node polygon,#mermaid-kzwwu8axmoj-1772709236902 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-kzwwu8axmoj-1772709236902 .rough-node .label text,#mermaid-kzwwu8axmoj-1772709236902 .node .label text,#mermaid-kzwwu8axmoj-1772709236902 .image-shape .label,#mermaid-kzwwu8axmoj-1772709236902 .icon-shape .label{text-anchor:middle;}#mermaid-kzwwu8axmoj-1772709236902 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-kzwwu8axmoj-1772709236902 .rough-node .label,#mermaid-kzwwu8axmoj-1772709236902 .node .label,#mermaid-kzwwu8axmoj-1772709236902 .image-shape .label,#mermaid-kzwwu8axmoj-1772709236902 .icon-shape .label{text-align:center;}#mermaid-kzwwu8axmoj-1772709236902 .node.clickable{cursor:pointer;}#mermaid-kzwwu8axmoj-1772709236902 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-kzwwu8axmoj-1772709236902 .arrowheadPath{fill:#0b0b0b;}#mermaid-kzwwu8axmoj-1772709236902 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-kzwwu8axmoj-1772709236902 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-kzwwu8axmoj-1772709236902 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-kzwwu8axmoj-1772709236902 .edgeLabel p{background-color:#0a0a0a;}#mermaid-kzwwu8axmoj-1772709236902 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-kzwwu8axmoj-1772709236902 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-kzwwu8axmoj-1772709236902 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-kzwwu8axmoj-1772709236902 .cluster text{fill:#fafafa;}#mermaid-kzwwu8axmoj-1772709236902 .cluster span{color:#fafafa;}#mermaid-kzwwu8axmoj-1772709236902 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-kzwwu8axmoj-1772709236902 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-kzwwu8axmoj-1772709236902 rect.text{fill:none;stroke-width:0;}#mermaid-kzwwu8axmoj-1772709236902 .icon-shape,#mermaid-kzwwu8axmoj-1772709236902 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-kzwwu8axmoj-1772709236902 .icon-shape p,#mermaid-kzwwu8axmoj-1772709236902 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-kzwwu8axmoj-1772709236902 .icon-shape rect,#mermaid-kzwwu8axmoj-1772709236902 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-kzwwu8axmoj-1772709236902 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-kzwwu8axmoj-1772709236902 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-kzwwu8axmoj-1772709236902 :root{--mermaid-font-family:inherit;}#mermaid-kzwwu8axmoj-1772709236902 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-kzwwu8axmoj-1772709236902 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-kzwwu8axmoj-1772709236902 .primary tspan{fill:#000!important;}#mermaid-kzwwu8axmoj-1772709236902 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-kzwwu8axmoj-1772709236902 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-kzwwu8axmoj-1772709236902 .orange tspan{fill:#000!important;}#mermaid-kzwwu8axmoj-1772709236902 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-kzwwu8axmoj-1772709236902 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-kzwwu8axmoj-1772709236902 .green tspan{fill:#000!important;}

B-Tree Index Structure

Root: M

A-L

N-Z

A,B,C

D,E,F

N,O,P

X,Y,Z

The tree structure ensures that lookups, inserts, and deletes all complete in O(log N) time. For a table with a million rows, that means roughly 20 comparisons to find any value.

### 3.2 Hash Index

When you know you will only ever need equality lookups, hash indexes offer slightly faster performance than B-trees.

The trade-off is: hash indexes cannot support range queries, ordering, or prefix matching.

Sql

```sql
1CREATE INDEX idx_users_uuid ON users USING hash(uuid);
2
3-- Uses hash index:
4SELECT * FROM users WHERE uuid = 'abc-123';
5
6-- Does NOT use hash index:
7SELECT * FROM users WHERE uuid > 'abc';  -- Falls back to seq scan
```

In practice, B-tree indexes are almost always the better choice. The performance difference is marginal, and you retain the flexibility to add range queries later without recreating indexes.

### 3.3 GIN Index (Generalized Inverted Index)

B-tree indexes work for scalar values. But what about columns containing arrays, JSON documents, or text that needs full-text search? These require a different approach.

GIN (Generalized Inverted Index) indexes are designed for composite values. They work by indexing each element within the value separately, allowing efficient queries like "find all documents containing this key" or "find all posts with this tag."

Sql

```sql
1-- JSONB indexing
2CREATE INDEX idx_products_attrs ON products USING gin(attributes);
3
4-- Query JSONB
5SELECT * FROM products WHERE attributes @> '{"color": "red"}';
6SELECT * FROM products WHERE attributes ? 'size';
7
8-- Full-text search
9CREATE INDEX idx_articles_search ON articles USING gin(to_tsvector('english', content));
10
11-- Array containment
12CREATE INDEX idx_tags ON posts USING gin(tags);
13SELECT * FROM posts WHERE tags @> ARRAY['postgresql', 'database'];
```

The trade-off with GIN indexes is write performance. When you insert or update a row, PostgreSQL must update the index for every element in the array or JSON document. For write-heavy workloads with large composite values, this overhead can be significant.

### 3.4 GiST Index (Generalized Search Tree)

Some queries ask questions that B-tree cannot answer: "Do these two time ranges overlap?" or "Which locations are within 5 kilometers of this point?" GiST indexes support these geometric and range-based queries.

Sql

```sql
1-- Range types
2CREATE INDEX idx_reservations_during ON reservations USING gist(during);
3
4-- Overlap query
5SELECT * FROM reservations
6WHERE during && '[2024-01-15, 2024-01-20]'::daterange;
7
8-- Geospatial (PostGIS)
9CREATE INDEX idx_locations_point ON locations USING gist(point);
10
11SELECT * FROM locations
12WHERE ST_DWithin(point, ST_MakePoint(-122.4, 37.8), 1000);
```

### 3.5 BRIN Index (Block Range Index)

For time-series data, there is often a natural correlation between when data was inserted and its value. Events from January are stored near other January events because they were inserted around the same time. BRIN indexes exploit this physical ordering.

Instead of indexing every row, BRIN stores the minimum and maximum values for each block of pages. When you query for a date range, PostgreSQL can skip entire blocks that cannot contain matching data.

Sql

```sql
1-- Time-series data (naturally ordered by time)
2CREATE INDEX idx_events_time ON events USING brin(created_at);
3
4-- Query benefits from BRIN
5SELECT * FROM events
6WHERE created_at >= '2024-01-01' AND created_at < '2024-01-02';
```

BRIN indexes shine when three conditions are met: the data is physically ordered by the indexed column (typically true for timestamp columns), the table is large (millions of rows), and some imprecision is acceptable (BRIN may scan a few extra blocks).

The size advantage is dramatic:

```shell
1Table: 100 million rows, timestamp column
2
3B-tree index: ~2 GB
4BRIN index:   ~200 KB  (10,000x smaller!)
```

This makes BRIN ideal for time-series data where you rarely query by exact timestamp but frequently query by time ranges.

### 3.6 Composite Indexes

Real queries often filter on multiple columns. A composite index on those columns can be far more effective than separate indexes on each.

Sql

```sql
1CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
2
3-- Uses index efficiently (leftmost columns)
4SELECT * FROM orders WHERE user_id = 123;
5SELECT * FROM orders WHERE user_id = 123 AND created_at > '2024-01-01';
6
7-- Does NOT use this index efficiently
8SELECT * FROM orders WHERE created_at > '2024-01-01';  -- Missing user_id
```

Column order matters critically. PostgreSQL can use a composite index when you query by the leftmost columns, but not when you skip them. Think of it like a phone book: you can find all Smiths, or all Smiths named John, but you cannot efficiently find all Johns regardless of last name.

The general rule: place equality columns first, then range columns. Place the most selective column (the one that eliminates the most rows) first.

### 3.7 Partial Indexes

Why index rows you will never query? Partial indexes include only a subset of table rows, making them smaller and faster.

Sql

```sql
1-- Only index active users (90% of queries target active users)
2CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';
3
4-- Only index recent orders (old orders rarely queried)
5CREATE INDEX idx_recent_orders ON orders(user_id, created_at)
6WHERE created_at > '2024-01-01';
7
8-- Only index non-null values (most phones are null)
9CREATE INDEX idx_phone ON users(phone) WHERE phone IS NOT NULL;
```

Partial indexes are particularly powerful when your queries always include a specific filter. If 90% of your queries look for active users, a partial index on active users is smaller, faster to maintain, and faster to query.

### 3.8 Covering Indexes (Index-Only Scans)

After finding a row through an index, PostgreSQL normally needs to read the actual table row to get other column values. A covering index includes additional columns, allowing PostgreSQL to answer queries entirely from the index.

Sql

```sql
1-- Include columns needed by query
2CREATE INDEX idx_orders_covering ON orders(user_id) INCLUDE (total, status);
3
4-- Index-only scan (no table access needed)
5SELECT user_id, total, status FROM orders WHERE user_id = 123;
```

This eliminates random I/O to fetch table rows, which can dramatically improve performance for queries that only need a few columns.

### 3.9 Index Selection Guide

Choosing the right index type comes down to understanding your query patterns:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-2dtr57n05rg-1772709236903{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-2dtr57n05rg-1772709236903 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-2dtr57n05rg-1772709236903 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-2dtr57n05rg-1772709236903 .error-icon{fill:#000000;}#mermaid-2dtr57n05rg-1772709236903 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-2dtr57n05rg-1772709236903 .edge-thickness-normal{stroke-width:1px;}#mermaid-2dtr57n05rg-1772709236903 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-2dtr57n05rg-1772709236903 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-2dtr57n05rg-1772709236903 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-2dtr57n05rg-1772709236903 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-2dtr57n05rg-1772709236903 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-2dtr57n05rg-1772709236903 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-2dtr57n05rg-1772709236903 .marker.cross{stroke:#22c55e;}#mermaid-2dtr57n05rg-1772709236903 svg{font-family:inherit;font-size:16px;}#mermaid-2dtr57n05rg-1772709236903 p{margin:0;}#mermaid-2dtr57n05rg-1772709236903 .label{font-family:inherit;color:#f0fdf4;}#mermaid-2dtr57n05rg-1772709236903 .cluster-label text{fill:#fafafa;}#mermaid-2dtr57n05rg-1772709236903 .cluster-label span{color:#fafafa;}#mermaid-2dtr57n05rg-1772709236903 .cluster-label span p{background-color:transparent;}#mermaid-2dtr57n05rg-1772709236903 .label text,#mermaid-2dtr57n05rg-1772709236903 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-2dtr57n05rg-1772709236903 .node rect,#mermaid-2dtr57n05rg-1772709236903 .node circle,#mermaid-2dtr57n05rg-1772709236903 .node ellipse,#mermaid-2dtr57n05rg-1772709236903 .node polygon,#mermaid-2dtr57n05rg-1772709236903 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-2dtr57n05rg-1772709236903 .rough-node .label text,#mermaid-2dtr57n05rg-1772709236903 .node .label text,#mermaid-2dtr57n05rg-1772709236903 .image-shape .label,#mermaid-2dtr57n05rg-1772709236903 .icon-shape .label{text-anchor:middle;}#mermaid-2dtr57n05rg-1772709236903 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-2dtr57n05rg-1772709236903 .rough-node .label,#mermaid-2dtr57n05rg-1772709236903 .node .label,#mermaid-2dtr57n05rg-1772709236903 .image-shape .label,#mermaid-2dtr57n05rg-1772709236903 .icon-shape .label{text-align:center;}#mermaid-2dtr57n05rg-1772709236903 .node.clickable{cursor:pointer;}#mermaid-2dtr57n05rg-1772709236903 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-2dtr57n05rg-1772709236903 .arrowheadPath{fill:#0b0b0b;}#mermaid-2dtr57n05rg-1772709236903 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-2dtr57n05rg-1772709236903 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-2dtr57n05rg-1772709236903 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-2dtr57n05rg-1772709236903 .edgeLabel p{background-color:#0a0a0a;}#mermaid-2dtr57n05rg-1772709236903 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-2dtr57n05rg-1772709236903 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-2dtr57n05rg-1772709236903 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-2dtr57n05rg-1772709236903 .cluster text{fill:#fafafa;}#mermaid-2dtr57n05rg-1772709236903 .cluster span{color:#fafafa;}#mermaid-2dtr57n05rg-1772709236903 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-2dtr57n05rg-1772709236903 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-2dtr57n05rg-1772709236903 rect.text{fill:none;stroke-width:0;}#mermaid-2dtr57n05rg-1772709236903 .icon-shape,#mermaid-2dtr57n05rg-1772709236903 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-2dtr57n05rg-1772709236903 .icon-shape p,#mermaid-2dtr57n05rg-1772709236903 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-2dtr57n05rg-1772709236903 .icon-shape rect,#mermaid-2dtr57n05rg-1772709236903 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-2dtr57n05rg-1772709236903 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-2dtr57n05rg-1772709236903 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-2dtr57n05rg-1772709236903 :root{--mermaid-font-family:inherit;}#mermaid-2dtr57n05rg-1772709236903 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-2dtr57n05rg-1772709236903 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-2dtr57n05rg-1772709236903 .primary tspan{fill:#000!important;}#mermaid-2dtr57n05rg-1772709236903 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-2dtr57n05rg-1772709236903 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-2dtr57n05rg-1772709236903 .green tspan{fill:#000!important;}#mermaid-2dtr57n05rg-1772709236903 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-2dtr57n05rg-1772709236903 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-2dtr57n05rg-1772709236903 .orange tspan{fill:#000!important;}#mermaid-2dtr57n05rg-1772709236903 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-2dtr57n05rg-1772709236903 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-2dtr57n05rg-1772709236903 .purple tspan{fill:#000!important;}#mermaid-2dtr57n05rg-1772709236903 .teal>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-2dtr57n05rg-1772709236903 .teal span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-2dtr57n05rg-1772709236903 .teal tspan{fill:#000!important;}

Equality only

Range or both

Contains element?

Full-text search?

Range overlap?

Spatial query?

Naturally ordered?

What is your query pattern?

Equality or Range?

Hash Index

B-tree Index

JSONB/Array/Text?

GIN Index

Geometric/Overlap?

GiST Index

Time-series data?

BRIN Index

Query Pattern

Index Type

Example

Equality (=)

B-tree or Hash

`WHERE email = 'x'`

Range (<, >, BETWEEN)

B-tree

`WHERE date > '2024-01-01'`

Prefix match (LIKE 'x%')

B-tree

`WHERE name LIKE 'John%'`

JSONB containment

GIN

`WHERE attrs @> '{"a":1}'`

Full-text search

GIN

`WHERE tsv @@ query`

Array containment

GIN

`WHERE tags @> ARRAY['x']`

Geometric/Range overlap

GiST

`WHERE range && other_range`

Naturally ordered data

BRIN

Time-series `created_at`

# 4\. Partitioning for Scale

As tables grow into hundreds of millions of rows, several problems emerge. Queries slow down even with indexes because the indexes themselves become massive. Maintenance operations like VACUUM take hours. Deleting old data requires scanning the entire table.

Partitioning addresses these problems by dividing a large table into smaller, more manageable pieces. From the application's perspective, it is still one table. PostgreSQL automatically routes queries to the relevant partitions and combines results transparently.

### 4.1 Why Partition?

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-26grx9bdy2-1772709236905{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-26grx9bdy2-1772709236905 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-26grx9bdy2-1772709236905 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-26grx9bdy2-1772709236905 .error-icon{fill:#000000;}#mermaid-26grx9bdy2-1772709236905 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-26grx9bdy2-1772709236905 .edge-thickness-normal{stroke-width:1px;}#mermaid-26grx9bdy2-1772709236905 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-26grx9bdy2-1772709236905 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-26grx9bdy2-1772709236905 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-26grx9bdy2-1772709236905 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-26grx9bdy2-1772709236905 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-26grx9bdy2-1772709236905 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-26grx9bdy2-1772709236905 .marker.cross{stroke:#22c55e;}#mermaid-26grx9bdy2-1772709236905 svg{font-family:inherit;font-size:16px;}#mermaid-26grx9bdy2-1772709236905 p{margin:0;}#mermaid-26grx9bdy2-1772709236905 .label{font-family:inherit;color:#f0fdf4;}#mermaid-26grx9bdy2-1772709236905 .cluster-label text{fill:#fafafa;}#mermaid-26grx9bdy2-1772709236905 .cluster-label span{color:#fafafa;}#mermaid-26grx9bdy2-1772709236905 .cluster-label span p{background-color:transparent;}#mermaid-26grx9bdy2-1772709236905 .label text,#mermaid-26grx9bdy2-1772709236905 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-26grx9bdy2-1772709236905 .node rect,#mermaid-26grx9bdy2-1772709236905 .node circle,#mermaid-26grx9bdy2-1772709236905 .node ellipse,#mermaid-26grx9bdy2-1772709236905 .node polygon,#mermaid-26grx9bdy2-1772709236905 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-26grx9bdy2-1772709236905 .rough-node .label text,#mermaid-26grx9bdy2-1772709236905 .node .label text,#mermaid-26grx9bdy2-1772709236905 .image-shape .label,#mermaid-26grx9bdy2-1772709236905 .icon-shape .label{text-anchor:middle;}#mermaid-26grx9bdy2-1772709236905 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-26grx9bdy2-1772709236905 .rough-node .label,#mermaid-26grx9bdy2-1772709236905 .node .label,#mermaid-26grx9bdy2-1772709236905 .image-shape .label,#mermaid-26grx9bdy2-1772709236905 .icon-shape .label{text-align:center;}#mermaid-26grx9bdy2-1772709236905 .node.clickable{cursor:pointer;}#mermaid-26grx9bdy2-1772709236905 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-26grx9bdy2-1772709236905 .arrowheadPath{fill:#0b0b0b;}#mermaid-26grx9bdy2-1772709236905 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-26grx9bdy2-1772709236905 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-26grx9bdy2-1772709236905 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-26grx9bdy2-1772709236905 .edgeLabel p{background-color:#0a0a0a;}#mermaid-26grx9bdy2-1772709236905 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-26grx9bdy2-1772709236905 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-26grx9bdy2-1772709236905 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-26grx9bdy2-1772709236905 .cluster text{fill:#fafafa;}#mermaid-26grx9bdy2-1772709236905 .cluster span{color:#fafafa;}#mermaid-26grx9bdy2-1772709236905 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-26grx9bdy2-1772709236905 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-26grx9bdy2-1772709236905 rect.text{fill:none;stroke-width:0;}#mermaid-26grx9bdy2-1772709236905 .icon-shape,#mermaid-26grx9bdy2-1772709236905 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-26grx9bdy2-1772709236905 .icon-shape p,#mermaid-26grx9bdy2-1772709236905 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-26grx9bdy2-1772709236905 .icon-shape rect,#mermaid-26grx9bdy2-1772709236905 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-26grx9bdy2-1772709236905 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-26grx9bdy2-1772709236905 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-26grx9bdy2-1772709236905 :root{--mermaid-font-family:inherit;}#mermaid-26grx9bdy2-1772709236905 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-26grx9bdy2-1772709236905 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-26grx9bdy2-1772709236905 .primary tspan{fill:#000!important;}#mermaid-26grx9bdy2-1772709236905 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-26grx9bdy2-1772709236905 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-26grx9bdy2-1772709236905 .green tspan{fill:#000!important;}#mermaid-26grx9bdy2-1772709236905 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-26grx9bdy2-1772709236905 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-26grx9bdy2-1772709236905 .red tspan{fill:#000!important;}

Before Partitioning

orders table  
500M rows

After Partitioning

orders table

orders\_2024\_q1  
40M rows

orders\_2024\_q2  
45M rows

orders\_2024\_q3  
50M rows

orders\_2024\_q4  
55M rows

The benefits compound as data grows:

**Query performance.** When queries filter on the partition key, PostgreSQL skips irrelevant partitions entirely. A query for January's data touches only the January partition, not the entire year.

**Maintenance efficiency.** Operations like VACUUM, REINDEX, and backup work on individual partitions. Vacuuming a 10 million row partition takes minutes; vacuuming a 500 million row table takes hours.

**Data lifecycle management.** Deleting old data becomes trivial: drop the partition. This is instantaneous regardless of partition size, compared to DELETE which must scan and log every row.

**Parallel operations.** PostgreSQL can parallelize queries across partitions, using multiple CPU cores to scan different partitions simultaneously.

### 4.2 Partition Types

PostgreSQL supports three partitioning strategies, each suited to different access patterns.

**Range Partitioning** divides data by ranges of values, most commonly dates. This is the natural choice for time-series data where queries typically filter by time periods.

Sql

```sql
1CREATE TABLE orders (
2    id BIGSERIAL,
3    user_id BIGINT,
4    total DECIMAL,
5    created_at TIMESTAMP
6) PARTITION BY RANGE (created_at);
7
8CREATE TABLE orders_2024_q1 PARTITION OF orders
9    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');
10
11CREATE TABLE orders_2024_q2 PARTITION OF orders
12    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');
```

**List Partitioning** groups data by discrete values. This works well for multi-region deployments or categorical data where queries typically target specific categories.

Sql

```sql
1CREATE TABLE customers (
2    id BIGSERIAL,
3    name TEXT,
4    region TEXT
5) PARTITION BY LIST (region);
6
7CREATE TABLE customers_us PARTITION OF customers
8    FOR VALUES IN ('us-east', 'us-west');
9
10CREATE TABLE customers_eu PARTITION OF customers
11    FOR VALUES IN ('eu-west', 'eu-central');
```

**Hash Partitioning** distributes data evenly across a fixed number of partitions using a hash function. This is useful when you have a high-cardinality column (like user\_id) and want balanced partition sizes without natural range boundaries.

Sql

```sql
1CREATE TABLE events (
2    id BIGSERIAL,
3    user_id BIGINT,
4    event_type TEXT
5) PARTITION BY HASH (user_id);
6
7CREATE TABLE events_0 PARTITION OF events
8    FOR VALUES WITH (MODULUS 4, REMAINDER 0);
9
10CREATE TABLE events_1 PARTITION OF events
11    FOR VALUES WITH (MODULUS 4, REMAINDER 1);
12-- ... partitions 2 and 3
```

Hash partitioning ensures even distribution, but unlike range or list partitioning, you cannot drop a single partition to remove a subset of data.

### 4.3 Partition Key Selection

Data Pattern

Partition Strategy

Key

Time-series (logs, events)

Range by time

created\_at (monthly/quarterly)

Multi-tenant

List or Hash

tenant\_id

Geographic

List

region

High cardinality

Hash

user\_id, entity\_id

**Guidelines:**

1.  **Partition by query pattern:** Most queries should filter on partition key
2.  **Avoid too many partitions:** Each partition has overhead. Aim for <1000 partitions.
3.  **Partition size:** Each partition should be 10GB-100GB for optimal performance

### 4.4 Partition Maintenance

**Adding partitions:**

Sql

```sql
1-- Create future partition before data arrives
2CREATE TABLE orders_2024_q3 PARTITION OF orders
3    FOR VALUES FROM ('2024-07-01') TO ('2024-10-01');
```

**Dropping old data:**

Sql

```sql
1-- Instant deletion (no row-by-row delete!)
2DROP TABLE orders_2022_q1;
3
4-- Or detach and archive
5ALTER TABLE orders DETACH PARTITION orders_2022_q1;
```

### 4.5 Partition Pruning

PostgreSQL automatically skips irrelevant partitions:

Sql

```sql
1EXPLAIN SELECT * FROM orders WHERE created_at = '2024-03-15';
2
3-- Output shows only orders_2024_q1 is scanned
4Append
5  ->  Seq Scan on orders_2024_q1
6        Filter: (created_at = '2024-03-15')
```

Without partition key in WHERE, all partitions are scanned.

### 4.6 Partitioning Limitations

*   **No global unique constraint** across partitions (use application logic)
*   **Foreign keys** must include partition key
*   **Partition key cannot be updated** (delete + insert)
*   **Query complexity** increases with partition count

# 5\. Replication and High Availability

A single PostgreSQL server is a **single point of failure**. And servers do fail. When the primary goes down, your application goes down with it.

**Replication** solves this by keeping one or more **replicas** in sync with the primary. If the primary fails, a replica can be promoted and the system can continue operating.

Replication also helps with **read scaling**. One PostgreSQL instance can serve only so many queries. By sending **read traffic** to replicas while keeping **writes** on the primary, you can scale read capacity roughly with the number of replicas.

### 5.1 Streaming Replication

PostgreSQL streaming replication continuously ships **WAL (Write-Ahead Log)** records from the primary to replicas. Every change is first written to WAL on the primary; replicas receive the WAL stream and replay it to apply the same changes locally.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-bi37uidxg9d-1772709236906{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-bi37uidxg9d-1772709236906 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-bi37uidxg9d-1772709236906 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-bi37uidxg9d-1772709236906 .error-icon{fill:#000000;}#mermaid-bi37uidxg9d-1772709236906 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-bi37uidxg9d-1772709236906 .edge-thickness-normal{stroke-width:1px;}#mermaid-bi37uidxg9d-1772709236906 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-bi37uidxg9d-1772709236906 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-bi37uidxg9d-1772709236906 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-bi37uidxg9d-1772709236906 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-bi37uidxg9d-1772709236906 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-bi37uidxg9d-1772709236906 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-bi37uidxg9d-1772709236906 .marker.cross{stroke:#22c55e;}#mermaid-bi37uidxg9d-1772709236906 svg{font-family:inherit;font-size:16px;}#mermaid-bi37uidxg9d-1772709236906 p{margin:0;}#mermaid-bi37uidxg9d-1772709236906 .label{font-family:inherit;color:#f0fdf4;}#mermaid-bi37uidxg9d-1772709236906 .cluster-label text{fill:#fafafa;}#mermaid-bi37uidxg9d-1772709236906 .cluster-label span{color:#fafafa;}#mermaid-bi37uidxg9d-1772709236906 .cluster-label span p{background-color:transparent;}#mermaid-bi37uidxg9d-1772709236906 .label text,#mermaid-bi37uidxg9d-1772709236906 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-bi37uidxg9d-1772709236906 .node rect,#mermaid-bi37uidxg9d-1772709236906 .node circle,#mermaid-bi37uidxg9d-1772709236906 .node ellipse,#mermaid-bi37uidxg9d-1772709236906 .node polygon,#mermaid-bi37uidxg9d-1772709236906 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-bi37uidxg9d-1772709236906 .rough-node .label text,#mermaid-bi37uidxg9d-1772709236906 .node .label text,#mermaid-bi37uidxg9d-1772709236906 .image-shape .label,#mermaid-bi37uidxg9d-1772709236906 .icon-shape .label{text-anchor:middle;}#mermaid-bi37uidxg9d-1772709236906 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-bi37uidxg9d-1772709236906 .rough-node .label,#mermaid-bi37uidxg9d-1772709236906 .node .label,#mermaid-bi37uidxg9d-1772709236906 .image-shape .label,#mermaid-bi37uidxg9d-1772709236906 .icon-shape .label{text-align:center;}#mermaid-bi37uidxg9d-1772709236906 .node.clickable{cursor:pointer;}#mermaid-bi37uidxg9d-1772709236906 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-bi37uidxg9d-1772709236906 .arrowheadPath{fill:#0b0b0b;}#mermaid-bi37uidxg9d-1772709236906 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-bi37uidxg9d-1772709236906 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-bi37uidxg9d-1772709236906 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-bi37uidxg9d-1772709236906 .edgeLabel p{background-color:#0a0a0a;}#mermaid-bi37uidxg9d-1772709236906 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-bi37uidxg9d-1772709236906 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-bi37uidxg9d-1772709236906 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-bi37uidxg9d-1772709236906 .cluster text{fill:#fafafa;}#mermaid-bi37uidxg9d-1772709236906 .cluster span{color:#fafafa;}#mermaid-bi37uidxg9d-1772709236906 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-bi37uidxg9d-1772709236906 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-bi37uidxg9d-1772709236906 rect.text{fill:none;stroke-width:0;}#mermaid-bi37uidxg9d-1772709236906 .icon-shape,#mermaid-bi37uidxg9d-1772709236906 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-bi37uidxg9d-1772709236906 .icon-shape p,#mermaid-bi37uidxg9d-1772709236906 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-bi37uidxg9d-1772709236906 .icon-shape rect,#mermaid-bi37uidxg9d-1772709236906 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-bi37uidxg9d-1772709236906 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-bi37uidxg9d-1772709236906 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-bi37uidxg9d-1772709236906 :root{--mermaid-font-family:inherit;}#mermaid-bi37uidxg9d-1772709236906 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-bi37uidxg9d-1772709236906 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-bi37uidxg9d-1772709236906 .primary tspan{fill:#000!important;}#mermaid-bi37uidxg9d-1772709236906 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-bi37uidxg9d-1772709236906 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-bi37uidxg9d-1772709236906 .orange tspan{fill:#000!important;}#mermaid-bi37uidxg9d-1772709236906 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-bi37uidxg9d-1772709236906 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-bi37uidxg9d-1772709236906 .green tspan{fill:#000!important;}#mermaid-bi37uidxg9d-1772709236906 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-bi37uidxg9d-1772709236906 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-bi37uidxg9d-1772709236906 .purple tspan{fill:#000!important;}

Replica Nodes

Primary Node

WAL Stream

WAL Stream

WAL Stream

Read queries

PostgreSQL Primary

WAL Sender

Replica 1

Replica 2

Replica 3

Clients

The key tradeoff is commit semantics: **when does PostgreSQL consider a transaction committed?**

**Asynchronous replication (default)** commits transactions as soon as they are durable on the primary. The primary does not wait for replicas to acknowledge. This provides the best write latency but risks data loss: if the primary fails before WAL records reach the replica, recent transactions may be lost.

**Synchronous replication** waits for at least one replica to confirm receiving and writing the WAL records before acknowledging the commit. This guarantees no data loss on primary failure but increases write latency by the round-trip time to the replica.

Sql

```sql
1-- postgresql.conf on primary
2synchronous_commit = on
3synchronous_standby_names = 'replica1'
```

For systems where data loss is unacceptable (financial transactions, for example), synchronous replication is essential despite the latency cost.

### 5.2 Replication Configuration

**Primary configuration:**

```shell
1# postgresql.conf
2wal_level = replica
3max_wal_senders = 5
4wal_keep_size = 1GB
5
6# pg_hba.conf
7host replication replica_user replica_ip/32 md5
```

**Replica setup:**

Shell

```shell
1pg_basebackup -h primary_host -D /var/lib/postgresql/data -U replica_user -P
2
3# postgresql.auto.conf (created automatically)
4primary_conninfo = 'host=primary_host port=5432 user=replica_user'
```

### 5.3 Failover Strategies

**Manual failover:** Promote a replica, then update application connection strings (or your proxy routing):

Sql

```sql
1-- On replica, promote to primary
2SELECT pg_promote();
3
4-- Update application connection strings
```

Manual failover is simple, but it’s slow and error-prone under pressure.

**Automatic failover with Patroni:**

Patroni automates leader election and failover using a distributed config store like etcd/Consul/ZooKeeper.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-qsnof0iequ-1772709236907{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-qsnof0iequ-1772709236907 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-qsnof0iequ-1772709236907 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-qsnof0iequ-1772709236907 .error-icon{fill:#000000;}#mermaid-qsnof0iequ-1772709236907 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-qsnof0iequ-1772709236907 .edge-thickness-normal{stroke-width:1px;}#mermaid-qsnof0iequ-1772709236907 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-qsnof0iequ-1772709236907 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-qsnof0iequ-1772709236907 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-qsnof0iequ-1772709236907 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-qsnof0iequ-1772709236907 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-qsnof0iequ-1772709236907 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-qsnof0iequ-1772709236907 .marker.cross{stroke:#22c55e;}#mermaid-qsnof0iequ-1772709236907 svg{font-family:inherit;font-size:16px;}#mermaid-qsnof0iequ-1772709236907 p{margin:0;}#mermaid-qsnof0iequ-1772709236907 .label{font-family:inherit;color:#f0fdf4;}#mermaid-qsnof0iequ-1772709236907 .cluster-label text{fill:#fafafa;}#mermaid-qsnof0iequ-1772709236907 .cluster-label span{color:#fafafa;}#mermaid-qsnof0iequ-1772709236907 .cluster-label span p{background-color:transparent;}#mermaid-qsnof0iequ-1772709236907 .label text,#mermaid-qsnof0iequ-1772709236907 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-qsnof0iequ-1772709236907 .node rect,#mermaid-qsnof0iequ-1772709236907 .node circle,#mermaid-qsnof0iequ-1772709236907 .node ellipse,#mermaid-qsnof0iequ-1772709236907 .node polygon,#mermaid-qsnof0iequ-1772709236907 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-qsnof0iequ-1772709236907 .rough-node .label text,#mermaid-qsnof0iequ-1772709236907 .node .label text,#mermaid-qsnof0iequ-1772709236907 .image-shape .label,#mermaid-qsnof0iequ-1772709236907 .icon-shape .label{text-anchor:middle;}#mermaid-qsnof0iequ-1772709236907 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-qsnof0iequ-1772709236907 .rough-node .label,#mermaid-qsnof0iequ-1772709236907 .node .label,#mermaid-qsnof0iequ-1772709236907 .image-shape .label,#mermaid-qsnof0iequ-1772709236907 .icon-shape .label{text-align:center;}#mermaid-qsnof0iequ-1772709236907 .node.clickable{cursor:pointer;}#mermaid-qsnof0iequ-1772709236907 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-qsnof0iequ-1772709236907 .arrowheadPath{fill:#0b0b0b;}#mermaid-qsnof0iequ-1772709236907 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-qsnof0iequ-1772709236907 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-qsnof0iequ-1772709236907 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-qsnof0iequ-1772709236907 .edgeLabel p{background-color:#0a0a0a;}#mermaid-qsnof0iequ-1772709236907 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-qsnof0iequ-1772709236907 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-qsnof0iequ-1772709236907 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-qsnof0iequ-1772709236907 .cluster text{fill:#fafafa;}#mermaid-qsnof0iequ-1772709236907 .cluster span{color:#fafafa;}#mermaid-qsnof0iequ-1772709236907 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-qsnof0iequ-1772709236907 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-qsnof0iequ-1772709236907 rect.text{fill:none;stroke-width:0;}#mermaid-qsnof0iequ-1772709236907 .icon-shape,#mermaid-qsnof0iequ-1772709236907 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-qsnof0iequ-1772709236907 .icon-shape p,#mermaid-qsnof0iequ-1772709236907 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-qsnof0iequ-1772709236907 .icon-shape rect,#mermaid-qsnof0iequ-1772709236907 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-qsnof0iequ-1772709236907 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-qsnof0iequ-1772709236907 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-qsnof0iequ-1772709236907 :root{--mermaid-font-family:inherit;}#mermaid-qsnof0iequ-1772709236907 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-qsnof0iequ-1772709236907 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-qsnof0iequ-1772709236907 .primary tspan{fill:#000!important;}#mermaid-qsnof0iequ-1772709236907 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-qsnof0iequ-1772709236907 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-qsnof0iequ-1772709236907 .orange tspan{fill:#000!important;}#mermaid-qsnof0iequ-1772709236907 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-qsnof0iequ-1772709236907 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-qsnof0iequ-1772709236907 .green tspan{fill:#000!important;}#mermaid-qsnof0iequ-1772709236907 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-qsnof0iequ-1772709236907 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-qsnof0iequ-1772709236907 .purple tspan{fill:#000!important;}

Applications

Distributed Config Store

Patroni Cluster

Via HAProxy

Primary

Replica 1

Replica 2

etcd/Consul/ZooKeeper

App Servers

Typically, applications connect through HAProxy (or a similar proxy) that always routes writes to the current leader.

**Patroni provides:**

*   Automatic leader election
*   Automatic failover (seconds, not minutes)
*   Split-brain prevention using distributed consensus
*   REST API for cluster management

### 5.4 Logical Replication

Physical (streaming) replication copies the **entire cluster**. Logical replication is more granular: it replicates **selected tables** (or sets of tables) via publications/subscriptions.

Useful for:

*   Upgrading PostgreSQL versions with minimal downtime
*   Replicating to different PostgreSQL versions
*   Selective replication (only specific tables)

Sql

```sql
1-- On primary
2CREATE PUBLICATION my_pub FOR TABLE users, orders;
3
4-- On replica
5CREATE SUBSCRIPTION my_sub
6CONNECTION 'host=primary_host dbname=mydb'
7PUBLICATION my_pub;
```

### 5.5 Read Scaling with Replicas

A common pattern is: write to primary and route read queries to replicas:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-zrlbv8hcofe-1772709236908{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-zrlbv8hcofe-1772709236908 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-zrlbv8hcofe-1772709236908 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-zrlbv8hcofe-1772709236908 .error-icon{fill:#000000;}#mermaid-zrlbv8hcofe-1772709236908 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-zrlbv8hcofe-1772709236908 .edge-thickness-normal{stroke-width:1px;}#mermaid-zrlbv8hcofe-1772709236908 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-zrlbv8hcofe-1772709236908 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-zrlbv8hcofe-1772709236908 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-zrlbv8hcofe-1772709236908 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-zrlbv8hcofe-1772709236908 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-zrlbv8hcofe-1772709236908 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-zrlbv8hcofe-1772709236908 .marker.cross{stroke:#22c55e;}#mermaid-zrlbv8hcofe-1772709236908 svg{font-family:inherit;font-size:16px;}#mermaid-zrlbv8hcofe-1772709236908 p{margin:0;}#mermaid-zrlbv8hcofe-1772709236908 .label{font-family:inherit;color:#f0fdf4;}#mermaid-zrlbv8hcofe-1772709236908 .cluster-label text{fill:#fafafa;}#mermaid-zrlbv8hcofe-1772709236908 .cluster-label span{color:#fafafa;}#mermaid-zrlbv8hcofe-1772709236908 .cluster-label span p{background-color:transparent;}#mermaid-zrlbv8hcofe-1772709236908 .label text,#mermaid-zrlbv8hcofe-1772709236908 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-zrlbv8hcofe-1772709236908 .node rect,#mermaid-zrlbv8hcofe-1772709236908 .node circle,#mermaid-zrlbv8hcofe-1772709236908 .node ellipse,#mermaid-zrlbv8hcofe-1772709236908 .node polygon,#mermaid-zrlbv8hcofe-1772709236908 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-zrlbv8hcofe-1772709236908 .rough-node .label text,#mermaid-zrlbv8hcofe-1772709236908 .node .label text,#mermaid-zrlbv8hcofe-1772709236908 .image-shape .label,#mermaid-zrlbv8hcofe-1772709236908 .icon-shape .label{text-anchor:middle;}#mermaid-zrlbv8hcofe-1772709236908 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-zrlbv8hcofe-1772709236908 .rough-node .label,#mermaid-zrlbv8hcofe-1772709236908 .node .label,#mermaid-zrlbv8hcofe-1772709236908 .image-shape .label,#mermaid-zrlbv8hcofe-1772709236908 .icon-shape .label{text-align:center;}#mermaid-zrlbv8hcofe-1772709236908 .node.clickable{cursor:pointer;}#mermaid-zrlbv8hcofe-1772709236908 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-zrlbv8hcofe-1772709236908 .arrowheadPath{fill:#0b0b0b;}#mermaid-zrlbv8hcofe-1772709236908 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-zrlbv8hcofe-1772709236908 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-zrlbv8hcofe-1772709236908 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-zrlbv8hcofe-1772709236908 .edgeLabel p{background-color:#0a0a0a;}#mermaid-zrlbv8hcofe-1772709236908 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-zrlbv8hcofe-1772709236908 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-zrlbv8hcofe-1772709236908 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-zrlbv8hcofe-1772709236908 .cluster text{fill:#fafafa;}#mermaid-zrlbv8hcofe-1772709236908 .cluster span{color:#fafafa;}#mermaid-zrlbv8hcofe-1772709236908 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-zrlbv8hcofe-1772709236908 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-zrlbv8hcofe-1772709236908 rect.text{fill:none;stroke-width:0;}#mermaid-zrlbv8hcofe-1772709236908 .icon-shape,#mermaid-zrlbv8hcofe-1772709236908 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-zrlbv8hcofe-1772709236908 .icon-shape p,#mermaid-zrlbv8hcofe-1772709236908 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-zrlbv8hcofe-1772709236908 .icon-shape rect,#mermaid-zrlbv8hcofe-1772709236908 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-zrlbv8hcofe-1772709236908 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-zrlbv8hcofe-1772709236908 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-zrlbv8hcofe-1772709236908 :root{--mermaid-font-family:inherit;}#mermaid-zrlbv8hcofe-1772709236908 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-zrlbv8hcofe-1772709236908 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-zrlbv8hcofe-1772709236908 .primary tspan{fill:#000!important;}#mermaid-zrlbv8hcofe-1772709236908 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-zrlbv8hcofe-1772709236908 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-zrlbv8hcofe-1772709236908 .orange tspan{fill:#000!important;}#mermaid-zrlbv8hcofe-1772709236908 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-zrlbv8hcofe-1772709236908 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-zrlbv8hcofe-1772709236908 .green tspan{fill:#000!important;}#mermaid-zrlbv8hcofe-1772709236908 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-zrlbv8hcofe-1772709236908 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-zrlbv8hcofe-1772709236908 .purple tspan{fill:#000!important;}

Database Cluster

Writes

Reads

Reads

Application

Load Balancer/PgBouncer

Primary  
Writes

Replica 1  
Reads

Replica 2  
Reads

**Implementation options:**

*   Application-level routing (separate connection pools)
*   PgBouncer with read/write split
*   ProxySQL or HAProxy

**Replication lag consideration:**

Replicas are usually _slightly behind_ the primary. Measure it:

Sql

```sql
1-- Check replication lag on replica
2SELECT EXTRACT(EPOCH FROM (now() - pg_last_xact_replay_timestamp())) AS lag_seconds;
```

If your app needs **read-your-writes** consistency, route a user’s reads to the primary for a short window after their writes (or until the replica has caught up).

### 5.6 High Availability Comparison

Solution

Failover Time

Data Loss Risk

Complexity

Manual failover

Minutes

Depends on lag

Low

Patroni + etcd

Seconds

Configurable

Medium

AWS RDS Multi-AZ

~60 seconds

None (sync)

Managed

Aurora PostgreSQL

~30 seconds

None

Managed

# 6\. Connection Pooling

PostgreSQL follows a **process-per-connection** model: every client connection is served by a dedicated backend process. This design gives strong isolation and predictable behavior, but it comes with real overhead:

*   each connection consumes memory (often ~10MB+ baseline, depending on workload and settings)
*   opening a new connection is relatively expensive because it involves process setup and authentication (often tens of milliseconds)

At small scale, you don’t notice. At microservices scale, it becomes a bottleneck fast.

Imagine a system with **50 services**. Each service runs **10 instances**, and each instance keeps a modest pool of **10 connections**:

*   50 × 10 × 10 = **5,000 connections**

That’s _before_ bursts, admin tools, cron jobs, migrations, and retries. PostgreSQL will struggle long before this point and even if it survives, the memory footprint is wasteful.

**Connection pooling** fixes the problem by letting thousands of client connections share a much smaller number of actual database connections. Instead of “one app connection = one DB process,” you get **multiplexing**.

### 6.1 Why Connection Pooling?

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-d0h979dh2c-1772709236909{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-d0h979dh2c-1772709236909 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-d0h979dh2c-1772709236909 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-d0h979dh2c-1772709236909 .error-icon{fill:#000000;}#mermaid-d0h979dh2c-1772709236909 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-d0h979dh2c-1772709236909 .edge-thickness-normal{stroke-width:1px;}#mermaid-d0h979dh2c-1772709236909 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-d0h979dh2c-1772709236909 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-d0h979dh2c-1772709236909 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-d0h979dh2c-1772709236909 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-d0h979dh2c-1772709236909 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-d0h979dh2c-1772709236909 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-d0h979dh2c-1772709236909 .marker.cross{stroke:#22c55e;}#mermaid-d0h979dh2c-1772709236909 svg{font-family:inherit;font-size:16px;}#mermaid-d0h979dh2c-1772709236909 p{margin:0;}#mermaid-d0h979dh2c-1772709236909 .label{font-family:inherit;color:#f0fdf4;}#mermaid-d0h979dh2c-1772709236909 .cluster-label text{fill:#fafafa;}#mermaid-d0h979dh2c-1772709236909 .cluster-label span{color:#fafafa;}#mermaid-d0h979dh2c-1772709236909 .cluster-label span p{background-color:transparent;}#mermaid-d0h979dh2c-1772709236909 .label text,#mermaid-d0h979dh2c-1772709236909 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-d0h979dh2c-1772709236909 .node rect,#mermaid-d0h979dh2c-1772709236909 .node circle,#mermaid-d0h979dh2c-1772709236909 .node ellipse,#mermaid-d0h979dh2c-1772709236909 .node polygon,#mermaid-d0h979dh2c-1772709236909 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-d0h979dh2c-1772709236909 .rough-node .label text,#mermaid-d0h979dh2c-1772709236909 .node .label text,#mermaid-d0h979dh2c-1772709236909 .image-shape .label,#mermaid-d0h979dh2c-1772709236909 .icon-shape .label{text-anchor:middle;}#mermaid-d0h979dh2c-1772709236909 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-d0h979dh2c-1772709236909 .rough-node .label,#mermaid-d0h979dh2c-1772709236909 .node .label,#mermaid-d0h979dh2c-1772709236909 .image-shape .label,#mermaid-d0h979dh2c-1772709236909 .icon-shape .label{text-align:center;}#mermaid-d0h979dh2c-1772709236909 .node.clickable{cursor:pointer;}#mermaid-d0h979dh2c-1772709236909 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-d0h979dh2c-1772709236909 .arrowheadPath{fill:#0b0b0b;}#mermaid-d0h979dh2c-1772709236909 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-d0h979dh2c-1772709236909 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-d0h979dh2c-1772709236909 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-d0h979dh2c-1772709236909 .edgeLabel p{background-color:#0a0a0a;}#mermaid-d0h979dh2c-1772709236909 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-d0h979dh2c-1772709236909 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-d0h979dh2c-1772709236909 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-d0h979dh2c-1772709236909 .cluster text{fill:#fafafa;}#mermaid-d0h979dh2c-1772709236909 .cluster span{color:#fafafa;}#mermaid-d0h979dh2c-1772709236909 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-d0h979dh2c-1772709236909 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-d0h979dh2c-1772709236909 rect.text{fill:none;stroke-width:0;}#mermaid-d0h979dh2c-1772709236909 .icon-shape,#mermaid-d0h979dh2c-1772709236909 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-d0h979dh2c-1772709236909 .icon-shape p,#mermaid-d0h979dh2c-1772709236909 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-d0h979dh2c-1772709236909 .icon-shape rect,#mermaid-d0h979dh2c-1772709236909 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-d0h979dh2c-1772709236909 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-d0h979dh2c-1772709236909 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-d0h979dh2c-1772709236909 :root{--mermaid-font-family:inherit;}#mermaid-d0h979dh2c-1772709236909 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-d0h979dh2c-1772709236909 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-d0h979dh2c-1772709236909 .red tspan{fill:#000!important;}#mermaid-d0h979dh2c-1772709236909 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-d0h979dh2c-1772709236909 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-d0h979dh2c-1772709236909 .orange tspan{fill:#000!important;}#mermaid-d0h979dh2c-1772709236909 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-d0h979dh2c-1772709236909 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-d0h979dh2c-1772709236909 .green tspan{fill:#000!important;}

Without Pooling

App 1

PostgreSQL  
1000 connections  
10GB RAM

App 2

App 3

With Pooling

App 1

PgBouncer  
Connection Pool

App 2

App 3

PostgreSQL  
100 connections  
1GB RAM

#### **Problems without pooling:**

*   1000 app servers x 10 connections = 10,000 connections
*   PostgreSQL struggles beyond a few hundred connections
*   Connection creation takes 50-100ms

### 6.2 PgBouncer

**PgBouncer** is the most widely used PostgreSQL connection pooler. It sits between applications and PostgreSQL and manages a shared pool of server connections.

#### **Pool modes:**

Mode

Description

Use Case

Session

Connection held for entire session

Session variables needed

Transaction

Connection returned after transaction

Most applications (recommended)

Statement

Connection returned after each statement

Simple queries, maximum sharing

#### **Configuration:**

```shell
1# pgbouncer.ini
2[databases]
3mydb = host=localhost port=5432 dbname=mydb
4
5[pgbouncer]
6listen_addr = 0.0.0.0
7listen_port = 6432
8pool_mode = transaction
9max_client_conn = 10000
10default_pool_size = 100
11min_pool_size = 10
12reserve_pool_size = 5
```

#### **Sizing formula**

A simple starting point:

```shell
1default_pool_size = max_connections / number_of_databases
2
3Example:
4- PostgreSQL max_connections = 200
5- 2 databases
6- default_pool_size = 100 per database
```

### 6.3 Connection Pooling Best Practices

#### **1\. Right-size your pool**

*   **Too small:** requests queue in PgBouncer → latency spikes
*   **Too large:** the database gets overwhelmed → throughput collapses

A practical starting range for many systems is **50–200 server connections per database**, but the right number depends heavily on query cost and hardware.

#### **2\. Use transaction pooling mode**

Most applications do not need session-level state. Transaction mode maximizes connection reuse and keeps PostgreSQL connection counts stable.

#### **3\. Set appropriate timeouts**

Shell

```shell
1# pgbouncer.ini
2server_idle_timeout = 600    # Close idle server connections
3client_idle_timeout = 0       # No timeout for idle clients
4query_timeout = 0             # No query timeout (set in app)
```

#### **4\. Monitor pool usage**

Sql

```sql
1-- PgBouncer admin console
2SHOW POOLS;
3SHOW STATS;
```

Common signals to watch:

Metric

Alert Threshold

Action

cl\_waiting > 0

Requests queued

Increase pool size

sv\_active near max

Pool exhausted

Increase max connections

avg\_query\_time increasing

Database slow

Optimize queries

### 6.4 Application-Level Pooling

Most frameworks include a local connection pool (per process) to avoid creating a new connection per request.

#### Example (SQLAlchemy):

Python

```python
1engine = create_engine(
2    'postgresql://user:pass@localhost/db',
3    pool_size=20,           # Normal pool size
4    max_overflow=10,        # Extra connections under load
5    pool_timeout=30,        # Wait for connection
6    pool_recycle=1800,      # Recycle connections every 30 min
7    pool_pre_ping=True      # Check connection health
8)
```

### Best practice: use both

*   **App pool**: efficient reuse within one process/instance
*   **PgBouncer**: global control across the fleet, prevents connection storms, stabilizes PostgreSQL

This combo is what keeps connection counts sane in production microservices environments.

# 7\. Common Patterns and Use Cases

Once you understand PostgreSQL fundamentals, the next level is knowing the **patterns that show up repeatedly in real systems and system design interviews**.

These patterns solve the same handful of problems again and again:

*   **Concurrency control**: prevent updates from silently overwriting each other
*   **Coordination**: ensure only one worker/process performs a critical action
*   **Idempotency**: make writes safe to retry
*   **Correctness guarantees**: prevent invalid states (like double-bookings)
*   **Operational visibility**: track changes to sensitive data

### 7.1 Optimistic Locking

When two users update the same row at the same time, the “last write wins” model can silently overwrite someone’s work. **Optimistic locking** detects this by attaching a **version number** to the row.

Sql

```sql
1-- Schema
2CREATE TABLE products (
3    id BIGSERIAL PRIMARY KEY,
4    name TEXT,
5    price DECIMAL,
6    version INT DEFAULT 1
7);
8
9-- Read
10SELECT id, name, price, version FROM products WHERE id = 123;
11-- Returns: id=123, name="Widget", price=10.00, version=5
12
13-- Update with version check
14UPDATE products
15SET price = 12.00, version = version + 1
16WHERE id = 123 AND version = 5;
17
18-- If 0 rows affected, another transaction updated it first
19-- Application should reload and retry
```

The core idea: **conflicts are detected, not prevented**. Most updates succeed with no blocking. If a conflict happens, the application must reload and retry (or show the user a merge/conflict message). This works best when conflicts are **rare**.

### 7.2 Advisory Locks

Not all coordination maps neatly to “lock a row.” Sometimes the thing you need to protect is **business logic**, not a specific record. PostgreSQL’s **advisory locks** let you define your own lock keys without locking any actual data.

Sql

```sql
1-- Acquire lock (blocks if held)
2SELECT pg_advisory_lock(hashtext('process_user_123'));
3
4-- Do work...
5
6-- Release lock
7SELECT pg_advisory_unlock(hashtext('process_user_123'));
8
9-- Non-blocking version
10SELECT pg_try_advisory_lock(hashtext('process_user_123'));
11-- Returns true if acquired, false if already held
```

**Common use cases:**

*   ensuring only one worker processes a job
*   database-level rate limiting (“only one request per user per second”)
*   preventing concurrent workflows on the same entity (e.g., “payout\_user\_123”)

### 7.3 UPSERT (INSERT ON CONFLICT)

**UPSERT** makes writes idempotent by combining insert + update into a single atomic statement. It’s a go-to tool for “safe retries.”

Sql

```sql
1-- Insert or update user
2INSERT INTO users (email, name, updated_at)
3VALUES ('john@example.com', 'John Doe', NOW())
4ON CONFLICT (email)
5DO UPDATE SET
6    name = EXCLUDED.name,
7    updated_at = EXCLUDED.updated_at;
8
9-- Insert or ignore
10INSERT INTO page_views (page_id, user_id, viewed_at)
11VALUES (123, 456, NOW())
12ON CONFLICT DO NOTHING;
```

This pattern shows up everywhere: user upserts, event ingestion, deduplication, idempotency keys.

### 7.4 RETURNING Clause

The `RETURNING` clause lets you get results from `INSERT/UPDATE/DELETE` **without an extra query. U**seful for generated IDs, timestamps, and updated values.

Sql

```sql
1-- Get inserted row with generated ID
2INSERT INTO orders (user_id, total)
3VALUES (123, 99.99)
4RETURNING id, created_at;
5
6-- Get all deleted rows
7DELETE FROM expired_sessions
8WHERE expires_at < NOW()
9RETURNING session_id, user_id;
10
11-- Get updated values
12UPDATE inventory
13SET quantity = quantity - 1
14WHERE product_id = 123
15RETURNING quantity;
```

It’s cleaner, faster, and avoids race conditions between “write” and “read back.”

### 7.5 CTEs for Complex Queries

Complex SQL often becomes unreadable when everything is nested. **CTEs (WITH clauses)** turn the query into a pipeline of named steps.

Sql

```sql
1-- Calculate user stats with multiple steps
2WITH user_orders AS (
3    SELECT user_id, COUNT(*) as order_count, SUM(total) as total_spent
4    FROM orders
5    WHERE created_at > NOW() - INTERVAL '1 year'
6    GROUP BY user_id
7),
8user_segments AS (
9    SELECT user_id,
10           CASE
11               WHEN total_spent > 10000 THEN 'platinum'
12               WHEN total_spent > 1000 THEN 'gold'
13               ELSE 'standard'
14           END as segment
15    FROM user_orders
16)
17SELECT u.id, u.name, us.segment, uo.order_count
18FROM users u
19JOIN user_orders uo ON u.id = uo.user_id
20JOIN user_segments us ON u.id = us.user_id;
```

CTEs are especially useful in analytics-style queries, reporting, and multi-step transformations.

### 7.6 Preventing Double-Booking

For booking systems (rooms, seats, appointments), the hard requirement is: **no overlapping reservations**.

PostgreSQL can enforce this at the database level using range types + an exclusion constraint.

Sql

```sql
1-- Schema with exclusion constraint
2CREATE EXTENSION btree_gist;
3
4CREATE TABLE reservations (
5    id BIGSERIAL PRIMARY KEY,
6    resource_id BIGINT NOT NULL,
7    time_range TSTZRANGE NOT NULL,
8    user_id BIGINT NOT NULL,
9    EXCLUDE USING GIST (resource_id WITH =, time_range WITH &&)
10);
11
12-- Attempt to book
13INSERT INTO reservations (resource_id, time_range, user_id)
14VALUES (
15    123,
16    '[2024-01-15 10:00, 2024-01-15 11:00)'::tstzrange,
17    456
18);
19-- Fails if overlapping reservation exists
```

This is powerful because it makes correctness **non-negotiable**. Even if two requests race, the database guarantees that only one wins.

### 7.7 Audit Logging with Triggers

For sensitive tables (accounts, permissions, payouts), you often need an immutable history of changes. Triggers can automatically log writes into an audit table.

Sql

```sql
1-- Audit table
2CREATE TABLE audit_log (
3    id BIGSERIAL PRIMARY KEY,
4    table_name TEXT,
5    operation TEXT,
6    old_data JSONB,
7    new_data JSONB,
8    changed_by TEXT,
9    changed_at TIMESTAMP DEFAULT NOW()
10);
11
12-- Trigger function
13CREATE OR REPLACE FUNCTION audit_trigger()
14RETURNS TRIGGER AS $$
15BEGIN
16    INSERT INTO audit_log (table_name, operation, old_data, new_data, changed_by)
17    VALUES (
18        TG_TABLE_NAME,
19        TG_OP,
20        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)::jsonb ELSE NULL END,
21        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW)::jsonb ELSE NULL END,
22        current_user
23    );
24    RETURN COALESCE(NEW, OLD);
25END;
26$$ LANGUAGE plpgsql;
27
28-- Attach to table
29CREATE TRIGGER accounts_audit
30AFTER INSERT OR UPDATE OR DELETE ON accounts
31FOR EACH ROW EXECUTE FUNCTION audit_trigger();
```

This gives you a consistent audit trail without relying on every application code path to “remember to log.”

### 7.8 Pattern Summary

Pattern

Use Case

Key Feature

Optimistic locking

Concurrent updates

Version column

Advisory locks

Cross-process coordination

pg\_advisory\_lock

UPSERT

Idempotent writes

ON CONFLICT

RETURNING

Avoid extra query

Get result inline

CTEs

Complex queries

Readable, composable

Exclusion constraint

Prevent overlaps

Range types

Audit triggers

Change tracking

Automatic logging

# 8\. Performance Optimization

When queries slow down, “add an index” is rarely the right first move. You need a repeatable workflow: **observe → explain → fix → verify**.

PostgreSQL gives you excellent visibility into what the database is doing, and knowing how to use these tools signals real operational maturity.

### 8.1 EXPLAIN ANALYZE

Before you tune anything, you need to know **where time is actually spent**. `EXPLAIN ANALYZE` executes the query and shows the real plan PostgreSQL used, along with timings. Adding `BUFFERS` tells you whether time is going into **CPU** or **I/O**.

Sql

```sql
1EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
2SELECT * FROM orders
3WHERE user_id = 123 AND created_at > '2024-01-01';
```

**Key metrics to examine:**

Metric

Meaning

Action

Seq Scan

Full table scan

Add index

Index Scan

Using index

Good

Bitmap Heap Scan

Index + table lookup

Normal for many rows

Nested Loop

O(n\*m) join

Check join conditions

Hash Join

Build hash table

Good for large joins

Sort

Sorting in memory/disk

Check memory settings

actual time

Real execution time

Optimize slow steps

rows

Actual vs estimated

Update statistics

A practical rule: optimize the step with the biggest **actual time**, not the one that “looks suspicious.”

### 8.2 Statistics and ANALYZE

PostgreSQL’s planner makes decisions using table statistics. When those stats are stale, PostgreSQL can pick a plan that’s objectively wrong (e.g., seq scan instead of index scan, nested loop when hash join is better).

Sql

```sql
1-- Update statistics for a table
2ANALYZE orders;
3
4-- Update statistics for entire database
5ANALYZE;
6
7-- Check statistics
8SELECT * FROM pg_stats WHERE tablename = 'orders';
```

When `ANALYZE` matters most:

*   after large bulk inserts/updates/deletes
*   after creating indexes (and then observing weird plan choices)
*   when a previously fast query suddenly becomes slow without code changes

### 8.3 Key Configuration Parameters

There are hundreds of settings, but a small set drives the majority of performance outcomes. The goal is not “max everything,” but **balance memory, I/O, and concurrency**.

```shell
1# Memory
2shared_buffers = 4GB            # 25% of RAM
3work_mem = 256MB                # Per-operation memory
4maintenance_work_mem = 1GB      # For VACUUM, CREATE INDEX
5effective_cache_size = 12GB     # OS cache estimate (75% of RAM)
6
7# Write Performance
8checkpoint_timeout = 15min
9max_wal_size = 4GB
10wal_buffers = 64MB
11
12# Query Planning
13random_page_cost = 1.1          # For SSD (default 4.0 for HDD)
14effective_io_concurrency = 200  # For SSD
15
16# Connection Management
17max_connections = 200           # Use connection pooling!
```

Two common pitfalls:

*   setting `work_mem` too high (a single query can use many work\_mem allocations)
*   increasing `max_connections` instead of fixing connection pooling

### 8.4 Vacuum and Autovacuum

PostgreSQL uses **MVCC** to provide isolation without heavy locking. Updates don’t overwrite rows in place, they create a new row version and mark the old one as obsolete.

Each row carries transaction metadata (xmin: transaction that created it, xmax: transaction that deleted it). When a transaction updates a row, it marks the old version with xmax and creates a new version with its transaction ID in xmin. Old transactions can still see the old version; new transactions see the new version.

This is great for concurrency, but it creates **dead tuples**.

If dead tuples aren’t cleaned up, you get:

*   table and index bloat
*   slower scans
*   higher cache pressure
*   worse I/O

`VACUUM` reclaims space for reuse; `ANALYZE` refreshes statistics.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-gm88abzw1md-1772709236909{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-gm88abzw1md-1772709236909 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-gm88abzw1md-1772709236909 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-gm88abzw1md-1772709236909 .error-icon{fill:#000000;}#mermaid-gm88abzw1md-1772709236909 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-gm88abzw1md-1772709236909 .edge-thickness-normal{stroke-width:1px;}#mermaid-gm88abzw1md-1772709236909 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-gm88abzw1md-1772709236909 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-gm88abzw1md-1772709236909 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-gm88abzw1md-1772709236909 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-gm88abzw1md-1772709236909 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-gm88abzw1md-1772709236909 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-gm88abzw1md-1772709236909 .marker.cross{stroke:#22c55e;}#mermaid-gm88abzw1md-1772709236909 svg{font-family:inherit;font-size:16px;}#mermaid-gm88abzw1md-1772709236909 p{margin:0;}#mermaid-gm88abzw1md-1772709236909 .label{font-family:inherit;color:#f0fdf4;}#mermaid-gm88abzw1md-1772709236909 .cluster-label text{fill:#fafafa;}#mermaid-gm88abzw1md-1772709236909 .cluster-label span{color:#fafafa;}#mermaid-gm88abzw1md-1772709236909 .cluster-label span p{background-color:transparent;}#mermaid-gm88abzw1md-1772709236909 .label text,#mermaid-gm88abzw1md-1772709236909 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-gm88abzw1md-1772709236909 .node rect,#mermaid-gm88abzw1md-1772709236909 .node circle,#mermaid-gm88abzw1md-1772709236909 .node ellipse,#mermaid-gm88abzw1md-1772709236909 .node polygon,#mermaid-gm88abzw1md-1772709236909 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-gm88abzw1md-1772709236909 .rough-node .label text,#mermaid-gm88abzw1md-1772709236909 .node .label text,#mermaid-gm88abzw1md-1772709236909 .image-shape .label,#mermaid-gm88abzw1md-1772709236909 .icon-shape .label{text-anchor:middle;}#mermaid-gm88abzw1md-1772709236909 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-gm88abzw1md-1772709236909 .rough-node .label,#mermaid-gm88abzw1md-1772709236909 .node .label,#mermaid-gm88abzw1md-1772709236909 .image-shape .label,#mermaid-gm88abzw1md-1772709236909 .icon-shape .label{text-align:center;}#mermaid-gm88abzw1md-1772709236909 .node.clickable{cursor:pointer;}#mermaid-gm88abzw1md-1772709236909 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-gm88abzw1md-1772709236909 .arrowheadPath{fill:#0b0b0b;}#mermaid-gm88abzw1md-1772709236909 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-gm88abzw1md-1772709236909 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-gm88abzw1md-1772709236909 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-gm88abzw1md-1772709236909 .edgeLabel p{background-color:#0a0a0a;}#mermaid-gm88abzw1md-1772709236909 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-gm88abzw1md-1772709236909 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-gm88abzw1md-1772709236909 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-gm88abzw1md-1772709236909 .cluster text{fill:#fafafa;}#mermaid-gm88abzw1md-1772709236909 .cluster span{color:#fafafa;}#mermaid-gm88abzw1md-1772709236909 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-gm88abzw1md-1772709236909 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-gm88abzw1md-1772709236909 rect.text{fill:none;stroke-width:0;}#mermaid-gm88abzw1md-1772709236909 .icon-shape,#mermaid-gm88abzw1md-1772709236909 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-gm88abzw1md-1772709236909 .icon-shape p,#mermaid-gm88abzw1md-1772709236909 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-gm88abzw1md-1772709236909 .icon-shape rect,#mermaid-gm88abzw1md-1772709236909 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-gm88abzw1md-1772709236909 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-gm88abzw1md-1772709236909 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-gm88abzw1md-1772709236909 :root{--mermaid-font-family:inherit;}#mermaid-gm88abzw1md-1772709236909 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-gm88abzw1md-1772709236909 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-gm88abzw1md-1772709236909 .green tspan{fill:#000!important;}#mermaid-gm88abzw1md-1772709236909 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-gm88abzw1md-1772709236909 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-gm88abzw1md-1772709236909 .red tspan{fill:#000!important;}#mermaid-gm88abzw1md-1772709236909 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-gm88abzw1md-1772709236909 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-gm88abzw1md-1772709236909 .orange tspan{fill:#000!important;}

After VACUUM

Row v2: price=15  
xmin=200, xmax=∞

(Dead row reclaimed)

After UPDATE (before VACUUM)

Row v1: price=10  
xmin=100, xmax=200

Row v2: price=15  
xmin=200, xmax=∞

Before UPDATE

Row v1: price=10  
xmin=100, xmax=∞

**Autovacuum settings:**

```shell
1autovacuum = on
2autovacuum_vacuum_scale_factor = 0.1    # VACUUM after 10% dead tuples
3autovacuum_analyze_scale_factor = 0.05  # ANALYZE after 5% changes
4autovacuum_vacuum_cost_limit = 1000     # How aggressive
```

**Manual vacuum for large tables:**

Sql

```sql
1-- Regular vacuum (reclaims space for reuse)
2VACUUM orders;
3
4-- Full vacuum (reclaims space to OS, locks table)
5VACUUM FULL orders;  -- Avoid in production!
6
7-- Analyze at the same time
8VACUUM ANALYZE orders;
```

### 8.5 Common Performance Anti-Patterns

Anti-Pattern

Problem

Solution

SELECT \*

Unnecessary data transfer

Select only needed columns

N+1 queries

Many small queries

Use JOINs or batch queries

Missing indexes

Slow queries

Add appropriate indexes

Over-indexing

Slow writes

Remove unused indexes

Long transactions

Lock contention

Keep transactions short

Large IN lists

Poor optimization

Use ANY(ARRAY\[...\]) or temp table

OFFSET pagination

Scans skipped rows

Use keyset pagination

**Keyset pagination (cursor-based):**

Sql

```sql
1-- Bad: OFFSET pagination
2SELECT * FROM products ORDER BY id LIMIT 20 OFFSET 10000;
3-- Must scan 10,000 rows to skip them
4
5-- Good: Keyset pagination
6SELECT * FROM products WHERE id > 12345 ORDER BY id LIMIT 20;
7-- Directly seeks to correct position
```

### 8.6 Monitoring Queries

Optimization isn’t a one-time event. You need continuous visibility into slow queries, active queries, and bloat.

Sql

```sql
1-- Slow queries (requires pg_stat_statements extension)
2SELECT query, calls, mean_time, total_time
3FROM pg_stat_statements
4ORDER BY mean_time DESC
5LIMIT 20;
6
7-- Currently running queries
8SELECT pid, now() - pg_stat_activity.query_start AS duration, query
9FROM pg_stat_activity
10WHERE state = 'active'
11ORDER BY duration DESC;
12
13-- Table bloat (dead tuples)
14SELECT relname, n_dead_tup, n_live_tup,
15       round(n_dead_tup * 100.0 / nullif(n_live_tup, 0), 2) as dead_pct
16FROM pg_stat_user_tables
17ORDER BY n_dead_tup DESC;
```

A good mental model: **slow queries, bad plans, and bloat** are usually the three pillars of PostgreSQL performance work.

**In practice:** A methodical approach to optimization starts with identifying which queries matter. Enable pg\_stat\_statements to find queries consuming the most total time (not just the slowest individual executions, a query running 10,000 times at 50ms each matters more than one running once at 2 seconds).

For the top offenders, use EXPLAIN ANALYZE to understand execution plans, then add indexes or rewrite queries as needed. Monitor the impact after changes to verify improvements.

# 9\. PostgreSQL vs Other Databases

Interviewers frequently ask why you chose PostgreSQL over alternatives. The answer should not be "it is what I know" or "it is popular."

Instead, demonstrate understanding of how different databases make different trade-offs, and why those trade-offs matter for the specific problem.

### 9.1 PostgreSQL vs MySQL

Both are mature, widely-deployed relational databases. The choice often depends on specific requirements and organizational context.

Aspect

PostgreSQL

MySQL

SQL compliance

Full SQL:2016

Partial

JSON support

JSONB (indexed)

JSON (limited indexing)

Concurrency

MVCC

MVCC (InnoDB)

Replication

Streaming, Logical

Binary log

Extensions

Rich ecosystem

Limited

Full-text search

Built-in

Limited

Data integrity

Strict by default

Relaxed by default

**Choose PostgreSQL:** Complex queries, JSON data, strict data integrity.

**Choose MySQL:** Simpler needs, existing MySQL expertise, certain hosted services.

### 9.2 PostgreSQL vs MongoDB

Aspect

PostgreSQL

MongoDB

Data model

Relational + JSONB

Document

Query flexibility

Full SQL + JSONB queries

Rich query language

Transactions

Full ACID

ACID (since 4.0)

Schema

Enforced (flexible with JSONB)

Flexible

JOINs

Native

$lookup (limited)

Scaling

Vertical + manual sharding

Native sharding

**Choose PostgreSQL:** Complex relationships, need JOINs, ACID critical.

**Choose MongoDB:** Schema-less documents, horizontal scaling, rapid prototyping.

### 9.3 PostgreSQL vs DynamoDB

Aspect

PostgreSQL

DynamoDB

Model

Relational

Key-value/Document

Queries

Flexible SQL

Primary key + indexes

Scaling

Vertical (manual sharding)

Automatic horizontal

Consistency

Strong

Eventually consistent (or strong)

Cost model

Infrastructure

Capacity/request based

Operations

Self-managed

Fully managed

**Choose PostgreSQL:** Complex queries, transactions, existing SQL expertise.

**Choose DynamoDB:** Automatic scaling, simple access patterns, serverless.

### 9.4 Decision Matrix

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-p5n5py45xx-1772709236911{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-p5n5py45xx-1772709236911 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-p5n5py45xx-1772709236911 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-p5n5py45xx-1772709236911 .error-icon{fill:#000000;}#mermaid-p5n5py45xx-1772709236911 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-p5n5py45xx-1772709236911 .edge-thickness-normal{stroke-width:1px;}#mermaid-p5n5py45xx-1772709236911 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-p5n5py45xx-1772709236911 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-p5n5py45xx-1772709236911 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-p5n5py45xx-1772709236911 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-p5n5py45xx-1772709236911 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-p5n5py45xx-1772709236911 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-p5n5py45xx-1772709236911 .marker.cross{stroke:#22c55e;}#mermaid-p5n5py45xx-1772709236911 svg{font-family:inherit;font-size:16px;}#mermaid-p5n5py45xx-1772709236911 p{margin:0;}#mermaid-p5n5py45xx-1772709236911 .label{font-family:inherit;color:#f0fdf4;}#mermaid-p5n5py45xx-1772709236911 .cluster-label text{fill:#fafafa;}#mermaid-p5n5py45xx-1772709236911 .cluster-label span{color:#fafafa;}#mermaid-p5n5py45xx-1772709236911 .cluster-label span p{background-color:transparent;}#mermaid-p5n5py45xx-1772709236911 .label text,#mermaid-p5n5py45xx-1772709236911 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-p5n5py45xx-1772709236911 .node rect,#mermaid-p5n5py45xx-1772709236911 .node circle,#mermaid-p5n5py45xx-1772709236911 .node ellipse,#mermaid-p5n5py45xx-1772709236911 .node polygon,#mermaid-p5n5py45xx-1772709236911 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-p5n5py45xx-1772709236911 .rough-node .label text,#mermaid-p5n5py45xx-1772709236911 .node .label text,#mermaid-p5n5py45xx-1772709236911 .image-shape .label,#mermaid-p5n5py45xx-1772709236911 .icon-shape .label{text-anchor:middle;}#mermaid-p5n5py45xx-1772709236911 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-p5n5py45xx-1772709236911 .rough-node .label,#mermaid-p5n5py45xx-1772709236911 .node .label,#mermaid-p5n5py45xx-1772709236911 .image-shape .label,#mermaid-p5n5py45xx-1772709236911 .icon-shape .label{text-align:center;}#mermaid-p5n5py45xx-1772709236911 .node.clickable{cursor:pointer;}#mermaid-p5n5py45xx-1772709236911 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-p5n5py45xx-1772709236911 .arrowheadPath{fill:#0b0b0b;}#mermaid-p5n5py45xx-1772709236911 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-p5n5py45xx-1772709236911 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-p5n5py45xx-1772709236911 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-p5n5py45xx-1772709236911 .edgeLabel p{background-color:#0a0a0a;}#mermaid-p5n5py45xx-1772709236911 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-p5n5py45xx-1772709236911 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-p5n5py45xx-1772709236911 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-p5n5py45xx-1772709236911 .cluster text{fill:#fafafa;}#mermaid-p5n5py45xx-1772709236911 .cluster span{color:#fafafa;}#mermaid-p5n5py45xx-1772709236911 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-p5n5py45xx-1772709236911 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-p5n5py45xx-1772709236911 rect.text{fill:none;stroke-width:0;}#mermaid-p5n5py45xx-1772709236911 .icon-shape,#mermaid-p5n5py45xx-1772709236911 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-p5n5py45xx-1772709236911 .icon-shape p,#mermaid-p5n5py45xx-1772709236911 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-p5n5py45xx-1772709236911 .icon-shape rect,#mermaid-p5n5py45xx-1772709236911 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-p5n5py45xx-1772709236911 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-p5n5py45xx-1772709236911 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-p5n5py45xx-1772709236911 :root{--mermaid-font-family:inherit;}#mermaid-p5n5py45xx-1772709236911 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-p5n5py45xx-1772709236911 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-p5n5py45xx-1772709236911 .primary tspan{fill:#000!important;}#mermaid-p5n5py45xx-1772709236911 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-p5n5py45xx-1772709236911 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-p5n5py45xx-1772709236911 .green tspan{fill:#000!important;}#mermaid-p5n5py45xx-1772709236911 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-p5n5py45xx-1772709236911 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-p5n5py45xx-1772709236911 .orange tspan{fill:#000!important;}#mermaid-p5n5py45xx-1772709236911 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-p5n5py45xx-1772709236911 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-p5n5py45xx-1772709236911 .purple tspan{fill:#000!important;}

Yes

No

Yes

No

Yes

No

Yes

No

What are your needs?

Need complex SQL/JOINs?

Data fits single node?

Need horizontal scale?

PostgreSQL

CockroachDB or Citus

DynamoDB/Cassandra

Schema flexibility priority?

MongoDB

# Summary

PostgreSQL excels when your system needs complex queries across related data, strong consistency guarantees, and the flexibility to evolve with changing requirements. The depth of understanding you demonstrate about PostgreSQL's capabilities and trade-offs signals to interviewers that you can make sound database decisions under real-world constraints.

#### **Choose PostgreSQL deliberately**

Match its strengths (ACID transactions, complex queries, JSONB flexibility) to your requirements. Acknowledge its limitations (horizontal scaling complexity, connection overhead) and explain how you would address them.

#### **Understand transaction isolation deeply**

Know that Read Committed suffices for most workloads, that Serializable prevents all anomalies but requires retry logic, and that the right choice depends on the specific consistency requirements of each operation.

#### **Apply indexing strategically**

B-tree handles most cases, GIN enables efficient JSONB and array queries, BRIN minimizes storage for time-ordered data. The skill is matching index type to query pattern and understanding the write overhead trade-off.

#### **Partition for operational sanity**

Large tables become unwieldy not just for queries but for maintenance operations. Partitioning by time enables fast time-based queries, instant old-data deletion, and manageable maintenance windows.

#### **Design for failure**

Single-node PostgreSQL is a single point of failure. Streaming replication provides read scaling and standby capacity. Synchronous replication guarantees durability. Patroni automates failover. The choice between configurations is a trade-off between latency, durability, and operational complexity.

#### **Respect connection limits**

PostgreSQL's process-per-connection model means connection pooling is not optional at scale. PgBouncer with transaction pooling is the standard solution.

#### **Apply patterns precisely**

Optimistic locking, advisory locks, UPSERT, and exclusion constraints each solve specific problems. Using the right pattern shows you understand both the problem and PostgreSQL's capabilities.

When you propose PostgreSQL in an interview, the strength of your answer lies not in claiming it is the best database, but in articulating exactly why it fits the problem, what trade-offs you are accepting, and how you would operate it at scale.

# References

*   [PostgreSQL Documentation](https://www.postgresql.org/docs/current/) - Official documentation covering all PostgreSQL features
*   [Use The Index, Luke](https://use-the-index-luke.com/) - Comprehensive guide to database indexing
*   [PostgreSQL High Availability with Patroni](https://patroni.readthedocs.io/) - Documentation for Patroni HA solution
*   [PgBouncer Documentation](https://www.pgbouncer.org/) - Connection pooler configuration and best practices
*   [Designing Data-Intensive Applications](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/) - Martin Kleppmann's book with excellent database coverage
*   [How Instagram Scaled PostgreSQL](https://instagram-engineering.com/handling-growth-with-postgres-5-tips-from-instagram-d5b89de2aba0) - Real-world scaling case study

# Quiz

## PostgreSQL Quiz

1 / 20

Multiple Choice

In a common production setup, why put PgBouncer in front of PostgreSQL?

ATo reduce connection overhead by pooling database connectionsBTo perform automatic multi-region failover for the primaryCTo replace the need for application-side retries on errorsDTo turn SQL queries into a document-style query format

PreviousNext

Launching soon
