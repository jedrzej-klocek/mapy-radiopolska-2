import React, { useState, useEffect } from "react";

import { RPSystemButton } from "./Button";

const Buttons = ({ onSystemChange }) => {
  const [system, setSystem] = useState("fm");

  useEffect(() => {
    onSystemChange(system);
  }, [system, onSystemChange]);

  return (
    <>
      <RPSystemButton
        id="fm"
        ownClass={`system ${system === "fm" ? "focus" : ""}`}
        title="Zmień system na FM"
        value="FM"
        onSystemClick={setSystem}
      />
      <RPSystemButton
        id="dab"
        ownClass={`system ${system === "dab" ? "focus" : ""}`}
        title="Zmień system na DAB+"
        value="DAB+"
        onSystemClick={setSystem}
      />
      <RPSystemButton
        id="dvbt"
        ownClass={`system ${system === "dvbt" ? "focus" : ""}`}
        title="Zmień system na DVB-T"
        value="DVB-T"
        onSystemClick={setSystem}
      />
    </>
  );
};

export const SystemButtons = React.memo(Buttons);
