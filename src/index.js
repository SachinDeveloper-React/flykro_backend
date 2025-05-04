const dotenv = require("dotenv");
const app = require("./app");
const redis = require("./redis");
const dbConnection = require("./database/index");
dotenv.config({
  path: "./.env",
});

redis()
  .then(() => {
    console.log("Connection is established with redis");
  })
  .catch((error) => {
    console.log("DEBUG : Error connecting to Redis", error);
  });

dbConnection()
  .then(() => {
    app.on("error", (error) => {
      console.log("DEBUG : ", error);
      throw error;
    });

    app.listen(process.env.PORT || 8000, "0.0.0.0", () => {
      console.log(`Server is running at port : ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.log("DEBUG : Error connecting to DB", error);
  });
