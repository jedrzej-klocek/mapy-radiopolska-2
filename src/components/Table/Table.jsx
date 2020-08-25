import React, { useEffect, useRef, useState } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

import { RPLoader } from "./Loader";
import { startColumns, endColumns } from "./Columns";

import { tableOptions } from "../../config/Table";
import { linkCellFormat, linkCellsProps } from "../../helpers/table";

import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";

const Table = ({ system, selected, data, callbackFromApp }) => {
  const ref = useRef(null);
  const [selectedIDs, setSelectedIDs] = useState([]);

  useEffect(() => {
    updateSelectedIDs();
  }, [selected]);

  const onSelect = (row, isSelected) => {
    let tempSelected = [...selected];

    if (isSelected) {
      tempSelected.push(row);
    } else {
      tempSelected = selected.filter(
        (obj) => obj.id_nadajnik !== row.id_nadajnik
      );
    }

    callbackFromApp(tempSelected);
  };

  const onSelectAll = (isSelected) => {
    const pagingTransmitters = ref.current.getTableDataIgnorePaging();
    const transmitters = isSelected
      ? pagingTransmitters.map((transmitter) => transmitter)
      : [];

    callbackFromApp(transmitters);
  };

  const updateSelectedIDs = () => {
    const IDs = selected.map((transmitter) => transmitter.id_nadajnik);

    setSelectedIDs(IDs);
  };

  const selectRowProp = {
    mode: "checkbox",
    clickToSelect: true,
    bgColor: "rgba(240, 129, 104, 0.7)",
    onSelect: onSelect,
    onSelectAll: onSelectAll,
    selected: selectedIDs,
  };

  let table = null;

  if (system === "fm") {
    table = (
      <>
        {startColumns.props.children}
        <TableHeaderColumn
          dataField="program"
          dataFormat={(cell, row) =>
            linkCellFormat(cell, row, linkCellsProps.station)
          }
          filter={{ type: "TextFilter" }}
        >
          Program
        </TableHeaderColumn>
        {endColumns.props.children}
      </>
    );
  } else if (system === "dab" || system === "dvbt") {
    table = (
      <>
        {startColumns.props.children}
        <TableHeaderColumn
          dataField="multipleks"
          dataFormat={(cell, row) =>
            linkCellFormat(cell, row, linkCellsProps.mux)
          }
          filter={{ type: "TextFilter" }}
        >
          Multipleks
        </TableHeaderColumn>
        {endColumns.props.children}
        <TableHeaderColumn
          dataField="kanal_nazwa"
          dataFormat={(cell, row) =>
            linkCellFormat(cell, row, linkCellsProps.mHz, true)
          }
          width="10%"
          filter={{ type: "TextFilter" }}
        >
          Kanał
        </TableHeaderColumn>
      </>
    );
  }
  const assignRef = (el) => {
    ref.current = el;
  };

  return (
    <div>
      {data.length ? (
        <BootstrapTable
          ref={assignRef}
          data={data}
          selectRow={selectRowProp}
          striped
          hover
          condensed
          pagination
          options={tableOptions}
        >
          {table.props.children}
        </BootstrapTable>
      ) : (
        <div>
          <h3>Trwa pobieranie nadajnijków, proszę czekać</h3>
          <RPLoader />
        </div>
      )}
    </div>
  );
};

export const RPTable = React.memo(Table);
