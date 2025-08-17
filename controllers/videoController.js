
const fs = require("fs");
const path = require("path");
const { Video, Notification, Course } = require("../models");

const cloudinary = require("cloudinary").v2;
// exports.uploadVideo = async (req, res) => {
//   try {
//     const { title, sectionId } = req.body;
//     const { courseId } = req.params;
//     if (!req.file) {
//       return res.status(400).json({ message: "No video file provided" });
//     }
//     const uploadedBy = req.user.userId;
//     const baseUrl = `${req.protocol}://${req.get("host")}`;
//     const videoUrl = `${baseUrl}/uploads/videos/${req.file.filename}`;
//     ffmpeg.ffprobe(videoUrl, async (err, metadata) => {
//       if (err) {
//         console.error("Error getting video metadata:", err);
//         return res
//           .status(500)
//           .json({ message: "Error reading video metadata" });
//       }
//       const durationInSeconds = metadata.format.duration;
//       const video = await Video.create({
//         title,
//         courseId,
//         uploadedBy,
//         sectionId: sectionId || null,
//         videoUrl,
//         duration: durationInSeconds,
//       });
//       await Notification.create({
//         userId: uploadedBy, // or send to enrolled users too if needed
//         message: `New video "${title}" uploaded to your course.`,
//         type: "video",
//       });
//       res.status(201).json({ success: "video upload successfully", video });
//     });
//   } catch (err) {
//     console.error("Upload failed:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
exports.uploadVideo = async (req, res) => {
  try {
    const { title, sectionId } = req.body;
    const { courseId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No video file provided" });
    }

    const uploadedBy = req.user.userId;
    // const videoUrl = req.file.path; // Cloudinary URL

    // // === OPTIONAL: Get video duration using ffprobe ===
    // let durationInSeconds = null;

    // try {
    //   const tmpFile = tmp.fileSync({ postfix: ".mp4" });
    //   const writer = fs.createWriteStream(tmpFile.name);

    //   const response = await axios.get(videoUrl, { responseType: "stream" });
    //   response.data.pipe(writer);

    //   await new Promise((resolve, reject) => {
    //     writer.on("finish", resolve);
    //     writer.on("error", reject);
    //   });

    //   await new Promise((resolve, reject) => {
    //     ffmpeg.ffprobe(tmpFile.name, (err, metadata) => {
    //       if (err) {
    //         console.error("ffprobe error:", err);
    //         return reject(err);
    //       }
    //       durationInSeconds = metadata.format.duration;
    //       resolve();
    //     });
    //   });

    //   tmpFile.removeCallback(); // clean temp file
    // } catch (ffErr) {
    //   console.warn("⚠️ Could not get duration from video:", ffErr.message);
    // }
  const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
    });
      const videoUrl = uploadRes.secure_url;
    const durationInSeconds = uploadRes.duration || 0;
    // === Save video to DB ===
    const video = await Video.create({
      title,
      courseId,
      sectionId: sectionId || null,
      uploadedBy,
      videoUrl,
      duration: durationInSeconds,
    });
    
    // === Update course stats ===
    const courseVideos = await Video.findAll({ where: { courseId } });
    const lectures = courseVideos.length;
    const totalDuration = courseVideos.reduce((acc, v) => {
      const mins = parseFloat(v.duration) || 0;
      return acc + mins;
    }, 0);

    await Course.update(
      {
        lectures,
        learning_minutes: totalDuration,
      },
      { where: { courseId } }
    );

    // === Create Notification ===
    await Notification.create({
      userId: uploadedBy,
      message: `New video "${title}" uploaded to your course.`,
      type: "video",
    });

    return res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      video,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return res.status(500).json({ message: "Server error" });
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
