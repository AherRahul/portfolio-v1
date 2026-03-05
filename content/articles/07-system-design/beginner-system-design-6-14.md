---
title: "OAuth / OAuth2"
description: "OAuth / OAuth2 - System Design Module 6"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# OAuth / OAuth2

You click “Sign in with Google” on a new app, and a moment later, you’re in. You didn’t have to create a new password, and the app now has permission to, say, read your calendar events.

**But how did that happen securely? How did you grant that app access to your Google data without giving it your Google password?**

The answer is **OAuth 2.0**, the open standard that powers modern authentication and authorization on the internet.

In this chapter, we will demystify OAuth 2.0, breaking down its core concepts, roles, and flows.

# 1\. What Is OAuth (and Why It Exists)

Before OAuth, if you wanted a third-party app to access your data from another service (like letting a photo printing service access your Google Photos), you had to give it your username and password. This was a terrible security practice, as it gave the app full access to your account.

**OAuth** was created to solve this problem by introducing the concept of **delegated access**.

The core idea of OAuth is to allow a user (the **Resource Owner**) to grant a third-party application (the **Client**) limited access to their resources, which are hosted on a **Resource Server** (like the Google Calendar API). This is all orchestrated by an **Authorization Server**.

**OAuth** is an open standard for **authorization**, not authentication. This is a crucial distinction:

*   **Authentication** is about proving who you are (e.g., logging in with a password).
*   **Authorization** is about what you are allowed to do (e.g., granting an app permission to read your contacts).

# 2\. Key Roles and Components

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
