---
title: "Enhanced For Loop"
description: "Learn about Enhanced For Loop in Java programming."
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - java
courseName: "10-java-fundamentals"
showOnArticles: false
featured: false
---

![hero image](https://algomaster.io/og-image.png)

When it comes to iterating over collections in Java, there’s a cleaner and more concise way than the traditional for loop.

You might have encountered the **Enhanced For Loop**, also known as the **For-Each Loop**. This loop simplifies the process of traversing arrays and collections by eliminating the need for an iterator or an index variable.

It’s like having a helper that does the heavy lifting for you, letting you focus on what you want to do with the elements instead of how to access them.

# What is the Enhanced For Loop?

The Enhanced For Loop provides a more readable and efficient syntax for iterating through arrays and collections. It allows you to loop through each element without having to manage indices or iterators manually.

Here’s the basic syntax:

```java
for (Type element : collection) {
    // Use element
}
```


In this structure:

*   `Type` represents the data type of the elements in the collection.
*   `element` is a temporary variable that holds the current element in each iteration.
*   `collection` can be an array or any class that implements the `Iterable` interface.

This loop is especially handy when you need to perform an action on every element of a collection without needing to know their indexes.

# Using the Enhanced For Loop with Arrays

Let’s start with arrays, which are one of the most common use cases for the Enhanced For Loop. Suppose you have an array of integers that you want to print. Here's how you can do that effectively:

In this example, the loop iterates over each integer in the `numbers` array. The `number` variable holds the current value, allowing you to perform operations like printing or modifying the value.

```java
public class EnhancedForLoopExample {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};

        for (int number : numbers) {
            System.out.println(number);
        }
    }
}
```


### Edge Cases with Arrays

One thing to note is that if the array is empty, the Enhanced For Loop will simply not execute. This behavior is quite useful as it avoids any `ArrayIndexOutOfBoundsException`.

# Working with Collections

The Enhanced For Loop shines even more when dealing with collections, like `ArrayList`, `HashSet`, or any classes that implement the `Iterable` interface. Let's see an example with an `ArrayList`:

```java
int[] emptyArray = {};
for (int number : emptyArray) {
    // No output, loop is skipped
}
```


This loop iterates through the `fruits` list nicely, printing each fruit’s name. The readability here is excellent, making your code cleaner and easier to maintain.

### Modifying Collections

While you can read elements with the Enhanced For Loop, modifying the collection itself during iteration can lead to a `ConcurrentModificationException`. For instance:

To avoid this, you should use an `Iterator` if you need to remove elements during iteration. Here’s a safe way to do it:

This ensures that you can modify the collection without running into issues.

# Practical Use Cases

When should you use the Enhanced For Loop? Here are a few practical scenarios:

### Processing Data

If you're processing data from a collection, the Enhanced For Loop is perfect. For example, calculating the average of a list of grades:

```java
import java.util.ArrayList;

public class CollectionExample {
    public static void main(String[] args) {
        ArrayList<String> fruits = new ArrayList<>();
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Cherry");

        for (String fruit : fruits) {
            System.out.println(fruit);
        }
    }
}
```


### Filtering Data

If you're filtering data, you can gather results in a new collection while iterating:

This code collects names starting with "A" into a new list, showcasing the Enhanced For Loop's utility in filtering.

# Performance Considerations

While the Enhanced For Loop is generally more readable and cleaner, it's essential to consider performance, especially with large data sets. The loop's overhead is minimal, but if you're dealing with a highly performant application, always test and ensure that the performance meets your needs.

### Comparing with Traditional For Loop

When it comes to performance, the Enhanced For Loop may introduce slight overhead compared to traditional indexed for loops, especially with arrays. However, the difference is often negligible and outweighed by the benefits of cleaner code.

For instance, iterating through a large array using both methods might look like this:

While the traditional loop has the edge in control, the Enhanced For Loop enhances readability and reduces the risk of off-by-one errors.

# Summary of Key Points

The Enhanced For Loop is a powerful tool in Java for iterating over arrays and collections. Its primary advantages include:

*   **Simplicity**: Cleaner syntax means less boilerplate code.
*   **Readability**: Easier for others (and your future self) to understand.
*   **Safety**: Reduces the chance of common errors related to indexing or iterators.

While it is not suitable for modifying collections during iteration, knowing when and how to use it effectively can significantly enhance your coding practices.

In the next chapter, we will dive into how you can control the flow of your loops even further, allowing for more dynamic and flexible iterations.

```java
for (String fruit : fruits) {
    if (fruit.equals("Banana")) {
        fruits.remove(fruit); // This will throw an exception
    }
}
```


```java
import java.util.Iterator;

Iterator<String> iterator = fruits.iterator();
while (iterator.hasNext()) {
    String fruit = iterator.next();
    if (fruit.equals("Banana")) {
        iterator.remove(); // Safe to remove
    }
}
```


```java
import java.util.ArrayList;

public class GradeAverage {
    public static void main(String[] args) {
        ArrayList<Integer> grades = new ArrayList<>();
        grades.add(85);
        grades.add(90);
        grades.add(78);

        int sum = 0;
        for (int grade : grades) {
            sum += grade;
        }
        double average = sum / (double) grades.size();
        System.out.println("Average grade: " + average);
    }
}
```


```java
import java.util.ArrayList;

public class FilterExample {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>();
        names.add("Alice");
        names.add("Bob");
        names.add("Charlie");

        ArrayList<String> filteredNames = new ArrayList<>();
        for (String name : names) {
            if (name.startsWith("A")) {
                filteredNames.add(name);
            }
        }
        System.out.println("Filtered names: " + filteredNames);
    }
}
```


```java
// Traditional For Loop
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}

// Enhanced For Loop
for (int number : numbers) {
    System.out.println(number);
}
```
