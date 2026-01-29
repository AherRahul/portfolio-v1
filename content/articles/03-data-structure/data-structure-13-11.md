---
title: "Kth Symbol - Easy using Recursion"
description: "Find the Kth symbol in a recursively generated sequence. Master pattern recognition in recursive sequences, learn to optimize from generating full sequences to direct calculation, and understand binary tree recursion."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Binary Trees"
    type: "article"
    url: "https://visualgo.net/en/bst"
    description: "Visualize binary tree concepts"
  - title: "Pattern Recognition"
    type: "tutorial"
    url: "https://www.geeksforgeeks.org/pattern-recognition/"
    description: "Learn to identify patterns"
---


![Recursion Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)


## Find the Kth Symbol in a Recursively Generated Sequence

## 2. Problem Statement

On the first row, we write a **0**. Now in every subsequent row, we look at the previous row and replace each occurrence of **0** with **01**, and each occurrence of **1** with **10**.

Given row number **A** and index **B**, return the **Bth indexed symbol in row A**. (The values of B are **0-indexed**.)

**Input:**
- Row number `A` (1 ≤ A ≤ 30)
- Index `B` (0 ≤ B < 2^(A-1))

**Output:**
- Return 0 or 1

## 3. Examples

### Pattern Visualization:
```
Row 1: 0
Row 2: 01
Row 3: 0110
Row 4: 01101001
Row 5: 0110100110010110
```

### Example 1:
```
Input: A = 2, B = 0
Output: 0
Explanation: Row 2 = "01", index 0 is '0'
```

### Example 2:
```
Input: A = 2, B = 1
Output: 1
Explanation: Row 2 = "01", index 1 is '1'
```

### Example 3:
```
Input: A = 4, B = 5
Output: 0
Explanation: Row 4 = "01101001", index 5 is '0'
```

## 4. Constraints

- `1 ≤ A ≤ 30`
- `0 ≤ B < 2^(A-1)`
- Must use recursion
- Don't generate entire row (memory limit!)

## 5. Important Points

### Pattern Analysis

**Rule:**
- 0 → 01
- 1 → 10

**Observations:**
1. Row length = 2^(A-1)
2. First half of row A+1 = row A
3. Second half = complement of row A

**Key Insight:**
```
Row 3: 0110
       ↓↓↓↓
Row 4: 0110 | 1001
       same | complement
```

## 6. Brute Force Approach

Generate entire row, return Bth element.

## 7. Brute Force Code

```javascript
function kthSymbolBruteForce(A, B) {
    let row = "0";
    
    for (let i = 1; i < A; i++) {
        let nextRow = "";
        for (let ch of row) {
            nextRow += ch === '0' ? '01' : '10';
        }
        row = nextRow;
    }
    
    return parseInt(row[B]);
}

console.log(kthSymbolBruteForce(4, 5)); // 0
```

## 8. Dry Run of Brute Force

```
Input: A=4, B=5

Iteration 1: row = "01"
Iteration 2: row = "0110"
Iteration 3: row = "01101001"

Return: row[5] = '0'
```

## 9. Time and Space Complexity of Brute Force

- **Time:** O(2^A) - generate entire row
- **Space:** O(2^A) - store row

**Problem:** For A=30, need 2^30 = 1 billion characters!

## 10. Visualization (Brute Force)

```
Row 1: 0
Row 2: 01
Row 3: 0110
Row 4: 01101001 ← Find index 5
       012345678
       ↑
       Answer: 0
```

## 11. Optimized Approach Description

**Key Insight:** Don't generate! Use parent-child relationship.

**Pattern:**
- If B is in first half: same as parent row
- If B is in second half: complement of corresponding parent

**Formula:**
```
kthSymbol(A, B):
    if A == 1: return 0
    
    parent = kthSymbol(A-1, B/2)
    
    if B is even:
        return parent
    else:
        return 1 - parent  // complement
```

## 12. Optimized Approach Algorithm

1. Base case: A=1, return 0
2. Find parent symbol in previous row: B/2
3. If B is even: return parent
4. If B is odd: return complement (1 - parent)

## 13. Optimized Code

```javascript
/**
 * Find Kth symbol using recursion (optimized)
 * @param {number} A - Row number
 * @param {number} B - Index (0-indexed)
 * @returns {number} - 0 or 1
 */
function kthSymbol(A, B) {
    // Base case: first row
    if (A === 1) {
        return 0;
    }
    
    // Find parent in previous row
    const parent = kthSymbol(A - 1, Math.floor(B / 2));
    
    // If B is even, same as parent
    // If B is odd, complement of parent
    return B % 2 === 0 ? parent : 1 - parent;
}

// Test cases
console.log(kthSymbol(2, 0)); // 0
console.log(kthSymbol(2, 1)); // 1
console.log(kthSymbol(4, 5)); // 0
console.log(kthSymbol(4, 3)); // 1
```

### Alternative: Bit Counting

```javascript
function kthSymbolBitCount(A, B) {
    // Count 1s in binary representation of B
    let ones = 0;
    while (B > 0) {
        ones += B & 1;
        B >>= 1;
    }
    return ones % 2;
}
```

## 14. Dry Run of Optimized Approach

```
kthSymbol(4, 5):

Call 1: kthSymbol(4, 5)
  A=4, B=5 (odd)
  parent = kthSymbol(3, 2)
  
Call 2: kthSymbol(3, 2)
  A=3, B=2 (even)
  parent = kthSymbol(2, 1)
  
Call 3: kthSymbol(2, 1)
  A=2, B=1 (odd)
  parent = kthSymbol(1, 0)
  
Call 4: kthSymbol(1, 0)
  A=1, BASE CASE
  Return: 0

Unwinding:
Call 3: parent=0, B=1 (odd)
  return 1 - 0 = 1

Call 2: parent=1, B=2 (even)
  return 1

Call 1: parent=1, B=5 (odd)
  return 1 - 1 = 0

Final Answer: 0 ✓
```

### Trace Table:

| Call | A | B | parent | B%2 | Result |
|------|---|---|--------|-----|--------|
| 4 | 1 | 0 | - | - | 0 |
| 3 | 2 | 1 | 0 | odd | 1-0=1 |
| 2 | 3 | 2 | 1 | even | 1 |
| 1 | 4 | 5 | 1 | odd | 1-1=0 |

## 15. Time and Space Complexity

- **Time:** O(A) - A recursive calls
- **Space:** O(A) - recursion depth

**Improvement:** O(2^A) → O(A)!

For A=30:
- Brute force: 1 billion operations
- Optimized: 30 operations!

## 16. Visualization

```
Binary Tree Representation:

Row 1:          0
               / \
Row 2:        0   1
             / \ / \
Row 3:      0  1 1  0
           /|  |\ /|\ 
Row 4:    0 1 1 0|1 0 0 1
          0 1 2 3 4 5 6 7
                    ↑
                  Index 5

Path to index 5:
5 (binary: 101)
5/2 = 2 (binary: 10)
2/2 = 1 (binary: 1)
1/2 = 0 (binary: 0)

Trace back:
0 (base) → 1 (odd) → 1 (even) → 0 (odd)
```

## 17. Edge Cases

### First Row
```javascript
kthSymbol(1, 0); // 0 (only element)
```

### Second Row
```javascript
kthSymbol(2, 0); // 0
kthSymbol(2, 1); // 1
```

### Large Row
```javascript
kthSymbol(30, 1000000); 
// Handles efficiently!
```

### Last Element
```javascript
kthSymbol(5, 15); // Last element of row 5
```

## 18. Key Takeaways

### a. Applications
- Binary tree problems
- Pattern recognition
- Sequence generation
- Gray code
- Binary representation

### b. Interview Strategy
- Draw pattern first
- Identify parent-child relation
- Explain why not to generate
- Show bit counting alternative

### c. Common Mistakes
- Trying to generate entire row
- Wrong parent calculation
- Forgetting 0-indexing
- Not handling even/odd correctly

### d. Related Problems
- Gray code generation
- Binary tree path sum
- Josephus problem
- Pascal's triangle

### e. Performance
- Brute force: O(2^A) time and space
- Optimized: O(A) time, O(A) space
- Bit counting: O(log B) time, O(1) space

## Summary

Kth Symbol demonstrates pattern recognition and optimization!

✅ **Parent-Child Pattern:** Don't generate, navigate!  
✅ **Exponential to Linear:** O(2^A) → O(A)  
✅ **Binary Tree Thinking:** Visualize as tree  

Happy Coding! 🚀

