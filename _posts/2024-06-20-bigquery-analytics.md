---
title: "A Support Dashboard People Actually Opened"
preview: "Joining Zendesk, Salesforce, and licensing data in BigQuery to see which customers need help, and why."
cover: /assets/img/cover-placeholder.svg
tags:
  - Data
  - Analytics
  - SQL
---
This started with a question I hear a lot in support: *can we get one view of customer health that actually helps us prioritize?*

The data was already there. Zendesk, Salesforce, and our licensing data were all synced into the warehouse. They just had never been put together to answer support questions. This was a small internal project to change that, using BigQuery for the heavy lifting and Google Sheets (through Connected Sheets) as the dashboard. Not a full BI rollout, just something useful.

## Three sources, one picture

- **Zendesk:** CSAT, ticket volume, reopen rates, response times.
- **Salesforce:** account tier, segment, owner, renewal dates.
- **Licensing:** what each customer is entitled to, and what they actually use.

Each one on its own answers a narrow question. Together they start to explain what's going on with an account.

## Questions first, charts later

Before writing any SQL, I wrote down what support actually wanted to know:

- Which customers with low CSAT also aren't using what they're paying for?
- Do certain tiers or segments consistently send more tickets?
- Do accounts coming up for renewal show early warning signs, like a CSAT drop or a ticket spike?
- Are we spending a lot of support time on accounts that barely use the product?
- Which "support issues" are really onboarding or UX gaps?

Once those were clear, it was obvious how the data needed to line up.

## Building it in BigQuery

The main work was rolling everything up to the account level: tickets and CSAT per account, Salesforce details joined on, and license usage summarized by month. It helped to think about what each number meant rather than what it was. A CSAT score is a signal. Ticket volume is demand on the team. License usage tells you how much a customer has actually adopted the product. Designing the queries around those ideas made them easier to reason about and change later.

## Where AI helped

AI tools changed how I wrote the SQL. If you know your tables and what decision you're trying to support, writing the query stops being the hard part. Instead of starting from a blank editor, I'd describe what I wanted, something like *"join Zendesk CSAT with account-level license usage and flag customers whose satisfaction is dropping while ticket volume stays flat,"* and then review what came back. I still checked every join, filter, and edge case myself. I just got there a lot faster.

I also used an LLM to read the tickets themselves. Tags only tell you so much, and most of the useful detail is buried in long descriptions and back-and-forth replies. So I'd filter tickets in BigQuery by feature, time window, or segment, pass a sample to an LLM, and ask it to group similar issues and summarize what kept coming up. Is this confusion, a blocker, or a real bug? Is it growing, or just a couple of accounts? Those summaries sat next to the numbers, so we could see not just *that* tickets went up, but why.

## The chatbot question

Clustering tickets by what people were actually asking showed how repetitive a lot of support really is. The same "how do I…" questions, the same setup confusion, the same workflows tripping people up across different accounts.

That let us ask a better question. Instead of *"should we add an AI chatbot?"* it became *"which of these tickets are purely informational, and how many could a chatbot or better self-serve docs realistically handle?"* We could separate those from tickets that need real investigation and track the split over time. (I wrote separately about building a [support chatbot](/projects/support-chatbot/).)

## Why Sheets

Once the BigQuery views were solid, Connected Sheets was the last mile. It runs live queries with no exports, and anyone on the team could slice it by segment or account without learning a BI tool. For a support team, approachable beat polished.

## What I took away

- Support numbers mean a lot more next to product usage.
- CSAT alone isn't an answer. It needs context.
- AI makes the mechanical parts faster, but you still need to know what you're asking.
- A simple dashboard people actually open beats a perfect one nobody does.
- Repeated questions aren't user failure. They point to docs, UX, or onboarding that could be better, which is useful to hand to the product team.
