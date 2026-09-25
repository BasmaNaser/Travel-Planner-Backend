const mongoose = require("mongoose");

const itineraryDaySchema = new mongoose.Schema(
  {
    DayNumber: {
      type: Number,
      required: true,
    },

    Title: {
      type: String,
    },

    Activities: {
      type: String,
    },
     Price: {
      type: Number,
      required: true,
    },

    DestinationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ItineraryDay",
  itineraryDaySchema
);