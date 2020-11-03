import React, { useEffect, useState, useCallback } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

import { idColumn, mastColumn } from "./Columns";
import { linkCellFormat, linkCellsProps } from "../../helpers/table";

import "../../styles/LittleTable.css";

const LittleTable = ({
  system,
  selected,
  data,
  checkMultiple,
  callbackFromApp,
  addTransmitterClick,
}) => {
  const [open, setOpen] = useState(true);
  const [selectedIDs, setSelectedIDs] = useState([]);

  useEffect(() => {
    updateSelectedIDs();
  }, [selected]);

  const toggle = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  const updateSelectedIDs = () => {
    const IDs = selected.map((transmitter) => transmitter.id_nadajnik);

    setSelectedIDs(IDs);
  };

  const onDrawSelected = (row, isSelected) => {
    let tempArray = [...selected];

    if (isSelected) {
      // add new object which was selected
      if (!checkMultiple) {
        tempArray = [];
      }
      tempArray.push(row);
    } else if (!isSelected) {
      // remove object which has same id_nadajnik as exist
      tempArray = tempArray.filter(
        (obj) => obj.id_nadajnik !== row.id_nadajnik
      );
    }

    callbackFromApp(tempArray);
  };

  const onDrawAllSelected = (isSelected, rows) => {
    let tempArray = [...selected];

    if (isSelected) {
      rows.forEach((element) => {
        tempArray.push(element);
      });
    } else {
      rows.forEach((element) => {
        tempArray = tempArray.filter(
          (obj) => obj.id_nadajnik !== element.id_nadajnik
        );
      });
    }

    callbackFromApp(tempArray);
  };

  const selectRowProp = checkMultiple
    ? {
        mode: "checkbox",
        clickToSelect: true,
        bgColor: "rgba(240, 129, 104, 0.7)",
        onSelect: onDrawSelected,
        onSelectAll: onDrawAllSelected,
        selected: selectedIDs,
      }
    : {
        mode: "radio",
        clickToSelect: true,
        bgColor: "rgba(240, 129, 104, 0.7)",
        onSelect: onDrawSelected,
        selected: selectedIDs,
      };
  let table = null;

  if (system === "fm") {
    table = (
      <div>
        {idColumn}
        <TableHeaderColumn dataField="mhz" width="15%">
          MHz
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="program"
          dataFormat={(cell, row) =>
            linkCellFormat(cell, row, linkCellsProps.station)
          }
          width="40%"
        >
          Program
        </TableHeaderColumn>
        {mastColumn}
      </div>
    );
  } else if (system === "dab" || system === "dvbt") {
    table = (
      <div>
        {idColumn}
        <TableHeaderColumn dataField="kanal_nazwa" width="15%">
          Kanał
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="multipleks"
          dataFormat={(cell, row) =>
            linkCellFormat(cell, row, linkCellsProps.mux)
          }
          width="30%"
        >
          Multipleks
        </TableHeaderColumn>

        {mastColumn}
      </div>
    );
  }

  return data ? (
    <div className={`littleTable ${open}`}>
      <button
        type="button"
        aria-label="hide transmitters check table"
        className="circleButton"
        onClick={toggle}
      />
      <BootstrapTable
        data={data}
        selectRow={selectRowProp}
        striped
        hover
        condensed
      >
        {table.props.children}
      </BootstrapTable>
      <div className="AddTransmitter">
        <button type="button" className="button" onClick={addTransmitterClick}>
          Dodaj nadajnik
        </button>
      </div>
    </div>
  ) : null;
};

export const RPLittleTable = React.memo(LittleTable);
