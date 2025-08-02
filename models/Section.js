const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Section = sequelize.define(
  "Section",
  {
    sectionId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "Sections",
    timestamps: true,
  }
);
module.exports = Section;
