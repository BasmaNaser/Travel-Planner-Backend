const express = require("express");

const router = express.Router();

const protect =
  require("../middlewares/authMiddleware");

const {
  createBooking,
} = require("../controllers/booking.controller");

router.post(
  "/",
  protect,
  createBooking
);

module.exports = router;