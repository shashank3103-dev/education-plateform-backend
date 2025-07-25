const { Video } = require("../models");

exports.uploadVideo = async (req, res) => {
  try {
    const { title } = req.body;
    const { courseId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No video file provided" });
    }

    const uploadedBy = req.user.userId; // from auth middleware
    // const videoUrl = `/uploads/videos/${req.file.filename}`;
      const baseUrl = `${req.protocol}://${req.get("host")}`;
    const videoUrl = `${baseUrl}/uploads/videos/${req.file.filename}`;


    const video = await Video.create({
      title,
      courseId,
      uploadedBy,
      videoUrl,
    });

    res.status(201).json({ success: true, video });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCourseVideos = async (req, res) => {
  try {
    const { courseId } = req.params;
    const videos = await Video.findAll({ where: { courseId } });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching videos" });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    await Video.destroy({ where: { videoId } });
    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting video" });
  }
};
