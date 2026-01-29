---
title: "Implement Power Function using Recursion"
description: "Implement power function (A^B % C) using recursion. Learn modular exponentiation, master divide-and-conquer optimization, and understand how to reduce O(N) to O(log N) using recursive techniques."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Modular Arithmetic"
    type: "article"
    url: "https://www.khanacademy.org/computing/computer-science/cryptography/modarithmetic"
    description: "Understanding modular exponentiation"
  - title: "Power Function Visualization"
    type: "tool"
    url: "https://visualgo.net/en/recursion"
    description: "Visualize power calculation"
---


![Recursion Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Calculate (A^B) % C Using Recursion with Modular Exponentiation

## 2. Problem Statement

Implement `pow(A, B) % C`. In other words, given **A**, **B** and **C**, find **(A^B % C)**.

**Note:** The remainders on division cannot be negative. In other words, make sure the answer you return is non-negative.

**Input:**
- Three integers: A (base), B (exponent), C (modulo)
- 1 ≤ A, B, C ≤ 10^9

**Output:**
- Return (A^B) % C

## 3. Examples

### Example 1:
```
Input: A = 2, B = 3, C = 3
Output: 2
Explanation: 2^3 = 8, 8 % 3 = 2
```

### Example 2:
```
Input: A = 3, B = 4, C = 5
Output: 1
Explanation: 3^4 = 81, 81 % 5 = 1
```

### Example 3:
```
Input: A = 5, B = 0, C = 7
Output: 1
Explanation: 5^0 = 1, 1 % 7 = 1
```

### Example 4:
```
Input: A = 2, B = 10, C = 1000
Output: 24
Explanation: 2^10 = 1024, 1024 % 1000 = 24
```

## 4. Constraints

- `1 ≤ A, B, C ≤ 10^9`
- Must use recursion
- Use modular arithmetic
- Handle large numbers
- Result must be non-negative

## 5. Important Points

### Modular Exponentiation

**Key Properties:**
```
(a * b) % c = ((a % c) * (b % c)) % c
(a^b) % c = ((a % c)^b) % c
```

**Optimization - Binary Exponentiation:**
```
A^B = (A^(B/2))^2        if B is even
A^B = A * A^(B-1)        if B is odd
```

This reduces O(B) to O(log B)!

## 6. Brute Force Approach

Multiply A by itself B times, then take modulo.

## 7. Brute Force Code

```javascript
function powerBruteForce(A, B, C) {
    let result = 1;
    for (let i = 0; i < B; i++) {
        result = (result * A) % C;
    }
    return result;
}

console.log(powerBruteForce(2, 3, 3)); // 2
```

## 8. Dry Run of Brute Force

```
Input: A=2, B=3, C=3

Iteration 1: result = (1 * 2) % 3 = 2
Iteration 2: result = (2 * 2) % 3 = 1  
Iteration 3: result = (1 * 2) % 3 = 2

Output: 2
```

## 9. Time and Space Complexity of Brute Force

- **Time:** O(B) - B multiplications
- **Space:** O(1) - constant space

**Problem:** Too slow for large B (B can be 10^9)!

## 10. Visualization (Brute Force)

```
2^3 % 3:
1 → 2 → 4 → 8
    ↓   ↓   ↓
    2%3 1%3 2%3
    
Result: 2
```

## 11. Optimized Approach Description

Use **Binary Exponentiation** (also called Exponentiation by Squaring):

**Idea:**
```
A^8 = ((A^2)^2)^2  (3 multiplications instead of 7!)

A^B = (A^(B/2))^2              if B is even
A^B = A × A^(B-1)              if B is odd
```

This reduces time from O(B) to O(log B)!

## 12. Optimized Approach Algorithm

1. **Base cases:**
   - If B = 0, return 1
   - If B = 1, return A % C

2. **Recursive case:**
   - Calculate half = power(A, B/2, C)
   - If B is even: return (half * half) % C
   - If B is odd: return (A * half * half) % C

3. **Handle negatives:**
   - Ensure result ≥ 0: (result % C + C) % C

## 13. Optimized Code

```javascript
/**
 * Calculate (A^B) % C using binary exponentiation
 * @param {number} A - Base
 * @param {number} B - Exponent
 * @param {number} C - Modulo
 * @returns {number} - (A^B) % C
 */
function power(A, B, C) {
    // Base case
    if (B === 0) {
        return 1 % C;
    }
    
    // Handle negative base
    A = ((A % C) + C) % C;
    
    // Recursive case
    const half = power(A, Math.floor(B / 2), C);
    const halfSquared = (half * half) % C;
    
    // If B is odd, multiply by A once more
    if (B % 2 === 1) {
        return (A * halfSquared) % C;
    }
    
    return halfSquared;
}

// Test cases
console.log(power(2, 3, 3));    // 2
console.log(power(3, 4, 5));    // 1
console.log(power(2, 10, 1000)); // 24
```

### Cleaner Version

```javascript
function powerMod(A, B, C) {
    if (B === 0) return 1;
    
    A = ((A % C) + C) % C;
    const half = powerMod(A, Math.floor(B / 2), C);
    const result = (half * half) % C;
    
    return B % 2 === 0 ? result : (A * result) % C;
}
```

## 14. Dry Run of Optimized Approach

```
power(2, 10, 1000):

Call 1: power(2, 10, 1000)
  B=10 (even)
  half = power(2, 5, 1000)
  
Call 2: power(2, 5, 1000)
  B=5 (odd)
  half = power(2, 2, 1000)
  
Call 3: power(2, 2, 1000)
  B=2 (even)
  half = power(2, 1, 1000)
  
Call 4: power(2, 1, 1000)
  B=1 (odd)
  half = power(2, 0, 1000)
  
Call 5: power(2, 0, 1000)
  B=0, BASE CASE
  Return: 1

Unwinding:
Call 4: half=1, B=1 (odd)
  result = (1 * 1) % 1000 = 1
  return (2 * 1) % 1000 = 2

Call 3: half=2, B=2 (even)
  result = (2 * 2) % 1000 = 4
  return 4

Call 2: half=4, B=5 (odd)
  result = (4 * 4) % 1000 = 16
  return (2 * 16) % 1000 = 32

Call 1: half=32, B=10 (even)
  result = (32 * 32) % 1000 = 24
  return 24

Final Answer: 24 ✓
```

## 15. Time and Space Complexity

- **Time:** O(log B) - divide B by 2 each time
- **Space:** O(log B) - recursion depth

**Improvement:** O(B) → O(log B)!

For B = 10^9:
- Brute force: ~1 billion operations
- Optimized: ~30 operations!

## 16. Visualization

```
Binary Exponentiation for 2^10:

2^10 = (2^5)^2
     = ((2^2) × 2)^2
     = (((2^1)^2) × 2)^2
     = ((2^2) × 2)^2
     = (4 × 2)^2
     = 32^2
     = 1024

Recursion Tree:
         power(2, 10)
              ↓
         power(2, 5)
              ↓
         power(2, 2)
              ↓
         power(2, 1)
              ↓
         power(2, 0) = 1

Height: log₂(10) ≈ 3.3 → 4 calls
```

## 17. Edge Cases

### Zero Exponent
```javascript
power(5, 0, 7); // 1 (anything^0 = 1)
```

### Exponent of 1
```javascript
power(5, 1, 7); // 5
```

### Large Numbers
```javascript
power(999999999, 999999999, 1000000007);
// Handles efficiently!
```

### Negative Base
```javascript
power(-3, 4, 5);
// Should handle: (-3)^4 = 81, 81 % 5 = 1
```

## 18. Key Takeaways

### a. Applications
- Cryptography (RSA encryption)
- Hashing algorithms
- Random number generation
- Competitive programming
- Modular arithmetic

### b. Interview Strategy
- Explain binary exponentiation
- Show recursion tree
- Discuss O(log B) vs O(B)
- Handle overflow with modulo

### c. Common Mistakes
- Not handling negative base
- Forgetting modulo at each step
- Wrong odd/even handling
- Integer overflow

### d. Related Problems
- Matrix exponentiation
- Fast Fibonacci (matrix method)
- Modular inverse
- Fermat's little theorem

### e. Performance
- Brute force: O(B), impractical for large B
- Optimized: O(log B), handles B = 10^9

## Summary

Binary exponentiation is a **powerful optimization** technique!

✅ **O(log B) instead of O(B):** Exponential speedup  
✅ **Divide and Conquer:** Classic recursive pattern  
✅ **Real-World Use:** Cryptography and beyond  

Happy Coding! 🚀

