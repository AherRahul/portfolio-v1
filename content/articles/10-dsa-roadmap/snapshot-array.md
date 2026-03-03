---
title: Snapshot Array
description: Master Snapshot Array in the Data Structure Design module.
  Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Implement a SnapshotArray that supports the following interface:

*   `SnapshotArray(int length)` initializes an array\-like data structure with the given length\. **Initially, each element equals 0**\.
*   `void set(index, val)` sets the element at the given `index` to be equal to `val`\.
*   `int snap()` takes a snapshot of the array and returns the `snap_id`: the total number of times we called `snap()` minus `1`\.
*   `int get(index, snap_id)` returns the value at the given `index`, at the time we took the snapshot with the given `snap_id` 

##### **Example 1:**

**Input:** \["SnapshotArray","set","snap","set","get"\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">SnapshotArray</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">set</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">snap</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">set</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">get</span></div>
  </div>
</div>

\[\[3\],\[0,5\],\[\],\[0,6\],\[0,0\]\]

**Output:** \[null,null,0,null,5\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
  </div>
</div>

**Explanation:**

```java
SnapshotArray snapshotArr = new SnapshotArray(3); // set the length to be 3
snapshotArr.set(0,5);  // Set array[0] = 5
snapshotArr.snap();  // Take a snapshot, return snap_id = 0
snapshotArr.set(0,6);
snapshotArr.get(0,0);  // Get the value of array[0] with snap_id = 0, return 5
```

##### **Constraints:**

*   **1 <= length <= 5 \* 10****4**
*   **0 <= index < length**
*   **0 <= val <= 10****9**
*   **0 <= snap\_id < \(the total number of times we call snap\(\)\)**
*   **At most 5 \* 10****4** **calls will be made to set, snap, and get**\.


## Approaches

### 1\. Naive Approach

#### Intuition:

The naive approach involves storing the entire array for each snapshot\. Although this method is simple to implement, it is not efficient as it uses a lot of memory space if the array or the number of snapshots is large\.

#### Code:

```java
class SnapshotArray {
   private List<int[]> history;
   private int[] array;

   // Initialize the SnapshotArray object with length n
   public SnapshotArray(int length) {
       array = new int[length];
       history = new ArrayList<>();
   }

   // Set the value at index to be val
   public void set(int index, int val) {
       array[index] = val;  // Directly set the value at the index
   }

   // Store the copy of current state of array in history and return snap id
   public int snap() {
       history.add(array.clone());  // Save the entire array
       return history.size() - 1;   // Return the snapshot id
   }

   // Return the value at index for the given snap id
   public int get(int index, int snap_id) {
       return history.get(snap_id)[index];  // Retrieve the value from the specific snapshot
   }
}
```

#### Complexity Analysis

*   **Time Complexity:**

*   `set`: O\(1\), because setting the value takes constant time\.
*   `snap`: O\(n\), where n is the length of the array, since we need to duplicate the array\.
*   `get`: O\(1\), as we directly fetch the value from a stored snapshot\.

*   **Space Complexity:** O\(n\), due to the use of additional array\.

### 2\. Efficient Approach with Binary Search

#### Intuition:

Instead of storing the entire array for each snapshot, we only store the changes made for each snapshot\. This can be efficiently handled using a list of TreeMaps where the keys are indices of the array, and the values are another TreeMap that maps the snapshot id to the values that were set during that snapshot\.

#### Code:

```java
class SnapshotArray {
   private List<TreeMap<Integer, Integer>> arraySnapList;
   private int currentSnap;

   // Initialize the SnapshotArray object with length n
   public SnapshotArray(int length) {
       arraySnapList = new ArrayList<>();
       for (int i = 0; i < length; i++) {
           arraySnapList.add(new TreeMap<>());
           arraySnapList.get(i).put(0, 0);  // Initializing all indices with value 0 at snap_id = 0
       }
       currentSnap = 0;
   }

   // Set the value at index to be val
   public void set(int index, int val) {
       arraySnapList.get(index).put(currentSnap, val);
   }

   // Increment the snap id and return the previous id
   public int snap() {
       return currentSnap++;
   }

   // Return the value at index for the given snap id, using binary search to find the right value
   public int get(int index, int snap_id) {
       return arraySnapList.get(index).floorEntry(snap_id).getValue();
   }
}
```

#### Complexity Analysis

*   **Time Complexity:**

*   `set`: O\(log S\), where S is the number of snapshots taken, for the insertion in the TreeMap\.
*   `snap`: O\(1\), as we only increment a counter\.
*   `get`: O\(log S\), due to the binary search operation `floorEntry()` in TreeMap\.

*   **Space Complexity:** O\(n \+ q\), where n is the length of the array and q is the number of set operations until last snap\.

#### [Solve it on LeetCode](https://leetcode.com/problems/snapshot-array)
