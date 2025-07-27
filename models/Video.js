const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Video = sequelize.define("Video", {
  videoId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  courseId: {
    type: DataTypes.INTEGER, // or UUID if your Course uses UUID
    allowNull: false,
  },
  uploadedBy: {
    type: DataTypes.INTEGER, // or UUID if your User uses UUID
    allowNull: false,
  },
  duration: {
  type: DataTypes.STRING, // or FLOAT if you want in seconds
  allowNull: true,
},
  
});

module.exports = Video;
