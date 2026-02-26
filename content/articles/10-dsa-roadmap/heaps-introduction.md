---
title: Introduction
description: Master Introduction in the Heaps module. Comprehensive guide and
  algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

**Heaps** are a a specialized tree\-based data structure designed to efficiently retrieve the **highest priority element** at any time\.

This "priority" can mean the largest value, the smallest value, or the item with the earliest deadline, making heaps exceptionally versatile\.

Heaps guarantee O\(log n\) time for insertion and removal and O\(1\) time for accessing the highest priority element\.

Because of these properties, heaps are widely used in real\-world systems including:

*   **priority based task scheduling** in operating systems
*   **and shortest path algorithms** like Dijkstra

In this chapter, I’ll cover:

*   What a heap is and how it works
*   Difference types of heaps
*   how to implement heap in code
*   Core heap operations and their complexities

# What is a Heap?

So, what exactly is a heap?

A **heap** is a special kind of binary tree optimized for fast access to the highest\-priority element\.

503010204015

It follows two key rules:

### **1\. Complete Binary Tree**

*   A heap is always a **complete binary tree**\.
*   That means every level of the tree is completely filled, except possibly the last\.
*   And in the last level, nodes are filled from **left to right** with no gaps\.

This is what keeps the tree balanced and ensures operations like insertion and deletion are efficient\.

### **2\. Heap Property**

Every heap must also satisfy the **heap property**, which comes in two flavors:

##### **Max Heap**

503010204015

*   Every parent node is **greater than or equal to** its children\.
*   The root node is always the **largest element** in the heap\.
*   Used when you need fast access to the maximum value\.

##### **Min Heap**

5103040152520

*   Every parent node is **smaller than or equal to** its children\.
*   The root node is always the **smallest element** in the heap\.
*   Useful when you want quick access to the minimum value\.

# Representing a Heap

Even though a heap is conceptually a **binary tree**, we don’t usually store it using nodes and pointers like a typical tree\. Instead, the most common and efficient way to represent a heap is with a simple **array**\.

Because a heap is a **complete binary tree** \(filled level by level, left to right\), it maps perfectly into an array without wasting space\.

*   For a node at index `i`:

*   The **left child** is at `2 * i + 1`
*   The **right child** is at `2 * i + 2`
*   The **parent** is at `(i - 1) / 2`

This mapping allows us to navigate the heap without storing extra pointers, which makes the implementation simpler and faster\.

Java

```java
class ArrayHeap {
   int[] heap;
   int size;

   public ArrayHeap(int capacity) {
       heap = new int[capacity];
       size = 0;
   }

   private int parent(int i) { return (i - 1) / 2; }
   private int leftChild(int i) { return 2 * i + 1; }
   private int rightChild(int i) { return 2 * i + 2; }
}
```

Here:

*   The `heap` array stores the values\.
*   `size` keeps track of how many elements are in the heap\.
*   And with those helper functions, we can easily move between parent and child nodes\.

### **Quick Example**

Consider a max heap stored as:

5030151020816

*   At the top, `index 0` is our root: **50**\.
*   Its children? We check `2*0+1` \(index 1\) and `2*0+2` \(index 2\)\. And there they are: **30** and **20**\.
*   Let's try another one\. Take **30**, which is at `index 1`\.
*   Its children should be at `2*1+1` \(index 3\) and `2*1+2` \(index 4\)\. And , that's **15** and **10**\.

This is why heaps are implemented using arrays — the structure lines up naturally and keeps the operations fast and simple\.

# Common Heap Operations

Now that you know how heaps are structured, let’s look at the core operation you’ll use in practice\.

For the examples we will use a max\-heap\. The logic for a Min\-Heap is identical; you just reverse the comparison operations\.

### **1\. Peek**

This is the simplest and fastest operation\.

*   The **peek** operation simply returns the root element without removing it\.
*   In a max\-heap, it’s the max value and it’s always at the root of the three which corresponds to the first element in our heap array at`index 0`
*   The time complexity is **O\(1\) since it’s a direct lookup**\.

Java

```java
class MaxHeap {
   // Our heap is stored as a dynamic array (List)
   List<Integer> heap = new ArrayList<>();

   public int peek() {
       if (heap.isEmpty()) {
           throw new NoSuchElementException("Heap is empty.");
       }
       // The max element is always at the root (index 0)
       return heap.get(0);
   }
   
   // ... other methods ...
}
```

### **2\. Insert**

When we add a new element, we must satisfy _both_ heap properties:

1.  **Complete Tree Property:** The tree must be filled from left to right, with no gaps\.
2.  **and Heap Property:** Every parent must be greater that its children \(for a max\-heap\)\.

It's easiest to satisfy the **Complete Tree** property first\. We just add the new element to the _very last_ available spot in the tree, which is simply the end of our array\.

This, however, will almost certainly _break_ the **Heap Property**\. The new element might be larger than its parent\. To fix this, we "bubble up" \(or "percolate up"\) the new element\.

We compare it to its parent; if it's larger, we swap them\. We repeat this process—compare, swap, move up—until the new element finds its rightful place, either by being smaller than its new parent or by becoming the new root\.

Here’s what it looks like in code:

1.  Add the new value to the end of the `heap` list\.
2.  Get the index of this new element \(`i = heap.size() - 1`\)\.
3.  While the element is not the root \(`i > 0`\):

1.  Find its parent's index \(`parent = (i - 1) / 2`\)\.
2.  If the element is **greater than** its parent, swap them\.
3.  Update `i` to be the parent's index and continue the loop\.
4.  If the element is **less than or equal to** its parent, the heap property is restored\. Stop the loop\.

Java

```java
public void insert(int val) {
       // 1. Add element to the end to maintain complete tree
       heap.add(val);
       
       // 2. Bubble up to restore heap property
       int i = heap.size() - 1; // Start at the new element

       while (i > 0) {
           int parent = (i - 1) / 2;
           
           // If child is greater than parent, swap
           if (heap.get(i) > heap.get(parent)) {
               Collections.swap(heap, i, parent);
               i = parent; // Move up to the parent's index
           } else {
               // Parent is larger, property is restored
               break; 
           }
       }
   }
```

Time Complexity is O\(log n\) because the height of a complete binary tree with n nodes is log\_2\(n\)\. In the worst case, the new element must travel all the way from a leaf to the root\. This path is, by definition, the height of the tree\.

### **3\. Extract Max: Remove the Top Element**

This is the most common heap operation\. It removes and returns the root element\. Like `insert`, this operation must also preserve both heap properties\.

Removing the root \(`index 0`\) is easy, but it leaves a _hole_ at the top\. This breaks the **Complete Tree** property\.

To fix this, we use a clever trick:

1.  We take the **last element** from the array \(the right\-most leaf\) and move it into the root's empty spot\.
2.  This restores the **Complete Tree** property immediately\. We no longer have a hole\.
3.  But now, the **Heap Property** is almost certainly broken\. The element we just moved to the root is likely _smaller_ than its new children\.

To fix _this_, we "sift down" \(or "heapify down"\) the new root\. We compare it to its children\. If it's smaller than either of them, we swap it with the **larger** of its two children \(to ensure the largest value moves up\)\. We repeat this process—compare, swap with largest child, move down—until the element finds its correct position \(i\.e\., it's larger than both of its children, or it becomes a leaf\)\.

Here’s how it looks in code:

1.  If the heap is empty, throw an exception\.
2.  Store the root element \(`heap.get(0)`\) in a variable to return later\.
3.  Remove the _last_ element from the heap and store it\.
4.  If the heap is now empty \(we just removed the only element\), return the stored root\.
5.  If not, place the \(previously last\) element at the root \(`heap.set(0, lastElement)`\)\.
6.  Call `heapifyDown(0)` to sift the new root down to its correct position\.

Java

```java
public int extractMax() {
       if (heap.isEmpty()) {
           throw new NoSuchElementException("Heap is empty.");
       }

       // 1. Store the max value to return
       int max = heap.get(0);
       
       // 2. Take the last element from the end
       int last = heap.remove(heap.size() - 1);

       // 3. If heap is not empty, move last element to root and sift down
       if (!heap.isEmpty()) {
           heap.set(0, last);
           heapifyDown(0); // Restore heap property
       }

       return max;
   }

   /**
    * Helper method to restore the heap property by sifting an
    * element down from a given index.
    * @param i The index to start sifting down from.
    */
   private void heapifyDown(int i) {
       int n = heap.size();
       int largest = i; // Initialize largest as root

       while (true) {
           int left = 2 * i + 1;
           int right = 2 * i + 2;
           
           // Check if left child exists and is larger than current 'largest'
           if (left < n && heap.get(left) > heap.get(largest)) {
               largest = left;
           }

           // Check if right child exists and is larger than current 'largest'
           if (right < n && heap.get(right) > heap.get(largest)) {
               largest = right;
           }

           // If largest is not the current node 'i', swap them
           if (largest != i) {
               Collections.swap(heap, i, largest);
               // Move down to the child's index to continue sifting
               i = largest;
           } else {
               // The element is in its correct place
               break;
           }
       }
   }
```

Time Complexity: is O\(log n\)\. Just like insert, the operation follows a path from the root to a leaf\. The length of this path is the tree's height, which is O\(log n\)\.

### **4\. Build Heap \(Heapify an Array\)**

Sometimes, you are given an entire unsorted array and need to convert it into a valid heap\.

You could start with an empty heap and call `insert()` for each of the $n$ elements in the array\. Since each `insert` is O\(log n\), this would take O\(n log n\) time\. We can do much better\!

We know that all **leaf nodes** \(the entire second half of the array\) are, by definition, already valid heaps of size 1\. They have no children, so the heap property is trivially true\.

The real work is with the **non\-leaf nodes** \(the first half of the array\)\. If we can ensure that every non\-leaf node satisfies the heap property relative to its children, the whole tree will become a valid heap\. So, we iterate _backwards_ from the **last non\-leaf node** up to the root \(`index 0`\)\. For each of these nodes, we call `heapifyDown()`\. This "sifts down" the element, allowing larger children to move up and restoring the local heap property\. Because we start from the bottom, by the time we `heapifyDown` a node, we are _guaranteed_ that its children are already valid heap roots themselves\.

Here is how it works:

1.  Copy all elements from the input array into our `heap` list\.
2.  Find the index of the last non\-leaf node\. This is `(heap.size() / 2) - 1`\.
3.  Iterate backwards from this index down to 0 \(`for (int i = ...; i >= 0; i--)`\)\.
4.  In each iteration, call `heapifyDown(i)`\.
5.  When the loop finishes, the entire array is a valid heap\.

Java

```java
public void buildHeap(int[] arr) {
       // 1. Copy all elements into our heap list
       heap = new ArrayList<>();
       for (int num : arr) {
           heap.add(num);
       }

       // 2. Start from the last non-leaf node and heapify down
       int lastNonLeaf = (heap.size() / 2) - 1;
       for (int i = lastNonLeaf; i >= 0; i--) {
           heapifyDown(i);
       }
   }
```

**Time Complexity is** O\(n\)\.

#### **Why O\(n\) and not O\(n log n\)?**

This is a classic analysis\. It _looks_ like O\(n log n\) because we call `heapifyDown` \(an O\(log n\) operation\) n/2 times\. But this is a loose upper bound\.

*   A tighter analysis shows that most of the work is cheap\.
*   The nodes at the _bottom_ \(e\.g\., height 1\) only sift down 1 level\. There are n/4 such nodes\.
*   The nodes at height 2 only sift down 2 levels\. There are n/8 such nodes\.
*   The root \(height log n\) sifts down log n levels, but there is only 1 root\.
*   The total work is the sum: W = sum\_\{h=0\}^\{log n\} frac\{n\}\{2^\{h\+1\}\} \\cdot O\(h\)\. This mathematical series converges to O\(n\)\.

You are doing a lot of cheap work on the many nodes at the bottom and a small amount of expensive work on the few nodes at the top\. The total cost is dominated by the linear number of nodes, not the logarithmic height\.