const express = require("express");

const router = express.Router();

const authentication = require("../middlewares/authMiddleware");

const {
  getDashboardController,
} = require("../controllers/dashboard.controller");

router.get("/", authentication, getDashboardController);

module.exports = router;