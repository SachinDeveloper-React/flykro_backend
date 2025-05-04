// src/config.js
require("dotenv").config();

module.exports = {
  apiBaseUrl: process.env.BASE_URL || "https://api.example.com",
  apiKey: process.env.API_KEY,
};
