import React from "react";
import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

const { REACT_APP_PROD_LIST_URL } = process.env;

const MapMarker = ({ element, config, system }) => {
  return (
    <Marker
      position={[element.szerokosc, element.dlugosc]}
      icon={config.myIcon}
      className="transmitter_marker"
      zIndexOffset={2000}
    >
      <Popup>
        {element.skrot}
        <a
          target="_blank"
          href={`${REACT_APP_PROD_LIST_URL}/obiekt/${element.id_obiekt}`}
        >
          {` ${element.obiekt}`}
        </a>
        <br />
        {system === "fm" ? (
          <>
            <b>{element.program}</b>
            <br />
          </>
        ) : (
          <>
            <b>{element.multipleks}</b>
            <br />
          </>
        )}
        Częstotliwość: {element.mhz} MHz {element.kategoria}
        <br />
        {system === "fm" ? `PI: ${element.pi}` : ""}
        {` ERP: ${element.erp}kW Pol: ${element.polaryzacja}`}
        <br />
        {`Wys. podst. masztu: ${element.wys_npm}m n.p.m`}
        <br />
        {`Wys. umieszcz. nadajnika: ${element.antena_npt}m n.p.t`}
        <br />
        <Link to={`?tra=${element.id_nadajnik}&dev=0`}>
          Częstotliwość +- 0 Mhz
        </Link>
        <br />
        <Link to={`?tra=${element.id_nadajnik}&dev=0.1`}>
          Częstotliwość +- 0.1 MHz
        </Link>
        <br />
        <Link to={`?tra=${element.id_nadajnik}&dev=0.2`}>
          Częstotliwość +- 0.2 MHz
        </Link>
      </Popup>
    </Marker>
  );
};

export default MapMarker;
