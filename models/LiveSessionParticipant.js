const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const LiveSessionParticipant = sequelize.define("LiveSessionParticipant", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sessionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("tutor", "student"),
    allowNull: false,
  },
  joinedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  leftAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = LiveSessionParticipant;
