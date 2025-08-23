const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const liveController = require("../controllers/liveController");

// Tutor creates session
router.post("/sessions", authMiddleware, liveController.createSession);

// Student joins session
router.post(
  "/sessions/:roomId/join",
  authMiddleware,
  liveController.joinSession
);

// Tutor ends session
router.post("/sessions/:roomId/end", authMiddleware, liveController.endSession);

// ICE servers config
router.get("/webrtc/config", authMiddleware, liveController.getIceConfig);

module.exports = router;
