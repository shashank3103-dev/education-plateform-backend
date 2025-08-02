const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/sectionController");
const authenticateToken = require("../middlewares/authMiddleware");
// POST /api/sections
router.post("/create-section", authenticateToken, sectionController.createSection);

module.exports = router;
