import { parseCommaNumber } from "./map";

export const getDeviation = (from, to) => {
  let deviation = null;

  if (from && from.mhz && to.mhz) {
    deviation =
      Math.round(
        Math.abs(parseCommaNumber(from.mhz) - parseCommaNumber(to.mhz)) * 10
      ) / 10;
  }

  return deviation;
};
