---
title: "Arrays : 2D Matrices 2"
description: "Advanced 2D matrix algorithms and optimization techniques. Master spiral traversal, matrix multiplication, 2D prefix sums, and complex matrix transformation problems."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Advanced Matrix Algorithms"
    type: "tool"
    url: "https://visualgo.net/en/list"
    description: "Visualize complex matrix operations"
  - title: "Matrix Optimization Techniques"
    type: "reference"
    url: "https://www.geeksforgeeks.org/matrix/"
    description: "Advanced matrix problem patterns"
  - title: "Hard Matrix Problems"
    type: "practice"
    url: "https://leetcode.com/tag/matrix/"
    description: "Challenge yourself with hard matrix problems"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Arrays : 2D Matrices 2
----------------------------

### Advanced Matrix Algorithms

Building on matrix fundamentals, we'll explore advanced algorithms that are frequently asked in technical interviews and competitive programming.

### Problem 1: Spiral Matrix Traversal

**Problem**: Traverse matrix in spiral order (clockwise from outside to inside)

```javascript
function spiralOrder(matrix) {
    if (!matrix.length) return [];
    
    const result = [];
    let top = 0;
    let bottom = matrix.length - 1;
    let left = 0;
    let right = matrix[0].length - 1;
    
    while (top <= bottom && left <= right) {
        // Traverse right
        for (let j = left; j <= right; j++) {
            result.push(matrix[top][j]);
        }
        top++;
        
        // Traverse down
        for (let i = top; i <= bottom; i++) {
            result.push(matrix[i][right]);
        }
        right--;
        
        // Traverse left (if still in bounds)
        if (top <= bottom) {
            for (let j = right; j >= left; j--) {
                result.push(matrix[bottom][j]);
            }
            bottom--;
        }
        
        // Traverse up (if still in bounds)
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                result.push(matrix[i][left]);
            }
            left++;
        }
    }
    
    return result;
}

// Input: [[1,2,3], [4,5,6], [7,8,9]]
// Output: [1,2,3,6,9,8,7,4,5]
```

**Time Complexity**: O(m × n)
**Space Complexity**: O(1) (excluding output)

### Problem 2: Set Matrix Zeroes

**Problem**: If element is 0, set entire row and column to 0

```javascript
function setZeroes(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    let firstRowZero = false;
    let firstColZero = false;
    
    // Check if first row needs to be zero
    for (let j = 0; j < cols; j++) {
        if (matrix[0][j] === 0) {
            firstRowZero = true;
            break;
        }
    }
    
    // Check if first column needs to be zero
    for (let i = 0; i < rows; i++) {
        if (matrix[i][0] === 0) {
            firstColZero = true;
            break;
        }
    }
    
    // Use first row and column as markers
    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            if (matrix[i][j] === 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }
    
    // Set zeros based on markers
    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            if (matrix[i][0] === 0 || matrix[0][j] === 0) {
                matrix[i][j] = 0;
            }
        }
    }
    
    // Set first row if needed
    if (firstRowZero) {
        for (let j = 0; j < cols; j++) {
            matrix[0][j] = 0;
        }
    }
    
    // Set first column if needed
    if (firstColZero) {
        for (let i = 0; i < rows; i++) {
            matrix[i][0] = 0;
        }
    }
    
    return matrix;
}
```

**Time Complexity**: O(m × n)
**Space Complexity**: O(1)

### Problem 3: 2D Prefix Sum (Range Sum Query)

**Problem**: Find sum of rectangle in O(1) after preprocessing

```javascript
class MatrixPrefixSum {
    constructor(matrix) {
        this.rows = matrix.length;
        this.cols = matrix[0].length;
        this.prefix = Array(this.rows + 1)
            .fill(0)
            .map(() => Array(this.cols + 1).fill(0));
        
        // Build 2D prefix sum
        for (let i = 1; i <= this.rows; i++) {
            for (let j = 1; j <= this.cols; j++) {
                this.prefix[i][j] = matrix[i-1][j-1]
                                  + this.prefix[i-1][j]
                                  + this.prefix[i][j-1]
                                  - this.prefix[i-1][j-1];
            }
        }
    }
    
    // Sum of rectangle from (r1,c1) to (r2,c2) inclusive
    sumRegion(r1, c1, r2, c2) {
        r1++; c1++; r2++; c2++; // Convert to 1-indexed
        
        return this.prefix[r2][c2]
             - this.prefix[r1-1][c2]
             - this.prefix[r2][c1-1]
             + this.prefix[r1-1][c1-1];
    }
}

// Usage
const matrix = [[3,0,1,4,2], [5,6,3,2,1], [1,2,0,1,5]];
const ps = new MatrixPrefixSum(matrix);
console.log(ps.sumRegion(1, 1, 2, 3)); // Sum of rectangle
```

**Time Complexity**: 
- Build: O(m × n)
- Query: O(1)

**Space Complexity**: O(m × n)

### Problem 4: Search in Row-Column Sorted Matrix

**Problem**: Matrix is sorted row-wise and column-wise

```javascript
function searchMatrix(matrix, target) {
    if (!matrix.length) return false;
    
    let row = 0;
    let col = matrix[0].length - 1;
    
    // Start from top-right corner
    while (row < matrix.length && col >= 0) {
        if (matrix[row][col] === target) {
            return true;
        } else if (matrix[row][col] > target) {
            col--; // Move left
        } else {
            row++; // Move down
        }
    }
    
    return false;
}
```

**Time Complexity**: O(m + n)
**Space Complexity**: O(1)

### Problem 5: Matrix Multiplication

```javascript
function matrixMultiply(A, B) {
    const m = A.length;      // rows of A
    const n = A[0].length;   // cols of A = rows of B
    const p = B[0].length;   // cols of B
    
    // Result will be m × p
    const result = Array(m).fill(0).map(() => Array(p).fill(0));
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < p; j++) {
            for (let k = 0; k < n; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    
    return result;
}

// A: 2×3, B: 3×2 → Result: 2×2
const A = [[1,2,3], [4,5,6]];
const B = [[7,8], [9,10], [11,12]];
console.log(matrixMultiply(A, B));
```

**Time Complexity**: O(m × n × p)
**Space Complexity**: O(m × p)

### Problem 6: Rotate Matrix 90° Counter-Clockwise

```javascript
function rotate90CounterClockwise(matrix) {
    const n = matrix.length;
    
    // Step 1: Reverse each row
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
    
    // Step 2: Transpose
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
    
    return matrix;
}
```

### Problem 7: Number of Islands (DFS on Matrix)

```javascript
function numIslands(grid) {
    if (!grid.length) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;
    
    function dfs(i, j) {
        if (i < 0 || i >= rows || j < 0 || j >= cols || grid[i][j] !== '1') {
            return;
        }
        
        grid[i][j] = '0'; // Mark as visited
        
        // Explore all 4 directions
        dfs(i + 1, j);
        dfs(i - 1, j);
        dfs(i, j + 1);
        dfs(i, j - 1);
    }
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '1') {
                count++;
                dfs(i, j);
            }
        }
    }
    
    return count;
}
```

**Time Complexity**: O(m × n)
**Space Complexity**: O(m × n) for recursion stack

### Problem 8: Generate Spiral Matrix

**Problem**: Create n×n matrix filled in spiral order

```javascript
function generateSpiralMatrix(n) {
    const matrix = Array(n).fill(0).map(() => Array(n).fill(0));
    
    let top = 0, bottom = n - 1;
    let left = 0, right = n - 1;
    let num = 1;
    
    while (top <= bottom && left <= right) {
        // Fill top row
        for (let j = left; j <= right; j++) {
            matrix[top][j] = num++;
        }
        top++;
        
        // Fill right column
        for (let i = top; i <= bottom; i++) {
            matrix[i][right] = num++;
        }
        right--;
        
        // Fill bottom row
        if (top <= bottom) {
            for (let j = right; j >= left; j--) {
                matrix[bottom][j] = num++;
            }
            bottom--;
        }
        
        // Fill left column
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                matrix[i][left] = num++;
            }
            left++;
        }
    }
    
    return matrix;
}

// generateSpiralMatrix(3)
// Output: [[1,2,3], [8,9,4], [7,6,5]]
```

### Advanced Techniques Summary

| Technique | Use Case | Complexity |
|-----------|----------|------------|
| Spiral Traversal | Print/traverse in spiral | O(m×n) |
| 2D Prefix Sum | Range sum queries | O(1) query |
| In-place markers | Space-optimized modifications | O(1) space |
| Corner start | Search in sorted matrix | O(m+n) |
| DFS/BFS | Connected components, paths | O(m×n) |

### Practice Problems

1. ✅ Spiral Matrix I & II
2. ✅ Set Matrix Zeroes
3. ✅ Rotate Image
4. ✅ Search a 2D Matrix II
5. ✅ Range Sum Query 2D
6. ✅ Number of Islands
7. ✅ Maximal Rectangle
8. ✅ Valid Sudoku
9. ✅ Word Search

### Key Takeaways

- Master spiral traversal pattern (4 directions)
- Use first row/column as markers for O(1) space
- 2D prefix sum enables O(1) range queries
- Start from corner for sorted matrix search
- DFS/BFS for connected component problems
- Matrix problems often test boundary condition handling
- Visualize the transformation before coding

