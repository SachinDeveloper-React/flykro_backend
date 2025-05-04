const express = require("express");
const cors = require("cors");
const cookiesParser = require("cookie-parser");
const { ApiError, ApiResponse } = require("./utils");
const app = express();

const corsOptions = {
  credentials: true,
  origin: process.env.CORS_ORIGIN,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(
  express.json({
    limit: "16kb",
  })
);

app.get("/", (req, res) => {
  res.status(200).json(new ApiResponse(200, "", "Server is reachable"));
});

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(err); // Automatically uses the `toJSON` method
  } else {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookiesParser());

const flightsRoute = require("./routes/flights.routes");
const airportsRoute = require("./routes/airports.routes");
const authRoute = require("./routes/auth.routes");
const flightUserRoute = require("./routes/flightsuser.routes");

app.use("/api/v1/shopping", flightsRoute);
app.use("/api/v1/search", airportsRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/flight", flightUserRoute);

module.exports = app;
