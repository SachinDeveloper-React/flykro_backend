const { ApiResponse, ApiError } = require("../../utils");
const asyncHandler = require("../../utils/asyncHandler");
const { User } = require("../../models");
const jsonwebtoken = require("jsonwebtoken");
const twilloAccountSid = process.env.TWILLO_ACCOUNT_SID;
const twilloAuthToken = process.env.TWILLO_AUTH_TOKEN;
const twilloServicesSid = process.env.TWILLO_SERVICES_SID;
const client = require("twilio")(twilloAccountSid, twilloAuthToken);

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(500, "Failed to generate access and refresh tokens");
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.params;
  try {
    const cleanedPhoneNumber = phoneNumber.replace(/-/g, "");
    const verification = await client.verify.v2
      .services(twilloServicesSid) // Replace with your actual Service SID
      .verifications.create({
        channel: "sms",
        to: cleanedPhoneNumber,
      });

    if (verification.status === "pending") {
      res.status(200).json(
        new ApiResponse(
          200,
          {
            to: verification.to,
            status: verification.status,
          },
          "OTP sent successfully"
        )
      );
    }
  } catch (error) {
    return res.status(500).json(
      new ApiError(500, error.message, "", [
        { error: error },
        {
          message: error.message,
        },
      ])
    );
    // throw new ApiError(500, "", error);
  }
});

const verifyOTP = asyncHandler(async (req, res, next) => {
  const { phoneNumber, otp } = req.body;
  try {
    const cleanedPhoneNumber = phoneNumber.replace(/-/g, "");

    const verificationCheck = await client.verify.v2
      .services(twilloServicesSid) // Replace with your actual Service SID
      .verificationChecks.create({
        code: otp,
        to: cleanedPhoneNumber,
      });

    if (verificationCheck.status === "approved") {
      const userIsExist = await User.findOne({ phoneNumber: phoneNumber });
      if (!userIsExist) {
        const userDetails = await User.create({
          phoneNumber,
        });

        const { accessToken, refreshToken } =
          await generateAccessAndRefereshTokens(userDetails._id);

        // console.log("userDetails", accessToken, refreshToken);
        const options = {
          httpOnly: true,
          secure: true,
        };
        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(
            new ApiResponse(
              200,
              {
                to: verificationCheck.to,
                status: verificationCheck.status,
                user: userDetails,
                accessToken,
                refreshToken,
                type: "Bearer",
              },
              "User logged in successfully"
            )
          );
      } else {
        // console.log(userIsExist);
        const { accessToken, refreshToken } =
          await generateAccessAndRefereshTokens(userIsExist._id);

        const options = {
          httpOnly: true,
          secure: true,
        };
        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(
            new ApiResponse(
              200,
              {
                to: verificationCheck.to,
                status: verificationCheck.status,
                user: userIsExist,
                accessToken,
                refreshToken,
                type: "Bearer",
              },
              "User logged in successfully"
            )
          );
      }
    } else {
      return res
        .status(400)
        .json(
          new ApiError(400, "Invalid OTP or verification failed", "", [{}])
        );
    }
  } catch (error) {
    return res.status(500).json(
      new ApiError(500, "Failed to verify OTP", "", [
        {
          message: error.message,
        },
      ])
    );
    // throw new ApiError(500, "Failed to verify OTP", error);
  }
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  try {
    const incomingrefreshtoken =
      req?.cookie.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!incomingrefreshtoken) {
      throw new ApiError(401, "Access denied, please login");
    }

    const decodedToken = jsonwebtoken.verify(
      incomingrefreshtoken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(403, "User not found");
    }

    if (user?.refreshToken !== incomingrefreshtoken) {
      throw new ApiError(403, "Invalid refresh token");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken, type: "Bearer" },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(500, error?.message, "Invalid Refresh Token");
  }
});

const currentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details fetched"));
});

module.exports = {
  loginUser,
  verifyOTP,
  refreshAccessToken,
  currentUser,
};
