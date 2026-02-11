---
title: "State Design Pattern"
description: "Learn the State Design Pattern to manage dynamic object behavior by encapsulating states, improving code scalability, readability, and maintainability in complex systems."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## Mastering the State Design Pattern for Scalable Behavior Management

![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

### Introduction to the State Design Pattern

The **State Design Pattern** is a powerful behavioral design pattern that enables an object to alter its behavior when its internal state changes, making it appear as if it belongs to a different class during runtime. This pattern is particularly useful in scenarios where an object has multiple distinct states, each defining different behavior based on the current context.


It’s particularly useful in situations where:

*   An object can be in one of **many distinct states**, each with different behavior.
*   The object’s behavior depends on **current context**, and that context **changes over time**.
*   You want to avoid large, monolithic `if-else` or `switch` statements that check for every possible state.

When faced with this kind of scenario, developers often start by using conditional logic inside a class to switch behavior based on state variables.

For example, a `Document` class might use `if-else` blocks to determine what to do based on whether it's in "Draft", "Review", or "Published" state.

But as the number of states grows, this approach becomes **hard to scale**, **difficult to test**, and **violates the Open/Closed Principle.** Any new state requires modifying existing logic, increasing the risk of breaking current functionality.

The **State Pattern** solves this by encapsulating each state into its **own class**, and letting the context object **delegate behavior to the current state object**. This makes your code easier to extend, reuse, and maintain without cluttering the core logic with conditionals.

Let’s walk through a real-world example to see how we can apply the State Pattern to manage dynamic behavior in a clean, scalable, and object-oriented way.

Imagine you're building a simple **vending machine system**. On the surface, it seems like a straightforward task: accept money, dispense products, and go back to idle.

But behind the scenes, the machine’s behavior needs to vary **depending on its current state**.


#### Why Use the State Pattern?

Traditional approaches often rely on large conditional statements (`if-else` or `switch`) to handle different states and behaviors inside a single class. While this may work initially, it becomes difficult to scale, test, and maintain as the number of states grows. Modifying such monolithic code also violates the Open/Closed Principle, as every new state requires changes to existing logic, risking bugs and code fragility.

The State Pattern addresses these shortcomings by encapsulating each state into its own class and letting the context object delegate behavior to the current state object. This design fosters modularity, extensibility, and cleaner codebases.


### Understanding State-Driven Behavior Through a Vending Machine Example

![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770794527/Portfolio/lldSystemDesign/img/fb637bb0-5e89-45c2-9c48-3ed4146dc3b0.png)

To grasp the State Pattern better, let’s explore a real-world example: a vending machine system. Although seemingly simple, the vending machine must behave differently depending on its current state:

- **IdleState**: Waiting for user input (no item selected, no money inserted).
- **ItemSelectedState**: An item has been selected, awaiting payment.
- **HasMoneyState**: Money has been inserted, ready to dispense the selected item.
- **DispensingState**: The machine is actively dispensing the item.

#### User Operations Supported by the Vending Machine

- `selectItem(String itemCode)`: Select an item for purchase.
- `insertCoin(double amount)`: Insert payment for the selected item.
- `dispenseItem()`: Trigger the dispensing process.

Each operation behaves differently depending on the machine’s current state. For example, calling `dispenseItem()` in `IdleState` should either do nothing or show an error message, while calling `insertCoin()` before selecting an item might be disallowed.

For example:

*   Calling `dispenseItem()` while the machine is in `IdleState` (no item selected, no money inserted) should **do nothing** or show an error.
*   Calling `insertCoin()` before selecting an item might be **disallowed or queued**.
*   Calling `selectItem()` during `DispensingState` should be **ignored** or deferred until the item is dispensed.

### The Naive Approach: Using switch-case Statements

A common implementation uses an enum and `switch` statements inside a single `VendingMachine` class to manage state transitions and behavior. Here’s a simplified overview:

```java
class VendingMachine {

    private enum State {
        IDLE, ITEM_SELECTED, HAS_MONEY, DISPENSING
    }

    private State currentState = State.IDLE;
    private String selectedItem = "";
    private double insertedAmount = 0.0;

    public void selectItem(String itemCode) {
        switch (currentState) {
            case IDLE:
                selectedItem = itemCode;
                currentState = State.ITEM_SELECTED;
                break;
            case ITEM_SELECTED:
                System.out.println("Item already selected");
                break;
            case HAS_MONEY:
                System.out.println("Payment already received for item");
                break;
            case DISPENSING:
                System.out.println("Currently dispensing");
                break;
        }
    }

    public void insertCoin(double amount) {
        switch (currentState) {
            case IDLE:
                System.out.println("No item selected");
                break;
            case ITEM_SELECTED:
                insertedAmount = amount;
                System.out.println("Inserted $" + amount + " for item");
                currentState = State.HAS_MONEY;
                break;
            case HAS_MONEY:
                System.out.println("Money already inserted");
                break;
            case DISPENSING:
                System.out.println("Currently dispensing");
                break;
        }
    }

    public void dispenseItem() {
        switch (currentState) {
            case IDLE:
                System.out.println("No item selected");
                break;
            case ITEM_SELECTED:
                System.out.println("Please insert coin first");
                break;
            case HAS_MONEY:
                System.out.println("Dispensing item '" + selectedItem + "'");
                currentState = State.DISPENSING;

                // Simulate delay and completion
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }

                System.out.println("Item dispensed successfully.");
                resetMachine();
                break;
            case DISPENSING:
                System.out.println("Already dispensing. Please wait.");
                break;
        }
    }

    private void resetMachine() {
        selectedItem = "";
        insertedAmount = 0.0;
        currentState = State.IDLE;
    }
}
```

#### Problems with This Approach
While using an `enum` with `switch` statements can work for small, predictable systems, this approach **doesn't scale well**.

#### 1\. Cluttered Code

All state-related logic is **stuffed into a single class** (`VendingMachine`), resulting in large and repetitive `switch` or `if-else` blocks across every method (`selectItem()`, `insertCoin()`, `dispenseItem()`, etc.).

This leads to:

*   Code that’s **hard to read and reason about**
*   Duplicate checks for state across multiple methods
*   Fragile logic when multiple developers touch the same file

#### 2\. Hard to Extend

Suppose you want to introduce new states like:

*   `OutOfStockState` – when the selected item is sold out
*   `MaintenanceState` – when the machine is undergoing service

To support these, you'd need to:

*   Update **every switch block** in every method
*   Add logic in multiple places
*   Risk breaking existing functionality

This violates the **Open/Closed Principle** — the system is open to modification when it should be open to extension.

#### 3\. Violates the Single Responsibility Principle

The `VendingMachine` class is now responsible for:

*   Managing **state transitions**
*   Implementing **business rules**
*   Executing **state-specific logic**

This tight coupling makes the class **monolithic**, hard to test, and resistant to change.

### What We Really Need

We need to **encapsulate the behavior associated with each state into its own class** — so the vending machine can delegate work to the current state object instead of managing it all internally.

This would allow us to:

*   Avoid switch-case madness
*   Add or remove states **without modifying the core class**
*   Keep each state’s logic **isolated and reusable**

This is exactly what the **State Design Pattern** enables.

### The State Design Pattern Solution

> The State pattern allows an object (the Context) to alter its behavior when its internal state changes. The object appears to change its class because its behavior is now delegated to a different state object.

Instead of embedding state-specific behavior inside the context class itself, the State Pattern **extracts that behavior into separate classes**, each representing a distinct state. The **context object holds a reference to a state object**, and delegates its operations to it.

This results in **cleaner, more modular, and extensible code**.

1.  Define a **State** interface (or abstract class) that declares methods representing the actions the Context can perform.
2.  Create **ConcreteState** classes, each implementing the State interface. Each ConcreteState class implements the behavior specific to that particular state of the Context.
3.  The **Context** class maintains an instance of a ConcreteState subclass that defines its current state.
4.  When an action is invoked on the Context, it delegates that action to its current State object.
5.  ConcreteState objects are often responsible for transitioning the Context to a new state.

### Class Diagram

![State Class Diagram](https://res.cloudinary.com/duojkrgue/image/upload/v1770794824/Portfolio/lldSystemDesign/img/2c0e7031-84b4-4308-983c-309147535994.png)


#### 1\. State Interface (e.g., `MachineState`)

*   Declares methods that correspond to the actions the context supports (e.g., `selectItem()`, `insertCoin()`, `dispenseItem()`).
*   These methods often take the context as a parameter, so the state can trigger transitions or manipulate context data.
*   Acts as a common contract for all concrete states.

#### 2\. Concrete States (e.g., `IdleState`, `ItemSelectedState`)

*   Implement the `State` interface.
*   Define **state-specific behavior** for each action.
*   Often responsible for **transitioning the context to another state** when a specific action occurs.
*   Can also include state-specific logic (e.g., validation, messaging).

#### 3\. Context (e.g., `VendingMachine`)

*   Maintains a reference to the current `State` object.
*   Defines methods for each action (`selectItem()`, `insertCoin()`, etc.).
*   Delegates calls to the current state — the state object handles the logic.
*   Provides a method like `setState()` to allow transitions between states.

# 3\. Implementing State Pattern

Instead of hardcoding state transitions and behaviors into a single monolithic class using `if-else` or `switch` statements, we’ll apply the **State Pattern** to separate concerns and make the vending machine easier to manage and extend.

### State Diagram

![State Class Diagram](https://res.cloudinary.com/duojkrgue/image/upload/v1770794828/Portfolio/lldSystemDesign/img/50a97948-3282-4b0d-ac6e-f11f716513bf.png)


### Applying the State Pattern to the Vending Machine

#### 1. Defining the State Interface

The interface declares all user-facing operations:

```java
interface MachineState {
    void selectItem(VendingMachine context, String itemCode);
    void insertCoin(VendingMachine context, double amount);
    void dispenseItem(VendingMachine context);
}
```

#### 2. Implementing Concrete States

Each state class implements the interface and defines behavior specific to its state.

#### IdleState

- Allows item selection.
- Rejects coin insertion and dispensing.

```java
class IdleState implements MachineState {
    public void selectItem(VendingMachine context, String itemCode) {
        System.out.println("Item selected: " + itemCode);
        context.setSelectedItem(itemCode);
        context.setState(new ItemSelectedState());
    }
    public void insertCoin(VendingMachine context, double amount) {
        System.out.println("Please select an item before inserting coins.");
    }
    public void dispenseItem(VendingMachine context) {
        System.out.println("No item selected. Nothing to dispense.");
    }
}
```

#### ItemSelectedState

- Rejects changing the selection.
- Accepts coin insertion, transitions to `HasMoneyState`.
- Prevents dispensing before payment.

```java
class ItemSelectedState implements MachineState {
    public void selectItem(VendingMachine context, String itemCode) {
        System.out.println("Item already selected: " + context.getSelectedItem());
    }
    public void insertCoin(VendingMachine context, double amount) {
        System.out.println("Inserted $" + amount + " for item: " + context.getSelectedItem());
        context.setInsertedAmount(amount);
        context.setState(new HasMoneyState());
    }
    public void dispenseItem(VendingMachine context) {
        System.out.println("Insert coin before dispensing.");
    }
}
```

#### HasMoneyState

- Prevents changing the item or inserting additional coins.
- Allows dispensing, then transitions to `DispensingState` and resets afterward.

```java
class HasMoneyState implements MachineState {
    public void selectItem(VendingMachine context, String itemCode) {
        System.out.println("Cannot change item after inserting money.");
    }
    public void insertCoin(VendingMachine context, double amount) {
        System.out.println("Money already inserted.");
    }
    public void dispenseItem(VendingMachine context) {
        System.out.println("Dispensing item: " + context.getSelectedItem());
        context.setState(new DispensingState());
        try { Thread.sleep(1000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        System.out.println("Item dispensed successfully.");
        context.reset();
    }
}
```

#### DispensingState

- Blocks selection, coin insertion, and dispensing until current process completes.

```java
class DispensingState implements MachineState {
    public void selectItem(VendingMachine context, String itemCode) {
        System.out.println("Please wait, dispensing in progress.");
    }
    public void insertCoin(VendingMachine context, double amount) {
        System.out.println("Please wait, dispensing in progress.");
    }
    public void dispenseItem(VendingMachine context) {
        System.out.println("Already dispensing. Please wait.");
    }
}
```

#### 3. The Context Class (`VendingMachine`)

Maintains the current state and delegates actions:

```java
class VendingMachine {
    private MachineState currentState;
    private String selectedItem;
    private double insertedAmount;

    public VendingMachine() {
        this.currentState = new IdleState();
    }

    public void setState(MachineState newState) {
        this.currentState = newState;
    }

    public void setSelectedItem(String itemCode) {
        this.selectedItem = itemCode;
    }

    public void setInsertedAmount(double amount) {
        this.insertedAmount = amount;
    }

    public String getSelectedItem() {
        return selectedItem;
    }

    public void selectItem(String itemCode) {
        currentState.selectItem(this, itemCode);
    }

    public void insertCoin(double amount) {
        currentState.insertCoin(this, amount);
    }

    public void dispenseItem() {
        currentState.dispenseItem(this);
    }

    public void reset() {
        this.selectedItem = "";
        this.insertedAmount = 0.0;
        this.currentState = new IdleState();
    }
}
```


### Benefits of Using the State Design Pattern

#### 1. Cleaner Code and Separation of Concerns

Each state’s behavior is encapsulated in its own class, avoiding lengthy conditional logic and making the codebase easier to read and maintain.

#### 2. Easier to Extend

Adding new states (e.g., `OutOfStockState` or `MaintenanceState`) requires creating new state classes without modifying existing ones, adhering to the Open/Closed Principle.

#### 3. Improved Testing and Maintenance

Isolated state classes can be tested independently, and changes in one state have minimal impact on others.

#### 4. Better Adherence to SOLID Principles

- **Single Responsibility Principle:** Each state class has one responsibility—managing behavior for a particular state.
- **Open/Closed Principle:** New states can be added without changing existing code.
- **Liskov Substitution Principle:** All state classes implement the same interface, making them interchangeable.


### Example Client Code Using the State Pattern

```java
public class VendingMachineApp {
    public static void main(String[] args) {
        VendingMachine vm = new VendingMachine();

        vm.insertCoin(1.0); // Invalid in IdleState
        vm.selectItem("A1");
        vm.insertCoin(1.5);
        vm.dispenseItem();

        System.out.println("\n--- Second Transaction ---");
        vm.selectItem("B2");
        vm.insertCoin(2.0);
        vm.dispenseItem();
    }
}
```


### Conclusion

The State Design Pattern offers a robust way to manage objects whose behavior changes dynamically based on their internal state. By encapsulating state-specific behavior into dedicated classes and delegating responsibilities, it promotes cleaner, modular, and extensible code. As demonstrated with the vending machine example, this pattern simplifies complex state transitions, reduces conditional logic clutter, and aligns with solid software design principles.

Whether building vending machines, user interfaces, game characters, or workflow engines, mastering the State Pattern empowers developers to write scalable and maintainable code that elegantly handles dynamic behavior changes.


### Further Reading and Resources

- **Design Patterns: Elements of Reusable Object-Oriented Software** by Gamma et al.
- Online tutorials on behavioral design patterns.
- Source code examples illustrating state pattern implementations in different languages.


### FAQ

**Q1: Can the State Pattern be used in multithreaded environments?**  
Yes, but care must be taken to ensure thread safety when changing states and accessing shared resources.

**Q2: How does the State Pattern differ from Strategy Pattern?**  
While both involve encapsulating behavior, the State Pattern focuses on changing behavior based on state transitions internally, whereas the Strategy Pattern allows clients to choose algorithms or behaviors externally.

**Q3: What are common pitfalls when implementing the State Pattern?**  
A common mistake is tightly coupling the state classes to the context or not properly delegating state transitions, which can reduce flexibility.


By adopting the State Design Pattern, developers can transform complex, state-dependent systems into clean, maintainable, and extensible applications.

### Mind Map

![State Class Diagram](https://res.cloudinary.com/duojkrgue/image/upload/v1770794892/Portfolio/lldSystemDesign/img/NoteGPT_MindMap_1770794878009_axqecf.png)
