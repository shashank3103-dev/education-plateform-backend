const { Schedule } = require("../models");

exports.createSchedule = async (req, res) => {
  const schedule = await Schedule.create(req.body);
  res.json(schedule);
};
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findAll();
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourseSchedule = async (req, res) => {
  const { courseId } = req.params;
  const schedules = await Schedule.findAll({ where: { courseId } });
  res.json(schedules);
};

exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });

    await schedule.update(req.body);
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });

    await schedule.destroy();
    res.json({ message: "Schedule deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};