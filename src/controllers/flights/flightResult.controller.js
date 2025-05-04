const {
  asyncHandler,
  ApiResponse,
  ApiError,
  buildFlightOffersUrl,
  handleError,
} = require("../../utils");
const redis = require("../../redis");
const FlightService = require("../../services/FlightService");

const fetchFlightResult = async (flightUrl, accessToken) => {
  return await FlightService.flightOffer(
    {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    flightUrl.queryParams
  );
};

const cacheFlightResult = async (cacheKey, data) => {
  await (await redis()).set(cacheKey, JSON.stringify(data), { EX: 3600 });
};

const flightResult = asyncHandler(async (req, res) => {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    children = 0,
    infants = 0,
    travelClass = "Economy",
    nonStop,
    currencyCode = "USD",
    tripType,
    isDomestic,
  } = req.query;

  const cacheKey = `flightOffers:${origin}:${destination}:${departureDate}:${
    returnDate || ""
  }:${adults}:${children}:${infants}:${travelClass}:${currencyCode}:${nonStop}:${tripType}:${isDomestic}`;

  try {
    const accessToken = req.amadeus_token.data.access_token;

    if (tripType === "roundTrip" && ["true", true].includes(isDomestic)) {
      const departFlightUrl = buildFlightOffersUrl({
        origin,
        destination,
        departureDate,
        returnDate: "",
        adults,
        children,
        infants,
        travelClass,
        currencyCode,
        nonStop,
        max: 20,
      });

      const returnFlightUrl = buildFlightOffersUrl({
        origin: destination,
        destination: origin,
        departureDate: returnDate,
        returnDate: "",
        adults,
        children,
        infants,
        travelClass,
        currencyCode,
        nonStop,
        max: 20,
      });

      const [departure, returnFlight] = await Promise.all([
        fetchFlightResult(departFlightUrl, accessToken),
        fetchFlightResult(returnFlightUrl, accessToken),
      ]);

      const responseData = {
        isDomestic,
        tripType,
        departure,
        return: returnFlight,
        key: cacheKey,
      };
      await cacheFlightResult(cacheKey, responseData);

      return res
        .status(200)
        .json(new ApiResponse(200, responseData, "Retrieve Successful"));
    }

    const flightUrl = buildFlightOffersUrl({
      origin,
      destination,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      travelClass,
      currencyCode,
      nonStop,
      max: 20,
    });

    const flightOffers = await fetchFlightResult(flightUrl, accessToken);

    if (flightOffers?.errors) {
      throw new ApiError(
        flightOffers.errors[0].status,
        flightOffers.errors[0].title
      );
    }

    const responseData = {
      isDomestic,
      tripType,
      departure: flightOffers,
      key: cacheKey,
    };
    await cacheFlightResult(cacheKey, responseData);

    return res
      .status(200)
      .json(new ApiResponse(200, responseData, "Retrieve Successful"));
  } catch (error) {
    handleError(error, res, error.message, [{ message: error.message }]);
  }
});

module.exports = { flightResult };
