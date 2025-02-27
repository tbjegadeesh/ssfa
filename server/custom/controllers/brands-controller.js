const { Op } = require('sequelize');
// Import sequelize for functions
const sequelize = require('sequelize');
const Joi = require('joi');
const Brands = require('../models/Brands');

// Define schema for brand creation

const brandsSchema = Joi.object({
  brandName: Joi.string().required(),
  brandDetails: Joi.string(),
});

// Standard response helper function
const sendResponse = (res, status, success, message, data = {}) => {
  return res.status(status).json({ success, message, ...data });
};

// Create a new brand
const create = async (req, res) => {
  const { brandName, brandDetails } = req.body;
  // Validate request body against schema
  const { error } = brandsSchema.validate({ brandName, brandDetails });
  if (error) return sendResponse(res, 400, false, error.details[0].message);
  try {
    // Check if brand already exists
    const isBrandExists = await Brands.findOne({ where: { brandName } });
    if (isBrandExists) {
      return sendResponse(
        res,
        400,
        false,
        'Brand name already exists! Please try a different name.'
      );
    }

    // Create the new brand
    const response = await Brands.create(req.body);
    return sendResponse(res, 201, true, 'Brand added successfully', {
      response,
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

const get = async (req, res) => {
  const {
    id,
    page = 1,
    limit = 10,
    sortBy = 'brandName',
    sortOrder = 'ASC',
    search,
  } = req.query;
  try {
    const whereCondition = {};

    // Add id condition only if it's provided
    if (id) {
      whereCondition.id = id;
    }

    // Handle search filter if provided
    if (search) {
      whereCondition.brandName = { [Op.iLike]: `%${search.trim()}%` }; // Matches substrings
    }

    // Convert page and limit to integers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Calculate the offset
    const offset = (pageNum - 1) * limitNum;

    // Sanitize sortOrder and check if it's valid
    const validSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // Check if the sortBy field exists in the model (adjust the fields accordingly)
    const validSortFields = ['brandName', 'createdAt', 'updatedAt']; // Add other valid fields here
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'brandName';

    // Define order array for sorting
    const order =
      orderField === 'brandName'
        ? [[sequelize.fn('LOWER', sequelize.col(orderField)), validSortOrder]]
        : [[orderField, validSortOrder]];

    // Fetch data using Sequelize's findAndCountAll method with sorting
    const response = await Brands.findAndCountAll({
      where: whereCondition,
      order: order,
      limit: limitNum,
      offset: offset,
    });

    // Calculate the total number of pages based on the total count of items
    const totalPages = Math.ceil(response.count / limitNum);

    // Send success response
    return sendResponse(res, 200, true, 'Brands retrieved successfully.', {
      brands: response.rows,
      currentPage: pageNum,
      totalPages: totalPages,
      totalItems: response.count,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, 'Failed to retrieve brands.');
  }
};

// Update brand by ID
const update = async (req, res) => {
  const { id } = req.params;

  try {
    // Find brand by primary key
    const brand = await Brands.findByPk(id);
    if (!brand) return sendResponse(res, 404, false, 'Brand not found.');

    // Update brand with the data from the request body
    const updatedBrand = await brand.update(req.body);
    return sendResponse(res, 200, true, 'Brand updated successfully.', {
      updatedBrand,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return sendResponse(
        res,
        400,
        false,
        'Brand name is already in use, please choose a different one.'
      );
    }

    return sendResponse(res, 500, false, 'Failed to update the brand.');
  }
};

// Delete a brand by ID
const deleteBrand = async (req, res) => {
  const { id } = req.params;

  try {
    const brand = await Brands.findByPk(id);
    if (!brand) return sendResponse(res, 404, false, 'Brand not found.');

    // Delete the brand
    await brand.destroy();
    return sendResponse(res, 200, true, 'Brand deleted successfully.');
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, 'Failed to delete the brand.');
  }
};

module.exports = { create, get, update, deleteBrand };
