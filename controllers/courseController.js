const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const {
  User,
  Course,
  Order,
  OrderItem,
  Section,
  Video,
  Enrollment,
} = require("../models");
const getCourseDetail = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;
    const course = await Course.findOne({
      where: { courseId },
      include: [
        {
          model: Section,
          as: "Sections",
          include: [
            {
              model: Video,
              as: "Videos",
              attributes: ["videoId", "title", "videoUrl", "duration"],
            },
          ],
        },
      ],
    });
    const enrollment = await Enrollment.findOne({
      where: { courseId, userId },
    });
    res.status(200).json({
      success: true,
      message: "Course fetched successfully!",
      data: {
        ...course.toJSON(),
        enrolled: !!enrollment,
      },
    });
  } catch (err) {
    console.error("Error fetching course details:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({ where: { is_published: true } });
    return res.status(200).json({ data: courses });
  } catch (err) {
    console.error("getAllCourses error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
const uploadCourse = async (req, res) => {
  try {
    if (!req.user.is_verified || req.user.student) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res
        .status(403)
        .json({ error: "Only verified tutors can upload courses" });
    }
    const {
      title,
      category,
      price,
      description,
      target,
      requirements,
      duration,
      
      is_published,
    } = req.body;
    if (
      !title ||
      !category ||
      !price ||
      !description ||
      !duration
   
    ) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!req.files || !req.files["courseImage"]) {
      return res.status(400).json({ message: "No Image was uploaded." });
    }

  // local upload

  // const profileImage = path.join(
  //     "uploads",
  //     req.files["courseImage"][0].filename
  //   );
  //   const baseUrl = process.env.BASE_URL;
  //   const services_icon = `${baseUrl}${profileImage.replace(/\\/g, "/")}`;
  //   console.log(services_icon);

    const uploadedImage = req.files["courseImage"][0]; // cloudinary upload
    const imageUrl = uploadedImage.path;

    const newCourse = await Course.create({
      title,
      image: imageUrl,
      category,
      price,
      description,
      target,
      duration,
      learning_minutes:0,
      requirements,
      lectures:0,
      is_published: is_published || false,
      tutor: req.user.name,
      addedBy: req.user.userId,
    });
    return res.status(201).json({ message: "Course created", data: newCourse });
  } catch (err) {
    console.error("uploadCourse error:", err);
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
const updateCourse = async (req, res) => {
  try {
    const id = req.params.id;
    // Find the course first
    const course = await Course.findOne({ where: { courseId: id } });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    // Only admin or the tutor who uploaded can update
    if (
      (!req.user.admin || !req.user.is_verified) &&
      course.addedBy !== req.user.userId
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this course" });
    }
    await course.update(req.body);
    return res.status(200).json({ message: "Course updated", data: course });
  } catch (err) {
    console.error("updateCourse error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      where: { courseId: req.params.id, addedBy: req.user.userId },
    });
    if (!course) {
      return res
        .status(404)
        .json({ error: "Course not found or unauthorized" });
    }
    if (course.image) {
      const imgPath = path.join(__dirname, "../uploads", course.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await course.destroy();
    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("deleteCourse error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
const searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) return res.status(400).json({ error: "Title is required" });
    const courses = await Course.findAll({
      where: {
        is_published: true,
        title: { [Op.like]: `%${title}%` },
      },
    });
    return res.status(200).json({ data: courses });
  } catch (err) {
    console.error("searchByTitle error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
const searchByTutor = async (req, res) => {
  try {
    const { tutor } = req.query;
    if (!tutor)
      return res.status(400).json({ error: "Tutor name is required" });
    const courses = await Course.findAll({
      where: {
        is_published: true,
        tutor: { [Op.like]: `%${tutor}%` },
      },
    });
    return res.status(200).json({ data: courses });
  } catch (err) {
    console.error("searchByTutor error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({
      where: { courseId: courseId, is_published: true },
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.status(200).json({ data: course });
  } catch (err) {
    console.error("getCourseById error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
module.exports = {
  getAllCourses,
  uploadCourse,
  updateCourse,
  deleteCourse,
  searchByTitle,
  searchByTutor,
  getCourseById,
  getCourseDetail,
};
// This code defines the course controller for handling course-related operations in an educational platform.
