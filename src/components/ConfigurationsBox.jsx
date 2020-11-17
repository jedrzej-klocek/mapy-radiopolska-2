import React, { useState, useCallback, useEffect } from "react";
import { RPLegend } from "./Legend";
import { configurationSettingsCheckboxes } from "../config/Configurations";

import settingsIcon from "../images/baseline_settings_black_36dp.png";
import "../styles/ConfigurationsBox.css";

const ConfigurationsBox = ({
  system,
  configurations,
  settings,
  settingsCallback,
  selected,
  callbackFromApp,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stateSettings, setStateSettings] = useState(settings);
  const [possibleConfigurations, setPossibleConfigurations] = useState([]);
  const [checkedConfiguration, setCheckedConfiguration] = useState(null);

  const getPossibleConfiguration = useCallback(() => {
    if (system || !selected) {
      const possibleConfs = configurations.filter(
        (configuration) => configuration.typ === system
      );

      setPossibleConfigurations(possibleConfs);
      setCheckedConfiguration(possibleConfs[0]);
    }
  }, [
    setPossibleConfigurations,
    setCheckedConfiguration,
    system,
    selected,
    configurations,
  ]);

  useEffect(() => {
    getPossibleConfiguration();
  }, [system, getPossibleConfiguration]);

  useEffect(() => {
    callbackFromApp(checkedConfiguration);
  }, [checkedConfiguration, callbackFromApp]);

  useEffect(() => {
    settingsCallback({
      settings: { ...stateSettings },
    });
  }, [stateSettings, settingsCallback]);

  const possibleConfRadios = () => {
    return possibleConfigurations.map((configuration) => (
      <React.Fragment key={configuration.nazwa}>
        <label htmlFor={configuration.cfg}>
          <input
            id={configuration.cfg}
            type="radio"
            name="configuration"
            checked={selected.cfg === configuration.cfg}
            value={configuration.cfg}
            onChange={onConfigurationChanged}
          />
          <span>{configuration.nazwa}</span>
        </label>
        <br />
      </React.Fragment>
    ));
  };

  const onSettingsChanged = (e) => {
    const { target } = e;
    const value = target.type === "checkbox" ? target.checked : target.value;

    setStateSettings({ ...stateSettings, [target.name]: value });
  };

  const settingsCheckboxes = () => {
    return configurationSettingsCheckboxes.map((checkbox) => (
      <React.Fragment key={checkbox.name}>
        <label key={checkbox.name} htmlFor={checkbox.name}>
          <input
            id={checkbox.name}
            type="checkbox"
            name={checkbox.name}
            checked={settings[checkbox.name] === true}
            onChange={onSettingsChanged}
          />
          <span>{checkbox.label}</span>
        </label>
        <br />
      </React.Fragment>
    ));
  };

  const onConfigurationChanged = (e) => {
    const configur = possibleConfigurations.filter(
      (configuration) => configuration.cfg === e.target.value
    );

    setCheckedConfiguration(configur[0]);
  };

  const openConfiguration = () => {
    setIsOpen(!isOpen);
  };

  return possibleConfigurations.length ? (
    <div className="componentWidth">
      {isOpen ? (
        <div className={`confsBox ${isOpen}`}>
          <div className="ButtonHeaderWrap">
            <button
              type="button"
              onClick={openConfiguration}
              className="confsButton"
            >
              <img
                src={settingsIcon}
                type="image/svg+xml"
                className={`Conf-logo ${isOpen}`}
                alt="Konfiguracja"
              />
            </button>
            <b className="WhiteParagraph">Ustawienia</b>
          </div>
          <div className="confsWhiteBox">
            <form>{possibleConfRadios()}</form>
            <b>{checkedConfiguration.opis}</b> <br /> <br />
            {settingsCheckboxes()}
            <b className="label-margin-right" style={{ color: "red" }}>
              UWAGA:{" "}
            </b>
            Może to spowodować spadek wydajności pracy Twojego urządzenia oraz
            jakości obserwacji map pokrycia.
          </div>
        </div>
      ) : (
        <div className={`confsBox ${isOpen}`}>
          <button
            type="button"
            onClick={openConfiguration}
            className="confsButton"
          >
            <img
              src={settingsIcon}
              type="image/svg+xml"
              className={`Conf-logo ${isOpen}`}
              alt="Konfiguracja"
            />
          </button>
        </div>
      )}
      <RPLegend legend={checkedConfiguration} />
    </div>
  ) : null;
};

export const RPConfigurationsBox = React.memo(ConfigurationsBox);
