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

const upload = require("../middlewares/upload");

router.get("/", getAllDestinations);

router.get("/:id", getDestinationById);

router.post(
  "/",
  authentication,
  authorization("admin"),
  upload.single("Image"),
  createDestination
);

router.patch(
  "/:id",
  authentication,
  authorization("admin"),
  upload.single("Image"),
  updateDestination
);

router.delete(
  "/:id",
  authentication,
  authorization("admin"),
  deleteDestination
);

module.exports = router;