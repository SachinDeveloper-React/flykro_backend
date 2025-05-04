const { default: axios } = require("axios");
const { ApiError, asyncHandler, handleError } = require("../utils");
const redis = require("../redis");

const amadeusAccessToken = asyncHandler(async (req, res, next) => {
  try {
    const tokenResponse = await axios.post(
      `${process.env.AMADEUS_URL}/security/oauth2/token`,
      `grant_type=client_credentials&client_id=${process.env.AMADEUS_CLIENT_ID}&client_secret=${process.env.AMADEUS_CLIENT_SECRET}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    req.amadeus_token = tokenResponse;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token", error?.message);
    // handleError(error, res, error.message, [
    //   {
    //     message: 'Invalid access token"',
    //   },
    // ]);
  }
});

const amadeusAuthMiddleware = {
  amadeusAccessToken,
};

module.exports = amadeusAuthMiddleware;
