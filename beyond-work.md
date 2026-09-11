---
layout: default
title: Beyond Work
permalink: /beyond-work/
description: "Hikes and cityscapes I've shot, mapped with photos."
---

<section id="beyond-work" class="beyond-section beyond-page">
  <div class="section-header">
    <span class="section-icon"></span>
    <h2>Beyond Work</h2>
  </div>
  <p class="beyond-text">
    When I'm not shipping product improvements, I'm usually out with a camera — on a trail or wandering a city at dusk. Click a pin to see the photo.
  </p>

  <div class="filter-row" id="places-filter-row">
    <button class="filter-btn is-active" data-filter="all">All</button>
    <button class="filter-btn" data-filter="hike">Hikes</button>
    <button class="filter-btn" data-filter="cityscape">Cityscapes</button>
  </div>

  <div id="hikes-map" class="hikes-map" aria-label="Map of hikes and cityscapes I've shot"></div>
  <script type="application/json" id="places-data">{{ site.data.places | jsonify }}</script>
</section>
