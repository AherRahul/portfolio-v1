---
title: "Backtracking & Constraint Satisfaction"
description: "Master backtracking algorithms. Learn constraint satisfaction, N-Queens, Sudoku solving, graph coloring, and systematic search strategies."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - backtracking
  - constraint-satisfaction
resources:
  - title: "Backtracking Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/backtracking"
    description: "Interactive visualization of backtracking algorithms"
  - title: "Constraint Programming"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Constraint_satisfaction_problem"
    description: "Theory of constraint satisfaction problems"
  - title: "Backtracking Practice"
    type: "practice"
    url: "https://leetcode.com/tag/backtracking/"
    description: "Practice backtracking problems"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758827456/Portfolio/dsa/images/38/backtracking.png)

Backtracking & Constraint Satisfaction – Mastering Systematic Exploration
-----------------------------------------------------------------------------

Imagine you're the **Chief Puzzle Master** 🧩 at an **AI research laboratory** where **millions of possible configurations** must be **systematically explored** to find **optimal solutions** under **complex constraints** that **eliminate vast regions** of the **search space** instantly:

**🔬 The Constraint Satisfaction Challenge:**

**👑 Scenario 1: Royal Palace Security (N-Queens Problem)**
```
Problem: Place 8 queens on a chessboard so none can attack each other
Search space: 8^8 = 16.7 million possible placements
Naive approach: Check every placement = computationally explosive
Backtracking insight: Place queens row by row, backtrack when conflicts detected
Constraint propagation: Each queen placement eliminates entire rows, columns, diagonals
Result: Solve in thousands of steps instead of millions
```

**🧮 Scenario 2: Logic Puzzle Automation (Sudoku Solver)**
```
Problem: Fill 9×9 grid with digits 1-9 following strict rules
Search space: 9^81 ≈ 2×10^77 possible combinations (more than atoms in universe)
Brute force: Impossible even with fastest computers
Backtracking strategy: Fill cells systematically, backtrack on constraint violations
Smart constraints: Row, column, and box uniqueness eliminate invalid branches immediately
Result: Solve most puzzles in milliseconds through intelligent pruning
```

**🎨 Scenario 3: Network Configuration (Graph Coloring)**
```
Problem: Assign colors to network nodes so adjacent nodes have different colors
Challenge: Minimize colors while satisfying all adjacency constraints
Applications: Frequency assignment, scheduling, register allocation
Backtracking approach: Color nodes systematically, backtrack when no valid color available
Constraint checking: Each color assignment restricts choices for neighboring nodes
Result: Find minimal coloring or prove none exists within color limit
```

**💡 The Backtracking Mastery Principle:**
**Backtracking** represents the **art of intelligent exhaustive search** - systematically **exploring solution spaces** while **leveraging constraints** to **prune impossible branches** early, transforming **intractable exponential problems** into **manageable systematic exploration** through **strategic decision points** and **intelligent backtracking** when **dead ends** are encountered.


## The Theoretical Foundation

### Backtracking Algorithm Structure

**Core Backtracking Pattern:**
```
1. Choose: Make a decision (partial solution extension)
2. Explore: Recursively solve remaining subproblem
3. Unchoose: Backtrack if current path leads to failure
```

**Constraint Satisfaction Framework:**
- **Variables**: Elements to be assigned values
- **Domains**: Possible values for each variable
- **Constraints**: Rules that restrict valid assignments
- **Solution**: Complete assignment satisfying all constraints

**Optimization Strategies:**
- **Early Constraint Checking**: Validate constraints immediately after each assignment
- **Forward Checking**: Remove invalid values from future variable domains
- **Constraint Propagation**: Deduce implications of current assignments
- **Variable Ordering**: Choose most constrained variables first
- **Value Ordering**: Try most promising values first

### Mathematical Complexity Analysis

**Search Space Characteristics:**
- **Branching Factor**: Average number of choices at each decision point
- **Search Depth**: Maximum levels in the decision tree
- **Total States**: Branching factor raised to the power of depth
- **Pruning Effectiveness**: Percentage of search space eliminated by constraints

**Time Complexity:**
- **Worst Case**: O(b^d) where b = branching factor, d = depth
- **Best Case**: O(d) with perfect constraint propagation
- **Average Case**: Depends heavily on constraint tightness and ordering heuristics


## 1. N-Queens Problem - Classic Constraint Satisfaction

### The Royal Security Challenge

```javascript
/**
 * N-Queens Problem - Place N queens on N×N chessboard with no conflicts
 * Backtracking Strategy: Place queens row by row, backtrack on conflicts
 */

function solveNQueens(n) {
    console.log(`=== N-Queens Problem (${n}×${n} board) ===`);
    
    const solutions = [];
    const board = Array.from({ length: n }, () => Array(n).fill('.'));
    
    // Track occupied columns and diagonals for O(1) conflict checking
    const columns = new Set();
    const diag1 = new Set();  // row - col
    const diag2 = new Set();  // row + col
    
    function printBoard(board, title) {
        console.log(`\n${title}:`);
        board.forEach((row, i) => {
            console.log(`${i}: ${row.join(' ')}`);
        });
    }
    
    function isConflict(row, col) {
        return columns.has(col) || 
               diag1.has(row - col) || 
               diag2.has(row + col);
    }
    
    function placeQueen(row, col) {
        board[row][col] = 'Q';
        columns.add(col);
        diag1.add(row - col);
        diag2.add(row + col);
    }
    
    function removeQueen(row, col) {
        board[row][col] = '.';
        columns.delete(col);
        diag1.delete(row - col);
        diag2.delete(row + col);
    }
    
    function backtrack(row) {
        console.log(`\nExploring row ${row}:`);
        
        if (row === n) {
            // Found complete solution
            const solution = board.map(row => row.slice());
            solutions.push(solution);
            console.log(`✓ SOLUTION ${solutions.length} found!`);
            printBoard(board, `Solution ${solutions.length}`);
            return;
        }
        
        console.log(`Trying to place queen in row ${row}:`);
        
        for (let col = 0; col < n; col++) {
            console.log(`  Considering column ${col}:`);
            
            if (isConflict(row, col)) {
                console.log(`    ✗ Conflict detected:`);
                if (columns.has(col)) console.log(`      - Column ${col} already occupied`);
                if (diag1.has(row - col)) console.log(`      - Diagonal \\ (${row}-${col}=${row-col}) occupied`);
                if (diag2.has(row + col)) console.log(`      - Diagonal / (${row}+${col}=${row+col}) occupied`);
                continue;
            }
            
            console.log(`    ✓ Valid placement - placing queen at (${row}, ${col})`);
            placeQueen(row, col);
            
            console.log(`    State after placement:`);
            console.log(`      Occupied columns: {${Array.from(columns).sort((a,b) => a-b).join(', ')}}`);
            console.log(`      Occupied diag1: {${Array.from(diag1).sort((a,b) => a-b).join(', ')}}`);
            console.log(`      Occupied diag2: {${Array.from(diag2).sort((a,b) => a-b).join(', ')}}`);
            
            // Recursively solve for next row
            backtrack(row + 1);
            
            // Backtrack: remove queen and try next position
            console.log(`    ← Backtracking from (${row}, ${col})`);
            removeQueen(row, col);
        }
        
        console.log(`  No valid placement found in row ${row} - backtracking to previous row`);
    }
    
    console.log("Starting N-Queens backtracking search...");
    backtrack(0);
    
    console.log(`\n=== N-Queens Results ===`);
    console.log(`Found ${solutions.length} solution(s) for ${n}×${n} board`);
    
    if (solutions.length > 0) {
        console.log("\nAll solutions:");
        solutions.forEach((solution, i) => {
            console.log(`\nSolution ${i + 1}:`);
            solution.forEach((row, j) => {
                console.log(`${j}: ${row.join(' ')}`);
            });
        });
    }
    
    return solutions;
}

// N-Queens with enhanced constraint propagation
function nQueensOptimized(n) {
    console.log(`\n=== Optimized N-Queens (${n}×${n}) ===`);
    
    let solutionCount = 0;
    let nodes = 0;  // Track search tree nodes visited
    
    const columns = new Array(n).fill(false);
    const diag1 = new Array(2 * n - 1).fill(false);  // row - col + (n-1)
    const diag2 = new Array(2 * n - 1).fill(false);  // row + col
    
    function solve(row) {
        nodes++;
        
        if (row === n) {
            solutionCount++;
            return;
        }
        
        for (let col = 0; col < n; col++) {
            const d1 = row - col + (n - 1);
            const d2 = row + col;
            
            if (!columns[col] && !diag1[d1] && !diag2[d2]) {
                // Place queen
                columns[col] = diag1[d1] = diag2[d2] = true;
                
                solve(row + 1);
                
                // Backtrack
                columns[col] = diag1[d1] = diag2[d2] = false;
            }
        }
    }
    
    const startTime = performance.now();
    solve(0);
    const endTime = performance.now();
    
    console.log(`Optimized Results:`);
    console.log(`Solutions found: ${solutionCount}`);
    console.log(`Search nodes visited: ${nodes}`);
    console.log(`Time taken: ${(endTime - startTime).toFixed(2)}ms`);
    console.log(`Efficiency: ${(solutionCount / nodes * 100).toFixed(4)}% of nodes led to solutions`);
    
    return solutionCount;
}

// Run examples
console.log("=== N-Queens Examples ===");

// Small example for detailed trace
solveNQueens(4);

// Larger example for efficiency comparison
nQueensOptimized(8);
```


## 2. Sudoku Solver - Advanced Constraint Propagation

### The Logic Puzzle Automation

```javascript
/**
 * Sudoku Solver using Backtracking with Constraint Propagation
 * Advanced Strategy: Most Constrained Variable heuristic + Forward Checking
 */

function solveSudoku(board) {
    console.log(`=== Sudoku Solver ===`);
    
    function printBoard(board, title) {
        console.log(`\n${title}:`);
        for (let i = 0; i < 9; i++) {
            if (i % 3 === 0 && i > 0) console.log("------+-------+------");
            
            let row = "";
            for (let j = 0; j < 9; j++) {
                if (j % 3 === 0 && j > 0) row += "| ";
                row += (board[i][j] === 0 ? "." : board[i][j]) + " ";
            }
            console.log(row);
        }
    }
    
    printBoard(board, "Initial Sudoku Puzzle");
    
    function isValid(board, row, col, num) {
        // Check row constraint
        for (let j = 0; j < 9; j++) {
            if (board[row][j] === num) return false;
        }
        
        // Check column constraint
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === num) return false;
        }
        
        // Check 3×3 box constraint
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if (board[i][j] === num) return false;
            }
        }
        
        return true;
    }
    
    function getPossibleValues(board, row, col) {
        const possible = [];
        for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
                possible.push(num);
            }
        }
        return possible;
    }
    
    function findMostConstrainedCell(board) {
        let minOptions = 10;
        let bestCell = null;
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    const options = getPossibleValues(board, i, j);
                    if (options.length < minOptions) {
                        minOptions = options.length;
                        bestCell = { row: i, col: j, options };
                    }
                }
            }
        }
        
        return bestCell;
    }
    
    let steps = 0;
    
    function solve(board) {
        steps++;
        
        const cell = findMostConstrainedCell(board);
        
        if (!cell) {
            // No empty cells - puzzle solved!
            console.log(`\n✓ Sudoku solved in ${steps} steps!`);
            printBoard(board, "Solution");
            return true;
        }
        
        const { row, col, options } = cell;
        
        console.log(`\nStep ${steps}: Trying cell (${row}, ${col}) with ${options.length} options: [${options.join(', ')}]`);
        
        if (options.length === 0) {
            console.log(`  Dead end - no valid values for (${row}, ${col})`);
            return false;  // Dead end
        }
        
        for (const num of options) {
            console.log(`  Trying value ${num} at (${row}, ${col})`);
            
            board[row][col] = num;
            
            if (solve(board)) {
                return true;  // Solution found
            }
            
            // Backtrack
            console.log(`  Backtracking from ${num} at (${row}, ${col})`);
            board[row][col] = 0;
        }
        
        return false;  // No solution with current partial assignment
    }
    
    const success = solve(board);
    
    if (!success) {
        console.log("No solution exists for this Sudoku puzzle");
    }
    
    return success;
}

// Sudoku with advanced constraint propagation
function solveSudokuAdvanced(board) {
    console.log(`\n=== Advanced Sudoku Solver ===`);
    console.log("Using Naked Singles and Hidden Singles techniques");
    
    function printBoard(board) {
        for (let i = 0; i < 9; i++) {
            if (i % 3 === 0 && i > 0) console.log("------+-------+------");
            let row = "";
            for (let j = 0; j < 9; j++) {
                if (j % 3 === 0 && j > 0) row += "| ";
                row += (board[i][j] === 0 ? "." : board[i][j]) + " ";
            }
            console.log(row);
        }
    }
    
    function getCandidates(board) {
        const candidates = Array.from({ length: 9 }, () => 
            Array.from({ length: 9 }, () => new Set([1,2,3,4,5,6,7,8,9]))
        );
        
        // Remove candidates based on filled cells
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] !== 0) {
                    candidates[i][j].clear();
                    
                    const num = board[i][j];
                    
                    // Remove from row
                    for (let k = 0; k < 9; k++) {
                        candidates[i][k].delete(num);
                    }
                    
                    // Remove from column
                    for (let k = 0; k < 9; k++) {
                        candidates[k][j].delete(num);
                    }
                    
                    // Remove from box
                    const boxRow = Math.floor(i / 3) * 3;
                    const boxCol = Math.floor(j / 3) * 3;
                    for (let x = boxRow; x < boxRow + 3; x++) {
                        for (let y = boxCol; y < boxCol + 3; y++) {
                            candidates[x][y].delete(num);
                        }
                    }
                }
            }
        }
        
        return candidates;
    }
    
    function applyNakedSingles(board, candidates) {
        let changed = false;
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0 && candidates[i][j].size === 1) {
                    const value = Array.from(candidates[i][j])[0];
                    board[i][j] = value;
                    console.log(`Naked single: (${i}, ${j}) = ${value}`);
                    changed = true;
                }
            }
        }
        
        return changed;
    }
    
    function constraintPropagation(board) {
        let changed = true;
        let iterations = 0;
        
        while (changed) {
            iterations++;
            console.log(`\nConstraint propagation iteration ${iterations}:`);
            
            const candidates = getCandidates(board);
            changed = applyNakedSingles(board, candidates);
            
            if (changed) {
                console.log("Board after naked singles:");
                printBoard(board);
            }
        }
        
        console.log(`Constraint propagation complete after ${iterations} iterations`);
    }
    
    function solve(board) {
        // Apply constraint propagation first
        constraintPropagation(board);
        
        // Find empty cell with fewest candidates
        const candidates = getCandidates(board);
        let bestCell = null;
        let minCandidates = 10;
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    if (candidates[i][j].size === 0) {
                        return false;  // Contradiction
                    }
                    if (candidates[i][j].size < minCandidates) {
                        minCandidates = candidates[i][j].size;
                        bestCell = { row: i, col: j };
                    }
                }
            }
        }
        
        if (!bestCell) {
            return true;  // Solved
        }
        
        const { row, col } = bestCell;
        const cellCandidates = Array.from(candidates[row][col]);
        
        console.log(`\nTrying cell (${row}, ${col}) with candidates: [${cellCandidates.join(', ')}]`);
        
        for (const value of cellCandidates) {
            console.log(`  Trying ${value} at (${row}, ${col})`);
            
            board[row][col] = value;
            
            if (solve(board)) {
                return true;
            }
            
            board[row][col] = 0;
            console.log(`  Backtracking from ${value} at (${row}, ${col})`);
        }
        
        return false;
    }
    
    const boardCopy = board.map(row => [...row]);
    
    console.log("Initial puzzle:");
    printBoard(boardCopy);
    
    const success = solve(boardCopy);
    
    if (success) {
        console.log("\n✓ Advanced Sudoku solved!");
        printBoard(boardCopy);
    } else {
        console.log("\n✗ No solution found");
    }
    
    return success;
}

// Run examples
console.log("=== Sudoku Examples ===");

const sudokuPuzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

// Make copies for different solving approaches
const puzzle1 = sudokuPuzzle.map(row => [...row]);
const puzzle2 = sudokuPuzzle.map(row => [...row]);

solveSudoku(puzzle1);
solveSudokuAdvanced(puzzle2);
```


## 3. Graph Coloring - Resource Allocation

### The Network Configuration Challenge

```javascript
/**
 * Graph Coloring using Backtracking
 * Find minimum colors to color graph vertices with no adjacent vertices same color
 */

function graphColoring(graph, maxColors) {
    console.log(`=== Graph Coloring Problem ===`);
    console.log(`Trying to color graph with ${maxColors} colors`);
    
    const vertices = Object.keys(graph).map(Number).sort((a, b) => a - b);
    const n = vertices.length;
    
    console.log(`Vertices: ${vertices.length}`);
    console.log("Graph adjacency:");
    for (const [vertex, neighbors] of Object.entries(graph)) {
        console.log(`Vertex ${vertex}: connected to [${neighbors.join(', ')}]`);
    }
    
    const colors = new Array(n).fill(-1);  // -1 means uncolored
    const colorNames = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown'];
    
    function isColorValid(vertex, color) {
        const neighbors = graph[vertex] || [];
        
        for (const neighbor of neighbors) {
            const neighborIndex = vertices.indexOf(neighbor);
            if (neighborIndex !== -1 && colors[neighborIndex] === color) {
                return false;
            }
        }
        
        return true;
    }
    
    function printCurrentColoring() {
        console.log("Current coloring:");
        for (let i = 0; i < n; i++) {
            const colorName = colors[i] === -1 ? 'Uncolored' : colorNames[colors[i]];
            console.log(`  Vertex ${vertices[i]}: ${colorName}`);
        }
    }
    
    function solveColoring(vertexIndex) {
        console.log(`\nTrying to color vertex ${vertices[vertexIndex]}:`);
        
        if (vertexIndex === n) {
            console.log("✓ All vertices colored successfully!");
            printCurrentColoring();
            return true;
        }
        
        const currentVertex = vertices[vertexIndex];
        const neighbors = graph[currentVertex] || [];
        
        console.log(`  Vertex ${currentVertex} is connected to: [${neighbors.join(', ')}]`);
        
        for (let color = 0; color < maxColors; color++) {
            console.log(`  Trying color ${color} (${colorNames[color]}):`);
            
            if (isColorValid(currentVertex, color)) {
                colors[vertexIndex] = color;
                console.log(`    ✓ Valid - assigning ${colorNames[color]} to vertex ${currentVertex}`);
                
                printCurrentColoring();
                
                if (solveColoring(vertexIndex + 1)) {
                    return true;
                }
                
                console.log(`    ← Backtracking from vertex ${currentVertex} with color ${colorNames[color]}`);
                colors[vertexIndex] = -1;
            } else {
                console.log(`    ✗ Invalid - conflicts with neighbors`);
                
                // Show which neighbors conflict
                for (const neighbor of neighbors) {
                    const neighborIndex = vertices.indexOf(neighbor);
                    if (neighborIndex !== -1 && colors[neighborIndex] === color) {
                        console.log(`      Conflict: neighbor ${neighbor} already has ${colorNames[color]}`);
                    }
                }
            }
        }
        
        console.log(`  No valid color found for vertex ${currentVertex} - backtracking`);
        return false;
    }
    
    const success = solveColoring(0);
    
    console.log(`\n=== Graph Coloring Results ===`);
    if (success) {
        console.log(`✓ Graph can be colored with ${maxColors} colors:`);
        printCurrentColoring();
        
        // Verify solution
        console.log("\nVerification:");
        let valid = true;
        for (let i = 0; i < n; i++) {
            const vertex = vertices[i];
            const neighbors = graph[vertex] || [];
            
            for (const neighbor of neighbors) {
                const neighborIndex = vertices.indexOf(neighbor);
                if (neighborIndex !== -1 && colors[i] === colors[neighborIndex]) {
                    console.log(`✗ Conflict: vertices ${vertex} and ${neighbor} both have color ${colorNames[colors[i]]}`);
                    valid = false;
                }
            }
        }
        
        if (valid) {
            console.log("✓ Solution verified - no conflicts found");
        }
    } else {
        console.log(`✗ Graph cannot be colored with ${maxColors} colors`);
    }
    
    return success;
}

// Find chromatic number (minimum colors needed)
function findChromaticNumber(graph) {
    console.log(`\n=== Finding Chromatic Number ===`);
    
    const vertices = Object.keys(graph).map(Number);
    const maxPossible = vertices.length;
    
    console.log(`Maximum possible colors needed: ${maxPossible}`);
    
    for (let colors = 1; colors <= maxPossible; colors++) {
        console.log(`\nTesting with ${colors} color(s):`);
        
        const testGraph = {};
        for (const vertex of vertices) {
            testGraph[vertex] = graph[vertex] || [];
        }
        
        if (graphColoring(testGraph, colors)) {
            console.log(`\n✓ Chromatic number found: ${colors}`);
            return colors;
        } else {
            console.log(`✗ ${colors} colors insufficient`);
        }
    }
    
    return maxPossible;
}

// Welsh-Powell algorithm for comparison (greedy heuristic)
function welshPowellColoring(graph) {
    console.log(`\n=== Welsh-Powell Algorithm (Greedy Heuristic) ===`);
    
    const vertices = Object.keys(graph).map(Number);
    
    // Calculate degree of each vertex
    const degrees = vertices.map(v => ({
        vertex: v,
        degree: (graph[v] || []).length
    }));
    
    // Sort by degree (descending)
    degrees.sort((a, b) => b.degree - a.degree);
    
    console.log("Vertices sorted by degree:");
    degrees.forEach(item => {
        console.log(`Vertex ${item.vertex}: degree ${item.degree}`);
    });
    
    const colors = new Map();
    const colorNames = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'];
    let nextColor = 0;
    
    for (const { vertex } of degrees) {
        console.log(`\nColoring vertex ${vertex}:`);
        
        const neighbors = graph[vertex] || [];
        const neighborColors = new Set();
        
        // Find colors used by neighbors
        for (const neighbor of neighbors) {
            if (colors.has(neighbor)) {
                neighborColors.add(colors.get(neighbor));
            }
        }
        
        console.log(`  Neighbors: [${neighbors.join(', ')}]`);
        console.log(`  Neighbor colors: {${Array.from(neighborColors).map(c => colorNames[c]).join(', ')}}`);
        
        // Find first available color
        let color = 0;
        while (neighborColors.has(color)) {
            color++;
        }
        
        colors.set(vertex, color);
        nextColor = Math.max(nextColor, color + 1);
        
        console.log(`  Assigned color: ${colorNames[color]}`);
    }
    
    console.log(`\nWelsh-Powell Result:`);
    console.log(`Colors used: ${nextColor}`);
    
    const sortedVertices = vertices.sort((a, b) => a - b);
    sortedVertices.forEach(vertex => {
        const color = colors.get(vertex);
        console.log(`Vertex ${vertex}: ${colorNames[color]}`);
    });
    
    return nextColor;
}

// Run examples
console.log("=== Graph Coloring Examples ===");

// Test graph (needs 3 colors)
const testGraph = {
    0: [1, 2, 3],
    1: [0, 2],
    2: [0, 1, 3],
    3: [0, 2, 4],
    4: [3]
};

console.log("--- Backtracking Approach ---");
graphColoring(testGraph, 3);

console.log("--- Finding Chromatic Number ---");
findChromaticNumber(testGraph);

console.log("--- Greedy Comparison ---");
welshPowellColoring(testGraph);
```


## Summary

### Backtracking & Constraint Satisfaction Mastery

**Systematic Exploration Excellence:**
- **N-Queens Problem**: Classic constraint satisfaction with conflict detection and intelligent placement
- **Sudoku Solver**: Advanced constraint propagation with most constrained variable heuristics
- **Graph Coloring**: Resource allocation optimization with systematic color assignment

**Algorithm Design Principles:**

**Backtracking Framework:**
- **Choose-Explore-Unchoose**: Systematic decision making with backtracking on failure
- **Constraint Checking**: Early detection of invalid partial solutions
- **Search Space Pruning**: Eliminate impossible branches to reduce exploration
- **Optimal Ordering**: Choose most constrained variables first for efficiency

**Advanced Optimization Techniques:**
- **Forward Checking**: Propagate constraints to reduce future search space
- **Arc Consistency**: Maintain constraint satisfaction throughout search
- **Variable Ordering Heuristics**: Most constrained variable, minimum remaining values
- **Value Ordering**: Least constraining value, fail-first principle

### Real-World Applications Mastery

**Artificial Intelligence:**
- **Automated Planning**: Robot path planning with obstacle and resource constraints
- **Expert Systems**: Rule-based reasoning with constraint satisfaction
- **Game AI**: Move generation and evaluation with pruning strategies
- **Configuration Systems**: Product customization with compatibility constraints

**Operations Research:**
- **Scheduling Problems**: Resource allocation with time and capacity constraints
- **Assignment Problems**: Optimal matching with preference and availability constraints
- **Facility Layout**: Spatial optimization with adjacency and flow constraints
- **Supply Chain**: Distribution network design with capacity and cost constraints

**Computer Science Applications:**
- **Register Allocation**: Compiler optimization with interference graph coloring
- **Frequency Assignment**: Wireless network optimization with interference constraints
- **Course Scheduling**: Academic timetabling with room and instructor constraints
- **VLSI Design**: Component placement with timing and area constraints

### Mathematical and Theoretical Foundations

**Complexity Analysis:**
- **Search Space**: Exponential growth with branching factor and depth
- **Pruning Effectiveness**: Constraint satisfaction dramatically reduces explored space
- **Worst-case Complexity**: O(b^d) but often much better with good heuristics
- **Space Complexity**: O(d) for recursive call stack plus constraint storage

**Constraint Satisfaction Theory:**
- **Consistency Types**: Node, arc, path, and k-consistency levels
- **Constraint Propagation**: Inference techniques for domain reduction
- **Search Strategies**: Chronological vs. intelligent backtracking
- **Heuristic Design**: Variable and value ordering for search efficiency

**Optimization Strategies:**
- **Constraint Learning**: Remember failure reasons to avoid similar states
- **Dynamic Variable Ordering**: Adapt ordering based on current state
- **Restart Strategies**: Systematic vs. randomized restart policies
- **Parallel Processing**: Distribute search across multiple processors

### Strategic Problem-Solving Framework

**Backtracking Problem Analysis:**
```
1. Problem Structure:
   - Identify variables, domains, and constraints
   - Determine constraint tightness and interactions
   - Design efficient constraint checking
   
2. Search Strategy:
   - Choose variable ordering heuristic
   - Select value ordering approach
   - Plan constraint propagation level
   
3. Implementation:
   - Implement efficient backtracking structure
   - Add constraint checking optimization
   - Include pruning and propagation
   
4. Performance Tuning:
   - Profile constraint checking overhead
   - Optimize data structures for constraints
   - Add intelligent restart if needed
```

**When to Use Backtracking:**
- **Complete Solutions Required**: Must find all solutions or prove none exist
- **Complex Constraints**: Multiple interacting constraints that eliminate large search regions
- **Moderate Search Space**: Exponential but manageable with good pruning
- **Optimization Not Critical**: Correctness more important than absolute speed

You now possess **mastery of backtracking and constraint satisfaction** that enables **systematic exploration** of **complex solution spaces** with **intelligent pruning** and **constraint propagation**. This expertise provides the **algorithmic foundation** for **AI systems** that must **reason systematically** about **complex configuration problems** under **multiple constraints**.

The **progression from simple recursive search to sophisticated constraint propagation** represents **fundamental AI thinking** - the ability to **model complex problems** as **constraint satisfaction** and **apply systematic search** with **intelligent pruning** to find **optimal solutions** efficiently.

This **constraint satisfaction mastery** is **essential for building intelligent systems** that must **navigate complex decision spaces** where **multiple competing constraints** define the **boundaries of feasible solutions**.
