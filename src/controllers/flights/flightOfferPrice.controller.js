const redis = require("../../redis");
const FlightService = require("../../services/FlightService");
const {
  asyncHandler,
  ApiError,
  ApiResponse,
  updateCacheAfterDelete,
} = require("../../utils");

const flightOfferPrice = asyncHandler(async (req, res, next) => {
  const { flight } = req.body;
  const { key } = req.headers;

  try {
    const accessToken = req.amadeus_token.data.access_token;

    const flightOffersPrice = await FlightService.flightOfferPrice(
      {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-HTTP-Method-Override": "GET",
      },
      {
        data: {
          type: "flight-offers-pricing",
          flightOffers: [flight],
        },
      }
    );

    if (flightOffersPrice?.errors) {
      throw new ApiError(
        flightOffersPrice?.errors[0].status,
        flightOffersPrice?.errors[0].title
      );
    }

    let isUpdatedCacheData = false;
    if (
      flight.price.grandTotal !==
      flightOffersPrice?.data?.flightOffers[0]?.price?.grandTotal
    ) {
      await (await redis()).del([key]);
      const updatedCache = await updateCacheAfterDelete({
        origin: key.split(":")[1],
        destination: key.split(":")[2],
        departureDate: key.split(":")[3],
        returnDate: key.split(":")[4],
        adults: key.split(":")[5],
        children: key.split(":")[6],
        infants: key.split(":")[7],
        travelClass: key.split(":")[8],
        nonStop: key.split(":")[10],
        currencyCode: key.split(":")[9],
        accessToken,
      });

      if (updatedCache.success) {
        isUpdatedCacheData = true;
      }
    }

    const responseWithPriceChanged = {
      flightOffersPrice,
      isUpdatedCacheData,
      isFlightChanged:
        flight.price.grandTotal ===
        flightOffersPrice?.data?.flightOffers[0]?.price?.grandTotal
          ? false
          : true,
    };
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responseWithPriceChanged,
          flight.price.grandTotal ===
          flightOffersPrice?.data?.flightOffers[0]?.price?.grandTotal
            ? "Comapre Successfull"
            : "Price has been changed"
        )
      );
  } catch (error) {
    console.error("Error during flight price:", error);
    // res.status(500).json({ error: "Flight search failed" });
    throw new ApiError(500, "", error);
  }
});

module.exports = {
  flightOfferPrice,
};
