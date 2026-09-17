const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    MessageID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },

    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    Subject: {
      type: String,
      required: true,
    },

    Status: {
      type: String,
      enum: ["pending", "in_progress", "resolved", "rejected"],
      default: "pending",
    },

    CreatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);