
const express = require("express");

const router = express.Router();

const authentication = require("../middlewares/authMiddleware");

const authorization = require("../middlewares/authorized");

const {
  createBooking,
  getAllBookings,
  getBookingById,
  getMyBookings,       // 👈
  getMyBookingById,
  updateBookingStatus,
  payBooking,
  getBookingStats,
  updateBooking,
  deleteBooking,
  batchDeleteBookings,
} = require("../controllers/booking.controller");

// ======================================================
// CREATE BOOKING - USER
// ======================================================

router.post(
  "/",
  authentication,
  authorization("user"),
  createBooking
);

// ======================================================
// PAY BOOKING - USER
// ======================================================

router.patch(
  "/:id/pay",
  authentication,
  authorization("user"),
  payBooking
);

// ======================================================
// GET ALL BOOKINGS - ADMIN
// ======================================================

router.get(
  "/",
  authentication,
  authorization("admin"),
  getAllBookings
);

// ======================================================
// GET BOOKING STATS - ADMIN
// ======================================================

router.get(
  "/stats",
  authentication,
  authorization("admin"),
  getBookingStats
);

// ======================================================
// GET MY BOOKING BY ID - USER
// ======================================================

router.get(
  "/user/:id",
  authentication,
  authorization("user"),
  getMyBookingById
);

// ======================================================
// GET MY BOOKINGS - USER
// ======================================================

router.get(
  "/my-bookings",
  authentication,
  authorization("user"),
  getMyBookings
);

// ======================================================
// GET BOOKING BY ID - ADMIN
// ======================================================

router.get(
  "/:id",
  authentication,
  authorization("admin"),
  getBookingById
);

// ======================================================
// UPDATE BOOKING STATUS - ADMIN
// ======================================================

router.patch(
  "/:id/status",
  authentication,
  authorization("admin"),
  updateBookingStatus
);

// ======================================================
// UPDATE BOOKING
// ======================================================

router.patch(
  "/:id",
  authentication,
  updateBooking
);

// ======================================================
// BATCH DELETE BOOKINGS
// ======================================================

router.delete(
  "/batch",
  authentication,
  batchDeleteBookings
);

// ======================================================
// DELETE BOOKING
// ======================================================

router.delete(
  "/:id",
  authentication,
  deleteBooking
);

module.exports = router;

