const { string } = require("joi");
const { default: mongoose } = require("mongoose");

const amenitySchema = new mongoose.Schema(
  {
    description: { type: String },
    isChargeable: { type: Boolean },
    amenityType: { type: String },
    amenityProvider: {
      name: { type: String },
    },
  },
  { _id: false } // Prevent _id creation
);

const fareDetailsBySegmentSchema = new mongoose.Schema(
  {
    segmentId: { type: String, required: true },
    cabin: { type: String, required: true },
    fareBasis: { type: String, required: true },
    brandedFare: { type: String },
    brandedFareLabel: { type: String },
    class: { type: String, required: true },
    includedCheckedBags: {
      weight: { type: Number },
      weightUnit: { type: String },
      quantity: { type: Number },
    },
    amenities: [amenitySchema],
  },
  { _id: false } // Prevent _id creation
);

const travelerPricingSchema = new mongoose.Schema(
  {
    travelerId: { type: String, required: true },
    fareOption: { type: String, required: true },
    travelerType: { type: String, required: true },
    price: {
      currency: { type: String, required: true },
      total: { type: String, required: true },
      base: { type: String, required: true },
    },
    fareDetailsBySegment: [fareDetailsBySegmentSchema],
  },
  { _id: false } // Prevent _id creation
);

const segmentSchema = new mongoose.Schema(
  {
    departure: {
      iataCode: { type: String, required: true },
      terminal: { type: String },
      at: { type: String, required: true },
    },
    arrival: {
      iataCode: { type: String, required: true },
      at: { type: String, required: true },
    },
    carrierCode: { type: String, required: true },
    number: { type: String, required: true },
    aircraft: {
      code: { type: String, required: true },
    },
    operating: {
      carrierCode: { type: String, required: true },
    },
    duration: { type: String, required: true },
    id: { type: String, required: true },
    numberOfStops: { type: Number, required: true },
    blacklistedInEU: { type: Boolean, required: true },
  },
  { _id: false } // Prevent _id creation
);

const itinerarySchema = new mongoose.Schema(
  {
    duration: { type: String, required: true },
    segments: [segmentSchema],
  },
  { _id: false } // Prevent _id creation
);

const feeSchema = new mongoose.Schema(
  {
    amount: { type: String, required: true },
    type: { type: String, required: true },
  },
  { _id: false } // Prevent _id creation
);

const priceSchema = new mongoose.Schema(
  {
    currency: { type: String, required: true },
    total: { type: String, required: true },
    base: { type: String, required: true },
    fees: [feeSchema],
    grandTotal: { type: String, required: true },
  },
  { _id: false } // Prevent _id creation
);

const flightOfferSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    id: { type: String, required: true },
    source: { type: String, required: true },
    instantTicketingRequired: { type: Boolean, required: true },
    nonHomogeneous: { type: Boolean, required: true },
    oneWay: { type: Boolean, required: true },
    isUpsellOffer: { type: Boolean, required: true },
    lastTicketingDate: { type: String, required: true },
    lastTicketingDateTime: { type: String, required: true },
    numberOfBookableSeats: { type: Number, required: true },
    itineraries: [itinerarySchema],
    price: priceSchema,
    pricingOptions: {
      fareType: [{ type: String }],
      includedCheckedBagsOnly: { type: Boolean, required: true },
    },
    validatingAirlineCodes: [{ type: String }],
    travelerPricings: [travelerPricingSchema],
  },
  { _id: false } // Prevent _id creation
);

const addressSchema = new mongoose.Schema(
  {
    cityName: { type: String, required: true },
    cityCode: { type: String, required: true },
    countryName: { type: String, required: true },
    countryCode: { type: String, required: true },
    stateCode: { type: String, required: true },
    regionCode: { type: String, required: true },
  },
  { _id: false } // Prevent _id creation for subdocuments
);

const locationSchema = new mongoose.Schema(
  {
    iataCode: { type: String, required: true },
    name: { type: String, required: true },
    detailedName: { type: String, required: true },
    address: { type: addressSchema, required: true },
  },
  { _id: false } // Prevent _id creation for subdocuments
);

const travellerSchema = new mongoose.Schema(
  {
    adult: { type: Number, required: true },
    child: { type: Number, required: true },
    infant: { type: Number, required: true },
    class: {
      type: String,
      required: true,
      enum: ["ECONOMY", "BUSINESS", "FIRST"],
    },
  },
  { _id: false } // Prevent _id creation for subdocuments
);

const storeItinerarySchema = new mongoose.Schema(
  {
    itinerary: flightOfferSchema,
    platform: {
      type: String,
      require: true,
      enum: ["Mobile", "Web", "Tab"],
    },
    iataDetails: {
      type: Object,
      require: true,
    },
    key: {
      type: String,
      require: true,
    },
    dictionaries: {
      type: Object,
      require: true,
    },
    flightSearch: {
      tripType: { type: String, required: true, enum: ["oneWay", "roundTrip"] },
      from: { type: locationSchema, required: true },
      to: { type: locationSchema, required: true },
      isDomestic: { type: Boolean, required: true },
      departureDate: { type: String, required: true },
      returnDate: { type: String }, // Optional for one-way trips
      traveller: { type: travellerSchema, required: true },
    },
    expireAt: {
      type: Date,
      default: () => Date.now() + 24 * 60 * 60 * 1000, // Default expiration time (e.g., 24 hours)
      expires: 0, // TTL index: Automatically delete the document when the date is reached
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("storeItinerarys", storeItinerarySchema);
