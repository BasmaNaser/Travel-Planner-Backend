const express = require("express");

const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUserById,deleteUser,
} = require("../controllers/user.controller");

const auth = require("../middleware/auth");

router.post("/", createUser);

router.get("/", auth, getAllUsers);

router.get("/:id", auth, getUserById);

router.delete("/:id", auth, deleteUser);

module.exports = router;
