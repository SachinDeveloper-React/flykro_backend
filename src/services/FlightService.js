const ApiService = require("../utils/ApiService");
const { apiBaseUrl } = require("../config");

const api = new ApiService(apiBaseUrl);

const FlightService = {
  async flightOffer(headers, params) {
    return await api.get("/v2/shopping/flight-offers", headers, params);
  },

  async flightOfferPrice(headers, body) {
    return await api.post("/v1/shopping/flight-offers/pricing", headers, body);
  },

  async flightCreateOrder(headers, body) {
    return await api.post("/v1/booking/flight-orders", headers, body);
  },
};

module.exports = FlightService;
