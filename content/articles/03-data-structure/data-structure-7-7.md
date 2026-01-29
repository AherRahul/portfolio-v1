---
title: "Range Sum II - Array Updates"
description: "Handle multiple range update and query operations efficiently. Learn segment tree lite approach using difference arrays."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Range Sum II
----------------------------

### Problem Statement:

Given array `A` of size `N`, perform `Q` queries of form `(l, r, c)` which adds `c` to every element in range [l, r]. Return final array.

### Examples:

#### Example 1:

**Input:** A = [1,2,3], Queries = [[0,1,2], [1,2,3]]

**Output:** [3,7,6]

### Approach:

Use difference array for O(1) updates, then compute prefix sum.

### Time Complexity:

* **Time = O(N + Q)**, **Space = O(N)**

### JavaScript Code:

```javascript
function rangeSumUpdate(A, queries) {
    const N = A.length;
    const diff = new Array(N + 1).fill(0);
    
    // Apply queries using difference array
    for (const [l, r, c] of queries) {
        diff[l] += c;
        diff[r + 1] -= c;
    }
    
    // Compute prefix sum and add to original
    let sum = 0;
    for (let i = 0; i < N; i++) {
        sum += diff[i];
        A[i] += sum;
    }
    
    return A;
}
```

### Key Takeaways:

1. Difference array enables O(1) range updates.
2. Prefix sum converts back to actual values.
3. Efficient for bulk update operations.
4. Foundation for segment tree problems.
5. Essential competitive programming technique.

