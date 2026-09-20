const Destination = require("../models/destination.model");
const Review = require("../models/review.model");

const getDashboardController = async (req, res, next) => {
  try {
    const destinations = await Destination.find()
      .select(
        "Name Location Description Category Image Duration PricePerPerson BaseTime AvailableSeats ThingsToDo"
      )
      .lean();

    const destinationIds = destinations.map((destination) => destination._id);

    const reviews = await Review.find({
      DestinationID: { $in: destinationIds },
    })
      .select("Rating DestinationID")
      .lean();

    const reviewsByDestination = {};

    reviews.forEach((review) => {
      const destinationId = review.DestinationID.toString();

      if (!reviewsByDestination[destinationId]) {
        reviewsByDestination[destinationId] = [];
      }

      reviewsByDestination[destinationId].push(review.Rating);
    });

    const formattedDestinations = destinations.map((destination) => {
      const destinationReviews =
        reviewsByDestination[destination._id.toString()] || [];

      const reviewCount = destinationReviews.length;

      const totalRating = destinationReviews.reduce(
        (sum, rating) => sum + rating,
        0
      );

      const averageRating =
        reviewCount > 0
          ? Number((totalRating / reviewCount).toFixed(1))
          : 0;

      return {
        id: destination._id,
        name: destination.Name,
        location: destination.Location,
        description: destination.Description,
        category: destination.Category,
        image: destination.Image,
        duration: destination.Duration,
        price: destination.PricePerPerson,
        baseTime: destination.BaseTime,
        availableSeats: destination.AvailableSeats,
        tags: destination.ThingsToDo,
        rating: averageRating,
        reviewCount,
      };
    });

    const trending = formattedDestinations.filter(
      (destination) =>
        destination.category?.toLowerCase() === "trending"
    );

    const coastal = formattedDestinations.filter(
      (destination) =>
        destination.category?.toLowerCase() === "coastal"
    );

    const adventure = formattedDestinations.filter(
      (destination) =>
        destination.category?.toLowerCase() === "adventure"
    );

    const cultural = formattedDestinations.filter(
      (destination) =>
        destination.category?.toLowerCase() === "cultural"
    );

    res.status(200).json({
      success: true,
      data: {
        trending,
        coastal,
        adventure,
        cultural,
      },
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getDashboardController,
};