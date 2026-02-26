---
title: "What are Checksums?"
description: "Imagine you're sending an important letter to your friend through the mail."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/what-are-checksums.md"
dateModified: "2024-05-26"
datePublished: "2024-05-26"
showOnArticles: true
topics:
  - system-design
---

Imagine you're sending an important letter to your friend through the  **mail** .

[![image](https://substack-post-media.s3.amazonaws.com/public/images/e73f5bc1-0380-41e7-af23-529db17793bf_1281x930.jpeg)](https://substackcdn.com/image/fetch/$s_!-Lvm!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe73f5bc1-0380-41e7-af23-529db17793bf_1281x930.jpeg)

Before sealing the envelope, you take a  **photo**  of the letter.

When your friend receives it, they take a photo of the letter and send it back to you.

If the two photos  **match** , you know the letter hasn't been tampered with or damaged during transit.

**If they don't match** , it's a clear sign something went wrong along the way—perhaps the letter was  **altered, or part of it was lost or damaged** .

In the digital world, checksums serve a similar purpose as those photos.

Just like taking photos help us answer the question:  **“Has the letter been altered or damaged“** ,  a checksum answers the question:  **"Has this data been altered unintentionally or maliciously since it was created, stored, or transmitted?"**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/062ca0ca-4cc8-41ff-bfc0-a23daef169d7_668x548.png)](https://substackcdn.com/image/fetch/$s_!LV4r!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F062ca0ca-4cc8-41ff-bfc0-a23daef169d7_668x548.png)

In this article, we'll explore checksums, how they work, different types, and their real world applications.

If you’re enjoying this newsletter and want to get even more value, consider becoming a  **[paid subscriber](https://blog.algomaster.io/subscribe)** .

As a paid subscriber, you'll unlock all  **premium articles**  and gain full access to all  **[premium courses](https://algomaster.io/newsletter/paid/resources)**  on  **[algomaster.io](https://algomaster.io)** .

# What is a Checksum?

A checksum is a  **unique fingerprint**  attached to the data before it's transmitted. When the data arrives at the recipient's end, the fingerprint is  **recalculated**  to ensure it matches the original one.

If the checksum of a piece of data matches the expected value, you can be confident that the data hasn't been modified or damaged.

Checksums are calculated by performing a mathematical operation on the data, such as adding up all the bytes or running it through a  **cryptographic hash function** .

[![Checksum - Wikipedia](https://substack-post-media.s3.amazonaws.com/public/images/17c78686-2db6-4696-a6f4-c89d4ab0d62d_604x600.svg)](https://substackcdn.com/image/fetch/$s_!0Tkt!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F17c78686-2db6-4696-a6f4-c89d4ab0d62d_604x600.svg)Credit: https://en.wikipedia.org/wiki/Checksum

# How Does a Checksum Work?

The process of using a checksum for error detection is straightforward:

1. **Calculation:**  Before sending or storing data, the original data is processed through a specific algorithm to produce a checksum value.
2. **Transmission/Storage:**  The checksum is appended to the data and sent over the network or saved in storage.
3. **Verification:**  Upon retrieval or reception, the checksum is recalculated using the same algorithm on the received data. This newly calculated checksum is compared with the original checksum.
4. **Error Detection:**  If the two checksum values match, the data is considered intact. If they do not match, it indicates that the data has been altered or corrupted during transmission or storage.

# Types of Checksums

There are several types of checksums, each with its own strengths and weaknesses. Here are a few of the most common:

- **Parity Bit:**  A parity bit is a single bit that is added to a group of bits to make the total number of 1s either even (even parity) or odd (odd parity). While it can detect single bit errors, it fails if an even number of bits are flipped.
- **CRC (Cyclic Redundancy Check):**  It works by treating the data as a large binary number and dividing it by a predetermined divisor. The remainder of this division becomes the checksum. CRCs are designed to detect common errors caused by noise in transmission channels.
- **Cryptographic Hash Functions:** These are one-way functions that generate a fixed-size hash value from the data. Popular examples include MD5, SHA-1, and SHA-256.

# **Real-World Applications of Checksums**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/a02838e4-8081-45d0-bfb1-39e9ae6206d9_1262x670.png)](https://substackcdn.com/image/fetch/$s_!2CiO!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa02838e4-8081-45d0-bfb1-39e9ae6206d9_1262x670.png)

- **File downloads** : Checksums verify that downloaded files are complete and uncorrupted.
- **Data backups** : Checksums ensure that backed-up data is accurate and trustworthy.
- **Network communication** : Checksums guarantee that data packets are transmitted correctly, preventing errors and corruption.

To summarize, checksums serve as a vital line of defense, safeguarding against errors and corruption.

From file downloads and data storage to network transmissions and software installations, checksums work tirelessly to detect errors, prevent corruption, and give us confidence in the accuracy of our digital information.


Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
