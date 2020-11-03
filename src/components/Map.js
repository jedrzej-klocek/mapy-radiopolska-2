import React, { Component, createRef } from "react";
import L from "leaflet";
import {
  Map,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  LayersControl,
} from "react-leaflet";
import { ToastContainer, toast } from "react-toastify";

import { RPMarker } from "./Marker";
import { fetchKMLsArray } from "../api/maps-layers";
import { postError } from "../api/errors";
import {
  shouldClearAllLayers,
  shouldDrawLayers,
  shouldSetView,
  layersDifference,
  parseCommaNumber,
} from "../helpers/map";
import { mapconfig as config } from "../config/Map";

import "react-toastify/dist/ReactToastify.css";

// postCSS import of Leaflet's CSS
import "leaflet/dist/leaflet.css";
import "../styles/Map.css";

const { BaseLayer } = LayersControl;

const { REACT_APP_PROD_FILES_URL } = process.env;

class MapLayer extends Component {
  mapRef = createRef(null);

  constructor(props) {
    super(props);
    this.state = {
      selectedTransmitters: [],
      newSelectedTransmitters: [],
      markers: [],
      directionalChars: [],
      gpsPosition: null,
      layersIDs: [],
      interferencesTransmitter: null,
      interferencesDeviationArr: [],
    };

    this.mapNode = null;
    this.gpsChanged = this.gpsChanged.bind(this);
    this.interferencesChanged = this.interferencesChanged.bind(this);
    this.checkGeoLocation = this.checkGeoLocation.bind(this);
  }

  interferencesChanged(el, arr) {
    if (!arr.length) {
      this.setState({
        interferencesDeviationArr: arr,
        interferencesTransmitter: null,
      });
    }

    if (el && arr.length) {
      this.setState(
        {
          interferencesDeviationArr: arr,
          interferencesTransmitter: el,
        },
        () => {
          this.drawInterferencesLayers(el, arr);
        }
      );
    }
  }

  async drawInterferencesLayers(transmitter, deviationArr) {
    let arr = [];

    deviationArr.forEach((value) => {
      const interferencedTrans = this.props.data.filter((el) => {
        return (
          parseCommaNumber(el.mhz) - value ===
            parseCommaNumber(transmitter.mhz) ||
          parseCommaNumber(el.mhz) + value === parseCommaNumber(transmitter.mhz)
        );
      });

      arr = [...arr, ...interferencedTrans];
    });

    await fetchKMLsArray(arr, this.props.configuration).then((res) => {
      this.addLayersToMap(res);
    });
  }

  gpsChanged(pos) {
    this.setState({
      gpsPosition: [pos.coords.latitude, pos.coords.longitude],
    });
    setTimeout(this.checkGeoLocation, 3000);
  }

  checkGeoLocation() {
    navigator.geolocation.getCurrentPosition(this.gpsChanged, (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    });
  }

  componentDidMount() {
    const leafletMap = this.mapRef.current.leafletElement;
    const { map } = this.state;

    if (!map) {
      this.layersGroup = new L.LayerGroup();
      this.layersGroup.addTo(leafletMap);
      this.setState({ map: leafletMap });
    }
    // check user position in every second
    this.checkGeoLocation();
    setTimeout(this.checkGeoLocation, 5000);
  }

  async componentDidUpdate(prevProps) {
    const { props } = this;

    if (prevProps.configuration) {
      if (shouldDrawLayers(props, prevProps)) {
        const { layersIDs } = this.state;

        if (shouldClearAllLayers(props, prevProps)) {
          if (layersIDs.length > 0 && !props.drawMultiple) {
            this.layersGroup.removeLayer(
              layersIDs[0][Object.keys(layersIDs[0])[0]].leafletId
            );
          }
          this.clearDirectionalMarkers();
          this.layersGroup.clearLayers();
          this.state.layersIDs = [];

          await fetchKMLsArray(
            props.selectedTransmitters,
            props.configuration
          ).then((res) => {
            if (res) {
              this.state.selectedTransmitters = res;
              this.state.newSelectedTransmitters = res;
            }
          });

          this.newDrawLayers();
        } else {
          const diff = layersDifference(props.selectedTransmitters, layersIDs);

          if (diff.toAdd) {
            await fetchKMLsArray(diff.difference, props.configuration).then(
              (res) => {
                const { selectedTransmitters } = this.state;

                this.setState(
                  {
                    selectedTransmitters: [...selectedTransmitters, ...res],
                    newSelectedTransmitters: [...res],
                  },
                  () => {
                    this.newDrawLayers();
                  }
                );
              }
            );
          } else {
            diff.difference.forEach((el) => {
              const id = el[Object.keys(el)[0]];

              this.layersGroup.removeLayer(id.leafletId);
              const newLayersIDs = layersIDs.filter((layer) => el !== layer);

              this.setState({ layersIDs: newLayersIDs });
            });
          }
        }

        if (shouldSetView(props, prevProps)) {
          this.setView();
        }
        this.drawDirectionalChars();
      } else if (props.directional !== prevProps.directional) {
        this.clearDirectionalMarkers();
        this.drawDirectionalChars();
      }
    }
  }

  clearDirectionalMarkers() {
    const { directionalChars, map } = this.state;

    directionalChars.forEach((element) => {
      map.removeLayer(element);
    });
    this.setState({ directionalChars: [] });
  }

  addLayersToMap(transmitters) {
    const { configuration } = this.props;
    const { layersIDs } = this.state;

    /* eslint no-underscore-dangle: 0 */
    transmitters.forEach((element) => {
      const url = `${REACT_APP_PROD_FILES_URL}/get/${configuration.cfg}/${element._mapahash}.png`;

      fetch(url)
        .then((res) => {
          if (!res.ok) {
            try {
              postError({ code: res.status, method: "GET", url });
            } catch (e) {
              toast.info(e);
            }
          }

          return res;
        })
        .then(() => {
          const layer = L.imageOverlay(url, element.bounds, { opacity: 0.6 });

          this.layersGroup.addLayer(layer);
          layersIDs.push({
            [element.id_nadajnik]: { leafletId: layer._leaflet_id },
          });
        })
        .catch((e) => console.log(e));
    });

    this.setState({ layersIDs }, () => {});
    /* eslint no-underscore-dangle: 1 */
  }

  newDrawLayers() {
    let { newSelectedTransmitters } = this.state;

    let response = false;

    if (newSelectedTransmitters.length >= 30) {
      response = window.confirm(
        `Czy na pewno chcesz wyświetlić ${newSelectedTransmitters.length} mapek? 
        Grozi to utratą stabilności Twojej przeglądarki.
        W przeciwnym wypadku zostanie narysowanych pierwszych 30 pozycji z listy`
      );
    }
    if (response === false) {
      newSelectedTransmitters = newSelectedTransmitters.slice(0, 30);
    }

    this.addLayersToMap(newSelectedTransmitters);
  }

  drawDirectionalChars() {
    const { directionalChars, map, selectedTransmitters } = this.state;
    const { directional } = this.props;

    if (directional) {
      const tempArray = directionalChars.slice();

      selectedTransmitters.forEach((element) => {
        const url = `${REACT_APP_PROD_FILES_URL}/ant_pattern/${element.id_antena}`;

        fetch(url)
          .then(async (res) => {
            if (!res.ok) {
              try {
                await postError({
                  code: res.status,
                  method: "GET",
                  url,
                });

                toast.info(
                  `Powiadamiam administrację o problemie: brak charakterystyki kierunkowej anteny`
                );
              } catch (e) {
                toast.error(e);
              }
            }

            return res;
          })
          .then(() => {
            const marker = L.marker([element.szerokosc, element.dlugosc], {
              icon: L.icon({
                iconUrl: url,
                iconSize: [130, 130],
              }),
            }).addTo(map);

            tempArray.push(marker);
          })
          .catch(async () => {
            try {
              await postError({
                code: "unknown",
                method: "GET",
                url,
              });
            } catch (e) {
              toast.info(e);
            }
          });
      });
      this.setState({ directionalChars: tempArray }, () => {});
    }
  }

  setView() {
    const { map, selectedTransmitters } = this.state;

    let latitude = 0;
    let longitude = 0;

    if (selectedTransmitters.length) {
      selectedTransmitters.forEach((element) => {
        latitude += Number(element.szerokosc);
        longitude += Number(element.dlugosc);
      });
      map.setView(
        new L.LatLng(
          latitude / selectedTransmitters.length - 0.3,
          longitude / selectedTransmitters.length
        ),
        7
      );
    }
  }

  render() {
    const { state } = this;
    const mapRef = (node) => {
      this.mapNode = node;
    };

    return (
      <div id="mapUI">
        <div ref={mapRef} id="map">
          <Map
            center={config.params.center}
            ref={this.mapRef}
            zoom={config.params.zoom}
            zoomControl={false}
            minZoom={config.params.minZoom}
            maxZoom={config.params.maxZoom}
          >
            <LayersControl position="bottomleft">
              <BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  attribution={config.tileLayer.params.osmAttribution}
                  url={config.tileLayer.uri}
                />
              </BaseLayer>
              <BaseLayer name="OpenTopoMap">
                <TileLayer
                  attribution={config.tileLayer.params.topoAttribution}
                  url={config.tileLayer.uri2}
                />
              </BaseLayer>
              {state.gpsPosition ? (
                <Marker position={state.gpsPosition} icon={config.gpsIcon}>
                  <Popup>Twoja pozycja</Popup>
                </Marker>
              ) : null}
              {this.props.selectedMarkers.length
                ? this.props.selectedMarkers
                    .filter((el) => el.typ === this.props.system)
                    .map((element) => (
                      <RPMarker
                        key={element.id_nadajnik}
                        element={element}
                        config={config}
                        system={this.props.system}
                        isInterferences={
                          (!this.props.drawMultiple &&
                            state.interferencesTransmitter &&
                            element.id_nadajnik ===
                              state.interferencesTransmitter.id_nadajnik) ||
                          !state.interferencesTransmitter
                        }
                        interferencesChanged={this.interferencesChanged}
                      />
                    ))
                : null}
              <ZoomControl position="bottomleft" />
            </LayersControl>
          </Map>
        </div>
        <ToastContainer autoClose={5000} />
      </div>
    );
  }
}

export default MapLayer;
