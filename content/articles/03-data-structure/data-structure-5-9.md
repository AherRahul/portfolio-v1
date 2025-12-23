---
title: "Problem - Product array puzzle"
description: "Solve the product array puzzle using prefix and suffix product technique. Learn to build product arrays without division and master the advanced application of prefix technique."
dateModified: 2025-02-08
datePublished: 2025-02-08
topics:
  - data-structures
courseName: 03-data-structure
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Problem Statement

Given an array `arr[]` of `N` integers, construct a **Product Array** `prod[]` (of the same size) such that `prod[i]` is equal to the product of all the elements of `arr[]` except `arr[i]`.

**Important:** Solve this problem **without using the division operator**.

**Input:**
- An integer array `arr[]` of size `N`
- `1 ≤ N ≤ 10^5`
- `-100 ≤ arr[i] ≤ 100`

**Output:**
- Return an array `prod[]` where `prod[i] = product of all elements except arr[i]`


## Examples

### Example 1:
**Input:** `arr = [10, 3, 5, 6, 2]`  
**Output:** `prod = [180, 600, 360, 300, 900]`

**Explanation:**
```
prod[0] = 3 × 5 × 6 × 2 = 180
prod[1] = 10 × 5 × 6 × 2 = 600
prod[2] = 10 × 3 × 6 × 2 = 360
prod[3] = 10 × 3 × 5 × 2 = 300
prod[4] = 10 × 3 × 5 × 6 = 900
```

### Example 2:
**Input:** `arr = [1, 2, 3, 4, 5]`  
**Output:** `prod = [120, 60, 40, 30, 24]`

**Explanation:**
```
prod[0] = 2 × 3 × 4 × 5 = 120
prod[1] = 1 × 3 × 4 × 5 = 60
prod[2] = 1 × 2 × 4 × 5 = 40
prod[3] = 1 × 2 × 3 × 5 = 30
prod[4] = 1 × 2 × 3 × 4 = 24
```

### Example 3:
**Input:** `arr = [5, 2]`  
**Output:** `prod = [2, 5]`

**Explanation:**
```
prod[0] = 2
prod[1] = 5
```


## Constraints

- **Array size:** `1 ≤ N ≤ 10^5`
- **Element range:** `-100 ≤ arr[i] ≤ 100`
- **Special constraint:** Cannot use division operator
- **Time limit:** O(N) solution required
- **Space optimization:** O(1) extra space (excluding output array) preferred


## Important Points to Understand

1. **Why No Division?**
   - The simple approach would be: calculate total product, then divide by each element
   - But this fails when:
     - Array contains zeros
     - Division by zero errors
     - Precision issues with floating-point division
   - The problem tests understanding of prefix/suffix products

2. **Product Breakdown:**
   - For any index `i`, `prod[i]` = (product of all elements before i) × (product of all elements after i)
   - This is the core insight for the optimal solution

3. **Prefix and Suffix Concept:**
   - **Prefix Product at i:** Product of all elements from index 0 to i-1
   - **Suffix Product at i:** Product of all elements from index i+1 to N-1
   - `prod[i] = prefix[i] × suffix[i]`

4. **Zero Handling:**
   - If array has one zero: only that position gets non-zero product
   - If array has multiple zeros: all products become zero
   - Division approach fails here; prefix/suffix handles naturally


## Approach

### Optimal Approach: Prefix and Suffix Products

**Strategy:**
1. Create a left product array storing cumulative product from left
2. Create a right product array storing cumulative product from right
3. Multiply corresponding left and right products for each position
4. Space optimization: Use output array itself to avoid extra arrays

**Algorithm Steps:**
1. Initialize result array with all 1s
2. **Left pass:** Calculate prefix products and store in result
3. **Right pass:** Calculate suffix products and multiply with result
4. Return the result array


## Time Complexity

**Optimal Solution:** **O(N)**
- Two passes through the array:
  - First pass: Calculate prefix products → O(N)
  - Second pass: Calculate suffix products → O(N)
- Total: O(N) + O(N) = O(N)

**Brute Force:** **O(N²)**
- For each element, calculate product of all other elements
- Nested loops: outer loop N times, inner loop N-1 times


## Space Complexity

**With Extra Arrays:** **O(N)**
- Left array: O(N)
- Right array: O(N)
- Result array: O(N)

**Space Optimized:** **O(1)** auxiliary space
- Use result array itself to store intermediate results
- Only a few variables for tracking


## Dry Run

Let's trace through **arr = [2, 3, 4, 5]**:

### Step 1: Calculate Prefix Products (Left to Right)

```
Initial: result = [1, 1, 1, 1]

i=0: result[0] = 1 (no elements before)
i=1: result[1] = 2 (product of elements before: 2)
i=2: result[2] = 2×3 = 6 (product of elements before: 2,3)
i=3: result[3] = 2×3×4 = 24 (product of elements before: 2,3,4)

After left pass: result = [1, 2, 6, 24]
```

### Step 2: Calculate Suffix Products (Right to Left)

```
right = 1 (start from rightmost)

i=3: result[3] = 24 × 1 = 24, right = 5
i=2: result[2] = 6 × 5 = 30, right = 5×4 = 20
i=1: result[1] = 2 × 20 = 40, right = 20×3 = 60
i=0: result[0] = 1 × 60 = 60, right = 60×2 = 120

Final: result = [60, 40, 30, 24]
```

### Verification:
```
arr[0]=2: 3×4×5 = 60 ✓
arr[1]=3: 2×4×5 = 40 ✓
arr[2]=4: 2×3×5 = 30 ✓
arr[3]=5: 2×3×4 = 24 ✓
```


## Brute Force Approach

**Naive Solution:** Calculate product for each position separately

```javascript
function productExceptSelfBruteForce(arr) {
    const N = arr.length;
    const result = new Array(N);
    
    // For each position
    for (let i = 0; i < N; i++) {
        let product = 1;
        
        // Multiply all elements except arr[i]
        for (let j = 0; j < N; j++) {
            if (i !== j) {
                product *= arr[j];
            }
        }
        
        result[i] = product;
    }
    
    return result;
}

console.log(productExceptSelfBruteForce([1, 2, 3, 4])); 
// Output: [24, 12, 8, 6]
```

**Problems:**
- **Time Complexity:** O(N²) - nested loops
- **Inefficient:** Recalculates products multiple times
- **Not scalable:** Too slow for large arrays


## Visualization

### Product Breakdown for arr = [2, 3, 4, 5]:

```
Index 0: result[0] = [1] × 3 × 4 × 5 = 60
                     ↑     ↑_______↑
                   prefix    suffix

Index 1: result[1] = 2 × [1] × 4 × 5 = 40
                     ↑     ↑     ↑___↑
                  prefix  curr  suffix

Index 2: result[2] = 2 × 3 × [1] × 5 = 30
                     ↑___↑     ↑     ↑
                    prefix   curr  suffix

Index 3: result[3] = 2 × 3 × 4 × [1] = 24
                     ↑___________↑   ↑
                       prefix      suffix
```

### Two-Pass Strategy:

```
Original Array:  [2,  3,  4,  5]

Left Pass:
  prefix[0] = 1          (nothing before 0)
  prefix[1] = 2          (2)
  prefix[2] = 2×3 = 6    (2,3)
  prefix[3] = 2×3×4 = 24 (2,3,4)

Right Pass:
  suffix[3] = 1          (nothing after 3)
  suffix[2] = 5          (5)
  suffix[1] = 4×5 = 20   (4,5)
  suffix[0] = 3×4×5 = 60 (3,4,5)

Result[i] = prefix[i] × suffix[i]:
  result[0] = 1 × 60 = 60
  result[1] = 2 × 20 = 40
  result[2] = 6 × 5 = 30
  result[3] = 24 × 1 = 24

Final: [60, 40, 30, 24]
```


## Multiple Optimized Approaches

### Approach 1: Using Extra Space (Clearer Logic)

```javascript
function productExceptSelf(arr) {
    const N = arr.length;
    
    // Create prefix and suffix arrays
    const prefix = new Array(N);
    const suffix = new Array(N);
    const result = new Array(N);
    
    // Build prefix products
    prefix[0] = 1;
    for (let i = 1; i < N; i++) {
        prefix[i] = prefix[i-1] * arr[i-1];
    }
    
    // Build suffix products
    suffix[N-1] = 1;
    for (let i = N-2; i >= 0; i--) {
        suffix[i] = suffix[i+1] * arr[i+1];
    }
    
    // Multiply prefix and suffix
    for (let i = 0; i < N; i++) {
        result[i] = prefix[i] * suffix[i];
    }
    
    return result;
}

console.log(productExceptSelf([1, 2, 3, 4])); 
// Output: [24, 12, 8, 6]
```

**Time Complexity:** O(N)  
**Space Complexity:** O(N) - uses extra arrays

### Approach 2: Space Optimized (In-Place)

```javascript
function productExceptSelfOptimized(arr) {
    const N = arr.length;
    const result = new Array(N).fill(1);
    
    // Calculate prefix products and store in result
    let prefix = 1;
    for (let i = 0; i < N; i++) {
        result[i] = prefix;
        prefix *= arr[i];
    }
    
    // Calculate suffix products and multiply with result
    let suffix = 1;
    for (let i = N - 1; i >= 0; i--) {
        result[i] *= suffix;
        suffix *= arr[i];
    }
    
    return result;
}

console.log(productExceptSelfOptimized([1, 2, 3, 4, 5])); 
// Output: [120, 60, 40, 30, 24]
```

**Time Complexity:** O(N)  
**Space Complexity:** O(1) auxiliary space (excluding output)

### Approach 3: Handling Zeros (Robust Solution)

```javascript
function productExceptSelfWithZeros(arr) {
    const N = arr.length;
    const result = new Array(N).fill(0);
    
    // Count zeros
    let zeroCount = 0;
    let zeroIndex = -1;
    for (let i = 0; i < N; i++) {
        if (arr[i] === 0) {
            zeroCount++;
            zeroIndex = i;
        }
    }
    
    // If more than one zero, all products are zero
    if (zeroCount > 1) {
        return result;
    }
    
    // If exactly one zero
    if (zeroCount === 1) {
        let product = 1;
        for (let i = 0; i < N; i++) {
            if (i !== zeroIndex) {
                product *= arr[i];
            }
        }
        result[zeroIndex] = product;
        return result;
    }
    
    // No zeros - use standard approach
    let prefix = 1;
    for (let i = 0; i < N; i++) {
        result[i] = prefix;
        prefix *= arr[i];
    }
    
    let suffix = 1;
    for (let i = N - 1; i >= 0; i--) {
        result[i] *= suffix;
        suffix *= arr[i];
    }
    
    return result;
}

console.log(productExceptSelfWithZeros([1, 2, 0, 4])); 
// Output: [0, 0, 8, 0]
```


## Edge Cases to Consider

1. **Array with Single Element:**
   - Input: `arr = [5]`
   - Output: `[1]`
   - No other elements to multiply

2. **Array with Zeros:**
   - Input: `arr = [1, 0, 3]`
   - Output: `[0, 3, 0]`
   - Only the zero position gets non-zero product

3. **Multiple Zeros:**
   - Input: `arr = [0, 0, 2]`
   - Output: `[0, 0, 0]`
   - All products become zero

4. **All Ones:**
   - Input: `arr = [1, 1, 1, 1]`
   - Output: `[1, 1, 1, 1]`
   - Product remains 1

5. **Negative Numbers:**
   - Input: `arr = [-1, 2, -3, 4]`
   - Output: `[-24, 12, -8, 6]`
   - Handle sign correctly

6. **Large Products:**
   - Input: `arr = [100, 100, 100]`
   - Output: `[10000, 10000, 10000]`
   - Watch for integer overflow in some languages


## JavaScript Code

```javascript
/**
 * Product Array Puzzle - Optimal Solution
 * Time Complexity: O(N)
 * Space Complexity: O(1) auxiliary space
 */
function productExceptSelf(arr) {
    const N = arr.length;
    const result = new Array(N).fill(1);
    
    // Step 1: Calculate prefix products (left to right)
    // result[i] = product of all elements before i
    let prefix = 1;
    for (let i = 0; i < N; i++) {
        result[i] = prefix;
        prefix *= arr[i];
    }
    
    // Step 2: Calculate suffix products (right to left)
    // Multiply result[i] with product of all elements after i
    let suffix = 1;
    for (let i = N - 1; i >= 0; i--) {
        result[i] *= suffix;
        suffix *= arr[i];
    }
    
    return result;
}

// Example Usage:
const arr1 = [10, 3, 5, 6, 2];
console.log(`Input: [${arr1}]`);
console.log(`Output: [${productExceptSelf(arr1)}]`);
// Output: [180, 600, 360, 300, 900]

const arr2 = [1, 2, 3, 4, 5];
console.log(`\nInput: [${arr2}]`);
console.log(`Output: [${productExceptSelf(arr2)}]`);
// Output: [120, 60, 40, 30, 24]

// Edge case: Array with zero
const arr3 = [1, 0, 3, 4];
console.log(`\nInput: [${arr3}]`);
console.log(`Output: [${productExceptSelf(arr3)}]`);
// Output: [0, 12, 0, 0]

// Edge case: Negative numbers
const arr4 = [-1, 2, -3, 4];
console.log(`\nInput: [${arr4}]`);
console.log(`Output: [${productExceptSelf(arr4)}]`);
// Output: [-24, 12, -8, 6]
```


## Key Takeaways

1. **Prefix-Suffix Pattern:** This problem is a classic application of the prefix-suffix technique

2. **No Division Needed:** The constraint teaches us to think beyond simple solutions

3. **Two-Pass Strategy:** One left-to-right pass for prefix, one right-to-left for suffix

4. **Space Optimization:** Use output array itself to avoid extra space

5. **Zero Handling:** Prefix-suffix approach naturally handles zeros without special cases

6. **Time Efficiency:** O(N) solution achieved through intelligent preprocessing

7. **Common Interview Problem:** Frequently asked in coding interviews (Amazon, Google, Microsoft)

8. **Generalizable Pattern:** This technique applies to many "all except self" problems

9. **In-Place Computation:** Shows how to optimize space by reusing output array

10. **Mathematical Insight:** Understanding that `product[i] = left_product × right_product` is key

