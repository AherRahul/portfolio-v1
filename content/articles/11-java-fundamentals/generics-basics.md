---
title: Generics Basics
description: Learn about Generics Basics in Java programming.
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

Generics in Java provide a powerful way to enhance type safety while writing reusable code. If you've ever dealt with collections in Java, you may have noticed that generics allow you to define classes, interfaces, and methods with a placeholder for types.

This flexibility not only makes your code cleaner and easier to read but also prevents runtime errors related to type casting. While this might sound a bit abstract, let's break it down into digestible parts.

# What Are Generics?

At its core, **generics** enable you to create a single class, interface, or method that can operate on different types while providing compile-time type safety. Before generics were introduced in Java 5, developers often used raw types, which could lead to several issues, such as unchecked type casts and potential `ClassCastException` at runtime.

To illustrate this, consider a simple `Box` class without generics:

In the example above, you can store any type of object, but retrieving it requires you to cast it back to the original type, which can lead to errors:

```java
public class Box {
    private Object item;

    public void setItem(Object item) {
        this.item = item;
    }

    public Object getItem() {
        return item;
    }
}
```


Using generics, you can define a `Box` class that specifies the type of item it contains. This way, type safety is enforced at compile time:

Now, you can create a `Box` for a specific type:

This prevents potential runtime errors and makes your code clearer.

# Why Use Generics?

Using generics has several compelling advantages:

*   **Type Safety**: The compiler checks the types, reducing runtime errors.
*   **Elimination of Casting**: You avoid the need for explicit type casting, which simplifies your code.
*   **Reusability**: You can create classes and methods that work with any data type, enhancing flexibility.

Consider a simple list of integers without generics:

With generics, you can define a `List` specifically for `Integer` values:

This clear distinction helps you avoid bugs and write cleaner code.

# Generics and Collections

Generics are prominently used in Java's collection framework. When you use collections like `List`, `Set`, or `Map`, generics allow you to define the types of elements stored within these collections.

For example:

```java
Box box = new Box();
box.setItem("Hello, World!");
String message = (String) box.getItem(); // This works, but it's risky
```


In this example, `stringList` is a list that only accepts `String` objects. If you try to add an integer or any other type, the compiler will throw an error.

```java
public class Box<T> {
    private T item;

    public void setItem(T item) {
        this.item = item;
    }

    public T getItem() {
        return item;
    }
}
```


### Real-World Application: Type-Safe Data Models

Imagine you are developing an application that manages user profiles. By using generics, you can create a generic data model that works with any entity type.

You can now create repositories for different types:

This design allows you to manage different types of data while maintaining type safety.

# Limitations of Generics

While generics are powerful, there are some limitations you should be aware of:

#### **Primitive Types**

Java's generics do not support primitive types like `int`, `char`, etc. Instead, you use their wrapper classes (`Integer`, `Character`).

#### **Type Erasure**

Generics are implemented using type erasure, meaning that the generic type information is not available at runtime. This can lead to some quirks, such as not being able to create arrays of generic types.

#### **Static Context**

You cannot use generic types in static contexts. For example:

```java
Box<String> stringBox = new Box<>();
stringBox.setItem("Hello, Generics!");
String message = stringBox.getItem(); // No cast needed, safe access
```


#### **Cannot Instantiate Generic Types**

You cannot create an instance of a type parameter or use `new T()`.

To handle these limitations, developers often use workarounds. For example, you can pass the class type as a parameter:

```java
List list = new ArrayList();
list.add(1);
list.add("String"); // Allowed, but risky
Integer number = (Integer) list.get(0); // Needs casting, risky
```


# Practical Examples of Generics

```java
List<Integer> intList = new ArrayList<>();
intList.add(1);
// intList.add("String"); // Compile-time error
Integer number = intList.get(0); // Safe access
```


Let's look at a few more practical examples that demonstrate the power of generics in your code.

```java
List<String> stringList = new ArrayList<>();
stringList.add("Apple");
stringList.add("Banana");

for (String fruit : stringList) {
    System.out.println(fruit); // No type casting required
}
```


### Custom Pair Class

A common use case is to create a generic `Pair` class that holds two related objects:

Usage:

### Generic Utility Methods

You can also create utility methods that use generics. For instance, a method to swap elements in an array:

Usage:

This method can work with any type of array, showcasing the flexibility of generics.

# Conclusion

Generics are an essential feature in Java, promoting type safety, code reusability, and cleaner syntax. By understanding the basics of generics, you've laid the groundwork for using more advanced features like generic classes, methods, and wildcards.

As you continue your journey in mastering Java generics, you'll find that they form the backbone of many powerful and flexible designs.

Now that you understand the core concepts of generics, you are ready to explore **Generic Classes**.

In the next chapter, we will dive deeper into how to create and utilize generic classes effectively, enhancing your ability to design robust and reusable components in Java.

```java
public class Repository<T> {
    private List<T> records = new ArrayList<>();

    public void add(T record) {
        records.add(record);
    }

    public T get(int index) {
        return records.get(index);
    }
}
```


```java
Repository<User> userRepo = new Repository<>();
userRepo.add(new User("Alice"));

Repository<Product> productRepo = new Repository<>();
productRepo.add(new Product("Laptop"));
```


```java
List<int> intList; // This won't work
    List<Integer> integerList; // This is correct
```


```java
public static <T> void doSomething(T item) { ... }
```


```java
public class Box<T> {
    private Class<T> clazz;

    public Box(Class<T> clazz) {
        this.clazz = clazz;
    }

    public T createInstance() throws IllegalAccessException, InstantiationException {
        return clazz.newInstance(); // Creating an instance of T
    }
}
```


```java
public class Pair<K, V> {
    private K key;
    private V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() {
        return key;
    }

    public V getValue() {
        return value;
    }
}
```


```java
Pair<String, Integer> ageMap = new Pair<>("Alice", 30);
System.out.println(ageMap.getKey() + " is " + ageMap.getValue() + " years old.");
```


```java
public static <T> void swap(T[] array, int i, int j) {
    T temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}
```


```java
String[] fruits = {"Apple", "Banana", "Cherry"};
swap(fruits, 0, 1);
// Now fruits is {"Banana", "Apple", "Cherry"}
```
