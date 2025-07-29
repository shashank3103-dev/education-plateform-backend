const User = require("./User");
const Course = require("./Course");
const { Order, OrderItem } = require("./Order");
const Notice = require("./Notice");
const Admin = require("./Admin");
const OTP = require("./OTP");
const RevokedToken = require("./revokedToken");
const Banner = require("./Banner");
const Schedule = require("./Schedule");
const Video = require("./Video");
const Notification = require("./Notification");

// =====================
// 🔗 Associations
// =====================

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

// Revoked Token
User.hasMany(RevokedToken, { foreignKey: 'userId' });
RevokedToken.belongsTo(User, { foreignKey: 'userId' });

// Course & Schedule
Course.hasMany(Schedule, {
  foreignKey: "courseId",
  sourceKey: "courseId",
  as: "Schedule",
});
Schedule.belongsTo(Course, {
  foreignKey: "courseId",
  targetKey: "courseId",
  as: "Course",
});

// =====================
// 🎥 Video Associations
// =====================

// Course & Video
Course.hasMany(Video, {
  foreignKey: "courseId",
  sourceKey: "courseId",
  as: "Videos",
});
Video.belongsTo(Course, {
  foreignKey: "courseId",
  targetKey: "courseId",
  as: "Course",
});
// User & Notification
User.hasMany(Notification, {
  foreignKey: "userId",
  sourceKey: "userId",
  as: "Notifications",
});
Notification.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "userId",
  as: "New_User",
});

// =====================
// 📦 Export all models
// =====================
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
  Schedule,
  Notification,
  Video, // don't forget to export!
};
