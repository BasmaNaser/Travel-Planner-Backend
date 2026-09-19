const express = require("express");

const router = express.Router();

const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getBookingStats,
} = require("../controllers/booking.controller");

const auth = require("../middleware/auth");

router.post("/", createBooking);
router.get("/", auth, getAllBookings);
router.get("/stats", auth, getBookingStats);
router.get("/:id", getBookingById);
router.put("/:id/status", auth, updateBookingStatus);

module.exports = router;
