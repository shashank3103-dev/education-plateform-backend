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
// UPDATE Section
exports.updateSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, order } = req.body;

    const section = await Section.findByPk(sectionId);
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    section.title = title || section.title;
    section.order = order || section.order;
    await section.save();

    res.status(200).json({
      success: true,
      message: "Section updated successfully!",
      data: section,
    });
  } catch (err) {
    console.error("Error updating section:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// DELETE Section
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const section = await Section.findByPk(sectionId);
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    await section.destroy();

    res.status(200).json({
      success: true,
      message: "Section deleted successfully!",
    });
  } catch (err) {
    console.error("Error deleting section:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

