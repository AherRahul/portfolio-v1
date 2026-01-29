---
title: "Search in Row-wise and Column-wise Sorted Matrix"
description: "Search for element efficiently in matrix sorted both row-wise and column-wise. Master the staircase search algorithm."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Search in Sorted Matrix
----------------------------

### Problem Statement:

Given matrix sorted row-wise and column-wise, search for target element.

### Approach:

Start from top-right or bottom-left, eliminate row or column each step.

### Time Complexity:

* **Time = O(N+M)**, **Space = O(1)**

### JavaScript Code:

```javascript
function searchMatrix(A, target) {
    let row = 0;
    let col = A[0].length - 1;
    
    while (row < A.length && col >= 0) {
        if (A[row][col] === target) {
            return true;
        } else if (A[row][col] > target) {
            col--;
        } else {
            row++;
        }
    }
    
    return false;
}
```

### Key Takeaways:

1. Staircase search is optimal.
2. Start from corner where both directions are sorted differently.
3. O(N+M) eliminates one row/column per step.
4. Classic sorted matrix problem.
5. Better than O(N×M) brute force or O(N log M) binary search per row.

