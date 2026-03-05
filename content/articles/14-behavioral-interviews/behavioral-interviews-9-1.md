---
title: "Choosing best solution"
description: "Choosing best solution - Behavioral Interview Module 9"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - behavioral-interview
courseName: 14-behavioral-interviews
showOnArticles: false
featured: false
---

# Choosing best solution

Question

##### Tell me about a time you had to analyze several different solutions to a problem and choose the best one.

In technology, there is rarely one single, "correct" way to solve a problem. For any given challenge, there are multiple paths forward, each with its own unique set of benefits and drawbacks.

*   Should you build a new feature from scratch or integrate a third-party service?
*   Should you use a well-known, stable technology or a cutting-edge, more productive one?
*   Should you choose the solution that is quickest to implement or the one that is more scalable in the long run?

The ability to navigate these choices—to analyze multiple options, evaluate their trade-offs, and make a well-reasoned decision—is a hallmark of a senior contributor and technical leader. It's the difference between simply executing a task and architecting a solution.

Your answer to this question demonstrates your technical depth, your business acumen, and the rigor of your decision-making process.

# **What Are They Looking For?**

The interviewer wants to see how you think. They are not just interested in the final decision, but in the process you used to get there. They are looking for:

*   **A Structured Process:** Do you have a systematic way of evaluating options, or do you just go with your gut feeling?
*   **An Understanding of Trade-offs:** Do you recognize that every technical decision is a trade-off? Can you articulate those trade-offs clearly?
*   **Broad Criteria:** Do you evaluate solutions on more than just the technical "coolness"? Do you consider factors like cost, maintenance overhead, team skill set, and time to market?
*   **Data-Driven, Not Opinion-Driven:** Do you use data, prototyping, or research to inform your decision?
*   **Communication & Influence:** Can you clearly articulate your recommendation and get buy-in from your team and stakeholders?

# **The "Options, Criteria, Decision" Framework**

A powerful story about technical decision-making follows a clear, three-part analytical framework. You can embed this directly into the "Action" part of your STAR story.

### **1\. Identify the Options**

Clearly lay out the 2-3 distinct solutions you considered. This shows that you didn't just jump to the first idea that came to mind.

### **2\. Define the Criteria**

This is the most important step. Explain the key criteria you used to evaluate the options. This reveals your strategic thinking. Great criteria often include:

1.  Performance & Scalability
2.  Time to Implement (Speed to Market)
3.  Development Cost & Operational Cost
4.  Maintainability & Simplicity
5.  Team's Existing Skill Set

### **3\. Make a Data-Informed Decision**

Describe how you evaluated the options against your criteria and made your final recommendation. Explain the key trade-off you were willing to make.

# **Structuring Your Answer with STAR Method**

### **S - Situation**

Describe the business or technical problem you needed to solve.

*   Example: "Our team was tasked with building a new search functionality for our e-commerce platform. The existing search was slow and provided poor results."

### **T - Task**

State your goal. It wasn't just to build the feature, but to choose the right long-term technical approach.

*   Example: "As the tech lead on the project, it was my responsibility to research and recommend the technical architecture for the new search service."

### **A - Action**

This is where you walk through your "Options, Criteria, Decision" framework.

*   **Action 1 (Identify Options):** "I identified three primary options. **Option A** was to build it ourselves using full-text search capabilities in our existing Postgres database. **Option B** was to use a dedicated open-source search engine like Elasticsearch. **Option C** was to use a third-party, managed search API service."
*   **Action 2 (Define Criteria):** "I then established the five key criteria for our decision: 1) Quality of search results, 2) Performance at scale, 3) Time to implement, 4) Long-term operational cost, and 5) Maintainability."
*   **Action 3 (Analyze & Decide):** "I created a simple decision matrix to evaluate each option. The Postgres solution was the fastest to implement but had the worst search quality and wouldn't scale well. The third-party API was also fast to implement but was very expensive and gave us less control. Elasticsearch had the best performance and search quality but had the highest implementation time and operational overhead. **After building a small proof-of-concept for both Postgres and Elasticsearch,** the data showed that Elasticsearch's search quality was dramatically better. I made the recommendation that we should choose Elasticsearch. **I argued that the trade-off of a longer initial development time was worth the significantly better user experience and long-term scalability.**"

### **R - Result**

Describe the positive outcome of your well-reasoned decision.

*   Example: "I presented my findings in a short design document, and the team and my manager agreed with the recommendation. We invested the time to build the service with Elasticsearch. It was a huge success. The new search was 10x faster, and our 'search-to-purchase' conversion rate increased by 15% in the first quarter. It was a foundational piece of technology that is still in use today."

# **A Worked Example**

### **Weak Answer**

"We needed to build a search feature. I looked at a few options like Postgres and Elasticsearch. Elasticsearch seemed better, so we went with that. It worked out well."

_(This lacks any detail about the decision-making process.)_

### **Strong, Analytical Answer**

**(S)** "We needed to add a real-time notification system to our application to alert users about important events. The existing system relied on inefficient polling, and we needed a more scalable solution.

**(T)** My task was to choose the right technology to build this new real-time infrastructure.

**(A)** I seriously considered two main **options**: using a managed service like Pusher or Ably, or building our own solution on top of WebSockets using a library like Socket.IO.

To make the right choice, I defined our **criteria**: 1) Scalability to handle 100,000 concurrent users, 2) Time to market, and 3) Long-term cost and engineering overhead.

I then did a time-boxed, one-day proof-of-concept for each. The managed service was incredibly fast to set up—I had a working prototype in two hours. However, the pricing model showed that it would become very expensive at our target scale. The self-hosted WebSocket solution took longer to set up, but the infrastructure costs were much lower, though it would require more ongoing maintenance from our team.

My final **decision** and recommendation was to go with the managed service. I presented to my manager that the key **trade-off** was cost versus speed. I argued that getting the feature to market three weeks faster was a huge competitive advantage for us, and the higher cost of the managed service was worth it for the first year. We could always migrate to a self-hosted solution later if the cost became prohibitive.

**(R)** My manager agreed with the analysis. We went with the managed service and were able to launch the entire real-time notification feature in under two weeks, which was a huge win for our Product team. It allowed us to quickly validate the feature's value with users before investing heavily in custom infrastructure."

# ✍️ Write Your Answer

Launching soon
