const ApiError = require("./ApiError");

function handleError(error, res, customMessage = "An error occurred", errors) {
  // Classify known errors
  if (error.name === "ValidationError") {
    return res
      .status(400)
      .json(new ApiError(400, "Validation Error", "", error.errors));
  } else if (error.name === "CastError") {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid ID format", "", error.message));
  } else if (error.code === 11000) {
    return res
      .status(409)
      .json(new ApiError(409, "Duplicate key error", "", error.keyValue));
  }

  // Fallback for unknown errors
  res
    .status(500)
    .json(
      new ApiError(500, customMessage || "Internal Server Error", "", errors)
    );
}

module.exports = {
  handleError,
};
