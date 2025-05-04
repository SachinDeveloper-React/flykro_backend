const { apiBaseUrl } = require("../config");
const ApiService = require("../utils/ApiService");

const api = new ApiService(apiBaseUrl);

const AirportService = {
  async findAirportByKeyword(headers, params) {
    return await api.get("/v1/reference-data/locations", headers, params);
  },
};

module.exports = AirportService;
