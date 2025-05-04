const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  cityName: { type: String },
  cityCode: { type: String },
  countryName: { type: String },
  countryCode: { type: String },
  regionCode: { type: String },
});

const airportSchema = new mongoose.Schema({
  iataCode: { type: String, required: true },
  data: {
    iataCode: { type: String, required: true },
    name: { type: String },
    detailedName: { type: String },
    address: { type: addressSchema },
  },
});

const Airport = mongoose.model("AirportDetails", airportSchema);

module.exports = Airport;
