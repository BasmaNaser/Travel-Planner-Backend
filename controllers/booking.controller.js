// const Booking = require("../models/booking.model");
// <<<<<<< HEAD
// const ItineraryDay = require("../models/ItineraryDay.model");


// const createBooking = async (req, res) => {

//   try {

//     const {
//       NumberOfPeople,
//       StartDate,
//       EndDate,
//       ItineraryDayID,
//     } = req.body;


//     // ==========================
//     // CHECK DATA
//     // ==========================

//     if (
//       !NumberOfPeople ||
//       !StartDate ||
//       !EndDate ||
//       !ItineraryDayID
//     ) {

//       return res.status(400).json({
//         message: "All booking data is required",
//       });

//     }


//     // ==========================
//     // CHECK NUMBER
//     // ==========================

//     if (NumberOfPeople < 1) {

//       return res.status(400).json({
//         message: "Number of people must be at least 1",
//       });

//     }


//     // ==========================
//     // CHECK DATES
//     // ==========================

//     const startDate =
//       new Date(StartDate);

//     const endDate =
//       new Date(EndDate);


//     if (startDate > endDate) {

//       return res.status(400).json({
//         message: "End date must be after start date",
//       });

//     }


//     // ==========================
//     // GET ITINERARY
//     // ==========================

//     const itineraryDay =
//       await ItineraryDay.findById(
//         ItineraryDayID
//       );


//     if (!itineraryDay) {

//       return res.status(404).json({
//         message: "Itinerary day not found",
//       });

//     }


//     // ==========================
//     // CALCULATE PRICE
//     // ==========================

//     const totalPrice =
//       itineraryDay.Price * NumberOfPeople;


//     // ==========================
//     // CREATE BOOKING
//     // ==========================

//     const booking =
//       await Booking.create({

//         UserID: req.user._id,

//         NumberOfPeople,

//         StartDate: startDate,

//         EndDate: endDate,

//         PriceOf: totalPrice,

//         ItineraryDayID,

//         Status: "pending",

//       });


//     // ==========================
//     // RESPONSE
//     // ==========================

//     res.status(201).json({

//       message: "Booking created successfully",

//       booking,

//     });

//   } catch (error) {

//     console.log(error);

//     res.status(500).json({
//       message: "Server error",
//     });

//   }
// };


// module.exports = {
//   createBooking,
// };
// =======

// const createBooking = async (req, res, next) => {
//   try {
//     const { NumberOfPeople, StartDate, EndDate, PriceOf, ItineraryDayID } =
//       req.body;

//     const booking = await Booking.create({
//       NumberOfPeople,
//       StartDate,
//       EndDate,
//       PriceOf,
//       ItineraryDayID,
//       UserID: req.user.id,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Booking created successfully",
//       data: booking,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllBookings = async (req, res, next) => {
//   try {
//     const bookings = await Booking.find()
//       .populate("UserID", "fullName email")
//       .populate({
//         path: "ItineraryDayID",
//         populate: {
//           path: "DestinationID",
//           select: "Name Location",
//         },
//       });

//     res.status(200).json({
//       success: true,
//       count: bookings.length,
//       data: bookings,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getBookingById = async (req, res, next) => {
//   try {
//     const booking = await Booking.findById(req.params.id)
//       .populate("UserID", "fullName email")
//       .populate({
//         path: "ItineraryDayID",
//         populate: {
//           path: "DestinationID",
//           select: "Name Location",
//         },
//       });

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: booking,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const updateBookingStatus = async (req, res, next) => {
//   try {
//     const { Status } = req.body;

//     const booking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       { Status },
//       {
//         new: true,
//         runValidators: true,
//       },
//     );

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Booking status updated successfully",
//       data: booking,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getBookingStats = async (req, res, next) => {
//   try {
//     const totalBookings = await Booking.countDocuments();

//     const pendingBookings = await Booking.countDocuments({
//       Status: "pending",
//     });

//     const confirmedBookings = await Booking.countDocuments({
//       Status: "confirmed",
//     });

//     const cancelledBookings = await Booking.countDocuments({
//       Status: "cancelled",
//     });

//     const completedBookings = await Booking.countDocuments({
//       Status: "completed",
//     });

//     res.status(200).json({
//       success: true,
//       data: {
//         totalBookings,
//         pendingBookings,
//         confirmedBookings,
//         cancelledBookings,
//         completedBookings,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   createBooking,
//   getAllBookings,
//   getBookingById,
//   updateBookingStatus,
//   getBookingStats,
// };
// >>>>>>> Aseel-backend




















const Booking = require("../models/booking.model");
const ItineraryDay = require("../models/ItineraryDay.model");

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

    if (startDate > endDate) {
      return res.status(400).json({
        message: "End date must be after start date",
      });
    }

    const itineraryDay = await ItineraryDay.findById(ItineraryDayID);

    if (!itineraryDay) {
      return res.status(404).json({
        message: "Itinerary day not found",
      });
    }

    const totalPrice = itineraryDay.Price * NumberOfPeople;

    const booking = await Booking.create({
      UserID: req.user.id,
      NumberOfPeople,
      StartDate: startDate,
      EndDate: endDate,
      PriceOf: totalPrice,
      ItineraryDayID,
      Status: "pending",
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
      }
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