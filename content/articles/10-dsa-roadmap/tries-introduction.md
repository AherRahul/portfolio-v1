---
title: Introduction
description: Master Introduction in the Tries module. Comprehensive guide and
  algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

Tries, also known as **Prefix Trees**, are a special type of tree data structure designed to store and search strings efficiently by reusing shared prefixes\.

You’ve probably interacted with them countless times without even realizing it\. For example: when a search engine suggests queries as you type, or when a spell checker finds the closest word to a typo — that’s usually powered by a trie behind the scenes\.

And tries are also an **important topic in coding interviews,** especially when the problem involves **prefix\-based search** or efficient string lookups\.

In this chapter, I’ll cover:

*   What a Trie is and how it works
*   The structure of a TrieNode
*   Common trie operations and their time complexities

# What is a Trie?

A **trie** is a tree\-based data structure designed for storing strings in a way that makes prefix\-based search extremely efficient\.

Instead of storing whole words as standalone entries, a trie breaks them down character by character and **reuses common prefixes**\.

Let’s walk through an example to see how it works\.

We start with the word **“design”**\. In a trie, we store it as a sequence of connected nodes, where each node represents a single character\.

rootdesign

Here, following the path from the root to `'n'` gives us the word **“design”**\.

Now let’s add another word: **“desktop”**\.

rootdesikgtnop

Notice that **“design”** and **“desktop”** both start with `"des"`\.

Instead of creating a completely new branch, we **reuse** the prefix `"des"`\.

Next, let’s insert the word **“destination”**\.

It also starts with `"des"`, so we share that prefix again and branch after it:

rootdesiktgtinonpation

To summarize:

*   Each node represents a **character** of the string\.
*   A path from the root to a leaf \(or marked node\) represents a **word**\.
*   Multiple words that share the same prefix will reuse the same starting path in the trie\.

Now, lets look at how a trie is represented in code\.

# The structure of a TrieNode

To represent a trie in code, we first need to define the building block of the trie — the **TrieNode**\.

Java

```java
class TrieNode {
   TrieNode[] children;
   boolean isWord;
   
   public TrieNode() {
       // Array of 26 for lowercase English letters
       children = new TrieNode[26];
       isWord = false;
   }
}
```

Each node in a trie keeps track of two important things:

1.  **Children**

*   Each node can branch out to multiple children, one for every possible character that comes next\.
*   In code, this is often represented using a **hash map** where the key is the character and the value is the child node\.
*   But if the character set is fixed and small like 26 lowercase English letters — we can use an **array of size 26** instead\. This makes lookups faster because each index directly maps to a letter\.

3.  **End of Word Marker**

*   Not every node represents a complete word\. Some are just prfixex\.
*   To distinguish between a prefix and an actual word, we mark the nodes where a word ends\.
*   In code, this is usually done with a simple **boolean flag like** `**isWord**`\.

So, going back to our earlier example with the words **“design”**, **“desktop”**, and **“destination”**:

*   The characters `d → e → s` are shared among all three words\.
*   After `"des"`, the trie branches into different paths depending on whether we’re building `"design"`, `"desktop"`, or `"destination"`\.
*   At the end of each word’s path, the final node’s `isWord` flag is set to `true`\.

All major trie operations like **insert**, **search**, and **prefix search** — only requires us to go through the characters of the word once\. So the time complexity is: O\(k\) where k is the length of the word\.

This is what makes tries so efficient for prefix\-heavy problems\.