const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const  authenticateToken  = require("../middlewares/authMiddleware");
const adminAuthToken = require("../middlewares/adminMiddleware");
// User routes
router.post("/enroll/:courseId", authenticateToken, enrollmentController.enrollInCourse);
router.get("/my-enrollments", authenticateToken, enrollmentController.getMyEnrollments);
router.delete("/enroll/:courseId", authenticateToken, enrollmentController.cancelEnrollment);
router.get("/enroll/:courseId/status", authenticateToken, enrollmentController.checkEnrollmentStatus);

// Tutor routes
router.get("/tutor/enrollments/:courseId", authenticateToken, enrollmentController.getStudentsForTutorCourse);
router.get("/tutor/enrollments/bookings", authenticateToken, enrollmentController.getTutorBookings);  
// Admin route
router.get("/admin/enrollments", adminAuthToken, enrollmentController.getAllEnrollments);

module.exports = router;
