// models/SessionParticipant.js
module.exports = (sequelize, DataTypes) => {
  const SessionParticipant = sequelize.define("SessionParticipant", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    sessionId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    role: { type: DataTypes.ENUM("tutor", "student"), allowNull: false },
    joinedAt: DataTypes.DATE,
    leftAt: DataTypes.DATE,
  });
  return SessionParticipant;
};
