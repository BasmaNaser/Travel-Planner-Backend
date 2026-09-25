
const express = require("express");

const {
  createItineraryDay,
  getItineraryDaysByDestination,
} = require("../controllers/itineraryDay.controller");

const router = express.Router();


// Create Itinerary Day
router.post("/", createItineraryDay);


// Get Itinerary Days By Destination
router.get(
  "/destination/:destinationId",
  getItineraryDaysByDestination
);


module.exports = router;

