const express = require("express");

const router = express.Router();

const authentication = require("../middlewares/authMiddleware");

const {
  createReview,
  getReviewsByDestination,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");


// Create Review
router.post("/", createReview);


// Get Reviews By Destination
router.get(
  "/:destinationId",
  // authentication,
  getReviewsByDestination
);


// Update My Review
router.patch(
  "/:id",
  // authentication,
  updateReview
);


// Delete My Review
router.delete(
  "/:id",
  // authentication,
  deleteReview
);


module.exports = router;
