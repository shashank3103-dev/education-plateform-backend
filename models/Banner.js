const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Banner = sequelize.define(
  "Banner",
  {
    bannerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    screen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
      images: {
      type: DataTypes.STRING, 
       allowNull: false,
    },
  },
  
  {
    tableName: "Banners",
    timestamps: true,
  }
);
 
module.exports = Banner;

