---
title: "Ath Magical Number using Binary Search"
description: "Find Ath number divisible by A or B. Master LCM concept, binary search on answer, and handle large numbers with modulo arithmetic."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Searching Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Ath Magical Number

## 2. Problem Statement

A positive integer is **magical** if it is divisible by either **A** or **B**. Given three integers **N**, **A**, and **B**, return the **Nth magical number**. Return answer modulo **10^9 + 7**.

**Input:**
- Integer `N` (which magical number)
- Integer `A` (first divisor)
- Integer `B` (second divisor)

**Output:**
- Nth magical number (mod 10^9+7)

## 3. Examples

```
Input: N = 1, A = 2, B = 3
Output: 2
Explanation: Magical numbers: 2, 3, 4, 6...

Input: N = 4, A = 2, B = 3
Output: 6
Explanation: 1st=2, 2nd=3, 3rd=4, 4th=6

Input: N = 5, A = 2, B = 4
Output: 10
Explanation: 2, 4, 6, 8, 10
```

## 4. Constraints

- `1 ≤ N ≤ 10^9`
- `2 ≤ A, B ≤ 40000`

## 5. Important Points

**Counting Formula:**
```
Count of multiples <= X:
floor(X/A) + floor(X/B) - floor(X/LCM(A,B))
```

**LCM:**
```
LCM(A, B) = (A * B) / GCD(A, B)
```

## 6. Brute Force Approach

Generate magical numbers until Nth.

## 7. Brute Force Code

```javascript
function nthMagicalBrute(N, A, B) {
    const MOD = 1000000007;
    let count = 0;
    let num = 0;
    
    while (count < N) {
        num++;
        if (num % A === 0 || num % B === 0) {
            count++;
        }
    }
    
    return num % MOD;
}
```

## 8. Dry Run

```
N = 4, A = 2, B = 3

num=1: not magical
num=2: 2%2=0 ✓ count=1
num=3: 3%3=0 ✓ count=2
num=4: 4%2=0 ✓ count=3
num=5: not magical
num=6: 6%2=0 ✓ count=4

Return: 6
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N * min(A, B))  
**Space:** O(1)

## 10. Visualization

```
A=2, B=3

Multiples:
A: 2, 4, 6, 8, 10, 12...
B: 3, 6, 9, 12, 15...

Magical (union): 2, 3, 4, 6, 8, 9, 10, 12...
                 1  2  3  4  5  6   7   8

4th magical = 6
```

## 11. Optimized Approach Description

Binary search on answer. For each value X, count how many magical numbers <= X using inclusion-exclusion principle.

## 12. Optimized Approach Algorithm

```
1. Calculate LCM = (A * B) / GCD(A, B)
2. left = 1, right = N * min(A, B)
3. Binary search:
   - count = X/A + X/B - X/LCM
   - If count < N: left = mid + 1
   - Else: right = mid
4. Return left % MOD
```

## 13. Optimized Code

```javascript
function nthMagicalNumber(N, A, B) {
    const MOD = 1000000007;
    
    // Calculate LCM
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const lcm = (A * B) / gcd(A, B);
    
    // Binary search
    let left = 1;
    let right = N * Math.min(A, B);
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // Count magical numbers <= mid
        const count = Math.floor(mid / A) + Math.floor(mid / B) - Math.floor(mid / lcm);
        
        if (count < N) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    return left % MOD;
}

// Test cases
console.log(nthMagicalNumber(1, 2, 3)); // 2
console.log(nthMagicalNumber(4, 2, 3)); // 6
console.log(nthMagicalNumber(5, 2, 4)); // 10
console.log(nthMagicalNumber(3, 6, 4)); // 8
```

## 14. Dry Run

```
N = 4, A = 2, B = 3
LCM = 6
left=1, right=8

Iteration 1:
mid=4
count = 4/2 + 4/3 - 4/6 = 2 + 1 - 0 = 3
3 < 4 → left=5

Iteration 2:
mid=6
count = 6/2 + 6/3 - 6/6 = 3 + 2 - 1 = 4
4 >= 4 → right=6

Iteration 3:
mid=5
count = 5/2 + 5/3 - 5/6 = 2 + 1 - 0 = 3
3 < 4 → left=6

left=right=6 → return 6
```

## 15. Time and Space Complexity

**Time:** O(log(N * min(A, B)))  
**Space:** O(1)

## 16. Visualization

```
A=2, B=3, LCM=6

Range [0, 12]:
Multiples of 2: 2,4,6,8,10,12 (6 numbers)
Multiples of 3: 3,6,9,12 (4 numbers)
Multiples of 6: 6,12 (2 numbers)

By Inclusion-Exclusion:
Count = 6 + 4 - 2 = 8

Unique magical: 2,3,4,6,8,9,10,12 (8 numbers) ✓
```

## 17. Edge Cases

```javascript
// N=1
nthMagicalNumber(1, 2, 3); // 2 (first is min)

// A=B
nthMagicalNumber(5, 3, 3); // 15

// A and B coprime
nthMagicalNumber(10, 2, 3); // 15

// A divides B
nthMagicalNumber(6, 2, 4); // 12

// Large N
nthMagicalNumber(1000000000, 40000, 40000); // result % MOD
```

## 18. Key Takeaways

### a. Applications
- Number theory problems
- Scheduling problems
- Pattern finding
- Mathematical sequences

### b. Interview Strategy
- Explain inclusion-exclusion
- Binary search on answer
- Calculate LCM correctly
- Handle modulo

### c. Common Mistakes
- Not using LCM
- Wrong count formula
- Integer overflow
- Forgetting modulo

### d. Related Problems
- Ugly Number II
- Super Ugly Number
- Kth Smallest in Multiplication Table
- Count Primes

### e. Performance
- O(log N) optimal
- Binary search on answer
- Math formula for counting
- Handle large N efficiently

## Summary

✅ **Inclusion-Exclusion:** Count = A + B - LCM  
✅ **Binary Search:** On answer space  
✅ **O(log N):** Efficient for large N  

Happy Coding! 🚀

