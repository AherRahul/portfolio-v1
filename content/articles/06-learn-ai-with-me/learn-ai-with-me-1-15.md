---
title: "Retrieval-Augmented Generation (RAG)"
description: "Imagine a world where your fridge reorders groceries before you run out, and your car avoids rush hour traffic like a seasoned pro. This isn't science fiction anymore – it's the exciting frontier of Artificial Intelligence (AI)"
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-04-10"
datePublished: "2025-04-10"
showOnArticles: false
courseName: 06-learn-ai-with-me
topics:
  - ai
resources:
  - title: "AI Notes"
    type: "PDF"
    url: ""
    description: "A PDF Notes."

---

![](https://res.cloudinary.com/duojkrgue/image/upload/v1758777282/Portfolio/aiCourse/Learn_AI_eyag79.png)

Retrieval-Augmented Generation (RAG)
---------------------

Retrieval-augmented generation (RAG) systems enhance LLMs' inherent capabilities by pulling information that is not in the initial training dataset from external databases or documents before generating responses. This approach improves the factual accuracy and contextual relevance of outputs.

> **Retrieval-Augmented Generation (RAG)** refers to a framework that combines information retrieval with text-generative models. It works by retrieving relevant information from a knowledge base, incorporating it into a language model's input, and generating responses based on both the original query and the retrieved data.

RAG systems always include two key components:

*   **Retriever**: This component functions like a search engine, scanning a data source to find and retrieve the most relevant documents or pieces of information that can help answer a user request. It may employ AI models designed for specific tasks (such as BERT or SBERT for generating embeddings), search methods and algorithms, plugins, vector databases, and other programming mechanisms.
*   **Generator**: This is a core LLM (such as GPT-4) that generates the final output based on the user input and the retrieved context.

Here is a simplified scheme of how the RAG system functions:

![flat image](https://elearn.epam.com/assets/courseware/v1/de2202aae17c90132085ac9afc4883a7/asset-v1:EPAM+AI201+0724+type@asset+block/EngX_Tooling_and_RAG_01_scheme_3x.png)

### **User Prompt**

> This is the original text query or input provided by the user. It serves as the primary context for the LLM to understand what information is being requested.
> 
> **Example:** Imagine you need to analyze an internal report on employee engagement to present to organizational leaders. The prompt can be as follows: "What are the key takeaways from the latest employee engagement survey?"

### **Data Source**

> This is where the system looks for information. The data source contains the raw data, which could be documents attached to the query, a collection of documents on a server, or internet content like Wikipedia articles.

### **Retriever**

> This phase includes four main steps:
> 
> 1.  User prompt processing and constructing the search query.
> 2.  Semantic search for relevant information utilizing different algorithms.
> 3.  Extracting the corresponding documents or parts of the documents.
> 4.  Prioritizing (ranking) the retrieved text and potentially filtering the most useful information from it.
> 
> The retriever component might involve the conversion of the prompt into vector-based embeddings representing semantic meaning with the help of transformer-based AI models. Alternatively, it may involve algorithmic-based processes if the search step follows traditional keyword (textual) search techniques for finding exact matches.

### **Retrieved Context**

> Not all the information extracted from external data sources goes to the LLM input. Since an LLM that generates the final output has a limited context window size, the retrieved context should be concise, capturing the semantic nuances of the text.
> 
> This is the most relevant data retrieved in text form.
> 
> **Example:** 
> 1. Employee satisfaction increased by 10% compared to last year, indicating improved morale...
> 2. 75% of employees feel valued and recognized for their contributions...
> 3. Areas for improvement include communication and career development opportunities..."

### **Prompt Constructor**

> This component is responsible for preparing the input for the main LLM. It combines:
> 
> 1.  The original user prompt (in text form)
> 2.  The selected context (retrieved and filtered text)
> 3.  Any additional instructions or prompt templates, such as how the retrieved information should be applied or any relevant metadata (source citations, document titles, etc.) that may help the model generate a more informed response.
> 
> **Example:** "User Query: What are the key takeaways from the latest employee engagement survey?
> 
> Retrieved Context:
> 1.  Employee satisfaction increased by 10% compared to last year, indicating improved morale...
> 2.  75% of employees feel valued and recognized for their contributions...
> 3.  Areas for improvement include communication and career development opportunities...
> 
> Instructions: Using the provided context, answer the user's question. If the context doesn't contain all necessary information, use your general knowledge to provide a complete answer."

### **LLM**

> This is the main language model, such as GPT-4, responsible for generating the final response based on the constructed prompt.

### **Output**

> This is the final response to the user's query, generated by the LLM based on the original query and the retrieved context.
> 
> **Example:** "The key takeaways from the latest employee engagement survey show that employee satisfaction has increased by 10% compared to last year, reflecting an improvement in overall morale. Additionally, 75% of employees report feeling valued and recognized for their contributions. However, there are areas that need attention, such as enhancing communication and providing more opportunities for career development. Addressing these concerns could further bolster employee engagement."


Note that even when using external sources for the enriched context, strong prompt engineering skills are still essential for crafting initial prompts to ensure that the LLM produces the best possible response.

RAG systems are complex. They typically require additional components for the retrieval part, such as retrieval plugins or other LLM plugins and external tools to manage the data sources.

Here are some benefits and disadvantages of using RAG systems:

### Benefits
*   Extension knowledge beyond initial training data of the model
*   Reduction inaccuracies and "hallucinations" in generated content
*   Capability to incorporate company/project-specific or proprietary information in responses

### Disadvantages
*   Potential delays in real-time user interactions due to the speed of the data retrieval process
*   Dependency on the quality and reliability of the data sources and materials
*   Higher computational resource requirements compared to traditional models due to the dual processing of generative and retrieval components

### Practical Applications

RAG systems are used for multiple purposes, including but not limited to extracting specific data for generating reports or targeted question-answering. Here are a couple of specific use cases:

### E-Commerce Customer Service 

Imagine that a customer has just received a purchase by mail but wants to return it. They ask a chatbot available on the website of the shop: _"How can I return my order #...? The product inside the package was damaged."_

> **Without RAG**
> 
> A standard chatbot may provide generic or outdated information regarding return policies.
> 
> Example answer: _"Please check our returns information on the website."_

> **With RAG**
> 
> The chatbot can access a live database of updated information, offering precise and accurate responses to customer inquiries.
> 
> Example answer: _"You can return damaged items within 30 days of receipt. Please fill out the return form on our website \[link\], and you’ll receive a prepaid shipping label via email. For more details, click \[here\]."_


### Academic Research Assistance
Imagine a graduate student working on a literature review for their thesis on climate change impacts. They ask a research assistant chatbot: _"What are the latest findings on sea level rise in coastal cities?"_

> **Without RAG**
> 
> A standard chatbot might provide general information based on its training data, which could be outdated or limited.
> 
> Example answer: _"Sea levels are rising due to climate change, which poses risks to coastal cities. You should check recent academic journals for specific data."_

> **With RAG**
> 
> The chatbot can access up-to-date academic databases, recent publications, and current research data to provide more precise and relevant information.

> Example answer: _"Recent studies from 2023 show that sea levels are rising faster than previously predicted. A paper by \[Authors\] in \[Source\] reports an average rise of 3.7mm per year over the last decade in coastal cities. This is 30% higher than earlier projections. The study also highlights that cities like Miami and New Orleans are at particular risk, with potential sea level rises of up to 1 meter by 2100 if current trends continue. For more details, I recommend checking the following recent publications: \[list of 3-4 relevant papers with brief summaries\]. Would you like me to provide more information on specific coastal cities or mitigation strategies? "

### **The DIAL RAG**
> This option retrieves relevant parts of the document and passes them to the **GPT-4** model to synthesize the answer. It supports the following document formats: PDF, DOC/DOCX, PPT/PPTX, TXT, and plain text (e.g., code files).

### **The Mixtral RAG**
> This option retrieves relevant parts of the document and passes them to an open-source EPAM-hosted **Mixtral-8x7B** model to synthesize the answer. In addition to the formats supported by the Dial RAG, it also supports XLSX.

AI tools are continuously evolving. RAG systems, along with LLM plugins, represent significant advancements in enhancing the capabilities of language models. By integrating external information and services, these technologies improve the accuracy of the outputs and enrich the user experience. Thus, they broaden the scope of tasks that can be performed using language models, paving the way for more innovative applications in the future.
