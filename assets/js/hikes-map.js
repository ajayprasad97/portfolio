(function () {
  var mapEl = document.getElementById('hikes-map');
  var dataEl = document.getElementById('hikes-data');
  if (!mapEl || !dataEl || typeof L === 'undefined') return;

  var hikes = [];
  try {
    hikes = JSON.parse(dataEl.textContent || '[]');
  } catch (e) {
    hikes = [];
  }
  if (!hikes.length) return;

  var map = L.map(mapEl, { scrollWheelZoom: false });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  var markers = hikes.map(function (hike) {
    var marker = L.marker([hike.lat, hike.lng]).addTo(map);
    var popup = document.createElement('div');
    popup.className = 'hike-popup';

    if (hike.photo) {
      var img = document.createElement('img');
      img.src = hike.photo;
      img.alt = hike.name || '';
      popup.appendChild(img);
    }

    var body = document.createElement('div');
    body.className = 'hike-popup-body';

    var title = document.createElement('h4');
    title.textContent = hike.name || '';
    body.appendChild(title);

    if (hike.location) {
      var loc = document.createElement('p');
      loc.className = 'hike-popup-location';
      loc.textContent = hike.location;
      body.appendChild(loc);
    }
    if (hike.date) {
      var date = document.createElement('p');
      date.className = 'hike-popup-date';
      date.textContent = hike.date;
      body.appendChild(date);
    }
    if (hike.note) {
      var note = document.createElement('p');
      note.className = 'hike-popup-note';
      note.textContent = hike.note;
      body.appendChild(note);
    }

    popup.appendChild(body);
    marker.bindPopup(popup);
    return marker;
  });

  var group = L.featureGroup(markers);
  map.fitBounds(group.getBounds().pad(0.3));

  mapEl.addEventListener('mouseenter', function () { map.scrollWheelZoom.enable(); });
  mapEl.addEventListener('mouseleave', function () { map.scrollWheelZoom.disable(); });
})();
