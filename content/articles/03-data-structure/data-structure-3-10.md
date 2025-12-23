---
title: "Count Factors"
description: "Learn how to efficiently count the number of factors (divisors) of a given number. Master mathematical optimization techniques and understand the relationship between factors and prime factorization."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
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

Count Factors
----------------------------

### Problem Statement:

Given a positive integer `N`, your task is to **count the total number of factors** (or divisors) of `N`.

A factor of a number `N` is any positive integer that divides `N` completely (i.e., leaves no remainder).

For example, if `N = 12`, the factors are: `1, 2, 3, 4, 6, 12` → Total count = **6 factors**.

### Examples:

#### Example 1:

**Input:** N = 12

**Output:** 6

**Explanation:** Factors of 12 are: `1, 2, 3, 4, 6, 12` → Total count = 6

#### Example 2:

**Input:** N = 24

**Output:** 8

**Explanation:** Factors of 24 are: `1, 2, 3, 4, 6, 8, 12, 24` → Total count = 8

#### Example 3:

**Input:** N = 1

**Output:** 1

**Explanation:** Factor of 1 is: `1` → Total count = 1

### Constraints:

* `1 ≤ N ≤ 10^9`
* Input is always a positive integer

### Important Points to Understand:

**1. Factor Definition:**
* A factor `i` of `N` means `N % i === 0` (no remainder when dividing).

**2. Factor Pairs:**
* Factors come in pairs. If `i` is a factor, then `N/i` is also a factor.
* Example: For N = 12, if `2` is a factor, then `12/2 = 6` is also a factor.

**3. Square Root Optimization:**
* We only need to check up to `√N` because factors repeat after that.
* If `i * i === N`, count it only once (perfect square case).

**4. Edge Cases:**
* N = 1 has only one factor (itself).
* Prime numbers have exactly 2 factors (1 and the number itself).

### Approach:

**Brute Force Approach:**
1. Loop from `i = 1` to `i = N`.
2. For each `i`, check if `N % i === 0`.
3. If yes, increment the factor count.
4. Return the final count.

**Optimized Approach:**
1. Loop from `i = 1` to `i = √N`.
2. For each `i`, check if `N % i === 0`.
3. If yes:
   * Increment count by 1 (for factor `i`).
   * If `i !== N/i`, increment count by 1 again (for factor `N/i`).
4. Return the final count.

### Time Complexity:

**Brute Force:**
* **Time Complexity = O(N)** - We check every number from 1 to N.

**Optimized:**
* **Time Complexity = O(√N)** - We only check up to the square root of N.

### Space Complexity:

* **Space Complexity = O(1)** - We use only a few variables (constant space).

### Dry Run - Brute Force:

```
Input: N = 12

Step 1: Initialize count = 0

Loop from i = 1 to 12:
    i = 1 → 12 % 1 = 0 → count = 1
    i = 2 → 12 % 2 = 0 → count = 2
    i = 3 → 12 % 3 = 0 → count = 3
    i = 4 → 12 % 4 = 0 → count = 4
    i = 5 → 12 % 5 = 2 → skip
    i = 6 → 12 % 6 = 0 → count = 5
    i = 7 → 12 % 7 = 5 → skip
    i = 8 → 12 % 8 = 4 → skip
    i = 9 → 12 % 9 = 3 → skip
    i = 10 → 12 % 10 = 2 → skip
    i = 11 → 12 % 11 = 1 → skip
    i = 12 → 12 % 12 = 0 → count = 6

Final count = 6

Output: 6
```

### Dry Run - Optimized:

```
Input: N = 12, √12 ≈ 3.46

Step 1: Initialize count = 0

Loop from i = 1 to 3:
    i = 1 → 12 % 1 = 0
        → count++ (for factor 1)
        → 1 !== 12/1 (1 !== 12)
        → count++ (for factor 12)
        → count = 2
        
    i = 2 → 12 % 2 = 0
        → count++ (for factor 2)
        → 2 !== 12/2 (2 !== 6)
        → count++ (for factor 6)
        → count = 4
        
    i = 3 → 12 % 3 = 0
        → count++ (for factor 3)
        → 3 !== 12/3 (3 !== 4)
        → count++ (for factor 4)
        → count = 6

Final count = 6

Output: 6
```

### Brute Force Approach - JavaScript Code:

```javascript
function countFactorsBruteForce(N) {
    let count = 0;
    
    for (let i = 1; i <= N; i++) {
        if (N % i === 0) {
            count++;
        }
    }
    
    return count;
}
```

### Visualization:

```
Example: N = 36

Factors: 1, 2, 3, 4, 6, 9, 12, 18, 36

Factor Pairs:
    1 × 36 = 36
    2 × 18 = 36
    3 × 12 = 36
    4 × 9 = 36
    6 × 6 = 36  (perfect square - count once)

Total factors = 9

Optimized approach checks only up to √36 = 6:
    Check 1: Found pair (1, 36) → count += 2
    Check 2: Found pair (2, 18) → count += 2
    Check 3: Found pair (3, 12) → count += 2
    Check 4: Found pair (4, 9) → count += 2
    Check 6: Found pair (6, 6) → count += 1 (same factor)
    
Total = 2 + 2 + 2 + 2 + 1 = 9
```

### Optimized Approach - JavaScript Code:

```javascript
function countFactorsOptimized(N) {
    let count = 0;
    
    for (let i = 1; i * i <= N; i++) {
        if (N % i === 0) {
            // Found a factor 'i'
            count++;
            
            // Check if the pair factor (N/i) is different
            if (i !== N / i) {
                count++;
            }
        }
    }
    
    return count;
}
```

### Alternative Optimized Approach (Using Math.sqrt):

```javascript
function countFactors(N) {
    let count = 0;
    const sqrt = Math.sqrt(N);
    
    for (let i = 1; i <= sqrt; i++) {
        if (N % i === 0) {
            if (i === sqrt) {
                // Perfect square case
                count++;
            } else {
                // Count both i and N/i
                count += 2;
            }
        }
    }
    
    return count;
}
```

### Edge Cases to Consider:

**1. N = 1:**
* Only one factor: 1 itself.
* Output: 1

**2. Prime Numbers:**
* Prime numbers have exactly 2 factors: 1 and the number itself.
* Example: N = 7 → factors: 1, 7 → count = 2

**3. Perfect Squares:**
* Numbers like 4, 9, 16, 25, 36 have an odd number of factors.
* Example: N = 9 → factors: 1, 3, 9 → count = 3
* The middle factor (√N) should be counted only once.

**4. Large Numbers:**
* For N = 10^9, brute force would time out.
* Optimized approach is necessary: √(10^9) ≈ 31,623 iterations.

**5. Powers of 2:**
* Example: N = 16 → factors: 1, 2, 4, 8, 16 → count = 5

### Key Takeaways:

1. **Optimization is crucial:** For large inputs, O(√N) is significantly faster than O(N).

2. **Factor pairs:** Understanding that factors come in pairs is key to optimization.

3. **Perfect square handling:** Be careful when `i * i === N` to avoid double counting.

4. **Mathematical insight:** This problem teaches the relationship between factors and square roots.

5. **Application in other problems:** Factor counting is used in:
   * Finding prime numbers
   * Perfect number problems
   * GCD/LCM calculations
   * Counting divisors in number theory

6. **Interview tip:** Always start by explaining the brute force approach, then optimize using mathematical properties.

7. **Testing strategy:** Test with:
   * Small numbers (1, 2)
   * Prime numbers (7, 11)
   * Perfect squares (4, 9, 16)
   * Large numbers (10^6, 10^9)

