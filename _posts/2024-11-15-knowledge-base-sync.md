---
title: "Automated Knowledge-Base Sync Pipeline"
preview: "GitHub based pipelines that automated syncing of knowledge-base content"
cover: /assets/img/kb-sync.png
featured: true
tags:
  - Automation
  - Docs
  - Tooling
links:
  - label: "Case Study"
    url: "#"
---
Many engineering organizations encounter the challenge of knowledge fragmentation, where critical information is sequestered across disparate systems such as Zendesk support repositories, LearnDash learning management systems, and private Git version control repositories. Consequently, retrieving comprehensive technical information necessitates navigating multiple distinct platforms.

The objective was to develop an Artificial Intelligence (AI) conversational interface capable of synthesizing information from these diverse sources. However, the proprietary nature of the data presented a significant constraint, precluding the use of public Large Language Models (LLMs) due to data security concerns. Therefore, a system that was simultaneously automated, secure, and accurate was required.

This document delineates the methodology for constructing a Docs-as-Code Retrieval-Augmented Generation (RAG) pipeline to address these challenges.

## The Architecture: "Docs-as-Code"

The foundational architectural principle was the "Docs-as-Code" methodology, wherein documentation is managed with the same rigor and tooling as software source code.

Rather than establishing direct connections to disparate Application Programming Interfaces (APIs), the pipeline synchronizes all data into a centralized, sanitized Git repository.

### 1. The Extraction Layer (Python + GitHub Actions)

The extraction layer comprises three distinct Python scripts designed to retrieve content:

* **Zendesk Retrieval:** Extracts published articles while filtering drafts and locally archiving images.
* **LearnDash Retrieval:** Crawls the Learning Management System (LMS), preserving the strict hierarchy of Courses, Lessons, and Topics.
* **Git Repository Cloning:** Utilizes "Sparse Checkout" to selectively retrieve specific documentation directories from external private repositories without duplicating the entire version history.

**Automation Protocol:** A GitHub Actions workflow facilitates automation, executing these scripts on a weekly schedule (Sunday at 00:00 UTC). This process employs a "wipe and replace" synchronization strategy to ensure the repository maintains strict parity with the source systems. Furthermore, automated Pull Requests are generated to permit peer review prior to merging changes.

### 2. The Sanitization Layer (Data Pre-processing)

Unprocessed HyperText Markup Language (HTML) creates suboptimal input for AI models, resulting in inefficient token usage and potential interpretability issues.

A centralized utility module, cleanup_utils.py, functions as a middleware layer. Prior to archival, data undergoes the following transformations:

* Removal of Extraneous Elements: Eliminates semantic noise such as <div> tags, <span> tags, and inline styles.
* Table Linearization: Converts complex HTML tables into descriptive text paragraphs to ensure compatibility with embedding models.
* Metadata Injection: Appends a YAML Front Matter block to the header of each file.

**The Importance of YAML Metadata:** The inclusion of YAML Front Matter is critical for establishing data provenance. By annotating each file with its source Uniform Resource Locator (URL), the system enables the conversational agent to provide verifiable citations.

---
title: "How to Create a Gyroid Lattice"
source_platform: "zendesk"
source_url: "[https://support.ntop.com/hc/en-us/articles/](https://support.ntop.com/hc/en-us/articles/)..."
updated_at: "2025-11-23"
---

## Protocols for Handling Proprietary Information

Ensuring data security was a paramount concern. The following protocols were implemented:
1. Credential Management: All API keys (Zendesk, WordPress, OpenAI) are loaded via environment variables locally and GitHub Secrets in the cloud, ensuring they are never hardcoded into the source.
2. Repository Privacy: The "Knowledge Base" repository is maintained as private, ensuring access control even for the raw text data.
3. Local Vector Storage: The vector database resides on the local server or machine, rather than in a third-party vector cloud service.
4. Data Sanitization: The extraction scripts automatically filter internal-only tags or draft articles that are not designated for general consumption.

## Conclusion

The implementation has established a "Single Source of Truth" for organizational knowledge.

Updates to source documentation are automatically propagated through the pipeline. For instance, modifications to a Zendesk article are retrieved, sanitized, and embedded during the scheduled synchronization, ensuring the conversational agent reflects the most current information by the subsequent business day. This transforms fragmented documentation into a unified, intelligent, and perpetually available knowledge resource.

## Key Learnings

This project yielded several critical insights regarding the implementation of enterprise-grade AI systems:

* **API Heterogeneity:** The process underscored the significant variance in API architectures. Integrating distinct platforms—such as Zendesk's REST endpoints versus WordPress's data structure—requires bespoke extraction strategies tailored to the unique authentication protocols and data schemas of each service.
* **Secret Management Architecture:** The strict separation of credentials from the codebase is non-negotiable. Mastering the configuration of environment variables for local development, coupled with encrypted GitHub Secrets for production pipelines, is essential for maintaining operational security integrity.
* **The Value of Structured Metadata:** The implementation highlighted that raw text is insufficient for a robust RAG system. The systematic application of YAML Front Matter is indispensable; it provides the semantic scaffolding necessary for the AI to understand context, enabling precise citation and building user trust in the system's outputs.
* **Operationalizing Automation:** Configuring GitHub Actions transformed a manual, error-prone backup process into a reliable, self-healing workflow. This automation ensures data consistency and frees engineering resources from routine maintenance tasks, demonstrating the efficacy of CI/CD principles applied to data pipelines.