
const ItineraryDay = require("../models/ItineraryDay.model");
const Destination = require("../models/destination.model");


// ==============================
// Create Itinerary Day
// ==============================

const createItineraryDay = async (req, res) => {
  try {
    const {
      DayNumber,
      Title,
      Activities,
      Price,
      DestinationID,
    } = req.body;

    const destination = await Destination.findById(DestinationID);

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    const itineraryDay = await ItineraryDay.create({
      DayNumber,
      Title,
      Activities,
      Price,
      DestinationID,
    });

    res.status(201).json({
      message: "Itinerary day created successfully",
      itineraryDay,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==============================
// Get Itinerary Days By Destination
// ==============================

const getItineraryDaysByDestination = async (req, res) => {
  try {

    const { destinationId } = req.params;

    const destination = await Destination.findById(destinationId);

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    const itineraryDays = await ItineraryDay.find({
      DestinationID: destinationId,
    }).sort({
      DayNumber: 1,
    });

    res.status(200).json({
      message: "Itinerary days retrieved successfully",
      itineraryDays,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createItineraryDay,
  getItineraryDaysByDestination,
};

