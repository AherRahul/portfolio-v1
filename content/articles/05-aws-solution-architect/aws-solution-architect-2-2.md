---
title: Who Owns What in the Cloud?
description: Consistency and standards are important for building a unified
  design language and help the user know what to expect from our product and how
  to use it. However, this does not mean sacrificing the user experience. In
  this sense, the context and needs of our users are priorities when developing
  our solutions.
tutor: 1
slidesUrl: https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/aws-solution-architect-exam-guide.md
dateModified: 2026-01-31
datePublished: 2026-01-31
showOnArticles: false
courseName: 05-aws-solution-architect
topics:
  - system-design
  - aws
  - lld
resources:
  - title: "YouTube Video - Cloud World"
    type: "Video"
    url: "https://youtu.be/izQlU1sZkNg?si=Q_anh7GVoEpbcbzf"
  - title: "Notes"
    type: "Documents"
    url: "https://arkalim.notion.site/Notes-143374c83daa4d4991b07400056a2aa9"
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1769794193/Portfolio/awsCourse/Aws_solution_architect_banner_image_uxqldk.png)

### Introduction: The Significance of Ownership in the Cloud

In this chapter, we explore the critical question: **"Who owns what in the cloud?"** Ownership here refers to **responsibility**—who is accountable for which components and actions within cloud environments. This understanding is essential for cloud users, especially those preparing for certifications such as the **AWS Developer Associate Associate** and **Security Specialty exams**. Central to this discussion is the **Shared Responsibility Model**, a fundamental concept that delineates the division of security and operational duties between the cloud provider (e.g., Amazon Web Services) and the customer. The model frequently appears in AWS exams and practical cloud management scenarios, making it indispensable knowledge for cloud professionals.

-  Key terms introduced include:  
    - **Shared Responsibility Model**  
    - **Security of the Cloud**  
    - **Security in the Cloud**  
    
These terms will be unpacked in the sections that follow.

### Analogizing Cloud Responsibility with Renting a Car

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1769850847/Portfolio/awsCourse/02/19671a87-a368-40b9-bf32-7a275d36735a.png)

To grasp the shared responsibility concept, consider the analogy of renting a car:  
- The **renter’s responsibilities** include:  
  - Operating the car safely (e.g., not damaging it)  
  - Following traffic laws (e.g., avoiding speeding and paying fines)  
  - Handling tolls or fuel costs during usage  
- The **rental company’s responsibilities** include:  
  - Ensuring the vehicle is mechanically sound (e.g., tires properly inflated, full fuel tank)  
  - Maintaining the physical condition of the car (e.g., no imminent breakdowns)  

This analogy highlights how responsibility is divided between the **provider’s physical assets** and the **user’s operational conduct**—a parallel to cloud ownership.

- Bullet points:  
  - The cloud provider is responsible for physical infrastructure and its maintenance.  
  - The user is responsible for how they use and configure cloud resources.  
  - This analogy sets the stage to understand the division of duties in cloud environments.


### The Cloud Provider’s Responsibilities (Security **of** the Cloud)

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1769850961/Portfolio/awsCourse/02/1ac39f4b-376e-427b-9cf7-7dbe504b7dfd.png)

Amazon Web Services (AWS), like other cloud providers, is accountable for securing the **physical and foundational layers** of the cloud infrastructure. This includes:  
- The **physical security** of data centers, which are protected by:  
  - Security checkpoints  
  - Chain-link fencing and restricted access  
- The hardware and physical assets such as:  
  - Servers, storage, and networking equipment  
  - The hypervisor, which manages virtualization atop physical servers  
- The infrastructure components such as:  
  - AWS Regions, Availability Zones, and Edge locations  
  - Software that orchestrates the entire cloud stack  

AWS does not disclose precise data center locations to prevent unauthorized physical access, emphasizing the depth of their control over physical and infrastructural security.

- Bullet points:  
  - AWS controls the physical security and maintenance of hardware.  
  - AWS manages virtualization infrastructure via hypervisors.  
  - AWS secures the global network architecture (regions, zones).  
  - AWS is responsible for software layers that run underlying cloud services.


### The Customer’s Responsibilities (Security **in** the Cloud)

Users of cloud services are responsible for securing their own data and configurations within the cloud environment. Their responsibilities include:  
- Protecting **customer data** by ensuring it is not stored in publicly accessible locations  
- Managing and configuring:  
  - Platforms and applications deployed on the cloud  
  - **Identity and Access Management (IAM)**  
  - Operating systems on virtual machines  
  - Network and firewall settings  
- Implementing **encryption** for data both on the client side and server side  
- Safeguarding network traffic and controlling access points  

This section underscores that while AWS provides the infrastructure, customers must secure their workloads and data within that infrastructure.

- Bullet points:  
  - Customers control and secure their data and applications.  
  - IAM is a critical customer-managed responsibility.  
  - Network configurations and operating system security fall under customer scope.  
  - Encryption is a vital part of customer security duty.


### Practical Exam Tips and Responsibility Identification

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1769851076/Portfolio/awsCourse/02/cd22325a-71fd-4e85-afd4-3ace806c877b.png)

When preparing for AWS exams or applying cloud security in practice, a key heuristic to determine responsibility is:  
**"Can I configure or control this through the AWS Management Console?"**  
- If **yes**, the customer is responsible. Examples include:  
  - Managing security groups  
  - Creating and managing IAM users  
  - Patching EC2 instances and databases  
- If **no**, AWS is responsible. Examples include:  
  - Physical security of data centers  
  - Patching underlying AWS-managed operating systems and hardware  
  - Managing infrastructure-level security controls  

This approach helps in quickly assessing ownership during scenario-based questions and real-world deployments.

- Bullet points:  
  - Customer responsibility aligns with what is user-configurable.  
  - AWS responsibility covers infrastructure and physical layer controls.  
  - Shared responsibilities require understanding which tasks fall where.  
  - Encryption is a prime example of shared responsibility.


### The Shared Responsibility of Encryption

Encryption represents a **shared responsibility** between AWS and the customer:  
- Customers can enable encryption via the AWS console (e.g., encrypting a volume) and manage keys or data encryption.  
- AWS must ensure that the underlying mechanisms enforce encryption properly and securely.  

This partnership demonstrates how cloud security functions as a cooperative effort rather than a unilateral task.

- Bullet points:  
  - Encryption configuration is initiated by customers.  
  - AWS ensures encryption enforcement at the infrastructure level.  
  - Shared responsibility models extend to many security features, not just encryption.


### Conclusion: Mastering the Shared Responsibility Model

- The **Shared Responsibility Model** is a foundational concept for understanding cloud security and operational ownership.  
- AWS secures the **cloud infrastructure**, including physical data centers, hardware, and foundational software layers.  
- Customers secure **what they deploy and control**—their data, applications, operating systems, network configurations, and user access.  
- Practical understanding and exam success hinge on the ability to ask: **"Can I control this setting or component?"** If yes, responsibility lies with the customer; if no, AWS assumes responsibility.  
- Encryption exemplifies shared responsibility, requiring cooperation between customers and AWS.  
- Grasping these distinctions is vital not only for certification exams but also for effective cloud governance and security in real-world environments.

- Final bullet points:  
  - Ownership in the cloud is divided but complementary.  
  - Clear boundaries help avoid security gaps and misunderstandings.  
  - Continuous learning and referring to AWS’s official shared responsibility documentation are recommended for mastery.  
  - This knowledge ensures responsible cloud usage and security compliance.

This chapter thus provides a comprehensive framework for understanding **who owns what in the cloud**, enabling students and professionals to confidently manage and secure cloud resources.

Thank you so much for reading. 
