const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },

    Location: {
      type: String,
      required: true,
    },

    Description: {
      type: String,
    },

    Image: {
      type: String,
    },

    Category: {
      type: String,
    },

    Duration: {
      type: Number,
    },

    PricePerPerson: {
      type: Number,
    },

    BaseTime: {
      type: Number,
    },

    AvailableSeats: {
      type: Number,
    },

    ThingsToDo: {
      type: [String],
    },

    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Destination", destinationSchema);