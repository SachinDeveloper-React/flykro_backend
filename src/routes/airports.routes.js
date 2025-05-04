// airportSearchbyKeyword
const express = require("express");
const { airportSearchbyKeyword } = require("../controllers");
const {
  validateAirportSearch,
  amadeusAccessToken,
  airportSearchByKeywordResultCache,
} = require("../middlewares");

const router = express.Router();

router
  .route("/airport/autosuggest")
  .get(
    validateAirportSearch,
    airportSearchByKeywordResultCache,
    amadeusAccessToken,
    airportSearchbyKeyword
  );

module.exports = router;
