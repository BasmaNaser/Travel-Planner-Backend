const mongoose = require("mongoose");

const itineraryDaySchema = new mongoose.Schema(
  {
    DayNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    Title: {
      type: String,
      required: true,
      trim: true,
    },

    Activities: {
      type: String,
      required: true,
      trim: true,
    },

    Price: {
      type: Number,
      required: true,
      min: 0,
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