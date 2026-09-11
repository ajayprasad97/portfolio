---
layout: default
title: Beyond Work
permalink: /beyond-work/
description: "Hikes I've done, mapped with photos."
---

<section id="beyond-work" class="beyond-section beyond-page">
  <div class="section-header">
    <span class="section-icon"></span>
    <h2>Beyond Work</h2>
  </div>
  <p class="beyond-text">
    When I'm not shipping product improvements, I'm usually out on a trail with a camera. Here are a few hikes I've done — click a pin to see the photo.
  </p>
  <div id="hikes-map" class="hikes-map" aria-label="Map of hikes I've done"></div>
  <script type="application/json" id="hikes-data">{{ site.data.hikes | jsonify }}</script>
</section>
