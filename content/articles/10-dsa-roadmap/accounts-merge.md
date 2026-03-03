---
title: Accounts Merge
description: Master Accounts Merge in the Graphs module. Comprehensive guide and
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

Given a list of `accounts` where each element `accounts[i]` is a list of strings, where the first element `accounts[i][0]` is a name, and the rest of the elements are **emails** representing emails of the account\.

Now, we would like to merge these accounts\. Two accounts definitely belong to the same person if there is some common email to both accounts\. Note that even if two accounts have the same name, they may belong to different people as people could have the same name\. A person can have any number of accounts initially, but all of their accounts definitely have the same name\.

After merging the accounts, return the accounts in the following format: the first element of each account is the name, and the rest of the elements are emails **in sorted order**\. The accounts themselves can be returned in **any order**\.

##### **Example 1:**

**Input:** accounts = \[\["John","johnsmith@mail\.com","john\_newyork@mail\.com"\],\["John","johnsmith@mail\.com","john00@mail\.com"\],\["Mary","mary@mail\.com"\],\["John","johnnybravo@mail\.com"\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">John</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">johnsmith@mail.com</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">john_newyork@mail.com</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">John</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">johnsmith@mail.com</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">john00@mail.com</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Mary</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">mary@mail.com</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">John</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">johnnybravo@mail.com</span></div>
    </div>
  </div>
</div>

**Output:** \[\["John","john00@mail\.com","john\_newyork@mail\.com","johnsmith@mail\.com"\],\["Mary","mary@mail\.com"\],\["John","johnnybravo@mail\.com"\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">John</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">john00@mail.com</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">john_newyork@mail.com</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">johnsmith@mail.com</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Mary</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">mary@mail.com</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">John</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">johnnybravo@mail.com</span></div>
    </div>
  </div>
</div>

**Explanation:**

The first and second John's are the same person as they have the common email "johnsmith@mail\.com"\.

The third John and Mary are different people as none of their email addresses are used by other accounts\.

We could return these lists in any order, for example the answer \[\['Mary', 'mary@mail\.com'\], \['John', 'johnnybravo@mail\.com'\], \['John', 'john00@mail\.com', 'john\_newyork@mail\.com', 'johnsmith@mail\.com'\]\] would still be accepted\.

##### **Example 2:**

**Input:** accounts = \[\["Gabe","Gabe0@m\.co","Gabe3@m\.co","Gabe1@m\.co"\],\["Kevin","Kevin3@m\.co","Kevin5@m\.co","Kevin0@m\.co"\],\["Ethan","Ethan5@m\.co","Ethan4@m\.co","Ethan0@m\.co"\],\["Hanzo","Hanzo3@m\.co","Hanzo1@m\.co","Hanzo0@m\.co"\],\["Fern","Fern5@m\.co","Fern1@m\.co","Fern0@m\.co"\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Gabe</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Gabe0@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Gabe3@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Gabe1@m.co</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Kevin</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Kevin3@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Kevin5@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Kevin0@m.co</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Ethan</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Ethan5@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Ethan4@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Ethan0@m.co</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Hanzo</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Hanzo3@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Hanzo1@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Hanzo0@m.co</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Fern</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Fern5@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Fern1@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">Fern0@m.co</span></div>
    </div>
  </div>
</div>

**Output:** \[\["Ethan","Ethan0@m\.co","Ethan4@m\.co","Ethan5@m\.co"\],\["Gabe","Gabe0@m\.co","Gabe1@m\.co","Gabe3@m\.co"\],\["Hanzo","Hanzo0@m\.co","Hanzo1@m\.co","Hanzo3@m\.co"\],\["Kevin","Kevin0@m\.co","Kevin3@m\.co","Kevin5@m\.co"\],\["Fern","Fern0@m\.co","Fern1@m\.co","Fern5@m\.co"\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Ethan</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Ethan0@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Ethan4@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Ethan5@m.co</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Gabe</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Gabe0@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Gabe1@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Gabe3@m.co</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Hanzo</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Hanzo0@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Hanzo1@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Hanzo3@m.co</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Kevin</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Kevin0@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Kevin3@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Kevin5@m.co</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Fern</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Fern0@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Fern1@m.co</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">Fern5@m.co</span></div>
    </div>
  </div>
</div>

##### **Constraints:**

*   `1 <= accounts.length <= 1000`
*   `2 <= accounts[i].length <= 10`
*   `1 <= accounts[i][j].length <= 30`
*   `accounts[i][0]` consists of English letters\.
*   `accounts[i][j] (for j > 0)` is a valid email\.


## Approaches

### 1\. DFS and HashMap

#### **Intuition:**

The task is essentially about grouping connected components \(emails\) under the same owner\. Using DFS, we can find all connected components \(i\.e\., all emails linked to each other\) and finally concatenate the results under the same account\.

1.  Use a map to associate each email with its owner and build a graph connecting these emails\.
2.  Apply DFS to traverse through the graph, marking each email visited and gathering all connected emails \(representing one complete account\)\.
3.  For each account's first email, perform DFS to fetch all connected emails, sort them, and store under the corresponding owner\.

#### **Code:**

```java
class Solution {
   public List<List<String>> accountsMerge(List<List<String>> accounts) {
       Map<String, String> emailToName = new HashMap<>();
       Map<String, List<String>> graph = new HashMap<>();
       
       // Build graph
       for (List<String> account : accounts) {
           String name = account.get(0);
           for (int i = 1; i < account.size(); i++) {
               emailToName.put(account.get(i), name);
               graph.putIfAbsent(account.get(i), new ArrayList<>());
               // Connect the first email with the current email
               if (i == 1) continue;
               graph.get(account.get(1)).add(account.get(i));
               graph.get(account.get(i)).add(account.get(1));
           }
       }
       
       // Perform DFS
       Set<String> visited = new HashSet<>();
       List<List<String>> res = new ArrayList<>();
       for (String email : graph.keySet()) {
           if (!visited.contains(email)) {
               List<String> list = new ArrayList<>();
               dfs(email, graph, visited, list);
               Collections.sort(list); // Sort emails
               list.add(0, emailToName.get(email));
               res.add(list);
           }
       }
       
       return res;
   }
   
   private void dfs(String email, Map<String, List<String>> graph, Set<String> visited, List<String> list) {
       visited.add(email);
       list.add(email);
       for (String neighbor : graph.get(email)) {
           if (!visited.contains(neighbor)) {
               dfs(neighbor, graph, visited, list);
           }
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N \* K \* log\(K\)\), where N is the number of accounts and K is the number of emails in an account\. Sorting takes K \* log\(K\)
*   **Space Complexity:** O\(N \* K\), storing graph, email\-to\-name map\.

### 2\. Union Find

#### **Intuition:**

Union\-Find \(Disjoint Set Union\) is a perfect fit for grouping connected components and is typically used in problems of this pattern\. We can take advantage of it to union all emails under the same account and later find and collect emails by their root \(or parent\)\.

1.  Initialize Union\-Find structures and map each email to its parent\.
2.  Union emails and organize them, setting their first email as the "parent"\.
3.  Use a Map to group emails by their parents/components\.
4.  Append sorted grouped emails, prefixed by their owner's name, to the result list\.

#### **Code:**

```java
class Solution {
   public List<List<String>> accountsMerge(List<List<String>> accounts) {
       Map<String, String> emailToName = new HashMap<>();
       Map<String, String> parent = new HashMap<>();
       
       // Initialize Union-Find structures
       for (List<String> account : accounts) {
           String name = account.get(0);
           for (int i = 1; i < account.size(); i++) {
               emailToName.put(account.get(i), name); 
               parent.put(account.get(i), account.get(i));
           }
       }
       
       // Union accounts
       for (List<String> account : accounts) {
           String p = find(account.get(1), parent);
           for (int i = 2; i < account.size(); i++) {
               parent.put(find(account.get(i), parent), p);
           }
       }
       
       // Group accounts by root email
       Map<String, List<String>> unions = new HashMap<>();
       for (String email : parent.keySet()) {
           String root = find(email, parent);
           unions.putIfAbsent(root, new ArrayList<>());
           unions.get(root).add(email);
       }
       
       // Collect result
       List<List<String>> res = new ArrayList<>();
       for (String root : unions.keySet()) {
           List<String> emails = unions.get(root);
           Collections.sort(emails); // Sort emails
           emails.add(0, emailToName.get(root)); // Add the owner
           res.add(emails);
       }
       
       return res;
   }
   
   private String find(String email, Map<String, String> parent) {
       if (!email.equals(parent.get(email))) {
           parent.put(email, find(parent.get(email), parent));
       }
       return parent.get(email);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N \* K \* log\(K\)\), similar to the DFS approach with additional log factor for find operation\.
*   **Space Complexity:** O\(N \* K\), storing parent and email mappings\.

#### [Solve it on LeetCode](https://leetcode.com/problems/accounts-merge)
