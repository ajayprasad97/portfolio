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

  var CARTO_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
    '&copy; <a href="https://carto.com/attributions">CARTO</a>';

  function tileUrlFor(theme) {
    var style = theme === 'dark' ? 'dark_all' : 'light_all';
    return 'https://{s}.basemaps.cartocdn.com/' + style + '/{z}/{x}/{y}{r}.png';
  }

  var tileLayer = L.tileLayer(tileUrlFor(document.documentElement.getAttribute('data-theme')), {
    attribution: CARTO_ATTRIBUTION,
    subdomains: 'abcd',
    maxZoom: 19,
    detectRetina: true
  }).addTo(map);

  new MutationObserver(function () {
    var theme = document.documentElement.getAttribute('data-theme');
    tileLayer.setUrl(tileUrlFor(theme));
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

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
    var marker = L.marker([place.lat, place.lng], { icon: iconFor(type) });

    var popup = document.createElement('div');
    popup.className = 'place-popup';

    if (place.photo) {
      var img = document.createElement('img');
      img.src = place.photo;
      img.alt = place.name || '';
      popup.appendChild(img);
    }

    var body = document.createElement('div');
    body.className = 'place-popup-body';

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

    popup.appendChild(body);
    marker.bindPopup(popup);

    return { type: type, marker: marker };
  });

  var allMarkers = entries.map(function (e) { return e.marker; });
  var group = L.featureGroup(allMarkers).addTo(map);
  map.fitBounds(group.getBounds().pad(0.3));

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
      map.fitBounds(L.featureGroup(visible).getBounds().pad(0.3));
    }
  }

  var filterRow = document.getElementById('places-filter-row');
  if (filterRow) {
    filterRow.addEventListener('click', function (event) {
      var btn = event.target.closest('.filter-btn');
      if (!btn) return;
      filterRow.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('is-active');
      });
      btn.classList.add('is-active');
      applyFilter(btn.dataset.filter);
    });
  }

  mapEl.addEventListener('mouseenter', function () { map.scrollWheelZoom.enable(); });
  mapEl.addEventListener('mouseleave', function () { map.scrollWheelZoom.disable(); });
})();
