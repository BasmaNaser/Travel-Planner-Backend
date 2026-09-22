
const Booking = require("../models/booking.model");
const ItineraryDay = require("../models/ItineraryDay.model");
const Destination = require("../models/destination.model");


// ==============================
// Create Booking
// ==============================
const createBooking = async (req, res) => {
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
      message: "Booking created successfully",
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

    // لو NumberOfPeople اتبعت
    if (req.body.NumberOfPeople !== undefined) {

      if (req.body.NumberOfPeople < 1) {
        return res.status(400).json({
          message: "Number of people must be at least 1",
        });
      }

      booking.NumberOfPeople =
        req.body.NumberOfPeople;
    }


    // لو StartDate اتبعت
    if (req.body.StartDate !== undefined) {
      const startDate = new Date(
        req.body.StartDate
      );

      if (isNaN(startDate)) {
        return res.status(400).json({
          message: "Invalid StartDate",
        });
      }

      booking.StartDate = startDate;
    }


    // لو EndDate اتبعت
    if (req.body.EndDate !== undefined) {
      const endDate = new Date(
        req.body.EndDate
      );

      if (isNaN(endDate)) {
        return res.status(400).json({
          message: "Invalid EndDate",
        });
      }

      booking.EndDate = endDate;
    }


    // Check dates
    if (booking.StartDate > booking.EndDate) {
      return res.status(400).json({
        message: "End date must be after start date",
      });
    }


    // لو Status اتبعت
    if (req.body.Status !== undefined) {
      booking.Status = req.body.Status;
    }


    // Get itinerary day
    const itineraryDay =
      await ItineraryDay.findById(
        booking.ItineraryDayID
      );

    if (!itineraryDay) {
      return res.status(404).json({
        message: "Itinerary day not found",
      });
    }


    // Get destination
    const destination =
      await Destination.findById(
        itineraryDay.DestinationID
      );

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }


    // Recalculate price
    booking.PriceOf =
      destination.PricePerPerson *
      booking.NumberOfPeople;


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
  updateBooking,
  deleteBooking,
  batchDeleteBookings,
};

