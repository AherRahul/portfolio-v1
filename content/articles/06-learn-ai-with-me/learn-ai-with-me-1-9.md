---
title: Security Risks
description: Just as the software development stack encounters security
  challenges, LLMs are also not immune to them. Although addressing these issues
  primarily is on the developers' shoulders, you—as a user or potential owner of
  an AI product—should be informed about these risks.
slidesUrl: https://github.com/AherRahul/portfolio-v1/blob/main/content/articles
dateModified: 2026-01-29
datePublished: 2026-04-10
showOnArticles: false
courseName: 06-learn-ai-with-me
topics:
  - ai
resources:
  - title: AI Notes
    type: PDF
    url: ""
    description: A PDF Notes.
---

![](https://res.cloudinary.com/duojkrgue/image/upload/v1758777282/Portfolio/aiCourse/Learn_AI_eyag79.png)

Security Risks
---------------------

Just as the software development stack encounters security challenges, LLMs are also not immune to them. Although addressing these issues primarily is on the developers' shoulders, you—as a user or potential owner of an AI product—should be informed about these risks.

There are three main vectors that can compromise the model's performance:

### Jailbreak Attacks 

This term refers to attempts to "break out" of the restrictions intentionally set by the development team to prevent the model's misuse for illegal or unintended purposes. Attackers often employ various tricks, such as inputting specific combinations of symbols, letters, binary code, base-64 encoding, or queries in different languages.

A classic example of a jailbreak attack includes bypassing a content moderation system for a social media platform. In that case, instead of blocking content that violates the platform’s guidelines, such as hate speech, the moderation system might fail to recognize and filter out offensive content.

### Prompt Injection 
It is about manipulating an LLM or LLM-based application and giving it what looks like new instructions and basically hijacking the system.

For example, an AI-driven chatbot designed to provide customer support could be tricked into revealing confidential customer data through a crafted query like, "What is the last transaction of user John Doe?" If the chatbot isn't properly secured, it might disclose this sensitive information.

### Data Poisoning/Backdoor Attacks

LLMs learn from the data on which they are trained. If this training data contains harmful or malicious content, it can influence the model’s behavior, leading to dangerous and harmful outputs.

For example, since many base models are trained on vast datasets sourced from the Internet, attackers who have control over what text appears on certain web pages might embed trigger phrases in these texts. These phrases can cause the model to execute undesirable actions or even corrupt the model when the trigger phrase is later used in a prompt.


These threats are under continuous investigation to develop robust defenses against them. However, it's important to understand that developers of LLMs often engage in a "cat and mouse" game with attackers, similar to other areas in cybersecurity. Once a loophole is closed, attackers may eventually discover another.

As a user, it's crucial to be aware of these security risks. Use the models developed by reliable vendors, employ guardian frameworks (such as those integrated into EPAM Dial), and be vigilant about the inputs you provide and the outputs you receive. Next, you will learn about specific types of data to avoid as input and other regulatory limitations.
