const { Enrollment, Course, User } = require("../models");

// POST /api/enroll/:courseId
exports.enrollInCourse = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.params;

    const already = await Enrollment.findOne({ where: { userId, courseId } });
    if (already) return res.status(400).json({ message: "Already enrolled!" });

    const enrolled = await Enrollment.create({ userId, courseId });

    res.status(201).json({ success: "Course Enroll Successfully.", enrolled });
  } catch (err) {
    console.error("Enrollment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/my-enrollments
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { userId: req.user.userId },
      include: [{ model: Course, as: "Course" }],
    });

    res.status(200).json({ success: true, enrollments });
  } catch (err) {
    console.error("Fetch enrollments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE /api/enroll/:courseId
exports.cancelEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const deleted = await Enrollment.destroy({
      where: { userId: req.user.userId, courseId },
    });

    if (!deleted)
      return res.status(404).json({ message: "Enrollment not found" });

    res.json({ success: true, message: "Enrollment cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/enroll/:courseId/status
exports.checkEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrolled = await Enrollment.findOne({
      where: { userId: req.user.userId, courseId },
    });

    res.json({ success: true, enrolled: !!enrolled });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/tutor/enrollments/:courseId
exports.getStudentsForTutorCourse = async (req, res) => {
  try {
    const tutorId = req.user.userId;
    const { courseId } = req.params;

    const course = await Course.findOne({ where: { id: courseId, addedBy: tutorId } });
    if (!course) return res.status(403).json({ message: "Not your course" });

    const enrollments = await Enrollment.findAll({
      where: { courseId },
      include: [{ model: User, as: "user" }],
    });

    res.json({ success: true, students: enrollments.map((e) => e.user) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/enrollments
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      include: [
        { model: User, as: "user" },
        { model: Course, as: "course" },
      ],
    });

    res.json({ success: true, enrollments });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
