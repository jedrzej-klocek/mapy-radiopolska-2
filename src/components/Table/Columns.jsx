import React from "react";
import { TableHeaderColumn } from "react-bootstrap-table";

import {
  iconFormat,
  linkCellFormat,
  linkCellsProps,
} from "../../helpers/table";

export const idColumn = (
  <TableHeaderColumn isKey dataField="id_nadajnik" hidden>
    ID
  </TableHeaderColumn>
);

export const mastColumn = (
  <TableHeaderColumn
    dataField="obiekt"
    dataFormat={(cell, row) => linkCellFormat(cell, row, linkCellsProps.obiekt)}
  >
    Obiekt nadawczy
  </TableHeaderColumn>
);

export const startColumns = (
  <>
    {idColumn}
    <TableHeaderColumn dataField="logo" dataFormat={iconFormat}>
      Logotyp
    </TableHeaderColumn>
    <TableHeaderColumn
      dataField="mhz"
      dataFormat={(cell, row) =>
        linkCellFormat(cell, row, linkCellsProps.mHz, true)
      }
      filter={{ type: "TextFilter" }}
    >
      MHz
    </TableHeaderColumn>
  </>
);

export const endColumns = (
  <>
    {mastColumn}
    <TableHeaderColumn dataField="nwoj" filter={{ type: "TextFilter" }}>
      Woj.
    </TableHeaderColumn>
  </>
);
