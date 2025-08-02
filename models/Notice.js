const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // adjust path as needed

const Notice = sequelize.define(
  "Notice",
  {
    noticeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    issuedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    addedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "New_User", // table name
        key: "userId",
      },
    },
    status: {
      type: DataTypes.ENUM("visible", "hidden", "expired"),
      defaultValue: "hidden",
    },
  },
  {
    timestamps: true,
    tableName: "Notices",
  }
);

module.exports = Notice;
