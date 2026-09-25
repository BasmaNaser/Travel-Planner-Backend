const express = require("express");
const router = express.Router();

const authentication = require("../middlewares/authMiddleware");
const authorization = require("../middlewares/authorized");

const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getBookingStats,
  updateBooking,
  deleteBooking,
  batchDeleteBookings,
} = require("../controllers/booking.controller");

// ==============================
// Create Booking
// ==============================
router.post(
  "/",
  authentication,
  authorization("user"),
  createBooking
);

// ==============================
// Get All Bookings
// Admin only
// ==============================
router.get(
  "/",
  authentication,
  authorization("admin"),
  getAllBookings
);

// ==============================
// Get Booking Stats
// Admin only
// ==============================
router.get(
  "/stats",
  authentication,
  authorization("admin"),
  getBookingStats
);

// ==============================
// Get Booking By ID
// Admin only
// ==============================
router.get(
  "/:id",
  authentication,
  authorization("admin"),
  getBookingById
);

// ==============================
// Update Booking Status
// Admin only
// ==============================
router.patch(
  "/:id/status",
  authentication,
  authorization("admin"),
  updateBookingStatus
);

// ==============================
// Update Booking
// ==============================
router.patch(
  "/:id",
  authentication,
  updateBooking
);

// ==============================
// Batch Delete Bookings
// IMPORTANT: /batch BEFORE /:id
// ==============================
router.delete(
  "/batch",
  authentication,
  batchDeleteBookings
);

// ==============================
// Delete One Booking
// ==============================
router.delete(
  "/:id",
  authentication,
  deleteBooking
);

module.exports = router;