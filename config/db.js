const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);
module.exports = sequelize ;  

// const { Sequelize } = require("sequelize");

// // Railway ke Variables tab me tumne DATABASE_URL set kiya hoga
// const dbUrl = process.env.DATABASE_URL;

// if (!dbUrl) {
//   throw new Error("❌ DATABASE_URL is not set in environment variables");
// }

// const sequelize = new Sequelize(dbUrl, {
//   dialect: "mysql",
//   logging: false, // console logs band karne ke liye
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// });

// // Test connection
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("✅ MySQL Database connected successfully!");
//   } catch (error) {
//     console.error("❌ Unable to connect to the database:", error);
//   }
// })();

// module.exports = sequelize;
