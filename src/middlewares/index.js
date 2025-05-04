const { amadeusAccessToken } = require("./amadeusAccessToken.middleware");
const { verifyJwt } = require("./auth.middleware");
const {
  flightOffersResultCache,
  airportSearchByKeywordResultCache,
} = require("./cache");
const upload = require("./multer.middleware");

const {
  validateFlightSearch,
  validateAirportSearch,
  validateUserLoginWithPhoneNumber,
  validateverifyOtpWithPhoneNumber,
  validateUserUpdateProfile,
  validateFlightCreateOrder,
  validateStoreFlightDetails,
} = require("./validations.middleware");

const exportMiddleware = {
  verifyJwt,
  amadeusAccessToken,
  validateFlightSearch,
  validateAirportSearch,
  flightOffersResultCache,
  airportSearchByKeywordResultCache,
  validateUserLoginWithPhoneNumber,
  validateverifyOtpWithPhoneNumber,
  validateUserUpdateProfile,
  validateFlightCreateOrder,
  validateStoreFlightDetails,
  upload,
};

module.exports = exportMiddleware;
