const {
  flightResult,
  flightOfferPrice,
  flightCreateOrder,
  getAllBooking,
  getBookingByID,
  storeItinerary,
  retrieveItineraryById,
} = require("./flights");
const { airportSearchbyKeyword } = require("./airports");
const {
  loginUser,
  verifyOTP,
  refreshAccessToken,
  updateAccountDetails,
  updateUserAvatar,
  currentUser,
} = require("./users");

const exportsControllers = {
  flightResult,
  flightOfferPrice,
  airportSearchbyKeyword,
  loginUser,
  verifyOTP,
  refreshAccessToken,
  updateAccountDetails,
  updateUserAvatar,
  currentUser,
  flightCreateOrder,
  getAllBooking,
  getBookingByID,
  storeItinerary,
  retrieveItineraryById,
};

module.exports = exportsControllers;
