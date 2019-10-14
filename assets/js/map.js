"use strict";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/micahbf/cjwp89saq75s21cpjhh9126sr",
  center: [-122.206582, 39.215639],
  zoom: 5
});

map.addControl(new mapboxgl.FullscreenControl());

map.on("load", () => {
  const mapDataUrl = "https://mapapp.micah.motorcycles/map_data?from=2019-09-30T00:00:00.000Z";
  const timeZone = 'America/Mexico_City';
  const initMapBoundTime = 24 * 60 * 60 * 1000;

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

  const getLastUpdate = () => {
    return map.querySourceFeatures(
      "mapData",
      {filter: ["==", ["get", "class"], "lastUpdate"]}
    )[0];
  };

  const setCaptionFromLastUpdate = () => {
    const lastUpdateObj = getLastUpdate();
    if(!lastUpdateObj) { return; };

    const captionText = lastUpdateObj.properties.name;
    const captionEl = document.getElementById("map-last-updated");
    captionEl.innerHTML = captionText;
  };

  const setBoundsFromMapData = () => {
    const lastUpdateObj = getLastUpdate();
    console.log("lastUpdateObj", lastUpdateObj);
    if(!lastUpdateObj) { return false; };

    const lastUpdateDate = new Date(lastUpdateObj.properties.isoTime);

    const endOfDays = map.querySourceFeatures(
      "mapData",
      {filter: ["==", ["get", "class"], "endOfDay"]}
    );

    const byTimeDesc = endOfDays.sort(
      (a, b) => b.properties.isoTime.localeCompare(a.properties.isoTime)
    );

    const targetBound = byTimeDesc.find((endOfDay) => {
      const date = new Date(endOfDay.properties.isoTime);
      return lastUpdateDate - date > initMapBoundTime;
    });
    console.log("targetBound", targetBound);
    if(!targetBound) { return false; };

    const bounds = [
      lastUpdateObj.geometry.coordinates,
      targetBound.geometry.coordinates
    ];

    console.log("bounds", bounds);
    map.fitBounds(bounds, {padding: 30, maxZoom: 5});
    return true;
  };

  map.on("mouseenter", "endOfDays", addPointPopup);
  map.on("mouseleave", "endOfDays", removePointPopup);

  map.on("mouseenter", "lastUpdate", addPointPopup);
  map.on("mouseleave", "lastUpdate", removePointPopup);

  let initBoundsSet = false;
  map.on("sourcedata", (mapDataEvent) => {
    if(mapDataEvent.sourceId !== "mapData") { return; };
    setCaptionFromLastUpdate();
    if(!initBoundsSet) {
      initBoundsSet = setBoundsFromMapData();
    }
  });

});
