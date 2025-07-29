const { Notification } = require('../models');

exports.sendNotification = async (req, res) => {
  try {
    const { userId, message, type } = req.body;

    const notification = await Notification.create({
      userId,
      message,
      type,
    });

    return res.status(200).json({ success: true, notification });
  } catch (err) {
    console.error('Notification error', err);
    return res.status(500).json({ error: 'Notification send failed' });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not fetch notifications' });
  }
};
