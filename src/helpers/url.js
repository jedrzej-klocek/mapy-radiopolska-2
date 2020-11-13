/**
 * Url @Params
 * z -> automatic zoom on map
 * m -> allow multiple layers
 * d -> draw directional characteristics
 */
export const generateUrl = ({
  selectedConf,
  toDrawSelected,
  system,
  settings,
}) => {
  const domain = window.location.origin;
  let url = domain;

  if (selectedConf) {
    if (toDrawSelected.length) {
      url += "?tra=";
      url += toDrawSelected
        .map((element) => `${element.id_nadajnik}`)
        .join(",");
      url += `&cfg=${selectedConf.cfg}`;
      url += `&sys=${system}`;
      url += `&z=${settings.automaticZoom}`;
      url += `&m=${settings.drawMultiple}`;
      url += `&d=${settings.drawDirectionalChar}`;
    }
  }

  return url;
};

export const parseQueryToState = (query) => {
  const newState = {
    system: "",
    settings: {
      drawMultiple: false,
      automaticZoom: true,
      drawDirectionalChar: true,
    },
    showFullInfo: false,
  };

  if (query.m) {
    newState.settings.drawMultiple = query.m === "true";
  }
  if (query.z) {
    newState.settings.automaticZoom = query.z === "true";
  }
  if (query.d) {
    newState.settings.drawDirectionalChar = query.d === "true";
  }
  if (query.sys) {
    newState.system = query.sys;
  }

  return { ...newState, ids: query.tra.split(",") };
};
