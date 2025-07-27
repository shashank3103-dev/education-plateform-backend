require("./models"); // This will set up all associations

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db"); // Destructured import
require("dotenv").config();
const fs = require("fs");
const path = require("path");


const app = express();
const PORT = process.env.PORT || 11000;

// Create uploads directory
const uploadDir = path.join(__dirname, "uploads");
const videoDir = path.join(__dirname, "uploads/videos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}

// Middleware
app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ limit: '4mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/uploads/videos", express.static(path.join(__dirname, "uploads/videos")));



// Test DB connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

// // After sequelize.authenticate()
sequelize
  .sync({ force: false }) // This will add missing columns
  .then(() => console.log("Database synced!"))
  .catch((err) => console.error("Sync error:", err));

// Routes

app.use("/api/user", require("./routes/authRoutes"));
app.use("/api/course", require("./routes/courseRoute"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/order", require("./routes/orderRoutes"));
app.use("/api/notice", require("./routes/noticeRoutes"));
app.use("/api/banner", require("./routes/bannerRoutes"));
app.use("/api/schedule", require("./routes/scheduleRoutes"));
app.use("/api/video", require("./routes/videoRoutes"));

app.get("/", (req, res) => res.send("📡 EduPlatform API is live"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
