---
title: "Product Array Puzzle"
description: "Calculate product of all elements except self without using division. Master the prefix-suffix product technique for efficient array manipulation."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Product Array Puzzle
----------------------------

### Problem Statement:

Given an array `A` of size `N`, return an array `result` where `result[i]` is the product of all elements of `A` except `A[i]`.

**Constraint:** Solve without using division operation.

### Examples:

#### Example 1:

**Input:** A = [1, 2, 3, 4]

**Output:** [24, 12, 8, 6]

**Explanation:**
* result[0] = 2 × 3 × 4 = 24
* result[1] = 1 × 3 × 4 = 12
* result[2] = 1 × 2 × 4 = 8
* result[3] = 1 × 2 × 3 = 6

#### Example 2:

**Input:** A = [2, 3, 4, 5]

**Output:** [60, 40, 30, 24]

### Constraints:

* `2 ≤ N ≤ 10^5`
* `1 ≤ A[i] ≤ 10^4`
* No division allowed

### Approach:

Use prefix product and suffix product arrays. For each i: `result[i] = prefix[i-1] × suffix[i+1]`

### Time Complexity:

* **Time = O(N)**, **Space = O(N)**

### JavaScript Code:

```javascript
function productExceptSelf(A) {
    const N = A.length;
    const result = new Array(N);
    
    // Build prefix products
    const prefix = [1];
    for (let i = 0; i < N; i++) {
        prefix[i+1] = prefix[i] * A[i];
    }
    
    // Build suffix products
    const suffix = new Array(N+1);
    suffix[N] = 1;
    for (let i = N-1; i >= 0; i--) {
        suffix[i] = suffix[i+1] * A[i];
    }
    
    // Calculate result
    for (let i = 0; i < N; i++) {
        result[i] = prefix[i] * suffix[i+1];
    }
    
    return result;
}
```

### Space Optimized:

```javascript
function productExceptSelf_Optimized(A) {
    const N = A.length;
    const result = new Array(N).fill(1);
    
    // Left pass
    let left = 1;
    for (let i = 0; i < N; i++) {
        result[i] = left;
        left *= A[i];
    }
    
    // Right pass
    let right = 1;
    for (let i = N-1; i >= 0; i--) {
        result[i] *= right;
        right *= A[i];
    }
    
    return result;
}
```

### Key Takeaways:

1. **Prefix-suffix technique** avoids division.
2. Space can be optimized to O(1) extra.
3. Two-pass algorithm for efficiency.
4. Each element is product of left and right sides.
5. Common in array manipulation interviews.

