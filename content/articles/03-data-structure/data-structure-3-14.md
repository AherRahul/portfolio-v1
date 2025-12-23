---
title: "Array Rotation"
description: "Master the art of rotating arrays - both left and right rotations. Learn multiple approaches from brute force to optimal solutions, understand the reversal algorithm, and explore juggling algorithm for array rotation."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Array Rotation Techniques"
    type: "reference"
    url: "https://www.geeksforgeeks.org/array-rotation/"
    description: "Comprehensive guide to array rotation algorithms"
  - title: "Array Rotation Visualizer"
    type: "tool"
    url: "https://visualgo.net/en/array"
    description: "Interactive visualization of array operations"
  - title: "Rotation Problems"
    type: "practice"
    url: "https://leetcode.com/tag/array/"
    description: "Practice array rotation and manipulation problems"
  - title: "Scaler Notes - Day 33, 18 Apr - DSA: Introduction to Problem Solving"
    type: "documentation"
    url: "https://res.cloudinary.com/duojkrgue/image/upload/v1761497972/Portfolio/scalerNotes/01-dsa-problem-solving_zudvhj.pdf"
    description: "DSA Mathematical foundations"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Array Rotation
----------------------------

### Problem Statement:

Given an array `arr` of `N` integers and an integer `K`, **rotate the array to the left by K positions**.

Left rotation means moving elements from the beginning to the end. After K left rotations, the first K elements move to the end, and the remaining elements shift left.

**Note:** Perform the rotation **in-place** with O(1) extra space (excluding the input array).

### Examples:

#### Example 1:

**Input:** arr = [1, 2, 3, 4, 5], K = 2

**Output:** [3, 4, 5, 1, 2]

**Explanation:** 
* Original: [1, 2, 3, 4, 5]
* After 1st rotation: [2, 3, 4, 5, 1]
* After 2nd rotation: [3, 4, 5, 1, 2]

#### Example 2:

**Input:** arr = [10, 20, 30, 40, 50, 60], K = 4

**Output:** [50, 60, 10, 20, 30, 40]

**Explanation:** 
* First 4 elements [10, 20, 30, 40] move to the end.
* Remaining elements [50, 60] move to the front.

#### Example 3:

**Input:** arr = [7, 8, 9], K = 1

**Output:** [8, 9, 7]

**Explanation:** 
* Single left rotation moves 7 to the end.

#### Example 4:

**Input:** arr = [1, 2, 3, 4, 5], K = 5

**Output:** [1, 2, 3, 4, 5]

**Explanation:** 
* Rotating by N positions brings the array back to original.

### Constraints:

* `1 ≤ N ≤ 10^5`
* `0 ≤ K ≤ 10^9`
* `-10^9 ≤ arr[i] ≤ 10^9`

### Important Points to Understand:

**1. Effective Rotations:**
* If K > N, rotating by K is the same as rotating by `K % N`.
* Example: Array of 5 elements rotated by 7 = rotating by 7 % 5 = 2.

**2. Edge Cases:**
* K = 0: No rotation needed.
* K = N: Array returns to original position.
* K > N: Use K = K % N to optimize.

**3. Left vs Right Rotation:**
* **Left rotation by K** = **Right rotation by (N - K)**
* Example: Left rotate [1,2,3,4,5] by 2 = Right rotate by 3

**4. In-Place Requirement:**
* Must modify the original array.
* Use O(1) extra space (only a few variables).

### Approach:

**Approach 1: Brute Force (Using Temp Array)**
1. Store first K elements in a temporary array.
2. Shift remaining N-K elements to the left.
3. Copy temp array elements to the end.

**Approach 2: One by One Rotation**
1. Perform single rotation K times.
2. Each rotation: save first element, shift all left, place saved element at end.

**Approach 3: Reversal Algorithm (Optimal)**
1. Normalize K: `K = K % N`
2. Reverse first K elements.
3. Reverse remaining N-K elements.
4. Reverse the entire array.

### Time Complexity:

**Brute Force:**
* **Time Complexity = O(N)** - One pass to copy, one pass to shift.
* **Space Complexity = O(K)** - Temporary array for K elements. ❌

**One by One:**
* **Time Complexity = O(N × K)** - K iterations, each shifting N elements. ❌
* **Space Complexity = O(1)** - Only one temp variable.

**Reversal Algorithm (Optimal):**
* **Time Complexity = O(N)** - Three reversal operations, each O(N).
* **Space Complexity = O(1)** - In-place reversal. ✓

### Space Complexity:

* **Optimal Space = O(1)** using reversal algorithm.

### Dry Run - Brute Force:

```
Input: arr = [1, 2, 3, 4, 5], K = 2

Step 1: Store first K elements
    temp = [1, 2]
    
Step 2: Shift remaining elements left
    i = 0: arr[0] = arr[2] = 3
    i = 1: arr[1] = arr[3] = 4
    i = 2: arr[2] = arr[4] = 5
    arr = [3, 4, 5, 4, 5]
    
Step 3: Copy temp to end
    arr[3] = temp[0] = 1
    arr[4] = temp[1] = 2
    arr = [3, 4, 5, 1, 2]

Output: [3, 4, 5, 1, 2]
```

### Dry Run - Reversal Algorithm:

```
Input: arr = [1, 2, 3, 4, 5], K = 2

Step 1: Normalize K
    K = 2 % 5 = 2
    
Step 2: Reverse first K elements (0 to 1)
    arr = [2, 1, 3, 4, 5]
    
Step 3: Reverse remaining N-K elements (2 to 4)
    arr = [2, 1, 5, 4, 3]
    
Step 4: Reverse entire array (0 to 4)
    arr = [3, 4, 5, 1, 2]

Output: [3, 4, 5, 1, 2]
```

### Brute Force Approach - JavaScript Code:

```javascript
function rotateArrayBruteForce(arr, K) {
    const N = arr.length;
    K = K % N; // Handle K > N
    
    if (K === 0) return arr;
    
    // Store first K elements
    const temp = [];
    for (let i = 0; i < K; i++) {
        temp.push(arr[i]);
    }
    
    // Shift remaining elements left
    for (let i = 0; i < N - K; i++) {
        arr[i] = arr[i + K];
    }
    
    // Copy temp to end
    for (let i = 0; i < K; i++) {
        arr[N - K + i] = temp[i];
    }
    
    return arr;
}
```

### Visualization - Reversal Algorithm:

```
Example: arr = [1, 2, 3, 4, 5, 6, 7], K = 3

Goal: Move [1, 2, 3] to the end

Step 1: Reverse first K elements (first 3)
[1, 2, 3, 4, 5, 6, 7]  →  [3, 2, 1, 4, 5, 6, 7]
 -------                    -------

Step 2: Reverse remaining elements (last 4)
[3, 2, 1, 4, 5, 6, 7]  →  [3, 2, 1, 7, 6, 5, 4]
          -----------              -----------

Step 3: Reverse entire array
[3, 2, 1, 7, 6, 5, 4]  →  [4, 5, 6, 7, 1, 2, 3]
 -------------------       -------------------

Final: [4, 5, 6, 7, 1, 2, 3] ✓
```

### Optimal Approach - Reversal Algorithm:

```javascript
function rotateArray(arr, K) {
    const N = arr.length;
    K = K % N; // Normalize K
    
    if (K === 0) return arr; // No rotation needed
    
    // Helper function to reverse a portion of array
    function reverse(start, end) {
        while (start < end) {
            [arr[start], arr[end]] = [arr[end], arr[start]];
            start++;
            end--;
        }
    }
    
    // Step 1: Reverse first K elements
    reverse(0, K - 1);
    
    // Step 2: Reverse remaining N-K elements
    reverse(K, N - 1);
    
    // Step 3: Reverse entire array
    reverse(0, N - 1);
    
    return arr;
}
```

### Alternative Approach - Juggling Algorithm:

```javascript
function rotateArrayJuggling(arr, K) {
    const N = arr.length;
    K = K % N;
    
    if (K === 0) return arr;
    
    // Find GCD of N and K
    function gcd(a, b) {
        return b === 0 ? a : gcd(b, a % b);
    }
    
    const numSets = gcd(N, K);
    
    // Move elements in sets
    for (let i = 0; i < numSets; i++) {
        const temp = arr[i];
        let j = i;
        
        while (true) {
            let nextIdx = j + K;
            if (nextIdx >= N) {
                nextIdx -= N;
            }
            
            if (nextIdx === i) break;
            
            arr[j] = arr[nextIdx];
            j = nextIdx;
        }
        
        arr[j] = temp;
    }
    
    return arr;
}
```

**Time Complexity:** O(N)
**Space Complexity:** O(1)

### One by One Rotation:

```javascript
function rotateArrayOneByOne(arr, K) {
    const N = arr.length;
    K = K % N;
    
    // Perform K single rotations
    for (let i = 0; i < K; i++) {
        // Save first element
        const first = arr[0];
        
        // Shift all elements left by one
        for (let j = 0; j < N - 1; j++) {
            arr[j] = arr[j + 1];
        }
        
        // Place first element at end
        arr[N - 1] = first;
    }
    
    return arr;
}
```

**Time Complexity:** O(N × K) ❌ (Not optimal for large K)
**Space Complexity:** O(1) ✓

### Right Rotation (Bonus):

```javascript
function rotateRight(arr, K) {
    const N = arr.length;
    K = K % N;
    
    // Right rotation by K = Left rotation by (N - K)
    return rotateArray(arr, N - K);
}
```

### Edge Cases to Consider:

**1. K = 0:**
* Input: arr = [1, 2, 3], K = 0
* Output: [1, 2, 3] (no change)

**2. K = N:**
* Input: arr = [1, 2, 3, 4], K = 4
* Output: [1, 2, 3, 4] (back to original)

**3. K > N:**
* Input: arr = [1, 2, 3], K = 7
* Effective K = 7 % 3 = 1
* Output: [2, 3, 1]

**4. Single Element:**
* Input: arr = [5], K = 100
* Output: [5] (always same)

**5. Two Elements:**
* Input: arr = [10, 20], K = 1
* Output: [20, 10]

**6. K = 1:**
* Input: arr = [1, 2, 3, 4, 5], K = 1
* Output: [2, 3, 4, 5, 1]

**7. Large K:**
* Input: arr = [1, 2, 3], K = 10^9
* Must use K % N to optimize.

### Key Takeaways:

1. **Reversal algorithm** is the most elegant and optimal solution for array rotation.

2. **Normalization is crucial:** Always use `K = K % N` to handle K > N cases.

3. **Three reversal steps:**
   * Reverse first K elements
   * Reverse remaining N-K elements
   * Reverse entire array

4. **Multiple approaches:** Understanding brute force, juggling, and reversal shows depth.

5. **Left vs Right:** Remember that left rotation by K = right rotation by (N - K).

6. **Applications:**
   * Circular queues
   * Image rotation
   * Cyclic data structures
   * String rotation problems

7. **Interview strategy:**
   * Start with brute force explanation.
   * Optimize to reversal algorithm.
   * Mention juggling algorithm as alternative.
   * Discuss time/space complexity trade-offs.

8. **Related problems:**
   * Rotate 2D matrix
   * Check if string is rotation of another
   * Cyclic array problems
   * Search in rotated sorted array

9. **Common mistakes:**
   * Not handling K > N
   * Forgetting K = 0 case
   * Creating unnecessary extra arrays
   * Off-by-one errors in reversal indices

10. **Why reversal works:**
    * Mathematically sound: reversing twice returns to original.
    * The three reversals strategically place elements in correct positions.
    * Example: [A][B] → [A'][B'] → [B'A']' = [BA]

11. **Performance comparison:**
    * One by one: O(N × K) - worst for large K
    * Brute force: O(N) time, O(K) space
    * Reversal: O(N) time, O(1) space ✓ (Best)
    * Juggling: O(N) time, O(1) space ✓ (Best)

12. **Testing checklist:**
    * ✓ K = 0
    * ✓ K = N
    * ✓ K > N
    * ✓ K = 1
    * ✓ Single element
    * ✓ Two elements
    * ✓ Large arrays
    * ✓ Negative numbers

