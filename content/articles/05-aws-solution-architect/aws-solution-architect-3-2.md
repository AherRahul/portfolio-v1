---
title: "IAM Users & Groups Hands On"
description: "This detailed understanding equips learners and professionals to confidently manage AWS identities and access controls, ensuring security and operational efficiency."
datePublished: 2026-01-31
dateModified: 2026-01-31
topics:
  - javascript
courseName: 05-aws-solution-architect
showOnArticles: false
featured: false
resources:
  - title: "Notes"
    type: "Documents"
    url: "https://arkalim.notion.site/Notes-143374c83daa4d4991b07400056a2aa9"
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1769794193/Portfolio/awsCourse/Aws_solution_architect_banner_image_uxqldk.png)

## Introduction: Understanding AWS IAM and Its Importance

This chapter focuses on the **Identity and Access Management (IAM)** service within **Amazon Web Services (AWS)**, a critical component for managing secure access to AWS resources. IAM allows us to create and manage **users**, **groups**, and **permissions**, ensuring that resources are accessed securely and according to best practices. A key term here is the **root user**, which is the default administrator account with unrestricted access to all AWS services but is not recommended for everyday use due to security risks. Instead, AWS encourages the creation of **IAM users** with defined permissions, improving security and manageability. This chapter will guide you through the practical steps of creating IAM users, assigning permissions through groups, and managing sign-in processes, highlighting essential security concepts and operational best practices.


### Overview of IAM Service and Global Scope

- **IAM is a global service** in AWS, meaning it does not require region selection unlike other AWS services that are region-specific.
- On the **IAM Dashboard**, users are managed centrally, and any IAM user created is globally recognized across all AWS regions.
- This global nature simplifies user management, ensuring consistent access policies regardless of the AWS region being accessed.


### The Role of the Root User and Why to Avoid It

- The **root user** represents the AWS account owner, having full and unrestricted access to all account resources.
- When logged in as root, only the **account ID** is visible; no username is displayed.
- Using the root account for daily tasks is **not best practice** due to security risks.
- Instead, the recommendation is to create IAM users, especially **admin users**, to delegate permissions safely.
- This separation enhances security by limiting risks if an IAM user's credentials are compromised.


### Creating an IAM User – Step-by-Step Process

- To create an IAM user, navigate to the **Users** section on the IAM console.
- Provide a **username** (example used: “Rahul”).
- Choose between:
  - **AWS Identity Center** (recommended for complex setups), or
  - **IAM user creation**, which is simpler and essential for exam purposes.
- Set a password:
  - Option to use an **auto-generated password** requiring the user to change it at first login.
  - Or set a **custom password** and optionally disable the forced password change.
- After password setup, move to **permissions** assignment.


### Managing Permissions through Groups

- Permissions can be assigned **directly to users** or via **user groups**.
- Creating a group simplifies permissions management by allowing bulk permission assignment.
- In this example, an **admin group** is created with the policy **Administrator Access** attached.
- The user “Rahul” is added to this group, inheriting its permissions.
- Viewing the group permissions shows the administrator access policy.
- Checking the user's permissions reveals that the admin permissions come from the group rather than direct attachment.
- This model streamlines permission management and reduces administrative overhead.


### Utilizing Tags for Metadata

- **Tags** are metadata labels that can be attached to AWS resources, including IAM users.
- Tags are optional but helpful for organizing and tracking resources.
- Example: tagging the user “Rahul” with a department such as **engineering**.
- While not always used, understanding tags is beneficial for resource management and automation.


### Successful User Creation and Access Options

- Upon user creation, options include:
  - Sending **sign-in instructions via email**.
  - Downloading a **CSV file** containing user credentials.
- The IAM user now appears in the user list, and groups are visible on the left panel.
- The admin group lists all its members, showing “Rahul” as part of it.


### AWS Account Sign-in and Customizing Access URLs

- AWS accounts have a unique **account ID** and a **sign-in URL**.
- To simplify access, an **account alias** can be created, e.g., “aws-rahul-v3”.
- This alias replaces the numeric account ID in the sign-in URL, making it easier to remember.
- Aliases must be unique and can be customized freely if available.


### Managing Multiple AWS Sessions Simultaneously

- Using multiple AWS accounts or users simultaneously in one browser is challenging because logging in with one user will log out the other.
- The workaround is to open one session in a **normal browser window** and the other in a **private/incognito window**.
- This method allows users to manage the **root account** and an **IAM user** concurrently without interference.
- Supported by major browsers like Chrome, Firefox, and Safari.


### Signing in as an IAM User

- IAM users sign in separately from root users.
- The sign-in process requires the **account ID or alias**, followed by the **IAM username** and **password**.
- Upon successful login, the dashboard displays the IAM username and account ID at the top right.
- This contrasts with the root user, which only shows the account ID.


###  Security Recommendations and Best Practices

- Users must **never lose root or admin credentials**, as recovering access is complex and requires contacting AWS Support.
- The course strongly recommends using IAM users for daily management to avoid accidental misuse of the root user.
- The instructor notes occasional use of both root and IAM users during the course but will specify when each is appropriate.
- Maintaining separate windows for root and IAM users is encouraged for clarity and security.


### Conclusion: Key Takeaways and Implications

This chapter underscores the importance of **IAM users** in AWS for secure and manageable access control. It highlights that IAM is a global service, distinguishing it from region-specific AWS services. The **root user** is powerful but risky to use regularly, so creating IAM users and assigning them to groups with specific **permission policies** is the recommended approach. Group-based permission management simplifies administration and enforces consistent access control.

Further, the chapter explains practical steps for creating users, assigning permissions, and managing sign-in credentials. The use of **account aliases** and browser private sessions enhances usability and operational efficiency. Finally, security best practices are emphasized, particularly the need to safeguard root and admin credentials.

By following these principles, users can maintain a secure AWS environment, minimizing risks and enabling scalable, organized access management suitable for both learning and professional cloud administration.


### Summary of Important Points

- **IAM is a global service**: no region selection needed.
- **Root user**: full access but should be avoided for regular use.
- **IAM users**: created for safer account management.
- **Users assigned to groups**: permissions managed via groups for simplicity.
- **Administrator Access policy**: example of a powerful permission set.
- **Tags**: optional metadata for resource management.
- **Account alias**: simplifies sign-in URLs.
- **Multiple sessions**: use incognito/private browser windows.
- **IAM sign-in**: requires account ID or alias, username, and password.
- **Security**: protect root and admin credentials to avoid account lockout.
- **Best practice**: use IAM users for daily activities.

This detailed understanding equips learners and professionals to confidently manage AWS identities and access controls, ensuring security and operational efficiency.

Thank you so much for reading. 
