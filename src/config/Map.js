import L from "leaflet";
const icon = require("../images/icons/transmitter_half.png");
const gpsIcon = require("../images/icons/yagi_half.png");

const config = {};

config.params = {
  center: [52.1, 20.3],
  zoomControl: false,
  zoom: 7,
  maxZoom: 18,
  minZoom: 4,
};

config.tileLayer = {
  uri: process.env.REACT_APP_TILE_PROVIDER_1_URL,
  uri2: process.env.REACT_APP_TILE_PROVIDER_2_URL,
  params: {
    minZoom: 4,
    maxZoom: 16,
    osmAttribution:
      'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    topoAttribution:
      'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, map style: © <a href="https://opentopomap.org">OpenTopoMap</a>',
    id: "",
    accessToken: "",
  },
};

config.myIcon = L.icon({
  iconUrl: icon,
  iconSize: [30, 65],
  // iconAnchor: [22, 94],
  popupAnchor: [0, -35],
});

config.gpsIcon = L.icon({
  iconUrl: gpsIcon,
  iconSize: [30, 65],
  // iconAnchor: [22, 94],
  popupAnchor: [0, -30],
});

export { config as mapconfig };
