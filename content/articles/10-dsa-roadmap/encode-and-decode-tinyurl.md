---
title: Encode and Decode TinyURL
description: Master Encode and Decode TinyURL in the Hash Tables module.
  Comprehensive guide and algorithmic problem solving.
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

TinyURL is a URL shortening service where you enter a URL such as  and it returns a short URL such as \. Design a class to encode a URL and decode a tiny URL\.

There is no restriction on how your encode/decode algorithm should work\. You just need to ensure that a URL can be encoded to a tiny URL and the tiny URL can be decoded to the original URL\.

Implement the `Solution` class:

*   `Solution()` Initializes the object of the system\.
*   `String encode(String longUrl)` Returns a tiny URL for the given `longUrl`\.
*   `String decode(String shortUrl)` Returns the original long URL for the given `shortUrl`\. It is guaranteed that the given `shortUrl` was encoded by the same object\. 

##### **Example 1:**

**Input:** url = "https://leetcode\.com/problems/design\-tinyurl"

**Output:** "https://leetcode\.com/problems/design\-tinyurl"**Explanation:**

Solution obj = new Solution\(\);

string tiny = obj\.encode\(url\); // returns the encoded tiny url\.

string ans = obj\.decode\(tiny\); // returns the original url after decoding it\.

##### **Constraints:**

*   **1 <= url\.length <= 10****4**
*   `url` is guranteed to be a valid URL\.

#### [Solve it on LeetCode](https://leetcode.com/problems/encode-and-decode-tinyurl)

# Approaches

## 1\. HashMap with Simple Incremental ID

#### Intuition:

The basic idea is to use a simple Integer counter to assign a unique ID to each URL\. We maintain a mapping of the ID to the original URL using a HashMap\. The ID is then converted to a string and appended to our base URL \(e\.g\., [http://tinyurl\.com/](http://tinyurl.com/)\)\.

#### Steps:

1.  Use a HashMap to store the mapping between an ID and the original URL\.
2.  Maintain an Integer counter that increments with each new URL\.
3.  To encode a URL, map it with the current counter value and increment the counter\.
4.  To decode, simply retrieve the URL from the HashMap using the ID\.

#### Code:

Complexity Analysis

*   **Time Complexity:** O\(1\) for both `encode` and `decode` methods\.
*   **Space Complexity:** O\(N\), where N is the number of URLs encoded\. We store each URL once\.

## 2\. HashMap with Random and Base62 Encoding

#### Intuition:

To improve collision handling and reduce the size of the keys, we use random strings as keys\. Base62 encoding is employed for key generation, consisting of alphanumeric characters \(a\-z, A\-Z, 0\-9\), allowing for a wide range of unique combinations\.

#### Steps:

1.  Use a HashMap to map between encoded keys and URLs\.
2.  Generate a unique key for each URL using random strings\.
3.  Use Base62 encoding to ensure a consistent string length and avoid collisions\.
4.  To encode, generate a key, map it to the URL, and build the tiny URL\.
5.  To decode, retrieve the URL directly using the key\.

#### Code:

Complexity Analysis

*   **Time Complexity:** O\(1\) for both `encode` and `decode` methods, on average\.
*   **Space Complexity:** O\(N\), where N is the number of URLs encoded\. We store each URL once\.