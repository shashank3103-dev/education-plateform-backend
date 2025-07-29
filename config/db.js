// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
//     logging: false
//   }
// );
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "mysql",
});



module.exports = sequelize ;  // Make sure to export as an object