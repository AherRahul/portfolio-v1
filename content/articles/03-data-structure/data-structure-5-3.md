---
title: "In-place Prefix Sum"
description: "Learn to build prefix sum arrays in-place without using extra space. Master space-optimized prefix sum technique."
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
    description: "Complete guide to prefix sum arrays"
  - title: "Array Manipulation Visualization"
    type: "tool"
    url: "https://visualgo.net/en/array"
    description: "Visualize array operations"
  - title: "Practice Prefix Sum Problems"
    type: "practice"
    url: "https://leetcode.com/tag/prefix-sum/"
    description: "Practice problems on prefix sum technique"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

In-place Prefix Sum
----------------------------

### Problem Statement:

Given an array `A` of size `N`, modify the array **in-place** to create a prefix sum array where each element `A[i]` contains the sum of all elements from index 0 to i.

You must solve this problem without using any extra space (O(1) space complexity).

### Examples:

#### Example 1:

**Input:** A = [1, 2, 3, 4, 5]

**Output:** [1, 3, 6, 10, 15]

**Explanation:**
* A[0] = 1 (remains same)
* A[1] = 1 + 2 = 3
* A[2] = 1 + 2 + 3 = 6  
* A[3] = 1 + 2 + 3 + 4 = 10
* A[4] = 1 + 2 + 3 + 4 + 5 = 15

#### Example 2:

**Input:** A = [2, -1, 3, -4, 5]

**Output:** [2, 1, 4, 0, 5]

**Explanation:**
* A[0] = 2
* A[1] = 2 + (-1) = 1
* A[2] = 2 + (-1) + 3 = 4
* A[3] = 2 + (-1) + 3 + (-4) = 0
* A[4] = 2 + (-1) + 3 + (-4) + 5 = 5

### Constraints:

* `1 ≤ N ≤ 10^5`
* `-10^9 ≤ A[i] ≤ 10^9`
* Must modify the array in-place (O(1) extra space)

### Important Points to Understand:

1. **In-place modification:** We update the original array itself, no extra array needed
2. **Left-to-right traversal:** Process elements from index 1 to N-1
3. **Current element dependency:** Each A[i] depends only on A[i-1] (already computed) and original A[i]
4. **Space optimization:** Trading the ability to access original values for O(1) space
5. **Formula:** `A[i] = A[i-1] + A[i]` for all i from 1 to N-1

### Approach:

**Step 1:** Keep A[0] as is (it's already the prefix sum for index 0)

**Step 2:** Iterate from index 1 to N-1:
  - Add previous element to current: `A[i] = A[i-1] + A[i]`
  
**Step 3:** Array is now modified to contain prefix sums

### Time Complexity:

* **Time Complexity: O(N)** - Single pass through the array
* **Space Complexity: O(1)** - No extra space used, only modifying input array in-place

### Space Complexity:

* **O(1)** - Only using a loop variable, no additional data structures

### Dry Run:

```
Input: A = [3, 1, 2, 4]

Initial state: [3, 1, 2, 4]

Step 1: i = 1
  A[1] = A[0] + A[1] = 3 + 1 = 4
  Array: [3, 4, 2, 4]

Step 2: i = 2
  A[2] = A[1] + A[2] = 4 + 2 = 6
  Array: [3, 4, 6, 4]

Step 3: i = 3
  A[3] = A[2] + A[3] = 6 + 4 = 10
  Array: [3, 4, 6, 10]

Final Output: [3, 4, 6, 10]
```

### Brute Force Approach:

**Approach:** Create a new array and compute each prefix sum from scratch.

**Algorithm:**
1. Create new array `prefix` of size N
2. For each index i (0 to N-1):
   - Sum elements from 0 to i
   - Store in prefix[i]
3. Copy prefix array back to A

**Time Complexity:** O(N²) - Nested loops
**Space Complexity:** O(N) - Extra array needed

**Why it's not optimal:**
- Recalculates sums repeatedly
- Uses extra space
- Much slower for large arrays

### Visualization:

```
Original Array:     [3,    1,    2,    4]
                     ↓
Step 1 (i=1):      [3,    4,    2,    4]
                     ↑-----|
                     
Step 2 (i=2):      [3,    4,    6,    4]
                           ↑-----|
                           
Step 3 (i=3):      [3,    4,    6,   10]
                                 ↑-----|
                                 
Prefix Sum Result: [3,    4,    6,   10]

Formula at each step: A[i] = A[i-1] + A[i]
```

### Multiple Optimized Approaches:

#### Approach 1: In-place Modification (Optimal - Current Solution)
**Time: O(N), Space: O(1)**
```javascript
function inplacePrefixSum(A) {
    for (let i = 1; i < A.length; i++) {
        A[i] = A[i-1] + A[i];
    }
    return A;
}
```
**Pros:** Minimal space, simple implementation
**Cons:** Destroys original array

#### Approach 2: Using Extra Array
**Time: O(N), Space: O(N)**
```javascript
function prefixSumWithExtraSpace(A) {
    const prefix = [A[0]];
    for (let i = 1; i < A.length; i++) {
        prefix[i] = prefix[i-1] + A[i];
    }
    return prefix;
}
```
**Pros:** Preserves original array
**Cons:** Uses O(N) extra space

#### Approach 3: Functional Programming Style
**Time: O(N), Space: O(N)**
```javascript
function prefixSumFunctional(A) {
    return A.reduce((acc, curr) => {
        acc.push((acc[acc.length-1] || 0) + curr);
        return acc;
    }, []);
}
```
**Pros:** Declarative, clean code
**Cons:** Less efficient, uses extra space

### Edge Cases to Consider:

1. **Single Element Array:**
   - Input: [5]
   - Output: [5]
   - The element remains unchanged

2. **All Zeros:**
   - Input: [0, 0, 0, 0]
   - Output: [0, 0, 0, 0]
   - All prefix sums are 0

3. **Negative Numbers:**
   - Input: [-1, -2, -3]
   - Output: [-1, -3, -6]
   - Prefix sum decreases

4. **Mixed Positive and Negative:**
   - Input: [5, -3, 2, -1]
   - Output: [5, 2, 4, 3]
   - Sum can increase or decrease

5. **Large Numbers:**
   - Input: [10^9, 10^9]
   - Consider integer overflow in some languages
   - JavaScript handles with Number type

6. **Alternating Signs:**
   - Input: [1, -1, 1, -1]
   - Output: [1, 0, 1, 0]
   - Sum oscillates

### JavaScript Code:

```javascript
function inplacePrefixSum(A) {
    const N = A.length;
    
    // Start from index 1 since A[0] is already its own prefix sum
    for (let i = 1; i < N; i++) {
        A[i] = A[i-1] + A[i];
    }
    
    return A;
}

// Example usage:
const arr1 = [1, 2, 3, 4, 5];
console.log(inplacePrefixSum(arr1)); // [1, 3, 6, 10, 15]

const arr2 = [2, -1, 3, -4, 5];
console.log(inplacePrefixSum(arr2)); // [2, 1, 4, 0, 5]
```

### Key Takeaways:

1. **In-place modification** achieves O(1) space complexity - critical for memory-constrained environments

2. **Dependency pattern:** Each element only depends on previous element, enabling single-pass solution

3. **Trade-off understanding:** Sacrificing original array access for optimal space complexity

4. **Foundation for advanced techniques:** This pattern appears in dynamic programming and optimization problems

5. **Interview importance:** Common follow-up question after regular prefix sum problems

6. **Real-world applications:**
   - Running totals in financial calculations
   - Cumulative statistics in data analysis
   - Memory-efficient range query preprocessing

7. **Common mistakes to avoid:**
   - Starting loop from index 0 instead of 1
   - Not considering negative numbers
   - Forgetting that original array is lost

8. **Performance characteristics:**
   - Single pass: O(N) time
   - No extra allocation: O(1) space
   - Cache-friendly: sequential access pattern

9. **When to use this approach:**
   - Space is limited
   - Original array not needed afterward
   - Simple prefix sum queries required

10. **Related concepts:**
    - Cumulative frequency arrays
    - Running sums
    - Prefix product arrays
    - Difference arrays (inverse operation)

