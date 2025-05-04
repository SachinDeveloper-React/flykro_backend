const { AirportService } = require("../../services");
const {
  asyncHandler,
  ApiError,
  ApiResponse,
  setAirportData,
} = require("../../utils");

const airportSearchbyKeyword = asyncHandler(async (req, res, next) => {
  try {
    const { subType, keyword } = req.query;
    const accessToken = req.amadeus_token.data.access_token;
    const searchAirport = await AirportService.findAirportByKeyword(
      {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-HTTP-Method-Override": "GET",
      },
      {
        subType,
        keyword,
      }
    );

    if (searchAirport?.errors) {
      throw new ApiError(
        searchAirport?.errors[0].status,
        searchAirport?.errors[0].title
      );
    }

    await setAirportData(keyword, searchAirport);

    return res
      .status(200)
      .json(new ApiResponse(200, searchAirport, "Airport fetch successfull"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "", error);
  }
});

const exportAirportSearchbyKeyword = {
  airportSearchbyKeyword,
};

module.exports = exportAirportSearchbyKeyword;
