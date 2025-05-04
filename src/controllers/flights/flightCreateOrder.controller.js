const { flightOrderSchema } = require("../../models");
const { FlightService } = require("../../services");
const {
  asyncHandler,
  ApiError,
  ApiResponse,
  handleError,
} = require("../../utils");

const flightCreateOrder = asyncHandler(async (req, res, next) => {
  const { flight, travelers } = req.body;

  try {
    const data = {
      type: "flight-order",
      flightOffers: [flight],
      travelers: travelers,
      remarks: {
        general: [
          {
            subType: "GENERAL_MISCELLANEOUS",
            text: "ONLINE BOOKING FROM INCREIBLE VIAJES",
          },
        ],
      },
      ticketingAgreement: {
        option: "DELAY_TO_CANCEL",
        delay: "6D",
      },
      contacts: [
        {
          addresseeName: {
            firstName: "PABLO",
            lastName: "RODRIGUEZ",
          },
          companyName: "INCREIBLE VIAJES",
          purpose: "STANDARD",
          phones: [
            {
              deviceType: "LANDLINE",
              countryCallingCode: "34",
              number: "480080071",
            },
            {
              deviceType: "MOBILE",
              countryCallingCode: "33",
              number: "480080072",
            },
          ],
          emailAddress: "support@increibleviajes.es",
          address: {
            lines: ["Calle Prado, 16"],
            postalCode: "28014",
            cityName: "Madrid",
            countryCode: "ES",
          },
        },
      ],
    };

    const accessToken = req.amadeus_token.data.access_token;
    const flightCreateOrder = await FlightService.flightCreateOrder(
      {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      {
        data: data,
      }
    );

    if (flightCreateOrder?.errors) {
      throw new ApiError(
        flightOffersPrice?.errors[0].status,
        flightOffersPrice?.errors[0].title
      );
    }

    const newOrder = new flightOrderSchema({
      owner: req.user?._id,
      createOrderByUser: flightCreateOrder?.data,
      dictionaries: flightCreateOrder?.dictionaries,
    });

    newOrder.save().then((order) => {
      console.log("Order Created with ID:", order.orderId);
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newOrder, "Order Create Successfully"));
  } catch (error) {
    console.error("Error during create order:", error);
    // res.status(500).json({ error: "Flight search failed" });
    // throw new ApiError(500, "", error);
    handleError(error, res, "Flight search failed", error);
  }
});

module.exports = {
  flightCreateOrder,
};
