---
title: "Automated Knowledge-Base Sync Pipeline"
preview: "A weekly GitHub pipeline that pulls our support articles, courses, and docs into one clean, private repo an AI assistant can use."
cover: /assets/img/kb-sync.svg
featured: true
tags:
  - Automation
  - Docs
  - Tooling
---
At nTop, the answers to most customer questions already existed. The problem was where they lived: support articles in Zendesk, courses in LearnDash, and technical docs spread across a few private Git repos. If you wanted the full picture, you had to check all three.

I wanted an AI assistant that could answer from all of it at once. Before that could work, the content had to live in one place, in a format a model could actually read, without exposing anything that wasn't meant to be public. This post is about that groundwork.

## The idea: treat docs like code

Instead of having the assistant call three different APIs, I pull everything into a single private Git repo and keep it in sync. Docs get the same treatment as source code: version history, pull requests, and a review before anything changes.

## Pulling the content

There are three small Python scripts, one per source:

- **Zendesk:** grabs published articles, skips drafts, and saves images locally.
- **LearnDash:** crawls the courses and keeps the course, lesson, and topic structure intact.
- **Git repos:** uses sparse checkout to grab only the documentation folders, not the full history.

A GitHub Actions workflow runs them every Sunday at midnight UTC. Each run wipes the old copy and replaces it with a fresh one, so the repo never drifts from the source. Changes come in as a pull request, so a person can look them over before anything merges.

## Cleaning it up

Raw HTML is a bad input for an AI model. It's full of `<div>` and `<span>` tags and inline styles that waste tokens and add noise. A shared cleanup module, `cleanup_utils.py`, runs on everything before it's saved. It strips the markup, turns tables into plain sentences that embedding models handle better, and adds a small metadata header to every file:

```yaml
---
title: "How to Create a Gyroid Lattice"
source_platform: "zendesk"
source_url: "https://support.ntop.com/hc/en-us/articles/..."
updated_at: "2025-11-23"
---
```

That header turned out to be the most important piece. Because every file knows where it came from, the assistant can link back to the original article when it answers. Without it, you get answers nobody can check.

## Keeping it private

This is internal content, so a few rules weren't up for debate:

- API keys live in environment variables locally and in GitHub Secrets in the cloud. Never in the code.
- The knowledge base repo is private.
- The vector database runs locally, not on a third-party cloud service.
- Drafts and internal-only articles get filtered out during extraction.

## Where it landed

There's now one place that holds everything. When someone updates a Zendesk article, the change gets picked up, cleaned, and re-embedded on the next weekly run. No manual copying.

## What I learned

- **Every API is different.** Zendesk and WordPress (which runs LearnDash) handle auth and data in completely different ways, so each script ended up being its own thing.
- **Set up secrets properly from day one.** Getting environment variables and GitHub Secrets right early is much easier than untangling them later.
- **Metadata matters more than I expected.** Plain text isn't enough. The source link on each file is what makes the answers trustworthy.
- **Automation pays off fast.** What used to be a manual, easy-to-forget export now just happens every week.
