---
title: "Count of Primes"
description: "Master the Sieve of Eratosthenes algorithm to efficiently count prime numbers. Learn multiple approaches from brute force to optimal solutions, understand prime number distribution, and explore one of the most elegant algorithms in computer science."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Sieve of Eratosthenes"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes"
    description: "Understanding the Sieve algorithm"
  - title: "Prime Number Visualizer"
    type: "tool"
    url: "https://visualgo.net/en"
    description: "Interactive prime number algorithm visualization"
  - title: "Number Theory Problems"
    type: "practice"
    url: "https://leetcode.com/tag/math/"
    description: "Practice prime number problems"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Count of Primes
----------------------------

### Problem Statement:

Given a non-negative integer `N`, count the number of prime numbers that are **strictly less than** N.

A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.

Return the count of prime numbers less than N.

### Examples:

#### Example 1:

**Input:** N = 10

**Output:** 4

**Explanation:** 
* Prime numbers less than 10: 2, 3, 5, 7
* Count = 4

#### Example 2:

**Input:** N = 20

**Output:** 8

**Explanation:** 
* Prime numbers less than 20: 2, 3, 5, 7, 11, 13, 17, 19
* Count = 8

#### Example 3:

**Input:** N = 0

**Output:** 0

**Explanation:** 
* No prime numbers less than 0.

#### Example 4:

**Input:** N = 2

**Output:** 0

**Explanation:** 
* No prime numbers strictly less than 2.
* (2 is not included as we need numbers < N)

### Constraints:

* `0 ≤ N ≤ 5 × 10^6`
* Return integer count of primes

### Important Points to Understand:

**1. Strictly Less Than N:**
* Count primes in range [2, N-1].
* N itself is NOT included in the count.
* Example: For N = 10, count primes from 2 to 9.

**2. Prime Number Properties:**
* 0 and 1 are NOT prime numbers.
* 2 is the smallest and only even prime number.
* All other primes are odd numbers.

**3. Sieve of Eratosthenes:**
* Ancient algorithm (circa 240 BCE).
* Efficiently finds all primes up to a limit.
* Works by eliminating multiples of each prime.

**4. Time Complexity Trade-offs:**
* Brute force: O(N × √N) - check each number individually.
* Sieve: O(N log log N) - much faster for large N.
* Space: Sieve uses O(N) space for the boolean array.

### Approach:

**Approach 1: Brute Force**
1. Loop through each number from 2 to N-1.
2. For each number, check if it's prime using isPrime() function.
3. Count the primes found.

**Approach 2: Sieve of Eratosthenes (Optimal)**
1. Create a boolean array of size N, initially all true.
2. Mark 0 and 1 as not prime.
3. For each number i from 2 to √N:
   * If i is marked prime, mark all multiples of i as not prime.
4. Count the remaining numbers marked as prime.

### Time Complexity:

**Brute Force:**
* **Time Complexity = O(N × √N)**
  * For each of N numbers, check primality in O(√N).
  * Very slow for large N.

**Sieve of Eratosthenes:**
* **Time Complexity = O(N log log N)**
  * Much faster than brute force.
  * For N = 10^6, log log N ≈ 2.6 (extremely efficient).

### Space Complexity:

**Brute Force:**
* **Space Complexity = O(1)** - only counter variable.

**Sieve:**
* **Space Complexity = O(N)** - boolean array for marking primes.

### Dry Run - Brute Force:

```
Input: N = 10

Check each number from 2 to 9:
    2: Is prime? Yes → count = 1
    3: Is prime? Yes → count = 2
    4: Is prime? No (divisible by 2)
    5: Is prime? Yes → count = 3
    6: Is prime? No (divisible by 2, 3)
    7: Is prime? Yes → count = 4
    8: Is prime? No (divisible by 2)
    9: Is prime? No (divisible by 3)

Final count = 4

Output: 4
```

### Dry Run - Sieve of Eratosthenes:

```
Input: N = 10

Step 1: Initialize boolean array
    isPrime = [F, F, T, T, T, T, T, T, T, T]
    Index:     0  1  2  3  4  5  6  7  8  9

Step 2: Process i = 2 (first prime)
    Mark multiples of 2: 4, 6, 8
    isPrime = [F, F, T, T, F, T, F, T, F, T]
    Index:     0  1  2  3  4  5  6  7  8  9

Step 3: Process i = 3 (next prime)
    Mark multiples of 3: 6, 9
    isPrime = [F, F, T, T, F, T, F, T, F, F]
    Index:     0  1  2  3  4  5  6  7  8  9

Step 4: i = 4, but √10 ≈ 3.16, so stop

Step 5: Count true values
    Primes: 2, 3, 5, 7
    Count = 4

Output: 4
```

### Brute Force Approach - JavaScript Code:

```javascript
function countPrimesBruteForce(N) {
    if (N <= 2) return 0;
    
    function isPrime(num) {
        if (num < 2) return false;
        if (num === 2) return true;
        if (num % 2 === 0) return false;
        
        for (let i = 3; i * i <= num; i += 2) {
            if (num % i === 0) return false;
        }
        return true;
    }
    
    let count = 0;
    for (let i = 2; i < N; i++) {
        if (isPrime(i)) {
            count++;
        }
    }
    
    return count;
}
```

**Time:** O(N × √N) ❌ (Too slow for large N)
**Space:** O(1) ✓

### Visualization - Sieve of Eratosthenes:

```
Example: N = 30

Initial (all marked as potential primes):
2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29

After processing 2 (mark multiples):
2  3  ✗  5  ✗  7  ✗  9  ✗  11 ✗  13 ✗  15 ✗  17 ✗  19 ✗  21 ✗  23 ✗  25 ✗  27 ✗  29

After processing 3 (mark multiples):
2  3  ✗  5  ✗  7  ✗  ✗  ✗  11 ✗  13 ✗  ✗  ✗  17 ✗  19 ✗  ✗  ✗  23 ✗  25 ✗  ✗  ✗  29

After processing 5 (mark multiples):
2  3  ✗  5  ✗  7  ✗  ✗  ✗  11 ✗  13 ✗  ✗  ✗  17 ✗  19 ✗  ✗  ✗  23 ✗  ✗  ✗  ✗  ✗  29

Remaining primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29
Count = 10
```

### Optimal Approach - Sieve of Eratosthenes:

```javascript
function countPrimes(N) {
    if (N <= 2) return 0;
    
    // Create boolean array, initially all true
    const isPrime = new Array(N).fill(true);
    isPrime[0] = false; // 0 is not prime
    isPrime[1] = false; // 1 is not prime
    
    // Sieve algorithm
    for (let i = 2; i * i < N; i++) {
        if (isPrime[i]) {
            // Mark all multiples of i as not prime
            for (let j = i * i; j < N; j += i) {
                isPrime[j] = false;
            }
        }
    }
    
    // Count primes
    let count = 0;
    for (let i = 2; i < N; i++) {
        if (isPrime[i]) count++;
    }
    
    return count;
}
```

**Time:** O(N log log N) ✓
**Space:** O(N) ✓

### Optimized Sieve (Start from i²):

```javascript
function countPrimesOptimized(N) {
    if (N <= 2) return 0;
    
    const isPrime = new Array(N).fill(true);
    isPrime[0] = isPrime[1] = false;
    
    // Only check up to √N
    const sqrt = Math.sqrt(N);
    
    for (let i = 2; i <= sqrt; i++) {
        if (isPrime[i]) {
            // Start from i², because smaller multiples already marked
            for (let j = i * i; j < N; j += i) {
                isPrime[j] = false;
            }
        }
    }
    
    // Count remaining true values
    return isPrime.filter(Boolean).length;
}
```

### Space-Optimized Sieve (Odd Numbers Only):

```javascript
function countPrimesSpaceOptimized(N) {
    if (N <= 2) return 0;
    if (N === 3) return 1; // Only 2
    
    // Count 2 separately, then handle odd numbers only
    let count = 1; // Count for 2
    
    // Array for odd numbers only (saves 50% space)
    const size = Math.floor((N - 3) / 2) + 1;
    const isPrime = new Array(size).fill(true);
    
    // Map: index i represents number (2*i + 3)
    // So index 0 = 3, index 1 = 5, index 2 = 7, etc.
    
    for (let i = 0; i * i < size; i++) {
        if (isPrime[i]) {
            const prime = 2 * i + 3;
            
            // Mark multiples starting from prime²
            for (let j = (prime * prime - 3) / 2; j < size; j += prime) {
                isPrime[j] = false;
            }
        }
    }
    
    // Count primes
    for (let i = 0; i < size; i++) {
        if (isPrime[i]) count++;
    }
    
    return count;
}
```

### Segmented Sieve (For Very Large N):

```javascript
function countPrimesSegmented(N) {
    if (N <= 2) return 0;
    
    // First, find all primes up to √N using simple sieve
    const limit = Math.floor(Math.sqrt(N)) + 1;
    const isPrime = new Array(limit).fill(true);
    isPrime[0] = isPrime[1] = false;
    
    for (let i = 2; i * i < limit; i++) {
        if (isPrime[i]) {
            for (let j = i * i; j < limit; j += i) {
                isPrime[j] = false;
            }
        }
    }
    
    // Extract primes up to √N
    const primes = [];
    for (let i = 2; i < limit; i++) {
        if (isPrime[i]) primes.push(i);
    }
    
    // Count primes in segments
    let count = primes.length;
    const segmentSize = limit;
    
    for (let low = limit; low < N; low += segmentSize) {
        const high = Math.min(low + segmentSize, N);
        const segment = new Array(high - low).fill(true);
        
        for (const prime of primes) {
            const start = Math.max(prime * prime, Math.ceil(low / prime) * prime);
            for (let j = start; j < high; j += prime) {
                segment[j - low] = false;
            }
        }
        
        for (let i = 0; i < segment.length; i++) {
            if (segment[i]) count++;
        }
    }
    
    return count;
}
```

**Benefits:** Better cache performance, handles very large N.

### Edge Cases to Consider:

**1. N = 0:**
* Input: N = 0
* Output: 0 (no primes less than 0)

**2. N = 1:**
* Input: N = 1
* Output: 0 (no primes less than 1)

**3. N = 2:**
* Input: N = 2
* Output: 0 (2 is not included, need strictly less)

**4. N = 3:**
* Input: N = 3
* Primes less than 3: 2
* Output: 1

**5. Small N:**
* Input: N = 5
* Primes: 2, 3
* Output: 2

**6. Large N:**
* Input: N = 1,000,000
* Should handle efficiently with Sieve.
* Output: 78,498

**7. Power of 2:**
* Input: N = 16
* Primes: 2, 3, 5, 7, 11, 13
* Output: 6

### Key Takeaways:

1. **Sieve of Eratosthenes** is the gold standard for finding multiple primes efficiently.

2. **Time complexity:** O(N log log N) is remarkably fast - nearly linear!

3. **Space-time trade-off:** Sieve uses O(N) space but saves enormous time.

4. **Optimization techniques:**
   * Start marking from i² (smaller multiples already marked).
   * Only check up to √N for the outer loop.
   * Handle even numbers separately (50% space saving).

5. **Historical significance:** One of the oldest algorithms, still optimal today!

6. **Why "Sieve"?:** The algorithm "sifts out" composite numbers, leaving primes.

7. **Applications:**
   * Cryptography (RSA key generation)
   * Random number generation
   * Hash table sizing
   * Number theory research

8. **Interview strategy:**
   * Explain brute force first.
   * Introduce Sieve of Eratosthenes.
   * Walk through the marking process.
   * Explain why we start from i².
   * Discuss time/space complexity.
   * Mention optimizations (odd numbers only, segmented sieve).

9. **Related algorithms:**
   * Segmented Sieve (for very large ranges)
   * Sieve of Atkin (theoretically faster, more complex)
   * Wheel factorization

10. **Performance comparison:**
    * For N = 1,000,000:
      * Brute force: ~30 seconds ❌
      * Sieve: ~0.1 seconds ✓

11. **Common mistakes:**
    * Not handling N ≤ 2 correctly.
    * Including N in the count (should be < N, not ≤ N).
    * Starting multiples from i instead of i².
    * Not optimizing the outer loop (checking beyond √N).

12. **Testing strategy:**
    * ✓ N = 0, 1, 2, 3
    * ✓ Small N (< 10)
    * ✓ Medium N (100-1000)
    * ✓ Large N (10^6)
    * ✓ Prime N
    * ✓ Power of 2
    * ✓ Known results (e.g., π(100) = 25 primes)

