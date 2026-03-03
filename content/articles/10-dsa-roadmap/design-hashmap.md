---
title: Design HashMap
description: Master Design HashMap in the Hash Tables module. Comprehensive
  guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Design a HashMap without using any built\-in hash table libraries\.

Implement the `MyHashMap` class:

*   `MyHashMap()` initializes the object with an empty map\.
*   `void put(int key, int value)` inserts a `(key, value)` pair into the HashMap\. If the `key` already exists in the map, update the corresponding `value`\.
*   `int get(int key)` returns the `value` to which the specified `key` is mapped, or `-1` if this map contains no mapping for the `key`\.
*   `void remove(key)` removes the `key` and its corresponding `value` if the map contains the mapping for the `key`\. 

##### **Example 1:**

**Input:**

\["MyHashMap", "put", "put", "get", "get", "put", "get", "remove", "get"\]\[\[\], \[1, 1\], \[2, 2\], \[1\], \[3\], \[2, 1\], \[2\], \[2\], \[2\]\]

**Output**

\[null, null, null, 1, \-1, null, 1, null, \-1\]

**Explanation:**

```java
MyHashMap myHashMap = new MyHashMap();
myHashMap.put(1, 1); // The map is now [[1,1]]
myHashMap.put(2, 2); // The map is now [[1,1], [2,2]]
myHashMap.get(1);    // return 1, The map is now [[1,1], [2,2]]
myHashMap.get(3);    // return -1 (i.e., not found), The map is now [[1,1], [2,2]]
myHashMap.put(2, 1); // The map is now [[1,1], [2,1]] (i.e., update the existing value)
myHashMap.get(2);    // return 1, The map is now [[1,1], [2,1]]
myHashMap.remove(2); // remove the mapping for 2, The map is now [[1,1]]
myHashMap.get(2);    // return -1 (i.e., not found), The map is now [[1,1]]
```

##### **Constraints:**

*   **0 <= key, value <= 10****6**
*   At most **10****4** calls will be made to `put`, `get`, and `remove`\.


## Approaches

### 1\. Array of List Nodes

#### Intuition:

The simplest way to implement a hashmap is to use an array where each index holds a linked list of key\-value pairs\. This method handles collisions by chaining entries together in the form of a linked list\. When adding a new entry, we first compute its hash code which gives us the index to put the key\-value pair into, and we toggle through the linked list to either update the value or insert a new node\.

#### Code:

```java
class MyHashMap {
   private class Node {
       int key, value;
       Node next;
       
       Node(int key, int value) {
           this.key = key;
           this.value = value;
       }
   }
   
   private final int SIZE = 10000;
   private Node[] nodes;

   public MyHashMap() {
       nodes = new Node[SIZE];
   }
   
   private int getIndex(int key) {
       return Integer.hashCode(key) % SIZE;
   }
   
   private Node find(Node head, int key) {
       Node prev = null;
       while (head != null && head.key != key) {
           prev = head;
           head = head.next;
       }
       return prev;
   }
   
   public void put(int key, int value) {
       int index = getIndex(key);
       if (nodes[index] == null) {
           nodes[index] = new Node(-1, -1);
       }
       Node prev = find(nodes[index], key);
       if (prev.next == null) {
           prev.next = new Node(key, value);
       } else {
           prev.next.value = value;
       }
   }
   
   public int get(int key) {
       int index = getIndex(key);
       if (nodes[index] == null) return -1;
       Node prev = find(nodes[index], key);
       if (prev.next == null) return -1;
       return prev.next.value;
   }
   
   public void remove(int key) {
       int index = getIndex(key);
       if (nodes[index] == null) return;
       Node prev = find(nodes[index], key);
       if (prev.next == null) return;
       prev.next = prev.next.next;
   }
}
```

*   **Time Complexity:** `O(N/B)`, where `N` is the number of all possible keys and `B` is the number of buckets\.
*   **Space Complexity:** `O(M + N)`, where `M` is the given element size and `N` is the bucket size which is 10000 here\.

### 2\. Double Hashing

#### Intuition:

By using a secondary hashing technique, we can better address the issue of collision\. This involves using an open addressing scheme where slots are utilized in alternative locations if collisions occur\. Double hashing uses two hash functions to compute bucket locations\.

#### Code:

```java
class MyHashMap {
   private int[] map;
   private boolean[] present;
   private static final int DEFAULT_SIZE = 1000001;

   public MyHashMap() {
       map = new int[DEFAULT_SIZE];
       present = new boolean[DEFAULT_SIZE];
   }

   public void put(int key, int value) {
       map[key] = value;
       present[key] = true;
   }

   public int get(int key) {
       return present[key] ? map[key] : -1;
   }

   public void remove(int key) {
       present[key] = false;
   }
}
```

*   **Time Complexity:** `O(1)` for put, get, and delete operations\.
*   **Space Complexity:** `O(U)` where U is the universe of keys\. In this approach, space can be large if the range of key values is vast\.

### 3\. Binary Search Tree in Buckets

#### Intuition:

Instead of using linked lists for collisions, we can use a Binary Search Tree \(BST\)\. This gives faster operations in a scenario with worst\-case time complexity, and makes the performance more stable by reducing the potential of long chains experienced with a basic linked list structure\. This approach provides `O(log N)` operations where `N` is the number of keys stored in the bucket\.

#### Code:

```java
class MyHashMap {
   private final int SIZE = 1000;
   private TreeMap<Integer, Integer>[] map;

   public MyHashMap() {
       map = new TreeMap[SIZE];
   }

   private int getIndex(int key) {
       return Integer.hashCode(key) % SIZE;
   }

   public void put(int key, int value) {
       int index = getIndex(key);
       if (map[index] == null) {
           map[index] = new TreeMap<>();
       }
       map[index].put(key, value);
   }

   public int get(int key) {
       int index = getIndex(key);
       return map[index] != null ? map[index].getOrDefault(key, -1) : -1;
   }

   public void remove(int key) {
       int index = getIndex(key);
       if (map[index] != null) {
           map[index].remove(key);
       }
   }
}
```

*   **Time Complexity:** `O(log N)` where `N` is the number of elements in a bucket\.
*   **Space Complexity:** `O(N)` where `N` is the total number of elements\.

#### [Solve it on LeetCode](https://leetcode.com/problems/design-hashmap/)
