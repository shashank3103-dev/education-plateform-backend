const { Notification, User } = require('../models');
const admin = require("../utils/firebaseAdmin");
// exports.sendNotification = async (req, res) => {
//   try {
//     const { userId, message, type } = req.body;

//     const notification = await Notification.create({
//       userId,
//       message,
//       type,
//     });

//     return res.status(200).json({ success: true, notification });
//   } catch (err) {
//     console.error('Notification error', err);
//     return res.status(500).json({ error: 'Notification send failed' });
//   }
// };
exports.sendNotification = async (req, res) => {
  try {
    const { userId, message, type, title } = req.body;

    const notification = await Notification.create({
      userId,
      message,
      type,
    });

    const user = await User.findByPk(userId);
    if (!user?.fcmToken) {
      return res.status(404).json({ error: 'User has no FCM token' });
    }

    const payload = {
      notification: {
        title: title || '📢 New Alert',
        body: message,
      },
      data: {
        type,
        userId: String(userId),
      },
      token: user.fcmToken,
    };

    await admin.messaging().send(payload);

    return res.status(200).json({ success: true, notification });
  } catch (err) {
    console.error('Notification error', err);
    return res.status(500).json({ error: 'Notification send failed' });
  }
};
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.userId; // Decoded from JWT via middleware

    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error('❌ Fetch error', err);
    return res.status(500).json({ error: 'Could not fetch notifications' });
  }
};
