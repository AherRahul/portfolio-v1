---
title: "Reverse String"
description: "Understand dynamic memory allocation and pointer manipulation. Master singly linked lists, doubly linked lists, circular lists, and advanced linked list operations and algorithms."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Linked List Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/list"
    description: "Interactive linked list operations visualization"
  - title: "Linked List Problems"
    type: "practice"
    url: "https://leetcode.com/tag/linked-list/"
    description: "Practice problems for mastering linked list algorithms"
  - title: "Memory Management Guide"
    type: "reference"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management"
    description: "Understanding memory allocation and garbage collection"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)


Reverse String 
---------------------

### Problem Statement:

Write a function that reverses a string. The input string is given as an array of characters `s`. You must do this by modifying the input array in-place with `O(1)`extra memory.

<br />

#### Example 1:

**Input:** = \[“h”,”e”,”l”,”l”,”o”\]

**Output:** = \[“o”,”l”,”l”,”e”,”h”\]

<br />

#### Example 2:

**Input:** = \[“H”,”a”,”n”,”n”,”a”,”h”\]

**Output:** = \[“h”,”a”,”n”,”n”,”a”,”H”\]


### Approach: Two Pointer Technique

*   Initialize two pointers, one at the start and one at the end of the array.
*   Swap the characters at both pointers.
*   Move the pointers towards the center until they meet.

### Time Complexity:

*   **Time Complexity = O(n)**
    

### Space Complexity:

*   **Space Complexity = O(1)**
    

### Dry Run

```
Input: = ["h", "e", "l", "l", "o"]

len = 5, halfLen = 2
                    
i = 0 → swap [0] and [4] → ["o", "e", "l", "l", "h"]
i = 1 → swap [1] and [3] → ["o", "l", "l", "e", "h"]
  

Output: ["o", "l", "l", "e", "h"]
```

### Visualisation:

![Reverse String](https://namastedev.com/blog/wp-content/uploads/2025/06/Screenshot-2025-06-26-at-8.19.31 PM.png)

### JavaScript Code

```javascript

var reverseString = function(s) {
    let len = s.length;
    let halfLen = Math.floor(len / 2);

    for (let i = 0; i < halfLen; i++) {
        let temp = s[i];
        s[i] = s[len - i - 1];
        s[len - i - 1] = temp;
    }
};
         
```