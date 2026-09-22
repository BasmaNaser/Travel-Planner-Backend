const express = require("express");

const {
  createItineraryDay,
} = require("../controllers/itineraryDay.controller");

const router = express.Router();

router.post("/", createItineraryDay);

module.exports = router;