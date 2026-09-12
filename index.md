---
layout: default
title: Home
description: "Ajay Prasad — mechanical engineer, product builder, and curious problem solver."
---

<div class="home-page">
  <section class="home-hero" aria-labelledby="home-title">
    <div class="home-hero-copy">
      <p class="eyebrow"><span class="status-dot"></span> Engineer by training. Builder by instinct.</p>
      <h1 id="home-title">Hi, I'm Ajay.<br>I make complex<br>things <em>feel simple.</em></h1>
      <p class="home-intro">From engineering workflows to everyday apps, I turn real problems into useful things. A little curiosity, a lot of building, and care for the details.</p>
      <div class="home-actions"><a class="action-primary" href="#projects">Explore my work <span aria-hidden="true">↗</span></a><a class="text-link" href="#about">A little about me <span aria-hidden="true">↓</span></a></div>
    </div>
    <figure class="home-portrait">
      <div class="portrait-frame"><img src="{{ '/assets/img/ajay.jpg' | relative_url }}" alt="Ajay Prasad smiling outdoors" width="654" height="730" fetchpriority="high"></div>
      <figcaption><span>Ajay Prasad</span><span>Usually building something.</span></figcaption>
      <span class="portrait-note" aria-hidden="true">Always curious ↗</span>
    </figure>
  </section>
  <div class="home-now"><span class="eyebrow">On my mind lately</span><p>Simpler support workflows. Thoughtful product experiences. Small improvements that add up.</p><a href="#projects" aria-label="Explore current work">↓</a></div>

  <section class="home-projects" id="projects" aria-labelledby="work-title">
    <div class="home-section-heading" data-reveal><div><p class="eyebrow">01 / Selected work</p><h2 id="work-title">Ideas, made <em>real.</em></h2></div><p>Things I've built, improved,<br>and learned along the way.</p></div>
    {% assign featured = site.posts | where: "featured", true | first %}
    {% if featured %}
    <article class="home-feature" data-reveal>
      <a class="home-feature-image" href="{{ featured.url | relative_url }}" aria-label="{{ featured.title | escape }}"><img src="{{ featured.cover | relative_url }}" alt="Rep workout app showing exercise tracking and progression" loading="lazy" width="2048" height="683"><span class="feature-badge">Featured project</span></a>
      <div class="home-feature-body"><div><p class="eyebrow">Personal project / iOS app</p><h3><a href="{{ featured.url | relative_url }}">Rep. Built for the next rep.</a></h3><p>{{ featured.preview }}</p></div><a class="round-link" href="{{ featured.url | relative_url }}" aria-label="Read the Rep case study">↗</a></div>
    </article>
    {% endif %}
    <div class="home-project-toolbar"><span class="eyebrow">The project notebook</span><span id="project-count" aria-live="polite"></span></div>
    <div class="filter-row" id="filter-row" role="group" aria-label="Filter projects">
      <button class="filter-btn is-active" data-filter="all" aria-pressed="true">All work</button>
      <button class="filter-btn" data-filter="product" aria-pressed="false">Product</button>
      <button class="filter-btn" data-filter="ai" aria-pressed="false">AI</button>
      <button class="filter-btn" data-filter="cad" aria-pressed="false">Engineering</button>
      <button class="filter-btn" data-filter="data" aria-pressed="false">Data</button>
    </div>
    <div class="home-project-grid" id="projects-grid">
      {% for post in site.posts %}
      {% if post.url != featured.url %}
      <article class="project-card notebook-card" data-reveal data-tags="{% for tag in post.tags %}{{ tag | downcase | replace: ' ', '-' }}{% unless forloop.last %},{% endunless %}{% endfor %}">
        <div class="notebook-meta"><span>{{ post.tags | first }}</span><span>{{ post.date | date: "%Y" }}</span></div>
        <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
        <p>{{ post.preview }}</p>
        <div class="notebook-bottom"><span>{{ post.tags | join: " / " }}</span><a href="{{ post.url | relative_url }}" aria-label="Read {{ post.title | escape }}">↗</a></div>
      </article>
      {% endif %}
      {% endfor %}
    </div>
  </section>

  <section class="home-about" id="about" aria-labelledby="about-title" data-reveal>
    <div><p class="eyebrow">02 / The person behind the projects</p><h2 id="about-title">An engineer's mind.<br>A builder's <em>curiosity.</em></h2></div>
    <div class="home-about-copy"><p>I'm a mechanical engineer working in technical support, helping customers untangle complex engineering workflows. It gives me a front-row seat to how people actually use products — and where things could work better.</p><p>That's what gets me building. Sometimes it's a tool that saves a few clicks. Sometimes it's an app that grows into something bigger. I like turning a frustrating experience into a thoughtful one.</p><div class="about-principles"><span>Understand the problem.</span><span>Build something useful.</span><span>Keep making it better.</span></div></div>
  </section>

  <section class="home-outside" aria-labelledby="outside-title" data-reveal>
    <a class="outside-image" href="{{ '/beyond-work/' | relative_url }}" aria-label="Explore the Beyond Work photo journal"><img src="{{ '/assets/img/cascade-pass.webp' | relative_url }}" alt="Alpine valley and snow-covered mountains at Cascade Pass" loading="lazy" width="1368" height="1824"></a>
    <div class="outside-copy"><p class="eyebrow">03 / Away from the keyboard</p><h2 id="outside-title">Good ideas need<br>a little <em>fresh air.</em></h2><p>When I'm not building, I'm usually out with a camera. On a trail, around a new corner, or taking the scenic route home.</p><a class="text-link" href="{{ '/beyond-work/' | relative_url }}">Beyond work <span aria-hidden="true">↗</span></a><span class="outside-location">Pictured: Cascade Pass, Washington</span></div>
  </section>

  <section class="home-contact" id="contact" aria-labelledby="contact-title" data-reveal>
    <p class="eyebrow">Have something in mind?</p><h2 id="contact-title">Let's make<br>something <em>useful.</em></h2>
    <a class="contact-email" href="mailto:{{ site.email }}">{{ site.email }} <span aria-hidden="true">↗</span></a>
    <p>A project, a question, or just a hello. I'd love to hear from you.</p>
  </section>
</div>
