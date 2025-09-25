---
title: "Heaps & Priority Queues"
description: "Master complete binary trees with heap ordering. Learn min-heaps, max-heaps, heapify operations, and priority queue implementations for efficient priority-based processing."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - javascript
  - heaps
  - priority-queues
resources:
  - title: "Heap Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/heap"
    description: "Interactive heap operations and heapify visualization"
  - title: "Priority Queue Problems"
    type: "practice"
    url: "https://leetcode.com/tag/heap/"
    description: "Practice problems for mastering heap algorithms"
  - title: "Heap Sort Algorithm"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Heapsort"
    description: "Understanding heap-based sorting algorithms"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758827456/Portfolio/dsa/images/13/heaps.png)

Heaps & Priority Queues – Efficient Priority-Based Data Processing
===================================================================

Imagine you're the **emergency dispatcher at a busy hospital** 🏥 where every second counts and patients must be treated in order of medical urgency, not arrival time:

**🚨 The Emergency Room Challenge:**

**⏰ Traditional First-Come-First-Served Problems:**
- **Arrival Order**: Patient with minor sprain arrives before heart attack victim
- **Unfair Treatment**: Critical patients wait while minor cases are processed
- **Life-Threatening Delays**: Most urgent cases buried behind routine appointments
- **Inefficient Resource Use**: Doctors waste time on low-priority cases while emergencies wait

**🏥 The Priority-Based Solution (Heap System):**
- **Triage Assessment**: Each patient gets a **priority score** based on medical urgency
- **Automatic Ordering**: Highest priority patients **bubble to the front** automatically
- **Dynamic Adjustments**: New critical patients can **jump ahead** of existing queue
- **Efficient Processing**: Always treat the **most urgent patient next**

**🎯 Hospital Heap Rules:**
```
Priority Levels:
1 = Life-threatening (Heart attack, severe trauma)
2 = Urgent (Broken bones, severe pain)  
3 = Standard (Minor cuts, routine check-ups)
4 = Non-urgent (Prescription refills, follow-ups)

Heap Property: Parent ≤ Child (Min-Heap for priority numbers)
Always process lowest priority number (highest urgency) first
```

**⚡ The Heap Organization:**
```
        1 (Heart Attack)
       / \
      2   3 (Broken Arm, Minor Cut)
     / \ / \
    2 4 3 4 (Urgent cases and routine visits)
```

**🔄 Dynamic Priority Management:**
- **New Emergency**: Critical patient (priority 1) gets **bubbled up** to top immediately
- **Patient Treated**: Remove highest priority, next most urgent **bubbles up** automatically
- **Priority Changes**: If patient condition worsens, **increase priority** and re-organize
- **Efficient Updates**: All reorganization happens in **logarithmic time**

**📈 The Performance Revolution:**
- **Traditional Queue**: Must scan all patients to find most urgent → O(n) time
- **Heap-Based Priority**: Most urgent patient always at top → O(1) access, O(log n) updates
- **Real-Time Adjustments**: Add/remove patients with guaranteed O(log n) performance
- **Scalable System**: Works efficiently with 10 patients or 10,000 patients

**This is exactly how heaps work in computer science!** They provide:

**🌳 Heap = Priority-Ordered Complete Binary Tree:**
- **Complete Binary Tree**: All levels filled left-to-right (efficient array representation)
- **Heap Property**: Parent-child relationship maintains priority ordering
- **Efficient Operations**: Insert, extract, and update operations in O(log n) time
- **Array Implementation**: Can be stored efficiently in arrays using mathematical indexing

**Real-World Heap Applications:**
- **Operating System Scheduling**: Process priority management for CPU allocation
- **Dijkstra's Algorithm**: Finding shortest paths in graphs efficiently
- **Huffman Coding**: Building optimal compression trees
- **Event Simulation**: Processing events in chronological order
- **Load Balancing**: Distributing tasks based on server capacity
- **A* Pathfinding**: Game AI navigation with priority-based exploration

Heaps transform **priority-based processing** from expensive scanning operations into **logarithmic-time guaranteed performance** - making them essential for any system requiring efficient priority management!

## The Theoretical Foundation: What Are Heaps? 🏔️

### Understanding Heap Properties

**A heap is a complete binary tree where each node satisfies the heap property: the parent node has a higher (or equal) priority than its children.** This simple constraint enables efficient priority-based operations while maintaining a structured, predictable tree shape.

**Core Heap Concepts:**

1. **Complete Binary Tree**: All levels filled except possibly the last (filled left-to-right)
2. **Heap Property**: Parent-child priority relationship maintained throughout
3. **Array Representation**: Can be efficiently stored in arrays using mathematical indexing
4. **Two Types**: Min-heap (smallest at root) and max-heap (largest at root)
5. **Efficient Operations**: Insert, extract, and heapify in O(log n) time

**Heap Property Examples:**

**Min-Heap (smallest element at root):**
```
        1
       / \
      3   2
     / \ / \
    7 8 4 5

Property: Parent ≤ Children
1 ≤ {3,2}, 3 ≤ {7,8}, 2 ≤ {4,5} ✓
```

**Max-Heap (largest element at root):**
```
        9
       / \
      7   8
     / \ / \
    3 4 5 2

Property: Parent ≥ Children  
9 ≥ {7,8}, 7 ≥ {3,4}, 8 ≥ {5,2} ✓
```

### Heap vs Other Structures

**Heap vs Binary Search Tree:**
- **Heap**: Parent-child priority, O(1) min/max access, O(log n) insert/delete
- **BST**: Left-right ordering, O(log n) search/insert/delete, sorted traversal

**Heap vs Array (for priority queue):**
- **Heap**: O(log n) insert/extract, O(1) peek, automatic ordering
- **Array**: O(n) insert/extract, O(1) peek, manual sorting required

### Array Representation

**Mathematical Index Relationships:**
- **Root**: Index 0
- **Parent of i**: Math.floor((i-1)/2)
- **Left child of i**: 2*i + 1
- **Right child of i**: 2*i + 2

**Array Layout Example:**
```
Heap:     1
         / \
        3   2
       / \ /
      7 8 4

Array: [1, 3, 2, 7, 8, 4]
Index:  0  1  2  3  4  5
```

## Min-Heap Implementation 📊

**Concept**: Complete implementation of a min-heap where the smallest element is always at the root.

```javascript
// Comprehensive Min-Heap Implementation

class MinHeap {
    constructor() {
        this.heap = [];
        this.size = 0;
    }
    
    // Get parent index
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }
    
    // Get left child index
    getLeftChildIndex(index) {
        return 2 * index + 1;
    }
    
    // Get right child index
    getRightChildIndex(index) {
        return 2 * index + 2;
    }
    
    // Check if index has parent
    hasParent(index) {
        return this.getParentIndex(index) >= 0;
    }
    
    // Check if index has left child
    hasLeftChild(index) {
        return this.getLeftChildIndex(index) < this.size;
    }
    
    // Check if index has right child
    hasRightChild(index) {
        return this.getRightChildIndex(index) < this.size;
    }
    
    // Get parent value
    parent(index) {
        return this.heap[this.getParentIndex(index)];
    }
    
    // Get left child value
    leftChild(index) {
        return this.heap[this.getLeftChildIndex(index)];
    }
    
    // Get right child value
    rightChild(index) {
        return this.heap[this.getRightChildIndex(index)];
    }
    
    // Swap two elements in heap
    swap(index1, index2) {
        console.log(`    Swapping: heap[${index1}]=${this.heap[index1]} ↔ heap[${index2}]=${this.heap[index2]}`);
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
        console.log(`    Result: heap[${index1}]=${this.heap[index1]}, heap[${index2}]=${this.heap[index2]}`);
    }
    
    // Peek at minimum element (root) - O(1)
    peek() {
        console.log(`\n👀 PEEK at minimum element`);
        
        if (this.size === 0) {
            console.log(`❌ Heap is empty - no minimum element`);
            return null;
        }
        
        console.log(`✅ Minimum element: ${this.heap[0]}`);
        console.log(`Time Complexity: O(1) - root always contains minimum`);
        
        return this.heap[0];
    }
    
    // Insert element into heap - O(log n)
    insert(element) {
        console.log(`\n➕ INSERTING ${element} into min-heap`);
        console.log(`Current heap: [${this.heap.join(', ')}]`);
        console.log(`Current size: ${this.size}`);
        
        // Add element to end of heap (maintains complete binary tree property)
        this.heap[this.size] = element;
        this.size++;
        
        console.log(`Added ${element} at index ${this.size - 1}`);
        console.log(`Heap after insertion: [${this.heap.slice(0, this.size).join(', ')}]`);
        
        // Restore heap property by bubbling up
        console.log(`Starting bubble-up process from index ${this.size - 1}:`);
        this.heapifyUp(this.size - 1);
        
        console.log(`✅ Insertion complete. Final heap: [${this.heap.slice(0, this.size).join(', ')}]`);
        console.log(`Time Complexity: O(log n) - bubble up through tree height`);
        
        return this;
    }
    
    // Bubble up element to maintain heap property
    heapifyUp(index) {
        console.log(`  🔼 Heapify Up from index ${index} (value: ${this.heap[index]})`);
        
        while (this.hasParent(index) && this.parent(index) > this.heap[index]) {
            const parentIndex = this.getParentIndex(index);
            console.log(`    Parent: heap[${parentIndex}]=${this.parent(index)} > child: heap[${index}]=${this.heap[index]}`);
            console.log(`    Heap property violated - swapping with parent`);
            
            this.swap(parentIndex, index);
            index = parentIndex;
            
            console.log(`    New position: index ${index}`);
            console.log(`    Current heap: [${this.heap.slice(0, this.size).join(', ')}]`);
        }
        
        if (this.hasParent(index)) {
            console.log(`    Heap property satisfied: parent=${this.parent(index)} ≤ child=${this.heap[index]}`);
        } else {
            console.log(`    Reached root - heap property maintained`);
        }
    }
    
    // Extract minimum element (root) - O(log n)
    extractMin() {
        console.log(`\n📤 EXTRACTING minimum element`);
        console.log(`Current heap: [${this.heap.slice(0, this.size).join(', ')}]`);
        
        if (this.size === 0) {
            console.log(`❌ Cannot extract from empty heap`);
            return null;
        }
        
        const min = this.heap[0];
        console.log(`Minimum element to extract: ${min}`);
        
        // Move last element to root
        this.heap[0] = this.heap[this.size - 1];
        this.size--;
        
        console.log(`Moved last element ${this.heap[0]} to root`);
        console.log(`Heap after moving: [${this.heap.slice(0, this.size).join(', ')}]`);
        
        if (this.size > 0) {
            // Restore heap property by bubbling down
            console.log(`Starting bubble-down process from root:`);
            this.heapifyDown(0);
        }
        
        console.log(`✅ Extraction complete. Extracted: ${min}`);
        console.log(`Final heap: [${this.heap.slice(0, this.size).join(', ')}]`);
        console.log(`Time Complexity: O(log n) - bubble down through tree height`);
        
        return min;
    }
    
    // Bubble down element to maintain heap property
    heapifyDown(index) {
        console.log(`  🔽 Heapify Down from index ${index} (value: ${this.heap[index]})`);
        
        while (this.hasLeftChild(index)) {
            // Find smaller child
            let smallerChildIndex = this.getLeftChildIndex(index);
            
            if (this.hasRightChild(index) && this.rightChild(index) < this.leftChild(index)) {
                smallerChildIndex = this.getRightChildIndex(index);
            }
            
            console.log(`    Comparing with children:`);
            console.log(`    Left child: heap[${this.getLeftChildIndex(index)}]=${this.leftChild(index)}`);
            if (this.hasRightChild(index)) {
                console.log(`    Right child: heap[${this.getRightChildIndex(index)}]=${this.rightChild(index)}`);
            }
            console.log(`    Smaller child: heap[${smallerChildIndex}]=${this.heap[smallerChildIndex]}`);
            
            if (this.heap[index] <= this.heap[smallerChildIndex]) {
                console.log(`    Heap property satisfied: parent=${this.heap[index]} ≤ child=${this.heap[smallerChildIndex]}`);
                break;
            }
            
            console.log(`    Heap property violated: parent=${this.heap[index]} > child=${this.heap[smallerChildIndex]}`);
            this.swap(index, smallerChildIndex);
            index = smallerChildIndex;
            
            console.log(`    New position: index ${index}`);
            console.log(`    Current heap: [${this.heap.slice(0, this.size).join(', ')}]`);
        }
        
        console.log(`    Heapify down complete at index ${index}`);
    }
    
    // Build heap from array - O(n)
    buildHeap(array) {
        console.log(`\n🏗️ BUILDING HEAP from array: [${array.join(', ')}]`);
        
        this.heap = [...array];
        this.size = array.length;
        
        console.log(`Initial array copy: [${this.heap.join(', ')}]`);
        console.log(`Starting heapify process from last non-leaf node:`);
        
        // Start from last non-leaf node and heapify down
        const lastNonLeafIndex = Math.floor((this.size - 1) / 2);
        console.log(`Last non-leaf node at index: ${lastNonLeafIndex}`);
        
        for (let i = lastNonLeafIndex; i >= 0; i--) {
            console.log(`\nHeapifying subtree rooted at index ${i} (value: ${this.heap[i]})`);
            this.heapifyDown(i);
        }
        
        console.log(`\n✅ Heap construction complete: [${this.heap.slice(0, this.size).join(', ')}]`);
        console.log(`Time Complexity: O(n) - more efficient than n insertions`);
        console.log(`💡 Bottom-up heapify is more efficient than top-down insertions`);
        
        return this;
    }
    
    // Get heap size
    getSize() {
        return this.size;
    }
    
    // Check if heap is empty
    isEmpty() {
        return this.size === 0;
    }
    
    // Convert heap to array (for display)
    toArray() {
        return this.heap.slice(0, this.size);
    }
    
    // Visualize heap structure
    visualizeHeap() {
        console.log(`\n🌳 HEAP STRUCTURE VISUALIZATION`);
        console.log(`Array representation: [${this.toArray().join(', ')}]`);
        console.log(`Size: ${this.size} elements`);
        
        if (this.size === 0) {
            console.log(`Empty heap`);
            return;
        }
        
        console.log(`\nTree structure:`);
        this.printTree(0, '', true);
        
        console.log(`\n📊 Index relationships:`);
        for (let i = 0; i < Math.min(this.size, 7); i++) {
            const parentIdx = this.getParentIndex(i);
            const leftIdx = this.getLeftChildIndex(i);
            const rightIdx = this.getRightChildIndex(i);
            
            console.log(`Index ${i} (${this.heap[i]}):`);
            if (this.hasParent(i)) {
                console.log(`  Parent: index ${parentIdx} (${this.parent(i)})`);
            }
            if (this.hasLeftChild(i)) {
                console.log(`  Left child: index ${leftIdx} (${this.leftChild(i)})`);
            }
            if (this.hasRightChild(i)) {
                console.log(`  Right child: index ${rightIdx} (${this.rightChild(i)})`);
            }
        }
    }
    
    // Helper function to print tree structure
    printTree(index, prefix, isLast) {
        if (index >= this.size) return;
        
        console.log(prefix + (isLast ? '└── ' : '├── ') + this.heap[index]);
        
        const leftIdx = this.getLeftChildIndex(index);
        const rightIdx = this.getRightChildIndex(index);
        
        const children = [];
        if (leftIdx < this.size) children.push(leftIdx);
        if (rightIdx < this.size) children.push(rightIdx);
        
        children.forEach((childIdx, idx) => {
            const isLastChild = idx === children.length - 1;
            const childPrefix = prefix + (isLast ? '    ' : '│   ');
            this.printTree(childIdx, childPrefix, isLastChild);
        });
    }
    
    // Validate heap property
    validateHeap() {
        console.log(`\n✅ VALIDATING HEAP PROPERTY`);
        
        const isValid = this.validateHeapRecursive(0);
        
        console.log(`Heap validation result: ${isValid ? 'VALID ✅' : 'INVALID ❌'}`);
        console.log(`💡 Min-heap property: Every parent ≤ its children`);
        
        return isValid;
    }
    
    validateHeapRecursive(index) {
        if (index >= this.size) return true;
        
        // Check left child
        if (this.hasLeftChild(index)) {
            if (this.heap[index] > this.leftChild(index)) {
                console.log(`❌ Heap property violated: parent ${this.heap[index]} > left child ${this.leftChild(index)}`);
                return false;
            }
            
            if (!this.validateHeapRecursive(this.getLeftChildIndex(index))) {
                return false;
            }
        }
        
        // Check right child
        if (this.hasRightChild(index)) {
            if (this.heap[index] > this.rightChild(index)) {
                console.log(`❌ Heap property violated: parent ${this.heap[index]} > right child ${this.rightChild(index)}`);
                return false;
            }
            
            if (!this.validateHeapRecursive(this.getRightChildIndex(index))) {
                return false;
            }
        }
        
        return true;
    }
    
    // Demonstrate min-heap operations
    demonstrateMinHeap() {
        console.log('=== MIN-HEAP OPERATIONS DEMONSTRATION ===\n');
        
        console.log('1. BUILDING HEAP FROM ARRAY:');
        const inputArray = [4, 10, 3, 5, 1, 6, 8, 2];
        this.buildHeap(inputArray);
        this.visualizeHeap();
        
        console.log('\n2. HEAP VALIDATION:');
        this.validateHeap();
        
        console.log('\n3. PEEK OPERATION:');
        this.peek();
        
        console.log('\n4. INSERTION OPERATIONS:');
        this.insert(0);
        this.insert(7);
        this.visualizeHeap();
        
        console.log('\n5. EXTRACTION OPERATIONS:');
        while (this.size > 5) {
            const min = this.extractMin();
            console.log(`Extracted minimum: ${min}`);
        }
        this.visualizeHeap();
        
        console.log('\n6. FINAL STATE:');
        console.log(`Final heap: [${this.toArray().join(', ')}]`);
        console.log(`Size: ${this.getSize()}`);
        console.log(`Is empty: ${this.isEmpty()}`);
        
        console.log(`\n🎯 MIN-HEAP SUMMARY:`);
        console.log(`- Smallest element always at root (index 0)`);
        console.log(`- Complete binary tree structure`);
        console.log(`- Parent ≤ children property maintained`);
        console.log(`- Efficient array representation`);
        console.log(`- O(log n) insert and extract operations`);
        console.log(`- O(1) peek operation`);
        console.log(`- Perfect for priority queues and heap sort`);
        
        return {
            size: this.getSize(),
            heap: this.toArray(),
            isValid: this.validateHeap()
        };
    }
}

// Test min-heap operations
const minHeap = new MinHeap();
minHeap.demonstrateMinHeap();
```

### Priority Queue Implementation

**Concept**: Using heaps to implement efficient priority queues with priority-based element processing.

```javascript
// Priority Queue Implementation using Min-Heap

class PriorityQueueItem {
    constructor(element, priority) {
        this.element = element;
        this.priority = priority;
    }
    
    toString() {
        return `${this.element}(${this.priority})`;
    }
}

class PriorityQueue {
    constructor() {
        this.heap = [];
        this.size = 0;
    }
    
    // Priority queue helper methods
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }
    
    getLeftChildIndex(index) {
        return 2 * index + 1;
    }
    
    getRightChildIndex(index) {
        return 2 * index + 2;
    }
    
    hasParent(index) {
        return this.getParentIndex(index) >= 0;
    }
    
    hasLeftChild(index) {
        return this.getLeftChildIndex(index) < this.size;
    }
    
    hasRightChild(index) {
        return this.getRightChildIndex(index) < this.size;
    }
    
    parent(index) {
        return this.heap[this.getParentIndex(index)];
    }
    
    leftChild(index) {
        return this.heap[this.getLeftChildIndex(index)];
    }
    
    rightChild(index) {
        return this.heap[this.getRightChildIndex(index)];
    }
    
    swap(index1, index2) {
        console.log(`    Swapping: ${this.heap[index1].toString()} ↔ ${this.heap[index2].toString()}`);
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }
    
    // Enqueue with priority - O(log n)
    enqueue(element, priority) {
        console.log(`\n📥 ENQUEUE: ${element} with priority ${priority}`);
        console.log(`Current queue: [${this.heap.map(item => item.toString()).join(', ')}]`);
        
        const item = new PriorityQueueItem(element, priority);
        
        // Add to end and heapify up
        this.heap[this.size] = item;
        this.size++;
        
        console.log(`Added ${item.toString()} at index ${this.size - 1}`);
        console.log(`Starting heapify up:`);
        this.heapifyUp(this.size - 1);
        
        console.log(`✅ Enqueue complete. Queue: [${this.heap.slice(0, this.size).map(item => item.toString()).join(', ')}]`);
        console.log(`Time Complexity: O(log n)`);
        
        return this;
    }
    
    // Dequeue highest priority element - O(log n)
    dequeue() {
        console.log(`\n📤 DEQUEUE: Removing highest priority element`);
        console.log(`Current queue: [${this.heap.slice(0, this.size).map(item => item.toString()).join(', ')}]`);
        
        if (this.size === 0) {
            console.log(`❌ Cannot dequeue from empty priority queue`);
            return null;
        }
        
        const highestPriority = this.heap[0];
        console.log(`Highest priority element: ${highestPriority.toString()}`);
        
        // Move last element to root and heapify down
        this.heap[0] = this.heap[this.size - 1];
        this.size--;
        
        if (this.size > 0) {
            console.log(`Moved ${this.heap[0].toString()} to root`);
            console.log(`Starting heapify down:`);
            this.heapifyDown(0);
        }
        
        console.log(`✅ Dequeue complete. Removed: ${highestPriority.toString()}`);
        console.log(`Remaining queue: [${this.heap.slice(0, this.size).map(item => item.toString()).join(', ')}]`);
        console.log(`Time Complexity: O(log n)`);
        
        return highestPriority.element;
    }
    
    // Peek at highest priority element - O(1)
    peek() {
        console.log(`\n👀 PEEK: Viewing highest priority element`);
        
        if (this.size === 0) {
            console.log(`❌ Priority queue is empty`);
            return null;
        }
        
        const highestPriority = this.heap[0];
        console.log(`Highest priority: ${highestPriority.toString()}`);
        console.log(`Time Complexity: O(1)`);
        
        return highestPriority.element;
    }
    
    heapifyUp(index) {
        console.log(`  🔼 Heapify up from index ${index}: ${this.heap[index].toString()}`);
        
        while (this.hasParent(index) && this.parent(index).priority > this.heap[index].priority) {
            const parentIndex = this.getParentIndex(index);
            console.log(`    Parent priority ${this.parent(index).priority} > current priority ${this.heap[index].priority}`);
            
            this.swap(parentIndex, index);
            index = parentIndex;
        }
        
        console.log(`    Heapify up complete at index ${index}`);
    }
    
    heapifyDown(index) {
        console.log(`  🔽 Heapify down from index ${index}: ${this.heap[index].toString()}`);
        
        while (this.hasLeftChild(index)) {
            let higherPriorityChildIndex = this.getLeftChildIndex(index);
            
            // Find child with higher priority (lower priority number)
            if (this.hasRightChild(index) && 
                this.rightChild(index).priority < this.leftChild(index).priority) {
                higherPriorityChildIndex = this.getRightChildIndex(index);
            }
            
            if (this.heap[index].priority <= this.heap[higherPriorityChildIndex].priority) {
                console.log(`    Heap property satisfied`);
                break;
            }
            
            console.log(`    Swapping with higher priority child`);
            this.swap(index, higherPriorityChildIndex);
            index = higherPriorityChildIndex;
        }
        
        console.log(`    Heapify down complete at index ${index}`);
    }
    
    // Check if queue is empty
    isEmpty() {
        return this.size === 0;
    }
    
    // Get queue size
    getSize() {
        return this.size;
    }
    
    // Display queue contents
    display() {
        console.log(`\n📋 PRIORITY QUEUE STATE`);
        console.log(`Size: ${this.size} elements`);
        
        if (this.size === 0) {
            console.log(`Queue is empty`);
            return;
        }
        
        console.log(`Elements (element(priority)):`);
        for (let i = 0; i < this.size; i++) {
            const item = this.heap[i];
            console.log(`  Index ${i}: ${item.toString()}`);
        }
        
        console.log(`Array representation: [${this.heap.slice(0, this.size).map(item => item.toString()).join(', ')}]`);
    }
    
    // Simulate hospital emergency room
    simulateEmergencyRoom() {
        console.log('\n=== EMERGENCY ROOM SIMULATION ===');
        console.log('Priority levels: 1=Critical, 2=Urgent, 3=Standard, 4=Non-urgent\n');
        
        // Patients arrive in random order
        const patients = [
            { name: 'Alice', condition: 'Minor cut', priority: 3 },
            { name: 'Bob', condition: 'Heart attack', priority: 1 },
            { name: 'Carol', condition: 'Broken arm', priority: 2 },
            { name: 'David', condition: 'Routine checkup', priority: 4 },
            { name: 'Eve', condition: 'Severe trauma', priority: 1 },
            { name: 'Frank', condition: 'Prescription refill', priority: 4 },
            { name: 'Grace', condition: 'High fever', priority: 2 }
        ];
        
        console.log('PATIENTS ARRIVING:');
        patients.forEach((patient, index) => {
            console.log(`${index + 1}. ${patient.name} - ${patient.condition} (Priority: ${patient.priority})`);
            this.enqueue(`${patient.name} (${patient.condition})`, patient.priority);
        });
        
        console.log('\nTREATMENT ORDER (by priority):');
        let treatmentOrder = 1;
        
        while (!this.isEmpty()) {
            const nextPatient = this.dequeue();
            console.log(`${treatmentOrder}. Treating: ${nextPatient}`);
            treatmentOrder++;
        }
        
        console.log('\n💡 Notice how critical patients (priority 1) were treated first,');
        console.log('regardless of arrival order, followed by urgent (2), then standard (3), etc.');
    }
    
    // Simulate task scheduling
    simulateTaskScheduling() {
        console.log('\n=== TASK SCHEDULING SIMULATION ===');
        console.log('Priority levels: 1=Critical, 2=High, 3=Medium, 4=Low, 5=Background\n');
        
        const tasks = [
            { name: 'Backup database', priority: 5 },
            { name: 'Fix security vulnerability', priority: 1 },
            { name: 'Update documentation', priority: 4 },
            { name: 'Deploy hotfix', priority: 1 },
            { name: 'Code review', priority: 3 },
            { name: 'Performance optimization', priority: 2 },
            { name: 'UI polish', priority: 4 },
            { name: 'Bug fix', priority: 2 }
        ];
        
        console.log('TASKS SUBMITTED:');
        tasks.forEach((task, index) => {
            console.log(`${index + 1}. ${task.name} (Priority: ${task.priority})`);
            this.enqueue(task.name, task.priority);
        });
        
        console.log('\nTASK EXECUTION ORDER:');
        let executionOrder = 1;
        
        while (!this.isEmpty()) {
            const nextTask = this.dequeue();
            console.log(`${executionOrder}. Executing: ${nextTask}`);
            executionOrder++;
        }
        
        console.log('\n💡 Critical tasks executed first, ensuring system stability');
        console.log('and security before less important tasks.');
    }
    
    // Demonstrate priority queue operations
    demonstratePriorityQueue() {
        console.log('=== PRIORITY QUEUE DEMONSTRATION ===\n');
        
        console.log('1. BASIC PRIORITY QUEUE OPERATIONS:');
        this.enqueue('Task A', 3);
        this.enqueue('Task B', 1);
        this.enqueue('Task C', 2);
        this.enqueue('Task D', 1);
        this.enqueue('Task E', 4);
        
        this.display();
        
        console.log('\n2. PROCESSING BY PRIORITY:');
        while (!this.isEmpty()) {
            const task = this.dequeue();
            console.log(`Processed: ${task}`);
        }
        
        console.log('\n3. EMERGENCY ROOM SIMULATION:');
        this.simulateEmergencyRoom();
        
        console.log('\n4. TASK SCHEDULING SIMULATION:');
        this.simulateTaskScheduling();
        
        console.log(`\n🎯 PRIORITY QUEUE APPLICATIONS:`);
        console.log(`- Operating system process scheduling`);
        console.log(`- Network packet routing with QoS`);
        console.log(`- Emergency services dispatch`);
        console.log(`- Task scheduling in applications`);
        console.log(`- Dijkstra's shortest path algorithm`);
        console.log(`- A* pathfinding algorithm`);
        console.log(`- Huffman coding for compression`);
        console.log(`- Event-driven simulation systems`);
        
        return true;
    }
}

// Test priority queue
console.log('\n' + '='.repeat(60));
const priorityQueue = new PriorityQueue();
priorityQueue.demonstratePriorityQueue();
```

### Heap Sort Algorithm

**Concept**: Using heap properties to create an efficient in-place sorting algorithm.

```javascript
// Heap Sort Algorithm Implementation

class HeapSort {
    constructor() {
        this.comparisons = 0;
        this.swaps = 0;
    }
    
    // Main heap sort function - O(n log n)
    heapSort(array) {
        console.log(`\n🔄 HEAP SORT ALGORITHM`);
        console.log(`Input array: [${array.join(', ')}]`);
        console.log(`Array length: ${array.length}`);
        
        this.comparisons = 0;
        this.swaps = 0;
        
        const sortedArray = [...array]; // Create copy to avoid modifying original
        const n = sortedArray.length;
        
        // Phase 1: Build max heap
        console.log(`\n📊 PHASE 1: Building max heap`);
        this.buildMaxHeap(sortedArray, n);
        
        console.log(`Max heap built: [${sortedArray.join(', ')}]`);
        this.visualizeArray(sortedArray, n, n);
        
        // Phase 2: Extract elements one by one
        console.log(`\n📊 PHASE 2: Extracting elements in sorted order`);
        
        for (let i = n - 1; i > 0; i--) {
            console.log(`\nStep ${n - i}: Extract maximum`);
            
            // Move current root to end (largest element to correct position)
            console.log(`  Swapping max element ${sortedArray[0]} with position ${i}`);
            this.swap(sortedArray, 0, i);
            this.visualizeArray(sortedArray, i, n);
            
            // Heapify the reduced heap
            console.log(`  Heapifying remaining ${i} elements`);
            this.heapify(sortedArray, i, 0);
            this.visualizeArray(sortedArray, i, n);
        }
        
        console.log(`\n✅ HEAP SORT COMPLETE`);
        console.log(`Sorted array: [${sortedArray.join(', ')}]`);
        console.log(`Total comparisons: ${this.comparisons}`);
        console.log(`Total swaps: ${this.swaps}`);
        console.log(`Time Complexity: O(n log n) - guaranteed`);
        console.log(`Space Complexity: O(1) - in-place sorting`);
        
        return sortedArray;
    }
    
    // Build max heap from array
    buildMaxHeap(array, n) {
        console.log(`Building max heap from unsorted array`);
        
        // Start from last non-leaf node and heapify each subtree
        const lastNonLeaf = Math.floor(n / 2) - 1;
        console.log(`Last non-leaf node at index: ${lastNonLeaf}`);
        
        for (let i = lastNonLeaf; i >= 0; i--) {
            console.log(`  Heapifying subtree rooted at index ${i} (value: ${array[i]})`);
            this.heapify(array, n, i);
        }
    }
    
    // Heapify a subtree rooted at index i (max heap)
    heapify(array, n, i) {
        let largest = i;        // Initialize largest as root
        let left = 2 * i + 1;   // Left child
        let right = 2 * i + 2;  // Right child
        
        console.log(`    Heapifying node ${i} (${array[i]}) with heap size ${n}`);
        
        // Check if left child exists and is greater than root
        if (left < n) {
            this.comparisons++;
            console.log(`      Left child: ${array[left]}`);
            if (array[left] > array[largest]) {
                largest = left;
                console.log(`      Left child ${array[left]} > current largest ${array[i]}`);
            }
        }
        
        // Check if right child exists and is greater than current largest
        if (right < n) {
            this.comparisons++;
            console.log(`      Right child: ${array[right]}`);
            if (array[right] > array[largest]) {
                largest = right;
                console.log(`      Right child ${array[right]} > current largest ${array[largest === left ? left : i]}`);
            }
        }
        
        // If largest is not root, swap and continue heapifying
        if (largest !== i) {
            console.log(`      Swapping ${array[i]} with ${array[largest]}`);
            this.swap(array, i, largest);
            
            // Recursively heapify the affected subtree
            this.heapify(array, n, largest);
        } else {
            console.log(`      Heap property satisfied at node ${i}`);
        }
    }
    
    // Swap two elements in array
    swap(array, i, j) {
        this.swaps++;
        [array[i], array[j]] = [array[j], array[i]];
    }
    
    // Visualize array state during sorting
    visualizeArray(array, heapSize, totalSize) {
        let visualization = `[`;
        
        for (let i = 0; i < totalSize; i++) {
            if (i < heapSize) {
                visualization += `${array[i]}`;  // Heap part
            } else {
                visualization += `(${array[i]})`; // Sorted part
            }
            
            if (i < totalSize - 1) visualization += ', ';
        }
        
        visualization += `]`;
        console.log(`    Heap: ${visualization} (parentheses = sorted)`);
    }
    
    // Performance comparison with other sorting algorithms
    compareWithOtherSorts() {
        console.log(`\n📊 SORTING ALGORITHM COMPARISON`);
        
        const testSizes = [10, 100, 1000];
        
        testSizes.forEach(size => {
            console.log(`\n--- Testing with ${size} elements ---`);
            
            // Generate random array
            const array = Array.from({length: size}, () => Math.floor(Math.random() * 100));
            
            // Test Heap Sort
            console.log(`\nHeap Sort:`);
            const heapSortStart = performance.now();
            this.heapSort([...array]);
            const heapSortTime = performance.now() - heapSortStart;
            console.log(`Time: ${heapSortTime.toFixed(4)}ms`);
            console.log(`Comparisons: ${this.comparisons}, Swaps: ${this.swaps}`);
            
            // Test built-in sort for comparison
            console.log(`\nJavaScript built-in sort:`);
            const builtInStart = performance.now();
            [...array].sort((a, b) => a - b);
            const builtInTime = performance.now() - builtInStart;
            console.log(`Time: ${builtInTime.toFixed(4)}ms`);
            
            console.log(`\nComparison: Heap sort ${(heapSortTime / builtInTime).toFixed(2)}x relative to built-in`);
        });
        
        console.log(`\n🎯 HEAP SORT CHARACTERISTICS:`);
        console.log(`✅ Advantages:`);
        console.log(`  - Guaranteed O(n log n) time complexity (worst case)`);
        console.log(`  - In-place sorting (O(1) space complexity)`);
        console.log(`  - Not affected by input distribution`);
        console.log(`  - Simple implementation`);
        
        console.log(`❌ Disadvantages:`);
        console.log(`  - Not stable (equal elements may change relative order)`);
        console.log(`  - Poor cache locality due to heap structure`);
        console.log(`  - Generally slower than quicksort in practice`);
        console.log(`  - Not adaptive (doesn't perform better on partially sorted data)`);
        
        console.log(`\n🏆 BEST USE CASES:`);
        console.log(`- When guaranteed O(n log n) performance is required`);
        console.log(`- Memory-constrained environments (in-place sorting)`);
        console.log(`- Real-time systems requiring predictable performance`);
        console.log(`- When simplicity and reliability are priorities`);
    }
    
    // Demonstrate heap sort
    demonstrateHeapSort() {
        console.log('=== HEAP SORT DEMONSTRATION ===');
        
        console.log('\n1. SORTING SMALL ARRAY:');
        const smallArray = [64, 34, 25, 12, 22, 11, 90];
        this.heapSort(smallArray);
        
        console.log('\n2. SORTING REVERSE-SORTED ARRAY:');
        const reverseArray = [9, 8, 7, 6, 5, 4, 3, 2, 1];
        this.heapSort(reverseArray);
        
        console.log('\n3. PERFORMANCE COMPARISON:');
        this.compareWithOtherSorts();
        
        return true;
    }
}

// Test heap sort
console.log('\n' + '='.repeat(60));
const heapSort = new HeapSort();
heapSort.demonstrateHeapSort();
```

## Summary

### Core Heap Concepts Mastered
- **Complete Binary Tree**: All levels filled left-to-right for efficient array representation
- **Heap Property**: Parent-child ordering relationship (min-heap: parent ≤ children)
- **Array Implementation**: Mathematical indexing for parent-child relationships
- **Efficient Operations**: O(log n) insert/extract, O(1) peek, O(n) build heap

### Heap Operations Complexity
- **Insert (Heapify Up)**: O(log n) - bubble up through tree height
- **Extract Min/Max**: O(log n) - bubble down through tree height
- **Peek**: O(1) - root always contains min/max element
- **Build Heap**: O(n) - bottom-up heapification more efficient than n insertions
- **Heap Sort**: O(n log n) - guaranteed performance regardless of input

### Why Heaps Are Essential
- **Priority Processing**: Efficient priority-based element management
- **Guaranteed Performance**: Logarithmic operations regardless of data distribution
- **Space Efficiency**: Array representation with no pointer overhead
- **Versatile Foundation**: Supports priority queues, sorting, and graph algorithms

### Real-World Heap Applications
- **Operating Systems**: Process scheduling with priority-based CPU allocation
- **Network Routing**: Quality of Service (QoS) packet prioritization
- **Emergency Services**: Hospital triage and emergency dispatch systems
- **Graph Algorithms**: Dijkstra's shortest path and A* pathfinding
- **Data Compression**: Huffman coding trees for optimal compression
- **Event Simulation**: Processing events in chronological priority order

### Heap vs Other Priority Structures

**Heap vs Sorted Array:**
- **Heap**: O(log n) insert/extract, O(1) peek, dynamic size
- **Sorted Array**: O(n) insert, O(1) extract/peek, fixed size operations

**Heap vs Binary Search Tree:**
- **Heap**: O(log n) min/max operations, O(1) peek, array storage
- **BST**: O(log n) search/insert/delete, ordered traversal, pointer storage

**Heap vs Unsorted Array:**
- **Heap**: O(log n) operations, automatic ordering
- **Unsorted Array**: O(1) insert, O(n) extract min/max

### Heap Variants
- **Min-Heap**: Smallest element at root, priority queue for minimum
- **Max-Heap**: Largest element at root, heap sort and maximum priority
- **Binary Heap**: Standard implementation with 2 children per node
- **d-ary Heap**: Multiple children per node for specific performance trade-offs

### Heap Sort Advantages
- **Guaranteed Performance**: O(n log n) worst-case time complexity
- **In-Place Sorting**: O(1) space complexity
- **Predictable**: Performance unaffected by input distribution
- **Simple**: Straightforward implementation and understanding

### Performance Optimization Tips
- **Build vs Insert**: Use buildHeap() for initial construction (O(n) vs O(n log n))
- **Array Representation**: More cache-friendly than pointer-based trees
- **Index Calculations**: Mathematical parent-child relationships avoid pointer dereferencing
- **Batch Operations**: Group multiple insertions when possible

### Advanced Heap Concepts
- **Fibonacci Heap**: Advanced heap with O(1) decrease-key operation
- **Binomial Heap**: Mergeable heaps for union operations
- **Leftist Heap**: Self-adjusting heaps for merge-heavy workloads
- **Skew Heap**: Simple mergeable heap without explicit structure

Heaps represent the **perfect balance of simplicity and efficiency** in priority-based data processing. They transform expensive priority operations into logarithmic-time guarantees while maintaining the intuitive complete binary tree structure. This makes them **indispensable for any system requiring efficient priority management** - from operating system schedulers to pathfinding algorithms! 🚀✨

Next up: **Tries & Advanced Tree Structures** - Learn specialized trees for string processing, prefix matching, and advanced hierarchical data organization!
