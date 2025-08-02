exports.authenticate = (req, res, next) => {
  // your auth logic (JWT etc.)
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
};

exports.isTutor = (req, res, next) => {
  if (req.user.role !== "tutor") return res.status(403).json({ message: "Tutor only" });
  next();
};
