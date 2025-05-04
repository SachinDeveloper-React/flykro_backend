const express = require("express");
const {
  loginUser,
  verifyOTP,
  refreshAccessToken,
  updateAccountDetails,
  updateUserAvatar,
  currentUser,
} = require("../controllers");
const {
  validateUserLoginWithPhoneNumber,
  validateverifyOtpWithPhoneNumber,
  validateUserUpdateProfile,
  verifyJwt,
  upload,
} = require("../middlewares");

const router = express.Router();

router
  .route("/login/:phoneNumber")
  .get(validateUserLoginWithPhoneNumber, loginUser);
router.route("/verify-otp").post(validateverifyOtpWithPhoneNumber, verifyOTP);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-user").get(verifyJwt, currentUser);
// Update Profile

router
  .route("/update-details")
  .patch(validateUserUpdateProfile, verifyJwt, updateAccountDetails);
router
  .route("/update-avatar")
  .post(verifyJwt, upload.single("avatar"), updateUserAvatar);
module.exports = router;
