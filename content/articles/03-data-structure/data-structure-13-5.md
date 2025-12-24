---
title: "Print 1 to A using Recursion"
description: "Print numbers from 1 to A using recursion. Learn ascending order recursion, understand the difference between pre-recursion and post-recursion operations, and master recursive counting patterns."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Recursion Visualizer"
    type: "tool"
    url: "https://visualgo.net/en/recursion"
    description: "Interactive recursion visualization tool"
  - title: "Understanding Call Stack"
    type: "article"
    url: "https://developer.mozilla.org/en-US/docs/Glossary/Call_stack"
    description: "MDN guide to JavaScript call stack"
  - title: "Recursion Practice"
    type: "practice"
    url: "https://leetcode.com/tag/recursion/"
    description: "Practice recursive problems"
---

![Recursion Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Print Numbers from 1 to A in Ascending Order Using Recursion


## 2. Problem Statement

You are given an integer **A**. Your task is to print all numbers from **1 to A** in ascending order using **recursion**.

**Note:** After printing all the numbers from 1 to A, print a new line.

**Input:**
- An integer `A` (1 ≤ A ≤ 10000)

**Output:**
- Print numbers from 1 to A, each on a new line


## 3. Examples

### Example 1:
```
Input: A = 5
Output:
1
2
3
4
5
```

### Example 2:
```
Input: A = 3
Output:
1
2
3
```

### Example 3:
```
Input: A = 1
Output:
1
```

### Example 4:
```
Input: A = 10
Output:
1
2
3
4
5
6
7
8
9
10
```


## 4. Constraints

- `1 ≤ A ≤ 10000`
- Must use recursion (no loops allowed)
- Each number should be printed on a new line
- Must print in ascending order (1 to A, not A to 1)


## 5. Important Points

### Key Difference from "Print A to 1"

This problem is **slightly tricker** than printing A to 1 because:

1. **Print A to 1:** Print BEFORE recursive call
   ```javascript
   console.log(A);      // Print first
   recursive(A - 1);     // Then recurse
   ```

2. **Print 1 to A:** Print AFTER recursive call
   ```javascript
   recursive(A - 1);     // Recurse first
   console.log(A);      // Then print (on the way back up)
   ```

### Understanding Call Stack Unwinding

- When you print **after** the recursive call, output happens during **stack unwinding**
- The deepest call (base case) returns first
- Then each previous call resumes and prints
- This creates **ascending** order from **descending** recursion

### Visualization

```
printAscending(3)
  ↓ Call printAscending(2)
    ↓ Call printAscending(1)
      ↓ Call printAscending(0)
        ↓ Base case, return
      ← Print 1 (unwinding)
    ← Print 2 (unwinding)
  ← Print 3 (unwinding)

Output: 1 2 3
```


## 6. Brute Force Approach

### Concept

The straightforward approach is to use an **iterative loop** to print numbers from 1 to A.

### Algorithm

1. Start with number 1
2. Use a loop to iterate from 1 to A
3. Print each number
4. Increment the counter

### Why It's Brute Force

- Uses iteration instead of recursion
- Doesn't demonstrate recursive thinking
- Doesn't meet the problem requirements


## 7. Brute Force Code (Iterative)

```javascript
function printAscendingIterative(A) {
    for (let i = 1; i <= A; i++) {
        console.log(i);
    }
}

// Test cases
printAscendingIterative(5);
// Output: 1 2 3 4 5
```


## 8. Dry Run of Brute Force Approach

Let's trace `printAscendingIterative(5)`:

```
Iteration 1: i = 1, Print: 1
Iteration 2: i = 2, Print: 2
Iteration 3: i = 3, Print: 3
Iteration 4: i = 4, Print: 4
Iteration 5: i = 5, Print: 5
Loop ends (i = 6, condition i <= 5 is false)
```


## 9. Time and Space Complexity of Brute Force

### Time Complexity: **O(A)**
- Loop runs A times
- Each iteration: O(1) work
- Total: O(A)

### Space Complexity: **O(1)**
- Only uses counter variable
- No recursion, no extra space
- Constant space


## 10. Visualization (Iterative)

```
printAscendingIterative(5)

Loop Execution:
┌─────────────────────────────────────┐
│ i = 1  →  Print: 1                  │
│ i = 2  →  Print: 2                  │
│ i = 3  →  Print: 3                  │
│ i = 4  →  Print: 4                  │
│ i = 5  →  Print: 5                  │
│ i = 6  →  Exit Loop                 │
└─────────────────────────────────────┘

Output: 1 2 3 4 5
```


## 11. Optimized Approach Description (Recursive Solution)

### The Recursive Strategy

The key insight: **Print AFTER the recursive call, not before!**

**Two Approaches:**

### Approach 1: Print After Recursion (Elegant)
```
function printAscending(A):
    if A <= 0:
        return
    printAscending(A - 1)  // Recurse first
    print(A)               // Print on the way back
```

### Approach 2: Use Helper Function (Intuitive)
```
function printAscending(current, A):
    if current > A:
        return
    print(current)          // Print current
    printAscending(current + 1, A)  // Increment and recurse
```

Both are valid! Approach 1 is more elegant, Approach 2 is more intuitive.


## 12. Optimized Approach Algorithm

### Method 1: Print on Stack Unwinding

**Algorithm:**
1. **Base case:** If A ≤ 0, return
2. **Recursive call:** Call function with A - 1
3. **Print:** After recursion returns, print A
4. **Result:** Numbers print 1 to A as stack unwinds

**Why it works:**
- Recursion goes down: A → A-1 → ... → 1 → 0
- Base case reached at 0
- Stack unwinds: 0 → 1 → 2 → ... → A
- Printing happens during unwinding: 1, 2, 3, ..., A

### Method 2: Helper Function with Counter

**Algorithm:**
1. **Main function:** Call helper(1, A)
2. **Helper base case:** If current > A, return
3. **Print:** Print current number
4. **Recursive call:** Call helper(current + 1, A)
5. **Result:** Numbers print 1 to A in order


## 13. Optimized Code (Recursive Solutions)

### Solution 1: Print After Recursion (Elegant)

```javascript
/**
 * Prints numbers from 1 to A using recursion
 * Prints AFTER recursive call (on stack unwinding)
 * @param {number} A - The ending number
 */
function printAscending(A) {
    // Base case: Stop when A reaches 0 or below
    if (A <= 0) {
        return;
    }
    
    // Recursive call FIRST (go deeper)
    printAscending(A - 1);
    
    // Print AFTER recursion (on the way back up)
    console.log(A);
}

// Test cases
console.log("Test Case 1: A = 5");
printAscending(5);
console.log(); // New line

console.log("Test Case 2: A = 3");
printAscending(3);
console.log(); // New line

console.log("Test Case 3: A = 1");
printAscending(1);
```

### Solution 2: Helper Function with Counter (Intuitive)

```javascript
/**
 * Prints numbers from 1 to A using recursion
 * Uses helper function with incrementing counter
 * @param {number} A - The ending number
 */
function printAscending(A) {
    function helper(current) {
        // Base case: Stop when current exceeds A
        if (current > A) {
            return;
        }
        
        // Print current number
        console.log(current);
        
        // Recursive call with incremented counter
        helper(current + 1);
    }
    
    // Start from 1
    helper(1);
}

// Test cases
printAscending(5);  // 1 2 3 4 5
printAscending(10); // 1 2 3 4 5 6 7 8 9 10
```

### Solution 3: Two Parameters (Alternative)

```javascript
/**
 * Prints numbers from current to A using recursion
 * @param {number} current - Current number to print
 * @param {number} A - The ending number
 */
function printAscending(current = 1, A) {
    // Base case: Stop when current exceeds A
    if (current > A) {
        return;
    }
    
    // Print current number
    console.log(current);
    
    // Recursive call with next number
    printAscending(current + 1, A);
}

// Usage
printAscending(1, 5);  // Explicitly pass starting point
```

### Solution 4: With Validation

```javascript
/**
 * Robust implementation with input validation
 */
function printAscendingSafe(A) {
    // Input validation
    if (typeof A !== 'number' || A < 1) {
        console.log("Invalid input. A must be a positive integer.");
        return;
    }
    
    if (!Number.isInteger(A)) {
        console.log("Error: Input must be an integer");
        return;
    }
    
    // Stack overflow prevention
    if (A > 10000) {
        console.log("Error: Input too large, risk of stack overflow");
        return;
    }
    
    // Helper function
    function helper(current) {
        if (current > A) {
            return;
        }
        console.log(current);
        helper(current + 1);
    }
    
    helper(1);
}
```


## 14. Dry Run of Optimized Approach

### Method 1: Print After Recursion

Let's trace `printAscending(5)` step by step:

```
Step 1: printAscending(5)
  - A = 5, A > 0, so continue
  - Call: printAscending(4)
  - (Waiting to print 5...)

Step 2: printAscending(4)
  - A = 4, A > 0, so continue
  - Call: printAscending(3)
  - (Waiting to print 4...)

Step 3: printAscending(3)
  - A = 3, A > 0, so continue
  - Call: printAscending(2)
  - (Waiting to print 3...)

Step 4: printAscending(2)
  - A = 2, A > 0, so continue
  - Call: printAscending(1)
  - (Waiting to print 2...)

Step 5: printAscending(1)
  - A = 1, A > 0, so continue
  - Call: printAscending(0)
  - (Waiting to print 1...)

Step 6: printAscending(0)
  - A = 0, A <= 0, BASE CASE
  - Return immediately (no print)

Step 7-11: Stack Unwinding (Functions return and print)
  - printAscending(0) returns to printAscending(1)
  - printAscending(1) now prints: 1
  - printAscending(1) returns to printAscending(2)
  - printAscending(2) now prints: 2
  - printAscending(2) returns to printAscending(3)
  - printAscending(3) now prints: 3
  - printAscending(3) returns to printAscending(4)
  - printAscending(4) now prints: 4
  - printAscending(4) returns to printAscending(5)
  - printAscending(5) now prints: 5
  - printAscending(5) completes

Output: 1 2 3 4 5 ✓
```

### Method 2: Helper with Counter

Let's trace `printAscending(5)` with helper:

```
Main Call: printAscending(5)
  - Calls: helper(1)

Step 1: helper(1)
  - current = 1, current <= 5
  - Print: 1
  - Call: helper(2)

Step 2: helper(2)
  - current = 2, current <= 5
  - Print: 2
  - Call: helper(3)

Step 3: helper(3)
  - current = 3, current <= 5
  - Print: 3
  - Call: helper(4)

Step 4: helper(4)
  - current = 4, current <= 5
  - Print: 4
  - Call: helper(5)

Step 5: helper(5)
  - current = 5, current <= 5
  - Print: 5
  - Call: helper(6)

Step 6: helper(6)
  - current = 6, current > 5, BASE CASE
  - Return

Output: 1 2 3 4 5 ✓
```

### Comparison Table

| Step | Method 1 (Print After) | Method 2 (Helper) |
|------|------------------------|-------------------|
| Call Pattern | Descending (5→4→3→2→1→0) | Ascending (1→2→3→4→5→6) |
| Print Timing | During unwinding | During descent |
| Intuition | Less obvious | More obvious |
| Elegance | More elegant | More intuitive |
| Output | 1 2 3 4 5 | 1 2 3 4 5 |


## 15. Time and Space Complexity

### Time Complexity: **O(A)**

**Analysis:**
- Function is called exactly A + 1 times
- Each call performs:
  - One comparison: O(1)
  - One print operation: O(1)
  - One recursive call: O(1)
- Total: (A + 1) × O(1) = **O(A)**

### Space Complexity: **O(A)**

**Analysis:**
- Call stack depth: A + 1 frames (maximum)
- Each frame stores:
  - Parameter(s): O(1)
  - Return address: O(1)
  - Local variables: O(1)
- Total: (A + 1) × O(1) = **O(A)**

### Call Stack Memory

```
Method 1: Print After Recursion
printAscending(5)  ← Frame 1
  printAscending(4)  ← Frame 2
    printAscending(3)  ← Frame 3
      printAscending(2)  ← Frame 4
        printAscending(1)  ← Frame 5
          printAscending(0)  ← Frame 6 (Base case)

Method 2: Helper Function
helper(1)  ← Frame 1
  helper(2)  ← Frame 2
    helper(3)  ← Frame 3
      helper(4)  ← Frame 4
        helper(5)  ← Frame 5
          helper(6)  ← Frame 6 (Base case)

Both use O(A) space on call stack
```


## 16. Visualization

### Method 1: Print After Recursion

```
printAscending(5) execution:

Phase 1: Building the Stack (Going Down)
═══════════════════════════════════════════

Call Stack Growing:
┌─────────────────┐
│ printAscending(5) │  → Call printAscending(4)
└─────────────────┘
         ↓
┌─────────────────┐
│ printAscending(5) │
├─────────────────┤
│ printAscending(4) │  → Call printAscending(3)
└─────────────────┘
         ↓
┌─────────────────┐
│ printAscending(5) │
├─────────────────┤
│ printAscending(4) │
├─────────────────┤
│ printAscending(3) │  → Call printAscending(2)
└─────────────────┘
         ↓
┌─────────────────┐
│ printAscending(5) │
├─────────────────┤
│ printAscending(4) │
├─────────────────┤
│ printAscending(3) │
├─────────────────┤
│ printAscending(2) │  → Call printAscending(1)
└─────────────────┘
         ↓
┌─────────────────┐
│ printAscending(5) │
├─────────────────┤
│ printAscending(4) │
├─────────────────┤
│ printAscending(3) │
├─────────────────┤
│ printAscending(2) │
├─────────────────┤
│ printAscending(1) │  → Call printAscending(0)
└─────────────────┘
         ↓
┌─────────────────┐
│ printAscending(5) │
├─────────────────┤
│ printAscending(4) │
├─────────────────┤
│ printAscending(3) │
├─────────────────┤
│ printAscending(2) │
├─────────────────┤
│ printAscending(1) │
├─────────────────┤
│ printAscending(0) │  → BASE CASE, Return
└─────────────────┘

Phase 2: Unwinding the Stack (Coming Back Up)
═══════════════════════════════════════════

┌─────────────────┐
│ printAscending(5) │
├─────────────────┤
│ printAscending(4) │
├─────────────────┤
│ printAscending(3) │
├─────────────────┤
│ printAscending(2) │
├─────────────────┤
│ printAscending(1) │  ← Print: 1 ✓
└─────────────────┘
         ↓
┌─────────────────┐
│ printAscending(5) │
├─────────────────┤
│ printAscending(4) │
├─────────────────┤
│ printAscending(3) │
├─────────────────┤
│ printAscending(2) │  ← Print: 2 ✓
└─────────────────┘
         ↓
┌─────────────────┐
│ printAscending(5) │
├─────────────────┤
│ printAscending(4) │
├─────────────────┤
│ printAscending(3) │  ← Print: 3 ✓
└─────────────────┘
         ↓
┌─────────────────┐
│ printAscending(5) │
├─────────────────┤
│ printAscending(4) │  ← Print: 4 ✓
└─────────────────┘
         ↓
┌─────────────────┐
│ printAscending(5) │  ← Print: 5 ✓
└─────────────────┘

Output Sequence: 1 → 2 → 3 → 4 → 5
```

### Method 2: Helper Function

```
printAscending(5) with helper(1, 5):

Execution Flow (Linear):
┌──────────────────────────────────────┐
│ helper(1) → Print: 1 → Call helper(2) │
├──────────────────────────────────────┤
│ helper(2) → Print: 2 → Call helper(3) │
├──────────────────────────────────────┤
│ helper(3) → Print: 3 → Call helper(4) │
├──────────────────────────────────────┤
│ helper(4) → Print: 4 → Call helper(5) │
├──────────────────────────────────────┤
│ helper(5) → Print: 5 → Call helper(6) │
├──────────────────────────────────────┤
│ helper(6) → Base Case → Return        │
└──────────────────────────────────────┘

Output: 1 2 3 4 5 (printed during descent, not unwinding)
```


## 17. Edge Cases to Consider

### 1. **A = 1**
```javascript
printAscending(1);
// Output: 1
// Simplest case, one number
```

### 2. **A = 0**
```javascript
printAscending(0);
// Output: (nothing)
// Base case, no numbers to print
```

### 3. **Negative Input**
```javascript
printAscending(-5);
// Output: (nothing)
// Should handle gracefully, no print
```

### 4. **Very Large Input**
```javascript
printAscending(100000);
// Risk: Stack overflow
// Solution: Use iteration or increase stack size
```

### 5. **Non-Integer Input**
```javascript
printAscending(5.7);
// Issue: Unexpected behavior
// Solution: Add integer validation
```

### 6. **Non-Numeric Input**
```javascript
printAscending("abc");
// Issue: Type error
// Solution: Add type checking
```


## 18. Key Takeaways

### a. Applications

1. **Sequential Processing**
   - Processing items in order
   - Generating sequences
   - Iteration patterns

2. **Tree Traversals**
   - Inorder traversal (left, root, right)
   - Understanding recursion order
   - Stack-based algorithms

3. **Backtracking**
   - Generating solutions incrementally
   - Building from base to complete solution
   - Incremental construction

4. **Number Generation**
   - Sequence generation
   - Pattern creation
   - Range iteration

### b. Interview Strategy

**Key Points to Discuss:**

1. **Two Valid Approaches**
   - Print after recursion (elegant)
   - Helper with counter (intuitive)
   - Both are acceptable!

2. **Understanding Call Stack**
   - Explain going down vs. coming back up
   - Show when printing happens
   - Visualize stack frames

3. **Compare with Print A to 1**
   - Print before vs. after recursive call
   - Descending vs. ascending output
   - Stack building vs. unwinding

4. **Complexity Analysis**
   - Time: O(A)
   - Space: O(A) due to call stack
   - Compare with O(1) iterative space

**Follow-up Questions:**
- "How would you print in descending order?"
- "Can you do this with O(1) space?"
- "What if A is very large?"
- "Can you print even numbers only?"

### c. Common Mistakes

1. **Printing Before Recursion**
```javascript
// ❌ WRONG: Prints in descending order
function printAscending(A) {
    if (A <= 0) return;
    console.log(A);  // Wrong order!
    printAscending(A - 1);
}
// Output: 5 4 3 2 1 (descending!)
```

2. **Wrong Base Case**
```javascript
// ❌ WRONG: Doesn't print 1
function printAscending(A) {
    if (A <= 1) return;  // Returns too early
    printAscending(A - 1);
    console.log(A);
}
// Output: 2 3 4 5 (missing 1!)
```

3. **Infinite Recursion**
```javascript
// ❌ WRONG: No base case
function printAscending(A) {
    printAscending(A - 1);
    console.log(A);
}
```

4. **Not Decrementing**
```javascript
// ❌ WRONG: Same value repeated
function printAscending(A) {
    if (A <= 0) return;
    printAscending(A);  // Infinite loop!
    console.log(A);
}
```

### d. Related Problems

**Beginner:**
1. Print A to 1 (opposite)
2. Print even numbers 1 to A
3. Print odd numbers 1 to A
4. Sum of 1 to A

**Intermediate:**
5. Print array elements recursively
6. Reverse an array recursively
7. Find sum of digits
8. Generate Fibonacci sequence

**Advanced:**
9. Print all permutations
10. Generate all subsets
11. Tree traversals (inorder, preorder, postorder)
12. Backtracking problems

### e. Performance

**Comparison:**

| Approach | Time | Space | Use Case |
|----------|------|-------|----------|
| Recursive (Method 1) | O(A) | O(A) | Learning recursion |
| Recursive (Method 2) | O(A) | O(A) | More intuitive |
| Iterative | O(A) | O(1) | Production code |

**When to Use:**

- **Recursive:** Learning, interviews, small A
- **Iterative:** Production, large A, performance-critical


## Summary

Print 1 to A demonstrates:

✅ **Recursion order matters:** Print before vs. after  
✅ **Stack unwinding:** Output during return phase  
✅ **Multiple valid solutions:** Different approaches, same result  
✅ **Foundation for complex recursion:** Tree traversals, backtracking  

Master this pattern, and you'll understand how recursion order affects output!


**Next Steps:**
- Try printing only even/odd numbers
- Implement recursive array printing
- Practice recursive sum calculation
- Explore tree traversal patterns

Happy Coding! 🚀

