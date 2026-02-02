---
layout: default
title: Home
---

<section class="hero">
  <h1 class="hero-title">Hi, I'm <span class="hero-name">Ajay Prasad</span></h1>
  <p class="hero-subtitle">Developer • Designer • Engineer</p>
  <a href="#projects" class="btn">View My Work</a>
</section>

<section id="about">
  <h2>About Me</h2>
  <p>
    I build modern digital experiences and solve meaningful problems with code,
    design thinking, and systems engineering.
  </p>
</section>

<section id="projects" class="projects-section">
  <h2>Projects</h2>
  <div class="projects-grid">
    {% for post in site.posts %}
      <div class="project-card">
        <h3>{{ post.title }}</h3>
        <p>{{ post.preview }}</p>
        <a href="{{ post.url | relative_url }}" class="btn">View Project</a>
      </div>
    {% endfor %}
  </div>
</section>

<section id="contact">
  <h2>Contact</h2>
  <p>Feel free to reach out via email or connect on LinkedIn/GitHub.</p>
  <a href="mailto:you@example.com" class="btn">Email Me</a>
</section>
