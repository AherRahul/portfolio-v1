---
title: "Sum the Difference"
description: "Calculate sum of (max - min) across all subsequences. Master combinatorics and contribution technique."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Sum the Difference
----------------------------

### Problem Statement:

Given array `A`, find sum of (maximum - minimum) across all non-empty subsequences.

### Approach:

Sort array. Each element contributes based on how many times it appears as max or min. Element at position i is max in 2^i subsequences and min in 2^(N-1-i) subsequences.

### Time Complexity:

* **Time = O(N log N)**, **Space = O(1)**

### JavaScript Code:

```javascript
function sumTheDifference(A) {
    A.sort((a, b) => a - b);
    const N = A.length;
    const MOD = 1e9 + 7;
    let result = 0;
    
    for (let i = 0; i < N; i++) {
        const maxContribution = A[i] * Math.pow(2, i);
        const minContribution = A[i] * Math.pow(2, N - 1 - i);
        result = (result + maxContribution - minContribution) % MOD;
    }
    
    return (result + MOD) % MOD;
}
```

### Key Takeaways:

1. Sort first to identify max/min positions
2. Use combinatorics to count contributions
3. Each element's contribution calculated independently
4. Power of 2 represents number of subsequences
5. Mathematical approach avoids generating all subsequences

