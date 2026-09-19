const Trip = require("../models/trip.model");

const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find();

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createTrip = async (req, res) => {
  try {
    const trip = await Trip.create(req.body);

    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(400).json({
      message: "Invalid trip ID",
    });
  }
};

const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.status(200).json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid trip ID",
    });
  }
};

module.exports = {
  getAllTrips,
  createTrip,
  getTripById,
  updateTrip,
  deleteTrip,
};
