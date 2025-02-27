const Joi = require('joi');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define validation schema for registration
const registerSchema = Joi.object({
  fname: Joi.string().required(),
  lname: Joi.string().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(), // Increased password length
});

// Define validation schema for login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// Generate JWT token with environment secret key
const generateToken = (id) => {
  return jwt.sign({ id }, 'my_super_secret_key_12345', { expiresIn: '3d' });
  // return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// Helper function for sending standardized responses
const sendResponse = (res, status, success, message, data = {}) => {
  return res.status(status).json({ success, message, ...data });
};

// Register a new user
const register = async (req, res) => {
  const { fname, lname, email, password } = req.body;

  const { error } = registerSchema.validate({ fname, email, password });
  if (error) return sendResponse(res, 400, false, error.details[0].message);

  try {
    // Check if the email already exists
    const isUserEmailExists = await User.findOne({ where: { email } });
    if (isUserEmailExists) {
      return sendResponse(
        res,
        400,
        false,
        'User email already exists! Please try a different email.'
      );
    }

    // Hash the user's password
    const hashPassword = await bcrypt.hash(password, 12);
    const newlyCreatedUser = await User.create({
      fname,
      lname,
      email,
      password: hashPassword,
    });

    // Generate JWT token
    const token = generateToken(newlyCreatedUser.id);

    // Set cookie with token, enhanced with security options
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
    });

    // Send success response
    return sendResponse(res, 201, true, 'User registration successful', {
      userData: {
        fname: newlyCreatedUser.fname,
        lname: newlyCreatedUser.lname,
        email: newlyCreatedUser.email,
        id: newlyCreatedUser.id,
      },
    });
  } catch (error) {
    console.error(error);
    return sendResponse(
      res,
      500,
      false,
      'Registration failed due to a server error.'
    );
  }
};

// User login
const login = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate({ email, password });
  if (error) return sendResponse(res, 400, false, error.details[0].message);

  try {
    const getUser = await User.findOne({ where: { email } });
    if (!getUser) return sendResponse(res, 400, false, 'Incorrect email.');

    const isPasswordValid = await bcrypt.compare(password, getUser.password);
    if (!isPasswordValid)
      return sendResponse(res, 400, false, 'Incorrect password.');

    // Generate token and set it in cookie
    const token = generateToken(getUser.id);
    res.cookie('token', token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: true,
      sameSite: 'strict',
    });
    return sendResponse(res, 200, true, 'User logged in successfully', {
      token,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, 'Login failed due to a server error.');
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.query;

  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return sendResponse(res, 404, false, 'User not found.');

    return sendResponse(res, 200, true, 'User fetched successfully.', { user });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, 'Failed to fetch user profile.');
  }
};

// Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fname, lname, email } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return sendResponse(res, 404, false, 'User not found.');

    const updatedUser = await user.update({ fname, lname, email });

    const { password, ...userWithoutPassword } = updatedUser.dataValues;

    return sendResponse(res, 200, true, 'User profile updated successfully.', {
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return sendResponse(
        res,
        400,
        false,
        'Email is already in use by another account.'
      );
    }
    return sendResponse(res, 500, false, 'Failed to update user profile.');
  }
};

// Logout user
const logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true });
  return sendResponse(res, 200, true, 'Logged out successfully.');
};

module.exports = { register, login, logout, getUserById, updateUser };
