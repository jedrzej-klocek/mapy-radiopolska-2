import React, { useState, useCallback, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { parse } from "qs";
import { ToastContainer, toast } from "react-toastify";

import "../styles/App.css";
import Map from "./Map";
import { RPTable } from "./Table/Table";
import { RPLittleTable } from "./Table/LittleTable";
import { RPConfigurationsBox } from "./ConfigurationsBox";
import { RPShareUrl } from "./ShareUrl";
import { RPInfo } from "./Info";

import {
  fetchTransmittersBySystem,
  fetchAPIConfigurations,
  fetchTransmittersArray,
} from "../api/transmitters";
import { generateUrl, parseQueryToState } from "../helpers/url";
import { isValidSystem } from "../validators/url";
import { RPSystemButton } from "./Button";
import { SystemButtons } from "./SystemButtons";

const logoIcon = require("../images/icons/logoIcon.png");

const App = () => {
  const [isShowingModal, setIsShowingModal] = useState(false);
  const [isShowingShare, setIsShowingShare] = useState(false);
  const [toDrawSelected, setToDrawSelected] = useState([]);
  const [selectedTransmitters, setSelectedTransmitters] = useState([]);
  const [selectedSystemTransmitters, setSelectedSystemTransmitters] = useState(
    []
  );
  const [system, setSystem] = useState("fm");
  const [shareUrl, setShareUrl] = useState(null);
  const [showFullInfo, setShowFullInfo] = useState(true);
  const [selectedConf, setSelectedConf] = useState(null);
  const [settings, setSettings] = useState({
    automaticZoom: true,
    drawMultiple: false,
    drawDirectionalChar: true,
  });

  const [data, setData] = useState([]);
  const [configurations, setConfigurations] = useState([]);

  const getConfigurations = useCallback(async (configurationKey = "fm-std") => {
    try {
      const {
        configurations,
        selectedConfiguration,
      } = await fetchAPIConfigurations(configurationKey);

      setSelectedConf(selectedConfiguration);
      setConfigurations(configurations);
    } catch (e) {
      toast.error(e);
    }
  }, []);

  const fetchConfiguration = useCallback(
    (configurationString) => {
      getConfigurations(configurationString);
    },
    [getConfigurations]
  );

  const checkQueryString = useCallback(
    (query) => {
      if (!Object.keys(query).length || !query.sys) {
        window.location.href = "/";
      }

      const parsedUrl = parseQueryToState(query);

      setSettings(parsedUrl.settings);
      setSystem(parsedUrl.system);
      setShowFullInfo(parsedUrl.showFullInfo);

      if (query.sys && isValidSystem(query.sys)) {
        fetchTransmittersArray(parsedUrl.ids, query.sys).then(
          (transmitters) => {
            // removing undefined when something was wrong
            const filteredTransmitters = transmitters.filter((tra) => !!tra);

            if (filteredTransmitters.length > 0) {
              setSelectedSystemTransmitters(filteredTransmitters);
              setSelectedTransmitters(filteredTransmitters);
              setToDrawSelected([filteredTransmitters[0]]);
            }
          }
        );
      } else {
        console.error("Error: niewłaściwe parametry wejściowe");
        getConfigurations();
      }

      if (query && query.cfg) {
        fetchConfiguration(query.cfg);
      } else {
        getConfigurations();
      }
    },
    [fetchConfiguration, getConfigurations]
  );

  useEffect(() => {
    const { location } = window;

    if (location.search && location.search.length) {
      if (location.search.split("?").length > 1) {
        checkQueryString(parse(location.search.split("?")[1]));
      }
    } else {
      getConfigurations();
    }
  }, [checkQueryString, getConfigurations]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetchTransmittersBySystem(system);

      setData(response);
    } catch (e) {
      toast.error(e);
    }
  }, [system]);

  useEffect(() => {
    fetchData();
  }, [system, fetchData]);

  const handleSystemClick = useCallback((id) => {
    setSystem(id);
  }, []);

  const handleShareClick = useCallback(() => {
    setShareUrl(
      generateUrl({
        selectedConf,
        toDrawSelected,
        system,
        settings,
      })
    );
    setIsShowingShare(!isShowingShare);
  }, [selectedConf, toDrawSelected, system, settings, isShowingShare]);

  const handleSettingsChanged = useCallback(({ settings }) => {
    setSettings(settings);
  }, []);

  const openDialog = useCallback(() => {
    setIsShowingModal(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsShowingModal(false);
  }, []);

  const getSelectedData = useCallback(
    (dataFromTable) => {
      const currentTransmitters = [];

      dataFromTable.forEach((element) => {
        if (element.typ === system) {
          currentTransmitters.push(element);
        }
      });

      setSelectedTransmitters(dataFromTable);
      setSelectedSystemTransmitters(currentTransmitters);
      setIsShowingShare(false);
    },
    [system]
  );

  const getDrawData = useCallback((dataFromLittleTable) => {
    setToDrawSelected(dataFromLittleTable);
    setIsShowingShare(false);
  }, []);

  const getSelectedConfiguration = useCallback((dataFromConfiguration) => {
    setSelectedConf(dataFromConfiguration);
    setIsShowingShare(false);
  }, []);

  return (
    <div id="gridId" className="grid">
      <div id="systems_container" className="container systems">
        <SystemButtons onSystemChange={handleSystemClick} />
      </div>
      <a href={"/"}>
        <img id="home" className="button home" alt="Odswiez" src={logoIcon} />
      </a>
      <div className="stationsWrapper ButtonWrapper">
        <button
          id="stations"
          type="button"
          aria-label="check station button"
          className="button checkStation"
          title="Wybierz stacje do narysowania pokrycia"
          onClick={openDialog}
        />
      </div>
      <div id="buttons_container" className="container buttons">
        {configurations.length ? (
          <RPConfigurationsBox
            system={system}
            configurations={configurations}
            settings={settings}
            settingsCallback={handleSettingsChanged}
            selected={selectedConf}
            callbackFromApp={getSelectedConfiguration}
          />
        ) : null}
      </div>
      <Modal show={isShowingModal} size="xl" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Wybierz nadajniki</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RPTable
            system={system}
            callbackFromApp={getSelectedData}
            selected={selectedTransmitters}
            data={data}
          />
        </Modal.Body>
      </Modal>

      <RPInfo showFull={showFullInfo} />

      <div className="shareWrapper">
        <RPSystemButton
          id="share"
          ownClass="share"
          title="Pobierz link do udostępnienia"
          value=""
          onSystemClick={handleShareClick}
        />
      </div>
      {isShowingShare ? <RPShareUrl text={shareUrl} /> : null}
      {selectedSystemTransmitters.length ? (
        <RPLittleTable
          system={system}
          selected={toDrawSelected}
          data={selectedSystemTransmitters}
          checkMultiple={settings.drawMultiple}
          callbackFromApp={getDrawData}
          addTransmitterClick={openDialog}
        />
      ) : null}
      <Map
        selectedTransmitters={toDrawSelected}
        selectedMarkers={selectedSystemTransmitters}
        configuration={selectedConf}
        directional={settings.drawDirectionalChar}
        automaticZoom={settings.automaticZoom}
        drawMultiple={settings.drawMultiple}
        system={system}
        data={data}
      />
      <ToastContainer autoClose={5000} />
    </div>
  );
};

export const MemoApp = React.memo(App);
