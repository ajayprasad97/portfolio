---
layout: default
title: Home
---

<section class="hero">
  <div class="hero-inner">
    <div class="hero-copy">
      <h1 class="hero-title">Hi, I'm <span class="hero-name">Ajay Prasad</span></h1>
      <p class="hero-subtitle">Developer • Designer • Engineer</p>
      <a href="#projects" class="btn">View My Work</a>
    </div>
    <figure class="polaroid">
      <img src="assets/img/ajay.jpg" alt="Ajay Prasad" />
      <figcaption>Ajay Prasad</figcaption>
    </figure>
  </div>
</section>

<section id="about">
  <h2>About Me</h2>
  <p>
    I'm a Mechanical Engineer working in a technical support role, helping customers solve complex engineering workflows. Through this work, I get a front-row seat to how products are used in real-world scenarios.
    I'm passionate about product development and enjoy building and shipping smaller tools and improvements within the product support space. I'm especially interested in simplifying complex systems, improving user experience, and turning customer pain points into scalable solutions.
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
