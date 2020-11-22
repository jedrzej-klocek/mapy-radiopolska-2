import React, { useCallback, useState, useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import { getDeviation } from "../helpers/marker";

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
  drawMultiple,
  system,
  interferencesChanged,
  interferenceFrom,
}) => {
  const [interferencesArr, setInterferencesArr] = useState([]);

  const isInterferences = useMemo(() => {
    if (drawMultiple) return false;

    return (
      !interferenceFrom ||
      (interferenceFrom && element.id_nadajnik === interferenceFrom.id_nadajnik)
    );
  }, [drawMultiple, element, interferenceFrom]);

  const filteredCheckboxes = useMemo(() => {
    return checkboxes.filter((checkbox) => {
      if (system === "fm") return true;
      if (system !== "fm" && checkbox.value === 0) return true;

      return false;
    });
  }, [system]);

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

  const isCheckboxChecked = useCallback(
    (checkbox) => {
      if (!interferenceFrom) return false;

      return interferencesArr.includes(checkbox.value);
    },
    [interferencesArr, interferenceFrom]
  );

  const switchIconPath = useCallback(() => {
    const deviation = getDeviation(interferenceFrom, element);
    let icon = config.icon;

    if (
      interferenceFrom &&
      element.id_nadajnik === interferenceFrom.id_nadajnik
    )
      return icon;

    switch (deviation) {
      case 0.4:
        icon = config.greenIcon;
        break;
      case 0.3:
        icon = config.yellowIcon;
        break;
      case 0.2:
        icon = config.orangeIcon;
        break;
      case 0.1:
        icon = config.deepOrangeIcon;
        break;
      case 0:
        icon = config.redIcon;
        break;
      default:
        break;
    }

    return icon;
  }, [interferenceFrom, config, element]);

  return (
    element.szerokosc &&
    element.dlugosc && (
      <Marker
        position={[element.szerokosc, element.dlugosc]}
        icon={switchIconPath()}
        className="transmitter_marker"
        zIndexOffset={2000}
      >
        <Popup>
          {element.skrot || ""}
          {element.id_obiekt ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${REACT_APP_PROD_LIST_URL}/obiekt/${element.id_obiekt}`}
            >
              {element.obiekt || ""}
            </a>
          ) : (
            element.obiekt || ""
          )}
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
          Częstotliwość: {element.mhz || ""} MHz {element.kategoria || ""}
          <br />
          {system === "fm" ? `PI: ${element.pi}` : ""}
          {` ERP: ${element.erp}kW Pol: ${element.polaryzacja}`}
          <br />
          {`Wys. podst. masztu: ${element.wys_npm}m n.p.m`}
          <br />
          {`Wys. umieszcz. nadajnika: ${element.antena_npt}m n.p.t`}
          <br />
          {isInterferences && (
            <form>
              <b>Sprawdź interferencje:</b>
              {filteredCheckboxes.map(
                (checkbox) =>
                  element.id_nadajnik && (
                    <div
                      className="checkbox"
                      key={`interferences-${checkbox.value}`}
                    >
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
                        <span>{checkbox.name || ""}</span>
                      </label>
                    </div>
                  )
              )}
            </form>
          )}
        </Popup>
      </Marker>
    )
  );
};

export const RPMarker = React.memo(MapMarker);
