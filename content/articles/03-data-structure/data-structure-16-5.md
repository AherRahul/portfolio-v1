---
title: "Matrix Search - Row and Column Wise Sorted"
description: "Search in row-wise and column-wise sorted 2D matrix. Master staircase search algorithm, optimize from O(MN) to O(M+N), and handle 2D search efficiently."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Searching Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Matrix Search

## 2. Problem Statement

Given an **M x N matrix** where each row and each column is sorted in **ascending order**, search for a given element **target**.

Return **1** if found, **0** otherwise.

**Input:**
- 2D matrix `matrix` of size M x N
- Target integer

**Output:**
- 1 if found, 0 otherwise

## 3. Examples

```
Input: 
matrix = [
  [1,  4,  7, 11],
  [2,  5,  8, 12],
  [3,  6,  9, 16],
  [10, 13, 14, 17]
]
target = 5
Output: 1

Input: target = 20
Output: 0
```

## 4. Constraints

- `1 ≤ M, N ≤ 1000`
- `-10^9 ≤ matrix[i][j], target ≤ 10^9`

## 5. Important Points

**Matrix Properties:**
```
- Each row sorted left to right
- Each column sorted top to bottom
- NOT necessarily sorted diagonally
```

**Key Insight:**
Start from top-right or bottom-left for O(M+N) solution.

## 6. Brute Force Approach

Check every element.

## 7. Brute Force Code

```javascript
function searchMatrixBrute(matrix, target) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j] === target) {
                return 1;
            }
        }
    }
    return 0;
}
```

## 8. Dry Run

```
matrix = [[1,4,7],[2,5,8],[3,6,9]], target = 5

Check all: 1,4,7,2,5✓

Return: 1
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(M * N)  
**Space:** O(1)

## 10. Visualization

```
Matrix:
 1  4  7 11
 2  5  8 12
 3  6  9 16
10 13 14 17

Target: 5
Position: [1,1] ✓
```

## 11. Optimized Approach Description

**Staircase Search:** Start from top-right:
- If current > target: move left
- If current < target: move down
- If equal: found

## 12. Optimized Approach Algorithm

```
1. Start at top-right: row=0, col=N-1
2. While row < M and col >= 0:
   - If matrix[row][col] = target: return 1
   - If matrix[row][col] > target: col--
   - If matrix[row][col] < target: row++
3. Return 0
```

## 13. Optimized Code

```javascript
function searchMatrix(matrix, target) {
    if (!matrix || matrix.length === 0) return 0;
    
    let row = 0;
    let col = matrix[0].length - 1;
    
    while (row < matrix.length && col >= 0) {
        if (matrix[row][col] === target) {
            return 1;
        } else if (matrix[row][col] > target) {
            col--; // Move left
        } else {
            row++; // Move down
        }
    }
    
    return 0;
}

// Alternative: Start from bottom-left
function searchMatrixBottomLeft(matrix, target) {
    if (!matrix || matrix.length === 0) return 0;
    
    let row = matrix.length - 1;
    let col = 0;
    
    while (row >= 0 && col < matrix[0].length) {
        if (matrix[row][col] === target) {
            return 1;
        } else if (matrix[row][col] > target) {
            row--; // Move up
        } else {
            col++; // Move right
        }
    }
    
    return 0;
}

// Test cases
const matrix = [
    [1, 4, 7, 11],
    [2, 5, 8, 12],
    [3, 6, 9, 16],
    [10, 13, 14, 17]
];

console.log(searchMatrix(matrix, 5)); // 1
console.log(searchMatrix(matrix, 20)); // 0
```

## 14. Dry Run

```
matrix = [[1,4,7],[2,5,8],[3,6,9]], target = 5

Start: row=0, col=2 (top-right)
Position [0,2]: 7 > 5 → col=1
Position [0,1]: 4 < 5 → row=1
Position [1,1]: 5 = 5 → return 1
```

## 15. Time and Space Complexity

**Time:** O(M + N)  
**Space:** O(1)

## 16. Visualization

```
Matrix: target = 5
    11  ← start
 7  12
 8  16
 9  17

Path:
11 > 5 → move left
7 > 5 → move left
4 < 5 → move down
5 = 5 ✓ Found!

Visual:
 1  4  7 11
 2 [5] 8 12
 3  6  9 16
10 13 14 17
```

## 17. Edge Cases

```javascript
// Empty matrix
searchMatrix([], 5); // 0

// Single element
searchMatrix([[5]], 5); // 1
searchMatrix([[5]], 3); // 0

// Single row
searchMatrix([[1, 3, 5]], 3); // 1

// Single column
searchMatrix([[1], [2], [3]], 2); // 1

// Target at corners
searchMatrix([[1, 2], [3, 4]], 1); // 1 (top-left)
searchMatrix([[1, 2], [3, 4]], 4); // 1 (bottom-right)
```

## 18. Key Takeaways

### a. Applications
- Database queries
- Image processing
- Spreadsheet search
- Range queries

### b. Interview Strategy
- Explain staircase search
- Start from corner (not center)
- Mention O(M+N) complexity
- Handle edge cases

### c. Common Mistakes
- Starting from wrong position
- Wrong movement logic
- Not handling empty matrix
- Confusing with fully sorted matrix

### d. Related Problems
- Search 2D Matrix (fully sorted)
- Kth Smallest in Sorted Matrix
- Count Negative Numbers in Matrix
- Find Peak Element II

### e. Performance
- O(M+N) optimal for this structure
- Cannot do better than O(M+N)
- Elegant staircase algorithm
- Better than O(M*N) brute force

## Summary

✅ **Staircase Search:** Start from corner  
✅ **O(M+N):** Optimal time complexity  
✅ **Eliminate Row/Column:** Each step eliminates one  

Happy Coding! 🚀

