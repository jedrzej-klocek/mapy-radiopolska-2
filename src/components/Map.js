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

import { RPTransmittersLayers } from "./TransmittersLayers";
import {
  shouldDrawLayers,
  shouldSetView,
  parseCommaNumber,
} from "../helpers/map";
import { mapconfig as config } from "../config/Map";

import "react-toastify/dist/ReactToastify.css";

// postCSS import of Leaflet's CSS
import "leaflet/dist/leaflet.css";
import "../styles/Map.css";

const { BaseLayer } = LayersControl;

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
      interferenceFrom: null,
      interferencedDeviationArr: [],
      interferencedTransmittersArr: [],
    };

    this.mapNode = null;
    this.gpsChanged = this.gpsChanged.bind(this);
    this.interferencesChanged = this.interferencesChanged.bind(this);
    this.checkGeoLocation = this.checkGeoLocation.bind(this);
  }

  interferencesChanged(el, arr) {
    if (!arr.length) {
      this.setState({
        interferencedDeviationArr: arr,
        interferenceFrom: null,
        interferencedTransmittersArr: arr,
      });
    }

    if (el && arr.length) {
      this.setState(
        {
          interferencedDeviationArr: arr,
          interferenceFrom: el,
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
          (el.id_nadajnik !== transmitter.id_nadajnik &&
            parseCommaNumber(el.mhz) - value ===
              parseCommaNumber(transmitter.mhz)) ||
          parseCommaNumber(el.mhz) + value === parseCommaNumber(transmitter.mhz)
        );
      });

      arr = [...arr, ...interferencedTrans];
    });

    this.setState({ interferencedTransmittersArr: arr });
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
        if (shouldSetView(props, prevProps)) {
          this.setView();
        }
      }
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
              <RPTransmittersLayers
                arr={state.interferencedTransmittersArr}
                markersArr={state.interferencedTransmittersArr}
                config={config}
                system={this.props.system}
                interferencesChanged={this.interferencesChanged}
                interferenceFrom={this.state.interferenceFrom}
                toast={toast}
                directional={this.props.directional}
                drawMultiple={this.props.drawMultiple}
                configuration={this.props.configuration}
              />
              <RPTransmittersLayers
                arr={this.props.selectedTransmitters}
                markersArr={this.props.selectedMarkers}
                config={config}
                system={this.props.system}
                interferencesChanged={this.interferencesChanged}
                interferenceFrom={this.state.interferenceFrom}
                toast={toast}
                directional={this.props.directional}
                drawMultiple={this.props.drawMultiple}
                configuration={this.props.configuration}
              />
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
