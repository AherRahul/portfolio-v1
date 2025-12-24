---
title: "Square Root of Integer using Binary Search"
description: "Find integer square root using binary search. Master precision handling, avoid overflow, and implement efficient sqrt without library functions."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Searching Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Square Root of Integer

## 2. Problem Statement

Implement `int sqrt(int x)` that computes the **square root** of **x** and returns the **floor** of the result.

Do not use any built-in exponent or sqrt functions.

**Input:**
- Non-negative integer `x`

**Output:**
- Floor of square root

## 3. Examples

```
Input: 8
Output: 2
Explanation: sqrt(8) = 2.828..., floor = 2

Input: 16
Output: 4
Explanation: sqrt(16) = 4

Input: 0
Output: 0
```

## 4. Constraints

- `0 ≤ x ≤ 2^31 - 1`

## 5. Important Points

**Binary Search Range:**
```
Answer lies in [0, x]
For x >= 4, answer <= x/2
```

**Overflow Prevention:**
```
Instead of mid * mid, use mid <= x / mid
```

## 6. Brute Force Approach

Linear search from 0 to x.

## 7. Brute Force Code

```javascript
function sqrtBrute(x) {
    if (x < 2) return x;
    
    for (let i = 1; i <= x; i++) {
        if (i * i === x) {
            return i;
        }
        if (i * i > x) {
            return i - 1;
        }
    }
    
    return -1;
}
```

## 8. Dry Run

```
x = 8

i=1: 1*1=1 < 8
i=2: 2*2=4 < 8
i=3: 3*3=9 > 8 → return 2
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(√N)  
**Space:** O(1)

## 10. Visualization

```
x = 8

Perfect squares:
0, 1, 4, 9, 16, 25...

8 falls between 4 (2²) and 9 (3²)
Answer: 2
```

## 11. Optimized Approach Description

Binary search in range [0, x]. For each mid, check if mid² <= x.

## 12. Optimized Approach Algorithm

```
1. If x < 2: return x
2. left = 0, right = x
3. While left <= right:
   - mid = (left + right) / 2
   - If mid = x / mid:
       return mid
   - If mid < x / mid:
       left = mid + 1
       result = mid
   - Else:
       right = mid - 1
4. Return result
```

## 13. Optimized Code

```javascript
function mySqrt(x) {
    if (x < 2) return x;
    
    let left = 1;
    let right = Math.floor(x / 2);
    let result = 0;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        // Avoid overflow: mid * mid vs mid <= x / mid
        if (mid === Math.floor(x / mid)) {
            return mid;
        } else if (mid < x / mid) {
            result = mid; // Store potential answer
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

// Alternative with clearer logic
function mySqrtAlt(x) {
    if (x < 2) return x;
    
    let left = 1;
    let right = x;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const square = mid * mid;
        
        if (square === x) {
            return mid;
        } else if (square < x) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return right; // Floor value
}

// Test cases
console.log(mySqrt(8)); // 2
console.log(mySqrt(16)); // 4
console.log(mySqrt(0)); // 0
console.log(mySqrt(1)); // 1
console.log(mySqrt(2)); // 1
```

## 14. Dry Run

```
x = 8
left=1, right=4

Iteration 1:
mid=2, 2*2=4
4 < 8 → result=2, left=3

Iteration 2:
mid=3, 3*3=9
9 > 8 → right=2

left > right → return 2
```

## 15. Time and Space Complexity

**Time:** O(log N)  
**Space:** O(1)

## 16. Visualization

```
x = 8

Binary search range: [1, 4]
1² = 1   ✗
2² = 4   ✓ (< 8)
3² = 9   ✗ (> 8)

Answer: 2

Number line:
0  1  4      9      16
   ↑  ↑  8   ↑
   1  2  ↑   3
          Floor(√8) = 2
```

## 17. Edge Cases

```javascript
// Zero
mySqrt(0); // 0

// One
mySqrt(1); // 1

// Perfect square
mySqrt(4); // 2
mySqrt(9); // 3
mySqrt(16); // 4

// Non-perfect square
mySqrt(2); // 1
mySqrt(3); // 1
mySqrt(8); // 2

// Large number
mySqrt(2147395599); // 46339
```

## 18. Key Takeaways

### a. Applications
- Mathematical computations
- Graphics programming
- Distance calculations
- Algorithm implementations

### b. Interview Strategy
- Use binary search
- Prevent overflow
- Handle edge cases (0, 1)
- Explain floor concept

### c. Common Mistakes
- Integer overflow
- Wrong search range
- Not handling 0 and 1
- Wrong floor logic

### d. Related Problems
- Pow(x, n)
- Valid Perfect Square
- Sqrt with precision
- Nth Root

### e. Performance
- O(log N) optimal
- No built-in functions
- Overflow-safe implementation
- Binary search application

## Summary

✅ **Binary Search:** On answer space [0, x]  
✅ **Overflow Safe:** Use x/mid instead of mid²  
✅ **Floor Value:** Return largest mid where mid² <= x  

Happy Coding! 🚀

