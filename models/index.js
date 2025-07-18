const User = require("./User");
const Course = require("./Course");
const { Order, OrderItem } = require("./Order");
const Notice = require("./Notice");
const Admin = require("./Admin");
const OTP = require("./OTP");
const RevokedToken = require("./revokedToken");
const Banner = require("./Banner");

// Associations

// User & Course
User.hasMany(Course, {
  foreignKey: "addedBy",
  sourceKey: "userId",
  as: "TutorCourses",
});
Course.belongsTo(User, {
  foreignKey: "addedBy",
  targetKey: "userId",
  as: "Tutor",
});

// User & Order
User.hasMany(Order, { foreignKey: "userId", sourceKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId", targetKey: "userId" });

// Order & OrderItem
Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  sourceKey: "orderId",
  as: "OrderItems",
});
OrderItem.belongsTo(Order, { foreignKey: "orderId", targetKey: "orderId" });

// OrderItem & Course
OrderItem.belongsTo(Course, { foreignKey: "courseId", targetKey: "courseId" });

// User & Notice
User.hasMany(Notice, { foreignKey: "addedBy", sourceKey: "userId" });
Notice.belongsTo(User, { foreignKey: "addedBy", targetKey: "userId" });

// User & OTP (if OTP is per user)
// User.hasMany(OTP, { foreignKey: "userId", sourceKey: "userId" });
// OTP.belongsTo(User, { foreignKey: "userId", targetKey: "userId" });

// User & RevokedToken (if you want to track which user revoked which token)
// User.hasMany(RevokedToken, { foreignKey: "userId", sourceKey: "userId" });
// RevokedToken.belongsTo(User, { foreignKey: "userId", targetKey: "userId" });
User.hasMany(RevokedToken, { foreignKey: 'userId' });
RevokedToken.belongsTo(User, { foreignKey: 'userId' });

// Admin model (if Admin is a separate table, not just a flag in User)
// Admin.belongsTo(User, { foreignKey: "userId", targetKey: "userId" });
// User.hasOne(Admin, { foreignKey: "userId", sourceKey: "userId" });


module.exports = {
  User,
  Course,
  Order,
  OrderItem,
  Notice,
  Admin,
  OTP,
  RevokedToken,
  Banner,
};
