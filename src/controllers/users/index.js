const {
  loginUser,
  verifyOTP,
  refreshAccessToken,
  currentUser,
} = require("./user.controller");
const {
  updateAccountDetails,
  updateUserAvatar,
} = require("./userUpdate.controller");

module.exports = {
  loginUser,
  verifyOTP,
  refreshAccessToken,
  updateAccountDetails,
  updateUserAvatar,
  currentUser,
};
