---
title: "Prototypes and Prototype Chain"
description: "JavaScript's prototype system is unique among programming languages. Instead of traditional classes, JavaScript uses prototypes for inheritance. Understanding the prototype chain is crucial for grasping how JavaScript objects inherit properties and methods from one another."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-25"
datePublished: "2025-09-25"
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
resources:
  - title: "JS course PDF - 10"
    type: "PDF"
    url: "https://res.cloudinary.com/duojkrgue/image/upload/v1758792130/Portfolio/javaScriptCourse/pdf/JavaScript-day10_Prototypes_compressed.pdf"
    description: "A PDF Notes on Prototypes and Prototype Chain topic"
  - title: "MDN - Object prototypes"
    type: "documentation"
    url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes"
    description: "Comprehensive guide to JavaScript prototypes from MDN"
  - title: "MDN - Inheritance and the prototype chain"
    type: "documentation"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain"
    description: "Detailed explanation of JavaScript's prototype-based inheritance"
  - title: "JavaScript.info - Prototypal inheritance"
    type: "article"
    url: "https://javascript.info/prototype-inheritance"
    description: "In-depth tutorial on prototypal inheritance with examples"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758811616/Portfolio/javaScriptCourse/images/all%20title%20images/11_kmovpj.png)

Prototypes and Prototype Chain – The Family Tree of JavaScript
=============================================================

Imagine you're a **genealogist** 🌳 studying family trees. Every person has:

- **Their own unique traits** (eye color, skills, memories)
- **Inherited traits from parents** (family name, genetic features)
- **Family traditions** passed down through generations
- **The ability to pass traits to their children**

In JavaScript, **prototypes** work exactly like this family tree system. Every object has its own properties, but it can also **inherit** properties and methods from its "parent" prototype. When you look for a property on an object, JavaScript searches up the **prototype chain** like tracing a family lineage – first checking the object itself, then its parent, then grandparent, and so on.

This prototype system is what makes JavaScript unique – instead of traditional classes, it uses **prototype-based inheritance** that's both powerful and flexible.

## What Are Prototypes? 🧬

A **prototype** is an object that serves as a template for other objects. Think of it as the **family blueprint** that defines shared characteristics and behaviors.

### Every Object Has a Prototype 👨‍👩‍👧‍👦

```javascript
// Create a simple object
const person = {
  name: "Alice",
  age: 30
};

// Every object has a hidden [[Prototype]] property
console.log(person.__proto__); // Object.prototype
console.log(Object.getPrototypeOf(person)); // Same as above (preferred method)

// Check if object has a specific prototype
console.log(Object.prototype.isPrototypeOf(person)); // true
```

### The Prototype Chain in Action 🔗

```javascript
// When you access a property, JavaScript searches:
// 1. The object itself
// 2. Its prototype
// 3. Its prototype's prototype
// 4. Until it reaches null

const person = {
  name: "Alice"
};

// These methods aren't on person, but available through prototype chain
console.log(person.toString()); // "[object Object]" - from Object.prototype
console.log(person.hasOwnProperty('name')); // true - from Object.prototype
console.log(person.valueOf()); // person object - from Object.prototype

// Checking where properties come from
console.log(person.hasOwnProperty('name')); // true (own property)
console.log(person.hasOwnProperty('toString')); // false (inherited)
```

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758812001/Portfolio/javaScriptCourse/images/10/prototype_chain.png)

## Creating Objects with Prototypes 🏗️

### Constructor Functions – The Family Founders 👑

```javascript
// Constructor function - creates objects with shared prototype
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Add methods to the prototype (shared by all instances)
Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

Person.prototype.getAge = function() {
  return `I'm ${this.age} years old`;
};

Person.prototype.haveBirthday = function() {
  this.age++;
  return `Happy birthday! Now I'm ${this.age}`;
};

// Create instances
const alice = new Person("Alice", 30);
const bob = new Person("Bob", 25);

console.log(alice.greet()); // "Hello, I'm Alice"
console.log(bob.greet()); // "Hello, I'm Bob"

// Both share the same methods (memory efficient)
console.log(alice.greet === bob.greet); // true (same function reference)

// But have their own data
console.log(alice.name === bob.name); // false
```

### Object.create() – Direct Inheritance 🎯

```javascript
// Create a prototype object
const animalPrototype = {
  eat() {
    return `${this.name} is eating`;
  },
  
  sleep() {
    return `${this.name} is sleeping`;
  },
  
  introduce() {
    return `I'm ${this.name}, a ${this.species}`;
  }
};

// Create objects with specific prototype
const dog = Object.create(animalPrototype);
dog.name = "Buddy";
dog.species = "Dog";
dog.bark = function() {
  return `${this.name} says Woof!`;
};

const cat = Object.create(animalPrototype);
cat.name = "Whiskers";
cat.species = "Cat";
cat.meow = function() {
  return `${this.name} says Meow!`;
};

console.log(dog.introduce()); // "I'm Buddy, a Dog"
console.log(cat.introduce()); // "I'm Whiskers, a Cat"
console.log(dog.bark()); // "Buddy says Woof!"
console.log(cat.meow()); // "Whiskers says Meow!"

// Shared methods from prototype
console.log(dog.eat()); // "Buddy is eating"
console.log(cat.sleep()); // "Whiskers is sleeping"
```

### Setting and Changing Prototypes 🔄

```javascript
const baseObject = {
  getType() {
    return "Base Object";
  }
};

const specialObject = {
  getType() {
    return "Special Object";
  },
  
  special() {
    return "I'm special!";
  }
};

// Create object with baseObject as prototype
const myObject = Object.create(baseObject);
myObject.name = "Test";

console.log(myObject.getType()); // "Base Object"

// Change the prototype
Object.setPrototypeOf(myObject, specialObject);
console.log(myObject.getType()); // "Special Object"
console.log(myObject.special()); // "I'm special!"

// Check prototype
console.log(Object.getPrototypeOf(myObject) === specialObject); // true
```

## The Complete Prototype Chain 🪜

### Built-in Object Hierarchy 📊

```javascript
// Array prototype chain
const myArray = [1, 2, 3];

console.log("=== Array Prototype Chain ===");
console.log("myArray:", myArray);
console.log("myArray.__proto__:", myArray.__proto__); // Array.prototype
console.log("myArray.__proto__.__proto__:", myArray.__proto__.__proto__); // Object.prototype
console.log("myArray.__proto__.__proto__.__proto__:", myArray.__proto__.__proto__.__proto__); // null

// Function prototype chain
function myFunction() {}

console.log("=== Function Prototype Chain ===");
console.log("myFunction.__proto__:", myFunction.__proto__); // Function.prototype
console.log("myFunction.__proto__.__proto__:", myFunction.__proto__.__proto__); // Object.prototype
console.log("myFunction.__proto__.__proto__.__proto__:", myFunction.__proto__.__proto__.__proto__); // null

// String prototype chain
const myString = "Hello";

console.log("=== String Prototype Chain ===");
console.log("myString.__proto__:", myString.__proto__); // String.prototype
console.log("myString.__proto__.__proto__:", myString.__proto__.__proto__); // Object.prototype
console.log("myString.__proto__.__proto__.__proto__:", myString.__proto__.__proto__.__proto__); // null
```

### Custom Inheritance Chain 🏗️

```javascript
// Create a multi-level inheritance hierarchy
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  return `${this.name} is eating`;
};

Animal.prototype.sleep = function() {
  return `${this.name} is sleeping`;
};

// Mammal inherits from Animal
function Mammal(name, warmBlooded = true) {
  Animal.call(this, name); // Call parent constructor
  this.warmBlooded = warmBlooded;
}

// Set up inheritance
Mammal.prototype = Object.create(Animal.prototype);
Mammal.prototype.constructor = Mammal;

Mammal.prototype.giveBirth = function() {
  return `${this.name} gives birth to live young`;
};

// Dog inherits from Mammal
function Dog(name, breed) {
  Mammal.call(this, name);
  this.breed = breed;
}

Dog.prototype = Object.create(Mammal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return `${this.name} barks loudly!`;
};

Dog.prototype.wagTail = function() {
  return `${this.name} wags tail happily`;
};

// Create instance
const buddy = new Dog("Buddy", "Golden Retriever");

// Test inheritance chain
console.log(buddy.bark()); // From Dog.prototype
console.log(buddy.giveBirth()); // From Mammal.prototype
console.log(buddy.eat()); // From Animal.prototype
console.log(buddy.toString()); // From Object.prototype

// Check the chain
console.log(buddy instanceof Dog); // true
console.log(buddy instanceof Mammal); // true
console.log(buddy instanceof Animal); // true
console.log(buddy instanceof Object); // true
```

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758812334/Portfolio/javaScriptCourse/images/10/inheritance_chain.png)

## Prototype Manipulation and Inspection 🔍

### Checking Property Sources 🕵️‍♂️

```javascript
const parent = {
  parentProp: "I'm from parent",
  sharedProp: "Parent version"
};

const child = Object.create(parent);
child.childProp = "I'm from child";
child.sharedProp = "Child version"; // Shadows parent property

// Different ways to check properties
console.log("=== Property Checks ===");
console.log("childProp" in child); // true (checks entire chain)
console.log(child.hasOwnProperty("childProp")); // true (own property only)
console.log(child.hasOwnProperty("parentProp")); // false (inherited)

console.log("sharedProp" in child); // true
console.log(child.hasOwnProperty("sharedProp")); // true (shadowed)

// Get property descriptors
console.log(Object.getOwnPropertyDescriptor(child, "childProp"));
console.log(Object.getOwnPropertyDescriptor(child, "parentProp")); // undefined (not own)

// List own properties only
console.log(Object.getOwnPropertyNames(child)); // ["childProp", "sharedProp"]
console.log(Object.keys(child)); // ["childProp", "sharedProp"]
```

### Property Shadowing – When Children Override Parents 👥

```javascript
const grandparent = {
  wisdom: "Always be kind",
  tradition: "Family dinner every Sunday"
};

const parent = Object.create(grandparent);
parent.wisdom = "Work hard, play harder"; // Shadows grandparent
parent.advice = "Save money for the future";

const child = Object.create(parent);
child.wisdom = "YOLO!"; // Shadows both parent and grandparent
child.hobby = "Gaming";

console.log("=== Property Shadowing ===");
console.log("Child wisdom:", child.wisdom); // "YOLO!"
console.log("Parent wisdom:", parent.wisdom); // "Work hard, play harder"
console.log("Grandparent wisdom:", grandparent.wisdom); // "Always be kind"

// Accessing shadowed properties
console.log("Parent's wisdom via prototype:", Object.getPrototypeOf(child).wisdom);
console.log("Grandparent's wisdom:", Object.getPrototypeOf(Object.getPrototypeOf(child)).wisdom);

// Delete child's property to reveal parent's
delete child.wisdom;
console.log("After deletion:", child.wisdom); // "Work hard, play harder"
```

## Advanced Prototype Patterns 🚀

### Mixin Pattern – Multiple Inheritance 🧩

```javascript
// Since JavaScript doesn't support multiple inheritance,
// we can use mixins to combine behaviors

const Flyable = {
  fly() {
    return `${this.name} is flying high!`;
  },
  
  land() {
    return `${this.name} has landed safely`;
  }
};

const Swimmable = {
  swim() {
    return `${this.name} is swimming gracefully`;
  },
  
  dive() {
    return `${this.name} dives deep underwater`;
  }
};

const Walkable = {
  walk() {
    return `${this.name} is walking steadily`;
  },
  
  run() {
    return `${this.name} is running fast`;
  }
};

// Mixin function
function mixin(target, ...sources) {
  sources.forEach(source => {
    Object.getOwnPropertyNames(source).forEach(name => {
      if (name !== 'constructor') {
        Object.defineProperty(target, name, Object.getOwnPropertyDescriptor(source, name));
      }
    });
  });
  return target;
}

// Create animals with different capabilities
function Bird(name) {
  this.name = name;
}

function Duck(name) {
  this.name = name;
}

function Fish(name) {
  this.name = name;
}

// Mix in capabilities
mixin(Bird.prototype, Flyable, Walkable);
mixin(Duck.prototype, Flyable, Swimmable, Walkable);
mixin(Fish.prototype, Swimmable);

// Test the mixins
const eagle = new Bird("Eagle");
const duck = new Duck("Donald");
const shark = new Fish("Bruce");

console.log(eagle.fly()); // "Eagle is flying high!"
console.log(eagle.walk()); // "Eagle is walking steadily"

console.log(duck.fly()); // "Donald is flying high!"
console.log(duck.swim()); // "Donald is swimming gracefully"
console.log(duck.walk()); // "Donald is walking steadily"

console.log(shark.swim()); // "Bruce is swimming gracefully"
console.log(shark.dive()); // "Bruce dives deep underwater"
```

### Factory with Prototypes – Controlled Object Creation 🏭

```javascript
// Factory function that creates objects with shared prototypes
function createVehicleFactory() {
  // Shared methods for all vehicles
  const vehiclePrototype = {
    start() {
      this.isRunning = true;
      return `${this.make} ${this.model} has started`;
    },
    
    stop() {
      this.isRunning = false;
      return `${this.make} ${this.model} has stopped`;
    },
    
    getInfo() {
      return `${this.year} ${this.make} ${this.model}`;
    }
  };
  
  // Car-specific prototype
  const carPrototype = Object.create(vehiclePrototype);
  carPrototype.drive = function() {
    return this.isRunning ? `${this.getInfo()} is driving on road` : "Start the car first!";
  };
  
  // Motorcycle-specific prototype
  const motorcyclePrototype = Object.create(vehiclePrototype);
  motorcyclePrototype.ride = function() {
    return this.isRunning ? `${this.getInfo()} is cruising` : "Start the motorcycle first!";
  };
  
  return {
    createCar(make, model, year) {
      const car = Object.create(carPrototype);
      car.make = make;
      car.model = model;
      car.year = year;
      car.type = 'car';
      car.isRunning = false;
      return car;
    },
    
    createMotorcycle(make, model, year) {
      const motorcycle = Object.create(motorcyclePrototype);
      motorcycle.make = make;
      motorcycle.model = model;
      motorcycle.year = year;
      motorcycle.type = 'motorcycle';
      motorcycle.isRunning = false;
      return motorcycle;
    }
  };
}

// Use the factory
const vehicleFactory = createVehicleFactory();

const myCar = vehicleFactory.createCar("Toyota", "Camry", 2023);
const myBike = vehicleFactory.createMotorcycle("Harley", "Sportster", 2022);

console.log(myCar.start()); // "Toyota Camry has started"
console.log(myCar.drive()); // "2023 Toyota Camry is driving on road"

console.log(myBike.start()); // "Harley Sportster has started"
console.log(myBike.ride()); // "2022 Harley Sportster is cruising"

// Check prototype chain
console.log(Object.getPrototypeOf(myCar).hasOwnProperty('drive')); // true
console.log(Object.getPrototypeOf(Object.getPrototypeOf(myCar)).hasOwnProperty('start')); // true
```

### Prototype-based Module System 📦

```javascript
// Create a module system using prototypes
const ModuleBase = {
  init() {
    this.initialized = true;
    this.createdAt = new Date();
    return this;
  },
  
  getName() {
    return this.name || 'Unnamed Module';
  },
  
  getStatus() {
    return this.initialized ? 'Active' : 'Inactive';
  }
};

// Create different module types
const AuthModule = Object.create(ModuleBase);
AuthModule.name = 'Authentication';
AuthModule.login = function(username, password) {
  // Simulate login
  return `${username} logged in successfully`;
};
AuthModule.logout = function() {
  return 'User logged out';
};

const DatabaseModule = Object.create(ModuleBase);
DatabaseModule.name = 'Database';
DatabaseModule.connect = function(connectionString) {
  return `Connected to database: ${connectionString}`;
};
DatabaseModule.query = function(sql) {
  return `Executing query: ${sql}`;
};

// Create instances
const auth = Object.create(AuthModule).init();
const db = Object.create(DatabaseModule).init();

console.log(auth.getName()); // "Authentication"
console.log(auth.getStatus()); // "Active"
console.log(auth.login("alice", "password123")); // "alice logged in successfully"

console.log(db.getName()); // "Database"
console.log(db.connect("mongodb://localhost")); // "Connected to database: mongodb://localhost"
```

## Performance and Memory Considerations 📊

### Memory Efficiency with Prototypes 💾

```javascript
// Inefficient: Methods defined in constructor (memory waste)
function Person1(name) {
  this.name = name;
  
  // Each instance gets its own copy of these functions
  this.greet = function() {
    return `Hello, I'm ${this.name}`;
  };
  
  this.introduce = function() {
    return `My name is ${this.name}`;
  };
}

// Efficient: Methods on prototype (shared memory)
function Person2(name) {
  this.name = name;
}

// Shared methods on prototype
Person2.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

Person2.prototype.introduce = function() {
  return `My name is ${this.name}`;
};

// Test memory usage
const people1 = [];
const people2 = [];

for (let i = 0; i < 1000; i++) {
  people1.push(new Person1(`Person1-${i}`));
  people2.push(new Person2(`Person2-${i}`));
}

// Person1 instances: 1000 objects × 2 methods = 2000 function objects
// Person2 instances: 1000 objects + 2 shared methods = 1002 function objects

console.log("People1 first greet === People1 second greet:", 
           people1[0].greet === people1[1].greet); // false (different objects)

console.log("People2 first greet === People2 second greet:", 
           people2[0].greet === people2[1].greet); // true (shared reference)
```

### Prototype Chain Performance 🏃‍♂️

```javascript
// Deeper prototype chains = slower property access
const deep1 = {};
const deep2 = Object.create(deep1);
const deep3 = Object.create(deep2);
const deep4 = Object.create(deep3);
const deep5 = Object.create(deep4);

// Add property at the top of chain
deep1.slowProperty = "I'm deep in the chain";

// Performance test
function performanceTest() {
  const iterations = 1000000;
  
  // Direct property access
  const direct = { fastProperty: "I'm directly accessible" };
  
  console.time("Direct access");
  for (let i = 0; i < iterations; i++) {
    direct.fastProperty;
  }
  console.timeEnd("Direct access");
  
  // Deep prototype chain access
  console.time("Deep chain access");
  for (let i = 0; i < iterations; i++) {
    deep5.slowProperty;
  }
  console.timeEnd("Deep chain access");
}

// performanceTest(); // Uncomment to see the difference

// Best practice: Keep prototype chains shallow
```

## Common Pitfalls and Debugging 🐛

### Prototype Pollution 💥

```javascript
// Dangerous: Modifying built-in prototypes
// DON'T DO THIS in production code!

// Bad example (for educational purposes only)
Object.prototype.customMethod = function() {
  return "I'm on every object now!";
};

const innocentObject = { name: "test" };
console.log(innocentObject.customMethod()); // "I'm on every object now!"

// This affects ALL objects in your application
for (let key in innocentObject) {
  console.log(key); // Includes 'customMethod' from prototype
}

// Clean up (in real code, you can't undo this easily)
delete Object.prototype.customMethod;

// Safe alternative: Create your own base objects
const SafeBase = {
  customMethod() {
    return "I'm only on objects that inherit from SafeBase";
  }
};

const safeObject = Object.create(SafeBase);
safeObject.name = "safe";
console.log(safeObject.customMethod()); // Safe!
```

### Common Mistakes 🤔

```javascript
// Mistake 1: Forgetting to set constructor
function Animal(name) {
  this.name = name;
}

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
// Forgot this line: Dog.prototype.constructor = Dog;

const buddy = new Dog("Buddy", "Labrador");
console.log(buddy.constructor === Dog); // false (should be true)
console.log(buddy.constructor === Animal); // true (wrong!)

// Fix it
Dog.prototype.constructor = Dog;
const max = new Dog("Max", "Poodle");
console.log(max.constructor === Dog); // true (correct!)

// Mistake 2: Modifying prototype after creating instances
function Cat(name) {
  this.name = name;
}

const fluffy = new Cat("Fluffy");

Cat.prototype.meow = function() {
  return `${this.name} says meow!`;
};

console.log(fluffy.meow()); // Works! (prototype is live)

// But this can be confusing - better to define methods before creating instances
```

## Common Interview Questions & Answers 🎯

### Q1: What's the difference between `__proto__` and `prototype`?
```javascript
function Person(name) {
  this.name = name;
}

const alice = new Person("Alice");

// __proto__ is the actual prototype link (instance property)
console.log(alice.__proto__ === Person.prototype); // true

// prototype is the property on constructor functions
console.log(Person.prototype); // Object with constructor and methods

// __proto__ is deprecated, use Object.getPrototypeOf()
console.log(Object.getPrototypeOf(alice) === Person.prototype); // true
```

### Q2: How do you check if an object is in another object's prototype chain?
```javascript
function Animal() {}
function Dog() {}
Dog.prototype = Object.create(Animal.prototype);

const buddy = new Dog();

// Method 1: instanceof
console.log(buddy instanceof Dog); // true
console.log(buddy instanceof Animal); // true

// Method 2: isPrototypeOf
console.log(Dog.prototype.isPrototypeOf(buddy)); // true
console.log(Animal.prototype.isPrototypeOf(buddy)); // true

// Method 3: Walk the prototype chain
function isInPrototypeChain(obj, prototype) {
  let current = Object.getPrototypeOf(obj);
  while (current) {
    if (current === prototype) return true;
    current = Object.getPrototypeOf(current);
  }
  return false;
}
```

### Q3: What happens when you modify a prototype property?
```javascript
function User(name) {
  this.name = name;
}

User.prototype.role = 'user';

const alice = new User('Alice');
const bob = new User('Bob');

console.log(alice.role); // 'user'
console.log(bob.role); // 'user'

// Modify prototype
User.prototype.role = 'admin';

console.log(alice.role); // 'admin' (both changed!)
console.log(bob.role); // 'admin'

// But if you set on instance, it shadows the prototype
alice.role = 'moderator';
console.log(alice.role); // 'moderator'
console.log(bob.role); // 'admin'
```

## Summary

### Prototypes
- **Every object has a prototype** (except objects created with `Object.create(null)`)
- **Prototypes enable inheritance** through the prototype chain
- **Constructor functions** create objects with shared prototypes
- **Object.create()** allows direct prototype specification
- **`__proto__`** is deprecated, use `Object.getPrototypeOf()`

### Prototype Chain
- **Property lookup** walks up the chain from object to prototype to prototype...
- **Ends at `null`** (Object.prototype's prototype)
- **Property shadowing** occurs when child objects override parent properties
- **Memory efficient** because methods are shared, not duplicated

### Advanced Concepts
- **Mixin pattern** for multiple inheritance-like behavior
- **Factory functions** with prototypes for controlled object creation
- **Prototype pollution** is dangerous and should be avoided
- **Performance** degrades with deeper prototype chains

### Best Practices
- Define methods on prototypes, not in constructors
- Keep prototype chains shallow for better performance
- Never modify built-in prototypes in production code
- Always set the constructor property when setting up inheritance
- Use `Object.create()` for clean prototype relationships

### My Personal Insight
Prototypes were the most mind-bending concept when I started with JavaScript. Coming from class-based languages, the idea of objects inheriting directly from other objects felt alien.

The breakthrough came when I stopped thinking about "classes" and started thinking about **"family relationships"**. Each object is like a person who can inherit traits from their family line, but also develop their own unique characteristics.

Once I embraced the prototype system instead of fighting it, I realized it's actually more flexible than traditional classes. You can modify inheritance at runtime, mix behaviors from multiple sources, and create truly dynamic object relationships.

### Next Up
Now that you understand JavaScript's unique inheritance system, we'll explore **Classes and Inheritance** – the ES6+ syntax that provides a more familiar interface while still using prototypes under the hood.

Remember: Prototypes are JavaScript's DNA – they define how objects relate to each other and share behavior! 🧬
