import L from "leaflet";
const icon = require("../images/icons/transmitter_half.png");
const greenIcon = require("../images/icons/transmitter_half_green.png");
const redIcon = require("../images/icons/transmitter_half_red.png");
const yellowIcon = require("../images/icons/transmitter_half_yellow.png");
const orangeIcon = require("../images/icons/transmitter_half_orange.png");
const deepOrangeIcon = require("../images/icons/transmitter_half_deep_orange.png");
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

const radioMastObject = {
  iconUrl: icon,
  iconSize: [30, 65],
  // iconAnchor: [22, 94],
  popupAnchor: [0, -35],
};

config.icon = L.icon(radioMastObject);
config.greenIcon = L.icon({ ...radioMastObject, iconUrl: greenIcon });
config.redIcon = L.icon({ ...radioMastObject, iconUrl: redIcon });
config.yellowIcon = L.icon({ ...radioMastObject, iconUrl: yellowIcon });
config.orangeIcon = L.icon({ ...radioMastObject, iconUrl: orangeIcon });
config.deepOrangeIcon = L.icon({ ...radioMastObject, iconUrl: deepOrangeIcon });

config.gpsIcon = L.icon({
  iconUrl: gpsIcon,
  iconSize: [30, 65],
  // iconAnchor: [22, 94],
  popupAnchor: [0, -30],
});

export { config as mapconfig };
