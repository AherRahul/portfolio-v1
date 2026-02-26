---
title: "How to Securely Store Passwords in a Database"
description: "A password is meant to be secret. If someone steals it, they do not just break into one account, they often get access to every other place where the user reused that same password."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/securely-storing-passwords-in-a-database.md"
dateModified: "2025-10-28"
datePublished: "2025-10-28"
showOnArticles: true
topics:
  - databases
  - system-design
---

A password is meant to be  **secret** . If someone steals it, they do not just break into one account, they often get access to every other place where the user reused that same password.

That is why  **secure password storage**  is not optional. It is our responsibility as developers to store passwords in a form that remains safe  **even if the database is stolen** .

In this article, we will break down  **how to do it correctly**  from first principles. We will begin with  **what must never be done** , then climb upward to the correct techniques and the reasoning behind them.

## 1. Storing in Plain Text: The Worst Way

The absolute worst thing you can do is store a password as plain text. This means if a user signs up with the password “Pa$$w0rd123”, your database stores the literal string “Pa$$w0rd123”.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/84144391-cf92-43e8-b675-3ff8dd4bbf5c_868x726.png)](https://substackcdn.com/image/fetch/$s_!TqM-!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F84144391-cf92-43e8-b675-3ff8dd4bbf5c_868x726.png)

### Why this is a disaster:

- **SQL Injection:**  An attacker who finds an SQL injection vulnerability can dump your entire users table in one query. There is nothing to decode or crack. They instantly have the passwords to every user’s account.

```
SELECT email, password FROM users;
```
- **Internal Threats:**  A developer, DBA, support engineer or cloud vendor with read access can export the entire password list in seconds, and you would never know it happened. Many breaches are not hackers, they are insiders.

With plain text, there is no second line of protection. You cannot “undo” the exposure. Once seen, it is gone forever.

Now that we have established the worst practice, let us examine the first step in doing better:  **hashing** .

## 2. Simple Hashing: Slightly Better But Still Broken

A  **hash function**  is supposed to be a one-way transformation.

Think of it like a blender. You can drop a banana and strawberry in, blend them, and get a smoothie. You can recognize the smoothie as “fruit mix” but you can never reverse it back into the original fruits.

That is the idea behind a hash. You feed in a password and get a fixed-length output that cannot be reversed.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/d56b759a-7e7c-4cf9-944c-ba86d1cc9dc3_1818x322.png)](https://substackcdn.com/image/fetch/$s_!w_Od!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd56b759a-7e7c-4cf9-944c-ba86d1cc9dc3_1818x322.png)

Early systems used fast general-purpose hash algorithms like  **MD5**  and  **SHA-1**  for this.

You would run “Pa$$w0rd123” through MD5 and get a hash like:

```
e10adc3949ba59abbe56e057f20f883e
```

It looks random and irreversible. It looks safe. Sounds good, right?

Here is the twist — it is not.

### Why fast hashing ruins security

Algorithms like MD5, SHA-1, and even SHA-256 are designed to be extremely fast. That is great for file integrity and signatures, but disastrous for passwords.

Modern GPUs can compute  **billions of these hashes per second** , which means an attacker can brute-force weak passwords almost instantly.

Worse, attackers do not even have to brute-force from scratch. They can use something called  **Rainbow Tables** .

Rainbow Tables are massive precomputed dictionaries where attackers hash millions of common passwords in advance and store the mapping. A lookup is enough to reveal the plaintext password.

For MD5, a tiny fragment of a rainbow table might look like:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/616f5281-bbdc-4ca2-bdd8-233de5be9c50_1264x580.png)](https://substackcdn.com/image/fetch/$s_!jv2b!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F616f5281-bbdc-4ca2-bdd8-233de5be9c50_1264x580.png)

#### How the Attack Works

1. **Breach:**  The attacker steals your users table and finds a list of password hashes.
2. **Lookup:**  They see the hash 5f4dcc3b5aa765d61d8327deb882cf99 for a user.
3. **Crack:**  Instead of trying to “guess” the password, they just look up this hash in their giant rainbow table.
4. **Result:**  They instantly find the matching plaintext password: “password”.

No brute force. No guessing. Just a dictionary lookup.

This method works because old, fast hashing functions (like MD5 or SHA-1) always produce the same exact hash for the same exact input.

This is why “simple hashing” is still insecure. The fix is not just “hash it”, it is “hash it the right way.”

## 3. The Right Kind of HASH

A secure password hashing function must be  **slow** ,  **adaptive** , and  **computationally expensive**  on purpose.

The idea is simple: if every password attempt takes real time and real resources, large-scale cracking becomes impractical even with modern GPUs.

### Why slow hashing kills rainbow tables

Rainbow tables only work when hashing is fast and deterministic. Slow and adaptive hash functions make precomputation economically pointless.

To generate a rainbow table now, an attacker would have to spend years and extreme hardware cost just to compute the table before even attacking.

### Popular Slow Hashing Options

Here are the three widely used hashing options:

#### bcrypt

This has been the industry standard for a long time. Its key feature is a configurable  **cost factor** . You can tell it “make this hash take 100 milliseconds.” As computers get faster in the future, you can just increase the cost factor to keep it slow.

#### scrypt

This was designed to be “memory hard.” It forces the hashing process to consume significant RAM, which makes pre-computation and GPU attacks extremely inefficient. GPUs excel at raw compute but struggle when memory is the bottleneck.

#### Argon2

This is the modern preferred option. It won the official Password Hashing Competition in 2015. It is resistant to GPU attacks, highly configurable (you can balance its memory, CPU, and parallelism needs), and is the top recommendation by OWASP (Open Web Application Security Project).

**Recommendation:**  Use  **Argon2id**  if your language and framework support it. If not,  **bcrypt**  is an extremely solid and widely supported alternative.

Slow hashing removes the attacker’s “shortcut”.

But slow hashing by itself still has a weakness. The same password still produces the same hash. This is where  **salting**  enters the picture.

## 4. SALTING

A “salt” is simply a  **unique, random string generated for each user** .

Returning to the smoothie analogy: a salt is like adding a different mystery ingredient to every person’s blend before mixing. Even if two people start with the same fruits (same password), the final smoothie looks completely different.

### How salting is applied

You do not hash the raw password. You hash: password + salt

[![image](https://substack-post-media.s3.amazonaws.com/public/images/770f3946-fe70-439c-bfdf-9e5488ee2783_1890x820.png)](https://substackcdn.com/image/fetch/$s_!xLym!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F770f3946-fe70-439c-bfdf-9e5488ee2783_1890x820.png)

Two users with the same password now produce completely different hashes.

```
Alice password = “123456”
Alice salt     = “abc_salt”
Stored hash    = H(”123456abc_salt”)

Bob password   = “123456”
Bob salt       = “xyz_salt”
Stored hash    = H(”123456xyz_salt”)
```

The salt must be  **random** ,  **long enough**  (at least 16 bytes), and  **unique per user** .

You must  **not**  use usernames, timestamps, or predictable data. Use a cryptographically secure random generator, for example:

- crypto.randomBytes(16) in Node
- SecureRandom in Java
- crypto/rand in Go
- os.urandom() in Python

### Why salting kills rainbow tables

Rainbow tables depend on the assumption that the same password always leads to the same hash. Salting breaks that. Now the attacker would need a separate precomputed table for  **each salt** , which is mathematically and economically infeasible.

### Where the salt is stored

The salt is  **not a secret** . You store it right next to the hash. You need it later to re-compute the hash during login.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/f5882aea-fdeb-4f03-9b5b-6d991a68108a_1820x896.png)](https://substackcdn.com/image/fetch/$s_!1D9l!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5882aea-fdeb-4f03-9b5b-6d991a68108a_1820x896.png)

> **Note:**  In many modern implementations (bcrypt, Argon2, PBKDF2), the salt is automatically generated and embedded inside the final hash output itself so you never handle salts manually.

So far we have made two things clear:

1. Hashing must be slow and adaptive
2. Hashes must be salted to prevent precomputation and duplicate patterns

Those two alone already raise the bar enormously. But there is still one more defensive layer that can make a breach dramatically less useful to an attacker even if they steal both the hashes and the salts.

That additional layer is called  **peppering** .

## 5. PEPPERING

Peppering adds one more defensive layer by mixing in a secret value that is  **never stored in the database** . Even if an attacker steals your user table (hashes and salts), they still cannot verify guesses without the pepper.

A  **pepper**  is a random secret value (for example 32 bytes) that is combined with the password and salt before hashing. It does not replace salts or slow hashing. It complements them.

If salt is a per-user ingredient added to each smoothie, the pepper is the restaurant’s master secret sauce stored in a separate locked kitchen. The smoothies can be stolen. The recipe cannot.

### Where is the pepper stored?

Unlike salts, peppers  **must be treated as secrets**  and kept outside the database.

Typical storage locations:

- A secure environment variable (e.g., PASSWORD_PEPPER=...)
- A secrets management system (like HashiCorp Vault, AWS Secrets Manager, or Google Secret Manager).

Peppers should never sit in the same system that holds the hashes.

### Two common pepper patterns

1. **Global pepper:** One secret value used for the whole application. Simple to implement. Must be carefully protected.
2. **Per-user pepper stored externally:** A different secret per user kept in a separate secure store (HSM or encrypted key-value store). Harder to manage but limits blast radius if one pepper is leaked.

### How peppering is applied

A typical pipeline with salt and pepper:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/0ea8f9a6-9de3-4221-810e-636a6f4fb034_1908x1336.png)](https://substackcdn.com/image/fetch/$s_!XCWf!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0ea8f9a6-9de3-4221-810e-636a6f4fb034_1908x1336.png)

### How Peppering Helps

Imagine an attacker steals your  *entire database* . They have all the usernames, all the hashes, and all the salts.

Without pepper, they can immediately begin brute-forcing, because they know the hashing function and inputs except the password. With pepper, they are missing a required input.

They are trying to solve:

```
hash(password + salt)   ❌   (what attacker assumes)
```

But the real stored hash came from:

```
hash(password + salt + pepper)   ✅
```

## 6. Putting It All Together

Let’s see how these pieces fit in a real application.

### A: New User Registration

1. A user signs up with their password (e.g., “Pa$$w0rd123”).
2. Your server generates a cryptographically secure  **Salt** .
3. Your server retrieves the application’s secret  **Pepper**  from environment variable.
4. Your server uses a library (like bcrypt or argon2) to hash the password.
5. The library combines the (password + salt + pepper) and runs them through the slow hash algorithm.
6. The server stores the  **final hash**  and  **salt**  in the users table. The pepper is never stored.

### B: User Login

1. A user tries to log in with their email and password (e.g., “Pa$$w0rd123”).
2. The server retrieves the user’s  **stored hash**  and  **salt**  from the database (using their email).
3. The server retrieves the application’s secret  **Pepper**  from the environment variable.
4. The server combines the  **entered password**  with the  **salt**  and  **pepper** .
5. The server hands this combined string  *and*  the  **stored hash**  to the bcrypt.compare (or equivalent) function.
6. The library function re-hashes the user’s input using that same salt, and securely compares the two.
7. If they match, the user is authenticated. If not, the password was wrong.

### Practical Code Example (Node.js)

Here is a clean and minimal example using bcrypt in Node.js where the library handles salt generation for you.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/634af1b5-84bf-4a86-854d-1451bac81f28_3680x4556.png)](https://substackcdn.com/image/fetch/$s_!D4XZ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F634af1b5-84bf-4a86-854d-1451bac81f28_3680x4556.png)

## 7. The “Best” Way? Don’t Store Passwords at All.

There is one more option. Do not keep passwords. Delegate authentication to a trusted identity provider instead.

You have seen this everywhere: “Sign in with Google,” “Sign in with Facebook,” or “Sign in with GitHub.”

Under the hood these flows use standards like OAuth 2.0 and OpenID Connect.

- **Pros:**  You never store or manage user passwords. You shift the entire security burden to experts at Google, Microsoft, or Apple. A breach of your database is less catastrophic because you do not have any passwords to steal.
- **Cons:**  You create a dependency on a third party. If Google’s login service is down, your users cannot log in. It also may not be suitable for all types of applications.

> While building authentication at  **[algomaster.io](http://algomaster.io)** , I chose OAuth (Google and GitHub login) to avoid the complexity and risk of password management. For users who did not use Google accounts (e.g., Outlook or Hotmail), I added email OTP-based authentication as a fallback instead of storing passwords.

## Conclusion

Protecting user passwords is a fundamental responsibility for anyone building software. When you do it correctly, your users stay safe and your product earns trust. When you get it wrong, the fallout can be immediate, public, and irreversible.

Here are the non-negotiable rules:

- **NEVER**  store passwords in plain text.
- **DO NOT**  use old, fast hashes like MD5 or SHA-1.
- **ALWAYS**  use a modern, slow, adaptive hash (like  **Argon2**  or  **bcrypt** ).
- **ALWAYS**  use a unique  **Salt**  for every single user (which modern libraries do for you).
- **CONSIDER**  using a secret  **Pepper**  (stored outside the DB) to protect against database theft.
- **OR** , use a trusted third party provider (like “Sign in with Google”) and do not handle passwords at all.



Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
