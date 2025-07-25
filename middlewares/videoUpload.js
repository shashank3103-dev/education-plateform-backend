const multer = require("multer");
const path = require("path");
const fs = require("fs");

const dir = "../uploads/videos";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) cb(null, true);
  else cb(new Error("Only video files allowed!"));
};

module.exports = multer({ storage, fileFilter });
