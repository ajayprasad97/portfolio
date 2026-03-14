---
layout: default
title: Home
---

<section class="hero">
  <div class="hero-inner">
    <div class="hero-copy">
      <h1 class="hero-title">Hi, I'm <span class="hero-name">Ajay Prasad</span></h1>
      <p class="hero-subtitle">Engineer • Vibe Coder</p>
      <a href="#projects" class="btn">View My Work</a>
    </div>
    <figure class="polaroid">
      <img src="assets/img/ajay.jpg" alt="Ajay Prasad" />
      <figcaption>Hello there!</figcaption>
    </figure>
  </div>
</section>

<section class="now-section">
  <div class="section-header">
    <span class="section-icon"></span>
    <h2>Now</h2>
  </div>
  <p class="now-text">
    Currently focused on simplifying complex support workflows, building clean product experiences,
    and shipping small improvements that compound over time.
  </p>
</section>

<div class="section-divider"></div>

<section id="about">
  <div class="section-header">
    <span class="section-icon"></span>
    <h2>About Me</h2>
  </div>
  <p>
    I'm a Mechanical Engineer working in a technical support role, helping customers solve complex engineering workflows. Through this work, I get a front-row seat to how products are used in real-world scenarios.
    I'm passionate about product development and enjoy building and shipping smaller tools and improvements within the product support space. I'm especially interested in simplifying complex systems, improving user experience, and turning customer pain points into scalable solutions.
  </p>
</section>

<div class="section-divider"></div>

<section id="projects" class="projects-section">
  <div class="section-header">
    <span class="section-icon"></span>
    <h2>Projects</h2>
  </div>

  {% assign featured = site.posts | where: "featured", true | first %}
  {% if featured %}
    <div class="featured-card">
      <div class="featured-content">
        <div class="featured-label">Featured</div>
        <h3>{{ featured.title }}</h3>
        <p>{{ featured.preview }}</p>
        <a href="{{ featured.url | relative_url }}" class="btn">View Project</a>
      </div>
      <img class="featured-cover" src="{{ featured.cover | default: '/assets/img/cover-placeholder.svg' | relative_url }}" alt="{{ featured.title }}" />
    </div>
  {% endif %}

  <div class="filter-row" id="filter-row">
    <button class="filter-btn is-active" data-filter="all">All</button>
    {% for tag in site.tags %}
      <button class="filter-btn" data-filter="{{ tag[0] | downcase | replace: ' ', '-' }}">{{ tag[0] }}</button>
    {% endfor %}
  </div>

  <div class="projects-grid" id="projects-grid">
    {% for post in site.posts %}
      <div class="project-card" data-tags="{% for tag in post.tags %}{{ tag | downcase | replace: ' ', '-' }}{% if forloop.last == false %},{% endif %}{% endfor %}">
        <h3>{{ post.title }}</h3>
        <p>{{ post.preview }}</p>
        <div class="tag-row">
          {% for tag in post.tags %}
            <span class="tag">{{ tag }}</span>
          {% endfor %}
        </div>
        <a href="{{ post.url | relative_url }}" class="btn">View Project</a>
      </div>
    {% endfor %}
  </div>
</section>

<div class="section-divider"></div>

<section id="contact">
  <div class="section-header">
    <span class="section-icon"></span>
    <h2>Contact</h2>
  </div>
  <p>Feel free to reach out via email or connect on LinkedIn/GitHub.</p>
  <a href="mailto:you@example.com" class="btn">Email Me</a>
</section>
