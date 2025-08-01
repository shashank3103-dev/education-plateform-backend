const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const authenticateToken = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const multer = require("../config/multer");
const upload = require("../config/multer");

// Only admin can use these routes
router.post(
  "/add",
  authenticateToken,
  adminMiddleware,
   upload.single("images"),
  bannerController.addBanner
);

router.put(
  "/update/:bannerId",
  authenticateToken,
  adminMiddleware,
   upload.single("images"),
  bannerController.updateBanner
);

router.delete(
  "/remove/:bannerId",
  authenticateToken,
  adminMiddleware,
  bannerController.removeBanner
);

router.get(
  "/getall",
  authenticateToken,
  bannerController.getAllBanners
);

router.get(
  "/get/:bannerId",
  authenticateToken,
  adminMiddleware,
  bannerController.getBannerById
);

module.exports = router;
