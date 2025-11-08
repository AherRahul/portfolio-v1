---
title: "A, B and Modulo"
description: "Find pairs where (A[i] + A[j]) % M equals B. Master modular arithmetic in combinatorial problems."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

A, B and Modulo
----------------------------

### Problem Statement:

Given array `A`, integers `B` and `M`, count pairs (i,j) where i < j and `(A[i] + A[j]) % M === B`.

### Approach:

Use hash map to store frequency of remainders. For each element with remainder r, find complement remainder needed.

### Time Complexity:

* **Time = O(N)**, **Space = O(M)**

### JavaScript Code:

```javascript
function countPairs(A, B, M) {
    const freq = new Map();
    let count = 0;
    
    for (const num of A) {
        const rem = num % M;
        const need = (B - rem + M) % M;
        
        count += freq.get(need) || 0;
        freq.set(rem, (freq.get(rem) || 0) + 1);
    }
    
    return count;
}
```

### Key Takeaways:

1. Use modular arithmetic properties
2. Hash map stores remainder frequencies
3. For each element, find complement
4. O(N) single pass with hash map
5. Pattern for two-sum with modulo

