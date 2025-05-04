const express = require("express");
const { storeItinerary, retrieveItineraryById } = require("../controllers");
const {
  amadeusAccessToken,
  validateStoreFlightDetails,
} = require("../middlewares");
const router = express.Router();

router
  .route("/store/itinerary")
  .post(amadeusAccessToken, validateStoreFlightDetails, storeItinerary);
router.route("/retrive/itinerary/:itineraryId").get(retrieveItineraryById);

module.exports = router;
