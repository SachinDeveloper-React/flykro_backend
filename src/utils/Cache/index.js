const { getAirportData, setAirportData } = require("./airportData");

const exportCache = {
  setAirportData,
  getAirportData,
};

module.exports = exportCache;
