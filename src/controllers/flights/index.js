const { flightResult } = require("./flightResult.controller");
const { flightOfferPrice } = require("./flightOfferPrice.controller");
const { flightCreateOrder } = require("./flightCreateOrder.controller");
const {
  getAllBooking,
  getBookingByID,
} = require("./flightGetbooking.controller");
const {
  storeItinerary,
  retrieveItineraryById,
} = require("./flightItinerary.controller");

const exportFlight = {
  flightResult,
  flightOfferPrice,
  flightCreateOrder,
  getAllBooking,
  getBookingByID,
  storeItinerary,
  retrieveItineraryById,
};

module.exports = exportFlight;
