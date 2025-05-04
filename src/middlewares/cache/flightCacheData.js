const redis = require("../../redis");
const { asyncHandler, ApiResponse } = require("../../utils");

const flightOffersResultCache = asyncHandler(async (req, res, next) => {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    travelClass,
    nonStop,
    currencyCode,
    tripType,
    isDomestic,
  } = req.query;
  const cacheKey = `flightOffers:${origin}:${destination}:${departureDate}:${
    returnDate || ""
  }:${adults}:${children || 0}:${infants || 0}:${travelClass || "Economy"}:${
    currencyCode || "USD"
  }:${nonStop}:${tripType}:${isDomestic}`;

  const cachedData = await (await redis()).get(cacheKey);

  if (cachedData) {
    // console.log("Serving from cache", cachedData);
    // return res.json(JSON.parse(cachedData));
    return res
      .status(200)
      .json(
        new ApiResponse(200, JSON.parse(cachedData), "Retrieve Successful")
      );
  }

  next();
});

module.exports = {
  flightOffersResultCache,
};
