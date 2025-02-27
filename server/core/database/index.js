const { Sequelize } = require('sequelize');

// Create a new instance of Sequelize for local PostgreSQL
 const sequelize = new Sequelize('ssfa', 'jegadeesh', 'jega123456', {
  host: 'localhost',
  dialect: 'postgres', // or 'mysql', 'sqlite', etc.
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('PostgreSQL Connection successful');
  })
  .catch((error) => {
    console.error(`Error occurred: ${error}`);
  });
  module.exports = sequelize; 


   