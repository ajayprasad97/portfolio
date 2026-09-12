---
layout: default
title: Beyond Work
permalink: /beyond-work/
description: "Hikes and cityscapes I've shot, mapped with photos."
---

{% assign featured = site.data.places | where: "name", "Skyline Loop" | first %}
{% assign journal_places = site.data.places | where: "journal", true %}
<div class="field-journal" id="beyond-work">
  <section class="journal-intro" aria-labelledby="journal-title">
    <p class="journal-eyebrow"><span></span> The out-of-office collection</p>
    <div class="journal-intro-row">
      <h1 id="journal-title">Beyond work<span>.</span></h1>
      <p>A little less screen time.<br> A little more getting out there.</p>
    </div>
  </section>
  <section class="journal-hero" aria-label="Skyline Loop landscape">
    <img class="journal-hero-image" src="{{ featured.photos.first.src | relative_url }}" alt="{{ featured.photos.first.alt | escape }}" fetchpriority="high" width="1368" height="1824">
    <div class="journal-hero-top"><span>Field notes / 001</span><span>Washington, USA</span></div>
    <div class="journal-hero-copy">
      <p class="journal-eyebrow">On the trail</p>
      <h2>Taking the<br>scenic route.</h2>
      <p>Skyline Loop &middot; Mount Rainier National Park</p>
      <a href="#skyline-loop" class="journal-hero-link">Explore the hikes <span aria-hidden="true">↗</span></a>
    </div>
    <span class="journal-hero-date">15 JUL / 2024</span>
  </section>
  <nav class="journal-index" aria-label="Hike entries">
    <span>From the trail</span>
    {% for place in journal_places %}<a href="#{{ place.slug }}">0{{ forloop.index }} / {{ place.name }} <span aria-hidden="true">↗</span></a>{% endfor %}
  </nav>
  {% for place in journal_places %}
  <section class="journal-story" id="{{ place.slug }}" aria-labelledby="{{ place.slug }}-title">
    <div class="journal-story-heading">
      <p class="journal-eyebrow">0{{ forloop.index }} / {{ place.eyebrow }}</p>
      <h2 id="{{ place.slug }}-title">{{ place.name }}</h2>
      <p class="journal-location">{{ place.location }} <span aria-hidden="true">↗</span></p>
      <p class="journal-description">{{ place.description }}</p>
      <div class="journal-tags"><span>Hiking</span><span>{{ place.date }}</span></div>
      <a class="journal-text-link" href="#journal-map">Find it on the map <span aria-hidden="true">↓</span></a>
    </div>
    <div class="journal-stat-card">
      <div class="journal-stat-heading"><span>The hike, by the numbers</span><span aria-hidden="true">↗</span></div>
      <dl class="journal-stats">
        {% for stat in place.stats %}
        <div><dt>{{ stat.label }}</dt><dd>{{ stat.value }}</dd></div>
        {% endfor %}
      </dl>
      <a href="{{ place.activity | relative_url }}" target="_blank" rel="noopener" class="journal-text-link">View recorded activity <span aria-hidden="true">↗</span></a>
    </div>
  </section>
  <section class="journal-gallery" aria-label="Photos from {{ place.name }}">
    {% for photo in place.photos %}
    <figure>
      <a href="{{ photo.src | relative_url }}" target="_blank" rel="noopener" aria-label="View full-size photo: {{ photo.alt | escape }} (opens in a new tab)">
        <img src="{{ photo.src | relative_url }}" alt="{{ photo.alt | escape }}" loading="lazy" width="1368" height="1824">
        <span class="journal-photo-expand" aria-hidden="true">↗</span>
      </a>
      <figcaption><span>0{{ forloop.index }}</span>{{ photo.caption }}</figcaption>
    </figure>
    {% endfor %}
  </section>
  {% endfor %}
  <section class="journal-map-section" id="journal-map" aria-labelledby="map-title">
    <div class="journal-map-heading"><div><p class="journal-eyebrow">Places &amp; perspectives</p><h2 id="map-title">A few pins. A lot of perspective.</h2></div><p>Explore the map.<br>Select a pin for a closer look.</p></div>
    <div class="journal-map-toolbar">
      <div class="filter-row" id="places-filter-row" role="group" aria-label="Filter places">
        <button class="filter-btn is-active" data-filter="all" aria-pressed="true">All places</button>
        <button class="filter-btn" data-filter="hike" aria-pressed="false">Hikes</button>
        <button class="filter-btn" data-filter="cityscape" aria-pressed="false">Cityscapes</button>
      </div>
      <span class="journal-map-key"><i></i> Hikes <i></i> Cityscapes</span>
    </div>
    <div id="hikes-map" class="hikes-map" aria-label="Map of hikes and cityscapes"></div>
    <p class="journal-map-caption">Photo journals from Skyline Loop and Cascade Pass. Other pins are labeled as sample places.</p>
    <script type="application/json" id="places-data">{{ site.data.places | jsonify }}</script>
  </section>
  <div class="journal-end"><span>More miles. More moments. More to come.</span><a href="{{ '/' | relative_url }}">Back to work <span aria-hidden="true">↗</span></a></div>
</div>
