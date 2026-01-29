---
title: "Carry Forward"
description: "Master the carry forward technique in arrays. Learn how to efficiently process array elements by carrying information forward, reducing redundant calculations and improving algorithm performance."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Array Data Structure Visualization"
    type: "tool"
    url: "https://visualgo.net/en/list"
    description: "Interactive array operations visualization"
  - title: "JavaScript Array Methods Guide"
    type: "reference"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"
    description: "Complete JavaScript array method documentation"
  - title: "Array Algorithm Practice"
    type: "practice"
    url: "https://leetcode.com/tag/array/"
    description: "Practice problems focusing on array algorithms"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Carry Forward
----------------------------

### Introduction to Carry Forward

The **Carry Forward** technique is a powerful optimization strategy in array processing where we maintain and propagate information from previous iterations to avoid redundant calculations. This technique is particularly useful when dealing with problems that require tracking cumulative information or state across array elements.

### Key Concepts

1. **State Propagation**: Carry information from one iteration to the next
2. **Optimization**: Reduce time complexity by eliminating redundant operations
3. **Memory Efficiency**: Often requires only O(1) extra space
4. **Sequential Processing**: Process elements in order while maintaining state

### When to Use Carry Forward

- Finding subarrays with specific properties
- Counting pairs or triplets with certain conditions
- Tracking cumulative states or conditions
- Problems involving consecutive elements

### Basic Example

```javascript
// Count pairs (i, j) where i < j and arr[i] == 'a' && arr[j] == 'g'
function countPairs(arr) {
    let count = 0;
    let aCount = 0; // Carry forward the count of 'a's
    
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 'a') {
            aCount++; // Found an 'a', increment count
        } else if (arr[i] === 'g') {
            count += aCount; // For each 'g', add all previous 'a's
        }
    }
    
    return count;
}
```

### Time Complexity
- **Time Complexity**: O(n) - Single pass through the array
- **Space Complexity**: O(1) - Only using constant extra space

### Practice Problems

1. Count special pairs in array
2. Find leader elements
3. Maximum consecutive characters
4. Stock buy-sell profit calculations

### Key Takeaways

- Carry Forward eliminates nested loops in many scenarios
- Reduces time complexity from O(n²) to O(n)
- Essential for optimization in array problems
- Forms foundation for more advanced techniques

