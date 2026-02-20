---
title: "OOP concepts in Typescript"
description: "Learn TypeScript OOP concepts like classes, constructors, access modifiers, getters/setters, static members, abstract classes, and composition with practical examples."
datePublished: 2026-02-13
dateModified: 2026-02-13
topics:
  - javascript
courseName: 00-understand-javascript-complete
showOnArticles: false
featured: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758725512/Portfolio/javaScriptCourse/images/0_eestcm.png)  


## Mastering TypeScript OOP: Classes, Access Modifiers & More

TypeScript is a powerful superset of JavaScript that introduces additional syntax and features, making object-oriented programming (OOP) more robust and developer-friendly. In this comprehensive guide, we will explore the core OOP concepts in TypeScript, such as classes, constructors, access modifiers, getters and setters, static members, abstract classes, and composition, with practical code examples to help you grasp each topic effectively.

## Understanding TypeScript and Its OOP Foundation

TypeScript extends JavaScript with static typing, class-based object orientation, and other modern programming features. Since TypeScript compiles down to JavaScript, all its OOP concepts are compatible with JavaScript’s runtime behavior but offer stronger typing and better code organization.

### What is Object-Oriented Programming (OOP)?

OOP is a programming paradigm based on the concept of “objects,” which can contain data in the form of fields (properties) and code in the form of procedures (methods). TypeScript enhances OOP by allowing developers to define strict structures and behavior within classes.

## Defining Classes and Constructors in TypeScript

### Creating Basic Classes

In TypeScript, defining a class is straightforward and similar to JavaScript, but with type annotations for properties:

```typescript
class Tea {
  flavor: string;
  price: number;
}
```

Here, `flavor` is a string, and `price` is a number, representing basic properties of the Tea class.

### Adding a Constructor

To initialize class properties at the time of object creation, TypeScript uses constructors:

```typescript
class Tea {
  flavor: string;
  price: number;

  constructor(flavor: string, price: number) {
    this.flavor = flavor;
    this.price = price;
  }
}
```

The constructor enforces that every new Tea object must have a flavor and price assigned, ensuring consistency.

### Creating Instances

You create instances of classes using the `new` keyword:

```typescript
const gingerTea = new Tea("Ginger", 20);
```

This creates a Tea object with flavor "Ginger" and price 20.

## Exploring the `this` Keyword in TypeScript Classes

Within class methods, `this` refers to the current instance of the object:

- It gives access to the instance’s properties and methods.
- Each new object created with the class has its own `this` context.

For example:

```typescript
console.log(gingerTea.flavor); // Output: Ginger
```

Here, `this.flavor` inside the class would point to `"Ginger"` for this object.

## Access Modifiers: Controlling Property Access

TypeScript introduces access modifiers to control the visibility and access level of class members.

### Public Modifier

- Default in TypeScript.
- Properties and methods are accessible from anywhere.

```typescript
class Tea {
  public flavor: string;

  constructor(flavor: string) {
    this.flavor = flavor;
  }
}
```

### Private Modifier

- Accessible only within the class itself.
- Cannot be accessed or modified outside the class.
- Useful for hiding sensitive data or internal logic.

```typescript
class Tea {
  private secretIngredient: string = "Cardamom";

  revealSecret() {
    return this.secretIngredient;
  }
}

const chai = new Tea();
console.log(chai.revealSecret());  // Cardamom
```

Trying to access `secretIngredient` directly outside the class will cause an error.

### Protected Modifier

- Accessible within the class and subclasses (inheritance).
- Ideal for members that should be hidden from outside but available to derived classes.

```typescript
class Shop {
  protected shopName: string = "Tea Corner";
}

class Branch extends Shop {
  getShopName() {
    return this.shopName;
  }
}
```

Here, `shopName` is not accessible outside, but the `Branch` subclass can access it.

## Getters and Setters: Controlled Access to Properties

When you want controlled reading or writing of private properties, use getters and setters.

### Defining Getters and Setters

```typescript
class ModernTea {
  private _sugar: number;

  constructor(sugar: number) {
    this._sugar = sugar;
  }

  get sugar() {
    return this._sugar;
  }

  set sugar(value: number) {
    if (value > 5) {
      throw new Error("Too sweet!");
    }
    this._sugar = value;
  }
}
```

- The getter allows you to read the private `_sugar` property.
- The setter allows you to add validation or control assignment.

### Using Getters and Setters

```typescript
const tea = new ModernTea(3);
console.log(tea.sugar); // 3
tea.sugar = 4; // Valid
// tea.sugar = 6; // Throws Error: Too sweet!
```

This approach encapsulates internal state and adds business logic to property manipulation.

## Readonly Properties: Immutable Class Members

Sometimes, you want properties that can be assigned only once and then remain constant.

```typescript
class Cup {
  readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }
}
```

Attempting to modify `capacity` after initialization will result in a compilation error, ensuring immutability.

## Static Members: Shared Properties and Methods

Static members belong to the class itself rather than any instance.

```typescript
class TeaShop {
  static shopName: string = "TeaCode Cafe";

  static getShopInfo() {
    return `Welcome to ${TeaShop.shopName}`;
  }
}
```

- Access static members via the class name:

```typescript
console.log(TeaShop.shopName); // TeaCode Cafe
console.log(TeaShop.getShopInfo()); // Welcome to TeaCode Cafe
```

- Instances do not carry static members.

## Abstract Classes: Defining Blueprints for Subclasses

Abstract classes define contracts (abstract methods) that derived classes must implement, but they cannot be instantiated directly.

```typescript
abstract class Drink {
  abstract make(): void;
}

class MyTea extends Drink {
  make() {
    console.log("Brewing tea...");
  }
}
```

Attempting to instantiate `Drink` directly will throw an error, enforcing subclass implementation of required methods.

## Composition vs Inheritance: Flexible Code Reuse

### Inheritance

- Extends a base class to create a specialized subclass.
- Enables code reuse but may lead to tight coupling.

```typescript
class Branch extends Shop {}
```

### Composition

- Builds classes by including instances of other classes.
- Promotes flexibility and loose coupling.

```typescript
class Heater {
  heat() {
    console.log("Heating...");
  }
}

class TeaMaker {
  private heater: Heater;

  constructor(heater: Heater) {
    this.heater = heater;
  }

  make() {
    this.heater.heat();
    console.log("Making tea...");
  }
}
```

Here, `TeaMaker` uses `Heater` as a component, demonstrating composition.

## Key Takeaways for TypeScript OOP

- **Classes and constructors** form the foundation of TypeScript OOP, allowing structured data and behavior.
- **Access modifiers (public, private, protected)** control visibility and encapsulation.
- **Getters and setters** provide controlled access to private data.
- **Readonly properties** ensure immutability.
- **Static members** belong to the class, not instances.
- **Abstract classes** enforce a blueprint for subclasses.
- **Composition** offers an alternative to inheritance for flexible design.
- TypeScript’s OOP features build on JavaScript’s capabilities, adding typing and better tooling support.

## Frequently Asked Questions (FAQ)

### 1. Can TypeScript classes be used without defining constructors?

Yes, if no constructor is defined, TypeScript provides a default constructor. However, defining constructors explicitly helps initialize properties properly.

### 2. What is the difference between private and protected modifiers?

`private` members are accessible only within the same class, while `protected` members are accessible within the class and its subclasses.

### 3. Are static members accessible through class instances?

No, static members belong to the class itself and are accessed via the class name, not instances.

### 4. Why use abstract classes in TypeScript?

Abstract classes enforce certain methods to be implemented by subclasses, providing a blueprint and preventing instantiation of incomplete classes.



Mastering these OOP foundations in TypeScript empowers you to write clean, maintainable, and scalable code. Start applying these concepts in your projects to harness the full potential of TypeScript's object-oriented capabilities!