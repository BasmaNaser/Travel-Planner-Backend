const express = require("express");
const authentication = require("../middlewares/authMiddleware");
const authorization = require("../middlewares/authorized");
const userRouter = express.Router();
const {
  validate,
  contactValidate,
  validateUpdateProfile,
  validateChangePassword,
} = require("../middlewares/validator");
const {
  createContactController,
  getMyContactController,
  deleteAccountController,
  getUserProfileController,
  updateUserDataController,
  updateUserPasswordController,
  updateProfilePictureController,
  deleteProfilePictureController,
  createUser,getAllUsers,getUserById,deleteUser,
} = require("../controllers/user.controller");
const { upload } = require("../utils/multer");
userRouter.post(
  "/contact/send",
  authentication,
  authorization("user"),
  contactValidate,
  validate,
  createContactController,
);
userRouter.get(
  "/my-complaints",
  authentication,
  authorization("user", "admin"),
  getMyContactController,
);
userRouter.get(
  "/profile",
  authentication,
  authorization("user"),
  getUserProfileController,
);
userRouter.patch(
  "/profile",
  authentication,
  authorization("user"),
  validateUpdateProfile,
  validate,
  updateUserDataController,
);
userRouter.post(
  "/update-password",
  authentication,
  authorization("user"),
  validateChangePassword,
  validate,
  updateUserPasswordController,
);
userRouter.post(
  "/delete-account",
  authentication,
  authorization("user"),
  deleteAccountController,
);
userRouter.patch(
  "/profile-picture",
  authentication,
  authorization("user"),
  upload.single("image"),
  updateProfilePictureController,
);
userRouter.delete(
  "/profile-picture",
  authentication,
  authorization("user"),
  deleteProfilePictureController,
);
userRouter.post("/", authentication, authorization("admin"), createUser);
userRouter.get("/", authentication, authorization("admin"), getAllUsers);
userRouter.get(
    '/:id',
    authentication,
    authorization('admin'),
    getUserById
);
userRouter.delete(
    '/:id',
    authentication,
    authorization('admin'),
    deleteUser
);
module.exports = userRouter;
