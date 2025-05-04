const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Co2EmissionSchema = new mongoose.Schema({
  weight: { type: Number, required: true },
  weightUnit: { type: String, required: true },
  cabin: { type: String, required: true },
});

const SegmentSchema = new mongoose.Schema({
  departure: {
    iataCode: { type: String, required: true },
    at: { type: Date, required: true },
  },
  arrival: {
    iataCode: { type: String, required: true },
    at: { type: Date, required: true },
  },
  carrierCode: { type: String, required: true },
  number: { type: String, required: true },
  aircraft: {
    code: { type: String, required: true },
  },
  duration: { type: String, required: true },
  id: { type: String, required: true },
  numberOfStops: { type: Number, required: true },
  co2Emissions: [Co2EmissionSchema],
});

const ItinerarySchema = new mongoose.Schema({
  segments: [SegmentSchema],
});

const FeeSchema = new mongoose.Schema({
  amount: { type: String, required: true },
  type: { type: String, required: true },
});

const TravelerPricingSchema = new mongoose.Schema({
  travelerId: { type: String, required: true },
  fareOption: { type: String, required: true },
  travelerType: { type: String, required: true },
  price: {
    currency: { type: String, required: true },
    total: { type: String, required: true },
    base: { type: String, required: true },
    taxes: [
      {
        amount: { type: String, required: true },
        code: { type: String, required: true },
      },
    ],
    refundableTaxes: { type: String, required: true },
  },
  fareDetailsBySegment: [
    {
      segmentId: { type: String, required: true },
      cabin: { type: String, required: true },
      fareBasis: { type: String, required: true },
      class: { type: String, required: true },
      includedCheckedBags: {
        quantity: { type: Number, required: true },
      },
    },
  ],
});

const FlightOfferSchema = new mongoose.Schema({
  type: { type: String, required: true },
  id: { type: String, required: true },
  source: { type: String, required: true },
  nonHomogeneous: { type: Boolean, required: true },
  lastTicketingDate: { type: String, required: true },
  itineraries: [ItinerarySchema],
  price: {
    currency: { type: String, required: true },
    total: { type: String, required: true },
    base: { type: String, required: true },
    fees: [FeeSchema],
    grandTotal: { type: String, required: true },
    billingCurrency: { type: String, required: true },
  },
  pricingOptions: {
    fareType: [{ type: String, required: true }],
    includedCheckedBagsOnly: { type: Boolean, required: true },
  },
  validatingAirlineCodes: [{ type: String, required: true }],
  travelerPricings: [TravelerPricingSchema],
});

const TravelerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  documents: [
    {
      number: { type: String, required: true },
      issuanceDate: { type: Date, required: true },
      expiryDate: { type: Date, required: true },
      issuanceCountry: { type: String, required: true },
      issuanceLocation: { type: String, required: true },
      nationality: { type: String, required: true },
      birthPlace: { type: String, required: true },
      documentType: { type: String, required: true },
      holder: { type: Boolean, required: true },
    },
  ],
  contact: {
    purpose: { type: String, required: true },
    phones: [
      {
        deviceType: { type: String, required: true },
        countryCallingCode: { type: String, required: true },
        number: { type: String, required: true },
      },
    ],
    emailAddress: { type: String, required: true },
  },
});

const AssociatedRecordSchema = new mongoose.Schema({
  reference: { type: String, required: true },
  creationDate: { type: Date, required: true },
  originSystemCode: { type: String, required: true },
  flightOfferId: { type: String, required: true },
});

const ContactSchema = new mongoose.Schema({
  addresseeName: {
    firstName: { type: String, required: true },
  },
  address: {
    lines: [{ type: String, required: true }],
    postalCode: { type: String, required: true },
    countryCode: { type: String, required: true },
    cityName: { type: String, required: true },
  },
  purpose: { type: String, required: true },
  phones: [
    {
      deviceType: { type: String, required: true },
      countryCallingCode: { type: String, required: true },
      number: { type: String, required: true },
    },
  ],
  companyName: { type: String, required: true },
  emailAddress: { type: String, required: true },
});

const FlightOrderSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderId: {
      type: Number,
      unique: true,
    },
    createOrderByUser: {
      type: { type: String, required: true },
      id: { type: String, required: true },
      queuingOfficeId: { type: String, required: true },
      associatedRecords: [AssociatedRecordSchema],
      flightOffers: [FlightOfferSchema],
      travelers: [TravelerSchema],
      remarks: {
        general: [
          {
            subType: { type: String, required: true },
            text: { type: String, required: true },
          },
        ],
      },
      ticketingAgreement: {
        option: { type: String, required: true },
        delay: { type: String, required: true },
      },
      automatedProcess: [
        {
          code: { type: String, required: true },
          queue: {
            number: { type: String, required: true },
            category: { type: String, required: true },
          },
          officeId: { type: String, required: true },
        },
      ],
      contacts: [ContactSchema],
    },
    dictionaries: {
      type: Object,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

FlightOrderSchema.plugin(AutoIncrement, { inc_field: "orderId" });

module.exports = mongoose.model("FlightOrder", FlightOrderSchema);
