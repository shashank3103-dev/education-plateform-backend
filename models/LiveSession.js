const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const LiveSession = sequelize.define("LiveSession", {
  sessionId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tutorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sessionTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("scheduled", "live", "ended"),
    defaultValue: "scheduled",
  },
  meetingId: {
    type: DataTypes.STRING,
    allowNull: true, // generated room id for WebRTC signaling
  },
}, {
  timestamps: true,
});

module.exports = LiveSession;
