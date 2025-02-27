const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userAuthVerification = (req, res, next) => {
  console.log('Auth verification middleware called'); // Log for debugging
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// const userAuthVerification = async (req, res, next) => {
//   const token = req.cookies.token; // Get token from cookies
//   if (!token) {
//     return res
//       .status(401)
//       .json({ success: false, message: 'No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, 'my_super_secret_key_12345');
//     const userInfo = await User.findByPk(decoded.id, {
//       attributes: { exclude: ['password'] },
//     });

//     if (!userInfo) {
//       return res
//         .status(404)
//         .json({ success: false, message: 'User not found.' });
//     }
//     // req.user = userInfo;
//     next();
//     // return res.status(200).json({ success: true, user: userInfo });
//   } catch (error) {
//     console.error(error);
//     next(error); // Pass the error to the next middleware for centralized error handling
//   }
// };

// const userAuthVerification = (req, res, next) => {
//   const token = req.cookies.token; // Assuming you're using cookies to store the token

//   if (!token) {
//     return res.status(401).json({ success: false, message: 'Unauthorized' });
//   }

//   // Verify the token (you may want to use jwt.verify here)
//   jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ success: false, message: 'Invalid token' });
//     }
//     req.user = decoded; // Save the decoded user info in the request object
//     next(); // Call the next middleware or route handler
//   });
// };

// const userAuthVerification = (req, res, next) => {
//   const token = req.cookies.token; // Example: getting the token from cookies
//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
//   }

//   // Verify the token (assuming you have a method to verify it)
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Invalid token.' });
//     }

//     // Attach user info to the request object
//     req.user = decoded;
//     next(); // Proceed to the next middleware/route
//   });
// };

module.exports = { userAuthVerification };
