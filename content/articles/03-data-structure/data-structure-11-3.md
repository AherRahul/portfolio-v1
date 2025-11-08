---
title: "Number of 1 Bits"
description: "Count total number of set bits (1s) in binary representation. Master Brian Kernighan's algorithm."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Number of 1 Bits
----------------------------

### Problem Statement:

Given integer `N`, count number of 1s in its binary representation.

### Examples:

#### Example 1:

**Input:** N = 13 (binary: 1101)

**Output:** 3

### Approach:

**Brian Kernighan's Algorithm:** `N & (N-1)` removes rightmost set bit. Count iterations until N becomes 0.

### Time Complexity:

* **Time = O(k)** where k = number of set bits, **Space = O(1)**

### JavaScript Code:

```javascript
function countSetBits(N) {
    let count = 0;
    while (N > 0) {
        N = N & (N - 1);  // Remove rightmost 1
        count++;
    }
    return count;
}
```

### Key Takeaways:

1. Brian Kernighan's algorithm is optimal
2. Each iteration removes one set bit
3. Better than checking all 32 bits
4. Property: `N & (N-1)` clears rightmost 1
5. Classic bit manipulation problem

