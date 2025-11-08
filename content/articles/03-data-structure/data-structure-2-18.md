---
title: "Count of Elements"
description: "Learn efficient techniques to count specific elements in an array. Master hash maps, frequency counters, and various counting algorithms that are fundamental to many array problems."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Hash Map Guide"
    type: "reference"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map"
    description: "JavaScript Map object documentation"
  - title: "Array Frequency Counter"
    type: "tool"
    url: "https://visualgo.net/en/array"
    description: "Visualize array counting operations"
  - title: "Hash Table Problems"
    type: "practice"
    url: "https://leetcode.com/tag/hash-table/"
    description: "Practice hash map and counting problems"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Count of Elements
----------------------------

### Problem Statement:

Given an array `arr` of `N` integers and an integer `target`, count how many times the `target` element appears in the array.

Alternatively, given an array, count the **frequency of each element** in the array.

Return the count of the target element, or return an object/map containing the frequency of all elements.

### Examples:

#### Example 1 (Count Specific Element):

**Input:** arr = [1, 2, 3, 2, 4, 2, 5], target = 2

**Output:** 3

**Explanation:** The element 2 appears 3 times in the array (at indices 1, 3, 5).

#### Example 2 (Count All Elements):

**Input:** arr = [1, 2, 3, 2, 4, 2, 5]

**Output:** {1: 1, 2: 3, 3: 1, 4: 1, 5: 1}

**Explanation:** 
* 1 appears 1 time
* 2 appears 3 times
* 3 appears 1 time
* 4 appears 1 time
* 5 appears 1 time

#### Example 3 (Element Not Found):

**Input:** arr = [5, 10, 15, 20], target = 25

**Output:** 0

**Explanation:** Target 25 is not present in the array.

#### Example 4 (All Same Elements):

**Input:** arr = [7, 7, 7, 7], target = 7

**Output:** 4

**Explanation:** All elements are 7, so count is 4.

### Constraints:

* `1 ≤ N ≤ 10^5`
* `-10^9 ≤ arr[i] ≤ 10^9`
* `-10^9 ≤ target ≤ 10^9`

### Important Points to Understand:

**1. Frequency Counter Pattern:**
* Common pattern in array problems.
* Used for counting occurrences, finding duplicates, anagrams, etc.
* Hash map provides O(1) access time.

**2. Hash Map (Object/Map):**
* Key: Element value
* Value: Count/frequency
* JavaScript: Use `Object` or `Map` for storing counts.

**3. Single Element vs All Elements:**
* Counting one specific element: O(N) time, O(1) space.
* Counting all elements: O(N) time, O(K) space (K = unique elements).

**4. Use Cases:**
* Finding duplicates
* Mode (most frequent element)
* Checking for anagrams
* Two sum problems
* Frequency-based sorting

### Approach:

**Approach 1: Linear Search (Single Target)**
1. Initialize count = 0.
2. Loop through array.
3. If element equals target, increment count.
4. Return count.

**Approach 2: Hash Map (All Elements)**
1. Create empty hash map.
2. Loop through array.
3. For each element, increment its count in the map.
4. Return the map.

**Approach 3: Sorted Array + Binary Search (If array is sorted)**
1. Find first occurrence using binary search.
2. Find last occurrence using binary search.
3. Count = last - first + 1.

### Time Complexity:

**Linear Search (Single Target):**
* **Time Complexity = O(N)** - Single pass through array.
* **Space Complexity = O(1)** - Only counter variable.

**Hash Map (All Elements):**
* **Time Complexity = O(N)** - Single pass through array.
* **Space Complexity = O(K)** - K = number of unique elements.

**Binary Search (Sorted Array):**
* **Time Complexity = O(log N)** - Binary search twice.
* **Space Complexity = O(1)** - Only index variables.

### Space Complexity:

* **Single element count:** O(1)
* **All elements frequency:** O(K) where K ≤ N

### Dry Run - Single Element Count:

```
Input: arr = [1, 2, 3, 2, 4, 2, 5], target = 2

Step 1: Initialize count = 0

Step 2: Iterate through array
    i = 0: arr[0] = 1 ≠ 2 → skip
    i = 1: arr[1] = 2 = 2 → count = 1
    i = 2: arr[2] = 3 ≠ 2 → skip
    i = 3: arr[3] = 2 = 2 → count = 2
    i = 4: arr[4] = 4 ≠ 2 → skip
    i = 5: arr[5] = 2 = 2 → count = 3
    i = 6: arr[6] = 5 ≠ 2 → skip

Step 3: Return count = 3

Output: 3
```

### Dry Run - All Elements Frequency:

```
Input: arr = [1, 2, 3, 2, 4, 2]

Step 1: Initialize frequency map = {}

Step 2: Iterate through array
    i = 0: arr[0] = 1 → map = {1: 1}
    i = 1: arr[1] = 2 → map = {1: 1, 2: 1}
    i = 2: arr[2] = 3 → map = {1: 1, 2: 1, 3: 1}
    i = 3: arr[3] = 2 → map = {1: 1, 2: 2, 3: 1}
    i = 4: arr[4] = 4 → map = {1: 1, 2: 2, 3: 1, 4: 1}
    i = 5: arr[5] = 2 → map = {1: 1, 2: 3, 3: 1, 4: 1}

Step 3: Return map

Output: {1: 1, 2: 3, 3: 1, 4: 1}
```

### Brute Force - Count Single Element:

```javascript
function countElement(arr, target) {
    let count = 0;
    
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            count++;
        }
    }
    
    return count;
}
```

**Time:** O(N) ✓
**Space:** O(1) ✓

### Visualization:

```
Array: [1, 2, 3, 2, 4, 2, 5]
Target: 2

Linear scan:
[1, 2, 3, 2, 4, 2, 5]
    ↑     ↑     ↑
  Found Found Found

Count: 3

Frequency Map Construction:
Step 1: Process 1 → {1: 1}
Step 2: Process 2 → {1: 1, 2: 1}
Step 3: Process 3 → {1: 1, 2: 1, 3: 1}
Step 4: Process 2 → {1: 1, 2: 2, 3: 1}
Step 5: Process 4 → {1: 1, 2: 2, 3: 1, 4: 1}
Step 6: Process 2 → {1: 1, 2: 3, 3: 1, 4: 1}
Step 7: Process 5 → {1: 1, 2: 3, 3: 1, 4: 1, 5: 1}

Final map: {1: 1, 2: 3, 3: 1, 4: 1, 5: 1}
```

### Optimal Approach - Frequency Map (Using Object):

```javascript
function countAllElements(arr) {
    const frequency = {};
    
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        
        // Initialize if not exists, then increment
        if (frequency[element] === undefined) {
            frequency[element] = 1;
        } else {
            frequency[element]++;
        }
    }
    
    return frequency;
}

// Alternative cleaner syntax:
function countAllElementsClean(arr) {
    const frequency = {};
    
    for (const element of arr) {
        frequency[element] = (frequency[element] || 0) + 1;
    }
    
    return frequency;
}
```

**Time:** O(N) ✓
**Space:** O(K) where K = unique elements ✓

### Using JavaScript Map:

```javascript
function countAllElementsMap(arr) {
    const frequency = new Map();
    
    for (const element of arr) {
        frequency.set(element, (frequency.get(element) || 0) + 1);
    }
    
    return frequency;
}

// Usage:
const arr = [1, 2, 3, 2, 4, 2];
const freq = countAllElementsMap(arr);
console.log(freq.get(2));  // 3
console.log(freq.get(5));  // undefined
```

**Benefits of Map over Object:**
* Keys can be any type (not just strings).
* Maintains insertion order.
* Has size property.
* Better performance for frequent additions/deletions.

### Using Array reduce():

```javascript
function countAllElementsReduce(arr) {
    return arr.reduce((frequency, element) => {
        frequency[element] = (frequency[element] || 0) + 1;
        return frequency;
    }, {});
}
```

**More functional style, same complexity.**

### Count and Query:

```javascript
class FrequencyCounter {
    constructor(arr) {
        this.frequency = new Map();
        
        // Build frequency map
        for (const element of arr) {
            this.frequency.set(element, (this.frequency.get(element) || 0) + 1);
        }
    }
    
    count(element) {
        return this.frequency.get(element) || 0;
    }
    
    exists(element) {
        return this.frequency.has(element);
    }
    
    mostFrequent() {
        let maxCount = 0;
        let maxElement = null;
        
        for (const [element, count] of this.frequency) {
            if (count > maxCount) {
                maxCount = count;
                maxElement = element;
            }
        }
        
        return { element: maxElement, count: maxCount };
    }
    
    getAllFrequencies() {
        return Object.fromEntries(this.frequency);
    }
}

// Usage:
const arr = [1, 2, 3, 2, 4, 2, 5];
const fc = new FrequencyCounter(arr);
console.log(fc.count(2));              // 3
console.log(fc.exists(10));            // false
console.log(fc.mostFrequent());        // {element: 2, count: 3}
console.log(fc.getAllFrequencies());   // {1: 1, 2: 3, 3: 1, 4: 1, 5: 1}
```

### Binary Search Approach (Sorted Array):

```javascript
function countInSortedArray(arr, target) {
    // Find first occurrence
    function findFirst() {
        let left = 0, right = arr.length - 1;
        let result = -1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            if (arr[mid] === target) {
                result = mid;
                right = mid - 1; // Continue searching left
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return result;
    }
    
    // Find last occurrence
    function findLast() {
        let left = 0, right = arr.length - 1;
        let result = -1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            if (arr[mid] === target) {
                result = mid;
                left = mid + 1; // Continue searching right
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return result;
    }
    
    const first = findFirst();
    if (first === -1) return 0; // Element not found
    
    const last = findLast();
    return last - first + 1;
}
```

**Time:** O(log N) ✓ (only works on sorted arrays)
**Space:** O(1) ✓

### Using Built-in Methods:

```javascript
// Count single element
function countElement(arr, target) {
    return arr.filter(x => x === target).length;
}

// Or using reduce
function countElementReduce(arr, target) {
    return arr.reduce((count, x) => count + (x === target ? 1 : 0), 0);
}
```

**Note:** These are less efficient (still O(N)) but more concise.

### Edge Cases to Consider:

**1. Empty Array:**
* Input: arr = [], target = 5
* Output: 0

**2. Target Not Present:**
* Input: arr = [1, 2, 3], target = 5
* Output: 0

**3. All Elements Same:**
* Input: arr = [7, 7, 7, 7], target = 7
* Output: 4

**4. Single Element:**
* Input: arr = [5], target = 5
* Output: 1

**5. Negative Numbers:**
* Input: arr = [-5, -10, -5, 0, -5], target = -5
* Output: 3

**6. Large Numbers:**
* Input: arr with 10^9 values
* Should handle efficiently.

**7. Zero:**
* Input: arr = [0, 1, 0, 2, 0], target = 0
* Output: 3

**8. Duplicates:**
* Input: arr = [1, 1, 1, 1, 1]
* All elements same - frequency map has one key.

### Key Takeaways:

1. **Frequency counter pattern** is fundamental in array/string problems.

2. **Hash map is the tool:** O(1) lookup/update makes it ideal for counting.

3. **Space-time trade-off:** Use O(K) space to achieve O(N) time.

4. **Multiple approaches:**
   * Linear scan: Simple, works on any array.
   * Hash map: Best for multiple queries.
   * Binary search: Fastest for sorted arrays with single query.

5. **JavaScript options:**
   * Object: Simple, keys auto-convert to strings.
   * Map: More flexible, preserves key types.
   * Array methods: Functional but may be less efficient.

6. **Common applications:**
   * Finding duplicates
   * Mode (most frequent element)
   * Anagram detection
   * Two Sum problem
   * Character frequency in strings

7. **Interview strategy:**
   * Start with simple linear scan for single element.
   * Extend to frequency map for all elements.
   * Mention binary search for sorted arrays.
   * Discuss space-time trade-offs.
   * Show clean code with proper handling of edge cases.

8. **Related problems:**
   * Find mode (most frequent element)
   * Find element with odd/even occurrence
   * Find unique element (all others appear twice)
   * Majority element (appears > N/2 times)
   * K most frequent elements

9. **Optimization tricks:**
   * Early return if count reaches certain threshold.
   * Use array instead of map if elements are in small range.
   * Sort + count for memory-constrained scenarios.

10. **Common mistakes:**
    * Not handling zero or negative numbers.
    * Assuming elements are in specific range.
    * Not considering empty array.
    * Using wrong data structure (inefficient for problem).

11. **Performance considerations:**
    * For small arrays (<100): Linear scan is fine.
    * For multiple queries: Build frequency map once.
    * For sorted arrays: Consider binary search.
    * For very large arrays: Consider streaming/chunking.

12. **Testing strategy:**
    * ✓ Empty array
    * ✓ Single element
    * ✓ Target not present
    * ✓ All same elements
    * ✓ Negative numbers
    * ✓ Zeros
    * ✓ Large arrays
    * ✓ Multiple occurrences
    * ✓ Single occurrence

