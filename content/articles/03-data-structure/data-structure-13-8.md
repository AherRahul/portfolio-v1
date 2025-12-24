---
title: "Sum of Digits using Recursion"
description: "Calculate sum of digits in a number using recursion. Master digit extraction with modulo and division operations, learn how to process numbers recursively, and understand mathematical recursion patterns."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Number Theory"
    type: "article"
    url: "https://www.khanacademy.org/math/number-theory"
    description: "Mathematical foundations"
  - title: "Recursion Practice"
    type: "practice"
    url: "https://leetcode.com/tag/recursion/"
    description: "Practice recursive problems"
---


![Recursion Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Calculate Sum of Digits of a Number Using Recursion

## 2. Problem Statement

Given a number **A**, we need to find the **sum of its digits** using recursion.

**Input:**
- An integer `A` (0 ≤ A ≤ 10^9)

**Output:**
- Return the sum of digits

## 3. Examples

### Example 1:
```
Input: A = 1234
Output: 10
Explanation: 1 + 2 + 3 + 4 = 10
```

### Example 2:
```
Input: A = 99
Output: 18
Explanation: 9 + 9 = 18
```

### Example 3:
```
Input: A = 5
Output: 5
Explanation: Single digit
```

### Example 4:
```
Input: A = 0
Output: 0
Explanation: No digits to sum
```

## 4. Constraints

- `0 ≤ A ≤ 10^9`
- Must use recursion
- Return integer sum

## 5. Important Points

### Digit Extraction

**Key Operations:**
- Last digit: `A % 10`
- Remaining number: `Math.floor(A / 10)`

**Pattern:**
```
sumDigits(1234)
= 4 + sumDigits(123)
= 4 + 3 + sumDigits(12)
= 4 + 3 + 2 + sumDigits(1)
= 4 + 3 + 2 + 1 + sumDigits(0)
= 10
```

## 6. Brute Force Approach

Convert to string, split, and sum.

## 7. Brute Force Code

```javascript
function sumDigitsBruteForce(A) {
    return String(A)
        .split('')
        .reduce((sum, digit) => sum + Number(digit), 0);
}

console.log(sumDigitsBruteForce(1234)); // 10
```

## 8. Dry Run of Brute Force

```
Input: 1234
String: "1234"
Split: ['1', '2', '3', '4']
Convert: [1, 2, 3, 4]
Sum: 1 + 2 + 3 + 4 = 10
```

## 9. Time and Space Complexity of Brute Force

- **Time:** O(D) where D = number of digits
- **Space:** O(D) for string array

## 10. Visualization (Brute Force)

```
1234 → "1234" → ['1','2','3','4'] → [1,2,3,4] → 10
```

## 11. Optimized Approach Description

Use recursion with modulo and division to extract digits.

## 12. Optimized Approach Algorithm

1. Base case: if A === 0, return 0
2. Extract last digit: A % 10
3. Recursively sum remaining: sumDigits(Math.floor(A / 10))
4. Return lastDigit + recursive result

## 13. Optimized Code

```javascript
/**
 * Sum of digits using recursion
 * @param {number} A - Input number
 * @returns {number} - Sum of digits
 */
function sumDigits(A) {
    // Base case
    if (A === 0) {
        return 0;
    }
    
    // Extract last digit and recurse
    return (A % 10) + sumDigits(Math.floor(A / 10));
}

// Test cases
console.log(sumDigits(1234)); // 10
console.log(sumDigits(99));   // 18
console.log(sumDigits(5));    // 5
console.log(sumDigits(0));    // 0
```

### With Validation

```javascript
function sumDigitsSafe(A) {
    if (typeof A !== 'number' || A < 0) {
        throw new Error("Input must be non-negative number");
    }
    
    if (A === 0) return 0;
    return (A % 10) + sumDigitsSafe(Math.floor(A / 10));
}
```

## 14. Dry Run of Optimized Approach

```
sumDigits(1234)
  Last digit: 1234 % 10 = 4
  Remaining: floor(1234 / 10) = 123
  Return: 4 + sumDigits(123)
  
sumDigits(123)
  Last digit: 123 % 10 = 3
  Remaining: floor(123 / 10) = 12
  Return: 3 + sumDigits(12)
  
sumDigits(12)
  Last digit: 12 % 10 = 2
  Remaining: floor(12 / 10) = 1
  Return: 2 + sumDigits(1)
  
sumDigits(1)
  Last digit: 1 % 10 = 1
  Remaining: floor(1 / 10) = 0
  Return: 1 + sumDigits(0)
  
sumDigits(0)
  BASE CASE
  Return: 0

Unwinding:
sumDigits(1) = 1 + 0 = 1
sumDigits(12) = 2 + 1 = 3
sumDigits(123) = 3 + 3 = 6
sumDigits(1234) = 4 + 6 = 10 ✓
```

## 15. Time and Space Complexity

- **Time:** O(D) where D = log₁₀(A) (number of digits)
- **Space:** O(D) for recursion stack

## 16. Visualization

```
Recursion Tree for 1234:

                 sumDigits(1234)
                      4 + ?
                       ↓
                 sumDigits(123)
                      3 + ?
                       ↓
                 sumDigits(12)
                      2 + ?
                       ↓
                 sumDigits(1)
                      1 + ?
                       ↓
                 sumDigits(0)
                      0

Calculation on return:
                      0
                      ↑
                  1 + 0 = 1
                      ↑
                  2 + 1 = 3
                      ↑
                  3 + 3 = 6
                      ↑
                  4 + 6 = 10
```

## 17. Edge Cases

### Zero
```javascript
sumDigits(0); // 0
```

### Single Digit
```javascript
sumDigits(7); // 7
```

### Large Number
```javascript
sumDigits(999999999); // 81
```

### Negative (should handle)
```javascript
sumDigits(-123); // Should validate or use Math.abs
```

## 18. Key Takeaways

### a. Applications
- Digital root calculation
- Check digit validation
- Number theory problems
- ISBN/Credit card validation

### b. Interview Strategy
- Explain modulo/division
- Show recursion clearly
- Discuss digit extraction
- Handle edge cases

### c. Common Mistakes
- Forgetting Math.floor
- Wrong base case
- Not handling negatives
- Integer overflow

### d. Related Problems
- Count digits
- Digital root
- Happy number
- Armstrong number
- Digit product

### e. Performance
- Recursive: O(D) time, O(D) space
- Iterative: O(D) time, O(1) space (better)

## Summary

Sum of digits demonstrates mathematical recursion beautifully!

✅ **Digit Extraction:** Modulo and division  
✅ **Clear Pattern:** Last digit + recurse  
✅ **Foundation:** For number theory problems  

Happy Coding! 🚀

