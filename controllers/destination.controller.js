const Destination = require("../models/destination.model");

// Create Destination
const createDestination = async (req, res, next) => {
  try {
    const destination = await Destination.create({
      ...req.body,
      UserID: req.user.id,
    });

    res.status(201).json({
      message: "Destination created successfully",
      destination,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Destinations
const getAllDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.find();

    res.status(200).json({
      message: "Destinations fetched successfully",
      destinations,
    });
  } catch (error) {
    next(error);
  }
};

// Get Destination By ID
const getDestinationById = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    res.status(200).json({
      destination,
    });
  } catch (error) {
    next(error);
  }
};

// Update Destination
const updateDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    res.status(200).json({
      message: "Destination updated successfully",
      destination,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Destination
const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    res.status(200).json({
      message: "Destination deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
};