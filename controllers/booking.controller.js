
const Booking = require("../models/booking.model");
const ItineraryDay = require("../models/ItineraryDay.model");
const Destination = require("../models/destination.model");

// ======================================================
// CREATE BOOKING
// ======================================================

const createBooking = async (req, res, next) => {
  try {
    const {
      NumberOfPeople,
      StartDate,
      EndDate,
      ItineraryDayID,
      DestinationID,
    } = req.body;

    // ItineraryDayID is optional
    if (
      !NumberOfPeople ||
      !StartDate ||
      !EndDate ||
      !DestinationID
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

    // Find destination
    const destination = await Destination.findById(DestinationID);

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    // Check itinerary only if it was provided
    if (ItineraryDayID) {
      const itineraryDay =
        await ItineraryDay.findById(ItineraryDayID);

      if (!itineraryDay) {
        return res.status(404).json({
          message: "Itinerary day not found",
        });
      }

      if (
        itineraryDay.DestinationID.toString() !==
        DestinationID.toString()
      ) {
        return res.status(400).json({
          message:
            "Itinerary day does not belong to this destination",
        });
      }
    }

    if (
      destination.AvailableSeats < NumberOfPeople
    ) {
      return res.status(400).json({
        message: "Not enough available seats",
        availableSeats: destination.AvailableSeats,
      });
    }

    if (destination.PricePerPerson == null) {
      return res.status(400).json({
        message: "Destination price is not available",
      });
    }

    const totalPrice =
      destination.PricePerPerson * NumberOfPeople;

    // Create booking
    const bookingData = {
      UserID: req.user.id,
      DestinationID,
      NumberOfPeople,
      StartDate: startDate,
      EndDate: endDate,
      PriceOf: totalPrice,
      Status: "pending",
    };

    // Add ItineraryDayID only if it was provided
    if (ItineraryDayID) {
      bookingData.ItineraryDayID = ItineraryDayID;
    }

    const booking = await Booking.create(bookingData);

    destination.AvailableSeats -= NumberOfPeople;

    await destination.save();

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
      availableSeats: destination.AvailableSeats,
    });

  } catch (error) {
    next(error);
  }
};
// ======================================================
// GET ALL BOOKINGS - ADMIN
// ======================================================

const getAllBookings = async (
  req,
  res,
  next
) => {
  try {
    const bookings =
      await Booking.find()
        .populate(
          "UserID",
          "fullName email"
        )
        .populate(
          "DestinationID",
          "Name Location PricePerPerson"
        )
        .populate({
          path: "ItineraryDayID",
          select:
            "DayNumber Title Activities Price DestinationID",
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

// ======================================================
// GET BOOKING BY ID - ADMIN
// ======================================================

const getBookingById = async (
  req,
  res,
  next
) => {
  try {
    const booking =
      await Booking.findById(req.params.id)
        .populate(
          "UserID",
          "fullName email"
        )
        .populate(
          "DestinationID",
          "Name Location PricePerPerson"
        )
        .populate({
          path: "ItineraryDayID",
          select:
            "DayNumber Title Activities Price DestinationID",
        });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "Booking not found",
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

// ======================================================
// GET MY BOOKINGS - USER
// ======================================================

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      UserID: req.user.id,
    })
      .populate(
        "DestinationID",
        "Name Location Description Image Category Badge Duration PricePerPerson AvailableSeats ThingsToDo"
      )
      .populate({
        path: "ItineraryDayID",
        select:
          "DayNumber Title Activities Price DestinationID",
        populate: {
          path: "DestinationID",
          select:
            "Name Location Description Image Category Badge Duration PricePerPerson ThingsToDo",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================

// GET MY BOOKING BY ID - USER
// ======================================================

const getMyBookingById = async (
  req,
  res,
  next
) => {
  try {
    const booking =
      await Booking.findOne({
        _id: req.params.id,
        UserID: req.user.id,
      })
        .populate(
          "DestinationID",
          "Name Location PricePerPerson"
        )
        .populate({
          path: "ItineraryDayID",
          select:
            "DayNumber Title Activities Price DestinationID",
        });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "Booking not found",
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

// ======================================================
// UPDATE BOOKING STATUS - ADMIN
// ======================================================

const updateBookingStatus = async (
  req,
  res,
  next
) => {
  try {
    const { Status } = req.body;

    const booking =
      await Booking.findByIdAndUpdate(
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
        message:
          "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Booking status updated successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// PAY BOOKING - USER
// ======================================================

const payBooking = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const booking =
      await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "Booking not found",
      });
    }

    if (
      booking.UserID.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to pay for this booking",
      });
    }

    if (
      booking.Status !==
      "pending"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This booking cannot be paid for",
        currentStatus:
          booking.Status,
      });
    }

    // Demo payment
    booking.Status =
      "confirmed";

    await booking.save();

    return res.status(200).json({
      success: true,
      message:
        "Payment successful and booking confirmed",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET BOOKING STATS - ADMIN
// ======================================================

const getBookingStats = async (
  req,
  res,
  next
) => {
  try {
    const totalBookings =
      await Booking.countDocuments();

    const pendingBookings =
      await Booking.countDocuments({
        Status: "pending",
      });

    const confirmedBookings =
      await Booking.countDocuments({
        Status: "confirmed",
      });

    const cancelledBookings =
      await Booking.countDocuments({
        Status: "cancelled",
      });

    const completedBookings =
      await Booking.countDocuments({
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

// ======================================================
// UPDATE BOOKING
// ======================================================

const updateBooking = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const booking =
      await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message:
          "Booking not found",
      });
    }

    const oldNumberOfPeople =
      booking.NumberOfPeople;

    const newNumberOfPeople =
      req.body.NumberOfPeople !==
      undefined
        ? Number(
            req.body.NumberOfPeople
          )
        : oldNumberOfPeople;

    if (
      newNumberOfPeople < 1
    ) {
      return res.status(400).json({
        message:
          "Number of people must be at least 1",
      });
    }

    const destination =
      await Destination.findById(
        booking.DestinationID
      );

    if (!destination) {
      return res.status(404).json({
        message:
          "Destination not found",
      });
    }

    const difference =
      newNumberOfPeople -
      oldNumberOfPeople;

    if (difference > 0) {
      if (
        destination.AvailableSeats <
        difference
      ) {
        return res.status(400).json({
          message:
            "Not enough available seats",
          availableSeats:
            destination.AvailableSeats,
        });
      }

      destination.AvailableSeats -=
        difference;
    }

    if (difference < 0) {
      destination.AvailableSeats +=
        Math.abs(difference);
    }

    if (
      req.body.StartDate !==
      undefined
    ) {
      const startDate =
        new Date(
          req.body.StartDate
        );

      if (isNaN(startDate)) {
        return res.status(400).json({
          message:
            "Invalid StartDate",
        });
      }

      booking.StartDate =
        startDate;
    }

    if (
      req.body.EndDate !==
      undefined
    ) {
      const endDate =
        new Date(
          req.body.EndDate
        );

      if (isNaN(endDate)) {
        return res.status(400).json({
          message:
            "Invalid EndDate",
        });
      }

      booking.EndDate =
        endDate;
    }

    if (
      booking.StartDate >
      booking.EndDate
    ) {
      return res.status(400).json({
        message:
          "End date must be after start date",
      });
    }

    if (
      req.body.Status !==
      undefined
    ) {
      booking.Status =
        req.body.Status;
    }

    if (
      destination.PricePerPerson ==
      null
    ) {
      return res.status(400).json({
        message:
          "Destination price is not available",
      });
    }

    booking.NumberOfPeople =
      newNumberOfPeople;

    booking.PriceOf =
      destination.PricePerPerson *
      newNumberOfPeople;

    await destination.save();

    await booking.save();

    return res.status(200).json({
      success: true,
      message:
        "Booking updated successfully",
      data: booking,
      availableSeats:
        destination.AvailableSeats,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// DELETE BOOKING
// ======================================================

const deleteBooking = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const booking =
      await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message:
          "Booking not found",
      });
    }

    const destination =
      await Destination.findById(
        booking.DestinationID
      );

    if (destination) {
      destination.AvailableSeats +=
        booking.NumberOfPeople;

      await destination.save();
    }

    await Booking.findByIdAndDelete(
      id
    );

    return res.status(200).json({
      success: true,
      message:
        "Booking deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// BATCH DELETE BOOKINGS
// ======================================================

const batchDeleteBookings = async (
  req,
  res,
  next
) => {
  try {
    const { ids } = req.body;

    if (
      !Array.isArray(ids) ||
      ids.length === 0
    ) {
      return res.status(400).json({
        message:
          "Please provide booking IDs",
      });
    }

    const bookings =
      await Booking.find({
        _id: { $in: ids },
      });

    for (
      const booking of bookings
    ) {
      const destination =
        await Destination.findById(
          booking.DestinationID
        );

      if (destination) {
        destination.AvailableSeats +=
          booking.NumberOfPeople;

        await destination.save();
      }
    }

    const result =
      await Booking.deleteMany({
        _id: { $in: ids },
      });

    return res.status(200).json({
      success: true,
      message:
        "Bookings deleted successfully",
      deletedCount:
        result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  getMyBookings,       // 👈 ضيفي دي
  getMyBookingById,
  updateBookingStatus,
  payBooking,
  getBookingStats,
  updateBooking,
  deleteBooking,
  batchDeleteBookings,
};

