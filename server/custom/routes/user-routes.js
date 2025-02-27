const express = require('express');
const userRouter = express.Router();

const {
  register,
  login,
  logout,
  getUserById,
  updateUser,
} = require('../controllers/user-controller');

const { userAuthVerification } = require('../middleware/auth-middlware');

// Public routes
userRouter.post('/register', register);
userRouter.post('/login', login);

// Apply the authentication middleware to protected routes only
userRouter.get('/auth', userAuthVerification, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User is authenticated',
    user: req.user,
  });
});

userRouter.get('/user', userAuthVerification, getUserById);
userRouter.put('/user/:id', userAuthVerification, updateUser);
userRouter.post('/logout', userAuthVerification, logout);

module.exports = userRouter;
