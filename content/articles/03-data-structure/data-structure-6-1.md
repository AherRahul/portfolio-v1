---
title: "Subarrays"
description: "Deep dive into subarrays - understanding, enumeration, and solving problems efficiently. Learn techniques to work with contiguous subsequences and optimize subarray-related algorithms."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Subarray Problems Visualization"
    type: "tool"
    url: "https://visualgo.net/en/list"
    description: "Interactive subarray visualization"
  - title: "Sliding Window Technique"
    type: "reference"
    url: "https://leetcode.com/tag/sliding-window/"
    description: "Related sliding window problems"
  - title: "Subarray Practice"
    type: "practice"
    url: "https://leetcode.com/tag/array/"
    description: "Practice subarray problems"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Subarrays
----------------------------

### What is a Subarray?

A **subarray** is a contiguous sequence of elements within an array. Unlike subsequences, subarrays must maintain the original order and cannot skip elements.

### Examples

For array `[1, 2, 3, 4]`:

**Valid Subarrays**:
- `[1]`, `[2]`, `[3]`, `[4]`
- `[1, 2]`, `[2, 3]`, `[3, 4]`
- `[1, 2, 3]`, `[2, 3, 4]`
- `[1, 2, 3, 4]`
- `[]` (empty subarray)

**NOT Subarrays** (these are subsequences):
- `[1, 3]` - skips element 2
- `[1, 4]` - skips elements 2 and 3
- `[2, 4]` - skips element 3

### Counting Subarrays

For an array of length `n`:
- **Total subarrays** = n × (n + 1) / 2
- **Including empty** = n × (n + 1) / 2 + 1

**Proof**: For each starting position `i`, there are `(n - i)` possible ending positions.
```
Sum = n + (n-1) + (n-2) + ... + 1 = n(n+1)/2
```

### Generating All Subarrays

```javascript
function generateAllSubarrays(arr) {
    const n = arr.length;
    const subarrays = [];
    
    // i: starting index
    for (let i = 0; i < n; i++) {
        // j: ending index
        for (let j = i; j < n; j++) {
            // Extract subarray from i to j
            const subarray = arr.slice(i, j + 1);
            subarrays.push(subarray);
        }
    }
    
    return subarrays;
}

// Example
const arr = [1, 2, 3];
console.log(generateAllSubarrays(arr));
// Output: [[1], [1,2], [1,2,3], [2], [2,3], [3]]
```

### Common Subarray Problems

#### 1. Maximum Subarray Sum (Kadane's Algorithm)

```javascript
function maxSubarraySum(arr) {
    let maxSum = arr[0];
    let currentSum = arr[0];
    
    for (let i = 1; i < arr.length; i++) {
        currentSum = Math.max(arr[i], currentSum + arr[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}
```

**Time Complexity**: O(n)

#### 2. Print All Subarray Sums

```javascript
function printSubarraySums(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = i; j < n; j++) {
            sum += arr[j];
            console.log(`Subarray [${i}, ${j}]: sum = ${sum}`);
        }
    }
}
```

**Time Complexity**: O(n²)

#### 3. Count Subarrays with Given Sum

```javascript
function countSubarraysWithSum(arr, targetSum) {
    let count = 0;
    
    for (let i = 0; i < arr.length; i++) {
        let sum = 0;
        for (let j = i; j < arr.length; j++) {
            sum += arr[j];
            if (sum === targetSum) {
                count++;
            }
        }
    }
    
    return count;
}
```

**Time Complexity**: O(n²)
**Optimized with HashMap**: O(n)

### Optimization Techniques

1. **Prefix Sum**: For range sum queries
2. **Sliding Window**: For fixed/variable size subarrays
3. **Two Pointers**: For sorted arrays
4. **Hash Maps**: For sum-based problems
5. **Kadane's Algorithm**: For maximum sum

### Time Complexity Patterns

| Operation | Naive | Optimized |
|-----------|-------|-----------|
| Generate all subarrays | O(n²) | - |
| Sum of all subarrays | O(n³) | O(n²) |
| Maximum subarray sum | O(n²) | O(n) |
| Subarray with given sum | O(n²) | O(n) |

### Common Problem Types

1. **Maximum/Minimum** subarray sum
2. **Count** subarrays with property X
3. **Find** subarray with target sum
4. **Longest** subarray with condition
5. **Smallest** subarray with sum ≥ K

### Practice Problems

1. Maximum Subarray (Kadane's Algorithm)
2. Subarray Sum Equals K
3. Longest Subarray with Sum K
4. Maximum Product Subarray
5. Subarray with 0 Sum
6. Count Subarrays with Equal 0s and 1s
7. Longest Subarray with Equal 0s and 1s

### Key Takeaways

- Subarrays are contiguous sequences
- Total subarrays = n(n+1)/2
- Many problems can be optimized from O(n²) or O(n³) to O(n)
- Prefix sum and sliding window are key optimization techniques
- Understanding subarray fundamentals is crucial for array problems

