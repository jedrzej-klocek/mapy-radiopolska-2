import React from "react";
import "../../styles/Spinner.css";

const Loader = () => {
  return (
    <div className="spinner">
      <div className="rect1" />
      <div className="rect2" />
      <div className="rect3" />
      <div className="rect4" />
      <div className="rect5" />
    </div>
  );
};

export const RPLoader = React.memo(Loader);
