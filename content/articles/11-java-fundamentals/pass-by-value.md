---
title: Pass by Value
description: Learn about Pass By Value in Java programming.
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

Understanding how Java handles method parameters is crucial to becoming an effective developer.

One of the most fundamental concepts in this area is **pass by value**. It shapes how data behaves when passed to methods, which can lead to unexpected surprises if you're not aware of how it works. So, let’s dive deep into this concept and unravel its intricacies.

# What is Pass by Value?

At its core, **pass by value** means that when you pass a variable to a method, you are passing a copy of that variable's value, not the variable itself. This is true for both primitive types and object references in Java.

When you pass a primitive type (like `int`, `float`, or `char`), the method receives a copy of that value. Any changes made to that parameter in the method do not affect the original variable.

In the example above, `modifyValue` attempts to change `value`, but it only changes the copy. The original `originalValue` in `main` remains unaffected.

```java
public class ValueExample {
    public static void main(String[] args) {
        int originalValue = 10;
        System.out.println("Before method call: " + originalValue); // 10
        modifyValue(originalValue);
        System.out.println("After method call: " + originalValue); // Still 10
    }

    public static void modifyValue(int value) {
        value = 20; // This change is local to this method
    }
}
```


# Passing Object References

When dealing with objects, the concept of pass by value might seem a bit more complex. While you are still passing a copy of the variable, in this case, it’s a copy of the reference to the object, not the actual object. This means that although the reference itself is a copy, it still points to the same object in memory.

Here, `modifyObject` changes the state of the object that `myObject` refers to. While the reference to `myObject` is passed by value, both `myObject` and `obj` point to the same instance of `MyClass`. So, any modification affects the original object.

# Immutable Objects and Pass by Value

Java has several immutable classes, such as `String`. When you pass an immutable object to a method and try to modify it, it might appear as if you are changing the original object, but in reality, you are creating a new instance.

In this case, even though `modifyString` tries to concatenate ", World!" to `str`, it doesn't modify `original`. Instead, it creates a new `String` object, leaving the original string untouched.

Understanding immutability is key when working with Java objects. Always remember that modifications to immutable objects do not change the original instance.

# Common Pitfalls and Misunderstandings

Developers new to Java often run into misunderstandings about how pass by value works, particularly with references. Here are some common pitfalls:

*   **Modifying Object State:** As we've seen, modifying an object's state through a method will reflect in the original object. This can lead to bugs if you mistakenly assume you are working with a separate instance.
*   **Reassigning Object References:** If you reassign the reference within the method, it does not affect the original reference.

In this example, even though we created a new `MyClass` object and assigned it to `obj`, `myObject` remains unchanged, as the original reference is unaffected by this reassignment.

```java
class MyClass {
    int x;

    MyClass(int val) {
        x = val;
    }
}

public class ReferenceExample {
    public static void main(String[] args) {
        MyClass myObject = new MyClass(5);
        System.out.println("Before method call: " + myObject.x); // 5
        modifyObject(myObject);
        System.out.println("After method call: " + myObject.x); // 10
    }

    public static void modifyObject(MyClass obj) {
        obj.x = 10; // This modifies the object that myObject references
    }
}
```


# Real-World Applications of Pass by Value

Understanding pass by value is crucial in crafting robust applications. Here are some real-world scenarios where this knowledge becomes particularly valuable:

1.  **Data Encapsulation:** When designing APIs or libraries, passing parameters by value helps encapsulate data effectively. You can ensure that the callers cannot accidentally change the internal state of your objects.
2.  **Thread Safety:** In multi-threaded applications, passing parameters by value can prevent unintended side effects that might arise from shared mutable state. Each thread can work with its own copy of the data.
3.  **Functional Programming Patterns:** Java supports functional programming aspects, where immutability is preferred. Understanding how pass by value works allows you to leverage these patterns without side effects.
4.  **Memory Management:** Knowing how Java manages references and values can help optimize memory usage. For instance, passing large data structures can be expensive, so understanding when to use primitives versus object references can lead to performance improvements.

```java
public class ImmutableExample {
    public static void main(String[] args) {
        String original = "Hello";
        System.out.println("Before method call: " + original); // Hello
        modifyString(original);
        System.out.println("After method call: " + original); // Still Hello
    }

    public static void modifyString(String str) {
        str = str.concat(", World!"); // Creates a new String object
    }
}
```


```java
public class ReassignExample {
    public static void main(String[] args) {
        MyClass myObject = new MyClass(5);
        changeReference(myObject);
        System.out.println(myObject.x); // Still 5
    }

    public static void changeReference(MyClass obj) {
        obj = new MyClass(10); // This does not change myObject
    }
}
```
