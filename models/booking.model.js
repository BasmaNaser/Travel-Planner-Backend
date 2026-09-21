const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    NumberOfPeople: {
      type: Number,
      required: true,
      min: 1,
    },

    StartDate: {
      type: Date,
      required: true,
    },

    EndDate: {
      type: Date,
      required: true,
    },

    PriceOf: {
      type: Number,
      required: true,
      min: 0,
    },

    Status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
      ],
      default: "pending",
    },

    ItineraryDayID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItineraryDay",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);