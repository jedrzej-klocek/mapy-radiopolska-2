import React from "react";

const { REACT_APP_PROD_LIST_URL } = process.env;
const { REACT_APP_PROD_THUMBS_URL } = process.env;

export const linkCellsProps = {
  station: {
    path: "program",
    rowKey: "id_program",
  },
  mux: {
    path: "mux",
    rowKey: "id_multipleks",
  },
  obiekt: {
    path: "obiekt",
    rowKey: "id_obiekt",
  },
  mHz: {
    rowKey: "id_nadajnik",
  },
};

export const linkCellFormat = (cell, row, propKeys, isMHz = false) => (
  <a
    href={
      isMHz
        ? `${REACT_APP_PROD_LIST_URL}/${row.typ}/${row[propKeys.rowKey]}`
        : `${REACT_APP_PROD_LIST_URL}/${propKeys.path}/${row[propKeys.rowKey]}`
    }
    title="Szczegóły"
    target="_blank"
    rel="noopener noreferrer"
  >
    {cell}
  </a>
);

export const iconFormat = (cell) => (
  <div
    style={{
      width: "6em",
      height: "2.2em",
      backgroundImage: `url(${REACT_APP_PROD_THUMBS_URL}/thumb/${cell}/300)`,
      borderRadius: "2px",
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  />
);
