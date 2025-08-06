const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Video-specific Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "edu-platform-videos", // Folder in your Cloudinary account
    resource_type: "video", // Very important for videos!
    allowed_formats: ["mp4", "mov", "avi", "mkv"],
    public_id: (req, file) => `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
  },
});

const fileFilter = (req, file, cb) => {
  const ext = file.originalname.toLowerCase().match(/\.(mp4|mov|avi|mkv)$/);
  if (ext) cb(null, true);
  else cb(new Error("Only video files are allowed!"));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
