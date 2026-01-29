---
title: "Problem - Counting Subarrays Easy"
description: "Master various subarray counting techniques. Learn to count subarrays satisfying different conditions efficiently and understand pattern recognition in counting problems."
dateModified: 2026-02-08
datePublished: 2026-02-08
topics:
  - data-structures
courseName: 03-data-structure
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Problem Statement

Given an array of integers and a specific condition, count the number of **subarrays** that satisfy that condition.

A **subarray** is a contiguous part of an array. For an array of length `N`, there are `N*(N+1)/2` possible subarrays.

**Common Counting Problems:**
1. Count subarrays with sum equal to K
2. Count subarrays with sum divisible by K
3. Count subarrays with at least K elements
4. Count subarrays with all positive/negative elements
5. Count subarrays with specific patterns

**Input:**
- An integer array `arr[]` of size `N`
- A condition or target value `K`

**Output:**
- Return the count of subarrays satisfying the given condition


## Examples

### Example 1: Count Subarrays with Sum = K
**Input:** `arr = [1, 2, 3, 4, 5]`, `K = 5`  
**Output:** `2`

**Explanation:**
```
Subarrays with sum = 5:
1. [2, 3] → sum = 5
2. [5] → sum = 5

Total count = 2
```

### Example 2: Count Subarrays with Positive Sum
**Input:** `arr = [1, -2, 3, -4, 5]`  
**Output:** `7`

**Explanation:**
```
Subarrays with positive sum:
[1], [3], [5], [1, -2, 3], [3, -4, 5], [-2, 3], [-4, 5]

Total count = 7
```

### Example 3: Count Subarrays with Length ≥ 2
**Input:** `arr = [1, 2, 3]`  
**Output:** `3`

**Explanation:**
```
All possible subarrays: [1], [2], [3], [1,2], [2,3], [1,2,3]
Subarrays with length ≥ 2: [1,2], [2,3], [1,2,3]

Total count = 3
```


## Constraints

- **Array size:** `1 ≤ N ≤ 10^5`
- **Element range:** `-10^9 ≤ arr[i] ≤ 10^9`
- **Target value:** `-10^9 ≤ K ≤ 10^9`
- **Time limit:** O(N) or O(N²) depending on problem complexity
- **Space limit:** O(N) for hash maps if needed

---

## Important Points to Understand

1. **Total Subarrays Formula:**
   - For array of length N: Total subarrays = `N * (N + 1) / 2`
   - Example: N=4 → 4×5/2 = 10 subarrays

2. **Counting vs Generation:**
   - **Counting:** Only need the count (can optimize)
   - **Generation:** Need to list/process each subarray (always O(N²) or O(N³))

3. **Common Patterns:**
   - **Prefix Sum:** For sum-based counting problems
   - **Hash Map:** To track previous states and count efficiently
   - **Two Pointers:** For monotonic conditions
   - **Mathematical Formula:** For pattern-based counting

4. **Optimization Techniques:**
   - Avoid generating all subarrays if only counting is needed
   - Use cumulative properties (prefix sums, running counts)
   - HashMap to store intermediate results


## Approach

### General Strategy for Counting Problems

**Pattern Recognition:**
1. Identify if it's a sum-based, length-based, or element-based condition
2. Choose appropriate technique:
   - **Prefix Sum + HashMap** for sum conditions
   - **Mathematical Formula** for length conditions
   - **Two Pointers** for monotonic conditions
   - **Nested Loops** for complex conditions

**Algorithm Framework:**
```
1. Initialize count = 0
2. For each starting position i:
   3. For each ending position j (from i onwards):
      4. Check if subarray [i...j] satisfies condition
      5. If yes, increment count
6. Return count
```


## Time Complexity

**Approach 1: Brute Force with Sum Calculation**
- **Time:** O(N³) - three nested loops
- Generate all subarrays: O(N²)
- Calculate sum for each: O(N)
- Total: O(N² × N) = O(N³)

**Approach 2: Optimized with Cumulative Sum**
- **Time:** O(N²)
- Two nested loops: O(N²)
- Track running sum: O(1) per iteration
- Total: O(N²)

**Approach 3: Optimal with HashMap (for sum = K)**
- **Time:** O(N)
- Single pass through array
- HashMap operations: O(1) average
- Total: O(N)


## Space Complexity

**Brute Force:** O(1)
- Only counting, no extra data structures

**HashMap Approach:** O(N)
- Store prefix sums in hash map
- Worst case: all unique prefix sums


## Dry Run

### Example: Count Subarrays with Sum = 5
**Input:** `arr = [1, 2, 2, 1]`, `K = 5`

**Using Nested Loop Approach:**

```
i=0, j=0: [1] → sum=1 (no)
i=0, j=1: [1,2] → sum=3 (no)
i=0, j=2: [1,2,2] → sum=5 (yes) ✓ count=1
i=0, j=3: [1,2,2,1] → sum=6 (no)

i=1, j=1: [2] → sum=2 (no)
i=1, j=2: [2,2] → sum=4 (no)
i=1, j=3: [2,2,1] → sum=5 (yes) ✓ count=2

i=2, j=2: [2] → sum=2 (no)
i=2, j=3: [2,1] → sum=3 (no)

i=3, j=3: [1] → sum=1 (no)

Final count = 2
```


## Brute Force Approach

### Approach 1: Generate All Subarrays and Check

```javascript
function countSubarraysWithSumBrute(arr, K) {
    const N = arr.length;
    let count = 0;
    
    // Try all possible subarrays
    for (let i = 0; i < N; i++) {
        let sum = 0;
        for (let j = i; j < N; j++) {
            sum += arr[j];
            
            // Check if current subarray [i...j] satisfies condition
            if (sum === K) {
                count++;
            }
        }
    }
    
    return count;
}

console.log(countSubarraysWithSumBrute([1, 2, 3], 3)); 
// Output: 2 ([3] and [1,2])
```

**Time Complexity:** O(N²)  
**Space Complexity:** O(1)


## Visualization

### All Subarrays for arr = [1, 2, 3]:

```
Length 1: [1], [2], [3]           → 3 subarrays
Length 2: [1,2], [2,3]            → 2 subarrays  
Length 3: [1,2,3]                 → 1 subarray

Total: 3 + 2 + 1 = 6 subarrays
Formula: N×(N+1)/2 = 3×4/2 = 6 ✓
```

### Counting Pattern:

```
For each starting index i:
  i=0: can form N subarrays [0..0], [0..1], ..., [0..N-1]
  i=1: can form N-1 subarrays [1..1], [1..2], ..., [1..N-1]
  i=2: can form N-2 subarrays [2..2], [2..3], ..., [2..N-1]
  ...
  
Total = N + (N-1) + (N-2) + ... + 1 = N×(N+1)/2
```


## Multiple Optimized Approaches

### Approach 1: Count Subarrays with Specific Sum (Using HashMap)

```javascript
function countSubarraysWithSum(arr, K) {
    const N = arr.length;
    const prefixSumCount = new Map();
    
    let count = 0;
    let prefixSum = 0;
    
    // Initialize: empty prefix has sum 0
    prefixSumCount.set(0, 1);
    
    for (let i = 0; i < N; i++) {
        prefixSum += arr[i];
        
        // Check if (prefixSum - K) exists
        // If yes, those subarrays ending at i have sum = K
        if (prefixSumCount.has(prefixSum - K)) {
            count += prefixSumCount.get(prefixSum - K);
        }
        
        // Add current prefix sum to map
        prefixSumCount.set(prefixSum, (prefixSumCount.get(prefixSum) || 0) + 1);
    }
    
    return count;
}

console.log(countSubarraysWithSum([1, 2, 3], 3)); 
// Output: 2
console.log(countSubarraysWithSum([1, -1, 1, -1], 0)); 
// Output: 4
```

**Time Complexity:** O(N)  
**Space Complexity:** O(N)

### Approach 2: Count Subarrays with Length at Least K

```javascript
function countSubarraysLengthAtLeastK(arr, K) {
    const N = arr.length;
    
    if (K > N) return 0;
    
    // For each starting position
    let count = 0;
    for (let i = 0; i <= N - K; i++) {
        // Count how many subarrays of length >= K start at i
        count += (N - i - K + 1);
    }
    
    return count;
}

console.log(countSubarraysLengthAtLeastK([1, 2, 3, 4], 2)); 
// Output: 6
```

**Optimized Formula:**
```javascript
function countSubarraysLengthAtLeastKOptimized(N, K) {
    if (K > N) return 0;
    
    // Total subarrays - subarrays with length < K
    const totalSubarrays = (N * (N + 1)) / 2;
    const smallSubarrays = ((K - 1) * K) / 2;
    
    return totalSubarrays - smallSubarrays;
}
```

**Time Complexity:** O(1)

### Approach 3: Count Subarrays with All Positive Elements

```javascript
function countPositiveSubarrays(arr) {
    const N = arr.length;
    let count = 0;
    
    for (let i = 0; i < N; i++) {
        if (arr[i] > 0) {
            // Count consecutive positive elements
            let j = i;
            while (j < N && arr[j] > 0) {
                j++;
            }
            
            // Length of positive segment
            const len = j - i;
            
            // Add count of subarrays in this segment
            count += (len * (len + 1)) / 2;
            
            // Skip to end of positive segment
            i = j - 1;
        }
    }
    
    return count;
}

console.log(countPositiveSubarrays([1, -2, 3, 4, -5])); 
// Output: 4 (subarrays: [1], [3], [4], [3,4])
```

**Time Complexity:** O(N)  
**Space Complexity:** O(1)


## Edge Cases to Consider

1. **Empty Array:**
   - Input: `arr = []`
   - Output: `0`
   - No subarrays possible

2. **Single Element:**
   - Input: `arr = [5]`, `K = 5`
   - Output: `1`
   - Only one subarray [5]

3. **All Elements Same:**
   - Input: `arr = [2, 2, 2]`, `K = 4`
   - Output: `2`
   - Subarrays: [2,2] appears twice

4. **No Matching Subarrays:**
   - Input: `arr = [1, 2, 3]`, `K = 10`
   - Output: `0`
   - No subarray sums to 10

5. **Negative Numbers:**
   - Input: `arr = [-1, -2, 3]`, `K = 0`
   - Output: `1`
   - Subarray: [-1, -2, 3]

6. **Multiple Solutions:**
   - Input: `arr = [1, 1, 1]`, `K = 2`
   - Output: `2`
   - Subarrays: [1,1] at positions (0,1) and (1,2)


## JavaScript Code

```javascript
/**
 * Count Subarrays with Given Sum - Optimal Solution
 * Time Complexity: O(N)
 * Space Complexity: O(N)
 */
function countSubarraysWithSum(arr, K) {
    const N = arr.length;
    const prefixSumMap = new Map();
    
    let count = 0;
    let currentSum = 0;
    
    // Initialize: empty subarray has sum 0
    prefixSumMap.set(0, 1);
    
    for (let i = 0; i < N; i++) {
        currentSum += arr[i];
        
        // If (currentSum - K) exists in map,
        // it means there are subarrays ending at i with sum K
        const target = currentSum - K;
        if (prefixSumMap.has(target)) {
            count += prefixSumMap.get(target);
        }
        
        // Update frequency of current prefix sum
        prefixSumMap.set(currentSum, (prefixSumMap.get(currentSum) || 0) + 1);
    }
    
    return count;
}

// Example Usage:
console.log("Count subarrays with sum = 3:");
console.log(countSubarraysWithSum([1, 2, 3], 3));        // Output: 2
console.log(countSubarraysWithSum([1, 1, 1], 2));        // Output: 2
console.log(countSubarraysWithSum([1, -1, 1, -1], 0));   // Output: 4

/**
 * Count All Subarrays - Mathematical Formula
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function countAllSubarrays(N) {
    return (N * (N + 1)) / 2;
}

console.log("\nTotal subarrays for array of length 5:");
console.log(countAllSubarrays(5));  // Output: 15

/**
 * Count Subarrays with Length in Range [L, R]
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function countSubarraysInLengthRange(N, L, R) {
    if (L > N) return 0;
    R = Math.min(R, N);
    
    let count = 0;
    for (let len = L; len <= R; len++) {
        count += (N - len + 1);
    }
    return count;
}

console.log("\nSubarrays with length 2-3 in array of size 5:");
console.log(countSubarraysInLengthRange(5, 2, 3));  // Output: 7
```


## Key Takeaways

1. **Formula Mastery:** Know the formula `N×(N+1)/2` for total subarrays

2. **Pattern Recognition:** Identify the type of counting problem:
   - Sum-based → Prefix Sum + HashMap
   - Length-based → Mathematical formula
   - Element-based → Two pointers or segmentation

3. **HashMap Technique:** For sum-based problems, use HashMap to track prefix sums

4. **Avoid Generation:** If only counting, don't generate all subarrays

5. **Optimization Hierarchy:**
   - O(1): Mathematical formula (best)
   - O(N): HashMap with single pass
   - O(N²): Nested loops with cumulative sum
   - O(N³): Triple nested loops (worst)

6. **Space-Time Tradeoff:** HashMap uses O(N) space to achieve O(N) time

7. **Subarray vs Subsequence:** Subarrays are contiguous; subsequences need not be

8. **Edge Cases:** Always handle empty array, single element, and all same elements

9. **Negative Numbers:** Prefix sum technique handles negatives naturally

10. **Interview Tip:** Start with brute force, explain optimization, then implement optimal solution

