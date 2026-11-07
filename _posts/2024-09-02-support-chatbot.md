---
title: "Support Chatbot"
preview: "An AI assistant that answers nTop questions from our real docs, with a link to the source every time."
cover: /assets/img/cover-placeholder.svg
tags:
  - AI
  - Support
  - Product
---
When I started this, my idea of a chatbot was pretty vague: you ask a question, it gives you an answer. By the end I had a much better sense of what's happening under the hood, and a working AI support assistant for nTop, the engineering design software I support.

## The problem

nTop has a lot of documentation: a support knowledge base full of articles, and a Learn platform with tutorials. If someone wants to know how to make a gyroid lattice or which file formats are supported, they have to dig through both or open a ticket.

I wanted a chatbot that could answer those questions from our actual docs, instead of making something up.

## The core idea

An AI model like GPT-4o-mini doesn't know your documentation. It's never seen your support articles, so if you ask about a specific nTop feature it can give you something that sounds right and isn't.

The fix is a pattern called retrieval-augmented generation, or RAG. It works in two steps: first find the parts of the docs that match the question, then have the model answer using only those parts. It's the difference between asking someone from memory and asking them with the manual open in front of them.

## How I built it

**Gathering the docs.** I pulled everything from nTop Support and nTop Learn and converted it to Markdown. Each file got a small header with its title and original URL. That URL ended up mattering a lot, because it's how the chatbot shows a source link with every answer.

**Splitting it into chunks.** You can't drop whole documents into a vector database. They need to be broken into smaller pieces. I split first by headings, so sections stayed together, then capped each piece at about 1,000 characters with a 200-character overlap so nothing important got cut off at a boundary. That turned 1,212 documents into 6,090 chunks in about 32 seconds, which was much faster than I expected.

**Turning text into vectors.** Each chunk went through OpenAI's `text-embedding-3-small` model, which turns text into a list of numbers that captures its meaning. Similar ideas end up close together. Those vectors live in Chroma, an open-source vector database. Each chunk's ID is a hash of its content, so re-running the import doesn't create duplicates.

**Answering a question.** In the Streamlit app, your question gets turned into a vector the same way. Chroma finds the 3 closest chunks, and those go to the model with a prompt that says, in short: answer based *only* on this context. That one instruction is what keeps it from inventing things.

**Testing it.** I wrote 5 representative questions and a script that runs each one through the whole pipeline, recording the answer, the sources it pulled, tokens, cost, and response time. I also compared it against SiteGPT, an off-the-shelf chatbot tool, using GPT-4o to score both on accuracy and completeness from 1 to 5.

**Logging everything.** Every conversation gets saved: the question, the answer, the sources, tokens, cost, and timing. That turned out to be the most useful thing for spotting questions where it pulled the wrong content.

## What I learned

- **Finding the right docs is everything.** If the wrong chunks come back, the answer is wrong, no matter how good the model is. Most of my debugging was on the search side, not the answering side.
- **How you split the docs matters.** Too small and you lose context. Too big and the search gets fuzzy. Splitting by headings first made a real difference.
- **Keep the source link with every chunk.** Without it, people get answers they can't check.
- **It's cheap.** With GPT-4o-mini, a typical question cost between $0.00003 and $0.00032. For a few dozen questions a day, that's basically free.

## The stack

| Part | Tool |
|------|------|
| Web app | Streamlit |
| Model | GPT-4o-mini |
| Embeddings | text-embedding-3-small |
| Vector database | Chroma |
| Orchestration | LangChain |
| Docs format | Markdown with a small metadata header |

## Where it ended up

It does well on direct, factual questions that the docs already cover clearly. More than anything, it taught me how these assistants actually work, from raw docs to vectors to a grounded answer, which is exactly what I set out to learn.
