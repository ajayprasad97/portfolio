---
title: "Support Chatbot"
preview: "Chatbot that streamlined support workflows and reduced repetitive inquiries."
cover: /assets/img/cover-placeholder.svg
tags:
  - AI
  - Support
  - Product
links:
  - label: "Demo"
    url: "#"
---
When I started this project, I had a vague idea of what a "chatbot" was something that takes your question and returns back an answer. By the end of it, I had a much clearer picture of what's actually happening under the hood, and more importantly, I had built something real: a working AI support assistant for nTop, a parametric design software used for complex engineering workflows.

This post covers what I built, how it works, and the decisions I made along the way.

## The Problem

nTop has a lot of documentation. There's a knowledge base full of support articles, and a Learn platform with tutorial content. If a user wants to know how to create a Gyroid lattice or what file formats the software supports, they have to hunt through multiple sources or open a support ticket.

The goal was simple: make a chatbot that could answer these questions accurately, by grounding its answers in real nTop documentation rather than just making things up.

---

## The Core Idea: RAG (Retrieval-Augmented Generation)

The first thing I had to understand was that a large language model (LLM) like GPT-4o-mini doesn't "know" your documentation. It has general knowledge baked in from training, but it has never seen your company's internal support articles. If you ask it about a specific nTop feature, it might hallucinate something plausible-sounding but wrong.

The solution is **Retrieval-Augmented Generation (RAG)** — a two-stage pattern:

1. **Retrieve** the most relevant chunks of documentation for the user's question
2. **Generate** a response using the LLM, but constrain it to only use what was retrieved

This keeps the LLM grounded. Instead of drawing on its general training, it reads the relevant documentation and answers from that. It's a bit like the difference between asking someone a question from memory versus asking them to answer it with the relevant manual open in front of them.

---

## How I Built It

### Step 1: Gathering and Preparing the Documentation

I collected documentation from two sources:
- **nTop Support** — nTop's support knowledge base
- **nTop Learn** — Tutorial and training content

Both were converted to markdown files, each with YAML frontmatter containing the document title and its original URL. That URL turned out to be important it's what lets the chatbot show source links with every answer so users can verify what they're reading.

### Step 2: Chunking the Documents

One of the first non-obvious problems I hit: you can't just dump entire documents into a vector database. Documents need to be broken into smaller, semantically coherent pieces — "chunks."

I used a two-pass approach:
- First, split by Markdown headers (H1, H2, H3) to respect document structure
- Then apply recursive character splitting to keep chunks under ~1,000 characters, with 200-character overlap between chunks to preserve context at boundaries

The overlap part matters. If a key sentence sits at the end of one chunk and the beginning of another, the overlap means you're less likely to lose it.

After processing all 1,212 documents, this produced **6,090 chunks** in about 32 seconds. For someone chunking for the first time I was surprised it was very fast.

### Step 3: Embedding and Storing in a Vector Database

Each chunk was converted into a **vector embedding** using OpenAI's `text-embedding-3-small` model. An embedding is a list of numbers (a vector) that captures the semantic meaning of the text. Texts with similar meanings produce vectors that are close together in vector space.

These embeddings were stored in **Chroma**, an open-source vector database. To avoid re-embedding the same content twice, each chunk was assigned an MD5 hash as its ID — so re-running the ingestion pipeline is safe and idempotent.

### Step 4: The Chat Interface and Retrieval

When a user types a question in the Streamlit web app, the same embedding model converts their question into a vector. Chroma then does a **similarity search** — finding the 3 stored chunks whose vectors are closest to the question vector.

Those 3 chunks become the "context" fed to the LLM, along with a prompt that instructs it to answer only based on that context:

> *"You are a helpful expert support assistant for nTop. Answer based ONLY on the following context: {context}. Question: {question}"*

The key phrase is "ONLY on the following context." This is what prevents the model from inventing answers.

### Step 5: Evaluation

Building the thing was one challenge. Knowing whether it worked was another.

I put together a small golden dataset — 5 representative questions about nTop — and built an evaluation script that runs the full RAG pipeline on each one, capturing:
- The generated answer
- Which sources were retrieved
- Token usage and cost
- Latency

I also built a competitive benchmark that compared the chatbot's responses against SiteGPT (a competitor product), using GPT-4o as an automated judge that scores responses 1-5 on accuracy and completeness.

### Step 6: Logging and Observability

Every conversation is logged to disk: the question, the answer, which sources were retrieved, how many tokens were used, what it cost, and how long it took. This turned out to be invaluable for understanding real usage patterns and catching cases where the retrieval wasn't finding the right content.

---

## What I Learned

**Retrieval quality is everything.** The LLM can only work with what it's given. If the wrong chunks come back from the vector search, the answer will be wrong or incomplete — no matter how capable the model is. Most of the debugging I did was on the retrieval side, not the generation side.

**Chunking strategy has real impact.** Splitting too aggressively loses context. Splitting too loosely makes retrieval less precise. The header-aware approach preserved document structure in a way that pure character splitting doesn't.

**Deduplication matters at scale.** Without MD5-based chunk IDs, re-running the ingestion pipeline would duplicate everything in the database.

**Metadata is what connects answers to sources.** Every chunk carries the original URL of its source document. Without that, you get answers without attribution — users have no way to verify or read more. Preserving metadata through the entire pipeline (ingestion → storage → retrieval → display) was a deliberate design choice.

**Cost is negligible at this scale.** Using GPT-4o-mini, a typical query costs around $0.00003-$0.00032. For a support chatbot answering dozens of queries a day, this is essentially free.

---

## The Stack

| Component | Tool |
|-----------|------|
| Web UI | Streamlit |
| LLM | GPT-4o-mini |
| Embeddings | text-embedding-3-small |
| Vector DB | Chroma |
| Orchestration | LangChain |
| Data format | Markdown + YAML frontmatter |

---

## Where This Goes Next

The chatbot works well for direct factual questions that are well-covered in the documentation. 

But as a foundation for understanding how RAG-based chatbots work — from raw documents to embedded vectors to a grounded LLM response — this project delivered exactly what I set out to learn.