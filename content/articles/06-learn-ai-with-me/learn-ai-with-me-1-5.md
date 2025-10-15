---
title: "How LLMs Work"
description: "LLMs learn patterns and relationships between words and phrases during the pre-trained process. They learn statistical patterns, grammar, and semantics of human language using massive amounts of text data from the Internet and books. This allows them to collect a vast knowledge base and predict the next word given the context of the preceding words using mathematical calculations and probability."
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

How LLMs Work
---------------------

LLMs learn patterns and relationships between words and phrases during the pre-trained process. They learn statistical patterns, grammar, and semantics of human language using massive amounts of text data from the Internet and books. This allows them to collect a vast knowledge base and predict the next word given the context of the preceding words using mathematical calculations and probability.

Look at this example. Imagine you're using LLM trained on a dataset heavily influenced by online forums. A prominent topic in these forums could be the flat-earth theory. Due to this bias in the data, the LLM might predict the next word after "The Earth is..." to be "flat" with a surprisingly high probability, say 40%.

While "round" (the scientifically accepted answer) might still be a strong contender at 35%, the prevalence of flat-earth discussions in the training data would make "flat" a significant option for the LLM's prediction.

![image](https://elearn.epam.com/assets/courseware/v1/ca3ba7a259a031985dab18f1065f36bf/asset-v1:EPAM+AI201+0724+type@asset+block/EngX_AI_101_01_3x.png)

The LLM leverages these probabilities to generate coherent and contextually appropriate text based on the data it was trained on. This probability tree is also the reason why LLMs can exhibit biases. Probabilities are established during the training phase and heavily rely on the dataset used to train the model.

But how exactly do LLMs process your input? What changes happen with input data during output generation? The answer hides in the LLM's architecture.

### Transformer Architecture

Before the transformers, LLMs processed data in a sequential manner, which could miss dependencies throughout long text sequences. Transformers revolutionized this field. They process data in parallel, managing long-term dependencies inside the text. Due to the self-attention mechanism, transformer architecture allows for a more context-aware interpretation of the language. It speeds up training, improves model performance, and facilitates better scalability as data volume increases.

> Self-Attention Mechanism : Inspired by human attention, the self-attention mechanism allows a model to focus on relevant parts of the input when processing data, much like humans focus on specific aspects of an image or text to extract important information. It "attends" to specific segments more heavily, allocating more attention to them.


The structure of transformers typically includes an **encoder** and a **decoder**, where the encoder is responsible for understanding context and the decoder for generating output. Each of these components consists of multiple layers of neural networks. The number and size of these layers vary based on the model.

LLMs operate by converting textual input into numerical data because their inner computations are based on mathematical functions. Here is a simplified explanation of how transformers process your input and produce output.

![flat image](https://elearn.epam.com/assets/courseware/v1/63e58c18c915ae7a1e09bf3028b1de4c/asset-v1:EPAM+AI201+0724+type@asset+block/EngX_M1_L2_LLM_02_hotspot_3x.png)

### Input

You provide an input, also called a prompt. The prompt is then tokenized, converting the text into smaller units (tokens). Each token is assigned a numeric ID based on the model's vocabulary. This vocabulary is a list where each unique token from the training dataset is associated with a unique index.

**Example:**

Prompt: "The CAT chased the dog."

Tokens: \["The", "CAT", "chased", "the", "dog", "."\]

Token IDs: \[101, 102, 103, 104, 105, 106\]

### Embedding

After IDs are assigned to tokens, they need to be converted into a set of numbers (vectors) that define each token's initial semantic meaning. This process employs neural networks and is called embedding. The result of the embedding process is a set of vectors called embeddings. They are used in the transformer model for further processing.

**Example:**

"The" (ID: 101): \[0.2, 0.1, 0.4\]

"CAT" (ID: 102): \[0.3, 0.6, 0.1\]

"chased" (ID: 103): \[0.5, 0.2, 0.7\]

"the" (ID: 104): \[0.2, 0.2, 0.4\]

"dog" (ID: 105): \[0.6, 0.3, 0.4\]

"." (ID: 106): \[0.1, 0.4, 0.3\]

Note that it's a simplified version. The true vectors are much larger and have much more dimensions (up to 760+).

### Positional Encoding

The model processes embeddings using many layers of neural networks. An essential part of this processing is positional encoding, where special vectors (positional encodings) are added directly to the embeddings. They have the same dimension as embeddings and help to preserve sequence information. Thus, even if the same word appears in different positions, its resulting vector representation will be different.

This is crucial because swapping words, as in "The CAT chased the dog" and "The dog chased the CAT" sentences, changes the meaning entirely.

So, by adding positional values, the model can correctly interpret the order and meaning of each word and word sequence.

**Example:**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| **Token** | **Token ID** | **Initial Embedding** | **Positional Encoding** | **Combined Vector** |
| "The" | 101 | \[0.2, 0.1, 0.4\] | \[0.00, 0.00, 0.00\] | **\[0.20, 0.10, 0.40\]** |
| "CAT" | 102 | \[0.3, 0.6, 0.1\] | \[0.01, 0.02, 0.01\] | **\[0.31, 0.62, 0.11\]** |
| "chased" | 103 | \[0.5, 0.2, 0.7\] | \[0.02, 0.04, 0.02\] | **\[0.52, 0.24, 0.72\]** |
| "the" | 104 | \[0.2, 0.2, 0.4\] | \[0.03, 0.06, 0.03\] | **\[0.23, 0.26, 0.43\]** |
| "dog" | 105 | \[0.6, 0.3, 0.4\] | \[0.04, 0.08, 0.04\] | **\[0.64, 0.38, 0.44\]** |
| "." | 106 | \[0.1, 0.4, 0.3\] | \[0.05, 0.10, 0.05\] | **\[0.15, 0.50, 0.35\]** |

### Self-Attention Mechanism

Self-attention connects enriched embeddings as they progress through the model's levels, clarifying the context and mutual dependencies. The self-attention mechanism assists the model in calculating attention scores for the entire input sequence. It indicates how much focus should be placed on different words in the sentence when trying to understand the meaning of a specific word. Based on these attention scores, the transformer can adjust the embeddings during processing, refining their meaning.

**Example:**

The **CAT** **chased** the dog.

|     |     |     |
| --- | --- | --- |
| **Token** | **Token ID** | **Updated Embedding** |
| "The" | 101 | \[0.20, 0.10, 0.40\] |
| "CAT" | 102 | **\[0.45, 0.49, 0.45\]** |
| "chased" | 103 | \[0.52, 0.24, 0.72\] |
| "the" | 104 | \[0.23, 0.26, 0.43\] |
| "dog" | 105 | \[0.64, 0.38, 0.44\] |
| "." | 106 | \[0.15, 0.50, 0.35\] |

Based on the action-related token "chased," which has high attention scores, the model shifted the meaning of the "CAT" closer to the "animal" context instead of different acronyms

CAT written in capital letters, can refer not only to animals but to the acronym for Computer-Assisted Translation or Computerized Axial Tomography.

. The process of refining the meaning is iterative and can be repeated until the full context-awarness.

### Decoder

Similar to the encoder, the decoder is constructed of multiple layers of neural networks. These layers also incorporate positional encoding and self-attention mechanisms. The processes in the decoder are reversive to those in the encoder—from enriched embeddings to token IDs.

Based on the encoded inputs and previously generated tokens, the decoder assigns probabilities to all possible words in its vocabulary (probability distribution) and generates a response, one token at a time. Typically, the word with the highest probability is selected as the next token in the response. Alternatively, the next token can be randomly sampled from the predicted probabilities. This adds some variability and creativity to the model's output.

**Example:**

Token IDs: \[109, 110, 111, 112, 113, 114, 104, 115, 116, 117, 104, 105, 118, 104, 108, 107\]

The output of the decoder is the set of token IDs.

### Output

Since the tokens are generated one at a time, the process of detokenization is also sequential.

Based on the model's vocabulary, each token ID is mapped to a specific token. Then tokens are converted into the text output.

**Example:**

Token IDs: \[109, 110, 111, 112, 113, 114, 104, 115, 116, 117, 104, 105, 118, 104, 108, 107\]

Tokens: \["That", "is", "an", "interesting", "reversal", "of", "the", "usual", "scenario", "where", "the", "dog", "chases", "the", "cat", "!"\]

Output: That is an interesting reversal of the usual scenario where the dog chases the cat!

Now you know how the output generation occurs. While the output accuracy heavily depends on the quality of the training dataset, the clarity of your input is also valuable. Next, you will explore the role of prompts and how they influence the results.
