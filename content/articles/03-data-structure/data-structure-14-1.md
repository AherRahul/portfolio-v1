---
title: "Frequency of Element Query using Hashing"
description: "Track participation frequency efficiently using hash maps. Learn how to use hash maps for frequency counting, understand O(1) lookup time, and master the fundamental pattern of element frequency tracking."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Hash Maps Explained"
    type: "article"
    url: "https://www.geeksforgeeks.org/hashing-data-structure/"
    description: "Comprehensive guide to hashing"
  - title: "JavaScript Map Object"
    type: "documentation"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map"
    description: "MDN documentation for Maps"
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Frequency of Element Query using Hashing

## 2. Problem Statement

SCALER organizes a series of contests aimed at helping learners enhance their coding skills. Each learner can participate in multiple contests, and their participation is represented by integers in an array.

The goal is to identify how frequently each learner has participated in these contests. This information will help SCALER determine which learners are participating the least, allowing them to provide targeted support and encouragement.

Given:
- An array **A** that represents the participants of various contests (each integer corresponds to a specific learner)
- An array **B** containing the learners for whom you want to check participation frequency

Your task is to **find the frequency of each learner from array B in the array A** and return a list containing all these frequencies.

**Input:**
- Array `A` of size N (1 ≤ N ≤ 10^5)
- Array `B` of size M (1 ≤ M ≤ 10^5)

**Output:**
- Array of frequencies for each element in B

## 3. Examples

### Example 1:
```
Input: 
A = [1, 2, 1, 3, 2, 1, 4]
B = [1, 2, 5]

Output: [3, 2, 0]

Explanation:
- Learner 1 appears 3 times in A
- Learner 2 appears 2 times in A
- Learner 5 appears 0 times in A
```

### Example 2:
```
Input:
A = [5, 5, 5, 5]
B = [5, 10]

Output: [4, 0]

Explanation:
- Element 5 appears 4 times
- Element 10 doesn't appear (0 times)
```

### Example 3:
```
Input:
A = [1, 2, 3, 4, 5]
B = [1, 3, 5, 7]

Output: [1, 1, 1, 0]

Explanation:
- 1, 3, 5 each appear once
- 7 doesn't appear
```

## 4. Constraints

- `1 ≤ N, M ≤ 10^5` (size of arrays)
- `1 ≤ A[i], B[i] ≤ 10^9` (element values)
- Must handle large arrays efficiently
- Handle cases where elements don't exist
- Return frequency count for each query

## 5. Important Points

### Understanding Hash Maps

**Hash Map (Dictionary/Map):**
- Data structure storing **key-value pairs**
- **O(1) average** time for insert, search, delete
- Perfect for frequency counting

**Why Hash Maps?**
- Direct access by key (element value)
- No sorting needed
- Handles large value ranges efficiently

### Frequency Pattern

**Classic Two-Step Pattern:**
1. **Build frequency map:** Count all elements in A
2. **Query map:** Look up each element from B

**Real-World Applications:**
- User activity tracking
- Inventory management
- Analytics dashboards
- Vote counting systems

## 6. Brute Force Approach

### Concept

For each element in B, scan through entire array A to count occurrences.

### Algorithm

```
For each element in B:
    count = 0
    For each element in A:
        If A[i] == B[j]:
            count++
    Add count to result
```

## 7. Brute Force Code in JavaScript

```javascript
function frequencyQueryBruteForce(A, B) {
    const result = [];
    
    // For each query in B
    for (let i = 0; i < B.length; i++) {
        const target = B[i];
        let count = 0;
        
        // Count occurrences in A
        for (let j = 0; j < A.length; j++) {
            if (A[j] === target) {
                count++;
            }
        }
        
        result.push(count);
    }
    
    return result;
}

// Test
console.log(frequencyQueryBruteForce([1, 2, 1, 3, 2, 1, 4], [1, 2, 5]));
// Output: [3, 2, 0]
```

## 8. Dry Run of Brute Force Approach

```
A = [1, 2, 1, 3, 2, 1, 4]
B = [1, 2, 5]

Query 1: Find frequency of 1
  Scan A: 1✓, 2✗, 1✓, 3✗, 2✗, 1✓, 4✗
  Count = 3

Query 2: Find frequency of 2
  Scan A: 1✗, 2✓, 1✗, 3✗, 2✓, 1✗, 4✗
  Count = 2

Query 3: Find frequency of 5
  Scan A: 1✗, 2✗, 1✗, 3✗, 2✗, 1✗, 4✗
  Count = 0

Result: [3, 2, 0]
```

## 9. Time and Space Complexity of Brute Force

### Time Complexity: **O(N × M)**

**Analysis:**
- Outer loop: M iterations (size of B)
- Inner loop: N iterations (size of A) for each query
- Total: N × M comparisons

**Example:**
- N = 10,000, M = 10,000
- Operations = 100,000,000 (100 million!)

### Space Complexity: **O(M)**

- Only result array of size M
- No extra data structures

**Problem:** Too slow for large inputs!

## 10. Visualization (Brute Force)

```
B = [1, 2, 5]
A = [1, 2, 1, 3, 2, 1, 4]

Query 1 (1):
A: 1  2  1  3  2  1  4
   ✓  ✗  ✓  ✗  ✗  ✓  ✗  → Count: 3

Query 2 (2):
A: 1  2  1  3  2  1  4
   ✗  ✓  ✗  ✗  ✓  ✗  ✗  → Count: 2

Query 3 (5):
A: 1  2  1  3  2  1  4
   ✗  ✗  ✗  ✗  ✗  ✗  ✗  → Count: 0

Result: [3, 2, 0]
```

## 11. Optimized Approach Description

**Use Hash Map for O(1) lookups!**

**Strategy:**
1. **Preprocessing:** Build frequency map from array A (one pass)
2. **Query:** Look up each element from B in the map (O(1) per query)

**Key Insight:** Trade space for time!
- Space: O(N) for hash map
- Time: O(N + M) instead of O(N × M)

## 12. Optimized Approach Algorithm

```
Step 1: Build Frequency Map
  freqMap = {}
  For each element in A:
      freqMap[element] = freqMap.get(element, 0) + 1

Step 2: Query Frequencies
  result = []
  For each element in B:
      frequency = freqMap.get(element, 0)
      result.push(frequency)

Step 3: Return result
```

## 13. Optimized Code

```javascript
/**
 * Find frequency of elements using Hash Map
 * @param {number[]} A - Main array
 * @param {number[]} B - Query array
 * @returns {number[]} - Frequencies
 */
function frequencyQuery(A, B) {
    // Step 1: Build frequency map
    const freqMap = new Map();
    
    for (const element of A) {
        freqMap.set(element, (freqMap.get(element) || 0) + 1);
    }
    
    // Step 2: Query frequencies
    const result = [];
    
    for (const query of B) {
        result.push(freqMap.get(query) || 0);
    }
    
    return result;
}

// Test cases
console.log(frequencyQuery([1, 2, 1, 3, 2, 1, 4], [1, 2, 5]));
// Output: [3, 2, 0]

console.log(frequencyQuery([5, 5, 5, 5], [5, 10]));
// Output: [4, 0]

console.log(frequencyQuery([1, 2, 3, 4, 5], [1, 3, 5, 7]));
// Output: [1, 1, 1, 0]
```

### Alternative: Using Plain Object

```javascript
function frequencyQueryObject(A, B) {
    // Build frequency object
    const freq = {};
    
    for (const num of A) {
        freq[num] = (freq[num] || 0) + 1;
    }
    
    // Query frequencies
    return B.map(query => freq[query] || 0);
}
```

### With Comments

```javascript
function frequencyQueryDetailed(A, B) {
    // Initialize hash map
    const freqMap = new Map();
    
    // Count frequencies of all elements in A
    for (let i = 0; i < A.length; i++) {
        const current = A[i];
        const currentCount = freqMap.get(current) || 0;
        freqMap.set(current, currentCount + 1);
    }
    
    // Query frequencies for elements in B
    const result = [];
    for (let i = 0; i < B.length; i++) {
        const query = B[i];
        // Get frequency (default 0 if not found)
        const frequency = freqMap.get(query) || 0;
        result.push(frequency);
    }
    
    return result;
}
```

## 14. Dry Run of Optimized Approach

```
A = [1, 2, 1, 3, 2, 1, 4]
B = [1, 2, 5]

Step 1: Build Frequency Map
  Process A:
  Index 0: A[0]=1 → freqMap = {1: 1}
  Index 1: A[1]=2 → freqMap = {1: 1, 2: 1}
  Index 2: A[2]=1 → freqMap = {1: 2, 2: 1}
  Index 3: A[3]=3 → freqMap = {1: 2, 2: 1, 3: 1}
  Index 4: A[4]=2 → freqMap = {1: 2, 2: 2, 3: 1}
  Index 5: A[5]=1 → freqMap = {1: 3, 2: 2, 3: 1}
  Index 6: A[6]=4 → freqMap = {1: 3, 2: 2, 3: 1, 4: 1}

Step 2: Query Frequencies
  Query B[0]=1: freqMap.get(1) = 3 → result = [3]
  Query B[1]=2: freqMap.get(2) = 2 → result = [3, 2]
  Query B[2]=5: freqMap.get(5) = undefined → 0 → result = [3, 2, 0]

Final Result: [3, 2, 0]
```

### Detailed Trace

| Step | Element | Action | Map State | Result |
|------|---------|--------|-----------|--------|
| Build | 1 | Add/Increment | {1:1} | - |
| Build | 2 | Add | {1:1, 2:1} | - |
| Build | 1 | Increment | {1:2, 2:1} | - |
| Build | 3 | Add | {1:2, 2:1, 3:1} | - |
| Build | 2 | Increment | {1:2, 2:2, 3:1} | - |
| Build | 1 | Increment | {1:3, 2:2, 3:1} | - |
| Build | 4 | Add | {1:3, 2:2, 3:1, 4:1} | - |
| Query | 1 | Lookup | - | [3] |
| Query | 2 | Lookup | - | [3,2] |
| Query | 5 | Not found | - | [3,2,0] |

## 15. Time and Space Complexity of Optimized

### Time Complexity: **O(N + M)**

**Breakdown:**
- Build frequency map: O(N) - one pass through A
- Query each element: O(M) - M lookups, each O(1)
- Total: **O(N + M)**

**Comparison:**
- Brute Force: O(N × M) = O(10^10) for N=M=100,000
- Optimized: O(N + M) = O(200,000) for same input
- **Speedup: 50,000× faster!**

### Space Complexity: **O(N + M)**

**Breakdown:**
- Frequency map: O(N) - at most N unique elements
- Result array: O(M) - size of B
- Total: **O(N + M)**

**Trade-off:** Extra O(N) space for massive time savings!

## 16. Visualization

```
Hash Map Building Process:

A = [1, 2, 1, 3, 2, 1, 4]

Step 1: Process element 1
┌─────┬─────┐
│  1  │  1  │
└─────┴─────┘

Step 2: Process element 2
┌─────┬─────┐
│  1  │  1  │
│  2  │  1  │
└─────┴─────┘

Step 3: Process element 1 (again)
┌─────┬─────┐
│  1  │  2  │ ← Incremented
│  2  │  1  │
└─────┴─────┘

... continuing ...

Final Map:
┌─────┬─────┐
│  1  │  3  │
│  2  │  2  │
│  3  │  1  │
│  4  │  1  │
└─────┴─────┘

Query Phase:
B = [1, 2, 5]

Query 1: → Map[1] = 3 ✓
Query 2: → Map[2] = 2 ✓
Query 5: → Map[5] = undefined → 0 ✓

Result: [3, 2, 0]
```

## 17. Edge Cases to Consider

### 1. Empty Arrays

```javascript
frequencyQuery([], [1, 2, 3]);
// Output: [0, 0, 0]

frequencyQuery([1, 2, 3], []);
// Output: []
```

### 2. No Matches

```javascript
frequencyQuery([1, 2, 3], [4, 5, 6]);
// Output: [0, 0, 0]
```

### 3. All Same Elements

```javascript
frequencyQuery([5, 5, 5, 5, 5], [5]);
// Output: [5]
```

### 4. Large Numbers

```javascript
frequencyQuery([1000000000, 1000000000], [1000000000, 1]);
// Output: [2, 0]
```

### 5. Single Element Arrays

```javascript
frequencyQuery([1], [1]);
// Output: [1]

frequencyQuery([1], [2]);
// Output: [0]
```

### 6. Negative Numbers (if allowed)

```javascript
frequencyQuery([-1, -1, 0, 1, 1], [-1, 0, 1, 2]);
// Output: [2, 1, 2, 0]
```

## 18. Key Takeaways

### a. Applications

1. **Analytics Systems**
   - User activity tracking
   - Page view counting
   - Event frequency analysis

2. **E-commerce**
   - Product purchase frequency
   - Inventory tracking
   - Popular items identification

3. **Social Media**
   - Hashtag frequency
   - User mentions count
   - Trending topics

4. **Gaming**
   - Player participation tracking
   - Leaderboard calculations
   - Achievement statistics

### b. Interview Strategy

**When Asked This Problem:**

1. **Clarify Requirements**
   - "Are there constraints on element values?"
   - "Can arrays be empty?"
   - "What if element doesn't exist?"

2. **Start with Brute Force**
   - Show O(N × M) solution
   - Explain why it's slow
   - Identify optimization opportunity

3. **Introduce Hash Map**
   - Explain O(1) lookup benefit
   - Show space-time tradeoff
   - Code optimized solution

4. **Discuss Complexity**
   - Clearly explain O(N + M) time
   - Compare with brute force
   - Mention space usage

5. **Handle Edge Cases**
   - Empty arrays
   - Missing elements
   - Large numbers

**Follow-up Questions:**
- "What if we had millions of queries?"
- "How would you handle updates to A?"
- "Can you do it with less space?"

### c. Common Mistakes

1. **Forgetting Default Values**
```javascript
// ❌ WRONG: Undefined error
const freq = {};
freq[key]++; // Error if key doesn't exist

// ✓ CORRECT: Use default value
freq[key] = (freq[key] || 0) + 1;
```

2. **Not Handling Missing Elements**
```javascript
// ❌ WRONG: Returns undefined
return freqMap.get(query);

// ✓ CORRECT: Default to 0
return freqMap.get(query) || 0;
```

3. **Using Array Instead of Map for Large Values**
```javascript
// ❌ WRONG: Wastes space for sparse data
const freq = new Array(1000000001).fill(0);

// ✓ CORRECT: Use Map
const freq = new Map();
```

4. **Rebuilding Map for Each Query**
```javascript
// ❌ WRONG: O(N × M) time
for (const query of B) {
    const map = buildMap(A); // Rebuilds every time!
    result.push(map.get(query));
}
```

### d. Related Problems

**Beginner Level:**
1. **Two Sum** - Find pair with given sum
2. **Contains Duplicate** - Check for duplicates
3. **Single Number** - Find non-duplicate element
4. **Valid Anagram** - Compare character frequencies

**Intermediate Level:**
5. **Top K Frequent Elements** - Find most common
6. **Group Anagrams** - Group by character frequency
7. **Longest Substring Without Repeating** - Character tracking
8. **Subarray Sum Equals K** - Prefix sum with hashing

**Advanced Level:**
9. **LRU Cache** - Hash map + doubly linked list
10. **Design HashMap** - Implement from scratch
11. **Maximum Frequency Stack** - Frequency + stack
12. **Random Pick with Blacklist** - Hash map optimization

### e. Performance

**Benchmarking:**

```javascript
const N = 100000;
const M = 100000;
const A = Array.from({length: N}, () => Math.floor(Math.random() * 1000));
const B = Array.from({length: M}, () => Math.floor(Math.random() * 1000));

// Brute Force (DON'T RUN - too slow!)
// Would take several minutes!

// Optimized
console.time('Optimized');
frequencyQuery(A, B);
console.timeEnd('Optimized');
// Time: ~50-100ms
```

**Performance Comparison:**

| Input Size | Brute Force | Optimized | Speedup |
|-----------|-------------|-----------|---------|
| N=100, M=100 | ~1ms | <1ms | ~10× |
| N=1000, M=1000 | ~100ms | ~5ms | ~20× |
| N=10000, M=10000 | ~10s | ~50ms | ~200× |
| N=100000, M=100000 | ~16min | ~100ms | ~10000× |

## Summary

Frequency counting with hash maps is a **fundamental pattern** in programming!

✅ **Hash Map Power:** O(1) average lookup time  
✅ **Two-Phase Pattern:** Build map, then query  
✅ **Space-Time Tradeoff:** O(N) space for O(N+M) time  
✅ **Practical Application:** Used in analytics, tracking, counting  
✅ **Interview Favorite:** Foundation for many problems  

**Key Formula:** Time = O(N + M) instead of O(N × M)

Master this pattern, and you'll handle countless frequency-based problems!

Happy Coding! 🚀

