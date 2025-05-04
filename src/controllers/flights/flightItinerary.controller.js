const { storeItinerarySchema } = require("../../models");
const {
  asyncHandler,
  handleError,
  ApiResponse,
  processLocations,
} = require("../../utils");

const storeItinerary = asyncHandler(async (req, res, next) => {
  try {
    const accessToken = req.amadeus_token.data.access_token;
    const { itinerary, platform, key, dictionaries, flightSearch } = req.body;

    const iataDetails = await processLocations(
      itinerary?.itineraries,
      accessToken
    );
    const saveItineary = new storeItinerarySchema({
      itinerary: itinerary,
      platform: platform,
      iataDetails: iataDetails,
      key,
      dictionaries,
      flightSearch,
    });

    const response = await saveItineary.save();

    return res
      .status(200)
      .json(new ApiResponse(200, response._id, "Itinerary save successfully"));
  } catch (error) {
    handleError(error, res, "Itinerary not save successfully", [
      {
        message: error.message,
      },
    ]);
  }
});

const retrieveItineraryById = asyncHandler(async (req, res, next) => {
  try {
    const { itineraryId } = req.params;
    const itinerary = await storeItinerarySchema.findById(itineraryId);

    if (!itinerary) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Itinerary not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, itinerary, "Itinerary retrieved successfully")
      );
  } catch (error) {
    handleError(error, res, "Failed to retrieve itinerary", [
      {
        message: error.message,
      },
    ]);
  }
});

module.exports = {
  storeItinerary,
  retrieveItineraryById,
};
