const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    MessageText: {
      type: String,
      required: true,
    },

    Status: {
      type: String,
      enum: ["sent", "read", "unread"],
      default: "sent",
    },

    CreatedAt: {
      type: Date,
      default: Date.now,
    },

    SenderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ReceiverID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);