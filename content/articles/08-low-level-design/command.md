---
title: "Command Design Pattern"
description: "Learn how the Command Design Pattern decouples requests from execution, enabling scalable, undoable, and flexible smart home controls."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## Mastering the Command Design Pattern for Smart Home Control

![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

### Introduction to the Command Design Pattern

The **Command Design Pattern** is a powerful **behavioral pattern** that transforms requests into standalone objects. This approach offers remarkable benefits such as parameterizing actions, queuing operations, logging activities, and supporting undo/redo functionality. Crucially, it decouples the sender of a request from the object that performs the action, making software more modular, scalable, and maintainable.

This blog post explores the Command Pattern using a relatable real-world example — a Smart Home Controller that manages devices like lights, thermostats, and security systems. We’ll first understand the pitfalls of a naive design, then delve into the Command Pattern’s structure and implementation, finally showing how it can elegantly solve common architectural problems.


It’s particularly useful in situations where:

*   You want to **encapsulate operations** as objects.
*   You need to **queue, delay, or log requests**.
*   You want to **support undo/redo functionality**.
*   You want to **decouple the object that invokes an operation from the one that knows how to perform it**.

Let’s walk through a real-world example to see how we can apply the Command Pattern to decouple invokers from executors, and build a more flexible, extensible, and testable command execution framework.

### 1. The Problem: Tightly Coupled Smart Home Controller

Imagine you are tasked with building a Smart Home Hub that controls various devices such as:

*   💡 Smart lights
*   🌡️ Thermostats
*   🔒 Security systems
*   🔊 Smart speakers
*   🚪 Garage doors 

The hub should be able to send commands like:

*   `light.on()`, `light.off()`
*   `thermostat.setTemperature(22)`
*   `speaker.playMusic()`

A straightforward but naive approach might look like this:

#### Naive Implementation: One Controller Class

#### Light

```java
class Light {
    public void on() {
        System.out.println("Light turned ON");
    }

    public void off() {
        System.out.println("Light turned OFF");
    }
}
```

#### Thermostat

```java
class Thermostat {
    public void setTemperature(int temp) {
        System.out.println("Thermostat set to " + temp + "°C");
    }
}
```

#### Controller tightly coupled to devices

```java
class SmartHomeControllerV1 {
    private final Light light;
    private final Thermostat thermostat;

    public SmartHomeControllerV1(Light light, Thermostat thermostat) {
        this.light = light;
        this.thermostat = thermostat;
    }

    public void turnOnLight() {
        light.on();
    }

    public void turnOffLight() {
        light.off();
    }

    public void setThermostatTemperature(int temperature) {
        thermostat.setTemperature(temperature);
    }
}
```

#### Example Usage

```java
public class SmartHomeApp {
    public static void main(String[] args) {
        Light light = new Light();
        Thermostat thermostat = new Thermostat();
        SmartHomeControllerV1 controller = new SmartHomeControllerV1(light, thermostat);

        controller.turnOnLight();
        controller.setThermostatTemperature(22);
        controller.turnOffLight();
    }
}
```

While this works initially, it soon becomes problematic as you add more devices and features.

#### Why This Design Fails

- **Tight Coupling:** The controller is directly linked to every device and their specific methods, making it inflexible.  
- **Poor Scalability:** Adding new devices requires modifying the controller, leading to a bloated and complex class.  
- **No Undo Support:** There's no built-in way to reverse actions, forcing manual and error-prone state tracking.  
- **No Queuing or Scheduling:** You cannot queue or delay commands because actions are hardcoded method calls, not objects.  
- **No Generic Logging:** Logging every action requires duplicating code inside each method.  
- **Difficult UI Mapping:** Mapping commands to UI buttons or scenes requires custom logic for each, hindering reusability.

#### What We Really Need

To tackle these issues, every action should be encapsulated as a **Command object** that knows:

- **What to do**  
- **Which device to control**  
- **How to execute the action**  
- **(Optionally) How to undo it**

This abstraction allows the controller or UI to simply execute commands without knowing implementation details.

### 2. What is the Command Design Pattern?

The **Command Design Pattern** is a **behavioral design pattern** that encapsulates a request as an object, thereby letting you parameterize clients with queues, requests, and operations, and support undoable actions.


*   Parameterize actions
*   Queue or log operations
*   Support undo/redo
*   Decouple the **invoker** of an operation from the **receiver** that performs it

Instead of calling methods directly on device classes, you encapsulate each request (like `light.on()` or `thermostat.setTemperature(22)`) as a **Command object**.

### Class Diagram

![Command Class Diagram](https://res.cloudinary.com/duojkrgue/image/upload/v1770793972/Portfolio/lldSystemDesign/img/70ea184c-d9bf-47a8-bf58-0ce29dceb68c.png)


#### Core Components of the Command Pattern

**1. Command Interface:** Defines a standard method like `execute()` and optionally `undo()`. All commands implement this interface.

**2. Concrete Command:** Implements the Command interface and maintains a reference to a **Receiver**. It delegates the execution to the receiver’s method.

**3. Receiver:** The object that performs the actual work, such as a Light or Thermostat. It has no knowledge of commands or invokers.

**4. Invoker:** Holds a command and triggers its execution but does not know the command’s specifics.

**5. Client:** Creates concrete command instances, binds them to receivers, and assigns them to invokers.

#### How It Works

*   Each **Command** implements a standard interface like `execute()` (and optionally `undo()`)
*   The **Invoker** (e.g., remote control, scheduler, UI) simply calls `command.execute()`
*   The **Receiver** (e.g., `Light`, `Thermostat`) performs the actual operation when the command is executed

This separation ensures that invokers and receivers are loosely coupled, promoting flexibility and extensibility.

### 3. Implementing the Command Pattern in a Smart Home System

Let’s refactor the smart home controller to use the Command Pattern, adding support for undoable actions.

#### Step 1: Define the Command Interface

```java
interface Command {
    void execute();
    void undo();
}
```

#### Step 2: Define the Receivers (Devices)

```java
class Light {
    public void on() {
        System.out.println("Light turned ON");
    }
    public void off() {
        System.out.println("Light turned OFF");
    }
}

class Thermostat {
    private int currentTemperature = 20;

    public void setTemperature(int temp) {
        System.out.println("Thermostat set to " + temp + "°C");
        currentTemperature = temp;
    }

    public int getCurrentTemperature() {
        return currentTemperature;
    }
}
```

#### Step 3: Implement Concrete Command Classes

```java
class LightOnCommand implements Command {
    private final Light light;

    public LightOnCommand(Light light) {
        this.light = light;
    }

    @Override
    public void execute() {
        light.on();
    }

    @Override
    public void undo() {
        light.off();
    }
}

class LightOffCommand implements Command {
    private final Light light;

    public LightOffCommand(Light light) {
        this.light = light;
    }

    @Override
    public void execute() {
        light.off();
    }

    @Override
    public void undo() {
        light.on();
    }
}

class SetTemperatureCommand implements Command {
    private final Thermostat thermostat;
    private final int newTemperature;
    private int previousTemperature;

    public SetTemperatureCommand(Thermostat thermostat, int temperature) {
        this.thermostat = thermostat;
        this.newTemperature = temperature;
    }

    @Override
    public void execute() {
        previousTemperature = thermostat.getCurrentTemperature();
        thermostat.setTemperature(newTemperature);
    }

    @Override
    public void undo() {
        thermostat.setTemperature(previousTemperature);
    }
}
```

#### Step 4: Create the Invoker with Undo Support

```java
class SmartButton {
    private Command currentCommand;
    private final Stack<Command> history = new Stack<>();

    public void setCommand(Command command) {
        this.currentCommand = command;
    }

    public void press() {
        if (currentCommand != null) {
            currentCommand.execute();
            history.push(currentCommand);
        } else {
            System.out.println("No command assigned.");
        }
    }

    public void undoLast() {
        if (!history.isEmpty()) {
            Command lastCommand = history.pop();
            lastCommand.undo();
        } else {
            System.out.println("Nothing to undo.");
        }
    }
}
```

#### Step 5: Client Usage Example

```java
public class SmartHomeApp {
    public static void main(String[] args) {
        // Receivers
        Light light = new Light();
        Thermostat thermostat = new Thermostat();

        // Commands
        Command lightOn  = new LightOnCommand(light);
        Command lightOff = new LightOffCommand(light);
        Command setTemp22 = new SetTemperatureCommand(thermostat, 22);

        // Invoker
        SmartButton button = new SmartButton();

        // Simulate usage
        System.out.println("→ Pressing Light ON");
        button.setCommand(lightOn);
        button.press();

        System.out.println("→ Pressing Set Temp to 22°C");
        button.setCommand(setTemp22);
        button.press();

        System.out.println("→ Pressing Light OFF");
        button.setCommand(lightOff);
        button.press();

        // Undo sequence
        System.out.println("\n↶ Undo Last Action");
        button.undoLast();  // undo Light OFF

        System.out.println("↶ Undo Previous Action");
        button.undoLast();  // undo Set Temp

        System.out.println("↶ Undo Again");
        button.undoLast();  // undo Light ON
    }
}
```

#### Output

```
→ Pressing Light ON
Light turned ON
→ Pressing Set Temp to 22°C
Thermostat set to 22°C
→ Pressing Light OFF
Light turned OFF

↶ Undo Last Action
Light turned ON
↶ Undo Previous Action
Thermostat set to 20°C
↶ Undo Again
Light turned OFF
```

### 4. Benefits of Using the Command Pattern

- **Encapsulation of Requests:** Commands are objects encapsulating all information needed to perform an action.  
- **Decoupling Invoker and Receiver:** The invoker only interacts with the Command interface, unaware of implementation details.  
- **Extensibility:** Easily add new commands for additional devices without modifying existing code.  
- **Undo/Redo Support:** Commands can implement undo operations, tracked by the invoker for reversing actions.  
- **Queue and Scheduling:** Commands can be stored, queued, or scheduled for later execution.  
- **Logging and Auditing:** Maintain histories of commands executed for auditing or replay purposes.  
- **Simplified UI Integration:** Map UI buttons or voice commands to command objects without custom logic.

### 5. Extending the Pattern: Undo, Logging, and Queuing

#### Undo/Redo Functionality

By implementing the `undo()` method, commands can reverse their effects. The invoker can maintain a history stack to enable multiple undos and redos.

#### Logging Commands

Commands can be logged as discrete objects, capturing the details of each action, facilitating debugging, analytics, or replaying sequences.

#### Queuing and Scheduling

Commands can be placed in queues or scheduled with timers, enabling delayed or batch execution without changing the command logic.

### 6. Conclusion

The Command Design Pattern is a robust solution to managing complex operations in systems like smart homes. It elegantly solves issues of tight coupling, scalability, undo support, and extensibility by encapsulating requests as objects.

By adopting this pattern, developers can build flexible, maintainable, and extensible applications that separate concerns cleanly. Whether you’re building a smart home hub, a GUI with programmable buttons, or any system requiring operational flexibility, the Command Pattern is a powerful tool to have in your design arsenal.

#### Further Reading

- *Design Patterns: Elements of Reusable Object-Oriented Software* by Gamma et al.  
- Official Java Command Pattern tutorials  
- Real-world examples in IoT and remote control systems  

Master the Command Pattern today and transform your applications with clean, decoupled, and powerful design!

![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770794031/Portfolio/lldSystemDesign/img/NoteGPT_MindMap_1770793998812_zzjqqn.png)

