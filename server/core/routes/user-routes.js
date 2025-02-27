const express = require("express");
const userRouter = express.Router();

const {
  register,
  login,
  logout,
  getUserById,
  updateUser,
} = require("../controllers/user-controller");

const { userAuthVerification } = require("../middleware/auth-middlware");

// Public routes
userRouter.post("/register", register);
userRouter.post("/login", login);

// Protected routes (using the userAuthVerification middleware)
userRouter.post("/auth", userAuthVerification, (req, res) => {
  // Protected route to verify authentication
  res.status(200).json({
    success: true,
    message: "User is authenticated",
    user: req.user, // Access the authenticated user's info here
  });
});

// Protected route to get user profile
userRouter.get("/", userAuthVerification, getUserById);
userRouter.put("/", userAuthVerification, updateUser);


// Protected route to update user profile
// userRouter.put("/update-profile", userAuthVerification, updateProfile);

// Protected route to delete the user's account
// userRouter.delete("/delete-account", userAuthVerification, deleteAccount);

// Logout route
userRouter.post("/logout", logout);

module.exports = userRouter;
