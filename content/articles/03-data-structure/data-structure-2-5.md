---
title: "Merge Sorted Arrays"
description: "Understand First-In-First-Out (FIFO) processing. Learn queue operations, circular queues, priority queues, deques, and queue applications in algorithms and system design."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Queue Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/list"
    description: "Interactive queue operations visualization"
  - title: "Queue Problems Practice"
    type: "practice"
    url: "https://leetcode.com/tag/queue/"
    description: "Practice problems for mastering queue algorithms"
  - title: "Priority Queue Implementation"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Priority_queue"
    description: "Understanding priority queue data structures"
  - title: "Scaler Notes - Day 33, 18 Apr - DSA: Introduction to Problem Solving"
    type: "documentation"
    url: "https://res.cloudinary.com/duojkrgue/image/upload/v1761497972/Portfolio/scalerNotes/01-dsa-problem-solving_zudvhj.pdf"
    description: "DSA Mathematical foundations"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)


Merge Sorted Arrays 
-----------------------

### Problem Statement:

You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in nums1 and nums2 respectively.

Merge`nums1` and `nums2` into a single array sorted in non-decreasing order.

The final sorted array should not be returned by the function, but instead be stored inside the array `nums1`. To accommodate this, nums1 has a length of `m + n`, where the first `m` elements denote the elements that should be merged, and the last `n` elements are set to 0 and should be ignored. `nums2` has a length of `n`.

<br />

#### Example 1:

**Input:** nums1 = \[ 1, 2, 3, 0, 0, 0 \], m = 3 nums2 = \[ 2, 5, 6 \], n = 3

**Output:** \[ 1, 2, 2, 3, 5, 6 \]

`Explanation:` The arrays we are merging are \[1, 2, 3 \] and \[ 2, 5, 6 \]. The result of the merge is \[ 1, 2, 2, 3, 5, 6 \] with the underlined elements coming from nums1.

<br />

#### Example 2:

**Input:** nums1 = \[ 1 \], m = 1, nums2 = \[\], n = 0

**Output:**\[ 1 \]

`Explanation:` The arrays we are merging are \[1\] and \[\]. The result of the merge is \[1\].

<br />

#### Example 3:

**Input:** nums1 = \[ 0 \], m = 0 nums2 = \[ 1 \], n = 1

**Output:**\[ 1 \]

`Explanation:` The arrays we are merging are \[\] and \[ 1 \]. The result of the merge is \[ 1 \]. Note that because m = 0, there are no elements in nums1. The 0 is only there to ensure the merge result can fit in nums1.

### Time Complexity:

*   **Time Complexity = O((m+n) log (m+n))** Due to sorting.
    

### Space Complexity:

*   **Space Complexity = O(1)** Extra (in-place).
    

### Approach: Brute Force (Simple Concatenate + Sort)

*   Overwrite the trailing zeros in `nums1` (from index m onwards) with all elements of `nums2`.
*   Sort the whole `nums1` array.

### Dry Run

```
Input: nums1 = [1, 2, 3, 0, 0, 0], m = 3 nums2 = [2, 5, 6], n = 3

    1. Copy nums2 into nums1 
       i = 3 to 5:
            nums1[3] = nums2[0] = 2
            nums1[4] = nums2[1] = 5
            nums1[5] = nums2[2] = 6 
            
        => nums1 = [1, 2, 3, 2, 5, 6]

    2. Sort the array
        nums1.sort((a, b) => a - b)
        => [1, 2, 2, 3, 5, 6]
  
```

### JavaScript Code

```javascript

 var merge = function(nums1, m, nums2, n) {
    for (let i = m; i < nums1.length; i++) {
      nums1[i] = nums2[i - m];
    }
    nums1.sort((a, b) => a - b);
  };     
```

---

### Approach 2: Two-Pointer Method

*   Instead of sorting at the end, this algorithm merges the arrays in sorted order using two pointers:
*   Copy the first m elements of nums1 into a temporary array (nums1Copy). Use two pointers p1 (for nums1Copy) and p2 (for nums2) to compare elements. At each index i of nums1, place the smaller of the elements from nums1Copy\[p1\] and nums2\[p2\].
*   Repeat until nums1 is fully filled with the merged sorted elements..

### Time Complexity:

*   **Time Complexity = O(m+n)**
    
    `Explanation:`
    
    *   Copying the first m elements to nums1Copy takes O(m).
    *   Merging the two sorted arrays takes O(m + n) because each index in nums1 is visited exactly once.

### Space Complexity:

*   **Space Complexity = O(m)**
    
    `Explanation:`
    
    *   You create a copy of the first m elements of nums1 in nums1Copy, which takes O(m) additional space.
    

### Dry Run

```
Input: nums1 = [1, 2, 3, 0, 0, 0], m = 3 nums2 = [2, 5, 6], n = 3

Execution nums1Copy = [1,2,3], p1 = 0, p2 = 0

        nums1Copy[0]=1 < nums2[0]=2 → nums1[0] = 1, p1++
        nums1Copy[1]=2 == nums2[0]=2 → nums1[1] = 2, p2++
        nums1Copy[1]=2 < nums2[1]=5 → nums1[2] = 2, p1++
        nums1Copy[2]=3 < nums2[1]=5 → nums1[3] = 3, p1++
        p1==3 → only nums2 left
        nums1[4] = 5, nums1[5] = 6
  

Output: nums1 = [1,2,2,3,5,6]
```
### JavaScript Code

```javascript

var merge = function(nums1, m, nums2, n) {
      let nums1Copy = nums1.slice(0, m)
      let p1 = 0;
      let p2 = 0;
      for (let i = 0; i < m + n; i++) {
          if (p2 >= n || (p1 < m && nums1Copy[p1] < nums2[p2])) {
              nums1[i] = nums1Copy[p1];
              p1++;
          } else {
              nums1[i] = nums2[p2];
              p2++;
          }
      }
  };    
```
---

### Optimal Approach

*   We have two sorted arrays:
*   nums1 with length m + n where the first m elements are valid.
*   nums2 with n elements.
*   The goal: merge nums2 into nums1 in sorted order in-place.
*   Start filling nums1 from the end (index m + n - 1), comparing the last elements of both arrays (nums1\[m-1\] and nums2\[n-1\]).
*   Place the larger element at the current last position.
*   Move pointers accordingly:
*   Decrement the pointer in nums1 or nums2.
*   Decrement the position pointer for placement.
*   If nums2 is exhausted first, merging is done.
*   If nums1 is exhausted first, copy remaining elements of nums2.

### Time Complexity:

*   **Time Complexity = O((m+n) log (m+n))** Due to sorting.
    

### Space Complexity:

*   **Space Complexity = O(1) (constant space)**
    
    `Explanation`
    
    *   No extra significant space is used (in-place).
    *   Only a few variables (p1, p2, i) are used.
    

### JavaScript Code

```javascript

  var merge = function(nums1, m, nums2, n) {
    let p1 = m - 1;
    let p2 = n - 1;
  
    for (let i = m + n - 1; i >= 0; i--) {
      if (p2 < 0) break;
  
      if (p1 >= 0 && nums1[p1] > nums2[p2]) {
        nums1[i] = nums1[p1--];
      } else {
        nums1[i] = nums2[p2--];
      }
    }
  };     
```

### Important Points to Understand:

**1. In-Place Merging:**
* nums1 has enough space (m + n) to hold both arrays.
* Last n positions are initially 0 and meant for nums2 elements.

**2. Backward Approach:**
* Fill from the end to avoid overwriting values.
* This is the key insight for O(1) space solution.

**3. Three Approaches:**
* Brute force: Concatenate and sort - O((m+n) log(m+n))
* Two pointer (forward): Needs extra space - O(m)
* Two pointer (backward): Optimal - O(m+n) time, O(1) space

### Edge Cases to Consider:

**1. nums2 is empty (n = 0):**
* Input: nums1 = [1, 2, 3], m = 3, nums2 = [], n = 0
* Output: [1, 2, 3] (no changes needed)

**2. nums1 valid portion is empty (m = 0):**
* Input: nums1 = [0, 0, 0], m = 0, nums2 = [1, 2, 3], n = 3
* Output: [1, 2, 3]

**3. All nums1 elements larger:**
* Input: nums1 = [4, 5, 6, 0, 0, 0], m = 3, nums2 = [1, 2, 3], n = 3
* Output: [1, 2, 3, 4, 5, 6]

**4. All nums2 elements larger:**
* Input: nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [4, 5, 6], n = 3
* Output: [1, 2, 3, 4, 5, 6]

**5. Interleaved elements:**
* Input: nums1 = [1, 3, 5, 0, 0, 0], m = 3, nums2 = [2, 4, 6], n = 3
* Output: [1, 2, 3, 4, 5, 6]

### Key Takeaways:

1. **Backward filling** is the key insight for optimal space complexity.

2. **Three approaches** show progression from brute force to optimal.

3. **Sorted arrays** property enables efficient merging without extra comparison overhead.

4. **Two-pointer technique** is fundamental for merging operations.

5. **Space optimization:** Backward approach avoids extra array needed in forward approach.

6. **Applications:** Merge sort, external sorting, database merge operations.

7. **Interview strategy:** Always mention all three approaches and their trade-offs.

8. **Common mistakes:** Forgetting to handle cases where one array is exhausted first.

9. **Related problems:** Merge K sorted lists, Merge intervals, Sort colors.

10. **Foundation:** Understanding this prepares for more complex merge problems.