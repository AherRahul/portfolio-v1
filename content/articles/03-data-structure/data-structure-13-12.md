---
title: "Tower of Hanoi using Recursion"
description: "Solve the classic Tower of Hanoi puzzle using recursion. Master complex recursive problem-solving, understand divide-and-conquer strategy, and learn how recursion elegantly solves seemingly complex problems."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Tower of Hanoi Visualizer"
    type: "tool"
    url: "https://www.mathsisfun.com/games/towerofhanoi.html"
    description: "Interactive Tower of Hanoi game"
  - title: "Recursion Deep Dive"
    type: "article"
    url: "https://www.geeksforgeeks.org/c-program-for-tower-of-hanoi/"
    description: "Comprehensive Tower of Hanoi guide"
---


![Recursion Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Solve the Classic Tower of Hanoi Puzzle Using Recursion

## 2. Problem Statement

In the classic problem of the **Towers of Hanoi**, you have **3 towers** numbered from **1 to 3** (left to right) and **A disks** numbered from **1 to A** (top to bottom) of different sizes which can slide onto any tower.

The puzzle starts with disks sorted in **ascending order of size from top to bottom** (i.e., each disk sits on top of an even larger one).

**You have the following constraints:**
1. Only **one disk** can be moved at a time
2. A disk is slid off the **top** of one tower onto another tower
3. A disk **cannot be placed on top of a smaller disk**

**You have to find the solution** to the Tower of Hanoi problem.

You have to return a **2D array of dimensions M × 3**, where **M is the minimum number of moves** needed to solve the problem.

In each row, there should be **3 integers (disk, start, end)**, where:
- **disk** - number of the disk being moved
- **start** - number of the tower from which the disk is being moved
- **end** - number of the tower to which the disk is being moved

**Input:**
- Number of disks `A` (1 ≤ A ≤ 20)

**Output:**
- 2D array of moves: [[disk, from, to], ...]

## 3. Examples

### Example 1:
```
Input: A = 2
Output: [[1,1,2], [2,1,3], [1,2,3]]
Explanation:
Move disk 1 from tower 1 to tower 2
Move disk 2 from tower 1 to tower 3
Move disk 1 from tower 2 to tower 3
```

### Example 2:
```
Input: A = 3
Output:
[[1,1,3], [2,1,2], [1,3,2], [3,1,3], [1,2,1], [2,2,3], [1,1,3]]
```

### Example 3:
```
Input: A = 1
Output: [[1,1,3]]
Explanation: Simply move disk 1 from tower 1 to tower 3
```

## 4. Constraints

- `1 ≤ A ≤ 20`
- Must use recursion
- Return all moves in order
- Minimum number of moves = 2^A - 1

## 5. Important Points

### Problem Breakdown

**Goal:** Move all disks from tower 1 to tower 3

**Strategy (for N disks):**
1. Move top N-1 disks from source to auxiliary (using destination)
2. Move disk N from source to destination
3. Move N-1 disks from auxiliary to destination (using source)

### Key Insights

- **Recursive subproblem:** Solving for N disks requires solving for N-1 disks
- **Three towers:** Source, Destination, Auxiliary (changes in recursion)
- **Minimum moves:** 2^N - 1 (proven mathematically)

### Visualization for 3 Disks:
```
Initial:     Goal:
Tower1       Tower3
  |            |
 [1]          [1]
 [2]          [2]
 [3]          [3]
```

## 6. Brute Force Approach

There's no "brute force" for Tower of Hanoi - the recursive solution IS the optimal approach! Trying all permutations would be exponentially worse.

## 7. Brute Force Code

N/A - Recursion is the standard and optimal approach.

## 8. Dry Run of Brute Force

N/A

## 9. Time and Space Complexity of Brute Force

N/A

## 10. Visualization (Conceptual)

```
Problem: Move 3 disks from Tower 1 to Tower 3

Step 1: Move 2 disks (1,2) from T1 to T2 (using T3)
Step 2: Move disk 3 from T1 to T3
Step 3: Move 2 disks (1,2) from T2 to T3 (using T1)

Each "move N disks" is itself a Tower of Hanoi problem!
```

## 11. Optimized Approach Description

**Recursive Algorithm:**

```
hanoi(n, source, destination, auxiliary):
    if n == 1:
        move disk 1 from source to destination
        return
    
    // Step 1: Move n-1 disks to auxiliary
    hanoi(n-1, source, auxiliary, destination)
    
    // Step 2: Move disk n to destination
    move disk n from source to destination
    
    // Step 3: Move n-1 disks from auxiliary to destination
    hanoi(n-1, auxiliary, destination, source)
```

## 12. Optimized Approach Algorithm

1. **Base case:** If n=1, simply move disk from source to destination
2. **Step 1:** Recursively move n-1 disks from source to auxiliary
3. **Step 2:** Move disk n from source to destination
4. **Step 3:** Recursively move n-1 disks from auxiliary to destination

## 13. Optimized Code

```javascript
/**
 * Solve Tower of Hanoi using recursion
 * @param {number} A - Number of disks
 * @returns {Array} - 2D array of moves
 */
function towerOfHanoi(A) {
    const moves = [];
    
    function hanoi(n, source, destination, auxiliary) {
        // Base case: only 1 disk
        if (n === 1) {
            moves.push([1, source, destination]);
            return;
        }
        
        // Step 1: Move n-1 disks from source to auxiliary
        hanoi(n - 1, source, auxiliary, destination);
        
        // Step 2: Move disk n from source to destination
        moves.push([n, source, destination]);
        
        // Step 3: Move n-1 disks from auxiliary to destination
        hanoi(n - 1, auxiliary, destination, source);
    }
    
    // Start: move A disks from tower 1 to tower 3 (using tower 2)
    hanoi(A, 1, 3, 2);
    
    return moves;
}

// Test cases
console.log(towerOfHanoi(1));
// [[1,1,3]]

console.log(towerOfHanoi(2));
// [[1,1,2], [2,1,3], [1,2,3]]

console.log(towerOfHanoi(3));
// [[1,1,3], [2,1,2], [1,3,2], [3,1,3], [1,2,1], [2,2,3], [1,1,3]]
```

### With Move Counter

```javascript
function towerOfHanoiWithCount(A) {
    const moves = [];
    let moveCount = 0;
    
    function hanoi(n, source, destination, auxiliary) {
        if (n === 1) {
            moveCount++;
            moves.push([1, source, destination]);
            return;
        }
        
        hanoi(n - 1, source, auxiliary, destination);
        moveCount++;
        moves.push([n, source, destination]);
        hanoi(n - 1, auxiliary, destination, source);
    }
    
    hanoi(A, 1, 3, 2);
    
    console.log(`Total moves: ${moveCount}`);
    console.log(`Formula 2^${A} - 1 = ${Math.pow(2, A) - 1}`);
    
    return moves;
}
```

### Iterative Approach (Advanced)

```javascript
function towerOfHanoiIterative(A) {
    const moves = [];
    const totalMoves = Math.pow(2, A) - 1;
    
    for (let i = 1; i <= totalMoves; i++) {
        // Determine which disk to move
        // Complex bit manipulation logic
        // (Recursive is more intuitive!)
    }
    
    return moves;
}
```

## 14. Dry Run of Optimized Approach

```
towerOfHanoi(3):

Call: hanoi(3, 1, 3, 2)
  n=3, source=1, dest=3, aux=2
  
  Step 1: hanoi(2, 1, 2, 3)
    n=2, source=1, dest=2, aux=3
    
    Step 1a: hanoi(1, 1, 3, 2)
      n=1, BASE CASE
      Move: [1, 1, 3]
    
    Step 2a: Move [2, 1, 2]
    
    Step 3a: hanoi(1, 3, 2, 1)
      n=1, BASE CASE
      Move: [1, 3, 2]
  
  Step 2: Move [3, 1, 3]
  
  Step 3: hanoi(2, 2, 3, 1)
    n=2, source=2, dest=3, aux=1
    
    Step 1b: hanoi(1, 2, 1, 3)
      n=1, BASE CASE
      Move: [1, 2, 1]
    
    Step 2b: Move [2, 2, 3]
    
    Step 3b: hanoi(1, 1, 3, 2)
      n=1, BASE CASE
      Move: [1, 1, 3]

Final Moves:
[
  [1,1,3],  // Move disk 1: T1 → T3
  [2,1,2],  // Move disk 2: T1 → T2
  [1,3,2],  // Move disk 1: T3 → T2
  [3,1,3],  // Move disk 3: T1 → T3
  [1,2,1],  // Move disk 1: T2 → T1
  [2,2,3],  // Move disk 2: T2 → T3
  [1,1,3]   // Move disk 1: T1 → T3
]

Total: 7 moves (2^3 - 1 = 7) ✓
```

## 15. Time and Space Complexity

### Time Complexity: **O(2^A)**

**Analysis:**
- Each call makes 2 recursive calls
- Forms a binary tree of calls
- Height = A
- Total nodes = 2^A - 1
- Each node: O(1) work
- **Total: O(2^A)**

**Recurrence:**
```
T(n) = 2×T(n-1) + O(1)
T(1) = O(1)
Solution: T(n) = O(2^n)
```

### Space Complexity: **O(A)**

**Analysis:**
- Recursion depth: A
- Each frame: O(1) space
- Moves array: O(2^A) space
- **Total: O(2^A)** for output, O(A) for recursion

### Move Count Formula

Number of moves = **2^A - 1**

Proof by induction:
- Base: A=1, moves = 1 = 2^1 - 1 ✓
- Step: If T(n-1) = 2^(n-1) - 1, then
  T(n) = T(n-1) + 1 + T(n-1)
       = 2×(2^(n-1) - 1) + 1
       = 2^n - 2 + 1
       = 2^n - 1 ✓

## 16. Visualization

```
Recursion Tree for Hanoi(3):

                    hanoi(3, 1→3, aux=2)
                   /       |       \
            hanoi(2, 1→2)  move(3)  hanoi(2, 2→3)
           /     |     \             /     |     \
    hanoi(1) move(2) hanoi(1)  hanoi(1) move(2) hanoi(1)
       |                |          |                |
    move(1)          move(1)    move(1)          move(1)

Total leaf nodes (actual moves): 7 = 2^3 - 1
```

### State Visualization for 3 Disks:

```
Initial:    After 1:     After 2:     After 3:
T1 T2 T3    T1 T2 T3    T1 T2 T3    T1 T2 T3
[1]         [] [1] []   [] [1] []   [] []  []
[2] [] []   [2] [] []   [] [2] []   [] [2] [1]
[3]         [3]         [3]         [3]

After 4:    After 5:     After 6:     After 7:
T1 T2 T3    T1 T2 T3    T1 T2 T3    T1 T2 T3
[] []  []   [1] [] []   [1] [] []   [] []  [1]
[] [2] []   [] [2] []   [] []  [2]  [] []  [2]
[] []  [3]  [] []  [3]  [] []  [3]  [] []  [3]
```

## 17. Edge Cases

### Single Disk
```javascript
towerOfHanoi(1);
// [[1,1,3]] - Just one move
```

### Two Disks
```javascript
towerOfHanoi(2);
// [[1,1,2], [2,1,3], [1,2,3]] - 3 moves
```

### Large Number (A=20)
```javascript
towerOfHanoi(20);
// 2^20 - 1 = 1,048,575 moves!
// Takes time but computes correctly
```

## 18. Key Takeaways

### a. Applications

1. **Computer Science**
   - Recursion teaching example
   - Stack manipulation
   - Algorithm design

2. **Mathematics**
   - Exponential growth
   - Proof by induction
   - Combinatorics

3. **Real World**
   - Backup rotation strategies
   - Undo/redo implementations
   - State machine transitions

4. **Puzzle Solving**
   - Logic problems
   - Sequential planning
   - Constraint satisfaction

### b. Interview Strategy

**Key Points:**

1. **Explain the Three Steps**
   - Move n-1 disks to auxiliary
   - Move largest disk to destination
   - Move n-1 disks from auxiliary to destination

2. **Draw for Small N**
   - Show N=2 or N=3 visually
   - Demonstrate the recursion

3. **Discuss Complexity**
   - Time: O(2^N)
   - Space: O(N) recursion + O(2^N) output
   - Minimum moves: 2^N - 1

4. **Mention Variants**
   - 4 towers (Frame-Stewart algorithm)
   - Iterative solution
   - Different movement rules

**Follow-up Questions:**
- "Can you do it with 4 towers?"
- "What's the minimum number of moves?"
- "Can you prove the formula?"
- "Can you do it iteratively?"

### c. Common Mistakes

1. **Wrong Tower Order**
```javascript
// ❌ WRONG: Confused tower assignments
hanoi(n-1, source, destination, auxiliary);
// Should be: source to auxiliary!
```

2. **Missing Base Case**
```javascript
// ❌ WRONG: Infinite recursion
function hanoi(n, s, d, a) {
    hanoi(n-1, s, a, d);
    // Forgot: if (n === 1) return;
}
```

3. **Wrong Disk Number**
```javascript
// ❌ WRONG: Always pushing 1
moves.push([1, source, dest]);
// Should push current disk number n
```

4. **Incorrect Step Order**
```javascript
// ❌ WRONG: Steps out of order
hanoi(n-1, aux, dest, source);  // Step 3
moves.push([n, source, dest]);   // Step 2
hanoi(n-1, source, aux, dest);  // Step 1
// Steps must be in order: 1, 2, 3!
```

### d. Related Problems

**Beginner:**
1. **Fibonacci** - Similar recursive structure
2. **Factorial** - Linear recursion
3. **Binary Tree Traversal** - Tree recursion

**Intermediate:**
4. **N-Queens** - Backtracking with recursion
5. **Subset Generation** - Recursive enumeration
6. **Permutations** - Recursive generation
7. **Merge Sort** - Divide and conquer

**Advanced:**
8. **Tower of Hanoi with 4 Towers** - Frame-Stewart
9. **Restricted Tower of Hanoi** - Additional constraints
10. **Iterative Tower of Hanoi** - Stack-based
11. **Tower of Hanoi Variants** - Different rules

### e. Performance

**Growth Rate:**

| Disks | Moves | Time (approx) |
|-------|-------|---------------|
| 3 | 7 | Instant |
| 10 | 1,023 | < 1ms |
| 15 | 32,767 | < 10ms |
| 20 | 1,048,575 | ~1 second |
| 25 | 33,554,431 | ~30 seconds |
| 30 | 1,073,741,823 | ~17 minutes |

**Interesting Facts:**

- Legend: Monks moving 64 golden disks
- 2^64 - 1 moves ≈ 18 quintillion
- At 1 move per second: 585 billion years!
- Age of universe: only 13.8 billion years

**Optimization:**

- **Can't optimize moves:** 2^N - 1 is minimum
- **Can optimize space:** Iterative approach uses O(1) stack space
- **Can parallelize:** Not easily (sequential dependency)

## Summary

Tower of Hanoi is the **ultimate recursion example**!

✅ **Perfect Recursion:** Self-similar subproblems  
✅ **Elegant Solution:** Complex problem, simple code  
✅ **Exponential Growth:** Real-world demonstration  
✅ **Mathematical Beauty:** Provable minimum moves  
✅ **Teaching Tool:** Best for understanding recursion  

**Key Formula:** Minimum moves = **2^N - 1**

**Master this problem, and you've mastered recursion!**

**Next Steps:**
- Try implementing with 4 towers
- Solve iteratively using stack
- Explore animation/visualization
- Study Frame-Stewart algorithm
- Practice proof by induction

Happy Coding! 🚀

