const express = require("express");
const router = express.Router();
// const upload = require("../config/multer");
const upload = require("../utils/cloudinaryImageUpload");
const courseController = require("../controllers/courseController");
const authenticateToken = require("../middlewares/authMiddleware");
router.get("/getall", authenticateToken, courseController.getAllCourses);
router.post(
  "/create-course",
  authenticateToken,
  upload.fields([{ name: "courseImage" }]),
  courseController.uploadCourse
);
router.put("/update/:id", authenticateToken, courseController.updateCourse);
router.delete("/delete/:id", authenticateToken, courseController.deleteCourse);
router.get(
  "/getCourse/:courseId",
  authenticateToken,
  courseController.getCourseById
);
router.get("/search/title", authenticateToken, courseController.searchByTitle);
router.get("/search/tutor", authenticateToken, courseController.searchByTutor);
router.get(
  "/get-course-details/:courseId",
  authenticateToken,
  courseController.getCourseDetail
);
router.get(
  "/tutor/dashboard",
  authenticateToken,
  courseController.getTutorDashboard
);
router.get(
  "/get-course-sessions/:courseId",
  authenticateToken,
  courseController.getCourseSessions
);
module.exports = router;
