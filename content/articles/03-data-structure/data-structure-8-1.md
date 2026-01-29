---
title: "Arrays : 2D Matrices 1"
description: "Introduction to 2D matrices and fundamental operations. Learn matrix representation, traversal patterns, basic transformations, and essential 2D array manipulation techniques."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Matrix Visualization"
    type: "tool"
    url: "https://visualgo.net/en/list"
    description: "Interactive matrix operations visualization"
  - title: "2D Array Patterns"
    type: "reference"
    url: "https://www.geeksforgeeks.org/matrix/"
    description: "Common matrix patterns and problems"
  - title: "Matrix Practice"
    type: "practice"
    url: "https://leetcode.com/tag/matrix/"
    description: "Practice matrix problems"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Arrays : 2D Matrices 1
----------------------------

### Introduction to 2D Matrices

A **2D matrix** (or 2D array) is a data structure that stores elements in a grid-like format with rows and columns. It's essentially an array of arrays.

### Representation in JavaScript

```javascript
// Method 1: Array of arrays
const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

// Method 2: Creating with specific dimensions
function createMatrix(rows, cols, defaultValue = 0) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        matrix[i] = new Array(cols).fill(defaultValue);
    }
    return matrix;
}
```

### Matrix Terminology

- **Dimensions**: m × n (m rows, n columns)
- **Element**: `matrix[i][j]` (row i, column j)
- **Square Matrix**: m = n
- **Row**: All elements in same horizontal line
- **Column**: All elements in same vertical line

### Basic Matrix Operations

#### 1. Accessing Elements

```javascript
const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

// Access element at row 1, column 2
console.log(matrix[1][2]); // Output: 6

// Get dimensions
const rows = matrix.length;        // 3
const cols = matrix[0].length;     // 3
```

#### 2. Traversal Patterns

##### Row-wise Traversal
```javascript
function rowWiseTraversal(matrix) {
    const result = [];
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            result.push(matrix[i][j]);
        }
    }
    
    return result;
}

// Input: [[1,2,3], [4,5,6], [7,8,9]]
// Output: [1,2,3,4,5,6,7,8,9]
```

##### Column-wise Traversal
```javascript
function columnWiseTraversal(matrix) {
    const result = [];
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    for (let j = 0; j < cols; j++) {
        for (let i = 0; i < rows; i++) {
            result.push(matrix[i][j]);
        }
    }
    
    return result;
}

// Input: [[1,2,3], [4,5,6], [7,8,9]]
// Output: [1,4,7,2,5,8,3,6,9]
```

##### Diagonal Traversal
```javascript
function diagonalTraversal(matrix) {
    const n = matrix.length;
    const result = [];
    
    // Main diagonal (top-left to bottom-right)
    for (let i = 0; i < n; i++) {
        result.push(matrix[i][i]);
    }
    
    return result;
}

// Input: [[1,2,3], [4,5,6], [7,8,9]]
// Output: [1,5,9]
```

##### Anti-Diagonal Traversal
```javascript
function antiDiagonalTraversal(matrix) {
    const n = matrix.length;
    const result = [];
    
    // Anti-diagonal (top-right to bottom-left)
    for (let i = 0; i < n; i++) {
        result.push(matrix[i][n - 1 - i]);
    }
    
    return result;
}

// Input: [[1,2,3], [4,5,6], [7,8,9]]
// Output: [3,5,7]
```

### Common Matrix Problems

#### Problem 1: Sum of All Elements

```javascript
function matrixSum(matrix) {
    let sum = 0;
    
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            sum += matrix[i][j];
        }
    }
    
    return sum;
}
```

**Time Complexity**: O(m × n)
**Space Complexity**: O(1)

#### Problem 2: Matrix Transpose

```javascript
function transpose(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = [];
    
    for (let j = 0; j < cols; j++) {
        result[j] = [];
        for (let i = 0; i < rows; i++) {
            result[j][i] = matrix[i][j];
        }
    }
    
    return result;
}

// Input:  [[1,2,3], [4,5,6]]
// Output: [[1,4], [2,5], [3,6]]
```

**Time Complexity**: O(m × n)
**Space Complexity**: O(m × n)

#### Problem 3: Rotate Matrix 90° Clockwise

```javascript
function rotate90Clockwise(matrix) {
    const n = matrix.length;
    
    // Step 1: Transpose
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
    
    // Step 2: Reverse each row
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
    
    return matrix;
}

// Input:  [[1,2,3], [4,5,6], [7,8,9]]
// Output: [[7,4,1], [8,5,2], [9,6,3]]
```

**Time Complexity**: O(n²)
**Space Complexity**: O(1) - in-place

#### Problem 4: Search in 2D Matrix

```javascript
function searchMatrix(matrix, target) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === target) {
                return [i, j]; // Return position
            }
        }
    }
    
    return [-1, -1]; // Not found
}
```

**Time Complexity**: O(m × n)

#### Problem 5: Print Boundary Elements

```javascript
function printBoundary(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = [];
    
    // Top row
    for (let j = 0; j < cols; j++) {
        result.push(matrix[0][j]);
    }
    
    // Right column (excluding corners)
    for (let i = 1; i < rows - 1; i++) {
        result.push(matrix[i][cols - 1]);
    }
    
    // Bottom row (if more than 1 row)
    if (rows > 1) {
        for (let j = cols - 1; j >= 0; j--) {
            result.push(matrix[rows - 1][j]);
        }
    }
    
    // Left column (excluding corners, if more than 1 column)
    if (cols > 1) {
        for (let i = rows - 2; i >= 1; i--) {
            result.push(matrix[i][0]);
        }
    }
    
    return result;
}
```

### Matrix Creation Patterns

```javascript
// Identity Matrix
function createIdentityMatrix(n) {
    const matrix = createMatrix(n, n, 0);
    for (let i = 0; i < n; i++) {
        matrix[i][i] = 1;
    }
    return matrix;
}

// Matrix from 1D array
function create2DFrom1D(arr, rows, cols) {
    const matrix = [];
    let idx = 0;
    
    for (let i = 0; i < rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < cols; j++) {
            matrix[i][j] = arr[idx++];
        }
    }
    
    return matrix;
}
```

### Time Complexity Summary

| Operation | Time Complexity |
|-----------|-----------------|
| Access element | O(1) |
| Row/Column traversal | O(n) |
| Full matrix traversal | O(m × n) |
| Transpose | O(m × n) |
| Rotate 90° | O(n²) |
| Search (unsorted) | O(m × n) |

### Practice Problems

1. ✅ Transpose Matrix
2. ✅ Rotate Image (90°)
3. ✅ Spiral Matrix
4. ✅ Set Matrix Zeroes
5. ✅ Search a 2D Matrix
6. ✅ Diagonal Traverse
7. ✅ Matrix Diagonal Sum

### Key Takeaways

- Matrix is array of arrays: `matrix[row][col]`
- Master different traversal patterns
- Understand row-major vs column-major access
- In-place operations save space
- Many problems have O(m × n) time complexity
- Practice visualization of matrix transformations

