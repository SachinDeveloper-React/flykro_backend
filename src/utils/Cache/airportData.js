const redis = require("../../redis");
const ApiError = require("../ApiError");

const setAirportData = async (iataCode, data) => {
  try {
    const cacheKey = `airports:${iataCode}`; // Use 'airports:' prefix for a folder effect
    // await client.hSet(key, data);
    await (await redis()).set(cacheKey, JSON.stringify(data));
    console.log(`Data for ${iataCode} saved.`);
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "", error);
  }
};

async function getAirportData(iataCode) {
  try {
    const key = `airports:${iataCode}`;
    const data = await (await redis()).get(key);
    // const data = await client.hGetAll(key);
    console.log(`Data for ${iataCode}:`, data);
    return data;
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "", error);
  }
}

module.exports = {
  setAirportData,
  getAirportData,
};
