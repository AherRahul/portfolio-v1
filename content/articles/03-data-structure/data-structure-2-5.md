---
title: "Queues & Queue Variants"
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

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758827456/Portfolio/dsa/images/09/queues.png)

Queues & Queue Variants – The First-In-First-Out Principle in Fair Processing
=============================================================================

Imagine you're the **operations manager of a busy theme park** 🎢 during peak summer season, where fairness and efficiency are crucial for customer satisfaction:

**🎟️ The Theme Park Queue Systems:**

**🎠 Standard Ride Queue:**
- **Fairness Principle**: First person in line gets the **first ride** - no cutting allowed!
- **Entry Point**: New visitors join at the **back** of the line (rear/tail)
- **Exit Point**: Riders board from the **front** of the line (front/head)
- **FIFO Logic**: First-In, First-Out ensures everyone gets their turn fairly
- **Visual**: `[Front] → Person1 → Person2 → Person3 → [Back]`

**🏥 Emergency Medical Queue:**
- **Priority System**: Critical patients get treated **immediately**, regardless of arrival time
- **Multiple Priorities**: Life-threatening → Urgent → Standard → Minor
- **Dynamic Reordering**: New critical case jumps ahead of everyone else
- **Fair Within Priority**: First critical patient gets treated before second critical patient

**🍿 Food Court Ordering:**
- **Multiple Windows**: Several cashiers serve from the **same waiting line**
- **Load Balancing**: Next customer goes to the **first available cashier**
- **Efficiency**: Parallel processing reduces overall waiting time
- **Buffer System**: Orders queue up for kitchen preparation

**🚌 Shuttle Bus System:**
- **Circular Route**: Bus returns to starting point and repeats the circuit
- **Continuous Operation**: No real "end" - passengers continuously board and exit
- **Capacity Management**: Limited seats, overflow waits for next bus
- **Route Optimization**: Efficient circular path minimizes travel time

**🎯 The Queue Operations:**
1. **Enqueue**: Add new element to the back of the queue
2. **Dequeue**: Remove element from the front of the queue
3. **Front/Peek**: Look at the next element to be processed
4. **IsEmpty**: Check if queue has any elements
5. **Size**: Count total elements waiting

**This is exactly how queues work in computer science!** They ensure fair, ordered processing:

**💻 Real-World Queue Applications:**
- **Operating Systems**: Process scheduling, job queues, I/O request handling
- **Web Servers**: Request queues, connection pooling, rate limiting
- **Networking**: Packet buffering, bandwidth management, data transmission
- **Gaming**: Player matchmaking, turn-based game logic, animation sequences
- **Database Systems**: Transaction queues, query processing, connection management
- **Print Spooling**: Document printing order, resource allocation

Queues are the **fairness engines** of computer systems - ensuring that whoever arrives first gets served first, making systems predictable and equitable!

## The Theoretical Foundation: What Are Queues? 🎯

### Understanding FIFO (First-In, First-Out) Principle

**A queue is a linear data structure that follows the First-In, First-Out (FIFO) principle, where elements are added at one end (rear) and removed from the other end (front).** Think of it as a **horizontal pipe** where items enter on one side and exit on the other.

**Core Queue Concepts:**

1. **FIFO Ordering**: First element added is the first one removed
2. **Two Access Points**: Front (for removal) and rear (for insertion)
3. **Fair Processing**: Maintains arrival order for equitable service
4. **Buffering**: Temporary storage between producers and consumers
5. **Flow Control**: Manages rate differences between input and output

**Queue Visualization:**
```
Front → [Item 1] [Item 2] [Item 3] [Item 4] ← Rear
        ↑                                    ↑
    Remove here                         Add here
    (dequeue)                          (enqueue)
```

### Queue Operations

**Essential Queue Operations:**

1. **Enqueue**: Add element to rear of queue
2. **Dequeue**: Remove and return front element
3. **Front/Peek**: View front element without removing it
4. **Rear**: View rear element (in some implementations)
5. **isEmpty**: Check if queue is empty
6. **Size**: Get number of elements in queue

### Queue Implementations

**Array-based Queue:**
- Use array with front and rear indices
- Efficient but may waste space
- Can use circular array to optimize space

**Linked List-based Queue:**
- Use linked list with front and rear pointers
- Dynamic size with optimal memory usage
- Slight memory overhead for pointers

## Basic Queue Implementation 📋

**Concept**: Implementing a standard queue with all fundamental operations and detailed analysis.

```javascript
// Comprehensive Queue Implementation using Array

class ArrayQueue {
    constructor(capacity = 10) {
        this.items = new Array(capacity);
        this.front = -1;    // Index of front element
        this.rear = -1;     // Index of rear element
        this.capacity = capacity;
        this.count = 0;     // Number of elements
        this.operationCount = 0;
    }
    
    // Enqueue operation: Add element to rear - O(1)
    enqueue(element) {
        console.log(`\n📥 ENQUEUING ${element} to queue`);
        console.log(`Current state: front=${this.front}, rear=${this.rear}, count=${this.count}`);
        this.operationCount++;
        
        // Check for queue overflow
        if (this.isFull()) {
            console.log(`❌ Queue Overflow! Cannot enqueue ${element}`);
            console.log(`Queue is at maximum capacity: ${this.capacity}`);
            throw new Error('Queue Overflow');
        }
        
        // Initialize front on first element
        if (this.isEmpty()) {
            this.front = 0;
            this.rear = 0;
        } else {
            this.rear = (this.rear + 1) % this.capacity; // Circular increment
        }
        
        this.items[this.rear] = element;
        this.count++;
        
        console.log(`✅ Enqueued ${element} at index ${this.rear}`);
        console.log(`New state: front=${this.front}, rear=${this.rear}, count=${this.count}`);
        console.log(`Queue contents: ${this.toString()}`);
        console.log(`Time Complexity: O(1) - constant time operation`);
        
        return this;
    }
    
    // Dequeue operation: Remove element from front - O(1)
    dequeue() {
        console.log(`\n📤 DEQUEUING from queue`);
        console.log(`Current state: front=${this.front}, rear=${this.rear}, count=${this.count}`);
        this.operationCount++;
        
        // Check for queue underflow
        if (this.isEmpty()) {
            console.log(`❌ Queue Underflow! Cannot dequeue from empty queue`);
            return undefined;
        }
        
        // Get front element
        const dequeuedElement = this.items[this.front];
        this.items[this.front] = undefined; // Clear reference
        
        // Update front pointer
        if (this.count === 1) {
            // Queue becomes empty
            this.front = -1;
            this.rear = -1;
        } else {
            this.front = (this.front + 1) % this.capacity; // Circular increment
        }
        
        this.count--;
        
        console.log(`✅ Dequeued ${dequeuedElement} from index ${this.front === -1 ? 'N/A' : (this.front - 1 + this.capacity) % this.capacity}`);
        console.log(`New state: front=${this.front}, rear=${this.rear}, count=${this.count}`);
        console.log(`Queue contents: ${this.toString()}`);
        console.log(`Time Complexity: O(1) - constant time operation`);
        
        return dequeuedElement;
    }
    
    // Peek operation: View front element without removing - O(1)
    peek() {
        console.log(`\n👀 PEEKING at front of queue`);
        this.operationCount++;
        
        if (this.isEmpty()) {
            console.log(`❌ Cannot peek at empty queue`);
            return undefined;
        }
        
        const frontElement = this.items[this.front];
        console.log(`✅ Front element: ${frontElement} at index ${this.front}`);
        console.log(`Queue not modified - peek is non-destructive operation`);
        console.log(`Time Complexity: O(1) - constant time operation`);
        
        return frontElement;
    }
    
    // Get rear element (additional operation)
    getRear() {
        console.log(`\n👀 CHECKING rear of queue`);
        
        if (this.isEmpty()) {
            console.log(`❌ Cannot get rear of empty queue`);
            return undefined;
        }
        
        const rearElement = this.items[this.rear];
        console.log(`✅ Rear element: ${rearElement} at index ${this.rear}`);
        
        return rearElement;
    }
    
    // Check if queue is empty
    isEmpty() {
        const empty = this.count === 0;
        console.log(`📊 isEmpty() = ${empty} (count = ${this.count})`);
        return empty;
    }
    
    // Check if queue is full
    isFull() {
        const full = this.count === this.capacity;
        console.log(`📊 isFull() = ${full} (count = ${this.count}, capacity = ${this.capacity})`);
        return full;
    }
    
    // Get queue size
    size() {
        return this.count;
    }
    
    // Clear all elements
    clear() {
        console.log(`\n🧹 CLEARING queue`);
        
        const oldSize = this.size();
        this.front = -1;
        this.rear = -1;
        this.count = 0;
        this.items.fill(undefined);
        
        console.log(`✅ Cleared ${oldSize} elements`);
        console.log(`New state: front=${this.front}, rear=${this.rear}, count=${this.count}`);
    }
    
    // Convert queue to string representation
    toString() {
        if (this.isEmpty()) {
            return "[]";
        }
        
        const elements = [];
        let index = this.front;
        
        for (let i = 0; i < this.count; i++) {
            elements.push(this.items[index]);
            index = (index + 1) % this.capacity;
        }
        
        return `Front → [${elements.join(', ')}] ← Rear`;
    }
    
    // Display detailed queue state
    display() {
        console.log(`\n📋 QUEUE STATE DISPLAY`);
        console.log(`Capacity: ${this.capacity}`);
        console.log(`Size: ${this.size()}`);
        console.log(`Front index: ${this.front}`);
        console.log(`Rear index: ${this.rear}`);
        console.log(`Operations performed: ${this.operationCount}`);
        
        if (this.isEmpty()) {
            console.log(`Queue is empty`);
        } else {
            console.log(`Queue contents (front to rear):`);
            let index = this.front;
            
            for (let i = 0; i < this.count; i++) {
                const marker = i === 0 ? ' ← FRONT' : (i === this.count - 1 ? ' ← REAR' : '');
                console.log(`  Index ${index}: ${this.items[index]}${marker}`);
                index = (index + 1) % this.capacity;
            }
        }
        
        console.log(`Visual representation: ${this.toString()}`);
        console.log(`💡 Using circular array for space efficiency`);
    }
    
    // Demonstrate circular array behavior
    demonstrateCircularBehavior() {
        console.log(`\n🔄 DEMONSTRATING CIRCULAR ARRAY BEHAVIOR`);
        
        console.log(`Array indices: [${Array.from({length: this.capacity}, (_, i) => i).join(', ')}]`);
        console.log(`Current array: [${this.items.map(item => item || 'empty').join(', ')}]`);
        console.log(`Front at index: ${this.front}, Rear at index: ${this.rear}`);
        
        if (!this.isEmpty()) {
            console.log(`\nCircular traversal from front:`);
            let index = this.front;
            for (let i = 0; i < this.count; i++) {
                console.log(`  Step ${i}: index ${index} → ${this.items[index]}`);
                index = (index + 1) % this.capacity;
            }
        }
        
        console.log(`\n💡 Circular Array Benefits:`);
        console.log(`- Reuses array space efficiently`);
        console.log(`- Avoids shifting elements on dequeue`);
        console.log(`- Maintains O(1) enqueue and dequeue operations`);
        console.log(`- Prevents memory waste from unused front space`);
    }
    
    // Demonstrate basic queue operations
    demonstrateBasicOperations() {
        console.log('=== ARRAY-BASED QUEUE DEMONSTRATION ===\n');
        
        console.log('1. INITIAL STATE:');
        this.display();
        
        console.log('\n2. ENQUEUE OPERATIONS:');
        this.enqueue('A');
        this.enqueue('B');
        this.enqueue('C');
        this.enqueue('D');
        
        console.log('\n3. CIRCULAR ARRAY BEHAVIOR:');
        this.demonstrateCircularBehavior();
        
        console.log('\n4. PEEK OPERATIONS:');
        const frontElement = this.peek();
        const rearElement = this.getRear();
        
        console.log('\n5. DEQUEUE OPERATIONS:');
        const dequeued1 = this.dequeue();
        const dequeued2 = this.dequeue();
        
        console.log('\n6. MIXED OPERATIONS (showing circular reuse):');
        this.enqueue('E');
        this.enqueue('F');
        this.demonstrateCircularBehavior();
        
        console.log('\n7. FINAL STATE:');
        this.display();
        
        console.log(`\n🎯 QUEUE OPERATION SUMMARY:`);
        console.log(`- All operations are O(1) constant time`);
        console.log(`- FIFO principle maintained throughout`);
        console.log(`- Circular array prevents space waste`);
        console.log(`- Overflow/underflow protection included`);
        
        return {
            finalSize: this.size(),
            frontElement: this.peek(),
            totalOperations: this.operationCount
        };
    }
}

// Test array-based queue
const arrayQueue = new ArrayQueue(6);
arrayQueue.demonstrateBasicOperations();
```

### Linked List-based Queue Implementation

**Concept**: Implementing queue using linked list for dynamic size and optimal memory usage.

```javascript
// Queue Implementation using Linked List

class QueueNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
    
    toString() {
        return `Node(${this.data})`;
    }
}

class LinkedListQueue {
    constructor() {
        this.front = null;  // Points to front node
        this.rear = null;   // Points to rear node
        this.size = 0;
        this.operationCount = 0;
    }
    
    // Enqueue operation: Add element to rear - O(1)
    enqueue(element) {
        console.log(`\n📥 ENQUEUING ${element} to linked list queue`);
        console.log(`Current front: ${this.front ? this.front.toString() : 'null'}`);
        console.log(`Current rear: ${this.rear ? this.rear.toString() : 'null'}`);
        this.operationCount++;
        
        // Create new node
        const newNode = new QueueNode(element);
        console.log(`Created new node: ${newNode.toString()}`);
        
        if (this.isEmpty()) {
            // First node: both front and rear point to it
            this.front = newNode;
            this.rear = newNode;
            console.log(`Queue was empty, new node becomes both front and rear`);
        } else {
            // Link new node to current rear and update rear
            this.rear.next = newNode;
            this.rear = newNode;
            console.log(`Linked new node to current rear and updated rear pointer`);
            console.log(`Previous rear → New rear: ${this.rear.toString()}`);
        }
        
        this.size++;
        
        console.log(`✅ Enqueued ${element} successfully`);
        console.log(`New size: ${this.size}`);
        console.log(`Queue: ${this.toString()}`);
        console.log(`Time Complexity: O(1) - constant time with rear pointer`);
        
        return this;
    }
    
    // Dequeue operation: Remove element from front - O(1)
    dequeue() {
        console.log(`\n📤 DEQUEUING from linked list queue`);
        console.log(`Current front: ${this.front ? this.front.toString() : 'null'}`);
        console.log(`Current rear: ${this.rear ? this.rear.toString() : 'null'}`);
        this.operationCount++;
        
        // Check for empty queue
        if (this.isEmpty()) {
            console.log(`❌ Cannot dequeue from empty queue`);
            return undefined;
        }
        
        // Get data from front node
        const dequeuedData = this.front.data;
        const oldFront = this.front;
        
        console.log(`Data to dequeue: ${dequeuedData}`);
        console.log(`Old front node: ${oldFront.toString()}`);
        console.log(`Next node: ${oldFront.next ? oldFront.next.toString() : 'null'}`);
        
        // Update front to next node
        this.front = this.front.next;
        
        // If queue becomes empty, update rear to null
        if (this.front === null) {
            this.rear = null;
            console.log(`Queue became empty, rear also set to null`);
        }
        
        this.size--;
        
        // Clean up old node
        oldFront.next = null;
        
        console.log(`✅ Dequeued ${dequeuedData} successfully`);
        console.log(`New front: ${this.front ? this.front.toString() : 'null'}`);
        console.log(`New size: ${this.size}`);
        console.log(`Queue: ${this.toString()}`);
        console.log(`Time Complexity: O(1) - constant time operation`);
        
        return dequeuedData;
    }
    
    // Peek operation: View front element - O(1)
    peek() {
        console.log(`\n👀 PEEKING at linked list queue front`);
        this.operationCount++;
        
        if (this.isEmpty()) {
            console.log(`❌ Cannot peek at empty queue`);
            return undefined;
        }
        
        const frontData = this.front.data;
        console.log(`✅ Front element: ${frontData}`);
        console.log(`Front node: ${this.front.toString()}`);
        console.log(`Queue unchanged - non-destructive operation`);
        console.log(`Time Complexity: O(1) - direct access to front node`);
        
        return frontData;
    }
    
    // Get rear element
    getRear() {
        console.log(`\n👀 CHECKING rear of linked list queue`);
        
        if (this.isEmpty()) {
            console.log(`❌ Cannot get rear of empty queue`);
            return undefined;
        }
        
        const rearData = this.rear.data;
        console.log(`✅ Rear element: ${rearData}`);
        console.log(`Rear node: ${this.rear.toString()}`);
        
        return rearData;
    }
    
    // Check if queue is empty
    isEmpty() {
        const empty = this.front === null;
        console.log(`📊 isEmpty() = ${empty} (front = ${this.front ? this.front.toString() : 'null'})`);
        return empty;
    }
    
    // Get queue size
    getSize() {
        return this.size;
    }
    
    // Convert to string representation
    toString() {
        if (this.isEmpty()) {
            return "[]";
        }
        
        const elements = [];
        let current = this.front;
        
        while (current !== null) {
            elements.push(current.data);
            current = current.next;
        }
        
        return `Front → [${elements.join(' → ')}] ← Rear`;
    }
    
    // Display detailed queue state
    display() {
        console.log(`\n📋 LINKED LIST QUEUE STATE`);
        console.log(`Size: ${this.size}`);
        console.log(`Front: ${this.front ? this.front.toString() : 'null'}`);
        console.log(`Rear: ${this.rear ? this.rear.toString() : 'null'}`);
        console.log(`Operations performed: ${this.operationCount}`);
        
        if (this.isEmpty()) {
            console.log(`Queue is empty`);
        } else {
            console.log(`Queue contents (front to rear):`);
            let current = this.front;
            let position = 0;
            
            while (current !== null) {
                const marker = position === 0 ? ' ← FRONT' : 
                              (current === this.rear ? ' ← REAR' : '');
                console.log(`  Position ${position}: ${current.toString()}${marker}`);
                current = current.next;
                position++;
            }
        }
        
        console.log(`Visual: ${this.toString()}`);
    }
    
    // Compare with array implementation
    compareImplementations() {
        console.log(`\n⚖️ LINKED LIST vs ARRAY QUEUE COMPARISON:`);
        
        console.log(`\n📊 Linked List Queue Advantages:`);
        console.log(`- Dynamic size: no capacity limit`);
        console.log(`- Memory efficient: allocates only what's needed`);
        console.log(`- No queue overflow: grows as needed`);
        console.log(`- True O(1) operations: no circular array complexity`);
        
        console.log(`\n📊 Linked List Queue Disadvantages:`);
        console.log(`- Memory overhead: extra pointer per node`);
        console.log(`- Cache performance: nodes scattered in memory`);
        console.log(`- Allocation cost: dynamic memory allocation per enqueue`);
        console.log(`- Complexity: two pointers to maintain (front and rear)`);
        
        console.log(`\n📊 Array Queue Advantages:`);
        console.log(`- Memory efficient: no pointer overhead`);
        console.log(`- Cache friendly: contiguous memory layout`);
        console.log(`- Simple indexing: direct array access`);
        console.log(`- Predictable memory: fixed allocation`);
        
        console.log(`\n📊 Array Queue Disadvantages:`);
        console.log(`- Fixed size: predetermined capacity`);
        console.log(`- Memory waste: unused allocated space`);
        console.log(`- Queue overflow: capacity limitations`);
        console.log(`- Circular logic: index wrapping complexity`);
        
        return {
            linkedListBest: 'Dynamic requirements, unknown size',
            arrayBest: 'Known size limits, cache performance critical'
        };
    }
    
    // Demonstrate linked list queue
    demonstrateLinkedListQueue() {
        console.log('\n=== LINKED LIST QUEUE DEMONSTRATION ===\n');
        
        console.log('1. INITIAL STATE:');
        this.display();
        
        console.log('\n2. ENQUEUE OPERATIONS:');
        this.enqueue('First');
        this.enqueue('Second');
        this.enqueue('Third');
        this.enqueue('Fourth');
        
        console.log('\n3. PEEK OPERATIONS:');
        const frontElement = this.peek();
        const rearElement = this.getRear();
        
        console.log('\n4. DEQUEUE OPERATIONS:');
        const dequeued1 = this.dequeue();
        const dequeued2 = this.dequeue();
        
        console.log('\n5. MIXED OPERATIONS:');
        this.enqueue('Fifth');
        this.enqueue('Sixth');
        
        console.log('\n6. FINAL STATE:');
        this.display();
        
        console.log('\n7. IMPLEMENTATION COMPARISON:');
        this.compareImplementations();
        
        return {
            finalSize: this.getSize(),
            frontElement: this.peek(),
            totalOperations: this.operationCount
        };
    }
}

// Test linked list queue
console.log('\n' + '='.repeat(60));
const linkedQueue = new LinkedListQueue();
linkedQueue.demonstrateLinkedListQueue();
```

### Advanced Queue Variants

**Concept**: Specialized queue implementations for specific use cases and enhanced functionality.

```javascript
// Advanced Queue Variants

// 1. Priority Queue Implementation
class PriorityQueueNode {
    constructor(data, priority) {
        this.data = data;
        this.priority = priority;
    }
    
    toString() {
        return `Node(${this.data}, priority: ${this.priority})`;
    }
}

class PriorityQueue {
    constructor() {
        this.items = [];
        this.operationCount = 0;
    }
    
    // Enqueue with priority - O(n) for insertion sort approach
    enqueue(data, priority) {
        console.log(`\n⭐ PRIORITY ENQUEUE: ${data} with priority ${priority}`);
        this.operationCount++;
        
        const newNode = new PriorityQueueNode(data, priority);
        console.log(`Created: ${newNode.toString()}`);
        
        if (this.isEmpty()) {
            this.items.push(newNode);
            console.log(`Queue was empty, added as first element`);
        } else {
            // Find correct position based on priority (higher number = higher priority)
            let insertIndex = 0;
            
            console.log(`Finding insertion position:`);
            for (let i = 0; i < this.items.length; i++) {
                console.log(`  Comparing with ${this.items[i].toString()}`);
                
                if (priority > this.items[i].priority) {
                    insertIndex = i;
                    console.log(`  Higher priority, will insert at index ${insertIndex}`);
                    break;
                } else if (priority === this.items[i].priority) {
                    // Same priority: FIFO order (insert after existing same-priority items)
                    insertIndex = i + 1;
                    console.log(`  Same priority, FIFO order - insert at index ${insertIndex}`);
                } else {
                    insertIndex = i + 1;
                }
            }
            
            if (insertIndex >= this.items.length) {
                this.items.push(newNode);
                console.log(`  Lowest priority, added at end`);
            } else {
                this.items.splice(insertIndex, 0, newNode);
                console.log(`  Inserted at index ${insertIndex}`);
            }
        }
        
        console.log(`✅ Priority queue: ${this.toString()}`);
        console.log(`Time Complexity: O(n) - insertion in sorted order`);
        
        return this;
    }
    
    // Dequeue highest priority element - O(1)
    dequeue() {
        console.log(`\n📤 PRIORITY DEQUEUE (highest priority first)`);
        this.operationCount++;
        
        if (this.isEmpty()) {
            console.log(`❌ Cannot dequeue from empty priority queue`);
            return undefined;
        }
        
        const highestPriority = this.items.shift();
        console.log(`✅ Dequeued: ${highestPriority.toString()}`);
        console.log(`Remaining queue: ${this.toString()}`);
        console.log(`Time Complexity: O(1) - remove from front`);
        
        return highestPriority.data;
    }
    
    peek() {
        if (this.isEmpty()) return undefined;
        return this.items[0];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    toString() {
        if (this.isEmpty()) return "[]";
        return `[${this.items.map(item => `${item.data}(${item.priority})`).join(', ')}]`;
    }
    
    // Demonstrate priority queue
    demonstratePriorityQueue() {
        console.log('\n=== PRIORITY QUEUE DEMONSTRATION ===');
        
        console.log('\n1. ADDING TASKS WITH DIFFERENT PRIORITIES:');
        this.enqueue('Low priority task', 1);
        this.enqueue('Critical bug fix', 5);
        this.enqueue('Medium feature', 3);
        this.enqueue('Another critical', 5);
        this.enqueue('Documentation', 1);
        this.enqueue('High priority feature', 4);
        
        console.log('\n2. PROCESSING TASKS BY PRIORITY:');
        while (!this.isEmpty()) {
            const task = this.dequeue();
            console.log(`Processing: ${task}`);
        }
        
        console.log(`\n💡 Priority Queue Applications:`);
        console.log(`- Operating system task scheduling`);
        console.log(`- Hospital emergency room triage`);
        console.log(`- Network packet routing`);
        console.log(`- Dijkstra's shortest path algorithm`);
        console.log(`- A* pathfinding algorithm`);
        
        return true;
    }
}

// 2. Circular Queue (Ring Buffer) Implementation
class CircularQueue {
    constructor(capacity) {
        this.items = new Array(capacity);
        this.capacity = capacity;
        this.front = -1;
        this.rear = -1;
        this.size = 0;
    }
    
    enqueue(element) {
        console.log(`\n🔄 CIRCULAR ENQUEUE: ${element}`);
        
        if (this.isFull()) {
            console.log(`❌ Circular queue is full! Capacity: ${this.capacity}`);
            return false;
        }
        
        if (this.isEmpty()) {
            this.front = 0;
            this.rear = 0;
        } else {
            this.rear = (this.rear + 1) % this.capacity;
        }
        
        this.items[this.rear] = element;
        this.size++;
        
        console.log(`✅ Added at index ${this.rear}`);
        console.log(`Circular queue: ${this.toString()}`);
        console.log(`Front: ${this.front}, Rear: ${this.rear}, Size: ${this.size}`);
        
        return true;
    }
    
    dequeue() {
        console.log(`\n🔄 CIRCULAR DEQUEUE`);
        
        if (this.isEmpty()) {
            console.log(`❌ Cannot dequeue from empty circular queue`);
            return undefined;
        }
        
        const element = this.items[this.front];
        this.items[this.front] = undefined;
        
        if (this.size === 1) {
            this.front = -1;
            this.rear = -1;
        } else {
            this.front = (this.front + 1) % this.capacity;
        }
        
        this.size--;
        
        console.log(`✅ Removed ${element}`);
        console.log(`Circular queue: ${this.toString()}`);
        console.log(`Front: ${this.front}, Rear: ${this.rear}, Size: ${this.size}`);
        
        return element;
    }
    
    isFull() {
        return this.size === this.capacity;
    }
    
    isEmpty() {
        return this.size === 0;
    }
    
    toString() {
        if (this.isEmpty()) return "[]";
        
        const elements = [];
        for (let i = 0; i < this.size; i++) {
            const index = (this.front + i) % this.capacity;
            elements.push(this.items[index]);
        }
        
        return `[${elements.join(', ')}] (${this.size}/${this.capacity})`;
    }
    
    // Show circular nature
    showCircularNature() {
        console.log(`\n🔄 CIRCULAR QUEUE VISUALIZATION:`);
        console.log(`Capacity: ${this.capacity}`);
        console.log(`Physical array: [${this.items.map(item => item || 'empty').join(', ')}]`);
        console.log(`Logical view: ${this.toString()}`);
        console.log(`Front pointer: ${this.front}, Rear pointer: ${this.rear}`);
        
        if (!this.isEmpty()) {
            console.log(`\nTraversal order (logical):`);
            for (let i = 0; i < this.size; i++) {
                const physicalIndex = (this.front + i) % this.capacity;
                console.log(`  Logical ${i} → Physical ${physicalIndex} → Value: ${this.items[physicalIndex]}`);
            }
        }
        
        console.log(`\n💡 Circular Queue Benefits:`);
        console.log(`- Maximum space utilization`);
        console.log(`- Avoids array shifting operations`);
        console.log(`- Perfect for fixed-size buffers`);
        console.log(`- Common in real-time systems`);
    }
    
    demonstrateCircularQueue() {
        console.log('\n=== CIRCULAR QUEUE DEMONSTRATION ===');
        
        console.log(`\n1. FILLING CIRCULAR QUEUE (capacity: ${this.capacity}):`);
        for (let i = 1; i <= this.capacity; i++) {
            this.enqueue(`Item${i}`);
        }
        
        console.log(`\n2. CIRCULAR NATURE VISUALIZATION:`);
        this.showCircularNature();
        
        console.log(`\n3. DEQUEUE SOME ELEMENTS:`);
        this.dequeue();
        this.dequeue();
        
        console.log(`\n4. ENQUEUE NEW ELEMENTS (showing wrapping):`);
        this.enqueue('NewItem1');
        this.enqueue('NewItem2');
        
        console.log(`\n5. FINAL CIRCULAR STATE:`);
        this.showCircularNature();
        
        return true;
    }
}

// 3. Double-ended Queue (Deque) Implementation
class Deque {
    constructor() {
        this.items = [];
        this.operationCount = 0;
    }
    
    // Add to front
    addFront(element) {
        console.log(`\n➡️ DEQUE ADD FRONT: ${element}`);
        this.items.unshift(element);
        this.operationCount++;
        console.log(`✅ Added ${element} to front`);
        console.log(`Deque: ${this.toString()}`);
        console.log(`Time Complexity: O(n) - array shift operation`);
        return this;
    }
    
    // Add to rear
    addRear(element) {
        console.log(`\n⬅️ DEQUE ADD REAR: ${element}`);
        this.items.push(element);
        this.operationCount++;
        console.log(`✅ Added ${element} to rear`);
        console.log(`Deque: ${this.toString()}`);
        console.log(`Time Complexity: O(1) - array push operation`);
        return this;
    }
    
    // Remove from front
    removeFront() {
        console.log(`\n📤 DEQUE REMOVE FRONT`);
        
        if (this.isEmpty()) {
            console.log(`❌ Cannot remove from empty deque`);
            return undefined;
        }
        
        const element = this.items.shift();
        this.operationCount++;
        console.log(`✅ Removed ${element} from front`);
        console.log(`Deque: ${this.toString()}`);
        console.log(`Time Complexity: O(n) - array shift operation`);
        
        return element;
    }
    
    // Remove from rear
    removeRear() {
        console.log(`\n📤 DEQUE REMOVE REAR`);
        
        if (this.isEmpty()) {
            console.log(`❌ Cannot remove from empty deque`);
            return undefined;
        }
        
        const element = this.items.pop();
        this.operationCount++;
        console.log(`✅ Removed ${element} from rear`);
        console.log(`Deque: ${this.toString()}`);
        console.log(`Time Complexity: O(1) - array pop operation`);
        
        return element;
    }
    
    peekFront() {
        return this.isEmpty() ? undefined : this.items[0];
    }
    
    peekRear() {
        return this.isEmpty() ? undefined : this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    toString() {
        return `Front ← [${this.items.join(', ')}] → Rear`;
    }
    
    // Demonstrate deque operations
    demonstrateDeque() {
        console.log('\n=== DEQUE (DOUBLE-ENDED QUEUE) DEMONSTRATION ===');
        
        console.log('\n1. ADDING ELEMENTS FROM BOTH ENDS:');
        this.addRear('Center');
        this.addFront('Left1');
        this.addRear('Right1');
        this.addFront('Left2');
        this.addRear('Right2');
        
        console.log('\n2. PEEKING AT BOTH ENDS:');
        console.log(`Front element: ${this.peekFront()}`);
        console.log(`Rear element: ${this.peekRear()}`);
        
        console.log('\n3. REMOVING FROM BOTH ENDS:');
        this.removeFront();
        this.removeRear();
        this.removeFront();
        
        console.log('\n4. FINAL STATE:');
        console.log(`Deque: ${this.toString()}`);
        console.log(`Size: ${this.size()}`);
        
        console.log(`\n💡 Deque Applications:`);
        console.log(`- Undo-redo with both directions`);
        console.log(`- Sliding window algorithms`);
        console.log(`- Browser history navigation`);
        console.log(`- Double-ended sliding window problems`);
        console.log(`- Palindrome checking algorithms`);
        
        return {
            finalSize: this.size(),
            totalOperations: this.operationCount
        };
    }
}

// Demonstrate all advanced queue variants
function demonstrateAdvancedQueues() {
    console.log('=== ADVANCED QUEUE VARIANTS DEMONSTRATION ===');
    
    // Priority Queue
    const priorityQueue = new PriorityQueue();
    priorityQueue.demonstratePriorityQueue();
    
    // Circular Queue
    console.log('\n' + '='.repeat(60));
    const circularQueue = new CircularQueue(5);
    circularQueue.demonstrateCircularQueue();
    
    // Deque
    console.log('\n' + '='.repeat(60));
    const deque = new Deque();
    deque.demonstrateDeque();
    
    console.log(`\n🎯 QUEUE VARIANTS SUMMARY:`);
    console.log(`- Standard Queue: FIFO processing, fair ordering`);
    console.log(`- Priority Queue: Importance-based processing`);
    console.log(`- Circular Queue: Fixed-size buffer, space efficient`);
    console.log(`- Deque: Bidirectional operations, maximum flexibility`);
    console.log(`- Each variant optimized for specific use cases`);
    
    return true;
}

// Test all advanced queue variants
console.log('\n' + '='.repeat(60));
demonstrateAdvancedQueues();
```

## Summary

### Core Queue Concepts Mastered
- **FIFO Principle**: First-In-First-Out ordering ensures fair processing
- **Array Implementation**: Circular array for space efficiency and O(1) operations
- **Linked List Implementation**: Dynamic sizing with optimal memory usage
- **Advanced Variants**: Priority queues, circular queues, and double-ended queues

### Queue Operations Complexity
- **Enqueue**: O(1) - Add element to rear
- **Dequeue**: O(1) - Remove element from front
- **Peek**: O(1) - View front element
- **isEmpty/Size**: O(1) - Check state properties

### Why Queues Are Essential
- **Fair Processing**: Ensures first-come, first-served ordering
- **Buffering**: Manages rate differences between producers and consumers
- **Scheduling**: Critical for operating system and application task management
- **Flow Control**: Regulates data flow in networks and systems

### Real-World Queue Applications
- **Operating Systems**: Process scheduling, job queues, interrupt handling
- **Networking**: Packet buffering, bandwidth management, QoS implementation
- **Web Services**: Request queues, connection pooling, rate limiting
- **Database Systems**: Transaction queues, query processing, lock management
- **Gaming**: Turn-based logic, animation sequences, event processing

### Queue Implementation Comparison

**Array-based Queue (Circular):**
- **Advantages**: Memory efficient, cache-friendly, predictable performance
- **Disadvantages**: Fixed capacity, potential overflow
- **Best for**: Known size limits, high-performance requirements

**Linked List-based Queue:**
- **Advantages**: Dynamic size, no overflow, optimal memory allocation
- **Disadvantages**: Pointer overhead, scattered memory access
- **Best for**: Unknown size requirements, varying load patterns

### Advanced Queue Variants

**Priority Queue:**
- **Use Case**: Task scheduling, emergency systems, algorithm optimization
- **Complexity**: O(n) insertion for sorted array, O(log n) for heap implementation
- **Applications**: Dijkstra's algorithm, A* pathfinding, operating system scheduling

**Circular Queue (Ring Buffer):**
- **Use Case**: Fixed-size buffers, real-time systems, streaming data
- **Advantage**: Maximum space utilization, no memory waste
- **Applications**: Audio/video streaming, network buffers, embedded systems

**Deque (Double-ended Queue):**
- **Use Case**: Bidirectional operations, sliding window problems
- **Flexibility**: Add/remove from both ends
- **Applications**: Browser history, undo-redo systems, palindrome checking

### Queue Algorithm Patterns
1. **Level-order Traversal**: BFS in trees and graphs using queues
2. **Sliding Window**: Deque for maintaining window extrema
3. **Producer-Consumer**: Queue as buffer between different processing rates
4. **Rate Limiting**: Queue for managing request throttling
5. **Breadth-First Search**: Queue for exploring neighbors level by level

### Performance Optimization Tips
- **Choose Right Variant**: Standard for FIFO, priority for importance-based, circular for fixed buffers
- **Consider Cache Locality**: Array implementation better for cache performance
- **Memory Management**: Linked list better for dynamic sizing
- **Batch Processing**: Group operations to amortize costs
- **Monitor Queue Depth**: Prevent infinite growth in production systems

### Common Queue Pitfalls
- **Queue Overflow**: Not handling capacity limits in bounded queues
- **Memory Leaks**: Not properly cleaning up in linked list implementations
- **Starvation**: Low-priority items never getting processed in priority queues
- **Race Conditions**: Thread safety issues in concurrent environments

### Next Steps in Queue Mastery
- **Study BFS Algorithms**: Apply queues to graph and tree traversal
- **Explore Concurrent Queues**: Thread-safe implementations for parallel systems
- **Practice Problems**: Solve queue-based algorithmic challenges
- **System Design**: Use queues in designing scalable distributed systems

Queues embody the principle of **fairness in computer systems** - they ensure that resources are allocated and tasks are processed in a predictable, equitable manner. From the operating system scheduler that gives every process a fair chance to execute, to the web server that handles millions of requests in order, queues are the **invisible fairness engines** that make modern computing systems reliable and predictable! 🚀✨

**Module 2 Complete!** 🎉 You've now mastered all the fundamental linear data structures: Arrays, Strings, Linked Lists, Stacks, and Queues. Next up: **Module 3 - Trees & Hierarchical Structures** where we'll explore non-linear data structures that model relationships and hierarchies!
