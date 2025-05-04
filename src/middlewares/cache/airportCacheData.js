const redis = require("../../redis");
const { asyncHandler, ApiResponse } = require("../../utils");

const airportSearchByKeywordResultCache = asyncHandler(
  async (req, res, next) => {
    const { subType, keyword } = req.query;
    const cacheKey = `airports:${keyword}`;

    const cachedData = await (await redis()).get(cacheKey);

    if (cachedData) {
      // console.log("Serving from cache", cachedData);
      return res.json(
        new ApiResponse(
          200,
          JSON.parse(cachedData),
          "Airport fetch successfull"
        )
      );
    }

    next();
  }
);

module.exports = {
  airportSearchByKeywordResultCache,
};
