---
title: "Graph Representation & Basics"
description: "Enter the world of graph algorithms. Learn graph representations (adjacency matrix, adjacency list), graph types, and fundamental graph properties essential for network algorithms."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - javascript
  - graphs
  - graph-representation
resources:
  - title: "Graph Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/graphds"
    description: "Interactive graph data structure and algorithm visualization"
  - title: "Graph Problems"
    type: "practice"
    url: "https://leetcode.com/tag/graph/"
    description: "Practice problems for mastering graph algorithms"
  - title: "Graph Theory"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Graph_theory"
    description: "Comprehensive introduction to graph theory concepts"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758827456/Portfolio/dsa/images/19/graphs.png)

Graph Representation & Basics – Modeling Connected Worlds
=========================================================

Imagine you're the **head of transportation planning for a smart city** 🏙️ where **millions of people** need to navigate between **thousands of locations** through **complex networks** of roads, subway lines, bike paths, and walking routes:

**🚦 The Smart City Navigation Challenge:**

**🗺️ Traditional Navigation Problems:**
- **Linear Thinking**: Streets viewed as isolated lines → Can't model intersections effectively
- **Missing Connections**: Can't represent that Broadway connects to 5th Avenue at Times Square
- **No Relationship Data**: Can't store that some roads are one-way, others bidirectional
- **Scale Issues**: With 10,000 intersections and 50,000 road segments → Complex relationships explosion

**📍 Real Navigation Questions:**
```
Citizens ask complex questions:
- "What's the shortest path from Central Park to Brooklyn Bridge?"
- "Which subway lines connect Manhattan to Queens?"
- "If 5th Avenue is closed, what are alternative routes?"
- "What's the fastest way to visit Times Square, Empire State, and Statue of Liberty?"
- "How many different routes exist between Point A and Point B?"

Traditional data structures can't handle these relationship-heavy queries efficiently!
```

**🌐 The Graph Solution (Relationship Modeling):**
Think of the city as a **giant connected network** where:
- **Locations** become **nodes/vertices** (intersections, landmarks, stations)
- **Roads/Routes** become **edges** (streets, subway lines, walking paths)
- **Connections** are **explicit relationships** between any two locations
- **Properties** can be attached to both locations and routes (traffic, distance, type)

**🗺️ Graph City Representation:**
```
Graph Components:
- Vertices: {Central Park, Times Square, Brooklyn Bridge, Empire State, ...}
- Edges: {(Central Park ↔ Times Square), (Times Square ↔ Empire State), ...}

Times Square Connections:
Times Square ↔ Central Park (walking: 10 min)
Times Square ↔ Broadway (subway: 2 min)  
Times Square ↔ Empire State (walking: 8 min)
Times Square ↔ 42nd St Station (walking: 1 min)
```

**🔍 Graph Power Examples:**

**Shortest Path Query:**
```
Question: "Fastest route from Central Park to Brooklyn Bridge?"
Graph Answer: Run Dijkstra's algorithm
1. Start at Central Park vertex
2. Explore all connected edges (Times Square, Museum Mile, etc.)
3. Build path tree considering edge weights (travel time)
4. Find optimal path: Central Park → Times Square → Downtown → Brooklyn Bridge
5. Return: "Take subway to Times Square, then express to Brooklyn Bridge (22 minutes)"
```

**Alternative Routes:**
```
Question: "If Broadway is closed, how to get around?"
Graph Answer: Remove Broadway edges temporarily
1. Mark Broadway edges as unavailable
2. Recalculate paths using remaining connections
3. Return alternative routes through different vertices
```

**Network Analysis:**
```
Question: "Which intersections are most critical?"
Graph Answer: Find articulation points
- Times Square: Removing it disconnects multiple districts
- Brooklyn Bridge: Only connection between Manhattan and Brooklyn
- Grand Central: Hub connecting all subway lines
```

**🌟 Real-World Graph Applications:**

**Social Networks:**
- **Vertices**: Users (profiles, pages, groups)
- **Edges**: Relationships (friends, follows, likes, shares)
- **Queries**: "Find mutual friends", "Suggest connections", "Detect communities"

**Web & Internet:**
- **Vertices**: Web pages, servers, domains
- **Edges**: Hyperlinks, network connections, API calls
- **Queries**: "Page ranking", "Link analysis", "Network topology"

**Biological Networks:**
- **Vertices**: Genes, proteins, organisms, ecosystems
- **Edges**: Interactions, dependencies, evolutionary relationships
- **Queries**: "Protein interaction pathways", "Disease propagation", "Ecosystem stability"

**Computer Networks:**
- **Vertices**: Routers, servers, devices, data centers
- **Edges**: Network links, wireless connections, fiber optic cables
- **Queries**: "Network routing", "Fault tolerance", "Load balancing"

**💡 Graph Representation Advantages:**
- **Natural Modeling**: Directly represents real-world relationships
- **Flexible Structure**: Can model any type of connection
- **Rich Algorithms**: Hundreds of specialized algorithms available
- **Scalable Analysis**: Efficient algorithms for massive networks
- **Multi-dimensional**: Can handle weighted, directed, labeled relationships

**📊 Graph vs Other Structures:**
```
Array: [A, B, C, D] - Linear, position-based
Tree: A → B → C, A → D - Hierarchical, parent-child only
Graph: A ↔ B, A ↔ C, B ↔ D, C ↔ D - Any-to-any relationships

Graph flexibility:
- Can represent trees (trees are graphs!)
- Can represent networks (social, computer, biological)
- Can represent flows (traffic, data, resources)
- Can represent dependencies (tasks, prerequisites, causality)
```

This is exactly how graphs work in computer science! They provide the **mathematical foundation for modeling any connected system**, from social networks to city planning. Graphs transform **complex relationship problems** into **well-studied algorithmic solutions**! 🚀✨

## The Theoretical Foundation: What Are Graphs? 📐

### Understanding Graph Theory Fundamentals

**A graph is a mathematical structure consisting of a set of vertices (nodes) connected by edges that represent relationships between these vertices.** Formally, a graph G is defined as G = (V, E) where V is a set of vertices and E is a set of edges connecting pairs of vertices.

**Core Graph Components:**

1. **Vertices (Nodes)**: The fundamental units or entities in the graph
2. **Edges (Links)**: Connections between vertices representing relationships
3. **Adjacency**: Two vertices are adjacent if connected by an edge
4. **Degree**: Number of edges connected to a vertex
5. **Path**: Sequence of vertices connected by edges

**Mathematical Notation:**
- **Graph**: G = (V, E)
- **Vertex Set**: V = {v₁, v₂, v₃, ..., vₙ}
- **Edge Set**: E = {(v₁, v₂), (v₂, v₃), ...} or E = {e₁, e₂, e₃, ...}
- **Order**: |V| = number of vertices
- **Size**: |E| = number of edges

### Graph Types and Classifications

**Directed vs Undirected Graphs:**

**Undirected Graph:**
- **Edges**: Bidirectional connections (u, v) = (v, u)
- **Representation**: Lines or bidirectional arrows
- **Examples**: Friendship networks, road systems, molecular structures
- **Edge Count**: Maximum |E| = |V|(|V|-1)/2

**Directed Graph (Digraph):**
- **Edges**: Unidirectional connections (u, v) ≠ (v, u)
- **Representation**: Arrows showing direction
- **Examples**: Web pages (hyperlinks), dependency graphs, food chains
- **Edge Count**: Maximum |E| = |V|(|V|-1)

**Weighted vs Unweighted Graphs:**

**Unweighted Graph:**
- **Edges**: Simple connections without additional properties
- **Use Cases**: Basic connectivity, network topology
- **Algorithms**: Focus on reachability and connectivity

**Weighted Graph:**
- **Edges**: Include numerical weights/costs/distances
- **Use Cases**: Shortest paths, minimum spanning trees, flow networks
- **Algorithms**: Consider edge weights in calculations

**Special Graph Types:**

**Simple Graph:**
- **Properties**: No self-loops, no multiple edges between same vertices
- **Most Common**: Standard graph type used in most algorithms

**Multigraph:**
- **Properties**: Allows multiple edges between same pair of vertices
- **Use Cases**: Transportation networks with multiple routes

**Complete Graph:**
- **Properties**: Every vertex connected to every other vertex
- **Notation**: Kₙ for complete graph with n vertices
- **Edge Count**: n(n-1)/2 for undirected, n(n-1) for directed

**Bipartite Graph:**
- **Properties**: Vertices can be divided into two disjoint sets
- **Constraint**: Edges only connect vertices from different sets
- **Applications**: Matching problems, recommendation systems

### Graph Properties and Metrics

**Connectivity Properties:**
- **Connected**: Path exists between every pair of vertices (undirected)
- **Strongly Connected**: Directed path exists between every pair (directed)
- **Weakly Connected**: Underlying undirected graph is connected (directed)

**Distance and Paths:**
- **Path Length**: Number of edges in a path
- **Distance**: Length of shortest path between two vertices
- **Diameter**: Maximum distance between any pair of vertices
- **Girth**: Length of shortest cycle in the graph

**Degree Properties:**
- **Degree**: Number of edges incident to a vertex
- **In-degree**: Number of incoming edges (directed graphs)
- **Out-degree**: Number of outgoing edges (directed graphs)
- **Degree Sequence**: Sorted list of all vertex degrees

## Graph Representation Strategies 🗂️

**Concept**: Different methods to store and represent graphs in computer memory, each with specific advantages and trade-offs.

```javascript
// Comprehensive Graph Representation Implementation

class Graph {
    constructor(numVertices = 0, isDirected = false, isWeighted = false) {
        this.numVertices = numVertices;
        this.isDirected = isDirected;
        this.isWeighted = isWeighted;
        this.numEdges = 0;
        
        console.log(`\n🏗️ CREATING GRAPH`);
        console.log(`Vertices: ${numVertices}`);
        console.log(`Type: ${isDirected ? 'Directed' : 'Undirected'}`);
        console.log(`Weights: ${isWeighted ? 'Weighted' : 'Unweighted'}`);
        
        // Multiple representation strategies
        this.initializeRepresentations();
    }
    
    initializeRepresentations() {
        console.log(`\n📊 INITIALIZING GRAPH REPRESENTATIONS`);
        
        // 1. Adjacency Matrix
        this.adjacencyMatrix = Array(this.numVertices).fill(null)
            .map(() => Array(this.numVertices).fill(this.isWeighted ? Infinity : 0));
            
        // Set diagonal to 0 for weighted graphs (distance from vertex to itself)
        if (this.isWeighted) {
            for (let i = 0; i < this.numVertices; i++) {
                this.adjacencyMatrix[i][i] = 0;
            }
        }
        
        // 2. Adjacency List
        this.adjacencyList = Array(this.numVertices).fill(null)
            .map(() => []);
            
        // 3. Edge List
        this.edgeList = [];
        
        // 4. Vertex labels (optional)
        this.vertexLabels = Array(this.numVertices).fill(null)
            .map((_, i) => `v${i}`);
            
        console.log(`✅ Initialized adjacency matrix: ${this.numVertices}×${this.numVertices}`);
        console.log(`✅ Initialized adjacency list: ${this.numVertices} empty lists`);
        console.log(`✅ Initialized edge list: empty array`);
    }
    
    // Add vertex (expand graph dynamically)
    addVertex(label = null) {
        console.log(`\n➕ ADDING VERTEX ${this.numVertices}`);
        
        const newVertexId = this.numVertices;
        this.numVertices++;
        
        // Expand adjacency matrix
        console.log(`Expanding adjacency matrix to ${this.numVertices}×${this.numVertices}`);
        
        // Add new row
        const newRow = Array(this.numVertices).fill(this.isWeighted ? Infinity : 0);
        if (this.isWeighted) newRow[newVertexId] = 0; // Distance to self is 0
        this.adjacencyMatrix.push(newRow);
        
        // Add new column to existing rows
        for (let i = 0; i < this.numVertices - 1; i++) {
            this.adjacencyMatrix[i].push(this.isWeighted ? Infinity : 0);
        }
        
        // Add new adjacency list
        this.adjacencyList.push([]);
        
        // Add vertex label
        this.vertexLabels.push(label || `v${newVertexId}`);
        
        console.log(`✅ Added vertex ${newVertexId} (${this.vertexLabels[newVertexId]})`);
        console.log(`New graph size: ${this.numVertices} vertices`);
        
        return newVertexId;
    }
    
    // Add edge between vertices
    addEdge(source, target, weight = 1) {
        console.log(`\n🔗 ADDING EDGE: ${source} → ${target}${this.isWeighted ? ` (weight: ${weight})` : ''}`);
        
        if (!this.isValidVertex(source) || !this.isValidVertex(target)) {
            console.log(`❌ Invalid vertices: ${source} or ${target}`);
            return false;
        }
        
        const sourceLabel = this.vertexLabels[source];
        const targetLabel = this.vertexLabels[target];
        
        console.log(`Adding edge: ${sourceLabel} → ${targetLabel}`);
        
        // Update all representations
        this.updateAdjacencyMatrix(source, target, weight);
        this.updateAdjacencyList(source, target, weight);
        this.updateEdgeList(source, target, weight);
        
        // Add reverse edge for undirected graphs
        if (!this.isDirected && source !== target) {
            console.log(`Undirected graph: Adding reverse edge ${target} → ${source}`);
            this.updateAdjacencyMatrix(target, source, weight);
            this.updateAdjacencyList(target, source, weight);
            // Don't add reverse to edge list (represents undirected edge once)
        }
        
        this.numEdges++;
        
        console.log(`✅ Edge added successfully`);
        console.log(`Total edges: ${this.numEdges}`);
        
        return true;
    }
    
    updateAdjacencyMatrix(source, target, weight) {
        console.log(`  📊 Matrix: [${source}][${target}] = ${this.isWeighted ? weight : 1}`);
        this.adjacencyMatrix[source][target] = this.isWeighted ? weight : 1;
    }
    
    updateAdjacencyList(source, target, weight) {
        const edgeData = this.isWeighted ? { vertex: target, weight: weight } : target;
        this.adjacencyList[source].push(edgeData);
        console.log(`  📋 List: Added ${JSON.stringify(edgeData)} to adjacency[${source}]`);
    }
    
    updateEdgeList(source, target, weight) {
        const edge = this.isWeighted ? 
            { source, target, weight } : 
            { source, target };
        this.edgeList.push(edge);
        console.log(`  📝 EdgeList: Added ${JSON.stringify(edge)}`);
    }
    
    // Check if edge exists
    hasEdge(source, target) {
        if (!this.isValidVertex(source) || !this.isValidVertex(target)) {
            return false;
        }
        
        if (this.isWeighted) {
            return this.adjacencyMatrix[source][target] !== Infinity;
        } else {
            return this.adjacencyMatrix[source][target] === 1;
        }
    }
    
    // Get edge weight
    getEdgeWeight(source, target) {
        if (!this.hasEdge(source, target)) {
            return this.isWeighted ? Infinity : 0;
        }
        
        return this.adjacencyMatrix[source][target];
    }
    
    // Remove edge
    removeEdge(source, target) {
        console.log(`\n🗑️ REMOVING EDGE: ${source} → ${target}`);
        
        if (!this.hasEdge(source, target)) {
            console.log(`❌ Edge does not exist`);
            return false;
        }
        
        // Update adjacency matrix
        this.adjacencyMatrix[source][target] = this.isWeighted ? Infinity : 0;
        
        // Update adjacency list
        if (this.isWeighted) {
            this.adjacencyList[source] = this.adjacencyList[source]
                .filter(edge => edge.vertex !== target);
        } else {
            this.adjacencyList[source] = this.adjacencyList[source]
                .filter(vertex => vertex !== target);
        }
        
        // Update edge list
        this.edgeList = this.edgeList.filter(edge => 
            !(edge.source === source && edge.target === target)
        );
        
        // Remove reverse edge for undirected graphs
        if (!this.isDirected) {
            this.adjacencyMatrix[target][source] = this.isWeighted ? Infinity : 0;
            
            if (this.isWeighted) {
                this.adjacencyList[target] = this.adjacencyList[target]
                    .filter(edge => edge.vertex !== source);
            } else {
                this.adjacencyList[target] = this.adjacencyList[target]
                    .filter(vertex => vertex !== source);
            }
        }
        
        this.numEdges--;
        
        console.log(`✅ Edge removed successfully`);
        console.log(`Total edges: ${this.numEdges}`);
        
        return true;
    }
    
    // Get neighbors of a vertex
    getNeighbors(vertex) {
        console.log(`\n👥 GETTING NEIGHBORS of vertex ${vertex} (${this.vertexLabels[vertex]})`);
        
        if (!this.isValidVertex(vertex)) {
            console.log(`❌ Invalid vertex: ${vertex}`);
            return [];
        }
        
        const neighbors = [];
        
        // Using adjacency list (most efficient for this operation)
        if (this.isWeighted) {
            for (const edge of this.adjacencyList[vertex]) {
                neighbors.push({
                    vertex: edge.vertex,
                    label: this.vertexLabels[edge.vertex],
                    weight: edge.weight
                });
            }
        } else {
            for (const neighborVertex of this.adjacencyList[vertex]) {
                neighbors.push({
                    vertex: neighborVertex,
                    label: this.vertexLabels[neighborVertex]
                });
            }
        }
        
        console.log(`Found ${neighbors.length} neighbors:`);
        neighbors.forEach((neighbor, index) => {
            const weightStr = this.isWeighted ? ` (weight: ${neighbor.weight})` : '';
            console.log(`  ${index + 1}. ${neighbor.vertex} (${neighbor.label})${weightStr}`);
        });
        
        return neighbors;
    }
    
    // Get vertex degree
    getDegree(vertex) {
        console.log(`\n📊 CALCULATING DEGREE of vertex ${vertex} (${this.vertexLabels[vertex]})`);
        
        if (!this.isValidVertex(vertex)) {
            console.log(`❌ Invalid vertex: ${vertex}`);
            return -1;
        }
        
        if (this.isDirected) {
            const inDegree = this.getInDegree(vertex);
            const outDegree = this.getOutDegree(vertex);
            
            console.log(`Directed graph degrees:`);
            console.log(`  In-degree: ${inDegree}`);
            console.log(`  Out-degree: ${outDegree}`);
            console.log(`  Total degree: ${inDegree + outDegree}`);
            
            return { inDegree, outDegree, totalDegree: inDegree + outDegree };
        } else {
            const degree = this.adjacencyList[vertex].length;
            console.log(`Undirected graph degree: ${degree}`);
            return degree;
        }
    }
    
    getInDegree(vertex) {
        let inDegree = 0;
        
        for (let i = 0; i < this.numVertices; i++) {
            if (this.hasEdge(i, vertex)) {
                inDegree++;
            }
        }
        
        return inDegree;
    }
    
    getOutDegree(vertex) {
        return this.adjacencyList[vertex].length;
    }
    
    // Validate vertex index
    isValidVertex(vertex) {
        return vertex >= 0 && vertex < this.numVertices;
    }
    
    // Display all graph representations
    displayRepresentations() {
        console.log(`\n📊 GRAPH REPRESENTATIONS COMPARISON`);
        console.log(`Graph: ${this.numVertices} vertices, ${this.numEdges} edges`);
        console.log(`Type: ${this.isDirected ? 'Directed' : 'Undirected'}, ${this.isWeighted ? 'Weighted' : 'Unweighted'}`);
        
        this.displayAdjacencyMatrix();
        this.displayAdjacencyList();
        this.displayEdgeList();
        this.displaySpaceComplexity();
    }
    
    displayAdjacencyMatrix() {
        console.log(`\n📊 ADJACENCY MATRIX REPRESENTATION:`);
        console.log(`Matrix size: ${this.numVertices}×${this.numVertices}`);
        
        // Header row
        let header = '   ';
        for (let i = 0; i < this.numVertices; i++) {
            header += `${this.vertexLabels[i].padStart(4)}`;
        }
        console.log(header);
        
        // Matrix rows
        for (let i = 0; i < this.numVertices; i++) {
            let row = `${this.vertexLabels[i].padEnd(3)}`;
            
            for (let j = 0; j < this.numVertices; j++) {
                const value = this.adjacencyMatrix[i][j];
                let cellValue;
                
                if (this.isWeighted) {
                    cellValue = value === Infinity ? '∞' : value.toString();
                } else {
                    cellValue = value.toString();
                }
                
                row += cellValue.padStart(4);
            }
            
            console.log(row);
        }
        
        console.log(`\n💡 Matrix advantages:`);
        console.log(`- O(1) edge lookup and update`);
        console.log(`- Easy to implement and understand`);
        console.log(`- Efficient for dense graphs`);
        console.log(`- Good for matrix operations`);
        
        console.log(`⚠️ Matrix disadvantages:`);
        console.log(`- O(V²) space regardless of edge count`);
        console.log(`- Inefficient for sparse graphs`);
        console.log(`- O(V) to iterate through neighbors`);
    }
    
    displayAdjacencyList() {
        console.log(`\n📋 ADJACENCY LIST REPRESENTATION:`);
        
        for (let i = 0; i < this.numVertices; i++) {
            let listStr = `${this.vertexLabels[i]}: [`;
            
            if (this.isWeighted) {
                const edges = this.adjacencyList[i].map(edge => 
                    `${this.vertexLabels[edge.vertex]}(${edge.weight})`
                );
                listStr += edges.join(', ');
            } else {
                const vertices = this.adjacencyList[i].map(vertex => 
                    this.vertexLabels[vertex]
                );
                listStr += vertices.join(', ');
            }
            
            listStr += `]`;
            console.log(`  ${listStr}`);
        }
        
        console.log(`\n💡 List advantages:`);
        console.log(`- O(V + E) space - efficient for sparse graphs`);
        console.log(`- O(degree) to iterate through neighbors`);
        console.log(`- Dynamic size adaptation`);
        console.log(`- Most algorithms prefer this representation`);
        
        console.log(`⚠️ List disadvantages:`);
        console.log(`- O(degree) edge lookup in worst case`);
        console.log(`- More complex implementation`);
        console.log(`- Pointer overhead for each edge`);
    }
    
    displayEdgeList() {
        console.log(`\n📝 EDGE LIST REPRESENTATION:`);
        
        if (this.edgeList.length === 0) {
            console.log(`  (No edges)`);
        } else {
            this.edgeList.forEach((edge, index) => {
                const sourceLabel = this.vertexLabels[edge.source];
                const targetLabel = this.vertexLabels[edge.target];
                const weightStr = this.isWeighted ? ` (weight: ${edge.weight})` : '';
                const directionStr = this.isDirected ? '→' : '↔';
                
                console.log(`  ${index + 1}. ${sourceLabel} ${directionStr} ${targetLabel}${weightStr}`);
            });
        }
        
        console.log(`\n💡 Edge list advantages:`);
        console.log(`- O(E) space - minimal overhead`);
        console.log(`- Simple iteration through all edges`);
        console.log(`- Easy edge sorting for algorithms like Kruskal's`);
        console.log(`- Good for algorithms that process all edges`);
        
        console.log(`⚠️ Edge list disadvantages:`);
        console.log(`- O(E) to check if specific edge exists`);
        console.log(`- O(E) to find neighbors of a vertex`);
        console.log(`- Not suitable for most graph traversal algorithms`);
    }
    
    displaySpaceComplexity() {
        console.log(`\n💾 SPACE COMPLEXITY ANALYSIS:`);
        
        const matrixSpace = this.numVertices * this.numVertices;
        const listSpace = this.numVertices + (this.isDirected ? this.numEdges : 2 * this.numEdges);
        const edgeSpace = this.numEdges;
        
        console.log(`Adjacency Matrix: O(V²) = ${matrixSpace} cells`);
        console.log(`Adjacency List: O(V + E) = ${listSpace} elements`);
        console.log(`Edge List: O(E) = ${edgeSpace} edges`);
        
        const densityThreshold = this.numVertices / 2;
        console.log(`\n📈 Recommendation for this graph:`);
        
        if (this.numEdges < densityThreshold) {
            console.log(`✅ SPARSE GRAPH - Use Adjacency List`);
            console.log(`Current edge density: ${(this.numEdges / (this.numVertices * this.numVertices) * 100).toFixed(1)}%`);
        } else {
            console.log(`✅ DENSE GRAPH - Consider Adjacency Matrix`);
            console.log(`Current edge density: ${(this.numEdges / (this.numVertices * this.numVertices) * 100).toFixed(1)}%`);
        }
    }
    
    // Graph analysis and properties
    analyzeGraph() {
        console.log(`\n🔍 GRAPH ANALYSIS`);
        console.log(`================`);
        
        console.log(`\n📊 Basic Properties:`);
        console.log(`Vertices: ${this.numVertices}`);
        console.log(`Edges: ${this.numEdges}`);
        console.log(`Type: ${this.isDirected ? 'Directed' : 'Undirected'}`);
        console.log(`Weights: ${this.isWeighted ? 'Weighted' : 'Unweighted'}`);
        
        // Calculate density
        const maxEdges = this.isDirected ? 
            this.numVertices * (this.numVertices - 1) : 
            this.numVertices * (this.numVertices - 1) / 2;
        const density = maxEdges > 0 ? (this.numEdges / maxEdges * 100).toFixed(2) : 0;
        
        console.log(`Density: ${density}% (${this.numEdges}/${maxEdges} possible edges)`);
        
        // Degree analysis
        console.log(`\n📊 Degree Analysis:`);
        let totalDegree = 0;
        let maxDegree = 0;
        let minDegree = Infinity;
        
        for (let i = 0; i < this.numVertices; i++) {
            const degree = this.isDirected ? 
                this.getOutDegree(i) + this.getInDegree(i) : 
                this.adjacencyList[i].length;
            
            totalDegree += degree;
            maxDegree = Math.max(maxDegree, degree);
            minDegree = Math.min(minDegree, degree);
        }
        
        const avgDegree = this.numVertices > 0 ? (totalDegree / this.numVertices).toFixed(2) : 0;
        
        console.log(`Average degree: ${avgDegree}`);
        console.log(`Maximum degree: ${maxDegree}`);
        console.log(`Minimum degree: ${minDegree === Infinity ? 0 : minDegree}`);
        
        // Special graph types
        console.log(`\n🎯 Graph Classification:`);
        this.classifyGraph(density, maxDegree, minDegree === Infinity ? 0 : minDegree);
        
        return {
            vertices: this.numVertices,
            edges: this.numEdges,
            density: parseFloat(density),
            avgDegree: parseFloat(avgDegree),
            maxDegree,
            minDegree: minDegree === Infinity ? 0 : minDegree
        };
    }
    
    classifyGraph(density, maxDegree, minDegree) {
        const classifications = [];
        
        // Density classification
        if (density < 10) {
            classifications.push('Sparse Graph');
        } else if (density > 50) {
            classifications.push('Dense Graph');
        } else {
            classifications.push('Medium Density Graph');
        }
        
        // Degree uniformity
        if (maxDegree === minDegree && this.numVertices > 1) {
            classifications.push('Regular Graph');
        }
        
        // Complete graph check
        const expectedEdgesComplete = this.isDirected ? 
            this.numVertices * (this.numVertices - 1) : 
            this.numVertices * (this.numVertices - 1) / 2;
        
        if (this.numEdges === expectedEdgesComplete) {
            classifications.push('Complete Graph');
        }
        
        // Empty or trivial graphs
        if (this.numEdges === 0) {
            classifications.push('Empty Graph');
        } else if (this.numVertices <= 1) {
            classifications.push('Trivial Graph');
        }
        
        console.log(`Classifications: ${classifications.join(', ')}`);
    }
    
    // Create example graphs for demonstration
    static createExampleGraphs() {
        console.log('=== GRAPH REPRESENTATION EXAMPLES ===');
        
        // Example 1: Simple undirected unweighted graph
        console.log('\n🔸 EXAMPLE 1: Social Network (Undirected, Unweighted)');
        const socialGraph = new Graph(5, false, false);
        
        // Set meaningful labels
        socialGraph.vertexLabels = ['Alice', 'Bob', 'Carol', 'David', 'Eve'];
        
        // Add friendships
        socialGraph.addEdge(0, 1); // Alice - Bob
        socialGraph.addEdge(0, 2); // Alice - Carol
        socialGraph.addEdge(1, 2); // Bob - Carol
        socialGraph.addEdge(1, 3); // Bob - David
        socialGraph.addEdge(3, 4); // David - Eve
        
        socialGraph.displayRepresentations();
        socialGraph.analyzeGraph();
        
        // Example 2: Directed weighted graph (transportation)
        console.log('\n🔸 EXAMPLE 2: City Transportation (Directed, Weighted)');
        const cityGraph = new Graph(4, true, true);
        
        cityGraph.vertexLabels = ['Downtown', 'Airport', 'University', 'Mall'];
        
        // Add routes with travel times
        cityGraph.addEdge(0, 1, 25); // Downtown → Airport (25 min)
        cityGraph.addEdge(1, 0, 30); // Airport → Downtown (30 min)
        cityGraph.addEdge(0, 2, 15); // Downtown → University (15 min)
        cityGraph.addEdge(2, 3, 10); // University → Mall (10 min)
        cityGraph.addEdge(3, 0, 20); // Mall → Downtown (20 min)
        cityGraph.addEdge(1, 3, 35); // Airport → Mall (35 min)
        
        cityGraph.displayRepresentations();
        cityGraph.analyzeGraph();
        
        // Example 3: Complete graph
        console.log('\n🔸 EXAMPLE 3: Complete Graph K4 (Undirected, Unweighted)');
        const completeGraph = new Graph(4, false, false);
        
        completeGraph.vertexLabels = ['A', 'B', 'C', 'D'];
        
        // Add all possible edges
        for (let i = 0; i < 4; i++) {
            for (let j = i + 1; j < 4; j++) {
                completeGraph.addEdge(i, j);
            }
        }
        
        completeGraph.displayRepresentations();
        completeGraph.analyzeGraph();
        
        return { socialGraph, cityGraph, completeGraph };
    }
    
    // Demonstrate graph operations
    demonstrateGraphOperations() {
        console.log('=== GRAPH OPERATIONS DEMONSTRATION ===');
        
        console.log('\n1. BUILDING GRAPH DYNAMICALLY:');
        this.addVertex('Start');
        this.addVertex('Process');
        this.addVertex('Decision');
        this.addVertex('End');
        
        console.log('\n2. ADDING EDGES:');
        this.addEdge(0, 1, this.isWeighted ? 5 : undefined);
        this.addEdge(1, 2, this.isWeighted ? 3 : undefined);
        this.addEdge(2, 3, this.isWeighted ? 2 : undefined);
        this.addEdge(2, 1, this.isWeighted ? 4 : undefined); // Cycle or reverse
        
        console.log('\n3. ANALYZING STRUCTURE:');
        this.displayRepresentations();
        
        console.log('\n4. VERTEX OPERATIONS:');
        for (let i = 0; i < this.numVertices; i++) {
            this.getNeighbors(i);
            this.getDegree(i);
        }
        
        console.log('\n5. EDGE OPERATIONS:');
        console.log(`Edge 0→1 exists: ${this.hasEdge(0, 1)}`);
        console.log(`Edge 1→0 exists: ${this.hasEdge(1, 0)}`);
        console.log(`Edge weight 0→1: ${this.getEdgeWeight(0, 1)}`);
        
        console.log('\n6. GRAPH ANALYSIS:');
        const analysis = this.analyzeGraph();
        
        return analysis;
    }
}

// Test all graph representations
console.log('\n' + '='.repeat(60));

// Create and test different graph types
Graph.createExampleGraphs();

console.log('\n🔸 INTERACTIVE GRAPH OPERATIONS:');
const interactiveGraph = new Graph(0, true, true);
interactiveGraph.demonstrateGraphOperations();
```

### Graph Algorithms Foundation

**Concept**: Understanding how different representations affect algorithm performance and implementation.

```javascript
// Graph Algorithm Performance Analysis

class GraphAlgorithmAnalyzer {
    constructor() {
        this.results = [];
    }
    
    // Analyze representation performance for common operations
    analyzeRepresentationPerformance() {
        console.log('\n=== GRAPH REPRESENTATION PERFORMANCE ANALYSIS ===');
        
        const sizes = [10, 50, 100];
        const densities = [0.1, 0.5, 0.9]; // 10%, 50%, 90% edge density
        
        for (const size of sizes) {
            console.log(`\n📊 Testing graphs with ${size} vertices:`);
            
            for (const density of densities) {
                console.log(`\n  Edge density: ${(density * 100).toFixed(0)}%`);
                
                this.compareRepresentations(size, density);
            }
        }
        
        this.summarizeResults();
    }
    
    compareRepresentations(numVertices, density) {
        // Create test graph
        const graph = new Graph(numVertices, false, false);
        
        // Add edges based on density
        const maxEdges = numVertices * (numVertices - 1) / 2;
        const targetEdges = Math.floor(maxEdges * density);
        
        console.log(`    Creating graph with ${targetEdges} edges...`);
        
        const edges = [];
        for (let i = 0; i < numVertices; i++) {
            for (let j = i + 1; j < numVertices; j++) {
                edges.push([i, j]);
            }
        }
        
        // Shuffle and take first targetEdges
        for (let i = edges.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [edges[i], edges[j]] = [edges[j], edges[i]];
        }
        
        for (let i = 0; i < targetEdges; i++) {
            graph.addEdge(edges[i][0], edges[i][1]);
        }
        
        // Test operations
        const testResults = {
            size: numVertices,
            density: density,
            edges: targetEdges
        };
        
        // Test 1: Edge existence check
        console.log(`    Testing edge existence checks...`);
        const edgeChecks = 1000;
        
        // Matrix approach
        let matrixTime = performance.now();
        for (let i = 0; i < edgeChecks; i++) {
            const u = Math.floor(Math.random() * numVertices);
            const v = Math.floor(Math.random() * numVertices);
            graph.hasEdge(u, v); // Uses adjacency matrix - O(1)
        }
        matrixTime = performance.now() - matrixTime;
        
        testResults.edgeCheckMatrix = matrixTime.toFixed(3);
        
        // Test 2: Neighbor iteration
        console.log(`    Testing neighbor iteration...`);
        
        let listTime = performance.now();
        for (let i = 0; i < numVertices; i++) {
            graph.getNeighbors(i); // Uses adjacency list - O(degree)
        }
        listTime = performance.now() - listTime;
        
        testResults.neighborIteration = listTime.toFixed(3);
        
        // Test 3: Space usage estimation
        const matrixSpace = numVertices * numVertices * 4; // 4 bytes per integer
        const listSpace = (numVertices * 8) + (targetEdges * 2 * 8); // Pointers + edge data
        const edgeSpace = targetEdges * 16; // Source, target pairs
        
        testResults.matrixSpace = matrixSpace;
        testResults.listSpace = listSpace;
        testResults.edgeSpace = edgeSpace;
        
        console.log(`    Matrix space: ${matrixSpace} bytes`);
        console.log(`    List space: ${listSpace} bytes`);
        console.log(`    Edge list space: ${edgeSpace} bytes`);
        
        const bestSpace = Math.min(matrixSpace, listSpace, edgeSpace);
        const bestSpaceType = bestSpace === matrixSpace ? 'Matrix' : 
                             bestSpace === listSpace ? 'List' : 'EdgeList';
        
        console.log(`    Most efficient: ${bestSpaceType} (${bestSpace} bytes)`);
        
        this.results.push(testResults);
    }
    
    summarizeResults() {
        console.log(`\n📋 PERFORMANCE SUMMARY:`);
        console.log(`${'Size'.padEnd(6)} ${'Density'.padEnd(8)} ${'Edges'.padEnd(7)} ${'EdgeCheck'.padEnd(10)} ${'Neighbors'.padEnd(10)} ${'BestSpace'.padEnd(12)}`);
        console.log(`${'===='.padEnd(6)} ${'======='.padEnd(8)} ${'====='.padEnd(7)} ${'========='.padEnd(10)} ${'========='.padEnd(10)} ${'========='.padEnd(12)}`);
        
        this.results.forEach(result => {
            const bestSpace = Math.min(result.matrixSpace, result.listSpace, result.edgeSpace);
            const bestSpaceType = bestSpace === result.matrixSpace ? 'Matrix' : 
                                 bestSpace === result.listSpace ? 'List' : 'EdgeList';
            
            console.log(
                `${result.size.toString().padEnd(6)} ` +
                `${(result.density * 100).toFixed(0).padEnd(8)}% ` +
                `${result.edges.toString().padEnd(7)} ` +
                `${result.edgeCheckMatrix.padEnd(10)}ms ` +
                `${result.neighborIteration.padEnd(10)}ms ` +
                `${bestSpaceType.padEnd(12)}`
            );
        });
        
        console.log(`\n💡 KEY INSIGHTS:`);
        console.log(`✅ Adjacency Matrix:`);
        console.log(`  - Best for: Dense graphs, frequent edge queries`);
        console.log(`  - Time: O(1) edge check, O(V) neighbor iteration`);
        console.log(`  - Space: O(V²) always`);
        
        console.log(`✅ Adjacency List:`);
        console.log(`  - Best for: Sparse graphs, neighbor-heavy algorithms`);
        console.log(`  - Time: O(degree) edge check, O(degree) neighbor iteration`);
        console.log(`  - Space: O(V + E) - scales with actual edges`);
        
        console.log(`✅ Edge List:`);
        console.log(`  - Best for: Edge-processing algorithms, minimal space`);
        console.log(`  - Time: O(E) edge check, O(E) neighbor finding`);
        console.log(`  - Space: O(E) - most compact`);
        
        console.log(`\n🎯 ALGORITHM RECOMMENDATIONS:`);
        console.log(`- DFS/BFS: Adjacency List (neighbor iteration)`);
        console.log(`- Shortest Path: Adjacency List (Dijkstra/Bellman-Ford)`);
        console.log(`- MST Kruskal: Edge List (edge sorting)`);
        console.log(`- MST Prim: Adjacency List or Matrix`);
        console.log(`- Floyd-Warshall: Adjacency Matrix (all-pairs paths)`);
        console.log(`- Network Flow: Adjacency Matrix or List`);
    }
    
    // Demonstrate algorithm-specific representation choices
    demonstrateAlgorithmChoices() {
        console.log('\n=== ALGORITHM-SPECIFIC REPRESENTATION CHOICES ===');
        
        console.log('\n1. GRAPH TRAVERSAL ALGORITHMS:');
        console.log(`DFS/BFS prefer Adjacency Lists because:`);
        console.log(`- Need to iterate through neighbors efficiently`);
        console.log(`- Sparse graphs common in real applications`);
        console.log(`- Memory usage scales with actual edges`);
        
        console.log('\n2. SHORTEST PATH ALGORITHMS:');
        console.log(`Dijkstra's algorithm with Adjacency List:`);
        console.log(`- Extract-min from priority queue: O(log V)`);
        console.log(`- Relax neighbors: O(degree) per vertex`);
        console.log(`- Total: O((V + E) log V) with binary heap`);
        
        console.log(`Floyd-Warshall with Adjacency Matrix:`);
        console.log(`- Triple nested loop through all vertex pairs`);
        console.log(`- O(1) edge weight lookup crucial`);
        console.log(`- Total: O(V³) with O(1) lookups`);
        
        console.log('\n3. MINIMUM SPANNING TREE:');
        console.log(`Kruskal's algorithm with Edge List:`);
        console.log(`- Sort all edges by weight: O(E log E)`);
        console.log(`- Process edges in order with Union-Find`);
        console.log(`- Edge list ideal for sorting`);
        
        console.log(`Prim's algorithm with Adjacency List:`);
        console.log(`- Grow MST by adding minimum weight edge`);
        console.log(`- Need efficient neighbor iteration`);
        console.log(`- Priority queue for edge selection`);
        
        console.log('\n4. SPECIALIZED ALGORITHMS:');
        console.log(`Network Flow (Ford-Fulkerson):`);
        console.log(`- Need residual graph representation`);
        console.log(`- Adjacency Matrix for capacity lookup`);
        console.log(`- Easy to update residual capacities`);
        
        console.log(`Strongly Connected Components:`);
        console.log(`- DFS-based algorithms (Kosaraju, Tarjan)`);
        console.log(`- Adjacency List for efficient traversal`);
        console.log(`- Need both graph and transpose`);
    }
}

// Test algorithm analysis
console.log('\n' + '='.repeat(60));
const analyzer = new GraphAlgorithmAnalyzer();
analyzer.analyzeRepresentationPerformance();
analyzer.demonstrateAlgorithmChoices();
```

## Summary

### Core Graph Concepts Mastered
- **Graph Structure**: Vertices (nodes) connected by edges representing relationships
- **Graph Types**: Directed/undirected, weighted/unweighted, simple/multigraph variations
- **Representation Methods**: Adjacency matrix, adjacency list, and edge list approaches
- **Graph Properties**: Degree, connectivity, density, and structural characteristics

### Graph Representation Strategies

**Adjacency Matrix:**
- **Implementation**: 2D array where matrix[i][j] indicates edge from vertex i to j
- **Time Complexity**: O(1) edge lookup, O(V) neighbor iteration, O(1) edge addition/removal
- **Space Complexity**: O(V²) regardless of actual edge count
- **Best for**: Dense graphs, frequent edge queries, matrix-based algorithms

**Adjacency List:**
- **Implementation**: Array of lists where list[i] contains neighbors of vertex i
- **Time Complexity**: O(degree) edge lookup, O(degree) neighbor iteration, O(1) edge addition
- **Space Complexity**: O(V + E) - scales with actual edges
- **Best for**: Sparse graphs, traversal algorithms, most practical applications

**Edge List:**
- **Implementation**: Array of edge objects/tuples
- **Time Complexity**: O(E) edge lookup, O(E) neighbor finding, O(1) edge addition
- **Space Complexity**: O(E) - most compact representation
- **Best for**: Edge-processing algorithms, sorting edges, minimal memory usage

### Why Graph Representation Matters
- **Algorithm Performance**: Choice affects time complexity of graph operations
- **Memory Efficiency**: Dramatic differences in space usage based on graph density
- **Implementation Simplicity**: Some representations easier to code and debug
- **Problem Suitability**: Different algorithms prefer different representations

### Real-World Graph Applications

**Social Networks:**
- **Vertices**: Users, pages, groups, posts
- **Edges**: Friendships, follows, likes, shares, comments
- **Algorithms**: Community detection, influence propagation, recommendation systems
- **Representation**: Adjacency list (sparse, large-scale networks)

**Transportation Networks:**
- **Vertices**: Intersections, stations, airports, cities
- **Edges**: Roads, rails, flight routes with distances/times
- **Algorithms**: Shortest path, route optimization, traffic flow analysis
- **Representation**: Adjacency list for routing, matrix for all-pairs distances

**Computer Networks:**
- **Vertices**: Routers, switches, servers, devices
- **Edges**: Network links, wireless connections, bandwidth capacities
- **Algorithms**: Network routing, fault tolerance, load balancing
- **Representation**: Adjacency list for topology, matrix for capacity planning

**Web and Internet:**
- **Vertices**: Web pages, domains, servers
- **Edges**: Hyperlinks, API connections, data flows
- **Algorithms**: PageRank, web crawling, link analysis
- **Representation**: Adjacency list (web graph is very sparse)

### Performance Characteristics

**Dense vs Sparse Graphs:**
- **Dense (E ≈ V²)**: Adjacency matrix efficient, O(V²) space acceptable
- **Sparse (E << V²)**: Adjacency list preferred, significant space savings
- **Threshold**: Generally switch to matrix when edge density > 50%

**Operation Frequency:**
- **Frequent edge queries**: Matrix provides O(1) lookup
- **Frequent neighbor iteration**: List provides O(degree) efficiency
- **Edge processing**: Edge list optimal for sorting and filtering

**Memory Constraints:**
- **Limited memory**: Edge list most compact
- **Cache performance**: Matrix better locality for dense graphs
- **Dynamic size**: List adapts to changing edge count

### Graph Algorithm Categories

**Traversal Algorithms:**
- **DFS/BFS**: Prefer adjacency list for neighbor iteration
- **Connected components**: Adjacency list for efficient exploration
- **Cycle detection**: Any representation works, list preferred for sparse graphs

**Shortest Path Algorithms:**
- **Single-source (Dijkstra)**: Adjacency list with priority queue
- **All-pairs (Floyd-Warshall)**: Adjacency matrix for O(1) lookups
- **Negative weights (Bellman-Ford)**: Edge list for edge relaxation

**Minimum Spanning Tree:**
- **Kruskal's algorithm**: Edge list for sorting edges by weight
- **Prim's algorithm**: Adjacency list or matrix with priority queue

**Advanced Algorithms:**
- **Network flow**: Adjacency matrix for capacity management
- **Graph coloring**: Adjacency list for constraint checking
- **Topological sort**: Adjacency list for in-degree computation

### Implementation Best Practices

**Choosing Representation:**
1. **Analyze graph density**: Sparse favors lists, dense favors matrix
2. **Consider operations**: Frequent queries favor matrix, traversal favors lists
3. **Memory constraints**: Edge list most compact, matrix highest overhead
4. **Algorithm requirements**: Some algorithms strongly prefer specific representations

**Optimization Techniques:**
- **Compressed sparse row**: For very sparse matrices
- **Implicit representations**: For regular structures (grids, trees)
- **Hybrid approaches**: Different representations for different subgraphs
- **Dynamic adaptation**: Switch representation based on runtime characteristics

**Error Handling:**
- **Vertex validation**: Check bounds before array access
- **Edge validation**: Prevent duplicate edges in simple graphs
- **Memory management**: Handle dynamic growth efficiently
- **Consistency**: Maintain invariants across representations

### Mathematical Foundations

**Graph Theory Basics:**
- **Handshaking lemma**: Sum of degrees equals 2|E|
- **Complete graphs**: K_n has n(n-1)/2 edges
- **Tree properties**: Connected graph with n-1 edges
- **Bipartite graphs**: 2-colorable graphs

**Complexity Analysis:**
- **Space bounds**: O(V²) matrix, O(V+E) list, O(E) edge list
- **Time bounds**: Vary by operation and representation
- **Density impact**: Performance crossover points depend on graph structure
- **Scalability**: Real-world graphs often sparse, favoring lists

### Advanced Graph Concepts

**Specialized Graphs:**
- **Planar graphs**: Can be drawn without edge crossings
- **Regular graphs**: All vertices have same degree
- **Random graphs**: Erdős-Rényi and other random models
- **Scale-free networks**: Power-law degree distribution

**Dynamic Graphs:**
- **Edge insertions/deletions**: Require efficient updates
- **Streaming graphs**: Process edges in sequence
- **Temporal graphs**: Edges have time stamps
- **Evolving networks**: Structure changes over time

Graph representation is the **foundation of all graph algorithms**, determining **performance, memory usage, and implementation complexity**. Understanding the trade-offs between different representations enables **optimal algorithm design** and **efficient problem solving** for complex network problems! 🚀✨

Next up: **Depth-First Search (DFS)** - Master deep exploration algorithms, learn DFS implementation, applications in cycle detection, topological sorting, and connected components analysis!

<function_calls>
<invoke name="todo_write">
<parameter name="merge">true
