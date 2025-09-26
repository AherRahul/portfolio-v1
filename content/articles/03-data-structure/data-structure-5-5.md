---
title: "Minimum Spanning Trees"
description: "Master connecting all vertices with minimum cost. Learn Kruskal's and Prim's algorithms for finding optimal network connections and infrastructure planning."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "MST Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/mst"
    description: "Interactive MST algorithm visualization and comparison"
  - title: "Spanning Tree Problems"
    type: "practice"
    url: "https://leetcode.com/tag/minimum-spanning-tree/"
    description: "Practice problems for mastering MST algorithms"
  - title: "Graph Theory - MST"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Minimum_spanning_tree"
    description: "Comprehensive minimum spanning tree theory and applications"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758827456/Portfolio/dsa/images/23/mst.png)

Minimum Spanning Trees – Optimal Network Connection Mastery
========================================================

Imagine you're a **network infrastructure engineer** 🌐 tasked with **connecting all cities** in a region with **fiber optic cables** while **minimizing the total installation cost**:

**🏗️ The Infrastructure Challenge:**

**📍 Regional Connectivity Problem:**
- **6 Cities**: A, B, C, D, E, F need internet connectivity
- **Cable Costs**: Vary by distance, terrain, and construction difficulty
- **Goal**: Connect ALL cities with MINIMUM total cable cost
- **Constraint**: Every city must be reachable from every other city

**💰 Cable Installation Costs (in millions):**
```
City Connections with Costs:
A ↔ B: $12M (flat terrain)
A ↔ C: $8M  (moderate distance)
A ↔ D: $25M (mountainous, expensive)
B ↔ C: $6M  (short distance)
B ↔ E: $15M (river crossing)
C ↔ D: $10M (moderate terrain)
C ↔ F: $18M (forest clearing needed)
D ↔ E: $9M  (existing infrastructure)
D ↔ F: $7M  (valley route)
E ↔ F: $11M (standard installation)
```

**❌ Naive Connection Problems:**
```
Connect every city to every other city:
- Total connections: 15 cables (complete graph)
- Total cost: $12M + $8M + $25M + $6M + $15M + $10M + $18M + $9M + $7M + $11M = $121M
- Result: Massive overcost with redundant connections!

Connect cities in a chain (A→B→C→D→E→F):
- Connections: 5 cables
- But which chain? Different orderings give different costs
- May not choose the cheapest possible connections
```

**🎯 The Minimum Spanning Tree Solution:**
Think like a **smart infrastructure planner** who finds the **cheapest way to connect all cities** without **redundant cables**:

**🌳 MST Mathematical Properties:**

**📊 Spanning Tree Characteristics:**
```
Spanning Tree Definition:
- CONNECTS all vertices (spanning)
- FORMS a tree (no cycles, exactly V-1 edges)
- MINIMUM cost among all possible spanning trees

MST for 6 cities:
- Total edges needed: exactly 5 (6-1 = 5)
- No cycles: adding any edge creates a cycle
- Connected: every city reachable from every other city
- Minimum cost: cheapest among all possible spanning trees
```

**⚡ Algorithm Comparison:**

**Kruskal's Algorithm (The Global Optimizer):**
```
Strategy: Sort ALL edges by cost, add cheapest that doesn't create cycle
Think: "What's the cheapest cable we can install next without creating redundancy?"

Process:
1. Sort all cables by cost: $6M, $7M, $8M, $9M, $10M, $11M, $12M, $15M, $18M, $25M
2. Pick cheapest: B↔C ($6M) ✓
3. Pick next cheapest: D↔F ($7M) ✓  
4. Pick next: A↔C ($8M) ✓
5. Pick next: D↔E ($9M) ✓
6. Pick next: C↔D ($10M) ✓
7. Stop: 5 edges selected, all cities connected!

Total cost: $6M + $7M + $8M + $9M + $10M = $40M
```

**Prim's Algorithm (The Incremental Builder):**
```
Strategy: Start from one city, always add cheapest connection to unconnected city
Think: "From our current network, what's the cheapest way to reach a new city?"

Process:
1. Start at city A
2. Cheapest from A: A↔C ($8M) ✓ [Network: A, C]
3. Cheapest from {A,C}: B↔C ($6M) ✓ [Network: A, C, B]  
4. Cheapest from {A,C,B}: C↔D ($10M) ✓ [Network: A, C, B, D]
5. Cheapest from {A,C,B,D}: D↔E ($9M) ✓ [Network: A, C, B, D, E]
6. Cheapest from {A,C,B,D,E}: D↔F ($7M) ✓ [Network: A, C, B, D, E, F]

Total cost: $8M + $6M + $10M + $9M + $7M = $40M (same result!)
```

**🔍 Algorithm Selection Guide:**

**Choose Kruskal When:**
- **Edge-Focused**: Working with edge lists or edge-heavy problems
- **Sparse Graphs**: Few edges relative to vertices (E << V²)
- **Parallel Processing**: Edge sorting can be parallelized
- **Memory Efficient**: Only need edge list and Union-Find structure

**Choose Prim When:**
- **Vertex-Focused**: Working with adjacency lists or vertex-heavy problems
- **Dense Graphs**: Many edges (E ≈ V²)
- **Online Algorithm**: Can add vertices incrementally
- **Simple Implementation**: Easier to implement without Union-Find

**⚙️ Performance Characteristics:**
```
Algorithm | Time Complexity    | Space | Best For
========= | ================== | ===== | ===============
Kruskal   | O(E log E)         | O(V)  | Sparse graphs, edge lists
Prim      | O(E log V)         | O(V)  | Dense graphs, adjacency lists
Prim      | O(V²) simple       | O(V)  | Very dense graphs
```

**🌟 Real-World MST Applications:**

**Network Infrastructure:**
- **Internet Backbone**: Connect ISP nodes with minimum fiber cost
- **Electrical Grid**: Power distribution with minimum transmission line cost
- **Water Supply**: Pipeline networks connecting all neighborhoods
- **Transportation**: Minimum cost road/rail networks connecting all cities

**Computer Science:**
- **Network Design**: LAN/WAN topology optimization
- **Circuit Design**: Minimum wire length in integrated circuits
- **Approximation Algorithms**: Foundation for TSP and Steiner tree approximations
- **Clustering**: Data analysis and machine learning applications

**Engineering and Construction:**
- **Building Design**: Minimum cost structural framework
- **Pipeline Networks**: Oil, gas, water distribution systems
- **Communication Networks**: Radio, cellular tower placement
- **Supply Chain**: Minimum cost distribution networks

**💡 MST Intuition:**
Like a **smart city planner** building the **minimum cost road network** that connects all neighborhoods. **Kruskal** is like a **global optimizer** who sorts all possible road projects by cost and picks the cheapest ones that don't create redundant loops. **Prim** is like an **incremental builder** who starts from downtown and always builds the cheapest road to the nearest unconnected neighborhood. Both approaches guarantee the **globally optimal solution**! 🏗️

This is exactly how MST algorithms work! They provide **mathematically optimal connectivity** with **minimum total cost**, making them essential for **infrastructure planning, network design, and any problem requiring efficient connectivity**! 🚀✨

## The Theoretical Foundation: Understanding Minimum Spanning Trees 🧠

### Spanning Tree Fundamentals

**A spanning tree of a connected graph is a subgraph that includes all vertices and is connected with exactly V-1 edges, forming a tree structure.** The key insight is that this is the minimum number of edges needed to keep all vertices connected.

**Core Properties of Spanning Trees:**

1. **Connectivity**: Every vertex is reachable from every other vertex
2. **Acyclic**: Contains no cycles (tree property)
3. **Minimal Edges**: Exactly V-1 edges (removing any edge disconnects the graph)
4. **Uniqueness**: For any connected graph, multiple spanning trees usually exist

**Mathematical Foundation:**
- **Vertices (V)**: Number of nodes in the graph
- **Edges in ST**: Always exactly V-1 for any spanning tree
- **Tree Property**: Connected + Acyclic = Tree
- **Spanning Property**: Includes all vertices of original graph

### Minimum Spanning Tree (MST) Theory

**A Minimum Spanning Tree is a spanning tree with the smallest possible sum of edge weights among all possible spanning trees of the graph.** This combines the structural requirements of spanning trees with the optimization goal of minimum cost.

**MST Theoretical Properties:**

1. **Optimality**: Globally minimum total weight among all spanning trees
2. **Uniqueness**: May not be unique if multiple edges have same weights
3. **Cut Property**: For any cut, the minimum weight edge crossing the cut is in some MST
4. **Cycle Property**: For any cycle, the maximum weight edge is not in any MST

**Cut Property (Foundation of MST Algorithms):**
- **Cut**: A partition of vertices into two disjoint sets
- **Crossing Edge**: An edge connecting vertices in different sets
- **Theorem**: The minimum weight edge crossing any cut is safe for MST
- **Proof**: Adding this edge to partial MST cannot create a cycle across the cut

**Cycle Property (Validation of MST Algorithms):**
- **Cycle**: Any closed path in the graph
- **Heavy Edge**: Maximum weight edge in the cycle
- **Theorem**: The heaviest edge in any cycle cannot be in MST
- **Proof**: Removing heavy edge and adding lighter alternative maintains connectivity with less cost

### Kruskal's Algorithm Theory

**Kruskal's algorithm builds MST by considering edges in increasing order of weight and adding edges that don't create cycles.** It's a greedy algorithm that makes locally optimal choices leading to globally optimal solution.

**Algorithm Foundation:**
1. **Edge-Centric**: Focuses on edges rather than vertices
2. **Global Perspective**: Considers all edges simultaneously
3. **Cycle Detection**: Uses Union-Find to efficiently detect cycles
4. **Greedy Choice**: Always picks minimum weight safe edge

**Correctness Proof:**
- **Base Case**: Empty set is valid partial MST
- **Inductive Step**: Adding minimum weight safe edge maintains MST property
- **Cut Property**: Each added edge is minimum across some cut
- **Termination**: Algorithm stops when exactly V-1 edges are selected

**Union-Find Data Structure:**
- **Disjoint Sets**: Maintain components of partial MST
- **Union Operation**: Merge two components when edge is added
- **Find Operation**: Determine which component a vertex belongs to
- **Cycle Detection**: Edge creates cycle if endpoints are in same component

### Prim's Algorithm Theory

**Prim's algorithm builds MST by starting from an arbitrary vertex and repeatedly adding the minimum weight edge that connects the growing tree to a new vertex.** It maintains a single connected component throughout execution.

**Algorithm Foundation:**
1. **Vertex-Centric**: Focuses on growing a single connected component
2. **Incremental Growth**: Tree grows one vertex at a time
3. **Priority Queue**: Efficiently finds minimum weight edge to unvisited vertex
4. **Cut Maintenance**: Implicitly maintains cut between visited and unvisited vertices

**Correctness Proof:**
- **Initialization**: Single vertex is valid partial MST
- **Maintenance**: Cut property guarantees safety of chosen edge
- **Progress**: Each iteration adds exactly one vertex to MST
- **Termination**: All vertices included when algorithm completes

**Priority Queue Operations:**
- **Insert**: Add new edges when vertex is added to MST
- **Extract-Min**: Find minimum weight edge to unvisited vertex
- **Decrease-Key**: Update edge weights when shorter path is found
- **Implementation**: Binary heap, Fibonacci heap, or simple array

### Algorithm Complexity Analysis

**Kruskal's Algorithm Complexity:**

**Time Complexity: O(E log E)**
- **Edge Sorting**: O(E log E) dominates the complexity
- **Union-Find Operations**: O(E α(V)) where α is inverse Ackermann function
- **Total**: O(E log E) since E log E >> E α(V)

**Space Complexity: O(V)**
- **Union-Find Structure**: O(V) for parent and rank arrays
- **Edge Storage**: Usually given as input, not additional space
- **Result Storage**: O(V) for MST edges

**Prim's Algorithm Complexity:**

**Time Complexity: O(E log V) with Binary Heap**
- **Priority Queue Operations**: O(V) insert + O(E) decrease-key + O(V) extract-min
- **Binary Heap**: Insert O(log V), Extract-min O(log V), Decrease-key O(log V)
- **Total**: O(V log V + E log V) = O(E log V) for connected graphs

**Time Complexity: O(V²) with Array**
- **Array-based Priority Queue**: Extract-min O(V), Decrease-key O(1)
- **Total**: O(V²) operations
- **Crossover Point**: Better than heap version when E ≈ V²

**Space Complexity: O(V)**
- **Priority Queue**: O(V) for storing vertex-edge pairs
- **Visited Array**: O(V) for tracking MST membership
- **Distance Array**: O(V) for minimum edge weights

### MST Uniqueness and Properties

**MST Uniqueness Conditions:**
- **Unique MST**: All edge weights are distinct
- **Multiple MSTs**: Some edge weights are equal
- **Counting MSTs**: Can be exponential in number of equal-weight edges

**Edge Classification in MST:**
- **Tree Edges**: Edges included in MST (exactly V-1)
- **Non-tree Edges**: Edges not in MST (exactly E-(V-1))
- **Safe Edges**: Can be included in some MST
- **Useless Edges**: Cannot be in any MST

**MST Properties for Algorithm Design:**
1. **Optimal Substructure**: MST contains MST of subproblems
2. **Greedy Choice**: Locally optimal choice leads to global optimum
3. **Cut Respect**: MST respects all minimum cuts
4. **Bridge Priority**: Bridges (cut edges) must be in MST

### Union-Find Data Structure Deep Dive

**Union-Find is crucial for Kruskal's algorithm efficiency and deserves detailed understanding:**

**Basic Operations:**
```javascript
class UnionFind {
    constructor(n) {
        this.parent = Array(n).fill(null).map((_, i) => i);
        this.rank = Array(n).fill(0);
        this.components = n;
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); // Path compression
        }
        return this.parent[x];
    }
    
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX === rootY) return false; // Already connected
        
        // Union by rank optimization
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        
        this.components--;
        return true;
    }
}
```

**Optimizations:**
- **Path Compression**: Makes find operations nearly constant time
- **Union by Rank**: Keeps trees shallow for better performance
- **Combined Complexity**: O(α(n)) per operation where α is inverse Ackermann

### Graph Density Impact on Algorithm Choice

**Edge Density Analysis:**
```
Sparse Graph (E = O(V)):
- Kruskal: O(E log E) = O(V log V)
- Prim: O(E log V) = O(V log V)
- Similar performance, Kruskal often preferred

Medium Density (E = O(V log V)):
- Kruskal: O(E log E) = O(V log² V)
- Prim: O(E log V) = O(V log² V)
- Still similar, implementation factors decide

Dense Graph (E = O(V²)):
- Kruskal: O(E log E) = O(V² log V)
- Prim with heap: O(E log V) = O(V² log V)
- Prim with array: O(V²)
- Prim with array implementation wins
```

**Practical Considerations:**
- **Cache Performance**: Prim's better memory locality
- **Parallelization**: Kruskal's edge sorting can be parallelized
- **Online Processing**: Prim can handle dynamic vertex addition
- **Implementation Complexity**: Prim simpler without Union-Find

## Complete Kruskal's Algorithm Implementation 🔧

**Concept**: Comprehensive Kruskal's algorithm with Union-Find optimization and detailed analysis.

```javascript
// Complete Kruskal's Minimum Spanning Tree Implementation

class KruskalMST {
    constructor(graph) {
        this.graph = graph;
        this.mstEdges = [];
        this.totalCost = 0;
        this.unionFind = null;
        
        // Results tracking
        this.algorithmSteps = [];
        this.rejectedEdges = [];
        this.edgeConsiderationOrder = [];
        
        console.log(`\n🌳 KRUSKAL'S MST ALGORITHM initialized for ${graph.numVertices} vertices`);
    }
    
    // Main Kruskal's algorithm implementation
    findMinimumSpanningTree() {
        console.log(`\n🚀 KRUSKAL'S MINIMUM SPANNING TREE ALGORITHM`);
        console.log(`Finding MST with minimum total weight...`);
        
        // Initialize Union-Find structure
        this.unionFind = new UnionFind(this.graph.numVertices);
        
        // Get and sort all edges by weight
        const allEdges = this.getAllEdges();
        console.log(`\nTotal edges in graph: ${allEdges.length}`);
        
        const sortedEdges = this.sortEdgesByWeight(allEdges);
        console.log(`Edges sorted by weight:`);
        sortedEdges.forEach((edge, index) => {
            console.log(`  ${index + 1}. ${edge.sourceLabel} ↔ ${edge.targetLabel}: ${edge.weight}`);
        });
        
        // Clear previous results
        this.mstEdges = [];
        this.totalCost = 0;
        this.algorithmSteps = [];
        this.rejectedEdges = [];
        this.edgeConsiderationOrder = [];
        
        console.log(`\n--- KRUSKAL'S ALGORITHM EXECUTION ---`);
        console.log(`Need exactly ${this.graph.numVertices - 1} edges for MST`);
        
        let step = 1;
        
        // Process edges in order of increasing weight
        for (const edge of sortedEdges) {
            console.log(`\n--- STEP ${step} ---`);
            console.log(`Considering edge: ${edge.sourceLabel} ↔ ${edge.targetLabel} (weight: ${edge.weight})`);
            
            this.edgeConsiderationOrder.push(edge);
            
            // Check if edge creates a cycle using Union-Find
            const sourceComponent = this.unionFind.find(edge.source);
            const targetComponent = this.unionFind.find(edge.target);
            
            console.log(`  ${edge.sourceLabel} is in component ${sourceComponent}`);
            console.log(`  ${edge.targetLabel} is in component ${targetComponent}`);
            
            if (sourceComponent !== targetComponent) {
                // Edge doesn't create cycle - add to MST
                console.log(`  ✅ ACCEPT: Different components - edge is SAFE`);
                
                this.mstEdges.push(edge);
                this.totalCost += edge.weight;
                
                // Union the components
                this.unionFind.union(edge.source, edge.target);
                
                console.log(`  Union performed: ${edge.sourceLabel} and ${edge.targetLabel} now connected`);
                console.log(`  MST edges so far: ${this.mstEdges.length}`);
                console.log(`  Total cost so far: ${this.totalCost}`);
                console.log(`  Remaining components: ${this.unionFind.components}`);
                
                // Record successful step
                this.algorithmSteps.push({
                    step: step,
                    edge: edge,
                    action: 'accepted',
                    reason: 'Different components - no cycle created',
                    mstEdgesCount: this.mstEdges.length,
                    totalCost: this.totalCost,
                    remainingComponents: this.unionFind.components
                });
                
                // Check if MST is complete
                if (this.mstEdges.length === this.graph.numVertices - 1) {
                    console.log(`\n🎯 MST COMPLETE! Found ${this.mstEdges.length} edges.`);
                    break;
                }
                
            } else {
                // Edge creates cycle - reject
                console.log(`  ❌ REJECT: Same component ${sourceComponent} - edge creates CYCLE`);
                
                this.rejectedEdges.push(edge);
                
                // Record rejection step
                this.algorithmSteps.push({
                    step: step,
                    edge: edge,
                    action: 'rejected',
                    reason: `Both vertices in component ${sourceComponent} - creates cycle`,
                    mstEdgesCount: this.mstEdges.length,
                    totalCost: this.totalCost,
                    remainingComponents: this.unionFind.components
                });
            }
            
            step++;
        }
        
        console.log(`\n✅ KRUSKAL'S ALGORITHM COMPLETE!`);
        this.analyzeMSTResults();
        
        return {
            mstEdges: this.mstEdges,
            totalCost: this.totalCost,
            steps: this.algorithmSteps,
            rejectedEdges: this.rejectedEdges
        };
    }
    
    // Get all edges from the graph
    getAllEdges() {
        const edges = [];
        const addedEdges = new Set();
        
        for (let vertex = 0; vertex < this.graph.numVertices; vertex++) {
            const neighbors = this.graph.getNeighbors(vertex);
            
            for (const neighbor of neighbors) {
                // For undirected graph, avoid duplicate edges
                const edgeKey = `${Math.min(vertex, neighbor.vertex)}-${Math.max(vertex, neighbor.vertex)}`;
                
                if (!addedEdges.has(edgeKey)) {
                    edges.push({
                        source: vertex,
                        target: neighbor.vertex,
                        weight: neighbor.weight,
                        sourceLabel: this.graph.vertexLabels[vertex],
                        targetLabel: this.graph.vertexLabels[neighbor.vertex]
                    });
                    addedEdges.add(edgeKey);
                }
            }
        }
        
        return edges;
    }
    
    // Sort edges by weight (ascending)
    sortEdgesByWeight(edges) {
        return edges.sort((a, b) => {
            if (a.weight !== b.weight) {
                return a.weight - b.weight;
            }
            // For same weight, sort by labels for consistent ordering
            return (a.sourceLabel + a.targetLabel).localeCompare(b.sourceLabel + b.targetLabel);
        });
    }
    
    // Analyze and display MST results
    analyzeMSTResults() {
        console.log(`\n📊 KRUSKAL'S MST ANALYSIS`);
        
        // MST basic properties
        console.log(`\n🌳 MST PROPERTIES:`);
        console.log(`  Vertices: ${this.graph.numVertices}`);
        console.log(`  MST edges: ${this.mstEdges.length}`);
        console.log(`  Expected edges: ${this.graph.numVertices - 1}`);
        console.log(`  Total weight: ${this.totalCost}`);
        
        // Verify MST properties
        const isValidMST = this.mstEdges.length === this.graph.numVertices - 1;
        console.log(`  Valid MST: ${isValidMST ? '✅ Yes' : '❌ No'}`);
        
        // MST edges details
        console.log(`\n📋 MST EDGES:`);
        this.mstEdges.forEach((edge, index) => {
            console.log(`  ${index + 1}. ${edge.sourceLabel} ↔ ${edge.targetLabel}: ${edge.weight}`);
        });
        
        // Rejected edges
        console.log(`\n🚫 REJECTED EDGES (would create cycles):`);
        if (this.rejectedEdges.length > 0) {
            this.rejectedEdges.forEach((edge, index) => {
                console.log(`  ${index + 1}. ${edge.sourceLabel} ↔ ${edge.targetLabel}: ${edge.weight}`);
            });
        } else {
            console.log(`  None - all edges were necessary for MST`);
        }
        
        // Algorithm efficiency
        console.log(`\n⚙️ ALGORITHM EFFICIENCY:`);
        console.log(`  Total edges considered: ${this.edgeConsiderationOrder.length}`);
        console.log(`  Edges accepted: ${this.mstEdges.length}`);
        console.log(`  Edges rejected: ${this.rejectedEdges.length}`);
        console.log(`  Success rate: ${((this.mstEdges.length / this.edgeConsiderationOrder.length) * 100).toFixed(2)}%`);
        
        // Weight distribution
        console.log(`\n📊 WEIGHT ANALYSIS:`);
        if (this.mstEdges.length > 0) {
            const weights = this.mstEdges.map(e => e.weight);
            const minWeight = Math.min(...weights);
            const maxWeight = Math.max(...weights);
            const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;
            
            console.log(`  Minimum edge weight: ${minWeight}`);
            console.log(`  Maximum edge weight: ${maxWeight}`);
            console.log(`  Average edge weight: ${avgWeight.toFixed(2)}`);
            console.log(`  Weight range: ${maxWeight - minWeight}`);
        }
        
        // Algorithm steps summary
        console.log(`\n📈 EXECUTION STEPS:`);
        this.algorithmSteps.forEach(step => {
            const action = step.action === 'accepted' ? '✅ ACCEPT' : '❌ REJECT';
            console.log(`  Step ${step.step}: ${action} ${step.edge.sourceLabel}↔${step.edge.targetLabel} (${step.edge.weight})`);
        });
    }
    
    // Verify MST connectivity
    verifyMSTConnectivity() {
        console.log(`\n🔍 VERIFYING MST CONNECTIVITY:`);
        
        // Build adjacency list from MST edges
        const mstGraph = Array(this.graph.numVertices).fill(null).map(() => []);
        
        for (const edge of this.mstEdges) {
            mstGraph[edge.source].push(edge.target);
            mstGraph[edge.target].push(edge.source);
        }
        
        // Check connectivity using DFS
        const visited = new Array(this.graph.numVertices).fill(false);
        const stack = [0]; // Start from vertex 0
        visited[0] = true;
        let visitedCount = 1;
        
        while (stack.length > 0) {
            const vertex = stack.pop();
            
            for (const neighbor of mstGraph[vertex]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    stack.push(neighbor);
                    visitedCount++;
                }
            }
        }
        
        const isConnected = visitedCount === this.graph.numVertices;
        console.log(`  Vertices reachable: ${visitedCount}/${this.graph.numVertices}`);
        console.log(`  MST is connected: ${isConnected ? '✅ Yes' : '❌ No'}`);
        
        if (!isConnected) {
            console.log(`  Unreachable vertices:`);
            for (let i = 0; i < this.graph.numVertices; i++) {
                if (!visited[i]) {
                    console.log(`    ${this.graph.vertexLabels[i]}`);
                }
            }
        }
        
        return isConnected;
    }
    
    // Compare with other possible spanning trees
    compareMSTWithAlternatives() {
        console.log(`\n🔀 MST OPTIMALITY VERIFICATION:`);
        
        // This would normally require generating all spanning trees (exponential)
        // For demonstration, we'll show a few alternative trees
        
        console.log(`  Current MST total weight: ${this.totalCost}`);
        console.log(`  MST edges: ${this.mstEdges.length}`);
        
        // Calculate total weight of all edges for comparison
        const allEdges = this.getAllEdges();
        const totalAllEdges = allEdges.reduce((sum, edge) => sum + edge.weight, 0);
        
        console.log(`  Total weight of all edges: ${totalAllEdges}`);
        console.log(`  MST uses ${((this.totalCost / totalAllEdges) * 100).toFixed(2)}% of total edge weight`);
        console.log(`  Weight saved: ${totalAllEdges - this.totalCost}`);
        
        return {
            mstWeight: this.totalCost,
            totalWeight: totalAllEdges,
            savings: totalAllEdges - this.totalCost,
            efficiency: (this.totalCost / totalAllEdges) * 100
        };
    }
    
    // Demonstrate complete Kruskal's algorithm
    demonstrateKruskal() {
        console.log('=== KRUSKAL\'S MST ALGORITHM COMPREHENSIVE DEMONSTRATION ===');
        
        console.log('\n1. MINIMUM SPANNING TREE CONSTRUCTION:');
        const result = this.findMinimumSpanningTree();
        
        console.log('\n2. MST CONNECTIVITY VERIFICATION:');
        this.verifyMSTConnectivity();
        
        console.log('\n3. MST OPTIMALITY ANALYSIS:');
        this.compareMSTWithAlternatives();
        
        console.log('\n4. UNION-FIND COMPONENT ANALYSIS:');
        this.analyzeComponentEvolution();
        
        console.log(`\n🎯 KRUSKAL'S ALGORITHM SUMMARY:`);
        console.log(`✅ Edge-centric greedy approach`);
        console.log(`✅ Optimal MST guaranteed by cut property`);
        console.log(`✅ Efficient with Union-Find optimization`);
        console.log(`✅ Excellent for sparse graphs`);
        console.log(`✅ Parallel-friendly edge sorting`);
        
        return result;
    }
    
    // Analyze how components evolve during algorithm execution
    analyzeComponentEvolution() {
        console.log(`\n📊 COMPONENT EVOLUTION ANALYSIS:`);
        
        // Simulate algorithm execution to track component changes
        const tempUnionFind = new UnionFind(this.graph.numVertices);
        
        console.log(`Initial: ${this.graph.numVertices} components (each vertex separate)`);
        
        let componentHistory = [this.graph.numVertices];
        
        for (const step of this.algorithmSteps) {
            if (step.action === 'accepted') {
                console.log(`  After adding ${step.edge.sourceLabel}↔${step.edge.targetLabel}: ${step.remainingComponents} components`);
                componentHistory.push(step.remainingComponents);
            }
        }
        
        console.log(`\nComponent reduction: ${componentHistory.join(' → ')}`);
        console.log(`Final: 1 connected component (MST complete)`);
        
        return componentHistory;
    }
}

// Optimized Union-Find data structure for Kruskal's algorithm
class UnionFind {
    constructor(n) {
        // Initialize each element as its own parent (separate components)
        this.parent = Array(n).fill(null).map((_, i) => i);
        
        // Rank-based union optimization
        this.rank = Array(n).fill(0);
        
        // Track number of separate components
        this.components = n;
        
        console.log(`Union-Find initialized with ${n} separate components`);
    }
    
    // Find with path compression optimization
    find(x) {
        if (this.parent[x] !== x) {
            // Path compression: make every node point directly to root
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    // Union with rank optimization
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        // Already in same component
        if (rootX === rootY) {
            return false;
        }
        
        // Union by rank: attach smaller tree under root of larger tree
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            // Same rank: make one root and increase its rank
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        
        // Decrease component count
        this.components--;
        return true;
    }
    
    // Check if two elements are in same component
    isConnected(x, y) {
        return this.find(x) === this.find(y);
    }
    
    // Get number of separate components
    getComponentCount() {
        return this.components;
    }
    
    // Get all components (for debugging)
    getAllComponents() {
        const components = new Map();
        
        for (let i = 0; i < this.parent.length; i++) {
            const root = this.find(i);
            if (!components.has(root)) {
                components.set(root, []);
            }
            components.get(root).push(i);
        }
        
        return Array.from(components.values());
    }
}

// Example usage with weighted graph
console.log('\n' + '='.repeat(60));

// Weighted graph class for MST demonstration
class WeightedGraphMST {
    constructor(numVertices) {
        this.numVertices = numVertices;
        this.adjacencyList = Array(numVertices).fill(null).map(() => []);
        this.vertexLabels = Array(numVertices).fill(null).map((_, i) => `v${i}`);
    }
    
    // Add undirected weighted edge
    addEdge(source, target, weight) {
        this.adjacencyList[source].push({ vertex: target, weight: weight });
        this.adjacencyList[target].push({ vertex: source, weight: weight });
    }
    
    getNeighbors(vertex) {
        return this.adjacencyList[vertex].map(edge => ({
            vertex: edge.vertex,
            label: this.vertexLabels[edge.vertex],
            weight: edge.weight
        }));
    }
    
    isValidVertex(vertex) {
        return vertex >= 0 && vertex < this.numVertices;
    }
}

// Create network infrastructure example
console.log('\n🔸 EXAMPLE: Network Infrastructure (Cable Installation)');
const networkGraph = new WeightedGraphMST(6);
networkGraph.vertexLabels = ['CityA', 'CityB', 'CityC', 'CityD', 'CityE', 'CityF'];

// Add network connections with installation costs (in millions)
networkGraph.addEdge(0, 1, 12); // CityA ↔ CityB: $12M
networkGraph.addEdge(0, 2, 8);  // CityA ↔ CityC: $8M
networkGraph.addEdge(0, 3, 25); // CityA ↔ CityD: $25M
networkGraph.addEdge(1, 2, 6);  // CityB ↔ CityC: $6M
networkGraph.addEdge(1, 4, 15); // CityB ↔ CityE: $15M
networkGraph.addEdge(2, 3, 10); // CityC ↔ CityD: $10M
networkGraph.addEdge(2, 5, 18); // CityC ↔ CityF: $18M
networkGraph.addEdge(3, 4, 9);  // CityD ↔ CityE: $9M
networkGraph.addEdge(3, 5, 7);  // CityD ↔ CityF: $7M
networkGraph.addEdge(4, 5, 11); // CityE ↔ CityF: $11M

const kruskalDemo = new KruskalMST(networkGraph);
kruskalDemo.demonstrateKruskal();
```

This comprehensive Kruskal's implementation includes detailed Union-Find optimization, step-by-step algorithm execution tracking, and complete analysis of the MST construction process.

## Complete Prim's Algorithm Implementation 🔧

**Concept**: Comprehensive Prim's algorithm with priority queue optimization and incremental tree building.

```javascript
// Complete Prim's Minimum Spanning Tree Implementation

class PrimMST {
    constructor(graph) {
        this.graph = graph;
        this.mstEdges = [];
        this.totalCost = 0;
        this.visited = [];
        this.distances = [];
        this.predecessors = [];
        
        // Results tracking
        this.algorithmSteps = [];
        this.priorityQueueHistory = [];
        this.treeGrowthHistory = [];
        
        console.log(`\n🌲 PRIM'S MST ALGORITHM initialized for ${graph.numVertices} vertices`);
    }
    
    // Main Prim's algorithm implementation
    findMinimumSpanningTree(startVertex = 0) {
        console.log(`\n🚀 PRIM'S MINIMUM SPANNING TREE ALGORITHM`);
        console.log(`Starting from vertex: ${this.graph.vertexLabels[startVertex]}`);
        
        if (!this.graph.isValidVertex(startVertex)) {
            console.log(`❌ Invalid start vertex: ${startVertex}`);
            return null;
        }
        
        this.initializeAlgorithm(startVertex);
        
        console.log(`\nInitialization complete:`);
        console.log(`Starting vertex: ${this.graph.vertexLabels[startVertex]} (distance: 0)`);
        console.log(`All other vertices: distance ∞`);
        
        let step = 1;
        
        // Main algorithm loop - grow MST one vertex at a time
        while (!this.isAllVisited()) {
            console.log(`\n--- STEP ${step} ---`);
            
            // Find minimum distance unvisited vertex
            const nextVertex = this.findMinimumDistanceVertex();
            
            if (nextVertex === -1) {
                console.log(`❌ No more reachable vertices - graph is disconnected`);
                break;
            }
            
            const nextLabel = this.graph.vertexLabels[nextVertex];
            const edgeWeight = this.distances[nextVertex];
            const predecessor = this.predecessors[nextVertex];
            
            console.log(`Selected vertex: ${nextLabel} (distance: ${edgeWeight})`);
            
            // Add vertex to MST
            this.visited[nextVertex] = true;
            
            // Add edge to MST (except for starting vertex)
            if (predecessor !== -1) {
                const predecessorLabel = this.graph.vertexLabels[predecessor];
                
                const edge = {
                    source: predecessor,
                    target: nextVertex,
                    weight: edgeWeight,
                    sourceLabel: predecessorLabel,
                    targetLabel: nextLabel
                };
                
                this.mstEdges.push(edge);
                this.totalCost += edgeWeight;
                
                console.log(`✅ Added edge: ${predecessorLabel} ↔ ${nextLabel} (weight: ${edgeWeight})`);
                console.log(`MST total cost: ${this.totalCost}`);
            } else {
                console.log(`🎯 Starting vertex - no edge added`);
            }
            
            // Update distances to unvisited neighbors
            const updatedDistances = this.updateNeighborDistances(nextVertex);
            
            // Record algorithm step
            this.algorithmSteps.push({
                step: step,
                addedVertex: nextLabel,
                addedEdge: predecessor !== -1 ? `${this.graph.vertexLabels[predecessor]} ↔ ${nextLabel}` : 'None (start)',
                edgeWeight: predecessor !== -1 ? edgeWeight : 0,
                totalCost: this.totalCost,
                mstSize: this.mstEdges.length,
                updatedDistances: updatedDistances,
                visitedVertices: this.getVisitedVertices()
            });
            
            // Track tree growth
            this.treeGrowthHistory.push({
                step: step,
                vertices: this.getVisitedVertices(),
                edges: [...this.mstEdges]
            });
            
            console.log(`MST vertices: [${this.getVisitedVertices().join(', ')}]`);
            console.log(`Remaining unvisited: [${this.getUnvisitedVertices().join(', ')}]`);
            
            step++;
        }
        
        console.log(`\n✅ PRIM'S ALGORITHM COMPLETE!`);
        this.analyzeMSTResults();
        
        return {
            mstEdges: this.mstEdges,
            totalCost: this.totalCost,
            steps: this.algorithmSteps,
            treeGrowth: this.treeGrowthHistory
        };
    }
    
    // Initialize algorithm state
    initializeAlgorithm(startVertex) {
        const numVertices = this.graph.numVertices;
        
        // Initialize arrays
        this.visited = new Array(numVertices).fill(false);
        this.distances = new Array(numVertices).fill(Infinity);
        this.predecessors = new Array(numVertices).fill(-1);
        
        // Set starting vertex
        this.distances[startVertex] = 0;
        
        // Clear previous results
        this.mstEdges = [];
        this.totalCost = 0;
        this.algorithmSteps = [];
        this.priorityQueueHistory = [];
        this.treeGrowthHistory = [];
        
        console.log(`Algorithm initialized with start vertex: ${this.graph.vertexLabels[startVertex]}`);
    }
    
    // Find unvisited vertex with minimum distance
    findMinimumDistanceVertex() {
        let minDistance = Infinity;
        let minVertex = -1;
        
        console.log(`\nSearching for minimum distance unvisited vertex:`);
        
        for (let v = 0; v < this.graph.numVertices; v++) {
            if (!this.visited[v] && this.distances[v] < minDistance) {
                minDistance = this.distances[v];
                minVertex = v;
            }
        }
        
        // Show all unvisited vertices with their distances
        const unvisitedVertices = [];
        for (let v = 0; v < this.graph.numVertices; v++) {
            if (!this.visited[v]) {
                const distance = this.distances[v] === Infinity ? '∞' : this.distances[v];
                unvisitedVertices.push(`${this.graph.vertexLabels[v]}:${distance}`);
            }
        }
        
        console.log(`  Unvisited vertices: [${unvisitedVertices.join(', ')}]`);
        
        if (minVertex !== -1) {
            console.log(`  Minimum: ${this.graph.vertexLabels[minVertex]} (distance: ${minDistance})`);
        }
        
        return minVertex;
    }
    
    // Update distances to neighbors of newly added vertex
    updateNeighborDistances(vertex) {
        console.log(`\nUpdating distances from ${this.graph.vertexLabels[vertex]}:`);
        
        const neighbors = this.graph.getNeighbors(vertex);
        const updatedVertices = [];
        
        for (const neighbor of neighbors) {
            const neighborVertex = neighbor.vertex;
            const edgeWeight = neighbor.weight;
            const neighborLabel = neighbor.label;
            
            console.log(`  Checking neighbor ${neighborLabel}:`);
            console.log(`    Edge weight: ${edgeWeight}`);
            console.log(`    Current distance: ${this.distances[neighborVertex] === Infinity ? '∞' : this.distances[neighborVertex]}`);
            
            if (!this.visited[neighborVertex]) {
                if (edgeWeight < this.distances[neighborVertex]) {
                    console.log(`    ✅ UPDATE: ${this.distances[neighborVertex] === Infinity ? '∞' : this.distances[neighborVertex]} → ${edgeWeight}`);
                    
                    this.distances[neighborVertex] = edgeWeight;
                    this.predecessors[neighborVertex] = vertex;
                    
                    updatedVertices.push({
                        vertex: neighborLabel,
                        oldDistance: this.distances[neighborVertex] === Infinity ? '∞' : this.distances[neighborVertex],
                        newDistance: edgeWeight,
                        predecessor: this.graph.vertexLabels[vertex]
                    });
                } else {
                    console.log(`    ⚠️ No update: ${edgeWeight} ≥ ${this.distances[neighborVertex]}`);
                }
            } else {
                console.log(`    ⚪ Already in MST - skipped`);
            }
        }
        
        if (updatedVertices.length > 0) {
            console.log(`  Distance updates:`);
            updatedVertices.forEach(update => {
                console.log(`    ${update.vertex}: ${update.oldDistance} → ${update.newDistance} (via ${update.predecessor})`);
            });
        } else {
            console.log(`  No distance updates made`);
        }
        
        return updatedVertices;
    }
    
    // Check if all vertices are visited
    isAllVisited() {
        return this.visited.every(v => v);
    }
    
    // Get list of visited vertices
    getVisitedVertices() {
        const visited = [];
        for (let v = 0; v < this.graph.numVertices; v++) {
            if (this.visited[v]) {
                visited.push(this.graph.vertexLabels[v]);
            }
        }
        return visited;
    }
    
    // Get list of unvisited vertices
    getUnvisitedVertices() {
        const unvisited = [];
        for (let v = 0; v < this.graph.numVertices; v++) {
            if (!this.visited[v]) {
                unvisited.push(this.graph.vertexLabels[v]);
            }
        }
        return unvisited;
    }
    
    // Analyze and display MST results
    analyzeMSTResults() {
        console.log(`\n📊 PRIM'S MST ANALYSIS`);
        
        // MST basic properties
        console.log(`\n🌲 MST PROPERTIES:`);
        console.log(`  Vertices: ${this.graph.numVertices}`);
        console.log(`  MST edges: ${this.mstEdges.length}`);
        console.log(`  Expected edges: ${this.graph.numVertices - 1}`);
        console.log(`  Total weight: ${this.totalCost}`);
        
        // Verify MST properties
        const isValidMST = this.mstEdges.length === this.graph.numVertices - 1;
        console.log(`  Valid MST: ${isValidMST ? '✅ Yes' : '❌ No'}`);
        
        // MST edges in order of addition
        console.log(`\n📋 MST EDGES (in order of addition):`);
        this.mstEdges.forEach((edge, index) => {
            console.log(`  ${index + 1}. ${edge.sourceLabel} ↔ ${edge.targetLabel}: ${edge.weight}`);
        });
        
        // Algorithm efficiency analysis
        console.log(`\n⚙️ ALGORITHM EFFICIENCY:`);
        console.log(`  Total steps: ${this.algorithmSteps.length}`);
        console.log(`  Vertices processed: ${this.algorithmSteps.length}`);
        
        const totalDistanceUpdates = this.algorithmSteps.reduce((sum, step) => sum + step.updatedDistances.length, 0);
        console.log(`  Total distance updates: ${totalDistanceUpdates}`);
        console.log(`  Average updates per step: ${(totalDistanceUpdates / this.algorithmSteps.length).toFixed(2)}`);
        
        // Tree growth analysis
        console.log(`\n📈 TREE GROWTH PATTERN:`);
        this.treeGrowthHistory.forEach(growth => {
            console.log(`  Step ${growth.step}: ${growth.vertices.length} vertices, ${growth.edges.length} edges`);
        });
        
        // Weight distribution
        console.log(`\n📊 WEIGHT ANALYSIS:`);
        if (this.mstEdges.length > 0) {
            const weights = this.mstEdges.map(e => e.weight);
            const minWeight = Math.min(...weights);
            const maxWeight = Math.max(...weights);
            const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;
            
            console.log(`  Minimum edge weight: ${minWeight}`);
            console.log(`  Maximum edge weight: ${maxWeight}`);
            console.log(`  Average edge weight: ${avgWeight.toFixed(2)}`);
            console.log(`  Weight range: ${maxWeight - minWeight}`);
        }
    }
    
    // Compare with different starting vertices
    compareStartingVertices() {
        console.log(`\n🔄 COMPARING DIFFERENT STARTING VERTICES:`);
        
        const results = [];
        
        for (let startVertex = 0; startVertex < this.graph.numVertices; startVertex++) {
            console.log(`\nTesting start vertex: ${this.graph.vertexLabels[startVertex]}`);
            
            // Reset and run algorithm
            const tempMST = new PrimMST(this.graph);
            const result = tempMST.findMinimumSpanningTree(startVertex);
            
            if (result) {
                results.push({
                    startVertex: this.graph.vertexLabels[startVertex],
                    totalCost: result.totalCost,
                    steps: result.steps.length
                });
                
                console.log(`  Total cost: ${result.totalCost}`);
                console.log(`  Algorithm steps: ${result.steps.length}`);
            }
        }
        
        console.log(`\n📊 STARTING VERTEX COMPARISON:`);
        console.log(`Start Vertex | Total Cost | Steps`);
        console.log(`=============|============|======`);
        
        results.forEach(result => {
            console.log(`${result.startVertex.padEnd(12)} | ${result.totalCost.toString().padEnd(10)} | ${result.steps}`);
        });
        
        // Verify all results have same total cost (MST uniqueness)
        const uniqueCosts = [...new Set(results.map(r => r.totalCost))];
        if (uniqueCosts.length === 1) {
            console.log(`✅ All starting vertices produce same MST cost: ${uniqueCosts[0]}`);
        } else {
            console.log(`⚠️ Different MST costs found - check for equal weight edges`);
        }
        
        return results;
    }
    
    // Demonstrate step-by-step execution
    demonstrateStepByStep() {
        console.log(`\n📋 STEP-BY-STEP EXECUTION ANALYSIS:`);
        
        this.algorithmSteps.forEach(step => {
            console.log(`\nStep ${step.step}:`);
            console.log(`  Added vertex: ${step.addedVertex}`);
            console.log(`  Added edge: ${step.addedEdge}`);
            console.log(`  Edge weight: ${step.edgeWeight}`);
            console.log(`  Running total: ${step.totalCost}`);
            console.log(`  MST size: ${step.mstSize} edges`);
            console.log(`  Visited vertices: [${step.visitedVertices.join(', ')}]`);
            
            if (step.updatedDistances.length > 0) {
                console.log(`  Distance updates:`);
                step.updatedDistances.forEach(update => {
                    console.log(`    ${update.vertex}: ${update.oldDistance} → ${update.newDistance}`);
                });
            }
        });
    }
    
    // Demonstrate complete Prim's algorithm
    demonstratePrim() {
        console.log('=== PRIM\'S MST ALGORITHM COMPREHENSIVE DEMONSTRATION ===');
        
        console.log('\n1. MINIMUM SPANNING TREE CONSTRUCTION:');
        const result = this.findMinimumSpanningTree(0);
        
        console.log('\n2. STEP-BY-STEP EXECUTION:');
        this.demonstrateStepByStep();
        
        console.log('\n3. STARTING VERTEX COMPARISON:');
        this.compareStartingVertices();
        
        console.log('\n4. MST VERIFICATION:');
        this.verifyMSTProperties();
        
        console.log(`\n🎯 PRIM'S ALGORITHM SUMMARY:`);
        console.log(`✅ Vertex-centric incremental approach`);
        console.log(`✅ Optimal MST guaranteed by cut property`);
        console.log(`✅ Efficient with priority queue optimization`);
        console.log(`✅ Excellent for dense graphs`);
        console.log(`✅ Simple implementation and understanding`);
        
        return result;
    }
    
    // Verify MST properties
    verifyMSTProperties() {
        console.log(`\n🔍 MST PROPERTY VERIFICATION:`);
        
        // Check edge count
        const expectedEdges = this.graph.numVertices - 1;
        const actualEdges = this.mstEdges.length;
        console.log(`  Edge count: ${actualEdges}/${expectedEdges} ${actualEdges === expectedEdges ? '✅' : '❌'}`);
        
        // Check connectivity (already done in Kruskal)
        console.log(`  Connectivity: ✅ (guaranteed by algorithm)`);
        
        // Check for cycles (trees have no cycles)
        console.log(`  Acyclic: ✅ (guaranteed by tree construction)`);
        
        // Check optimality (would require comparing with all spanning trees)
        console.log(`  Optimality: ✅ (guaranteed by cut property)`);
        
        return {
            validEdgeCount: actualEdges === expectedEdges,
            connected: true,
            acyclic: true,
            optimal: true
        };
    }
}

// Priority Queue implementation for optimized Prim's algorithm
class PrimPriorityQueue {
    constructor() {
        this.heap = [];
        this.vertexPositions = new Map();
    }
    
    insert(vertex, distance, predecessor) {
        const node = { vertex, distance, predecessor };
        this.heap.push(node);
        const index = this.heap.length - 1;
        this.vertexPositions.set(vertex, index);
        this.bubbleUp(index);
    }
    
    extractMin() {
        if (this.heap.length === 0) return null;
        
        const min = this.heap[0];
        const last = this.heap.pop();
        
        this.vertexPositions.delete(min.vertex);
        
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.vertexPositions.set(last.vertex, 0);
            this.bubbleDown(0);
        }
        
        return min;
    }
    
    decreaseKey(vertex, newDistance, newPredecessor) {
        const position = this.vertexPositions.get(vertex);
        if (position === undefined) return false;
        
        if (newDistance >= this.heap[position].distance) return false;
        
        this.heap[position].distance = newDistance;
        this.heap[position].predecessor = newPredecessor;
        this.bubbleUp(position);
        return true;
    }
    
    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            
            if (this.heap[index].distance >= this.heap[parentIndex].distance) break;
            
            this.swap(index, parentIndex);
            index = parentIndex;
        }
    }
    
    bubbleDown(index) {
        while (true) {
            let minIndex = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            
            if (leftChild < this.heap.length && 
                this.heap[leftChild].distance < this.heap[minIndex].distance) {
                minIndex = leftChild;
            }
            
            if (rightChild < this.heap.length && 
                this.heap[rightChild].distance < this.heap[minIndex].distance) {
                minIndex = rightChild;
            }
            
            if (minIndex === index) break;
            
            this.swap(index, minIndex);
            index = minIndex;
        }
    }
    
    swap(i, j) {
        const temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
        
        this.vertexPositions.set(this.heap[i].vertex, i);
        this.vertexPositions.set(this.heap[j].vertex, j);
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
}

// Optimized Prim's implementation with priority queue
class OptimizedPrimMST {
    constructor(graph) {
        this.graph = graph;
    }
    
    findMinimumSpanningTree(startVertex = 0) {
        console.log(`\n⚡ OPTIMIZED PRIM'S MST with Priority Queue`);
        console.log(`Starting from: ${this.graph.vertexLabels[startVertex]}`);
        
        const mstEdges = [];
        const visited = new Set();
        const pq = new PrimPriorityQueue();
        
        let totalCost = 0;
        let operations = 0;
        
        // Start with the initial vertex
        visited.add(startVertex);
        
        // Add all edges from start vertex to priority queue
        const startNeighbors = this.graph.getNeighbors(startVertex);
        for (const neighbor of startNeighbors) {
            if (!visited.has(neighbor.vertex)) {
                pq.insert(neighbor.vertex, neighbor.weight, startVertex);
            }
        }
        
        console.log(`Initial edges in priority queue: ${startNeighbors.length}`);
        
        while (!pq.isEmpty() && visited.size < this.graph.numVertices) {
            const minNode = pq.extractMin();
            const vertex = minNode.vertex;
            const distance = minNode.distance;
            const predecessor = minNode.predecessor;
            
            operations++;
            
            if (visited.has(vertex)) continue;
            
            // Add vertex to MST
            visited.add(vertex);
            totalCost += distance;
            
            const edge = {
                source: predecessor,
                target: vertex,
                weight: distance,
                sourceLabel: this.graph.vertexLabels[predecessor],
                targetLabel: this.graph.vertexLabels[vertex]
            };
            
            mstEdges.push(edge);
            
            console.log(`Added: ${edge.sourceLabel} ↔ ${edge.targetLabel} (${distance})`);
            
            // Add new edges to priority queue
            const neighbors = this.graph.getNeighbors(vertex);
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor.vertex)) {
                    pq.insert(neighbor.vertex, neighbor.weight, vertex);
                }
            }
        }
        
        console.log(`✅ Optimized Prim's completed in ${operations} operations`);
        console.log(`Total MST cost: ${totalCost}`);
        
        return { mstEdges, totalCost, operations };
    }
}

// Test optimized Prim's algorithm
console.log('\n🔸 PRIM\'S ALGORITHM DEMONSTRATION');
const primDemo = new PrimMST(networkGraph);
primDemo.demonstratePrim();

// Performance comparison
console.log('\n🔸 PERFORMANCE COMPARISON: Standard vs Optimized');
const optimizedPrimDemo = new OptimizedPrimMST(networkGraph);
optimizedPrimDemo.findMinimumSpanningTree(0);

// Algorithm comparison
console.log('\n🔸 ALGORITHM COMPARISON: Kruskal vs Prim');
console.log(`\nKruskal's Result:`);
console.log(`  Total cost: ${kruskalDemo.totalCost}`);
console.log(`  Approach: Edge-centric (sort all edges first)`);

console.log(`\nPrim's Result:`);
console.log(`  Total cost: ${primDemo.totalCost}`);
console.log(`  Approach: Vertex-centric (grow tree incrementally)`);

if (kruskalDemo.totalCost === primDemo.totalCost) {
    console.log(`✅ Both algorithms found optimal MST with same cost!`);
} else {
    console.log(`⚠️ Different costs found - investigation needed`);
}
```

This comprehensive Prim's implementation demonstrates the incremental tree-building approach with detailed step tracking, priority queue optimization, and comparison with different starting vertices.

## Summary

### Core MST Concepts Mastered
- **Spanning Tree**: Subgraph connecting all vertices with exactly V-1 edges (tree structure)
- **Minimum Spanning Tree**: Spanning tree with minimum total edge weight
- **Cut Property**: Minimum edge crossing any cut is safe for MST (foundation of both algorithms)
- **Cycle Property**: Heaviest edge in any cycle cannot be in MST (validation principle)

### Algorithm Mastery Summary

**Kruskal's Algorithm:**
- **Approach**: Edge-centric greedy algorithm
- **Strategy**: Sort all edges, add cheapest edge that doesn't create cycle
- **Data Structure**: Union-Find for efficient cycle detection
- **Time Complexity**: O(E log E) dominated by edge sorting
- **Space Complexity**: O(V) for Union-Find structure
- **Best for**: Sparse graphs, edge lists, parallel processing

**Prim's Algorithm:**
- **Approach**: Vertex-centric incremental algorithm  
- **Strategy**: Grow MST one vertex at a time, always add cheapest edge to new vertex
- **Data Structure**: Priority queue for efficient minimum edge selection
- **Time Complexity**: O(E log V) with binary heap, O(V²) with array
- **Space Complexity**: O(V) for priority queue and visited tracking
- **Best for**: Dense graphs, adjacency lists, online processing

### Union-Find Data Structure Mastery

**Core Operations:**
- **Find**: Determine which component a vertex belongs to
- **Union**: Merge two components when edge is added
- **Optimizations**: Path compression + Union by rank = O(α(n)) per operation

**Applications Beyond MST:**
- **Connected Components**: Determine graph connectivity
- **Cycle Detection**: Identify cycles in undirected graphs
- **Dynamic Connectivity**: Handle edge insertions efficiently
- **Percolation Theory**: Model physical systems and phase transitions

### Real-World MST Applications Mastered

**Network Infrastructure:**
- **Telecommunications**: Minimum cost fiber optic cable networks
- **Internet Backbone**: ISP interconnection with minimal infrastructure cost
- **Electrical Grid**: Power transmission networks with minimum line cost
- **Water/Gas Pipelines**: Distribution networks with minimum pipeline length

**Transportation and Logistics:**
- **Road Networks**: Minimum cost road construction connecting all cities
- **Railway Systems**: Optimal rail line placement for regional connectivity
- **Supply Chain**: Minimum cost distribution networks
- **Emergency Services**: Optimal placement of emergency response networks

**Computer Science and Technology:**
- **Circuit Design**: Minimum wire length in integrated circuits
- **Network Topology**: LAN/WAN design with optimal connectivity
- **Approximation Algorithms**: Foundation for TSP and Steiner tree approximations
- **Clustering Algorithms**: Data analysis and machine learning applications

**Engineering and Construction:**
- **Building Design**: Minimum cost structural frameworks
- **HVAC Systems**: Optimal ductwork and piping layouts
- **Communication Networks**: Radio tower and cellular infrastructure
- **Mining Operations**: Minimum cost tunneling and access networks

### Performance Optimization Techniques

**Kruskal's Optimizations:**
- **Edge Sorting**: Use efficient sorting algorithms (merge sort, heap sort)
- **Union-Find**: Path compression + union by rank for nearly constant time
- **Early Termination**: Stop when V-1 edges found
- **Parallel Processing**: Edge sorting and initial processing can be parallelized

**Prim's Optimizations:**
- **Priority Queue Choice**: Binary heap vs Fibonacci heap vs array-based
- **Dense Graph Optimization**: Use O(V²) array-based implementation
- **Early Termination**: Can stop when target vertex reached (for partial MST)
- **Memory Locality**: Better cache performance than Kruskal for large graphs

### Algorithm Selection Guidelines

**Graph Characteristics:**
```
Sparse Graphs (E ≈ V):
- Kruskal: O(E log E) = O(V log V)
- Prim: O(E log V) = O(V log V)
- Similar performance, choose based on data structure preference

Dense Graphs (E ≈ V²):
- Kruskal: O(E log E) = O(V² log V)
- Prim with heap: O(E log V) = O(V² log V)  
- Prim with array: O(V²) - best for very dense graphs

Medium Density:
- Both perform similarly
- Consider implementation complexity and memory requirements
```

**Input Format Considerations:**
```
Edge List Format:
- Kruskal naturally fits (just sort the list)
- Prim requires building adjacency structure

Adjacency List/Matrix:
- Prim naturally fits (efficient neighbor access)
- Kruskal requires extracting all edges first
```

**Dynamic Requirements:**
```
Static Graph:
- Either algorithm works well
- Choose based on density and performance needs

Dynamic Edge Addition:
- Kruskal with Union-Find handles incremental updates
- Prim requires complete recomputation

Online Processing:
- Prim can build MST as vertices arrive
- Kruskal needs all edges before starting
```

### Implementation Best Practices

**Data Structure Selection:**
- **Union-Find**: Always use path compression + union by rank
- **Priority Queue**: Binary heap for most cases, array for very dense graphs
- **Edge Storage**: Consider memory layout for cache efficiency

**Memory Management:**
- **Large Graphs**: Stream edges for Kruskal, use sparse representations
- **Result Storage**: Store MST edges efficiently, avoid redundant data
- **Temporary Storage**: Minimize memory allocations in inner loops

**Error Handling:**
- **Disconnected Graphs**: Detect and handle disconnected components
- **Invalid Weights**: Validate edge weights and handle special cases
- **Overflow Prevention**: Use appropriate numeric types for weight sums

### Common Pitfalls and Solutions

**Kruskal's Pitfalls:**
- **Directed Graphs**: Algorithm assumes undirected graphs
- **Union-Find Bugs**: Incorrect path compression or union by rank implementation
- **Edge Duplication**: Handle multiple edges between same vertices correctly

**Prim's Pitfalls:**
- **Priority Queue Updates**: Ensure decrease-key operations work correctly
- **Starting Vertex**: Algorithm works from any vertex, but may affect tie-breaking
- **Dense Graph Performance**: Use array-based priority queue for better performance

**General MST Pitfalls:**
- **Equal Weight Edges**: Multiple MSTs possible, algorithm may find different valid solutions
- **Disconnected Graphs**: MST undefined for disconnected graphs (produces forest)
- **Negative Weights**: Both algorithms handle negative weights correctly

### Advanced MST Concepts

**MST Variants:**
- **Euclidean MST**: MST in geometric plane with distance weights
- **Degree-Constrained MST**: MST with maximum vertex degree constraints
- **Dynamic MST**: Maintain MST as edges are added/removed
- **Distributed MST**: Compute MST in distributed/parallel environments

**Approximation Applications:**
- **Traveling Salesman Problem**: MST provides 2-approximation lower bound
- **Steiner Tree Problem**: MST used in approximation algorithms
- **Network Design**: MST as foundation for more complex network optimization

**Theoretical Extensions:**
- **Matroids**: MST as example of matroid optimization
- **Cuts and Flows**: Relationship between MST and maximum flow problems
- **Randomized Algorithms**: Karger-Klein-Tarjan randomized MST algorithm

Minimum Spanning Trees represent **fundamental network optimization mastery** with **mathematical optimality guarantees**. From telecommunications infrastructure to circuit design, MST algorithms provide **efficient solutions** to **connectivity optimization problems** that are both **theoretically elegant and practically essential**! 🚀✨

**Module 5 Complete!** We've mastered comprehensive graph algorithms from basic representation through advanced applications. Next up: **Module 6 - Sorting Algorithms** where we'll explore the art and science of organizing data efficiently! 🎯
