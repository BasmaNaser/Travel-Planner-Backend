const Booking = require("../models/booking.model");
const ItineraryDay = require("../models/ItineraryDay.model");
const Destination = require("../models/destination.model");

// ==============================
// Create Booking
// ==============================
const createBooking = async (req, res, next) => {
  try {
    const {
      NumberOfPeople,
      StartDate,
      EndDate,
      ItineraryDayID,
    } = req.body;

    if (
      !NumberOfPeople ||
      !StartDate ||
      !EndDate ||
      !ItineraryDayID
    ) {
      return res.status(400).json({
        message: "All booking data is required",
      });
    }

    if (NumberOfPeople < 1) {
      return res.status(400).json({
        message: "Number of people must be at least 1",
      });
    }

    const startDate = new Date(StartDate);
    const endDate = new Date(EndDate);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    if (startDate > endDate) {
      return res.status(400).json({
        message: "End date must be after start date",
      });
    }

    const itineraryDay = await ItineraryDay.findById(
      ItineraryDayID
    );

    if (!itineraryDay) {
      return res.status(404).json({
        message: "Itinerary day not found",
      });
    }

    const destination = await Destination.findById(
      itineraryDay.DestinationID
    );

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    if (destination.PricePerPerson == null) {
      return res.status(400).json({
        message: "Destination price is not available",
      });
    }

    const totalPrice =
      destination.PricePerPerson * NumberOfPeople;

    const booking = await Booking.create({
      UserID: req.user.id,
      NumberOfPeople,
      StartDate: startDate,
      EndDate: endDate,
      PriceOf: totalPrice,
      ItineraryDayID,
      Status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Get All Bookings
// ==============================
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("UserID", "fullName email")
      .populate({
        path: "ItineraryDayID",
        populate: {
          path: "DestinationID",
          select: "Name Location",
        },
      });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Get Booking By ID
// ==============================
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("UserID", "fullName email")
      .populate({
        path: "ItineraryDayID",
        populate: {
          path: "DestinationID",
          select: "Name Location",
        },
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Update Booking Status
// ==============================
const updateBookingStatus = async (req, res, next) => {
  try {
    const { Status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { Status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Get Booking Stats
// ==============================
const getBookingStats = async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments();

    const pendingBookings = await Booking.countDocuments({
      Status: "pending",
    });

    const confirmedBookings = await Booking.countDocuments({
      Status: "confirmed",
    });

    const cancelledBookings = await Booking.countDocuments({
      Status: "cancelled",
    });

    const completedBookings = await Booking.countDocuments({
      Status: "completed",
    });

    return res.status(200).json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        completedBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Update Booking
// ==============================
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (req.body.NumberOfPeople !== undefined) {
      if (req.body.NumberOfPeople < 1) {
        return res.status(400).json({
          message: "Number of people must be at least 1",
        });
      }

      booking.NumberOfPeople = req.body.NumberOfPeople;
    }

    if (req.body.StartDate !== undefined) {
      const startDate = new Date(req.body.StartDate);

      if (isNaN(startDate)) {
        return res.status(400).json({
          message: "Invalid StartDate",
        });
      }

      booking.StartDate = startDate;
    }

    if (req.body.EndDate !== undefined) {
      const endDate = new Date(req.body.EndDate);

      if (isNaN(endDate)) {
        return res.status(400).json({
          message: "Invalid EndDate",
        });
      }

      booking.EndDate = endDate;
    }

    if (booking.StartDate > booking.EndDate) {
      return res.status(400).json({
        message: "End date must be after start date",
      });
    }

    if (req.body.Status !== undefined) {
      booking.Status = req.body.Status;
    }

    const itineraryDay = await ItineraryDay.findById(
      booking.ItineraryDayID
    );

    if (!itineraryDay) {
      return res.status(404).json({
        message: "Itinerary day not found",
      });
    }

    const destination = await Destination.findById(
      itineraryDay.DestinationID
    );

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    if (destination.PricePerPerson == null) {
      return res.status(400).json({
        message: "Destination price is not available",
      });
    }

    booking.PriceOf =
      destination.PricePerPerson * booking.NumberOfPeople;

    await booking.save();

    return res.status(200).json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==============================
// Delete One Booking
// ==============================
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    await Booking.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==============================
// Batch Delete Bookings
// ==============================
const batchDeleteBookings = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Please provide booking IDs",
      });
    }

    const result = await Booking.deleteMany({
      _id: { $in: ids },
    });

    return res.status(200).json({
      message: "Bookings deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==============================
// Export
// ==============================
module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getBookingStats,
  updateBooking,
  deleteBooking,
  batchDeleteBookings,
};