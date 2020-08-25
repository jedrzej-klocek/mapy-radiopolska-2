import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { parse } from "qs";
import { ToastContainer, toast } from "react-toastify";

import "../styles/App.css";
import Map from "./Map";
import { RPTable } from "./Table/Table";
import LittleTable from "./Table/LittleTable";
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

let data = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingModal: false,
      isShowingShare: false,
      selectedTransmitters: [],
      selectedSystemTransmitters: [],
      system: null,
      toDrawSelected: [],
      configurations: [],
      selectedConfiguration: null,
      showFullInfo: true,
      settings: {
        automaticZoom: true,
        drawMultiple: false,
        drawDirectionalChar: true,
      },
      interferences: {
        byTransmitter: null,
        byFrequency: 0,
      },
    };
    this.handleSystemClick = this.handleSystemClick.bind(this);
    this.handleShareClick = this.handleShareClick.bind(this);
    this.getConfigurations = this.getConfigurations.bind(this);
    this.getSelectedData = this.getSelectedData.bind(this);
    this.getDrawData = this.getDrawData.bind(this);
    this.getSelectedConfiguration = this.getSelectedConfiguration.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.checkQueryString = this.checkQueryString.bind(this);
    this.handleSettingsChanged = this.handleSettingsChanged.bind(this);
  }

  componentDidMount() {
    const { location } = window;

    if (location.search && location.search.length) {
      if (location.search.split("?").length > 1) {
        this.checkQueryString(parse(location.search.split("?")[1]));
      }
    } else {
      this.getConfigurations();
      this.setDefaultSystem();
    }
  }

  async componentDidUpdate(prevProps, prevStates) {
    const { system } = this.state;

    if (system !== prevStates.system) {
      try {
        data = await fetchTransmittersBySystem(system);
      } catch (e) {
        toast.error(e);
      }
    }
  }

  async getConfigurations(configurationKey = "fm-std") {
    try {
      const newState = await fetchAPIConfigurations(configurationKey);

      this.setState({ ...newState }, () => {});
    } catch (e) {
      toast.error(e);
    }
  }

  checkQueryString(query) {
    if (!Object.keys(query).length || !query.sys) {
      window.location.href = "/";
    }
    this.setState({ ...parseQueryToState(query) }, () => {
      const ids = query.tra.split(",");

      if (query.sys && isValidSystem(query.sys)) {
        fetchTransmittersArray(ids, query.sys).then((transmitters) => {
          // removing undefined when something was wrong
          const filteredTransmitters = transmitters.filter((tra) => !!tra);

          if (filteredTransmitters.length > 0) {
            this.setState({
              selectedSystemTransmitters: filteredTransmitters,
              selectedTransmitters: filteredTransmitters,
              toDrawSelected: [filteredTransmitters[0]],
            });
          }
        });
      } else {
        console.error("Error: niewłaściwe parametry wejściowe");
        this.getConfigurations();
        this.setDefaultSystem();
      }
    });
    if (query && query.cfg) {
      this.setConfiguration(query.cfg);
    } else {
      this.getConfigurations();
    }
  }

  setDefaultSystem() {
    this.setState({ system: "fm" });
  }

  setConfiguration(configurationString) {
    this.getConfigurations(configurationString);
  }

  handleSystemClick(id) {
    console.log(id);
    const { selectedTransmitters, system } = this.state;

    if (system !== id) {
      data = [];
    }

    const currentTransmitters = [];

    selectedTransmitters.forEach((element) => {
      if (element.typ === id) {
        currentTransmitters.push(element);
      }
    });
    this.setState(
      { system: id, selectedSystemTransmitters: currentTransmitters },
      () => {}
    );
  }

  handleShareClick() {
    const url = generateUrl(this.state);

    this.setState((prevState) => ({
      uri: url,
      isShowingShare: !prevState.isShowingShare,
    }));
  }

  handleSettingsChanged(newState) {
    this.setState({ ...newState, isShowingShare: false });
  }

  openDialog() {
    this.setState({ isShowingModal: true });
  }

  handleClose() {
    this.setState({ isShowingModal: false });
  }

  getSelectedData(dataFromTable) {
    this.setState({ selectedTransmitters: dataFromTable }, () => {
      const { selectedTransmitters, system, toDrawSelected } = this.state;
      const currentTransmitters = [];

      selectedTransmitters.forEach((element) => {
        if (element.typ === system) {
          currentTransmitters.push(element);
        }
      });
      const intersection = currentTransmitters.filter((transmitter) =>
        toDrawSelected.includes(transmitter)
      );

      this.setState(
        {
          selectedSystemTransmitters: currentTransmitters,
          toDrawSelected: intersection,
          isShowingShare: false,
        },
        () => {}
      );
    });
  }

  getDrawData(dataFromLittleTable, openTable) {
    this.setState(
      {
        toDrawSelected: dataFromLittleTable,
        isShowingModal: openTable,
        isShowingShare: false,
      },
      () => {}
    );
  }

  getSelectedConfiguration(dataFromConfiguration) {
    this.setState({
      selectedConfiguration: dataFromConfiguration,
      isShowingShare: false,
    });
  }

  render() {
    const domain = window.location.origin;

    const { state } = this;

    return (
      <div id="gridId" className="grid">
        <div id="systems_container" className="container systems">
          <SystemButtons onSystemChange={this.handleSystemClick} />
        </div>
        <a href={domain}>
          <img id="home" className="button home" alt="Odswiez" src={logoIcon} />
        </a>
        <div className="stationsWrapper ButtonWrapper">
          <button
            id="stations"
            type="button"
            aria-label="check station button"
            className="button checkStation"
            title="Wybierz stacje do narysowania pokrycia"
            onClick={this.openDialog}
          />
        </div>
        <div id="buttons_container" className="container buttons">
          {state.configurations.length ? (
            <RPConfigurationsBox
              system={state.system}
              configurations={state.configurations}
              settings={state.settings}
              settingsCallback={this.handleSettingsChanged}
              selected={state.selectedConfiguration}
              callbackFromApp={this.getSelectedConfiguration}
            />
          ) : null}
        </div>
        <Modal show={state.isShowingModal} size="xl" onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title> Wybierz nadajniki</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RPTable
              system={state.system}
              callbackFromApp={this.getSelectedData}
              selected={state.selectedTransmitters}
              data={data}
            />
          </Modal.Body>
        </Modal>

        <RPInfo showFull={state.showFullInfo} />

        <div className="shareWrapper">
          <RPSystemButton
            id="share"
            ownClass="share"
            title="Pobierz link do udostępnienia"
            value=""
            onSystemClick={this.handleShareClick}
          />
        </div>
        {state.isShowingShare ? <RPShareUrl text={state.uri} /> : null}
        {state.selectedSystemTransmitters.length ? (
          <LittleTable
            system={state.system}
            callbackFromApp={this.getDrawData}
            selected={state.toDrawSelected}
            data={state.selectedSystemTransmitters}
            checkMultiple={state.settings.drawMultiple}
            addTransmiter={state.isShowingModal}
          />
        ) : null}
        <Map
          selectedTransmitters={state.toDrawSelected}
          selectedMarkers={state.selectedSystemTransmitters}
          configuration={state.selectedConfiguration}
          directional={state.settings.drawDirectionalChar}
          system={state.system}
          automaticZoom={state.settings.automaticZoom}
          drawMultiple={state.settings.drawMultiple}
          interferences={state.interferences}
        />
        <ToastContainer autoClose={5000} />
      </div>
    );
  }
}

export default App;
