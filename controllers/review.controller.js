
// const Review = require("../models/review.model");

// // =====================================
// // Create Review
// // LOGIN REQUIRED
// // =====================================
// const createReview = async (req, res, next) => {
//   try {
//     const {
//       Rating,
//       Comment,
//       Platform,
//       DestinationID,
//     } = req.body;

//     const review = await Review.create({
//       Rating,
//       Comment,
//       Platform,
//       DestinationID,
//       UserID: req.user.id,
//     });

//     res.status(201).json({
//       message: "Review created successfully",
//       review,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // =====================================
// // Get Reviews By Destination
// // PUBLIC - LOGIN NOT REQUIRED
// // =====================================
// const getReviewsByDestination = async (
//   req,
//   res,
//   next
// ) => {
//   try {
//     const reviews = await Review.find({
//       DestinationID: req.params.destinationId,
//       isDeleted: false,
//     })
//       .populate("UserID", "fullName email")
//       .sort({ createdAt: 1 });

//     res.status(200).json({
//       message: "Reviews fetched successfully",
//       reviews,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // =====================================
// // Update My Review
// // LOGIN REQUIRED
// // =====================================
// const updateReview = async (req, res, next) => {
//   try {
//     const {
//       Rating,
//       Comment,
//       Platform,
//     } = req.body;

//     const review = await Review.findOneAndUpdate(
//       {
//         _id: req.params.id,
//         UserID: req.user.id,
//         isDeleted: false,
//       },
//       {
//         Rating,
//         Comment,
//         Platform,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!review) {
//       return res.status(404).json({
//         message:
//           "Review not found or you are not allowed to update it",
//       });
//     }

//     res.status(200).json({
//       message: "Review updated successfully",
//       review,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // =====================================
// // Delete Review
// // LOGIN REQUIRED
// // =====================================
// const deleteReview = async (req, res, next) => {
//   try {
//     const review = await Review.findById(
//       req.params.id
//     );

//     if (!review) {
//       return res.status(404).json({
//         message: "Review not found",
//       });
//     }

//     if (review.isDeleted) {
//       return res.status(400).json({
//         message: "Review has already been deleted",
//       });
//     }

//     // =================================
//     // ADMIN DELETE
//     // =================================
//     if (req.user.role === "admin") {
//       review.isDeleted = true;

//       review.deletedReason =
//         "Your review was removed by an administrator because it did not meet our community guidelines.";

//       review.deletedAt = new Date();

//       review.deletedNoticeRead = false;

//       await review.save();

//       return res.status(200).json({
//         message:
//           "Review deleted by admin successfully",
//         review,
//       });
//     }

//     // =================================
//     // USER DELETE
//     // =================================
//     if (
//       review.UserID.toString() !==
//       req.user.id.toString()
//     ) {
//       return res.status(403).json({
//         message:
//           "You are not allowed to delete this review",
//       });
//     }

//     await review.deleteOne();

//     res.status(200).json({
//       message: "Review deleted successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // =====================================
// // Mark Deleted Review Notice As Read
// // LOGIN REQUIRED
// // =====================================
// const markDeletedReviewNoticeRead = async (
//   req,
//   res,
//   next
// ) => {
//   try {
//     const review = await Review.findOneAndUpdate(
//       {
//         _id: req.params.id,
//         UserID: req.user.id,
//         isDeleted: true,
//         deletedNoticeRead: false,
//       },
//       {
//         deletedNoticeRead: true,
//       },
//       {
//         new: true,
//       }
//     );

//     if (!review) {
//       return res.status(404).json({
//         message:
//           "Deleted review notice not found",
//       });
//     }

//     res.status(200).json({
//       message:
//         "Deleted review notice marked as read",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   createReview,
//   getReviewsByDestination,
//   updateReview,
//   deleteReview,
//   markDeletedReviewNoticeRead,
// };




const Review = require("../models/review.model");

// =====================================
// Create Review
// LOGIN REQUIRED
// =====================================
const createReview = async (req, res, next) => {
  try {
    const {
      Rating,
      Comment,
      Platform,
      DestinationID,
    } = req.body;

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

// =====================================
// Get Reviews By Destination
// PUBLIC - LOGIN NOT REQUIRED
// =====================================
const getReviewsByDestination = async (
  req,
  res,
  next
) => {
  try {
    const reviews = await Review.find({
      DestinationID: req.params.destinationId,
      isDeleted: false,
    })
      .populate("UserID", "fullName email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================
// Get My Deleted Review Notification
// LOGIN REQUIRED
// =====================================
const getMyDeletedReviewNotification = async (
  req,
  res,
  next
) => {
  try {
    const review = await Review.findOne({
      UserID: req.user.id,
      isDeleted: true,
      deletedNoticeRead: false,
    }).populate(
      "DestinationID",
      "Name"
    );

    if (!review) {
      return res.status(200).json({
        notification: null,
      });
    }

    res.status(200).json({
      notification: {
        reviewId: review._id,
        message:
          review.deletedReason ||
          "Your review was removed by an administrator.",
        destination:
          review.DestinationID?.Name || "",
      },
    });

  } catch (error) {
    next(error);
  }
};

// =====================================
// Update My Review
// LOGIN REQUIRED
// =====================================
const updateReview = async (
  req,
  res,
  next
) => {
  try {
    const {
      Rating,
      Comment,
      Platform,
    } = req.body;

    const review =
      await Review.findOneAndUpdate(
        {
          _id: req.params.id,
          UserID: req.user.id,
          isDeleted: false,
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
        message:
          "Review not found or you are not allowed to update it",
      });
    }

    res.status(200).json({
      message:
        "Review updated successfully",
      review,
    });

  } catch (error) {
    next(error);
  }
};

// =====================================
// Delete Review
// LOGIN REQUIRED
// =====================================
const deleteReview = async (
  req,
  res,
  next
) => {
  try {

    const review =
      await Review.findById(
        req.params.id
      );

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (review.isDeleted) {
      return res.status(400).json({
        message:
          "Review has already been deleted",
      });
    }

    // =================================
    // ADMIN DELETE
    // =================================
    if (
      req.user.role === "admin"
    ) {

      review.isDeleted = true;

      review.deletedReason =
        "Your review was removed by an administrator because it did not meet our community guidelines.";

      review.deletedAt =
        new Date();

      review.deletedNoticeRead =
        false;

      await review.save();

      return res.status(200).json({
        message:
          "Review deleted by admin successfully",

        review,
      });
    }

    // =================================
    // USER DELETE
    // =================================

    if (
      review.UserID.toString() !==
      req.user.id.toString()
    ) {

      return res.status(403).json({
        message:
          "You are not allowed to delete this review",
      });
    }

    await review.deleteOne();

    res.status(200).json({
      message:
        "Review deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};

// =====================================
// Mark Deleted Review Notice As Read
// LOGIN REQUIRED
// =====================================
const markDeletedReviewNoticeRead =
  async (
    req,
    res,
    next
  ) => {

    try {

      const review =
        await Review.findOneAndUpdate(
          {
            _id: req.params.id,
            UserID: req.user.id,
            isDeleted: true,
            deletedNoticeRead: false,
          },
          {
            deletedNoticeRead: true,
          },
          {
            new: true,
          }
        );

      if (!review) {

        return res.status(404).json({
          message:
            "Deleted review notice not found",
        });

      }

      res.status(200).json({
        message:
          "Deleted review notice marked as read",
      });

    } catch (error) {
      next(error);
    }
  };

// =====================================
// EXPORTS
// =====================================
module.exports = {

  createReview,

  getReviewsByDestination,

  getMyDeletedReviewNotification,

  updateReview,

  deleteReview,

  markDeletedReviewNoticeRead,

};