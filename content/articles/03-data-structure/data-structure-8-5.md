---
title: "Find in Matrix"
description: "Search for element in row-wise and column-wise sorted matrix. Master the staircase search algorithm."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Find in Matrix
----------------------------

### Problem Statement:

Given NxN matrix `A` sorted row-wise and column-wise, find if number `B` exists. Return 1 if found, 0 otherwise.

### Examples:

#### Example 1:

**Input:** A = [[1,3,5],[2,4,6],[3,5,7]], B = 4

**Output:** 1

### Approach:

Start from top-right, move left if target smaller, down if larger.

### Time Complexity:

* **Time = O(N+M)**, **Space = O(1)**

### JavaScript Code:

```javascript
function searchMatrix(A, B) {
    let row = 0;
    let col = A[0].length - 1;
    
    while (row < A.length && col >= 0) {
        if (A[row][col] === B) {
            return 1;
        } else if (A[row][col] > B) {
            col--;
        } else {
            row++;
        }
    }
    
    return 0;
}
```

### Key Takeaways:

1. Staircase search from top-right or bottom-left.
2. O(N+M) optimal for sorted matrix.
3. Eliminates row or column each step.
4. Classic 2D search pattern.
5. Tests understanding of matrix properties.

