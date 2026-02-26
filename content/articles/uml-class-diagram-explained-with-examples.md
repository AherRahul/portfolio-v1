---
title: "UML Class Diagram Explained with Examples"
description: "Unified Modeling Language (UML) is a standard way to visualize the design of a software system."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/uml-class-diagram-explained-with-examples.md"
dateModified: "2024-06-09"
datePublished: "2024-06-09"
showOnArticles: true
topics:
  - dsa
  - low-level-design
---

**Unified Modeling Language (UML)**  is a standard way to visualize the design of a software system.

Among the many diagrams offered by UML,  **class diagrams**  are perhaps the most widely used.

UML class diagram provides a static view of an object oriented system, showcasing its  **classes, attributes, methods, and the relationships among objects.**

In this article, we will explore the building blocks of UML class diagram, how to represent them, different types of class relationships and provide real-world examples for each representation.

If you’re enjoying this newsletter and want to get even more value, consider becoming a  **[paid subscriber](https://blog.algomaster.io/subscribe)** .

As a paid subscriber, you'll unlock all  **premium articles**  and gain full access to all  **[premium courses](https://algomaster.io/newsletter/paid/resources)**  on  **[algomaster.io](https://algomaster.io)** .

## Building Blocks of UML Class Diagrams

A UML class diagram consists of the following building blocks:

### 1. Class

A  **class**  is a blueprint or template that defines the properties and behavior of an object.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/494a65a0-c3aa-47fa-983e-1654b2b26d2f_1248x744.png)](https://substackcdn.com/image/fetch/$s_!rmtp!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F494a65a0-c3aa-47fa-983e-1654b2b26d2f_1248x744.png)

Represented as rectangles, classes are divided into three compartments:

- **Name (top compartment):**  The unique identifier of the class (e.g., BankAccount).
- **Attributes (middle compartment):**  The properties or data associated with the class (e.g., accountNumber, balance).
- **Operations (bottom compartment):**  The actions or methods that can be performed by objects of the class (e.g., deposit(), updateBalance()).

**Visibility Markers** : Visibility markers indicate the accessibility of attributes and methods within a class.

- + **(Public):**  The attribute or method is accessible from any class.
- - **(Private):**  The attribute or method is only accessible within the same class.
- # **(Protected):**  The attribute or method is accessible within the same class and its subclasses.
- ~ **(Package):**  The attribute or method is accessible within the same package.

### **2. Attributes**

Attributes in a UML class diagram represent the properties or data fields of a class.

Attributes are typically written in the format:

```
visibility name: type [multiplicity] = defaultValue
```

**Name** : The name of the attribute.

**Type** : The data type of the attribute.

**Multiplicity** : (Optional) Indicates how many instances of the type are allowed.

**Default Value** : (Optional) The initial value of the attribute.

**Example:**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/8ee29d85-a870-4ec1-92b8-9ecc245d425d_1248x520.png)](https://substackcdn.com/image/fetch/$s_!2nfv!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8ee29d85-a870-4ec1-92b8-9ecc245d425d_1248x520.png)

### **3. Methods**

Methods (or operations) in a UML class diagram represent the functions or behaviors that a class can perform.

Methods are typically written in the format:

```
visibility name(parameterList): returnType
```

- **Name** : The name of the method.
- **Parameter List** : A comma-separated list of parameters, each specified as name: type.
- **Return Type** : The data type returned by the method.

**Example:**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/75a17f88-fd67-45c3-940b-26418d5921ed_1474x520.png)](https://substackcdn.com/image/fetch/$s_!Cev6!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F75a17f88-fd67-45c3-940b-26418d5921ed_1474x520.png)

### 4. Interfaces

An interface defines a contract for classes that implement it. It specifies a set of methods that the implementing classes must provide.

Interfaces are depicted as a class rectangle with the keyword «interface» above the interface name. Methods in interfaces are abstract by nature, so they are usually shown without any implementation details.

**Example:**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/f5a9233a-2083-4799-ba73-3fc57caeaead_834x448.png)](https://substackcdn.com/image/fetch/$s_!42Rh!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5a9233a-2083-4799-ba73-3fc57caeaead_834x448.png)

### 5. Abstract Class

An abstract class is a class that cannot be instantiated (you can't create objects directly from it).

It serves as a blueprint for other classes (subclasses) that inherit from it.

An abstract class in UML is represented with the class name in italics and the keyword «abstract» above the class name. Abstract methods within the class are also typically shown in italics.

**Example:**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/deed8e70-5b57-446f-a53f-f474e86b5c98_932x528.png)](https://substackcdn.com/image/fetch/$s_!GCvS!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fdeed8e70-5b57-446f-a53f-f474e86b5c98_932x528.png)

### 6. Enumeration

An enumeration is a data type that defines a set of named values (e.g., colors, days of the week).

Enumerations, or enums, are represented with the keyword «enumeration» above the enumeration name. The values of the enumeration are listed within the class box.

**Example:**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/4e737467-b184-4e3b-b8dc-711ac7840b50_644x520.png)](https://substackcdn.com/image/fetch/$s_!Qp6k!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4e737467-b184-4e3b-b8dc-711ac7840b50_644x520.png)

### 7. Multiplicity

Multiplicity specifies the number of instances of one class that can be related to a single instance of another class.

It is represented by a number or a range of numbers near the end of an association line.

Common multiplicities include:  **1 (exactly one), 0..1 (zero or one), * (zero or more), 1..* (one or more).**

## Relationships in UML Class Diagrams

There are six main types of relationships between classes: association, aggregation, composition, inheritance, implementation and dependency.

The arrows for the six relationships are as follows:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/0608aeaf-d32c-41e9-b7fa-6c105c27fab9_1032x648.png)](https://substackcdn.com/image/fetch/$s_!HKuc!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0608aeaf-d32c-41e9-b7fa-6c105c27fab9_1032x648.png)

#### 1. Association

Association represents a "uses-a" relationship between two classes where one class uses or interacts with the other.

**Example:**  A Student class is associated with a Course class, as a student can enroll in multiple courses.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/662eb8e0-7697-4a1c-8a2a-137e0d6879e9_1234x1380.png)](https://substackcdn.com/image/fetch/$s_!jNRE!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F662eb8e0-7697-4a1c-8a2a-137e0d6879e9_1234x1380.png)

#### 2. Aggregation

Aggregation represents a "has-a" relationship where one class (the whole) contains another class (the part), but the contained class can exist independently.

**Example:**  A Car class has an Engine class but the Engine class can exist without the Car class.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/880fe7ba-9935-4d35-857e-b2682d3ac093_1554x486.png)](https://substackcdn.com/image/fetch/$s_!NT1i!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F880fe7ba-9935-4d35-857e-b2682d3ac093_1554x486.png)

#### 3. Composition

Composition represents a  **strong**  "has-a" relationship where the part cannot exist without the whole. If the whole is destroyed, the parts are also destroyed.

**Example:**  A House class is composed of Room class but the Room class can not exist without the House class.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/fc9ef308-2a5e-4f8e-a61b-5835d6231b07_1552x376.png)](https://substackcdn.com/image/fetch/$s_!1sL5!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffc9ef308-2a5e-4f8e-a61b-5835d6231b07_1552x376.png)

#### 4. Inheritance

Inheritance (or Generalization) represents an "is-a" relationship where one class (subclass) inherits the attributes and methods of another class (superclass).

**Example:** A Dog class and a Cat class inherit from an Animal class, as both dogs and cats are animals.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/f92cd6a8-9454-4db5-8545-6b1f6c9ef1ff_1744x1186.png)](https://substackcdn.com/image/fetch/$s_!TX1D!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff92cd6a8-9454-4db5-8545-6b1f6c9ef1ff_1744x1186.png)

#### 5. Realization (Implementation)

Realization or implementation represents a relationship between a class and an interface, where the class implements the methods declared in the interface.

**Example:** A Rectangle class and a Circle class implement the Shape interface, which declares a getArea() method.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/2b28dc2c-9bbe-4358-925e-5819bb81d722_1744x1234.png)](https://substackcdn.com/image/fetch/$s_!jqnL!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2b28dc2c-9bbe-4358-925e-5819bb81d722_1744x1234.png)

#### 6. Dependency

Dependency represents a "uses" relationship where a change in one class (the supplier) may affect the other class (the client).

**Example:**  A Customer class uses an Order class to place order.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/1990f218-1fdd-45f5-8e23-62bf2dbcbb40_1956x456.png)](https://substackcdn.com/image/fetch/$s_!t_t7!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1990f218-1fdd-45f5-8e23-62bf2dbcbb40_1956x456.png)

### Combined Example

Here's a comprehensive example that includes various types of relationships:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/72d3654b-44b5-4708-a634-527534bd0937_3772x3040.png)](https://substackcdn.com/image/fetch/$s_!lMAf!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F72d3654b-44b5-4708-a634-527534bd0937_3772x3040.png)

The relationships between the classes are as follows:

- **Inheritance:**  Dog and Cat inherit from Animal.
- **Realization/Implementation:**  Dog and Cat implement the Pet interface.
- **Aggregation:**  Person has an aggregation relationship with Pet, indicating that a person can have multiple pets.
- **Composition:**  Person has a composition relationship with Address, indicating that an address cannot exist without a person.
- **Association:**  Person has an association relationship with Phone, indicating that a person can have multiple phone numbers.
- **Dependency:**  Phone depends on the PhoneType enumeration for the phoneType attribute.

Among the six types of relationships, the code structure of composition, aggregation, and association is the same, and it can be understood from the strength of the relationship. The order from strong to weak is:  **inheritance → implementation → composition → aggregation → association → dependency**



Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
