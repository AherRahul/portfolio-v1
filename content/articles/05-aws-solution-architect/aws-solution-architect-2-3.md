---
title: Compute, Storage, Databases, and Networking
description: Consistency and standards are important for building a unified
  design language and help the user know what to expect from our product and how
  to use it. However, this does not mean sacrificing the user experience. In
  this sense, the context and needs of our users are priorities when developing
  our solutions.
tutor: 1
slidesUrl: https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/aws-solution-architect-exam-guide.md
dateModified: 2026-01-29
datePublished: 2026-05-22
showOnArticles: false
courseName: 05-aws-solution-architect
topics:
  - system-design
  - aws
  - lld
resources:
  - title: "YouTube Video - Cloud World"
    type: "Video"
    url: "https://youtu.be/ULfTWvsHw20?si=N1H4UFMoJqfhmyHR"
  - title: "Notes"
    type: "Documents"
    url: "https://arkalim.notion.site/Notes-143374c83daa4d4991b07400056a2aa9"
---

## AWS Core Services: Compute, Storage, Databases, and Networking Explained

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1769794193/Portfolio/awsCourse/Aws_solution_architect_banner_image_uxqldk.png)

#### Introduction: Understanding the Core Components of AWS Architecture  
 
This chapter introduces the **four fundamental components** essential for mastering the AWS Solutions Architect Associate exam: **Compute, Storage, Databases, and Networking**. These core services represent the backbone of AWS cloud infrastructure and knowledge of these areas significantly streamlines exam preparation. The lecture emphasizes that despite the broad range of AWS services, most can be categorized into these four groups, making it easier for learners to organize their study.  
- **Key Vocabulary and Concepts:**  
  - **Compute:** Processing power for applications (servers, virtual machines, serverless).  
  - **Storage:** Cloud-based data retention (disks, file systems, block storage).  
  - **Databases:** Structured and unstructured data storage and retrieval.  
  - **Networking:** Communication pathways and virtual environments connecting resources.  



#### Section 1: Compute – The Processing Power Behind Applications  

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1769851683/Portfolio/awsCourse/02/710ec4c7-773c-4bb7-8780-3b5b2c368f81.png)

Compute is described as the essential element that enables application functionality by **processing data**. Without compute resources, applications cannot run. The lecture breaks down compute into several key AWS services:  
- **EC2 (Elastic Compute Cloud):** Virtual machines acting as servers.  
- **AWS Lambda:** A **serverless compute service** where only the code is managed without provisioning servers.  
- **Elastic Beanstalk:** A **provisioning engine** that automates deployment, scaling, and load balancing of applications, abstracting much of the infrastructure complexity from the user.  
- The central idea is that understanding these compute services enables you to design scalable and automated applications on AWS.  

- **Bullet Points:**  
  - Compute powers data processing and application execution.  
  - EC2 represents traditional virtual servers.  
  - Lambda offers serverless execution, focusing solely on code.  
  - Elastic Beanstalk automates deployment, reducing manual infrastructure management.  



#### Section 2: Storage – Secure and Scalable Data Retention  

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1769852617/Portfolio/awsCourse/02/030bbaf9-c9ff-4acb-98e9-82cc102d3410.png)

Storage is explained as a **cloud-based safe repository** for data, comparable to a giant disk in the cloud. Several AWS storage services are highlighted:  
- **S3 (Simple Storage Service):** One of the first and most fundamental AWS services for object storage.  
- **Elastic Block Store (EBS):** Virtual hard disks attached to EC2 instances for persistent storage.  
- **Elastic File System (EFS):** A centralized file storage solution for sharing files across instances.  
- **FSx:** Specialized file systems for particular workloads (covered later).  
- **Storage Gateway:** Hybrid storage enabling integration between on-premises environments and AWS cloud storage.  

- **Bullet Points:**  
  - Storage services provide durable, scalable, and secure data storage.  
  - S3 is AWS’s primary object storage service.  
  - EBS offers block-level storage for EC2.  
  - EFS facilitates shared file storage.  
  - Storage Gateway bridges on-premises data with AWS cloud storage.  



#### Section 3: Databases – Organized Data Management  

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1769852714/Portfolio/awsCourse/02/7a9fbf3b-0081-4ff6-913b-b0d3844dc615.png)

Databases are likened to **spreadsheets**—a structured way to store and retrieve data reliably. The course covers three major AWS database services:  
- **RDS (Relational Database Service):** Managed relational databases supporting structured query languages.  
- **DynamoDB:** A **NoSQL (non-relational)** database service for flexible schema and high scalability.  
- **Redshift:** A data warehousing solution designed for large-scale data analytics and reporting.  

- The distinction between relational and non-relational databases is critical in understanding AWS database offerings.  

- **Bullet Points:**  
  - Databases ensure reliable storage and retrieval of structured and unstructured data.  
  - RDS supports relational SQL-based databases.  
  - DynamoDB offers NoSQL, schema-less data storage.  
  - Redshift enables large-scale data warehousing and analytics.  



#### Section 4: Networking – Connecting AWS Resources Securely and Efficiently  

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1769852779/Portfolio/awsCourse/02/05e38c45-7c3d-48fe-b3a1-730602b2dc3c.png)

Networking is fundamental in enabling communication between compute, storage, and database resources within AWS. Key networking concepts and AWS services include:  
- **VPCs (Virtual Private Clouds):** Virtual data centers in the cloud where all AWS resources reside, providing network isolation and security controls.  
- **Direct Connect:** A dedicated network connection from on-premises data centers to AWS, enhancing security and bandwidth.  
- **Route 53:** AWS’s DNS (Domain Name System) service for domain registration and routing internet traffic to AWS resources.  
- **API Gateway:** A **serverless solution** for creating, publishing, and securing APIs without managing servers.  
- **AWS Global Accelerator:** A service that enhances application availability and performance by routing user traffic through the AWS global network.  

- **Bullet Points:**  
  - Networking enables AWS resources to communicate and coexist securely.  
  - VPCs are isolated virtual networks hosting AWS resources.  
  - Direct Connect provides private, high-bandwidth connectivity.  
  - Route 53 manages domain names and DNS routing.  
  - API Gateway replaces traditional web servers for API management.  
  - Global Accelerator improves user access speed globally.  



#### Section 5: Summary of Key AWS Services for the Exam  

The lecturer summarizes the essential AWS services grouped by core technology areas that will be covered throughout the course:  
- **Compute:** EC2, Lambda, Elastic Beanstalk  
- **Storage:** S3, EBS, EFS, FSx, Storage Gateway  
- **Databases:** RDS, DynamoDB, Redshift  
- **Networking:** VPCs, Direct Connect, Route 53, API Gateway, AWS Global Accelerator  

The first technology to be studied in detail will be **Identity and Access Management (IAM)**, fundamental for managing user permissions and security in AWS. After IAM, the course will proceed to storage services, beginning with S3.  

- **Bullet Points:**  
  - Core services for exam preparation clearly outlined.  
  - IAM is critical and serves as the foundation for security management.  
  - Sequential learning path starts from IAM to storage and beyond.  
  - Clear roadmap provided for learners to follow.  



#### Conclusion: Integrating Core AWS Technologies for Exam Success  
- This introductory lecture lays the groundwork for a structured and manageable approach to mastering the AWS Solutions Architect Associate exam. By focusing on the four pillars of **Compute, Storage, Databases, and Networking**, learners can efficiently organize their study efforts.  
- The lecture emphasizes understanding **key AWS services** within these categories, explaining their roles and interconnections.  
- As the course progresses, students will gain deeper insights into each service, aligned precisely with exam requirements, enabling confident and successful exam performance.  

- **Final Takeaways:**  
  - Mastering the four core AWS components is essential.  
  - Learning follows a logical sequence starting with security (IAM).  
  - Confidence and preparation stem from understanding service roles and exam structure.  


This chapter sets the stage for a detailed exploration of AWS services, balancing conceptual understanding with practical exam focus, ensuring students are well-prepared for the Developer Associate certification journey.


Thank you so much for reading. 