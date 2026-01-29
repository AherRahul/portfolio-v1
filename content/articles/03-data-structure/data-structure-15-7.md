---
title: "Sort by Number of Factors"
description: "Sort array by factor count with custom comparator. Master composite sorting criteria, handle factor counting efficiently, and learn stable secondary sorting."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Sorting Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Sort by Factors

## 2. Problem Statement

Given an array of positive integers **A**, sort them based on the **number of factors** each element has.

If two elements have the **same number of factors**, sort them by their **values** (smaller first).

**Input:**
- Array `A` of N positive integers

**Output:**
- Array sorted by factor count, then by value

## 3. Examples

```
Input: [6, 8, 9]
Output: [9, 6, 8]
Explanation:
  9 → factors: 1,3,9 (3 factors)
  6 → factors: 1,2,3,6 (4 factors)
  8 → factors: 1,2,4,8 (4 factors)
  6 < 8, so [9, 6, 8]

Input: [2, 4, 7, 9, 12]
Output: [2, 7, 4, 9, 12]
Explanation:
  2 → 2 factors
  7 → 2 factors
  4 → 3 factors
  9 → 3 factors
  12 → 6 factors
```

## 4. Constraints

- `1 ≤ N ≤ 10^3`
- `1 ≤ A[i] ≤ 10^4`

## 5. Important Points

**Factor Counting:**
```
Check divisors from 1 to sqrt(n)
If i divides n: count i and n/i
Handle perfect squares carefully
```

**Sorting Criteria:**
1. Primary: Number of factors (ascending)
2. Secondary: Value (ascending)

## 6. Brute Force Approach

Count factors for each element by checking all numbers from 1 to n.

## 7. Brute Force Code

```javascript
function countFactorsBrute(num) {
    let count = 0;
    for (let i = 1; i <= num; i++) {
        if (num % i === 0) {
            count++;
        }
    }
    return count;
}

function sortByFactorsBrute(arr) {
    return arr.sort((a, b) => {
        const factorsA = countFactorsBrute(a);
        const factorsB = countFactorsBrute(b);
        
        if (factorsA !== factorsB) {
            return factorsA - factorsB;
        }
        return a - b;
    });
}
```

## 8. Dry Run

```
arr = [6, 8, 9]

Count factors:
6: 1,2,3,6 → 4 factors
8: 1,2,4,8 → 4 factors
9: 1,3,9 → 3 factors

Sort by factors:
9 (3) < 6 (4) < 8 (4)
6 < 8 (same factors)

Result: [9, 6, 8]
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N * M * log N) where M is max element  
**Space:** O(log N) - sorting stack

## 10. Visualization

```
Array: [6, 8, 9]

Factor analysis:
6: 1,2,3,6     → count=4
8: 1,2,4,8     → count=4
9: 1,3,9       → count=3

Sort priority:
9 (3 factors)
6 (4 factors, value=6)
8 (4 factors, value=8)

Result: [9, 6, 8]
```

## 11. Optimized Approach Description

Optimize factor counting using sqrt(n) approach. Only check divisors up to sqrt(n), count both i and n/i for each divisor found.

## 12. Optimized Approach Algorithm

```
countFactors(num):
  count = 0
  For i from 1 to sqrt(num):
    If num % i = 0:
      If i = num/i: count += 1 (perfect square)
      Else: count += 2 (count i and num/i)
  Return count

sortByFactors(arr):
  Sort arr using custom comparator:
    factorsA = countFactors(a)
    factorsB = countFactors(b)
    If factorsA ≠ factorsB: return factorsA - factorsB
    Else: return a - b
```

## 13. Optimized Code

```javascript
function countFactors(num) {
    let count = 0;
    const sqrt = Math.sqrt(num);
    
    for (let i = 1; i <= sqrt; i++) {
        if (num % i === 0) {
            if (i === num / i) {
                count++; // Perfect square
            } else {
                count += 2; // Count both i and num/i
            }
        }
    }
    
    return count;
}

function sortByFactors(arr) {
    return arr.sort((a, b) => {
        const factorsA = countFactors(a);
        const factorsB = countFactors(b);
        
        // Primary: sort by factor count
        if (factorsA !== factorsB) {
            return factorsA - factorsB;
        }
        
        // Secondary: sort by value
        return a - b;
    });
}

// Test cases
console.log(sortByFactors([6, 8, 9]));
// [9, 6, 8]

console.log(sortByFactors([2, 4, 7, 9, 12]));
// [2, 7, 4, 9, 12]

console.log(sortByFactors([5, 11, 10, 20, 9, 16, 23]));
// [5, 11, 23, 9, 10, 16, 20, 12]
```

## 14. Dry Run

```
arr = [2, 4, 7, 9, 12]

Count factors (optimized):
2: sqrt(2)=1.41
   i=1: 2%1=0 → count i(1) and 2/1(2) → 2 factors

4: sqrt(4)=2
   i=1: count 1 and 4 → 2
   i=2: 2=4/2 (perfect square) → 1
   Total: 3 factors

7: sqrt(7)=2.64
   i=1: count 1 and 7 → 2 factors

9: sqrt(9)=3
   i=1: count 1 and 9 → 2
   i=3: 3=9/3 (perfect square) → 1
   Total: 3 factors

12: sqrt(12)=3.46
   i=1: count 1 and 12 → 2
   i=2: count 2 and 6 → 2
   i=3: count 3 and 4 → 2
   Total: 6 factors

Sort:
2(2), 7(2), 4(3), 9(3), 12(6)
2<7, 4<9

Result: [2, 7, 4, 9, 12]
```

## 15. Time and Space Complexity

**Time:** O(N * sqrt(M) * log N) where M is max element  
**Space:** O(log N) - sorting stack

## 16. Visualization

```
Numbers with factor counts:
2 → [1, 2] = 2
4 → [1, 2, 4] = 3
7 → [1, 7] = 2
9 → [1, 3, 9] = 3
12 → [1, 2, 3, 4, 6, 12] = 6

Group by factors:
2 factors: [2, 7]
3 factors: [4, 9]
6 factors: [12]

Within each group, sort by value:
[2, 7] ✓
[4, 9] ✓

Final: [2, 7, 4, 9, 12]
```

## 17. Edge Cases

```javascript
// Single element
sortByFactors([5]); // [5]

// All primes (2 factors each)
sortByFactors([3, 7, 2, 11]); // [2, 3, 7, 11]

// All same factor count
sortByFactors([2, 3, 5, 7]); // [2, 3, 5, 7]

// Perfect squares
sortByFactors([4, 9, 16, 25]); // [4, 9, 16, 25]

// One element is 1
sortByFactors([1, 2, 3, 4]); // [1, 2, 3, 4]
// 1 has 1 factor

// Duplicates
sortByFactors([4, 4, 6, 6]); // [4, 4, 6, 6]
```

## 18. Key Takeaways

### a. Applications
- Number theory problems
- Custom sorting criteria
- Mathematical analysis
- Divisor-based sorting

### b. Interview Strategy
- Optimize factor counting
- Use sqrt optimization
- Handle perfect squares
- Explain two-level sorting

### c. Common Mistakes
- Counting factors inefficiently
- Not handling perfect squares
- Wrong secondary sort order
- Forgetting edge cases

### d. Related Problems
- Sort by Hamming Weight
- Sort by Digit Sum
- Custom Sort String
- Sort Characters by Frequency

### e. Performance
- sqrt(n) factor counting
- O(N log N) sorting
- Efficient comparator
- Stable sort important

## Summary

✅ **Factor Counting:** Use sqrt optimization  
✅ **Two-Level Sort:** Factors, then value  
✅ **Perfect Squares:** Handle carefully  

Happy Coding! 🚀

