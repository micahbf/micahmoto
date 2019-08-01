"use strict";

mapboxgl.accessToken = "pk.eyJ1IjoibWljYWhiZiIsImEiOiJjanJ6ZndweWEwcmo4NDNvN2J4Mmk5cGNyIn0.7C-m7ZyaW-PS-YRBX3wOWQ";

const mapDataUrl = "https://mapapp.micah.motorcycles/map_data?from=2019-07-10T00:00:00.000Z";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/micahbf/cjwp89saq75s21cpjhh9126sr",
  center: [-122.206582, 39.215639],
  zoom: 5
});

map.addControl(new mapboxgl.FullscreenControl());

map.on("load", () => {
  map.addSource("mapData", { type: "geojson", data: mapDataUrl });

  map.addLayer({
    id: "liveTrack",
    type: "line",
    source: "mapData",
    filter: ["==", ["get", "class"], "liveTrack"],
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": "#600000",
      "line-width": 5
    }
  });

  map.addLayer({
    id: "endOfDays",
    type: "symbol",
    source: "mapData",
    filter: ["==", ["get", "class"], "endOfDay"],
    layout: {
      "icon-image": "circle-11"
    }
  });

  map.addLayer({
    id: "lastUpdate",
    type: "symbol",
    source: "mapData",
    filter: ["==", ["get", "class"], "lastUpdate"],
    layout: {
      "icon-image": "star-stroked-11"
    }
  });

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  const addPointPopup = function (e) {
    map.getCanvas().style.cursor = 'pointer';

    const coordinates = e.features[0].geometry.coordinates.slice();
    const name = e.features[0].properties.name;

    popup.setLngLat(coordinates)
      .setHTML(name)
      .addTo(map);
  };

  const removePointPopup = function () {
    map.getCanvas().style.cursor = '';
    popup.remove();
  };

  map.on('mouseenter', 'endOfDays', addPointPopup);
  map.on('mouseleave', 'endOfDays', removePointPopup);

  map.on('mouseenter', 'lastUpdate', addPointPopup);
  map.on('mouseleave', 'lastUpdate', removePointPopup);
});
