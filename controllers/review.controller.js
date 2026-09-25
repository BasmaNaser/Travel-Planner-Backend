const Review = require("../models/review.model");

// Create Review
const createReview = async (req, res, next) => {
  try {
    const { Rating, Comment, Platform, DestinationID } = req.body;

    const review = await Review.create({
      Rating,
      Comment,
      Platform,
      DestinationID,
      UserID: req.user.id,
    });

    res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    next(error);
  }
};


// Get Reviews By Destination
const getReviewsByDestination = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      DestinationID: req.params.destinationId,
    });

    res.status(200).json({
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    next(error);
  }
};


// Update My Review
const updateReview = async (req, res, next) => {
  try {
    const { Rating, Comment, Platform } = req.body;

    const review = await Review.findOneAndUpdate(
      {
        _id: req.params.id,
        UserID: req.user.id,
      },
      {
        Rating,
        Comment,
        Platform,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!review) {
      return res.status(404).json({
        message: "Review not found or you are not allowed to update it",
      });
    }

    res.status(200).json({
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    next(error);
  }
};


// Delete My Review
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      UserID: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found or you are not allowed to delete it",
      });
    }

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createReview,
  getReviewsByDestination,
  updateReview,
  deleteReview,
};