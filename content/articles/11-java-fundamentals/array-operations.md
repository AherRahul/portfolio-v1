---
title: Array Operations
description: Learn about Array Operations in Java programming.
datePublished: 2026-02-27
dateModified: 2026-02-27
topics:
  - java
courseName: 11-java-fundamentals
showOnArticles: false
featured: false
published: true
---

![hero image](https://algomaster.io/og-image.png)

Creating efficient and effective operations on arrays is a cornerstone of programming in Java. While arrays provide a structured way to manage collections of data, the real magic happens when we start performing operations on these structures.

Whether you need to search, sort, filter, or manipulate the elements within an array, understanding these operations can significantly enhance your coding skills and improve performance.

# Searching in Arrays

Searching for a specific element in an array is one of the most common operations you'll encounter. The two primary methods to accomplish this in Java are **linear search** and **binary search**.

## Linear Search

Linear search is the simplest way to find an element. You iterate through each element in the array until you find what you're looking for or reach the end.

Here’s how it works:

### Why Use Linear Search?

*   **Simplicity**: It’s straightforward and easy to understand.
*   **No Sorting Required**: You can use it on unsorted arrays.

However, it can be _inefficient_ for large datasets because it has a time complexity of O(n).

## Binary Search

Binary search is much more efficient but requires a sorted array. It works by repeatedly dividing the search interval in half.

Here’s a practical example:

```java
public class ArrayOperations {
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i; // Return the index if found
            }
        }
        return -1; // Return -1 if not found
    }

    public static void main(String[] args) {
        int[] numbers = {5, 2, 9, 1, 5, 6};
        int target = 9;
        int index = linearSearch(numbers, target);
        System.out.println("Target found at index: " + index);
    }
}
```


### Why Use Binary Search?

*   **Efficiency**: It has a time complexity of O(log n), making it much faster for large datasets compared to linear search.

Always sort your array before performing a binary search. The `Arrays.sort()` method is useful for this purpose.

# Sorting Arrays

Sorting is another fundamental operation. Java provides various sorting algorithms, including **Bubble Sort**, **Selection Sort**, **Insertion Sort**, and the more efficient **Quick Sort** and **Merge Sort**.

## Bubble Sort

Bubble sort is perhaps the simplest sorting algorithm, though not the most efficient. It repeatedly steps through the array, compares adjacent elements, and swaps them if they are in the wrong order.

Here’s how it looks:

### Why Use Bubble Sort?

*   **Educational**: It’s great for teaching sorting algorithms because of its simplicity.
*   **Small Datasets**: It can be useful for small arrays where performance is not critical.

However, be cautious: it has a time complexity of O(n^2), which makes it impractical for large datasets.

## Quick Sort

Quick Sort is a much more efficient algorithm, utilizing a divide-and-conquer strategy.

Here's a quick implementation:

### Why Use Quick Sort?

*   **Performance**: Quick Sort has an average time complexity of O(n log n), making it one of the fastest sorting algorithms.
*   **In-Place**: It requires minimal additional space, which is a huge advantage for large datasets.

Quick Sort performs poorly on already sorted arrays or when the pivot is poorly chosen. Always consider using a randomized pivot or the median-of-three method for better performance.

# Filtering Arrays

Filtering arrays allows you to create a new array based on specific criteria. This can be particularly useful when you want to only keep elements that meet certain conditions.

## Using a Simple Loop

You can filter an array using a loop and a temporary list to hold the results.

### Why Use Filtering?

*   **Flexibility**: You can define any condition for filtering elements.
*   **Dynamic Size**: Using a List to hold results allows dynamic sizing rather than being constrained by the original array size.

## Using Streams

In Java 8 and above, you can streamline this process using streams, making your code cleaner and more expressive.

### Why Use Streams?

*   **Conciseness**: The code is shorter and easier to read.
*   **Functional Style**: You leverage Java’s functional programming capabilities, which can lead to fewer bugs.

Streams are not always the best choice for performance-critical applications, so use them judiciously.

# Manipulating Arrays

Manipulating arrays involves changing their contents, which can include operations like updating values, reversing the array, or even rotating it.

## Updating Values

Updating values in an array is straightforward. You can access elements using their indices and modify them directly.

### Reversing an Array

Reversing an array can be a common requirement. Here’s how you can do it in place:

### Rotating an Array

Rotating an array means shifting its elements. For example, rotating to the right by one means the last element moves to the front.

```java
import java.util.Arrays;

public class ArrayOperations {
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (arr[mid] == target) {
                return mid; // Target found
            }
            if (arr[mid] < target) {
                left = mid + 1; // Search in the right half
            } else {
                right = mid - 1; // Search in the left half
            }
        }
        return -1; // Target not found
    }

    public static void main(String[] args) {
        int[] numbers = {1, 2, 5, 5, 6, 9}; // Sorted array
        int target = 5;
        int index = binarySearch(numbers, target);
        System.out.println("Target found at index: " + index);
    }
}
```


Here’s a simple way to do it:

### Why Manipulate Arrays?

*   **Efficiency**: Directly manipulating arrays is often faster than creating new structures.
*   **Control**: You have complete control over how data is modified.

In the next chapter, we will look at how to manage and manipulate arrays with more than one dimension, opening new possibilities for handling complex data structures.

```java
import java.util.Arrays;

public class ArrayOperations {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap arr[j] and arr[j + 1]
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] numbers = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(numbers);
        System.out.println(Arrays.toString(numbers)); // Display sorted array
    }
}
```


```java
$6c
```


```java
import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;

public class ArrayOperations {
    public static int[] filterArray(int[] arr, int threshold) {
        List<Integer> result = new ArrayList<>();
        for (int num : arr) {
            if (num > threshold) {
                result.add(num); // Add to results if condition is met
            }
        }
        // Convert List to int[]
        return result.stream().mapToInt(i -> i).toArray();
    }

    public static void main(String[] args) {
        int[] numbers = {3, 8, 1, 10, 4, 6};
        int[] filtered = filterArray(numbers, 5);
        System.out.println(Arrays.toString(filtered)); // Output: [8, 10, 6]
    }
}
```


```java
import java.util.Arrays;

public class ArrayOperations {
    public static int[] filterArray(int[] arr, int threshold) {
        return Arrays.stream(arr)
                     .filter(num -> num > threshold) // Define the condition
                     .toArray(); // Collect to an array
    }

    public static void main(String[] args) {
        int[] numbers = {3, 8, 1, 10, 4, 6};
        int[] filtered = filterArray(numbers, 5);
        System.out.println(Arrays.toString(filtered)); // Output: [8, 10, 6]
    }
}
```


```java
import java.util.Arrays;

public class ArrayOperations {
    public static void updateValues(int[] arr, int index, int newValue) {
        if (index >= 0 && index < arr.length) {
            arr[index] = newValue; // Update the value at the specified index
        }
    }

    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        updateValues(numbers, 2, 10);
        System.out.println(Arrays.toString(numbers)); // Output: [1, 2, 10, 4, 5]
    }
}
```


```java
import java.util.Arrays;

public class ArrayOperations {
    public static void reverseArray(int[] arr) {
        int left = 0;
        int right = arr.length - 1;

        while (left < right) {
            // Swap elements
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }

    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        reverseArray(numbers);
        System.out.println(Arrays.toString(numbers)); // Output: [5, 4, 3, 2, 1]
    }
}
```


```java
import java.util.Arrays;

public class ArrayOperations {
    public static void rotateArray(int[] arr) {
        if (arr.length > 1) {
            int last = arr[arr.length - 1];
            for (int i = arr.length - 1; i > 0; i--) {
                arr[i] = arr[i - 1]; // Shift elements to the right
            }
            arr[0] = last; // Move last element to the front
        }
    }

    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        rotateArray(numbers);
        System.out.println(Arrays.toString(numbers)); // Output: [5, 1, 2, 3, 4]
    }
}
```
