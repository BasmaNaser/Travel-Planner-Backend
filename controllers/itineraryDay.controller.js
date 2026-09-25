const ItineraryDay = require("../models/ItineraryDay.model");
const Destination = require("../models/destination.model");

const createItineraryDay = async (req, res) => {
  try {
    const {
      DayNumber,
      Title,
      Activities,
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

module.exports = {
  createItineraryDay,
};