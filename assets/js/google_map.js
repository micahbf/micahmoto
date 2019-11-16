"use strict";

let gmap;

function gmapInit() {
  gmap = new google.maps.Map(document.getElementById('gmap'), {
    center: {lat: 18.9637, lng: -99.2499},
    zoom: 6
  });

  gmap.data.setStyle({
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 3,
      fillColor: "#333",
      fillOpacity: 0,
      strokeWeight: 0.4
    },
    strokeColor: "#600000",
    strokeWeight: 4
  });

  gmap.data.loadGeoJson('https://mapapp-cache.micah.motorcycles/map_data.json');
};
