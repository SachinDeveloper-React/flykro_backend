const redis = require("../redis");
const FlightService = require("../services/FlightService");
const { buildFlightOffersUrl } = require("./paramsSet_In_Url");

async function updateCacheAfterDelete({
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
  accessToken,
}) {
  const cacheKey = `flightOffers:${origin}:${destination}:${departureDate}:${
    returnDate || ""
  }:${adults}:${children || 0}:${infants || 0}:${travelClass || "Economy"}:${
    currencyCode || "USD"
  }:${nonStop}`;

  //   departureDate YYYY/MM/DD
  try {
    const flightUrl = buildFlightOffersUrl({
      origin: origin,
      destination: destination,
      departureDate: departureDate,
      returnDate: returnDate,
      adults: adults,
      children: children,
      infants: infants,
      travelClass: travelClass,
      currencyCode: currencyCode,
      nonStop: nonStop,
      max: 20,
    });

    const flightOffers = await FlightService.flightOffer(
      {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      flightUrl.queryParams
    );

    if (flightOffers?.errors) {
      console.error("Error during flight search:", error);

      return {
        success: false,
        message: "Error during flight search:",
      };
    }
    await (
      await redis()
    ).set(cacheKey, JSON.stringify({ flightOffers, key: cacheKey }), {
      EX: 3600,
    });
    console.log("Data successfully cached in Redis.");
    return {
      success: true,
      message: "Data successfully cached in Redis.",
    };
  } catch (error) {
    console.error("Error updating cache:", error);
    // res.status(500).json({ error: "Flight search failed" });
    // throw new ApiError(500, "", error);
    return {
      success: false,
      message: "Error updating cache:",
    };
  }
}

module.exports = { updateCacheAfterDelete };
