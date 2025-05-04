const { Airport } = require("../models");
const { AirportService } = require("../services");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchAirportData = async (iataCode, accessToken) => {
  try {
    const airportsResponse = await AirportService.findAirportByKeyword(
      {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-HTTP-Method-Override": "GET",
      },
      {
        subType: "AIRPORT",
        keyword: iataCode,
      }
    );

    const airportData = airportsResponse?.data?.[0] || {};
    const airportDetails = {
      address: airportData.address || "",
      iataCode: airportData.iataCode || iataCode,
      name: airportData.name || "",
      detailedName: airportData.detailedName || "",
    };

    return airportDetails;
  } catch (error) {
    const fallbackData = {
      address: "",
      iataCode,
      name: "",
      detailedName: "",
    };

    return fallbackData;
  }
};

const fetchWithCondition = async (
  airportNames,
  depActive = false,
  arrActive = false,
  depArrActive = true,
  departureIataCode,
  arrivalIataCode,
  accessToken
) => {
  const airportDetails = depArrActive
    ? await Promise.all([
        fetchAirportData(departureIataCode, accessToken),
        fetchAirportData(arrivalIataCode, accessToken),
      ])
    : depActive
    ? await Promise.all([fetchAirportData(departureIataCode, accessToken)])
    : arrActive
    ? await Promise.all([fetchAirportData(arrivalIataCode, accessToken)])
    : await Promise.all([
        fetchAirportData(departureIataCode, accessToken),
        fetchAirportData(arrivalIataCode, accessToken),
      ]);
  for (let j = 0; j < airportDetails.length; j++) {
    const element_airportDetails = airportDetails[j];

    const newAirport = new Airport({
      iataCode: element_airportDetails.iataCode,
      data: element_airportDetails,
    });

    try {
      await newAirport.save();
      console.log("Airport saved!");
    } catch (err) {
      console.error("Error saving airport:", err);
    }

    airportNames[element_airportDetails.iataCode] = element_airportDetails;
    await sleep(200);
  }
};

const processLocations = async (itinerary = [], accessToken) => {
  const airportNames = {};

  for (let i = 0; i < itinerary.length; i++) {
    const element = itinerary[i];

    for (let index = 0; index < element.segments.length; index++) {
      const element_segment = element.segments[index];

      const isAirportDetailDepartureExist = await Airport.findOne({
        iataCode: element_segment.departure.iataCode,
      });
      const isAirportDetailArrivalExist = await Airport.findOne({
        iataCode: element_segment.arrival.iataCode,
      });

      if (isAirportDetailDepartureExist && isAirportDetailArrivalExist) {
        airportNames[isAirportDetailDepartureExist.iataCode] =
          isAirportDetailDepartureExist?.data;
        airportNames[isAirportDetailArrivalExist.iataCode] =
          isAirportDetailArrivalExist?.data;
        await sleep(200);
        continue;
      }

      if (!isAirportDetailDepartureExist && !isAirportDetailArrivalExist) {
        const departureArrivalBoth = await fetchWithCondition(
          airportNames,
          (depActive = false),
          (arrActive = false),
          (depArrActive = true),
          (departureIataCode = element_segment.departure.iataCode),
          (arrivalIataCode = element_segment.arrival.iataCode),
          accessToken
        );

        continue;
      }

      if (isAirportDetailDepartureExist) {
        airportNames[isAirportDetailDepartureExist.iataCode] =
          isAirportDetailDepartureExist?.data;
      } else {
        const departure = await fetchWithCondition(
          airportNames,
          (depActive = true),
          (arrActive = false),
          (depArrActive = false),
          (departureIataCode = element_segment.departure.iataCode),
          (arrivalIataCode = element_segment.arrival.iataCode),
          accessToken
        );
      }

      if (isAirportDetailArrivalExist) {
        airportNames[isAirportDetailArrivalExist.iataCode] =
          isAirportDetailArrivalExist?.data;
      } else {
        const arrival = await fetchWithCondition(
          airportNames,
          (depActive = false),
          (arrActive = true),
          (depArrActive = false),
          (departureIataCode = element_segment.departure.iataCode),
          (arrivalIataCode = element_segment.arrival.iataCode),
          accessToken
        );

        continue;
      }
    }
  }

  return airportNames;
};

module.exports = {
  processLocations,
  sleep,
};
