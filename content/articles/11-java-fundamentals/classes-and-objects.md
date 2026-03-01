---
title: "Classes and Objects"
description: "Learn about Classes And Objects in Java programming."
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - java
courseName: 11-java-fundamentals
showOnArticles: false
featured: false
---



Understanding **classes and objects** is at the heart of Java and object-oriented programming (OOP).

Imagine you are building a model of a car. You wouldn't just create a random assortment of attributes; instead, you'd define a blueprint for what a car is, what it can do, and how it behaves.

That's essentially what classes and objects allow you to do in Java—they let you define blueprints (classes) and create actual instances of those blueprints (objects).

# What Are Classes and Objects?

At its core, a **class** in Java is a blueprint for creating objects. It encapsulates data for the object and methods to manipulate that data. When you define a class, you're essentially defining a new data type. An **object**, on the other hand, is an instance of a class.

Think of a class as a blueprint for a house. The house itself, built according to that blueprint, is the object.

### Basic Structure of a Class

Here's a simple example:

```java
public class Car {
    // Attributes
    String color;
    String model;
    int year;

    // Method to display car details
    void displayDetails() {
        System.out.println("Car Model: " + model);
        System.out.println("Car Color: " + color);
        System.out.println("Car Year: " + year);
    }
}
```


In this example, `Car` is a class with three attributes: `color`, `model`, and `year`. The method `displayDetails()` allows us to print out the details of the car.

```java
class Car {
    // Attributes
    String color;
    String model;
    int year;

    // Method to display car details
    void displayDetails() {
        System.out.println("Car Model: " + model);
        System.out.println("Car Color: " + color);
        System.out.println("Car Year: " + year);
    }
}

public class Main {
    public static void main(String[] args) {
        // Creating an object of the Car class
        Car myCar = new Car();
        myCar.color = "Red";
        myCar.model = "Toyota";
        myCar.year = 2022;

        // Displaying the car details
        myCar.displayDetails();
    }
}
```


### Creating Objects

Once you have a class defined, you can create objects of that class:

```java
public class Vehicle {
    // Instance variable
    String type;
    
    // Class variable
    static int numberOfVehicles = 0;

    // Constructor
    Vehicle(String type) {
        this.type = type;
        numberOfVehicles++;
    }

    void displayType() {
        System.out.println("Vehicle Type: " + type);
    }
}
```


In this `Main` class, we create an instance of `Car` called `myCar`. We then set its properties and call the `displayDetails()` method. This illustrates how you can use classes to create structured, organized code.

# Attributes and Methods

When defining a class, you will often have both attributes (also known as fields) and methods. Attributes represent the state or properties of an object, while methods define its behavior.

### Instance Variables vs. Class Variables

In Java, attributes can be instance variables or class variables (static). Instance variables are tied to a specific instance of a class, while class variables are shared across all instances.

Here, `numberOfVehicles` keeps track of how many `Vehicle` instances have been created, while `type` is specific to each instance.

### Methods

Methods can also have parameters and return types. For example, let’s modify our `Vehicle` class to include a method that allows us to change the vehicle type:

```java
public void changeType(String newType) {
    this.type = newType;
}
```


Now, you can create a `Vehicle` object and change its type:

This modular approach keeps your code organized and makes it easier to maintain.

# The Importance of Encapsulation

**Encapsulation** is one of the fundamental principles of OOP. It refers to the bundling of data (attributes) and methods that operate on that data within one unit (the class). Encapsulation helps protect the integrity of the data by restricting direct access to it.

### Using Access Modifiers

Java provides access modifiers like `private`, `public`, and `protected` to control access to class members. Here's how we can encapsulate our `Car` class:

```java
Vehicle bike = new Vehicle("Bike");
bike.displayType(); // Output: Vehicle Type: Bike
bike.changeType("Mountain Bike");
bike.displayType(); // Output: Vehicle Type: Mountain Bike
```


By making the attributes `private`, we ensure that they cannot be accessed directly from outside the class. Instead, we provide public methods (getters/setters) to interact with them.

### Real-World Application of Encapsulation

Consider an online banking application. You wouldn’t want customers to access their account balance directly. Instead, you would provide methods to check the balance, deposit money, or withdraw funds, enforcing rules around how those actions can be performed.

# Inheritance and Polymorphism

Inheritance allows a class to inherit properties and methods from another class. This promotes code reuse and establishes a hierarchical relationship between classes.

### Creating a Subclass

Let’s extend our `Car` class to create a `SportsCar` subclass:

```java
public class Car {
    private String color;
    private String model;
    private int year;

    // Getter for color
    public String getColor() {
        return color;
    }

    // Setter for color
    public void setColor(String color) {
        this.color = color;
    }

    // Additional getters and setters can be added similarly
}
```


In this case, `SportsCar` inherits `color`, `model`, and `year` from `Car` while adding its own unique attribute, `topSpeed`.

### Polymorphism

Polymorphism allows you to call methods on objects of different classes that share a common interface or superclass. For example, if you have a list of `Car` objects, you can call a method on each object regardless of their specific types:

```java
public class SportsCar extends Car {
    private int topSpeed;

    public SportsCar(String model, String color, int year, int topSpeed) {
        this.model = model;
        this.color = color;
        this.year = year;
        this.topSpeed = topSpeed;
    }

    public void displayTopSpeed() {
        System.out.println("Top Speed: " + topSpeed + " km/h");
    }
}
```


# Abstract Classes and Interfaces

Sometimes, you want to define a class that cannot be instantiated directly. This is where **abstract classes** come into play. Abstract classes can contain abstract methods (without a body) that must be implemented by subclasses.

### Abstract Class Example

```java
Car myCar = new SportsCar("Ferrari", "Red", 2021, 320);
myCar.displayDetails(); // This will work because SportsCar is a Car
```


In this example, `Vehicle` is an abstract class. It cannot be instantiated, but `Bike` provides an implementation for the `start()` method.

```java
abstract class Vehicle {
    abstract void start();
}

class Bike extends Vehicle {
    @Override
    void start() {
        System.out.println("Bike is starting...");
    }
}
```


### Interfaces

Interfaces are similar to abstract classes but can only contain method signatures (no body) and static final variables. A class can implement multiple interfaces, allowing for a more flexible design.

With this interface, you can ensure that any class that implements `Drivable` must provide a `drive()` method.

# Conclusion

Classes and objects are foundational concepts in Java that enable you to model real-world entities in your applications. They allow for encapsulation, inheritance, and polymorphism, promoting cleaner and more maintainable code.

By understanding how to define classes, create objects, and leverage OOP principles, you equip yourself with powerful tools for software development.

In the next chapter, we will look at how constructors help initialize objects, ensuring they are set up correctly before use and diving into some common patterns and practices that can make your code cleaner and more efficient.

```java
interface Drivable {
    void drive();
}

class Car implements Drivable {
    @Override
    public void drive() {
        System.out.println("Car is driving...");
    }
}
```
