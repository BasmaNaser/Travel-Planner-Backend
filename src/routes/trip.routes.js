const express = require("express");

const router = express.Router();

const {
  getAllTrips,
  createTrip,
  getTripById,
  updateTrip,
  deleteTrip,
} = require("../controllers/trip.controller");

const auth = require("../middleware/auth");

router.get("/", getAllTrips);
router.post("/", auth, createTrip);
router.get("/:id", getTripById);
router.put("/:id", auth, updateTrip);
router.delete("/:id", auth, deleteTrip);

module.exports = router;
