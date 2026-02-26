---
title: "S.O.L.I.D Principles Explained With Code"
description: "Writing clean, maintainable code is just as important as writing code that works."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/solid-principles-explained-with-code.md"
dateModified: "2024-03-17"
datePublished: "2024-03-17"
showOnArticles: true
topics:
  - dsa
  - object-oriented-design
  - low-level-design
---

[![image](https://substack-post-media.s3.amazonaws.com/public/images/39b0248f-2bc1-4f25-abb2-0b9af877862d_2108x510.png)](https://substackcdn.com/image/fetch/$s_!X2j9!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F39b0248f-2bc1-4f25-abb2-0b9af877862d_2108x510.png)

Writing clean, maintainable code is just as important as writing code that works.

The SOLID principles provide a blueprint for writing code that’s easy to adjust, extend, and maintain over time.

It was introduced by  **[Robert C. Martin (Uncle Bob)](https://en.wikipedia.org/wiki/Robert_C._Martin)**  in the early 2000s.

In this article, we will explore each of the 5 principles with real world examples and code:

If you’re enjoying this newsletter and want to get even more value, consider becoming a  **[paid subscriber](https://blog.algomaster.io/subscribe)** .

As a paid subscriber, you'll unlock all  **premium articles**  and gain full access to all  **[premium courses](https://algomaster.io/newsletter/paid/resources)**  on  **[algomaster.io](https://algomaster.io)** .

# **S: Single Responsibility Principle (SRP)**

> A class should have one, and only one, reason to change.

This means that a class must have only one responsibility.

When a class performs just one task, it contains a small number of methods and member variables making them more usable and easier to maintain.

If a class has multiple responsibilities, it becomes harder to understand, maintain, and modify and increases the potential for bugs because changes to one responsibility could affect the others.

#### **Code Example:**

Imagine you have a class called UserManager that handles user authentication, user profile management, and email notifications.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/f5dd9214-1c4c-4bf8-885e-9418a2183dc6_1074x420.png)](https://substackcdn.com/image/fetch/$s_!HXtc!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5dd9214-1c4c-4bf8-885e-9418a2183dc6_1074x420.png)

This class violates the SRP because it has multiple responsibilities:  **authentication** ,  **profile management** , and  **email notifications** .

If you need to change the way user authentication is handled, you might inadvertently affect the email notification logic, or vice versa.

To adhere to the SRP, we can split this class into three separate classes, each with a single responsibility:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/766f9816-b0ec-4537-a026-249df6571a56_1126x504.png)](https://substackcdn.com/image/fetch/$s_!77SU!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F766f9816-b0ec-4537-a026-249df6571a56_1126x504.png)

Now, each class has a single, well-defined responsibility. Changes to user authentication won't affect the email notification logic, and vice versa, improving maintainability and reducing the risk of unintended side effects.

# **O: Open/Closed Principle (OCP)**

> Software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification.

This means the design of a software entity should be such that you can introduce new functionality or behavior without modifying the existing code since changing the existing code might introduce bugs.

#### **Code Example:**

Let's say you have a ShapeCalculator class that calculates the area and perimeter of different shapes like  **rectangles**  and  **circles** .

[![image](https://substack-post-media.s3.amazonaws.com/public/images/ea5c1b3f-8b79-43d0-b389-ae6354e47d06_1018x528.png)](https://substackcdn.com/image/fetch/$s_!6mTE!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fea5c1b3f-8b79-43d0-b389-ae6354e47d06_1018x528.png)

If we want to add support for a new shape, like a  **triangle** , we would have to modify the calculate_area and calculate_perimeter methods, violating the Open/Closed Principle.

To adhere to the OCP, we can create an abstract base class for shapes and separate concrete classes for each shape type:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/67204dc2-aef9-4726-9380-13b9224c0dd5_1356x1474.png)](https://substackcdn.com/image/fetch/$s_!EDbc!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F67204dc2-aef9-4726-9380-13b9224c0dd5_1356x1474.png)

By introducing an abstraction (Shape class) and separating the concrete implementations (Rectangle and Circle classes), we can add new shapes without modifying the existing code.

The ShapeCalculator class can now work with any shape that implements the Shape interface, allowing for easy extensibility.

# **L: Liskov Substitution Principle (LSP)**

> Objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program.

This means if you have a base class and a derived class, you should be able to use instances of the derived class wherever instances of the base class are expected, without breaking the application.

#### **Code Example:**

Let's consider a scenario where we have a base class Vehicle and two derived classes Car and Bicycle.

Without following the LSP, the code might look like this:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/8acb1c6d-18d6-4196-879c-60db3b42e012_958x548.png)](https://substackcdn.com/image/fetch/$s_!SmqN!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8acb1c6d-18d6-4196-879c-60db3b42e012_958x548.png)

In this example, the Bicycle class violates the LSP because it provides an implementation for the start_engine method, which doesn't make sense for a bicycle.

If we try to substitute a Bicycle instance where a Vehicle instance is expected, it might lead to unexpected behavior or errors.

To adhere to the LSP, we can restructure the code as follows:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/f3d8679d-e257-46ce-866a-673e40c42e1d_944x504.png)](https://substackcdn.com/image/fetch/$s_!5m47!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff3d8679d-e257-46ce-866a-673e40c42e1d_944x504.png)

Here, we've replaced the start_engine method with a more general start method in the base class Vehicle. The Car class implements the start method to start the engine, while the Bicycle class implements the start method to indicate that the rider is pedaling.

Now, instances of Car and Bicycle can be safely substituted for instances of Vehicle without any unexpected behavior or errors.

# **I: Interface Segregation Principle (ISP)**

> No client should be forced to depend on interfaces they don't use.

The main idea behind ISP is to prevent the creation of "fat" or "bloated" interfaces that include methods that are not required by all clients.

By segregating interfaces into smaller, more specific ones, clients only depend on the methods they actually need, promoting loose coupling and better code organization.

#### Code Example:

Let's consider a scenario where we have a media player application that supports different types of media files, such as audio files (MP3, WAV) and video files (MP4, AVI).

Without applying the ISP, we might have a single interface like this:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/e6a11b93-6807-4a4e-90a2-0526ff143c93_998x778.png)](https://substackcdn.com/image/fetch/$s_!oOp0!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe6a11b93-6807-4a4e-90a2-0526ff143c93_998x778.png)

In this case, any class that implements the MediaPlayer interface would be forced to implement all the methods, even if it doesn't need them.

For example, an audio player would have to implement the play_video, stop_video, and adjust_video_brightness methods, even though they are not relevant for audio playback.

To adhere to the ISP, we can segregate the interface into smaller, more focused interfaces:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/771b16b6-3b7d-465a-95d9-b695e6d28cb7_1108x830.png)](https://substackcdn.com/image/fetch/$s_!iF0h!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F771b16b6-3b7d-465a-95d9-b695e6d28cb7_1108x830.png)

Now, we can have separate implementations for audio and video players:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/c04b13ac-afe5-447e-a7b9-df3f39bc1f20_1034x814.png)](https://substackcdn.com/image/fetch/$s_!esrF!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc04b13ac-afe5-447e-a7b9-df3f39bc1f20_1034x814.png)

By segregating the interfaces, each class only needs to implement the methods it actually requires. This not only makes the code more maintainable but also prevents clients from being forced to depend on methods they don't use.

If we need a class that supports both audio and video playback, we can create a new class that implements both interfaces:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/877d591c-2c7a-4d99-8f97-9cf50df70e35_1256x148.png)](https://substackcdn.com/image/fetch/$s_!x6X-!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F877d591c-2c7a-4d99-8f97-9cf50df70e35_1256x148.png)

# **D: Dependency Inversion Principle (DIP)**

> High-level modules should not depend on low-level modules; both should depend on abstractions.

This means that a particular class should not depend directly on another class, but on an abstraction (interface) of this class.

Applying this principle reduces dependency on specific implementations and makes our code more reusable.

#### Code Example:

Let's consider a example where we have a EmailService class that sends emails using a specific email provider (e.g., Gmail).

[![image](https://substack-post-media.s3.amazonaws.com/public/images/b7b61093-e6a4-4ef3-9fb5-79be9cefc871_1124x456.png)](https://substackcdn.com/image/fetch/$s_!3QpT!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb7b61093-e6a4-4ef3-9fb5-79be9cefc871_1124x456.png)

In this example, the EmailService class directly depends on the GmailClient class, a low-level module that implements the details of sending emails using the Gmail API.

This violates the DIP because the high-level EmailService module is tightly coupled to the low-level GmailClient module.

To adhere to the DIP, we can introduce an abstraction (interface) for email clients:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/270bff01-7a82-409c-9270-0aacce238388_1334x994.png)](https://substackcdn.com/image/fetch/$s_!TeaS!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F270bff01-7a82-409c-9270-0aacce238388_1334x994.png)

Now, the EmailService class depends on the EmailClient abstraction, and the low-level email client implementations (GmailClient and OutlookClient) depend on the abstraction.

This follows the DIP, resulting in a more flexible and extensible design.


Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
