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
const Enrollment = require("./Enrollment");
const Section = require("./Section");
const Payment = require("./Payment");
const LiveSession = require("./LiveSession");
const LiveSessionParticipant = require("./LiveSessionParticipant");

// LiveSession ↔ Participants
LiveSession.hasMany(LiveSessionParticipant, {
  foreignKey: "sessionId",
  as: "Participants",
});
LiveSessionParticipant.belongsTo(LiveSession, {
  foreignKey: "sessionId",
  as: "Session",
});

// User ↔ Participants
User.hasMany(LiveSessionParticipant, {
  foreignKey: "userId",
  as: "LiveSessionParticipants",
});
LiveSessionParticipant.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});
// User (Tutor) ↔ LiveSession
User.hasMany(LiveSession, {
  foreignKey: "tutorId",
  sourceKey: "userId",
  as: "TutorSessions",
});
LiveSession.belongsTo(User, {
  foreignKey: "tutorId",
  targetKey: "userId",
  as: "Tutor",
});

// Course ↔ LiveSession
Course.hasMany(LiveSession, {
  foreignKey: "courseId",
  sourceKey: "courseId",
  as: "LiveSessions",
});
LiveSession.belongsTo(Course, {
  foreignKey: "courseId",
  targetKey: "courseId",
  as: "Course",
});
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
  as: "Courses",
});

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

User.hasMany(Enrollment, {
  foreignKey: "userId",
  sourceKey: "userId",
  as: "Enrollments",
});
Enrollment.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "userId",
  as: "User",
});

Course.hasMany(Enrollment, {
  foreignKey: "courseId",
  sourceKey: "courseId",
  as: "Enrollments",
});
Enrollment.belongsTo(Course, {
  foreignKey: "courseId",
  targetKey: "courseId",
  as: "Course",
});
Course.hasMany(Section, {
  foreignKey: "courseId",
  sourceKey: "courseId",
  as: "Sections",
});
Section.belongsTo(Course, {
  foreignKey: "courseId",
  targetKey: "courseId",
  as: "Course",
});

// Section → Video
Section.hasMany(Video, {
  foreignKey: "sectionId",
  sourceKey: "sectionId",
  as: "Videos",
});
Video.belongsTo(Section, {
  foreignKey: "sectionId",
  targetKey: "sectionId",
  as: "Sections",
});

User.hasMany(Payment, { foreignKey: "userId" });
Payment.belongsTo(User, { foreignKey: "userId" });

Course.hasMany(Payment, { foreignKey: "courseId" });
Payment.belongsTo(Course, { foreignKey: "courseId" });


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
  Video,
  Enrollment,
  Section,
  Payment,
  LiveSession,
   LiveSessionParticipant,
};
