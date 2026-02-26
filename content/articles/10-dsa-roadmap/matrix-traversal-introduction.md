---
title: Matrix Traversal
description: Master Matrix Traversal in the Graphs module. Comprehensive guide
  and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

A matrix is a 2D array organized into rows and columns\. In programming, we typically represent it as an array of arrays, where the first index selects the row and the second index selects the column\.

Java

```java
// A 3x4 matrix (3 rows, 4 columns)
int[][] matrix = {
   {1, 2, 3, 4},    // Row 0
   {5, 6, 7, 8},    // Row 1
   {9, 10, 11, 12}  // Row 2
};

// Accessing element at row 1, column 2
int value = matrix[1][2];  // Returns 7
```

The dimensions are typically denoted as `m x n` where m is the number of rows and n is the number of columns\. Be careful with the terminology: rows go horizontally \(left to right\) and columns go vertically \(top to bottom\)\.

In the diagram, the purple cell shows position \(1, 2\) which contains the value 7\. Notice that indices are zero\-based: the first row is row 0, and the first column is column 0\.

# Matrix as an Implicit Graph

The key insight for matrix traversal is that a grid is really just a graph in disguise\. Each cell is a node, and adjacent cells \(up, down, left, right\) are connected by edges\. This mental model unlocks all the graph traversal algorithms\.

*   **Nodes**: Each cell \(i, j\) is a node
*   **Edges**: Connect to adjacent cells \(typically 4 or 8 neighbors\)
*   **No explicit edge list**: Neighbors are computed on demand using direction arrays

This implicit representation is more memory\-efficient than storing an adjacency list, and it allows us to use the grid coordinates directly for indexing\.

# Direction Arrays: The Key to Grid Navigation

The most important technique for matrix traversal is the **direction array**\. Instead of writing separate logic for moving up, down, left, and right, we encode all directions in arrays and iterate through them\.

### 4\-Directional Movement

For problems where you can move up, down, left, and right:

Java

```java
// Direction arrays for 4 neighbors
int[] rowDir = {-1, 1, 0, 0};  // up, down, same, same
int[] colDir = {0, 0, -1, 1};  // same, same, left, right

// Or as a 2D array
int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
```

\.mermaid\-diagram\-container text, \.mermaid\-diagram\-container \.nodeLabel, \.mermaid\-diagram\-container \.edgeLabel, \.mermaid\-diagram\-container \.label, \.mermaid\-diagram\-container tspan \{ font\-weight: 600 \!important; \} \.mermaid\-diagram\-container \.flowchart\-link, \.mermaid\-diagram\-container \.edge\-pattern\-solid, \.mermaid\-diagram\-container \.messageLine0, \.mermaid\-diagram\-container \.messageLine1, \.mermaid\-diagram\-container path\.path \{ stroke\-width: 2px \!important; \} \.mermaid\-diagram\-container marker path \{ stroke\-width: 1px \!important; \} /\* Fix text cutoff in nodes \*/ \.mermaid\-diagram\-container svg \{ overflow: visible \!important; \} \.mermaid\-diagram\-container svg \* \{ overflow: visible \!important; \} \.mermaid\-diagram\-container foreignObject \{ overflow: visible \!important; \} \.mermaid\-diagram\-container foreignObject > \* \{ overflow: visible \!important; \} \.mermaid\-diagram\-container \.node, \.mermaid\-diagram\-container \.node \* \{ overflow: visible \!important; \} /\* Fix text centering in nodes \*/ \.mermaid\-diagram\-container foreignObject > div \{ display: flex \!important; justify\-content: center \!important; align\-items: center \!important; height: 100% \!important; \} /\* Fix text wrapping in subgraph/cluster labels \*/ \.mermaid\-diagram\-container \.cluster\-label, \.mermaid\-diagram\-container \.cluster\-label foreignObject, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > span, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > p, \.mermaid\-diagram\-container \.cluster\-label text, \.mermaid\-diagram\-container \.cluster\-label tspan \{ white\-space: nowrap \!important; overflow: visible \!important; \} /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ \.mermaid\-diagram\-container \.cluster\-label \{ z\-index: 10 \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject \{ transform: translateY\(\-8px\) \!important; overflow: visible \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject > div \{ display: flex \!important; justify\-content: center \!important; align\-items: center \!important; text\-align: center \!important; width: 100% \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > span, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > p \{ background\-color: var\(\-\-background, \#000\) \!important; padding: 2px 6px \!important; border\-radius: 3px \!important; font\-size: 16px \!important; font\-weight: 600 \!important; white\-space: nowrap \!important; \} /\* Sequence diagram note fix \- prevent text overflow \*/ \.mermaid\-diagram\-container \.note rect, \.mermaid\-diagram\-container rect\.note \{ rx: 5px \!important; ry: 5px \!important; \} \.mermaid\-diagram\-container \.note text, \.mermaid\-diagram\-container \.noteText \{ font\-size: 14px \!important; dominant\-baseline: central \!important; \} /\* State diagram specific styles \*/ \.mermaid\-state\-container svg \{ overflow: visible \!important; width: 100% \!important; height: auto \!important; max\-width: 100% \!important; \} \.mermaid\-state\-container \.statediagram\-state, \.mermaid\-state\-container \.stateGroup, \.mermaid\-state\-container \.state \{ overflow: visible \!important; \} \.mermaid\-state\-container text, \.mermaid\-state\-container \.nodeLabel, \.mermaid\-state\-container \.state\-text, \.mermaid\-state\-container tspan \{ white\-space: nowrap \!important; font\-size: 14px \!important; overflow: visible \!important; \} /\* Dark mode text colors for state diagrams \- only cluster labels, not state node text \*/ \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label text, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label tspan, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject span, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject p, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject div \{ fill: \#f0fdf4 \!important; color: \#f0fdf4 \!important; \} \.mermaid\-state\-container \.edgeLabel, \.mermaid\-state\-container \.edge\-label \{ white\-space: nowrap \!important; font\-size: 13px \!important; background\-color: transparent \!important; overflow: visible \!important; \} /\* Dark mode edge label colors \*/ \.dark \.mermaid\-state\-container \.edgeLabel, \.dark \.mermaid\-state\-container \.edgeLabel span, \.dark \.mermaid\-state\-container \.edge\-label \{ fill: \#fafafa \!important; color: \#fafafa \!important; \} \.mermaid\-state\-container \.transition, \.mermaid\-state\-container path\.transition \{ stroke\-width: 2px \!important; \} /\* Fix composite state title vertical positioning \*/ \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label text, \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label tspan \{ dominant\-baseline: middle \!important; alignment\-baseline: middle \!important; \}

\#mermaid\-a4m9d7y1sib\-1772123867393\{font\-family:inherit;font\-size:16px;fill:\#fafafa;\}@keyframes edge\-animation\-frame\{from\{stroke\-dashoffset:0;\}\}@keyframes dash\{to\{stroke\-dashoffset:0;\}\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.edge\-animation\-slow\{stroke\-dasharray:9,5\!important;stroke\-dashoffset:900;animation:dash 50s linear infinite;stroke\-linecap:round;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.edge\-animation\-fast\{stroke\-dasharray:9,5\!important;stroke\-dashoffset:900;animation:dash 20s linear infinite;stroke\-linecap:round;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.error\-icon\{fill:\#000000;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.error\-text\{fill:\#fafafa;stroke:\#fafafa;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.edge\-thickness\-normal\{stroke\-width:1px;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.edge\-thickness\-thick\{stroke\-width:3\.5px;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.edge\-pattern\-solid\{stroke\-dasharray:0;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.edge\-thickness\-invisible\{stroke\-width:0;fill:none;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.edge\-pattern\-dashed\{stroke\-dasharray:3;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.edge\-pattern\-dotted\{stroke\-dasharray:2;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.marker\{fill:\#22c55e;stroke:\#22c55e;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.marker\.cross\{stroke:\#22c55e;\}\#mermaid\-a4m9d7y1sib\-1772123867393 svg\{font\-family:inherit;font\-size:16px;\}\#mermaid\-a4m9d7y1sib\-1772123867393 p\{margin:0;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.label\{font\-family:inherit;color:\#f0fdf4;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.cluster\-label text\{fill:\#fafafa;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.cluster\-label span\{color:\#fafafa;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.cluster\-label span p\{background\-color:transparent;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.label text,\#mermaid\-a4m9d7y1sib\-1772123867393 span\{fill:\#f0fdf4;color:\#f0fdf4;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.node rect,\#mermaid\-a4m9d7y1sib\-1772123867393 \.node circle,\#mermaid\-a4m9d7y1sib\-1772123867393 \.node ellipse,\#mermaid\-a4m9d7y1sib\-1772123867393 \.node polygon,\#mermaid\-a4m9d7y1sib\-1772123867393 \.node path\{fill:\#166534;stroke:\#22c55e;stroke\-width:1px;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.rough\-node \.label text,\#mermaid\-a4m9d7y1sib\-1772123867393 \.node \.label text,\#mermaid\-a4m9d7y1sib\-1772123867393 \.image\-shape \.label,\#mermaid\-a4m9d7y1sib\-1772123867393 \.icon\-shape \.label\{text\-anchor:middle;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.node \.katex path\{fill:\#000;stroke:\#000;stroke\-width:1px;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.rough\-node \.label,\#mermaid\-a4m9d7y1sib\-1772123867393 \.node \.label,\#mermaid\-a4m9d7y1sib\-1772123867393 \.image\-shape \.label,\#mermaid\-a4m9d7y1sib\-1772123867393 \.icon\-shape \.label\{text\-align:center;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.node\.clickable\{cursor:pointer;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.root \.anchor path\{fill:\#22c55e\!important;stroke\-width:0;stroke:\#22c55e;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.arrowheadPath\{fill:\#0b0b0b;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.edgePath \.path\{stroke:\#22c55e;stroke\-width:2\.0px;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.flowchart\-link\{stroke:\#22c55e;fill:none;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.edgeLabel\{background\-color:\#0a0a0a;text\-align:center;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.edgeLabel p\{background\-color:\#0a0a0a;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.edgeLabel rect\{opacity:0\.5;background\-color:\#0a0a0a;fill:\#0a0a0a;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.labelBkg\{background\-color:rgba\(10, 10, 10, 0\.5\);\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.cluster rect\{fill:\#1a1a1a;stroke:\#000000;stroke\-width:1px;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.cluster text\{fill:\#fafafa;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.cluster span\{color:\#fafafa;\}\#mermaid\-a4m9d7y1sib\-1772123867393 div\.mermaidTooltip\{position:absolute;text\-align:center;max\-width:200px;padding:2px;font\-family:inherit;font\-size:12px;background:\#000000;border:1px solid \#262626;border\-radius:2px;pointer\-events:none;z\-index:100;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.flowchartTitleText\{text\-anchor:middle;font\-size:18px;fill:\#fafafa;\}\#mermaid\-a4m9d7y1sib\-1772123867393 rect\.text\{fill:none;stroke\-width:0;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.icon\-shape,\#mermaid\-a4m9d7y1sib\-1772123867393 \.image\-shape\{background\-color:\#0a0a0a;text\-align:center;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.icon\-shape p,\#mermaid\-a4m9d7y1sib\-1772123867393 \.image\-shape p\{background\-color:\#0a0a0a;padding:2px;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.icon\-shape rect,\#mermaid\-a4m9d7y1sib\-1772123867393 \.image\-shape rect\{opacity:0\.5;background\-color:\#0a0a0a;fill:\#0a0a0a;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.label\-icon\{display:inline\-block;height:1em;overflow:visible;vertical\-align:\-0\.125em;\}\#mermaid\-a4m9d7y1sib\-1772123867393 \.node \.label\-icon path\{fill:currentColor;stroke:revert;stroke\-width:revert;\}\#mermaid\-a4m9d7y1sib\-1772123867393 :root\{\-\-mermaid\-font\-family:inherit;\}

\(\-1, 0\)  
Up

Current  
\(r, c\)

\(\+1, 0\)  
Down

\(0, \-1\)  
Left

\(0, \+1\)  
Right

### 8\-Directional Movement

For problems that include diagonal movement:

Java

```java
// Direction arrays for 8 neighbors (including diagonals)
int[][] directions = {
   {-1, 0},  // up
   {1, 0},   // down
   {0, -1},  // left
   {0, 1},   // right
   {-1, -1}, // up-left
   {-1, 1},  // up-right
   {1, -1},  // down-left
   {1, 1}    // down-right
};
```

\.mermaid\-diagram\-container text, \.mermaid\-diagram\-container \.nodeLabel, \.mermaid\-diagram\-container \.edgeLabel, \.mermaid\-diagram\-container \.label, \.mermaid\-diagram\-container tspan \{ font\-weight: 600 \!important; \} \.mermaid\-diagram\-container \.flowchart\-link, \.mermaid\-diagram\-container \.edge\-pattern\-solid, \.mermaid\-diagram\-container \.messageLine0, \.mermaid\-diagram\-container \.messageLine1, \.mermaid\-diagram\-container path\.path \{ stroke\-width: 2px \!important; \} \.mermaid\-diagram\-container marker path \{ stroke\-width: 1px \!important; \} /\* Fix text cutoff in nodes \*/ \.mermaid\-diagram\-container svg \{ overflow: visible \!important; \} \.mermaid\-diagram\-container svg \* \{ overflow: visible \!important; \} \.mermaid\-diagram\-container foreignObject \{ overflow: visible \!important; \} \.mermaid\-diagram\-container foreignObject > \* \{ overflow: visible \!important; \} \.mermaid\-diagram\-container \.node, \.mermaid\-diagram\-container \.node \* \{ overflow: visible \!important; \} /\* Fix text centering in nodes \*/ \.mermaid\-diagram\-container foreignObject > div \{ display: flex \!important; justify\-content: center \!important; align\-items: center \!important; height: 100% \!important; \} /\* Fix text wrapping in subgraph/cluster labels \*/ \.mermaid\-diagram\-container \.cluster\-label, \.mermaid\-diagram\-container \.cluster\-label foreignObject, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > span, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > p, \.mermaid\-diagram\-container \.cluster\-label text, \.mermaid\-diagram\-container \.cluster\-label tspan \{ white\-space: nowrap \!important; overflow: visible \!important; \} /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ \.mermaid\-diagram\-container \.cluster\-label \{ z\-index: 10 \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject \{ transform: translateY\(\-8px\) \!important; overflow: visible \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject > div \{ display: flex \!important; justify\-content: center \!important; align\-items: center \!important; text\-align: center \!important; width: 100% \!important; \} \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > span, \.mermaid\-diagram\-container \.cluster\-label foreignObject > div > p \{ background\-color: var\(\-\-background, \#000\) \!important; padding: 2px 6px \!important; border\-radius: 3px \!important; font\-size: 16px \!important; font\-weight: 600 \!important; white\-space: nowrap \!important; \} /\* Sequence diagram note fix \- prevent text overflow \*/ \.mermaid\-diagram\-container \.note rect, \.mermaid\-diagram\-container rect\.note \{ rx: 5px \!important; ry: 5px \!important; \} \.mermaid\-diagram\-container \.note text, \.mermaid\-diagram\-container \.noteText \{ font\-size: 14px \!important; dominant\-baseline: central \!important; \} /\* State diagram specific styles \*/ \.mermaid\-state\-container svg \{ overflow: visible \!important; width: 100% \!important; height: auto \!important; max\-width: 100% \!important; \} \.mermaid\-state\-container \.statediagram\-state, \.mermaid\-state\-container \.stateGroup, \.mermaid\-state\-container \.state \{ overflow: visible \!important; \} \.mermaid\-state\-container text, \.mermaid\-state\-container \.nodeLabel, \.mermaid\-state\-container \.state\-text, \.mermaid\-state\-container tspan \{ white\-space: nowrap \!important; font\-size: 14px \!important; overflow: visible \!important; \} /\* Dark mode text colors for state diagrams \- only cluster labels, not state node text \*/ \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label text, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label tspan, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject span, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject p, \.dark \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label foreignObject div \{ fill: \#f0fdf4 \!important; color: \#f0fdf4 \!important; \} \.mermaid\-state\-container \.edgeLabel, \.mermaid\-state\-container \.edge\-label \{ white\-space: nowrap \!important; font\-size: 13px \!important; background\-color: transparent \!important; overflow: visible \!important; \} /\* Dark mode edge label colors \*/ \.dark \.mermaid\-state\-container \.edgeLabel, \.dark \.mermaid\-state\-container \.edgeLabel span, \.dark \.mermaid\-state\-container \.edge\-label \{ fill: \#fafafa \!important; color: \#fafafa \!important; \} \.mermaid\-state\-container \.transition, \.mermaid\-state\-container path\.transition \{ stroke\-width: 2px \!important; \} /\* Fix composite state title vertical positioning \*/ \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label text, \.mermaid\-state\-container \.statediagram\-cluster \.cluster\-label tspan \{ dominant\-baseline: middle \!important; alignment\-baseline: middle \!important; \}

\#mermaid\-mn2h6wl181n\-1772123867402\{font\-family:inherit;font\-size:16px;fill:\#fafafa;\}@keyframes edge\-animation\-frame\{from\{stroke\-dashoffset:0;\}\}@keyframes dash\{to\{stroke\-dashoffset:0;\}\}\#mermaid\-mn2h6wl181n\-1772123867402 \.edge\-animation\-slow\{stroke\-dasharray:9,5\!important;stroke\-dashoffset:900;animation:dash 50s linear infinite;stroke\-linecap:round;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.edge\-animation\-fast\{stroke\-dasharray:9,5\!important;stroke\-dashoffset:900;animation:dash 20s linear infinite;stroke\-linecap:round;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.error\-icon\{fill:\#000000;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.error\-text\{fill:\#fafafa;stroke:\#fafafa;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.edge\-thickness\-normal\{stroke\-width:1px;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.edge\-thickness\-thick\{stroke\-width:3\.5px;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.edge\-pattern\-solid\{stroke\-dasharray:0;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.edge\-thickness\-invisible\{stroke\-width:0;fill:none;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.edge\-pattern\-dashed\{stroke\-dasharray:3;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.edge\-pattern\-dotted\{stroke\-dasharray:2;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.marker\{fill:\#22c55e;stroke:\#22c55e;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.marker\.cross\{stroke:\#22c55e;\}\#mermaid\-mn2h6wl181n\-1772123867402 svg\{font\-family:inherit;font\-size:16px;\}\#mermaid\-mn2h6wl181n\-1772123867402 p\{margin:0;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.label\{font\-family:inherit;color:\#f0fdf4;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.cluster\-label text\{fill:\#fafafa;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.cluster\-label span\{color:\#fafafa;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.cluster\-label span p\{background\-color:transparent;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.label text,\#mermaid\-mn2h6wl181n\-1772123867402 span\{fill:\#f0fdf4;color:\#f0fdf4;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.node rect,\#mermaid\-mn2h6wl181n\-1772123867402 \.node circle,\#mermaid\-mn2h6wl181n\-1772123867402 \.node ellipse,\#mermaid\-mn2h6wl181n\-1772123867402 \.node polygon,\#mermaid\-mn2h6wl181n\-1772123867402 \.node path\{fill:\#166534;stroke:\#22c55e;stroke\-width:1px;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.rough\-node \.label text,\#mermaid\-mn2h6wl181n\-1772123867402 \.node \.label text,\#mermaid\-mn2h6wl181n\-1772123867402 \.image\-shape \.label,\#mermaid\-mn2h6wl181n\-1772123867402 \.icon\-shape \.label\{text\-anchor:middle;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.node \.katex path\{fill:\#000;stroke:\#000;stroke\-width:1px;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.rough\-node \.label,\#mermaid\-mn2h6wl181n\-1772123867402 \.node \.label,\#mermaid\-mn2h6wl181n\-1772123867402 \.image\-shape \.label,\#mermaid\-mn2h6wl181n\-1772123867402 \.icon\-shape \.label\{text\-align:center;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.node\.clickable\{cursor:pointer;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.root \.anchor path\{fill:\#22c55e\!important;stroke\-width:0;stroke:\#22c55e;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.arrowheadPath\{fill:\#0b0b0b;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.edgePath \.path\{stroke:\#22c55e;stroke\-width:2\.0px;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.flowchart\-link\{stroke:\#22c55e;fill:none;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.edgeLabel\{background\-color:\#0a0a0a;text\-align:center;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.edgeLabel p\{background\-color:\#0a0a0a;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.edgeLabel rect\{opacity:0\.5;background\-color:\#0a0a0a;fill:\#0a0a0a;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.labelBkg\{background\-color:rgba\(10, 10, 10, 0\.5\);\}\#mermaid\-mn2h6wl181n\-1772123867402 \.cluster rect\{fill:\#1a1a1a;stroke:\#000000;stroke\-width:1px;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.cluster text\{fill:\#fafafa;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.cluster span\{color:\#fafafa;\}\#mermaid\-mn2h6wl181n\-1772123867402 div\.mermaidTooltip\{position:absolute;text\-align:center;max\-width:200px;padding:2px;font\-family:inherit;font\-size:12px;background:\#000000;border:1px solid \#262626;border\-radius:2px;pointer\-events:none;z\-index:100;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.flowchartTitleText\{text\-anchor:middle;font\-size:18px;fill:\#fafafa;\}\#mermaid\-mn2h6wl181n\-1772123867402 rect\.text\{fill:none;stroke\-width:0;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.icon\-shape,\#mermaid\-mn2h6wl181n\-1772123867402 \.image\-shape\{background\-color:\#0a0a0a;text\-align:center;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.icon\-shape p,\#mermaid\-mn2h6wl181n\-1772123867402 \.image\-shape p\{background\-color:\#0a0a0a;padding:2px;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.icon\-shape rect,\#mermaid\-mn2h6wl181n\-1772123867402 \.image\-shape rect\{opacity:0\.5;background\-color:\#0a0a0a;fill:\#0a0a0a;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.label\-icon\{display:inline\-block;height:1em;overflow:visible;vertical\-align:\-0\.125em;\}\#mermaid\-mn2h6wl181n\-1772123867402 \.node \.label\-icon path\{fill:currentColor;stroke:revert;stroke\-width:revert;\}\#mermaid\-mn2h6wl181n\-1772123867402 :root\{\-\-mermaid\-font\-family:inherit;\}

\(\-1,\-1\)

\(\-1, 0\)

\(\-1,\+1\)

\(0, \-1\)

\(r, c\)

\(0, \+1\)

\(\+1,\-1\)

\(\+1, 0\)

\(\+1,\+1\)

### Using Direction Arrays

Here is how you use direction arrays to explore neighbors:

Java

```java
int rows = grid.length;
int cols = grid[0].length;
int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

// Starting from cell (row, col)
for (int[] dir : directions) {
   int newRow = row + dir[0];
   int newCol = col + dir[1];

   // Boundary check
   if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
       // Process neighbor at (newRow, newCol)
   }
}
```

This pattern appears in almost every matrix traversal problem\. Memorize it\.

# Boundary Checking

One of the most common sources of bugs in matrix problems is going out of bounds\. Always check that the new coordinates are valid before accessing the array\.

Java

```java
// Always validate before accessing grid[newRow][newCol]
boolean isValid(int row, int col, int rows, int cols) {
   return row >= 0 && row < rows && col >= 0 && col < cols;
}
```

A useful helper method makes your code cleaner and less error\-prone:

Java

```java
private boolean inBounds(int r, int c, int[][] grid) {
   return r >= 0 && r < grid.length && c >= 0 && c < grid[0].length;
}
```

# Matrix Traversal Patterns

There are several ways to traverse a matrix, each useful for different problems\.

### Linear Traversal

The simplest approach: visit every cell in row\-major or column\-major order\.

Java

```java
// Row-major: left to right, top to bottom
for (int r = 0; r < rows; r++) {
   for (int c = 0; c < cols; c++) {
       process(grid[r][c]);
   }
}

// Column-major: top to bottom, left to right
for (int c = 0; c < cols; c++) {
   for (int r = 0; r < rows; r++) {
       process(grid[r][c]);
   }
}
```

**Use when**: You need to process every cell once, like counting elements or finding a specific value\.

### Diagonal Traversal

Visit cells along diagonals\. Useful for problems involving diagonal patterns\.

Java

```java
// Main diagonal and parallel diagonals
for (int d = 0; d < rows + cols - 1; d++) {
   int r = Math.max(0, d - cols + 1);
   int c = Math.max(0, cols - 1 - d);
   while (r < rows && c < cols) {
       process(grid[r][c]);
       r++;
       c++;
   }
}
```

### Spiral Traversal

Visit cells in a spiral pattern, starting from the outer edge and moving inward\.

Java

```java
public List<Integer> spiralOrder(int[][] matrix) {
   List<Integer> result = new ArrayList<>();
   if (matrix.length == 0) return result;

   int top = 0, bottom = matrix.length - 1;
   int left = 0, right = matrix[0].length - 1;

   while (top <= bottom && left <= right) {
       // Move right
       for (int c = left; c <= right; c++) {
           result.add(matrix[top][c]);
       }
       top++;

       // Move down
       for (int r = top; r <= bottom; r++) {
           result.add(matrix[r][right]);
       }
       right--;

       // Move left
       if (top <= bottom) {
           for (int c = right; c >= left; c--) {
               result.add(matrix[bottom][c]);
           }
           bottom--;
       }

       // Move up
       if (left <= right) {
           for (int r = bottom; r >= top; r--) {
               result.add(matrix[r][left]);
           }
           left++;
       }
   }
   return result;
}
```

### DFS and BFS Traversal

The most powerful patterns for matrix problems\. These treat the grid as a graph and explore it using standard graph algorithms\.

# DFS on Grids

Depth\-First Search explores as far as possible along each branch before backtracking\. On a grid, this means going in one direction until you hit a boundary or obstacle, then trying another direction\.

### Recursive DFS Template

Java

```java
private void dfs(int[][] grid, int row, int col, boolean[][] visited) {
   int rows = grid.length;
   int cols = grid[0].length;

   // Base case: out of bounds or already visited
   if (row < 0 || row >= rows || col < 0 || col >= cols) {
       return;
   }
   if (visited[row][col]) {
       return;
   }

   // Mark as visited
   visited[row][col] = true;

   // Process current cell
   // ... (problem-specific logic)

   // Explore all 4 directions
   int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
   for (int[] dir : directions) {
       dfs(grid, row + dir[0], col + dir[1], visited);
   }
}
```

### Iterative DFS Template \(Using Stack\)

Java

```java
private void dfsIterative(int[][] grid, int startRow, int startCol) {
   int rows = grid.length;
   int cols = grid[0].length;
   boolean[][] visited = new boolean[rows][cols];

   Stack<int[]> stack = new Stack<>();
   stack.push(new int[]{startRow, startCol});

   int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

   while (!stack.isEmpty()) {
       int[] cell = stack.pop();
       int row = cell[0];
       int col = cell[1];

       if (row < 0 || row >= rows || col < 0 || col >= cols) {
           continue;
       }
       if (visited[row][col]) {
           continue;
       }

       visited[row][col] = true;
       // Process current cell

       for (int[] dir : directions) {
           stack.push(new int[]{row + dir[0], col + dir[1]});
       }
   }
}
```

### In\-Place Marking

For many problems, instead of using a separate visited array, you can modify the grid itself to mark visited cells\. This saves space\.

Java

```java
private void dfs(char[][] grid, int row, int col) {
   int rows = grid.length;
   int cols = grid[0].length;

   if (row < 0 || row >= rows || col < 0 || col >= cols) {
       return;
   }
   if (grid[row][col] != '1') {  // Already visited or not valid
       return;
   }

   // Mark as visited by changing the value
   grid[row][col] = '0';  // or '#' or any sentinel value

   // Explore neighbors
   dfs(grid, row - 1, col);
   dfs(grid, row + 1, col);
   dfs(grid, row, col - 1);
   dfs(grid, row, col + 1);
}
```

**Warning**: In\-place modification changes the input\. Only use this when the problem allows it or when you make a copy first\.

# BFS on Grids

Breadth\-First Search explores all neighbors at the current depth before moving to the next level\. On a grid, this means exploring all cells at distance 1, then all cells at distance 2, and so on\.

### BFS Template

Java

```java
private void bfs(int[][] grid, int startRow, int startCol) {
   int rows = grid.length;
   int cols = grid[0].length;
   boolean[][] visited = new boolean[rows][cols];

   Queue<int[]> queue = new LinkedList<>();
   queue.offer(new int[]{startRow, startCol});
   visited[startRow][startCol] = true;

   int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

   while (!queue.isEmpty()) {
       int[] cell = queue.poll();
       int row = cell[0];
       int col = cell[1];

       // Process current cell
       // ... (problem-specific logic)

       for (int[] dir : directions) {
           int newRow = row + dir[0];
           int newCol = col + dir[1];

           if (newRow >= 0 && newRow < rows &&
               newCol >= 0 && newCol < cols &&
               !visited[newRow][newCol]) {

               visited[newRow][newCol] = true;  // Mark visited when adding to queue
               queue.offer(new int[]{newRow, newCol});
           }
       }
   }
}
```

### BFS for Shortest Path

BFS naturally finds the shortest path in an unweighted graph\. To track the distance, process the queue level by level:

Java

```java
private int shortestPath(int[][] grid, int startRow, int startCol, int endRow, int endCol) {
   int rows = grid.length;
   int cols = grid[0].length;
   boolean[][] visited = new boolean[rows][cols];

   Queue<int[]> queue = new LinkedList<>();
   queue.offer(new int[]{startRow, startCol});
   visited[startRow][startCol] = true;

   int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
   int distance = 0;

   while (!queue.isEmpty()) {
       int size = queue.size();  // Process one level at a time

       for (int i = 0; i < size; i++) {
           int[] cell = queue.poll();
           int row = cell[0];
           int col = cell[1];

           if (row == endRow && col == endCol) {
               return distance;
           }

           for (int[] dir : directions) {
               int newRow = row + dir[0];
               int newCol = col + dir[1];

               if (newRow >= 0 && newRow < rows &&
                   newCol >= 0 && newCol < cols &&
                   !visited[newRow][newCol] &&
                   grid[newRow][newCol] != 1) {  // 1 represents obstacle

                   visited[newRow][newCol] = true;
                   queue.offer(new int[]{newRow, newCol});
               }
           }
       }
       distance++;
   }

   return -1;  // No path found
}
```