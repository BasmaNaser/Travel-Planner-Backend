const express = require("express");

const router = express.Router();

const { createAdmin, loginAdmin } = require("../controllers/admin.controller");

const auth = require("../middleware/auth");

router.post("/", createAdmin);

router.post("/login", loginAdmin);

router.get("/profile", auth, (req, res) => {
  res.status(200).json({
    message: "Admin authenticated successfully",
    admin: req.admin,
  });
});

module.exports = router;
