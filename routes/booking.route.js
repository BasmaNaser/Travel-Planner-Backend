// const express = require("express");
// <<<<<<< HEAD

// const router = express.Router();

// const protect =
//   require("../middlewares/authMiddleware");

// const {
//   createBooking,
// } = require("../controllers/booking.controller");

// router.post(
//   "/",
//   protect,
//   createBooking
// );

// module.exports = router;
// =======
// const router = express.Router();

// const authentication = require("../middlewares/authMiddleware");
// const authorization = require("../middlewares/authorized");

// const {
//   createBooking,
//   getAllBookings,
//   getBookingById,
//   updateBookingStatus, getBookingStats,
// } = require("../controllers/booking.controller");

// router.post("/", authentication, authorization("user"), createBooking);
// router.get("/", authentication, authorization("admin"), getAllBookings);
// router.get("/stats", authentication, authorization("admin"), getBookingStats);
// router.get("/:id", authentication, authorization("admin"), getBookingById);
// router.patch(
//   "/:id/status",
//   authentication,
//   authorization("admin"),
//   updateBookingStatus,
// );

// module.exports = router;
// >>>>>>> Aseel-backend



const express = require("express");

const router = express.Router();

const authentication = require("../middlewares/authMiddleware");
const authorization = require("../middlewares/authorized");

const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getBookingStats,
} = require("../controllers/booking.controller");

router.post(
  "/",
  authentication,
  authorization("user"),
  createBooking
);

router.get(
  "/",
  authentication,
  authorization("admin"),
  getAllBookings
);

router.get(
  "/stats",
  authentication,
  authorization("admin"),
  getBookingStats
);

router.get(
  "/:id",
  authentication,
  authorization("admin"),
  getBookingById
);

router.patch(
  "/:id/status",
  authentication,
  authorization("admin"),
  updateBookingStatus
);

module.exports = router;
