const User = require("../models/user.model");
const flightOrderSchema = require("../models/FlightOrderSchema.model");
const Airport = require("./airportsDetails");
const storeItinerarySchema = require("./storeItinerarySchema.model");
module.exports = {
  User,
  flightOrderSchema,
  Airport,
  storeItinerarySchema,
};
