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
  // multer.array("images", 5),
  upload.fields([{ name: "images" ,maxCount: 5}]),
  bannerController.addBanner
);

router.put(
  "/update/:bannerId",
  authenticateToken,
  adminMiddleware,
  multer.array("images", 5),
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
  adminMiddleware,
  bannerController.getAllBanners
);

router.get(
  "/get/:bannerId",
  authenticateToken,
  adminMiddleware,
  bannerController.getBannerById
);

module.exports = router;
