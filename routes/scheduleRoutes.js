const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
// const authMiddleware = require("../middleware/authMiddleware");
const authenticateToken = require("../middlewares/authMiddleware");

router.post("/schedule", authenticateToken, scheduleController.createSchedule);
router.get("/schedule/:courseId", authenticateToken, scheduleController.getCourseSchedule);
router.get("/",scheduleController.getAllSchedules);
router.put("updateScheduleById/:id", authenticateToken, scheduleController.updateSchedule);
router.delete("/deleteScheduleById/:id", authenticateToken, scheduleController. deleteSchedule);
module.exports = router;