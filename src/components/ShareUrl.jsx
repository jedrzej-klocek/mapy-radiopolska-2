import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "../styles/PopUp.css";

const ShareUrlPopup = ({ text }) => {
  const copyClicked = () => {
    toast.success("Skopiowano do schowka", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  };

  return (
    <div>
      <div className="PopUpWrapper">
        <div className="PopUpContent">
          <a href={text} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
          <CopyToClipboard text={text} onCopy={() => {}}>
            <button className="CopyToClip" type="button" onClick={copyClicked}>
              Skopiuj do schowka
            </button>
          </CopyToClipboard>
        </div>
        <div className="PopUpTipContainer">
          <div className="PopUpTip" />
        </div>
      </div>
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export const RPShareUrl = React.memo(ShareUrlPopup);
