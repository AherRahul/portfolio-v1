---
title: "Unset x bits from right"
description: "Learn to unset (clear) the rightmost x bits of a number. Master advanced bit manipulation using masks to clear multiple consecutive bits efficiently."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Bit Manipulation Guide"
    type: "reference"
    url: "https://www.geeksforgeeks.org/bits-manipulation-important-tactics/"
    description: "Complete guide to bit manipulation"
  - title: "Bitwise Operations Visualizer"
    type: "tool"
    url: "https://visualgo.net/en/bitmask"
    description: "Visualize bit operations"
  - title: "Bit Manipulation Practice"
    type: "practice"
    url: "https://leetcode.com/tag/bit-manipulation/"
    description: "Practice bit manipulation problems"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Unset x bits from right
----------------------------

### Problem Statement:

Given an integer `N` and a positive integer `x`, unset (turn off/make 0) the rightmost `x` bits of `N`.

**Example:** If N = 29 (binary: 11101) and x = 3, we need to unset the 3 rightmost bits, resulting in 24 (binary: 11000).

### Examples:

#### Example 1:

**Input:** N = 29 (binary: 11101), x = 3

**Output:** 24 (binary: 11000)

**Explanation:** 
- Original: 11101
- Unset rightmost 3 bits: 11000
- Result: 24

#### Example 2:

**Input:** N = 15 (binary: 1111), x = 2

**Output:** 12 (binary: 1100)

**Explanation:**
- Original: 1111
- Unset rightmost 2 bits: 1100
- Result: 12

### Constraints:

* `0 ≤ N ≤ 2^31 - 1`
* `0 ≤ x ≤ 32`
* If x ≥ number of bits in N, result is 0

### Important Points to Understand:

1. **Mask Creation:** Create a mask with x rightmost bits set to 0 and all other bits set to 1
2. **Left Shift:** `(-1 << x)` creates the mask (all 1s shifted left by x positions)
3. **AND Operation:** AND with the mask clears the rightmost x bits
4. **Binary Representation:** Understanding binary is crucial
5. **Edge Case:** When x = 0, no bits are cleared (mask = -1, all 1s)

### Approach:

**Step 1:** Create a mask with rightmost x bits as 0 and remaining bits as 1
- Mask = (-1 << x) or (~0 << x)

**Step 2:** Perform AND operation between N and mask
- Result = N & mask

**Step 3:** Return the result

**Why this works:**
- (-1 << x) creates a binary number with x trailing 0s and all other bits as 1
- AND with N preserves bits where mask is 1, clears bits where mask is 0

### Time Complexity:

* **Time Complexity: O(1)** - Single bitwise operation
* Constant time regardless of input size

### Space Complexity:

* **O(1)** - Only using variables for mask and result
* No additional data structures needed

### Dry Run:

```
Input: N = 29, x = 3

Step 1: Convert to binary
  N = 29 = 11101 (binary)

Step 2: Create mask
  -1 in binary (32-bit) = 11111111111111111111111111111111
  -1 << 3 = 11111111111111111111111111111000
  mask = 11111111111111111111111111111000

Step 3: Perform AND operation
  N =     00000000000000000000000000011101 (29)
  mask =  11111111111111111111111111111000
  ---------------------------------------- AND
  Result: 00000000000000000000000000011000 (24)

Final Output: 24

Verification:
  29 in binary: 11101
  Rightmost 3 bits (101) cleared → 11000
  11000 in decimal = 24 ✓
```

### Brute Force Approach:

**Approach:** Iterate through rightmost x bits and unset each one individually

**Algorithm:**
```javascript
function unsetXBitsBrute(N, x) {
    let result = N;
    for (let i = 0; i < x; i++) {
        result = result & ~(1 << i); // Unset each bit one by one
    }
    return result;
}
```

**Time Complexity:** O(x)
**Space Complexity:** O(1)

**Why it's not optimal:**
- Requires x iterations
- Multiple bitwise operations
- Slower for large x values

### Visualization:

```
Example: N = 29, x = 3

Binary Representation:
N =  1 1 1 0 1  (29)
     ↓ ↓ ↓ ↓ ↓
     K K K X X X  (K = keep, X = clear)

Step 1: Create Mask (-1 << 3)
  -1 = 1 1 1 1 1 1 1 1 ... (all 1s)
  
  Shift left by 3:
  1 1 1 1 1 1 1 1 ... 1 1 1 0 0 0
  └─────────────────┘ └─────┘
    All 1s (keep)    3 zeros

Step 2: AND Operation
       1 1 1 0 1  (29)
  AND  1 1 1 0 0  (mask)
  ──────────────
       1 1 0 0 0  (24)

Result: The rightmost 3 bits are cleared

Another Example: N = 15, x = 2
  N =    1 1 1 1  (15)
  mask = 1 1 0 0  (-1 << 2)
  ───────────────
  Result: 1 1 0 0  (12)
```

### Multiple Optimized Approaches:

#### Approach 1: Using Left Shift and AND (Optimal)
**Time: O(1), Space: O(1)**
```javascript
function unsetXBits(N, x) {
    return N & (-1 << x);
}
```
**Pros:** Single operation, fastest, most efficient
**Cons:** Requires understanding of bit manipulation

#### Approach 2: Using NOT and Mask Creation
**Time: O(1), Space: O(1)**
```javascript
function unsetXBits(N, x) {
    const mask = ~((1 << x) - 1);
    return N & mask;
}
```
**Explanation:**
- `(1 << x)` creates number with bit at position x set
- Subtract 1 to get x ones: `(1 << x) - 1`
- NOT (~) to flip: get mask with rightmost x bits as 0
**Pros:** More intuitive mask creation
**Cons:** Two operations instead of one

#### Approach 3: Division-Multiplication Method
**Time: O(1), Space: O(1)**
```javascript
function unsetXBits(N, x) {
    const divisor = 1 << x; // 2^x
    return (Math.floor(N / divisor)) * divisor;
}
```
**Explanation:** Divide by 2^x and multiply back removes rightmost x bits
**Pros:** Works without bitwise knowledge
**Cons:** Slower, less idiomatic

### Edge Cases to Consider:

1. **x = 0 (No bits to clear):**
   - Input: N = 29, x = 0
   - Output: 29 (unchanged)
   - Mask = (-1 << 0) = -1 (all 1s)

2. **x equals number of bits in N:**
   - Input: N = 15 (1111), x = 4
   - Output: 0
   - All bits cleared

3. **x greater than number of bits:**
   - Input: N = 7 (111), x = 10
   - Output: 0
   - All bits cleared

4. **N = 0:**
   - Input: N = 0, x = any
   - Output: 0
   - No bits to clear

5. **All bits are 1:**
   - Input: N = 255 (11111111), x = 4
   - Output: 240 (11110000)
   - Rightmost 4 bits cleared

6. **Alternating bits:**
   - Input: N = 170 (10101010), x = 3
   - Output: 168 (10101000)
   - Last 3 bits cleared

7. **Large x value:**
   - Input: N = any, x = 32
   - Output: 0 (all bits in 32-bit integer cleared)

### JavaScript Code:

```javascript
// Method 1: Using (-1 << x) - Most efficient
function unsetXBitsFromRight(N, x) {
    // Create mask: -1 << x gives all 1s except rightmost x bits
    const mask = -1 << x;
    
    // AND operation clears rightmost x bits
    return N & mask;
}

// Method 2: Alternative mask creation
function unsetXBitsAlternative(N, x) {
    // (1 << x) - 1 creates x ones
    // NOT (~) flips to get mask with x zeros at right
    const mask = ~((1 << x) - 1);
    return N & mask;
}

// Method 3: Using bit shifting directly
function unsetXBitsShift(N, x) {
    // Shift right by x, then left by x
    // Effectively removes rightmost x bits
    return (N >> x) << x;
}

// Example usage:
console.log(unsetXBitsFromRight(29, 3));  // Output: 24
console.log(unsetXBitsFromRight(15, 2));  // Output: 12
console.log(unsetXBitsFromRight(255, 4)); // Output: 240

// Test with edge cases:
console.log(unsetXBitsFromRight(29, 0));  // Output: 29 (no change)
console.log(unsetXBitsFromRight(7, 10));  // Output: 0 (all cleared)
console.log(unsetXBitsFromRight(0, 5));   // Output: 0
```

### Key Takeaways:

1. **Mask Creation is Key:** Understanding `(-1 << x)` creates a mask with rightmost x bits as 0

2. **Single Operation Efficiency:** Can clear multiple bits in one AND operation

3. **Shift Operation Understanding:** Left shift by x positions effectively adds x zeros at right

4. **Negative Number Representation:** -1 in binary is all 1s (two's complement)

5. **Generalization:** This technique can be extended to unset any group of consecutive bits

6. **Real-world Applications:**
   - Network subnet masking
   - Clearing flag bits in systems programming
   - Memory alignment operations
   - Graphics programming (pixel manipulation)

7. **Bitwise Mastery:**
   - AND with 0 clears bits
   - AND with 1 preserves bits
   - Masks control which bits are affected

8. **Common Mistakes to Avoid:**
   - Using wrong shift direction (right instead of left)
   - Forgetting to handle x = 0 case
   - Not understanding two's complement representation

9. **Performance:** 
   - O(1) time complexity
   - Faster than loop-based approaches
   - No memory allocation needed

10. **Related Operations:**
    - Set x bits from right: `N | ((1 << x) - 1)`
    - Toggle x bits from right: `N ^ ((1 << x) - 1)`
    - Get rightmost x bits: `N & ((1 << x) - 1)`
    - Unset x bits from left: requires knowing total bit count


