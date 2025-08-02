const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Enrollment = sequelize.define(
  "Enrollment",
  {
    enrollmentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Enrollments",
    timestamps: true,
  }
);
module.exports = Enrollment;

//  Enrollment.associate = (models) => {
//     Enrollment.belongsTo(models.User, { foreignKey: "userId" });
//     Enrollment.belongsTo(models.Course, { foreignKey: "courseId" });
//   };
