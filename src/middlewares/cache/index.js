const { airportSearchByKeywordResultCache } = require("./airportCacheData");
const { flightOffersResultCache } = require("./flightCacheData");

const exportCacheMiddleware = {
  flightOffersResultCache,
  airportSearchByKeywordResultCache,
};

module.exports = exportCacheMiddleware;
