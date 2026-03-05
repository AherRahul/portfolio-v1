---
title: "Single Sign-On (SSO)"
description: "Single Sign-On (SSO) - System Design Module 6"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Single Sign-On (SSO)

A typical enterprise employee uses dozens of applications: email, HR systems, project management tools, internal wikis, expense tracking, and more.

Without single sign-on, that employee would need to remember separate credentials for each application and log in to each one individually. This creates friction for users and a nightmare for IT departments managing password resets and access control.

**Single Sign-On (SSO)** solves this problem. Users authenticate once and gain access to multiple applications without re-entering credentials. When an employee logs in to their corporate identity provider in the morning, they can access Slack, Jira, Salesforce, and internal tools seamlessly.

# 1\. What is Single Sign-On?

**Single Sign-On (SSO)** is an authentication scheme that allows users to access multiple independent applications with a single set of credentials. The user authenticates once, and that authentication is recognized across all connected systems.

The key insight is **separation of concerns**: instead of every application managing its own authentication, a dedicated identity system handles authentication centrally, and applications trust that system.

### Benefits of SOO

#### For Users

*   **Convenience**: One password to remember instead of dozens
*   **Productivity**: No time wasted on repeated logins
*   **Better security practices**: Users can maintain one strong password instead of many weak ones
*   **Reduced friction**: Seamless movement between applications

#### For Organizations

*   **Centralized control**: Manage access policies in one place
*   **Easier provisioning**: Create one account, grant access to everything
*   **Instant deprovisioning**: Disable one account, revoke access everywhere
*   **Compliance**: Centralized audit logs of all authentication events
*   **Reduced support costs**: Fewer password reset tickets

#### For Developers

*   **No credential storage**: Applications do not handle passwords
*   **Simplified codebase**: Delegate authentication complexity to specialists
*   **Consistent security**: Leverage battle-tested identity systems
*   **Faster integration**: Standard protocols simplify third-party integrations

# 2\. Core Concepts

Before diving into how SSO works, let us understand the key players.

### Key Roles

Role

Also Known As

Description

**Identity Provider (IdP)**

Authorization Server, OP

The system that authenticates users and vouches for their identity

**Service Provider (SP)**

Relying Party, Client

The application that trusts the IdP and relies on it for authentication

**Principal**

User, Subject

The person attempting to access the Service Provider

### Trust Relationships

The foundation of SSO is **trust**. Service Providers trust the Identity Provider to correctly authenticate users. This trust is established through:

1.  **Cryptographic keys**: The IdP signs tokens that SPs can verify
2.  **Configuration exchange**: SPs and IdPs share metadata (endpoints, certificates)
3.  **Secure communication**: All exchanges happen over HTTPS

When an SP receives an authentication assertion from an IdP, it trusts that assertion because:

*   The assertion is cryptographically signed by the IdP
*   The SP has the IdP's public key to verify the signature
*   The assertion contains the SP's identifier (it was meant for them)

### Authentication vs Authorization

SSO primarily handles **authentication** (who is this user?), but it often includes **authorization** information (what can this user do?).

Concept

Question Answered

Example

**Authentication**

Who is this user?

"This is [john.doe@company.com](mailto:john.doe@company.com)"

**Authorization**

What can they do?

"They belong to Engineering group"

The IdP authenticates the user and can pass attributes (like group memberships) that SPs use for authorization decisions.

# 3\. How SSO Works

Let us walk through what happens when a user accesses an application in an SSO environment.

### The SSO Flow (SP-Initiated)

The most common flow starts when a user tries to access an application (Service Provider) without an existing session.

Let us break down each step:

#### Step 1-2: User Requests Access

The user navigates to . Jira checks for an existing session. Finding none, it needs to authenticate the user.

#### Step 3-4: Redirect to Identity Provider

Jira does not handle authentication itself. Instead, it redirects the user's browser to the Identity Provider (Okta) with an authentication request. This request includes:

*   Who is asking (Jira's identifier)
*   Where to send the response (Jira's callback URL)
*   What information is needed (user identity, attributes)

#### Step 5: User Authentication (If Needed)

The IdP checks if the user already has an active IdP session (maybe they logged into another app earlier). If not, the IdP presents its login page. The user enters credentials and completes MFA. The IdP validates everything and creates an IdP session.

#### Step 6-8: Token Generation and Delivery

The IdP generates an authentication token containing verified information about the user. This token is sent back to Jira through the user's browser (via redirect or form post).

#### Step 9-11: Token Validation and Access

Jira receives the token and validates it:

*   Is the signature valid? (Proves it came from the IdP)
*   Is it intended for Jira? (Prevents token reuse across SPs)
*   Has it expired? (Prevents replay attacks)
*   Does the nonce match? (For protocols that use nonces)

If valid, Jira creates its own session for the user and grants access.

### The Magic: Subsequent Logins

Here is where SSO shines. The user now clicks a link to Confluence (another SP):

Because the user already has an active session at the IdP (from logging into Jira), steps 5a-5d are skipped entirely. The user is authenticated to Confluence without entering credentials again.

# 4\. SSO Protocols: SAML vs OpenID Connect

Two protocols dominate the SSO landscape: **SAML** and **OpenID Connect (OIDC)**. Understanding when to use each is important for system design.

### SAML 2.0

**Security Assertion Markup Language** uses XML-based assertions to exchange authentication data.

#### **Characteristics:**

*   XML-based messages
*   Mature standard (since 2005)
*   Browser-based flows (redirects, form posts)
*   Strong enterprise adoption

#### **Best for:**

*   Enterprise applications
*   Legacy system integration
*   Government and healthcare (compliance requirements)
*   When the application only supports SAML

### OpenID Connect (OIDC)

**OpenID Connect** is an identity layer built on OAuth 2.0, using JSON-based tokens (JWTs).

#### **Characteristics:**

*   JSON-based tokens (lightweight)
*   Modern standard (2014)
*   Works well with mobile and SPAs
*   Built-in API access (OAuth 2.0)

#### **Best for:**

*   Modern web applications
*   Mobile applications
*   Consumer-facing applications
*   When you need social login (Google, Apple, GitHub)
*   Greenfield development

### Protocol Comparison

Aspect

SAML 2.0

OpenID Connect

**Token Format**

XML

JWT (JSON)

**Transport**

Browser redirects, POST

Browser redirects, backchannel

**Mobile Support**

Poor

Excellent

**API Authorization**

Separate concern

Built-in (OAuth 2.0)

**Complexity**

Higher

Lower

**Enterprise Adoption**

Very high

Growing

**Consumer Adoption**

Low

Very high

**Specification Size**

Large (multiple docs)

Compact

### Which Protocol to Choose?

**Rule of thumb:** Use OpenID Connect unless you have a specific reason to use SAML (legacy requirements, enterprise mandates).

# 5\. Session Management

SSO involves multiple sessions that must be coordinated. Understanding session lifecycle is critical for security and user experience.

### Session Types

**IdP Session**: Established when the user authenticates with the Identity Provider. This is the "master" session that enables SSO across applications.

**SP Sessions**: Each Service Provider maintains its own session. These are created when the user first accesses each SP and the IdP vouches for them.

### Session Lifecycle

Event

IdP Session

SP Sessions

**User logs in**

Created

None yet

**User accesses SP1**

Exists

SP1 session created

**User accesses SP2**

Exists

SP2 session created

**IdP session expires**

Terminated

May continue (until next auth check)

**User clicks logout**

Terminated

Should be terminated (SLO)

### Session Duration Considerations

The IdP session duration affects security and user experience:

Duration

User Experience

Security

**Short (1 hour)**

Frequent re-authentication

Higher security

**Medium (8 hours)**

Re-auth once per workday

Balanced

**Long (7 days)**

Rare re-authentication

Lower security

**Best practice:** Use shorter IdP sessions with refresh mechanisms. Require step-up authentication for sensitive operations.

### Single Logout (SLO)

When a user logs out, ideally they should be logged out of all applications. This is **Single Logout**.

#### **SLO Challenges:**

*   **Reliability**: If one SP is unavailable, the logout chain breaks
*   **Timing**: Some SPs may not receive logout notification immediately
*   **Implementation**: Many applications do not fully implement SLO
*   **Browser sessions**: Local cookies may persist

**Practical approach:** Implement SLO where possible, but design systems to handle partial logout gracefully. Use short SP session durations as a fallback.

# 6\. SSO Architecture Patterns

Different architectures serve different needs. Choose based on your scale, requirements, and constraints.

### Pattern 1: Centralized IdP

A single Identity Provider handles all authentication.

### Pros

*   Simple architecture
*   Single source of truth for identity
*   Easy policy management

### Cons

*   Single point of failure
*   May not scale for very large deployments
*   All authentication traffic flows through one system

**Best for:** Small to medium organizations, startups, SaaS platforms.

### Pattern 2: Federated Identity

Multiple IdPs trust each other, allowing users from different organizations to access shared resources.

### Pros

*   Users stay with their organization's IdP
*   No credential sharing between organizations
*   Scales across organizational boundaries

### Cons

*   Complex trust relationships
*   Each organization maintains their own IdP
*   Metadata exchange required between all parties

**Best for:** B2B applications, partner integrations, consortiums (like higher education).

### Pattern 3: Hub and Spoke

A central authentication hub sits between users and applications, federating with multiple upstream IdPs.

### Pros

*   Applications only integrate with the hub
*   Hub handles complexity of multiple IdPs
*   Consistent user experience across login methods

### Cons

*   Additional hop in authentication flow
*   Hub becomes critical infrastructure
*   Potential vendor lock-in

**Best for:** Multi-tenant SaaS with enterprise customers, applications supporting both social and enterprise login.

### Pattern 4: Microservices with Shared Authentication

In a microservices architecture, a central authentication service handles SSO while services verify tokens locally.

### Pros

*   Stateless token verification at each service
*   Scales horizontally
*   No session state to synchronize

### Cons

*   Token size can impact performance
*   Token revocation is challenging
*   Need to handle token refresh

**Best for:** Cloud-native applications, microservices architectures.

# 7\. Security Considerations

SSO centralizes authentication, which is powerful but also creates concentrated risk. Security must be thoughtful.

### Authentication Strength

Since SSO provides access to many applications, the authentication at the IdP must be strong.

Measure

Purpose

**Multi-Factor Authentication (MFA)**

Prevents credential theft from granting access

**Adaptive Authentication**

Increases requirements for unusual behavior

**Password Policies**

Ensures credential strength

**Account Lockout**

Prevents brute force attacks

**Session Timeout**

Limits exposure window

### Token Security

The tokens exchanged in SSO must be protected:

**Signature Validation**: Always verify cryptographic signatures. Never trust unsigned tokens.

**Audience Validation**: Verify the token was meant for your application. A token for App A should not work at App B.

**Expiration Enforcement**: Reject expired tokens. Do not add excessive clock skew tolerance.

**Replay Prevention**: Use nonces (OIDC) or track used assertion IDs (SAML) to prevent token reuse.

**Transport Security**: All SSO traffic must use HTTPS.

### Common Attack Vectors

Attack

Description

Mitigation

**Token Theft**

Attacker steals valid token

Short token lifetimes, secure storage, HTTPS

**Session Hijacking**

Attacker takes over IdP session

Secure cookies, session binding, MFA

**Phishing**

Fake IdP login page

User education, phishing-resistant MFA

**Replay Attack**

Reusing captured tokens

Nonces, timestamp validation, one-time tokens

**XML Signature Wrapping**

Manipulating SAML XML

Use vetted libraries, strict validation

**Open Redirect**

Redirect to malicious site after auth

Validate redirect URLs strictly

### IdP as Critical Infrastructure

The Identity Provider becomes a high-value target. Protect it accordingly:

*   **High availability**: Multiple regions, failover capabilities
*   **DDoS protection**: The IdP must stay available
*   **Security monitoring**: Detect anomalous authentication patterns
*   **Incident response**: Have playbooks for IdP compromise scenarios
*   **Regular audits**: Review configurations, access logs, and policies

# 8\. Implementing SSO

When designing an SSO solution, consider these decisions and trade-offs.

### Build vs Buy

Approach

Pros

Cons

**Managed IdP (Okta, Auth0, Azure AD)**

Quick setup, maintained by experts, compliance certifications

Cost, vendor lock-in, less control

**Self-Hosted IdP (Keycloak, Gluu)**

Full control, customizable, no per-user costs

Operational burden, security responsibility

**Custom Implementation**

Complete flexibility

High risk, significant engineering investment

**Recommendation:** Use a managed IdP unless you have specific requirements (air-gapped environments, extreme customization needs) and the expertise to operate identity infrastructure securely.

### Integration Patterns

#### For Web Applications

1.  **Backend Integration**: Application server handles SSO protocol

*   Server validates tokens
*   Server manages sessions
*   Most secure for traditional web apps

3.  **Frontend Integration (SPA)**: JavaScript handles OIDC flow

*   Uses PKCE for security
*   Tokens stored in memory (avoid localStorage)
*   Works well for single-page applications

#### For APIs

1.  **Gateway-Level Authentication**: API gateway validates tokens

*   Centralized enforcement
*   Services receive validated identity
*   Gateway handles token refresh

3.  **Service-Level Validation**: Each service validates tokens

*   No single point of failure
*   Services need access to validation keys
*   Good for service mesh architectures

### User Experience Considerations

**Login Page Redirect**: Users expect to be redirected to a familiar login page. Make sure the IdP login page is branded and trustworthy.

**Deep Linking**: When users access a specific page before authentication, redirect them back to that page after login, not the home page.

**Session Persistence**: Decide whether to persist IdP sessions across browser restarts. Longer sessions improve UX but reduce security.

**Logout Clarity**: Make logout behavior clear. Users should understand whether logging out of one app logs them out everywhere.

### Handling Edge Cases

**IdP Unavailability**: What happens when the IdP is down?

*   Consider graceful degradation (read-only mode)
*   Have status page communication
*   Design for eventual consistency in session validation

**Clock Skew**: Servers with different clocks cause token validation failures

*   Use NTP to synchronize clocks
*   Allow small skew tolerance (1-2 minutes)
*   Monitor for clock drift

**Token Revocation**: How to invalidate a compromised user's access?

*   Short token lifetimes limit exposure
*   Implement token revocation endpoint (OIDC)
*   Consider token introspection for sensitive operations

# Summary

Single Sign-On transforms authentication from a per-application concern into a centralized, manageable system. The key concepts to remember:

#### **Core Components:**

*   Identity Provider (IdP): Authenticates users, issues tokens
*   Service Provider (SP): Trusts IdP, relies on tokens for authentication
*   Trust Relationships: Cryptographic verification of tokens

#### **Protocols:**

*   SAML: XML-based, enterprise-focused, mature
*   OpenID Connect: JSON-based, modern, mobile-friendly

#### **Session Management:**

*   IdP session enables SSO across applications
*   Each SP maintains its own session
*   Single Logout coordinates termination across systems

#### **Architecture Patterns:**

*   Centralized IdP for simple deployments
*   Federated identity for cross-organization access
*   Hub and spoke for multi-tenant SaaS

#### **Security Essentials:**

*   Strong authentication at IdP (MFA)
*   Validate all token properties (signature, audience, expiration)
*   Treat IdP as critical infrastructure

SSO is foundational to modern application security. Whether you are building a SaaS platform, enterprise application suite, or consumer product with social login, understanding SSO patterns helps you design systems that are both secure and user-friendly.

Launching soon
