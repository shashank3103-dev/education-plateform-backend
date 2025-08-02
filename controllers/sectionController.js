const { Section } = require("../models");

exports.createSection = async (req, res) => {
  try {
    const { courseId, title, order } = req.body;

    const section = await Section.create({
      courseId,
      title,
      order,
    });

    res.status(201).json({
      success: true,
      message: "Section created successfully!",
      data: section,
    });
  } catch (err) {
    console.error("Error creating section:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
