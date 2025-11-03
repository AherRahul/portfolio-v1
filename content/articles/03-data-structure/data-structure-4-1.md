---
title: "Prefix Sum"
description: "Master the prefix sum technique for efficient range query operations. Learn how to precompute cumulative sums to answer range sum queries in O(1) time complexity."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Prefix Sum Visualization"
    type: "tool"
    url: "https://visualgo.net/en/list"
    description: "Interactive prefix sum visualization"
  - title: "Range Query Techniques"
    type: "reference"
    url: "https://cp-algorithms.com/data_structures/segment_tree.html"
    description: "Advanced range query data structures"
  - title: "Prefix Sum Practice"
    type: "practice"
    url: "https://leetcode.com/tag/prefix-sum/"
    description: "Practice problems on prefix sum technique"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Prefix Sum
----------------------------

### Introduction to Prefix Sum

**Prefix Sum** (also called cumulative sum) is a preprocessing technique that allows us to answer range sum queries efficiently. By precomputing cumulative sums, we can find the sum of any subarray in constant time.

### The Concept

Given an array `arr[]`, the prefix sum array `prefix[]` is defined as:
```
prefix[i] = arr[0] + arr[1] + arr[2] + ... + arr[i]
```

### Building Prefix Sum Array

```javascript
function buildPrefixSum(arr) {
    const n = arr.length;
    const prefix = new Array(n);
    
    prefix[0] = arr[0];
    for (let i = 1; i < n; i++) {
        prefix[i] = prefix[i - 1] + arr[i];
    }
    
    return prefix;
}
```

### Range Sum Query

To find sum from index `L` to `R`:
```javascript
function rangeSum(prefix, L, R) {
    if (L === 0) {
        return prefix[R];
    }
    return prefix[R] - prefix[L - 1];
}
```

### Example

```javascript
// Original array: [3, 1, 4, 2, 5]
// Prefix sum:     [3, 4, 8, 10, 15]

// Query: Sum from index 1 to 3
// Answer: prefix[3] - prefix[0] = 10 - 3 = 7
// Verification: arr[1] + arr[2] + arr[3] = 1 + 4 + 2 = 7 ✓
```

### Complete Implementation

```javascript
class PrefixSum {
    constructor(arr) {
        this.n = arr.length;
        this.prefix = new Array(this.n);
        
        // Build prefix sum
        this.prefix[0] = arr[0];
        for (let i = 1; i < this.n; i++) {
            this.prefix[i] = this.prefix[i - 1] + arr[i];
        }
    }
    
    // Get sum from index L to R (inclusive)
    getSum(L, R) {
        if (L === 0) return this.prefix[R];
        return this.prefix[R] - this.prefix[L - 1];
    }
}

// Usage
const arr = [3, 1, 4, 2, 5];
const ps = new PrefixSum(arr);
console.log(ps.getSum(1, 3)); // Output: 7
```

### Time & Space Complexity

- **Building Prefix Sum**: O(n) time, O(n) space
- **Range Query**: O(1) time
- **Overall**: For Q queries - O(n + Q) vs O(n × Q) without prefix sum

### Applications

1. Range sum queries
2. Equilibrium index problems
3. Subarray sum problems
4. 2D matrix range queries (2D prefix sum)
5. XOR queries (prefix XOR)

### Variations

#### 2D Prefix Sum
For matrix range sum queries:
```javascript
prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] 
             - prefix[i-1][j-1] + matrix[i][j]
```

#### Prefix XOR
```javascript
prefixXOR[i] = arr[0] ^ arr[1] ^ ... ^ arr[i]
```

### Practice Problems

1. Range Sum Query - Immutable
2. Subarray Sum Equals K
3. Contiguous Array
4. Product of Array Except Self
5. Range Sum Query 2D - Matrix

### Key Takeaways

- Prefix Sum trades space for time
- Essential for range query optimization
- Foundation for more advanced techniques
- Can be extended to 2D, XOR, products, etc.

