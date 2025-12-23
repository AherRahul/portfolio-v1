---
title: "Prefix & Subarrays"
description: "Combine prefix sum technique with subarray problems to solve complex range query and subarray optimization problems efficiently. Master the synergy between these two powerful concepts."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Prefix Sum Applications"
    type: "tool"
    url: "https://visualgo.net/en/list"
    description: "Visualize prefix sum in subarray problems"
  - title: "Subarray Sum Problems"
    type: "reference"
    url: "https://leetcode.com/tag/prefix-sum/"
    description: "Collection of prefix sum and subarray problems"
  - title: "Hash Map Techniques"
    type: "practice"
    url: "https://leetcode.com/tag/hash-table/"
    description: "Practice hash map optimization techniques"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Prefix & Subarrays
----------------------------

### The Powerful Combination

Combining **Prefix Sum** with **Subarray** concepts creates powerful optimization strategies. This combination is essential for solving complex range query and subarray sum problems efficiently.

### Core Principle

**Key Insight**: The sum of subarray from index `i` to `j` equals:
```
sum(i, j) = prefix[j] - prefix[i-1]
```

This allows us to:
1. Reduce O(n²) or O(n³) solutions to O(n)
2. Use hash maps to track prefix sums
3. Solve counting and finding problems efficiently

### Problem Pattern 1: Subarray Sum Equals K

**Problem**: Count subarrays with sum equal to K

#### Naive Approach - O(n²)
```javascript
function subarraySum(arr, k) {
    let count = 0;
    
    for (let i = 0; i < arr.length; i++) {
        let sum = 0;
        for (let j = i; j < arr.length; j++) {
            sum += arr[j];
            if (sum === k) count++;
        }
    }
    
    return count;
}
```

#### Optimized with Prefix Sum + HashMap - O(n)
```javascript
function subarraySum(arr, k) {
    const prefixMap = new Map();
    prefixMap.set(0, 1); // Base case: prefix sum 0 occurs once
    
    let prefixSum = 0;
    let count = 0;
    
    for (let i = 0; i < arr.length; i++) {
        prefixSum += arr[i];
        
        // If (prefixSum - k) exists, we found subarrays
        if (prefixMap.has(prefixSum - k)) {
            count += prefixMap.get(prefixSum - k);
        }
        
        // Store current prefix sum
        prefixMap.set(prefixSum, (prefixMap.get(prefixSum) || 0) + 1);
    }
    
    return count;
}
```

**Why it works**:
- If `prefixSum[j] - prefixSum[i] = k`
- Then `prefixSum[i] = prefixSum[j] - k`
- We look for this in our map!

### Problem Pattern 2: Longest Subarray with Sum K

```javascript
function longestSubarrayWithSumK(arr, k) {
    const prefixMap = new Map();
    prefixMap.set(0, -1); // Base case
    
    let prefixSum = 0;
    let maxLength = 0;
    
    for (let i = 0; i < arr.length; i++) {
        prefixSum += arr[i];
        
        // Check if we can form subarray with sum k
        if (prefixMap.has(prefixSum - k)) {
            const length = i - prefixMap.get(prefixSum - k);
            maxLength = Math.max(maxLength, length);
        }
        
        // Store first occurrence only (for longest)
        if (!prefixMap.has(prefixSum)) {
            prefixMap.set(prefixSum, i);
        }
    }
    
    return maxLength;
}
```

### Problem Pattern 3: Count Subarrays with Sum Divisible by K

```javascript
function subarraysDivByK(arr, k) {
    const remainderMap = new Map();
    remainderMap.set(0, 1); // Base case
    
    let prefixSum = 0;
    let count = 0;
    
    for (let i = 0; i < arr.length; i++) {
        prefixSum += arr[i];
        
        // Handle negative remainders
        let remainder = ((prefixSum % k) + k) % k;
        
        // If this remainder seen before, we found subarrays
        if (remainderMap.has(remainder)) {
            count += remainderMap.get(remainder);
        }
        
        remainderMap.set(remainder, (remainderMap.get(remainder) || 0) + 1);
    }
    
    return count;
}
```

### Problem Pattern 4: Maximum Subarray Sum (Using Prefix Sum Concept)

```javascript
function maxSubarraySum(arr) {
    let minPrefixSum = 0;
    let prefixSum = 0;
    let maxSum = -Infinity;
    
    for (let i = 0; i < arr.length; i++) {
        prefixSum += arr[i];
        
        // Maximum sum ending at i
        maxSum = Math.max(maxSum, prefixSum - minPrefixSum);
        
        // Update minimum prefix sum seen so far
        minPrefixSum = Math.min(minPrefixSum, prefixSum);
    }
    
    return maxSum;
}
```

### Problem Pattern 5: Equilibrium Index

**Problem**: Find index where left sum equals right sum

```javascript
function findEquilibriumIndex(arr) {
    const n = arr.length;
    const prefix = new Array(n);
    
    // Build prefix sum
    prefix[0] = arr[0];
    for (let i = 1; i < n; i++) {
        prefix[i] = prefix[i-1] + arr[i];
    }
    
    const totalSum = prefix[n-1];
    
    for (let i = 0; i < n; i++) {
        const leftSum = i === 0 ? 0 : prefix[i-1];
        const rightSum = totalSum - prefix[i];
        
        if (leftSum === rightSum) {
            return i;
        }
    }
    
    return -1;
}
```

### Common Problem Types & Solutions

| Problem | Technique | Time |
|---------|-----------|------|
| Subarray sum equals K | Prefix + HashMap | O(n) |
| Longest subarray sum K | Prefix + HashMap | O(n) |
| Sum divisible by K | Prefix + Remainder Map | O(n) |
| Maximum subarray sum | Kadane's / Min Prefix | O(n) |
| Equilibrium index | Prefix Sum Array | O(n) |
| Range sum queries | Prefix Sum Array | O(1) per query |

### Template for Prefix + HashMap Problems

```javascript
function solveSubarrayProblem(arr, condition) {
    const map = new Map();
    map.set(0, -1); // or set(0, 1) depending on problem
    
    let prefixSum = 0;
    let result = 0; // count, length, etc.
    
    for (let i = 0; i < arr.length; i++) {
        prefixSum += arr[i];
        
        // Apply your condition
        const target = prefixSum - condition;
        
        if (map.has(target)) {
            // Update result based on problem
            result += map.get(target);
        }
        
        // Update map
        map.set(prefixSum, (map.get(prefixSum) || 0) + 1);
    }
    
    return result;
}
```

### Practice Problems

1. ✅ Subarray Sum Equals K
2. ✅ Continuous Subarray Sum
3. ✅ Subarray Sums Divisible by K
4. ✅ Maximum Size Subarray Sum Equals k
5. ✅ Find Pivot Index
6. ✅ Product of Array Except Self
7. ✅ Contiguous Array (0s and 1s)
8. ✅ Minimum Size Subarray Sum

### Key Takeaways

- Prefix sum transforms subarray problems from O(n²) to O(n)
- HashMap stores prefix sums for quick lookup
- Pattern: `if (map.has(prefixSum - target))`
- Handle edge cases: empty subarray, negative numbers
- Master this pattern - it appears frequently in interviews!

