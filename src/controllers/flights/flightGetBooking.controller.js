const { flightOrderSchema } = require("../../models");
const {
  asyncHandler,
  ApiError,
  ApiResponse,
  handleError,
} = require("../../utils");

const getAllBooking = asyncHandler(async (req, res, next) => {
  try {
    const result = await flightOrderSchema
      .find({
        owner: req.user._id,
      })
      .sort({ createdAt: -1 });

    if (!Array.isArray(result) || result.length <= 0) {
      return res.status(404).json(
        new ApiError(404, "Orders not found", "", [
          {
            message: "Orders not found",
          },
        ])
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Find Successfully"));
  } catch (error) {
    handleError(error, res, "Booking Not found", error);
  }
});

const getBookingByID = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await flightOrderSchema.findOne({
      $and: [
        {
          orderId: id,
        },
        {
          owner: req.user?._id,
        },
      ],
    });

    if (!result) {
      return res.status(404).json(
        new ApiError(404, "Order not found", "", [
          { with_id: id },
          {
            message: "Error fetching booking by ID",
          },
        ])
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Find Successfully"));
  } catch (error) {
    handleError(error, res, "Error fetching booking by ID", [
      {
        message: error.message,
      },
    ]);
  }
});

module.exports = {
  getAllBooking,
  getBookingByID,
};
