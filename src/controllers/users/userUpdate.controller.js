const { User } = require("../../models");
const {
  asyncHandler,
  ApiError,
  ApiResponse,
  uploadOnCloudinary,
} = require("../../utils");

const updateAccountDetails = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    avatar,
    address,
    birthday,
    gender,
    maritalStatus,
    pincode,
    state,
  } = req.body;

  const userDetailsBody = {
    name: name,
    email: email,
    ...(avatar && { avatar }),
    ...(address && { address }),
    ...(birthday && { birthday }),
    ...(gender && { gender }),
    ...(maritalStatus && { maritalStatus }),
    ...(pincode && { pincode }),
    ...(state && { state }),
  };

  // console.log(userDetailsBody);
  try {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: userDetailsBody,
      },
      {
        new: true,
      }
    ).select("-refreshToken");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Account details updated"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  try {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
      throw new ApiError(400, "Error uploading avatar to cloudinary");
    }

    const updateAvatar = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar: avatar.url,
        },
      },
      {
        new: true,
      }
    ).select("-refreshToken");

    return res
      .status(200)
      .json(
        new ApiResponse(200, updateAvatar, "Avatar image updated successfully")
      );
  } catch (error) {
    throw new ApiError(500, error);
  }
});
module.exports = {
  updateAccountDetails,
  updateUserAvatar,
};
