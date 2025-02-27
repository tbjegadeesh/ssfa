const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const brandsRouter = express.Router();

const {
  create,
  get,
  update,
  deleteBrand,
} = require('../controllers/brands-controller.js');

// Define the uploads directory path
const uploadsDir = path.join(__dirname, '..', 'uploads/module/brands'); // Navigate up one level

// Check if the uploads directory exists; if not, create it (with recursion)
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // Create all directories in the path
}
// Set up storage options for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/module/brands/'); // Directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Filename with timestamp to avoid duplicates
  },
});
// Create multer instance
const upload = multer({ storage: storage });
brandsRouter.post('/brands', upload.single('brandLogo'), create);
brandsRouter.get('/brands', get);
brandsRouter.put('/brands/:id', update);
brandsRouter.delete('/brands/:id', deleteBrand);

module.exports = brandsRouter;
