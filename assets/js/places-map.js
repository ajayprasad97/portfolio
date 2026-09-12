(function () {
  var mapEl = document.getElementById('hikes-map');
  var dataEl = document.getElementById('places-data');
  if (!mapEl || !dataEl || typeof L === 'undefined') return;

  var places = [];
  try {
    places = JSON.parse(dataEl.textContent || '[]');
  } catch (e) {
    places = [];
  }
  if (!places.length) return;

  var map = L.map(mapEl, { scrollWheelZoom: false });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  function iconFor(type) {
    return L.divIcon({
      className: 'place-pin-wrapper',
      html: '<span class="place-pin place-pin-' + type + '"></span>',
      iconSize: [18, 18],
      iconAnchor: [9, 18],
      popupAnchor: [0, -18]
    });
  }

  var entries = places.map(function (place) {
    var type = place.type === 'cityscape' ? 'cityscape' : 'hike';
    var marker = L.marker([place.lat, place.lng], { icon: iconFor(type), title: place.name, alt: place.name });

    var popup = document.createElement('div');
    popup.className = 'place-popup';

    var photos = place.photos || (place.photo ? [{ src: place.photo, alt: place.name }] : []);
    if (photos.length) {
      var gallery = document.createElement('div');
      gallery.className = 'place-popup-gallery';
      photos.forEach(function (photo) {
        var link = document.createElement('a');
        link.href = photo.src;
        link.target = '_blank';
        link.rel = 'noopener';
        var img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.alt || place.name || '';
        img.loading = 'lazy';
        img.addEventListener('load', function () {
          if (marker.getPopup() && marker.isPopupOpen()) marker.getPopup().update();
        });
        link.appendChild(img);
        gallery.appendChild(link);
      });
      popup.appendChild(gallery);
    }

    var body = document.createElement('div');
    body.className = 'place-popup-body';

    if (place.photo === '/assets/img/cover-placeholder.svg') {
      var preview = document.createElement('p');
      preview.className = 'place-popup-preview';
      preview.textContent = 'Sample place';
      body.appendChild(preview);
    }

    var title = document.createElement('h4');
    title.textContent = place.name || '';
    body.appendChild(title);

    if (place.location) {
      var loc = document.createElement('p');
      loc.className = 'place-popup-location';
      loc.textContent = place.location;
      body.appendChild(loc);
    }
    if (place.date) {
      var date = document.createElement('p');
      date.className = 'place-popup-date';
      date.textContent = place.date;
      body.appendChild(date);
    }
    if (place.note) {
      var note = document.createElement('p');
      note.className = 'place-popup-note';
      note.textContent = place.note;
      body.appendChild(note);
    }

    if (place.stats && place.stats.length) {
      var stats = document.createElement('dl');
      stats.className = 'place-popup-stats';
      place.stats.forEach(function (stat) {
        var item = document.createElement('div');
        var label = document.createElement('dt');
        label.textContent = stat.label;
        var value = document.createElement('dd');
        value.textContent = stat.value;
        item.appendChild(label);
        item.appendChild(value);
        stats.appendChild(item);
      });
      body.appendChild(stats);
    }

    popup.appendChild(body);
    marker.bindPopup(popup, { maxHeight: 360 });

    return { type: type, marker: marker, journal: place.journal };
  });

  var allMarkers = entries.map(function (e) { return e.marker; });
  var group = L.featureGroup(allMarkers).addTo(map);
  var journalMarkers = entries.filter(function (entry) { return entry.journal; }).map(function (entry) { return entry.marker; });
  map.fitBounds((journalMarkers.length ? L.featureGroup(journalMarkers) : group).getBounds().pad(0.3), { maxZoom: 12 });

  function applyFilter(filter) {
    entries.forEach(function (entry) {
      var shouldShow = filter === 'all' || entry.type === filter;
      var onMap = map.hasLayer(entry.marker);
      if (shouldShow && !onMap) {
        entry.marker.addTo(map);
      } else if (!shouldShow && onMap) {
        map.removeLayer(entry.marker);
      }
    });

    var visible = entries
      .filter(function (entry) { return filter === 'all' || entry.type === filter; })
      .map(function (entry) { return entry.marker; });
    if (visible.length) {
      map.fitBounds(L.featureGroup(visible).getBounds().pad(0.3), { maxZoom: 12 });
    }
  }

  var filterRow = document.getElementById('places-filter-row');
  if (filterRow) {
    filterRow.addEventListener('click', function (event) {
      var btn = event.target.closest('.filter-btn');
      if (!btn) return;
      filterRow.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      applyFilter(btn.dataset.filter);
    });
  }

})();
