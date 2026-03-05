---
title: "Secrets Management"
description: "Secrets Management - System Design Module 20"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Secrets Management

Every application has secrets. Database passwords, API keys, encryption keys, OAuth tokens, SSH credentials. Mishandling them can turn a minor oversight into a catastrophic breach.

Your code might be bulletproof, but if an attacker gets your secrets, none of that matters.

In this chapter, we will cover:

*   What are secrets and why do they need special handling?
*   Common mistakes that lead to breaches
*   The evolution of secrets management
*   How modern secrets management systems work
*   Popular tools and when to use them
*   Best practices for securing your secrets

# 1\. What Are Secrets?

A **secret** is any piece of sensitive information that grants access to protected resources or enables cryptographic operations. Unlike regular configuration data, secrets have real consequences when exposed.

Consider the difference: if someone discovers your application runs on port 8080, nothing bad happens. If they discover your database password, they can download your entire user table, modify records, or delete everything.

That asymmetry is what makes secrets fundamentally different from other configuration.

Common types of secrets include:

Type

Examples

Risk if Exposed

**Credentials**

Database passwords, service account passwords

Direct access to data stores

**API Keys**

Stripe keys, AWS access keys, third-party service tokens

Unauthorized API calls, financial fraud

**Encryption Keys**

AES keys, TLS private keys

Data decryption, man-in-the-middle attacks

**Certificates**

SSL/TLS certificates, code signing certs

Impersonation, malicious code distribution

**Tokens**

OAuth tokens, JWTs, session tokens

Account takeover, privilege escalation

**SSH Keys**

Private keys for server access

Full server compromise

**Connection Strings**

Database URIs with embedded credentials

Database access

The table above shows just how varied secrets can be, and each type requires careful handling. An encryption key might protect data at rest, while an API key guards access to a third-party service. Different secrets, same fundamental problem: if they leak, you lose control.

# 2\. Why Secrets Management Is Hard

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
