const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const {
  signup,
  verifyEmailOtp,
  login,
  resendOtp,
  logout,
  deleteCourse,
  getAllStudents,
  getAllTutors,
  getAllCourses,
  getCoursesbyUserId,
  getAllOrders,
  getOrdersbyUserId,
  getUserById,
  blockById,
  getOrderById,
  updateOrderById,
  getAllStats,
} = require("../controllers/adminController");
router.post("/signup", signup);
router.post("/verifyEmail-otp", verifyEmailOtp);
router.post("/login", login);
router.post("/resend-otp", resendOtp);
router.use(authenticateToken, adminMiddleware);
router.post("/logout", logout);
router.get("/profile", adminMiddleware, (req, res) => {
  res.json({ message: "Profile fetched successfully", user: req.user });
});
router.get("/getStudents", getAllStudents);
router.get("/getTutors", getAllTutors);
router.get("/user/:userId", getUserById);
router.put("/block/:userId", blockById);
router.get("/getOrders", getAllOrders);
router.get("/getOrders/:userId", getOrdersbyUserId);
router.get("/order/:orderId", getOrderById);
router.put("/order/:orderId", updateOrderById);
router.get("/getCourses", getAllCourses);
router.get("/getCourses/:userId", getCoursesbyUserId);
router.delete("/course/:courseId", deleteCourse);
router.get("/stats", getAllStats);
module.exports = router;
