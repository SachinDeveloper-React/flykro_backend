const { User } = require("../models");
const { asyncHandler, ApiError } = require("../utils");
const jsonwebtoken = require("jsonwebtoken");

const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Access denied, please login");
    }

    const decodedToken = await jsonwebtoken.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id).select("-refreshToken");

    if (!user) {
      throw new ApiError(401, "Access denied, please login");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message);
  }
});

const authMiddleware = {
  verifyJwt,
};

module.exports = authMiddleware;
