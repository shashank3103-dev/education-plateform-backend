// models/Session.js
module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define("Session", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    tutorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("scheduled", "live", "ended"),
      defaultValue: "scheduled",
    },
    startsAt: DataTypes.DATE,
  });
  return Session;
};
