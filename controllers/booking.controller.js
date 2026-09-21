const Booking = require("../models/booking.model");
const ItineraryDay = require("../models/ItineraryDay.model");


const createBooking = async (req, res) => {

  try {

    const {
      NumberOfPeople,
      StartDate,
      EndDate,
      ItineraryDayID,
    } = req.body;


    // ==========================
    // CHECK DATA
    // ==========================

    if (
      !NumberOfPeople ||
      !StartDate ||
      !EndDate ||
      !ItineraryDayID
    ) {

      return res.status(400).json({
        message: "All booking data is required",
      });

    }


    // ==========================
    // CHECK NUMBER
    // ==========================

    if (NumberOfPeople < 1) {

      return res.status(400).json({
        message: "Number of people must be at least 1",
      });

    }


    // ==========================
    // CHECK DATES
    // ==========================

    const startDate =
      new Date(StartDate);

    const endDate =
      new Date(EndDate);


    if (startDate > endDate) {

      return res.status(400).json({
        message: "End date must be after start date",
      });

    }


    // ==========================
    // GET ITINERARY
    // ==========================

    const itineraryDay =
      await ItineraryDay.findById(
        ItineraryDayID
      );


    if (!itineraryDay) {

      return res.status(404).json({
        message: "Itinerary day not found",
      });

    }


    // ==========================
    // CALCULATE PRICE
    // ==========================

    const totalPrice =
      itineraryDay.Price * NumberOfPeople;


    // ==========================
    // CREATE BOOKING
    // ==========================

    const booking =
      await Booking.create({

        UserID: req.user._id,

        NumberOfPeople,

        StartDate: startDate,

        EndDate: endDate,

        PriceOf: totalPrice,

        ItineraryDayID,

        Status: "pending",

      });


    // ==========================
    // RESPONSE
    // ==========================

    res.status(201).json({

      message: "Booking created successfully",

      booking,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });

  }
};


module.exports = {
  createBooking,
};