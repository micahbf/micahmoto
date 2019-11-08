"use strict";

fetch(`https://mapapp-cache.micah.motorcycles/map_metadata.json`).
  then(response => response.json()).
  then((metadata) => {
    const captionEl = document.getElementById("map-last-updated");
    if(captionEl) { captionEl.innerHTML = metadata.updateCaption; };

    return new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/micahbf/cjwp89saq75s21cpjhh9126sr",
      bounds: metadata.bounds,
      fitBoundsOptions: {padding: 30, maxZoom: 5}
    });
  }).catch(() => {
    return new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/micahbf/cjwp89saq75s21cpjhh9126sr",
      center: [-122.206582, 39.215639],
      zoom: 5
    });
  }).then((map) => {
    map.addControl(new mapboxgl.FullscreenControl());

    map.on("load", () => {
      const mapDataUrl = `https://mapapp-cache.micah.motorcycles/map_data.json`;
      const timeZone = 'America/Mexico_City';

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
      }, "poi-label");

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

      const addPointPopup = (e) => {
        map.getCanvas().style.cursor = "pointer";

        const coordinates = e.features[0].geometry.coordinates.slice();
        const name = e.features[0].properties.name;

        popup.setLngLat(coordinates)
          .setHTML(name)
          .addTo(map);
      };

      const removePointPopup = () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
      };

      map.on("mouseenter", "endOfDays", addPointPopup);
      map.on("mouseleave", "endOfDays", removePointPopup);

      map.on("mouseenter", "lastUpdate", addPointPopup);
      map.on("mouseleave", "lastUpdate", removePointPopup);

      const toggleDayMarksEl = document.getElementById("toggle-day-marks");
      if (toggleDayMarksEl) {
        toggleDayMarksEl.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();

          const dayMarksVisible = map.getLayoutProperty("endOfDays", "visibility");
          if(dayMarksVisible === "visible") {
            map.setLayoutProperty("endOfDays", "visibility", "none");
          } else {
            map.setLayoutProperty("endOfDays", "visibility", "visible");
          };
        };
      };
    });
  });


