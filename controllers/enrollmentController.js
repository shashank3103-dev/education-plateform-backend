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

    const course = await Course.findOne({
      where: { courseId: courseId, addedBy: tutorId },
    });
    if (!course) return res.status(403).json({ message: "Not your course" });

    const enrollments = await Enrollment.findAll({
      where: { courseId },
      include: [
        {
          model: User,
          as: "User", // 🔑 must match alias from models/index.js
          attributes: ["userId", "name", "email", "phone", "student", "tutor"],
        },
      ],
    });
    const students = enrollments.map((e) => e.User);

    res.json({
      
      success: true,
      message: `Found ${students.length} students enrolled in ${course.title}`,
      students,
    });
  } catch (err) {
     console.error("Error in getStudentsForTutorCourse:", err);
    res.status(500).json({ message: "Server error", error: err.message  });
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
exports.getTutorBookings = async (req, res) => {
  try {
    const tutorId = req.user.userId;

    // Fetch tutor’s courses + their enrollments + student info
    const courses = await Course.findAll({
      where: { addedBy: tutorId },
      include: [
        {
          model: Enrollment,
          as: "Enrollments",
          include: [
            {
              model: User,
              as: "User",
              attributes: ["userId", "name", "email", "phone"],
            },
          ],
        },
      ],
      // order: [["courseId", "DESC"]], // latest course first
    });

    // Prepare response
    const response = courses.map((course) => ({
      courseId: course.courseId,
      title: course.title,
      category: course.category,
      price: course.price,
      tutor: course.tutor,
      image: course.image,
      created_at: course.created_at,
      enrollments: course.Enrollments.map((e) => ({
        enrollmentId: e.enrollmentId,
        enrolledAt: e.createdAt,
        student: e.User,
      })),
    }));

    res.json({
      success: true,
      message: "Tutor bookings fetched successfully",
      data: response,
    });
  } catch (err) {
    console.error("Error in getTutorBookings:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
