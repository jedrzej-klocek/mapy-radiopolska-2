import React, { useCallback, useState } from "react";
import { Marker, Popup } from "react-leaflet";

import "../styles/Marker.css";

const { REACT_APP_PROD_LIST_URL } = process.env;

const checkboxes = [
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

const MapMarker = ({
  element,
  config,
  system,
  isInterferences,
  interferencesChanged,
}) => {
  const [interferencesArr, setInterferencesArr] = useState([]);

  const onCheckboxChange = useCallback(
    (event) => {
      let newArr = [...interferencesArr];

      if (event.target.checked) {
        newArr.push(+event.target.value);
      } else {
        newArr = newArr.filter((el) => el !== +event.target.value);
      }

      setInterferencesArr(newArr);
      interferencesChanged(element, newArr);
    },
    [interferencesChanged, interferencesArr, element]
  );

  const isCheckboxChecked = (checkbox) => {
    return interferencesArr.includes(checkbox.value);
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
          rel="noopener noreferrer"
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
        {isInterferences ? (
          <form>
            <b>Sprawdź interferencje: </b>
            {checkboxes.map((checkbox) => (
              <div className="checkbox" key={`interferences-${checkbox.value}`}>
                <label
                  htmlFor={`${element.id_nadajnik}-checkbox-${checkbox.value}`}
                >
                  <input
                    id={`${element.id_nadajnik}-checkbox-${checkbox.value}`}
                    type="checkbox"
                    value={checkbox.value}
                    checked={isCheckboxChecked(checkbox)}
                    onChange={onCheckboxChange}
                  />
                  <span>{checkbox.name}</span>
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
