---
title: "Design Thread-Safe Blocking Queue"
description: "Design Thread-Safe Blocking Queue - Concurrency Interview Module 12"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Design Thread-Safe Blocking Queue

The blocking queue provides two guarantees that regular queues cannot: producers block when the queue is full (backpressure), and consumers block when the queue is empty (no busy waiting).

Combined with thread safety, this makes blocking queues the backbone of producer-consumer systems, from message brokers to thread pools to request buffering. Every Java ExecutorService uses a blocking queue internally. Understanding how to build one exposes the core techniques of concurrent data structure design.

# Problem Statement

### What We're Building

A bounded, thread-safe queue that blocks producers when full and blocks consumers when empty. The capacity limit provides backpressure, preventing memory exhaustion. The blocking semantics eliminate busy waiting and coordinate producers with consumers naturally.

### Required Operations

Operation

Description

Expected Complexity

`put(item)`

Insert item, block if queue is full

O(1) amortized

`take()`

Remove and return head, block if empty

O(1)

`offer(item)`

Insert if space available, return false if full

O(1)

`poll()`

Remove head if available, return null if empty

O(1)

`peek()`

View head without removing, null if empty

O(1)

`size()`

Current number of elements

O(1)

### Thread-Safety Requirements

*   Multiple producer threads can call `put()` simultaneously without losing items
*   Multiple consumer threads can call `take()` simultaneously without duplicate consumption
*   A single item is delivered to exactly one consumer (no duplicates, no losses)
*   Blocking operations must respond to interruption (throw InterruptedException)
*   The queue must never enter an invalid state regardless of thread interleaving

# Data Structure Fundamentals

Before adding concurrency, we need a queue that efficiently uses bounded memory. A circular buffer is the standard choice: a fixed-size array where head and tail wrap around when they reach the end.

### Core Concepts

1.  **Circular Array:** Instead of shifting elements on dequeue (O(n)), we maintain head and tail indices that wrap around modulo capacity.
2.  **Head and Tail Pointers:** Head points to the next element to dequeue. Tail points to the next empty slot for enqueue. When tail reaches the end, it wraps to index 0.
3.  **Full vs Empty Distinction:** When head equals tail, the queue could be empty or full. We track count separately to distinguish these states.
4.  **Capacity vs Size:** Capacity is the fixed maximum (set at construction). Size is the current element count (0 to capacity).

### Single-Threaded Implementation

Java

```java
1public class CircularQueue<E> {
2    private final Object[] items;
3    private int head;     // Index of next element to dequeue
4    private int tail;     // Index of next empty slot for enqueue
5    private int count;    // Current number of elements
6
7    public CircularQueue(int capacity) {
8        items = new Object[capacity];
9        head = 0;
10        tail = 0;
11        count = 0;
12    }
13
14    public boolean offer(E item) {
15        if (count == items.length) {
16            return false;  // Queue is full
17        }
18        items[tail] = item;
19        tail = (tail + 1) % items.length;  // Wrap around
20        count++;
21        return true;
22    }
23
24    @SuppressWarnings("unchecked")
25    public E poll() {
26        if (count == 0) {
27            return null;  // Queue is empty
28        }
29        E item = (E) items[head];
30        items[head] = null;  // Help GC
31        head = (head + 1) % items.length;  // Wrap around
32        count--;
33        return item;
34    }
35
36    @SuppressWarnings("unchecked")
37    public E peek() {
38        if (count == 0) {
39            return null;
40        }
41        return (E) items[head];
42    }
43
44    public int size() {
45        return count;
46    }
47
48    public boolean isEmpty() {
49        return count == 0;
50    }
51
52    public boolean isFull() {
53        return count == items.length;
54    }
55}
```

### Internal Structure

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

The buffer holds elements A, B, C at indices 0, 1, 2. The head pointer at 0 means the next `poll()` returns A. The tail pointer at 3 means the next `offer()` places an item at index 3. When tail reaches 5 and another item is added, tail wraps to 0 (if space exists after dequeues). This wrap-around reuses memory without shifting elements.

# Concurrency Challenges

Adding thread safety to our circular buffer reveals several subtle problems. Understanding these challenges is essential for choosing the right synchronization strategy.

### Challenge 1: Lost Wakeups

The most insidious bug in blocking queue implementations. A producer signals "not empty" after adding an item, but the consumer hasn't started waiting yet. The signal is lost. The consumer then waits forever, even though the queue has items.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

The consumer checks the condition, finds it empty, but before it can wait, the producer adds an item and signals. The signal goes nowhere because no thread is waiting yet. The consumer then waits on a condition that's already satisfied.

### Challenge 2: Spurious Wakeups

A thread waiting on a condition variable can wake up even when no other thread signaled it. This is a documented behavior of most threading implementations (POSIX pthreads, Java, etc.). If the code assumes every wakeup means the condition is satisfied, it will dequeue from an empty queue.

Java

```java
1// WRONG: Using if instead of while
2if (count == 0) {
3    notEmpty.await();  // Spurious wakeup occurs
4}
5E item = items[head];  // BUG: Queue might still be empty!
```

### Challenge 3: Producer-Consumer Race

Multiple producers competing for the last slot, or multiple consumers competing for the last item, can cause races if signaling isn't handled correctly.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Both producers wake up when a slot opens, but only one can use it. The other must go back to waiting. This is why the wait must be in a loop, not an if statement.

### Challenge 4: Signaling Under Lock

Should you signal while holding the lock or after releasing it? Signaling while holding the lock is safer (no lost signals) but may cause "hurry up and wait": the signaled thread wakes up but immediately blocks on the lock the signaler still holds.

### Consistency Model Requirements

Property

Requirement

Why It Matters

**Atomicity**

put/take must be atomic

Prevents partial updates, duplicate items

**FIFO Order**

Items dequeue in enqueue order

Expected queue semantics

**Blocking**

Block rather than busy-wait

CPU efficiency, battery life

**Liveness**

Every waiting thread eventually proceeds

No indefinite blocking when items/space exist

# Approach 1: Single Lock with Conditions

The straightforward solution: one lock protects all queue state, with two condition variables for blocking semantics. Producers wait on "not full" and signal "not empty". Consumers wait on "not empty" and signal "not full".

### Implementation

Java

```java
1import java.util.concurrent.locks.Condition;
2import java.util.concurrent.locks.ReentrantLock;
3
4public class SingleLockBlockingQueue<E> {
5    private final Object[] items;
6    private int head;
7    private int tail;
8    private int count;
9
10    private final ReentrantLock lock = new ReentrantLock();
11    private final Condition notEmpty = lock.newCondition();
12    private final Condition notFull = lock.newCondition();
13
14    public SingleLockBlockingQueue(int capacity) {
15        if (capacity <= 0) throw new IllegalArgumentException();
16        items = new Object[capacity];
17    }
18
19    /**
20     * Inserts item, blocking if queue is full.
21     * @throws InterruptedException if interrupted while waiting
22     */
23    public void put(E item) throws InterruptedException {
24        if (item == null) throw new NullPointerException();
25        lock.lockInterruptibly();
26        try {
27            // MUST be while loop, not if (spurious wakeups + multiple waiters)
28            while (count == items.length) {
29                notFull.await();
30            }
31            enqueue(item);
32        } finally {
33            lock.unlock();
34        }
35    }
36
37    /**
38     * Removes and returns head, blocking if queue is empty.
39     * @throws InterruptedException if interrupted while waiting
40     */
41    @SuppressWarnings("unchecked")
42    public E take() throws InterruptedException {
43        lock.lockInterruptibly();
44        try {
45            while (count == 0) {
46                notEmpty.await();
47            }
48            return dequeue();
49        } finally {
50            lock.unlock();
51        }
52    }
53
54    /**
55     * Inserts item if space available.
56     * @return true if inserted, false if full
57     */
58    public boolean offer(E item) {
59        if (item == null) throw new NullPointerException();
60        lock.lock();
61        try {
62            if (count == items.length) {
63                return false;
64            }
65            enqueue(item);
66            return true;
67        } finally {
68            lock.unlock();
69        }
70    }
71
72    /**
73     * Removes and returns head if available.
74     * @return head element, or null if empty
75     */
76    @SuppressWarnings("unchecked")
77    public E poll() {
78        lock.lock();
79        try {
80            if (count == 0) {
81                return null;
82            }
83            return dequeue();
84        } finally {
85            lock.unlock();
86        }
87    }
88
89    @SuppressWarnings("unchecked")
90    public E peek() {
91        lock.lock();
92        try {
93            return count == 0 ? null : (E) items[head];
94        } finally {
95            lock.unlock();
96        }
97    }
98
99    public int size() {
100        lock.lock();
101        try {
102            return count;
103        } finally {
104            lock.unlock();
105        }
106    }
107
108    // Must be called while holding lock
109    private void enqueue(E item) {
110        items[tail] = item;
111        tail = (tail + 1) % items.length;
112        count++;
113        notEmpty.signal();  // Wake one waiting consumer
114    }
115
116    // Must be called while holding lock
117    @SuppressWarnings("unchecked")
118    private E dequeue() {
119        E item = (E) items[head];
120        items[head] = null;
121        head = (head + 1) % items.length;
122        count--;
123        notFull.signal();  // Wake one waiting producer
124        return item;
125    }
126}
```

### Analysis

Property

Status

Explanation

Thread-safe

Yes

Single lock serializes all access

Deadlock-free

Yes

Only one lock, no circular wait

Starvation-free

Yes (with fair lock)

FIFO lock acquisition

Scalability

Limited

Producers block consumers and vice versa

### Single Lock Bottleneck

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

The diagram shows the fundamental limitation: all four threads contend for one lock. A producer inserting at the tail blocks a consumer removing from the head, even though they're accessing different parts of the queue.

### Pros

*   Simple and correct
*   Easy to reason about
*   Good for low-throughput scenarios
*   Compound operations naturally atomic

### Cons

*   Producers and consumers contend for same lock
*   No concurrent put + take
*   Lock acquisition overhead on every operation
*   Potential throughput bottleneck

#### **When to Use:**

*   Small buffer sizes
*   Low concurrency (few producers/consumers)
*   Simplicity is more important than throughput
*   As correctness baseline for testing

# Approach 2: Two-Lock Queue

The key insight: in a queue, producers only touch the tail and consumers only touch the head. If we use separate locks for head and tail, a producer can insert while a consumer removes simultaneously. This is the approach used by Java's LinkedBlockingQueue.

### Strategy: Separate Head and Tail Locks

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

The consumer acquires the take lock and removes from head. The producer acquires the put lock and appends at tail. They operate simultaneously because they hold different locks.

### The Tricky Part: Tracking Count

With two locks, we can't atomically read and update `count` under a single lock. We need an AtomicInteger. But signaling gets complex: after a `put`, how do we signal waiting consumers if we only hold the put lock and the notEmpty condition belongs to the take lock?

**Solution: Cascading Signals**

When count goes from 0 to 1, a put operation must signal consumers. But it holds the put lock, not the take lock. We use a two-step approach:

1.  Put acquires put lock, inserts, atomically increments count
2.  If count was 0 before increment (queue was empty), acquire take lock and signal notEmpty
3.  Take acquires take lock, removes, atomically decrements count
4.  If count was capacity before decrement (queue was full), acquire put lock and signal notFull

### Implementation

Java

```java
1import java.util.concurrent.atomic.AtomicInteger;
2import java.util.concurrent.locks.Condition;
3import java.util.concurrent.locks.ReentrantLock;
4
5public class TwoLockBlockingQueue<E> {
6    private final int capacity;
7    private final AtomicInteger count = new AtomicInteger(0);
8
9    // Linked list node
10    static class Node<E> {
11        E item;
12        Node<E> next;
13        Node(E item) { this.item = item; }
14    }
15
16    // Head of list - dequeue from here
17    private Node<E> head;
18    private final ReentrantLock takeLock = new ReentrantLock();
19    private final Condition notEmpty = takeLock.newCondition();
20
21    // Tail of list - enqueue here
22    private Node<E> last;
23    private final ReentrantLock putLock = new ReentrantLock();
24    private final Condition notFull = putLock.newCondition();
25
26    public TwoLockBlockingQueue(int capacity) {
27        if (capacity <= 0) throw new IllegalArgumentException();
28        this.capacity = capacity;
29        // Dummy node: simplifies empty check
30        head = last = new Node<>(null);
31    }
32
33    /**
34     * Inserts item, blocking if full.
35     */
36    public void put(E item) throws InterruptedException {
37        if (item == null) throw new NullPointerException();
38        int c;
39        Node<E> node = new Node<>(item);
40
41        putLock.lockInterruptibly();
42        try {
43            while (count.get() == capacity) {
44                notFull.await();
45            }
46            // Enqueue at tail
47            last = last.next = node;
48            c = count.getAndIncrement();
49
50            // If there's still room, wake another producer
51            if (c + 1 < capacity) {
52                notFull.signal();
53            }
54        } finally {
55            putLock.unlock();
56        }
57
58        // Signal consumers if queue was empty before this put
59        if (c == 0) {
60            signalNotEmpty();
61        }
62    }
63
64    /**
65     * Removes and returns head, blocking if empty.
66     */
67    public E take() throws InterruptedException {
68        E item;
69        int c;
70
71        takeLock.lockInterruptibly();
72        try {
73            while (count.get() == 0) {
74                notEmpty.await();
75            }
76            // Dequeue from head
77            Node<E> h = head;
78            Node<E> first = h.next;
79            head = first;
80            item = first.item;
81            first.item = null;  // Help GC
82            c = count.getAndDecrement();
83
84            // If there are more items, wake another consumer
85            if (c > 1) {
86                notEmpty.signal();
87            }
88        } finally {
89            takeLock.unlock();
90        }
91
92        // Signal producers if queue was full before this take
93        if (c == capacity) {
94            signalNotFull();
95        }
96
97        return item;
98    }
99
100    /**
101     * Non-blocking insert.
102     */
103    public boolean offer(E item) {
104        if (item == null) throw new NullPointerException();
105        if (count.get() == capacity) return false;
106        int c;
107        Node<E> node = new Node<>(item);
108
109        putLock.lock();
110        try {
111            if (count.get() == capacity) return false;
112            last = last.next = node;
113            c = count.getAndIncrement();
114            if (c + 1 < capacity) notFull.signal();
115        } finally {
116            putLock.unlock();
117        }
118
119        if (c == 0) signalNotEmpty();
120        return true;
121    }
122
123    /**
124     * Non-blocking remove.
125     */
126    public E poll() {
127        if (count.get() == 0) return null;
128        E item;
129        int c;
130
131        takeLock.lock();
132        try {
133            if (count.get() == 0) return null;
134            Node<E> h = head;
135            Node<E> first = h.next;
136            head = first;
137            item = first.item;
138            first.item = null;
139            c = count.getAndDecrement();
140            if (c > 1) notEmpty.signal();
141        } finally {
142            takeLock.unlock();
143        }
144
145        if (c == capacity) signalNotFull();
146        return item;
147    }
148
149    public E peek() {
150        if (count.get() == 0) return null;
151        takeLock.lock();
152        try {
153            Node<E> first = head.next;
154            return first == null ? null : first.item;
155        } finally {
156            takeLock.unlock();
157        }
158    }
159
160    public int size() {
161        return count.get();
162    }
163
164    // Acquire take lock to signal consumers
165    private void signalNotEmpty() {
166        takeLock.lock();
167        try {
168            notEmpty.signal();
169        } finally {
170            takeLock.unlock();
171        }
172    }
173
174    // Acquire put lock to signal producers
175    private void signalNotFull() {
176        putLock.lock();
177        try {
178            notFull.signal();
179        } finally {
180            putLock.unlock();
181        }
182    }
183}
```

### Analysis

Property

Status

Explanation

Thread-safe

Yes

Separate locks for head and tail

Deadlock-free

Yes

Lock ordering not needed (disjoint resources)

Concurrent put+take

Yes

Different locks, different data

Scalability

Good

Producers and consumers don't block each other

### Pros

*   Concurrent put and take operations
*   Better throughput under high load
*   Producers don't block consumers and vice versa

### Cons

*   More complex implementation
*   Slightly higher memory overhead (linked nodes vs array)
*   Cross-lock signaling adds latency
*   Harder to reason about correctness

#### **When to Use:**

*   High throughput requirements
*   Separate producer and consumer thread pools
*   Longer-running operations (amortizes lock overhead)
*   When array resizing isn't desired

# Solution Comparison

Aspect

Single Lock (ArrayBlockingQueue)

Two-Lock (LinkedBlockingQueue)

Lock-Free

**Concurrent operations**

None

put + take

Full

**Lock overhead**

1 lock acquisition

2 lock acquisitions (cascade)

No locks, CAS overhead

**Memory layout**

Contiguous array (cache-friendly)

Linked nodes (allocation)

Complex structures

**Bounded capacity**

Yes, fixed at construction

Yes, but can be unbounded

Typically unbounded

**size() accuracy**

Exact

Exact (atomic count)

Eventually consistent

**Implementation complexity**

Low

Medium

High

**Best for**

Small queues, low contention

High throughput

Extreme performance

### Decision Flowchart

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#### **Recommendation:**

*   **Interviews:** Start with single-lock implementation. It demonstrates condition variables, spurious wakeups, and blocking semantics clearly. Mention two-lock as an optimization if asked about throughput.
*   **Production Java:** Use `java.util.concurrent.ArrayBlockingQueue` (single-lock, bounded) or `LinkedBlockingQueue` (two-lock, optionally bounded). Both are battle-tested.
*   **Production C++:** Use `boost::lockfree::queue` for lock-free or implement the two-lock pattern with `std::mutex` and `std::condition_variable`.
*   **Production Python:** Use `queue.Queue` (built-in, single-lock) or `multiprocessing.Queue` for inter-process.

# Complete Implementation

This section provides the production-ready single-lock ArrayBlockingQueue, which is most relevant for interviews. It includes all operations, proper interruption handling, and clear documentation.

Java

```java
1import java.util.concurrent.locks.Condition;
2import java.util.concurrent.locks.ReentrantLock;
3
4/**
5 * A bounded blocking queue backed by a circular array.
6 *
7 * Thread Safety: All operations are thread-safe. Blocking operations
8 *                respond to interruption by throwing InterruptedException.
9 *
10 * Performance: Single lock design. For higher throughput with separate
11 *              producer/consumer threads, consider LinkedBlockingQueue.
12 *
13 * @param <E> the type of elements held in this queue
14 */
15public class ArrayBlockingQueue<E> {
16    private final Object[] items;
17    private int head;
18    private int tail;
19    private int count;
20
21    private final ReentrantLock lock;
22    private final Condition notEmpty;
23    private final Condition notFull;
24
25    /**
26     * Creates a queue with the given capacity.
27     *
28     * @param capacity the maximum number of elements
29     * @throws IllegalArgumentException if capacity <= 0
30     */
31    public ArrayBlockingQueue(int capacity) {
32        this(capacity, false);
33    }
34
35    /**
36     * Creates a queue with the given capacity and fairness policy.
37     *
38     * @param capacity the maximum number of elements
39     * @param fair if true, waiting threads are served FIFO
40     */
41    public ArrayBlockingQueue(int capacity, boolean fair) {
42        if (capacity <= 0) throw new IllegalArgumentException();
43        this.items = new Object[capacity];
44        this.lock = new ReentrantLock(fair);
45        this.notEmpty = lock.newCondition();
46        this.notFull = lock.newCondition();
47    }
48
49    /**
50     * Inserts the specified element, waiting if necessary for space.
51     *
52     * @param e the element to add
53     * @throws InterruptedException if interrupted while waiting
54     * @throws NullPointerException if the element is null
55     */
56    public void put(E e) throws InterruptedException {
57        if (e == null) throw new NullPointerException();
58        lock.lockInterruptibly();
59        try {
60            while (count == items.length) {
61                notFull.await();
62            }
63            enqueue(e);
64        } finally {
65            lock.unlock();
66        }
67    }
68
69    /**
70     * Removes and returns the head, waiting if necessary.
71     *
72     * @return the head element
73     * @throws InterruptedException if interrupted while waiting
74     */
75    @SuppressWarnings("unchecked")
76    public E take() throws InterruptedException {
77        lock.lockInterruptibly();
78        try {
79            while (count == 0) {
80                notEmpty.await();
81            }
82            return dequeue();
83        } finally {
84            lock.unlock();
85        }
86    }
87
88    /**
89     * Inserts if space is immediately available.
90     *
91     * @param e the element to add
92     * @return true if inserted, false if full
93     * @throws NullPointerException if the element is null
94     */
95    public boolean offer(E e) {
96        if (e == null) throw new NullPointerException();
97        lock.lock();
98        try {
99            if (count == items.length) return false;
100            enqueue(e);
101            return true;
102        } finally {
103            lock.unlock();
104        }
105    }
106
107    /**
108     * Removes and returns the head if available.
109     *
110     * @return the head element, or null if empty
111     */
112    public E poll() {
113        lock.lock();
114        try {
115            return count == 0 ? null : dequeue();
116        } finally {
117            lock.unlock();
118        }
119    }
120
121    /**
122     * Returns the head without removing it.
123     *
124     * @return the head element, or null if empty
125     */
126    @SuppressWarnings("unchecked")
127    public E peek() {
128        lock.lock();
129        try {
130            return count == 0 ? null : (E) items[head];
131        } finally {
132            lock.unlock();
133        }
134    }
135
136    /**
137     * Returns the current number of elements.
138     */
139    public int size() {
140        lock.lock();
141        try {
142            return count;
143        } finally {
144            lock.unlock();
145        }
146    }
147
148    /**
149     * Returns the maximum capacity.
150     */
151    public int capacity() {
152        return items.length;
153    }
154
155    /**
156     * Returns the remaining capacity.
157     */
158    public int remainingCapacity() {
159        lock.lock();
160        try {
161            return items.length - count;
162        } finally {
163            lock.unlock();
164        }
165    }
166
167    public boolean isEmpty() {
168        lock.lock();
169        try {
170            return count == 0;
171        } finally {
172            lock.unlock();
173        }
174    }
175
176    public boolean isFull() {
177        lock.lock();
178        try {
179            return count == items.length;
180        } finally {
181            lock.unlock();
182        }
183    }
184
185    // ---- Internal methods (must hold lock) ----
186
187    private void enqueue(E e) {
188        items[tail] = e;
189        tail = (tail + 1) % items.length;
190        count++;
191        notEmpty.signal();
192    }
193
194    @SuppressWarnings("unchecked")
195    private E dequeue() {
196        E e = (E) items[head];
197        items[head] = null;  // Help GC
198        head = (head + 1) % items.length;
199        count--;
200        notFull.signal();
201        return e;
202    }
203}
```

### Demo

Java

```java
1import java.util.concurrent.*;
2import java.util.concurrent.atomic.*;
3
4public class BlockingQueueDemo {
5    public static void main(String[] args) throws InterruptedException {
6        ArrayBlockingQueue<Integer> queue = new ArrayBlockingQueue<>(10);
7        int numProducers = 3;
8        int numConsumers = 3;
9        int itemsPerProducer = 1000;
10        ExecutorService executor = Executors.newFixedThreadPool(numProducers + numConsumers);
11        CountDownLatch producersDone = new CountDownLatch(numProducers);
12        AtomicInteger produced = new AtomicInteger(0);
13        AtomicInteger consumed = new AtomicInteger(0);
14        AtomicBoolean running = new AtomicBoolean(true);
15
16        // Producers
17        for (int p = 0; p < numProducers; p++) {
18            final int producerId = p;
19            executor.submit(() -> {
20                try {
21                    for (int i = 0; i < itemsPerProducer; i++) {
22                        queue.put(producerId * 10000 + i);
23                        produced.incrementAndGet();
24                    }
25                } catch (InterruptedException e) {
26                    Thread.currentThread().interrupt();
27                } finally {
28                    producersDone.countDown();
29                }
30            });
31        }
32
33        // Consumers
34        for (int c = 0; c < numConsumers; c++) {
35            executor.submit(() -> {
36                try {
37                    while (running.get() || !queue.isEmpty()) {
38                        Integer item = queue.poll();
39                        if (item != null) {
40                            consumed.incrementAndGet();
41                        } else {
42                            Thread.sleep(1);  // Avoid busy-wait
43                        }
44                    }
45                } catch (InterruptedException e) {
46                    Thread.currentThread().interrupt();
47                }
48            });
49        }
50
51        // Wait for producers to finish
52        producersDone.await();
53        // Give consumers time to drain
54        Thread.sleep(100);
55        running.set(false);
56
57        executor.shutdown();
58        executor.awaitTermination(5, TimeUnit.SECONDS);
59
60        System.out.println("Produced: " + produced.get());
61        System.out.println("Consumed: " + consumed.get());
62        System.out.println("Queue remaining: " + queue.size());
63        System.out.println("Test " + (produced.get() == consumed.get() + queue.size() ? "PASSED" : "FAILED"));
64    }
65}
```

**Expected Output:**

```shell
1Produced: 3000
2Consumed: 3000
3Queue remaining: 0
4Test PASSED
```

Launching soon
