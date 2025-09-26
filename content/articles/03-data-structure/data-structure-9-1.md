---
title: "Greedy Algorithms & Strategy"
description: "Master greedy algorithm design. Learn optimal strategy selection, activity scheduling, fractional knapsack, and greedy correctness proofs."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - greedy-algorithms
  - optimization
resources:
  - title: "Greedy Algorithm Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/greedy"
    description: "Interactive visualization of greedy algorithm strategies"
  - title: "Optimization Theory"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Greedy_algorithm"
    description: "Mathematical foundations of greedy optimization"
  - title: "Algorithm Design Patterns"
    type: "practice"
    url: "https://leetcode.com/tag/greedy/"
    description: "Practice greedy algorithm problems"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758827456/Portfolio/dsa/images/37/greedy_algorithms.png)

Greedy Algorithms & Strategy – Mastering Optimal Local Decisions
--------------------------------------------------------------------

Imagine you're the **Chief Resource Optimizer** 🎯 at a **space exploration mission control center** where **every decision must be optimal immediately** because **there's no opportunity to reconsider** and **local optimal choices must lead to global success**:

**🚀 The Mars Mission Optimization Challenge:**

**⏰ Scenario 1: Launch Window Selection (Activity Scheduling)**
```
Problem: Schedule 50 critical experiments within 72-hour Mars transit window
Constraint: Each experiment has specific start/end times, no overlaps allowed
Traditional approach: Try all 2^50 possible combinations = impossible
Greedy insight: Always pick experiment that finishes earliest (leaves most room)
Example: Exp1(0-2hr), Exp2(1-4hr), Exp3(2-3hr) → Pick Exp1, then Exp3
Result: Provably optimal solution in O(n log n) time
```

**⚡ Scenario 2: Power Distribution (Fractional Knapsack)**
```
Problem: Allocate 1000kW power among 20 spacecraft systems
Challenge: Each system has different power efficiency (value per kW)
Traditional approach: Examine all possible power distributions = exponential
Greedy strategy: Prioritize highest efficiency systems first
Example: Life Support(10val/kW), Navigation(8val/kW), Research(3val/kW)
Result: Maximum mission value through simple sorting + allocation
```

**🛰️ Scenario 3: Communication Route (Minimum Spanning Tree)**
```
Problem: Connect 15 space stations with minimum total transmission delay
Challenge: Build minimum cost network ensuring all stations connected
Traditional approach: Examine all possible spanning trees = (n-2)^n possibilities
Greedy algorithms: Kruskal's (edges) or Prim's (vertices) - always add minimum cost
Result: Provably optimal network topology in O(E log V) time
```

**💡 The Greedy Optimization Principle:**
**Greedy algorithms** represent the **art of optimal immediate decision-making** - choosing the **locally best option** at each step with **mathematical confidence** that these **local optimizations** will **converge to global optimality**. This approach transforms **complex optimization problems** into **simple, efficient procedures** when the **greedy choice property** and **optimal substructure** align perfectly.


## The Theoretical Foundation

### Greedy Algorithm Fundamentals

**Core Greedy Strategy:**
At each decision point, make the **locally optimal choice** without considering future consequences. This approach succeeds when:

1. **Greedy Choice Property**: A globally optimal solution can be arrived at by making locally optimal choices
2. **Optimal Substructure**: An optimal solution contains optimal solutions to subproblems
3. **No Dependencies**: Current choices don't invalidate future optimal choices

**Greedy vs Dynamic Programming:**
- **Greedy**: Makes irrevocable choices, never reconsiders previous decisions
- **DP**: Explores all possible choices, considers multiple subproblem solutions
- **Greedy Advantage**: Often simpler and more efficient (O(n log n) vs O(n²))
- **DP Advantage**: Handles complex dependencies that greedy cannot

### Mathematical Correctness Framework

**Proving Greedy Correctness:**

1. **Exchange Argument**: Show any optimal solution can be transformed into greedy solution without losing optimality
2. **Staying Ahead**: Prove greedy solution is always at least as good as any other approach at each step
3. **Structural Induction**: Demonstrate that optimal substructure property holds

**Common Greedy Patterns:**
- **Sorting-based**: Sort by priority, then make sequential choices
- **Priority Queue**: Maintain dynamic ordering of choices
- **Interval Selection**: Optimize over time or space intervals
- **Fractional Optimization**: Allow partial selection for maximum efficiency


## 1. Activity Scheduling - Time Optimization Mastery

### The Classic Interval Scheduling Problem

```javascript
/**
 * Activity Scheduling - Select maximum number of non-overlapping activities
 * Greedy Strategy: Always pick activity that finishes earliest
 */

function activityScheduling(activities) {
    console.log(`=== Activity Scheduling Problem ===`);
    console.log("Available activities:");
    
    activities.forEach((activity, i) => {
        console.log(`Activity ${i}: [${activity.start}, ${activity.end}] - ${activity.name}`);
    });
    
    // Sort by end time (greedy choice: earliest finish time)
    const sortedActivities = [...activities].sort((a, b) => a.end - b.start);
    
    console.log("\nSorted by end time (greedy strategy):");
    sortedActivities.forEach((activity, i) => {
        console.log(`${i}: [${activity.start}, ${activity.end}] - ${activity.name}`);
    });
    
    const selected = [];
    let lastEndTime = -1;
    
    console.log("\nGreedy selection process:");
    
    for (let i = 0; i < sortedActivities.length; i++) {
        const activity = sortedActivities[i];
        
        console.log(`\nConsidering: ${activity.name} [${activity.start}, ${activity.end}]`);
        console.log(`Last end time: ${lastEndTime}`);
        
        if (activity.start >= lastEndTime) {
            selected.push(activity);
            lastEndTime = activity.end;
            console.log(`✓ SELECTED - No conflict, updates last end time to ${lastEndTime}`);
        } else {
            console.log(`✗ REJECTED - Conflicts with previous activity (starts at ${activity.start} < ${lastEndTime})`);
        }
        
        console.log(`Current selection: [${selected.map(a => a.name).join(', ')}]`);
    }
    
    console.log(`\nFinal Schedule:`);
    console.log(`Selected ${selected.length} activities:`);
    selected.forEach((activity, i) => {
        console.log(`${i + 1}. ${activity.name}: [${activity.start}, ${activity.end}]`);
    });
    
    return selected;
}

// Weighted activity scheduling (requires DP, but shows greedy limitation)
function weightedActivityScheduling(activities) {
    console.log(`\n=== Weighted Activity Scheduling ===`);
    console.log("Activities with weights (value):");
    
    activities.forEach((activity, i) => {
        console.log(`Activity ${i}: [${activity.start}, ${activity.end}] value=${activity.value} - ${activity.name}`);
    });
    
    // Sort by end time
    const sorted = [...activities].sort((a, b) => a.end - b.start);
    
    console.log("\nUsing DP (not greedy) for weighted version:");
    
    const n = sorted.length;
    const dp = new Array(n + 1).fill(0);
    const solution = new Array(n + 1).fill(null);
    
    // For each activity, find latest non-conflicting activity
    function findLatestNonConflicting(index) {
        for (let i = index - 1; i >= 0; i--) {
            if (sorted[i].end <= sorted[index].start) {
                return i;
            }
        }
        return -1;
    }
    
    console.log("\nDP computation:");
    
    for (let i = 1; i <= n; i++) {
        const activity = sorted[i - 1];
        const latest = findLatestNonConflicting(i - 1);
        
        // Option 1: Don't include current activity
        const withoutCurrent = dp[i - 1];
        
        // Option 2: Include current activity
        const withCurrent = activity.value + (latest >= 0 ? dp[latest + 1] : 0);
        
        console.log(`Activity ${activity.name}:`);
        console.log(`  Without: ${withoutCurrent}`);
        console.log(`  With: ${activity.value} + ${latest >= 0 ? dp[latest + 1] : 0} = ${withCurrent}`);
        
        if (withCurrent > withoutCurrent) {
            dp[i] = withCurrent;
            solution[i] = { include: true, activity, prev: latest + 1 };
            console.log(`  Choose to include (value: ${withCurrent})`);
        } else {
            dp[i] = withoutCurrent;
            solution[i] = { include: false, prev: i - 1 };
            console.log(`  Choose to exclude (value: ${withoutCurrent})`);
        }
    }
    
    // Reconstruct solution
    const selected = [];
    let current = n;
    
    while (current > 0 && solution[current]) {
        if (solution[current].include) {
            selected.unshift(solution[current].activity);
        }
        current = solution[current].prev;
    }
    
    console.log(`\nOptimal weighted schedule (value: ${dp[n]}):`);
    selected.forEach((activity, i) => {
        console.log(`${i + 1}. ${activity.name}: [${activity.start}, ${activity.end}] value=${activity.value}`);
    });
    
    return { value: dp[n], activities: selected };
}

// Meeting room allocation
function meetingRoomAllocation(meetings) {
    console.log(`\n=== Meeting Room Allocation ===`);
    console.log("Meeting requests:");
    
    meetings.forEach((meeting, i) => {
        console.log(`Meeting ${i}: [${meeting.start}, ${meeting.end}] - ${meeting.name}`);
    });
    
    // Create events for start and end times
    const events = [];
    
    meetings.forEach((meeting, i) => {
        events.push({ time: meeting.start, type: 'start', meeting, id: i });
        events.push({ time: meeting.end, type: 'end', meeting, id: i });
    });
    
    // Sort events by time (end events before start events at same time)
    events.sort((a, b) => {
        if (a.time !== b.time) return a.time - b.time;
        return a.type === 'end' ? -1 : 1;  // End events first
    });
    
    console.log("\nEvent timeline:");
    events.forEach(event => {
        console.log(`Time ${event.time}: ${event.type} ${event.meeting.name}`);
    });
    
    let activeRooms = 0;
    let maxRooms = 0;
    const roomAssignments = new Map();
    const availableRooms = [];
    let nextRoomId = 1;
    
    console.log("\nRoom allocation process:");
    
    for (const event of events) {
        if (event.type === 'start') {
            if (availableRooms.length > 0) {
                // Reuse available room
                const roomId = availableRooms.pop();
                roomAssignments.set(event.id, roomId);
                console.log(`${event.meeting.name} assigned to room ${roomId} (reused)`);
            } else {
                // Allocate new room
                const roomId = nextRoomId++;
                roomAssignments.set(event.id, roomId);
                console.log(`${event.meeting.name} assigned to room ${roomId} (new)`);
            }
            activeRooms++;
            maxRooms = Math.max(maxRooms, activeRooms);
        } else {
            // Meeting ends, room becomes available
            const roomId = roomAssignments.get(event.id);
            availableRooms.push(roomId);
            activeRooms--;
            console.log(`${event.meeting.name} ends, room ${roomId} available`);
        }
        
        console.log(`  Active rooms: ${activeRooms}, Max used: ${maxRooms}`);
    }
    
    console.log(`\nMinimum rooms required: ${maxRooms}`);
    
    console.log("\nRoom assignments:");
    meetings.forEach((meeting, i) => {
        console.log(`${meeting.name}: Room ${roomAssignments.get(i)}`);
    });
    
    return maxRooms;
}

// Run examples
console.log("=== Activity Scheduling Examples ===");

const activities = [
    { name: "Lecture A", start: 1, end: 4 },
    { name: "Lecture B", start: 3, end: 5 },
    { name: "Lecture C", start: 0, end: 6 },
    { name: "Lecture D", start: 5, end: 7 },
    { name: "Lecture E", start: 3, end: 9 },
    { name: "Lecture F", start: 5, end: 9 },
    { name: "Lecture G", start: 6, end: 10 },
    { name: "Lecture H", start: 8, end: 11 },
    { name: "Lecture I", start: 8, end: 12 },
    { name: "Lecture J", start: 2, end: 14 },
    { name: "Lecture K", start: 12, end: 16 }
];

activityScheduling(activities);

const weightedActivities = [
    { name: "Project A", start: 1, end: 3, value: 20 },
    { name: "Project B", start: 2, end: 5, value: 20 },
    { name: "Project C", start: 4, end: 6, value: 20 },
    { name: "Project D", start: 6, end: 19, value: 100 },
    { name: "Project E", start: 7, end: 9, value: 60 }
];

weightedActivityScheduling(weightedActivities);

const meetings = [
    { name: "Marketing", start: 9, end: 10 },
    { name: "Engineering", start: 9.5, end: 11 },
    { name: "Sales", start: 10, end: 11.5 },
    { name: "HR", start: 11, end: 12 },
    { name: "Finance", start: 11.5, end: 13 },
    { name: "Strategy", start: 12, end: 14 }
];

meetingRoomAllocation(meetings);
```


## 2. Fractional Knapsack - Value Optimization

### The Greedy Knapsack Approach

```javascript
/**
 * Fractional Knapsack - Allow partial items for maximum value
 * Greedy Strategy: Sort by value per weight ratio, take highest first
 */

function fractionalKnapsack(items, capacity) {
    console.log(`=== Fractional Knapsack Problem ===`);
    console.log(`Knapsack capacity: ${capacity}`);
    console.log("Available items:");
    
    // Calculate value per weight ratio
    const itemsWithRatio = items.map((item, i) => ({
        ...item,
        id: i,
        ratio: item.value / item.weight
    }));
    
    itemsWithRatio.forEach(item => {
        console.log(`Item ${item.id}: weight=${item.weight}, value=${item.value}, ratio=${item.ratio.toFixed(2)} - ${item.name}`);
    });
    
    // Sort by value per weight ratio (greedy choice)
    const sortedItems = [...itemsWithRatio].sort((a, b) => b.ratio - a.ratio);
    
    console.log("\nSorted by value/weight ratio (greedy strategy):");
    sortedItems.forEach((item, i) => {
        console.log(`${i + 1}. ${item.name}: ratio=${item.ratio.toFixed(2)}`);
    });
    
    let currentWeight = 0;
    let totalValue = 0;
    const solution = [];
    
    console.log("\nGreedy selection process:");
    
    for (const item of sortedItems) {
        console.log(`\nConsidering ${item.name}:`);
        console.log(`  Weight: ${item.weight}, Value: ${item.value}, Ratio: ${item.ratio.toFixed(2)}`);
        console.log(`  Current weight: ${currentWeight}/${capacity}`);
        
        if (currentWeight + item.weight <= capacity) {
            // Take entire item
            currentWeight += item.weight;
            totalValue += item.value;
            solution.push({ ...item, fraction: 1.0 });
            
            console.log(`  ✓ Take ENTIRE item (fraction: 1.0)`);
            console.log(`  New weight: ${currentWeight}, New value: ${totalValue}`);
        } else if (currentWeight < capacity) {
            // Take fraction of item
            const remainingCapacity = capacity - currentWeight;
            const fraction = remainingCapacity / item.weight;
            const fractionalValue = item.value * fraction;
            
            currentWeight += remainingCapacity;
            totalValue += fractionalValue;
            solution.push({ ...item, fraction });
            
            console.log(`  ✓ Take FRACTION: ${fraction.toFixed(3)} (${remainingCapacity}/${item.weight})`);
            console.log(`  Fractional value: ${fractionalValue.toFixed(2)}`);
            console.log(`  Final weight: ${currentWeight}, Final value: ${totalValue.toFixed(2)}`);
            break;
        } else {
            console.log(`  ✗ SKIP - No remaining capacity`);
        }
    }
    
    console.log(`\nOptimal Fractional Knapsack Solution:`);
    console.log(`Total weight: ${currentWeight}/${capacity}`);
    console.log(`Total value: ${totalValue.toFixed(2)}`);
    
    console.log("\nItems selected:");
    solution.forEach((item, i) => {
        const weightTaken = item.weight * item.fraction;
        const valueTaken = item.value * item.fraction;
        console.log(`${i + 1}. ${item.name}: ${item.fraction.toFixed(3)} (weight: ${weightTaken.toFixed(2)}, value: ${valueTaken.toFixed(2)})`);
    });
    
    return { totalValue, solution };
}

// Compare with 0-1 Knapsack (DP approach)
function zeroOneKnapsack(items, capacity) {
    console.log(`\n=== 0-1 Knapsack (DP for comparison) ===`);
    console.log("Same items, but no fractional selection allowed");
    
    const n = items.length;
    const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
    
    console.log("\nBuilding DP table:");
    
    for (let i = 1; i <= n; i++) {
        const item = items[i - 1];
        console.log(`\nProcessing ${item.name} (weight: ${item.weight}, value: ${item.value}):`);
        
        for (let w = 0; w <= capacity; w++) {
            // Option 1: Don't take current item
            dp[i][w] = dp[i - 1][w];
            
            // Option 2: Take current item (if it fits)
            if (item.weight <= w) {
                const valueWithItem = dp[i - 1][w - item.weight] + item.value;
                dp[i][w] = Math.max(dp[i][w], valueWithItem);
            }
        }
        
        console.log(`  Best values for different capacities: [${dp[i].slice(0, Math.min(11, capacity + 1)).join(', ')}${capacity > 10 ? '...' : ''}]`);
    }
    
    // Reconstruct solution
    const solution = [];
    let w = capacity;
    
    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            solution.unshift(items[i - 1]);
            w -= items[i - 1].weight;
        }
    }
    
    console.log(`\nOptimal 0-1 Knapsack Solution:`);
    console.log(`Total value: ${dp[n][capacity]}`);
    console.log("Items selected:");
    
    let totalWeight = 0;
    solution.forEach((item, i) => {
        console.log(`${i + 1}. ${item.name}: weight=${item.weight}, value=${item.value}`);
        totalWeight += item.weight;
    });
    
    console.log(`Total weight: ${totalWeight}/${capacity}`);
    
    return { totalValue: dp[n][capacity], solution };
}

// Run examples
console.log("=== Knapsack Examples ===");

const knapsackItems = [
    { name: "Gold", weight: 10, value: 60 },
    { name: "Silver", weight: 20, value: 100 },
    { name: "Diamond", weight: 30, value: 120 },
    { name: "Platinum", weight: 15, value: 150 },
    { name: "Ruby", weight: 25, value: 200 },
    { name: "Emerald", weight: 5, value: 80 }
];

const capacity = 50;

const fractionalResult = fractionalKnapsack(knapsackItems, capacity);
const zeroOneResult = zeroOneKnapsack(knapsackItems, capacity);

console.log(`\n=== Comparison ===`);
console.log(`Fractional Knapsack value: ${fractionalResult.totalValue.toFixed(2)}`);
console.log(`0-1 Knapsack value: ${zeroOneResult.totalValue}`);
console.log(`Fractional advantage: ${(fractionalResult.totalValue - zeroOneResult.totalValue).toFixed(2)}`);
```


## 3. Minimum Spanning Tree - Graph Optimization

### Kruskal's and Prim's Algorithms

```javascript
/**
 * Minimum Spanning Tree using Kruskal's Algorithm
 * Greedy Strategy: Sort edges by weight, add minimum weight edge that doesn't create cycle
 */

class UnionFind {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
        this.components = n;
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);  // Path compression
        }
        return this.parent[x];
    }
    
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX === rootY) return false;  // Already connected
        
        // Union by rank
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
    
    isConnected(x, y) {
        return this.find(x) === this.find(y);
    }
}

function kruskalMST(vertices, edges) {
    console.log(`=== Kruskal's Minimum Spanning Tree ===`);
    console.log(`Vertices: ${vertices.length}`);
    console.log(`Edges: ${edges.length}`);
    
    console.log("\nAll edges:");
    edges.forEach((edge, i) => {
        console.log(`Edge ${i}: ${edge.from} -- ${edge.to} (weight: ${edge.weight})`);
    });
    
    // Sort edges by weight (greedy choice)
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    
    console.log("\nSorted edges by weight (greedy strategy):");
    sortedEdges.forEach((edge, i) => {
        console.log(`${i + 1}. ${edge.from} -- ${edge.to} (weight: ${edge.weight})`);
    });
    
    const unionFind = new UnionFind(vertices.length);
    const mstEdges = [];
    let totalWeight = 0;
    
    console.log("\nKruskal's algorithm execution:");
    console.log("Processing edges in weight order, avoiding cycles:");
    
    for (const edge of sortedEdges) {
        console.log(`\nConsidering edge: ${edge.from} -- ${edge.to} (weight: ${edge.weight})`);
        
        const fromRoot = unionFind.find(edge.from);
        const toRoot = unionFind.find(edge.to);
        
        console.log(`  ${edge.from} is in component ${fromRoot}`);
        console.log(`  ${edge.to} is in component ${toRoot}`);
        
        if (unionFind.union(edge.from, edge.to)) {
            mstEdges.push(edge);
            totalWeight += edge.weight;
            console.log(`  ✓ ADDED - Connects different components`);
            console.log(`  MST edges so far: ${mstEdges.length}, Total weight: ${totalWeight}`);
            
            if (mstEdges.length === vertices.length - 1) {
                console.log(`  MST COMPLETE - All vertices connected`);
                break;
            }
        } else {
            console.log(`  ✗ REJECTED - Would create cycle`);
        }
    }
    
    console.log(`\nMinimum Spanning Tree (Kruskal's):`);
    console.log(`Total weight: ${totalWeight}`);
    console.log(`Edges in MST:`);
    
    mstEdges.forEach((edge, i) => {
        console.log(`${i + 1}. ${edge.from} -- ${edge.to} (weight: ${edge.weight})`);
    });
    
    return { edges: mstEdges, totalWeight };
}

// Prim's Algorithm for MST
function primMST(vertices, edges) {
    console.log(`\n=== Prim's Minimum Spanning Tree ===`);
    
    // Build adjacency list
    const graph = new Map();
    vertices.forEach(v => graph.set(v, []));
    
    edges.forEach(edge => {
        graph.get(edge.from).push({ to: edge.to, weight: edge.weight });
        graph.get(edge.to).push({ to: edge.from, weight: edge.weight });
    });
    
    console.log("Graph representation:");
    for (const [vertex, neighbors] of graph) {
        const neighborStr = neighbors.map(n => `${n.to}(${n.weight})`).join(', ');
        console.log(`${vertex}: [${neighborStr}]`);
    }
    
    const visited = new Set();
    const mstEdges = [];
    let totalWeight = 0;
    
    // Priority queue simulation (min-heap by weight)
    const priorityQueue = [];
    
    function addEdge(edge) {
        priorityQueue.push(edge);
        priorityQueue.sort((a, b) => a.weight - b.weight);
    }
    
    // Start with vertex 0
    const startVertex = vertices[0];
    visited.add(startVertex);
    
    console.log(`\nStarting from vertex ${startVertex}`);
    console.log("Adding edges from starting vertex to priority queue:");
    
    for (const neighbor of graph.get(startVertex)) {
        const edge = { from: startVertex, to: neighbor.to, weight: neighbor.weight };
        addEdge(edge);
        console.log(`  Added edge: ${edge.from} -- ${edge.to} (weight: ${edge.weight})`);
    }
    
    console.log("\nPrim's algorithm execution:");
    
    while (priorityQueue.length > 0 && visited.size < vertices.length) {
        const edge = priorityQueue.shift();  // Get minimum weight edge
        
        console.log(`\nProcessing minimum edge: ${edge.from} -- ${edge.to} (weight: ${edge.weight})`);
        console.log(`  Visited vertices: {${Array.from(visited).join(', ')}}`);
        
        if (visited.has(edge.to)) {
            console.log(`  ✗ SKIP - ${edge.to} already in MST`);
            continue;
        }
        
        // Add edge to MST
        mstEdges.push(edge);
        totalWeight += edge.weight;
        visited.add(edge.to);
        
        console.log(`  ✓ ADDED to MST`);
        console.log(`  New visited set: {${Array.from(visited).join(', ')}}`);
        console.log(`  MST weight so far: ${totalWeight}`);
        
        // Add new edges from newly added vertex
        console.log(`  Adding edges from ${edge.to}:`);
        for (const neighbor of graph.get(edge.to)) {
            if (!visited.has(neighbor.to)) {
                const newEdge = { from: edge.to, to: neighbor.to, weight: neighbor.weight };
                addEdge(newEdge);
                console.log(`    Added: ${newEdge.from} -- ${newEdge.to} (weight: ${newEdge.weight})`);
            }
        }
    }
    
    console.log(`\nMinimum Spanning Tree (Prim's):`);
    console.log(`Total weight: ${totalWeight}`);
    console.log(`Edges in MST:`);
    
    mstEdges.forEach((edge, i) => {
        console.log(`${i + 1}. ${edge.from} -- ${edge.to} (weight: ${edge.weight})`);
    });
    
    return { edges: mstEdges, totalWeight };
}

// Run examples
console.log("=== Minimum Spanning Tree Examples ===");

const vertices = [0, 1, 2, 3, 4, 5];
const graphEdges = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 4 },
    { from: 1, to: 2, weight: 2 },
    { from: 1, to: 3, weight: 8 },
    { from: 2, to: 3, weight: 5 },
    { from: 2, to: 4, weight: 6 },
    { from: 3, to: 4, weight: 3 },
    { from: 3, to: 5, weight: 9 },
    { from: 4, to: 5, weight: 7 }
];

const kruskalResult = kruskalMST(vertices, graphEdges);
const primResult = primMST(vertices, graphEdges);

console.log(`\n=== Algorithm Comparison ===`);
console.log(`Kruskal's MST weight: ${kruskalResult.totalWeight}`);
console.log(`Prim's MST weight: ${primResult.totalWeight}`);
console.log(`Results match: ${kruskalResult.totalWeight === primResult.totalWeight ? 'Yes' : 'No'}`);
```


## Summary

### Greedy Algorithm Mastery Achieved

**Strategic Decision-Making Excellence:**
- **Activity Scheduling**: Optimal interval selection through earliest finish time strategy
- **Fractional Knapsack**: Value maximization through efficiency ratio optimization
- **Minimum Spanning Tree**: Network optimization using edge/vertex greedy strategies

**Algorithm Design Principles:**

**Greedy Choice Properties:**
- **Local Optimality**: Each decision is optimal given current information
- **Irrevocable Decisions**: No backtracking or reconsideration required
- **Optimal Substructure**: Optimal solutions contain optimal subsolutions
- **Efficiency**: Often achieves optimal results with simple O(n log n) complexity

**Problem Recognition Patterns:**
- **Scheduling Problems**: When selecting non-overlapping intervals optimally
- **Resource Allocation**: When fractional assignment leads to optimal distribution
- **Network Design**: When connecting components with minimum cost constraints
- **Optimization**: When local optimal choices guarantee global optimality

### Real-World Applications Mastery

**Operations Research:**
- **Resource Planning**: Optimal allocation of limited resources across competing demands
- **Project Management**: Activity scheduling and critical path optimization
- **Supply Chain**: Minimum cost network design for distribution systems
- **Manufacturing**: Production scheduling and quality optimization

**Computer Science:**
- **Network Protocols**: Routing algorithms and bandwidth allocation
- **Compiler Design**: Register allocation and instruction scheduling
- **Database Systems**: Query optimization and index selection
- **Operating Systems**: Process scheduling and memory management

**Financial Applications:**
- **Portfolio Optimization**: Asset allocation with fractional investment strategies
- **Risk Management**: Optimal hedge selection and exposure balancing
- **Trading Systems**: Order execution and market making strategies
- **Capital Allocation**: Investment prioritization and resource distribution

### Mathematical and Theoretical Foundations

**Correctness Proofs:**
- **Exchange Arguments**: Demonstrating greedy solutions can replace any optimal solution
- **Staying Ahead**: Proving greedy maintains optimality at each step
- **Optimal Substructure**: Verifying that optimal solutions decompose optimally

**Complexity Analysis:**
- **Time Complexity**: Most greedy algorithms achieve O(n log n) through sorting
- **Space Complexity**: Typically O(1) or O(n) for auxiliary data structures
- **Comparison**: Often significantly faster than DP alternatives when applicable

**Limitation Recognition:**
- **When Greedy Fails**: Problems requiring global optimization with complex dependencies
- **DP Necessity**: Weighted activity scheduling, subset sum with constraints
- **Approximation**: Using greedy for NP-hard problems with bounded approximation ratios

### Strategic Problem-Solving Framework

**Greedy Algorithm Design Process:**
```
1. Problem Analysis:
   - Identify optimization objective
   - Check for greedy choice property
   - Verify optimal substructure
   
2. Strategy Formulation:
   - Define local optimization criterion
   - Design sorting/priority mechanism
   - Plan efficient data structures
   
3. Correctness Verification:
   - Prove greedy choice property
   - Demonstrate optimal substructure
   - Validate with exchange argument
   
4. Implementation:
   - Implement sorting-based approach
   - Add priority queue if needed
   - Optimize for target complexity
```

**When to Choose Greedy vs Alternatives:**
- **Choose Greedy**: Simple optimization with proven greedy choice property
- **Choose DP**: Complex dependencies, overlapping subproblems, weighted constraints
- **Choose Approximation**: NP-hard problems where greedy provides bounded error
- **Choose Exhaustive**: Small problem sizes where optimality is critical

You now possess **mastery of greedy algorithm design** that enables **efficient optimization** for problems with **optimal local decision-making properties**. This expertise provides the **algorithmic foundation** for **real-time optimization systems** where **immediate decisions** must be **provably optimal** without **complex computational overhead**.

The **progression from basic sorting to sophisticated network optimization** represents **fundamental algorithmic thinking** - the ability to **recognize problem structure** and **apply the simplest possible approach** that **guarantees optimal results**. This **efficiency-optimality balance** is **crucial for high-performance systems** requiring **real-time decision making**.
