---
title: "Find Perfect Numbers"
description: "Discover the fascinating world of perfect numbers. Learn what makes a number 'perfect', understand the mathematical properties, and master efficient algorithms to identify perfect numbers."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Perfect Numbers Explained"
    type: "reference"
    url: "https://www.mathsisfun.com/numbers/perfect-numbers.html"
    description: "Understanding perfect numbers and their properties"
  - title: "Number Theory Fundamentals"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Perfect_number"
    description: "Mathematical background of perfect numbers"
  - title: "Math Problems Practice"
    type: "practice"
    url: "https://leetcode.com/tag/math/"
    description: "Practice number theory problems"
  - title: "Scaler Notes - Day 33, 18 Apr - DSA: Introduction to Problem Solving"
    type: "documentation"
    url: "https://res.cloudinary.com/duojkrgue/image/upload/v1761497972/Portfolio/scalerNotes/01-dsa-problem-solving_zudvhj.pdf"
    description: "DSA Mathematical foundations"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Find Perfect Numbers
----------------------------

### Problem Statement:

Given a positive integer `N`, determine whether `N` is a **perfect number** or not.

A **perfect number** is a positive integer that is equal to the **sum of its proper positive divisors** (excluding the number itself).

In other words, if the sum of all divisors of N (excluding N) equals N, then N is a perfect number.

Return `true` if the number is perfect, otherwise return `false`.

### Examples:

#### Example 1:

**Input:** N = 6

**Output:** true

**Explanation:** 
* Divisors of 6 (excluding 6): 1, 2, 3
* Sum: 1 + 2 + 3 = 6
* Since sum equals N, 6 is a perfect number.

#### Example 2:

**Input:** N = 28

**Output:** true

**Explanation:** 
* Divisors of 28 (excluding 28): 1, 2, 4, 7, 14
* Sum: 1 + 2 + 4 + 7 + 14 = 28
* Since sum equals N, 28 is a perfect number.

#### Example 3:

**Input:** N = 12

**Output:** false

**Explanation:** 
* Divisors of 12 (excluding 12): 1, 2, 3, 4, 6
* Sum: 1 + 2 + 3 + 4 + 6 = 16
* Since 16 ≠ 12, it is not a perfect number.

#### Example 4:

**Input:** N = 496

**Output:** true

**Explanation:** 
* 496 is the third perfect number.
* Divisors: 1, 2, 4, 8, 16, 31, 62, 124, 248
* Sum: 1+2+4+8+16+31+62+124+248 = 496

### Constraints:

* `1 ≤ N ≤ 10^8`
* Input is always a positive integer

### Important Points to Understand:

**1. Perfect Number Definition:**
* Sum of proper divisors (all divisors except the number itself) equals the number.
* Formula: If `divisorSum(N) - N = N`, then N is perfect.
* Alternatively: `divisorSum(N) = 2 × N`

**2. Historical Context:**
* Known since ancient Greek mathematics (Euclid's Elements).
* First few perfect numbers: 6, 28, 496, 8128, 33550336...
* All known perfect numbers are **even** (no odd perfect number has been found).

**3. Mathematical Property (Euclid-Euler Theorem):**
* Every even perfect number has the form: `2^(p-1) × (2^p - 1)`
* Where both p and (2^p - 1) are prime numbers.
* Example: 6 = 2^(2-1) × (2^2 - 1) = 2 × 3

**4. Rarity:**
* Perfect numbers are extremely rare.
* Only 51 perfect numbers are known (as of 2023).
* The largest known has 49,724,095 digits!

**5. Relation to Mersenne Primes:**
* Perfect numbers are related to Mersenne primes.
* Mersenne prime: A prime of the form 2^p - 1.

### Approach:

**Brute Force Approach:**
1. Find all divisors of N from 1 to N-1.
2. Calculate the sum of all these divisors.
3. Check if sum equals N.

**Optimized Approach:**
1. Find all divisors by checking only up to √N.
2. For each divisor i, also add N/i (the pair divisor).
3. Exclude N itself from the sum.
4. Check if sum equals N.

### Time Complexity:

**Brute Force:**
* **Time Complexity = O(N)** - Check every number from 1 to N-1.

**Optimized:**
* **Time Complexity = O(√N)** - Check only up to square root of N.

### Space Complexity:

* **Space Complexity = O(1)** - Use only a few variables.

### Dry Run - Brute Force:

```
Input: N = 6

Step 1: Find divisors from 1 to 5
    i = 1 → 6 % 1 = 0 → divisor → sum = 1
    i = 2 → 6 % 2 = 0 → divisor → sum = 1 + 2 = 3
    i = 3 → 6 % 3 = 0 → divisor → sum = 3 + 3 = 6
    i = 4 → 6 % 4 = 2 → not a divisor
    i = 5 → 6 % 5 = 1 → not a divisor

Step 2: Compare sum with N
    sum = 6
    N = 6
    sum === N → true

Output: true (6 is a perfect number)
```

### Dry Run - Optimized:

```
Input: N = 28, √28 ≈ 5.29

Step 1: Find divisors up to √28
    i = 1 → 28 % 1 = 0
        → Add 1 (divisor)
        → Add 28/1 = 28 (pair divisor, but exclude N)
        → sum = 1
        
    i = 2 → 28 % 2 = 0
        → Add 2 (divisor)
        → Add 28/2 = 14 (pair divisor)
        → sum = 1 + 2 + 14 = 17
        
    i = 3 → 28 % 3 = 1 → not a divisor
    
    i = 4 → 28 % 4 = 0
        → Add 4 (divisor)
        → Add 28/4 = 7 (pair divisor)
        → sum = 17 + 4 + 7 = 28
        
    i = 5 → 28 % 5 = 3 → not a divisor

Step 2: Compare
    sum = 28
    N = 28
    sum === N → true

Output: true (28 is a perfect number)
```

### Brute Force Approach - JavaScript Code:

```javascript
function isPerfectNumberBruteForce(N) {
    if (N <= 1) return false; // 1 is not perfect
    
    let sum = 0;
    
    // Find all divisors from 1 to N-1
    for (let i = 1; i < N; i++) {
        if (N % i === 0) {
            sum += i;
        }
    }
    
    // Check if sum equals N
    return sum === N;
}
```

### Visualization:

```
Example: N = 28

Finding divisors:
28 = 1 × 28
28 = 2 × 14
28 = 4 × 7

Divisor pairs:
(1, 28), (2, 14), (4, 7)

Proper divisors (exclude 28):
1, 2, 4, 7, 14

Sum calculation:
1 + 2 + 4 + 7 + 14 = 28 ✓

Visual representation:
    28
    ├── 1
    ├── 2
    ├── 4
    ├── 7
    └── 14
    
Sum of children = Parent → Perfect! 🌟
```

### Optimized Approach - JavaScript Code:

```javascript
function isPerfectNumber(N) {
    if (N <= 1) return false; // 1 is not perfect
    
    let sum = 1; // 1 is always a divisor
    
    // Check divisors from 2 to √N
    for (let i = 2; i * i <= N; i++) {
        if (N % i === 0) {
            sum += i; // Add the divisor
            
            // Add the pair divisor (N/i) if it's different and not N itself
            if (i !== N / i && N / i !== N) {
                sum += N / i;
            }
        }
    }
    
    return sum === N;
}
```

### Alternative Optimized Approach:

```javascript
function isPerfectNumberAlt(N) {
    if (N <= 1) return false;
    
    let sum = 0;
    const sqrt = Math.sqrt(N);
    
    for (let i = 1; i <= sqrt; i++) {
        if (N % i === 0) {
            sum += i; // Add divisor
            
            // Add pair divisor if different and not N
            const pairDivisor = N / i;
            if (i !== pairDivisor && pairDivisor !== N) {
                sum += pairDivisor;
            }
        }
    }
    
    return sum === N;
}
```

### Using Known Perfect Numbers (Most Optimized):

```javascript
function isPerfectNumberConstant(N) {
    // First 8 perfect numbers (all that fit in typical integer range)
    const knownPerfectNumbers = [
        6,
        28,
        496,
        8128,
        33550336
    ];
    
    return knownPerfectNumbers.includes(N);
}
```

**Note:** This approach works because:
* Perfect numbers are extremely rare.
* For typical constraints (N ≤ 10^8), there are only 4-5 perfect numbers.
* Time Complexity: O(1) for lookup.
* Space Complexity: O(1) for small constant array.

### Mathematical Formula Approach (Euclid-Euler):

```javascript
function generatePerfectNumber(p) {
    // Generate perfect number using Euclid-Euler theorem
    // Perfect number = 2^(p-1) × (2^p - 1)
    // where both p and (2^p - 1) are prime
    
    function isPrime(num) {
        if (num < 2) return false;
        for (let i = 2; i * i <= num; i++) {
            if (num % i === 0) return false;
        }
        return true;
    }
    
    if (!isPrime(p)) return null;
    
    const mersenne = Math.pow(2, p) - 1;
    if (!isPrime(mersenne)) return null;
    
    return Math.pow(2, p - 1) * mersenne;
}

// Generate first few perfect numbers
console.log(generatePerfectNumber(2));  // 6
console.log(generatePerfectNumber(3));  // 28
console.log(generatePerfectNumber(5));  // 496
console.log(generatePerfectNumber(7));  // 8128
```

### Edge Cases to Consider:

**1. N = 1:**
* Input: N = 1
* Divisors (excluding 1): none
* Sum = 0
* Output: false (1 is not perfect)

**2. N = 6 (First perfect number):**
* Input: N = 6
* Divisors: 1, 2, 3
* Sum = 6
* Output: true

**3. Prime Numbers:**
* Input: N = 7 (prime)
* Divisors: 1
* Sum = 1 ≠ 7
* Output: false
* (No prime number can be perfect)

**4. Powers of 2:**
* Input: N = 8 (2^3)
* Divisors: 1, 2, 4
* Sum = 7 ≠ 8
* Output: false

**5. Large Perfect Number:**
* Input: N = 8128
* Output: true (4th perfect number)

**6. Almost Perfect:**
* Input: N = 12
* Divisors: 1, 2, 3, 4, 6
* Sum = 16 ≠ 12
* Output: false (sum > N: abundant number)

**7. Deficient Numbers:**
* Input: N = 8
* Divisors: 1, 2, 4
* Sum = 7 < 8
* Output: false (sum < N: deficient number)

### Key Takeaways:

1. **Perfect numbers are rare:** Only 51 known, 4 fit in typical integer range.

2. **Optimization is key:** O(√N) approach is much better than O(N) for large numbers.

3. **Mathematical insight:** Understanding Euclid-Euler theorem shows deep knowledge.

4. **Three types of numbers:**
   * **Perfect:** sum of divisors = N (e.g., 6, 28)
   * **Abundant:** sum of divisors > N (e.g., 12)
   * **Deficient:** sum of divisors < N (e.g., 8)

5. **Constant-time solution:** For typical constraints, checking against known perfect numbers is fastest.

6. **Related concepts:**
   * Mersenne primes
   * Amicable numbers
   * Abundant and deficient numbers

7. **Interview strategy:**
   * Start with brute force explanation.
   * Optimize using √N approach.
   * Mention the rarity of perfect numbers.
   * Optionally discuss Euclid-Euler theorem.
   * Consider constant-time lookup for small constraints.

8. **Historical significance:**
   * Ancient Greek mathematicians studied these.
   * Connected to early number theory.
   * Still an active area of research.

9. **No odd perfect numbers found:**
   * Major unsolved problem in mathematics.
   * If one exists, it must be > 10^1500.
   * You can quickly return false for odd numbers > small thresholds.

10. **Applications:**
    * Number theory research
    * Cryptography (related to prime numbers)
    * Pattern recognition in sequences
    * Educational tool for understanding divisibility

11. **Common mistakes:**
    * Including N in the sum (should be proper divisors only).
    * Not handling N = 1 correctly.
    * Checking all numbers up to N instead of √N.
    * Not optimizing for the rarity of perfect numbers.

12. **Testing strategy:**
    * ✓ Test with N = 1
    * ✓ Test with known perfect numbers: 6, 28, 496, 8128
    * ✓ Test with prime numbers
    * ✓ Test with abundant numbers (12, 18, 20)
    * ✓ Test with deficient numbers (8, 9, 10)
    * ✓ Test with large numbers

