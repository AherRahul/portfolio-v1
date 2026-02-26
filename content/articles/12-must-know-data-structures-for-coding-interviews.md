---
title: "12 Must-Know Data Structures for Coding Interviews"
description: "Cracking a coding interview isn’t just about writing code—it’s about solving problems efficiently. And to do that, you need to think in terms of data structures."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/12-must-know-data-structures-for-coding-interviews.md"
dateModified: "2025-03-18"
datePublished: "2025-03-18"
showOnArticles: true
topics:
  - dsa
---

Cracking a coding interview isn’t just about writing code—it’s about solving problems  **efficiently** . And to do that, you need to  **think in terms of data structures** .

The right data structure can mean the difference between an algorithm that runs in milliseconds and one that times out completely.

While there are many data structures in computer science,  **some appear in coding interviews far more frequently than others** .

In this article, we’ll go over  **12 essential data structures**  that you must know for coding interviews.

# 1. Array

An  **array**  is a  **contiguous block of memory**  that stores elements of the same data type. Each element is identified by an index, allowing  **constant-time access (O(1)).**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/0ecf3360-6004-4e2a-9592-cfc0da18b36d_1244x258.png)](https://substackcdn.com/image/fetch/$s_!aW2-!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0ecf3360-6004-4e2a-9592-cfc0da18b36d_1244x258.png)

An array is stored  **sequentially in memory** . Given an index, the memory address is calculated as:

> Address = Base Address + (Index × Size of each element)

This is why accessing an element by index is  **O(1)** —the address is computed directly.

### When to Use an Array?

- You need  **fast access**  to elements using an index ( **O(1)** ).
- The number of elements is  **fixed or changes infrequently** .
- You want a  **simple and efficient**  way to store sequential data.
- Memory locality is important (since arrays are contiguous, CPU caching is optimized).

### Time & Space Complexities

[![image](https://substack-post-media.s3.amazonaws.com/public/images/d9de99e8-6f01-4af3-ab5f-9ca1ee66bf41_1440x1368.png)](https://substackcdn.com/image/fetch/$s_!Xn8Z!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd9de99e8-6f01-4af3-ab5f-9ca1ee66bf41_1440x1368.png)

Space Complexity:  **O(n)**  (since arrays store n elements)

#### Other Important Details

1. **Fixed Size**  – In Java, arrays have a  **fixed size**  once created. You cannot dynamically resize an array.
2. **Resizing Overhead**  – If you need resizing, use ArrayList, which internally  **doubles the size**  when capacity is exceeded.

# 2. Matrix

A  **matrix**  is essentially a  **two-dimensional array** , where data is arranged in  **rows and columns** .

[![image](https://substack-post-media.s3.amazonaws.com/public/images/deacbb18-b1d2-4ca9-a66e-7736ce87692b_742x716.png)](https://substackcdn.com/image/fetch/$s_!d1lQ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fdeacbb18-b1d2-4ca9-a66e-7736ce87692b_742x716.png)

A matrix is stored in memory  **row-wise**  in most programming languages (including Java). Each element is accessed using matrix[row][column].

### **When to Use a Matrix?**

- When working with  **grid-based problems**  (chessboard, Sudoku, word search).
- For  **mathematical operations** , like  **linear algebra, transformations, or machine learning** .
- For  **graph representations**  using adjacency matrices.
- In  **image processing**  (storing pixels as a 2D array).
- In  **dynamic programming**  (e.g., dp[][] for problems like  **LCS, Knapsack** ).

### **Time & Space Complexities**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/fc736a52-e15c-421c-a6ff-c52efa96beed_1344x912.png)](https://substackcdn.com/image/fetch/$s_!nZ59!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffc736a52-e15c-421c-a6ff-c52efa96beed_1344x912.png)

Space Complexity:  **O(n × m)**  (since we store n × m elements).

# 3. Linked List

A  **linked list**  is a  **linear data structure**  where elements (nodes) are connected via  **pointers**  instead of being stored in a contiguous memory block. Each node consists of:

1. **Data**  – The actual value stored in the node.
2. **Pointer (next)**  – A reference to the next node in the list.

Unlike arrays, linked lists  **don’t require pre-allocated memory**  and allow  **dynamic resizing** , making them efficient for insertions and deletions.

### How is a Linked List Represented

```
class Node {
    int data;
    Node next;

    public Node(int data) {
        this.data = data;
        this.next = null;
    }
}
```

### **Types of Linked Lists**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/8692d961-24a1-427a-83bb-b5a593d54df0_1794x1044.png)](https://substackcdn.com/image/fetch/$s_!aO8n!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8692d961-24a1-427a-83bb-b5a593d54df0_1794x1044.png)

#### **1. Singly Linked List (SLL)**

- Each node has a  **next**  pointer to the next node.
- One-directional traversal.

#### **2. Doubly Linked List (DLL)**

- Each node has  **next**  and  **prev**  pointers.
- Allows  **bi-directional traversal** .

#### **3. Circular Linked List (CLL)**

- The last node  **points back**  to the head, forming a loop.

### **When to Use a Linked List?**

- When  **insertions/deletions are frequent**  (since they are O(1) at the head or tail).
- When  **memory fragmentation is a concern**  (as nodes are dynamically allocated).
- When  **dynamic resizing**  is required.
- When building  **LRU caches, stacks, and queues** .

### **Time & Space Complexities**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/fe9f37f5-3aa8-4815-bc49-0c3bad866ee3_1248x1520.png)](https://substackcdn.com/image/fetch/$s_!zjxp!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffe9f37f5-3aa8-4815-bc49-0c3bad866ee3_1248x1520.png)

# 4.  **HashMap**

A  **HashMap**  is a  **key-value pair data structure**  that provides  **fast lookups, insertions, and deletions**  using  **hashing** . Unlike arrays or linked lists, HashMaps allow  **constant-time (O(1)) operations**  on average, making them extremely efficient for many applications.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/7f1955fe-19b3-4a43-82ba-1a650720245b_1352x704.png)](https://substackcdn.com/image/fetch/$s_!kClX!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7f1955fe-19b3-4a43-82ba-1a650720245b_1352x704.png)

### **How is a HashMap Represented?**

A  **HashMap**  is internally implemented using an  **array of linked lists (buckets)** . When a key-value pair is inserted:

1. The key is  **hashed**  to generate an index.
2. The value is stored in the bucket corresponding to that index.
3. If multiple keys hash to the same index ( **collision** ), a linked list (or balanced BST) is used to store multiple values at that index.

#### **Example:**

```
Keys → Hash Function → Bucket Index
"John" → hash("John") → 2  →  [ ("John", 25) ]
"Mary" → hash("Mary") → 5  →  [ ("Mary", 30) ]
"Tom"  → hash("Tom")  → 2  →  [ ("John", 25), ("Tom", 40) ] (collision)
```

If two keys hash to the same bucket,  **chaining**  (linked list or tree) resolves the conflict.

### **When to Use a HashMap?**

- When  **fast lookups (O(1))**  are required.
- When  **frequent insertions and deletions**  are needed.
- When implementing  **caches, frequency counters, and indexing** .
- When storing  **mappings between two datasets** , e.g., usernames to user IDs.

### **Time & Space Complexities**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/0ac34e73-5062-45cd-80de-c03f5ba7edea_1728x760.png)](https://substackcdn.com/image/fetch/$s_!5pDr!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0ac34e73-5062-45cd-80de-c03f5ba7edea_1728x760.png)

Subscribe to receive new articles every week.

# 5. Stack

A  **stack**  is a linear data structure that follows the  **Last In, First Out (LIFO)**  principle. This means the  **last element added is the first one to be removed** —like a stack of plates in a cafeteria.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/4d76fe70-caf6-4290-aaa5-5dfdb060ab65_932x666.png)](https://substackcdn.com/image/fetch/$s_!u9Zi!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4d76fe70-caf6-4290-aaa5-5dfdb060ab65_932x666.png)

### Example:

```
Push(10) → [10]
Push(20) → [10, 20]
Push(30) → [10, 20, 30]
Pop()    → [10, 20]  (30 is removed)
Peek()   → 20  (Top element)
```

Stacks support  **push, pop, and peek**  operations.

### **How is a Stack Represented?**

Stacks can be implemented using:

1. **Arrays**  (Fixed size, faster access)
2. **Linked Lists**  (Dynamic size, extra memory overhead)

### **When to Use a Stack?**

- When  **Last-In-First-Out (LIFO)**  order is required.
- When handling  **recursive function calls** .
- For  **undo/redo functionality**  in text editors.
- When  **parsing expressions**  (e.g., checking balanced parentheses).

### **Time & Space Complexities**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/efd5acdd-55ba-4e60-9c10-9e3a466e258f_1856x912.png)](https://substackcdn.com/image/fetch/$s_!toQZ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fefd5acdd-55ba-4e60-9c10-9e3a466e258f_1856x912.png)

Array-based stacks have  **fixed size**  but are faster. Linked list-based stacks are  **dynamically resizable**  but use extra memory for pointers.

# 6. Queue

A  **queue**  is a linear data structure that follows the  **First In, First Out (FIFO)**  principle. The element added  **first**  is removed  **first** , just like a real-world queue at a ticket counter.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/97a1f506-9116-4c43-af57-2b8a80181310_1252x372.png)](https://substackcdn.com/image/fetch/$s_!hTQJ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F97a1f506-9116-4c43-af57-2b8a80181310_1252x372.png)

### Example:

```
Enqueue(5) → [5]
Enqueue(2) → [5, 2]
Enqueue(9) → [5, 2, 9]
Enqueue(4) → [5, 2, 9, 4]
Dequeue()  → [2, 9, 4]  (5 is removed)
Front()    → 2  (Next to be removed)
```

Queues support  **enqueue (insert), dequeue (remove), front (peek), and isEmpty**  operations.

### **How is a Queue Represented?**

Queues can be implemented using:

1. **Arrays**  (Fixed size, efficient indexing)
2. **Linked Lists**  (Dynamic size, memory overhead)

### **When to Use a Queue?**

- When  **FIFO (First-In-First-Out) ordering**  is required.
- When processing tasks in  **order**  (e.g., scheduling, messaging).
- When implementing  **BFS (Breadth-First Search)**  in graphs.
- When handling  **real-time requests** , like task scheduling in OS.

### **Time & Space Complexities**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/e89c6084-f92f-473e-b3e1-15e0b79e207f_1856x912.png)](https://substackcdn.com/image/fetch/$s_!pl1k!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe89c6084-f92f-473e-b3e1-15e0b79e207f_1856x912.png)

# 7. Tree

A  **tree**  is a  **hierarchical data structure**  that consists of  **nodes**  connected by  **edges** . Unlike arrays, linked lists, stacks, or queues (which are linear structures), trees are  **non-linear**  and provide  **fast search, insert, and delete operations**  in structured data.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/d6874510-16dd-4568-94eb-8374f842ffab_1364x690.png)](https://substackcdn.com/image/fetch/$s_!cUCR!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd6874510-16dd-4568-94eb-8374f842ffab_1364x690.png)

Each tree consists of:

- **Root**  – The topmost node.
- **Parent & Child Nodes**  – A node that has child nodes is called a parent.
- **Leaf Nodes**  – Nodes with no children.
- **Height**  – The longest path from the root to a leaf.

The most popular type of tree is binary tree where each node has  **at most two children** .

### **How is a Tree Represented?**

Trees are implemented using  **nodes and references** :

```
class TreeNode {
    int data;
    TreeNode left, right;

    public TreeNode(int data) {
        this.data = data;
        this.left = this.right = null;
    }
}
```

### **Tree Traversals**

- Inorder: Left → Root → Right
- Preorder: Root → Left → Right
- Postorder: Left → Right → Root
- Level Order: Level by level

# 8. Binary Search Tree (BST)

A  **BST**  is a special type of  **binary tree**  where each node follows the  **BST property** :

- The  **left subtree**  contains values  **smaller**  than the root.
- The  **right subtree**  contains values  **greater**  than the root.
- **No duplicate values**  are allowed.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/5baf22a4-ffa2-45cd-864b-3c2f651211cf_1156x690.png)](https://substackcdn.com/image/fetch/$s_!6mxV!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5baf22a4-ffa2-45cd-864b-3c2f651211cf_1156x690.png)

BSTs when balanced, provide  **efficient searching, insertion, and deletion (O(log n) on average)** , making them ideal for  **sorted data retrieval** .

### **When to Use a BST?**

- When you need  **fast search, insert, and delete operations (O(log n) average case)** .
- When you require  **sorted data retrieval (Inorder Traversal gives sorted order)** .
- When implementing  **symbol tables, dictionaries, and range queries** .
- When handling  **dynamic data that needs frequent insertions/deletions** .

### **Time & Space Complexities**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/8d9e4a0a-673e-4298-9884-92462fb35d9e_1408x832.png)](https://substackcdn.com/image/fetch/$s_!bU80!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8d9e4a0a-673e-4298-9884-92462fb35d9e_1408x832.png)

If the BST  **degenerates into a linked list** , operations become  **O(n)** .

Self-Balancing Trees (like AVL, Red-Black) keep operations at O(log n).

# 9.  **Heaps**

A  **heap**  is a  **complete binary tree**  that satisfies the  **heap property** :

- In a  **Min-Heap** , the  **parent node**  is always  **smaller**  than its children.
- In a  **Max-Heap** , the  **parent node**  is always  **greater**  than its children.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/c56835f4-eb9c-4311-b68e-fe0b381be30e_2420x1032.png)](https://substackcdn.com/image/fetch/$s_!O2f2!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc56835f4-eb9c-4311-b68e-fe0b381be30e_2420x1032.png)

Unlike binary search trees ( **BSTs** ), heaps are optimized for  **fast retrieval of the minimum or maximum element** .

### How is a Heap Represented?

A heap is stored using a  **binary tree** , but it's typically  **implemented using an array**  (to save space and make operations efficient).

For an element at index i:

- **Left Child**  → 2 * i + 1
- **Right Child**  → 2 * i + 2
- **Parent**  → (i - 1) / 2

### When to Use a Heap?

- When you need  **fast access to the smallest or largest element (O(1))** .
- When implementing  **priority queues** .
- When scheduling tasks based on priority ( **CPU scheduling, Dijkstra’s algorithm** ).
- When solving problems like  **Top K Elements, Median Finding, Heap Sort** .

### **Time & Space Complexities**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/e39d5061-1685-4e59-a0bb-a4535018490a_1136x1064.png)](https://substackcdn.com/image/fetch/$s_!zhZ2!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe39d5061-1685-4e59-a0bb-a4535018490a_1136x1064.png)

# **10. Trie**

A  **Trie**  (also called a  **Prefix Tree** ) is a specialized tree structure used to store and search words efficiently. Unlike a binary tree, where each node contains a value, a Trie node represents a  **single character** , and words are formed by linking nodes together.

### Example:

Consider inserting the words:  **"ace", "ant", "cat", "pen" and "pet"**  into a Trie:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/4f757e42-277d-474c-828a-1b2ac2aded83_1472x1022.png)](https://substackcdn.com/image/fetch/$s_!4MUx!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4f757e42-277d-474c-828a-1b2ac2aded83_1472x1022.png)

The main advantage of a Trie is  **fast prefix-based searching** , making it ideal for applications like  **autocomplete, spell checkers, and IP routing** .

### **How is a Trie Represented?**

Each  **node**  contains:

- **A HashMap/Array of child nodes**  (storing characters).
- **A boolean flag (** isEndOfWord **)**  indicating the end of a word.

```
class TrieNode {
    TrieNode[] children = new TrieNode[26]; // Supports 'a' to 'z'
    boolean isEndOfWord;
}
```

### **When to Use a Trie?**

- When  **fast prefix-based searching**  is needed ( **O(m)** , where m is word length).
- When implementing  **autocomplete suggestions** .
- When handling  **dictionary-related problems**  (spell checkers, word games).
- When  **searching for words in large datasets**  efficiently.

### **Time & Space Complexities**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/deb68a0b-78bd-4be0-a897-1381fe7d7609_1344x984.png)](https://substackcdn.com/image/fetch/$s_!7JC_!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fdeb68a0b-78bd-4be0-a897-1381fe7d7609_1344x984.png)

# **11. Graph**

A  **graph**  is a  **non-linear data structure**  consisting of  **nodes (vertices)**  and  **edges**  that connect them.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/73c370ed-8210-4576-bce8-bf3d6b353e1b_1138x624.png)](https://substackcdn.com/image/fetch/$s_!qugC!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F73c370ed-8210-4576-bce8-bf3d6b353e1b_1138x624.png)

Graphs are used to model  **real-world relationships**  such as  **social networks, road maps, and the internet** .

### Types of Graphs

- **Directed Graph (Digraph)**  – Edges have direction.
- **Undirected Graph**  – Edges are bidirectional.
- **Weighted Graph**  – Edges have weights.
- **Unweighted Graph**  – All edges are equal.
- **DAG (Directed Acyclic Graph)**  - Edges have direction but there is no cycle.

### Graph Representation in Code

Graphs are implemented using:

#### **1. Adjacency Matrix**  –  **2D array**

Each cell graph[i][j] = 1 means an edge exists between i and j.

```
class GraphMatrix {
    private int[][] adjMatrix;
    private int size;

    public GraphMatrix(int size) {
        this.size = size;
        adjMatrix = new int[size][size];
    }

    public void addEdge(int u, int v) {
        adjMatrix[u][v] = 1;
        adjMatrix[v][u] = 1; // For undirected graphs
    }

    public boolean isConnected(int u, int v) {
        return adjMatrix[u][v] == 1;
    }
}
```

Fast lookup O(1), but space inefficient O(V²).

#### **2. Adjacency List**  –  **Array of lists**

Each node stores a  **list of neighbors** .

```
class GraphList {
    private Map> adjList;

    public GraphList() {
        adjList = new HashMap<>();
    }

    public void addEdge(int u, int v) {
        adjList.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
        adjList.computeIfAbsent(v, k -> new ArrayList<>()).add(u); // Undirected graph
    }

    public List getNeighbors(int node) {
        return adjList.getOrDefault(node, new ArrayList<>());
    }
}
```

Efficient O(V + E) space, but slower O(V) lookup.

# **12. Union Find**

**Union-Find** , also called  **Disjoint Set Union (DSU)** , is a data structure used to efficiently  **track and merge disjoint sets** . It supports two main operations:

1. **Find(x)**  → Determines the  **root representative**  (or parent) of a set containing x.
2. **Union(x, y)**  → Merges the sets containing x and y.

### Example:

Consider initially disjoint sets {1}, {2}, {3}, {4}, {5}, {6}

[![image](https://substack-post-media.s3.amazonaws.com/public/images/4d0777b8-4319-4f8c-8530-ce6816d62e59_826x496.png)](https://substackcdn.com/image/fetch/$s_!axsC!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4d0777b8-4319-4f8c-8530-ce6816d62e59_826x496.png)

Performing union(1, 3), union(2, 4) and union(2, 5) gives:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/cd4aad4e-0545-4205-b14b-ae56ddc1f16d_1148x496.png)](https://substackcdn.com/image/fetch/$s_!iXG6!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fcd4aad4e-0545-4205-b14b-ae56ddc1f16d_1148x496.png)

- find(1) returns  **1** .
- find(4) returns  **2**  (as 4 is merged with 2).

### **How is Union-Find Represented?**

Union-Find is implemented using:

1. **An array (** parent[] **)**  where parent[i] points to the parent of node i.
2. **Path Compression**  to speed up find(x).
3. **Union by Rank**  to keep trees balanced.

```
class UnionFind {
    private int[] parent, rank;

    public UnionFind(int size) {
        parent = new int[size];
        rank = new int[size];
        for (int i = 0; i < size; i++) {
            parent[i] = i;  // Initially, each node is its own parent
            rank[i] = 1;    // Initial rank is 1
        }
    }

    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // Path compression
        }
        return parent[x];
    }

    public void union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX == rootY) return;

        // Union by rank
        if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
    }

    public boolean connected(int x, int y) {
        return find(x) == find(y);
    }
}
```

### **When to Use Union-Find?**

- When checking  **connected components**  in a graph.
- When detecting  **cycles in an undirected graph** .
- When performing  **dynamic connectivity queries** .
- When implementing  **Kruskal’s Minimum Spanning Tree (MST) Algorithm** .

### **Time & Space Complexities**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/1a34ca8d-59d7-49d5-91f4-9b077965ce54_1632x832.png)](https://substackcdn.com/image/fetch/$s_!HK9P!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1a34ca8d-59d7-49d5-91f4-9b077965ce54_1632x832.png)

α(n) is the  **inverse Ackermann function**  (nearly constant time).


Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
