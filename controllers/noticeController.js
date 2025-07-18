const Notice = require("../models/Notice");

// GET /notices/searchbystatus?status=visible
exports.searchByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    if (!status) {
      return res
        .status(400)
        .json({ error: "Status query parameter is required." });
    }
    const notices = await Notice.findAll({ where: { status } });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};

// GET /notices/byId/:id
exports.getNoticeById = async (req, res) => {
  try {
    // Get by ID
    const { id } = req.params;
    const notice = await Notice.findByPk(id); // Change to:
    // const notice = await Notice.findByPk(id); // (if route param is noticeId, use that)

    if (!notice) {
      return res.status(404).json({ error: "Notice not found." });
    }
    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};

// POST /notices/post
exports.createNotice = async (req, res) => {
  try {
    if(!req.user.is_verified || !req.user.admin) {
      return res.status(403).json({ error: "Forbidden: Only admins can create notices." });
    }
    const { subject, content, issuedDate, expiryDate, addedBy, status } =
      req.body;
    if (!subject || !content || !issuedDate || !expiryDate) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Date validation
    if (isNaN(Date.parse(issuedDate)) || isNaN(Date.parse(expiryDate))) {
      return res
        .status(400)
        .json({ error: "Invalid date format for issuedDate or expiryDate." });
    }

    const notice = await Notice.create({
      subject,
      content,
      issuedDate,
      expiryDate,
      addedBy: req.user.userId,
      status,
    });
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error." });
  }
};

// PUT /notices/:id
exports.updateNotice = async (req, res) => {
  try {
    if(!req.user.is_verified || !req.user.admin) {
      return res.status(403).json({ error: "Forbidden: Only admins can create notices." });
    }
    // Update
    const { id } = req.params;
    const [updated] = await Notice.update(req.body, {
      where: { noticeId: id },
    }); // was id
    if (!updated) {
      return res.status(404).json({ error: "Notice not found." });
    }
    const updatedNotice = await Notice.findByPk(id);
    res.json(updatedNotice);
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};

// DELETE /notices/:id
exports.deleteNotice = async (req, res) => {
  try {
    if(!req.user.is_verified || !req.user.admin) {
      return res.status(403).json({ error: "Forbidden: Only admins can create notices." });
    }
    // Delete
    const { id } = req.params;
    const deleted = await Notice.destroy({ where: { noticeId: id } }); // was id
    if (!deleted) {
      return res.status(404).json({ error: "Notice not found." });
    }
    res.json({ message: "Notice deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};
