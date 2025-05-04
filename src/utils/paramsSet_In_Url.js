const buildFlightOffersUrl = ({
  origin,
  destination,
  departureDate,
  returnDate,
  adults,
  children,
  infants,
  travelClass,
  currencyCode,
  nonStop,
  max,
}) => {
  const baseUrl = process.env.FLIGHT_OFFER;
  const params = new URLSearchParams();

  // Build the object with key-value pairs
  const queryParams = {
    originLocationCode: origin,
    destinationLocationCode: destination,
    departureDate,
    adults,
    ...(returnDate && { returnDate }),
    ...(children && { children }),
    ...(infants && { infants }),
    ...(travelClass && { travelClass }),
    ...(currencyCode && { currencyCode }),
    ...(nonStop !== undefined && { nonStop }),
    ...(max && { max }),
  };

  // Add each key-value pair to the URLSearchParams object
  Object.entries(queryParams).forEach(([key, value]) => {
    params.append(key, value);
  });

  // Return both the object and the complete URL
  return {
    queryParams, // Object with the query parameters
    fullUrl: `${baseUrl}?${params.toString()}`, // Full URL with parameters
  };
};

module.exports = {
  buildFlightOffersUrl,
};
