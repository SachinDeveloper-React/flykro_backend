const AirportService = require("./AirportService");
const AuthService = require("./AuthService");
const FlightService = require("./FlightService");

const exportService = {
  AirportService,
  AuthService,
  FlightService,
};

module.exports = exportService;
