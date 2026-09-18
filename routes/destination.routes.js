const express = require("express");

const router = express.Router();

const {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
} = require("../controllers/destination.controller");

const authentication = require("../middlewares/authMiddleware");
const authorization = require("../middlewares/authorized");

router.get("/", authentication, getAllDestinations);

router.get("/:id", authentication, getDestinationById);

router.post("/", authentication, authorization("admin"), createDestination);

router.patch("/:id", authentication, authorization("admin"), updateDestination);

router.delete(
  "/:id",
  authentication,
  authorization("admin"),
  deleteDestination,
);

module.exports = router;
