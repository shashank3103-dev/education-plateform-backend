const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Course = sequelize.define(
  "Course",
  {
    courseId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    tutor: { type: DataTypes.STRING, allowNull: false },
    category: {
      type: DataTypes.ENUM("Basic", "Advanced", "Basic to Advanced"),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    description: { type: DataTypes.TEXT, allowNull: false },
    target: { type: DataTypes.TEXT, allowNull: true, defaultValue: "Anyone" },
    duration: { type: DataTypes.STRING, allowNull: false },
    learning_minutes: { type: DataTypes.INTEGER, allowNull: true },
    requirements: { type: DataTypes.TEXT, allowNull: true },
    lectures: { type: DataTypes.INTEGER, allowNull: false },
    image: { type: DataTypes.STRING },
    is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
    addedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "New_User", key: "id" },
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    tableName: "Courses", // Capital C
  }
);

module.exports = Course;
