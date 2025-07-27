const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");
const authenticate = require("../middlewares/authMiddleware");
const upload = require("../middlewares/videoUpload");

router.post(
  "/upload/:courseId",
  authenticate,
  upload.single("video"),
  videoController.uploadVideo
);

router.get("/course/:courseId", authenticate, videoController.getCourseVideos);
router.delete("/:videoId", authenticate, videoController.deleteVideo);
router.get("/stream/:filename", videoController.streamVideo);
module.exports = router;
