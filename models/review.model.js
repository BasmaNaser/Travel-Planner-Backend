const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    Rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    Comment: {
      type: String,
    },

    Platform: {
      type: String,
    },

    CreatedAt: {
      type: Date,
      default: Date.now,
    },

    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    DestinationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },

    ComplaintID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);