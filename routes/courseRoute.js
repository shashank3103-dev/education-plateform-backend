const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const courseController = require("../controllers/courseController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/getall", authenticateToken, courseController.getAllCourses);
router.post(
  "/upload",
  authenticateToken,
  // upload.single("courseImage"),
  upload.fields([{ name: "courseImage" }]),
  courseController.uploadCourse
);
router.put("/update/:id", authenticateToken, courseController.updateCourse);
router.delete("/delete/:id", authenticateToken, courseController.deleteCourse);
router.get("/getCourse/:courseId", authenticateToken, courseController.getCourseById);

router.get("/search/title", authenticateToken, courseController.searchByTitle);
router.get("/search/tutor", authenticateToken, courseController.searchByTutor);

// ✅ GET course detail with sections & videos
router.get("/get-course-details/:courseId", authenticateToken, courseController.getCourseDetail);


module.exports = router;
