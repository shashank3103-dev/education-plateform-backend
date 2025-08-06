const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "edu-platform-assets",
    allowed_formats: ["jpg", "jpeg", "png","gif","pdf","mp4","mov","avi","mkv","webm","mp3","wav"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg",
    "video/mp4", "video/quicktime", "video/x-matroska", "video/webm"
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only images and videos are allowed."),
      false
    );
  }
};
const upload = multer({ storage, fileFilter });
module.exports = upload;
