const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuthVerification = async (req, res, next) => {const token = req.cookies.token; // Get token from cookies
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, "my_super_secret_key_12345");
    const userInfo = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });

    if (!userInfo) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    // req.user = userInfo;
next()
    // return res.status(200).json({ success: true, user: userInfo });
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the next middleware for centralized error handling
  }
};

module.exports = { userAuthVerification };
