---
title: "Find the Duplicate Number"
description: "Understand First-In-First-Out (FIFO) processing. Learn queue operations, circular queues, priority queues, deques, and queue applications in algorithms and system design."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
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

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Find Duplicates – Optimized Solution (JavaScript)
-----------------------

### Problem: Find Duplicates in O(n) Time and O(n) Extra Space
Given an array `arr[]` of size `n` containing integers from `0` to `n-1` (inclusive), some elements may appear **more than once**.  
Find and return all **duplicate elements** in the array.

> Print each duplicate **only once**.

### **Example 1**

**Input:** `n = 7 arr = [1, 2, 3, 6, 3, 6, 1]`

**Output:** `[1, 3, 6]`

**Explanation:**  
Numbers 1, 3, and 6 appear more than once.

### **Example 2**

**Input:** `n = 5 arr = [1, 2, 3, 4, 3]`

**Output:** `[3]`

**Explanation:**  
Only `3` appears more than once.

## Approach 1: Using a Frequency Map (HashMap / Object)
* **Time Complexity:** O(n)  
* **Space Complexity:** O(n)

### Logic

*   Create a hash map (object or Map) to count occurrences.
*   Iterate through the array.
*   Increment frequency count for each element.
*   Return all numbers that have a count > 1.
    

### JavaScript Code
```javascript 
function findDuplicates(arr) {   
  const freq = {};   
  const result = [];    
  
  for (const num of arr) {     
    freq[num] = (freq[num] || 0) + 1;   
  }    
  
  for (const key in freq) {     
    if (freq[key] > 1) result.push(Number(key));   
  }    
  return result; 
}  

console.log(findDuplicates([1, 2, 3, 6, 3, 6, 1])); // [1, 3, 6]
```

### **Pros:**
*   Simple and easy to understand.
*   Works efficiently for all valid inputs.
    

### **Cons:**
*   Uses extra space proportional to array size.
    
---

## Approach 2: Using a `Set` (Cleaner and Concise)

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

### Logic
*   Use a `Set` to track seen elements. 
*   If an element is seen again → it’s a duplicate. 
*   Use another `Set` to store unique duplicates.
    

### JavaScript Code

```javascript
function findDuplicates(arr) {   
  const seen = new Set();   
  const duplicates = new Set();    
  
  for (const num of arr) {     
    if (seen.has(num)) duplicates.add(num);     
    else seen.add(num);   
  }    
  
  return Array.from(duplicates); 
}  

console.log(findDuplicates([1, 2, 3, 6, 3, 6, 1])); // [3, 6, 1]
```

### **Pros:**
*   Clean, short, and avoids frequency counting.
*   Naturally prevents printing duplicates multiple times.
    
### **Cons:**
*   Still uses extra space (two sets).
    
---

## Approach 3: In-Place Modification (O(1) Extra Space)

> Works **only** when elements are in the range `0` to `n-1`.

* **Time Complexity:** O(n)  
* **Space Complexity:** O(1)

### Logic

*   For each element `arr[i]`, go to index `abs(arr[i])`.
*   Multiply that element by `-1` to mark it as visited.
*   If it’s **already negative**, it means we’ve seen it before → duplicate.
    

### JavaScript Code
```javascript
function findDuplicates(arr) {   
  const result = [];      
  
  for (let i = 0; i < arr.length; i++) {     
    const index = Math.abs(arr[i]);          
    
    if (arr[index] >= 0) {       
      arr[index] = -arr[index];     
    } else {       
      result.push(index);     
    }   
  }      
  
  return result; 
}  

console.log(findDuplicates([1, 2, 3, 6, 3, 6, 1])); // [1, 3, 6]
```

### **Pros:**
*   **No extra space** (in-place).
*   Still linear time.
    

### **Cons:**
*   **Modifies the array** (not suitable if original array must remain unchanged).
*   Only works when `0 <= arr[i] < n`.
    
---

## Approach 4: Using Counting Array
**Time Complexity:** O(n)  
**Space Complexity:** O(n)

### Logic
*   Create a temporary array `count` of size `n` initialized to 0.
*   For each number `x`, increment `count[x]`.
*   If any count > 1, push to result.
    

### JavaScript Code
```javascript
function findDuplicates(arr) {   
  const n = arr.length;   
  const count = new Array(n).fill(0);   
  const result = [];    
  
  for (const num of arr) {     
    count[num]++;   
  }    
  
  for (let i = 0; i < n; i++) {     
    if (count[i] > 1) result.push(i);   
  }    
  
  return result; 
}  

console.log(findDuplicates([1, 2, 3, 6, 3, 6, 1])); // [1, 3, 6]
```

### **Pros:**

*   Simple, predictable, O(n).  
*   No hash maps.
    

### **Cons:**

*   Uses extra array of size `n`.
    

## Summary

| Approach | Time | Space | Modifies Array | Suitable For |
| --- | --- | --- | --- | --- |
| HashMap/Object | O(n) | O(n) | ❌   | General use |
| Using Set | O(n) | O(n) | ❌   | Simple + clean |
| In-place Negative Marking | O(n) | O(1) | ✅   | Arrays 0 to n-1 |
| Counting Array | O(n) | O(n) | ❌   | Range-based inputs |

## **Recommended Approach**

If the array elements are **from 0 to n−1**, the **in-place marking** method is the **most optimized**.  
Otherwise, use the **Set-based approach** — it’s clean, safe, and fast.
