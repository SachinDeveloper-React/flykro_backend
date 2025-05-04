const Joi = require("joi");

const flightSearchSchema = Joi.object({
  origin: Joi.string()
    .length(3)
    .uppercase()
    .required()
    .label("Origin IATA Code"),
  destination: Joi.string()
    .length(3)
    .uppercase()
    .required()
    .label("Destination IATA Code"),
  departureDate: Joi.date().iso().required().label("Departure Date"),
  returnDate: Joi.date()
    .iso()
    .greater(Joi.ref("departureDate"))
    .optional()
    .label("Return Date"),
  adults: Joi.number().integer().min(1).required().label("Number of Adults"),
  children: Joi.number().integer().default(0).label("Number of Children"),
  infants: Joi.number().integer().default(0).label("Number of Infant"),
  travelClass: Joi.string()
    .valid("ECONOMY", "BUSINESS", "PREMIUM ECONOMY", "FIRST")
    .default("ECONOMY")
    .label("Travel Class"),
  nonStop: Joi.boolean().default(false).label("Non Stop"),
  currencyCode: Joi.string()
    .length(3)
    .uppercase()
    .pattern(/^[A-Z]{3}$/)
    .default("EUR")
    .label("Currency Code"),
  tripType: Joi.string()
    .valid("oneWay", "roundTrip", "multiCity")
    .default("oneWay")
    .label("Trip Type"),
  isDomestic: Joi.boolean().default(false).label("isDomestic"),
});

const airportSearchSchema = Joi.object({
  subType: Joi.string()
    .valid("AIRPORT", "CITY", "AIRPORT,CITY")
    .default("AIRPORT")
    .label("Subtype is missing"),
  keyword: Joi.string().required().label("keyword"),
});

const userLoginWithPhoneNumberSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^\+\d{1,3}-\d{10}$/)
    .required(),
});
const userVerifyOTPSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^\+\d{1,3}-\d{10}$/)
    .required()
    .label("Phone Number"),
  otp: Joi.number().required().label("OTP"),
});

const userDetailsSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Name cannot be empty.",
    "string.min": "Name must have at least 2 characters.",
    "string.max": "Name must not exceed 50 characters.",
    "any.required": "Name is required.",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),

  avatar: Joi.string().uri().optional().messages({
    "string.uri": "Avatar must be a valid URL.",
  }),

  address: Joi.string().max(255).optional().messages({
    "string.max": "Address must not exceed 255 characters.",
  }),

  birthday: Joi.date().iso().optional().messages({
    "date.base": "Birthday must be a valid date.",
    "date.iso": "Birthday must be in ISO format (YYYY-MM-DD).",
  }),

  gender: Joi.string().valid("Male", "Female", "Other").optional().messages({
    "any.only": "Gender must be one of Male, Female, or Other.",
  }),

  maritalStatus: Joi.string()
    .valid("Single", "Married", "Divorced", "Widowed")
    .optional()
    .messages({
      "any.only":
        "Marital Status must be one of Single, Married, Divorced, or Widowed.",
    }),

  pincode: Joi.string()
    .pattern(/^\d{6}$/)
    .optional()
    .messages({
      "string.pattern.base": "Pincode must be a 6-digit number.",
    }),

  state: Joi.string().min(2).max(50).optional().messages({
    "string.min": "State must have at least 2 characters.",
    "string.max": "State must not exceed 50 characters.",
  }),
});

const flightCreateOrderSchema = Joi.object({
  flight: Joi.object().required(),
  travelers: Joi.array().items(
    Joi.object({
      id: Joi.string().required(), // ID must be a string and is required
      dateOfBirth: Joi.string().isoDate().required(), // Valid ISO date (e.g., "1982-01-16") and required
      gender: Joi.string().valid("MALE", "FEMALE", "OTHER").required(), // Must be one of the specified values
      name: Joi.object({
        firstName: Joi.string().required(), // First name is required
        lastName: Joi.string().required(), // Last name is required
      }).required(), // Name object is required
      contact: Joi.object({
        emailAddress: Joi.string().email().required(), // Must be a valid email address
        phones: Joi.array()
          .items(
            Joi.object({
              deviceType: Joi.string().valid("MOBILE", "LANDLINE").required(), // Must be either MOBILE or LANDLINE
              countryCallingCode: Joi.string().pattern(/^\d+$/).required(), // Numeric string
              number: Joi.string().pattern(/^\d+$/).required(), // Numeric string
            })
          )
          .required(), // Phones array is required
      }).required(), // Contact object is required
      documents: Joi.array()
        .items(
          Joi.object({
            documentType: Joi.string()
              .valid("PASSPORT", "ID_CARD", "OTHER")
              .required(), // Valid document types
            birthPlace: Joi.string().required(), // Birth place is required
            issuanceLocation: Joi.string().required(), // Issuance location is required
            issuanceDate: Joi.string().isoDate().required(), // Must be a valid ISO date
            number: Joi.string().required(), // Document number is required
            expiryDate: Joi.string().isoDate().required(), // Must be a valid ISO date
            issuanceCountry: Joi.string().length(2).required(), // 2-character country code
            validityCountry: Joi.string().length(2).required(), // 2-character country code
            nationality: Joi.string().length(2).required(), // 2-character nationality code
            holder: Joi.boolean().required(), // Boolean value indicating if the person is the holder
          })
        )
        .optional(), // Documents array is optional
    })
  ),
});

module.exports = {
  flightSearchSchema,
  airportSearchSchema,
  userLoginWithPhoneNumberSchema,
  userVerifyOTPSchema,
  userDetailsSchema,
  flightCreateOrderSchema,
};
