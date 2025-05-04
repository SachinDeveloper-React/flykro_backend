const express = require("express");
const {
  flightResult,
  flightOfferPrice,
  flightCreateOrder,
  getAllBooking,
  getBookingByID,
} = require("../controllers");
const {
  amadeusAccessToken,
  validateFlightSearch,
  flightOffersResultCache,
  verifyJwt,
  validateFlightCreateOrder,
} = require("../middlewares");

const router = express.Router();

// Flight Sen
router
  .route("/search-flights")
  .get(
    validateFlightSearch,
    flightOffersResultCache,
    amadeusAccessToken,
    flightResult
  );
router.route("/check-flights-price").post(amadeusAccessToken, flightOfferPrice);
router
  .route("/flight-orders")
  .post(
    verifyJwt,
    validateFlightCreateOrder,
    amadeusAccessToken,
    flightCreateOrder
  );

// Find Booking

router.route("/flight-booking-by-user").get(verifyJwt, getAllBooking);
router.route("/flight-booking-by-id/:id").get(verifyJwt, getBookingByID);

module.exports = router;
