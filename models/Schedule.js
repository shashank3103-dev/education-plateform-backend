const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
  const Schedule = sequelize.define("Schedule", {
    courseId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
    location: DataTypes.STRING,
  });


module.exports = Schedule;