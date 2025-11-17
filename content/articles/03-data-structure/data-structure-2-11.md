---
title: "Problem - IsPrime"
description: "Master the fundamental concept of prime numbers. Learn efficient algorithms to check if a number is prime, understand the mathematics behind primality testing, and optimize your solution from O(N) to O(√N)."
dateModified: 2025-02-08
datePublished: 2025-02-08
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Number Theory Basics"
    type: "reference"
    url: "https://www.mathsisfun.com/numbers/factors-divisors.html"
    description: "Understanding factors and divisors"
  - title: "Prime Factorization"
    type: "tool"
    url: "https://visualgo.net/en"
    description: "Interactive visualization of number theory concepts"
  - title: "Factor Problems Practice"
    type: "practice"
    url: "https://leetcode.com/tag/math/"
    description: "Practice problems focusing on mathematical algorithms"
  - title: "Scaler Notes - Day 33, 18 Apr - DSA: Introduction to Problem Solving"
    type: "documentation"
    url: "https://res.cloudinary.com/duojkrgue/image/upload/v1761497972/Portfolio/scalerNotes/01-dsa-problem-solving_zudvhj.pdf"
    description: "DSA Mathematical foundations"
--- 

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Problem Statement

Given a positive integer `N`, determine whether it is a **prime number** or not. A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.

**Input:**
- A positive integer `N` (2 ≤ N ≤ 10^9)

**Output:**
- Return `true` if `N` is prime, `false` otherwise


## Examples

### Example 1:
**Input:** `N = 7`  
**Output:** `true`  
**Explanation:** 7 is only divisible by 1 and 7, so it's a prime number.

### Example 2:
**Input:** `N = 12`  
**Output:** `false`  
**Explanation:** 12 is divisible by 1, 2, 3, 4, 6, and 12. Since it has divisors other than 1 and itself, it's not prime.

### Example 3:
**Input:** `N = 2`  
**Output:** `true`  
**Explanation:** 2 is the smallest prime number and the only even prime.


## Constraints

- **Input size:** `2 ≤ N ≤ 10^9`
- **Time limit:** 1-2 seconds
- **Space limit:** O(1) auxiliary space expected


## Important Points to Understand

1. **Definition of Prime:**
   - A number is prime if it has exactly two distinct positive divisors: 1 and itself
   - 1 is NOT a prime number by definition
   - 2 is the only even prime number

2. **Divisibility Pattern:**
   - If N has a divisor greater than 1, it must have a corresponding divisor less than or equal to √N
   - Example: For N=36, divisors are (1,36), (2,18), (3,12), (4,9), (6,6) - all pairs multiply to 36

3. **Optimization Insight:**
   - We only need to check divisors up to √N
   - If no divisor found up to √N, N is prime

4. **Special Cases:**
   - N = 2 is prime (only even prime)
   - N < 2 is not prime
   - Even numbers (except 2) are always composite


## Approach

### Optimal Approach: Check Divisors up to √N

**Strategy:**
1. Handle edge cases (N < 2, N == 2)
2. Check if N is even (composite if N > 2)
3. Iterate from 3 to √N with step 2 (check odd numbers only)
4. If any number divides N evenly, return false
5. If no divisors found, return true

**Why this works:**
- If N has a factor greater than √N, it must also have a corresponding factor less than √N
- We only need to check up to √N to find all possible factors
- Checking only odd numbers (after checking for even) cuts iterations in half


## Time Complexity

**Optimal Solution:** **O(√N)**
- We iterate from 2 to √N
- For each iteration, we perform a constant-time modulo operation
- Example: For N = 10^9, √N ≈ 31,623 iterations

**Brute Force:** **O(N)**
- Checking all numbers from 2 to N-1
- This is impractical for large values of N


## Space Complexity

**Space:** **O(1)**
- We only use a constant amount of extra space
- No arrays or data structures needed
- Just a few variables for the loop counter


## Dry Run

Let's check if **N = 29** is prime:

**Step-by-step execution:**

```
N = 29
√29 ≈ 5.385

Check i = 2: 29 % 2 = 1 (not divisible)
Check i = 3: 29 % 3 = 2 (not divisible)
Check i = 4: 29 % 4 = 1 (not divisible)
Check i = 5: 29 % 5 = 4 (not divisible)

No divisors found up to √29
Therefore, 29 is PRIME
```

Let's check if **N = 35** is prime:

```
N = 35
√35 ≈ 5.916

Check i = 2: 35 % 2 = 1 (not divisible)
Check i = 3: 35 % 3 = 2 (not divisible)
Check i = 4: 35 % 4 = 3 (not divisible)
Check i = 5: 35 % 5 = 0 (DIVISIBLE! ✗)

Found a divisor (5)
Therefore, 35 is NOT PRIME (35 = 5 × 7)
```


## Brute Force Approach

**Naive Solution:** Check all numbers from 2 to N-1

```javascript
function isPrimeBruteForce(N) {
    if (N < 2) return false;
    
    // Check every number from 2 to N-1
    for (let i = 2; i < N; i++) {
        if (N % i === 0) {
            return false; // Found a divisor
        }
    }
    
    return true; // No divisors found
}

console.log(isPrimeBruteForce(29)); // true
console.log(isPrimeBruteForce(35)); // false
```

**Problems with this approach:**
- **Time Complexity:** O(N) - Very slow for large numbers
- For N = 10^9, this would take ~1 billion operations
- Completely impractical for large values


## Visualization

### Prime Number Pattern:

```
Number Line: 2  3  4  5  6  7  8  9  10  11  12  13  14  15  16  17  18  19  20
Prime?       ✓  ✓  ✗  ✓  ✗  ✓  ✗  ✗  ✗   ✓   ✗   ✓   ✗   ✗   ✗   ✓   ✗   ✓   ✗
```

### Checking N = 36:

```
Check up to √36 = 6:

36 % 2 = 0  ✗ (Divisible by 2)
   ↓
NOT PRIME (No need to check further)

Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36
Factor pairs: (1,36), (2,18), (3,12), (4,9), (6,6)
              └─── All pairs have at least one factor ≤ √36
```


## Multiple Optimized Approaches

### Approach 1: Basic √N Optimization

```javascript
function isPrime(N) {
    if (N < 2) return false;
    if (N === 2) return true;
    if (N % 2 === 0) return false;
    
    const sqrt = Math.sqrt(N);
    for (let i = 3; i <= sqrt; i += 2) {
        if (N % i === 0) {
            return false;
        }
    }
    
    return true;
}

console.log(isPrime(29)); // true
console.log(isPrime(35)); // false
console.log(isPrime(2));  // true
```

**Time Complexity:** O(√N)  
**Space Complexity:** O(1)

### Approach 2: Check up to √N without computing square root

```javascript
function isPrimeNoSqrt(N) {
    if (N < 2) return false;
    if (N === 2) return true;
    if (N % 2 === 0) return false;
    
    // Check i * i <= N instead of i <= √N
    for (let i = 3; i * i <= N; i += 2) {
        if (N % i === 0) {
            return false;
        }
    }
    
    return true;
}

console.log(isPrimeNoSqrt(29)); // true
console.log(isPrimeNoSqrt(35)); // false
```

**Advantage:** Avoids floating-point operations  
**Time Complexity:** O(√N)  
**Space Complexity:** O(1)

### Approach 3: Further Optimization - Check 6k±1 Pattern

**Insight:** All primes > 3 are of the form 6k ± 1

```javascript
function isPrimeOptimized(N) {
    if (N <= 1) return false;
    if (N <= 3) return true;
    if (N % 2 === 0 || N % 3 === 0) return false;
    
    // All primes > 3 are of form 6k ± 1
    // Check numbers of form 6k-1 and 6k+1
    for (let i = 5; i * i <= N; i += 6) {
        if (N % i === 0 || N % (i + 2) === 0) {
            return false;
        }
    }
    
    return true;
}

console.log(isPrimeOptimized(29)); // true
console.log(isPrimeOptimized(97)); // true
console.log(isPrimeOptimized(100)); // false
```

**Explanation:**
- After checking for 2 and 3, we only need to check numbers of form 6k±1
- This reduces checks by ~33% compared to checking all odd numbers
- **Time Complexity:** O(√N) but with fewer constant factor operations


## Edge Cases to Consider

1. **N = 1:**
   - Input: `N = 1`
   - Output: `false`
   - 1 is not considered prime by mathematical definition

2. **N = 2:**
   - Input: `N = 2`
   - Output: `true`
   - 2 is the only even prime number

3. **Large Prime Numbers:**
   - Input: `N = 1000000007`
   - Output: `true`
   - Must handle large numbers efficiently

4. **Perfect Squares:**
   - Input: `N = 49` (7 × 7)
   - Output: `false`
   - Ensure we check the square root value itself

5. **Small Primes:**
   - Input: `N = 3`
   - Output: `true`


## JavaScript Code

```javascript
/**
 * Check if a number is prime - Optimized Solution
 * Time Complexity: O(√N)
 * Space Complexity: O(1)
 */
function isPrime(N) {
    // Handle edge cases
    if (N < 2) return false;
    if (N === 2 || N === 3) return true;
    if (N % 2 === 0 || N % 3 === 0) return false;
    
    // Check for divisors of form 6k ± 1 up to √N
    for (let i = 5; i * i <= N; i += 6) {
        if (N % i === 0 || N % (i + 2) === 0) {
            return false;
        }
    }
    
    return true;
}

// Example Usage:
console.log(`Is 2 prime? ${isPrime(2)}`);     // Output: true
console.log(`Is 7 prime? ${isPrime(7)}`);     // Output: true
console.log(`Is 12 prime? ${isPrime(12)}`);   // Output: false
console.log(`Is 29 prime? ${isPrime(29)}`);   // Output: true
console.log(`Is 100 prime? ${isPrime(100)}`); // Output: false
console.log(`Is 97 prime? ${isPrime(97)}`);   // Output: true

// Testing edge cases
console.log(`Is 1 prime? ${isPrime(1)}`);     // Output: false
console.log(`Is 2 prime? ${isPrime(2)}`);     // Output: true

// Large prime
console.log(`Is 1000000007 prime? ${isPrime(1000000007)}`); // Output: true
```


## Key Takeaways

1. **Prime Definition:** A number is prime if it has exactly two divisors: 1 and itself

2. **√N Optimization:** Only check divisors up to √N for efficient primality testing

3. **Special Cases Matter:** Handle 2 (only even prime) and numbers < 2 separately

4. **Further Optimization:** Use 6k±1 pattern to check even fewer numbers

5. **Time vs Space:** Achieve O(√N) time with O(1) space for optimal solution

6. **Practical Application:** Essential for cryptography, hashing, and number theory

7. **Avoid Floating Point:** Use `i * i <= N` instead of `i <= Math.sqrt(N)` for precision

8. **Mathematical Foundation:** Understanding number theory properties leads to better algorithms

