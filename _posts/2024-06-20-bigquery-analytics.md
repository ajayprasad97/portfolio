---
title: "Figuring Out BigQuery, Connected Sheets, and a Product Support Dashboard That Actually Worked"
preview: "SQL + BigQuery pipelines for licensing usage insights and product analytics."
cover: /assets/img/cover-placeholder.svg
tags:
  - Data
  - Analytics
  - SQL
---
### Context

*This was a lightweight internal project aimed at helping Product Support teams better understand customer health and support demand by connecting existing warehouse data. The goal wasn't to build a full BI solution, but to answer practical support questions around CSAT, product adoption, and ticket deflection using BigQuery, Connected Sheets, and selective use of LLMs.*

---

Like most analytics problems in Product Support, this one started with a familiar ask:

> "Can we get a single view of customer health that actually helps support teams prioritize better?"

The data already existed. It just lived in different systems and had never been designed to answer *support-specific questions* together.

This post is about how I used **BigQuery as the backbone** and **Google Sheets (via Connected Sheets)** as a lightweight dashboard—focused specifically on **product support decision-making**, not vanity metrics.

---

## The Data Was Already There (Just Not Support-Ready)

All the sources were already synced into our warehouse:

- **Zendesk** → CSAT, ticket volume, reopen rates, response times  
- **Salesforce** → account tier, segment, ownership, renewal timelines  
- **Internal licensing data** → feature entitlements and actual product usage  

Individually, each dataset answered a narrow question. Together, they helped answer the questions Product Support teams actually care about.

---

## Asking the Right Product Support Questions

Instead of starting with charts, I started with **support-driven questions**, such as:

- Which customers with **low CSAT** are also **not fully using the product they're licensed for**?
- Are certain **account tiers or segments** consistently generating higher ticket volume?
- Do customers approaching renewal show **early support signals** (CSAT drops, ticket spikes)?
- Are we spending disproportionate support effort on accounts with **low product adoption**?
- Which tickets look like "support issues" but are really **onboarding or UX gaps**?

Once these questions were clear, it became obvious how the data needed to line up.

---

## BigQuery as the Support Intelligence Layer

BigQuery worked well because it let me:

- Normalize support events (tickets, CSAT) to an **account-level view**
- Join Salesforce context without duplicating logic
- Aggregate licensing data at a **support-relevant grain** (monthly, per account)

The key was thinking in terms of **support outcomes**, not raw data.

For example:
- CSAT wasn't just an average—it was a signal
- Ticket volume wasn't noise—it was demand on the support system
- License usage wasn't telemetry—it was adoption context

Designing queries around these meanings made the pipeline easier to reason about and easier to evolve.

---

## How LLMs Changed the Way I Build Support Analytics

One thing that genuinely changed my workflow was using **LLMs**.

If you:
- understand your support metrics,
- know what your tables represent,
- and are clear about the decision you're trying to enable,

then SQL stops being the hard part.

Instead of starting from a blank editor, I'd describe intent:

> "Join Zendesk CSAT with account-level license usage and flag customers with declining satisfaction but stable ticket volume."

This shifted my role from *syntax author* to *logic reviewer*. I still validated joins, filters, and edge cases—but iteration speed improved dramatically.

LLMs didn't replace judgment. They removed mechanical friction.

---

## Using LLMs to Synthesize Support Ticket Data

One interesting thing I've been experimenting with is using **LLMs to synthesize support ticket data around specific topics**.

Support tickets are rich, but messy. Even with tagging, much of the signal lives in:
- long descriptions,
- follow-up replies,
- different ways customers describe the same problem.

Instead of normalizing everything manually, I used LLMs to answer higher-level questions like:

- What recurring themes show up in tickets related to a specific feature?
- Are customers confused, blocked, or hitting real bugs?
- Is a pattern growing over time or isolated to a few accounts?

The goal wasn't to replace quantitative metrics—but to **add qualitative context** on top of them.

---

## How This Fits Into the Data Pipeline

The workflow stayed intentionally simple:

1. Use BigQuery to filter tickets by:
   - topic or feature area  
   - time window  
   - account segment or tier  

2. Pass sampled or grouped ticket text to an LLM to:
   - summarize recurring themes  
   - cluster similar issues  
   - flag emerging patterns  

3. Store the synthesized output alongside metrics like:
   - ticket volume  
   - CSAT  
   - license usage  

This made it possible to see not just *that* tickets increased—but **why**.

---

## From Repetitive Questions to Chatbot Deflection Potential

One practical outcome of this approach was understanding **how repetitive our support questions really are**.

When you look at tickets individually, everything feels unique. But when clustered by intent, patterns become obvious:
- repeated "how do I…" questions,
- recurring setup or configuration confusion,
- the same workflows causing friction across accounts.

This allowed us to ask a more grounded question:

> *If we introduced an AI chatbot or improved self-serve flows, what percentage of tickets could realistically be deflected?*

Instead of guessing, we could:
- identify tickets that were **purely informational**,
- separate them from cases requiring investigation or judgment,
- quantify deflection potential over time.

This reframed chatbot conversations from:
> "Should we add AI support?"

to:
> "An AI assistant could realistically handle ~X% of tickets in these categories."

---

## Why This Matters for Product Support (and Product)

From a Product Support perspective, this helped with:

- **Capacity planning**  
  Knowing what's repetitive vs complex makes forecasting more accurate.

- **Documentation and onboarding prioritization**  
  Repeated questions are signals, not user failure.

- **More credible AI investments**  
  Chatbots become targeted tools, not blanket solutions.

It also created a better bridge to Product:
- repetitive issues → docs, UX, or automation fixes  
- non-repetitive issues → deeper product or reliability work  

In other words, LLMs helped highlight **which tickets shouldn't exist in the first place**.

---

## Why Connected Sheets Was the Right Final Step

Once the BigQuery views were solid, **Connected Sheets** worked perfectly as the last mile:

- Live queries without manual exports
- Easy slicing by segment or account
- Low friction for non-technical stakeholders

For Product Support teams, this mattered.  
The dashboard needed to be **approachable, flexible, and fast**, not polished and locked behind a BI tool.

---

## What This Taught Me About Product Support Analytics

A few takeaways that stuck with me:

1. Support metrics are most powerful when combined with product usage  
2. CSAT alone is not insight—it needs context  
3. LLMs reduce friction, but clarity still matters most  
4. Simple dashboards often get used more than perfect ones  

If you start with a clear support outcome in mind, you can always backtrack and build the right pipeline.

Sometimes all it takes is the right joins, the right questions, and a dashboard people actually open.
