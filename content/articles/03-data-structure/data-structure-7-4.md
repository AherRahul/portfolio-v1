---
title: "Suffix Maximum"
description: "Build suffix maximum array to find maximum element from any index to end. Learn reverse cumulative maximum technique."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Suffix Maximum
----------------------------

### Problem Statement:

Given array `A`, create array `suffixMax` where `suffixMax[i]` is the maximum element from index i to N-1.

### Examples:

#### Example 1:

**Input:** A = [3, 1, 4, 1, 5]

**Output:** [5, 5, 5, 5, 5]

### Approach:

Iterate right to left, tracking max seen so far.

### Time Complexity:

* **Time = O(N)**, **Space = O(N)**

### JavaScript Code:

```javascript
function suffixMax(A) {
    const N = A.length;
    const result = new Array(N);
    result[N-1] = A[N-1];
    
    for (let i = N-2; i >= 0; i--) {
        result[i] = Math.max(result[i+1], A[i]);
    }
    
    return result;
}
```

### Key Takeaways:

1. Reverse of prefix maximum.
2. Scan from right to left.
3. Combined with prefix for range queries.
4. Essential for water trapping.
5. Used in leader element problems.

