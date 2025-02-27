const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Brands = sequelize.define(
  'Brands',
  {
    brandName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    brandDetails: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    brandLogo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    brandStatus: {
      type: DataTypes.ENUM('active', 'inActive'), // ENUM with 'active' and 'inactive' options
      allowNull: false,
      defaultValue: 'active', // Default value can be 'active'
    },
  },
  {
    timestamps: true,
  }
);

// Sync the model with the database
const syncModels = async () => {
  // await Brands.sync();
  await Brands.sync({ alter: true });
  console.log("Brands table has been created if it didn't exist.");
};

syncModels();

module.exports = Brands;
