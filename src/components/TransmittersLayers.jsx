import React, { useEffect, useCallback, useState, useMemo } from "react";
import { ImageOverlay, LayerGroup, Marker } from "react-leaflet";
import L from "leaflet";

import { fetchKMLsArray } from "../api/maps-layers";
import { getDeviation } from "../helpers/marker";

import { postError } from "../api/errors";
import { RPMarker } from "./Marker";

const { REACT_APP_PROD_FILES_URL } = process.env;

const TransmittersLayers = ({
  arr,
  markersArr,
  directional,
  drawMultiple,
  config,
  configuration,
  system,
  interferencesChanged,
  interferenceFrom,
  toast,
}) => {
  const [directionalCharts, setDirectionalCharts] = useState([]);
  const [imageOverlays, setImageOverlays] = useState([]);
  const arrToDraw = useMemo(() => {
    let response = false;

    if (arr.length >= 30) {
      response = window.confirm(
        `Czy na pewno chcesz wyświetlić ${arr.length} mapek? 
        Grozi to utratą stabilności Twojej przeglądarki.
        W przeciwnym wypadku zostanie narysowanych pierwszych 30 pozycji z listy`
      );
    }
    if (response === false) {
      return arr.slice(0, 30);
    }
  }, [arr]);

  const getImageOverlayClass = useCallback(
    (el) => {
      const deviation = getDeviation(interferenceFrom, el);
      let className = "RPImageOverlay";

      switch (deviation) {
        case 0.4:
          className += "--0_4";
          break;
        case 0.3:
          className += "--0_3";
          break;
        case 0.2:
          className += "--0_2";
          break;
        case 0.1:
          className += "--0_1";
          break;
        case 0:
          className += "--0_0";
          break;
        default:
          break;
      }

      return className;
    },
    [interferenceFrom]
  );

  const fetchImageOverlays = useCallback(async () => {
    await fetchKMLsArray(arrToDraw, configuration).then((res) => {
      setImageOverlays(
        res.map((el) => (
          <ImageOverlay
            key={`${el.id_nadajnik}_overlay`}
            url={`${REACT_APP_PROD_FILES_URL}/get/${configuration.cfg}/${el["_mapahash"]}.png`}
            bounds={el.bounds}
            className={getImageOverlayClass(el)}
          />
        ))
      );
    });
  }, [arrToDraw, configuration, getImageOverlayClass]);

  const fetchAntennasPatterns = useCallback(async () => {
    const markers = [];

    Promise.all(
      arrToDraw.map(async (el) => {
        const url = `${REACT_APP_PROD_FILES_URL}/ant_pattern/${el.id_antena}`;

        await fetch(url)
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

            return [res.url, res.ok];
          })
          .then(([url, ok]) => {
            markers.push(
              (ok && (
                <Marker
                  key={`${el.id_nadajnik}_ant`}
                  position={[el.szerokosc, el.dlugosc]}
                  icon={L.icon({ iconUrl: url, iconSize: [120, 120] })}
                  zIndexOffset={1000}
                />
              )) ||
                null
            );
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
      })
    ).then(() => {
      setDirectionalCharts(markers);
    });
  }, [arrToDraw, toast]);

  useEffect(() => {
    fetchAntennasPatterns();
    fetchImageOverlays();
  }, [fetchAntennasPatterns, fetchImageOverlays]);

  return (
    <>
      <LayerGroup>
        {directional && directionalCharts}
        {imageOverlays}
        {markersArr.length &&
          markersArr.map((el) => (
            <React.Fragment key={el.id_nadajnik}>
              <RPMarker
                key={el.id_nadajnik}
                element={el}
                config={config}
                system={system}
                interferencesChanged={interferencesChanged}
                interferenceFrom={interferenceFrom}
                drawMultiple={drawMultiple}
              />
            </React.Fragment>
          ))}
      </LayerGroup>
    </>
  );
};

export const RPTransmittersLayers = React.memo(TransmittersLayers);
