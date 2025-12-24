---
title: "Is Magic Number using Recursion"
description: "Check if a number is magic using recursion. Learn to recursively calculate digit sums until a single digit, understand multi-level recursion, and master recursive validation patterns."
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
    url: "https://www.mathsisfun.com/numbers/number-theory.html"
    description: "Mathematical number properties"
  - title: "Recursion Practice"
    type: "practice"
    url: "https://leetcode.com/tag/recursion/"
    description: "Practice recursive problems"
---


![Recursion Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)


## Check if a Number is Magic Using Recursion

## 2. Problem Statement

Given a number **A**, check if it is a **magic number** or not.

A number is said to be a **magic number** if the sum of its digits is calculated till a single digit recursively by adding the sum of the digits after every addition. If the single digit comes out to be **1**, then the number is a magic number.

**Input:**
- An integer `A` (1 ≤ A ≤ 10^9)

**Output:**
- Return 1 if magic number, 0 otherwise

## 3. Examples

### Example 1:
```
Input: A = 1234
Output: 1
Explanation:
Step 1: 1 + 2 + 3 + 4 = 10
Step 2: 1 + 0 = 1 (single digit = 1)
Result: Magic number!
```

### Example 2:
```
Input: A = 12
Output: 0
Explanation:
Step 1: 1 + 2 = 3 (single digit = 3)
Result: Not magic (should be 1)
```

### Example 3:
```
Input: A = 82
Output: 1
Explanation:
Step 1: 8 + 2 = 10
Step 2: 1 + 0 = 1 (magic!)
```

### Example 4:
```
Input: A = 1
Output: 1
Explanation: Already 1, magic!
```

## 4. Constraints

- `1 ≤ A ≤ 10^9`
- Must use recursion
- Keep summing until single digit
- Return 1 for magic, 0 otherwise

## 5. Important Points

### Magic Number Definition

A magic number's recursive digit sum equals **1**.

**Process:**
1. Sum all digits
2. If sum > 9, repeat step 1 with the sum
3. If final single digit = 1, it's magic!

**Examples:**
- 19: 1+9=10, 1+0=1 ✓ Magic
- 28: 2+8=10, 1+0=1 ✓ Magic
- 23: 2+3=5 ✗ Not magic

### Pattern Recognition

Magic numbers follow a pattern related to modulo 9:
- If (A - 1) % 9 === 0 and A > 0, it's magic!
- But we'll use recursion for learning

## 6. Brute Force Approach

Loop to sum digits, repeat until single digit.

## 7. Brute Force Code

```javascript
function isMagicBruteForce(A) {
    while (A >= 10) {
        let sum = 0;
        while (A > 0) {
            sum += A % 10;
            A = Math.floor(A / 10);
        }
        A = sum;
    }
    return A === 1 ? 1 : 0;
}

console.log(isMagicBruteForce(1234)); // 1
console.log(isMagicBruteForce(12));   // 0
```

## 8. Dry Run of Brute Force

```
Input: 1234

Iteration 1:
  sum = 1 + 2 + 3 + 4 = 10
  A = 10

Iteration 2:
  sum = 1 + 0 = 1
  A = 1

Check: A === 1 → true
Output: 1 (magic!)
```

## 9. Time and Space Complexity of Brute Force

- **Time:** O(D × log D) where D = digits
- **Space:** O(1)

## 10. Visualization (Brute Force)

```
1234 → 10 → 1 ✓ (magic!)
12 → 3 ✗ (not magic)
82 → 10 → 1 ✓ (magic!)
```

## 11. Optimized Approach Description

Use **two-level recursion**:
1. Recursive function to sum digits
2. Recursive call to check if result needs more summing

## 12. Optimized Approach Algorithm

```
function isMagic(A):
    if A < 10:
        return A === 1 ? 1 : 0
    
    digitSum = sumDigits(A)
    return isMagic(digitSum)

function sumDigits(A):
    if A === 0:
        return 0
    return (A % 10) + sumDigits(A / 10)
```

## 13. Optimized Code

```javascript
/**
 * Check if number is magic using recursion
 * @param {number} A - Input number
 * @returns {number} - 1 if magic, 0 otherwise
 */
function isMagic(A) {
    // Sum digits recursively
    function sumDigits(num) {
        if (num === 0) return 0;
        return (num % 10) + sumDigits(Math.floor(num / 10));
    }
    
    // Base case: single digit
    if (A < 10) {
        return A === 1 ? 1 : 0;
    }
    
    // Recursively check sum
    const digitSum = sumDigits(A);
    return isMagic(digitSum);
}

// Test cases
console.log(isMagic(1234)); // 1
console.log(isMagic(12));   // 0
console.log(isMagic(82));   // 1
console.log(isMagic(1));    // 1
```

### Compact Version

```javascript
function isMagicCompact(A) {
    if (A < 10) return A === 1 ? 1 : 0;
    
    let sum = 0;
    while (A > 0) {
        sum += A % 10;
        A = Math.floor(A / 10);
    }
    
    return isMagicCompact(sum);
}
```

## 14. Dry Run of Optimized Approach

```
isMagic(1234):

Call 1: isMagic(1234)
  A = 1234, not < 10
  digitSum = sumDigits(1234)
    sumDigits(1234) = 4 + sumDigits(123)
    sumDigits(123) = 3 + sumDigits(12)
    sumDigits(12) = 2 + sumDigits(1)
    sumDigits(1) = 1 + sumDigits(0)
    sumDigits(0) = 0
    Returns: 1 + 2 + 3 + 4 = 10
  digitSum = 10
  Call: isMagic(10)

Call 2: isMagic(10)
  A = 10, not < 10
  digitSum = sumDigits(10)
    sumDigits(10) = 0 + sumDigits(1)
    sumDigits(1) = 1 + sumDigits(0)
    sumDigits(0) = 0
    Returns: 1 + 0 = 1
  digitSum = 1
  Call: isMagic(1)

Call 3: isMagic(1)
  A = 1, A < 10
  A === 1 → true
  Return: 1

Final Result: 1 (magic!) ✓
```

## 15. Time and Space Complexity

- **Time:** O(D × K) where D = digits, K = iterations
- **Space:** O(K) for recursion depth

Typically K ≤ 3 for numbers ≤ 10^9

## 16. Visualization

```
Recursion Tree for 1234:

                 isMagic(1234)
                      ↓
                 sumDigits(1234) = 10
                      ↓
                 isMagic(10)
                      ↓
                 sumDigits(10) = 1
                      ↓
                 isMagic(1)
                      ↓
                 A === 1 ✓
                      ↓
                 Return 1

Result: Magic Number!
```

## 17. Edge Cases

### Single Digit - Magic
```javascript
isMagic(1); // 1 (magic)
```

### Single Digit - Not Magic
```javascript
isMagic(5); // 0 (not magic)
```

### Two Digits
```javascript
isMagic(19); // 1+9=10, 1+0=1 → magic
isMagic(23); // 2+3=5 → not magic
```

### Large Number
```javascript
isMagic(999999999);
// Sum = 81 → 9 → not magic
```

## 18. Key Takeaways

### a. Applications
- Number theory
- Digital root problems
- Checksum validation
- Mathematical puzzles

### b. Interview Strategy
- Explain two-level recursion
- Show digit sum calculation
- Discuss iteration count
- Mention modulo 9 pattern

### c. Common Mistakes
- Not recursing until single digit
- Wrong base case
- Forgetting to check === 1
- Integer overflow

### d. Related Problems
- Digital root
- Happy number
- Sum of digits
- Repeated digit sum

### e. Performance
- Recursive: Clear logic, O(log N) iterations
- Mathematical: (A-1) % 9 === 0, O(1) but less clear

## Summary

Magic numbers demonstrate multi-level recursion!

✅ **Nested Recursion:** Sum digits, then recurse on sum  
✅ **Clear Pattern:** Repeat until single digit  
✅ **Number Theory:** Related to modulo 9  

Happy Coding! 🚀

