const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  fname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
}, {
  timestamps: true,
});

// Sync the model with the database
const syncModels = async () => {
  await User.sync();
  console.log("User table has been created if it didn't exist.");
};

syncModels();

module.exports = User;
