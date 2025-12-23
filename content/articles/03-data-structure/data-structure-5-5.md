---
title: "Even Numbers in a Range"
description: "Count even numbers efficiently in multiple range queries using prefix sum technique on boolean array."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Even Numbers in a Range
----------------------------

### Problem Statement:

Given an array `A` and multiple queries `[L, R]`, count how many **even numbers** exist in the range from index L to R (inclusive).

### Examples:

#### Example 1:

**Input:** A = [1, 2, 3, 4, 5, 6], Queries = [[0, 2], [1, 5]]

**Output:** [1, 3]

**Explanation:**
* [0, 2]: elements [1, 2, 3], even count = 1 (only 2)
* [1, 5]: elements [2, 3, 4, 5, 6], even count = 3 (2, 4, 6)

### Constraints:

* `1 ≤ N, Q ≤ 10^5`

### Approach:

Create prefix sum of even count: `prefix[i] = count of evens from 0 to i`. Answer = `prefix[R] - prefix[L-1]`

### Time Complexity:

* **Preprocessing: O(N)**, **Per Query: O(1)**

### JavaScript Code:

```javascript
function countEvens(A, queries) {
    const N = A.length;
    const prefix = [A[0] % 2 === 0 ? 1 : 0];
    
    for (let i = 1; i < N; i++) {
        prefix[i] = prefix[i-1] + (A[i] % 2 === 0 ? 1 : 0);
    }
    
    const result = [];
    for (const [L, R] of queries) {
        const count = L === 0 ? prefix[R] : prefix[R] - prefix[L-1];
        result.push(count);
    }
    
    return result;
}
```

### Key Takeaways:

1. **Prefix sum on boolean** (is even?) array.
2. O(1) query time after O(N) preprocessing.
3. Pattern applicable to any counting problem.
4. Can extend to odd numbers, primes, etc.
5. Space-time tradeoff for multiple queries.

