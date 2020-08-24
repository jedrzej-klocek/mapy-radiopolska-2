import React from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

import { RPLoader } from "./Loader";
import { startColumns, endColumns } from "./Columns";

import { tableOptions } from "../../config/Table";
import { linkCellFormat, linkCellsProps } from "../../helpers/table";

import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTransmitters: props.selected,
      selectedIDs: [],
      system: props.system,
      filteredTransmitters: [],
    };
    this.btnRef = null;
    this.updateSelectedIDs = this.updateSelectedIDs.bind(this);
  }

  onSelect(row, isSelected) {
    const { selectedTransmitters } = this.state;
    const { callbackFromApp } = this.props;

    let selected = selectedTransmitters.slice();

    if (isSelected) {
      selected.push(row);
    } else {
      selected = selected.filter((obj) => obj.id_nadajnik !== row.id_nadajnik);
    }
    this.setState({ selectedTransmitters: selected }, function () {
      callbackFromApp(selected);
      this.updateSelectedIDs();
    });
  }

  onSelectAll(isSelected) {
    const { filteredTransmitters } = this.state;
    const { callbackFromApp } = this.props;
    const pagingTransmitters = this.btnRef.getTableDataIgnorePaging();

    this.setState({ filteredTransmitters: pagingTransmitters }, () => {
      const transmitters = isSelected
        ? filteredTransmitters.map((transmitter) => transmitter)
        : [];

      this.setState({ selectedTransmitters: transmitters }, function () {
        callbackFromApp(transmitters);
        this.updateSelectedIDs();
      });
    });
  }

  updateSelectedIDs() {
    const { selectedTransmitters } = this.state;
    const IDs = [];

    selectedTransmitters.forEach((transmitter) => {
      IDs.push(transmitter.id_nadajnik);
    });
    this.setState({ selectedIDs: IDs });
  }

  componentDidMount() {
    this.updateSelectedIDs();
  }

  render() {
    const { selectedIDs, system } = this.state;
    const { data } = this.props;

    const selectRowProp = {
      mode: "checkbox",
      clickToSelect: true,
      bgColor: "rgba(240, 129, 104, 0.7)",
      onSelect: this.onSelect.bind(this),
      onSelectAll: this.onSelectAll.bind(this),
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
    const myRef = (el) => {
      this.btnRef = el;
    };

    return (
      <div>
        {data.length ? (
          <BootstrapTable
            ref={myRef}
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
  }
}

export default Table;
