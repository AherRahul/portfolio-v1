---
title: Introduction
description: Master Introduction in the Hash Tables module. Comprehensive guide
  and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

Hash tables are one of the most powerful and widely used data structures in computer science\.

A hash table lets you store and retrieve data in **constant average time — O\(1\)\.** That’s incredibly fast compared to arrays or linked lists, where searching might take linear time\.

Hash tables are everywhere in the real world\.

*   **Databases** use them for indexing\.
*   **Compilers** use them for managing symbol tables\.
*   They power **caches**, **dictionaries**, and even built in data\-structures like Python’s `dict` and Java’s `HashMap`\.

In this chapter, I’ll cover:

*   What a hash table is
*   How it works under the hood
*   The core operations and their complexities

# What is a Hash Table?

So, what exactly is a **hash table**?

A hash table is a data structure that stores information as **key–value pairs**\.

a

:

1

b

:

2

c

:

3

Here’s how it works:

*   You provide a **key**, like a username, an ID, or even an email\.
*   That key is passed into something called a **hash function** which converts it into a number\.
*   That number represents the **index** in an internal array where your data will be stored\.
*   When you want to look it up later, the same hash function tells you **exactly where to find it** instantly\.

So instead of searching through an entire list to find what you need, you can jump **straight to it**\.

That’s what makes hash tables so fast: **insertions, lookups, and deletions** all happen in **O\(1\)** time on average\.

A hash table gives you **direct access through hashing**, instead of scanning through every entry one by one\.

# How Does It Work?

Now that you know _what_ a hash table is, let’s see **how it actually works under the hood**\.

**1\. Hash Function**

Everything starts with a **hash function**\.

It takes your key which could be a string like `"apple"` or a number and converts it into an **integer index**\.

That index decides **where** the value will be stored inside an internal array\.

For example:

*   Key → `"apple"`
*   Hash function → `5`
*   Store `"apple"`’s value at index `5` in the array\.

A good hash function is **fast** and spreads keys **evenly** across the array\.

### **2\. Collision Handling**

But what happens if two keys map to the **same index**? This is called a **collision\.**

And no matter how good your hash function is, collisions are **unavoidable**\.

So we need a strategy to handle them\.

There are two main approaches:

*   **Chaining:**

*   Instead of storing a single value at each index, we store a **list or bucket** of values\.
*   If `"apple"` and `"orange"` both hash to index 5, they’re stored in a small linked list or collection at that spot\.

*   **Open Addressing:**

*   Instead of chaining, you find the **next available slot** in the array using a probing strategy\.
*   For example, if index 5 is taken, try 6, then 7, and so on until you find an empty slot\.

A key concept that determines how likely collisions are is called the **Load Factor**\.

**It** measures how full a hash table is\.

*   It’s calculated as: load factor = number of elements / size of table
*   As the load factor increases, the table gets more crowded and collisions become more frequent\.
*   To fix this, we typically resize the hash table usually doubling the size of the array and rehashing all the existing keys into new positions\.

This resizing keeps the hash table efficient, ensuring that operations like insertion, deletion, and lookup remain close to O\(1\) on average\.

# Hash Table Operations

Now let’s look at the **core operations** that make hash tables so powerful and how fast each one really is\.

### **1\. Insert \(Put a Key\-Value Pair\)**

When you insert something, the **key** goes through the hash function to find its **index**\. The **value** is then stored at that index in the internal array\.

If another key already maps to that same index \(that’s a collision\) the hash table uses its collision\-handling strategy, like chaining or open addressing, to resolve it as we discussed earlier\.

Time Complexity for insert is O\(1\) on average but it can go upto O\(n\) in the worst case if multiple keys map to the same spot\.

### **2\. Search \(Lookup by Key\)**

To search for a value, you hash the key and jump directly to the index where it should be\.

If the key exists, you return its value immediately\. If there’s a collision chain, you simply walk through that list until you find the match\.

**Time Complexity for search is** O\(1\) on average, but O\(n\) in the worst case if all keys collide\.

### **3\. Delete \(Remove a Key\-Value Pair\)**

Deleting works in a similar way: first hash the key to locate its index, then remove the entry\.

*   In **chaining**, you simply remove the key from the linked list or bucket\.
*   In **open addressing**, you mark the slot as deleted so future lookups still function correctly\.

**Time Complexity for delete is** O\(1\) on average and O\(n\) in worst case\.

### **4\. Update**

Updating is really just **insertion with an existing key**\. If the key already exists, you simply overwrite the old value with the new one\.

Choosing a good hash function is the key in deciding how efficient your hash table actually is\.