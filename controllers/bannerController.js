const Banner = require("../models/Banner");
const fs = require("fs");
const path = require("path");

// Add banner
exports.addBanner = async (req, res) => {
  try {
    if (!req.user.admin) return res.status(403).json({ error: "Admin only" });
    const { screen } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "One image is required." });
    }

    // local banner upload
    
    // const baseUrl = process.env.BASE_URL;
    // const imagePath = path.join("uploads", req.file.filename);
    // const fullImageUrl = `${baseUrl}${imagePath.replace(/\\/g, "/")}`;

     const fullMediaUrl = req.file.path; // cloudinary upload

    const banner = await Banner.create({
      screen,
      images: fullMediaUrl,
    });
    res.status(201).json({ message: "Banner created", banner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update banner
exports.updateBanner = async (req, res) => {
  try {
    if (!req.user.admin) return res.status(403).json({ error: "Admin only" });

    const { bannerId } = req.params;
    const { screen } = req.body;
    let images = req.files ? req.files.map((f) => f.filename) : [];

    const banner = await Banner.findByPk(bannerId);
    if (!banner) return res.status(404).json({ error: "Banner not found" });

    if (images.length > 5)
      return res.status(400).json({ error: "Max 5 images allowed" });

    // Optionally, delete old images from disk if you want

    banner.screen = screen || banner.screen;
    if (images.length > 0) banner.images = images;
    await banner.save();

    res.status(200).json({ message: "Banner updated", banner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove banner
exports.removeBanner = async (req, res) => {
  try {
    if (!req.user.admin) return res.status(403).json({ error: "Admin only" });

    const { bannerId } = req.params;
    const banner = await Banner.findByPk(bannerId);
    if (!banner) return res.status(404).json({ error: "Banner not found" });

    // Optionally, delete images from disk here

    await banner.destroy();
    res.status(200).json({ message: "Banner removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll();
    res.status(200).json({ banners });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get banner by id
exports.getBannerById = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const banner = await Banner.findByPk(bannerId);
    if (!banner) return res.status(404).json({ error: "Banner not found" });
    res.status(200).json({ banner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
