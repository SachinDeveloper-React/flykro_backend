const Joi = require("joi");

// Address Schema
const addressSchema = Joi.object({
  cityCode: Joi.string().required(),
  cityName: Joi.string().required(),
  countryCode: Joi.string().required(),
  countryName: Joi.string().required(),
  regionCode: Joi.string().required(),
  stateCode: Joi.string().required(),
});

// Location Schema
const locationSchema = Joi.object({
  iataCode: Joi.string().required(),
  name: Joi.string().required(),
  detailedName: Joi.string().required(),
  address: addressSchema.required(),
});

// Segment Schema
const segmentSchema = Joi.object({
  departure: Joi.object({
    iataCode: Joi.string().required(),
    terminal: Joi.string().optional(),
    at: Joi.string().isoDate().required(),
  }).required(),
  arrival: Joi.object({
    iataCode: Joi.string().required(),
    terminal: Joi.string().optional(),
    at: Joi.string().isoDate().required(),
  }).required(),
  carrierCode: Joi.string().required(),
  number: Joi.string().required(),
  aircraft: Joi.object({
    code: Joi.string().required(),
  }).required(),
  operating: Joi.object({
    carrierCode: Joi.string().required(),
  }).required(),
  duration: Joi.string().required(),
  id: Joi.string().required(),
  numberOfStops: Joi.number().integer().min(0).required(),
  blacklistedInEU: Joi.boolean().required(),
});

// Itinerary Schema
const itinerarySchema = Joi.object({
  duration: Joi.string().required(),
  segments: Joi.array().items(segmentSchema).min(1).required(),
});

// Fees Schema
const feeSchema = Joi.object({
  amount: Joi.string().required(),
  type: Joi.string().required(),
});

// Price Schema
const priceSchema = Joi.object({
  currency: Joi.string().required(),
  total: Joi.string().required(),
  base: Joi.string().required(),
  fees: Joi.array().items(feeSchema).optional(),
  grandTotal: Joi.string().optional(),
});

// Amenity Schema
const amenitySchema = Joi.object({
  description: Joi.string().required(),
  isChargeable: Joi.boolean().required(),
  amenityType: Joi.string().required(),
  amenityProvider: Joi.object({
    name: Joi.string().required(),
  }).required(),
});

// Fare Details Schema
const fareDetailsSchema = Joi.object({
  segmentId: Joi.string().required(),
  cabin: Joi.string().required(),
  fareBasis: Joi.string().required(),
  brandedFare: Joi.string().optional(),
  brandedFareLabel: Joi.string().optional(),
  class: Joi.string().required(),
  includedCheckedBags: Joi.object({
    weight: Joi.number().integer().min(0).optional(),
    weightUnit: Joi.string().valid("KG", "LB").optional(),
    quantity: Joi.number().integer().min(0).optional(),
  }).optional(),
  amenities: Joi.array().items(amenitySchema).optional(),
});

// Traveler Pricing Schema
const travelerPricingSchema = Joi.object({
  travelerId: Joi.string().required(),
  fareOption: Joi.string().required(),
  travelerType: Joi.string().valid("ADULT", "CHILD", "INFANT").required(),
  price: priceSchema.required(),
  fareDetailsBySegment: Joi.array().items(fareDetailsSchema).min(1).required(),
});

// Itinerary Root Schema
const itineraryRootSchema = Joi.object({
  type: Joi.string().required(),
  id: Joi.string().required(),
  source: Joi.string().required(),
  instantTicketingRequired: Joi.boolean().required(),
  nonHomogeneous: Joi.boolean().required(),
  oneWay: Joi.boolean().required(),
  isUpsellOffer: Joi.boolean().required(),
  lastTicketingDate: Joi.string().isoDate().required(),
  lastTicketingDateTime: Joi.string().isoDate().required(),
  numberOfBookableSeats: Joi.number().integer().min(1).required(),
  itineraries: Joi.array().items(itinerarySchema).min(1).required(),
  price: priceSchema.required(),
  pricingOptions: Joi.object({
    fareType: Joi.array().items(Joi.string()).required(),
    includedCheckedBagsOnly: Joi.boolean().required(),
  }).required(),
  validatingAirlineCodes: Joi.array().items(Joi.string()).min(1).required(),
  travelerPricings: Joi.array().items(travelerPricingSchema).min(1).required(),
});

// Dictionaries Schema
const dictionariesSchema = Joi.object({
  locations: Joi.object()
    .pattern(
      Joi.string(),
      Joi.object({
        cityCode: Joi.string().required(),
        countryCode: Joi.string().required(),
      })
    )
    .required(),
  aircraft: Joi.object().pattern(Joi.string(), Joi.string()).required(),
  currencies: Joi.object().pattern(Joi.string(), Joi.string()).required(),
  carriers: Joi.object().pattern(Joi.string(), Joi.string()).required(),
});

// Flight Search Schema
const flightSearchSchema = Joi.object({
  departureDate: Joi.string().isoDate().required(),
  from: locationSchema.required(),
  isDomestic: Joi.boolean().required(),
  returnDate: Joi.string().isoDate().optional(),
  to: locationSchema.required(),
  traveller: Joi.object({
    adult: Joi.number().integer().min(0).required(),
    child: Joi.number().integer().min(0).required(),
    infant: Joi.number().integer().min(0).required(),
    class: Joi.string().valid("ECONOMY", "BUSINESS", "FIRST").required(),
  }).required(),
  tripType: Joi.string().valid("oneWay", "roundTrip").required(),
});

// Root Schema
const storeFlightDetailsValidationSchema = Joi.object({
  itinerary: itineraryRootSchema.required(),
  platform: Joi.string().valid("Mobile", "Web").required(),
  key: Joi.string().required(),
  dictionaries: dictionariesSchema.required(),
  flightSearch: flightSearchSchema.required(),
});

module.exports = {
  storeFlightDetailsValidationSchema,
};
