---
title: Design Browser History
description: Master Design Browser History in the Data Structure Design module.
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

You have a **browser** of one tab where you start on the `homepage` and you can visit another `url`, get back in the history number of `steps` or move forward in the history number of `steps`\.

Implement the `BrowserHistory` class:

*   `BrowserHistory(string homepage)` Initializes the object with the `homepage` of the browser\.
*   `void visit(string url)` Visits `url` from the current page\. It clears up all the forward history\.
*   `string back(int steps)` Move `steps` back in history\. If you can only return `x` steps in the history and `steps > x`, you will return only `x` steps\. Return the current `url` after moving back in history **at most** `steps`\.
*   `string forward(int steps)` Move `steps` forward in history\. If you can only forward `x` steps in the history and `steps > x`, you will forward only `x` steps\. Return the current `url` after forwarding in history **at most** `steps`\.

##### **Example:**

**Input:**

\["BrowserHistory","visit","visit","visit","back","back","forward","visit","forward","back","back"\]

\[\["leetcode\.com"\],\["google\.com"\],\["facebook\.com"\],\["youtube\.com"\],\[1\],\[1\],\[1\],\["linkedin\.com"\],\[2\],\[2\],\[7\]\]

**Output:**

\[null,null,null,null,"facebook\.com","google\.com","facebook\.com",null,"linkedin\.com","google\.com","leetcode\.com"\]

**Explanation:**

```java
BrowserHistory browserHistory = new BrowserHistory("leetcode.com");
browserHistory.visit("google.com");       // You are in "leetcode.com". Visit "google.com"
browserHistory.visit("facebook.com");     // You are in "google.com". Visit "facebook.com"
browserHistory.visit("youtube.com");      // You are in "facebook.com". Visit "youtube.com"
browserHistory.back(1);                   // You are in "youtube.com", move back to "facebook.com" return "facebook.com"
browserHistory.back(1);                   // You are in "facebook.com", move back to "google.com" return "google.com"
browserHistory.forward(1);                // You are in "google.com", move forward to "facebook.com" return "facebook.com"
browserHistory.visit("linkedin.com");     // You are in "facebook.com". Visit "linkedin.com
browserHistory.forward(2);                // You are in "linkedin.com", you cannot move forward any steps.
browserHistory.back(2);                   // You are in "linkedin.com", move back two steps to "facebook.com" then to "google.com". return "google.com"
browserHistory.back(7);                   // You are in "google.com", you can move back only one step to "leetcode.com". return "leetcode.com"
```

#### **Constraints:**

*   `1 <= homepage.length <= 20`
*   `1 <= url.length <= 20`
*   `1 <= steps <= 100`
*   `homepage` and `url` consist of  '\.' or lower case English letters\.
*   At most `5000` calls will be made to `visit`, `back`, and `forward`\.

#### [Solve it on LeetCode](https://leetcode.com/problems/design-browser-history)

# Approaches

## 1\. Using a List to Store History

#### **Intuition:**

The most straightforward approach to manage browsing history is by using a list\. Each time we visit a new URL, we can append it to the list from the current position, effectively simulating moving forward or backward in browser history\.

#### **Execution:**

*   Use an ArrayList to store the web pages\.
*   Maintain an integer `current` to track the index of the current web page\.
*   On visiting a new page, all forward history \(if any\) is removed, and the new URL is appended\.

#### **Details:**

1.  **visit\(String url\):** Add the url to the history at the current position and remove any forward history\. Update the current position\.
2.  **back\(int steps\):** Move the current position back by `steps` or until reaching the first page\.
3.  **forward\(int steps\):** Move the current position forward by `steps` or until reaching the last page\.

#### Code:

Java

```java
class BrowserHistory {
   private List<String> history;
   private int current;

   public BrowserHistory(String homepage) {
       history = new ArrayList<>();
       history.add(homepage);
       current = 0;
   }
   
   public void visit(String url) {
       // Remove forward history
       while (history.size() > current + 1) {
           history.remove(history.size() - 1);
       }
       // Add new page and update current index
       history.add(url);
       current++;
   }
   
   public String back(int steps) {
       // Move current index back, check bounds
       current = Math.max(0, current - steps);
       return history.get(current);
   }
   
   public String forward(int steps) {
       // Move current index forward, check bounds
       current = Math.min(history.size() - 1, current + steps);
       return history.get(current);
   }
}
```

Complexity Analysis

*   **Time Complexity:**

*   `visit()`: O\(N\) in the worst case \(removing forward history\), where N is the size of the current list\.
*   `back()` and `forward()`: O\(1\)\.

*   **Space Complexity:** O\(N\), where N is the number of URLs stored\.

## 2\. Using Two Stacks

#### **Intuition:**

To optimize the operations for forward and backward navigation, two stacks can be used:

*   One stack to hold the history we can go back to\.
*   Another stack to hold the history we can move forward to\.

#### **Execution:**

*   Use a current variable to track the active page\.
*   On `visit`, clear the forward stack and push the current page to the backward stack before visiting the new page\.
*   For `back`, push the current page to the forward stack and pop from the backward stack\.
*   For `forward`, pop from the forward stack and push to the backward stack\.

#### **Details:**

1.  **visit\(String url\):** Push current page to the back stack, clear forward stack, and set visited page as current\.
2.  **back\(int steps\):** Move as many steps back from the back stack, adjusting the current page\.
3.  **forward\(int steps\):** Move as many steps forward from the forward stack, adjusting the current page\.

#### Code:

Java

```java
class BrowserHistory {
   private Stack<String> backStack;
   private Stack<String> forwardStack;
   private String current;

   public BrowserHistory(String homepage) {
       backStack = new Stack<>();
       forwardStack = new Stack<>();
       current = homepage;
   }
   
   public void visit(String url) {
       // Push current to backStack and set new visit
       backStack.push(current);
       current = url;
       forwardStack.clear(); // Clear forwardStack since we are branching a new path
   }
   
   public String back(int steps) {
       // Move backward steps, ensuring not move past initial page
       while (steps > 0 && !backStack.isEmpty()) {
           forwardStack.push(current);
           current = backStack.pop();
           steps--;
       }
       return current;
   }
   
   public String forward(int steps) {
       // Move forward steps, ensuring not move past recently visited page
       while (steps > 0 && !forwardStack.isEmpty()) {
           backStack.push(current);
           current = forwardStack.pop();
           steps--;
       }
       return current;
   }
}
```

Complexity Analysis

*   **Time Complexity:**

*   `visit()`: O\(1\)\. Adding to stack and clearing another\.
*   `back()` and `forward()`: O\(steps\)\. Maximum O\(N\) where N is the number of URLs\.

*   **Space Complexity:** O\(N\), where N is the number of URLs stored\.