const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    NumberOfPeople: {
      type: Number,
      required: true,
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
    },

    Status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    UserID: {  //Aseel
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ItineraryDayID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItineraryDay",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Booking", bookingSchema);
