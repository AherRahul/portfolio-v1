---
title: "Range Sum Query - II"
description: "Master efficient range sum queries using the Prefix Sum technique. Learn how to answer multiple range queries in O(1) time after O(N) preprocessing, and understand one of the most powerful array optimization techniques."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Prefix Sum Technique"
    type: "reference"
    url: "https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/"
    description: "Understanding prefix sum arrays"
  - title: "Range Query Algorithms"
    type: "tool"
    url: "https://visualgo.net/en/array"
    description: "Visualize range query operations"
  - title: "Array Problems Practice"
    type: "practice"
    url: "https://leetcode.com/tag/prefix-sum/"
    description: "Practice prefix sum problems"
  - title: "Scaler Notes - Day 33, 18 Apr - DSA: Introduction to Problem Solving"
    type: "documentation"
    url: "https://res.cloudinary.com/duojkrgue/image/upload/v1761497972/Portfolio/scalerNotes/01-dsa-problem-solving_zudvhj.pdf"
    description: "DSA Mathematical foundations"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Range Sum Query - II
----------------------------

### Problem Statement:

Given an array `arr` of `N` integers and `Q` queries, where each query consists of two indices `L` (left) and `R` (right), find the **sum of elements** in the array from index `L` to `R` (inclusive) for each query.

**Note:** The array uses **0-based indexing**.

Return an array containing the sum for each query.

### Examples:

#### Example 1:

**Input:** 
* arr = [1, 2, 3, 4, 5]
* queries = [[0, 2], [1, 4], [2, 3]]

**Output:** [6, 14, 7]

**Explanation:**
* Query 1: Sum from index 0 to 2 = 1 + 2 + 3 = 6
* Query 2: Sum from index 1 to 4 = 2 + 3 + 4 + 5 = 14
* Query 3: Sum from index 2 to 3 = 3 + 4 = 7

#### Example 2:

**Input:** 
* arr = [10, 20, 30, 40, 50]
* queries = [[0, 4], [1, 2], [3, 4]]

**Output:** [150, 50, 90]

**Explanation:**
* Query 1: Sum from 0 to 4 = 10+20+30+40+50 = 150
* Query 2: Sum from 1 to 2 = 20+30 = 50
* Query 3: Sum from 3 to 4 = 40+50 = 90

#### Example 3:

**Input:** 
* arr = [5]
* queries = [[0, 0]]

**Output:** [5]

**Explanation:**
* Query 1: Sum from 0 to 0 = 5

### Constraints:

* `1 ≤ N ≤ 10^5`
* `1 ≤ Q ≤ 10^5`
* `0 ≤ L ≤ R < N`
* `-10^9 ≤ arr[i] ≤ 10^9`

### Important Points to Understand:

**1. Multiple Queries Problem:**
* We need to answer Q queries efficiently.
* Naive approach: O(N) per query → O(N × Q) total.
* For N = 10^5 and Q = 10^5, this means 10^10 operations! ❌

**2. Prefix Sum Optimization:**
* Precompute cumulative sums: O(N) preprocessing.
* Answer each query in O(1).
* Total: O(N + Q) → Much better! ✓

**3. Prefix Sum Definition:**
* `prefix[i]` = sum of elements from index 0 to i.
* `prefix[i] = arr[0] + arr[1] + ... + arr[i]`

**4. Range Sum Formula:**
* Sum from L to R = `prefix[R] - prefix[L-1]`
* Special case: If L = 0, sum = `prefix[R]`

**5. Why Prefix Sum Works:**
* `prefix[R]` contains sum from 0 to R.
* `prefix[L-1]` contains sum from 0 to L-1.
* Subtracting gives sum from L to R.

### Approach:

**Brute Force Approach:**
1. For each query [L, R]:
   * Loop from index L to R.
   * Sum all elements.
   * Add to result.

**Optimized Approach (Prefix Sum):**
1. Build prefix sum array:
   * `prefix[0] = arr[0]`
   * `prefix[i] = prefix[i-1] + arr[i]` for i > 0
2. For each query [L, R]:
   * If L = 0: result = `prefix[R]`
   * Else: result = `prefix[R] - prefix[L-1]`

### Time Complexity:

**Brute Force:**
* **Time Complexity = O(Q × N)**
  * Q queries, each taking O(N) time.
  * For Q = 10^5, N = 10^5: 10^10 operations ❌

**Prefix Sum (Optimal):**
* **Time Complexity = O(N + Q)**
  * O(N) for building prefix array.
  * O(1) for each of Q queries.
  * For Q = 10^5, N = 10^5: ~2×10^5 operations ✓

### Space Complexity:

**Brute Force:**
* **Space Complexity = O(1)** - only variables for calculation.

**Prefix Sum:**
* **Space Complexity = O(N)** - prefix sum array.

### Dry Run - Brute Force:

```
Input: arr = [1, 2, 3, 4, 5], queries = [[0, 2], [1, 4]]

Query 1: L=0, R=2
    sum = 0
    i=0: sum = 0 + 1 = 1
    i=1: sum = 1 + 2 = 3
    i=2: sum = 3 + 3 = 6
    Result: 6

Query 2: L=1, R=4
    sum = 0
    i=1: sum = 0 + 2 = 2
    i=2: sum = 2 + 3 = 5
    i=3: sum = 5 + 4 = 9
    i=4: sum = 9 + 5 = 14
    Result: 14

Output: [6, 14]
```

### Dry Run - Prefix Sum:

```
Input: arr = [1, 2, 3, 4, 5], queries = [[0, 2], [1, 4]]

Step 1: Build prefix sum array
    prefix[0] = 1
    prefix[1] = 1 + 2 = 3
    prefix[2] = 3 + 3 = 6
    prefix[3] = 6 + 4 = 10
    prefix[4] = 10 + 5 = 15
    
    prefix = [1, 3, 6, 10, 15]

Step 2: Answer queries

Query 1: L=0, R=2
    L = 0, so result = prefix[2] = 6
    
Query 2: L=1, R=4
    result = prefix[4] - prefix[0]
    result = 15 - 1 = 14

Output: [6, 14]
```

### Brute Force Approach - JavaScript Code:

```javascript
function rangeSumQueryBruteForce(arr, queries) {
    const results = [];
    
    for (const [L, R] of queries) {
        let sum = 0;
        for (let i = L; i <= R; i++) {
            sum += arr[i];
        }
        results.push(sum);
    }
    
    return results;
}
```

**Time:** O(Q × N) ❌
**Space:** O(1) ✓

### Visualization:

```
Array: [1, 2, 3, 4, 5]
Index:  0  1  2  3  4

Prefix Sum Array Construction:
prefix[0] = arr[0] = 1
prefix[1] = prefix[0] + arr[1] = 1 + 2 = 3
prefix[2] = prefix[1] + arr[2] = 3 + 3 = 6
prefix[3] = prefix[2] + arr[3] = 6 + 4 = 10
prefix[4] = prefix[3] + arr[4] = 10 + 5 = 15

Prefix Array: [1, 3, 6, 10, 15]

Visual representation:
Index:    0   1   2   3   4
Array:   [1,  2,  3,  4,  5]
Prefix:  [1,  3,  6, 10, 15]
          ↑   ↑   ↑   ↑   ↑
      Sum  1  1-2 1-3 1-4 1-5
      to i

Query [1, 4]: Sum from index 1 to 4
    prefix[4] = sum[0 to 4] = 15
    prefix[0] = sum[0 to 0] = 1
    Result = 15 - 1 = 14 ✓
    
Visual:
[1,  2,  3,  4,  5]
     └─────────┘
     Sum = 2+3+4+5 = 14
```

### Optimal Approach - Prefix Sum:

```javascript
function rangeSumQuery(arr, queries) {
    const N = arr.length;
    
    // Step 1: Build prefix sum array
    const prefix = new Array(N);
    prefix[0] = arr[0];
    
    for (let i = 1; i < N; i++) {
        prefix[i] = prefix[i - 1] + arr[i];
    }
    
    // Step 2: Answer queries in O(1) each
    const results = [];
    
    for (const [L, R] of queries) {
        if (L === 0) {
            results.push(prefix[R]);
        } else {
            results.push(prefix[R] - prefix[L - 1]);
        }
    }
    
    return results;
}
```

**Time:** O(N + Q) ✓
**Space:** O(N) ✓

### Alternative Implementation (Class-Based):

```javascript
class RangeSumQuery {
    constructor(arr) {
        this.N = arr.length;
        this.prefix = new Array(this.N);
        
        // Build prefix sum array
        this.prefix[0] = arr[0];
        for (let i = 1; i < this.N; i++) {
            this.prefix[i] = this.prefix[i - 1] + arr[i];
        }
    }
    
    query(L, R) {
        if (L === 0) {
            return this.prefix[R];
        }
        return this.prefix[R] - this.prefix[L - 1];
    }
    
    multipleQueries(queries) {
        return queries.map(([L, R]) => this.query(L, R));
    }
}

// Usage:
const arr = [1, 2, 3, 4, 5];
const rsq = new RangeSumQuery(arr);
console.log(rsq.query(0, 2));  // 6
console.log(rsq.query(1, 4));  // 14
console.log(rsq.multipleQueries([[0, 2], [1, 4]]));  // [6, 14]
```

### Alternative: Using Extra Space for Cleaner Logic:

```javascript
function rangeSumQueryClean(arr, queries) {
    const N = arr.length;
    
    // Add 0 at the beginning to handle L=0 case uniformly
    const prefix = new Array(N + 1);
    prefix[0] = 0;
    
    for (let i = 0; i < N; i++) {
        prefix[i + 1] = prefix[i] + arr[i];
    }
    
    // Now all queries use same formula
    const results = [];
    for (const [L, R] of queries) {
        results.push(prefix[R + 1] - prefix[L]);
    }
    
    return results;
}
```

**Benefit:** Eliminates the L === 0 special case.

### Optimization - In-Place Prefix Sum:

```javascript
function rangeSumQueryInPlace(arr, queries) {
    // Modify arr to become prefix sum array (destructive)
    for (let i = 1; i < arr.length; i++) {
        arr[i] += arr[i - 1];
    }
    
    const results = [];
    for (const [L, R] of queries) {
        const sum = L === 0 ? arr[R] : arr[R] - arr[L - 1];
        results.push(sum);
    }
    
    return results;
}
```

**Warning:** This modifies the original array!
**Space:** O(1) (excluding output) but destructive.

### Edge Cases to Consider:

**1. Single Element Array:**
* Input: arr = [5], queries = [[0, 0]]
* Output: [5]

**2. Query Entire Array:**
* Input: arr = [1,2,3,4,5], queries = [[0, 4]]
* Output: [15]

**3. Single Element Query:**
* Input: arr = [1,2,3,4,5], queries = [[2, 2]]
* Output: [3]

**4. Consecutive Queries:**
* Input: queries = [[0,1], [1,2], [2,3]]
* Should all work correctly.

**5. Negative Numbers:**
* Input: arr = [-5, 3, -2, 8, 1]
* queries = [[0, 4]]
* Sum = -5+3-2+8+1 = 5
* Output: [5]

**6. All Negative:**
* Input: arr = [-1, -2, -3]
* queries = [[0, 2]]
* Output: [-6]

**7. Zeros:**
* Input: arr = [0, 0, 0, 0]
* queries = [[0, 3]]
* Output: [0]

**8. Large Numbers:**
* Handle potential integer overflow for very large sums.
* Use appropriate data types.

### Key Takeaways:

1. **Prefix sum is a powerful technique** for optimizing range query problems.

2. **Trade-off:** O(N) space for O(1) query time - excellent for multiple queries!

3. **Formula is key:** `sum[L to R] = prefix[R] - prefix[L-1]`

4. **Preprocessing matters:** Spend O(N) once to save O(N × Q) overall.

5. **When to use prefix sum:**
   * Multiple range queries on static array.
   * Subarray sum problems.
   * Range sum queries in 2D arrays.
   * Finding equilibrium index.

6. **Interview strategy:**
   * Start with brute force explanation.
   * Explain why it's inefficient for multiple queries.
   * Introduce prefix sum concept.
   * Walk through array construction.
   * Demonstrate query answering.
   * Discuss time/space complexity.

7. **Related techniques:**
   * Prefix product (for range products).
   * Prefix XOR (for range XOR).
   * 2D prefix sum (for matrix range queries).
   * Difference array (for range updates).

8. **Applications:**
   * Database query optimization.
   * Image processing (summed-area table).
   * Financial analytics (cumulative sums).
   * Game development (tile-based calculations).

9. **Common mistakes:**
   * Forgetting to handle L = 0 separately.
   * Off-by-one errors in indices.
   * Integer overflow for large sums.
   * Not considering negative numbers.

10. **Extensions:**
    * **Mutable arrays:** Use Segment Tree or Fenwick Tree.
    * **2D arrays:** Build 2D prefix sum.
    * **Range updates:** Use difference array technique.
    * **Lazy propagation:** For complex scenarios.

11. **Performance comparison:**
    * For 10^5 elements and 10^5 queries:
      * Brute force: ~10^10 operations ❌
      * Prefix sum: ~2×10^5 operations ✓
      * Speedup: ~50,000x faster!

12. **Testing strategy:**
    * ✓ Single element
    * ✓ Full array query
    * ✓ Single element query
    * ✓ Negative numbers
    * ✓ Mixed positive/negative
    * ✓ Zeros
    * ✓ Multiple queries
    * ✓ Edge indices (0, N-1)

