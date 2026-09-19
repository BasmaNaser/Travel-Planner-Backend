const Trip = require("../models/trip.model");
const User = require("../models/user.model");
const Booking = require("../models/booking.model");

const getDashboardStats = async (req, res) => {
    try {
        const totalTrips = await Trip.countDocuments();

        const totalUsers = await User.countDocuments();

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
            totalTrips,
            totalUsers,
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
    getDashboardStats
};