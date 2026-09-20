const Booking = require("../models/booking.model");

const createBooking = async (req, res, next) => {
  try {
    const { NumberOfPeople, StartDate, EndDate, PriceOf, ItineraryDayID } =
      req.body;

    const booking = await Booking.create({
      NumberOfPeople,
      StartDate,
      EndDate,
      PriceOf,
      ItineraryDayID,
      UserID: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

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

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

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

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { Status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { Status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

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

    res.status(200).json({
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

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getBookingStats,
};
