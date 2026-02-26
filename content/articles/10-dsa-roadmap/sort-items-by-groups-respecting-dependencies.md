---
title: Sort Items by Groups Respecting Dependencies
description: Master Sort Items by Groups Respecting Dependencies in the Graphs
  module. Comprehensive guide and algorithmic problem solving.
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

There are `n` items each belonging to zero or one of `m` groups where `group[i]` is the group that the `i`\-th item belongs to and it's equal to `-1` if the `i`\-th item belongs to no group\. The items and the groups are zero indexed\. A group can have no item belonging to it\.

Return a sorted list of the items such that:

*   The items that belong to the same group are next to each other in the sorted list\.
*   There are some relations between these items where `beforeItems[i]` is a list containing all the items that should come before the `i`\-th item in the sorted array \(to the left of the `i`\-th item\)\.

Return any solution if there is more than one solution and return an **empty list** if there is no solution\.

##### **Example 1:**

**Input:** n = 8, m = 2, group = \[\-1,\-1,1,0,0,1,0,\-1\], beforeItems = \[\[\],\[6\],\[5\],\[6\],\[3,6\],\[\],\[\],\[\]\]

**Output:** \[6,3,4,1,5,2,0,7\]

##### **Example 2:**

**Input:** n = 8, m = 2, group = \[\-1,\-1,1,0,0,1,0,\-1\], beforeItems = \[\[\],\[6\],\[5\],\[6\],\[3\],\[\],\[4\],\[\]\]

**Output:** \[\]

**Explanation:** This is the same as example 1 except that 4 needs to be before 6 in the sorted list\.

##### **Constraints:**

*   **1 <= m <= n <= 3 \* 10****4**
*   **group\.length == beforeItems\.length == n**
*   **\-1 <= group\[i\] <= m \- 1**
*   **0 <= beforeItems\[i\]\.length <= n \- 1**
*   **0 <= beforeItems\[i\]\[j\] <= n \- 1**
*   **i \!= beforeItems\[i\]\[j\]**
*   **beforeItems\[i\] does not contain duplicates elements\.**

#### [Solve it on LeetCode](https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies)

# Approaches

## 1\. Basic Topological Sort with Two Separate Graphs

#### Intuition:

The problem can be broken down into two separate topological sort problems: one for the items and another for the groups\. Each item belongs to a group, and items and groups must be reordered to respect their respective dependencies\.

The plan is to:

1.  Separate items into groups and form two graphs: one for item dependencies and one for group dependencies\.
2.  Use topological sorting to sort items within a group and then sort groups themselves\.

#### Steps:

1.  We will first set up the item graph and group graph using adjacency lists\.
2.  Perform topological sort on the items within each group\.
3.  Perform topological sort on the groups themselves\.

#### Code:

Java

```java
class Solution {
   public int[] sortItems(int n, int m, int[] group, List<List<Integer>> beforeItems) {
       // Initialize the group ids for standalone items.
       for (int i = 0; i < n; i++) {
           if (group[i] == -1) {
               group[i] = m++;
           }
       }
       
       // Create adjacency lists for items and groups.
       List<Integer>[] itemGraph = new List[n];
       List<Integer>[] groupGraph = new List[m];
       for (int i = 0; i < n; i++) {
           itemGraph[i] = new ArrayList<>();
       }
       for (int i = 0; i < m; i++) {
           groupGraph[i] = new ArrayList<>();
       }
       
       // Indegree arrays for topological sorting.
       int[] itemIndegree = new int[n];
       int[] groupIndegree = new int[m];
       
       // Populate the graphs.
       for (int i = 0; i < n; i++) {
           int currGroup = group[i];
           for (int beforeItem : beforeItems.get(i)) {
               // Add edge in the item graph.
               itemGraph[beforeItem].add(i);
               itemIndegree[i]++;
               
               int beforeGroup = group[beforeItem];
               if (beforeGroup != currGroup) {
                   // Add edge in the group graph if in different groups.
                   groupGraph[beforeGroup].add(currGroup);
                   groupIndegree[currGroup]++;
               }
           }
       }
       
       // Topological sort for the groups.
       List<Integer> sortedGroups = topologicalSort(groupGraph, groupIndegree, m);
       if (sortedGroups == null) return new int[0];
       
       // Topological sort for individuals in each group.
       List<Integer> result = new ArrayList<>();
       for (int grp : sortedGroups) {
           List<Integer> itemsInGroup = new ArrayList<>();
           for (int i = 0; i < n; i++) {
               if (group[i] == grp) {
                   itemsInGroup.add(i);
               }
           }
           List<Integer> sortedItems = topologicalSort(itemGraph, itemIndegree, itemsInGroup.size(), itemsInGroup);
           if (sortedItems == null) return new int[0];
           result.addAll(sortedItems);
       }
       
       return result.stream().mapToInt(i -> i).toArray();
   }
   
   private List<Integer> topologicalSort(List<Integer>[] graph, int[] indegree, int total, List<Integer> nodes) {
       Queue<Integer> queue = new LinkedList<>();
       for (int node : nodes) {
           if (indegree[node] == 0) {
               queue.add(node);
           }
       }
       
       List<Integer> sorted = new ArrayList<>();
       while (!queue.isEmpty()) {
           int node = queue.poll();
           sorted.add(node);
           for (int neighbor : graph[node]) {
               indegree[neighbor]--;
               if (indegree[neighbor] == 0) {
                   queue.add(neighbor);
               }
           }
       }
       
       return sorted.size() == total ? sorted : null;
   }
   
   private List<Integer> topologicalSort(List<Integer>[] graph, int[] indegree, int size) {
       return topologicalSort(graph, indegree, size, generateRange(size));
   }
   
   private List<Integer> generateRange(int n) {
       List<Integer> range = new ArrayList<>(n);
       for (int i = 0; i < n; i++) {
           range.add(i);
       }
       return range;
   }
}
```

Complexity Analysis

*   **Time Complexity:** Building the graphs takes O\(n \+ m\), where n is the number of items and m is the number of relations\. Topological sort for each graph takes O\(n \+ m\) as well\. Overall complexity is O\(n \+ m\)\.
*   **Space Complexity:** Storing the graphs requires O\(n \+ m\) space\.

## 2\. Advanced Topological Sort with Single Graph

#### Intuition:

To optimize further, we combine the management of items and groups into a single graph\. We treat groups as virtual nodes and manage dependencies among them inline with item dependencies\. This removes the dependency on two separate graph traversals\.

#### Steps:

1.  Items are assigned to their respective groups or created as standalone groups for unassigned items\.
2.  A single graph tracks all group and item dependencies\.
3.  Perform a single topological sort to create a valid order of groups and items interspersed\.

#### Code:

Java

```java
class AdvancedSolution {
   public int[] sortItems(int n, int m, int[] group, List<List<Integer>> beforeItems) {
       
       for (int i = 0; i < n; i++) {
           if (group[i] == -1) {
               group[i] = m++;
           }
       }
       
       List<Integer>[] combinedGraph = new List[n + m];
       for (int i = 0; i < n + m; i++) {
           combinedGraph[i] = new ArrayList<>();
       }
       
       int[] indegree = new int[n + m];
       
       for (int i = 0; i < n; i++) {
           int itemGroup = group[i];
           for (int beforeItem : beforeItems.get(i)) {
               int beforeItemGroup = group[beforeItem];
               if (beforeItemGroup == itemGroup) {
                   combinedGraph[beforeItem].add(i);
                   indegree[i]++;
               } else {
                   combinedGraph[beforeItemGroup + n].add(itemGroup + n);
                   indegree[itemGroup + n]++;
               }
           }
           combinedGraph[itemGroup + n].add(i);
           indegree[i]++;
       }
       
       Queue<Integer> queue = new LinkedList<>();
       for (int i = 0; i < n + m; i++) {
           if (indegree[i] == 0) {
               queue.add(i);
           }
       }

       List<Integer> result = new ArrayList<>();
       
       while (!queue.isEmpty()) {
           int node = queue.poll();
           if (node < n) {
               result.add(node);
           }
           for (int neighbor : combinedGraph[node]) {
               indegree[neighbor]--;
               if (indegree[neighbor] == 0) {
                   queue.add(neighbor);
               }
           }
       }
       
       return result.size() == n ? result.stream().mapToInt(i -> i).toArray() : new int[0];
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n \+ m\) due to the graph setup and traversal\.
*   **Space Complexity:** O\(n \+ m\) for storing the graph\.