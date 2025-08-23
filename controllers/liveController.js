const {
  LiveSession,
  LiveSessionParticipant,
  Enrollment,
  Notification,
  User,
} = require("../models");
const { v4: uuid } = require("uuid");

const createSession = async (req, res) => {
  try {
    if (!req.user.tutor) {
      return res.status(403).json({ error: "Only tutor can create" });
    }
    const { title, startsAt, courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: "courseId is required" });
    }
    const session = await LiveSession.create({
      meetingId: uuid(),
      sessionTitle: title,
      courseId,
      tutorId: req.user.userId,
      status: "live",
      startTime: startsAt || new Date(),
    });
    await LiveSessionParticipant.create({
      sessionId: session.sessionId,
      userId: req.user.userId,
      role: "tutor",
      joinedAt: new Date(),
    });
    const enrolledStudents = await Enrollment.findAll({
      where: { courseId },
      include: [
        {
          model: User,
          as: "User",
        },
      ],
    });
    for (let enrollment of enrolledStudents) {
      await Notification.create({
        userId: enrollment.userId,
        title: "📢 Live Class Started 🎥",
        message: `A new live class "${title}" is now live. Join now!`,
        type: "live",
      });
    }
    res.json({
      roomId: session.meetingId,
      message: "✅ Session created and students notified.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const joinSession = async (req, res) => {
  try {
    const session = await LiveSession.findOne({
      where: { meetingId: req.params.roomId },
    });
    if (!session || session.status === "ended") {
      return res.status(404).json({ error: "Session not live" });
    }
    const [participant, created] = await LiveSessionParticipant.findOrCreate({
      where: { sessionId: session.sessionId, userId: req.user.userId },
      defaults: {
        role: req.user.tutor ? "tutor" : "student",
        joinedAt: new Date(),
      },
    });
    if (created && !req.user.tutor) {
      await Notification.create({
        userId: session.tutorId,
        title: "👩‍🎓 Student Joined",
        message: `${req.user.name} joined your live session "${session.sessionTitle}".`,
        type: "live",
      });
    }
    res.json({
      ok: true,
      message: "🙌 Successfully joined the live session",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const endSession = async (req, res) => {
  try {
    if (!req.user.tutor) {
      return res.status(403).json({ error: "Only tutor can end session" });
    }
    const session = await LiveSession.findOne({
      where: { meetingId: req.params.roomId },
    });
    if (!session) return res.status(404).json({ error: "Session not found" });
    await session.update({ status: "ended", endTime: new Date() });
    await LiveSessionParticipant.update(
      { leftAt: new Date() },
      { where: { sessionId: session.sessionId, leftAt: null } }
    );
    const participants = await LiveSessionParticipant.findAll({
      where: { sessionId: session.sessionId },
    });
    for (let p of participants) {
      await Notification.create({
        userId: p.userId,
        title: "Live Class Ended 🛑",
        message: `The live class "${session.sessionTitle}" has ended.`,
        type: "live",
      });
    }
    return res.json({
      ok: true,
      message: "🛑 Session ended. Notifications sent to participants.",
    });
  } catch (err) {
    console.error("End session error:", err);
    res.status(500).json({ error: err.message });
  }
};

const getIceConfig = (req, res) => {
  const iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
  res.json({ iceServers });
};
module.exports = {
        createSession,
        joinSession,    
        endSession,     
        getIceConfig,
};