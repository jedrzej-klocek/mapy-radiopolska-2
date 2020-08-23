import React, { useState, useEffect } from "react";

import SystemButton from "./Button";

const Buttons = ({ onSystemChange }) => {
  const [system, setSystem] = useState("fm");

  useEffect(() => {
    onSystemChange(system);
  }, [system]);

  return (
    <>
      <SystemButton
        id="fm"
        class={`system ${system === "fm" ? "focus" : ""}`}
        title="Zmień system na FM"
        value="FM"
        onSystemClick={setSystem}
      />
      <SystemButton
        id="dab"
        class={`system ${system === "dab" ? "focus" : ""}`}
        title="Zmień system na DAB+"
        value="DAB+"
        onSystemClick={setSystem}
      />
      <SystemButton
        id="dvbt"
        class={`system ${system === "dvbt" ? "focus" : ""}`}
        title="Zmień system na DVB-T"
        value="DVB-T"
        onSystemClick={setSystem}
      />
    </>
  );
};

export const SystemButtons = React.memo(Buttons);
