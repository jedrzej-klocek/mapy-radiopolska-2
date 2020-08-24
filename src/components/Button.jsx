import React from "react";
import "../styles/Button.css";

const SystemButton = ({ onSystemClick, id, ownClass, title, value }) => {
  const handleClick = () => {
    onSystemClick(id);
  };

  return (
    <div className="ButtonWrapper">
      <button
        id={id}
        type="button"
        className={`button ${ownClass}`}
        title={title}
        onClick={handleClick}
      >
        {value}
      </button>
    </div>
  );
};

export const RPSystemButton = React.memo(SystemButton);
