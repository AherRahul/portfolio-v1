---
title: Top K Frequent Words
description: Master Top K Frequent Words in the Sorting module. Comprehensive
  guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

# Problem Description

Question

Given an array of strings `words` and an integer `k`, return _the_ `k` _most frequent strings_\.

Return the answer **sorted** by **the frequency** from highest to lowest\. Sort the words with the same frequency by their **lexicographical order**\.

##### **Example 1:**

**Input:** words = \["i","love","leetcode","i","love","coding"\], k = 2

**Output:** \["i","love"\]

**Explanation:** "i" and "love" are the two most frequent words\.

Note that "i" comes before "love" due to a lower alphabetical order\.

#### **Example 2:**

**Input:** words = \["the","day","is","sunny","the","the","the","sunny","is","is"\], k = 4

**Output:** \["the","is","sunny","day"\]

**Explanation:** "the", "is", "sunny" and "day" are the four most frequent words, with the number of occurrence being 4, 3, 2 and 1 respectively\.

##### **Constraints:**

*   `1 <= words.length <= 500`
*   `1 <= words[i].length <= 10`
*   `words[i]` consists of lowercase English letters\.
*   `k` is in the range `[1, The number of` `**unique**` `words[i]]`

**Follow\-up:** Could you solve it in `O(n log(k))` time and `O(n)` extra space?

#### [Solve it on LeetCode](https://leetcode.com/problems/top-k-frequent-words)

# Approaches

## 1\. Frequency Map with Sorting

#### Intuition:

The main idea is to count the frequency of each word and then sort them by frequency\. Since we need the top k frequent words, we can sort the entries and select the first k elements\. As words with identical frequencies should be in alphabetical order, we ensure that in our sort function\.

#### Steps:

1.  Use a hashmap to count the frequency of each word\.
2.  Convert the hashmap into a list of entries \(word and frequency pairs\)\.
3.  Sort the list with a custom comparator:

*   First, by decreasing frequency\.
*   Second, lexicographically in case of a tie in frequency\.

5.  Extract the first k elements from the sorted list\.

#### Code:

Java

```java
class Solution {
   public List<String> topKFrequent(String[] words, int k) {
       // Step 1: Frequency mapping
       Map<String, Integer> count = new HashMap<>();
       for (String word : words) {
           count.put(word, count.getOrDefault(word, 0) + 1);
       }
       
       // Step 2 and 3: Convert hashmap to list and sort
       List<String> candidates = new ArrayList<>(count.keySet());
       Collections.sort(candidates, (w1, w2) -> {
           // First sort by frequency (decreasing order)
           if (count.get(w1).equals(count.get(w2))) {
               // Then sort lexicographically in case of tie
               return w1.compareTo(w2);
           } else {
               return count.get(w2) - count.get(w1);
           }
       });
       
       // Step 4: Extract the top k elements
       return candidates.subList(0, k);
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N log N\), where N is the number of unique words\. Sorting the list of words dictates the complexity\.
*   **Space Complexity:** O\(N\), where N is the number of unique words \(storing in hashmap and list\)\.

## 2\. Min\-Heap

#### Intuition:

A min\-heap can efficiently help maintain the k most frequent elements, especially when we need to sort by frequency primarily\. The idea is to always maintain k elements in the heap and eject elements when the heap grows beyond k, ensuring that the heap contains the most frequent words\.

#### Steps:

1.  Count the frequency of each word using a hashmap\.
2.  Use a PriorityQueue \(min\-heap\) to maintain the k highest frequency words\.

*   When adding new elements to the heap of size more than k, remove the smallest frequency word\.
*   Use a custom comparator to sort by frequency and lexicographical order for words with the same frequency\.

4.  Extract elements from the heap to form the result list\.

#### Code:

Java

```java
class Solution {
   public List<String> topKFrequent(String[] words, int k) {
       // Step 1: Frequency mapping
       Map<String, Integer> count = new HashMap<>();
       for (String word : words) {
           count.put(word, count.getOrDefault(word, 0) + 1);
       }
       
       // Step 2: Min-Heap to store top k frequent words
       PriorityQueue<String> heap = new PriorityQueue<>(
           (w1, w2) -> count.get(w1).equals(count.get(w2)) 
                       ? w2.compareTo(w1) 
                       : count.get(w1) - count.get(w2));
       
       for (String word : count.keySet()) {
           heap.offer(word);
           if (heap.size() > k) {
               heap.poll(); // Remove the word with the smallest frequency
           }
       }
       
       // Step 3: Form result list from the heap
       List<String> result = new ArrayList<>();
       while (!heap.isEmpty()) {
           result.add(heap.poll());
       }
       Collections.reverse(result); // Since we want the largest frequencies first
       return result;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N log k\), as we perform heap operations \(insertions/deletions\) proportional to the number of unique words, where each operation takes O\(log k\)\.
*   **Space Complexity:** O\(N\), for storing the hashmap and the heap potentially containing all unique words\.