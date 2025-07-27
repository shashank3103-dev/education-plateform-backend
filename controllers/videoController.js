const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
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
    //  const videoPath = path.join(__dirname, "..", req.file.path);
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const videoUrl = `${baseUrl}/uploads/videos/${req.file.filename}`;

    ffmpeg.ffprobe(videoUrl, async (err, metadata) => {
      if (err) {
        console.error("Error getting video metadata:", err);
        return res
          .status(500)
          .json({ message: "Error reading video metadata" });
      }

      const durationInSeconds = metadata.format.duration;

      const video = await Video.create({
        title,
        courseId,
        uploadedBy,
        videoUrl,
        duration: durationInSeconds,
      });

      res.status(201).json({ success: "video upload successfully", video });
    });
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
exports.streamVideo = async (req, res) => {
  const { filename } = req.params;
  const videoPath = path.join(__dirname, "../uploads/videos", filename);

  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ message: "Video not found" });
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
};
