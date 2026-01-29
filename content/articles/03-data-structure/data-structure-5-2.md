---
title: "Prefix Sum Concept"
description: "Understand the fundamental concept of prefix sum arrays. Learn how to build prefix sum arrays and use them to answer range queries efficiently."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Prefix Sum Array Tutorial"
    type: "reference"
    url: "https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/"
    description: "Complete guide to prefix sum technique"
  - title: "Array Visualization Tool"
    type: "tool"
    url: "https://visualgo.net/en/array"
    description: "Visualize array operations"
  - title: "Prefix Sum Practice"
    type: "practice"
    url: "https://leetcode.com/tag/prefix-sum/"
    description: "Practice prefix sum problems"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Prefix Sum Concept
----------------------------

### Problem Statement:

Given an array `A` of size `N`, create a **prefix sum array** `prefix[]` where `prefix[i]` represents the sum of all elements from index 0 to i.

The prefix sum array allows us to calculate the sum of any subarray in constant time O(1) after O(N) preprocessing.

**Definition:** `prefix[i] = A[0] + A[1] + A[2] + ... + A[i]`

### Examples:

#### Example 1:

**Input:** A = [1, 2, 3, 4, 5]

**Output:** prefix = [1, 3, 6, 10, 15]

**Explanation:**
* prefix[0] = 1
* prefix[1] = 1 + 2 = 3
* prefix[2] = 1 + 2 + 3 = 6
* prefix[3] = 1 + 2 + 3 + 4 = 10
* prefix[4] = 1 + 2 + 3 + 4 + 5 = 15

#### Example 2:

**Input:** A = [2, -1, 3, -4, 5]

**Output:** prefix = [2, 1, 4, 0, 5]

**Explanation:**
* prefix[0] = 2
* prefix[1] = 2 + (-1) = 1
* prefix[2] = 2 + (-1) + 3 = 4
* prefix[3] = 2 + (-1) + 3 + (-4) = 0
* prefix[4] = 2 + (-1) + 3 + (-4) + 5 = 5

### Constraints:

* `1 ≤ N ≤ 10^5`
* `-10^9 ≤ A[i] ≤ 10^9`
* Array can contain negative numbers, zeros, and positive numbers

### Important Points to Understand:

1. **Cumulative Sum:** Each element in prefix array stores the cumulative sum up to that index
2. **Range Query Formula:** Sum from L to R = `prefix[R] - prefix[L-1]` (handle L=0 separately)
3. **Preprocessing Trade-off:** Spend O(N) time once to answer queries in O(1)
4. **Space vs Time:** Use O(N) extra space to optimize query time from O(N) to O(1)
5. **Building Pattern:** Each prefix[i] = prefix[i-1] + A[i]

### Approach:

**Step 1:** Create a new array `prefix` of size N

**Step 2:** Set `prefix[0] = A[0]` (first element is its own prefix sum)

**Step 3:** Iterate from index 1 to N-1:
  - Calculate `prefix[i] = prefix[i-1] + A[i]`
  
**Step 4:** Return the prefix array

**Usage for Range Queries:**
- Sum from 0 to R: `prefix[R]`
- Sum from L to R (L > 0): `prefix[R] - prefix[L-1]`

### Time Complexity:

* **Preprocessing Time: O(N)** - Single pass to build prefix array
* **Query Time: O(1)** - Direct array access
* **Overall for Q queries: O(N + Q)** instead of O(N × Q) without prefix sum

### Space Complexity:

* **O(N)** - Additional array to store prefix sums
* Can be optimized to O(1) with in-place modification (but loses original array)

### Dry Run:

```
Input: A = [3, 1, 2, 4]

Step 1: Initialize prefix array
  prefix = []

Step 2: Set prefix[0]
  prefix[0] = A[0] = 3
  prefix = [3]

Step 3: Calculate remaining elements

  i = 1:
    prefix[1] = prefix[0] + A[1] = 3 + 1 = 4
    prefix = [3, 4]

  i = 2:
    prefix[2] = prefix[1] + A[2] = 4 + 2 = 6
    prefix = [3, 4, 6]

  i = 3:
    prefix[3] = prefix[2] + A[3] = 6 + 4 = 10
    prefix = [3, 4, 6, 10]

Final Output: prefix = [3, 4, 6, 10]

Example Query: Sum from index 1 to 3
  Answer = prefix[3] - prefix[0] = 10 - 3 = 7
  Verification: A[1] + A[2] + A[3] = 1 + 2 + 4 = 7 ✓
```

### Brute Force Approach:

**Approach:** Calculate sum for each query by iterating through the range

**Algorithm:**
```javascript
function rangeSum(A, L, R) {
    let sum = 0;
    for (let i = L; i <= R; i++) {
        sum += A[i];
    }
    return sum;
}
```

**Time Complexity:** 
- Single query: O(N) in worst case
- Q queries: O(N × Q)

**Space Complexity:** O(1)

**Why it's not optimal:**
- Recalculates same sums repeatedly
- For Q queries on array of size N: O(N×Q) vs O(N+Q) with prefix sum
- Example: 10^5 queries on 10^5 array = 10^10 operations vs 2×10^5

### Visualization:

```
Original Array:  [3,    1,    2,    4]
Index:            0     1     2     3

Building Prefix Sum:

Step 1:          [3,    _,    _,    _]
                  ↑
              prefix[0] = 3

Step 2:          [3,    4,    _,    _]
                  |-----|
              prefix[1] = 3 + 1 = 4

Step 3:          [3,    4,    6,    _]
                        |-----|
              prefix[2] = 4 + 2 = 6

Step 4:          [3,    4,    6,   10]
                              |-----|
              prefix[3] = 6 + 4 = 10

Prefix Sum:      [3,    4,    6,   10]

Using Prefix Sum for Query [1, 3]:
  Sum = prefix[3] - prefix[0]
      = 10 - 3 = 7
  
  This represents: A[1] + A[2] + A[3] = 1 + 2 + 4 = 7
```

### Multiple Optimized Approaches:

#### Approach 1: Standard Prefix Sum (Recommended)
**Time: O(N + Q), Space: O(N)**
```javascript
function buildPrefixSum(A) {
    const N = A.length;
    const prefix = [A[0]];
    
    for (let i = 1; i < N; i++) {
        prefix[i] = prefix[i-1] + A[i];
    }
    
    return prefix;
}

function rangeSum(prefix, L, R) {
    if (L === 0) return prefix[R];
    return prefix[R] - prefix[L-1];
}
```
**Pros:** Clear, preserves original array, efficient queries
**Cons:** Uses O(N) extra space

#### Approach 2: In-place Prefix Sum
**Time: O(N + Q), Space: O(1)**
```javascript
function inplacePrefixSum(A) {
    for (let i = 1; i < A.length; i++) {
        A[i] = A[i] + A[i-1];
    }
    return A;
}
```
**Pros:** No extra space
**Cons:** Destroys original array

#### Approach 3: Segment Tree (For Dynamic Updates)
**Time: O(N + Q×logN), Space: O(N)**
```javascript
// Use when array elements can be updated
// Allows both range query and point update in O(logN)
```
**Pros:** Supports updates efficiently
**Cons:** More complex, higher constant factors

### Edge Cases to Consider:

1. **Single Element Array:**
   - Input: A = [5]
   - Prefix: [5]
   - Only one element to process

2. **All Negative Numbers:**
   - Input: A = [-1, -2, -3]
   - Prefix: [-1, -3, -6]
   - Sums keep decreasing

3. **All Zeros:**
   - Input: A = [0, 0, 0]
   - Prefix: [0, 0, 0]
   - All prefix sums are zero

4. **Mixed Signs:**
   - Input: A = [5, -3, 2, -1]
   - Prefix: [5, 2, 4, 3]
   - Can increase or decrease

5. **Query at Index 0:**
   - L = 0, R = 0
   - Answer = prefix[0]
   - Special case handling needed

6. **Full Array Query:**
   - L = 0, R = N-1
   - Answer = prefix[N-1]
   - Sum of entire array

7. **Large Numbers:**
   - Consider integer overflow in some languages
   - JavaScript Number type handles large values

### JavaScript Code:

```javascript
function buildPrefixSum(A) {
    const N = A.length;
    const prefix = new Array(N);
    
    // First element is same as original
    prefix[0] = A[0];
    
    // Build prefix sum array
    for (let i = 1; i < N; i++) {
        prefix[i] = prefix[i-1] + A[i];
    }
    
    return prefix;
}

function rangeSum(prefix, L, R) {
    // Handle edge case when L = 0
    if (L === 0) {
        return prefix[R];
    }
    
    // General formula: prefix[R] - prefix[L-1]
    return prefix[R] - prefix[L-1];
}

// Example usage:
const A = [1, 2, 3, 4, 5];
const prefix = buildPrefixSum(A);
console.log(prefix); // [1, 3, 6, 10, 15]

// Query: Sum from index 1 to 3
console.log(rangeSum(prefix, 1, 3)); // 2 + 3 + 4 = 9

// Query: Sum from index 0 to 2
console.log(rangeSum(prefix, 0, 2)); // 1 + 2 + 3 = 6
```

### Key Takeaways:

1. **Fundamental Technique:** Prefix sum is one of the most important array preprocessing techniques in competitive programming

2. **Trade-off Understanding:** Sacrifice O(N) space for O(1) query time - a classic space-time tradeoff

3. **Formula Mastery:** `sum[L to R] = prefix[R] - prefix[L-1]` (remember to handle L=0 case)

4. **Performance Gain:** For Q queries, reduces complexity from O(N×Q) to O(N+Q)

5. **Building Pattern:** Each element depends only on previous element: `prefix[i] = prefix[i-1] + A[i]`

6. **Real-world Applications:**
   - Calculating cumulative statistics
   - Financial data analysis (running totals)
   - Image processing (summed area tables)
   - Database query optimization

7. **Interview Strategy:**
   - Always consider prefix sum when you see multiple range queries
   - Mention the preprocessing step clearly
   - Discuss space-time tradeoff
   - Show how to handle L=0 edge case

8. **Common Mistakes:**
   - Forgetting to handle L=0 case
   - Off-by-one errors in range queries
   - Not considering negative numbers
   - Confusing with suffix sum

9. **Extensions:**
   - 2D prefix sum for matrices
   - Prefix XOR for bit problems
   - Prefix product (with handling zeros)
   - Multiple prefix arrays (even/odd indices)

10. **When to Use:**
    - Multiple range sum queries on static array
    - Need to optimize from O(N) per query
    - Can afford O(N) preprocessing time
    - Have O(N) space available

