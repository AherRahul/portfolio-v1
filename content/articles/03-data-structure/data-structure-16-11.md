---
title: "Painter's Partition Problem using Binary Search"
description: "Minimize maximum work using binary search on answer. Master partition optimization, handle constraints, and solve allocation problems efficiently."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Searching Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Painter's Partition Problem

## 2. Problem Statement

You have to paint **N** boards of length `A[i]`. **K** painters are available. Each painter takes **1 unit time** to paint **1 unit of board**. A painter can only paint **contiguous** sections.

Find the **minimum time** to paint all boards.

**Input:**
- Integer `K` (painters)
- Array `A` (board lengths)

**Output:**
- Minimum time (mod 10^7)

## 3. Examples

```
Input: K = 2, A = [10, 10, 10, 10]
Output: 20
Explanation: P1: [10,10], P2: [10,10]

Input: K = 2, A = [10, 20, 30, 40]
Output: 60
Explanation: P1: [10,20,30], P2: [40]

Input: K = 3, A = [10, 20, 60, 50, 30, 40]
Output: 90
Explanation: P1:[10,20,60], P2:[50,30], P3:[40]
```

## 4. Constraints

- `1 ≤ K ≤ 10`
- `1 ≤ N ≤ 10^5`
- `1 ≤ A[i] ≤ 10^7`

## 5. Important Points

**Binary Search Range:**
```
Min time: max(A) (one painter, longest board)
Max time: sum(A) (one painter, all boards)
```

**Feasibility Check:**
Check if all boards can be painted in given time with K painters.

## 6. Brute Force Approach

Try all possible partitions.

## 7. Brute Force Code

```javascript
function paintersPartitionBrute(K, A) {
    // Exponential time - try all partitions
    // Not practical for implementation
}
```

## 8. Dry Run

```
K=2, A=[10,20,30,40]

All partitions:
[10][20,30,40] → max(10, 90) = 90
[10,20][30,40] → max(30, 70) = 70
[10,20,30][40] → max(60, 40) = 60 ✓ minimum

Result: 60
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(K^N)  
**Space:** O(N)

## 10. Visualization

```
K=2, A=[10,20,30,40]

Partition: [10,20,30] | [40]
P1: 10+20+30 = 60
P2: 40

Max time: 60
```

## 11. Optimized Approach Description

Binary search on answer (time). For each time, check if it's feasible to paint all boards with K painters.

## 12. Optimized Approach Algorithm

```
1. left = max(A), right = sum(A)
2. Binary search:
   - Check if 'mid' time is feasible
   - If feasible: right = mid
   - Else: left = mid + 1
3. Return left % MOD

isFeasible(A, K, maxTime):
  painters = 1, currentSum = 0
  For each board:
    If currentSum + board > maxTime:
      painters++
      currentSum = board
    Else:
      currentSum += board
  Return painters <= K
```

## 13. Optimized Code

```javascript
function paintersPartition(K, A) {
    const MOD = 10000007;
    
    if (K >= A.length) {
        return (Math.max(...A)) % MOD;
    }
    
    let left = Math.max(...A);
    let right = A.reduce((sum, val) => sum + val, 0);
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (isFeasible(A, K, mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    
    return left % MOD;
}

function isFeasible(A, K, maxTime) {
    let painters = 1;
    let currentSum = 0;
    
    for (const board of A) {
        if (currentSum + board > maxTime) {
            painters++;
            currentSum = board;
            
            if (painters > K) {
                return false;
            }
        } else {
            currentSum += board;
        }
    }
    
    return true;
}

// Test cases
console.log(paintersPartition(2, [10, 10, 10, 10])); // 20
console.log(paintersPartition(2, [10, 20, 30, 40])); // 60
console.log(paintersPartition(3, [10, 20, 60, 50, 30, 40])); // 90
```

## 14. Dry Run

```
K=2, A=[10,20,30,40]
left=40, right=100

Iteration 1:
mid=70
isFeasible(70):
  P1: 10+20+30=60 ✓
  P2: 40 ✓
  2 painters ✓ feasible
right=70

Iteration 2:
mid=55
isFeasible(55):
  P1: 10+20=30, 30+30=60>55 stop
  P2: 30
  P3: 40
  3 painters > 2 ✗ not feasible
left=56

...continue until left=60
```

## 15. Time and Space Complexity

**Time:** O(N * log(sum - max))  
**Space:** O(1)

## 16. Visualization

```
K=2, A=[10,20,30,40]

Binary search range: [40, 100]

Check time=60:
Painter 1: 10+20+30 = 60 ✓
Painter 2: 40 ✓
Feasible with 2 painters!

Check time=50:
Painter 1: 10+20 = 30, 30+30 > 50 stop
Painter 2: 30
Painter 3: 40
Need 3 painters ✗

Answer: 60
```

## 17. Edge Cases

```javascript
// K >= N (each board to one painter)
paintersPartition(5, [10, 20, 30]); // 30

// K = 1 (one painter all boards)
paintersPartition(1, [10, 20, 30]); // 60

// All same length
paintersPartition(2, [10, 10, 10, 10]); // 20

// One very large board
paintersPartition(2, [1, 1, 1, 100]); // 100
```

## 18. Key Takeaways

### a. Applications
- Task scheduling
- Load balancing
- Resource allocation
- Parallel processing

### b. Interview Strategy
- Binary search on answer
- Feasibility check function
- Explain greedy allocation
- Handle edge cases

### c. Common Mistakes
- Wrong search range
- Incorrect feasibility logic
- Not handling K >= N
- Forgetting modulo

### d. Related Problems
- Allocate Books
- Split Array Largest Sum
- Capacity To Ship Packages
- Aggressive Cows

### e. Performance
- O(N log S) optimal
- Binary search on answer
- Greedy feasibility check
- Handles large inputs

## Summary

✅ **Binary Search on Answer:** [max, sum]  
✅ **Feasibility Check:** Greedy allocation  
✅ **Minimize Maximum:** Classic pattern  

Happy Coding! 🚀

