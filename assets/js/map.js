"use strict";

mapboxgl.accessToken = 'pk.eyJ1IjoibWljYWhiZiIsImEiOiJjanJ6ZndweWEwcmo4NDNvN2J4Mmk5cGNyIn0.7C-m7ZyaW-PS-YRBX3wOWQ';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/micahbf/cjwp89saq75s21cpjhh9126sr',
  center: [-122.206582, 39.215639],
  zoom: 5
});

const geojsonUrl = '/assets/js/test_data.json';

map.on('load', () => {
  map.addSource('mototrack', { type: 'geojson', data: geojsonUrl });
  map.addLayer({
    id: 'mototrack',
    type: 'line',
    source: 'mototrack',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#600000',
      'line-width': 5
    }
  });
});
