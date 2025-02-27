const Joi = require('joi');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerSchema = Joi.object({
  fname: Joi.string().required(),
  lname: Joi.string().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const generateToken = (id) => {
  return jwt.sign({ id }, 'my_super_secret_key_12345', { expiresIn: '3d' });
};

const sendResponse = (res, status, success, message, data = {}) => {
  return res.status(status).json({ success, message, ...data });
};

const register = async (req, res) => {
  const { fname, lname, email, password } = req.body;

  const { error } = registerSchema.validate({ fname, email, password });
  if (error) return sendResponse(res, 400, false, error.details[0].message);

  try {
    const isUserEmailExists = await User.findOne({ where: { email } });
    if (isUserEmailExists) {
      return sendResponse(
        res,
        400,
        false,
        'User email already exists! Please try a different email.'
      );
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newlyCreatedUser = await User.create({
      fname,
      lname,
      email,
      password: hashPassword,
    });

    const token = generateToken(newlyCreatedUser.id);
    res.cookie('token', token, { httpOnly: true });

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
      'Something went wrong! Please try again.'
    );
  }
};

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

    const token = generateToken(getUser.id);
    res.cookie('token', token, { httpOnly: true });

    return sendResponse(res, 200, true, 'User logged in', { token });
  } catch (error) {
    console.error(error);
    return sendResponse(
      res,
      500,
      false,
      'Something went wrong! Please try again.'
    );
  }
};

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

const updateUser = async (req, res) => {
  const { id } = req.query;
  console.log(id, 'ididididididid');
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

const logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true });
  return sendResponse(res, 200, true, 'Logout successfully.');
};

module.exports = { register, login, logout, getUserById, updateUser };
