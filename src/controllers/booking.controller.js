const Booking = require("../models/booking.model");

const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("userId", "name email")
            .populate("tripId", "name country price");

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("userId", "name email")
            .populate("tripId", "name country price");

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json(booking);

    } catch (error) {
        res.status(400).json({
            message: "Invalid booking ID"
        });
    }
};


const updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json(booking);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const getBookingStats = async (req, res) => {
    try {
        const pendingBookings = await Booking.countDocuments({
            status: "pending"
        });

        const acceptedBookings = await Booking.countDocuments({
            status: "accepted"
        });

        const rejectedBookings = await Booking.countDocuments({
            status: "rejected"
        });

        res.status(200).json({
            pendingBookings,
            acceptedBookings,
            rejectedBookings
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    getBookingStats
};