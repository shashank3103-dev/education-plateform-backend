const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const notificationController = require('../controllers/notificationController');

// Send a new notification 📤
router.post('/send', notificationController.sendNotification);

// Get all notifications for a user 📨
router.get('/get-notification',authenticateToken, notificationController.getUserNotifications);

module.exports = router;
