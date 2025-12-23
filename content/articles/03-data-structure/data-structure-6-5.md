---
title: "Sum of All Subarrays"
description: "Calculate the total sum of all possible subarrays efficiently. Learn the mathematical formula approach to solve in O(N) time."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Sum of All Subarrays
----------------------------

### Problem Statement:

Given an array `A`, find the sum of sums of all possible subarrays.

### Examples:

#### Example 1:

**Input:** A = [1, 2, 3]

**Output:** 20

**Explanation:** Subarray sums: 1+3+6+2+5+3 = 20

### Approach:

Each element A[i] appears in (i+1) × (N-i) subarrays. Total = Σ A[i] × (i+1) × (N-i)

### Time Complexity:

* **Time = O(N)**, **Space = O(1)**

### JavaScript Code:

```javascript
function sumOfAllSubarrays(A) {
    const N = A.length;
    let total = 0;
    
    for (let i = 0; i < N; i++) {
        const count = (i + 1) * (N - i);
        total += A[i] * count;
    }
    
    return total;
}
```

### Key Takeaways:

1. **Mathematical formula** avoids generating all subarrays.
2. Each element's contribution calculated independently.
3. Element at index i appears in multiple subarrays.
4. Formula: (i+1) subarrays starting before/at i, (N-i) ending at/after i.
5. Elegant O(N) solution to O(N²) problem.

