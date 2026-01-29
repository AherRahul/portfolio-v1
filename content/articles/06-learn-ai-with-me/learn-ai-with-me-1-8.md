---
title: Cognitive Constraints and Interaction Challenges
description: "One of the broadest groups of LLMs' limitations is Cognitive
  Constraints and Interaction Challenges. The good news is that these are among
  the most manageable ones for users when interacting with LLMs. This group
  includes five categories: non-human cognition, hallucinations, biased outputs,
  lack of knowledge, and stochastic nature."
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

Cognitive Constraints and Interaction Challenges
---------------------

One of the broadest groups of LLMs' limitations is Cognitive Constraints and Interaction Challenges. The good news is that these are among the most manageable ones for users when interacting with LLMs. This group includes five categories: non-human cognition, hallucinations, biased outputs, lack of knowledge, and stochastic nature.

Now, you will explore each category.

### Non-Human Cognition

Despite their learning ability, LLMs have no conscious understanding or thought process. They don't process and interpret information the way humans do. Humans comprehend and synthesize noises, visuals, and concepts, while LLMs map inputs to outputs based solely on learned patterns.

They might impersonate someone during communication if the training data allows it. However, this will not be a personal experience or cognition but just an imitation based on the available knowledge base.

This is an example of an LLM-based chatbot. The LLM acts as a customer support manager and replies in a helpful manner as if understanding the customer's needs. However, it's simply mimicking trained customer service responses without actual comprehension of the situation.

![](https://elearn.epam.com/assets/courseware/v1/ca6ce962dc14f6ee4735b2ac0c8895ed/asset-v1:EPAM+AI201+0724+type@asset+block/EngX_Lim_2_01_dialog_1_3x.png)

The inability of LLMs to reason and their sensitivity to the semantics of the input (such as using synonyms) may lead to inconsistencies, logical gaps, or repetitions, particularly over long conversations.

### Hallucinations

It's essential to remember that AI can trick users with perceptions that seem real but are made up. Although LLMs are usually correct and can generate grammatically correct and semantically meaningful text, their predictions are not always accurate. This phenomenon is known as **hallucination**.

> **Hallucinations** 
> 
> Refer to generating content that appears semantically or syntactically plausible but is factually incorrect or unrelated to the provided context.

Hallucinations can happen for a variety of reasons, including:

*   Inherent features of LLMs
*   Prompting weaknesses, such as inadequate context or poor wording

Primarily, you can meet such types of hallucinations:

### Factual Inaccuracies 

![](https://elearn.epam.com/assets/courseware/v1/28fdbfb5e208f4165be31586cf68e69c/asset-v1:EPAM+AI201+0724+type@asset+block/EngX_M1_L2_LLM_03_image_3x.png)

This type of hallucination includes generating text that contains factual errors or that is not based on reality due to a lack of explicit real-world knowledge.

In this case, LLM is providing factually incorrect information. Neil Armstrong was the first man to walk on the Moon, not Mars.

> **Why did it happen?**
>
> LLM cannot verify real-time data, access updated information, or possess explicit knowledge about factual events. As a result, it sometimes produces factually incorrect outputs.

### Fabrication or Misrepresentation 
![](https://elearn.epam.com/assets/courseware/v1/623586d12a97e96d71e6e3137c0c088d/asset-v1:EPAM+AI201+0724+type@asset+block/EngX_M1_L2_17_Accordion_Example_3x.png)

This type of hallucination includes creating artificial sources, making unfounded claims, or designing entirely fictional scenarios.

No such links, presentations, or articles exist in this case, but the names and links look like real ones.

> **Why did it happen?**
> LLM generates text by learning patterns from its training data, including URL-sharing instances for referencing. Consequently, LLM learned to create fictitious URLs in similar contexts. These generated URLs are not rooted in actual data; rather, they're based on these patterns it's learned.


### Nonsensical Output

![](https://elearn.epam.com/assets/courseware/v1/bc1fa53b7aee3297ace313dc32dbb846/asset-v1:EPAM+AI201+0724+type@asset+block/EngX_M1_L2_LLM_04_image_3x.png)

LLMs may sometimes respond with completely random, unrelated, or nonsensical answers in real-world contexts.

In this output, despite the input being clear and straightforward (can dogs fly), the model generates an output that is, by general knowledge, not true and completely nonsensical in the real-world context.


> **Why did it happen?**
> 
> Lacking common-sense information and real-world experiences, LLMs are unable to understand language or reality like humans. When a pattern is faulty or illogical, it may produce nonsensical text. Their output is further impacted by inconsistencies and mistakes when trained on large amounts of internet material.

#### Biased Outputs

Due to the nature of its training, LLM may sometimes reproduce or magnify the biases present in the training data it was modeled on.

The model assumes that a nurse is female. This is a biased output because it perpetuates the stereotype that nursing is a female profession, which is not accurate. Both men and women work as nurses.

![](https://elearn.epam.com/assets/courseware/v1/e6e8f5197a92ad32e86f7217190c1558/asset-v1:EPAM+AI201+0724+type@asset+block/EngX_M1_L2_LLM_05_image_3x.png)

> **Why did it happen?**
>
> Learning from their training data, LLMs may unintentionally absorb and spread biases found there.


#### Lack of Knowledge

When asked about recent events or technologies developed after the knowledge cut-off date, LLMs may plausibly and confidently answer the question. In that case, it is a hallucination. However, LLMs can indicate in their response the date when their knowledge base was frozen.

The model provided the response clearly indicating that the information is relevant as of 2021.

  
![](https://elearn.epam.com/assets/courseware/v1/2ef16e64516b7b1b3cd923831c3ce2ce/asset-v1:EPAM+AI201+0724+type@asset+block/EngX_Lim_2_02_dialog_2_3x.png)

> **Why did it happen?**
> 
> Developers attempt to minimize hallucinations by configuring the models to inform users that the answers might need additional external verification. However, hallucinations may still arise.


#### Stochastic Nature

The outputs of LLMs can vary slightly each time, even with the same input. You can write the identical prompts in separate dialogues, or regenerate the response. In each case, you will receive the outputs with different wording and style, even if the main sense remains the same.

In this case, LLM provides slightly different outputs that convey equivalent meanings.

  
![](https://elearn.epam.com/assets/courseware/v1/09dd8ac6e71fdad97ae858a37c211f81/asset-v1:EPAM+AI201+0724+type@asset+block/EngX_Lim_2_03_dialog_3_3x.png)

> **Why did it happen?**
> 
> This variability happens due to the underlying randomness in the model's generation process, which is designed to make the output more diverse and creative.

### How to Mitigate?

As a user of LLMs, you typically have no control over the training dataset or the chosen training approaches. This is the responsibility of the development team. However, you can still mitigate and overcome some of the cognitive constraints and interaction challenges by employing the following strategies:

*   #### **Prompt Engineering:** This involves structuring and adjusting your prompts in a way to obtain more accurate and relevant responses from the LLM.
*   **Retrieval-Augmented Generation (RАG):**  Issues with outdated or incomplete knowledge can be partially resolved using the RAG approach, which involves external data sources in the response generation process. It's important to note that not all LLMs support this feature.
    > Retrieval-Augmented Generation is a framework combining a pre-trained language model and content store, which can be open like the Internet or closed like a collection of documents. With an RАG, the model has internal instructions to first go to the content store and retrieve the relevant information, then combine it with the user’s question, and finally generate the response.
*   **Feedback:** Many LLM platforms allow users to tag or report unsatisfactory responses. Developers can use this feedback to fine-tune the models, resulting in improved accuracy and reduced errors over time.
*   **Cross-Verification:** Always cross-verify the information provided by LLMs, especially when dealing with factual data. Use reliable external sources to ensure the accuracy of the information.
*   **Combining Models:** Combine different LLMs to obtain responses. This can involve querying several models with the same prompt and comparing their answers or using one model's strengths to compensate for another's weaknesses.
