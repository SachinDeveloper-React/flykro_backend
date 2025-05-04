const mongoose = require("mongoose");
const { PHONENUMBER_REGEX } = require("../constant");
const jsonwebtoken = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: PHONENUMBER_REGEX, // Adjust as per your phone number format
      index: true,
    },
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email format validation,
      index: true,
    },
    avatar: {
      type: String, // Cloudnary url
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    birthday: {
      type: Date,
      validate: {
        validator: function (value) {
          return value <= new Date(); // Birthday cannot be in the future
        },
        message: "Birthday must be a valid date in the past",
      },
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"], // Limit allowed values
      default: null,
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"], // Limit allowed values
      default: null,
    },
    pincode: {
      type: String,
      match: /^[0-9]{6}$/, // Ensure a valid Indian postal code format
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    // Additional fields as needed
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

userSchema.methods.generateAccessToken = async function (params) {
  return jsonwebtoken.sign(
    {
      _id: this._id,
      phoneNumber: this._phoneNumber,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = async function (params) {
  return jsonwebtoken.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
module.exports = mongoose.model("User", userSchema);
