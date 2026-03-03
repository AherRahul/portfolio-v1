---
title: Word Ladder
description: Master Word Ladder in the Graphs module. Comprehensive guide and
  algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

A **transformation sequence** from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words **beginWord \-> s****1** **\-> s****2** **\-> \.\.\. \-> s****k** such that:

*   Every adjacent pair of words differs by a single letter\.
*   Every **s****i** for `1 <= i <= k` is in `wordList`\. Note that `beginWord` does not need to be in `wordList`\.
*   **s****k** **== endWord**

Given two words, `beginWord` and `endWord`, and a dictionary `wordList`, return _the_ _**number of words**_ _in the_ _**shortest transformation sequence**_ _from_ `beginWord` _to_ `endWord`_, or_ `0` _if no such sequence exists\._

##### **Example 1:**

**Input:** beginWord = "hit", endWord = "cog", wordList = \["hot","dot","dog","lot","log","cog"\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">hot</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">dot</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">dog</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">lot</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">log</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">cog</span></div>
  </div>
</div>

**Output:** 5

**Explanation:** One shortest transformation sequence is "hit" \-> "hot" \-> "dot" \-> "dog" \-> cog", which is 5 words long\.

##### **Example 2:**

**Input:** beginWord = "hit", endWord = "cog", wordList = \["hot","dot","dog","lot","log"\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">hot</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">dot</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">dog</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">lot</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">log</span></div>
  </div>
</div>

**Output:** 0

**Explanation:** The endWord "cog" is not in wordList, therefore there is no valid transformation sequence\.

##### **Constraints:**

*   `1 <= beginWord.length <= 10`
*   `endWord.length == beginWord.length`
*   `1 <= wordList.length <= 5000`
*   `wordList[i].length == beginWord.length`
*   `beginWord`, `endWord`, and `wordList[i]` consist of lowercase English letters\.
*   `beginWord != endWord`
*   All the words in `wordList` are **unique**\.


## Approaches

### 1\. Breadth\-First Search \(BFS\)

#### Intuition:

The Word Ladder problem can be thought of as a graph traversal problem where each word in the word list is a node and there is an edge between two nodes if they differ by exactly one character\. The problem is then to find the shortest path from the `beginWord` to the `endWord`\.

Breadth\-First Search \(BFS\) is a perfect fit for this type of problem because it explores all nodes at the present "depth" level before moving on to nodes at the next depth level, thereby ensuring that we find the shortest path\.

#### Code:

```java
class Solution {
   public int ladderLength(String beginWord, String endWord, List<String> wordList) {
       Set<String> wordSet = new HashSet<>(wordList); // Convert wordList to a set for O(1) access
       if (!wordSet.contains(endWord)) { // if endWord is not in the dictionary
           return 0;
       }

       Queue<String> queue = new LinkedList<>();
       queue.offer(beginWord);
       int level = 1; // Represents number of transformations

       while (!queue.isEmpty()) {
           int size = queue.size();
           
           // Process all nodes at the current depth level
           for (int i = 0; i < size; i++) {
               String currentWord = queue.poll();
               
               // Try changing each letter of the current word to find all possible transformations
               char[] wordArray = currentWord.toCharArray();
               for (int j = 0; j < wordArray.length; j++) {
                   char originalChar = wordArray[j];
                   for (char c = 'a'; c <= 'z'; c++) {
                       if (wordArray[j] == c) continue; // skip if the character is the same
                       wordArray[j] = c;
                       String newWord = new String(wordArray);

                       if (newWord.equals(endWord)) {
                           return level + 1; // Shortest path found
                       }

                       if (wordSet.contains(newWord)) {
                           queue.offer(newWord);
                           wordSet.remove(newWord); // Remove to prevent re-visiting
                       }
                   }
                   wordArray[j] = originalChar; // Restore original letter for next iteration
               }
           }
           level++; // Increment depth level
       }
       
       return 0; // If endWord is not reachable from beginWord
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N \* M \* 26\) where N is the number of words in the word list and M is the length of each word\. For every word, in the worst case, we change each character \(M\) to every other character in the alphabet \(26 possibilities\)\.
*   **Space Complexity:** O\(N \* M\) for the wordSet and queue data structures\.

### 2\. Bidirectional BFS

#### Intuition:

Bidirectional BFS is an optimization of the traditional BFS technique\. Instead of searching from one end to the other, we simultaneously search from both the `beginWord` and the `endWord` towards each other\. The search halts when the two searches meet\. This significantly reduces the search space and can greatly increase efficiency, especially as the length of transformation increases\.

#### Code:

```java
class Solution {
   public int ladderLength(String beginWord, String endWord, List<String> wordList) {
       Set<String> wordSet = new HashSet<>(wordList);
       if (!wordSet.contains(endWord)) {
           return 0;
       }

       Set<String> beginSet = new HashSet<>(); // Set for one direction
       Set<String> endSet = new HashSet<>(); // Set for the reverse direction
       beginSet.add(beginWord);
       endSet.add(endWord);

       int level = 1;

       while (!beginSet.isEmpty() && !endSet.isEmpty()) {
           // Always iterate from the smaller set to optimize the search
           if (beginSet.size() > endSet.size()) {
               Set<String> temp = beginSet;
               beginSet = endSet;
               endSet = temp;
           }

           Set<String> nextSet = new HashSet<>();
           for (String word : beginSet) {
               char[] wordArray = word.toCharArray();
               
               for (int i = 0; i < wordArray.length; i++) {
                   char originalChar = wordArray[i];
                   for (char c = 'a'; c <= 'z'; c++) {
                       if (c == originalChar) continue;
                       wordArray[i] = c;
                       String newWord = new String(wordArray);

                       if (endSet.contains(newWord)) { // Bidirectional intersection
                           return level + 1;
                       }

                       if (wordSet.contains(newWord)) {
                           nextSet.add(newWord);
                           wordSet.remove(newWord);
                       }
                   }
                   wordArray[i] = originalChar;
               }
           }

           beginSet = nextSet; // Move to the next layer
           level++;
       }
       
       return 0;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N \* M \* 26\) similar to BFS\. However, in practice, the performance can be significantly better since we are working on possibly halved problem size\.
*   **Space Complexity:** O\(N \* M\) for the word sets and additional data structures\. However, it tends to require less space on average compared to the unidirectional BFS\.

#### [Solve it on LeetCode](https://leetcode.com/problems/word-ladder)
