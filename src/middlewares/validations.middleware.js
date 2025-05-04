const {
  flightSearchSchema,
  ApiError,
  airportSearchSchema,
  userLoginWithPhoneNumberSchema,
  userVerifyOTPSchema,
  userDetailsSchema,
  flightCreateOrderSchema,
  storeFlightDetailsValidationSchema,
} = require("../utils");

const validateFlightSearch = (req, res, next) => {
  const { error } = flightSearchSchema.validate(req.query, {
    abortEarly: false,
  });

  if (error) {
    // Map Joi errors to a more readable format
    const errorMessages = error.details.map((detail) => detail.message);
    throw new ApiError(400, "", errorMessages);
    // return res.status(400).json({ errors: errorMessages });
  }

  next(); // Continue to the route handler if validation passes
};

const validateAirportSearch = (req, res, next) => {
  const { error } = airportSearchSchema.validate(req.query, {
    abortEarly: false,
  });

  if (error) {
    // Map Joi errors to a more readable format
    const errorMessages = error.details.map((detail) => detail.message);
    throw new ApiError(400, "", errorMessages);
    // return res.status(400).json({ errors: errorMessages });
  }

  next();
};

const validateUserLoginWithPhoneNumber = (req, res, next) => {
  const { error } = userLoginWithPhoneNumberSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error) {
    // Map Joi errors to a more readable format
    const errorMessages = error.details.map((detail) => detail.message);
    // throw new ApiError(400, "", errorMessages);
    return res.status(500).json(
      new ApiError(500, error.message, "", [
        { error: error },
        {
          message: errorMessages,
        },
      ])
    );
    // return res.status(400).json({ errors: errorMessages });
  }

  next();
};
const validateverifyOtpWithPhoneNumber = (req, res, next) => {
  const { error } = userVerifyOTPSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    // Map Joi errors to a more readable format
    const errorMessages = error.details.map((detail) => detail.message);
    throw new ApiError(400, "", errorMessages);
    // return res.status(400).json({ errors: errorMessages });
  }

  next();
};

const validateUserUpdateProfile = (req, res, next) => {
  const { error } = userDetailsSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new ApiError(400, "", errorMessages);
  }

  next();
};
const validateFlightCreateOrder = (req, res, next) => {
  const { error } = flightCreateOrderSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new ApiError(400, "", errorMessages);
  }

  next();
};

const validateStoreFlightDetails = (req, res, next) => {
  const { error } = storeFlightDetailsValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new ApiError(400, "", errorMessages);
  }

  next();
};

const validationsMiddleware = {
  validateFlightSearch,
  validateAirportSearch,
  validateUserLoginWithPhoneNumber,
  validateverifyOtpWithPhoneNumber,
  validateUserUpdateProfile,
  validateFlightCreateOrder,
  validateStoreFlightDetails,
};

module.exports = validationsMiddleware;
