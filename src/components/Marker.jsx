import React, { useEffect } from "react";
import { Marker, Popup } from "react-leaflet";

import "../styles/Marker.css";

const { REACT_APP_PROD_LIST_URL } = process.env;

const radioButtons = [
  {
    value: 0,
    name: "ta sama częstotliwość",
  },
  {
    value: 0.1,
    name: "+/- 0.1 MHz",
  },
  {
    value: 0.2,
    name: "+/- 0.2 MHz",
  },
  {
    value: 0.3,
    name: "+/- 0.3 MHz",
  },
  {
    value: 0.4,
    name: "+/- 0.4 MHz",
  },
];

const MapMarker = ({ element, config, system, isInterferences, interferences }) => {
  const isRadioChecked = (radio) => {
    

  };

  return (
    <Marker
      position={[element.szerokosc, element.dlugosc]}
      icon={config.myIcon}
      className="transmitter_marker"
      zIndexOffset={2000}
    >
      <Popup>
        {element.skrot || ""}
        <a
          target="_blank"
          href={`${REACT_APP_PROD_LIST_URL}/obiekt/${element.id_obiekt}`}
        >
          {element.obiekt || ""}
        </a>
        <br />
        {system === "fm" ? (
          <>
            <b>{element.program || ""}</b>
            <br />
          </>
        ) : (
          <>
            <b>{element.multipleks || ""}</b>
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
        {isInterferences && interferences.byTransmitter === null ? (
          <form>
            <b>Sprawdź interferencje: </b>
            {radioButtons.map((radio) => (
              <div className="radio" key={`interferences-${radio.value}`}>
                <label htmlFor={`${element.id_nadajnik}-radio-${radio.value}`}>
                  <input
                    id={`${element.id_nadajnik}-radio-${radio.value}`}
                    type="radio"
                    value={radio.value}
                    checked={isRadioChecked(radio)}
                  />
                  <span>{radio.name}</span>
                </label>
              </div>
            ))}
          </form>
        ) : null}
      </Popup>
    </Marker>
  );
};

export const RPMarker = React.memo(MapMarker);
