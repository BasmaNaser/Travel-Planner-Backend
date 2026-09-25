
// const express = require("express");

// const router = express.Router();

// const authentication = require("../middlewares/authMiddleware");

// const {
//   createReview,
//   getReviewsByDestination,
//   updateReview,
//   deleteReview,
//   markDeletedReviewNoticeRead,
// } = require("../controllers/review.controller");

// // =====================================
// // Get Reviews By Destination
// // PUBLIC - Login NOT Required
// // =====================================
// router.get(
//   "/:destinationId",
//   getReviewsByDestination
// );

// // =====================================
// // Create Review
// // LOGIN REQUIRED
// // =====================================
// router.post(
//   "/",
//   authentication,
//   createReview
// );

// // =====================================
// // Mark Deleted Review Notice As Read
// // LOGIN REQUIRED
// // =====================================
// router.patch(
//   "/notice/:id/read",
//   authentication,
//   markDeletedReviewNoticeRead
// );

// // =====================================
// // Update My Review
// // LOGIN REQUIRED
// // =====================================
// router.patch(
//   "/:id",
//   authentication,
//   updateReview
// );

// // =====================================
// // Delete Review
// // LOGIN REQUIRED
// // =====================================
// router.delete(
//   "/:id",
//   authentication,
//   deleteReview
// );

// module.exports = router;









const express = require("express");

const router = express.Router();

const authentication =
  require("../middlewares/authMiddleware");

const {

  createReview,

  getReviewsByDestination,

  getMyDeletedReviewNotification,

  updateReview,

  deleteReview,

  markDeletedReviewNoticeRead,

} = require("../controllers/review.controller");


// =====================================
// Get My Deleted Review Notification
// LOGIN REQUIRED
// =====================================

router.get(
  "/notification/deleted",
  authentication,
  getMyDeletedReviewNotification
);


// =====================================
// Get Reviews By Destination
// PUBLIC - LOGIN NOT REQUIRED
// =====================================

router.get(
  "/:destinationId",
  getReviewsByDestination
);


// =====================================
// Create Review
// LOGIN REQUIRED
// =====================================

router.post(
  "/",
  authentication,
  createReview
);


// =====================================
// Mark Deleted Review Notice As Read
// LOGIN REQUIRED
// =====================================

router.patch(
  "/notice/:id/read",
  authentication,
  markDeletedReviewNoticeRead
);


// =====================================
// Update My Review
// LOGIN REQUIRED
// =====================================

router.patch(
  "/:id",
  authentication,
  updateReview
);


// =====================================
// Delete Review
// LOGIN REQUIRED
// =====================================

router.delete(
  "/:id",
  authentication,
  deleteReview
);


module.exports = router;