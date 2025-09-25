---
title: "Who Owns What in the Cloud?"
description: "Consistency and standards are important for building a unified design language and help the user know what to expect from our product and how to use it. However, this does not mean sacrificing the user experience. In this sense, the context and needs of our users are priorities when developing our solutions."
tutor: 1
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/aws-solution-architect-exam-guide.md"
dateModified: "2025-05-22"
datePublished: "2025-05-22"
showOnArticles: false
courseName: 05-aws-solution-architect
topics:
  - system-design
  - aws
  - lld
videoUrl: "https://www.youtube.com/embed/izQlU1sZkNg?si=q_GceoOp1N6nWdNZ"
---

## Who Owns What in the Cloud? Understanding AWS Shared Responsibility Model

As businesses embrace the cloud, one question often arises: **Who is responsible for what?** When using cloud services like AWS, the answer isn’t always straightforward. The **AWS Shared Responsibility Model** outlines the division of responsibilities between AWS and its customers, ensuring clarity about security, compliance, and management.

This blog unpacks the AWS Shared Responsibility Model and explains how it works, giving you the insights needed to secure your cloud-based workloads effectively.



## The AWS Shared Responsibility Model: An Overview

In traditional IT environments, organizations manage and control everything: hardware, networking, data security, and more. However, in the cloud, responsibilities are shared between the **cloud service provider (AWS)** and the **customer**.  

AWS describes its shared responsibility model as:  
**“Security OF the cloud” is AWS’s responsibility, while **“Security IN the cloud” is the customer’s responsibility.**

### What Does This Mean?

- **AWS Responsibility:** AWS takes care of the physical infrastructure, networking, and foundational services required to run cloud resources.
- **Customer Responsibility:** Customers are responsible for managing their data, applications, operating systems, and security settings.



## Breaking Down the Shared Responsibilities

### 1. **AWS Responsibilities: Security OF the Cloud**
AWS ensures the security of its global infrastructure, which includes:

- **Physical Security**  
   AWS secures its data centers with 24/7 monitoring, access control, and redundancy to prevent physical breaches.
   
- **Hardware and Software Maintenance**  
   AWS maintains the servers, storage, networking, and virtualization layers.

- **Compliance**  
   AWS provides certifications like ISO 27001, SOC, and GDPR compliance, ensuring the infrastructure meets strict security standards.

### Examples of AWS Responsibilities:
- Fire suppression systems in data centers.
- Network protection against Distributed Denial of Service (DDoS) attacks.
- Maintaining up-to-date hardware and firmware.



### 2. **Customer Responsibilities: Security IN the Cloud**
Customers must secure the workloads and data they deploy in the cloud. This includes:

- **Data Protection**  
   Encrypt sensitive data at rest and in transit using AWS services like **KMS** and **Certificate Manager**.

- **Access Management**  
   Use **AWS Identity and Access Management (IAM)** to control who can access resources and monitor user activity.

- **Application Security**  
   Ensure that your applications are free from vulnerabilities by implementing secure coding practices.

- **Operating Systems and Patches**  
   For services like Amazon EC2, customers must install updates and patches for their operating systems and software.

### Examples of Customer Responsibilities:
- Configuring a virtual private cloud (VPC) and managing access.
- Setting up firewalls and security groups.
- Creating and monitoring backups of application data.



## The Shared Responsibility Across AWS Services

AWS services fall into different categories, and the division of responsibilities depends on the type of service:

### 1. **Infrastructure-as-a-Service (IaaS)**  
Examples: **Amazon EC2**, **Amazon S3**, **Amazon VPC**  
- AWS: Secures the physical servers and networking.
- Customer: Manages operating systems, data, IAM policies, and application security.

### 2. **Platform-as-a-Service (PaaS)**  
Examples: **AWS Lambda**, **Amazon RDS**  
- AWS: Manages the infrastructure, operating system, and runtime.
- Customer: Manages application logic, data, and permissions.

### 3. **Software-as-a-Service (SaaS)**  
Examples: **Amazon Workspaces**, **AWS Managed Services**  
- AWS: Manages almost everything, including software and infrastructure.
- Customer: Focuses on data access, permissions, and proper usage.



## Why the Shared Responsibility Model Matters

The AWS Shared Responsibility Model ensures that both AWS and its customers are clear on their roles in securing workloads. Misunderstanding this model can lead to:

1. **Data Breaches:** If customers neglect securing their data or IAM policies, they may expose sensitive information.
2. **Compliance Failures:** Customers may assume AWS handles compliance entirely, but they are still responsible for securing customer data to meet legal standards.
3. **Operational Downtime:** Poorly managed operating systems or applications can lead to system failures.

By understanding your role, you can design systems that meet your business needs while leveraging AWS’s secure infrastructure.



## Best Practices for Security in the Cloud

To maximize the benefits of the shared responsibility model, follow these best practices:

### 1. **Use IAM Policies Effectively**  
- Implement the principle of least privilege — give users the minimum access they need.
- Regularly review and update IAM roles and permissions.

### 2. **Encrypt Data**  
- Encrypt data at rest using AWS Key Management Service (KMS).
- Enable HTTPS for data in transit using AWS Certificate Manager.

### 3. **Enable Logging and Monitoring**  
- Use **AWS CloudTrail** to track user activity and API calls.
- Monitor infrastructure with **Amazon CloudWatch** to detect unusual behavior.

### 4. **Patch and Update Regularly**  
- Keep your operating systems, applications, and dependencies updated.
- Automate updates with tools like **AWS Systems Manager**.

### 5. **Perform Regular Security Audits**  
- Use **AWS Trusted Advisor** to identify security gaps.
- Conduct vulnerability scans on your workloads and applications.



## Real-World Example: Who Owns What?

### Scenario: Running an E-Commerce Application on AWS  
1. **AWS Responsibilities:**
   - Ensures physical security of the servers where the application is hosted.
   - Provides a secure networking infrastructure.

2. **Customer Responsibilities:**
   - Configures IAM roles to prevent unauthorized access.
   - Encrypts customer payment data stored in Amazon S3.
   - Updates the application code to fix vulnerabilities.



## Summary

The AWS Shared Responsibility Model is a key framework for cloud security, making it clear where AWS’s responsibilities end and where the customer’s begin. By embracing this model, businesses can take full advantage of AWS’s secure infrastructure while safeguarding their workloads and data.

Remember: **AWS secures the cloud; you secure what you put in the cloud.**

Understanding the shared responsibility model is the first step toward building secure, reliable, and compliant cloud solutions. So, the next time you deploy workloads in AWS, take a moment to review your responsibilities and ensure everything is configured for maximum security.



### Questions or Feedback?

Have thoughts or experiences to share about the AWS Shared Responsibility Model? Let us know in the comments below!


Happy coding!








---

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.