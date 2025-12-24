---
title: "Colorful Number using Hashing"
description: "Check if a number is colorful using hash sets. Master product-based hashing, substring pattern detection, and learn number decomposition techniques."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Colorful Number

## 2. Problem Statement

For a given number **N**, find if it is **Colorful Number** or not.

A number is **Colorful** if the **products of every contiguous subsequence of its digits** are all **different**.

**Input:**
- Integer `N`

**Output:**
- 1 if colorful, 0 otherwise

## 3. Examples

```
Input: N = 23
Output: 1
Explanation:
  Products: [2], [3], [2*3=6]
  All different → Colorful

Input: N = 3245
Output: 1
Explanation:
  [3], [2], [4], [5]
  [3*2=6], [2*4=8], [4*5=20]
  [3*2*4=24], [2*4*5=40]
  [3*2*4*5=120]
  All different → Colorful

Input: N = 326
Output: 0
Explanation:
  [3], [2], [6]
  [3*2=6], [2*6=12]
  [3*2*6=36]
  Product 6 appears twice → Not colorful
```

## 4. Constraints

- `1 ≤ N ≤ 2 × 10^9`

## 5. Important Points

**Colorful Number Definition:**
```
All contiguous subsequence products must be unique
```

**Strategy:**
- Extract digits
- Generate all contiguous products
- Use Set to detect duplicates

## 6. Brute Force Approach

Generate all contiguous subsequences, calculate products, check for duplicates.

## 7. Brute Force Code

```javascript
function isColorfulBrute(N) {
    const digits = String(N).split('').map(Number);
    const products = [];
    
    // Generate all products
    for (let i = 0; i < digits.length; i++) {
        let product = 1;
        for (let j = i; j < digits.length; j++) {
            product *= digits[j];
            products.push(product);
        }
    }
    
    // Check for duplicates
    const uniqueProducts = new Set(products);
    return products.length === uniqueProducts.size ? 1 : 0;
}
```

## 8. Dry Run

```
N = 326
digits = [3, 2, 6]

Products:
i=0: 3, 3*2=6, 3*2*6=36
i=1: 2, 2*6=12
i=2: 6

products = [3, 6, 36, 2, 12, 6]
            ↑              ↑ duplicate!

Result: 0 (not colorful)
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²) where N is number of digits  
**Space:** O(N²) for products array

## 10. Visualization

```
N = 23
Digits: [2, 3]

Subsequence products:
[2] → 2
[3] → 3
[2,3] → 6

Set: {2, 3, 6} ✓ All different
```

## 11. Optimized Approach Description

Use hash set to detect duplicates while generating products. Return immediately on finding duplicate.

## 12. Optimized Approach Algorithm

```
1. Convert N to digit array
2. Initialize empty Set
3. For each starting position i:
   - Initialize product = 1
   - For each ending position j from i:
       product *= digits[j]
       If product in Set: return 0
       Add product to Set
4. Return 1
```

## 13. Optimized Code

```javascript
function isColorful(N) {
    const digits = String(N).split('').map(Number);
    const productSet = new Set();
    
    for (let i = 0; i < digits.length; i++) {
        let product = 1;
        
        for (let j = i; j < digits.length; j++) {
            product *= digits[j];
            
            if (productSet.has(product)) {
                return 0; // Found duplicate
            }
            
            productSet.add(product);
        }
    }
    
    return 1; // All products unique
}

// Test cases
console.log(isColorful(23)); // 1
console.log(isColorful(3245)); // 1
console.log(isColorful(326)); // 0
console.log(isColorful(3)); // 1
console.log(isColorful(236)); // 0
```

## 14. Dry Run

```
N = 326
digits = [3, 2, 6]
productSet = {}

i=0, j=0:
  product = 3
  productSet = {3}

i=0, j=1:
  product = 3*2 = 6
  productSet = {3, 6}

i=0, j=2:
  product = 6*6 = 36
  productSet = {3, 6, 36}

i=1, j=1:
  product = 2
  productSet = {3, 6, 36, 2}

i=1, j=2:
  product = 2*6 = 12
  productSet = {3, 6, 36, 2, 12}

i=2, j=2:
  product = 6
  6 already in set!
  Return 0
```

## 15. Time and Space Complexity

**Time:** O(D²) where D is number of digits  
**Space:** O(D²) for hash set

## 16. Visualization

```
N = 3245
Digits: [3, 2, 4, 5]

Generate products:
3
3*2 = 6
3*2*4 = 24
3*2*4*5 = 120

  2
  2*4 = 8
  2*4*5 = 40

    4
    4*5 = 20

      5

Set: {3, 6, 24, 120, 2, 8, 40, 4, 20, 5}
All unique → Colorful ✓
```

## 17. Edge Cases

```javascript
// Single digit
isColorful(5); // 1 (always colorful)

// Contains 0
isColorful(102); // Need special handling
// [1], [0], [2], [1*0=0], [0*2=0]
// Duplicate 0s → Not colorful

// Contains 1
isColorful(121); // 0
// [1], [2], [1], [1*2=2], [2*1=2]
// Multiple duplicates

// Two digits
isColorful(23); // 1

// Repeated digit
isColorful(11); // 0
// [1], [1], [1*1=1] → duplicates
```

## 18. Key Takeaways

### a. Applications
- Number theory
- Pattern recognition
- Unique property detection
- Mathematical puzzles

### b. Interview Strategy
- Extract digits first
- Use Set for duplicates
- Early exit optimization
- Handle edge cases (0, 1)

### c. Common Mistakes
- Not handling 0 correctly
- Wrong product calculation
- Missing single digit check
- Not considering all subsequences

### d. Related Problems
- Happy Number
- Ugly Number
- Perfect Number
- Armstrong Number
- Pandigital Numbers

### e. Performance
- O(D²) optimal for this problem
- Early exit on duplicate
- Space efficient with Set

## Summary

✅ **Contiguous Products:** All subsequence products  
✅ **Hash Set:** Detect duplicates instantly  
✅ **Early Exit:** Return on first duplicate  

Happy Coding! 🚀

