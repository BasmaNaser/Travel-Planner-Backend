
const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const {
  createBooking,
  updateBooking,
  deleteBooking,
  batchDeleteBookings,
} = require("../controllers/booking.controller");


// ==============================
// Create Booking
// ==============================
router.post(
  "/",
  protect,
  createBooking
);


// ==============================
// Update Booking
// ==============================
router.patch(
  "/:id",
  protect,
  updateBooking
);


// ==============================
// Batch Delete
// IMPORTANT: /batch BEFORE /:id
// ==============================
router.delete(
  "/batch",
  protect,
  batchDeleteBookings
);


// ==============================
// Delete One Booking
// ==============================
router.delete(
  "/:id",
  protect,
  deleteBooking
);


module.exports = router;

