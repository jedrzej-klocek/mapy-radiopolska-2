import React, { Component } from 'react';

const { REACT_APP_PROD_LIST_URL } = process.env;

export default class MarkerPopup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { element } = this.props;
    return (
      <>
        {element.skrot}
        <a
          target="_blank"
          href={`${REACT_APP_PROD_LIST_URL}/obiekt/${element.id_obiekt}`}
        >
          {` ${element.obiekt}`}
        </a>
        <br />
        {this.props.system === 'fm' ? (
          <>
            <b>{element.program}</b>
            <br />
          </>
        ) : (
          <>
            <b>{element.multipleks}</b>
            <br />
          </>
        )}
        Częstotliwość: {element.mhz} MHz {element.kategoria}
        <br />
        {this.props.system === 'fm' ? `PI: ${element.pi}` : ''}
        {` ERP: ${element.erp}kW Pol: ${element.polaryzacja}`}
        <br />
        {`Wys. podst. masztu: ${element.wys_npm}m n.p.m`}
        <br />
        {`Wys. umieszcz. nadajnika: ${element.antena_npt}m n.p.t`}
        <br />
        <span>Sprawdź interferencje:</span>
        <br />
        <input
          id={`freq_0_${element.id_nadajnik}`}
          type="checkbox"
          name="freq_0"
          onChange={(e) => {
            console.log(`Clicknięto ${e.target.name} checkbox`);
          }}
        />
        <label htmlFor={`freq_0_${element.id_nadajnik}`}>
          Na tej samej częstotliwości
        </label>
        <br />
        <input
          id={`freq_01_${element.id_nadajnik}`}
          type="checkbox"
          name="freq_1"
          onChange={(e) => {
            console.log(`Clicknięto ${e.target.name} checkbox`);
          }}
        />
        <label htmlFor={`freq_01_${element.id_nadajnik}`}>+/- 0.1 MHz</label>
        <br />
        <input
          id={`freq_01_${element.id_nadajnik}`}
          type="checkbox"
          name="freq_2"
          onChange={(e) => {
            console.log(`Clicknięto ${e.target.name} checkbox`);
          }}
        />
        <label htmlFor={`freq_02_${element.id_nadajnik}`}>+/- 0.2 MHz</label>
        <br />
        <input
          id={`freq_01_${element.id_nadajnik}`}
          type="checkbox"
          name="freq_3"
          onChange={(e) => {
            console.log(`Clicknięto ${e.target.name} checkbox`);
          }}
        />
        <label htmlFor={`freq_03_${element.id_nadajnik}`}>+/- 0.3 MHz</label>
        <br />
        <input
          id={`freq_04_${element.id_nadajnik}`}
          type="checkbox"
          name="freq_4"
          onChange={(e) => {
            console.log(`Clicknięto ${e.target.name} checkbox`);
          }}
        />
        <label htmlFor={`freq_04_${element.id_nadajnik}`}>+/- 0.4 MHz</label>
      </>
    );
  }
}
